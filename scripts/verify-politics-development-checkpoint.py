#!/usr/bin/env python3
"""Read-only verification of the political development checkpoint and local archive."""
import argparse
import hashlib
import json
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
RECORD = ROOT / 'docs/knowledge-platform/checkpoints/politics-development-20261026'

def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT)

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--archive', type=pathlib.Path)
    parser.add_argument('--index', action='store_true', help='verify staged tree before final commit')
    args = parser.parse_args()
    assets = json.loads((RECORD / 'assets.json').read_text())
    manifest = json.loads((RECORD / 'git-files.json').read_text())
    archive = args.archive or pathlib.Path(assets['archiveRoot'])
    errors = []
    if args.index:
        rows = git('ls-files', '-s', '-z').split(b'\0')
        objects = {row.split(b'\t', 1)[1].decode(): row.split()[1].decode() for row in rows if row}
    else:
        rows = git('ls-tree', '-r', '-z', 'HEAD').split(b'\0')
        objects = {row.split(b'\t', 1)[1].decode(): row.split()[2].decode() for row in rows if row}
    expected = {x['path']: x for x in manifest['files']}
    excluded = manifest['selfExcludedPath']
    if set(objects) != set(expected) | {excluded}:
        errors.append('Git path set differs from full-tree manifest')
    for rel, x in expected.items():
        file = ROOT / rel
        if not file.is_file() or sha(file) != x['sha256']:
            errors.append('Working file hash: ' + rel)
        if objects.get(rel) != x['gitBlob']:
            errors.append('Git object mismatch: ' + rel)
    if sha(archive / 'inventory-initial.json') != assets['archiveInitialManifestSha256']:
        errors.append('Original archive manifest mismatch')
    for x in assets['entries']:
        file = archive / 'initial-state' / x['path']
        if not file.is_file() or sha(file) != x['sha256']:
            errors.append('Original archive hash: ' + x['path'])
    for x in assets['ignoredHistoricalLogs']:
        for file in [archive / x['preservedCopy'], ROOT / x['path']]:
            if not file.is_file() or sha(file) != x['sha256']:
                errors.append('Historical log hash: ' + str(file))
    allowed = {x['path'] for x in assets['entries'] if x['disposition'] == 'local-preservation-screenshot'}
    actual = {p.decode() for p in git('ls-files', '--others', '--exclude-standard', '-z').split(b'\0') if p}
    if actual != allowed:
        errors.append('Untracked ownership differs: ' + repr(sorted(actual ^ allowed)))
    for x in assets['entries']:
        if x['path'] in allowed and (not (ROOT / x['path']).is_file() or sha(ROOT / x['path']) != x['sha256']):
            errors.append('Screenshot original changed: ' + x['path'])
    if git('diff', '--name-only'):
        errors.append('Unstaged tracked changes')
    if not args.index and git('diff', '--cached', '--name-only'):
        errors.append('Staged changes remain after commit')
    print(json.dumps({'status': 'failed' if errors else 'passed', 'gitFilesVerified': len(expected),
                      'archiveOriginalFiles': len(assets['entries']), 'historicalLogs': len(assets['ignoredHistoricalLogs']),
                      'remainingUntrackedScreenshots': len(actual), 'errors': errors}, ensure_ascii=False))
    raise SystemExit(bool(errors))

if __name__ == '__main__':
    main()
