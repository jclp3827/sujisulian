#!/usr/bin/env python3
"""Read-only verifier for home and train selected tab states."""
import hashlib
import json
from pathlib import Path
import subprocess
ROOT = Path(__file__).resolve().parents[5]
HERE = Path(__file__).resolve().parent
REF = "refs/codex/checkpoints/main-tab-home-train-selected-v4-candidate-20261026"
PARENT = "ef9ba5e03b8762456eaaf7f9759fba3a38664a3e"
PRODUCT = {"miniprogram/custom-tab-bar/index.wxss", "scripts/build-tab-icons-v2.py"} | {
    f"miniprogram/images/icons/tab-v2/tab-{name}-active.{ext}"
    for name in ("home", "train") for ext in ("svg", "png")
}
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
