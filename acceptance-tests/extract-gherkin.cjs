'use strict';

// Extracts classic Gherkin from Markdown specs (spec.md) into .feature files,
// synthesizing Feature:/Rule:/Scenario: from the Markdown headings and copying
// fenced step lines verbatim.
//
// ../EXTRACTION.md IS THE DEFINITION — the line-by-line mapping, the fence
// mechanics, the line-fidelity invariant and every hard error live there. This
// file is one binding of it; python/extract_gherkin.py is the other, and the
// two must stay behaviourally identical. Change the doc first, then both
// implementations, then re-verify (see the skill's "Port parity" note).

// Deliberately dependency-free (node:fs/node:path only): the CLI form must
// run from the skill's references/ directory, where no node_modules exists.

const fs = require('node:fs');
const path = require('node:path');

const GHERKIN_OPEN_RE = /^(`{3,})gherkin\s*$/;
const ANY_OPEN_RE = /^(`{3,})\S*\s*$/;
const INDENTED_GHERKIN_RE = /^\s+`{3,}gherkin\s*$/;

const HEADING_RE = /^#{1,6}\s+/;
const H1_RE = /^#\s+(.+?)\s*$/;
const DELTA_SECTION_RE = /^##\s+(ADDED|MODIFIED|REMOVED|RENAMED)\s+Requirements\s*$/i;
const REQUIREMENT_RE = /^###\s+Requirement:\s*(.+?)\s*$/i;
const SCENARIO_RE = /^####\s+(Scenario(?:\s+Outline)?):\s*(.+?)\s*$/i;

// Structure keywords are illegal inside a fence — they come from the
// headings. `Examples:` (the Scenario Outline table) and `Background:` are
// deliberately absent: both legitimately live in a fence.
const STRUCTURE_IN_FENCE_RE = /^\s*(Feature|Rule|Scenario\s+Outline|Scenario|Example):/;

function extractFile(mdPath) {
  const lines = fs.readFileSync(mdPath, 'utf8').split(/\r?\n/);
  const out = [];
  let state = 'prose'; // 'prose' | 'gherkin' | 'other-fence'
  let fenceTicks = 0;
  let openLine = 0;
  let h1Count = 0;
  let pendingScenario = null; // scenario heading still awaiting its fence

  lines.forEach((line, i) => {
    if (state === 'prose') {
      let m;
      if ((m = GHERKIN_OPEN_RE.exec(line))) {
        state = 'gherkin';
        fenceTicks = m[1].length;
        openLine = i + 1;
        pendingScenario = null;
        out.push('');
        return;
      }
      if (INDENTED_GHERKIN_RE.test(line)) {
        throw new Error(
          `${mdPath}:${i + 1}: indented \`\`\`gherkin fence — gherkin fences must start at column 0`
        );
      }
      if ((m = ANY_OPEN_RE.exec(line))) {
        state = 'other-fence';
        fenceTicks = m[1].length;
        openLine = i + 1;
        out.push('');
        return;
      }
      if (!HEADING_RE.test(line)) {
        out.push('');
        return;
      }
      // A heading ends any scenario still waiting for its steps.
      if (pendingScenario) {
        throw new Error(
          `${mdPath}:${pendingScenario.line}: "#### ${pendingScenario.keyword}: ${pendingScenario.name}" ` +
            `has no \`\`\`gherkin fence before the next heading`
        );
      }
      if ((m = H1_RE.exec(line))) {
        h1Count += 1;
        if (h1Count > 1) {
          throw new Error(
            `${mdPath}:${i + 1}: more than one H1 — a spec.md has exactly one "# <capability>" title`
          );
        }
        out.push(`Feature: ${m[1]}`);
        return;
      }
      if ((m = DELTA_SECTION_RE.exec(line))) {
        out.push(`  # @openspec: ${m[1].toUpperCase()}`);
        return;
      }
      if ((m = REQUIREMENT_RE.exec(line))) {
        out.push(`  Rule: ${m[1]}`);
        return;
      }
      if ((m = SCENARIO_RE.exec(line))) {
        const keyword = /outline/i.test(m[1]) ? 'Scenario Outline' : 'Scenario';
        pendingScenario = { line: i + 1, keyword, name: m[2] };
        out.push(`    ${keyword}: ${m[2]}`);
        return;
      }
      out.push('');
      return;
    }
    const close = new RegExp('^`{' + fenceTicks + ',}\\s*$');
    if (close.test(line)) {
      state = 'prose';
      out.push('');
      return;
    }
    if (state !== 'gherkin') {
      out.push('');
      return;
    }
    const kw = STRUCTURE_IN_FENCE_RE.exec(line);
    if (kw) {
      throw new Error(
        `${mdPath}:${i + 1}: "${kw[1]}:" inside a \`\`\`gherkin fence — structure comes from Markdown ` +
          `headings ("# title", "### Requirement:", "#### Scenario:"); fences hold only steps`
      );
    }
    out.push(line);
  });

  if (state !== 'prose') {
    throw new Error(`${mdPath}:${openLine}: unclosed fence`);
  }
  if (pendingScenario) {
    throw new Error(
      `${mdPath}:${pendingScenario.line}: "#### ${pendingScenario.keyword}: ${pendingScenario.name}" ` +
        `has no \`\`\`gherkin fence before the end of the file`
    );
  }
  if (h1Count === 0) {
    throw new Error(`${mdPath}: no H1 title — a spec.md must start with "# <capability>"`);
  }
  if (out.length !== lines.length) {
    throw new Error(`${mdPath}: line-count invariant violated (extractor bug)`);
  }
  return out.join('\n');
}

