import { versionModlists } from '../../.vitepress/modlist.mjs'

// One modlist page per release that lists its contents, linked from the
// changelog via the "Modlist" badge.
export default {
  paths() {
    return versionModlists('insomnia')
  },
}
