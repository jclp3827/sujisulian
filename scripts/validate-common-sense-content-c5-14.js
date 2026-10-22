const batch = require("../docs/knowledge-platform/content/common-sense-content-c5-14");
const { validate } = require("./lib/validate-common-sense-c5-batch");
console.log(JSON.stringify(validate(batch), null, 2));
