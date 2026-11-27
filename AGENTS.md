# AGENTS.md

temp-mail-plus-api is an unofficial Node.js and TypeScript client for the Temp Mail Plus (tempmail.plus) disposable email API, published to npm. It is not affiliated with Temp Mail Plus.

## Verify a change

- Run what CI runs (Node LTS), in this order: `npm ci`, `npm run build`, `npm test`.
- Tests mock `HttpClient`, so they need no network. Keep it that way: stub `HttpClient.prototype.get` or `delete` with `t.mock.method` instead of calling tempmail.plus.

## Gotchas

- `tsconfig.json` has no `include` or `rootDir`, so `tsc` compiles `src/` and `test/` into `dist/src` and `dist/test`. `index.js` and the `types` field point into `dist/src`, so keep that layout. `dist/` is gitignored.
- `index.js` is a hand-written CommonJS wrapper: `require()` gets the class directly, and `TEMP_MAIL_DOMAINS` hangs off it. Native Node ESM finds named exports only through `module.exports.X =` lines (cjs-module-lexer), so add new exports that way. `test/package-entry.test.ts` packs the package and checks both `import` and `require()`, which is why `npm test` needs `npm run build` first.
- API methods resolve to `{ success: false, error }` instead of throwing. Only the constructor and `setEmail` throw, on an address without `@`.
- Code in `src/` and `test/` uses 4-space indentation while `.prettierrc` sets 2. Match the surrounding file and format only what you add.
- The request headers in `src/http.client.ts` imitate a desktop Chrome browser. Change them only on purpose.
- There is no publish workflow. The `version` in package.json can trail what is on `main`.

## Docs site

- The website is a VitePress project in `docs/` with its own `package.json`. It deploys to https://halitsever.github.io/temp-mail-plus-api/ through `.github/workflows/docs.yml`.
- Build it with `cd docs && npm ci && npm run build`. Preview with `npm run dev`.
- Pages document only what exists in `src/`. Update `docs/reference/api.md` and the samples in `docs/.vitepress/theme/Landing.vue` when a method or a response type changes.
- The inbox on the home page is a labelled illustration. It must never call tempmail.plus.

## Conventions

- Commit subjects use Conventional Commits, in English, with no body and no trailer.
- Work on a branch and open a pull request. The owner merges.
- New text has no emoji. Code comments are short, one line where possible, and explain why.
- README (`Readme.md`) follows the owner's template. Images served from `halitsever-api.vercel.app` stay byte-for-byte; only the `title=` value of `api/repo-title` and the link around `api/issue` may be corrected.
- Keep the "unofficial, not affiliated" wording wherever the project is described.
- Version bumps and npm publishing are done by the owner.
