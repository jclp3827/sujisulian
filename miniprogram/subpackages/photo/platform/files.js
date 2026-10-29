const { bytes, equalBytes } = require("../core/bytes");
const { sha256 } = require("../core/sha256");

const MAX_BYTES = 8 * 1024 * 1024; // PoC resource limit, not an examination rule.

function call(target, method, options) {
  return new Promise((resolve, reject) => {
    if (typeof target[method] !== "function") return reject(new Error("当前微信不支持此操作"));
    target[method](Object.assign({}, options, { success: resolve, fail: reject }));
  });
}

function createFiles(wxApi, namespace) {
  const scope = namespace || "transfer-v1";
  if (["transfer-v1", "process-v1"].indexOf(scope) === -1) throw new Error("无效的照片临时目录");
  const fs = wxApi.getFileSystemManager();
  const directory = wxApi.env.USER_DATA_PATH + "/photo-poc-" + scope;
  const owned = new Set();
  let disposed = false, sequence = 0;
  let selection = null;

  function pick(method, options) {
    if (disposed) return Promise.reject(new Error("页面已关闭，请重新进入"));
    if (selection) return Promise.reject(new Error("请先完成或取消当前选图"));
    return new Promise((resolve, reject) => {
      let settled = false;
      const current = { cancel: () => finish(reject, new Error("choose:fail cancel")) };
      function finish(callback, value) {
        if (settled) return;
        settled = true; clearTimeout(timer);
        if (selection === current) selection = null;
        callback(value);
      }
      const timer = setTimeout(() => finish(reject, new Error("选图窗口未响应，请关闭可能未完成的选图窗口后重试，或从聊天文件选择")), 90000);
      selection = current;
      try {
        if (typeof wxApi[method] !== "function") throw new Error("当前微信不支持此选图方式");
        wxApi[method](Object.assign({}, options, {
          success: result => finish(resolve, result), fail: error => finish(reject, error)
        }));
      } catch (error) { finish(reject, error); }
    });
  }

  function cancelSelection() { if (selection) selection.cancel(); }

  async function remove(path) {
    if (!owned.has(path)) return;
    try { await call(fs, "unlink", { filePath: path }); } catch (_) {}
    owned.delete(path);
  }

  async function init() {
    try { await call(fs, "mkdir", { dirPath: directory, recursive: true }); }
    catch (error) {
      // Existing directory is expected; readdir below still verifies access.
    }
    const listing = await call(fs, "readdir", { dirPath: directory });
    for (const name of listing.files) {
      if (/^transfer-[a-z0-9-]+\.(jpg|png|json|zip)$/.test(name)) {
        const path = directory + "/" + name;
        owned.add(path);
        await remove(path);
      }
    }
  }

  async function read(path, maximum) {
    const limit = maximum || MAX_BYTES;
    const info = await call(fs, "stat", { path });
    if (!info.stats || !info.stats.isFile() || info.stats.size > limit || info.stats.size < 1) {
      throw new Error("请选择不超过 " + limit / 1024 / 1024 + " MB 的文件");
    }
    const response = await call(fs, "readFile", { filePath: path });
    const data = bytes(response.data);
    if (data.length < 1 || data.length > limit) throw new Error("照片较大，当前设备暂时无法完成处理");
    return data;
  }

  async function writeVerified(value, extension, maximum) {
    const data = bytes(value);
    const limit = maximum || MAX_BYTES;
    if (disposed) throw new Error("页面已关闭，请重新进入");
    if (!data.length || data.length > limit) throw new Error("照片较大，当前设备暂时无法完成处理");
    const path = directory + "/transfer-" + Date.now().toString(36) + "-" + (++sequence) + "." + (["json", "png", "zip"].includes(extension) ? extension : "jpg");
    owned.add(path);
    try {
      await call(fs, "writeFile", { filePath: path, data: new Uint8Array(data).buffer });
      const readBack = await read(path, limit);
      if (!equalBytes(data, readBack)) throw new Error("本地写入前后字节不一致，已停止导出");
      if (disposed) throw new Error("页面已关闭，请重新进入");
      return { path, bytes: data.length, sha256: sha256(readBack) };
    } catch (error) {
      await remove(path);
      throw error;
    }
  }

  async function choose() {
    const response = await call(wxApi, "chooseMessageFile", { count: 1, type: "file", extension: ["jpg", "jpeg", "JPG", "JPEG"] });
    if (!response.tempFiles || response.tempFiles.length !== 1) throw new Error("未选到文件");
    return read(response.tempFiles[0].path);
  }

  async function choosePhoto() {
    const response = await call(wxApi, "chooseImage", { count: 1, sizeType: ["original"], sourceType: ["album"] });
    if (!response.tempFilePaths || response.tempFilePaths.length !== 1) throw new Error("未选到照片");
    return read(response.tempFilePaths[0]);
  }

  async function choosePath(album) {
    if (!album) {
      const r = await pick("chooseMessageFile", { count: 1, type: "file", extension: ["jpg", "jpeg", "png", "heic", "heif", "JPG", "JPEG", "PNG", "HEIC", "HEIF"] });
      if (!r.tempFiles || !r.tempFiles[0]) throw new Error("未选到文件");
      return r.tempFiles[0].path;
    }
    let simulator = false;
    try {
      const info = typeof wxApi.getDeviceInfo === "function" ? wxApi.getDeviceInfo() : wxApi.getSystemInfoSync();
      simulator = info.platform === "devtools";
    } catch (_) {}
    const canImage = typeof wxApi.chooseImage === "function" && (!wxApi.canIUse || wxApi.canIUse("chooseImage"));
    // The observed DevTools chooseMedia call never completed. Use its image-only
    // picker there; retain chooseMedia on devices for native format support.
    if ((!simulator || !canImage) && typeof wxApi.chooseMedia === "function" && (!wxApi.canIUse || wxApi.canIUse("chooseMedia"))) {
      const r = await pick("chooseMedia", { count: 1, mediaType: ["image"], sizeType: ["original", "compressed"], sourceType: ["album"] });
      if (!r.tempFiles || !r.tempFiles[0]) throw new Error("未选到照片");
      return r.tempFiles[0].tempFilePath;
    }
    const r = await pick("chooseImage", { count: 1, sizeType: ["original", "compressed"], sourceType: ["album"] });
    if (!r.tempFilePaths || !r.tempFilePaths[0]) throw new Error("未选到照片");
    return r.tempFilePaths[0];
  }

  async function share(record, fileName, stillCurrent) {
    if (!record || disposed) throw new Error("请先准备校验文件");
    // Keep the native share call in the button's synchronous call chain.
    // These are generated/owned files; hash equality also preserves their verified format.
    if (typeof fs.statSync !== "function" || typeof fs.readFileSync !== "function") throw new Error("当前微信不支持原文件同步校验，请更新微信后重试");
    const info = fs.statSync(record.path);
    if (!info || !info.isFile() || info.size < 1 || info.size > MAX_BYTES) throw new Error("导出文件不存在或大小异常，请重新生成");
    const actual = bytes(fs.readFileSync(record.path));
    if (actual.length !== record.bytes || sha256(actual) !== record.sha256) throw new Error("导出前文件已改变，请重新准备");
    if (stillCurrent && !stillCurrent()) throw new Error("输入已改变或页面已关闭，请重新生成");
    return call(wxApi, "shareFileMessage", { filePath: record.path, fileName });
  }

  async function dispose() {
    disposed = true;
    cancelSelection();
    await Promise.all(Array.from(owned, (path) => remove(path)));
  }

  return { init, read, choose, choosePhoto, choosePath, cancelSelection, writeVerified, share, remove, dispose };
}

module.exports = { createFiles, MAX_BYTES, call };
