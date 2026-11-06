#!/usr/bin/env node
/**
 * Regenerates the icon font subsets used by the app.
 *
 *   npm run update-icons
 *
 * Bootstrap Icons is subset completely offline from the font that ships with the npm package.
 * The icon names are read from the class names used in the source (`bi bi-x`), so there is no
 * list to maintain by hand.
 *
 * Material Symbols cannot be subset offline: the package font renders icons through a single
 * large `rlig` lookup, and keeping that lookup for even a handful of icons yields ~80 KB
 * (for all of ours: ~260 KB), compared to ~15 KB for the subset Google serves. The subset is
 * therefore still requested from the Google Fonts API, but the icon list is derived from the
 * source as well instead of being a hand-sorted array. This step needs network access.
 *
 * Add an icon by using it in a template and re-running the script. Commit the regenerated
 * files together with the code that uses them.
 */
import { readFile, writeFile, mkdir, rm, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import subsetFont from 'subset-font';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(root, 'src');

const bootstrapPackage = path.join(root, 'node_modules/bootstrap-icons/font');
const materialPackage = path.join(root, 'node_modules/material-symbols');

const outputs = {
  bootstrapFont: path.join(sourceDir, 'assets/fonts/bootstrap-icons/bootstrap-icons-subset.woff2'),
  bootstrapScss: path.join(sourceDir, 'scss/base/_bootstrap-icons.scss'),
  materialFont: path.join(sourceDir, 'assets/fonts/material-icons/material_icons_subset.woff2'),
};
const outdatedMaterialFont = path.join(sourceDir, 'assets/fonts/material-icons/material_icons_subset.woff');

// Axis values the app renders Material Symbols with (see scss/base/_base.scss).
const materialAxisQuery = 'opsz,wght,FILL,GRAD@48,500,0,0';

// Names that were renamed upstream but are still present in the font as aliases.
const materialAliases = new Set(['get_app', 'navigate_before', 'navigate_next']);

// A browser user agent is required to get a woff2 file instead of an older format.
const browserUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

async function main() {
  const sourceFiles = await collectSources(sourceDir);

  await updateBootstrapIcons(sourceFiles);
  await updateMaterialSymbols(sourceFiles);

  if (existsSync(outdatedMaterialFont)) {
    await rm(outdatedMaterialFont);
    console.log(`removed ${relative(outdatedMaterialFont)}`);
  }
}

async function updateBootstrapIcons(sourceFiles) {
  const codepoints = JSON.parse(await readFile(path.join(bootstrapPackage, 'bootstrap-icons.json'), 'utf8'));
  const names = new Set();

  for (const file of sourceFiles) {
    const content = await readFile(file, 'utf8');
    for (const match of content.matchAll(/\bbi-([a-z0-9]+(?:-[a-z0-9]+)*)/g)) {
      if (match[1] in codepoints) {
        names.add(match[1]);
      }
    }
  }

  const characters = [...names].map(name => String.fromCodePoint(codepoints[name])).join('');
  const font = await readFile(path.join(bootstrapPackage, 'fonts/bootstrap-icons.woff2'));
  const subset = await subsetFont(font, characters, { targetFormat: 'woff2' });

  await writeOutput(outputs.bootstrapFont, subset);
  await writeOutput(outputs.bootstrapScss, renderBootstrapScss(names, codepoints));

  console.log(`bootstrap-icons: ${names.size} icons, ${kb(subset.length)}`);
}

async function updateMaterialSymbols(sourceFiles) {
  const knownNames = parseMaterialSymbolNames(await readFile(path.join(materialPackage, 'index.d.ts'), 'utf8'));
  const names = new Set();

  for (const file of sourceFiles) {
    const content = await readFile(file, 'utf8');

    if (file.endsWith('.html')) {
      // The icon name is the text content of the element.
      const element = /<[a-z0-9-]+[^>]*\bmaterial-symbols-outlined\b[^>]*>\s*([a-z0-9_]+)\s*</gi;
      for (const match of content.matchAll(element)) {
        names.add(match[1]);
      }

      // ...unless it is chosen in an interpolation, e.g. `{{ cond ? 'location_on' : 'location_off' }}`.
      const interpolation = /material-symbols-outlined\b[^>]*>\s*\{\{([\s\S]*?)\}\}/g;
      for (const expression of content.matchAll(interpolation)) {
        for (const match of expression[1].matchAll(/'([a-z0-9_]+)'/g)) {
          names.add(match[1]);
        }
      }
    } else if (file.endsWith('.ts')) {
      // Icons can also be chosen at runtime, e.g. `this.severity_icon = 'warning'`.
      for (const line of content.split('\n')) {
        if (!/icon|symbol/i.test(line)) {
          continue;
        }
        for (const match of line.matchAll(/'([a-z0-9_]+)'/g)) {
          names.add(match[1]);
        }
      }
    }
  }

  const unknown = [...names].filter(name => !knownNames.has(name) && !materialAliases.has(name));
  for (const name of unknown) {
    names.delete(name);
  }
  if (unknown.length > 0) {
    console.log(`material-symbols: ignoring ${unknown.join(', ')} (not an icon name)`);
  }

  const font = await fetchMaterialSubset([...names].sort());

  await writeOutput(outputs.materialFont, font);

  console.log(`material-symbols: ${names.size} icons, ${kb(font.length)}`);
}

/** Downloads the subset font from the Google Fonts API. */
async function fetchMaterialSubset(names) {
  const family = `Material+Symbols+Outlined:${materialAxisQuery}`;
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family}&icon_names=${names.join(',')}`;

  const cssResponse = await fetch(cssUrl, { headers: { 'User-Agent': browserUserAgent } });
  if (!cssResponse.ok) {
    throw new Error(`Google Fonts returned ${cssResponse.status} for ${names.length} icons. ` +
      'Check the names printed above for typos.');
  }

  const fontUrl = (await cssResponse.text()).match(/url\((https:\/\/[^)]+)\)/)?.[1];
  if (!fontUrl) {
    throw new Error('Could not find the font url in the Google Fonts response.');
  }

  const fontResponse = await fetch(fontUrl);
  if (!fontResponse.ok) {
    throw new Error(`Downloading the subset font failed with ${fontResponse.status}.`);
  }

  return Buffer.from(await fontResponse.arrayBuffer());
}

/** Extracts the quoted icon names from the package's `index.d.ts` type definition. */
function parseMaterialSymbolNames(declaration) {
  const names = new Set();
  for (const match of declaration.matchAll(/"([a-z0-9_]+)"/g)) {
    names.add(match[1]);
  }
  return names;
}

function renderBootstrapScss(names, codepoints) {
  const rules = [...names]
    .sort()
    .map(name => `.bi-${name}::before { content: "\\${codepoints[name].toString(16)}"; }`)
    .join('\n');

  return `// Generated by scripts/update-icon-fonts.mjs - do not edit by hand.
// Re-run \`npm run update-icons\` after adding or removing a bootstrap icon.

@font-face {
  font-display: block;
  font-family: 'bootstrap-icons';
  src: url('../../assets/fonts/bootstrap-icons/bootstrap-icons-subset.woff2') format('woff2');
}

.bi::before,
[class^='bi-']::before,
[class*=' bi-']::before {
  display: inline-block;
  font-family: bootstrap-icons !important;
  font-style: normal;
  font-weight: normal !important;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: -0.125em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

${rules}
`;
}

async function collectSources(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectSources(fullPath));
    } else if (/\.(html|ts|scss)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function writeOutput(file, content) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
  console.log(`wrote ${relative(file)}`);
}

function relative(file) {
  return path.relative(root, file);
}

function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
