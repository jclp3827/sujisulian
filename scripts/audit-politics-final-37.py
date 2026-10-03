#!/usr/bin/env python3
"""Reproduce source/body and PDF Vision OCR evidence for the current 37-unit politics review package."""
import difflib, glob, hashlib, json, pathlib, re, sys
ROOT=pathlib.Path.cwd()
MAPPING=ROOT/'docs/knowledge-pilot/political-toc-audit-20260827-v2.json'
OCR=ROOT/'docs/knowledge-pilot/political-vision-ocr-evidence-20261004.json'
OUT=ROOT/'docs/knowledge-pilot/political-final-review-evidence-20261004.json'
PDF=ROOT/'政治理论/政治理论.pdf'

def normalized(text):
    return ''.join(re.findall(r'[\u4e00-\u9fffA-Za-z0-9]+', text))

def ratio(source, target):
    if not source:return 0.0
    return sum(match.size for match in difflib.SequenceMatcher(None, source, target, autojunk=False).get_matching_blocks())/len(source)

def source_body(source):
    body=source.split('## 第二轮识别正文\n',1)[1].split('\n## 审计状态',1)[0]
    parts=re.split(r'(【考点精析】|【小黑母题特训】|【考场传真】)',body)
    return ''.join(parts[i+1] for i in range(1,len(parts)-1,2) if parts[i]=='【考点精析】')

def formal_body(note):
    body=note.split('## 完整内容\n',1)[1].split('\n## 易混与边界',1)[0]
    return re.sub(r'\[![^\]]+\]','',re.sub(r'<!--.*?-->','',body))

mapping=json.loads(MAPPING.read_text());manifest=json.loads(OCR.read_text())
assert len(mapping['units'])==37 and len(manifest['pages'])==72
assert manifest['pdf_sha256']==mapping['source_pdf_hash']
assert hashlib.sha256(PDF.read_bytes()).hexdigest()==mapping['source_pdf_hash']
page_ocr={}
for page in manifest['pages']:
    if page['page']<4:continue
    native=normalized(page['native_text']);ocr=normalized(''.join(line['text'] for line in page['ocr_lines']))
    cov=ratio(native,ocr)
    assert cov>=0.96,(page['page'],cov)
    page_ocr[page['page']]=round(cov,6)
records=[]
for unit in mapping['units']:
    uid=unit['id']
    source_path=ROOT/unit['file'];src=source_path.read_text()
    notes=glob.glob(str(ROOT/f'docs/knowledge-pilot/knowledge/politics-v2/*{uid[-4:]}-*.md'))
    assert len(notes)==1,uid
    note_path=pathlib.Path(notes[0]);note=note_path.read_text()
    assert f'id: {uid}' in note and 'status: review\n' in note
    assert '## 一句话理解\n' in note and '## 速记卡\n' in note and '### 答案\n' in note and '### 易错\n' in note
    source_norm=normalized(source_body(src));formal_norm=normalized(formal_body(note))
    coverage=ratio(source_norm,formal_norm)
    expected={'politics-toc-v2-u006':'official_common_prosperity_wording',
              'politics-toc-v2-u007':'gray_box_heading_folded_into_body',
              'politics-toc-v2-u011':'official_carbon_target_qualifiers'}.get(uid)
    if expected:assert coverage>=0.97,(uid,coverage)
    else:assert coverage==1.0,(uid,coverage)
    pages=unit['pages'];assert all(p in page_ocr for p in pages)
    records.append({
      'unit_id':uid,'title':unit['title'],'pdf_pages':pages,'risk_pages':unit['risk_pages'],
      'source_file':str(source_path.relative_to(ROOT)),'source_hash':unit['source_hash'],
      'knowledge_file':str(note_path.relative_to(ROOT)),
      'knowledge_sha256':hashlib.sha256(note.encode()).hexdigest(),
      'source_main_characters':len(source_norm),'body_main_characters':len(formal_norm),
      'source_to_body_coverage':round(coverage,6),'explained_difference':expected,
      'min_native_to_vision_ocr_coverage':min(page_ocr[p] for p in pages),
      'projection_sections_present':True,'source_body_check':'passed',
    })
assert len(records)==37
out={
 'audit_date':'2026-10-04','scope':'current_72_page_pdf_37_units_only',
 'pdf_path':str(PDF.relative_to(ROOT)),'pdf_sha256':mapping['source_pdf_hash'],
 'vision_ocr_manifest':str(OCR.relative_to(ROOT)),
 'ocr_content_pages_checked':len(page_ocr),'ocr_native_min_coverage':min(page_ocr.values()),
 'ocr_native_page_coverage':{str(k):v for k,v in page_ocr.items()},
 'unit_count':len(records),'exact_main_body_matches':sum(r['source_to_body_coverage']==1 for r in records),
 'explained_main_body_differences':sum(r['explained_difference'] is not None for r in records),
 'units':records,
 'limitations':['OCR and string matching do not by themselves judge political meaning or approve publication.',
                'PDF practice questions are outside the full-reading content projection.',
                'Scope completion is not complete civil-service politics coverage.'],
}
serialized=json.dumps(out,ensure_ascii=False,indent=2)+'\n'
if '--check-only' in sys.argv:
    assert OUT.read_text()==serialized,'saved audit evidence is stale'
else:
    OUT.write_text(serialized)
print(f"{len(records)} units: {out['exact_main_body_matches']} exact source coverage, {out['explained_main_body_differences']} explained differences; 69 OCR pages, minimum native match {out['ocr_native_min_coverage']:.4f}")
