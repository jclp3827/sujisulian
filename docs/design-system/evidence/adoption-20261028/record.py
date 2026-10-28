#!/usr/bin/env python3
import argparse,subprocess,json,datetime,pathlib,hashlib,sys
p=argparse.ArgumentParser();p.add_argument('--cwd',required=True);p.add_argument('--out',required=True);p.add_argument('--label',required=True);p.add_argument('--echo',action='store_true');p.add_argument('command',nargs=argparse.REMAINDER);a=p.parse_args();cmd=a.command[1:] if a.command[:1]==['--'] else a.command
out=pathlib.Path(a.out);out.mkdir(parents=True,exist_ok=True);start=datetime.datetime.now(datetime.timezone.utc).isoformat();r=subprocess.run(cmd,cwd=a.cwd,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
(out/(a.label+'.stdout')).write_bytes(r.stdout);(out/(a.label+'.stderr')).write_bytes(r.stderr);entry={'label':a.label,'cwd':a.cwd,'argv':cmd,'startedUtc':start,'finishedUtc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'exitCode':r.returncode,'stdout':a.label+'.stdout','stderr':a.label+'.stderr','stdoutSha256':hashlib.sha256(r.stdout).hexdigest(),'stderrSha256':hashlib.sha256(r.stderr).hexdigest()}
with (out/'commands.jsonl').open('a') as f:f.write(json.dumps(entry,ensure_ascii=False)+'\n')
if a.echo:
 sys.stdout.buffer.write(r.stdout);sys.stdout.buffer.flush();sys.stderr.buffer.write(r.stderr);sys.stderr.buffer.flush()
print(json.dumps({'label':a.label,'exitCode':r.returncode,'stdout':str(out/(a.label+'.stdout'))},ensure_ascii=False));sys.exit(r.returncode)
