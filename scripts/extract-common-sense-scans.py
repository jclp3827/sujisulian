#!/usr/bin/env python3
"""Run macOS Vision OCR over numbered common-sense scan images."""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
from pathlib import Path


PAGE_RE = re.compile(r"第(\d+)页$")


def build_vision_binary(repo_root: Path, output_dir: Path) -> Path:
    binary = output_dir / "tools" / "vision-ocr"
    source = repo_root / "scripts" / "vision-ocr.swift"
    module_cache = output_dir / "tools" / "module-cache"
    binary.parent.mkdir(parents=True, exist_ok=True)
    module_cache.mkdir(parents=True, exist_ok=True)
    env = os.environ.copy()
    env["CLANG_MODULE_CACHE_PATH"] = str(module_cache)
    env["SWIFT_MODULECACHE_PATH"] = str(module_cache)
    subprocess.run(["swiftc", "-O", str(source), "-o", str(binary)], check=True, env=env)
    return binary


def page_number(path: Path) -> int | None:
    match = PAGE_RE.fullmatch(path.stem)
    return int(match.group(1)) if match else None


def run_ocr(binary: Path, image_path: Path) -> dict:
    result = subprocess.run([str(binary), str(image_path)], check=True, capture_output=True, text=True)
    payload = json.loads(result.stdout)
    rows = payload.get("observations", [])
    rows.sort(key=lambda row: (-round(row["bbox"][1] / 0.004), row["bbox"][0]))
    return {
        "page": page_number(image_path),
        "image": str(image_path),
        "width": payload.get("width"),
        "height": payload.get("height"),
        "averageConfidence": round(sum(row["confidence"] for row in rows) / len(rows), 4) if rows else None,
        "observations": rows,
        "text": "\n".join(row["text"] for row in rows),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("image_dir")
    parser.add_argument("--output-dir", default="/private/tmp/common-sense-scans")
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    image_dir = Path(args.image_dir).resolve()
    output_dir = Path(args.output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    binary = build_vision_binary(repo_root, output_dir)
    images = sorted(
        (path for path in image_dir.glob("第*页.png") if page_number(path) is not None),
        key=page_number,
    )
    pages = [run_ocr(binary, image_path) for image_path in images]

    (output_dir / "manifest.json").write_text(
        json.dumps({"source": str(image_dir), "pageCount": len(pages), "pages": pages}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    (output_dir / "resolved-text.md").write_text(
        "\n\n".join(f"## 第 {page['page']} 页\n\n{page['text']}" for page in pages) + "\n",
        encoding="utf-8",
    )
    print(json.dumps({
        "pages": len(pages),
        "firstPage": pages[0]["page"] if pages else None,
        "lastPage": pages[-1]["page"] if pages else None,
        "averageConfidence": round(sum(page["averageConfidence"] or 0 for page in pages) / len(pages), 4) if pages else None,
        "manifest": str(output_dir / "manifest.json"),
        "resolvedText": str(output_dir / "resolved-text.md"),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
