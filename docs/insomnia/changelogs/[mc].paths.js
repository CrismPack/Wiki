import { mcPages } from '../../.vitepress/changelog.mjs'

// One generated page per content update (26.1), spanning its patch versions
// (26.1, 26.1.1, ...). A legacy line with a history file (_1.20.md) shows its
// releases from records above that history; the other legacy lines keep their
// static hand-rendered .md files and are not produced here.
export default {
  paths() {
    return mcPages('insomnia')
  },
}
