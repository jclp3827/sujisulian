# 本轮独立上下文协议

1. 三个 codex exec --ignore-user-config --ephemeral --sandbox read-only --json 尝试在推理前失败，原始流/提示词留在 cli-attempts；未计通过，未改模型/配置。
2. 使用 collaboration.spawn_agent，fork_turns=none，不指定模型覆盖，不继承父历史。只给工作目录、功能需求、只读与记录边界，不提供规范位置、组件 ID、状态答案或预期实施选择。
3. 首轮 A/B/D 有历史摘要读取或默认全量检查间接扫描模型数据的边界缺口，保留原答复/原命令但 finalAccepted=false，不追认严格通过。
4. 重新创建 A2/B2/D2：禁止个人记忆、父对话、其他树、历史专项正文/汇总、evidence/评估结果、题库或打包数据内容；禁止默认全量验证、audit-base、自测和业务测试。允许当前工程检索、完整登记、消费者查询和单独候选范围核验。目录/文件名发现允许；A2/D2 初次枚举漏排嵌套 models 路径名，均披露且未读取内容。
5. 每条命令经 scratch record.py 包装，保存唯一标签、argv/cwd/UTC/退出码、原字节 stdout/stderr 和 SHA256。记录器后来增加 --echo 只为显示同一原始流，不改变被执行命令。每个上下文直接写外部完整报告；最终复制/打包不改写原答复。
6. A2 为常识普通下一步，B2 为笔记记忆反馈，D2 为行测速练专项。三个新上下文独立从 AGENTS 发现索引，查询并核对实现/消费者，识别 approved 原则/draft 实现/历史专项和模块例外，实际验证候选激活范围。没有提前告知对应 Pattern 答案。
7. 查询无命中退出 1 不代表工程检查失败或无可用能力。D2 换角色词后找到专项登记。工具显示截断不代表文件日志截断，执行者补读完整关系，原流完整保留。
8. 子上下文未执行全量静态/自测；外层完整静态和 41 项结果独立在 raw-preintegration。发现与方案选择不能证明动态交互、视觉、设备或发布。

最终采用 /root/ds2_preint_clean_a、/root/ds2_preint_clean_b、/root/ds2_preint_clean_d。cold-raw-manifest.json 列出六份原答复、真实命令数、归档及哈希；A/B/D 不计最终通过，A2/B2/D2 计入。原始报告与原字节命令归档优先于父对话摘要。
