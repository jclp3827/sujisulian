> **已搁置方案，非当前实施路径。** 用户已确认不新增任何付费资源，采用现有单个 `photo-segment-scf` 与微信虚拟支付的最小流程。下文MySQL配置和独立订单服务仅保留既有本地工作，不开通、不部署、不作为发布前置。当前路径见 `../photo-segment/README.md`。

# 独立 SCF 可信订单入口（本地实现，未部署）

2026-10-19 最新执行边界：**不新增任何付费资源**。继续沿用已跑通的 `photo-segment-scf → BDA SegmentPortraitPic → 本地合成/国考处理` 和已确定的每月免费1000次分割线路；不创建数据库、不恢复/续费隔离CloudBase、不创建照片桶、不购买资源包。免费额度不是服务端硬性停调机制；当前不开放普通用户购买，也不发起新的真实AI调用。

本目录保留可选可信订单服务的本地实现和运行包，**不作为现有照片流程的前置条件**。独立入口已去除CloudBase依赖，复用 `cloudfunctions/photoAi/orders.js`、虚拟支付、BDA及维护模型；SQL适配尚无实际数据库、未进行真实MySQL验收。`PAID_ENABLED=false`，客户端URL为空。

## 本地组装

`scripts/build-photo-orders.js /新的临时目录` 组装16份源码/配置/锁文件。独立锁定依赖为 mysql2 3.24.6、pngjs 7.0.0、jpeg-js 0.4.4；安装时使用 `npm ci --ignore-scripts --omit=peer`，共12个运行依赖包，不携带CloudBase/wx/COS SDK。入口 `index.main_handler`，目标Event SCF / Nodejs18.15、60秒；本地Node运行通过不代表目标云端运行通过。组装器不安装、不部署、不调用云端。

## 可信身份与既有订单模型

- HTTPS POST JSON，每次调用通过一次性微信登录code验证用户归属；同次支付签名复用可信session。不接受客户端OpenID、价格或支付成功字段作为付款依据。
- `features/create/payment/confirm/start/status/recent/refund/delivered/report` 沿用既有订单模型。服务端查单确认固定100分付款，再取得持久执行权和调用额度，最后才可调用BDA。当前全部购买门关闭。
- 持久层实现现有 `get/change/reserveCall/recent/pending/advanceMaintenance` 接口；InnoDB事务锁定同一订单与每日额度，失败回滚，提交结果未知不重放，不使用SCF内存或临时目录充当订单账本。
- 最近订单查询限定微信归属；停止新购保留已有已付订单查询、下载和售后。旧CloudBase订单仍走原恢复路由，独立服务没有CloudBase回退。
- 不存照片像素。供应商结果引用先保存后下载校验；跨实例恢复只GET，未知结果不重调BDA。引用到期进入售后。本机结果24小时后在下一次进入/下载时清理，微信未运行不能保证定时物理删除；不宣称供应商立即删除。

## 暂缓的SQL配置（当前不执行）

未来只有具备另行授权的可复用资源时才配置，不因本说明创建资源。

| 字段 | 要求 |
| --- | --- |
| `PHOTO_ORDER_STORE` | 显式mysql；未配置即关闭，无CloudBase默认依赖 |
| `PHOTO_SQL_HOST/DATABASE/USER/PASSWORD` | 服务端数据库配置；用户自行在控制台输入凭据，不进入聊天/仓库/客户端 |
| `PHOTO_SQL_PORT` | 默认3306 |
| `PHOTO_SQL_CA_PEM` | 如服务端需要私有CA，提供受信CA；始终校验TLS证书及主机名 |
| `PHOTO_DATABASE_ACCEPTED` | 真实事务、并发、权限、索引、额度及清理验收后才可设true |
| `BDA_REGION` | 默认ap-guangzhou |
| `TENCENTCLOUD_SECRETID/SECRETKEY/SESSIONTOKEN` | SCF角色注入完整临时凭证，不使用永久BDA密钥 |
| `PHOTO_PUSH_TOKEN/PHOTO_PUSH_AES_KEY` | 安全推送配置，用户自行设置 |

`schema.sql` 仅提供未来审查的两个InnoDB表及归属查询索引；运行时不建表。服务端仅授予必要表读写权限，客户端不读写数据库。`scripts/inspect-photo-mysql.js` 是未来获授权后可用的只读结构检查，不能替代真实事务/权限验收，当前没有执行。必须先核实SCF网络可达性、证书主机名、已有VPC/出网及费用，不默认为已具备。

每次数据库操作新建并关闭连接，单操作最多10秒、请求总数据库截止45秒；无常驻连接池。定时维护仍关闭；若未来复用可暂停数据库，应按实测选择调度，避免高频唤醒带来费用，不预设月费封顶。

## 推送与部署门

`/notify` 使用JSON安全加密模式，验证签名、时间窗、AES及AppID；仅提示服务端查单，不凭正文认定付款。真实平台推送尚未验证，不能设 `PHOTO_CALLBACK_ACCEPTED=true`。IAM命名定时器 `photoAiMaintenance` 或既有维护密钥才可维护；HTTP正文伪造Timer无权限。

当前不部署、不改变现有SCF/角色/消息路由、不开维护、不产生真实交易或退款。数据库、支付、隐私、预算和正式验收门全部独立保留；本地运行ZIP也不是微信整包/设备/发布验收。
