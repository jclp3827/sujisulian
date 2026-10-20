const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../miniprogram");
const theme = fs.readFileSync(path.join(root, "styles/theme.wxss"), "utf8");
const skin = fs.readFileSync(path.join(root, "styles/module-skins.wxss"), "utf8");
function tokenValues(source) {
  return new Map([...source.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);/g)]
    .map((match) => [match[1], match[2]]));
}
function checkTokenCycles(values, label) {
  const complete = new Set();
  function visit(name, chain = []) {
    assert.ok(!chain.includes(name), label + " has a token cycle: " + [...chain, name].join(" -> "));
    if (complete.has(name) || !values.has(name)) return;
    for (const match of values.get(name).matchAll(/var\(\s*(--[\w-]+)/g)) {
      visit(match[1], [...chain, name]);
    }
    complete.add(name);
  }
  for (const name of values.keys()) visit(name);
}
const sharedValues = tokenValues(theme);
const politicalValues = new Map([...sharedValues, ...tokenValues(skin)]);
checkTokenCycles(sharedValues, "shared theme");
checkTokenCycles(politicalValues, "political skin");
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}
const styles = walk(root).filter((file) => file.endsWith(".wxss"));
const definitions = new Set(styles.flatMap((file) =>
  [...fs.readFileSync(file, "utf8").matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1])
));
const politicalStyles = styles.filter((file) =>
  /\/(?:pages\/politics|subpackages\/politics|components\/(?:knowledge-card-surface|knowledge-space-surface|contrast-surface))\//.test(file)
);
const missing = [];
for (const file of styles) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(/var\(\s*(--[\w-]+)/g)) {
    if (!definitions.has(match[1])) missing.push(path.relative(root, file) + ": " + match[1]);
  }
}
assert.deepEqual(missing, [], "style references an undefined token");
for (const file of politicalStyles) {
  const source = fs.readFileSync(file, "utf8");
  const label = path.relative(root, file);
  assert.ok(!/font-size\s*:\s*\d+rpx/.test(source), label + " bypasses shared typography");
  const available = new Map([...politicalValues, ...tokenValues(source)]);
  for (const match of source.matchAll(/var\(\s*(--[\w-]+)/g)) {
    assert.ok(available.has(match[1]), label + " depends on a token defined only in another surface: " + match[1]);
  }
  checkTokenCycles(available, label);
  // A later shorthand silently erases narrow-screen and reading-mode insets.
  for (const rule of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const properties = [...rule[2].matchAll(/(?:^|;)\s*([\w-]+)\s*:/g)].map((match) => match[1]);
    properties.forEach((property, index) => {
      if (property === "padding") {
        assert.ok(!properties.slice(0, index).some((name) => name.startsWith("padding-")),
          label + " resets a padding inset in " + rule[1].trim());
      }
    });
  }
}

const skinProperties = [...skin.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]);
assert.ok(skinProperties.every((name) =>
  !/(?:font|radius|gutter|padding|gap|height|width|size|stroke)/.test(name)
), "module skin must not change shared geometry or typography");
const consumers = [
  "pages/politics/index.wxml",
  "subpackages/politics/search/index.wxml",
  "subpackages/politics/map/index.wxml",
  "subpackages/politics/detail/index.wxml",
  "subpackages/politics/route/guided-route.wxml",
  "subpackages/politics/coming-soon/index.wxml",
];
for (const file of consumers) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  assert.ok(source.includes("politics-theme"), file + " does not consume the module skin");
  assert.ok(!/>[›⌃⌄]</.test(source), file + " contains a font-dependent navigation arrow");
}
for (const name of ["--ui-chevron-size", "--ui-chevron-stroke", "--ui-button-height", "--ui-page-gutter"]) {
  assert.ok(theme.includes(name + ":"), name + " must be owned by the shared theme");
}
const home = JSON.parse(fs.readFileSync(path.join(root, "pages/politics/index.json"), "utf8"));
assert.ok(!home.navigationStyle || home.navigationStyle === "default", "politics home uses a different navigation shell");
console.log("UI token validation passed: " + styles.length + " styles, " + politicalStyles.length + " political surfaces, 6 skin consumers");
