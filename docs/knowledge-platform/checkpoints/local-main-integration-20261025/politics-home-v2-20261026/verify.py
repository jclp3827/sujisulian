from pathlib import Path
import json,hashlib
here=Path(__file__).resolve().parent
root=here.parents[4]
m=json.loads((here/'manifest.json').read_text())
for group in ['product','svg','evidence']:
 for name,expected in m[group].items():
  p=root/name
  assert p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest()==expected,name
print('Verified political V2 product, original six SVGs and evidence; no files changed.')
