#!/usr/bin/env python3
"""Read-only verifier for the frozen button and themed-icon checkpoint."""

from hashlib import sha256
import json
from pathlib import Path
import subprocess
import xml.etree.ElementTree as ET


DOC = Path(__file__).resolve().parent
ROOT = DOC.parents[4]
REF = 'refs/codex/checkpoints/module-core-button-icons-candidate-20261026'
PARENT = '232dba0bb3b0d1e4d607facf2f0f034d50e7cd86'
DOC_PREFIX = 'docs/knowledge-platform/checkpoints/local-main-integration-20261025/module-core-button-icons-20261026/'
DOC_FILES = {
    'README.md', 'verify.py', 'common-375.png', 'notes-375.png',
    'icon-provenance.json', 'source-files.json', 'product.patch', 'validation.json',
}


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT)


def frozen(commit, path):
    return git('show', f'{commit}:{path}')


def digest(data):
    return sha256(data).hexdigest()


def geometry(data):
    root = ET.fromstring(data)
    return [
        (node.tag, {key: value for key, value in node.attrib.items() if key != 'fill'})
        for node in root.iter()
    ]


commit = git('rev-parse', REF).decode().strip()
assert git('rev-parse', f'{commit}^').decode().strip() == PARENT
manifest = json.loads(frozen(commit, DOC_PREFIX + 'source-files.json'))
provenance = json.loads(frozen(commit, DOC_PREFIX + 'icon-provenance.json'))
expected = set(manifest['product']) | {DOC_PREFIX + name for name in DOC_FILES}
changed = set(git('diff', '--name-only', PARENT, commit).decode().splitlines())
assert changed == expected, {'extra': sorted(changed - expected), 'missing': sorted(expected - changed)}

for path, item in manifest['product'].items():
    assert digest(frozen(commit, path)) == item['after_sha256'], path
    if item['before_sha256'] is not None:
        assert digest(frozen(PARENT, path)) == item['before_sha256'], path

for path, expected_hash in manifest['protected'].items():
    assert digest(frozen(PARENT, path)) == expected_hash, path
    assert digest(frozen(commit, path)) == expected_hash, path

for name, expected_hash in manifest['screenshots'].items():
    path = DOC_PREFIX + name
    assert digest(frozen(commit, path)) == expected_hash, path

for item in provenance:
    prefix = 'miniprogram/images/'
    source = frozen(commit, prefix + item['source'])
    target = frozen(commit, prefix + item['target'])
    assert digest(source) == item['source_sha256']
    assert digest(target) == item['target_sha256']
    derived = source.decode('utf-8')
    for old, new in item['fill_map'].items():
        derived = derived.replace('fill="' + old + '"', 'fill="' + new + '"')
    assert derived.encode('utf-8') == target, item['target']
    assert geometry(source) == geometry(target), item['target']

print(json.dumps({'passed': True, 'commit': commit, 'product_files': len(manifest['product']), 'changed_files': len(changed), 'themed_icons': len(provenance)}, ensure_ascii=False))
