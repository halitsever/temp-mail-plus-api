---
title: "Temp Mail API in Python vs Node.js"
titleTemplate: false
description: "Read a tempmail.plus inbox from Node.js with temp-mail-plus-api, and see what the same three requests look like in Python with requests. No API key needed."
headline: "Calling the Temp Mail Plus endpoints from Python and Node.js"
date: "2026-11-28"
keyword: "temp mail api python"
faq: [{"q": "Is there a Python package for temp-mail-plus-api?", "a": "No. The project publishes a Node.js and TypeScript package only. The Python code on this page is a sketch of the same HTTP requests."}, {"q": "Do I need an API key for tempmail.plus?", "a": "No. The Node.js client sends no key or token, and neither does the Python sketch."}]
---

# Calling the Temp Mail Plus endpoints from Python and Node.js

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">This project ships a client for Node.js and TypeScript only. There is no Python package from it. The requests underneath are plain HTTP, though, so a Python script can make the same calls. This page shows both, side by side, straight from the client's source.</p>

`temp-mail-plus-api` is an unofficial client for tempmail.plus. It is not affiliated with or endorsed by Temp Mail Plus. The endpoints are the web API that the tempmail.plus site uses. They are not documented by Temp Mail Plus and can change.

## The three requests

From [src/index.ts](https://github.com/halitsever/temp-mail-plus-api/blob/main/src/index.ts) and [src/http.client.ts](https://github.com/halitsever/temp-mail-plus-api/blob/main/src/http.client.ts):

| Purpose | Method and path | Parameters |
| --- | --- | --- |
| List the inbox | `GET https://tempmail.plus/api/mails` | `email` in the query |
| Read one mail | `GET https://tempmail.plus/api/mails/<mail_id>` | `email` in the query |
| Delete one mail | `DELETE https://tempmail.plus/api/mails/<mail_id>` | `email` and `epin` as form fields |

No API key or token is sent. The client sets browser-like headers (a desktop Chrome `User-Agent`, `X-Requested-With: XMLHttpRequest`, an `Accept` for JSON) and a 10 second timeout.

## Node.js with the client

```js
import TempMail from "temp-mail-plus-api";

const { email } = TempMail.generateEmail();
const tempMail = new TempMail(email, { timeout: 10_000 });

const inbox = await tempMail.fetchInbox();
if (!inbox.success) throw new Error(inbox.error);

for (const item of inbox.mail_list ?? []) {
  const mail = await tempMail.fetchMailById(item.mail_id);
  console.log(mail.subject, mail.text);
  await tempMail.deleteMailById(item.mail_id);
}
```

The methods never throw on a failed request. They resolve to `{ success: false, error }`, so you check `success` instead of wrapping calls in `try`.

## Python with requests

The same calls with the [requests](https://requests.readthedocs.io/) library. This is a sketch that mirrors the Node.js client; it is not a published package and it is not part of this project's tests.

```python
import random
import string
import requests

BASE = "https://tempmail.plus/api"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "application/json, text/javascript, */*; q=0.01",
}
DOMAINS = ["mailto.plus", "fexpost.com", "fexbox.org", "mailbox.in.ua", "rover.info", "fextemp.com", "any.pink", "merepost.com"]


def generate_email():
    name = "".join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"{name}@{random.choice(DOMAINS)}"


def fetch_inbox(email):
    r = requests.get(f"{BASE}/mails", params={"email": email}, headers=HEADERS, timeout=10)
    r.raise_for_status()
    return r.json()


def fetch_mail(email, mail_id):
    r = requests.get(f"{BASE}/mails/{mail_id}", params={"email": email}, headers=HEADERS, timeout=10)
    r.raise_for_status()
    return r.json()


def delete_mail(email, mail_id, epin=""):
    r = requests.delete(f"{BASE}/mails/{mail_id}", data={"email": email, "epin": epin}, headers=HEADERS, timeout=10)
    r.raise_for_status()
    return r.json()


email = generate_email()
inbox = fetch_inbox(email)
for item in inbox.get("mail_list", []):
    mail = fetch_mail(email, item["mail_id"])
    print(mail["subject"], mail["text"])
    delete_mail(email, item["mail_id"])
```

The domain list here leaves out `chitthi.in`, which is in the Node.js client's list but was not offered on the tempmail.plus site on 28 November 2026.

## Differences that matter

| | Node.js client | Python sketch |
| --- | --- | --- |
| Install | `npm install temp-mail-plus-api` | `pip install requests`, copy the code |
| Types | TypeScript definitions included | None |
| Errors | Resolves to `{ success: false, error }` | Raises on HTTP errors |
| Tests | Unit tests in the repository | None |
| Maintenance | Updated in this repository | Yours |

The field names are the same in both, because both read the same JSON: `mail_list`, `mail_id`, `from_mail`, `subject`, `text`, `html`. The [API reference](/reference/api) lists every field.

## When to use which

If your tests or scripts already run on Node.js, use the client; it handles the details and gives you types. If your stack is Python, the sketch above is a starting point, but you maintain it. In both cases, poll gently and never send real personal data to these inboxes. The [email testing guide](/guide/email-testing) has a polling helper with sensible defaults.

## FAQ

### Is there a Python package for temp-mail-plus-api?

No. The project publishes a Node.js and TypeScript package only. The Python code on this page is a sketch of the same HTTP requests.

### Do I need an API key for tempmail.plus?

No. The Node.js client sends no key or token, and neither does the Python sketch.

## Related posts

- [temp-mail.org API compared with the Temp Mail Plus client](/blog/temp-mail-org-api)
- [Temp Mail Plus explained: the service and its web API](/blog/what-is-temp-mail-plus)
- [Test a signup email flow end to end](/blog/test-signup-email-flow)
- [All posts](/blog/)
