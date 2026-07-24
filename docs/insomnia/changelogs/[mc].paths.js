import { loadReleases, dataMcVersions, renderMcPage } from '../../.vitepress/changelog.mjs'

// One generated page per MC version that has release data. Legacy MC lines keep
// their static hand-rendered .md files and are not produced here.
export default {
  paths() {
    const releases = loadReleases('insomnia')
    return dataMcVersions('insomnia').map((mc) => ({
      params: { mc },
      content: renderMcPage(mc, releases.filter((r) => r.minecraft === mc)),
    }))
  },
}
