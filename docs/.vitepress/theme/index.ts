// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import { getScrollOffset, inBrowser, onContentUpdated } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './theme.css'

// A link can point into a folded block, such as a pre-release's changelog
// entry under its full release: open the blocks around the target and scroll
// to it, the way VitePress scrolls to a heading.
function revealLinkTarget() {
  let target: HTMLElement | null = null
  try {
    target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
  } catch {}
  let opened = false
  for (let el = target?.parentElement; el; el = el.parentElement) {
    if (el instanceof HTMLDetailsElement && !el.open) {
      el.open = true
      opened = true
    }
  }
  if (target && opened) {
    const padding = parseInt(getComputedStyle(target).paddingTop, 10)
    const top = window.scrollY + target.getBoundingClientRect().top - getScrollOffset() + padding
    requestAnimationFrame(() => window.scrollTo(0, top))
  }
}

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  },
  setup() {
    // On page loads and for links within the page (VitePress sends
    // hashchange before it scrolls).
    onContentUpdated(revealLinkTarget)
    if (inBrowser) window.addEventListener('hashchange', revealLinkTarget)
  }
} satisfies Theme
