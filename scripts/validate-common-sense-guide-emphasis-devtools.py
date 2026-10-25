import argparse, asyncio, json, re, time
from pathlib import Path
from wechat_devtools_mcp.models.schemas import WechatAutomatorInput, WechatScreenshotInput
from wechat_devtools_mcp.tools.automator import wechat_automator
from wechat_devtools_mcp.tools.screenshot import wechat_screenshot

PROJECT = str(Path(__file__).resolve().parents[1])
ROUTE = 'subpackages/common-sense/learning/index'
CURRENT = 'getCurrentPages().slice(-1)[0]'
KEYS = ['common-sense-guide-v1', 'common-sense-guide-v1:golden-v1', 'common-sense-guide-v1:expansion-v1', 'common-sense-learning-v1']
parser = argparse.ArgumentParser()
parser.add_argument('--audit', required=True)
parser.add_argument('--minimum-batch', type=int, default=1)
parser.add_argument('--tag', required=True)
options = parser.parse_args()
assert re.fullmatch(r'[a-z0-9-]+', options.tag), 'Use a safe unique tag'
assert not Path('/private/tmp/guide-emphasis-'+options.tag+'-runtime.json').exists(), 'Preserve previous receipts; use a new tag'
REPORT = json.loads(Path(options.audit).read_text())
EXPECTED = {c['id']:c for b in REPORT['batches'] if b['number'] >= options.minimum_batch for c in b['cards']}

async def call(action, **args):
  result = json.loads(await wechat_automator(WechatAutomatorInput(action=action, project_path=PROJECT, auto_port=9422, **args)))
  if not result.get('success'): raise RuntimeError(str(result))
  return result.get('data', {})

async def ev(expression):
  return (await call('evaluate', expression=expression))['result']

async def wait(route, group=None):
  start = time.monotonic()
  while time.monotonic()-start < 25:
    state = await ev('(function(){const p='+CURRENT+';return {route:p&&p.route,ready:!!(p&&p.data&&p.data.guideCard),group:p&&p.data&&p.data.guideGroup&&p.data.guideGroup.id};})()')
    if state.get('route') == route and (route != ROUTE or state.get('ready')) and (not group or state.get('group') == group): return
  raise RuntimeError('route not ready '+route)

async def main():
  backup = await ev('(function(){const keys='+json.dumps(KEYS)+';const existing=wx.getStorageInfoSync().keys;return keys.map(key=>({key,exists:existing.includes(key),value:existing.includes(key)?wx.getStorageSync(key):null}));})()')
  # Keep an opaque recovery copy until every key has been restored.
  Path('/private/tmp/guide-emphasis-'+options.tag+'-storage-backup.json').write_text(json.dumps(backup))
  checked = []
  shots = []
  groups = list(dict.fromkeys(k.split('::')[0] for k in EXPECTED))
  try:
    for group in groups:
      await ev('wx.removeStorageSync("common-sense-guide-v1:expansion-v1")')
      await ev("(function(){wx.reLaunch({url:'/%s?mode=guide&sample=expansion-v1&groupId=%s&count=15'});return true;})()" % (ROUTE, group))
      await wait(ROUTE, group)
      found = set()
      wanted = {k for k in EXPECTED if k.startswith(group+'::')}
      if len(shots) < 3:
        path = '/private/tmp/guide-emphasis-'+options.tag+'-'+group+'.png'
        shot = json.loads(await wechat_screenshot(WechatScreenshotInput(auto_port=9422, output_path=path, full_page=False)))
        assert shot.get('success'), shot
        shots.append(path)
      # Check each page projection through the real page methods, in bounded bursts.
      # Only the separate representative screenshot is a visual check.
      for _ in range(10):
        remaining = list(wanted-found)
        result = await ev('(function(){const p='+CURRENT+';if(!p||p.route!=='+json.dumps(ROUTE)+')throw new Error("Unexpected route");const remaining='+json.dumps(remaining)+';const rows=[];for(let i=0;i<15;i++){if(p.data.completed)break;const c=p.data.guideCard,t=p.data.guideParagraphs.flatMap(x=>x.tokens);rows.push({id:c.id,signature:c.signature,terms:t.filter(x=>x.emphasis).map(x=>x.text),textPreserved:t.map(x=>x.text).join("")===c.content,source:c.sourceUrl});const at=remaining.indexOf(c.id);if(at>=0)remaining.splice(at,1);if(!remaining.length)break;p.handleGuideAssess({currentTarget:{dataset:{result:"skipped"}}});}return {rows,completed:p.data.completed};})()')
        for state in result['rows']:
          if state['id'] in wanted:
            expected = EXPECTED[state['id']]
            assert state['terms'] == expected['terms'], state
            assert state['textPreserved'] and state['signature'] == expected['signature'], state
            assert state['source'] == expected['sourceUrl'], state
            if state['id'] not in found:
              found.add(state['id']); checked.append(state)
        if found == wanted: break
        if result['completed']:
          await ev('(function(){'+CURRENT+'.handleNextGroup();return true;})()')
      assert found == wanted, {'group':group,'missing':list(wanted-found),'lastActualIds':[x['id'] for x in result['rows']]}
      print(json.dumps({'group':group,'checked':len(found)}), flush=True)
  finally:
    await ev("(function(){wx.reLaunch({url:'/pages/common-sense/index'});return true;})()")
    await wait('pages/common-sense/index')
    await ev('(function(){const rows='+json.dumps(backup,ensure_ascii=False)+';for(const x of rows){if(x.exists)wx.setStorageSync(x.key,x.value);else wx.removeStorageSync(x.key);}return true;})()')
    restored = await ev('(function(){const keys='+json.dumps(KEYS)+';const existing=wx.getStorageInfoSync().keys;return keys.map(key=>({key,exists:existing.includes(key),value:existing.includes(key)?wx.getStorageSync(key):null}));})()')
    assert restored == backup
  assert len(checked) == len(EXPECTED)
  result = {'passed':True,'newCardsChecked':len(checked),'groupsChecked':len(groups),'checks':checked,'screenshots':shots,'storageKeysRestoredAndReadbackVerified':4,'uploaded':False,'realDeviceAcceptance':False}
  Path('/private/tmp/guide-emphasis-'+options.tag+'-runtime.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
  print(json.dumps({'passed':True,'newCardsChecked':len(checked),'storageKeysRestoredAndReadbackVerified':4}),flush=True)

asyncio.run(main())
