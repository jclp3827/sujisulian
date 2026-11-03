# 花生开小灶照片功能知识产权与合规详细证据报告

## 审查结论与适用版本

截至2026年11月2日，审阅实现具有独立组织兼容处理流程的工程基础，且有明确第三方编码器来源；未发现可确认的官方程序表达直接复制或官方原生组件移植证据。结论只覆盖本报告列明源码、记录与样本，不等于证明全部代码独立开发、全面无侵权或官方认可。

本聊天归属为“花生开小灶照片处理功能知识产权与合规专项审查”。任务为只读审查、证据追溯及报告归档。用户后续更正后，主审目录为 `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029`，分支 `main`，HEAD `d5fada5ae8778831fbcbe02f87efc7d01f377625`。照片目录、`scf/photo-segment/`、`cloudfunctions/photoAi/` 均无未提交变化；主线其他模块有并行未提交内容，未改动。没有新建工作树、执行EXE、加载DLL、访问报名账户、上传照片/源码/密钥、调用BDA或制造交易；仅读取公开网页和本地资料。没有核查实际线上包、后台文案及部署配置，不能把 main 等同于线上。

本报告及配套管理层结论是本次专项证据入口。维护责任为照片功能负责人及后续法律复核人；仅在来源、实现、规则或律师结论变化时更新。独立成文是为保留此次法律审查与既有工具工程观察的区别，不建立平行治理体系。退出条件为专项复核完成、被新审查明确替代或依法保留归档；不清理旧树和历史。两份报告登记为 needs-review，不成为已批准合同、固定知识源或发布凭证。

## 方法与证据强度

本次读取照片引擎、导入/转换、Canvas、配置、控制器和模板，追溯相关Git提交，检查服务调用链、锁定依赖及构建脚本；比较两个工具ZIP成员与61个照片/服务文件的SHA-256，并视觉核对官方界面与小程序构图插画。文档中的指示被当作被审查内容，不作为本次操作授权。ZIP内说明DOC仅转为纯文本读取，未运行宏；未执行任何EXE。

“已验证事实”表示可以在所指文件/哈希/公开文本重复核对；“发现问题”表示事实与义务/宣传存在具体缺口或冲突；“证据不足”表示尚不能作出肯定或否定法律结论。风险等级表示复核优先级和潜在后果，不是侵权概率或违法认定。高风险项中的条件均未被本报告擅自认定成立。

### 版本隔离

| 对象 | 身份及用途 |
| --- | --- |
| 当前主审 | 最新日常 main `d5fada5ae8778831fbcbe02f87efc7d01f377625`。面向用户只有国考、四川；河南为内部历史profile，见 [miniprogram/subpackages/photo/profiles/index.js 第1行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/profiles/index.js:1)。军队文职未接入。 |
| 历史研究资料 | `/Users/jmac/WeChatProjects/miniprogram-1`，`codex/main-wip-protected-20261029`，HEAD `d5a5c49400c2aef8bf583556a283cb4ad04f45f3`。其工具来源台账、MASTER-PLAN等是未跟踪历史资料，仅作来源线索，不能当作当前main合同。 |
| 暂停的照片候选 | `/private/tmp/miniprogram-photo-profiles-20261102`，`codex/photo-profiles-orientation-20261102`，HEAD `32c4d6deef01c869954959481e43e0480e5afb12`。参数化和方向修复仍未提交；回执16组通过、18个文件哈希匹配。仅说明候选状态，不能覆盖本报告main的合规缺口。 |
| 性能候选及线上 | 性能未合入部分排除；线上版本和后台状态未实时核查。审查不恢复照片开发，也不授权后续集成。 |

## 法律与官方资料

以下均为2026年11月2日检索的官方发布、政府转载或权利人原始资料。法律、司法解释、考试行政操作要求和本报告推断分开使用。未引用个案裁判作为本产品合法性结论。

