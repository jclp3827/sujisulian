#!/usr/bin/env python3
"""高保真提取常识 PDF 的页面证据、OCR、表格、重点样式和插图清单。"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
from collections import Counter
from pathlib import Path

import pdfplumber
from PIL import Image


CID_RE = re.compile(r"\(cid:\d+\)")
BOLD_RE = re.compile(r"bold|black|heavy|semibold|demi|粗|黑体", re.I)
HEADING_RE = re.compile(r"^(常识判断背诵手册第[一二三四五六七八九十]+节|第[一二三四五六七八九十]+[章节篇]|[一二三四五六七八九十]+、|（[一二三四五六七八九十]+）)")
LABEL_RE = re.compile(r"^(概念|性质(?:与地位)?|补充|注意|区分|条件|分类|职权|任期|领导体制|法律效力|构成要件|处罚原则|本质特征|口诀|易错点)(?:：|:)")


def rounded_bbox(values):
    return [round(float(value), 2) for value in values]


def is_bold_font(font_name):
    return bool(BOLD_RE.search(str(font_name or "")))


def get_emphasis_candidates(text, heading=False):
    candidates = []
    if heading or HEADING_RE.search(text):
        candidates.append(text)
    label = LABEL_RE.search(text)
    if label:
        candidates.append(label.group(1))
    return candidates


def group_chars_into_lines(chars, tolerance=2.4):
    ordered = sorted(chars, key=lambda char: (round(float(char.get("top", 0)) / tolerance), float(char.get("x0", 0))))
    groups = []
    for char in ordered:
        top = float(char.get("top", 0))
        target = next((group for group in reversed(groups[-4:]) if abs(group["top"] - top) <= tolerance), None)
        if target is None:
            target = {"top": top, "chars": []}
            groups.append(target)
        target["chars"].append(char)

    lines = []
    for group in sorted(groups, key=lambda item: item["top"]):
        line_chars = sorted(group["chars"], key=lambda char: float(char.get("x0", 0)))
        if not line_chars:
            continue
        text = "".join(str(char.get("text", "")) for char in line_chars).strip()
        if not text:
            continue
        spans = []
        for char in line_chars:
            font = str(char.get("fontname", ""))
            size = round(float(char.get("size", 0)), 2)
            bold = is_bold_font(font)
            if spans and spans[-1]["font"] == font and spans[-1]["size"] == size and spans[-1]["bold"] == bold:
                spans[-1]["text"] += str(char.get("text", ""))
                spans[-1]["bbox"][2] = round(float(char.get("x1", spans[-1]["bbox"][2])), 2)
                spans[-1]["bbox"][3] = round(max(spans[-1]["bbox"][3], float(char.get("bottom", 0))), 2)
            else:
                spans.append({
                    "text": str(char.get("text", "")),
                    "font": font,
                    "size": size,
                    "bold": bold,
                    "bbox": rounded_bbox([char.get("x0", 0), char.get("top", 0), char.get("x1", 0), char.get("bottom", 0)]),
                })
        x0 = min(float(char.get("x0", 0)) for char in line_chars)
        x1 = max(float(char.get("x1", 0)) for char in line_chars)
        top = min(float(char.get("top", 0)) for char in line_chars)
        bottom = max(float(char.get("bottom", 0)) for char in line_chars)
        heading = bool(HEADING_RE.search(text))
        lines.append({
            "text": text,
            "bbox": rounded_bbox([x0, top, x1, bottom]),
            "heading": heading,
            "bold": any(span["bold"] for span in spans),
            "emphasis_candidates": get_emphasis_candidates(text, heading),
            "spans": spans,
        })
    return lines


def extract_tables(page):
    tables = []
    try:
        found = page.find_tables()
    except Exception as error:
        return [], str(error)
    for index, table in enumerate(found, 1):
        rows = table.extract() or []
        tables.append({
            "index": index,
            "bbox": rounded_bbox(table.bbox),
            "rows": [[cell or "" for cell in row] for row in rows],
            "cell_bboxes": [[rounded_bbox(cell) if cell else None for cell in row.cells] for row in table.rows],
            "row_count": len(rows),
            "column_count": max((len(row) for row in rows), default=0),
        })
    return tables, None


def classify_image(image, page_width, page_height):
    x0, top, x1, bottom = (float(image.get(key, 0)) for key in ("x0", "top", "x1", "bottom"))
    width = max(0, x1 - x0)
    height = max(0, bottom - top)
    area_ratio = width * height / max(1, float(page_width) * float(page_height))
    if area_ratio > 0.75:
        return "page-background"
    if bottom < 90 and (x0 < 180 or x1 > page_width - 40):
        return "header-decoration"
    if top > 80 and bottom < page_height - 40 and area_ratio > 0.015:
        return "content-candidate"
    return "decoration"


def extract_images(page, page_image, output_dir, page_number):
    image_items = []
    rendered = Image.open(page_image)
    scale_x = rendered.width / float(page.width)
    scale_y = rendered.height / float(page.height)
    crop_dir = output_dir / "illustrations"
    for index, image in enumerate(page.images, 1):
        bbox = [image.get("x0", 0), image.get("top", 0), image.get("x1", 0), image.get("bottom", 0)]
        classification = classify_image(image, page.width, page.height)
        item = {
            "index": index,
            "name": str(image.get("name", "")),
            "bbox": rounded_bbox(bbox),
            "source_size": list(image.get("srcsize") or []),
            "classification": classification,
            "crop": "",
        }
        if classification == "content-candidate":
            crop_dir.mkdir(parents=True, exist_ok=True)
            left = max(0, int(float(bbox[0]) * scale_x))
            upper = max(0, int(float(bbox[1]) * scale_y))
            right = min(rendered.width, int(float(bbox[2]) * scale_x))
            lower = min(rendered.height, int(float(bbox[3]) * scale_y))
            crop_path = crop_dir / f"page-{page_number:02d}-image-{index:02d}.png"
            rendered.crop((left, upper, right, lower)).save(crop_path)
            item["crop"] = str(crop_path)
        image_items.append(item)
    rendered.close()
    return image_items


def render_pdf(pdf_path, pages_dir, dpi):
    pages_dir.mkdir(parents=True, exist_ok=True)
    prefix = pages_dir / "page"
    subprocess.run([
        "pdftoppm", "-png", "-r", str(dpi), str(pdf_path), str(prefix)
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    return sorted(pages_dir.glob("page-*.png"))


def build_vision_binary(repo_root, output_dir):
    binary = output_dir / "tools" / "vision-ocr"
    binary.parent.mkdir(parents=True, exist_ok=True)
    module_cache = output_dir / "tools" / "module-cache"
    module_cache.mkdir(parents=True, exist_ok=True)
    source = repo_root / "scripts" / "vision-ocr.swift"
    if not binary.exists() or binary.stat().st_mtime < source.stat().st_mtime:
        env = os.environ.copy()
        env["CLANG_MODULE_CACHE_PATH"] = str(module_cache)
        env["SWIFT_MODULECACHE_PATH"] = str(module_cache)
        subprocess.run(["swiftc", "-O", str(source), "-o", str(binary)], check=True, env=env)
    return binary


def run_vision_ocr(binary, image_path, page_width, page_height):
    result = subprocess.run([str(binary), str(image_path)], check=True, capture_output=True, text=True)
    payload = json.loads(result.stdout)
    observations = []
    for row in payload.get("observations", []):
        x, y, width, height = row["bbox"]
        observations.append({
            "text": row["text"],
            "confidence": round(float(row["confidence"]), 4),
            "bbox": rounded_bbox([
                x * page_width,
                (1 - y - height) * page_height,
                (x + width) * page_width,
                (1 - y) * page_height,
            ]),
            "emphasis_candidates": get_emphasis_candidates(row["text"]),
        })
    observations.sort(key=lambda item: (round(item["bbox"][1] / 3), item["bbox"][0]))
    return observations


def attach_ocr_to_tables(tables, ocr_lines):
    for table in tables:
        ocr_rows = []
        for row in table.get("cell_bboxes", []):
            ocr_row = []
            for cell in row:
                if not cell:
                    ocr_row.append("")
                    continue
                x0, top, x1, bottom = cell
                matched = []
                for line in ocr_lines:
                    lx0, ltop, lx1, lbottom = line["bbox"]
                    center_x = (lx0 + lx1) / 2
                    center_y = (ltop + lbottom) / 2
                    if x0 <= center_x <= x1 and top <= center_y <= bottom:
                        matched.append(line)
                matched.sort(key=lambda item: (item["bbox"][1], item["bbox"][0]))
                ocr_row.append("\n".join(item["text"] for item in matched))
            ocr_rows.append(ocr_row)
        table["ocr_rows"] = ocr_rows
    return tables


def write_markdown_report(path, source_pdf, pages):
    cid_pages = [page["page"] for page in pages if "cid-garbled" in page["risks"]]
    ocr_pages = [page["page"] for page in pages if page["ocr_lines"]]
    table_pages = [page["page"] for page in pages if page["tables"]]
    image_pages = [page["page"] for page in pages if any(item["classification"] == "content-candidate" for item in page["images"])]
    lines = [
        f"# {Path(source_pdf).stem}高保真解析质量报告",
        "",
        f"- 源文件：`{source_pdf}`",
        f"- 总页数：{len(pages)}",
        f"- CID 乱码页：{', '.join(map(str, cid_pages)) or '无'}",
        f"- OCR 回退页：{', '.join(map(str, ocr_pages)) or '无'}",
        f"- 检测到表格的页面：{', '.join(map(str, table_pages)) or '无'}",
        f"- 检测到正文插图候选的页面：{', '.join(map(str, image_pages)) or '无'}",
        "",
        "## 逐页结果",
        "",
        "| 页 | 模式 | 原生字符 | OCR字符 | 表格 | 重点候选 | 正文插图 | 风险 |",
        "| ---: | --- | ---: | ---: | ---: | ---: | ---: | --- |",
    ]
    for page in pages:
        metrics = page["metrics"]
        content_images = sum(item["classification"] == "content-candidate" for item in page["images"])
        lines.append(
            f"| {page['page']} | {page['mode']} | {metrics['native_characters']} | "
            f"{metrics['ocr_characters']} | {len(page['tables'])} | {metrics['emphasis_lines']} | "
            f"{content_images} | {', '.join(page['risks']) or '-'} |"
        )
    lines.extend([
        "",
        "## 说明",
        "",
        "- OCR 仅作为乱码页的回退证据，不直接覆盖原生文本证据。",
        "- 原文填空在知识卡阶段补成完整陈述，不作为独立题型输出。",
        "- 正文插图候选已自动裁剪；页底页眉、二维码、Logo 和整页背景不进入知识卡。",
    ])
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf")
    parser.add_argument("--output-dir", default="tmp/pdfs/common-sense-31-37")
    parser.add_argument("--report", default="docs/common-sense-31-37-quality.md")
    parser.add_argument("--dpi", type=int, default=200)
    parser.add_argument("--ocr", choices=["auto", "all", "none"], default="auto")
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    pdf_path = (repo_root / args.pdf).resolve() if not Path(args.pdf).is_absolute() else Path(args.pdf)
    output_dir = (repo_root / args.output_dir).resolve()
    report_path = (repo_root / args.report).resolve()
    pages_dir = output_dir / "pages"
    if output_dir.exists():
        shutil.rmtree(output_dir)
    output_dir.mkdir(parents=True)

    rendered_pages = render_pdf(pdf_path, pages_dir, args.dpi)
    vision_binary = build_vision_binary(repo_root, output_dir) if args.ocr != "none" else None
    page_results = []
    font_counts = Counter()

    with pdfplumber.open(pdf_path) as pdf:
        if len(rendered_pages) != len(pdf.pages):
            raise RuntimeError(f"rendered {len(rendered_pages)} pages for {len(pdf.pages)} PDF pages")
        for page_number, (page, page_image) in enumerate(zip(pdf.pages, rendered_pages), 1):
            native_text = page.extract_text() or ""
            native_lines = group_chars_into_lines(page.chars)
            for char in page.chars:
                font_counts[str(char.get("fontname", ""))] += 1
            cid_tokens = len(CID_RE.findall(native_text))
            tables, table_error = extract_tables(page)
            images = extract_images(page, page_image, output_dir, page_number)
            should_ocr = args.ocr == "all" or (args.ocr == "auto" and (cid_tokens or len(native_text.strip()) < 80))
            ocr_lines = run_vision_ocr(vision_binary, page_image, page.width, page.height) if should_ocr else []
            if ocr_lines and tables:
                tables = attach_ocr_to_tables(tables, ocr_lines)
            ocr_text = "\n".join(line["text"] for line in ocr_lines)
            average_ocr_confidence = round(sum(line["confidence"] for line in ocr_lines) / len(ocr_lines), 4) if ocr_lines else None
            risks = []
            if cid_tokens:
                risks.append("cid-garbled")
            if table_error:
                risks.append("table-detection-error")
            if tables:
                risks.append("table-layout-review")
            if any(item["classification"] == "content-candidate" for item in images):
                risks.append("illustration-review")
            if should_ocr and not ocr_lines:
                risks.append("ocr-empty")
            if average_ocr_confidence is not None and average_ocr_confidence < 0.75:
                risks.append("ocr-low-confidence")
            mode = "ocr-fallback" if should_ocr else "native-text"
            resolved_text = ocr_text if should_ocr and ocr_text else native_text
            page_results.append({
                "page": page_number,
                "width": round(float(page.width), 2),
                "height": round(float(page.height), 2),
                "mode": mode,
                "risks": risks,
                "native_text": native_text,
                "resolved_text": resolved_text,
                "native_lines": native_lines,
                "ocr_lines": ocr_lines,
                "tables": tables,
                "images": images,
                "metrics": {
                    "native_characters": len(re.sub(r"\s+", "", native_text)),
                    "ocr_characters": len(re.sub(r"\s+", "", ocr_text)),
                    "cid_tokens": cid_tokens,
                    "bold_lines": sum(line["bold"] for line in native_lines),
                    "emphasis_lines": sum(bool(line["emphasis_candidates"]) for line in (ocr_lines or native_lines)),
                    "heading_lines": sum(line["heading"] for line in native_lines),
                    "average_ocr_confidence": average_ocr_confidence,
                },
                "rendered_page": str(page_image),
            })

    manifest = {
        "source_pdf": str(pdf_path),
        "page_count": len(page_results),
        "fonts": [{"font": font, "characters": count, "bold": is_bold_font(font)} for font, count in font_counts.most_common()],
        "pages": page_results,
    }
    (output_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    (output_dir / "resolved-text.md").write_text(
        "\n\n".join(f"## PDF 第 {page['page']} 页\n\n{page['resolved_text']}" for page in page_results) + "\n",
        encoding="utf-8",
    )
    write_markdown_report(report_path, pdf_path, page_results)
    print(json.dumps({
        "pages": len(page_results),
        "ocr_pages": sum(bool(page["ocr_lines"]) for page in page_results),
        "cid_pages": sum("cid-garbled" in page["risks"] for page in page_results),
        "tables": sum(len(page["tables"]) for page in page_results),
        "content_images": sum(sum(item["classification"] == "content-candidate" for item in page["images"]) for page in page_results),
        "manifest": str(output_dir / "manifest.json"),
        "report": str(report_path),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
