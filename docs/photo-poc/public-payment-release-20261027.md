# 照片 AI 支付公众发布记录（2026-10-27）

## 当前状态

- 候选从 `main` 的 `45aa63760e192492a569b85a224cc5c00b314f05` 分出并快进合并回 `main`；已上传开发版本，尚未提交审核、未发布。
- 现有广州 `photo-segment-scf` 已部署 `main` 同源候选，代码包 SHA-256 为 `098890f91078f263398d4580a4d3d8d70faf91dbb7e1f54e21a5d31da44dc8ee`，部署请求 `daad0ac4-c55e-4332-8764-055a57d9424f`；函数状态 `Active` 且平台返回的代码包哈希一致。经用户明确更正，已于上传前设置 `PHOTO_PUBLIC_ENABLED=true`、`PHOTO_PUBLIC_ONLINE_VALIDATION=true`、`PHOTO_PUBLIC_DURABLE_STAGING=false`、`PHOTO_DATABASE_ACCEPTED=true`、`PHOTO_MAX_AI_CALLS_PER_DAY=unlimited`。`PHOTO_NEW_ORDERS_ENABLED=true`，其他现有支付与处理开关均为 `true`。真实验收标志没有伪造为通过。
- 现有上海 CloudBase 实例 `tnt-ouu16w38w` 中创建了 `photo_preview_accounts` 与 `photo_preview_daily_budget`，两者权限均经 `DescribeDatabaseACL` 核实为 `ADMINONLY`。未创建照片存储桶。
- 广州 SCF 运行角色对上海数据库做了两次连续事务和两次并发事务探针，结果均为计数 `1、2`。探针入口已从最终源码移除；测试文档只保存合成探针计数，不含照片或支付密钥。
- 更新前代码包备份：`/private/tmp/photo-public-release-20261027/photo-segment-scf-before-public-20261027.zip`，SHA-256 `e0c27f22f5a956649a1767723c883a88bf8feee5b3bc84d3d4ae45cf7e50e660`。更新前完整配置保存在同目录的权限 `0600` 文件中，不纳入仓库。

## 已验证与边界

- 本地 `validate-photo-preview-export.js` 覆盖冷启动、清缓存、三次免费限制、已付权益恢复、取消后同订单重试、支付推送发货、重复推送、伪造交易号拒绝、每日额度关闭新购及白名单试运行；`validate-photo-public-ledger.js` 覆盖模拟事务和失败关闭。
- `validate-photo-scf.js`、`validate-photo-virtual-payment.js`、`validate-photo-minimal.js` 通过。微信开发者工具对候选完成预览构建，整包 5,635,964 字节。小程序端没有 npm 依赖，开发者工具的 `build-npm` 返回 `__NO_NODE_MODULES__`，未阻塞预览。
- 上述自动化和合成探针不代替真实公众账号的支付、推送、退款及两端真机验收。既有开发者账号仍有未用的旧测试付款权益；公众开启时，该账号继续使用旧路径处理余下次数及新购，避免权益丢失。该单账号旧路径仍有冷启动重复调用风险，不能把它作为新账本验收样本；等权益用尽后再单独切换账号至持久账本。其余用户均走持久账本。
- 用户提供的微信后台截图显示消息推送已启用，URL 指向现有云函数 `/notify`，Token 与云函数一致，加密方式为安全模式，数据格式 JSON。加密密钥的截图文字识别有相似字符歧义，尚未从微信端取得正式推送原包；使用现有 Token 对公网 `/notify` 发起 GET 握手，HTTP 200 且 `echostr` 完整返回。只证明入口可访问及握手配置有效，不证明真实 POST 发货通知已抵达或完成发货。
- 截图包含完整 Token 和 EncodingAESKey。用户明确选择继续使用现有凭据；未修改平台或云函数凭据，预备的替换配置单已删除。

## 上传记录

- 最新上传源码提交：`d99e2a5683b3a1715961973ee5c81876da1babe7`（后续仅补充本记录文档）；小程序 AppID `wx32dafe910fadcf59`。
- 微信开发者工具 CLI 已登录，`main` 预览编译成功。小程序没有 npm 依赖，`build-npm` 提示 `__NO_NODE_MODULES__`，随后预览与上传均成功。
- 已上传最新版本 `2026.10.27.2`，说明“照片AI换背景公众支付与云端次数管理（含旧权益）”；CLI 返回 `✔ upload`，上传包合计 `5,985,208` 字节，主包 `1,989,693` 字节。先前上传的 `2026.10.27.1` 已被此版本取代，提交审核应选择 `.2`。
- 上传详情本机回执：`/private/tmp/photo-public-release-20261027/main-upload-info-v2.json`，SHA-256 `1d3a092fbcc69765abe781d62aea44c6ba76eceee63b3537e7a5686b70c3b3eb`。CLI 回执仅含大小，不含微信审核或发布状态。

## 公众线上验证安排

- 2026-10-27 用户明确要求：将未取得的三组证据先记录，合并至 `main` 后发布，用户在线上验证；若不通过再修改。此决定只授权带着明确待验项开放线上验证，不构成这些验收项已经通过。
- 用户随后明确分工：本次由开发侧执行至上传；微信审核与正式发布由用户手动完成。上传不是发布，上传后不得将其记录为公众已可用。
- 服务端以 `PHOTO_PUBLIC_ONLINE_VALIDATION=true` 明确表示这次例外，`PHOTO_FREE_RELEASE_ACCEPTED`、`PHOTO_REAL_FLOW_ACCEPTED`、`PHOTO_CALLBACK_ACCEPTED` 仍未设置为通过。用户要求上传时公众支付已对所有用户开放，因此 `PHOTO_PUBLIC_ENABLED=true` 在上传前启用；微信当前正式版是否包含新客户端功能仍取决于后续手动审核与发布。苹果 IAP 根据已核实的 `PHOTO_IOS_IAP_CONFIGURED=true` 开放，同样记为线上待验。

1. 用户已确认个人主体工具类目、认证备案、¥1 道具发布、苹果 IAP 开通；消息推送配置由用户截图确认。仍需一笔真实订单及云函数日志/订单状态验证微信 POST 发货推送确实到达。
2. 用新账本账号完成真机试运行：清缓存、3 次免费限制、1 元实付、微信主动推送到服务端、查单确认发货状态 4、权益恢复及退款路径。旧测试账号仍保留余下权益，不用于新账本试运行。
3. 用户确认不设每日 AI 调用硬上限。数据库继续记录每日实际调用量；腾讯云赠送额度用尽后可能转入按量计费，必须核对账单。若以后重新设置正整数上限，当天剩余调用不足 3 次时新付款入口关闭，已付款权益保留到次日。
4. 最新同源小程序包已上传；用户手动选择 `2026.10.27.2` 提交微信审核并在通过后发布，再开展公众线上验证。上传、审核、发布、真机与本地测试分别记录，缺失的三组证据不可写为通过。

## 回退

新购可先以 `PHOTO_NEW_ORDERS_ENABLED=false` 关闭；公众 AI 可通过 `PHOTO_PUBLIC_ENABLED=false` 关闭。保留数据库与已付订单的查单、发货、退款能力。代码可按上述备份包回退，配置可按私有备份恢复；执行前先确认回退不会切断新账本订单的售后。
