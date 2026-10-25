"use strict";

const e = (from, type, to) => `${from}>${type}>${to}`;

const conceptLearningSpecifications = [
  {
    mnemonicId: "market-structure-four-types-memory",
    mnemonicRevision: 2,
    conceptFrameId: "market-structure-concept-frame",
    conceptFrameRevision: 1,
    protocolVersion: "q0c3-novice-pilot-v1",
    introducedTerms: [
      { term: "市场结构", nodeId: "market-structure" },
      { term: "厂商数量", nodeId: "seller-count" },
      { term: "产品差别", nodeId: "product-difference" },
      { term: "进入条件", nodeId: "entry-condition" },
      { term: "相互依存", nodeId: "interdependence" },
    ],
    decodeMap: [
      {
        phraseId: "market-memory-four-types",
        nodeIds: ["market-structure", "perfect-competition", "monopolistic-competition", "oligopoly", "monopoly"],
        edgeIds: [
          e("market-structure", "contains", "perfect-competition"),
          e("market-structure", "contains", "monopolistic-competition"),
          e("market-structure", "contains", "oligopoly"),
          e("market-structure", "contains", "monopoly"),
        ],
        decodedConclusion: "市场结构按这一口径分为完全竞争、垄断竞争、寡头和完全垄断四类。",
      },
      {
        phraseId: "market-memory-perfect",
        nodeIds: ["market-structure", "seller-count", "product-difference", "entry-condition", "perfect-competition"],
        edgeIds: [
          e("market-structure", "distinguished-by", "seller-count"),
          e("market-structure", "distinguished-by", "product-difference"),
          e("market-structure", "distinguished-by", "entry-condition"),
          e("market-structure", "contains", "perfect-competition"),
        ],
        decodedConclusion: "完全竞争以参与者众多、产品同质和进入退出自由等条件识别。",
      },
      {
        phraseId: "market-memory-monopolistic",
        nodeIds: ["market-structure", "seller-count", "product-difference", "entry-condition", "monopolistic-competition"],
        edgeIds: [
          e("market-structure", "distinguished-by", "seller-count"),
          e("market-structure", "distinguished-by", "product-difference"),
          e("market-structure", "distinguished-by", "entry-condition"),
          e("market-structure", "contains", "monopolistic-competition"),
        ],
        decodedConclusion: "垄断竞争以企业众多、产品有差别但可替代、进入退出较容易识别。",
      },
      {
        phraseId: "market-memory-oligopoly",
        nodeIds: ["market-structure", "seller-count", "entry-condition", "interdependence", "oligopoly"],
        edgeIds: [
          e("market-structure", "distinguished-by", "seller-count"),
          e("market-structure", "distinguished-by", "entry-condition"),
          e("market-structure", "distinguished-by", "interdependence"),
          e("market-structure", "contains", "oligopoly"),
        ],
        decodedConclusion: "寡头以少数厂商、较强进入障碍和决策相互依存识别。",
      },
      {
        phraseId: "market-memory-monopoly",
        nodeIds: ["market-structure", "seller-count", "product-difference", "entry-condition", "monopoly"],
        edgeIds: [
          e("market-structure", "distinguished-by", "seller-count"),
          e("market-structure", "distinguished-by", "product-difference"),
          e("market-structure", "distinguished-by", "entry-condition"),
          e("market-structure", "contains", "monopoly"),
        ],
        decodedConclusion: "完全垄断以唯一卖者、没有十分近似替代品和进入障碍识别。",
      },
    ],
    selfTests: [
      { questionId: "market-structure-category-set", stage: "concept-identity", nodeIds: ["market-structure", "perfect-competition", "monopolistic-competition", "oligopoly", "monopoly"], edgeIds: [e("market-structure", "contains", "perfect-competition"), e("market-structure", "contains", "monopolistic-competition"), e("market-structure", "contains", "oligopoly"), e("market-structure", "contains", "monopoly")] },
      { questionId: "market-perfect-competition-core", stage: "relation-understanding", nodeIds: ["market-structure", "perfect-competition"], edgeIds: [e("market-structure", "contains", "perfect-competition")] },
      { questionId: "market-monopolistic-competition-core", stage: "application", nodeIds: ["market-structure", "monopolistic-competition"], edgeIds: [e("market-structure", "contains", "monopolistic-competition")] },
      { questionId: "market-oligopoly-core", stage: "application", nodeIds: ["market-structure", "oligopoly"], edgeIds: [e("market-structure", "contains", "oligopoly")] },
      { questionId: "market-monopoly-core", stage: "application", nodeIds: ["market-structure", "monopoly"], edgeIds: [e("market-structure", "contains", "monopoly")] },
    ],
    noviceRetelling: {
      prompt: "请用自己的话说明市场结构是什么、通常分成哪几类，以及判断时主要看哪些维度。",
      expectedNodeIds: ["market-structure", "seller-count", "product-difference", "entry-condition", "interdependence", "perfect-competition", "monopolistic-competition", "oligopoly", "monopoly"],
      expectedEdgeIds: [e("market-structure", "distinguished-by", "seller-count"), e("market-structure", "distinguished-by", "product-difference"), e("market-structure", "distinguished-by", "entry-condition"), e("market-structure", "distinguished-by", "interdependence"), e("market-structure", "contains", "perfect-competition"), e("market-structure", "contains", "monopolistic-competition"), e("market-structure", "contains", "oligopoly"), e("market-structure", "contains", "monopoly")],
      minimumNodeCount: 6,
      minimumEdgeCount: 4,
    },
  },
  {
    mnemonicId: "price-discrimination-levels-memory",
    mnemonicRevision: 2,
    conceptFrameId: "price-discrimination-concept-frame",
    conceptFrameRevision: 1,
    protocolVersion: "q0c3-novice-pilot-v1",
    introducedTerms: [
      { term: "价格歧视", nodeId: "price-discrimination" },
      { term: "同等级同质量", nodeId: "price-discrimination" },
      { term: "最高支付意愿", nodeId: "first-degree" },
      { term: "消费数量段", nodeId: "second-degree" },
      { term: "市场或消费群", nodeId: "third-degree" },
    ],
    decodeMap: [
      { phraseId: "price-discrimination-memory-definition", nodeIds: ["price-discrimination"], edgeIds: [], decodedConclusion: "价格歧视的前提是同等级、同质量的商品或服务向不同接受者采用不同价格。" },
      { phraseId: "price-discrimination-memory-first", nodeIds: ["price-discrimination", "first-degree"], edgeIds: [e("price-discrimination", "contains", "first-degree")], decodedConclusion: "一级价格歧视逐消费者、逐单位按最高支付意愿定价。" },
      { phraseId: "price-discrimination-memory-second", nodeIds: ["price-discrimination", "second-degree"], edgeIds: [e("price-discrimination", "contains", "second-degree"), e("first-degree", "contrasts-with", "second-degree")], decodedConclusion: "二级价格歧视按不同消费数量段定价。" },
      { phraseId: "price-discrimination-memory-third", nodeIds: ["price-discrimination", "third-degree"], edgeIds: [e("price-discrimination", "contains", "third-degree"), e("second-degree", "contrasts-with", "third-degree")], decodedConclusion: "三级价格歧视按不同市场或消费群定价。" },
    ],
    selfTests: [
      { questionId: "price-discrimination-definition", stage: "concept-identity", nodeIds: ["price-discrimination"], edgeIds: [] },
      { questionId: "price-discrimination-three-levels", stage: "relation-understanding", nodeIds: ["price-discrimination", "first-degree", "second-degree", "third-degree"], edgeIds: [e("price-discrimination", "contains", "first-degree"), e("price-discrimination", "contains", "second-degree"), e("price-discrimination", "contains", "third-degree"), e("first-degree", "contrasts-with", "second-degree"), e("second-degree", "contrasts-with", "third-degree")] },
      { questionId: "price-discrimination-first-degree", stage: "application", nodeIds: ["first-degree"], edgeIds: [] },
      { questionId: "price-discrimination-second-degree", stage: "application", nodeIds: ["second-degree"], edgeIds: [] },
      { questionId: "price-discrimination-third-degree", stage: "application", nodeIds: ["third-degree"], edgeIds: [] },
    ],
    noviceRetelling: {
      prompt: "请用自己的话说明价格歧视的定义前提，并解释一级、二级、三级分别依据什么区分。",
      expectedNodeIds: ["price-discrimination", "first-degree", "second-degree", "third-degree"],
      expectedEdgeIds: [e("price-discrimination", "contains", "first-degree"), e("price-discrimination", "contains", "second-degree"), e("price-discrimination", "contains", "third-degree"), e("first-degree", "contrasts-with", "second-degree"), e("second-degree", "contrasts-with", "third-degree")],
      minimumNodeCount: 4,
      minimumEdgeCount: 3,
    },
  },
  {
    mnemonicId: "public-goods-mechanism-memory",
    mnemonicRevision: 2,
    conceptFrameId: "public-goods-concept-frame",
    conceptFrameRevision: 1,
    protocolVersion: "q0c3-novice-pilot-v1",
    introducedTerms: [
      { term: "公共物品", nodeId: "public-goods" },
      { term: "非竞争性", nodeId: "two-properties" },
      { term: "非排他性", nodeId: "two-properties" },
      { term: "纯公共物品", nodeId: "pure-public-goods" },
      { term: "准公共物品", nodeId: "quasi-public-goods" },
      { term: "搭便车", nodeId: "free-rider" },
      { term: "市场供给不足", nodeId: "under-supply" },
      { term: "政府提供", nodeId: "government-supply" },
    ],
    decodeMap: [
      { phraseId: "public-goods-memory-features", nodeIds: ["public-goods", "two-properties", "private-goods"], edgeIds: [e("public-goods", "distinguished-by", "two-properties"), e("public-goods", "contrasts-with", "private-goods")], decodedConclusion: "严格公共物品具有非竞争性和非排他性，私人物品通常具有竞争性和排他性。" },
      { phraseId: "public-goods-memory-types", nodeIds: ["public-goods", "pure-public-goods", "quasi-public-goods"], edgeIds: [e("public-goods", "contains", "pure-public-goods"), e("public-goods", "contains", "quasi-public-goods")], decodedConclusion: "纯公共物品完整具备两项公共属性，准公共物品有一项表现不充分。" },
      { phraseId: "public-goods-memory-remedy", nodeIds: ["two-properties", "free-rider", "under-supply", "government-supply"], edgeIds: [e("two-properties", "causes", "free-rider"), e("free-rider", "causes", "under-supply"), e("under-supply", "causes", "government-supply")], decodedConclusion: "公共属性会引出搭便车，进而造成市场供给不足，材料给出的主要方向是政府提供。" },
    ],
    selfTests: [
      { questionId: "public-goods-features", stage: "concept-identity", nodeIds: ["two-properties"], edgeIds: [] },
      { questionId: "public-private-goods-contrast", stage: "relation-understanding", nodeIds: ["two-properties", "private-goods"], edgeIds: [e("public-goods", "contrasts-with", "private-goods")] },
      { questionId: "pure-quasi-public-goods", stage: "relation-understanding", nodeIds: ["pure-public-goods", "quasi-public-goods"], edgeIds: [e("public-goods", "contains", "pure-public-goods"), e("public-goods", "contains", "quasi-public-goods")] },
      { questionId: "public-goods-free-rider-remedy", stage: "application", nodeIds: ["free-rider", "under-supply", "government-supply"], edgeIds: [e("free-rider", "causes", "under-supply"), e("under-supply", "causes", "government-supply")] },
      { questionId: "public-goods-full", stage: "application", nodeIds: ["two-properties", "private-goods", "pure-public-goods", "quasi-public-goods", "free-rider", "under-supply", "government-supply"], edgeIds: [e("public-goods", "distinguished-by", "two-properties"), e("public-goods", "contrasts-with", "private-goods"), e("public-goods", "contains", "pure-public-goods"), e("public-goods", "contains", "quasi-public-goods"), e("two-properties", "causes", "free-rider"), e("free-rider", "causes", "under-supply"), e("under-supply", "causes", "government-supply")] },
    ],
    noviceRetelling: {
      prompt: "请用自己的话说明公共物品怎样识别、纯与准怎样区分，以及为什么可能出现市场供给不足。",
      expectedNodeIds: ["public-goods", "two-properties", "private-goods", "pure-public-goods", "quasi-public-goods", "free-rider", "under-supply", "government-supply"],
      expectedEdgeIds: [e("public-goods", "distinguished-by", "two-properties"), e("public-goods", "contrasts-with", "private-goods"), e("public-goods", "contains", "pure-public-goods"), e("public-goods", "contains", "quasi-public-goods"), e("two-properties", "causes", "free-rider"), e("free-rider", "causes", "under-supply"), e("under-supply", "causes", "government-supply")],
      minimumNodeCount: 6,
      minimumEdgeCount: 4,
    },
  },
];

