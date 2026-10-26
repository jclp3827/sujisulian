from pathlib import Path
import hashlib,json
here=Path(__file__).resolve().parent
root=here.parents[4]
m=json.loads((here/"manifest.json").read_text())
for group in ["product","svg","protected","evidence"]:
 for n,h in m[group].items():
  assert (root/n).is_file() and hashlib.sha256((root/n).read_bytes()).hexdigest()==h,n
print("Verified full V4 grid candidate and real screenshot evidence; no writes.")
