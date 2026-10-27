# photo-segment-scf：现有单个SCF的最小付费路径

## 2026-10-27 正式版公众支付候选（尚未部署）

本分支新增 `usage-store.js`，用**现有 CloudBase 文档数据库**保存按微信身份绑定的 3 次免费预览、最近一笔付费订单的 3 次机会，以及每日 AI 调用计数；不需要照片存储桶，数据库不存照片或处理结果。每次调用 BDA 前先在数据库事务中扣次与预留预算，事务失败则不调用 BDA。清除手机缓存、云函数冷启动或并发请求均不重新发放免费次数。已付款次数可通过微信查单及服务端记录恢复。测试付款人仍走原测试路径，不作为公众并发保证的验收证据。

该候选**没有上传小程序、没有部署 SCF，也没有打开正式版公众开关**。需要在现有环境创建仅管理员可读写的 `photo_preview_accounts`、`photo_preview_daily_budget` 两个集合，确认 SCF 运行角色可访问、真实事务冲突处理及配额；然后安装锁定的 `@cloudbase/node-sdk`，部署同一个 `photo-segment-scf`。构建命令为 `node scripts/build-photo-scf.js <空目录>`，随后在输出目录 `npm ci --omit=dev`，再组包。服务器需显式设置 `PHOTO_CLOUDBASE_ENV`（现有环境 ID）、正整数 `PHOTO_MAX_AI_CALLS_PER_DAY`。只有数据库与正式支付、回调、隐私、预算和真实流程逐项验收后，才设置 `PHOTO_PUBLIC_ENABLED=true`、`PHOTO_DATABASE_ACCEPTED=true`、`PHOTO_FREE_RELEASE_ACCEPTED=true`、`PHOTO_REAL_FLOW_ACCEPTED=true`、`PHOTO_CALLBACK_ACCEPTED=true`；其余原开关也须保持已验收值。若任一项缺失，公众 AI 与新购均关闭。

正式发布顺序：先备份当前 SCF 版本和配置；创建集合并用目标 SCF 角色做只读/事务/并发探针；部署候选但保持 `PHOTO_PUBLIC_ENABLED=false`，验证现有测试付款不回退；在 iOS 和 Android 上核对公众微信身份、清缓存、真实支付、查单、发货、退款及客服；再打开公众服务端门，上传并提交正式版审核，通过后发布。关闭新购用 `PHOTO_NEW_ORDERS_ENABLED=false`，停止公众新请求用 `PHOTO_PUBLIC_ENABLED=false`；不要删除已付账本或关闭已有订单查询/售后通道。每一步记录版本、配置及微信后台回执。

本地执行 `node scripts/validate-photo-public-ledger.js` 与 `node scripts/validate-photo-preview-export.js` 验证了模拟事务和完整客户端流程；模拟测试不等于 CloudBase 真实事务、渠道验收或正式版上线。以下 2026-10-19 说明是前一方案的历史记录。

2026-10-19：本地增加微信虚拟支付接入，**未部署，现网仍是用户已通过的内部联调版本**。不新增付费资源、CloudBase/MySQL、照片桶或独立订单服务；沿用已确定的BDA每月免费1000次线路。原内部口令请求保留，仅开发/体验诊断可用，不成为正式付费鉴权。

## 当前停止条件（优先于此前风险取舍）

付费现金直购缺少可靠跨实例消费约束，已复现两个实例重复请求。当前 `purchase.js` 的 `CONSUMPTION_SAFE=false` 是代码硬门，不是可手动打开的环境开关：新下单、重新拉起付款、付费分割全部拒绝，`features` 返回购买/处理关闭及 `consumptionSafe=false`。客户端也必须取得明确安全能力后才可能显示可购买状态。查询/既有结果发货不受新购硬门影响。

人工售后、签名和暖实例内存不能替代该约束。不得仅完成实付或设备测试便开放收费。最小缺口及官方依据见 `../../docs/photo-poc/engineering-candidate/dual-path-20261019/SECURITY-FINDINGS.md`；本轮不建设数据库。

## 最小路径（当前仅本地模拟验证）

