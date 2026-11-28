---
title: "Email Validation in JavaScript: Regex and type=email"
titleTemplate: false
description: "Email validation in JavaScript with the regex browsers use for type=email, tested on real inputs, plus why a format check never proves the address exists."
headline: "Checking an email address in JavaScript, and where to stop"
date: "2026-11-28"
keyword: "email validation in javascript"
faq: [{"q": "What regex should I use to validate an email in JavaScript?", "a": "The one browsers use for input type=email is a good default, because users already see it on every form. MDN prints it on its input email page. It accepts dev+signup@mailto.plus and rejects addresses with spaces or a missing domain."}, {"q": "Does a regex check that the email exists?", "a": "No. MDN notes that format validation does not ensure the address exists or belongs to the user. Only sending a mail with a link or code proves that."}, {"q": "Is client-side email validation enough?", "a": "No. MDN says users can change the HTML, so the server must check the address again whenever it matters."}]
---

# Checking an email address in JavaScript, and where to stop

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Most email validation in JavaScript is one regular expression. The useful question is which one, and what it should not try to do. This post uses the pattern the HTML standard defines for input type=email, runs it on a set of tricky inputs, and compares it with the much looser check in this project's client.</p>

## The pattern browsers use

For `<input type="email">`, browsers use an algorithm that [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/email) gives as this regular expression:

```js
const EMAIL = /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*$/i;
```

It comes from the [HTML standard's definition of a valid email address](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address), which says outright that it is a willful violation of RFC 5322. The full RFC grammar allows quoted local parts and comments that real sign-up forms never need, so the standard picked a simpler rule.

In words: a local part of letters, digits and most ASCII punctuation (including `.`, `+`, `-` and `_`), an `@`, then one or more dot-separated labels of letters, digits and hyphens, each starting and ending with a letter or digit.

## Tested on tricky inputs

These results come from running the pattern in Node.js 22. The last column is the check this project's client does, covered below.

| Input | Regex | Client |
| --- | --- | --- |
| `dev+signup@mailto.plus` | valid | accepted |
| `user@localhost` | valid | accepted |
| `a@b` | valid | accepted |
| `@mailto.plus` | invalid | accepted |
| `user@` | invalid | accepted |
| `user name@mailto.plus` | invalid | accepted |
| `user@mail_to.plus` | invalid | accepted |
| `"quoted"@example.com` | invalid | accepted |
| `user@exämple.com` | invalid | accepted |
| `user@-bad.com` | invalid | accepted |
| `user@@x.com` | invalid | accepted |
| `u@x.com.` | invalid | accepted |

Three things stand out. The pattern does not require a dot in the domain, so `user@localhost` passes. It rejects internationalized domains written in Unicode, which MDN lists as a known issue in the specification. And it allows `+`, so plus addressing works, which matters if you have read the [Gmail temp mail post](/blog/gmail-temp-mail).

If you need a dot in the domain, add your own rule on top rather than writing a new regex from scratch.

## Use the browser when you have a form

```html
<input type="email" name="email" required autocomplete="email">
```

The browser runs the same check, shows its own message and exposes the result through `input.validity.typeMismatch` and `input.checkValidity()`. In JavaScript you can test a value against the same rule with the regex above.

## What validation cannot tell you

MDN is direct about it: a valid format does not mean the address exists, belongs to the user, or is acceptable in any other way. It also warns that users can change the HTML, so the server must check again.

So keep the layers apart:

1. **Format.** The regex, on the client and again on the server.
2. **Policy.** Your own rules, for example refusing throwaway domains. The [disposable domain post](/blog/detect-disposable-email-domains) shows how to match a domain and its parents against a list.
3. **Ownership.** Send a mail with a link or code. Nothing else proves the person can read the inbox. The [signup test post](/blog/test-signup-email-flow) automates that step.

## The client's own check

The unofficial client only checks for an `@` ([src/index.ts](https://github.com/halitsever/temp-mail-plus-api/blob/main/src/index.ts)):

```ts
if (!email.includes('@')) {
    throw new Error(`Invalid email address: "${email}"`);
}
```

That is why every row in the table says accepted. It is enough for addresses from `TempMail.generateEmail()`, which are always eight lowercase letters or digits, an `@` and one of the service domains. For addresses you build yourself, run the regex first. Avoid `+` and `&` in addresses you pass to `fetchInbox` for now: that method puts the address in the URL without encoding it, as the [encodeURIComponent post](/blog/encodeuricomponent) shows.

`temp-mail-plus-api` is an unofficial client for tempmail.plus. It is not affiliated with or endorsed by Temp Mail Plus.

## FAQ

### What regex should I use to validate an email in JavaScript?

The one browsers use for input type=email is a good default, because users already see it on every form. MDN prints it on its input email page. It accepts dev+signup@mailto.plus and rejects addresses with spaces or a missing domain.

### Does a regex check that the email exists?

No. MDN notes that format validation does not ensure the address exists or belongs to the user. Only sending a mail with a link or code proves that.

### Is client-side email validation enough?

No. MDN says users can change the HTML, so the server must check the address again whenever it matters.

## Related posts

- [How to detect disposable email domains in Node.js](/blog/detect-disposable-email-domains)
- [What encodeURIComponent escapes, and the bug it prevents](/blog/encodeuricomponent)
- [Test a signup email flow end to end](/blog/test-signup-email-flow)
- [All posts](/blog/)
