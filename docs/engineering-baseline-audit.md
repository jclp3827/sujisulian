# 工程基线审计

更新时间：2026-06-13

## 当前结论

当前项目已经具备继续功能推进的基础：核心页面、静态知识库、训练题生成器、认知训练入口和本地质检脚本都能通过校验。工程侧已完成一轮收口，重点解决了文档基线、笔记聚合顺序、训练参数容错、判题逻辑复用、资源配置模块格式、图片引用校验和训练生成器校验。

## 已完成治理项

- 本地项目已初始化 Git，并挂接远端 `git@github.com:jclp3827/sujisulian.git`。
- `README.md` 已从云开发模板改为小程序能力说明，并补充校验命令。
- `.gitignore` 已覆盖 PDF 提取产物、候选图、Python 缓存、日志和开发工具私有配置。
- `miniprogram/models/note-catalog.js` 已把 `graphic` 放回正常聚合流程，移除 `module.exports` 后追加模块的副作用写法。
- `miniprogram/utils/config/assets.js` 已统一为 CommonJS 导出，匹配项目内 `require` 风格。
- `miniprogram/pages/training/session/index.js` 已增加训练参数解析容错，损坏参数不再直接抛异常。
- `miniprogram/utils/answer-validator.js` 已抽出通用判题规则，训练页不再内嵌判题实现。
- `scripts/validate-notes.js` 已补强图片引用、训练生成器、数组空洞、导图深度和模块加载失败校验。
- `scripts/validate-training.js` 已新增，用于独立校验训练题生成和判题规则。
- `scripts/graphic-assets-manifest.json` 已生成图形推理正式图片清单，模型侧使用云资源相对路径。
- `note-quantity.js.bak`、`note-quantity.js.broken` 已归档到 `docs/archive/`，不再放在小程序模型目录。

## 当前产品进度

| 模块 | 当前状态 | 说明 |
|---|---|---|
| 训练入口 | 可用 | 基础计算、资料分析和认知训练入口已存在。 |
| 笔记链路 | 可用 | 笔记首页、单科地图、分类列表、详情页链路已成型。 |
| 资料分析 | ready | 8 分类、32 知识点。 |
| 数量关系 | ready | 13 分类、21 知识点。 |
| 判断推理 | ready | 5 分类、19 知识点。 |
| 言语理解 | ready | 5 分类、16 知识点。 |
| 图形推理 | ready | 7 分类、36 知识点，已支持 `mind-map` 结构导图和局部图。 |
| 图形图片资源 | 云托管收口中 | 03-24 页已完成首轮局部图挂载，模型使用 `graphic/*.png` 相对路径，源图在 `assets-source/graphic/`，清单见 `scripts/graphic-assets-manifest.json`。 |

## 质量门禁

功能推进前建议至少运行：

```bash
node --check miniprogram/models/note-catalog.js
node --check miniprogram/pages/note-detail/index.js
node --check miniprogram/pages/training/session/index.js
node scripts/validate-notes.js
node scripts/validate-training.js
```

## 后续推进顺序

1. 将 `scripts/graphic-assets-manifest.json` 中的图形推理正式图片上传到云存储 `note-resources/graphic/`。
2. 使用微信开发者工具做一次编译和核心页面走查，重点检查云图加载、导图展开/折叠和图片错误兜底。
3. 后续其他模块沿用“结构导图 + 局部图 + manifest + 云相对路径”的资源模式。
4. 再扩训练绑定和短例题覆盖，不优先追求所有知识点一次性绑定训练。

## 保留风险

- 当前工作区有未提交改动；后续提交前应再次运行完整校验。
- 视觉和小程序运行时还需要微信开发者工具验证，命令行只能覆盖语法、数据结构和生成器逻辑。
- 图形推理仍有 09 以后候选图片未确认；这些图片不能自动进入正式知识点。
