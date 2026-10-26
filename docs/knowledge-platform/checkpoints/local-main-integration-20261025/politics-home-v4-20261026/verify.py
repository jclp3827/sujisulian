from pathlib import Path
import hashlib,json
here=Path(__file__).resolve().parent
root=here.parents[4]
m=json.loads((here/'manifest.json').read_text())
for group in ['product','svg','protected','evidence']:
 for name,expected in m[group].items():
  p=root/name
  assert p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest()==expected,name
print('Verified V4 two-card candidate, six SVG originals, protected files and evidence; no writes.')
