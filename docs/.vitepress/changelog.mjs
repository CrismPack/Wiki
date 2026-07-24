// Data-first changelog rendering.
//
// Reads the release data files synced from each pack repo
// (docs/<pack>/data/<version>+<mc>.json) and renders changelog pages from
// them. Presentation lives here, not in the pack repos: restyling updates all
// data-backed history at once. Legacy hand-rendered markdown pages are left
// untouched and are not driven by this module.

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

const codify = (line) => String(line).replace(/\[([^\]]+)\]/g, '`$1`')
const bullets = (lines) => (lines || []).map((l) => `- ${l}`).join('\n')

function section(title, lines) {
  if (!lines || !lines.length) return ''
  return `\n### ${title}\n\n${bullets(lines)}\n`
}

function renderRelease(r, pack) {
  const anchor = anchorFor(r.version)
  const loader = `${r.loader?.name ? r.loader.name[0].toUpperCase() + r.loader.name.slice(1) : ''} ${r.loader?.version || ''}`.trim()
  let out = `\n## ${anchor} <a href='#${anchor}' id='${anchor}'></a>\n\n`
  const badges = []
  // Detailed mod version bumps live on their own page, linked from here.
  if ((r.mods?.updated || []).length) {
    badges.push(`<a href='/${pack}/mod-updates/${r.version}'><Badge type='tip' text='Mod Updates'/></a>`)
  }
  badges.push(`<Badge type='info' text='${loader}'/>`)
  if (r.released) badges.push(`<Badge type='info' text='${r.released}'/>`)
  out += badges.join('') + '\n'
  // Comparison note when this release is diffed against a different MC line.
  if (r.comparedTo && r.comparedTo.version && r.comparedTo.minecraft &&
      r.comparedTo.minecraft !== r.minecraft) {
    const c = r.comparedTo
    out += `\n::: info\nChanges are in comparison to version [${c.version}](/${pack}/changelogs/${c.minecraft}#${anchorFor(c.version)}).\n:::\n`
  }
  if (r.prerelease) out += `\n::: warning\nThis is a pre-release. Here be dragons!\n:::\n`
  out += section('Update Overview ⭐', r.overview)
  out += section('Changes/Improvements ⭐', r.changes)
  out += section('Bug Fixes 🪲', r.bugfixes)
  out += section('Added Mods ✅', r.mods?.added)
  out += section('Removed Mods ❌', r.mods?.removed)
  out += section('Added Resource Packs 📦', r.resourcepacks?.added)
  out += section('Removed Resource Packs ❌', r.resourcepacks?.removed)
  out += section('Added Shaderpacks 🌅', r.shaderpacks?.added)
  out += section('Removed Shaderpacks ❌', r.shaderpacks?.removed)
  out += section('Config Changes 📝', (r.configChanges || []).map(codify))
  return out
}

// Full markdown for one MC-version page (all its releases, newest first).
export function renderMcPage(mc, releases) {
  const ordered = [...releases].sort((a, b) => compareKeys(b.version, a.version))
  const pack = ordered[0]?.pack || ''
  const title = `# ${pack ? pack + ' ' : ''}Changelog for ${mc}\n`
  return title + ordered.map((r) => renderRelease(r, pack.toLowerCase())).join('\n')
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

// Distinct MC versions that have data, newest first.
export function dataMcVersions(pack) {
  const seen = new Map()
  for (const r of loadReleases(pack)) {
    if (!seen.has(r.minecraft)) seen.set(r.minecraft, r.minecraft)
  }
  return [...seen.keys()].sort((a, b) => compareKeys(b, a))
}
