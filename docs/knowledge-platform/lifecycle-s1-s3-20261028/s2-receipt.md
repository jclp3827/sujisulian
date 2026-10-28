# S2 回执

新增公开授权为0；历史142/133/603/128/1681个ID逐条绑定当前精确正文及目标依赖。历史授权依据为2026-10-27公开决定；S1五项纠错按本轮定向授权留有前后摘要，不把AI审核当产品授权。新增批次需明确public-authorized、授权人/时间、独立复核及人工抽样回执、精确ID及摘要；语义或依赖变化不能沿用旧摘要。candidate构建只写显式隔离目录，不能替换public data。

有效撤回唯一来源为cloudfunctions/learningBank/effective-withdrawals.json（目前0条真实撤回）。新增撤回须写明bank/ID/具体contentRevision或*、日期与原因。生成、当前服务请求及发布/回退验证优先执行；口诀依赖被撤回题目时一起退出。旧产物无当前授权/撤回摘要或旧handler不支持侧载撤回时拒绝回退。离线已取得正文无法立即擦除；本轮不建在线热更新系统。部署/回退必须先运行validate-learning-bank-release.js并携带当前侧载台账；无部署授权。

生成先收集完整内存输出，再在隔离目录全部写入并校验，受控替换data与两份练习身份表；异常恢复旧整套输出。validate-learning-bank-lifecycle-s2.js注入生成中断/第二处替换失败，证明旧数据和两张身份表摘要保持。--check严格只读，额外旧文件也拒绝。当前实际546个生成输出（544个data文件及2个客户端身份表），重复生成完全一致，不沿用历史545数字。

快记历史P3冻结证据不改：4个实现摘要为B1云端有界缓冲/B5加载异常状态及回源跟踪的合法演进。新增current-reuse-revalidation精确记录当前五文件、检查脚本及完整结果摘要；任何文件/脚本漂移必须重验。build-notes-memory --check-only恢复通过，8样板/125预览/正式准入0/1HOLD不变。

服务修正common-mnemonic领域筛选；start/batch/hydrate/resume按完整result封装加1KiB运行时元数据预留校验64KiB，首条过大返回RESPONSE_TOO_LARGE，不成功返回再由客户端拒收。目录/bootstrap维持独立512KiB元数据合同（现有bootstrap本来大于64KiB），正文接口保留5条/15队列、payloadBytes及nextOffset。预算/错误/部分页的正反例和空目录回归通过。

自动验收：lifecycle-s2、learning-bank-function、public-learning-page-runtime、learning-bank-buffer、learning-bank-practice-buffer、build-learning-bank-function --check、validate-learning-bank-release、build-notes-memory --check-only。旧validate-notes-memory-v5含历史4张准入数断言，与当前正式准入0不同，原脚本未改，不用它宣称通过；当前专项回归覆盖实际快记合同。人工抽样和真机待验，未合并/推送/上传/部署。
