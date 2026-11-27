<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'
import SiteFooter from './SiteFooter.vue'

const KEYWORDS = 'import|from|const|await|new|if|return|for|while|throw|async|function|let|of'
const TOKEN = new RegExp(`(//.*$)|("(?:[^"\\\\]|\\\\.)*"|\`[^\`]*\`)|\\b(${KEYWORDS})\\b|\\b(\\d[\\d_]*)\\b`, 'gm')

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Small highlighter for the hand-placed samples, so each line can carry its own step class. */
function hl(code: string): string {
  let out = ''
  let last = 0
  for (const m of code.matchAll(TOKEN)) {
    out += escapeHtml(code.slice(last, m.index))
    const kind = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'k' : 'n'
    out += `<span class="t-${kind}">${escapeHtml(m[0])}</span>`
    last = m.index! + m[0].length
  }
  return out + escapeHtml(code.slice(last))
}

const heroCode = [
  { t: 'import TempMail from "temp-mail-plus-api";', g: 0 },
  { t: '', g: 0 },
  { t: 'const { email } = TempMail.generateEmail();', g: 1 },
  { t: 'const tempMail = new TempMail(email);', g: 1 },
  { t: '', g: 0 },
  { t: 'const inbox = await tempMail.fetchInbox();', g: 2 },
  { t: 'const [first] = inbox.mail_list ?? [];', g: 2 },
  { t: '', g: 0 },
  { t: 'const mail = await tempMail.fetchMailById(first.mail_id);', g: 3 },
  { t: 'console.log(mail.text);', g: 3 },
].map((l) => ({ ...l, html: hl(l.t) || '&nbsp;' }))

const errorCode = hl(`const inbox = await tempMail.fetchInbox();

if (!inbox.success) {
  // the message of the error that was caught
  console.warn(inbox.error);
  return;
}

for (const item of inbox.mail_list ?? []) {
  console.log(item.from_mail, item.subject);
}`)

const inboxJson = hl(`{
  "error": null,
  "count": 1,
  "first_id": 32944585,
  "last_id": 32944585,
  "limit": 10,
  "mail_list": [
    {
      "attachment_count": 0,
      "first_attachment_name": "",
      "from_mail": "no-reply@example.com",
      "from_name": "Example App",
      "is_new": true,
      "mail_id": 32944585,
      "subject": "Your verification code",
      "time": "2026-01-01T00:00:00Z"
    }
  ],
  "more": false,
  "result": true,
  "success": true
}`)

const testCode = hl(`async function waitForMail(tempMail, subject, tries = 15) {
  for (let i = 0; i < tries; i++) {
    const inbox = await tempMail.fetchInbox();
    const hit = (inbox.mail_list ?? []).find((m) => m.subject.includes(subject));
    if (hit) return tempMail.fetchMailById(hit.mail_id);
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("No mail arrived");
}`)

const methods = [
  {
    sig: 'TempMail.generateEmail(username?, domain?)',
    text: 'Builds an address on your machine. You get a random 8 character username and a random domain unless you pass your own. No request is sent.',
  },
  {
    sig: 'new TempMail(email, { timeout })',
    text: 'Binds a client to one address. The timeout is optional and defaults to 10 seconds.',
  },
  {
    sig: 'fetchInbox()',
    text: 'Lists the mails waiting in the inbox. Each entry has the sender, the subject, the time and a mail_id.',
  },
  {
    sig: 'fetchMailById(mail_id)',
    text: 'Returns one mail in full: text and html bodies, headers such as from and to, and the name, size and type of each attachment.',
  },
  {
    sig: 'deleteMailById(mail_id)',
    text: 'Deletes one mail from the inbox.',
  },
  {
    sig: 'setEmail(email)',
    text: 'Points the same client at a different address.',
  },
]

const domains = [
  'mailto.plus',
  'fexpost.com',
  'fexbox.org',
  'mailbox.in.ua',
  'rover.info',
  'chitthi.in',
  'fextemp.com',
  'any.pink',
  'merepost.com',
]

const install = 'npm install temp-mail-plus-api'
const copied = ref(false)
const run = ref(0)

