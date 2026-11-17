const mod = require('./dist/src/index.js');
module.exports = mod.default;
/** Written as `module.exports.X =` so Node's ESM loader detects it as a named export. */
module.exports.TEMP_MAIL_DOMAINS = mod.TEMP_MAIL_DOMAINS;
