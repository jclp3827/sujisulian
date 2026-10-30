---
name: huasheng-knowledge
description: 完成花生开小灶任务时，必需的文档规则、历史决定或来源缺失、失效、冲突时按需恢复和校验证据；信息充分的普通修改不启动知识检索。
---

默认L0直接工作，不为证明不需检索而搜索。L1仅补必需缺口；L2规则、验收或替代判断须有适用权威依据。新会话不构成必搜理由，不让用户选择模式。已有证据完整且版本、范围有效时只重验复用，不重复查询。

项目治理入口是 `docs/knowledge-platform/09-verification-and-rollout.md` 的“文档准入与精确知识恢复”，登记为同目录 `document-registry.json`。专项规则和进度仍由原有文件维护，登记不是新产品合同。实际工程/云端状态另读相应源码、测试或线上身份，不由文档批准推断。

先检查是否有获准的 `scripts/knowledge/source.json`。缺少绑定时，明确正式知识未启用，可读取现有文档做限定盘点，但不得伪造证据ID或宣称通过固定来源验证。`technical-fixture` 来源仅用于隔离验收，回答须保留其历史/技术身份，不得作为现行规则批准。其他工作树未整合能力时不能调用此树冒充自身正式知识源。

需要检索且绑定有效时：

- 从用户自然语言自主提取线索，执行 `python3 scripts/knowledge/search.py <自然线索> --limit 20`；术语精确匹配优先，可按真实缺口换线索，不注入题库答案。历史或未审资料用 `--all`，仍按历史/待审身份说明。
- 查看每项 `verified`、`registration`、`authority_routes`、`scope_verdict` 及 `source_kind`。范围拒绝查看 `scope_followups`；必要时用 `--read-section <路径> <真实标题>` 读取已准入章节。返回量不足不能声称已读完整章节；重复标题和越界须拒绝。
- 词面反复未命中或命中均越界时，先看输出的 `available_topics`，必要时用 `python3 scripts/documentation-context.py --topic <相关主题>` 定位已登记章节，再补读相关原文。不要把某组词未命中当成“项目没有规则”，也不要无目的遍历全部资料。
- 对“当前是否执行/验收/集成”或替代关系的结论，核对命中文档的范围/历史提示和同主题后续记录，不能把单条旧状态当完整时间线。工具会给出文档范围提示入口；已核验过的完整上下文可直接重验复用，不为新会话重复检索。位置真实仍不保证语义支持。
- 原文、章节和行号必须来自绑定提交。`python3 scripts/knowledge/verify-citation.py <已有证据JSON>` 可重验而不重搜；不能取另一工作树当前行号。
- 将工具原始JSON写入任务临时目录的 `evidence.json`；`answer.json` 仅包含 `claims`，每项为 `text`、`evidence_ids` 及可选 `kind`。`current-rule` 要求正式获准来源和对应范围批准；隔离历史试验用 `historical`。无适用证据时明确拒绝相应判断，不编造ID。
- 执行 `python3 scripts/knowledge/check-answer.py <answer.json> <evidence.json>`，最终有来源回复原样使用该工具JSON，来源由程序生成。不得另加手写位置或通过额外展示字段绕过校验。工具返回无效就报告无法核验。位置有效还需人工/独立语义评审，不能将同段关键词当支持。

源、登记或工具改变时明确重新审查绑定；不更新哈希来掩盖来源变化。缓存损坏时先停止使用，再执行 `python3 scripts/knowledge/rebuild.py` 从固定Git对象显式重建，不安装服务或建立其他索引权威。

验收中L0不调用检索，连续复用使用同一会话，恢复题使用独立新上下文且不提供答案或关键词。分别记录必要检索、无意义检索、复用、召回、证据有效性、语义正确性及环境失败；不以Skill调用率作为目标。Skill适用于实际包含本入口及配套工具的工作树；治理与工具获准接入main后，新会话从其AGENTS发现本入口。旧聊天与未集成的旧树不自动继承，正式来源绑定仍须单独获准。
