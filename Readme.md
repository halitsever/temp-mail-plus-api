<p align="center" class="logo-section">
<img src="https://i.ibb.co/j9FFpf8p/image.png" height="80" width="80"/>
</br>
<img src="https://halitsever-api.vercel.app/api/repo-title?title=Temp+Mail+Plus+API">

<p align="center">
📨 API Wrapper for Temp Mail Plus service<br>
<br/>
<br/>
<img src="https://img.shields.io/github/sponsors/halitsever"/>
</p>
<p align="center">
<a align="center" href="#">Documentation</a>
  </p>
</p>

<p align="center">
<img src="https://halitsever-api.vercel.app/api/details"/>
</p>

- 💌 [**Create temp mails**](#) - via temp mail plus
- 📩 [**Easy usage**](#) - Create & read temp mails easily

<p align="center" >
<img src="https://halitsever-api.vercel.app/api/installation"/>
</p>

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

Get all mail domains:

```javascript
import TempMail, { TEMP_MAIL_DOMAINS } from "temp-mail-plus-api";
console.log(TEMP_MAIL_DOMAINS);
```

<p align="center" href="https://github.com/halitsever/repo_name/issues">
<img src="https://halitsever-api.vercel.app/api/issue"/>
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
