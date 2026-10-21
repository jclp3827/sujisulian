# 国考照片最小托管服务端（BDA 本地结果方案，付费保持关闭）

**当前主线修正（2026-10-19）：** 正式目标为现有单个 `scf/photo-segment`，复用本目录微信身份与虚拟支付协议模块；独立 `scf/photo-orders` 和数据库适配已搁置。当前跨实例一次消费约束不足，现有单SCF候选已在服务端硬性关闭新购/付费处理，不以人工售后替代防滥用后开放收费。以下旧CloudBase入口保留历史/兼容用途，不是当前资源开通待办。

原入口复用宿主在 `miniprogram/app.js` 使用的云环境 `cloud1-d8gw5r2il0c0f198a`。`orders.js` 管理订单与恢复，`index.js` 使用可信微信上下文和 CloudBase 事务，`bda-provider.js` 将付款后的一张本地标准化 JPG 直接传给腾讯云 BDA `SegmentPortraitPic`，验证透明 PNG 后只保存短期结果引用和订单元数据。`virtual-payment.js` 是个人虚拟支付适配器。旧 `providers.js` 的 COS/数据万象实现只作切换期回退依据，必须显式设置 `PHOTO_AI_PROVIDER=cos-legacy` 才会选用；当前正式目标为 `bda`，不创建或依赖自有 COS 图片桶。

## 本轮实际完成

- 固定 100 分、一次道具直购、生产 `env=0`。服务端从可信 OpenID 绑定工作图、幂等请求及订单；重试沿用同一业务订单，明确查到未支付且已关闭后才可创建新的支付尝试。
- `wx.login` 的一次性 code 只传可信服务端；`code2Session` 返回的 OpenID 必须匹配云调用身份。AppKey、AppSecret、session key、access token 不传客户端，不记录原始支付事件。
- 双 HMAC 对精确原始字符串签名，官方公开算法向量通过；查单、退款请求按实际路径及原始请求体签名。stable token 在函数进程中缓存，普通刷新，不强制失效宿主凭据。
- 查单验证业务单号、生产环境、100 分订单/实付金额、现金单类型及平台交易号；AppID/OfferID/用户归属来自可信 token、AppKey 和用户限定查询，不伪造接口并未返回的身份字段。客户端成功回调不解锁上传或 AI。
- 并发只取得一份执行权；超时/进程中断记未知，不自动重调 AI。BDA 返回约30分钟有效的临时 URL，客户端校验完整哈希后保存到微信本地文件区，最多24小时内复用（过期在下一次进入照片模块或下载时清理）；白蓝合成、调整裁剪和导出都在本机完成，不再次收费。
- 云函数推送仅接受发货和退款两类，拒绝小程序客户端伪造推送及公共 HTTP 回调。通知只触发服务端查单；发货未就绪不返回成功。结果持久化后使用 `notify_provide_goods` 补充确认，失败可查询重试而不重调 AI。
- 普通退款使用固定退款单号；启动请求不代表到账。状态 5 为商户扣款，8 才为用户到账。外部退款撤销处理/下载权限；原支付单和退款单、金额及平台单号同时核对后才确认通知。真实回调来源/字段仍需在授权云环境验证。
- iOS 微信低于 8.0.68、无 API 或 IAP 未就绪时阻止拉起支付。iOS 退款返回 App Store 指引，不发开发者主动退款，不声称已提交退款。自动维护也跳过 iOS 主动退款。
- 自有云端不持久保存输入或输出图片。订单只短期记录 BDA 请求号、结果哈希/尺寸、临时 URL 和到期时间；到期清除临时引用。照片仅保存在用户本机，最多24小时内用于同设备恢复，过期在下一次进入照片模块或下载时清理；不保证微信未运行时定时物理删除。腾讯云服务侧是否留存及留存期限仍以适用协议和官方书面答复为准。

## 真实后台核实及阻塞

最新账号状态以 `docs/photo-poc/engineering-candidate/payment-capability-20261018.json` 为准。已核实 `photo_ai_bg_once` 发布且价格100分；`photo_ai_bg_once_1` 为未发布草稿，不接入。用户于2026-10-19报告苹果IAP已开通；不再作为资格阻塞，当前候选的真实交易、退款及回调仍未验收。

先前授权的关闭状态 `photoAi` 已部署并完成一次 `features` 校验；该部署仍是旧候选。当前 BDA 替换仅完成本地代码和注入测试，尚未再次部署。数据库、推送、定时器、BDA 密钥、实付和真实 AI 均未操作。本地回归不能代替真实验收。

## 配置与部署边界

