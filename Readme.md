<p align="center" class="logo-section">
<img src="https://i.ibb.co/j9FFpf8p/image.png" height="80" width="80" alt="Temp Mail Plus API logo"/>
</br>
<img src="https://halitsever-api.vercel.app/api/repo-title?title=Temp+Mail+Plus+API">

<p align="center">
📨 Unofficial Temp Mail Plus API client for Node.js and TypeScript.<br>
A temp mail API wrapper for tempmail.plus: create temporary email addresses, read the inbox and delete mails from your code.<br>
<b>Unofficial community project. Not affiliated with or endorsed by Temp Mail Plus.</b><br>
<br/>
<br/>
<img src="https://img.shields.io/github/sponsors/halitsever" alt="GitHub sponsors"/>
<a href="https://www.npmjs.com/package/temp-mail-plus-api"><img src="https://img.shields.io/npm/v/temp-mail-plus-api" alt="npm version"/></a>
</p>
<p align="center">
<a align="center" href="https://www.npmjs.com/package/temp-mail-plus-api">Documentation</a>
  </p>
</p>

<p align="center">
<img src="https://halitsever-api.vercel.app/api/details"/>
</p>

- 💌 [**Create temp mails**](#) - via temp mail plus
- 📩 [**Easy usage**](#) - Create & read temp mails easily
- 🗑️ [**Delete mails**](#) - Delete individual mails from your inbox
- [**TypeScript types**](#) - Type definitions ship with the package, and it works with both `import` and `require()`

<p align="center" >
<img src="https://halitsever-api.vercel.app/api/installation"/>
</p>

Install from npm:

```bash
npm install temp-mail-plus-api
```

### Temporary email API usage

Generate a random email address:

```javascript
import TempMail from "temp-mail-plus-api";

// random username, random domain
const { email } = TempMail.generateEmail();

// custom username
const { email } = TempMail.generateEmail("halit");

// custom username + domain
const { email } = TempMail.generateEmail("halit", "fexpost.com");

const tempMail = new TempMail(email);
```

Fetching inbox by email:

```javascript
import TempMail from "temp-mail-plus-api";
const tempMail = new TempMail("halit@rover.info");
const inbox = await tempMail.fetchInbox();
```

Fetching mail content by `mail_id`:

```javascript
const mailId = 32944585;
await tempMail.fetchMailById(mailId);
```

Deleting a mail by `mail_id`:

```javascript
await tempMail.deleteMailById(mailId);
```

Get all mail domains:

```javascript
import TempMail, { TEMP_MAIL_DOMAINS } from "temp-mail-plus-api";
console.log(TEMP_MAIL_DOMAINS);
```

Custom timeout (default: 10s):

```javascript
const tempMail = new TempMail("halit@rover.info", { timeout: 5000 });
```

<p align="center" href="https://github.com/halitsever/temp-mail-plus-api/issues">
<img src="https://halitsever-api.vercel.app/api/issue"/>
</p>

<p align="center">
Found a bug or have an idea? Open an <a href="https://github.com/halitsever/temp-mail-plus-api/issues">issue</a>.<br/>
Read the <a href=".github/CONTRIBUTING.md">contributing guide</a> before sending a pull request.
</p>

<p align="center">
<img src="https://halitsever-api.vercel.app/api/sponsor"/>
</p>

<p align="center">
<img src="https://halitsever-api.vercel.app/api/license"/>
</p>

<p align="center">
  MIT LICENSE - <a href="https://halit.org">Halit Sever</a>
</p>
