const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const miniprogramRoot = path.join(projectRoot, "miniprogram");
const projectConfig = JSON.parse(fs.readFileSync(path.join(projectRoot, "project.config.json"), "utf8"));
const appConfig = JSON.parse(fs.readFileSync(path.join(miniprogramRoot, "app.json"), "utf8"));
const limitBytes = 1.5 * 1024 * 1024;

const subpackageRoots = (appConfig.subPackages || []).map((item) => `${item.root.replace(/\/$/, "")}/`);
const ignores = projectConfig.packOptions?.ignore || [];

function collectFiles(directory, files = []) {
  fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) collectFiles(filePath, files);
    else files.push(filePath);
  });
  return files;
}

function isIgnored(relativePath) {
  if (subpackageRoots.some((root) => relativePath.startsWith(root))) return true;
  return ignores.some((rule) => {
    if (rule.type === "file") return relativePath === rule.value;
    if (rule.type === "folder") return relativePath === rule.value || relativePath.startsWith(`${rule.value}/`);
    return false;
  });
}

const includedFiles = collectFiles(miniprogramRoot)
  .map((filePath) => ({ filePath, relativePath: path.relative(miniprogramRoot, filePath) }))
  .filter((item) => !isIgnored(item.relativePath));
const totalBytes = includedFiles.reduce((total, item) => total + fs.statSync(item.filePath).size, 0);

console.log(JSON.stringify({
  mainPackageBytes: totalBytes,
  mainPackageMiB: Number((totalBytes / 1024 / 1024).toFixed(3)),
  limitMiB: 1.5,
  includedFiles: includedFiles.length,
}, null, 2));

if (totalBytes > limitBytes) process.exitCode = 1;
