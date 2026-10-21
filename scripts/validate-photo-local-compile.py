#!/usr/bin/env python3
"""Use installed WeChat WXML/WXSS compilers offline; never preview or upload.

This is template/style compilation, NOT a WeChat whole-package build or size.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
MINI = ROOT / 'miniprogram'
DEFAULT_BIN = Path('/Applications/wechatwebdevtools.app/Contents/Resources/app.asar.unpacked/node_modules/wcc-exec')


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def style_imports(source, found=None):
    # wcsc expects imported styles in its input map; the IDE normally supplies it.
    found = {} if found is None else found
    for name in re.findall(r'@import\s+[\"\']([^\"\']+)[\"\']', source.read_text()):
        target = ((MINI / name.lstrip('/')) if name.startswith('/') else source.parent / name).resolve()
        target.relative_to(MINI.resolve())
        rel = str(target.relative_to(MINI.resolve()))
        if rel not in found:
            found[rel] = target
            style_imports(target, found)
    return found


def template_imports(source, found=None):
    found = {} if found is None else found
    for name in re.findall(r'<(?:include|import)\s+src=[\"\']([^\"\']+)[\"\']', source.read_text()):
        target = ((MINI / name.lstrip('/')) if name.startswith('/') else source.parent / name).resolve()
        target.relative_to(MINI.resolve())
        rel = str(target.relative_to(MINI.resolve()))
        if rel not in found:
            found[rel] = target
            template_imports(target, found)
    return found


def component_sources(pages):
    result = list(dict.fromkeys(pages))
    for page in result:
        config = MINI / (page + '.json')
        if not config.exists():
            continue
        for name in json.loads(config.read_text()).get('usingComponents', {}).values():
            if name.startswith('plugin://'):
                continue
            target = ((MINI / name.lstrip('/')) if name.startswith('/') else config.parent / name).resolve()
            rel = str(target.relative_to(MINI.resolve()))
            if rel not in result:
                result.append(rel)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--compiler-dir', type=Path, default=DEFAULT_BIN)
    parser.add_argument('--all-pages', action='store_true', help='Read-only compilation of every registered page; never modifies learning modules')
    args = parser.parse_args()
    config = json.loads((MINI / 'app.json').read_text())
    pages = ['pages/photo/index', 'subpackages/photo/process/index']
    if args.all_pages:
        pages = list(config['pages'])
        for group in config.get('subPackages', config.get('subpackages', [])):
            pages += [group['root'].rstrip('/') + '/' + p for p in group['pages']]
        if config.get('tabBar', {}).get('custom'):
            pages.append('custom-tab-bar/index')
    bins = {'wxml': args.compiler_dir / 'wcc', 'wxss': args.compiler_dir / 'wcsc'}
    for p in bins.values():
        if not p.is_file():
            raise SystemExit('Missing installed compiler: ' + str(p))
    result = dict(passed=False, mode='all-registered-pages' if args.all_pages else 'national-photo-pages',
                  wholePackageCompiled=False, compiledPackageBytes=None, networkUsed=False,
                  previewUploaded=False, sourceChanged=False,
                  compilers={k: dict(path=str(v), sha256=sha(v)) for k, v in bins.items()}, files=[])
    with tempfile.TemporaryDirectory(prefix='photo-local-compile-') as temp:
        inputs = [page + '.' + ext for page in component_sources(pages) for ext in bins]
        if args.all_pages:
            inputs.append('app.wxss')
        for rel in inputs:
            extension = rel.rsplit('.', 1)[1]
            compiler = bins[extension]
            source = MINI / rel
            # A declared page is required to have its template/style present.
            if not source.is_file():
                result['files'].append(dict(path=str(source.relative_to(ROOT)), passed=False, reason='missing-source'))
                continue
            before = sha(source)
            output = Path(temp) / ('out-' + str(len(result['files'])))
            imports = style_imports(source) if extension == 'wxss' else template_imports(source)
            import_hashes = {name: sha(p) for name, p in imports.items()}
            run = subprocess.run([str(compiler), rel, *imports, '-o', str(output)], cwd=MINI,
                                 capture_output=True, text=True, timeout=30)
            changed = sha(source) != before
            result['sourceChanged'] |= changed
            result['files'].append(dict(path=str(source.relative_to(ROOT)), sourceSha256=before,
                                         passed=run.returncode == 0 and output.is_file() and not changed,
                                         exitCode=run.returncode, stderr=run.stderr.strip(),
                                         imports=import_hashes,
                                         outputBytes=output.stat().st_size if output.is_file() else None,
                                         outputSha256=sha(output) if output.is_file() else None))
        # Prove syntax errors are not silently reported as successful compilations.
        bad = Path(temp) / 'invalid.wxml'
        bad.write_text('<view wx:if="{{unclosed"><text></view>')
        run = subprocess.run([str(bins['wxml']), str(bad), '-o', str(Path(temp) / 'bad.js')],
                             capture_output=True, text=True, timeout=10)
        result['malformedTemplateRejected'] = run.returncode != 0
    result['passed'] = bool(result['files']) and all(p['passed'] for p in result['files']) and result['malformedTemplateRejected']
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result['passed'] else 1


if __name__ == '__main__':
    raise SystemExit(main())
