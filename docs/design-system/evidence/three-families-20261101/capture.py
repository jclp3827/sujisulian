import asyncio,json,hashlib,subprocess,sys
from pathlib import Path
from wechat_devtools_mcp.tools.automator import wechat_automator
from wechat_devtools_mcp.tools.screenshot import wechat_screenshot
from wechat_devtools_mcp.models.schemas import WechatAutomatorInput,WechatScreenshotInput
root=Path('/private/tmp/miniprogram-ds-three-families-20261101');side=sys.argv[1];out=root/'docs/design-system/evidence/three-families-20261101'/side;out.mkdir(parents=True,exist_ok=True)
cases=[('note-empty','/subpackages/note/practice/index?kind=application',{'state':'empty','settingsOpen':False,'corrupt':False,'notice':'','kind':'application','title':'公考真题'},['.practice-actions','.practice-heading button']),('note-practice','/subpackages/note/practice/index?kind=application',{'state':'question','settingsOpen':False,'corrupt':False,'notice':'','kind':'application','title':'公考真题','index':1,'total':5,'progress':20,'result':{'correct':0},'answer':{},'imagesReady':True,'card':{'id':'ds-fixed-choice','prompt':'固定展示夹具：请选择正确的学习方式。','options':[{'key':'A','text':'先理解再练习'},{'key':'B','text':'只看答案'}],'sources':[]}},['.practice-actions','.practice-progress-card']),('note-memory','/subpackages/note/memory/index?kind=basic',{'state':'card','settingsOpen':False,'listOpen':False,'notice':'','title':'基础快记','card':{'id':'ds-fixed-memory','title':'展示夹具','prompt':'回忆本知识点'},'index':1,'total':5,'progress':20,'answerVisible':False,'report':{'counts':{'remembered':0,'fuzzy':0,'missed':0,'skipped':0}}},['.note-progress-card','.memory-toolbar']),('common-daily','/subpackages/common-sense/learning/index?mode=daily',None,['.session-head','.learning-actions']),('common-guide','/subpackages/common-sense/learning/index?mode=guide',None,['.guide-settings-action','.session-head','.learning-actions']),('common-exam','/subpackages/common-sense/learning/index?mode=exam',None,['.guide-settings-action','.session-head']),('politics','/subpackages/politics/practice/index?mode=qa',None,['.practice-progress-line','.practice-dock']),('note-settings','/subpackages/note/practice/index?kind=application',{'settingsOpen':True,'kind':'application','title':'公考真题'},['.note-settings-close'])]
cases += [('common-settings','/subpackages/common-sense/learning/index?mode=daily',{'settingsOpen':True},['.settings-close']),('memory-settings','/subpackages/note/memory/index?kind=basic',{'settingsOpen':True},['.note-settings-close']),('politics-daily','/subpackages/politics/practice/index?mode=daily',None,['.practice-settings-link','.practice-progress-line'])]
async def a(**kw):return json.loads(await wechat_automator(WechatAutomatorInput(auto_port=9434,**kw)))
async def run():
 assert (await a(action='start',project_path=str(root)))['success']
 for m in ['getStorageSync','setStorageSync']:assert (await a(action='mock_wx',method=m,result_json='{}'))['success']
 system=(await a(action='system_info'))['data']['system_info'];print('viewport',system['windowWidth'],flush=True)
 for name,url,data,selectors in cases:
  await a(action='evaluate',expression="wx.reLaunch({url:'"+url+"'}); 'ok'");await asyncio.sleep(3)
  if data:await a(action='set_data',data_json=json.dumps(data,ensure_ascii=False))
  elements={}
  for sel in selectors:elements[sel]=await a(action='element_info',selector=sel)
  if not all(x.get('success') for x in elements.values()):
   await asyncio.sleep(3)
   for sel in selectors:elements[sel]=await a(action='element_info',selector=sel)
  stack=await a(action='page_stack');assert stack['data']['pages'][-1]['path']==url.split('?')[0].lstrip('/')
  shot=json.loads(await wechat_screenshot(WechatScreenshotInput(auto_port=9434,output_path=str(out/(name+'.png')),full_page=False)))
  record={'source':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'route':stack['data']['pages'][-1],'fixture':data,'system':system,'elements':elements,'screenshot':shot['success'],'sha256':hashlib.sha256((out/(name+'.png')).read_bytes()).hexdigest(),'limits':'真实渲染；固定夹具及 Storage 替身不证明真实点击或记录恢复'}
  (out/(name+'.json')).write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n');print(name,shot['success'],flush=True)
asyncio.run(run())