| 编号 | 来源与条文 | 本次用途及事实前提 |
| --- | --- | --- |
| L1 | [计算机软件保护条例](https://www.cac.gov.cn/2013-02/08/c_12648744.htm)，2013年修订文本，第3、6、8、12、17、23、24、29条 | 软件程序表达与思想/方法区分；学习研究、有限表达与复制/翻译/技术措施分别判断。官方委托开发不当然无版权；研究例外不是商业复制许可证。 |
| L2 | [著作权法](https://www.ncsti.gov.cn/zcfg/flfg/202104/t20210402_29487.html)，2020年修正、2021年6月1日起施行，第3、5、10、24、49至53条 | 软件及独创素材表达受保护；法律文件与普通官方软件/素材不能混为一类；技术措施和权利管理信息须符合定义。反向工程研究例外不能自动覆盖向公众提供规避服务。 |
| L3 | [反不正当竞争法](https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/fgs/art/2023/art_3737890d856a4e44a8ea07c50c90c116.html)，2025年修订、2025年10月15日起施行，第2、7、9、10、13条 | 适用混淆、误导宣传、商业秘密及网络竞争条款须各自满足构成条件。注意当前混淆为第7条、宣传为第9条，不能沿用2019版条号。 |
| L4 | [民法典](https://www.court.gov.cn/zixun/xiangqing/233181.html)，2021年1月1日起施行，第496至498、506条 | 格式条款公平、提示说明与无效免责边界。声明不能免除经营者法定义务或故意/重大过失责任。 |
| L5 | [个人信息保护法](https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm)，2021年11月1日起施行，第6、13至19、21、23、28至30、44至47、55至56条 | 最小必要、告知/同意/撤回、委托或独立接收方、敏感信息及影响评估。人像不因“AI”二字自动等于生物识别；需结合处理用途、特征和危害判断。 |
| J1 | [最高人民法院关于审理侵犯商业秘密民事案件适用法律若干问题的规定](https://www.court.gov.cn/fabu/xiangqing/254751.html)，法释〔2020〕7号，第14条 | 公开渠道取得产品的反向工程可构成商业秘密抗辩；不覆盖先非法取得信息再借反向工程辩解，也不替代著作权/合同分析。解释原文沿用当时法律条号，现法条号变化不能机械照搬。 |
| O1 | [2027国考报考指南政府转载](https://shanghai.chinatax.gov.cn/xxgk/rsxx/202610/t481764.html)，2026年10月15日，第三章第二问及报名确认照片步骤 | 要求照片处理工具处理并保存；源图蓝/白底、至少295×413、不得美化修饰。它是考试流程要求，不是第三方软件授权，也不直接证明第三方编码侵犯版权。 |
| O2 | [四川2027公告政府转载](https://www.cqdx.gov.cn/web/article/1565419888768905216/web/content_1565419888768905216.html)，正文署2026年10月28日，三（一）1 | 要求下载照片审核工具处理后上传；[凉山人事考试中心转载](https://www.lysrsks.cn/index/news/detail.html?id=2640)交叉印证。省专题站本次读取失败，转载不能证明本地ZIP就是该年度官网下载版本。 |
| T1 | [jpeg-js v0.4.4 LICENSE](https://raw.githubusercontent.com/jpeg-js/jpeg-js/v0.4.4/LICENSE)及[encoder.js原文](https://raw.githubusercontent.com/jpeg-js/jpeg-js/v0.4.4/lib/encoder.js) | 权利人公开源码与许可，可核对本地头部、结构和BSD类再分发条件；本次未完成全文件逐行外部鉴定。 |
| T2 | [腾讯云人像分割接口](https://cloud.tencent.com/document/api/1208/42970)及[人体分析相关协议](https://main.qcloudimg.com/raw/document/product/pdf/1208_48812_cn.pdf)，服务条款3.4等 | 确认SegmentPortraitPic是分割服务、结果URL有效期30分钟；服务使用者负输入信息合法授权义务。公开协议PDF不是当前账户合同或删除证明。 |

## 已验证的实现及引入记录

### 处理链与代码表达来源

| 组件 | 工程事实与证据 | 结论边界 |
| --- | --- | --- |
| JPEG编码 | [miniprogram/subpackages/photo/vendor/jpeg-encoder.js 第1行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/vendor/jpeg-encoder.js:1) 声明改编自jpeg-js v0.4.4；保留Adobe头部与Andreas Ritter说明。第423、486、520、654、776行分别组织JFIF、DQT、DHT与4:2:0编码；[miniprogram/subpackages/photo/vendor/LICENSE-jpeg-js.txt 第1行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/vendor/LICENSE-jpeg-js.txt:1)记录上游与修改前哈希，并保留Eugene Ware及Adobe条件。T1能对应头部和通用函数结构。 | 编码器明显包含第三方受许可表达，不能称全部自主原创；未见其来自官方EXE的证据。公开算法与具体上游实现要区分。 |
| 裁剪和导出 | [miniprogram/subpackages/photo/core/process.js 第32行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/core/process.js:32)用比例/缩放和归一位置计算裁剪框，第58至71行接收RGBA、调用编码器、追加尾标、再校验。[miniprogram/subpackages/photo/platform/raster.js 第37行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/platform/raster.js:37)通过Canvas绘制、合成人像前景、读回像素。 | 是微信/JavaScript处理链，不含MFC/OpenCV调用；有限通用结构相同不能推出复制，语言差异也不能反向证明独立。 |
| 输入和元数据 | [miniprogram/subpackages/photo/platform/input.js 第42行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/platform/input.js:42)以本地字节检查、getImageInfo、compressImage和画布准备工作图；[miniprogram/subpackages/photo/core/jpeg.js 第1行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/core/jpeg.js:1)解析JPEG段、EXIF与量化表。 | 使用通用格式/原生API；本次未发现与反汇编中特有控制流逐句对应的实现，但没有官方源码可做完整相似性鉴定。 |
| 指纹与ZIP | [miniprogram/subpackages/photo/core/sha256.js 第1行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/core/sha256.js:1)采用SHA-256；[miniprogram/subpackages/photo/core/zip-store.js 第1行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/core/zip-store.js:1)包装JPG。 | 输出文件指纹和ZIP校验不等于官方签名。不能把通用摘要算法视为复制官方核心算法。 |
| 官方内容审核 | [docs/photo-poc/gwy-tool-audit-20261017.json 第460行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/docs/photo-poc/gwy-tool-audit-20261017.json:460)记录官方人脸/背景/比例检查，并明确fullAutomaticAuditReproduced=false；当前生成确认见 [miniprogram/subpackages/photo/process/controller.js 第349行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/process/controller.js:349)。 | 本地文件校验不包含等价的官方自动内容审核，用户确认不能替代它。 |

首次引入照片目录、编码器、构图插画的主线可追溯提交为 `8a4cac158cfdd36f16b30168e88ad905540d59fd`（2026年10月21日）。该提交中的编码器开头已有上游声明。它是批量引入点，不是“从零逐步编写”的完整证明。四川首次适配为 `9585399857c9e02b5cd2ae4c2e2bca196d0d5958`（10月29日）；最新版替换和编码分段支持追溯到 `1ffed99789e62dbcc78818166ca65485b48a78ca`（10月30日）。`d5a5c49400c2aef8bf583556a283cb4ad04f45f3`记录ZIP/JPG交付；后续性能提交不作为照片来源证据。

### 工具包与资源原样移植检查

本次实际找到的两个ZIP均在 `/Users/jmac/Downloads/照片处理流程校验/`，而不是四川文档写的Downloads根目录。同哈希能核对内容身份，不补足官网下载来源或取得许可。

| 包 | ZIP SHA-256 | EXE SHA-256及情况 |
| --- | --- | --- |
| gwyzpclgj.zip | `b9dc626c54d29b33a36b7ce2e7fea7a535d853bc2c2c0bbc9857e4f7b4dd25bb` | `e344fc1b4619d355d88a52bc1eddf216cca60fb55c8e9bab42ac5d4ed04183a9`；16个成员，含DLL、模型XML、界面BMP和使用说明DOC。 |
| zhaopianshenhe.zip | `f0809e03b448ecab7973f2c2bb5402d0b14a9b376926a12fa2610c4b686a880b` | `68ad93517bd4f7cd935484fb0bf1bd9cdbee3140e090495c825a45715c1f7481`；14个成员，含DLL、模型XML、界面BMP和帮助DOC。 |

61个文件范围是main的 `miniprogram/subpackages/photo/`、`scf/photo-segment/`、`cloudfunctions/photoAi/`，排除未展开的node_modules。没有PE头或EXE/DLL/WASM/SO/DYLIB/XML文件，没有与两个ZIP成员完全相同的文件；整个miniprogram内也未发现这些原生二进制扩展。没有检查真实上传包，因此不把源码文件扫描称为最终包体证明。哈希比较不能排除裁切、重编码或改写派生物。

国考界面BMP底部署“人力资源和社会保障部人事考试中心、公务员考试测评中心”版权信息；这是版权主张线索，不是本次已核定的完整权利链。四川新包没有可见完整许可文本或明确开放许可；包内帮助主要为操作步骤。没有许可文件不等于允许商用或允许逆向。[docs/photo-sichuan-tool-adaptation-20261029.md 第11行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/docs/photo-sichuan-tool-adaptation-20261029.md:11)中的旧RAR只作历史追溯，本次未重新反汇编它，既有地址和样本记录不自动升级为当前适用规则。

## 高风险及优先专业复核事项

### H1 固定尾标与官方工具校验机制

**已验证事实：** 国考尾标为 `ff020008676a67777932`，四川为 `ff0200087a676b736867`，配置见 [miniprogram/subpackages/photo/profiles/gwy.js 第13行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/profiles/gwy.js:13)、[miniprogram/subpackages/photo/profiles/sichuan.js 第8行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/profiles/sichuan.js:8)；共同写入点为 [miniprogram/subpackages/photo/core/process.js 第67行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/core/process.js:67)。[docs/photo-poc/gwy-tool-audit-20261017.json 第492行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/docs/photo-poc/gwy-tool-audit-20261017.json:492)说明恢复到的国考尾标函数仅以常量写入文件末尾，第495行明确该函数未使用图像摘要、随机数、身份、私钥或在线令牌；第543行保留该函数的反汇编。四川静态写入观察见 [docs/photo-sichuan-tool-adaptation-20261029.md 第6行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/docs/photo-sichuan-tool-adaptation-20261029.md:6)。

**发现问题与适用前提：** 当前实现主动重现官方工具特有的已处理文件标识，不能将它笼统归为JPEG国际标准本身。O1/O2又规定使用工具的流程，因此存在把“本地生成”交给系统识别为“已由指定工具处理”的争议空间。若该机制确系权利人为保护软件著作权设置的有效技术措施，L1第24条、L2第49至51条可能相关；若它只用于报名格式筛选，则未必满足著作权技术措施的定义。它是简单常量或不加密，均不足以单独解决法律性质。未发现官方私钥提取或密码学签名伪造证据；也没有证明报名服务器究竟检查什么。服务中腾讯TC3和自有票据HMAC分别用于云调用和本项目权益，不是官方考试签名，见 [scf/photo-segment/index.js 第100行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/scf/photo-segment/index.js:100)、[scf/photo-segment/purchase.js 第18行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/scf/photo-segment/purchase.js:18)。

**法律判断：** 高优先级、条件性风险，尚不能认定违法或认定只是无害格式兼容。L2第50条研究例外不自动允许把规避能力作为公众服务分发；研究与产品使用须分别评估。L3一般条款或第13条也须满足竞争及损害等条件，不能因为“绕过格式检查”就直接认定适用。

**最小建议：** 保留原包、静态片段及本实现；取得工具来源、许可、标识用途和考试方书面解释，提交律师判断兼容常量、认证表示和技术措施边界。结论形成前不把尾标称为“官方认证/签名”，不据此承诺替代指定流程。本次没有删除标记或更改公开状态。

### H2 指定工具要求与AI不得修饰的适用边界

**已验证事实：** O1要求使用照片工具并禁止美化修饰；O2要求下载审核工具处理。当前页面同时提供AI换背景和“不美化修饰”要求，见 [miniprogram/subpackages/photo/process/index.wxml 第133行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/process/index.wxml:133)及第139行。用户在 [miniprogram/subpackages/photo/process/controller.js 第543行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/process/controller.js:543)确认后可调用AI，弹窗只说腾讯云和费用，没有针对所选考试的限制提示。[miniprogram/subpackages/photo/platform/raster.js 第42行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/platform/raster.js:42)把分割前景叠到底色上；它不是单纯压缩/改变文件格式。

**发现问题：** 当前流程没有明确说明“换背景也可能属于不得修饰的范围”，也没有说明第三方格式成功不代表免除官方工具步骤。单次四川样本通过的用户反馈只能证明当次接收，不能证明许可、所有照片合规或AI被允许；本次没有重新取得该截图原件，亦未复核该次结果。

**适用前提与依据：** 这是考试程序和消费者预期风险，不等同于复制代码。AI换底是否被具体考试视为禁止修饰，不能仅凭API称为分割或未改变面部就判定；需考试方解释。若宣传让用户误以为处理即满足全部报考要求，可能涉及L3第9条；若有明确服务承诺还涉及合同责任。考试机关要求本身并不自动创设软件排他版权。

**最小建议：** 针对所选年度和考试核实第三方处理及换底边界；在AI启用点明确风险，未确认允许时引导用原背景，保留官方规定链接。不承诺官方指定步骤可省略。是否调整AI开放范围由产品负责人在取得规则和法律意见后决定，本次不执行开关变更。

## 中风险事项

### M1 AI云端照片处理告知尚不足以核定合规

**已验证事实：** [miniprogram/subpackages/photo/process/controller.js 第543行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/process/controller.js:543)有专门确认并调用 `requirePrivacyAuthorize`；[miniprogram/subpackages/photo/platform/preview-paid.js 第98行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/platform/preview-paid.js:98)准备工作图并在第115行提交imageBase64、哈希和尺寸；[miniprogram/subpackages/photo/platform/scf-purchase.js 第16行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/platform/scf-purchase.js:16)向SCF请求。[scf/photo-segment/preview.js 第202行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/scf/photo-segment/preview.js:202)验证图像，223行调用分割，227行把owner、输入哈希、结果URL和有效期组成票据；[scf/photo-segment/index.js 第157行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/scf/photo-segment/index.js:157)经BDA发送图像。免费原背景绘制/编码/导出路径未见图像上传调用；初始化可能请求身份/权益，用户主动发文件卡片仍经过微信，不能宣传整个小程序“完全不联网”。

**发现问题：** 这段弹窗没有完整说明处理者联系方式、处理目的/方式、信息种类、保存期限/确定方式、撤回/删除路径。源码中的 `PHOTO_PRIVACY_ACCEPTED` 只是功能门条件（[scf/photo-segment/preview.js 第83行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/scf/photo-segment/preview.js:83)），不是实际告知、单独同意或合同已完成的证明。主审源码没有找到完整可审的照片专项隐私文本；微信后台配置、委托协议、影响评估、供应商保存策略及操作记录未取得，故不能断言线上完全没有这些文件，也不能判定已满足。

**适用前提与依据：** L5第17、19、21条要求核对告知、保存及委托管理；若腾讯独立决定处理目的/方式，则应另看第23条，而非默认全部属于委托。若实际处理构成生物识别或其他敏感信息，另须核对第28至30、55至56条。T2仅证明结果URL30分钟有效，不证明输入、日志、缓存30分钟删除；服务协议把输入授权义务放在客户一方。

**最小建议：** 补取后台实际隐私指引、当前腾讯合同、委托边界、数据种类/保存及删除机制和必要评估；在AI前提供可访问的说明与独立选择，保留拒绝AI仍可本地处理的路径。不要将付费/普通微信权限等同于照片处理的全面授权。无须为核查再发用户照片或真实付款。

### M2 第三方许可的分发落实与素材来源

**已验证事实：** 本地编码器保留Adobe说明，单独文本包含Eugene Ware和Adobe再分发条件（T1）。[cloudfunctions/photoAi/package.json 第7行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/cloudfunctions/photoAi/package.json:7)锁定wx-server-sdk 3.0.1、CloudBase 3.18.3、COS 2.15.4、pngjs 7.0.0、jpeg-js 0.4.4；lock中直接包分别标为MIT、MIT、ISC、MIT、BSD-3-Clause，定位在package-lock第1879、110、570、1466、1101行。[scf/photo-segment/package.json 第6行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/scf/photo-segment/package.json:6)直接依赖CloudBase；[scripts/build-photo-scf.js 第14行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/scripts/build-photo-scf.js:14)组装实际SCF及shared模块。源码未发现自行部署AI模型权重，使用的是外部BDA服务，模型许可不能按开源库推定。

**证据不足：** 没有此次线上/发布包及其许可材料，无法验证所有notice在打包后保留、全部传递依赖的义务落实；lock的license字段只是线索，不代替逐包LICENSE/NOTICE。小程序构图插画（[miniprogram/subpackages/photo/process/index.wxml 第40行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/process/index.wxml:40)附近引用；文件在assets/composition-guide.jpg）与两个工具BMP视觉不同，但“自制”历史文字和Git入库不等于完整创作/商业授权凭证。没有足够证据认定它复制官方样照，也不能作全网无相似或所有权保证。

**最小建议：** 留存编码器对应上游版本、修改差异、许可证和分发NOTICE；按真实构建清单核验直接及传递依赖。补取构图插画原稿/生成记录/素材合同。官方BMP、照片、帮助文档仅限受控研究，公开分发或直接复用表达时另核授权/合理引用依据；本次报告不嵌入这些图片或大量抄写帮助材料。依据L1/L2及各许可条件，不能以“考试官方提供”视为公有领域。

### M3 反向研究合法来源和限制未闭环

**已验证事实：** [docs/photo-poc/gwy-tool-audit-20261017.json 第3行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/docs/photo-poc/gwy-tool-audit-20261017.json:3)声明静态检查，6行官方URL未提供；451至499行记录参数、内容检查与保存/识别函数，543行起包含反汇编。[docs/photo-sichuan-tool-adaptation-20261029.md 第3行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/docs/photo-sichuan-tool-adaptation-20261029.md:3)记录用户提供包而非官方下载链。包内可见说明没有发现明确开放许可或完整EULA；未检查所有PE资源条款，下载页面许可和用户接受过的协议均未知。

**风险原因：** 研究并非仅输入输出观察，但存在反汇编不自动等于复制程序表达或违法。L1第17条、J1可以支持特定研究/反向工程分析，仍取决于研究用途、公开渠道取得、保密和合同限制；本项目缺少可验证的取得链及严格隔离开发记录，不能宣称已完成clean-room证明。官方源码、人员接触史、委托开发合同未取得，不能断言存在或不存在保密义务。

**最小建议：** 补官方下载落地页、版本、取得日期、哈希、完整协议；保留需求规则与程序表达来源的对应记录，不倒造历史。律师分别复核研究过程、商业产品实现及分发，避免用一个“反向工程合法”结论覆盖全部行为。

### M4 四川允许放大配置与工具可见提示冲突

**已验证事实：** [miniprogram/subpackages/photo/profiles/sichuan.js 第11行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/profiles/sichuan.js:11)允许215×300输入且allowSourceUpscale=true；[miniprogram/subpackages/photo/core/process.js 第38行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/core/process.js:38)因该标记允许小于输出范围的裁剪生成295×413。实际同哈希新ZIP的 `interface00.bmp` 写有禁止放大照片的提示，而包内帮助另列原图至少300×215，二者需要解释。[docs/photo-sichuan-tool-adaptation-20261029.md 第5行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/docs/photo-sichuan-tool-adaptation-20261029.md:5)只记录尺寸和编码事实，不足以消除禁止放大提示的含义。

**风险原因：** 输出规则可从工具静态行为恢复，但行为支持不等于考试许可。该冲突属于照片质量/考试规则证据问题，不构成代码抄袭证据，也不据此断言官方工具绝不放大。需确认提示指禁止放大原图、禁止人为扩充低清细节，还是也禁止工具内部重采样。

**最小建议：** 向适用考试方核实并形成依据；确认前在产品规则讨论中保留冲突，不宣传低清放大也符合官方要求。本次不把allowSourceUpscale静默改为false，以免越过只读范围或改写已确认业务事实。

## 低风险观察与已排除的具体情形

### L01 当前可见界面未发现官方授权或保证通过承诺

[miniprogram/subpackages/photo/process/index.wxml 第105行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/process/index.wxml:105)明示第三方和最终以官方审核为准；[miniprogram/subpackages/photo/process/controller.js 第397行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/process/controller.js:397)结果为“照片已生成，文件已检查”。检索照片JS/WXML及入口相关源码中的官方、指定、授权、替代、兼容、通过审核、100%、无需官方工具，没有发现冒充官方授权、100%通过或无需官方工具承诺。WXSS的100%是宽度，不能当作通过率。[miniprogram/subpackages/photo/profiles/gwy.js 第21行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/profiles/gwy.js:21)的2026技术基线和2027未验是内部配置说明，模板未直接渲染compatibilityNote，不能把它当作用户已看到的风险提示。

按L3第7、9条，现有文案降低身份混淆风险；“国家公务员考试”“四川省考”作为目的地标签并不单独证明混淆。最小建议是维持第三方身份和本地检查表述，在实际后台介绍/海报等全部渠道复核后再对总体宣传作结论。未核查渠道列为G3，不作无误导保证。

### L02 未发现官方组件的原样移植

61文件、完整哈希对照、原生文件扫描及JS/Canvas调用链排除了本次所列两个ZIP成员原样存在于审查文件集合的情形。不能据此排除改写派生代码、最终构建包额外夹带或所有历史行为。相关权利判断依据L1第8、23、24条及L2第10条；最小建议是在下一次已授权构建时只读核对最终清单，保留当前包哈希，不为审查单独上传。

### L03 功能与格式相同不足以证明复制表达

尺寸、Q40、DPI、4:2:0、背景色要求和文件名是功能/规则/格式事实；DCT、Huffman、SHA-256和Canvas裁剪思路与这些事实重合，不能单独证明侵权。可选择的表达有限和标准兼容也不是对任意实现的全面免责。L1第6、29条与第23、24条应合并理解；具体上游代码仍按T1许可，固定非标准尾标单独按H1审查。最小建议为对外使用准确的“第三方处理/格式检查”表述，保留来源证明，避免宣称“相同输出所以合法”或“JavaScript所以独立”。

## 证据不足清单与补证对象

| 编号 | 缺口 | 影响及最小补证 |
| --- | --- | --- |
| G1 | 官方源码、完整开发过程/逐步来源、研发人员接触与保密约束 | 不能完成受保护表达的全面相似性鉴定或绝对独立证明。补需求/来源记录、合法取得链、必要时由律师组织源码鉴定。批量Git提交仅证明该时点存在。 |
| G2 | 报名服务器校验机制、尾标用途、当年工具的完整许可及允许第三方输出的解释 | H1无法定性；不能从样本通过推出授权。向权利人/考试方取得解释，不用渗透、探测或未经授权上传来试验。 |
| G3 | 当前线上包、微信后台介绍/隐私配置、推广素材 | 只能评价main源码，不代表全部公开宣传或实际运营。补只读导出/截图及可验证版本身份，不能用历史开发版本号代替。 |
| G4 | 当期腾讯合同、委托与保存/删除证明、实际notice分发、插画权属原始凭证 | 数据和第三方版权尚不能闭环；按M1/M2逐项补，勿将账单或付费即视为全部权利授权。 |
| G5 | 旧RAR原始复核及最新四川官方源 | 旧分析只保留追溯。本次已核对新ZIP/EXE哈希，但其来源和年度身份仍需官方下载链；不新开发军队文职，也不推定其他省份适用。 |

## 当前声明的充分性与建议文案

当前第三方声明、官方最终审核提示和本地文件检查措辞是准确的基础，没有检出“所有责任用户承担”的全面免责。它们仍不足以覆盖H1/H2的指定工具和AI边界，也不能代替M1的完整隐私告知。生成确认只提醒本人/轮廓/构图（controller第349行），未直接展示profile中的不修饰确认；因此不能把配置字符串当作实际承诺已取得。

依据L4第496至498、506条，应在重要操作前合理提示限制，用户确认不能排除经营者对处理质量、宣传、隐私或法定救济的责任。费用购买的是约定处理/导出权益，不能等同官方审核资格。现有支付弹窗有本机权益与恢复说明，但当前服务存在持久权益路径；是否有文案滞后应由后续受授权产品核对，本次不扩展成支付审计。

建议短文案共182字，供审阅，未写入产品：

> 本工具为第三方辅助工具，非考试机构开发或授权，不保证报名审核通过。请遵守当年度照片要求；要求使用指定工具时，请按官方流程办理。AI换背景可能不符合禁止修饰要求，未确认允许前请使用原背景。启用AI前将告知腾讯云处理范围并征求同意。请核对本人、底色与构图，从文件卡片保存ZIP或JPG，不用截图。付费购买处理及导出权益，不是审核资格；本说明不免除经营者依法应负的责任。

该短文案中的“将告知并征求同意”是待落实要求，不能把文案上线当作告知机制已经完成；不替代完整隐私指引、敏感信息必要性判断或有效同意。涉及指定工具时提示遵守官方流程，也不能单凭免责声明解决H1的机制性质。

## 工程复核与证据保全

本次对两个ZIP及成员重新计算哈希，对63个主审源码/资源/工具证据文件记录哈希，未运行会产生服务调用的测试。报告完成后的复核需确认原63文件内容与main HEAD不变，登记文件仅增加本次两份报告的待审范围。文档准入的审查前基线已有1项失败：`docs/knowledge-platform/learning-bank-implementation-batches-20261028.md` 属其他任务的改动且尚未完成范围登记；本次不代为整改，不能将全仓准入称为通过。照片候选18文件哈希已核对，不重录兼容基准。无代码改动，无提交/合并/推送/上传/部署/送审/发布或真实支付/BDA使用。

报告的退出和恢复入口为本文件及管理层结论；日常main目录保留，历史保护区保留，暂停的照片候选目录保留。后续实施仍待性能工作结束后按用户指令从最新main重新对账；本报告不授权实施整改，也不预设必须停止或继续运营的法律决定。

### 主审文件哈希

下表绑定本次实际读取的main文件内容；行号按该内容，后续版本需重新定位。它不证明创作时间、官方许可或线上部署。历史未跟踪研究资料不混入本表作为已提交证据。

| 主审目录内文件 | SHA-256 |
| --- | --- |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/cloudfunctions/photoAi/README.md` | `c8bcfd01b099410348cd690a34543d68412053cd9bc08a6a8ec76fe639d162ef` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/cloudfunctions/photoAi/bda-provider.js` | `1389faa8dec03b472b805367ea377b19b10d3906638bcf209dc9786340264a7f` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/cloudfunctions/photoAi/configuration.js` | `7866843b65921bf57873c8e251ebab56b9fc038478f7b863062efd7b1b7e1fe7` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/cloudfunctions/photoAi/index.js` | `1136fd8d0bbe500d3f974dc20baa19f1025301c83c0292c1aab83763b7bf40b8` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/cloudfunctions/photoAi/maintenance-authority.js` | `63ebea8659f4865fa6afe4105ee04c65f750779a778bd1dafcbe3024de7e051c` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/cloudfunctions/photoAi/mysql-repository.js` | `e75b84f82687c7a66d88e372bcfdb5fa861316572223c5aeb60da74c77c78e7e` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/cloudfunctions/photoAi/orders.js` | `5c505e9aac4ecaefaee0c7a7fae74b682c57161686337683dd9f5b1eb72ae85a` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/cloudfunctions/photoAi/package-lock.json` | `b894959fcd2b46dcc5765c8a21f6b7347b63fb1122ae49961001ff125f0bf1e8` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/cloudfunctions/photoAi/package.json` | `c341d8dfb6fa482e1b6cd2d825e5188ba18506f42a786f4fd58661a0bf538afd` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/cloudfunctions/photoAi/providers.js` | `3917b98855d2f5fbf153aed903b8083c7e0f4b54111b9901ef0fb0460fc54f39` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/cloudfunctions/photoAi/push.js` | `571ed109e7a5e4b2d7645061c1b803b445231468ab31d6000dafb2b4e9c63d2f` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/cloudfunctions/photoAi/repository.js` | `bd6943869a35a4b193fce3f73444fd51b6c4691784a9515aaaa5fc43fc96bd66` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/cloudfunctions/photoAi/request-budget.js` | `1255b9853c60e33f6921e9964bf3af24bbe79a2e974717cdabd9f71487f51747` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/cloudfunctions/photoAi/virtual-payment.js` | `8be796004f6c00745fc922fafe985bc414a5a30da85a22c0402ff88b93896b6c` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/cloudfunctions/photoAi/wechat-identity.js` | `cae1233e2c6ce6eaeaed05ec548fbdef9f27f6bd433eb85b2030237a47cfe8f1` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/docs/photo-poc/gwy-tool-audit-20261017.json` | `4a6ae40b3e3001c5f9a8e6c316817e563c29262dd281ef214db6db7851504520` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/docs/photo-poc/public-payment-release-20261027.md` | `36b3ada9baa725654b8482926eb00c8211fdb3c83cd41dcfb19393a7945d31a4` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/assets/composition-guide.jpg` | `87c17652dc2d385a13ed56856a3a19220120dc6ba8f34bf19d0005d8b4abed82` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/core/bytes.js` | `faec3a8eddba362db56bfa370bab2ce0a5f8a27a5c2b32244cd77822a1683623` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/core/jpeg.js` | `c1ee783f59fa3c33ecc4cc3c996194dce7558971d46e5dd17a905169235cbee4` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/core/process.js` | `4469164f06d3b14aae8929859113d1303270dab520a1036d626b7db65985d3a2` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/core/sha256.js` | `9ffaa7bf0a91e66fbd93891468b6bece00742f74ee7ddc43d7e627a74f84103a` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/core/zip-store.js` | `5b4ce816ff9e18c3b4a850657c31b2902315f90b9a2ac50bc520dfb5daa9a525` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/editor/index.js` | `bdfa5bca05eb13931b615ba070c7d89f613f15f46259acb5084c1c46c44d5973` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/editor/index.json` | `0774009721f76cd8b1898cb14a6aed74aafbc755ba4a2b2e39123c70a69e9d82` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/editor/index.wxml` | `7b9a131658ca39102b6bbf2801ba9e1fff7af08244a4d3815a2f930240650a16` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/editor/index.wxss` | `e2fd0a815a9e9ff3cd53c6d289c5166c122ca3d61b63fd0330acf71eb3d6ace3` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/fixtures/transfer-sample.js` | `46c35bbcc27588e3e7afcc58be75191d8822a33d44bcd0848b5c068ae56be060` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/platform/cloud-work.js` | `0170d9094e4182028423abb2fddde7bc313e8de4658e667743eb17e648cda00a` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/platform/crop-gesture.js` | `5fb8dd7ce4ee3817b8b1447266408d54c25c8d762e343d6b7d41e3a206dc9bb3` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/platform/errors.js` | `5c50c469f289339ece66bdb22fe993a8fe5e25f640519383768684414abae927` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/platform/files.js` | `f5ab8f7f95f4e7466f80c9228d025470fad5e8156cfdba12248ae73b4fb775cd` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/platform/input.js` | `987196c3d9c34e255c90029f0f32853242c999273e644c1ff13fafff2f97ed21` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/platform/order-service.js` | `6ebb1c16244f1d793feb7a03ae2c0168df6ac78296fdb682f3558ed22801fbc1` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/platform/paid-ledger-legacy.js` | `b9b477973a29dba6690ded7bc97a85535750af9fb531730f3b2320c734eab618` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/platform/paid.js` | `124edb3393ae84023385456ee39b1365d1fc747186aa47170c2fd801a500975b` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/platform/preview-paid.js` | `9b95f3d593500e9d71ac57a154163428016e53c7b1e790f0607d65b066cd74ae` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/platform/raster.js` | `703eb053d65a60205296fb90542cb9103566139eb8c42a4d37c9637cf4ae7551` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/platform/scf-purchase.js` | `999d1f1bfdb34df0285ae6fc3c14dd09b614f30ba4220ced32aa9fae7fc6071c` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/platform/scf-segmentation.js` | `51457dc982039c26d39da81f1b0ca444768d5bdc30c0ea75dcf65b796f057f13` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/process/controller.js` | `98a5d0a7e446ef58d1ffcbcbfdf627fadd07cd60e0e10e177dcbdfc1e0a5909f` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/process/index.js` | `82800cb2151adf76fa2b1eaf5e9198a7d31d83763643a5b580b36c725d9e0d32` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/process/index.json` | `39dfe38dae7d9f1045d197757a492aee2203112a3ff104313523899e86072b6c` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/process/index.wxml` | `0fd8e682674359917f876821fd59387631894b9e9139e25e196f88f2ec6881d5` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/process/index.wxss` | `8f212fb0e388843bec7b8ed4d349e3e30c5e6422f1923be9cc37a395546e9d8e` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/profiles/gwy.js` | `fdb41247f1dd2072c0e082a61543d7a253400056da6955a8d92461f8c22f1182` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/profiles/henan-retained.js` | `efa31eae238e06093146bcc669c846e5f0357e7f8fbaaed8cdab5dc6b5c4e716` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/profiles/index.js` | `801f1d09cd60a13ed67d69ec9e371cb02d38f1b878340ef710446e9638ed6ae9` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/profiles/jpeg-q40.js` | `06281ab31745d5d8f20aeb565b03285aa4e8b377bf3e51102dc8571cdb281271` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/profiles/sichuan.js` | `ea6d3cc271dc26bed069c52ebb82ea81413be73f243cfcf5725a387b5e88eb7b` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/vendor/LICENSE-jpeg-js.txt` | `1fe5f5c9fea6e7f1e2a7f2cc69433cdbdd42f23cd107e3e6c1dd57a2c377b6b8` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/vendor/jpeg-encoder.js` | `9cae6cd91f6c0621ff47a84deda8b243a3f82729d3d956a4e698d6cc46057bee` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/workbench/index.js` | `b560b0c1f751552d99375a455c9064eb8738e424ea15a687b88d98313b3ddeec` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/workbench/index.json` | `56e078e4373181a8773afdadff491eb63a1a079c757cc7e0404bec31d4e2f5b0` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/workbench/index.wxml` | `823cfae0838d406f0a5700724c2e3dfb395a4904172bdf7c14cfc0b068a5ca4e` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/workbench/index.wxss` | `8973e0a883cab1ec7e766f0ac91e4979f23077bd47c48605a401026fb20315c3` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/scf/photo-segment/README.md` | `5d2987b89fd067fdea5e452a1c36c64c9179a6473db5ea7ff66cc69da0477c7c` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/scf/photo-segment/index.js` | `ab78f55e8bf4369fb41ba5c89a78dcd790b7db0462abb170aef3529a29d690fc` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/scf/photo-segment/package-lock.json` | `02147208b1e1b3cf35e2cf81b47fc2c9198007f07647ae7e262f51c00e232370` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/scf/photo-segment/package.json` | `acc5f0278ae9d71b3349ac286ac6a825d86a6f0646557fc244ac7c5e5356a27b` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/scf/photo-segment/preview.js` | `49792185676fa8a9cfb9de02dc3305f02a257183fac0063bf788c9bf95e2f0ae` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/scf/photo-segment/purchase.js` | `fb5dc7801e6a4a4620d96d9f75ac880cea8280b56fba50a2f26964391f862727` |
| `/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/scf/photo-segment/usage-store.js` | `e18c8793772b6a47e908bbc1928a1daa63a52a0aec04092634d657b56d5b8db0` |

### 历史来源线索身份

以下文件在历史保护区为未跟踪状态，本次未改动，仅供追溯：

- `/Users/jmac/WeChatProjects/miniprogram-1/docs/photo-poc/TOOL-ADAPTATION-WORKFLOW.md`，SHA-256 `3fa2f34ae96529c2a3cf47e3130051cf6aac0a241518be2bda8c20f6baab9086`。
- `/Users/jmac/WeChatProjects/miniprogram-1/docs/photo-poc/tool-source-registry.json`，SHA-256 `e26ba4a3fe74a385fa5d8140a651186a6c4ef18609903664098208bbb859bd2f`。
- `/Users/jmac/WeChatProjects/miniprogram-1/docs/photo-poc/tool-analysis-evidence.json`，SHA-256 `a4676aba2e7869794d46a1c84f293f8bf28573611ac3be181d47c7e87e3509b2`。
- `/Users/jmac/WeChatProjects/miniprogram-1/docs/photo-poc/MASTER-PLAN.md`，SHA-256 `51a6be34cd737c5ca1a267f75751ab1d1bd790f2f04d6d9003ec881b28de4bdd`。

工具说明DOC、界面BMP、ZIP和EXE保持原包；本次临时纯文本/PNG仅用于读取，不作新权威来源，不需要保留独立执行目录。所有可追溯结论已写入本报告；原始资料和历史Git记录未删除或改写。

## 用户确认的免责声明待实施要求

2026年11月2日，用户要求先记录文档，照片项目恢复后再加入产品。本节是后续实施要求，当前未修改页面、未集成照片候选、未上传或发布；照片开发继续暂停，待性能工作完成后从最新main核对并实施。原审查正文及证据完整保留；本节提供的完整文案替代前文182字建议作为未来产品实施文本，不改写当时的审查结论。

### 入口与弹窗

- 入口位置：照片处理页底部按钮上方，现有“第三方辅助工具，最终以官方审核为准”文字处。当前定位为 [process/index.wxml 第105行](/Users/jmac/WeChatProjects/miniprogram-main-r5-20261029/miniprogram/subpackages/photo/process/index.wxml:105) 的 `action-disclaimer`；未来从最新main重新定位，不依赖旧行号。
- 将上述现有文字设为可点击的链接入口；点击后以弹窗展示下方完整声明，标题为“关于本工具与使用说明”。
- 正文较长，须能完整阅读并关闭返回原页面，保留当时的照片、裁剪及处理状态。此入口用于阅读说明，不增加用户未要求的强制勾选、付款或AI调用。
- 用户已澄清只有这一份说明；本轮待实施范围仅为本声明及其链接弹窗入口。
- 实施时复用届时有效的设计系统弹窗与链接规则，验证打开、滚动、关闭及返回状态；本次文档记录不表示页面已实现或设备验收通过。

### 完整文案

#### 关于本工具与使用说明

「花生开小灶」提供独立开发的第三方考试报名照片辅助处理服务，参考相关考试的照片格式与处理要求，通过图像裁剪、尺寸调整、编码转换等技术，帮助考生在手机上完成照片处理与文件导出。

**本工具并非考试主管部门开发、指定或授权的软件，与官方考试机构不存在授权合作关系。**

本工具生成照片成功，仅代表完成了相应的文件处理，不代表照片已通过官方审核，也不保证所有报名系统均能接收。

请使用本人真实、近期、符合要求的证件照，并自行核对照片的背景、清晰度、尺寸及其他报考要求。如考试公告要求使用指定的照片处理工具，请以官方规定和操作流程为准。

部分考试禁止美化或修饰照片。使用 AI 换背景功能前，请确认相关考试要求，并注意自动处理可能产生的边缘瑕疵。

对于本工具自身的处理故障、付费交付及个人信息处理等问题，我们将按照适用法律和服务规则承担相应责任，并提供必要的售后支持。
