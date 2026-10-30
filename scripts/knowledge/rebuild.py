#!/usr/bin/env python3
"""Explicitly regenerate disposable cache after full source/binding validation."""
import os,json
os.environ['HS_REBUILD_ONLY']='1'
from binding import rebuild,COMMIT,MANIFEST,CONFIG
rebuild()
print(json.dumps({'rebuilt':True,'source_commit':COMMIT,'source_kind':CONFIG['source_kind'],'files':len(MANIFEST['files'])}))
