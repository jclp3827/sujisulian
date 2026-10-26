#!/usr/bin/env python3
"""Read-only verification of the isolated navigation and card checkpoint."""
import hashlib
import json
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[5]
HERE = pathlib.Path(__file__).resolve().parent
REF = "refs/codex/checkpoints/all-knowledge-nav-cards-candidate-20261026"
PARENT = "6f73139618542c13a9d2b5997bd2f9f6e0e3614a"
PRODUCT = {
    "miniprogram/subpackages/note/directory/index.wxml",
    "miniprogram/subpackages/note/directory/index.wxss",
    "miniprogram/subpackages/common-sense/topics/index.wxml",
    "miniprogram/subpackages/common-sense/topics/index.wxss",
}


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True).strip()


commit = git("rev-parse", REF)
assert git("rev-parse", f"{REF}^") == PARENT
changed = set(git("diff-tree", "--no-commit-id", "--name-only", "-r", commit).splitlines())
assert {p for p in changed if p.startswith("miniprogram/")} == PRODUCT
manifest = json.loads((HERE / "source-files.json").read_text())
for name, digest in manifest.items():
    path = ROOT / name
    assert hashlib.sha256(path.read_bytes()).hexdigest() == digest, name
    assert hashlib.sha256(subprocess.check_output(["git", "show", f"{REF}:{name}"], cwd=ROOT)).hexdigest() == digest, name
print(json.dumps({"passed": True, "commit": commit, "parent": PARENT, "productFiles": len(PRODUCT), "hashedFiles": len(manifest)}))