async function copyInstall() {
  try {
    await navigator.clipboard.writeText(install)
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <div class="tm">
    <section class="tm-hero tm-wrap">
      <div class="tm-hero-head">
        <h1>Temp mail API for Node.js and TypeScript</h1>
        <div class="tm-hero-side">
          <p class="tm-lede">
            <code>temp-mail-plus-api</code> is a small client for the tempmail.plus disposable email service.
            Generate a throwaway address, read its inbox, open a mail and delete it from your own code.
          </p>
          <p class="tm-unofficial">
            Unofficial community project. Not affiliated with or endorsed by Temp Mail Plus.
          </p>
          <div class="tm-actions">
            <button class="tm-install" type="button" @click="copyInstall" :aria-label="`Copy command: ${install}`">
              <span class="tm-install-cmd">{{ install }}</span>
              <span class="tm-install-state" aria-live="polite">
                <svg v-if="!copied" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                  <rect x="7" y="7" width="9" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6" />
                  <path d="M13 7V4.5A1.5 1.5 0 0 0 11.5 3h-6A1.5 1.5 0 0 0 4 4.5v7A1.5 1.5 0 0 0 5.5 13H7" fill="none" stroke="currentColor" stroke-width="1.6" />
                </svg>
                <svg v-else viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                  <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {{ copied ? 'Copied' : 'Copy' }}
              </span>
            </button>
            <a class="tm-link" :href="withBase('/guide/getting-started')">Read the getting started guide</a>
          </div>
        </div>
      </div>

      <div class="tm-demo" :key="run">
        <figure class="tm-code" aria-label="Code sample">
          <figcaption>inbox.mjs</figcaption>
          <pre><code><span v-for="(l, i) in heroCode" :key="i" class="ln" :class="l.g ? `g${l.g}` : ''" v-html="l.html"></span></code></pre>
        </figure>

        <figure class="tm-letter" aria-label="Simulated inbox, example output">
          <div class="tm-letter-sheet">
            <svg class="tm-postmark" viewBox="0 0 190 120" aria-hidden="true">
              <defs>
                <path id="pm-top" d="M 70 60 m -38 0 a 38 38 0 1 1 76 0" />
                <path id="pm-bot" d="M 70 60 m -45 0 a 45 45 0 0 0 90 0" />
              </defs>
              <g fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="70" cy="60" r="52" />
                <circle cx="70" cy="60" r="30" stroke-width="1.5" />
                <path d="M124 38c8-5 14 5 22 0s14 5 22 0 12 4 18 1" />
                <path d="M127 52c8-5 14 5 22 0s14 5 22 0 10 4 15 1" />
                <path d="M127 66c8-5 14 5 22 0s14 5 22 0 10 4 15 1" />
                <path d="M124 80c8-5 14 5 22 0s14 5 22 0 12 4 18 1" />
                <path d="M56 51h28v19H56z M56 52l14 10 14-10" stroke-width="1.6" stroke-linejoin="round" />
              </g>
              <g fill="currentColor" font-size="10.5" font-weight="600" letter-spacing="1.5" text-anchor="middle">
                <text><textPath href="#pm-top" startOffset="50%">EXAMPLE OUTPUT</textPath></text>
                <text><textPath href="#pm-bot" startOffset="50%">NOT A LIVE INBOX</textPath></text>
              </g>
            </svg>

            <p class="tm-letter-title">Example output</p>

            <div class="tm-slip s1">
              <p class="tm-call">generateEmail()</p>
              <p class="tm-address">k3v9x2ab@fexpost.com</p>
              <dl class="tm-fields">
                <div><dt>username</dt><dd>k3v9x2ab</dd></div>
                <div><dt>domain</dt><dd>fexpost.com</dd></div>
              </dl>
            </div>

            <div class="tm-slip s2">
              <p class="tm-call">fetchInbox() <span>count: 1</span></p>
              <div class="tm-row">
                <span class="tm-new" title="is_new: true"></span>
                <div class="tm-row-main">
                  <p class="tm-row-from">Example App <span>no-reply@example.com</span></p>
                  <p class="tm-row-subject">Your verification code</p>
                </div>
                <p class="tm-row-id">mail_id 32944585</p>
              </div>
            </div>

            <div class="tm-slip s3">
              <p class="tm-call">fetchMailById(32944585)</p>
              <dl class="tm-fields tm-fields-wide">
                <div><dt>from</dt><dd>Example App &lt;no-reply@example.com&gt;</dd></div>
                <div><dt>to</dt><dd>k3v9x2ab@fexpost.com</dd></div>
                <div><dt>text</dt><dd class="tm-body">Your verification code is 481902.</dd></div>
              </dl>
            </div>
          </div>
          <figcaption>
            An illustration built from the response types in <code>src/types.ts</code>. This page sends nothing to tempmail.plus.
            <button class="tm-replay" type="button" @click="run++">Replay</button>
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="tm-band tm-wrap">
      <h2>What you can call</h2>
      <div class="tm-band-body">
        <p>
          The package exports one class and a list of domains. That is the whole surface, and every part of it is typed.
        </p>
        <dl class="tm-methods">
          <div v-for="m in methods" :key="m.sig">
            <dt><code>{{ m.sig }}</code></dt>
            <dd>{{ m.text }}</dd>
          </div>
        </dl>
        <a class="tm-link" :href="withBase('/reference/api')">See every return shape in the API reference</a>
      </div>
    </section>

    <section class="tm-band tm-wrap">
      <h2>A failed request is a return value</h2>
      <div class="tm-band-body">
        <p>
          The three request methods never reject. When a request fails they resolve to
          <code>{ success: false, error }</code>, where <code>error</code> is the message of the failure.
          On success you get the service's JSON with <code>success: true</code> added.
          Only the constructor and <code>setEmail</code> throw, and only for an address without an <code>@</code>.
        </p>
        <div class="tm-pair">
          <figure class="tm-code">
            <figcaption>Checking the result</figcaption>
            <pre><code v-html="errorCode"></code></pre>
          </figure>
          <figure class="tm-code">
            <figcaption>fetchInbox(), example output</figcaption>
            <pre><code v-html="inboxJson"></code></pre>
          </figure>
        </div>
      </div>
    </section>

    <section class="tm-band tm-wrap">
      <h2>Receive a signup email in a test</h2>
      <div class="tm-band-body">
        <p>
          A disposable email API is handy when a test has to prove that a real message went out: a signup confirmation,
          a password reset or a one-time code. Generate an address, hand it to the app under test, then poll the inbox
          until the mail shows up. The library has no built-in wait, so the loop is yours to write. It is short.
        </p>
        <figure class="tm-code">
          <figcaption>Polling for a mail</figcaption>
          <pre><code v-html="testCode"></code></pre>
        </figure>
        <a class="tm-link" :href="withBase('/guide/email-testing')">Read the email testing guide</a>
      </div>
    </section>

    <section class="tm-band tm-wrap">
      <h2>Nine domains to pick from</h2>
      <div class="tm-band-body">
        <p>
          <code>generateEmail()</code> picks one of these at random. Pass a domain as the second argument to choose it
          yourself. The list is exported as <code>TEMP_MAIL_DOMAINS</code> and is hard-coded in the package, so it only
          changes with a new release.
        </p>
        <ul class="tm-domains">
          <li v-for="d in domains" :key="d"><span>@</span>{{ d }}</li>
        </ul>
      </div>
    </section>

    <section class="tm-band tm-wrap">
      <h2>Know what you are depending on</h2>
      <div class="tm-band-body">
        <p>
          This client talks to the same web API that the tempmail.plus site uses. Temp Mail Plus does not publish or
          support it, and this project is not affiliated with them. If the service changes its endpoints or blocks
          scripted requests, calls will start returning <code>success: false</code> until the package catches up.
          Inboxes are not protected by a login, so treat anything sent to them as public.
        </p>
        <a class="tm-link" :href="withBase('/guide/faq')">Read the FAQ and limits</a>
      </div>
    </section>

    <div class="tm-wrap">
      <SiteFooter />
    </div>
  </div>
</template>

<style scoped>
.tm {
  color: var(--ink);
  padding-bottom: 40px;
}
.tm-wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}
.tm code {
  font-family: var(--vp-font-family-mono);
  font-size: 0.86em;
}
.tm p code {
  padding: 0.1em 0.35em;
  border-radius: 4px;
  background: rgba(47, 55, 69, 0.1);
}

/* Hero */
.tm-hero {
  padding-top: 56px;
  padding-bottom: 72px;
}
.tm-hero-head {
  display: grid;
  grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);
  gap: 48px;
  align-items: end;
}
.tm h1 {
  margin: 0;
  font-size: clamp(2.375rem, 5.4vw, 4.25rem);
  font-weight: 700;
  line-height: 1.02;
  letter-spacing: -0.035em;
  text-wrap: balance;
}
.tm-lede {
  margin: 0;
  font-size: 1.125rem;
  line-height: 1.55;
}
.tm-unofficial {
  margin: 12px 0 0;
  padding-left: 12px;
  border-left: 3px solid var(--air-red);
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.45;
}
.tm-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px 22px;
  margin-top: 22px;
}
.tm-install {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 11px 14px 11px 16px;
  border-radius: 6px;
  background: var(--slate);
  color: #f1ede3;
  font-family: var(--vp-font-family-mono);
  font-size: 0.875rem;
  cursor: pointer;
}
.tm-install:hover {
  background: #262d39;
}
.tm-install-state {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding-left: 14px;
  border-left: 1px solid rgba(255, 255, 255, 0.22);
  font-size: 0.8125rem;
  color: #c9cfd8;
}
.tm-link {
  color: var(--air-blue);
  font-weight: 600;
  text-decoration: underline;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 4px;
}
.tm-link:hover {
  color: #123d75;
}

