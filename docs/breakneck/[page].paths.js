import { modlistPage } from '../.vitepress/modlist.mjs'

// The modlist page, built from the newest release that lists its contents
// (see modlistPage). Kept outside changelogs/ so it stays off the changelog
// sidebar.
export default {
  paths() {
    return modlistPage('breakneck')
  },
}
