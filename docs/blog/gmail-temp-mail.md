---
title: "Gmail Temp Mail: Plus Addressing vs a Disposable Inbox"
titleTemplate: false
description: "Can Gmail give you a temporary email? What plus addressing and dot aliases really do, where they fall short, and when a disposable inbox is the better choice."
headline: "Gmail temp mail: plus aliases, dots or a separate inbox"
date: "2026-11-28"
keyword: "gmail temp mail"
faq: [{"q": "Can Gmail create a temporary email address?", "a": "Not a separate one. A plus alias such as you+shop@gmail.com is delivered to your normal inbox and never expires. Gmail has no built-in disposable address."}, {"q": "Do Gmail plus aliases hide my real address?", "a": "No. The part before the plus sign is your real username, so anyone can remove the tag and write to your main address."}, {"q": "Are dotted Gmail addresses separate inboxes?", "a": "No. Gmail Help says dots do not change a Gmail address, so every dotted version reaches the same inbox. Google Workspace accounts are the exception."}]
---

# Gmail temp mail: plus aliases, dots or a separate inbox

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">People who search for "Gmail temp mail" usually want one of two things: a throwaway address that still arrives in Gmail, or a second address that has nothing to do with their Gmail account. Gmail covers the first with plus addressing. It does not offer the second. This page explains both and shows where a disposable inbox fits.</p>

## Plus addressing: one inbox, many addresses

Gmail Help describes aliases as a way to sort mail: you add a plus sign and a word after your username, and the mail still reaches you. Its example is `janedoe+school@gmail.com`, which is delivered to `janedoe@gmail.com` ([Gmail Help, "Use Gmail aliases"](https://support.google.com/mail/answer/12096?hl=en)).

So `you+newsletter@gmail.com`, `you+shop@gmail.com` and `you+test1@gmail.com` all land in the same inbox. There is nothing to create or delete. You can make a Gmail filter on the `To` address and send everything for one tag to a label, to the archive or to the trash.

What plus addressing does well:

- You see which site leaked or sold an address, because the tag tells you where you used it.
- You can turn one tag off with a filter without touching the rest of your mail.
- The mail lives in your own account, behind your own password.

Where it stops:

- The real address is in plain sight. Anyone can remove `+tag` and write to `you@gmail.com` directly.
- It is not temporary. Mail to the alias keeps arriving until you filter it.
- Whether a sign-up form accepts a `+` in an address is up to that site, not to Gmail.

## Dots: the same address written differently

Gmail ignores dots in the username. Gmail Help says mail sent to any dotted version of your address only goes to you, and that adding dots does not change your address ([Gmail Help, "Dots don't matter in Gmail addresses"](https://support.google.com/mail/answer/7436150?hl=en)). `j.ane.doe@gmail.com` and `janedoe@gmail.com` are one mailbox.

The same page notes an exception: for work, school or other organization accounts on Google Workspace, dots do change the address.

Dot variants are less useful than plus tags. You cannot tell them apart with a filter as easily, and to many sites they look like the same person anyway.

## A disposable inbox: a different address altogether

A disposable email service gives you an address on its own domain, with an inbox you open on its website. Mail to it never touches your Gmail account. tempmail.plus, for example, offers a mailbox lifetime of 10 minutes, 60 minutes, 2 days or 7 days on its home page, and an optional PIN code for the inbox ([tempmail.plus](https://tempmail.plus/en/)).

The trade-off is privacy of a different kind. Without a PIN or a private plan, a disposable inbox is opened with nothing but the address, so anyone who knows the address can read it. [How free disposable email services work](/blog/free-disposable-email) explains why.

## Side by side

| | Gmail `+tag` | Gmail dots | Disposable inbox |
| --- | --- | --- | --- |
| Where mail arrives | Your Gmail inbox | Your Gmail inbox | The service's inbox |
| Reveals your Gmail address | Yes | Yes | No |
| Expires | No | No | Depends on the service |
| Who can read it | Only you | Only you | Anyone with the address, unless protected |
| Good for | Sorting, finding leaks | Rarely useful | One-off sign-ups, tests |

## For developers: test mail without your own account

Plus addressing is handy for manual testing: sign up as `you+run42@gmail.com` and watch your inbox. In an automated test it gets harder, because the test has to log in to Gmail to read the message, which means the Gmail API and OAuth credentials for a real account.

A disposable inbox is read with the address alone. With this project's client the whole read is a few lines:

```js
import TempMail from "temp-mail-plus-api";

const { email } = TempMail.generateEmail();
const tempMail = new TempMail(email);

const inbox = await tempMail.fetchInbox();
for (const item of inbox.mail_list ?? []) {
  console.log(item.mail_id, item.from_mail, item.subject);
}
```

`temp-mail-plus-api` is an unofficial client for tempmail.plus. It is not affiliated with or endorsed by Temp Mail Plus. The [email testing guide](/guide/email-testing) shows how to wait for a mail in a test, and [testing signup emails end to end](/blog/test-signup-email-flow) does the same in a Playwright browser test.

Do not send real passwords or personal data to a disposable inbox. For anything you want to keep, Gmail with a plus tag is the safer choice.

## FAQ

### Can Gmail create a temporary email address?

Not a separate one. A plus alias such as you+shop@gmail.com is delivered to your normal inbox and never expires. Gmail has no built-in disposable address.

### Do Gmail plus aliases hide my real address?

No. The part before the plus sign is your real username, so anyone can remove the tag and write to your main address.

### Are dotted Gmail addresses separate inboxes?

No. Gmail Help says dots do not change a Gmail address, so every dotted version reaches the same inbox. Google Workspace accounts are the exception.

## Related posts

- [How free disposable email services work](/blog/free-disposable-email)
- [Temp Mail Plus explained: the service and its web API](/blog/what-is-temp-mail-plus)
- [Test a signup email flow end to end](/blog/test-signup-email-flow)
- [All posts](/blog/)