// Recursively collects files named <basename> under <dir>, returned as
// posix paths relative to <root>, sorted for deterministic output.
function walk(root, dir, basename, found) {
  if (!fs.existsSync(dir)) return found;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(root, abs, basename, found);
    else if (entry.name === basename || (basename.startsWith('*.') && entry.name.endsWith(basename.slice(1)))) {
      found.push(path.relative(root, abs).split(path.sep).join('/'));
    }
  }
  return found;
}

// Spec roots: specs/ (source of truth) and each active change's specs/ —
// changes/archive/ is excluded structurally (archive nests one level deeper
// than changes/<id>/) plus a defensive filter on the collected paths.
function collectSpecSources(openspecDir, basename) {
  const found = walk(openspecDir, path.join(openspecDir, 'specs'), basename, []);
  const changesDir = path.join(openspecDir, 'changes');
  if (fs.existsSync(changesDir)) {
    for (const entry of fs.readdirSync(changesDir, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name === 'archive') continue;
      walk(openspecDir, path.join(changesDir, entry.name, 'specs'), basename, found);
    }
  }
  return found.filter((p) => !p.includes('changes/archive/')).sort();
}

// Extracts every spec.md under <openspecDir> (source of truth + active
// change deltas, archive excluded) into <outDir>, mirroring the
// openspec-relative path with spec.md -> spec.feature. The output dir is
// wiped first — a stale extraction would keep deleted or renamed
// capabilities executing.
function extractAll(openspecDir, outDir) {
  openspecDir = openspecDir ? path.resolve(openspecDir) : path.resolve(__dirname, '../openspec');
  outDir = outDir ? path.resolve(outDir) : path.resolve(__dirname, '.extracted');

  fs.rmSync(outDir, { recursive: true, force: true });

  const sources = collectSpecSources(openspecDir, 'spec.md');

  // Legacy-format tripwire: raw .feature files under openspec/ no longer run
  // anywhere — flag them instead of letting them silently drop out.
  const legacy = collectSpecSources(openspecDir, '*.feature');
  if (legacy.length > 0) {
    console.error(
      `[extract-gherkin] WARNING: legacy .feature file(s) under openspec/ are ignored ` +
        `(specs are spec.md now): ${legacy.join(', ')}`
    );
  }

  const written = [];
  for (const rel of sources) {
    const dest = path.join(outDir, rel.replace(/spec\.md$/, 'spec.feature'));
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, extractFile(path.join(openspecDir, rel)));
    written.push(dest);
  }
  return { outDir, written };
}

module.exports = { extractAll, extractFile };

// CLI: node extract-gherkin.cjs [openspecDir] [outDir]
if (require.main === module) {
  try {
    const { outDir, written } = extractAll(process.argv[2], process.argv[3]);
    console.error(`[extract-gherkin] ${written.length} spec.md file(s) extracted to ${outDir}`);
  } catch (err) {
    console.error(`[extract-gherkin] ${err.message}`);
    process.exit(1);
  }
}
