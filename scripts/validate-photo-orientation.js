const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {orientationMatrix,rawJpeg}=require('../miniprogram/subpackages/photo/platform/orientation');
const {inspectJpeg}=require('../miniprogram/subpackages/photo/core/jpeg');
const {prepareInput}=require('../miniprogram/subpackages/photo/platform/input');
const {createProcessor}=require('../miniprogram/subpackages/photo/core/process');
const {regions}=require('../miniprogram/subpackages/photo/profiles');
const encode=require('../miniprogram/subpackages/photo/vendor/jpeg-encoder');
const {createRaster}=require('../miniprogram/subpackages/photo/platform/raster');
const sourcePixels=new Uint8Array(600*800*4);
for(let i=0;i<sourcePixels.length;i+=4)sourcePixels.set([(i*13)%256,(i*17)%256,(i*23)%256,255],i);
const base=encode({width:600,height:800,data:sourcePixels},{quality:95});
function exif(direction) {
 const b=Buffer.alloc(36);b.set([255,225,0,34,69,120,105,102,0,0,73,73]);b.writeUInt16LE(42,12);b.writeUInt32LE(8,14);b.writeUInt16LE(1,18);b.writeUInt16LE(274,20);b.writeUInt16LE(3,22);b.writeUInt32LE(1,24);b.writeUInt16LE(direction,28);
 return Buffer.concat([Buffer.from(base.subarray(0,2)),b,Buffer.from(base.subarray(2))]);
}
// Independently compare all eight transformations with Pillow's EXIF transpose.
const mappings=[];
for(let o=1;o<=8;o++) {
 const w=o>=5?2:3,h=o>=5?3:2,m=orientationMatrix(o,w,h),out=Array(6);
 for(let y=0;y<2;y++)for(let x=0;x<3;x++){
  const xx=m[0]*(x+.5)+m[2]*(y+.5)+m[4],yy=m[1]*(x+.5)+m[3]*(y+.5)+m[5];out[Math.floor(yy)*w+Math.floor(xx)]=y*3+x;
 }
 mappings.push(out);
}
execFileSync('python3',['-c',`
import json,sys
from PIL import Image,ImageOps
expected=json.load(sys.stdin)
for o in range(1,9):
 im=Image.new('L',(3,2));im.putdata(list(range(6)));im.getexif()[274]=o
 assert list(ImageOps.exif_transpose(im).getdata())==expected[o-1],o
`],{input:JSON.stringify(mappings)});
assert.throws(()=>inspectJpeg(exif(0)),/方向/);
const tolerant=inspectJpeg(exif(0),{tolerateOrientation:true});assert.equal(tolerant.orientation,null);
assert.deepEqual(Buffer.from(rawJpeg(exif(0),tolerant)),Buffer.from(base));

async function pipeline(profileId,direction,native='right',failNormalize=false,smallWorking=false,format='jpeg') {
 const source=format==='jpeg'?exif(direction):Buffer.from([0,0,0,24,102,116,121,112,104,101,105,99,...new Array(28).fill(0)]);
 const filesMap=new Map([['source',source]]),removed=[],unlinked=[];
 let sequence=0,normalizations=0,compressed=0;
 const files={async read(p){return filesMap.get(p);},async writeVerified(data){const path='owned-'+(++sequence);filesMap.set(path,data);return {path,sha256:'test'};},async remove(p){removed.push(p);filesMap.delete(p);}};
 const wx={compressImage(o){compressed++;assert.equal(format,'heic');filesMap.set('compressed',exif(direction));o.success({tempFilePath:'compressed'});},getFileSystemManager(){return {unlink(o){unlinked.push(o.filePath);filesMap.delete(o.filePath);o.success({});}};}};
 const processor=createProcessor(profileId);
 const raster={async normalize(p,info,edge,options){
  normalizations++;
  assert.equal(inspectJpeg(filesMap.get(p)).orientation,1);
  assert.equal(options.orientation,direction||6);
  if(failNormalize)throw Error('decode failed');
  const swap=options.orientation>=5,w=swap?800:600,h=swap?600:800;
  // High-detail work image clears Sichuan's original size lower bound.
  const data=new Uint8Array(w*h*4);for(let i=0;i<data.length;i+=4)data.set(smallWorking?[255,255,255,255]:[(i*13)%256,(i*17)%256,(i*23)%256,255],i);
  filesMap.set('normalized',encode({width:w,height:h,data},{quality:95}));return 'normalized';
 }};
 // Identify EXIF-free owned working copies in native metadata lookup.
 wx.getImageInfo=o=>{const data=filesMap.get(o.src),jpeg=data[0]===255,raw=jpeg&&inspectJpeg(data,{tolerateOrientation:true}).hasExif===false;o.success({width:600,height:800,type:jpeg?'jpeg':'heic',orientation:raw?'up':native});};
 let result,error;
 try{result=await prepareInput(wx,files,raster,processor,'source');}catch(e){error=e;}
 assert.equal(filesMap.has('source'),true);assert.equal(filesMap.size,1);assert.equal(compressed,format==='heic'?1:0);
 return {result,error,normalizations,removed,unlinked};
}
(async()=>{
 // Exercise the actual canvas adapter, not only the transform utility.
 for(let o=1;o<=8;o++) {
  let matrix,draw,exported;
  const ctx={fillRect(){},save(){},restore(){},transform(...m){matrix=m;},drawImage(...v){draw=v;}};
  const scratch={getContext:()=>ctx,createImage(){return {set src(v){this.onload();}};}};
  const wx={createSelectorQuery(){return {in(){return this;},select(){return this;},fields(){return this;},exec(cb){cb([{node:scratch}]);}};},canvasToTempFilePath(opts){exported=opts;opts.success({tempFilePath:'upright'});}};
  const raster=createRaster(wx,{});
  assert.equal(await raster.normalize('raw',{width:600,height:800},2048,{orientation:o,exactSize:true}),'upright');
  const w=o>=5?800:600,h=o>=5?600:800;
  if(o!==1)assert.deepEqual(matrix,orientationMatrix(o,w,h));
  assert.deepEqual(draw.slice(1),[0,0,600,800]);assert.equal(exported.destWidth,w);assert.equal(exported.destHeight,h);
 }
 for(const region of regions)for(let o=2;o<=8;o++){
  const r=await pipeline(region.profileId,o);assert.ifError(r.error);assert.equal(r.result.orientationRecovered,o);assert.equal(r.normalizations,1);assert.equal(r.removed.length,2);assert.equal(r.unlinked.length,1);
 }
 const recovered=await pipeline(regions[0].profileId,0);assert.ifError(recovered.error);assert.equal(recovered.result.orientationRecovered,6);
 const unknown=await pipeline(regions[0].profileId,0,'unexpected');assert.match(unknown.error.message,/无法确认/);assert.equal(unknown.normalizations,0);
 const failed=await pipeline(regions[0].profileId,6,'right',true);assert.match(failed.error.message,/decode failed/);assert.equal(failed.removed.length,2);
 const small=await pipeline(regions[1].profileId,6,'right',false,true);assert.ifError(small.error);assert.ok(small.result.data.length<30*1024);
 const heic=await pipeline(regions[0].profileId,6,'right',false,false,'heic');assert.ifError(heic.error);assert.equal(heic.result.sourceType,'heic');assert.equal(heic.result.orientationRecovered,6);
 console.log(JSON.stringify({passed:true,pillowTransforms:8,regionRotationCases:regions.length*7,malformedFallback:true,unknownRejected:true,cleanup:true,deviceValidation:'pending'}));
})().catch(e=>{console.error(e);process.exitCode=1;});
