# 政治 P3 V2 — S3B 语义阅读与锚点闭环任务单

> 状态：Verified — 2026-08-28 自动门禁、用户 UI 手测及偏好滚动缺陷闭环通过
>
> 目标阶段：完成 `workbench`
>
> 依据：DATA-004至DATA-007/012、STATE-006/009、WORK-008至WORK-013、VIS-004/007至VIS-010/013、SHIP-003至SHIP-005/012至SHIP-014

## 当前基线与数据实情

- S3A已通过自动门禁和用户 UI 手测，政治为 `workbench`；常识、笔记为 `legacy`。
- 政治运行包仍为42个导航节点、37个知识单元、39条关系、37个回忆项、643个内容块、0个可发布。
- 当前643块实际结构为39个heading、567个paragraph、37个list；语义为606个plain、37个contrast。关系和回忆的精确块引用当前均为空，构建诊断已明确记录，页面不得伪造依据锚点。
- 工作区包含用户此前内容加工、常识校对和政治P3成果；本切片只改精确范围，不重置或覆盖其他修改。

## 本切片交付

1. `FocusWorkbenchViewModel.readingStage` 直接输出同一 `KnowledgeUnit.blocks` 的稳定顺序、结构、显式语义、页内提纲、来源和锚点，不再由页面读取另一份正文块。
2. 通用渲染覆盖heading、paragraph、list、table、quote、callout、media和未知kind降级；显式definition、conclusion、hierarchy、sequence、condition、exception、contrast、evidence使用认知标签增强，未知semantic降为plain。
3. 重点透镜只强调显式重点语义，不隐藏普通正文、条件或例外；政治当前只会真实增强已标记的contrast，不扫描关键词自动标红。
4. 专注阅读隐藏辅助舞台与ActivityDock，但保留知识身份、退出入口、来源/纠错可达，并保持当前语义块位置。
5. 字号、行距和重点偏好独立保存；长文首批24块、后续每批16块，顺序和最后一块始终可达。
6. 新增 `OPEN_SOURCE_BLOCK / RETURN_FROM_SOURCE / UPDATE_READING_SNAPSHOT`：有效blockId定位并短暂强调，返回恢复原活动、关系预览或回忆状态；失效ID回知识顶部并明确提示。
7. 搜索结果仅补稳定blockId深链；不提前实现S4上下文搜索、问题解析或排序重构。

## 精确修改范围

- `miniprogram/services/knowledge-platform/context.js`：阅读锚点、返回目标和阅读快照事件。
- `miniprogram/services/knowledge-platform/projectors.js`：纯语义块与阅读舞台投影。
- `miniprogram/subpackages/politics/detail/index.*`：语义流、显示偏好、专注阅读、分批渲染和锚点恢复。
- `miniprogram/subpackages/politics/search/index.js`：现有搜索结果附加确定性正文块锚点。
- `scripts/validate-knowledge-platform-reading.js`：全部kind/semantic、未知降级、长文、锚点与页面集成门禁。
- 本任务单、README、政治profile和当前实施记录。

## 明确不修改

- 正式Markdown、目录/关系源、review/release包、风险状态和发布资格。
- 不根据文字形态猜definition/condition/exception，不生成摘要、关系或回忆依据。
- 不实现S4四类路线、上下文搜索、范围化回忆、掌握度或学习进度。
- 不迁移常识和笔记，不改主导航、全局主题和分包。
- 不为37篇政治内容逐段加卡片，不引入第三方Markdown渲染器或Obsidian运行依赖。

## 自动验收

1. 所有已声明kind和semantic及未知值均完整、确定性投影，fallback不丢文本。
2. 正文块ID、顺序、总数与canonical package完全一致；页面data只接当前焦点阅读ViewModel。
3. 24/16分批覆盖57块最长文章，目标锚点在未加载批次时自动扩展且最后一块可达。
4. keyPoints只改变强调标识；前后块ID和内容完全一致。
5. 有效blockId定位、返回原活动/预览；失效和跨知识blockId安全回顶部并提示。
6. 字号/行距/重点独立持久化；专注模式进出不更换焦点或重置锚点。
7. S1/S2/S3A、政治内容/关系/展现、常识和笔记主门禁保持基线。

## 用户手测

1. 选择长知识点进入阅读，确认正文是连续文章流，标题、列表和易混边界有清楚层级，末尾内容可达。
2. 切换普通/重点透镜，确认只增强明确语义，不隐藏正文；切换字号和行距后内容不裁切。
3. 在正文中部进入和退出专注阅读，确认仍停留在同一知识和附近位置。
4. 从带有效锚点的深链进入时确认定位与高亮；当前政治关系/回忆无块锚点时必须诚实显示知识级追溯，而非虚假“查看依据”。
5. 从搜索正文命中进入，确认落到对应内容块；返回后搜索页仍保留。

## 回归、回滚与遗留

- 常识和笔记只做入口、数量/主校验及未引用平台服务回归。
- 失败时恢复S3A阅读承载，政治仍保留已Verified的工作台与关系链；不删除知识、关系、纠错记录或偏好。
- 精确关系和回忆块引用必须未来从正式内容/关系加工链补齐；S3B只消费和诚实降级，不在UI补造。

## 实施证据

- `readingStage` 已直接投影canonical `KnowledgeUnit.blocks`，37篇共643块的ID、顺序和正文完整保持；页面不再用旧source point正文作为第二套阅读流。
- heading、paragraph、list、table、quote、callout、media及未知kind均有确定性渲染/降级；全部契约semantic可识别，未知semantic降plain。政治现有37个contrast获得显式边界形态，其余606个plain未被猜测改写。
- 显示偏好已按字号、行距、重点独立保存；重点透镜不删块。专注阅读保留知识身份、来源与纠错入口，并以稳定blockId恢复附近位置。
- 长文按24块首批、16块续批；最长57块夹具通过24→40→56→57完整到达，深链目标在后批时直接扩展到目标。
- `OPEN_SOURCE_BLOCK / RETURN_FROM_SOURCE / UPDATE_READING_SNAPSHOT` 已实现有效锚点、跨知识/失效锚点降级及关系/回忆来源返回。搜索正文命中已附canonical blockId深链。
- 关系39条和回忆37项当前均没有正式块锚点，UI明确显示知识级追溯，不出现虚假依据按钮；该数据缺口仍由上游加工链负责。
- S1/S2/S3A及政治展现门禁通过；微信开发者工具官方CLI预览编译成功，政治分包84.9 KB，未使用Computer Use。
- review/release、11个风险页和0可发布状态未改变；常识、笔记未接入新平台服务。
- 用户手测发现字号/行距切换会主动滚到正文锚点；已从根因移除偏好切换时的工作台重投影，并增加“不触发主动滚动”门禁与微信CLI复验，问题闭环。
