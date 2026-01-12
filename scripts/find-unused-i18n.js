/*
 * Find unused i18n keys across locales.
 */

// scripts/find-unused-i18n.js
// Node >=14
const fs = require('fs');
const path = require('path');

// Resolve project root as the directory that contains this script, then go up to repo root if needed
const scriptDir = __dirname; // folder where this script file resides
const root = path.resolve(scriptDir, '..'); // adjust as needed to reach repo root
const srcDir = path.join(root, 'src');
const i18nDir = path.join(srcDir, 'assets', 'i18n');

const locales = ['en', 'de'];

function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

function flatten(obj, prefix = '') {
  const out = new Set();
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      const nested = flatten(v, key); nested.forEach(x => out.add(x));
    } else { out.add(key); }
  }
  return out;
}

function gatherFiles(dir) {
  const res = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) res.push(...gatherFiles(p));
    else if (/\.(html|ts|tsx|js|jsx|scss|css|md|json|yml|yaml)$/i.test(e.name)) res.push(p);
  }
  return res;
}

// Template pipe: {{ 'a.b' | translate }}
const rePipe = /['\"]([A-Za-z0-9_][A-Za-z0-9_.-]*?)['\"]\s*\|\s*translate\b/g;
// Service calls: obj.instant/get/stream('a.b')
const reSvc = /\.[\s]*(?:instant|get|stream)\s*\(\s*['\"]([^'\"]+)['\"]/g;
// Service calls with array: obj.get(['a.b','c.d'])
const reSvcArray = /\.[\s]*(?:instant|get|stream)\s*\(\s*\[([^\]]+)\]/g;
// Service calls with template literal (no expressions): obj.instant(`a.b`)
const reSvcTpl = /\.[\s]*(?:instant|get|stream)\s*\(\s*`([^`$]+?)`\s*\)/g;
// Wrapper `_('a.b')`
const reKeyWrapper = /_\(\s*['\"]([^'\"]+)['\"]\s*\)/g;
// Dynamic prefix concatenations: 'Prefix.' + var
const reDynPrefix = /['\"]([A-Za-z0-9_.-]+\.)['\"]\s*\+\s*[A-Za-z0-9_$.()[\]]+/g;

function scanUsages(files) {
  const used = new Set();
  const dynPrefixes = new Set();
  for (const f of files) {
    let text; try { text = fs.readFileSync(f, 'utf8'); } catch { continue; }

    for (const m of text.matchAll(rePipe)) used.add(m[1]);
    for (const m of text.matchAll(reSvc)) used.add(m[1]);
    for (const m of text.matchAll(reSvcTpl)) used.add(m[1]);
    for (const m of text.matchAll(reSvcArray)) {
      const items = m[1].match(/['\"]([^'\"]+)['\"]/g) || [];
      for (const it of items) used.add(it.slice(1, -1));
    }
    // Mark keys wrapped in _() as used anywhere
    for (const m of text.matchAll(reKeyWrapper)) used.add(m[1]);

    for (const m of text.matchAll(reDynPrefix)) dynPrefixes.add(m[1].replace(/\.$/, ''));
  }
  return { used, dynPrefixes };
}

function expandByPrefixes(keys, prefixes) {
  const out = new Set();
  outer: for (const k of keys) {
    for (const p of prefixes) {
      if (k === p || k.startsWith(p + '.')) { out.add(k); continue outer; }
    }
  }
  return out;
}

function main() {
  const localeKeys = {};
  for (const loc of locales) {
    const p = path.join(i18nDir, `${loc}.json`);
    if (!fs.existsSync(p)) { console.error(`Missing ${p}`); process.exit(1); }
    const json = readJson(p); localeKeys[loc] = flatten(json);
  }

  const files = gatherFiles(srcDir);
  const { used, dynPrefixes } = scanUsages(files);

  const expandedUsed = new Set(used);
  for (const k of used) {
    const parts = k.split('.');
    for (let i = 1; i < parts.length; i++) expandedUsed.add(parts.slice(0, i).join('.'));
  }

  const allLocaleKeys = new Set([].concat(...Object.values(localeKeys).map(set => Array.from(set))));
  const usedByDyn = expandByPrefixes(allLocaleKeys, dynPrefixes);

  const allKeys = new Set();
  Object.values(localeKeys).forEach(s => s.forEach(k => allKeys.add(k)));

  const missing = {};
  for (const loc of locales) {
    const miss = []; for (const k of allKeys) if (!localeKeys[loc].has(k)) miss.push(k);
    missing[loc] = miss.sort();
  }

  const report = { unused: {}, missing, stats: {} };
  for (const loc of locales) {
    const unused = [];
    for (const k of localeKeys[loc]) {
      const isDirect = expandedUsed.has(k);
      const isDyn = usedByDyn.has(k);
      if (!isDirect && !isDyn) unused.push(k);
    }
    report.unused[loc] = unused.sort();
    report.stats[loc] = { total: localeKeys[loc].size, unused: unused.length };
  }

  console.log(JSON.stringify({
    stats: report.stats,
    missingAcrossLocales: report.missing,
    exampleDynamicPrefixes: Array.from(dynPrefixes).sort(),
    sampleUnused_en: report.unused.en.slice(0, 50),
    sampleUnused_de: report.unused.de.slice(0, 50)
  }, null, 2));
}

main();
