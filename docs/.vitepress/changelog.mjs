// Data-first changelog rendering.
//
// Reads the release data files synced from each pack repo
// (docs/<pack>/data/<version>+<mc>.json) and renders changelog pages from
// them. Presentation lives here, not in the pack repos: restyling updates all
// data-backed history at once. Legacy hand-rendered markdown pages are left
// untouched, unless their Minecraft line gets new releases: then the page
// becomes that line's history (see renderLinePage).

import { readdirSync, readFileSync } from 'fs'
import { resolve } from 'path'

// Load every release record for a pack; returns [] when no data folder exists.
export function loadReleases(pack) {
  const dir = resolve(`./docs/${pack}/data`)
  let files
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.json'))
  } catch {
    return []
  }
  return files.map((f) => JSON.parse(readFileSync(resolve(dir, f), 'utf-8')))
}

// Parse a version into a comparable key, mirroring the tool's
// pack_version.parse_pack_version_key ordering (MC-scheme and legacy semver,
// pre-releases below their stable release; unparseable sorts lowest).
const PRE_RANK = { dev: 0, alpha: 1, a: 1, beta: 2, b: 2, rc: 3 }
const FINAL_PRE = [9, 0]

function ints(text) {
  const parts = String(text).split('.')
  if (parts.every((p) => /^\d+$/.test(p))) return parts.map(Number)
  return null
}

function splitPre(text) {
  const m = /^(.+?)[-_.](alpha|beta|rc)[.\-_]?(\d+)?$/i.exec(text)
  if (!m) return [text, FINAL_PRE]
  return [m[1], [PRE_RANK[m[2].toLowerCase()], Number(m[3] || 0)]]
}

export function versionKey(raw) {
  const s = String(raw || '').trim()
  if (!s) return [0, [], [], FINAL_PRE, '']
  const [base, pre] = splitPre(s)
  const dash = base.indexOf('-')
  if (dash !== -1) {
    const mc = ints(base.slice(0, dash))
    const rel = ints(base.slice(dash + 1))
    if (mc && rel) return [1, mc, rel, pre, s.toLowerCase()]
  }
  const solo = ints(base)
  if (solo) return [1, solo, [], pre, s.toLowerCase()]
  return [0, [], [], FINAL_PRE, s.toLowerCase()]
}

// Lexicographic compare of two version keys (returns <0 / 0 / >0).
export function compareKeys(a, b) {
  const ka = Array.isArray(a) ? a : versionKey(a)
  const kb = Array.isArray(b) ? b : versionKey(b)
  const cmp = (x, y) => {
    if (Array.isArray(x) || Array.isArray(y)) {
      const xs = x || [], ys = y || []
      for (let i = 0; i < Math.max(xs.length, ys.length); i++) {
        const d = cmp(xs[i] ?? -1, ys[i] ?? -1)
        if (d) return d
      }
      return 0
    }
    if (typeof x === 'number' && typeof y === 'number') return x - y
    return String(x) < String(y) ? -1 : String(x) > String(y) ? 1 : 0
  }
  return cmp(ka, kb)
}

// The changelog heading/anchor text: MC-scheme versions as-is, legacy versions
// keep the historical "v" prefix rule. Mirrors pack_version.format_version_anchor.
function anchorFor(version) {
  const v = String(version)
  if (/^\d+(\.\d+)*-\d+(\.\d+)*(-(alpha|beta|rc)\.?\d*)?$/i.test(v)) return v
  return v.includes('v') ? v : `v${v}`
}

// Content-update key: the first two numeric components of a Minecraft version,
// so patches (26.1.1) share their content update's page (26.1). Mirrors the
// tool's pack_version.minecraft_content_key.
export function contentKey(mc) {
  const nums = []
  for (const part of String(mc || '').trim().split('.')) {
    if (/^\d+$/.test(part)) nums.push(part)
    else break
  }
  return nums.length ? nums.slice(0, 2).join('.') : String(mc || '').trim()
}

const codify = (line) => String(line).replace(/\[([^\]]+)\]/g, '`$1`')
const bullets = (lines) => (lines || []).map((l) => `- ${l}`).join('\n')

