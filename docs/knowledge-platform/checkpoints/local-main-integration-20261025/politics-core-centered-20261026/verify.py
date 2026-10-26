from pathlib import Path
import hashlib,json
here=Path(__file__).resolve().parent
root=here.parents[4]
m=json.loads((here/"manifest.json").read_text())
for g in ["product","protected","evidence"]:
 for n,h in m[g].items():
  assert hashlib.sha256((root/n).read_bytes()).hexdigest()==h,n
print("Verified centered core-card candidate and evidence; no writes.")
