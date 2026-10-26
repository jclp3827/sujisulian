#!/usr/bin/env python3
"""Read-only verification for the five-tab SVG checkpoint."""
import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[5]
HERE = Path(__file__).resolve().parent
REF = "refs/codex/checkpoints/main-tab-svg-candidate-20261026"
PARENT = "b9da00ebd7103c9c19d2f5bac1abee9bd80e9aef"
PRODUCT = {
    "miniprogram/app.json",
    "miniprogram/custom-tab-bar/index.js",
    "miniprogram/custom-tab-bar/index.wxml",
    "miniprogram/custom-tab-bar/index.wxss",
    "scripts/build-tab-icons-v2.py",
}
PRODUCT |= {f"miniprogram/images/icons/tab-v2/tab-{name}{state}.{extension}"
            for name in ("home", "note", "train", "common-sense", "politics")
            for state in ("", "-active") for extension in ("svg", "png")}


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True).strip()


commit = git("rev-parse", REF)
assert git("rev-parse", f"{REF}^") == PARENT
changed = set(git("diff-tree", "--no-commit-id", "--name-only", "-r", commit).splitlines())
assert {p for p in changed if p.startswith(("miniprogram/", "scripts/"))} == PRODUCT
manifest = json.loads((HERE / "source-files.json").read_text())
for name, digest in manifest.items():
    assert hashlib.sha256((ROOT / name).read_bytes()).hexdigest() == digest, name
    assert hashlib.sha256(subprocess.check_output(["git", "show", f"{REF}:{name}"], cwd=ROOT)).hexdigest() == digest, name
print(json.dumps({"passed": True, "commit": commit, "parent": PARENT,
                  "productFiles": len(PRODUCT), "hashedFiles": len(manifest)}))
