#!/usr/bin/env python3
"""Read-only verification of the politics knowledge-map visual checkpoint."""
import hashlib
import json
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[5]
HERE = pathlib.Path(__file__).resolve().parent
REF = "refs/codex/checkpoints/politics-all-knowledge-nav-visual-candidate-20261026"
PARENT = "7efaa8ab1d40c90e08b209d64f59c11183a0b445"
PRODUCT = {"miniprogram/components/knowledge-space-surface/index.wxss"}


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True).strip()


commit = git("rev-parse", REF)
assert git("rev-parse", f"{REF}^") == PARENT
changed = set(git("diff-tree", "--no-commit-id", "--name-only", "-r", commit).splitlines())
assert {p for p in changed if p.startswith("miniprogram/")} == PRODUCT
manifest = json.loads((HERE / "source-files.json").read_text())
for name, digest in manifest.items():
    assert hashlib.sha256((ROOT / name).read_bytes()).hexdigest() == digest, name
    assert hashlib.sha256(subprocess.check_output(["git", "show", f"{REF}:{name}"], cwd=ROOT)).hexdigest() == digest, name
print(json.dumps({"passed": True, "commit": commit, "parent": PARENT, "productFiles": len(PRODUCT), "hashedFiles": len(manifest)}))
