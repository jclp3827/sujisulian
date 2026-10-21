#!/usr/bin/env node
// Requires python3 + Pillow. No network, EXE execution or private input files.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const photo = path.join(root, "miniprogram/subpackages/photo");
const core = require(path.join(photo, "core/process"));
const { inspectJpeg } = require(path.join(photo, "core/jpeg"));
const { sha256 } = require(path.join(photo, "core/sha256"));
const profile = require(path.join(photo, "profiles/henan-retained"));
const nationalProfile = require(path.join(photo, "profiles/gwy"));
const national = core.createProcessor(nationalProfile.id);
const encode = require(path.join(photo, "vendor/jpeg-encoder"));
const directory = fs.mkdtempSync(path.join(os.tmpdir(), "photo-core-regression-"));
let checks = 0;

function python(code, args = []) {
  const result = spawnSync("python3", ["-c", code, directory, ...args], { encoding: "utf8", maxBuffer: 1024 * 1024 });
  if (result.status !== 0) throw Error(result.stderr || result.stdout || "Pillow verification failed");
  return result.stdout.trim();
}

function pixels(width = 295, height = 413) {
  const output = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const p = (y * width + x) * 4;
    output[p] = Math.floor(x * 255 / width); output[p + 1] = Math.floor(y * 255 / height);
    output[p + 2] = 100; output[p + 3] = 255;
  }
  return output;
}

async function check(name, action) { await action(); checks++; console.log("PASS", name); }
const read = (name) => fs.readFileSync(path.join(directory, name));

function mockPage(component = false, existingTab = null) {
  const disk = new Map();
  let id = 0, frame = pixels(), decodedWidth = 295;
  const files = {
    async init() {},
    async choose() { return read("source.jpg"); },
    async choosePhoto() { return read("source.jpg"); },
    async read(p) { return disk.get(p); },
    async writeVerified(data) {
      const p = "copy-" + (++id); disk.set(p, Uint8Array.from(data));
      return { path: p, bytes: data.length, sha256: sha256(data) };
    },
    async remove(p) { disk.delete(p); },
    async dispose() { disk.clear(); },
    async share() {},
  };
  const raster = { async init() {}, async load() {}, draw() {}, pixels: () => frame, clear() {}, dispose() {} };
  const wxApi = {
    envVersion: "develop", shareCalls: 0,
    getAccountInfoSync() { return { miniProgram: { envVersion: this.envVersion } }; },
    canIUse() { return true; }, chooseImage() {}, chooseMessageFile() {},
    getImageInfo(o) { queueMicrotask(() => o.success({ width: decodedWidth, height: 413, type: "jpeg" })); },
    shareFileMessage() {},
  };
  let definition, componentDefinition;
  const filename = path.join(photo, component ? "editor/index.js" : "process/index.js");
  const context = {
    getCurrentPages() { return existingTab ? [existingTab] : []; },
    Page(p) { definition = p; },
    Component(p) { componentDefinition = p; definition = Object.assign({ data: p.data }, p.methods); }, wx: wxApi, console,
    require(name) {
      if (name === "../platform/files") return { createFiles: () => files, call: require(path.join(photo, "platform/files")).call };
      if (name === "../platform/raster") return { createRaster: () => raster };
      return require(path.resolve(path.dirname(filename), name));
    },
  };
  vm.runInNewContext(fs.readFileSync(filename, "utf8"), context, { filename });
  const page = Object.assign({}, definition, { data: JSON.parse(JSON.stringify(definition.data)) });
  page.setData = (value, done) => { Object.assign(page.data, value); if (done) done(); };
  return { page, files, raster, disk, wxApi, componentDefinition, setDecodedWidth: (n) => { decodedWidth = n; }, setPixels: (p) => { frame = p; } };
}

