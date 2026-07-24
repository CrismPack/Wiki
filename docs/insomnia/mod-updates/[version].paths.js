import { releasesWithUpdates, renderUpdatesPage } from '../../.vitepress/changelog.mjs'

// One page per release that has mod version bumps, linked from the changelog
// via the "Mod Updates" badge. Kept outside changelogs/ so it stays off the
// changelog sidebar.
export default {
  paths() {
    return releasesWithUpdates('insomnia').map((r) => ({
      params: { version: r.version },
      content: renderUpdatesPage('insomnia', r),
    }))
  },
}
