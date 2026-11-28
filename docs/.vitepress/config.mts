import { defineConfig } from 'vitepress'

const site = 'https://projects.halit.org/temp-mail-plus-api/'
const name = 'temp-mail-plus-api'
const homeTitle = 'Temp mail API for Node.js and TypeScript'
const description = 'Temp mail API client for Node.js and TypeScript. Create disposable addresses, read the inbox and delete mails on tempmail.plus. Unofficial, MIT licensed.'

const repo = 'https://github.com/halitsever/temp-mail-plus-api'
const author = { '@type': 'Person', name: 'Halit Sever', url: 'https://github.com/halitsever' }

/** BlogPosting and breadcrumbs for posts, FAQPage wherever the page shows its FAQ. */
function pageJsonLd(fm: Record<string, any>, url: string, title: string) {
  const person = { ...author, url: 'https://halit.org' }
  const graph: object[] = []
  if (fm.date) {
    graph.push(
      {
        '@type': 'BlogPosting',
        headline: fm.headline ?? title,
        description: fm.description,
        url,
        mainEntityOfPage: url,
        datePublished: fm.date,
        dateModified: fm.date,
        inLanguage: 'en',
        image: `${site}og.png`,
        keywords: fm.keyword,
        author: person,
        publisher: person,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name, item: site },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site}blog/` },
          { '@type': 'ListItem', position: 3, name: fm.headline ?? title, item: url },
        ],
      },
    )
  }
  if (fm.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: fm.faq.map((f: { q: string; a: string }) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>|`/g, '') },
      })),
    })
  }
  return graph.length ? { '@context': 'https://schema.org', '@graph': graph } : null
}

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
    /** Cloudflare Web Analytics, one token for every page on projects.halit.org. */
    ['script', { defer: '', src: 'https://static.cloudflareinsights.com/beacon.min.js', 'data-cf-beacon': '{"token": "dd7e54d3f48841c187d72d9dbb92a6b6"}' }],
    ['link', { rel: 'icon', href: '/temp-mail-plus-api/favicon.png', sizes: '32x32', type: 'image/png' }],
    ['link', { rel: 'icon', href: '/temp-mail-plus-api/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#F4EEE1' }],
    ['meta', { property: 'og:site_name', content: name }],
    ['meta', { property: 'og:image', content: `${site}og.png` }],
    ['meta', { property: 'og:image:width', content: '1280' }],
    ['meta', { property: 'og:image:height', content: '640' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${site}og.png` }],
    ['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)],
  ],

  transformPageData(pageData) {
    const fm = pageData.frontmatter
    const isHome = pageData.relativePath === 'index.md'
    const title = fm.title ?? pageData.title
    const url = site + pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
    fm.head ??= []
    fm.head.push(
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: isHome ? homeTitle : fm.titleTemplate === false ? title : `${title} | ${name}` }],
      ['meta', { property: 'og:description', content: fm.description ?? description }],
    )
    fm.head.push(['meta', { property: 'og:type', content: fm.date ? 'article' : 'website' }])
    if (fm.date) fm.head.push(['meta', { property: 'article:published_time', content: fm.date }])
    const ld = pageJsonLd(fm, url, title)
    if (ld) fm.head.push(['script', { type: 'application/ld+json' }, JSON.stringify(ld)])
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
      { text: 'Blog', link: '/blog/', activeMatch: '^/blog/' },
    ],
    sidebar: {
      '/blog/': [
        {
          text: 'Blog',
          items: [
            { text: 'All posts', link: '/blog/' },
            { text: 'Gmail temp mail', link: '/blog/gmail-temp-mail' },
            { text: 'How disposable email works', link: '/blog/free-disposable-email' },
            { text: 'Detect disposable domains', link: '/blog/detect-disposable-email-domains' },
            { text: 'Mailinator alternatives', link: '/blog/mailinator-alternatives' },
            { text: 'temp-mail.org API compared', link: '/blog/temp-mail-org-api' },
            { text: 'What is Temp Mail Plus?', link: '/blog/what-is-temp-mail-plus' },
            { text: 'Python vs Node.js', link: '/blog/temp-mail-api-python' },
            { text: 'Test a signup email flow', link: '/blog/test-signup-email-flow' },
          ],
        },
        {
          text: 'Docs',
          items: [
            { text: 'Free temp mail API for Node.js', link: '/node-temp-mail/' },
            { text: 'Getting started', link: '/guide/getting-started' },
            { text: 'Email testing guide', link: '/guide/email-testing' },
          ],
        },
      ],
      '/': [
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
        {
          text: 'More',
          items: [
            { text: 'Free temp mail API for Node.js', link: '/node-temp-mail/' },
            { text: 'Blog', link: '/blog/' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: repo },
      { icon: 'npm', link: 'https://www.npmjs.com/package/temp-mail-plus-api' },
    ],
    outline: { level: [2, 3] },
    search: { provider: 'local' },
  },
})