module.exports = {
  schemaVersion: 1,
  conceptLearningSchemaVersion: "q0c3-concept-learning-v1",
  conceptLearningSpecifications,
  noviceRetellingProtocols: [
    {
      version: "q0c3-novice-pilot-v1",
      status: "review",
      evidenceLevel: "pilot",
      audience: "未系统学习当前主题、正在准备公务员考试的用户",
      independentFromAuthoring: true,
      minimumSampleSize: 5,
      passCriteria: {
        minimumParticipantPassRate: 0.8,
        maximumFalseClaimsPerParticipant: 1,
      },
    },
  ],
  conceptComprehensionTrials: [],
  holdBaseline: {
    specificationCount: 3,
    structurallyValidSpecificationCount: 3,
    trialCount: 0,
    expectedHoldCounts: { "missing-independent-novice-retelling": 3 },
    contentSha256: "2ce388470d9e75d4e288d2322ec7af7074d21bf86d2cfae04ec31f56c6cf20a5",
    authoringSha256: "b7a4cac03e8a0a230b137e7ccab7df21a3b342b8c067d4ef12e74be88e204dee",
    holdOwnerIdsSha256: "b389aa18655d45f0786ff056da8a1f2c50a2547f97e8adbdba1e199a860f7f9d",
    reason: "三个试点结构已可执行，但批量迁移前仍需独立新手完成无提示复述。",
  },
};
