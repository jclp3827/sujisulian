#!/usr/bin/env python3
"""Prove the imported R1 display files match their original draft source."""

import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
BASE = 'a59f82a4c775c729a4eb75fd712a1e2b6439a309'  # plans checkpoint before any component product code
SOURCE = '56442332150732b96e442202c33b81efa0375542'
FILES = [
    'miniprogram/styles/ds3-r1-results.wxss',
    'miniprogram/templates/learning-progress.wxml',
    'miniprogram/subpackages/note/practice/index.wxml',
    'miniprogram/subpackages/note/practice/index.wxss',
    'miniprogram/subpackages/common-sense/learning/index.wxml',
    'miniprogram/subpackages/common-sense/learning/index.wxss',
    'miniprogram/subpackages/politics/practice/index.wxml',
    'miniprogram/subpackages/politics/practice/index.wxss',
]


def git(*args):
    return subprocess.check_output(['git', '-C', str(ROOT), *args])


def main():
    assert git('rev-parse', BASE).decode().strip() == BASE
    changed = git('diff', '--name-only', BASE, '--', 'miniprogram', 'cloudfunctions', 'assets-source').decode().splitlines()
    changed += git('ls-files', '--others', '--exclude-standard', '--', 'miniprogram', 'cloudfunctions', 'assets-source').decode().splitlines()
    assert set(changed) == set(FILES), {'changed': changed}
    rows = []
    for name in FILES:
        current = (ROOT / name).read_bytes()
        source = git('show', f'{SOURCE}:{name}')
        assert current == source, name
        rows.append({'path': name, 'sha256': hashlib.sha256(current).hexdigest(),
                     'bytes': len(current), 'sourceCommit': SOURCE})
    registry = json.loads((ROOT / 'docs/design-system/registry.json').read_text())
    for entry_id in ('PAT-CHOICE', 'PAT-PROGRESS'):
        entry = next(x for x in registry['entries'] if x['id'] == entry_id)
        assert entry['status'] == entry['r1Pilot']['status'] == 'draft'
        assert entry['designContractApproval']['status'] == 'approved'
        assert entry['designContractApproval']['implementationStatus'] == 'draft-integrated-candidate'
        for source in entry['sources']:
            assert (ROOT / source['path']).exists()
    print(json.dumps({'ok': True, 'base': git('rev-parse', BASE).decode().strip(),
                      'source': SOURCE, 'productChanges': changed,
                      'cloudAndAssetsChanged': False, 'files': rows}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
