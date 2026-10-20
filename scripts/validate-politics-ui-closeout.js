const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const surfaces = [
  "miniprogram/subpackages/politics/detail/index",
  "miniprogram/subpackages/politics/search/index",
  "miniprogram/subpackages/politics/route/guided-route",
];

function consumers(base) {
  const template = fs.readFileSync(path.join(root, base + ".wxml"), "utf8");
  const controller = fs.readFileSync(path.join(root, base + ".js"), "utf8");
  const attributes = [...template.matchAll(/class="([^"]*)"/g)].map((match) => match[1]);
  const literalClasses = new Set(attributes.flatMap((value) => value.match(/[a-zA-Z_][\w-]*/g) || []));
  // Keep generated route, cycle, section and narrative classes even when their
  // suffix is supplied by runtime data rather than a literal in the template.
  const dynamicPrefixes = attributes.flatMap((value) =>
    [...value.matchAll(/([a-zA-Z_][\w-]*)\{\{/g)].map((match) => match[1]));
  return (name) => literalClasses.has(name)
    || dynamicPrefixes.some((prefix) => name.startsWith(prefix))
    || controller.includes("." + name);
}

function unusedSelector(selector, isConsumed) {
  const names = [...selector.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/\.([a-zA-Z_][\w-]*)/g)]
    .map((match) => match[1]);
  return names.some((name) => !isConsumed(name));
}

function validate() {
  const unused = [];
  for (const base of surfaces) {
    const isConsumed = consumers(base);
    const source = fs.readFileSync(path.join(root, base + ".wxss"), "utf8");
    for (const rule of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      for (const selector of rule[1].split(",")) {
        if (unusedSelector(selector, isConsumed)) unused.push(base + ": " + selector.trim());
      }
    }
  }
  assert.deepEqual(unused, [], "political page styles have no current template or selector consumer");
  const guided = fs.readFileSync(path.join(root, surfaces[2] + ".wxml"), "utf8");
  assert.ok(!/四站中穿插|策展锚点暂不可用|start\.details\.anchorCount/.test(guided),
    "historical four-stop quick guide returned to the active template");
  const controller = fs.readFileSync(path.join(root, surfaces[2] + ".js"), "utf8");
  assert.ok(!/handleTourNext|handleTourAnchor|quickSpace/.test(controller),
    "historical tour handlers returned to the active controller");
  console.log("Political UI closeout validation passed: 3 page styles, dynamic classes preserved, no historical quick template");
}

if (require.main === module) validate();
module.exports = { consumers, surfaces, unusedSelector };
