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
  "subpackages/politics/practice/index.wxml",
];
for (const file of consumers) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  assert.ok(source.includes("politics-theme"), file + " does not consume the module skin");
  assert.ok(!/>[›⌃⌄]</.test(source), file + " contains a font-dependent navigation arrow");
}
for (const name of ["--ui-chevron-size", "--ui-chevron-stroke", "--ui-button-height", "--ui-page-gutter", "--ui-action-height", "--ui-action-font", "--ui-action-padding-x", "--ui-action-gap", "--ui-progress-padding-y", "--ui-progress-label-font", "--ui-progress-value-font", "--ui-button-primary-background", "--ui-button-secondary-background", "--ui-button-ghost-background", "--ui-emphasis-key-shadow", "--ui-emphasis-boundary-offset"]) {
  assert.ok(theme.includes(name + ":"), name + " must be owned by the shared theme");
}
const unitActions = fs.readFileSync(path.join(root, "subpackages/politics/route/units.wxss"), "utf8");
const guidedActions = fs.readFileSync(path.join(root, "subpackages/politics/route/guided-route.wxss"), "utf8");
const sessionStyles = fs.readFileSync(path.join(root, "styles/session.wxss"), "utf8");
const sharedUi = fs.readFileSync(path.join(root, "styles/ui.wxss"), "utf8");
const unitMarkup = fs.readFileSync(path.join(root, "subpackages/politics/route/units.wxml"), "utf8");
const guidedMarkup = fs.readFileSync(path.join(root, "subpackages/politics/route/guided-route.wxml"), "utf8");
const practiceMarkup = fs.readFileSync(path.join(root, "subpackages/politics/practice/index.wxml"), "utf8");
for (const token of ["--ui-action-height", "--ui-action-font", "--ui-action-padding-x", "--ui-action-gap"]) {
  assert.ok(sessionStyles.includes(`var(${token})`) || sharedUi.includes(`var(${token})`), `shared session controls do not consume ${token}`);
}
assert.ok(sharedUi.includes('@import "session.wxss";'), "global UI does not expose the shared session styles");
for (const page of ["session", "assumption", "estimation", "ratio-sense"]) {
  const pageRoot = path.join(root, `pages/training/${page}/index`);
  const markup = fs.readFileSync(pageRoot + ".wxml", "utf8");
  const pageStyles = fs.readFileSync(pageRoot + ".wxss", "utf8");
  assert.ok(markup.includes("session-progress-track") && markup.includes("session-progress-fill"), `${page} does not consume shared training progress`);
  assert.ok(!pageStyles.includes(".session-progress-track") && !pageStyles.includes(".session-progress-fill"), `${page} still owns a duplicate progress implementation`);
}
assert.ok(fs.readFileSync(path.join(root, "components/session-head/index.wxss"), "utf8").includes('@import "../../styles/session.wxss";'), "session-head component does not consume the shared session styles");
for (const [source, label] of [[unitMarkup, "systematic units"], [guidedMarkup, "quick and exam routes"], [practiceMarkup, "daily practice"]]) {
  assert.ok(source.includes("session-action-row") && source.includes("btn-base") && source.includes("btn-compact"), `${label} do not reuse shared session actions`);
}
const cardSurface = fs.readFileSync(path.join(root, "components/knowledge-card-surface/index.wxss"), "utf8");
const practiceProgress = fs.readFileSync(path.join(root, "subpackages/politics/practice/index.wxss"), "utf8");
for (const [source, label] of [[guidedActions, "guided routes"], [unitActions, "systematic units"], [practiceProgress, "daily practice"]]) {
  for (const token of ["--ui-progress-padding-y", "--ui-progress-label-font", "--ui-progress-value-font"]) {
    assert.ok(source.includes(`var(${token})`), `${label} does not consume ${token}`);
  }
}
assert.match(sessionStyles, /\.session-progress-track\s*\{[^}]*height:\s*8rpx[^}]*margin-top:\s*12rpx/, "training progress geometry is not shared");
assert.ok(guidedMarkup.includes("session-progress-track session-progress-segments"), "guided routes do not reuse segmented training progress");
assert.ok(unitMarkup.includes("session-progress-track unit-progress-track") && unitMarkup.includes("session-progress-fill unit-progress-fill"), "systematic units do not reuse continuous training progress");
for (const [source, label] of [[guidedActions, "quick reading"], [unitActions, "systematic units"], [cardSurface, "standalone reading"]]) {
  assert.ok(source.includes("var(--ui-emphasis-key-shadow)"), label + " does not consume the shared key emphasis");
  assert.ok(source.includes("var(--ui-emphasis-boundary-offset)"), label + " does not consume the shared boundary emphasis");
}
assert.match(cardSurface, /\.knowledge-card-skin-politics\s*\{[^}]*--ui-emphasis-key-shadow:\s*inset 0 -\.4em 0 var\(--color-primary-100\)/, "isolated article component does not receive the politics emphasis paint");
assert.ok(sessionStyles.includes(".session-action-left") && sessionStyles.includes(".session-action-center") && sessionStyles.includes(".session-action-right"), "shared learning action positions are missing");
const home = JSON.parse(fs.readFileSync(path.join(root, "pages/politics/index.json"), "utf8"));
assert.ok(!home.navigationStyle || home.navigationStyle === "default", "politics home uses a different navigation shell");
console.log("UI token validation passed: " + styles.length + " styles, " + politicalStyles.length + " political surfaces, 7 skin consumers");
