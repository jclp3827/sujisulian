const IMAGE_ASSETS = [
  {
    pointId: "new-china-reform",
    tabId: "korean-war",
    title: "抗美援朝重要战役",
    src: "common-sense/korean-war-battles.png",
    description: "两水洞、云山、长津湖、上甘岭和金城战役的时间与意义速查。",
  },
  {
    pointId: "physics",
    tabId: "other-mechanics",
    afterLabel: "2.杠杆原理",
    title: "杠杆五要素",
    src: "common-sense/lever-elements.png",
    description: "动力、阻力、支点以及动力臂、阻力臂的对应关系。",
  },
  {
    pointId: "optics",
    tabId: "light-nature",
    title: "电磁波谱",
    src: "common-sense/electromagnetic-spectrum.png",
    description: "波长依次经过紫外、可见光和红外区域；可见光颜色由紫到红。",
  },
  {
    pointId: "optics",
    tabId: "life-optics",
    title: "光的三原色",
    src: "common-sense/light-primary-colors.png",
    description: "红、绿、蓝三色光叠加：红绿为黄、红蓝为品红、绿蓝为青，三色重叠为白。",
  },
  {
    pointId: "optics",
    tabId: "life-optics",
    title: "颜料的三原色",
    src: "common-sense/pigment-primary-colors.png",
    description: "红、黄、蓝三种颜料混合：红黄为橙、红蓝为紫、黄蓝为绿，三色重叠为黑。",
  },
  {
    pointId: "chemistry",
    tabId: "pure-substance",
    title: "物质分类",
    src: "common-sense/matter-classification.png",
    description: "物质分为纯净物与混合物；纯净物再分单质和化合物。",
  },
  {
    pointId: "citizen-constitutional-rights",
    tabId: "citizen-rights-supplement",
    title: "公民基本义务",
    src: "common-sense/citizen-basic-duties.png",
    description: "维护统一团结、守法、维护国家安全荣誉利益、服兵役、纳税，以及劳动和受教育。",
  },
  {
    pointId: "state-council",
    tabId: "state-council",
    title: "行政区划权限",
    src: "common-sense/administrative-division-authority.png",
    description: "用图区分全国人大、国务院和省级人民政府对行政区划的决定权限。",
  },
  {
    pointId: "civil-property-rights",
    tabId: "debt-right",
    title: "不当得利的四个要件",
    src: "common-sense/unjust-enrichment-elements.png",
    description: "一方得利、一方受损、得利与受损存在因果关系、得利没有法律根据。",
  },
  {
    pointId: "civil-limitation-types",
    tabId: "no-limitation",
    title: "不适用诉讼时效的请求权",
    src: "common-sense/limitation-exceptions.png",
    description: "停止侵害、排除妨碍、消除危险，物权返还及抚养赡养扶养费等请求权不适用诉讼时效。",
  },
  {
    pointId: "usufruct-rights",
    tabId: "usufruct",
    title: "居住权",
    src: "common-sense/right-of-residence.png",
    description: "集中记忆居住权的合同形式、登记生效、不得转让继承及消灭注销。",
  },
  {
    pointId: "security-rights",
    tabId: "mortgage",
    title: "土地所有权与使用权能否抵押",
    src: "common-sense/land-mortgage.png",
    description: "土地所有权不得抵押；宅基地、自留地、自留山等集体所有土地的使用权原则上不得抵押，法律规定可以抵押的除外。建设用地使用权依法可以抵押。",
  },
  {
    pointId: "inheritance-concept",
    tabId: "inheritance-concept",
    title: "继承权丧失的法定情形",
    src: "common-sense/inheritance-disqualification.png",
    description: "故意杀害被继承人、为争夺遗产杀害其他继承人属于绝对丧失；遗弃虐待、伪造篡改隐匿销毁遗嘱、欺诈胁迫妨碍遗嘱属于相对丧失。",
  },
];

function mountImageAssets(points) {
  IMAGE_ASSETS.forEach((asset) => {
    const point = points.find((item) => item.id === asset.pointId);
    const tab = point?.tabs?.find((item) => item.id === asset.tabId);
    if (!tab || tab.blocks.some((block) => block.src === asset.src)) return;

    const block = {
      type: "image-note",
      label: "原图速记",
      title: asset.title,
      src: asset.src,
      description: asset.description,
    };
    const afterIndex = asset.afterLabel
      ? tab.blocks.findIndex((item) => item.label === asset.afterLabel)
      : -1;
    if (afterIndex >= 0) tab.blocks.splice(afterIndex + 1, 0, block);
    else tab.blocks.push(block);
  });
}

module.exports = mountImageAssets;
module.exports.IMAGE_ASSETS = IMAGE_ASSETS;
