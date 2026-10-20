# 政治 P3 V2 — S1 平台基础任务单

> 状态：Verified — 2026-08-28自动门禁与用户最小入口冒烟均通过
>
> 目标阶段：`legacy → foundation`
>
> 依据：DATA-001至DATA-012、STATE-001至STATE-010、MAP-012、WORK-013、VIS-014、SHIP-002至SHIP-005/012至SHIP-014

## 修改范围

- 新增 `miniprogram/services/knowledge-platform/`：阶段配置、政治只读adapter、焦点上下文纯状态和基础ViewModel投影。
- 新增 `scripts/validate-knowledge-platform-foundation.js`：验证契约、确定性、状态隔离和页面未接管。
- 更新本实施记录、政治profile和总入口中的实施状态。

## 明确不修改

- 政治、常识和笔记现有页面/WXML/WXSS与路由。
- 正式Markdown、关系源、review/release运行包和发布状态。
- 全局主题、主导航和分包配置。
- S0记录的常识273项页签基线债务与笔记32项warning。

## 实现要求

1. 将政治schema v3运行包只读映射为04的通用 `KnowledgePackage`，不复制或改写事实。
2. 显式输出导航、知识单元、语义块、正向关系、回忆项、来源引用和可重建索引。
3. 无法从当前包证明的精确块锚点必须进入diagnostics，不能猜测。
4. 状态以 `moduleId` 分桶；无效深链、跨模块ID和内容更新安全降级，绝不默认第一篇。
5. reducer和ViewModel投影为纯函数；时间由事件传入，相同输入输出相同。
6. 政治阶段配置为 `foundation`，常识和笔记保持 `legacy`；页面暂不读取该配置。

## 自动验收

- 通用包为37单元、42节点、39正向关系、37回忆项、37来源引用、643语义块，`buildTarget=review`且0可发布。
- adapter连续两次JSON结果相同，源包序列化前后不变。
- 导航父链、知识路径、关系端点、块ID和来源引用全部可解。
- 无焦点只能为system；选点后焦点/版本/来源正确；切活动不丢焦点。
- 沿关系换焦点和返回轨迹可逆；失效/跨模块深链不创建假焦点。
- `knowledgeContext:politics/common-sense/notes`键互不相同。
- 常识/笔记页面不引用新服务；政治现有页面行为和原校验保持不变。
- S0全部通过项继续通过；常识页签问题保持273，笔记warning保持32。

## 用户手测

S1没有视觉变化。完成后只需用户确认四个Tab及政治、常识、笔记原入口仍可打开；完整认知UI验收从S2开始。

## 回滚

- 删除/停用S1新增服务与校验器，政治阶段回到 `legacy`。
- 由于页面不引用新服务，回滚不处理页面状态、不修改数据包，也不影响常识和笔记。

## 实施结果

新增：

- `miniprogram/services/knowledge-platform/rollout.js`
- `miniprogram/services/knowledge-platform/politics-adapter.js`
- `miniprogram/services/knowledge-platform/context.js`
- `miniprogram/services/knowledge-platform/projectors.js`
- `miniprogram/services/knowledge-platform/index.js`
- `scripts/validate-knowledge-platform-foundation.js`

结果：

- 政治只读adapter输出42节点、37单元、39关系、37问答回忆项、37来源和643语义块。
- 通用包保持 `buildTarget=review`、0可发布；源包未被修改，连续构建结果完全相同。
- 状态支持无焦点、选点、活动切换、关系换焦点、20步轨迹上限、逆向返回、深链验证、内容版本失效和按模块存储键。
- 无关系/无回忆夹具自然降级为阅读，不创建默认第一篇。
- 基础ViewModel只输出当前模块与当前焦点，不向页面发送全库对象。
- 当前数据无法证明的39条关系块锚点和37张回忆卡块锚点以diagnostics保留，未进行猜测。
- 政治、常识、笔记现有页面均未引用新服务，因此本切片没有视觉或路由变化。

自动回归：

- S1门禁、政治目录/隔离/内容/关系/展现、常识数量/源文/现行法、笔记主校验全部通过。
- 常识独立页签问题仍为273，笔记搜索元数据warning仍为32，均与S0一致。
- 微信开发者工具36.6.0官方CLI成功打开原项目；该版本的 `engine build` HTTP端点返回 `Cannot GET /engine/build`，属于工具接口不可用，不记为项目编译失败，也不以其他UI自动化替代用户手测。

用户已确认四个Tab可见，政治、常识和笔记原入口均可正常打开。S1已进入 `Verified`，下一切片为S2首页与L0–L3知识地形。
