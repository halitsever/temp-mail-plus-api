import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import '@fontsource-variable/familjen-grotesk/wght.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/ibm-plex-mono/latin-500.css'
import '@fontsource/ibm-plex-mono/latin-600.css'
import './custom.css'
import Landing from './Landing.vue'
import SiteFooter from './SiteFooter.vue'

export default {
  extends: DefaultTheme,
  /** The stock footer hides next to a sidebar, so docs pages get this one. */
  Layout: () => h(DefaultTheme.Layout, null, { 'doc-after': () => h(SiteFooter) }),
  enhanceApp({ app }) {
    app.component('Landing', Landing)
  },
} satisfies Theme
