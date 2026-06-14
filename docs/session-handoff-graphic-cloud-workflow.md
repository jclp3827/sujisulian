# 会话交接：图形推理挂图与云资源流程

更新时间：2026-06-14

## 当前结论

图形推理模块的“结构导图 + 局部图 + 云函数临时链接”流程已经跑通，后续资料分析图片处理可以复用这套流程。

当前图形推理状态：

- `miniprogram/models/note-graphic.js` 已完成 7 分类、36 知识点首轮局部图挂载。
- 模型内图片路径统一使用云资源相对路径，例如 `graphic/black-white-17-count.png`。
- 小程序详情页不再直接访问本地图片，也不再直接访问公开云存储 URL。
- 图片通过云函数 `getImage` 转换为临时访问 URL 后渲染。
- 图形源图已从 `miniprogram/` 移到 `assets-source/graphic/`，真机调试包体积已从约 10MB 降到约 1.5MB。

## 已完成的关键改动

### 云资源路径

模型中原路径：

```js
src: "/images/notes/graphic/example.png"
```

已改为：

```js
src: "graphic/example.png"
```

运行时由云函数解析，不再使用公开 URL 直连。

### 云函数

本地云函数目录：

```text
cloudfunctions/getImage/
```

关键文件：

```text
cloudfunctions/getImage/index.js
cloudfunctions/getImage/package.json
```

云函数名：

```text
getImage
```

云函数职责：

1. 接收前端传入的相对路径：`graphic/xxx.png`
2. 拼接完整 fileID：`cloud://.../note-resources/graphic/xxx.png`
3. 调用 `cloud.getTempFileURL`
4. 返回 `{ code: 0, url }`

前端调用方式：

```js
wx.cloud.callFunction({
  name: 'getImage',
  data: { path: 'graphic/xxx.png' }
})
```

### 小程序云初始化

`miniprogram/app.js` 已初始化云环境：

```js
wx.cloud.init({
  env: 'cloud1-d8gw5r2il0c0f198a',
  traceUser: true,
})
```

### 详情页图片解析

`miniprogram/pages/note-detail/index.js` 已支持：

- `graphic/*.png` 初始不直接渲染，避免被当成本地路径 `/pages/note-detail/graphic/*.png`。
- 先显示“图片加载中”。
- 调用 `getImage` 获取临时 URL。
- 成功后替换为临时 URL。
- 失败后显示“图片加载失败，请检查云端图片路径”。
- 页面级内存缓存 `imageUrlCache` 避免重复请求同一张图。

修复过的问题：

- 失败时不能返回原始 `graphic/*.png`，否则 `<image>` 会尝试加载本地相对路径。
- 没有 `image` 字段的导图节点不能被误标记为 `loadFailed`。
- `placeholder/error.png` 没有上传，不再作为失败兜底图使用。

## 图片资源目录

正式运行路径：

```text
note-resources/graphic/xxx.png
```

模型引用路径：

```text
graphic/xxx.png
```

本地源图目录：

```text
assets-source/graphic/
```

不要再把大量图片放在：

```text
miniprogram/images/notes/graphic/
```

原因：微信开发者工具真机调试会把 `miniprogram/` 下资源打进源码包，超过 2MB 会报：

```text
source size exceed max limit 2MB
```

## Manifest

正式图形图片清单：

```text
scripts/graphic-assets-manifest.json
```

当前图形推理正式引用图数量：

```text
102
```

manifest 每项包含：

```json
{
  "path": "graphic/example.png",
  "source": "assets-source/graphic/example.png",
  "cloudPath": "note-resources/graphic/example.png"
}
```

## 自动上传工具

已安装并登录 CloudBase CLI。

新增脚本：

```text
scripts/upload-graphic-assets.js
```

上传并验证：

```bash
node scripts/upload-graphic-assets.js
```

只验证云端资源是否齐全：

```bash
node scripts/upload-graphic-assets.js --verify-only
```

当前验证结果已通过：

```json
{
  "mode": "verify-only",
  "total": 102,
  "uploaded": 0,
  "verified": 102,
  "failed": []
}
```

## 校验脚本

`tools/validate-notes` 不存在，使用：

```bash
node scripts/validate-notes.js
```

`validate-notes.js` 已补强：

- 检查数组空洞。
- 检查 `mind-map` 最大深度不超过 3。
- 检查模块 `loadError`。
- 检查 `graphic/*.png` 是否在 manifest 中。
- 检查本地源图是否存在于 `assets-source/graphic/`。
- 检查训练生成器。

训练校验：

```bash
node scripts/validate-training.js
```

常用完整校验：

```bash
node --check miniprogram/app.js
node --check miniprogram/pages/note-detail/index.js
node --check cloudfunctions/getImage/index.js
node scripts/validate-notes.js
node scripts/validate-training.js
node scripts/upload-graphic-assets.js --verify-only
```

## 后续处理资料分析图片的推荐流程

资料分析后续应复用图形推理流程，但建议新建独立资源目录和 manifest 路径，不要混进 `graphic/`。

建议路径：

```text
assets-source/data-analysis/
note-resources/data-analysis/
```

模型引用：

```js
src: "data-analysis/example.png"
```

后续需要泛化的点：

1. `getImage` 云函数目前只允许 `graphic/`：

```js
if (!path.startsWith('graphic/') || path.includes('..'))
```

处理资料分析前，需要改成允许：

```text
graphic/
data-analysis/
```

或维护白名单：

```js
const ALLOWED_PREFIXES = ['graphic/', 'data-analysis/']
```

2. `validate-notes.js` 目前主要针对 `graphic/` manifest：
   - 后续可扩展为通用 asset manifest，例如 `scripts/note-assets-manifest.json`。
   - 或新增 `scripts/data-analysis-assets-manifest.json`。

3. 上传脚本目前读取 `scripts/graphic-assets-manifest.json`：
   - 后续可泛化为接受 manifest 参数。

建议先不大重构，资料分析第一批图可以先新增一个 `data-analysis-assets-manifest.json`，再把上传脚本参数化。

## 注意事项

- 云函数名是 `getImage`，`getTempFileURL` 是云函数内部调用的 SDK 方法，不是函数名。
- 开发者工具里如果看到“调用本地云函数 getImage”，可能与云端环境不同；最终以云端部署函数和真机测试为准。
- 公开 URL 直接访问云存储会返回 403，这是正常的，因为个人版存储不支持公开直链；必须通过云函数获取临时 URL。
- 如果 `getImage` 返回 `storage file not exists`，优先检查：
  - 文件是否上传到正确目录；
  - 文件名是否完全一致；
  - manifest 的 `cloudPath` 是否正确。
- 不要上传整个文件夹导致多套一层目录；自动脚本已解决这个问题。

## 当前未提交/工作区提醒

当前工作区改动较多，包括：

- 云函数目录 `cloudfunctions/getImage/`
- 源图目录 `assets-source/graphic/`
- manifest 与上传脚本
- note-detail 云图解析逻辑
- validate-notes 校验增强
- 图形推理内容大幅更新
- 文档更新
- `project.private.config.json` 删除

提交前建议重新跑完整校验，并确认是否需要保留 `tmp_upload/`。通常 `tmp_upload/` 是临时上传准备目录，可以不提交。
