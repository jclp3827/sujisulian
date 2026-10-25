#!/usr/bin/env python3
"""Verify this bounded development checkpoint; retained whitespace is never called green."""
import argparse,base64,hashlib,json,subprocess
from pathlib import Path
P="docs/knowledge-platform/implementations/common-sense-checkpoint-2026-10-25-refresh"
a=argparse.ArgumentParser();a.add_argument("--commit");args=a.parse_args()
def git(*items):return subprocess.check_output(["git",*items])
def read(path):return git("show",args.commit+":"+path) if args.commit else git("show",":"+path)
m=json.loads(read(P+"-manifest.json"));w=json.loads(read(P+"-whitespace.json"))
assert m["baseline"]=="381964581f4a6af22f49f63a4fd3e7d5dbfb9698"
diff=[m["baseline"],args.commit] if args.commit else ["--cached"]
actual=set(git("diff",*diff,"--name-only","-z").decode().strip("\0").split("\0"))
expected={e["path"] for e in m["entries"]}|{P+"-manifest.json"}
assert actual==expected,("file-set",sorted(actual^expected))
for e in m["entries"]:assert hashlib.sha256(read(e["path"])).hexdigest()==e["sha256"],e["path"]
raw=subprocess.run(["git","diff",*diff,"--check"],capture_output=True,text=True)
assert raw.returncode==2 and not raw.stderr
wanted=[]
for r in w["rows"]:
 assert r["reason"] and r["decision"]=="preserve-exception"
 data=read(r["path"]);assert hashlib.sha256(data).hexdigest()==r["sha256"]
 assert base64.b64encode(data.splitlines(keepends=True)[r["line"]-1]).decode()==r["lineBase64"]
 wanted.append(f'{r["path"]}:{r["line"]}: {r["issue"]}')
assert sorted(raw.stdout.strip().splitlines())==sorted(wanted),raw.stdout
old=subprocess.run(["node","scripts/validate-common-sense-checkpoint-whitespace.js","--commit",m["baseline"]],capture_output=True,text=True)
assert old.returncode==0,old.stdout+old.stderr
print(json.dumps({"passedWithExplicitExceptions":True,"files":len(expected),"hashesMatched":len(m["entries"]),"rawGitCheckPassed":False,"newWhitespaceExceptions":len(w["rows"]),"historicalWhitespaceExceptionsVerified":57,"formalAdmissionAdded":0,"accepted":False}))
