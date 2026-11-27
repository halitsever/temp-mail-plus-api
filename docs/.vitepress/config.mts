import { defineConfig } from 'vitepress'

const site = 'https://halitsever.github.io/temp-mail-plus-api/'
const name = 'temp-mail-plus-api'
const homeTitle = 'Temp mail API for Node.js and TypeScript'
const description = 'Temp mail API client for Node.js and TypeScript. Create disposable addresses, read the inbox and delete mails on tempmail.plus. Unofficial, MIT licensed.'

const repo = 'https://github.com/halitsever/temp-mail-plus-api'
const author = { '@type': 'Person', name: 'Halit Sever', url: 'https://github.com/halitsever' }

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  '@id': `${site}#source`,
  name,
  description,
  url: site,
  image: `${site}og.png`,
  codeRepository: repo,
  programmingLanguage: 'TypeScript',
  runtimePlatform: 'Node.js',
  license: 'https://opensource.org/licenses/MIT',
  author,
}

export default defineConfig({
  /** keeps the page hash map out of every page's HTML, which Semrush reads as a low text-to-HTML ratio */
  metaChunk: true,
  base: '/temp-mail-plus-api/',
  lang: 'en',
  title: name,
  titleTemplate: `:title | ${name}`,
  description,
  cleanUrls: true,
  appearance: false,
  sitemap: { hostname: site },

  head: [
    /** Cloudflare Web Analytics, one token for every page on halitsever.github.io. */
    ['script', { defer: '', src: 'https://static.cloudflareinsights.com/beacon.min.js', 'data-cf-beacon': '{"token": "dd7e54d3f48841c187d72d9dbb92a6b6"}' }],
    ['link', { rel: 'icon', href: '/temp-mail-plus-api/favicon.png', sizes: '32x32', type: 'image/png' }],
    ['link', { rel: 'icon', href: '/temp-mail-plus-api/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#F4EEE1' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: name }],
    ['meta', { property: 'og:image', content: `${site}og.png` }],
    ['meta', { property: 'og:image:width', content: '1280' }],
    ['meta', { property: 'og:image:height', content: '640' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${site}og.png` }],
    ['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)],
  ],

  transformPageData(pageData) {
    const isHome = pageData.relativePath === 'index.md'
    const title = pageData.frontmatter.title ?? pageData.title
    const url = site + pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: isHome ? homeTitle : `${title} | ${name}` }],
      ['meta', { property: 'og:description', content: pageData.frontmatter.description ?? description }],
    )
  },

  markdown: {
    theme: 'github-dark-dimmed',
  },

  themeConfig: {
    logo: { src: '/favicon.svg', alt: '' },
    siteTitle: name,
    nav: [
      { text: 'Getting started', link: '/guide/getting-started' },
      { text: 'API reference', link: '/reference/api' },
      { text: 'Email testing', link: '/guide/email-testing' },
      { text: 'FAQ', link: '/guide/faq' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'Email testing in automated tests', link: '/guide/email-testing' },
          { text: 'FAQ and limits', link: '/guide/faq' },
        ],
      },
      {
        text: 'Reference',
        items: [{ text: 'API reference', link: '/reference/api' }],
      },
    ],
    socialLinks: [
      { icon: 'github', link: repo },
      { icon: 'npm', link: 'https://www.npmjs.com/package/temp-mail-plus-api' },
    ],
    outline: { level: [2, 3] },
    search: { provider: 'local' },
  },
})