/* Demo */
.tm-demo {
  display: grid;
  grid-template-columns: minmax(0, 11fr) minmax(0, 10fr);
  gap: 28px;
  align-items: start;
  margin-top: 48px;
}
.tm-code {
  margin: 0;
  min-width: 0;
  border-radius: 8px;
  background: var(--slate);
  color: #e8e4da;
  overflow: hidden;
}
.tm-code figcaption {
  padding: 10px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  color: #aab1bc;
}
.tm-code pre {
  margin: 0;
  padding: 16px 0;
  overflow-x: auto;
}
.tm-code pre code {
  display: block;
  width: max-content;
  min-width: 100%;
  padding: 0 18px;
  font-size: 0.8125rem;
  line-height: 1.75;
  white-space: pre;
}
.tm-code .ln {
  display: block;
  margin: 0 -18px;
  padding: 0 18px;
  border-left: 3px solid transparent;
}
.tm-code :deep(.t-k) {
  color: #f2a59d;
}
.tm-code :deep(.t-s) {
  color: #a8ccf2;
}
.tm-code :deep(.t-n) {
  color: #ecd9a0;
}
.tm-code :deep(.t-c) {
  color: #98a1ae;
}

.tm-letter {
  margin: 0;
  min-width: 0;
}
.tm-letter-sheet {
  position: relative;
  padding: 22px 24px 24px;
  border: 9px solid transparent;
  border-radius: 4px;
  background:
    linear-gradient(var(--sheet), var(--sheet)) padding-box,
    repeating-linear-gradient(
        -45deg,
        var(--air-red) 0 14px,
        var(--sheet) 14px 28px,
        var(--air-blue) 28px 42px,
        var(--sheet) 42px 56px
      )
      border-box;
  box-shadow: 0 1px 0 rgba(38, 46, 58, 0.12), 0 14px 30px -18px rgba(38, 46, 58, 0.45);
}
.tm-postmark {
  position: absolute;
  top: 6px;
  right: 8px;
  width: 172px;
  color: var(--air-blue);
  opacity: 0.8;
  transform: rotate(-7deg);
  font-family: var(--vp-font-family-mono);
  pointer-events: none;
}
.tm-letter-title {
  margin: 0 0 18px;
  font-size: 0.9375rem;
  font-weight: 700;
}
.tm-slip {
  padding: 14px 0;
  border-top: 1px dashed var(--rule);
}
.tm-slip.s1 {
  max-width: calc(100% - 170px);
  border-top: 0;
  padding-top: 0;
}
.tm-call {
  margin: 0 0 8px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  color: var(--ink-soft);
}
.tm-call span {
  margin-left: 10px;
}
.tm-address {
  margin: 0 0 8px;
  font-family: var(--vp-font-family-mono);
  font-size: 1.1875rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
}
.tm-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 22px;
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 0.8125rem;
}
.tm-fields div {
  display: flex;
  gap: 8px;
  min-width: 0;
}
.tm-fields dt {
  color: var(--ink-soft);
}
.tm-fields dd {
  margin: 0;
  overflow-wrap: anywhere;
}
.tm-fields-wide {
  display: grid;
  gap: 6px;
}
.tm-fields-wide dt {
  flex: 0 0 3.2em;
}
.tm-fields .tm-body {
  font-family: var(--vp-font-family-base);
  font-size: 1rem;
  font-weight: 500;
}
.tm-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--rule);
  border-radius: 4px;
  background: #fff;
}
.tm-new {
  flex: none;
  width: 9px;
  height: 9px;
  margin-top: 7px;
  border-radius: 50%;
  background: var(--air-red);
}
.tm-row-main {
  flex: 1;
  min-width: 0;
}
.tm-row-from {
  margin: 0;
  font-weight: 700;
  line-height: 1.4;
}
.tm-row-from span {
  margin-left: 6px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--ink-soft);
  overflow-wrap: anywhere;
}
.tm-row-subject {
  margin: 2px 0 0;
  line-height: 1.4;
}
.tm-row-id {
  flex: none;
  margin: 2px 0 0;
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  color: var(--ink-soft);
}
.tm-letter figcaption {
  margin-top: 12px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--ink-soft);
}
.tm-replay {
  margin-left: 6px;
  color: var(--air-blue);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

/* One load sequence: each code step lights up as its result lands in the inbox. */
@media (prefers-reduced-motion: no-preference) {
  .tm-slip {
    animation: tm-arrive 0.55s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }
  .tm-slip.s1 {
    animation-delay: 0.5s;
  }
  .tm-slip.s2 {
    animation-delay: 2s;
  }
  .tm-slip.s3 {
    animation-delay: 3.5s;
  }
  .tm-code .ln.g1,
  .tm-code .ln.g2,
  .tm-code .ln.g3 {
    animation: tm-run 1.4s ease both;
  }
  .tm-code .ln.g1 {
    animation-delay: 0.3s;
  }
  .tm-code .ln.g2 {
    animation-delay: 1.8s;
  }
  .tm-code .ln.g3 {
    animation-delay: 3.3s;
  }
}
@media (prefers-reduced-motion: reduce) {
  .tm-replay {
    display: none;
  }
}
@keyframes tm-arrive {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes tm-run {
  0%,
  100% {
    background: transparent;
    border-left-color: transparent;
  }
  12%,
  82% {
    background: rgba(255, 255, 255, 0.09);
    border-left-color: #f2a59d;
  }
}

/* Bands */
.tm-band {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
  gap: 24px 48px;
  padding-top: 44px;
  padding-bottom: 56px;
}
.tm-band::before {
  content: '';
  grid-column: 1 / -1;
  border-top: 1px solid var(--rule);
  margin-bottom: 4px;
}
.tm-band h2 {
  margin: 0;
  font-size: clamp(1.5rem, 2.6vw, 2rem);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.025em;
  text-wrap: balance;
}
.tm-band-body {
  min-width: 0;
}
.tm-band-body > p {
  max-width: 68ch;
  margin: 0 0 24px;
  font-size: 1.0625rem;
  line-height: 1.65;
}
.tm-band-body > .tm-code {
  margin-bottom: 24px;
}
.tm-methods {
  margin: 0 0 24px;
}
.tm-methods > div {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  gap: 6px 28px;
  padding: 14px 0;
  border-top: 1px solid var(--rule);
}
.tm-methods > div:last-child {
  border-bottom: 1px solid var(--rule);
}
.tm-methods dt code {
  font-size: 0.8125rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}
.tm-methods dd {
  margin: 0;
  line-height: 1.55;
}
.tm-pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  align-items: start;
}
.tm-domains {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--rule);
  font-family: var(--vp-font-family-mono);
  font-size: 0.9375rem;
}
.tm-domains li {
  padding: 11px 0;
  border-bottom: 1px solid var(--rule);
  overflow-wrap: anywhere;
}
.tm-domains span {
  color: var(--air-red);
}

