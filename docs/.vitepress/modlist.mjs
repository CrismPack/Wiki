// Modlist pages, built from the contents that Modpack Tool writes into each
// release record: the pack's newest full release at /<pack>/modlist, and
// every release at /<pack>/modlist/<version>, linked from its changelog entry.

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { anchorFor, compareKeys, contentKey, loadReleases, modlistRelease } from './changelog.mjs'

const SECTIONS = [['mods', 'Mods'], ['resourcepacks', 'Resource Packs'], ['shaderpacks', 'Shader Packs']]

// A pack's releases that list their contents, newest first.
function listed(folder) {
  return loadReleases(folder).filter((r) => r.contents).sort((a, b) => compareKeys(b.version, a.version))
}

// One entry: its name linked to its page, its authors and, when the pack
// shows sides, its side.
function renderItem(item) {
  const name = item.url ? `[${item.name}](${item.url})` : item.name
  const authors = item.authors?.length ? ` by ${item.authors.join(', ')}` : ''
  const side = item.side ? ` \`${item.side[0].toUpperCase()}${item.side.slice(1)}\`` : ''
  return `- ${name}${authors}${side}`
}

// A release's modlist. The names come from the mods' authors, so the lists
// are kept out of Vue's template syntax (v-pre).
function renderModlist(folder, r, title) {
  const version = anchorFor(r.version)
  const loader = `${r.loader?.name || ''} ${r.loader?.version || ''}`.trim()
  let out = `# ${title}\n\nEverything in [${version}](/${folder}/changelogs/${contentKey(r.minecraft)}#${version}), ` +
    `released ${r.released}, for Minecraft ${r.minecraft}${loader ? ` with ${loader}` : ''}.\n`
  for (const [key, label] of SECTIONS) {
    const items = r.contents[key] || []
    if (items.length) out += `\n## ${label} (${items.length})\n\n::: v-pre\n${items.map(renderItem).join('\n')}\n:::\n`
  }
  return out
}

// The /<pack>/modlist page: the newest full release's modlist (pre-releases
// have only their own pages), or the hand-written _modlist.md while no full
// release lists its contents yet.
export function modlistPage(folder) {
  const newest = modlistRelease(loadReleases(folder))
  if (newest) return [{ params: { page: 'modlist' }, content: renderModlist(folder, newest, 'Modlist') }]
  try {
    return [{ params: { page: 'modlist' }, content: readFileSync(resolve(`./docs/${folder}/_modlist.md`), 'utf-8') }]
  } catch {
    return []
  }
}

// The /<pack>/modlist/<version> pages: one per release that lists its contents.
export function versionModlists(folder) {
  return listed(folder).map((r) => ({
    params: { version: r.version },
    content: renderModlist(folder, r, `Modlist for ${anchorFor(r.version)}`),
  }))
}
