const mod = require('./dist/src/index.js');
const TempMail = mod.default;
TempMail.TEMP_MAIL_DOMAINS = mod.TEMP_MAIL_DOMAINS;
module.exports = TempMail;