密钥由用户在可信云环境配置，不发聊天、不放仓库。BDA 路径需要 `PHOTO_APP_ID`、`PHOTO_APP_SECRET`、`PHOTO_VIRTUAL_OFFER_ID`、`PHOTO_VIRTUAL_APP_KEY`、`PHOTO_VIRTUAL_PRODUCT_ID`、`PHOTO_AI_PROVIDER=bda`、`PHOTO_BDA_REGION`、`PHOTO_BDA_SECRET_ID`、`PHOTO_BDA_SECRET_KEY`，以及不少于32字符的 `PHOTO_MAINTENANCE_SECRET`。如使用临时凭证，可另设 `PHOTO_BDA_SESSION_TOKEN`。客户端不包含任何腾讯云长期密钥。

- `PHOTO_PAYMENT_CHANNEL=personal-virtual`；`PHOTO_MAX_AI_CALLS_PER_DAY` 默认0。缺预算授权或关闭处理开关时不调用 AI。
- 新订单要求 `PHOTO_PROCESSING_ENABLED`、`PHOTO_NEW_ORDERS_ENABLED`，以及资格、100分商品、隐私和预算的服务端标记；正式开放还要求回调、真实链路及免费主链发布验收。
- 首次真实联调有独立的服务端测试付款人白名单 `PHOTO_TEST_PAYER_OPENIDS`，须明确设置 `PHOTO_TEST_PAYMENT_AUTHORIZED=true` 与 `PHOTO_CALLBACK_CONFIGURED=true`；不会把“待验”改写为“已验收”。其他付款人仍被拒绝。当前无白名单、授权或开启动作。
- iOS 正式开放要求 `PHOTO_IOS_IAP_ACCEPTED=true`；仅已授权测试付款人可在 `PHOTO_IOS_IAP_CONFIGURED=true` 后参与 IAP 联调。客户端 `PAID_ENABLED=false`，不能只靠服务器标记向用户开放购买。
- 未来部署仅涉及 `photoAi`、`photo_ai_orders`、`photo_ai_daily_budget` 和发货/退款推送，不创建自有图片存储桶。数据库客户端不可读写，不改宿主已有集合/业务。真实 BDA 调用、照片传输、费用、临时域名及维护调度需要另行授权并验证。
- 已接入指定定时器 `photoAiMaintenance`，仅可信 `wx_trigger` 且没有客户端身份时接受；`PHOTO_MAINTENANCE_ENABLED` 默认关闭，关闭时不初始化数据库或供应商。人工维护保留独立服务端令牌校验。
- 每批最多100条，按唯一文档ID推进并在到末尾后回绕；游标保存在既有 `photo_ai_daily_budget/maintenance-cursor` 文档，不新增集合。单条错误仍推进游标，后续回绕重试，避免未完退款长期占住前100条。
- 维护在开始下一条前检查30秒时间预算；同一次入口的支付/BDA HTTPS请求共享45秒剩余预算，并同时限制绝对请求时长与空闲超时。数据库与冷启动另计，不承诺整次调用硬性小于60秒。索引、云定时器来源/调度、临时引用清理及成本必须在授权环境真实验证，目前未启用。

## 已完成本地验证

`node scripts/validate-photo-paid.js` 检查并发、未支付零调用、超时不重调、复用、退款、外部退款撤销权限及支付断网时清理；保留旧非选用适配器的本地 RSA/AES 回归。

`node scripts/validate-photo-virtual-payment.js` 使用真实 HMAC 和注入 HTTPS 传输，核对官方向量、实际请求体、登录归属、金额/环境/单号、退款状态、iOS 能力及关闭开关。注入测试没有访问支付或 AI 服务。

`node scripts/validate-photo-bda.js` 使用注入传输核对 TC3 鉴权形态、仅 Base64 输入、`RspImgType=url`、同尺寸透明 PNG、短期结果引用、无 COS 写入和不自动重调。它不调用真实 BDA，也不证明账号资格、费用、返回域名或真机下载通过。

协议依据：[个人虚拟支付](https://developers.weixin.qq.com/miniprogram/dev/platform-capabilities/business-capabilities/virtual-payment/person.html)、[查单](https://developers.weixin.qq.com/miniprogram/dev/server/API/VirtualPayment/api_query_order.html)、[退款](https://developers.weixin.qq.com/miniprogram/dev/server/API/VirtualPayment/api_refund_order.html)、[云函数回调](https://developers.weixin.qq.com/miniprogram/dev/wxcloudservice/wxcloud/guide/wechatpay/virtual-payment-callback.html)。账号与通道的真实验收单独记录。

## 当前运行环境兼容

目标函数只读确认Nodejs16.13/60秒。根包最低版本改为16.13.0，锁定依赖图未变；本地官方Node16.13.1（macOS arm64）下真实SDK加载、关闭features无网络及服务端回归通过。测试桩的structuredClone仅由测试预加载补充，生产代码不依赖它。此结果不代替云端Linux运行、真实AI性能或端到端验收。Node运行时长期支持与升级路径需另行核实，不要求当前控制台修改不可编辑的运行环境。
