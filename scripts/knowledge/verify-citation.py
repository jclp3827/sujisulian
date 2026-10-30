#!/usr/bin/env python3
import argparse,json,sys
p=argparse.ArgumentParser();p.add_argument('record');a=p.parse_args()
try:
 from evidence import verify
 e=json.load(open(a.record));valid,errors=verify(e)
except Exception as ex:valid,errors=False,[str(ex)]
print(json.dumps(dict(valid=valid,errors=errors,semantic_support='not evaluated'),ensure_ascii=False,indent=2));sys.exit(not valid)
