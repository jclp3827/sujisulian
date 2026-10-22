#!/usr/bin/env python3
"""Compile the five affected templates/styles with installed WeChat compilers.

Offline only. This does not prove device UX, whole-package size, or release.
"""
import hashlib
import json
from pathlib import Path
import re
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
MINI = ROOT / "miniprogram"
BIN = Path("/Applications/wechatwebdevtools.app/Contents/Resources/app.asar.unpacked/node_modules/wcc-exec")
PAGES = ["pages/common-sense/index"] + [
    "subpackages/common-sense/" + name + "/index"
    for name in ["learning", "topics", "detail", "search"]
]

def imports(source, found=None):
    found = {} if found is None else found
    for name in re.findall(r'@import\s+["\']([^"\']+)["\']', source.read_text()):
        target = ((MINI / name.lstrip("/")) if name.startswith("/") else source.parent / name).resolve()
        rel = str(target.relative_to(MINI))
        if rel not in found:
            found[rel] = target
            imports(target, found)
    return found

def main():
    results = []
    with tempfile.TemporaryDirectory(prefix="common-sense-compile-") as temp:
        for page in PAGES:
            for ext, tool in [("wxml", "wcc"), ("wxss", "wcsc")]:
                rel = page + "." + ext
                source = MINI / rel
                output = Path(temp) / str(len(results))
                deps = imports(source) if ext == "wxss" else {}
                run = subprocess.run([str(BIN / tool), rel, *deps, "-o", str(output)],
                                     cwd=MINI, capture_output=True, text=True, timeout=30)
                results.append({"file": rel, "passed": run.returncode == 0 and output.is_file(),
                                "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
                                "diagnostic": run.stderr.strip()})
        broken = Path(temp) / "broken.wxml"
        broken.write_text('<view wx:if="{{unclosed"><text></view>')
        bad = subprocess.run([str(BIN / "wcc"), str(broken), "-o", str(Path(temp) / "bad")],
                             capture_output=True, text=True, timeout=30)
    passed = all(r["passed"] for r in results) and bad.returncode != 0
    print(json.dumps({"passed": passed, "mode": "offline-template-style",
                      "wholePackageBuild": False, "uploaded": False,
                      "malformedTemplateRejected": bad.returncode != 0, "files": results},
                     ensure_ascii=False, indent=2))
    return 0 if passed else 1

if __name__ == "__main__":
    raise SystemExit(main())
