#!/usr/bin/env python3
from pathlib import Path
import hashlib,json,sys
folder=Path(__file__).resolve().parent
root=folder.parents[4]
manifest=json.loads((folder/'source-files.json').read_text())
errors=[]
for name,expected in manifest.items():
    path=root/name
    if not path.exists() or hashlib.sha256(path.read_bytes()).hexdigest()!=expected: errors.append(name)
print(json.dumps({'passed':not errors,'files':len(manifest),'mismatches':errors},ensure_ascii=False))
sys.exit(bool(errors))