async function main() {
  python(String.raw`
from PIL import Image
from pathlib import Path
import random,sys
d=Path(sys.argv[1]);rng=random.Random(37)
w,h=768,1217
data=bytes(rng.randrange(256) for _ in range(w*h*3))
im=Image.frombytes('RGB',(w,h),data)
im.save(d/'source.jpg',quality=92)
im.save(d/'progressive.jpg',quality=92,progressive=True)
exif=Image.Exif();exif[274]=6
im.save(d/'rotated.jpg',quality=92,exif=exif)
im.convert('CMYK').save(d/'cmyk.jpg',quality=92)
im.save(d/'icc.jpg',quality=92,icc_profile=b'test-profile')
Image.new('RGB',(200,200)).save(d/'small.jpg',quality=95)
Image.new('RGB',(295,413),(240,240,240)).save(d/'small-valid.jpg',quality=90)
`);
  await check("source validation: ordinary/progressive JPG, dimensions and explicit unsupported input", () => {
    assert.equal(core.inspectSource(read("source.jpg")).width,768);
    assert.equal(core.inspectSource(read("progressive.jpg")).frame,0xc2);
    assert.throws(() => core.inspectSource(read("rotated.jpg")),/旋转|镜像/);
    assert.throws(() => core.inspectSource(read("cmyk.jpg")),/CMYK/);
    assert.throws(() => core.inspectSource(read("icc.jpg")),/色彩/);
    assert.throws(() => core.inspectSource(read("small.jpg")),/30 KB/);
    assert.throws(() => core.inspectSource(Buffer.concat([read("source.jpg"),Buffer.from(profile.tailHex,"hex")])),/原图/);
  });
  await check("crop geometry preserves target ratio, stays inside source and refuses enlargement", () => {
    for (const [w,h] of [[768,1217],[1217,768],[295,413]]) {
      for (const x of [0,0.5,1]) for (const y of [0,0.5,1]) {
        const crop=core.cropRect(w,h,{x,y,zoom:1});
        assert.ok(Math.abs(crop.width/crop.height-295/413)<1e-9);
        assert.ok(crop.x>=0 && crop.y>=0 && crop.x+crop.width<=w+1e-8 && crop.y+crop.height<=h+1e-8);
      }
    }
    assert.throws(()=>core.cropRect(295,413,{zoom:1.01}));
    assert.throws(()=>core.cropRect(768,1217,{x:NaN}));
    assert.throws(()=>core.cropRect(768,1217,{x:-1}));
  });
  await check("fixed encoder metadata and quantization tables verified independently by Pillow", () => {
    const candidate=core.createCandidate(pixels(),true);
    fs.writeFileSync(path.join(directory,"candidate.jpg"),candidate.data);
    fs.writeFileSync(path.join(directory,"gradient.rgba"),pixels());
    assert.equal(candidate.info.tail,profile.tailHex);
    assert.equal(candidate.data.length-candidate.info.jpegLength,10);
    assert.equal(candidate.sha256,sha256(core.createCandidate(pixels(),true).data));
    python(String.raw`
from PIL import Image,JpegImagePlugin,ImageChops,ImageStat
from pathlib import Path
import sys,io
d=Path(sys.argv[1]); im=Image.open(d/'candidate.jpg');im.load()
assert im.size==(295,413) and im.mode=='RGB'
assert JpegImagePlugin.get_sampling(im)==2
assert im.info['jfif_version']==(1,1) and im.info['dpi']==(96,96)
ref=Image.frombytes('RGBA',(295,413),(d/'gradient.rgba').read_bytes()).convert('RGB')
buf=io.BytesIO();ref.save(buf,format='JPEG',quality=40,subsampling=2)
reference=Image.open(io.BytesIO(buf.getvalue()))
assert im.quantization==reference.quantization
errors=ImageStat.Stat(ImageChops.difference(im,ref)).mean
assert max(errors)<4, errors
assert im.getpixel((294,412))[0]>240 and im.getpixel((294,412))[1]>240
`);
  });
  await check("4:2:0 MCU edge padding works for small and odd image dimensions", () => {
    for (const [w,h] of [[1,1],[17,19],[295,413]]) fs.writeFileSync(path.join(directory,`edge-${w}-${h}.jpg`),encode({width:w,height:h,data:pixels(w,h)}));
    python(String.raw`
from PIL import Image
from pathlib import Path
import sys
d=Path(sys.argv[1])
for w,h in [(1,1),(17,19),(295,413)]:
 im=Image.open(d/f'edge-{w}-{h}.jpg');im.load();assert im.size==(w,h)
 assert abs(im.getpixel((w-1,h-1))[2]-100)<20
`);
  });
  await check("generation requires explicit content confirmation and opaque RGBA", () => {
    assert.throws(()=>core.createCandidate(pixels(),false),/确认/);
    assert.throws(()=>core.createCandidate(new Uint8Array(4),true),/数量/);
    const rgba=pixels(); rgba[3]=0;
    assert.throws(()=>core.createCandidate(rgba,true),/透明/);
  });
  await check("output verifier rejects altered tables, dimensions, density and appended extra bytes", () => {
    const data=core.createCandidate(pixels(),true).data;
    assert.throws(()=>core.verifyCandidate(data.subarray(0,data.length-10)));
    assert.throws(()=>core.verifyCandidate(Buffer.concat([data,Buffer.from(profile.tailHex,"hex")])));
    const changed=Uint8Array.from(data);changed[14]^=1;
    assert.throws(()=>core.verifyCandidate(changed));
    let q=data.findIndex((v,i)=>v===0xff && data[i+1]===0xdb);
    const table=Uint8Array.from(data);table[q+5]^=1;
    assert.throws(()=>core.verifyCandidate(table));
  });
  await check("controller generates real candidates, invalidates crop/confirmation changes and isolates old files", async () => {
    const m=mockPage(),p=m.page;
    await p.onLoad({profile:profile.id});await p.onReady();await p.chooseFile();
    assert.equal(p.data.hasSource,true);await p.generate();assert.equal(p.data.resultReady,false);
    await p.confirmContent({detail:{value:['confirmed']}});await p.generate();
    assert.equal(p.data.resultReady,true);const old=p._candidate.record.path;
    core.verifyCandidate(m.disk.get(old));
    m.files.share=async()=>{throw {errMsg:'shareFileMessage:fail cancel'};};
    await p.exportCandidate();assert.equal(p.data.exportSucceeded,false);assert.equal(p.data.exportStatus,'已取消导出');
    m.files.share=async()=>{throw {errMsg:'shareFileMessage:fail unsupported file'};};
    p._workspaceScrollTop=80;
    await p.exportCandidate();assert.equal(p.data.exportSucceeded,false);
    assert.match(p.data.exportError,/导出/);
    assert.equal(p.data.notice,'','handled export failures must not create a duplicate page notice');
    assert.equal(p.data.workspaceScrollTop,0,'result feedback must return to the visible top of the bounded workspace');
    assert.doesNotMatch(p.data.exportError,/shareFileMessage|:fail/);
    assert.doesNotMatch(p.data.notice,/shareFileMessage|:fail/);
    let shareCalled=false;
    m.files.share=(record,name,current)=>{assert.equal(Boolean(current()),true);shareCalled=true;return Promise.resolve({});};
    const exporting=p.exportCandidate();assert.equal(shareCalled,true,'native adapter must be called without an asynchronous pre-read');await exporting;
    assert.equal(p.data.exportSucceeded,true);assert.equal(p.data.exportError,'');
    let storedCandidate=p._candidate;
    Object.defineProperty(p,'_candidate',{configurable:true,get(){return storedCandidate ? Object.assign({},storedCandidate) : null;},set(value){storedCandidate=value;}});
    await p.exportCandidate();assert.equal(p.data.exportSucceeded,true,'stable revisions must work with runtime object wrappers');
    const chooseOriginal=m.files.choose;
    m.files.choose=async()=>Uint8Array.from(p._candidate.generated.data);
    await p.compareReturned();assert.equal(p.data.compareOk,true);
    m.files.choose=async()=>{const data=Uint8Array.from(p._candidate.generated.data);data[1000]^=1;return data;};
    await p.compareReturned();assert.equal(p.data.compareOk,false);
    m.files.choose=chooseOriginal;
    await p.adjustCrop({currentTarget:{dataset:{field:'cropY'}},detail:{value:70}});
    assert.equal(p.data.resultReady,false);assert.equal(p.data.contentConfirmed,false);assert.equal(m.disk.has(old),false);
    await p.confirmContent({detail:{value:['confirmed']}});await p.generate();
    await p.confirmContent({detail:{value:[]}});assert.equal(p.data.resultReady,false);
    await p.confirmContent({detail:{value:['confirmed']}});m.setDecodedWidth(300);await p.generate();
    assert.equal(p.data.resultReady,false);assert.match(p.data.notice,/解码/);
    m.setDecodedWidth(295);
    let finishDecode;
    m.wxApi.getImageInfo=(o)=>{finishDecode=()=>o.success({width:295,height:413,type:'jpeg'});};
    const pending=p.generate();
    while(!finishDecode) await Promise.resolve();
    await p.confirmContent({detail:{value:[]}});
    finishDecode();await pending;
    assert.equal(p.data.resultReady,false);assert.equal(p.data.contentConfirmed,false);
    assert.match(p.data.notice,/输入已经改变/);
    await p.reset();assert.equal(m.disk.size,0);p.onUnload();
  });
  await check("national source rules accept a valid sub-30-KiB JPG but reject undersized, tagged and unsupported sources", () => {
    const small=read('small-valid.jpg');assert.ok(small.length<30*1024);
    assert.equal(national.inspectSource(small).width,295);
    assert.throws(()=>core.inspectSource(small),/30 KB/);
    assert.throws(()=>national.inspectSource(read('small.jpg')),/295×413/);
    for (const name of ['rotated.jpg','cmyk.jpg','icc.jpg']) assert.throws(()=>national.inspectSource(read(name)));
    assert.throws(()=>national.inspectSource(national.createCandidate(pixels(),true).data),/额外尾部/);
    assert.throws(()=>national.cropRect(295,413,{zoom:1.01}),/太小/);
  });
  await check("import loading closes on success, failure and unload, and exposes actual supplied file facts", async () => {
    const m = mockPage(), p = m.page, loading = [];
    m.wxApi.showLoading = options => loading.push(options.title);
    m.wxApi.hideLoading = () => loading.push("closed");
    m.wxApi.nextTick = callback => queueMicrotask(callback);
    await p.onLoad({}); await p.onReady();
    m.disk.set("picker-photo", read("source.jpg"));
    await p.loadSourcePath("picker-photo");
    assert.equal(p._inputLoading, false); assert.equal(loading.at(-1), "closed");
    assert.match(p.data.inputLabel, /微信提供的 JPEG/); assert.match(p.data.sourceLabel, /本地工作图 JPG/);
    assert.equal(p._source.input.sourceSha256, sha256(read("source.jpg")));
    assert.ok(p.data.preparationMs >= 0); assert.ok(p._source.input.timings.verifiedCopyMs >= 0);
    m.disk.set("broken-photo", Buffer.from([255, 216, 255]));
    await assert.rejects(() => p.loadSourcePath("broken-photo"));
    assert.equal(p._inputLoading, false); assert.equal(p.data.hasSource, true); assert.equal(p.data.resultReady, false);
    // A rejected replacement must retain the usable original.
    assert.equal(p._source.input.sourceSha256, sha256(read("source.jpg")));
    p.showInputLoading("正在读取照片"); p.onUnload();
    assert.equal(p._inputLoading, false); assert.equal(loading.at(-1), "closed");
  });
  await check("national output is independently decodable and profiles reject each other's trailer", () => {
    const a=core.createCandidate(pixels(),true),b=national.createCandidate(pixels(),true);
    assert.equal(b.profileId,nationalProfile.id);assert.equal(b.toolSha256,nationalProfile.toolSha256);
    assert.equal(b.info.tail,'ff020008676a67777932');assert.equal(b.data.length-b.info.jpegLength,10);
    assert.deepEqual(a.data.subarray(0,a.info.jpegLength),b.data.subarray(0,b.info.jpegLength));
    assert.throws(()=>core.verifyCandidate(b.data));assert.throws(()=>national.verifyCandidate(a.data));
    assert.throws(()=>national.createCandidate(pixels(),false),/确认/);
    assert.throws(()=>core.createProcessor('unknown'));assert.throws(()=>core.createProcessor(''));
    fs.writeFileSync(path.join(directory,'national.jpg'),b.data);
    python(String.raw`
from PIL import Image,JpegImagePlugin
from pathlib import Path
import sys,io
d=Path(sys.argv[1]); raw=(d/'national.jpg').read_bytes()
assert raw[-12:]==bytes.fromhex('ffd9ff020008676a67777932')
im=Image.open(io.BytesIO(raw)); im.load()
assert im.size==(295,413) and im.mode=='RGB' and JpegImagePlugin.get_sampling(im)==2
assert im.info['jfif_version']==(1,1) and im.info['dpi']==(96,96)
ref=io.BytesIO();Image.new('RGB',(8,8)).save(ref,format='JPEG',quality=40)
assert im.quantization==Image.open(io.BytesIO(ref.getvalue())).quantization
`);
  });
  await check("national profile is bound to the audited binary and recovered save-path literals", () => {
    const audit=JSON.parse(fs.readFileSync(path.join(root,'docs/photo-poc/gwy-tool-audit-20261017.json'),'utf8'));
    assert.equal(nationalProfile.toolSha256,audit.exe.sha256);
    assert.equal(nationalProfile.archiveSha256,audit.archive.sha256);
    assert.equal(nationalProfile.width,audit.configuration.outputWidth);
    assert.equal(nationalProfile.height,audit.configuration.outputHeight);
    // Independently recover the literal buffer from recorded disassembly, not the runtime verifier.
    const write=audit.staticExcerpts.tailWriter;
    const al=parseInt(write.match(/mov\s+al, 0x([a-f0-9]+)/)[1],16),slots=new Map();
    for (const m of write.matchAll(/mov\s+byte ptr \[esp \+ 0x([a-f0-9]+)\], (-?0x[a-f0-9]+|-?\d+|al)/g)) {
      slots.set(parseInt(m[1],16),m[2]==='al' ? al : parseInt(m[2],0)&255);
    }
    assert.equal(slots.size,10);
    const tail=Buffer.from(Array.from({length:10},(_,i)=>{assert.ok(slots.has(0x20+i));return slots.get(0x20+i);}));
    assert.equal(nationalProfile.tailHex,tail.toString('hex'));
    assert.match(write,/push\s+0xa/);assert.match(write,/MSVCRT.dll!fwrite/);
    const quality=audit.staticExcerpts.saveCore.match(/push\s+0x(42200000)/);
    assert.ok(quality);const raw=Buffer.alloc(4);raw.writeUInt32LE(parseInt(quality[1],16));
    assert.equal(nationalProfile.quality,raw.readFloatLE());
  });
  await check("national default and profile switching clear old data and bind original-file export to the selected profile", async () => {
    const m=mockPage(),p=m.page;await p.onLoad();await p.onReady();
    assert.equal(p.data.profileId,nationalProfile.id);
    const shareNames=[];m.files.share=(record,name,current)=>{assert.ok(current());shareNames.push(name);return Promise.resolve({});};
    await p.loadSource(read('small-valid.jpg'));
    await p.confirmContent({detail:{value:['confirmed']}});await p.generate();
    const nationalData=Uint8Array.from(p._candidate.generated.data);
    national.verifyCandidate(nationalData);
    let pendingExport=p.exportCandidate();assert.equal(shareNames.length,1);await pendingExport;
    assert.equal(shareNames[0],"报名照片.jpg");
    m.files.choose=async()=>nationalData;await p.compareReturned();assert.equal(p.data.compareOk,true);
    await p.selectProfile({detail:{value:'1'}});
    assert.equal(p.data.profileId,profile.id);assert.equal(p.data.resultReady,false);
    assert.equal(p.data.hasSource,false);assert.equal(p.data.contentConfirmed,false);
    assert.equal(p.data.exportSucceeded,false);assert.equal(p.data.compareOk,false);assert.equal(m.disk.size,0);
    await p.exportCandidate();assert.equal(shareNames.length,1);
    await p.loadSource(read('source.jpg'));await p.confirmContent({detail:{value:['confirmed']}});await p.generate();
    core.verifyCandidate(p._candidate.generated.data);await p.exportCandidate();
    assert.match(shareNames[1],/^photo-candidate-henan-295x413-[a-f0-9]{8}\.jpg$/);
    m.files.choose=async()=>nationalData;await p.compareReturned();assert.equal(p.data.compareOk,false);
    await p.selectProfile({detail:{value:'0'}});assert.equal(m.disk.size,0);
    p.onUnload();
  });
  await check("unknown profile route fails closed before canvas/files initialize", async () => {
    const m=mockPage();let started=false;
    m.raster.init=async()=>{started=true;};m.files.init=async()=>{started=true;};
    await m.page.onLoad({profile:'unknown'});await m.page.onReady();
    assert.equal(m.page.data.allowed,false);assert.match(m.page.data.notice,/配置/);assert.equal(started,false);
  });
  await check("gestures preserve pinch anchor, respect bounds and rebase finger transitions", () => {
    const touch = require(path.join(photo, "platform/crop-gesture"));
    const source = { width: 768, height: 1217 }, view = { width: 250, height: 350 };
    const start = { zoom: 150, cropX: 50, cropY: 50 };
    const pts = [{identifier: 0,x: 60,y: 130},{identifier: 1,x: 160,y: 210}];
    const g = touch.begin(pts,start,view,national,source);
    const moved = touch.move(g,[{identifier: 0,x: 30,y: 110},{identifier: 1,x: 210,y: 230}],national,source,260);
    const next = national.cropRect(source.width,source.height,{zoom:moved.zoom/100,x:moved.cropX/100,y:moved.cropY/100});
    const oldX=g.rect.x+110/250*g.rect.width, newX=next.x+120/250*next.width;
    const oldY=g.rect.y+170/350*g.rect.height, newY=next.y+170/350*next.height;
    assert.ok(Math.abs(oldX-newX)<1e-8);assert.ok(Math.abs(oldY-newY)<1e-8);
    assert.ok(moved.zoom>start.zoom);
    for (const n of [-10000,10000]) {
      const single=touch.begin([{identifier:0,x:125,y:175}],start,view,national,source);
      const state=touch.move(single,[{identifier:0,x:n,y:n}],national,source,260);
      const r=national.cropRect(source.width,source.height,{zoom:state.zoom/100,x:state.cropX/100,y:state.cropY/100});
      assert.ok(r.x>=0 && r.y>=0 && r.x+r.width<=source.width+1e-8 && r.y+r.height<=source.height+1e-8);
    }
    assert.equal(touch.move(g,[pts[0]],national,source,260).rebase,true);
    assert.equal(touch.begin([{identifier:0,clientX:1,clientY:2}],start,view,national,source),null);
    for(const separation of [0.1,10000]) {
      const state=touch.move(g,[{identifier:0,x:100,y:170},{identifier:1,x:100+separation,y:170}],national,source,260);
      assert.ok(state.zoom>=100 && state.zoom<=260);
    }
  });
  await check("touch coalescing, final raster/export coordinates, reset and no service consumption", async () => {
    const m=mockPage(),p=m.page,frames=[],draws=[],scroll=[];
    m.wxApi.pageScrollTo=o=>scroll.push(o.scrollTop);
    m.raster.requestFrame=fn=>frames.push(fn);
    m.raster.draw=r=>draws.push(r);
    await p.onLoad();await p.onReady();await p.loadSource(read('source.jpg'));
    await p.adjustCrop({currentTarget:{dataset:{field:'zoom'}},detail:{value:180}});
    await p.confirmContent({detail:{value:['confirmed']}});await p.generate();
    const candidate=p._candidate, owned=m.disk.size;
    await p.backToAdjust();assert.equal(p._candidate,candidate);assert.equal(m.disk.size,owned);
    const t=(x,y)=>({identifier:0,x,y});
    p.startCropTouch({touches:[t(100,100)]});p.endCropTouch({touches:[]});
    assert.equal(p._candidate,candidate);assert.equal(p.data.contentConfirmed,true);
    p.startCropTouch({touches:[t(100,100)]});
    for(let n=1;n<=20;n++)p.moveCropTouch({touches:[t(100+n,100+n)]});
    assert.equal(frames.length,1); // Render once per frame, not once per event.
    const before=draws.length;frames.shift()();assert.equal(draws.length,before+1);
    assert.equal(p._candidate,null);assert.equal(p.data.contentConfirmed,false);
    p.moveCropTouch({touches:[t(130,130)]});p.endCropTouch({touches:[]});
    const finalRect=draws.at(-1);assert.equal(p.data.touchActive,false);
    await p.confirmContent({detail:{value:['confirmed']}});await p.generate();
    assert.deepEqual(draws.at(-1),finalRect); // Encoding redraws the final committed crop.
    national.verifyCandidate(p._candidate.generated.data);
    assert.equal(p.data.stage,'result');assert.equal(scroll.at(-1),0);
    await p.backToAdjust();await p.resetCrop();
    assert.equal(p.data.zoom,100);assert.equal(p.data.cropX,50);assert.equal(p.data.cropY,50);
    frames.forEach(fn=>fn());assert.equal(p.data.zoom,100);
    // No cloud transport is installed by this fixture; any service use fails it.
    p.onUnload();assert.equal(m.disk.size,0);
  });
  await check("the real raster applies identical source coordinates to original and scaled AI foreground", async () => {
    const {createRaster}=require(path.join(photo,'platform/raster'));
    const draws=[], canvas={width:0,height:0, getContext:()=>({clearRect(){},fillRect(){},drawImage(...args){draws.push(args);},getImageData(){return {data:pixels()};}}),
      createImage(){const image={};Object.defineProperty(image,'src',{set(value){image.path=value;queueMicrotask(()=>image.onload());}});return image;},requestAnimationFrame:fn=>fn()};
    const wx={createSelectorQuery:()=>({in(){return this;},select(){return this;},fields(){return this;},exec(fn){fn([{node:canvas}]);}}),
      getImageInfo(o){o.success(o.src==='foreground'?{width:600,height:800,type:'png'}:{width:768,height:1024,type:'jpeg'});}};
    const raster=createRaster(wx,{});await raster.init();await raster.load('source',{width:768,height:1024});
    const rect=national.cropRect(768,1024,{zoom:1.8,x:0.3,y:0.7});raster.draw(rect);const a=draws.at(-1);
    await raster.setForeground('foreground',{width:600,height:800});raster.setBackground('blue');raster.draw(rect);const b=draws.at(-1);
    assert.deepEqual(a.slice(1,5),[rect.x,rect.y,rect.width,rect.height]);
    b.slice(1,5).forEach((value,i)=>assert.ok(Math.abs(value/[600/768,800/1024,600/768,800/1024][i]-a[i+1])<1e-8));
    assert.deepEqual(a.slice(5),[0,0,295,413]);assert.deepEqual(b.slice(5),a.slice(5));
    assert.equal(canvas.width,295);assert.equal(canvas.height,413);
    raster.setBackground('original');raster.draw(rect);assert.deepEqual(draws.at(-1).slice(1),a.slice(1));
    raster.dispose();assert.equal(canvas.width,1);assert.equal(canvas.height,1);
  });
  await check("replacement protects unsent JPG/AI, cancel retains files, sent results avoid needless confirmation", async () => {
    const m=mockPage(),p=m.page;let answer=false,modals=0;
    m.wxApi.showModal=o=>{modals++;queueMicrotask(()=>o.success({confirm:answer}));};
    await p.onLoad();await p.onReady();await p.loadSource(read('source.jpg'));
    await p.confirmContent({detail:{value:['confirmed']}});await p.generate();
    const old=p._candidate,paths=[...m.disk.keys()];
    await p.backToAdjust();await p.reset();
    assert.equal(p._candidate,old);assert.deepEqual([...m.disk.keys()],paths);assert.equal(modals,1);
    m.disk.set('broken',Buffer.from([255,216,255]));answer=true;
    await assert.rejects(()=>p.loadSourcePath('broken'));
    assert.equal(p._candidate,old);assert.equal(p.data.hasSource,true);
    await p.generate();await p.exportCandidate();const count=modals;
    await p.reset();assert.equal(modals,count);assert.equal(p.data.hasSource,false);
    await p.loadSource(read('source.jpg'));p._ai={record:await m.files.writeVerified(Buffer.from('png')),sent:false};
    answer=false;await p.reset();assert.ok(p._ai);assert.equal(p.data.hasSource,true);
    answer=true;await p.reset();assert.equal(p._ai,null);assert.equal(p.data.hasSource,false);
    p.onUnload();assert.equal(m.disk.size,0);
  });
  await check("AI background/crop reuse stays local, preserves entitlement and cleans owned foreground", async () => {
    const m=mockPage(),p=m.page;let background='original',authorizations=0;
    m.raster.setBackground=value=>{background=value;};
    await p.onLoad();await p.onReady();await p.loadSource(read('source.jpg'));
    p._preview={summary:()=>({remaining:1,paid:true,paymentPending:false}),hasEntitlement:()=>true,
      async authorizeExport(){authorizations++;return true;},preview(){throw Error('No BDA for reuse');},buy(){throw Error('No payment for covered result');}};
    p._ai={record:await m.files.writeVerified(Buffer.from('owned-png')),preview:{resultId:'covered-existing-result'}};
    p.update({aiReady:true,aiAvailable:true});
    await p.chooseAiBackground();assert.equal(background,'white');
    await p.changeBackground({currentTarget:{dataset:{background:'blue'}}});assert.equal(background,'blue');
    await p.adjustCrop({currentTarget:{dataset:{field:'zoom'}},detail:{value:150}});
    await p.confirmContent({detail:{value:['confirmed']}});await p.generate();
    assert.equal(p.data.aiExportLocked,false);assert.equal(p.data.aiRemaining,1);
    await p.exportCandidate();assert.equal(authorizations,1);assert.equal(p._ai.sent,true);
    m.files.share=async()=>{throw {errMsg:'shareFileMessage:fail cancel'};};
    await p.exportCandidate();assert.equal(p.data.exportSucceeded,true);assert.match(p.data.exportStatus,/之前发送/);
    await p.backToAdjust();await p.resetCrop();await p.chooseOriginalBackground();
    assert.equal(background,'original');assert.ok(p._ai);assert.equal(p.data.aiRemaining,1);
    await p.reset();assert.equal(m.disk.size,0);p.onUnload();
  });
  await check("direct Tab component keeps live/unsent/in-flight tasks across hide/show and disposes only on detach", async () => {
    const m=mockPage(true),p=m.page,c=m.componentDefinition;let ready=0;
    const storage=new Map();m.wxApi.getStorageSync=k=>storage.get(k);m.wxApi.setStorageSync=(k,v)=>storage.set(k,v);
    p.triggerEvent=name=>{assert.equal(name,'ready');ready++;};
    c.lifetimes.attached.call(p);await c.lifetimes.ready.call(p);
    assert.equal(ready,1);assert.equal(p.data.canvasReady,true);
    await p.loadSource(read('source.jpg'));await p.confirmContent({detail:{value:['confirmed']}});await p.generate();
    const source=p._source,candidate=p._candidate,paths=[...m.disk.keys()],uses=p._preview.summary().remaining;
    c.pageLifetimes.hide.call(p);c.pageLifetimes.show.call(p);
    assert.equal(p._source,source);assert.equal(p._candidate,candidate);assert.deepEqual([...m.disk.keys()],paths);
    assert.equal(p._preview.summary().remaining,uses);assert.equal(p.data.stage,'result');
    let finish;m.wxApi.getImageInfo=o=>{finish=()=>o.success({width:295,height:413,type:'jpeg'});};
    const pending=p.generate();while(!finish)await Promise.resolve();
    c.pageLifetimes.hide.call(p);assert.equal(p._alive,true);assert.equal(p._locked,true);
    c.pageLifetimes.show.call(p);finish();await pending;
    assert.equal(p.data.resultReady,true);assert.ok(p._candidate);assert.equal(p.data.busy,false);
    c.lifetimes.detached.call(p);assert.equal(p._alive,false);assert.equal(m.disk.size,0);
  });
  await check("legacy entry focuses a live Tab task before file init can erase its owned results", async () => {
    for (const active of [{_source:{}},{_locked:true}]) {
      const editor=Object.assign({_alive:true},active);
      const host={route:'pages/photo/index',selectComponent:()=>editor};
      const m=mockPage(false,host);let init=0,route='';
      m.files.init=async()=>{init++;};m.wxApi.switchTab=o=>{route=o.url;};
      await m.page.onLoad({diagnostics:'1'});await m.page.onReady();
      assert.equal(init,0);assert.equal(m.page._files,undefined);assert.equal(route,'/pages/photo/index');
      assert.equal(editor._alive,true);m.page.onUnload();assert.equal(editor._alive,true);
    }
  });
  await check("production gate prevents file/canvas initialization and generation", async () => {
    const m=mockPage();m.wxApi.envVersion='release';
    await m.page.onLoad();await m.page.onReady();assert.equal(m.page.data.allowed,false);
    await m.page.chooseFile();assert.equal(m.disk.size,0);
  });
  console.log(JSON.stringify({phase:'national-MVP-adaptation',checks,passed:true,artifacts:directory,nationalDeviceTest:'pending',enrollmentAcceptance:'not-tested'}));
}

main().catch((error)=>{console.error(error);process.exitCode=1;});
