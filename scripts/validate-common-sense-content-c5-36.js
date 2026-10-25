#!/usr/bin/env node
const {validate}=require("./lib/validate-common-sense-c5-batch");
console.log(JSON.stringify(validate(require("../docs/knowledge-platform/content/common-sense-content-c5-36")),null,2));
