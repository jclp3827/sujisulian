#!/usr/bin/env python3
"""Read-only integrity and scope verifier for the frozen checkpoint."""
from pathlib import Path
import hashlib
import json
import subprocess

base = Path(__file__).resolve().parent
repo = Path(__file__).resolve().parents[5]
manifest_path = base / 'manifest.json'
manifest = json.loads(manifest_path.read_text())
snapshot = manifest['snapshot_ref']

def git(*args):
    return subprocess.check_output(['git', *args], cwd=repo)

def sha(data):
    return hashlib.sha256(data).hexdigest()

assert git('show', snapshot + ':' + manifest_path.relative_to(repo).as_posix()) == manifest_path.read_bytes()
for name, expected in manifest['checkpoint_files'].items():
    assert sha((base / name).read_bytes()) == expected, name
for name, expected in manifest['bound_source_files'].items():
    assert sha(git('show', snapshot + ':' + name)) == expected, name
changed = set(git('diff', '--name-only', '-z', manifest['before_ref'], snapshot).decode().split('\0')) - {''}
assert changed == set(manifest['expected_changed_files']), sorted(changed ^ set(manifest['expected_changed_files']))
git('diff', '--check', manifest['before_ref'], snapshot)
print(json.dumps({'passed': True, 'snapshot': git('rev-parse', snapshot).decode().strip(), 'checkpoint_files': len(manifest['checkpoint_files']), 'bound_source_files': len(manifest['bound_source_files']), 'scope_files': len(changed)}, indent=2))
