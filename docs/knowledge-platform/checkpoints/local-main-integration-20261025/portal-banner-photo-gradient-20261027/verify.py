#!/usr/bin/env python3
"""Read-only verification of the saved checkpoint tree."""
from pathlib import Path
import hashlib
import json
import subprocess
import sys

folder = Path(__file__).resolve().parent
root = folder.parents[4]
ref = "refs/codex/checkpoints/portal-banner-photo-gradient-candidate-20261027"
parent_ref = "refs/codex/checkpoints/note-learning-settings-visual-v2-candidate-20261027"
manifest = json.loads((folder / "source-files.json").read_text())

def git(*args):
    return subprocess.run(["git", *args], cwd=root, capture_output=True, check=True).stdout

errors = []
try:
    commit = git("rev-parse", ref + "^{commit}").decode().strip()
    parent = git("rev-parse", parent_ref + "^{commit}").decode().strip()
    saved_parent = git("rev-parse", commit + "^1").decode().strip()
    if saved_parent != parent:
        errors.append("checkpoint parent")
    for name, expected in manifest.items():
        try:
            actual = hashlib.sha256(git("show", f"{commit}:{name}")).hexdigest()
            if actual != expected:
                errors.append(name)
        except subprocess.CalledProcessError:
            errors.append(name)
except subprocess.CalledProcessError:
    errors.append("checkpoint ref")

print(json.dumps({"passed": not errors, "files": len(manifest), "mismatches": errors}, ensure_ascii=False))
sys.exit(bool(errors))
