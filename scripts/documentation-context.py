#!/usr/bin/env python3
"""Locate task sections and optionally read their original text within a budget."""
import argparse
import json
from pathlib import Path
import runpy


ROOT = Path(__file__).resolve().parents[1]


def reading_items(data: dict, topic: str, complex_behavior: bool = False) -> list[dict]:
    items = [dict(item) for item in data['readingPolicy']['base']]
    authorities = {a['key']: a for a in data['authorities']}
    for key in data['readingRoutes'][topic]:
        authority = dict(authorities[key])
        authority['sections'] = authority.get('sectionsByTopic', {}).get(topic, authority['sections'])
        items.append(authority)
        items.extend(dict(item) for item in data['readingPolicy'].get('dependencies', {}).get(key, []))
    if complex_behavior:
        items.append({'path': data['readingPolicy']['complexBehavior'],
                      'limit': '行为改变前完成提问与确认；协议不是产品批准',
                      'sections': ['$document']})
    merged: dict[str, dict] = {}
    for item in items:
        path = item['path']
        if path not in merged:
            merged[path] = item
            item['sections'] = list(item['sections'])
        else:
            prior = merged[path]
            for section in item['sections']:
                if section not in prior['sections']:
                    prior['sections'].append(section)
            if item['limit'] not in prior['limit']:
                prior['limit'] += '；' + item['limit']
    return list(merged.values())


def merged_ranges(ranges: list[tuple[int, int]]) -> list[tuple[int, int]]:
    result: list[tuple[int, int]] = []
    for start, end in sorted(ranges):
        if result and start <= result[-1][1] + 1:
            result[-1] = (result[-1][0], max(result[-1][1], end))
        else:
            result.append((start, end))
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--topic', help='task domain; use --list for routes')
    parser.add_argument('--list', action='store_true')
    parser.add_argument('--complex-behavior', action='store_true')
    parser.add_argument('--read', action='store_true', help='emit original selected clauses, never silently truncate')
    parser.add_argument('--include-injected', action='store_true', help='reread AGENTS when it was not injected or changed')
    parser.add_argument('--max-characters', type=int, help='explicitly expand the reading budget when dependencies require it')
    args = parser.parse_args()
    try:
        data = json.loads((ROOT / 'docs/knowledge-platform/document-registry.json').read_text())
        checker = runpy.run_path(str(ROOT / 'scripts/check-documentation-consistency.py'))
        actual = {checker['relative'](p) for p in checker['first_party_markdown']()}
        errors = checker['validate'](data)['errors']
        if errors:
            for error in errors:
                print(f'ERROR {error}')
            return 1
        routes = data['readingRoutes']
        if args.list:
            print('Available topics: ' + ', '.join(routes))
            return 0
        if args.topic not in routes:
            parser.error('Choose --topic from: ' + ', '.join(routes))
        budget = args.max_characters if args.max_characters is not None else data['readingPolicy']['maxReadCharacters']
        if budget <= 0:
            parser.error('--max-characters must be positive')
        records = {r['path']: r for r in data['documents']}
        prepared = []
        for item in reading_items(data, args.topic, args.complex_behavior):
            text = (ROOT / item['path']).read_text(encoding='utf-8')
            lines = text.splitlines()
            sections = checker['document_sections'](text)
            sections['$document'] = (1, len(lines))
            ranges = merged_ranges([sections[s] for s in item['sections']])
            body = '\n\n'.join('\n'.join(lines[start - 1:end]) for start, end in ranges)
            skipped = item.get('injected', False) and not args.include_injected
            prepared.append((item, ranges, body, skipped))
        count = sum(len(body) for _, _, body, skipped in prepared if not skipped)
        if args.read and count > budget:
            print(f'ERROR Complete selected clauses require {count} characters; budget is {budget}. '
                  'Use the location list to narrow the task or explicitly expand --max-characters; no clauses were truncated.')
            return 1
        print('最小阅读清单：导航不是实施授权；范围声明和依赖随条款读取。')
        for item, ranges, body, skipped in prepared:
            record = records[item['path']]
            locations = ', '.join(f'{start}-{end}' for start, end in ranges)
            state = ' [已注入，默认不重复读取]' if skipped else ''
            print(f"- {item['path']}:{locations} ({record['role']}/{record['lifecycle']}){state}")
            print('  ' + item['limit'])
            if args.read and not skipped:
                print(body)
        print(f'本次原文读取量：{count} 字符；不包含默认跳过的 AGENTS。')
        print(data['readingPolicy']['expansion'])
        return 0
    except (OSError, ValueError, KeyError, TypeError, AttributeError) as error:
        print(f'ERROR Cannot produce reading route: {error}')
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