1. 手机标准化照片并确认收费/上传说明。
2. 同一个SCF用 `wx.login → code2Session` 验证归属，为固定100分、一个道具生成微信虚拟支付签名。只传输入摘要/尺寸，不在付款前上传照片。
3. 微信客户端付款后，SCF通过 `query_order` 查实金额、归属请求、现网和退款/发货状态。客户端成功回调不作为付款依据。
4. 手机在本机记录“已提交”后，只发送一次工作图。SCF复用原BDA调用与运行角色，返回临时透明人像引用；手机下载、原生解码、保存并继续本地白/蓝底、裁剪、国考生成与导出。
5. 人物结果在手机载入后，立即使用微信 `notify_provide_goods` 通知发货，并再次调用 `query_order` 核实原始状态为数值4才确认成功；接口返回成功、查单仍为2/3或异常时不冒认已发货。推送只查询微信状态，不调用AI，未收到人物结果时不冒认已交付。

**分割状态白名单：仅最近服务端查单原始状态 `orderStatus === 2`、付款金额/退款等检查通过时才可派发BDA。** 发货中3、已发货4、退款5/7/8、部分退款、未付、缺失/未知状态或查单失败均拒绝。该检查不能使跨实例“查到2→调用BDA”成为原子动作。当前付费硬门仍关闭。

`features/purchase/payment/status/segment/delivered` 均复用当前函数URL；`/notify` 为JSON安全加密推送。`payment` 只可重新拉起同一笔已取消且查实未支付订单，不在上一笔未确认时另建付款。旧CloudBase/独立订单代码仅保留兼容，不用于本路径。

## 产品处理边界

- 正常客户端不自动重发分割；同一暖实例用有限内存保护并发请求。**它不是持久化锁，不保证冷启动或多实例下严格一次调用，也不是1000次/月硬停调机制。** 未解决前阻塞收费，本轮不另建数据库。
- 同一结果反复换底/裁剪/下载不再收费。仅已取得的结果引用可重下；提交结果未知、退出后未拿到引用、地址到期/本机结果丢失均转人工售后，不补跑AI、不新增后台补偿任务。
- 供应商URL约30分钟有效，本机保守使用29分钟；已保存结果24小时后在下次进入/下载清理。本机保存带签名的订单/结果凭据，不建立跨设备恢复。签名凭据不是付款证明，查单始终由微信决定。
- 未取得结果不自动再次付款。Android等通过小程序原生客服联系开发者，在微信虚拟支付后台核实退款；iOS向App Store申请，Apple决定。复制订单号不等于提交售后或退款。
- 不存照片像素到项目云端，不新增照片桶，不宣称控制供应商留存。

## 本地打包与配置

`node scripts/build-photo-scf.js /新的临时目录` 复制7份源码和一份清单，**运行依赖仅Node内置模块，无npm安装**。部署目标保持现有 `photo-segment-scf`，Nodejs18.15、`index.main_handler`、60秒；不得新建第二个订单函数。BDA单请求绝对超时15秒，无自动重试。

角色沿用 `PhotoSegmentSCFRole`，使用context或环境的完整临时凭证三元组；现有 `BDA_REGION=ap-guangzhou`、内部 `PHOTO_API_TOKEN` 原样保留。用户自行在控制台配置 `PHOTO_APP_ID/APP_SECRET`、`PHOTO_VIRTUAL_OFFER_ID/APP_KEY/PRODUCT_ID`、`PHOTO_PUSH_TOKEN/PUSH_AES_KEY`；不在聊天、客户端或仓库填写密钥。

沿用现有通道、隐私、预算与真实验收开关；不再要求数据库、维护密钥或定时任务。初始 `PHOTO_NEW_ORDERS_ENABLED=false`、`PHOTO_PROCESSING_ENABLED=false`，客户端 `PAID_ENABLED=false`、`SCF_PURCHASE_CONFIGURED=false`。第一笔实付仍须具体授权和既有测试付款人白名单；不伪造正式验收门。

## 剩余必要验收

只对这次差异验证既有SCF更新、合法域名、实际微信查单/安全推送/发货、原生客服入口和各渠道退款说明。当前未部署、未改消息路由、未发生真实交易/退款或新的BDA调用。免费1000次不等于零超额风险；已知配额不足时人工关闭处理开关，不建设全局自动额度系统。

原内部联调整体通过反馈继续有效，不重复要求重测。现有函数域名及供应商图片域名沿用客户端 `platform/scf-segmentation.js` 的已验证配置。正式收费、额外预览、提交审核和发布仍分别依原授权边界处理。
