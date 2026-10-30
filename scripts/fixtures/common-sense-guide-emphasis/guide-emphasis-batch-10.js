// Display-only: reviewed plant organs and seed classification.
module.exports = {
  'biology-health::vegetative-organs': { contentHash: '2b7ed501', terms: ['根、茎、叶', '营养器官'], reason: '连接器官名单与所属类别。' },
  'biology-health::reproductive-organs': { contentHash: '6a3e6766', terms: ['花、果实和种子', '被子植物'], reason: '突出器官名单，同时保留被子植物的适用范围。' },
  'biology-health::gymnosperm-seeds': { contentHash: 'a28aebaa', terms: ['没有果皮包被', '不形成'], reason: '连接缺少果皮的结构特征和不形成果实的结论。' },
  'biology-health::angiosperm-seeds': { contentHash: 'be5d4cf5', terms: ['种子被包在果皮之内', '不是同一结构'], reason: '连接包被关系与种子果实的结构区别。' },
  'biology-health::cotyledon-classification': { contentHash: '6fc5d2b3', terms: ['1片子叶', '2片子叶', '胚中的子叶数'], reason: '保留两类数值及所数的是胚中子叶。' },
  'biology-health::edible-roots': { contentHash: '3435167b', terms: ['红薯、胡萝卜和甜菜'], reason: '突出食用实例清单，根的类别由标题和紧邻正文承担。' }
};