@media (max-width: 900px) {
  .tm-hero {
    padding-top: 36px;
    padding-bottom: 48px;
  }
  .tm-hero-head,
  .tm-demo,
  .tm-band,
  .tm-pair {
    grid-template-columns: minmax(0, 1fr);
  }
  .tm-hero-head {
    gap: 22px;
  }
  .tm-demo {
    margin-top: 36px;
  }
  .tm-band {
    gap: 16px;
    padding-top: 32px;
    padding-bottom: 40px;
  }
}
@media (max-width: 560px) {
  .tm-wrap {
    padding-left: 16px;
    padding-right: 16px;
  }
  .tm-install {
    width: 100%;
    justify-content: space-between;
    font-size: 0.8125rem;
  }
  .tm-letter-sheet {
    padding: 18px 16px 18px;
    border-width: 7px;
  }
  .tm-postmark {
    position: static;
    display: block;
    width: 150px;
    margin: -4px 0 8px auto;
  }
  .tm-letter-title {
    position: absolute;
    top: 22px;
    left: 16px;
  }
  .tm-slip.s1 {
    max-width: none;
  }
  .tm-address {
    font-size: 1.0625rem;
  }
  .tm-row {
    flex-wrap: wrap;
  }
  .tm-row-id {
    flex-basis: 100%;
    padding-left: 21px;
  }
  .tm-row-from span {
    display: block;
    margin-left: 0;
  }
  .tm-methods > div {
    grid-template-columns: minmax(0, 1fr);
  }
  .tm-domains {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
