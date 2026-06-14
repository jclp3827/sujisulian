# 图形推理 PDF 知识映射与资源治理

本文件维护图形推理 PDF 页图到结构化知识点的归属关系，以及正式图片资源的发布口径。当前图形推理已完成局部图人工确认和本地挂载，后续运行态图片统一走云资源相对路径。

## 工作模式

- 图形推理内容采用“结构导图 + 局部图”模式，不放整页 PDF 图。
- 已确认图片在模型中使用 `graphic/*.png` 相对路径，由 `CLOUD_IMG_PREFIX` 拼接为云端正式资源。
- 本地 `assets-source/graphic/` 只作为生产源图和上传前校验材料，不作为小程序运行路径。
- 未确认归属的截图只能进入候选目录或文档清单，不进入正式知识点。
- 每轮扩展内容后必须运行 `node scripts/validate-notes.js`。

## 页图映射

| PDF页图 | 页面主题 | 当前分类 | 当前知识点 | 校验结论 | 资源状态 |
|---|---|---|---|---|---|
| tmp_pdf/02.png | 图形推理复习与考试建议 | 暂不进入正式分类 | 暂不绑定知识点 | 偏方法论和复习建议，不是具体规律知识点。 | 不挂图 |
| tmp_pdf/03.png | 命题形式与解题入口 | overview 命题形式&解题思路 | proposition-form 命题形式 | 归属为模块级题型入口。 | 已挂局部图 |
| tmp_pdf/04.png | 解题思路与定性观察续页 | overview 命题形式&解题思路 | solving-workflow 解题思路 | 归属为模块级解题流程。 | 已挂局部图 |
| tmp_pdf/05.png | 位置规律导图页 | position 位置分析 | movement | 主要归属移动规律。 | 已挂局部图 |
| tmp_pdf/06.png | 定量分析页 1 | quantitative 定量分析 | point-count / line-count | 归属交点类和线条类。 | 已挂局部图 |
| tmp_pdf/07.png | 定量分析页 2 | quantitative 定量分析 | area-count / angle-count | 归属封闭面类和角度类。 | 已挂局部图 |
| tmp_pdf/08.png | 定量分析页 3 | quantitative 定量分析 | element-count | 归属元素类。 | 已挂局部图 |
| tmp_pdf/09.png | 曲直性细化页 | qualitative 定性分析 | curvature | 归属曲直性的位置、特殊线等细分口径。 | 已挂局部图 |
| tmp_pdf/10.png | 线条类页 | quantitative 定量分析 | line-count | 归属笔画、奇点、捏合技巧等线条类口径。 | 已挂局部图 |
| tmp_pdf/11.png | 交点类页 | quantitative 定量分析 | point-count | 归属曲直交点、切点、内部交点、外框交点、出头点。 | 已挂局部图 |
| tmp_pdf/12.png | 角度类页 | quantitative 定量分析 | angle-count | 归属数角规则、直角、有角无角和扇形角度递增。 | 已挂局部图 |
| tmp_pdf/13.png | 封闭面类页 | quantitative 定量分析 | area-count | 归属部分面、相同形状面、最大面特征。 | 已挂局部图 |
| tmp_pdf/14.png | 元素类页 | quantitative 定量分析 | element-count | 归属元素数量、换算、内部相同、相邻共同元素、数部分。 | 已挂局部图 |
| tmp_pdf/15.png | 图形间关系页 | special-type 特殊题型 | graphic-relation | 归属相离、相交于点、相交于线、相交于面。 | 已挂局部图 |
| tmp_pdf/16.png | 功能元素页 | special-type 特殊题型 | functional-element | 归属标记点、线、面、角和特殊标记关系。 | 已挂局部图 |
| tmp_pdf/17.png | 黑白块页 | special-type 特殊题型 | black-white | 归属黑白块对称、面积、数量、连接、相邻比较。 | 已挂局部图 |
| tmp_pdf/18.png | 汉字推理页 | special-type 特殊题型 | character-reasoning | 归属结构、样式、属性、数量和拼音/起笔等特殊口径。 | 已挂局部图 |
| tmp_pdf/19.png | 数字推理页 | special-type 特殊题型 | number-reasoning | 归属数字属性、封闭面、遍历和数字运算。 | 已挂局部图 |
| tmp_pdf/20.png | 字母推理页 | special-type 特殊题型 | letter-reasoning | 归属字母属性、数量、元素位置、字母顺序和写法。 | 已挂局部图 |
| tmp_pdf/21.png | 立体展开图页 | stereoscopic 立体图形 | stereo-unfold | 归属六面体、四面体、相对面、公共边、公共点。 | 已挂局部图 |
| tmp_pdf/22.png | 立体截面图页 | stereoscopic 立体图形 | stereo-section | 归属六面体、圆柱体、圆锥体截面。 | 已挂局部图 |
| tmp_pdf/23.png | 立体视图页 | stereoscopic 立体图形 | stereo-view | 归属三视图、压平规则、有线无线和遮挡。 | 已挂局部图 |
| tmp_pdf/24.png | 立体拼合页 | stereoscopic 立体图形 | stereo-combine | 归属数个数、试拼、分层画图法、分层凑数法。 | 已挂局部图 |
| tmp_pdf/25.png | 综合候选页 | 综合总结，暂不新增分类 | 可回填到相关知识点 | 不独立建知识点。 | 待后续复核 |

## 当前结构状态

| 范围 | 状态 | 说明 |
|---|---|---|
| 图形推理整体模块 | 已完成首轮挂图 | 当前为 7 个分类、36 个知识点。 |
| 命题形式&解题思路 | 已落地 | 03/04 已拆为 `proposition-form` 和 `solving-workflow`。 |
| 定性分析 | 已挂核心局部图 | 曲直性、对称性、样式、整体与部分、封闭与开放。 |
| 定量分析 | 已挂核心局部图 | 交点、线条、封闭面、角度、元素均已按页图精修。 |
| 位置分析 | 已补结构 | `movement` 已按位置规律导图精修并挂局部图。 |
| 特殊题型 | 已扩展 | 背景图、对称图、分割图、图形间关系、功能元素、黑白块、汉字、数字、字母。 |
| 六提示图形特征 | 已完成文字结构 | 平行、圆、笔画、连接、直角、数量加减提示。 |
| 立体图形 | 已挂核心局部图 | 展开图、截面图、视图、拼合已完成首轮挂图。 |
| 图片资源 | 云托管收口中 | 模型使用 `graphic/*.png`，源图在 `assets-source/graphic/`，清单见 `scripts/graphic-assets-manifest.json`。 |

## 后续工作建议

1. 将 `scripts/graphic-assets-manifest.json` 中列出的正式图片上传到云存储 `note-resources/graphic/`。
2. 上传后用微信开发者工具走查图形推理核心页面，确认云图加载、错误兜底和导图展开折叠正常。
3. 后续其他模块沿用“结构导图 + 局部图 + manifest + 云相对路径”的模式。
4. 本地源图可继续保留为生产材料，但不要作为运行态路径进入模型。
