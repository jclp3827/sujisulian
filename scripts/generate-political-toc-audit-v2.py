#!/usr/bin/env python3
"""Build a directory-first politics audit batch without overwriting the first pass."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from dataclasses import dataclass, field
from datetime import date
from pathlib import Path
from typing import Dict, List, Optional


PAGE_RE = re.compile(r"^## PDF 第 (\d+) 页$")
ARTICLE_RE = re.compile(r"^第[一二三四五六七八九十百]+篇")
CHAPTER_RE = re.compile(r"^第[一二三四五六七八九十百]+章")
SECTION_RE = re.compile(r"^第[一二三四五六七八九十百]+节")
POINT_RE = re.compile(r"^知识点\s*(\d+)\s*(.+)$")
LEADER_RE = re.compile(r"^(.*?)(?:\.{2,}|…{2,})(\d+)$")
AD_RE = re.compile(r"^(抖音关注公考.*时政要点即时学|Hey，上岸吧!!|@公考小黑老师)$")


def compact(value: str) -> str:
    return re.sub(r"[\s\u3000]+", "", value).replace("·", "")


def slugify(value: str, limit: int = 46) -> str:
    value = re.sub(r"\s+", "-", value.strip())
    value = re.sub(r"[^\w\u4e00-\u9fff-]+", "-", value)
    return re.sub(r"-{2,}", "-", value).strip("-")[:limit] or "unit"


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def portable_path(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(Path.cwd().resolve()))
    except ValueError:
        return str(path)


def parse_pages(path: Path) -> List[dict]:
    pages: List[dict] = []
    current: Optional[dict] = None
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        match = PAGE_RE.match(line)
        if match:
            if current:
                pages.append(current)
            current = {"page": int(match.group(1)), "lines": []}
        elif current is not None and line:
            current["lines"].append(line)
    if current:
        pages.append(current)
    return pages


@dataclass
class TocNode:
    id: str
    node_type: str
    label: str
    title: str
    ordinal: str
    printed_page: Optional[int]
    pdf_page: Optional[int]
    parent_id: Optional[str]
    order: int
    depth: int
    path_ids: List[str] = field(default_factory=list)
    path_titles: List[str] = field(default_factory=list)
    body_position: Optional[int] = None
    body_page: Optional[int] = None


def split_toc_page(line: str) -> tuple[str, Optional[int]]:
    match = LEADER_RE.match(line)
    if match:
        return match.group(1).strip(), int(match.group(2))
    if line.startswith("知识点"):
        match = re.match(r"^(知识点\s*\d+\s+.*?)(\d+)$", line)
        if match:
            return match.group(1).strip(), int(match.group(2))
    return line.strip(), None


def parse_toc(pages: List[dict]) -> List[TocNode]:
    nodes: List[TocNode] = []
    current: Dict[str, Optional[TocNode]] = {
        "part": None,
        "article": None,
        "chapter": None,
        "section": None,
    }

    for page in pages[:2]:
        for raw in page["lines"]:
            line = re.sub(r"\s+", " ", raw).strip()
            if line.startswith("第二部分"):
                return nodes
            if line in {"目 录 C O N T E N T S", "Contents"}:
                continue
            label, printed_page = split_toc_page(line)
            node_type = ""
            ordinal = ""
            title = label
            parent: Optional[TocNode] = None

            if label.startswith("第一部分"):
                node_type = "part"
                title = label
                current = {"part": None, "article": None, "chapter": None, "section": None}
            elif ARTICLE_RE.match(label):
                node_type = "article"
                parent = current["part"]
                current["chapter"] = None
                current["section"] = None
            elif CHAPTER_RE.match(label):
                node_type = "chapter"
                parent = current["article"]
                current["section"] = None
            elif SECTION_RE.match(label):
                node_type = "section"
                parent = current["chapter"]
            else:
                point = POINT_RE.match(label)
                if point:
                    node_type = "knowledge_point"
                    ordinal = point.group(1)
                    title = point.group(2).strip()
                    parent = current["section"] or current["chapter"] or current["article"]
            if not node_type:
                continue

            order = len(nodes) + 1
            node_id = f"politics-toc-v2-n{order:03d}"
            path_ids = [*(parent.path_ids if parent else []), node_id]
            path_titles = [*(parent.path_titles if parent else []), title]
            node = TocNode(
                id=node_id,
                node_type=node_type,
                label=label,
                title=title,
                ordinal=ordinal,
                printed_page=printed_page,
                pdf_page=printed_page + 2 if printed_page is not None else (3 if node_type == "part" else None),
                parent_id=parent.id if parent else None,
                order=order,
                depth=len(path_ids) - 1,
                path_ids=path_ids,
                path_titles=path_titles,
            )
            nodes.append(node)
            current[node_type if node_type != "knowledge_point" else "section"] = (
                node if node_type != "knowledge_point" else current["section"]
            )
            if node_type == "part":
                current["part"] = node
            elif node_type == "article":
                current["article"] = node
            elif node_type == "chapter":
                current["chapter"] = node
            elif node_type == "section":
                current["section"] = node

    return nodes


def heading_signature(node: TocNode) -> str:
    if node.node_type == "part":
        return compact(node.label).split("政治理论", 1)[0]
    if node.node_type == "knowledge_point":
        return compact(f"知识点{node.ordinal}{node.title}")[:24]
    return compact(node.label)[:28]


def locate_nodes(nodes: List[TocNode], pages: List[dict]) -> List[dict]:
    lines = []
    for page in pages:
        if page["page"] <= 2:
            continue
        for line in page["lines"]:
            if AD_RE.match(line):
                continue
            lines.append({"page": page["page"], "text": line, "compact": compact(line)})

    used = set()
    for node in nodes:
        signature = heading_signature(node)
        expected = node.pdf_page or 3
        candidates = [
            (index, row)
            for index, row in enumerate(lines)
            if index not in used
            and expected <= row["page"] <= expected + 1
            and row["compact"].startswith(signature)
        ]
        if not candidates:
            continue
        index, row = candidates[0]
        node.body_position = index
        node.body_page = row["page"]
        used.add(index)
    return lines


def build_risk_map(manifest: dict) -> Dict[int, List[str]]:
    return {
        int(page["page"]): list(page.get("risks") or [])
        for page in manifest.get("pages", [])
        if page.get("risks")
    }


def render_yaml_list(key: str, values: List[object]) -> List[str]:
    if not values:
        return [f"{key}: []"]
    return [f"{key}:", *(f"  - {json.dumps(str(value), ensure_ascii=False)}" for value in values)]


def write_units(
    nodes: List[TocNode],
    lines: List[dict],
    risk_map: Dict[int, List[str]],
    output_dir: Path,
    run_id: str,
) -> List[dict]:
    leaves = [node for node in nodes if node.node_type in {"section", "knowledge_point"}]
    positioned = sorted([node for node in nodes if node.body_position is not None], key=lambda node: node.body_position)
    output_dir.mkdir(parents=True, exist_ok=True)
    records = []

    for sequence, node in enumerate(leaves, 1):
        if node.body_position is None:
            raise RuntimeError(f"目录节点未在正文找到：{node.label}")
        following = [
            candidate for candidate in positioned
            if candidate.body_position > node.body_position and candidate.depth <= node.depth
        ]
        end = following[0].body_position if following else len(lines)
        selected = lines[node.body_position:end]
        content = "\n".join(row["text"] for row in selected).strip()
        pages = sorted({row["page"] for row in selected})
        risk_pages = [page for page in pages if page in risk_map]
        risk_flags = sorted({risk for page in risk_pages for risk in risk_map[page]})
        unit_id = f"politics-toc-v2-u{sequence:03d}"
        source_unit = f"politics-v2-p{pages[0]:03d}-u{sequence:03d}"
        source_hash = sha256_text(content)[:12]
        file_name = f"toc-v2-{unit_id}-{slugify(node.title)}.md"
        target = output_dir / file_name
        frontmatter = [
            "---",
            f"id: {unit_id}",
            f"toc_node_id: {node.id}",
            f"title: {node.title}",
            "module: politics",
            f"node_type: {node.node_type}",
            f"parent_id: {node.parent_id}",
            f"toc_order: {sequence}",
            "status: draft",
            "audit_state: pending_content_review",
            "version: 1",
            *render_yaml_list("hierarchy_ids", node.path_ids),
            *render_yaml_list("hierarchy_titles", node.path_titles),
            *render_yaml_list("source_units", [source_unit]),
            *render_yaml_list("source_pages", pages),
            *render_yaml_list("risk_pages", risk_pages),
            *render_yaml_list("risk_flags", risk_flags),
            f"source_hash: \"{source_hash}\"",
            f"audit_run: {run_id}",
            "---",
        ]
        body = [
            *frontmatter,
            "",
            f"# {node.title}",
            "",
            f"**目录路径：** {' > '.join(node.path_titles)}",
            "",
            f"**目录页码：** 资料页 {node.printed_page} / PDF 第 {node.pdf_page} 页",
            "",
            f"**正文页码：** PDF 第 {pages[0]}-{pages[-1]} 页",
            "",
            "## 第二轮识别正文",
            "",
            content,
            "",
            "## 审计状态",
            "",
            "- 目录边界：已按 PDF 目录节点重新切分。",
            "- 内容校对：待逐页核对正文、表格、插图和固定表述。",
            f"- 风险页：{', '.join(map(str, risk_pages)) if risk_pages else '无自动风险标记'}。",
            "- 发布状态：隔离草稿，不进入知识构建器和小程序运行包。",
            "",
        ]
        target.write_text("\n".join(body), encoding="utf-8")
        records.append({
            "id": unit_id,
            "toc_node_id": node.id,
            "title": node.title,
            "node_type": node.node_type,
            "parent_id": node.parent_id,
            "toc_order": sequence,
            "hierarchy_ids": node.path_ids,
            "hierarchy_titles": node.path_titles,
            "printed_page": node.printed_page,
            "expected_pdf_page": node.pdf_page,
            "body_start_page": node.body_page,
            "pages": pages,
            "risk_pages": risk_pages,
            "risk_flags": risk_flags,
            "source_unit": source_unit,
            "source_hash": source_hash,
            "file": portable_path(target),
        })
    return records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--resolved", required=True)
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--structure", required=True)
    parser.add_argument("--audit", required=True)
    parser.add_argument("--report", required=True)
    parser.add_argument("--old-audit", required=True)
    parser.add_argument("--migration", required=True)
    parser.add_argument("--run-id", default="20260827-toc-v2")
    args = parser.parse_args()

    resolved = Path(args.resolved).resolve()
    manifest_path = Path(args.manifest).resolve()
    output_dir = Path(args.output_dir).resolve()
    structure_path = Path(args.structure).resolve()
    audit_path = Path(args.audit).resolve()
    report_path = Path(args.report).resolve()
    old_audit_path = Path(args.old_audit).resolve()
    migration_path = Path(args.migration).resolve()

    pages = parse_pages(resolved)
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    nodes = parse_toc(pages)
    lines = locate_nodes(nodes, pages)
    missing = [node.label for node in nodes if node.body_position is None]
    if missing:
        raise RuntimeError(f"{len(missing)} 个目录节点未匹配正文：{missing}")

    risk_map = build_risk_map(manifest)
    records = write_units(nodes, lines, risk_map, output_dir, args.run_id)
    source_pdf = Path(manifest["source_pdf"])
    source_hash = hashlib.sha256(source_pdf.read_bytes()).hexdigest()
    node_payload = [
        {
            "id": node.id,
            "type": node.node_type,
            "label": node.label,
            "title": node.title,
            "ordinal": node.ordinal,
            "printed_page": node.printed_page,
            "expected_pdf_page": node.pdf_page,
            "body_page": node.body_page,
            "parent_id": node.parent_id,
            "order": node.order,
            "depth": node.depth,
            "path_ids": node.path_ids,
            "path_titles": node.path_titles,
        }
        for node in nodes
    ]
    structure = {
        "run_id": args.run_id,
        "generated_at": date.today().isoformat(),
        "source_pdf": "政治理论/政治理论.pdf",
        "source_pdf_hash": source_hash,
        "toc_pages": [1, 2],
        "scope": "第一部分 政治理论",
        "node_count": len(nodes),
        "leaf_count": len(records),
        "nodes": node_payload,
    }
    structure_path.parent.mkdir(parents=True, exist_ok=True)
    structure_path.write_text(json.dumps(structure, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    audit = {
        "run_id": args.run_id,
        "generated_at": date.today().isoformat(),
        "source_pdf": "政治理论/政治理论.pdf",
        "source_pdf_hash": source_hash,
        "page_count": len(pages),
        "toc_node_count": len(nodes),
        "content_unit_count": len(records),
        "old_batch_unit_count": 25,
        "output_dir": portable_path(output_dir),
        "risk_summary": {str(page): risks for page, risks in sorted(risk_map.items())},
        "units": records,
        "publication_gate": "blocked-until-v2-content-review",
    }
    audit_path.parent.mkdir(parents=True, exist_ok=True)
    audit_path.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    old_audit = json.loads(old_audit_path.read_text(encoding="utf-8"))
    new_by_title = {item["title"]: item for item in records}
    section_three = next(item for item in records if item["title"].startswith("第三节 "))
    chapter_two_sections = [item for item in records if item["node_type"] == "section"]
    migration_records = []
    for old in old_audit["units"]:
        old_number = int(old["id"].rsplit("-", 1)[1])
        if old_number == 4:
            targets = [records[index - 1]["id"] for index in (4, 5, 6)]
            disposition = "split-and-reassign"
            reason = "原单元尾部错误包含第二章第一节、第二节。"
        elif old_number in (5, 6):
            targets = [section_three["id"]]
            disposition = "merge-into-toc-section"
            reason = "原单元是第三节内部子主题，第二轮先归入目录节节点并保留为正文子结构。"
        elif old_number == 7:
            targets = [item["id"] for item in chapter_two_sections[2:]]
            disposition = "split-and-reassign"
            reason = "原单元从第三节延伸到第十五节，必须按十三个目录节重新切分。"
        else:
            matched = new_by_title.get(old["title"])
            if not matched:
                matched = next(
                    (
                        item for item in records
                        if compact(item["title"]).startswith(compact(old["title"]))
                        or compact(old["title"]).startswith(compact(item["title"]))
                    ),
                    None,
                )
            if not matched:
                raise RuntimeError(f"旧单元无法建立迁移映射：{old['id']} {old['title']}")
            targets = [matched["id"]]
            disposition = "one-to-one"
            reason = "标题和正文边界与目录节点一致；后续可保留稳定知识 ID。"
        migration_records.append({
            "old_id": old["id"],
            "old_title": old["title"],
            "old_pages": old["pages"],
            "disposition": disposition,
            "target_ids": targets,
            "reason": reason,
        })
    migration = {
        "run_id": args.run_id,
        "generated_at": date.today().isoformat(),
        "old_audit": portable_path(old_audit_path),
        "new_audit": portable_path(audit_path),
        "old_unit_count": len(old_audit["units"]),
        "new_unit_count": len(records),
        "records": migration_records,
    }
    migration_path.parent.mkdir(parents=True, exist_ok=True)
    migration_path.write_text(json.dumps(migration, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    report = [
        "# 政治理论目录优先第二轮审计",
        "",
        f"> 批次：`{args.run_id}`；状态：目录结构审计完成，正文逐页校对待执行",
        "",
        "## 结果",
        "",
        f"- PDF 页面：{len(pages)}。",
        f"- 目录节点：{len(nodes)}。",
        f"- 主要内容单元：{len(records)}（第一轮为 25）。",
        "- 目录与正文标题匹配：100%。",
        f"- 命中风险页的内容单元：{sum(bool(item['risk_pages']) for item in records)}。",
        "- 新批次与旧批次完全隔离，未覆盖 `01-raw`、`knowledge/politics` 或小程序数据。",
        "",
        "## 已确认的第一轮结构错误",
        "",
        "- 第一轮只以“知识点”开新单元，目录中的“节”未成为切分边界。",
        "- 原 `politics-kp-004` 混入第二章第一节、第二节。",
        "- 原 `politics-kp-007` 混入第二章第四节至第十五节。",
        "- 第一轮只有 3 个扁平分类，无法表达 PDF 的部分、篇、章、节、知识点层级。",
        "",
        "## 第二轮结构基线",
        "",
        "- 第一篇第一章：4 个知识点。",
        "- 第一篇第二章：15 个节，其中第三节保留内部 3 个知识点作为正文子结构。",
        "- 第二篇：18 个知识点。",
        "- 合计：37 个主要内容单元。",
        "",
        "## 下一门禁",
        "",
        "1. 逐单元对照页面图，复核标题边界、页间续接和训练题归属。",
        "2. 对表格、插图和固定政治表述执行风险校对。",
        "3. 建立旧 ID 到第二轮单元的迁移表；审核通过前不替换现有知识层。",
        "4. 第二轮 Markdown 审核通过后，再升级构建器的树形目录协议和知识地图。",
        "",
    ]
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text("\n".join(report), encoding="utf-8")
    print(json.dumps({
        "status": "ok",
        "toc_nodes": len(nodes),
        "content_units": len(records),
        "structure": str(structure_path),
        "audit": str(audit_path),
        "migration": str(migration_path),
        "report": str(report_path),
        "output_dir": str(output_dir),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
