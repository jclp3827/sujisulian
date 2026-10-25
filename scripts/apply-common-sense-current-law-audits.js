#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { applyReview } = require("./apply-administrative-current-law-audit");

const directory = path.resolve(__dirname, "../docs/common-sense-current-law-audit");
for (const file of fs.readdirSync(directory).filter((name) => name.endsWith(".json")).sort()) {
  applyReview(path.join("docs/common-sense-current-law-audit", file));
}