// A pre-release's kind and full release: { kind: 'beta', full: '26.2-1.0' } for
// "26.2-1.0-beta.1", { kind: 'beta', full: '2.2.0' } for "2.2.0b1"; null for a
// full release. Mirrors the tool's version.PrereleaseKind: a plain "pre" or
// "preview" ("2.0.0.pre1") is just a pre-release, and "4.1.1a" is a
// post-release.
const PRE_KINDS = { a: 'alpha', alpha: 'alpha', b: 'beta', beta: 'beta', c: 'rc', rc: 'rc', preview: 'pre', pre: 'pre', dev: 'dev' }

function prerelease(version) {
  const m = /^(\d.*?)[-_.]?(alpha|beta|rc|preview|pre|dev|[abc](?=\d))[-_.]?\d*$/i.exec(String(version))
  return m ? { kind: PRE_KINDS[m[2].toLowerCase()], full: m[1] } : null
}

// A pre-release's badge, and the notice that also heads its release notes
// (the tool's changelog.PrereleaseNotice).
const PRE_LABELS = {
  alpha: { badge: 'danger', text: 'Alpha', notice: 'an alpha' },
  beta: { badge: 'warning', text: 'Beta', notice: 'a beta' },
  rc: { badge: 'warning', text: 'Release Candidate', notice: 'a release candidate' },
  dev: { badge: 'danger', text: 'Dev Build', notice: 'a development build' },
  pre: { badge: 'warning', text: 'Pre-release', notice: 'a pre-release' },
}

// One release: its heading at the given level, its sections one level below.
// A pre-release is labeled on its heading, and explained in a notice when it
// isn't folded under its full release.
function renderRelease(r, pack, { level = 2, notice = true } = {}) {
  const anchor = anchorFor(r.version)
  const loader = `${r.loader?.name ? r.loader.name[0].toUpperCase() + r.loader.name.slice(1) : ''} ${r.loader?.version || ''}`.trim()
  const label = r.prerelease ? PRE_LABELS[prerelease(r.version)?.kind ?? 'pre'] : null
  const section = (title, lines) =>
    lines && lines.length ? `\n${'#'.repeat(level + 1)} ${title}\n\n${bullets(lines)}\n` : ''
  const badge = label ? ` <Badge type='${label.badge}' text='${label.text}'/>` : ''
  let out = `\n${'#'.repeat(level)} ${anchor}${badge} <a href='#${anchor}' id='${anchor}'></a>\n\n`
  const badges = []
  // Detailed mod version bumps live on their own page, linked from here.
  if ((r.mods?.updated || []).length) {
    badges.push(`<a href='/${pack}/mod-updates/${r.version}'><Badge type='tip' text='Mod Updates'/></a>`)
  }
  if (r.minecraft) badges.push(`<Badge type='info' text='MC ${r.minecraft}'/>`)
  badges.push(`<Badge type='info' text='${loader}'/>`)
  if (r.released) badges.push(`<Badge type='info' text='${r.released}'/>`)
  out += badges.join('') + '\n'
  // Comparison note when this release is diffed against a different content
  // update (crossing pages), not merely a patch within the same one.
  if (r.comparedTo && r.comparedTo.version && r.comparedTo.minecraft &&
      contentKey(r.comparedTo.minecraft) !== contentKey(r.minecraft)) {
    const c = r.comparedTo
    out += `\n::: info\nChanges are in comparison to version [${c.version}](/${pack}/changelogs/${contentKey(c.minecraft)}#${anchorFor(c.version)}).\n:::\n`
  }
  if (label && notice) {
    out += `\n::: warning\nThis is ${label.notice}, so it may be less stable or feature complete than a full release. Here be dragons!\n:::\n`
  }
  out += section('Update Overview ⭐', r.overview)
  out += section('Changes/Improvements ⭐', r.changes)
  out += section('Bug Fixes 🪲', r.bugfixes)
  out += section('Script/Datapack Changes 📝', r.scriptChanges)
  out += section('Added Mods ✅', r.mods?.added)
  out += section('Removed Mods ❌', r.mods?.removed)
  out += section('Added Resource Packs 📦', r.resourcepacks?.added)
  out += section('Removed Resource Packs ❌', r.resourcepacks?.removed)
  out += section('Added Shaderpacks 🌅', r.shaderpacks?.added)
  out += section('Removed Shaderpacks ❌', r.shaderpacks?.removed)
  out += section('Config Changes 📝', (r.configChanges || []).map(codify))
  return out
}

