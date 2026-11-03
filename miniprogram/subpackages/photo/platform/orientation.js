const { bytes } = require('../core/bytes');
const nativeOrientations = ['up','up-mirrored','down','down-mirrored','left-mirrored','right','right-mirrored','left'];
function nativeOrientation(value) { const i = nativeOrientations.indexOf(value); return i < 0 ? null : i + 1; }
// Maps raw pixel edges into the final, upright canvas; dimensions are final W/H.
function orientationMatrix(value,w,h) {
  const matrices = {
    1:[1,0,0,1,0,0], 2:[-1,0,0,1,w,0], 3:[-1,0,0,-1,w,h], 4:[1,0,0,-1,0,h],
    5:[0,1,1,0,0,0], 6:[0,1,-1,0,w,0], 7:[0,-1,-1,0,w,h], 8:[0,-1,1,0,0,h]
  };
  if (!matrices[value]) throw Error('无法确认照片方向，请在相册转正并另存后重试。');
  return matrices[value];
}
// Working copy ONLY: the caller must decode this raw image and explicitly apply
// the independently established orientation. Never return it as a final photo.
function rawJpeg(value, parsed) {
  const b = bytes(value), chunks = [b.subarray(0,2)];
  let p=2;
  while(p<parsed.jpegLength) {
    const start=p;
    while(b[p]===255) p++;
    const marker=b[p++];
    if(marker===0xda) { chunks.push(b.subarray(start,parsed.jpegLength)); break; }
    const end=p+((b[p]<<8)|b[p+1]);
    const exif=marker===0xe1 && [69,120,105,102,0,0].every((v,i)=>b[p+2+i]===v);
    if(!exif) chunks.push(b.subarray(start,end));
    p=end;
  }
  const out=new Uint8Array(chunks.reduce((n,c)=>n+c.length,0)); let offset=0;
  for(const c of chunks) {out.set(c,offset);offset+=c.length;}
  return out;
}
module.exports={nativeOrientation,orientationMatrix,rawJpeg};
