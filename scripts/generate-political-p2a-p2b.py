#!/usr/bin/env python3
"""Generate P2A/P2B draft markdown files for the politics pilot from resolved text."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Dict, List, Optional, Sequence


PART_RE = re.compile(r"^第一部分")
ARTICLE_RE = re.compile(r"^第[一二三四五六七八九十百]+篇")
CHAPTER_RE = re.compile(r"^第[一二三四五六七八九十百]+章")
SECTION_RE = re.compile(r"^第[一二三四五六七八九十百]+节")
POINT_RE = re.compile(r"^\s*知识点\s+[0-9一二三四五六七八九十百]+\s+")
PAGE_HEADING_RE = re.compile(r"^##\s+PDF 第\s+(\d+)\s+页")
TOC_HINT_RE = re.compile(r"\.\.\.{4,}|…{4,}")


def slugify(value: str, max_length: int = 40) -> str:
    normalized = re.sub(r"\s+", "-", value.strip())
    normalized = re.sub(r"[^\w\u4e00-\u9fff\-]+", "-", normalized)
    normalized = re.sub(r"-{2,}", "-", normalized).strip("-").lower()
    return (normalized or "知识点")[:max_length]


def sha256_text(content: str) -> str:
    return hashlib.sha256(content.encode("utf-8")).hexdigest()


def sha256_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def parse_resolved_pages(path: Path) -> List[dict]:
    pages: List[dict] = []
    current: Optional[dict] = None
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line:
            continue
        match = PAGE_HEADING_RE.match(line)
        if match:
            if current is not None:
                pages.append(current)
            current = {"page": int(match.group(1)), "lines": []}
            continue
        if current is None:
            continue
        current["lines"].append(line)
    if current is not None:
        pages.append(current)
    return pages


def update_context(line: str, context: List[Optional[str]]) -> List[Optional[str]]:
    part, article, chapter, section = context
    if PART_RE.match(line):
        return [line, None, None, None]
    if ARTICLE_RE.match(line):
        return [part, line, None, None]
    if CHAPTER_RE.match(line):
        return [part, article, line, None]
    if SECTION_RE.match(line):
        return [part, article, chapter, line]
    return context


def is_toc_candidate(line: str) -> bool:
    # Directory lines have dots and usually no real content.
    return bool(TOC_HINT_RE.search(line)) and "知识点" in line


def normalize_point_title(line: str) -> str:
    m = re.match(r"^\s*知识点\s*[0-9一二三四五六七八九十百]+\s*(.+)", line)
    if not m:
        return ""
    title = m.group(1).strip()
    title = re.sub(r"\.{2,}|…{2,}", "", title)
    title = re.sub(r"\d+\s*$", "", title).strip()
    return title


def extract_units(pages: Sequence[dict]) -> List["KnowledgeUnit"]:
    units: List[KnowledgeUnit] = []
    context: List[Optional[str]] = [None, None, None, None]
    current_unit: Optional[KnowledgeUnit] = None
    point_seq = 0
    buffer: List[dict] = []

    for page in pages:
        page_num = page["page"]
        for line in page["lines"]:
            context = update_context(line, context)
            part, article, chapter, section = context

            if page_num > 2 and POINT_RE.match(line) and not is_toc_candidate(line):
                title = normalize_point_title(line)
                if not title:
                    continue

                # close previous unit
                if current_unit is not None:
                    current_unit.text = "\n".join(row["text"] for row in buffer if row["text"].strip()).strip()
                    units.append(current_unit)

                point_seq += 1
                source_unit = f"politics-p{page_num:03d}-u{point_seq:03d}"
                category = section or chapter or article or part or "政治理论"
                category_path = [item for item in (part, article, chapter, section) if item]
                current_unit = KnowledgeUnit(
                    seq=point_seq,
                    title=title,
                    category=category,
                    category_path=category_path,
                    source_units=[source_unit],
                    pages=[page_num],
                    text="",
                    source_unit=source_unit,
                    file_path=None,
                    unit_id=f"politics-kp-{point_seq:03d}",
                )
                buffer = [{"page": page_num, "text": line}]
                continue

            if current_unit is not None:
                buffer.append({"page": page_num, "text": line})
                if page_num not in current_unit.pages:
                    current_unit.pages.append(page_num)

    if current_unit is not None:
        current_unit.text = "\n".join(row["text"] for row in buffer if row["text"].strip()).strip()
        units.append(current_unit)

    return [unit for unit in units if unit.text.strip()]


def build_risk_index(manifest_path: Path) -> Dict[int, List[str]]:
    if not manifest_path.exists():
        return {}
    payload = json.loads(manifest_path.read_text(encoding="utf-8"))
    risk_index: Dict[int, List[str]] = {}
    for page in payload.get("pages", []):
        if page.get("risks"):
            risk_index[int(page["page"])] = list(page["risks"])
    return risk_index


def to_front_matter(unit: "KnowledgeUnit", review_at: str, source_hash: str) -> str:
    return "\n".join([
        "---",
        f"id: {unit.unit_id}",
        f"title: {unit.title}",
        "module: politics",
        f"category: {unit.category}",
        "status: draft",
        "version: 1",
        f"aliases: []",
        "tags:",
        "  - 政治",
        "source_units:",
        *(f"  - {item}" for item in unit.source_units),
        "prerequisites: []",
        "contrasts: []",
        "related: []",
        f"reviewed_at: {review_at}",
        f"source_hash: \"{source_hash}\"",
        "---",
        "",
    ])


@dataclass
class KnowledgeUnit:
    seq: int
    title: str
    category: str
    category_path: List[str]
    source_units: List[str]
    pages: List[int]
    text: str
    source_unit: str
    file_path: Optional[Path]
    unit_id: str


def build_markdown(unit: "KnowledgeUnit", review_at: str, source_hash: str) -> str:
    fm = to_front_matter(unit, review_at, source_hash)
    context = " > ".join(unit.category_path) or "政治理论"
    body = f"""# {unit.title}

