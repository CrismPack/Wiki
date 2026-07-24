import { loadReleases, dataContentKeys, contentKey, renderMcPage } from '../../.vitepress/changelog.mjs'

// One generated page per content update (26.1), spanning its patch versions
// (26.1, 26.1.1, ...). Legacy MC lines keep their static hand-rendered .md
// files and are not produced here.
export default {
  paths() {
    const releases = loadReleases('breakneck')
    return dataContentKeys('breakneck').map((key) => ({
      params: { mc: key },
      content: renderMcPage(key, releases.filter((r) => contentKey(r.minecraft) === key)),
    }))
  },
}