// A page's releases, newest first. A pre-release is a release of its own,
// labeled as one, unless its full release covers it: a full release that is
// compared with the previous full release rather than with one of its
// pre-releases (the tool's "prereleases: previews"). Those pre-releases are
// folded under it, out of the way but still linkable. Links point into the
// pack's wiki folder, which can differ from its name: InsomniaHardcore lives
// in docs/insomnia.
function renderReleases(folder, releases) {
  const lower = (v) => String(v).toLowerCase()
  const fullOf = (v) => prerelease(v)?.full.toLowerCase()
  const folds = new Map(releases
    .filter((r) => !r.prerelease && r.comparedTo?.version && fullOf(r.comparedTo.version) !== lower(r.version))
    .map((r) => [lower(r.version), []]))
  const shown = []
  for (const r of releases) {
    const fold = r.prerelease && folds.get(fullOf(r.version))
    if (fold) fold.push(r)
    else shown.push(r)
  }
  const newestFirst = (a, b) => compareKeys(b.version, a.version)
  return shown.sort(newestFirst).map((r) => {
    const pres = (folds.get(lower(r.version)) ?? []).sort(newestFirst)
    const folded = pres.map((p) => renderRelease(p, folder, { level: 3, notice: false })).join('\n')
    return renderRelease(r, folder) + (pres.length ? `\n:::: details Pre-releases (${pres.length})\n${folded}\n::::\n` : '')
  }).join('\n')
}

// Full markdown for one content-update page (all its releases, spanning any
// patch versions within the content update).
function renderMcPage(folder, mc, releases) {
  const newest = [...releases].sort((a, b) => compareKeys(b.version, a.version))[0]
  const title = `# ${newest?.pack ? newest.pack + ' ' : ''}Changelog for ${mc}\n`
  return title + renderReleases(folder, releases)
}

// A Minecraft line with a hand-written page from before the release records
// keeps that page as its history in docs/<pack>/changelogs/_<key>.md, which is
// not a page of its own (srcExclude in config.mts). The line's page shows its
// releases from records first, under the history's heading, then the history.
// A history entry for a version that has a record by now, such as a "Work in
// progress" entry, is left out, so a line can move over before its release.
function renderLinePage(folder, key, releases) {
  let history
  try {
    history = readFileSync(resolve(`./docs/${folder}/changelogs/_${key}.md`), 'utf-8')
  } catch {
    return renderMcPage(folder, key, releases)
  }
  const recorded = new Set(releases.map((r) => anchorFor(r.version)))
  const first = history.search(/^## /m)
  const heading = first === -1 ? history : history.slice(0, first)
  const entries = (first === -1 ? [] : history.slice(first).split(/^(?=## )/m))
    .filter((entry) => !recorded.has(/id='([^']+)'/.exec(entry.split('\n', 1)[0])?.[1]))
  const rendered = renderReleases(folder, releases)
  return heading + (rendered && rendered + '\n') + entries.join('')
}

// Content-update keys that have a history file (_<key>.md).
export function historyKeys(folder) {
  try {
    return readdirSync(resolve(`./docs/${folder}/changelogs`))
      .filter((f) => /^_.+\.md$/.test(f))
      .map((f) => f.slice(1, -'.md'.length))
  } catch {
    return []
  }
}

// The pages [mc].paths.js generates: one per content update that has release
// records or a history file.
export function mcPages(folder) {
  const releases = loadReleases(folder)
  return [...new Set([...dataContentKeys(folder), ...historyKeys(folder)])].map((key) => ({
    params: { mc: key },
    content: renderLinePage(folder, key, releases.filter((r) => contentKey(r.minecraft) === key)),
  }))
}

// Full markdown for one release's Mod Updates page (the version bumps).
export function renderUpdatesPage(pack, release) {
  const subject = release.pack ? `${release.pack} ${release.version}` : release.version
  const items = (release.mods?.updated || []).map((u) => `${u.name}: \`${u.from}\` → \`${u.to}\``)
  return `# Mod Updates for ${subject}\n\n${bullets(items)}\n`
}

// Releases that have mod updates, for generating their Mod Updates pages.
export function releasesWithUpdates(pack) {
  return loadReleases(pack).filter((r) => (r.mods?.updated || []).length)
}

// Distinct content-update keys that have data, newest first. Patch versions
// (26.1.1) collapse into their content update (26.1), so each key is one page.
export function dataContentKeys(pack) {
  const seen = new Set()
  for (const r of loadReleases(pack)) seen.add(contentKey(r.minecraft))
  return [...seen].sort((a, b) => compareKeys(b, a))
}