**路径：** {context}

**来源页码：** {unit.pages[0]}-{unit.pages[-1]}

## 一句话理解

请用一到两句概括该知识点的核心逻辑和边界。

## 完整内容

{unit.text}

## 易混与边界

- 待人工补齐，先进入抽样复核。

## 速记卡

### 提示

- 待人工补齐（抽样审核项）

### 答案

- 待人工补齐（抽样审核项）

### 易错

- 待人工补齐（抽样审核项）
"""
    return fm + body


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--resolved", required=True)
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--report", required=True)
    parser.add_argument("--audit", required=True)
    parser.add_argument("--run-id", default=date.today().strftime("%Y%m%d"))
    parser.add_argument("--overwrite", action="store_true", default=False)
    args = parser.parse_args()

    resolved_path = Path(args.resolved).resolve()
    manifest_path = Path(args.manifest).resolve()
    output_dir = Path(args.output_dir).resolve()
    report_path = Path(args.report).resolve()
    audit_path = Path(args.audit).resolve()

    if args.overwrite:
        output_dir.mkdir(parents=True, exist_ok=True)
        for item in output_dir.glob("*.md"):
            item.unlink()
    output_dir.mkdir(parents=True, exist_ok=True)

    pages = parse_resolved_pages(resolved_path)
    risk_map = build_risk_index(manifest_path)
    units = extract_units(pages)

    manifest_payload = json.loads(manifest_path.read_text(encoding="utf-8"))
    source_pdf = Path(manifest_payload.get("source_pdf", "")).resolve()
    source_hash_full = sha256_file(source_pdf) if source_pdf.exists() else ""
    today = date.today().isoformat()

    records = []
    risk_pages = set()

    for unit in units:
        page_risks: List[str] = []
        for page_no in unit.pages:
            risk_pages.add(page_no)
            for risk in risk_map.get(page_no, []):
                if risk not in page_risks:
                    page_risks.append(risk)
        local_hash = sha256_text(unit.text)
        md = build_markdown(unit, today, local_hash[:12])
        slug = slugify(unit.title)
        fname = f"p2a-p2b-{unit.unit_id}-{slug}.md"
        file_path = output_dir / fname
        file_path.write_text(md, encoding="utf-8")
        unit.file_path = file_path
        records.append({
            "id": unit.unit_id,
            "title": unit.title,
            "category": unit.category,
            "source_unit": unit.source_unit,
            "pages": unit.pages,
            "risks": page_risks,
            "path": " > ".join(unit.category_path),
            "file": str(file_path),
        })

    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_lines = [
        "# 政治模块 P2A/P2B 批量草稿生成结果",
        "",
        f"- 运行批次：{args.run_id}",
        f"- 识别知识点：{len(units)}",
        f"- 页面数量：{len(pages)}",
        f"- 风险页数：{len([p for p in sorted(risk_pages) if p in risk_map])}",
        f"- 输出目录：{output_dir}",
        "",
        "## 风险页清单",
        ", ".join(map(str, sorted([p for p in risk_pages if p in risk_map]))),
        "",
        "## 前 20 条输出样例",
    ]
    for item in records[:20]:
        report_lines.append(f"- {item['id']} | {item['title']} | 页码 {item['pages'][0]}-{item['pages'][-1]}")
    if len(records) > 20:
        report_lines.append("")
        report_lines.append(f"...其余 {len(records)-20} 条见审计文件。")
    report_path.write_text("\n".join(report_lines) + "\n", encoding="utf-8")

    audit_path.parent.mkdir(parents=True, exist_ok=True)
    with audit_path.open("w", encoding="utf-8") as writer:
        json.dump({
            "run_id": args.run_id,
            "generated_at": today,
            "source_pdf": str(source_pdf),
            "source_pdf_hash": source_hash_full,
            "total_units": len(records),
            "output_dir": str(output_dir),
            "pages": len(pages),
            "units": records,
            "risk_summary": {str(page): risk_map.get(page, []) for page in sorted(risk_pages) if risk_map.get(page)},
        }, writer, ensure_ascii=False, indent=2)

    print(json.dumps({
        "status": "ok",
        "units": len(records),
        "report": str(report_path),
        "audit": str(audit_path),
        "output_dir": str(output_dir),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
