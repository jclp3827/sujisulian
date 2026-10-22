#!/usr/bin/env node
const {validate}=require("./lib/validate-common-sense-c5-batch");
console.log(JSON.stringify(validate(require("../docs/knowledge-platform/content/common-sense-content-c5-60"),{version:"2026-10-22.72",questions:606,groups:133,targets:497,mnemonics:129}),null,2));
