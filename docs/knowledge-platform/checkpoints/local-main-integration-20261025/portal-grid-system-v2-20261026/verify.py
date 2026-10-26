#!/usr/bin/env python3
"""Read-only verifier for the portal grid system checkpoint."""
import hashlib
import json
from pathlib import Path
import subprocess
ROOT = Path(__file__).resolve().parents[5]
HERE = Path(__file__).resolve().parent
REF = "refs/codex/checkpoints/portal-grid-system-v2-candidate-20261026"
PARENT = "59861dc763d44b221321077437f4f9a6f330f534"
PRODUCT = {"miniprogram/pages/portal/index.js", "miniprogram/pages/portal/index.wxml", "miniprogram/pages/portal/index.wxss"}
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
