const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { createProcessorForProfile } = require('../miniprogram/subpackages/photo/core/process');
const { inspectJpeg } = require('../miniprogram/subpackages/photo/core/jpeg');
const base = require('../miniprogram/subpackages/photo/profiles/gwy');
const { createRaster } = require('../miniprogram/subpackages/photo/platform/raster');
const cases=[];
for(const sampling of ['420','422','444']) for(const quality of [1,40,83,100]) {
  const width=quality===100?301:217,height=quality===100?217:301;
  const profile={...base,width,height,quality,dpi:300,sampling,qLumaHex:undefined,qChromaHex:undefined,separateTableSegments:quality===83};
  const p=createProcessorForProfile(profile), pixels=new Uint8Array(width*height*4);
  for(let i=0;i<pixels.length;i+=4) pixels.set([(i/4)%256,Math.floor(i/(width*4))%256,(i*13)%256,255],i);
  const candidate=p.createCandidate(pixels,true), parsed=inspectJpeg(candidate.data);
  cases.push({sampling,quality,width,height,data:Buffer.from(candidate.data).toString('base64')});
  assert.equal(parsed.jfif.x,300);
  assert.equal(parsed.segments.filter(s=>s.marker===0xdb).length,quality===83?2:1);
  const wrong={...profile,dpi:96};
  assert.throws(()=>createProcessorForProfile(wrong).verifyCandidate(candidate.data));
}
// Explicit tables are authoritative even when their quality label differs.
const custom={...base,width:17,height:19,quality:80,quantizationMode:'explicit',sampling:'444',tailHex:'',qLumaHex:'05'.repeat(64),qChromaHex:'07'.repeat(64)};
const c=createProcessorForProfile(custom).createCandidate(new Uint8Array(17*19*4).fill(255),true);
assert.equal(inspectJpeg(c.data).tables[0].hex,custom.qLumaHex);
cases.push({sampling:'444',quality:null,width:17,height:19,data:Buffer.from(c.data).toString('base64')});
execFileSync('python3',['-c',`
import sys,json,base64,io
from PIL import Image,JpegImagePlugin
for c in json.load(sys.stdin):
 im=Image.open(io.BytesIO(base64.b64decode(c['data']))); im.load()
 assert im.size==(c['width'],c['height'])
 assert JpegImagePlugin.get_sampling(im)=={'420':2,'422':1,'444':0}[c['sampling']]
 if c['quality'] is not None:
  assert im.info['dpi']==(300,300)
  b=io.BytesIO();Image.new('RGB',(8,8)).save(b,format='JPEG',quality=c['quality'])
  assert im.quantization==Image.open(io.BytesIO(b.getvalue())).quantization
 else: assert im.quantization[0]==[5]*64 and im.quantization[1]==[7]*64
`],{input:JSON.stringify(cases)});
for(const override of [{quality:0},{quality:101},{dpi:0},{sampling:'411'},{width:0},{width:2000,height:2000},{quantizationMode:'unknown'},{quantizationMode:'explicit',qLumaHex:'00'.repeat(64)},{quality:80},{outputMinBytes:200,outputMaxBytes:100}])
  assert.throws(()=>createProcessorForProfile({...base,...override}));
const p=createProcessorForProfile({...base,outputMaxBytes:1});
assert.throws(()=>p.createCandidate(new Uint8Array(295*413*4).fill(255),true));

(async()=>{
 const draws=[],ctx={clearRect(){},fillRect(){},drawImage(...args){draws.push(args);},getImageData(x,y,w,h){return {data:new Uint8Array(w*h*4)};}};
 const canvas={width:0,height:0,getContext:()=>ctx,createImage(){return {set src(v){this.onload();}};}};
 const wx={createSelectorQuery(){return {in(){return this;},select(){return this;},fields(){return this;},exec(cb){cb([{node:canvas}]);}};},getImageInfo(o){o.success({width:600,height:800,type:'jpeg',orientation:'up'});}};
 const raster=createRaster(wx,{},base);await raster.init();
 assert.deepEqual([canvas.width,canvas.height],[295,413]);
 raster.configure({...base,width:217,height:301});
 assert.deepEqual([canvas.width,canvas.height],[217,301]);
 await raster.load('source',{width:600,height:800});raster.draw({x:0,y:0,width:600,height:800});
 assert.deepEqual(draws[0].slice(-2),[217,301]);assert.equal(raster.pixels().length,217*301*4);
 assert.throws(()=>raster.configure(base));raster.clear();raster.configure(base);
 assert.deepEqual([canvas.width,canvas.height],[295,413]);raster.dispose();
 console.log(JSON.stringify({passed:true,independentPillowCases:cases.length,invalidConfigurations:10,dynamicRaster:true}));
})().catch(e=>{console.error(e);process.exitCode=1;});
