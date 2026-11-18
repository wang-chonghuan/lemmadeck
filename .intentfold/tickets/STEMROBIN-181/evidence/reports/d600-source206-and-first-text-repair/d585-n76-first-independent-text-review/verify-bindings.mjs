import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp');
const owned = path.join(tmp, 'd585-n76-first-independent-text-review');
const author = path.join(tmp, 'd582-n76-first-bilingual-text-author');
const prep = path.join(tmp, 'd581-n76-first-source-preparation');
const raw = path.join(prep, 'root/10p');
const observations = [];
const blockers = [];
const seen = new Set();
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const load = filename => JSON.parse(fs.readFileSync(filename, 'utf8'));
const modeOf = filename => `0${(fs.statSync(filename).mode & 0o777).toString(8)}`;

function check(id, pass, details) {
  observations.push({ id, status: pass ? 'PASS' : 'FAIL', ...details });
  if (!pass) blockers.push({ id, status: 'FAIL', ...details });
}

function pin(entry, origin, base = repo) {
  const filename = path.resolve(base, entry.path);
  const key = `${filename}\0${entry.sha256}\0${origin}`;
  if (seen.has(key)) return;
  seen.add(key);
  try {
    const bytes = fs.readFileSync(filename);
    const stat = fs.statSync(filename);
    const actual = digest(bytes);
    const declaredSize = entry.bytes ?? entry.size;
    const actualMode = modeOf(filename);
    check(`PIN-${observations.length + 1}`, actual === entry.sha256 &&
      (declaredSize === undefined || declaredSize === bytes.length) &&
      (entry.mode === undefined || entry.mode === actualMode), {
      origin, path: filename, expected_sha256: entry.sha256,
      actual_sha256: actual, actual_bytes: bytes.length, actual_mode: actualMode,
      declared_bytes: declaredSize ?? null, declared_mode: entry.mode ?? null,
      declared_size_present: declaredSize !== undefined,
      declared_mode_present: entry.mode !== undefined,
      regular_file: stat.isFile()
    });
  } catch (error) {
    check(`PIN-${observations.length + 1}`, false, {
      origin, path: filename, expected_sha256: entry.sha256,
      error: error.message
    });
  }
}

function walkPins(value, origin, base = repo) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    pin(value, origin, base);
  }
  for (const [key, child] of Object.entries(value)) {
    if (key !== 'data') walkPins(child, `${origin}/${key}`, base);
  }
}

function filesBelow(root) {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap(entry => {
    const filename = path.join(root, entry.name);
    if (entry.isDirectory()) return filesBelow(filename);
    if (!entry.isFile()) throw new Error(`Non-regular author entry: ${filename}`);
    return [filename];
  }).sort();
}

pin({ path: path.join(author, 'report.json'),
  sha256: '111fad1a0d63af92771c095ad81176a7248d6a892abd5e66747962ed5c48afc7' },
  'USER-SUPPLIED-AUTHOR-REPORT');
pin({ path: path.join(author, 'author-freeze.json'),
  sha256: 'e4d736e1f90e5c97351f908da89067d3f39ed534f6a98c82cc35ce7ea58ee98c' },
  'USER-SUPPLIED-AUTHOR-FREEZE');

const inventory = load(path.join(owned, 'inventory.json'));
for (const entry of [...inventory.input_pins, ...inventory.contracts_read]) {
  pin(entry, 'PREAUTHOR-INVENTORY');
}
const preauthor = load(path.join(owned, 'preauthor-freeze.json'));
for (const entry of preauthor.files) pin(entry, 'PREAUTHOR-FREEZE');

const freeze = load(path.join(author, 'author-freeze.json'));
for (const entry of freeze.files) pin(entry, 'AUTHOR-FREEZE');
const actualAuthorFiles = filesBelow(author);
const listedAuthorFiles = freeze.files.map(entry => path.resolve(repo, entry.path));
check('AUTHOR-FREEZE-EXHAUSTIVE', isDeepStrictEqual(actualAuthorFiles,
  [...listedAuthorFiles, path.join(author, 'author-freeze.json')].sort()), {
  listed_files: listedAuthorFiles.length, actual_files: actualAuthorFiles.length,
  unlisted_files: actualAuthorFiles.filter(filename =>
    filename !== path.join(author, 'author-freeze.json') &&
    !listedAuthorFiles.includes(filename)),
  duplicate_list_entries: listedAuthorFiles.length - new Set(listedAuthorFiles).size
});
check('AUTHOR-OBSERVED-MODES', actualAuthorFiles.every(filename => modeOf(filename) === '0444'), {
  policy: 'Modes measured independently; author-freeze declares hashes only, not byte sizes or modes.',
  files: actualAuthorFiles.map(filename => ({
    path: filename, bytes: fs.statSync(filename).size, mode: modeOf(filename)
  }))
});

const report = load(path.join(author, 'report.json'));
const manifest = load(path.join(prep, 'manifest.json'));
walkPins(report, 'AUTHOR-REPORT');
walkPins(manifest, 'PREPARATION-MANIFEST');

const preparedLesson = load(path.join(raw, 'lessons/phy10-c2-s2-n76/lesson.json'));
const preparedExercises = load(path.join(raw, 'lessons/phy10-c2-s2-n76/exercises.json'));
check('SOURCE-COPIES-BYTE-IDENTITY',
  fs.readFileSync(path.join(author, 'source/lesson.json')).equals(
    fs.readFileSync(path.join(raw, 'lessons/phy10-c2-s2-n76/lesson.json'))) &&
  fs.readFileSync(path.join(author, 'source/exercises.json')).equals(
    fs.readFileSync(path.join(raw, 'lessons/phy10-c2-s2-n76/exercises.json'))), {
    lesson_sha256: digest(fs.readFileSync(path.join(author, 'source/lesson.json'))),
    exercises_sha256: digest(fs.readFileSync(path.join(author, 'source/exercises.json')))
  });

for (const name of ['lesson', 'exercises', 'figures']) {
  const first = path.join(author, `source/first-templates/${name}.template.json`);
  const original = path.join(prep,
    `work/adapt/10p/modern-us-neutral/lessons/phy10-c2-s2-n76/${name}.template.json`);
  check(`FIRST-TEMPLATE-COPY-${name.toUpperCase()}`,
    fs.readFileSync(first).equals(fs.readFileSync(original)), {
      path: first, prepared_path: original, sha256: digest(fs.readFileSync(first))
    });
}

for (const locale of ['zh', 'en']) {
  for (const name of ['lesson', 'exercises', 'figures']) {
    const filename = path.join(author, `candidate/${locale}/${name}.template.json`);
    const candidate = load(filename);
    walkPins(candidate.source, `CANDIDATE-${locale}-${name}-SOURCE`, raw);
    if (name === 'lesson') {
      check(`SNAPSHOT-${locale}-LESSON`,
        isDeepStrictEqual(candidate.source.data, preparedLesson), {
          path: filename, pointer: '/source/data',
          expected_source_sha256: digest(fs.readFileSync(
            path.join(raw, 'lessons/phy10-c2-s2-n76/lesson.json')))
        });
    }
    if (name === 'exercises') {
      check(`SNAPSHOT-${locale}-EXERCISES`,
        isDeepStrictEqual(candidate.source.data, preparedExercises), {
          path: filename, pointer: '/source/data'
        });
    }
    if (name === 'figures') {
      candidate.figures.forEach((figure, index) =>
        walkPins(figure.source, `CANDIDATE-${locale}-FIGURE-${index}-SOURCE`, raw));
    }
  }
}

const acceptedPages = new Map();
for (const page of [202, 203]) {
  const filename = path.join(repo,
    `ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0${page}/page.json`);
  acceptedPages.set(page, load(filename));
  check(`PREPARED-PAGE-${page}-BYTE-IDENTITY`,
    fs.readFileSync(filename).equals(fs.readFileSync(
      path.join(raw, `pages/0${page}/page.json`))), {
      accepted_path: filename, prepared_path: path.join(raw, `pages/0${page}/page.json`)
    });
}

for (const [index, object] of preparedLesson.prose.entries()) {
  const blocks = object.source_refs.map(ref => {
    const match = /^p0(\d{3})#(\d+)$/.exec(ref);
    if (!match) throw new Error(`Bad native ref: ${ref}`);
    const page = Number(match[1]);
    const offset = Number(match[2]) - 1;
    const block = acceptedPages.get(page)?.blocks[offset];
    if (!block) throw new Error(`Unavailable source block: ${ref}`);
    return { ref, page, pointer: `/blocks/${offset}`, block };
  });
  const expectedText = blocks.map(({ block }) => block.lines.join('')).join('');
  check(`PREPARED-SOURCE-OBJECT-${index}`, expectedText === object.text &&
    blocks.every(({ block }) => block.kind === object.kind) &&
    (object.kind !== 'fig' || blocks[0].block.id === object.id), {
      lesson_pointer: `/prose/${index}`, source_refs: object.source_refs,
      source_pointers: blocks.map(({ page, pointer }) => ({ page, pointer })),
      expected_text: expectedText, actual_text: object.text,
      kind: object.kind, figure_id: object.id
    });
}

const boundary = load(path.join(tmp, 'd575-source204-first-independent-review/report.json'));
const actual204 = load(path.join(tmp, 'd570-source204-first-author/source/10p/pages/0204/page.json'));
const projection204 = load(path.join(raw, 'pages/0204/page.json'));
check('ACTUAL-RIGHT-BOUNDARY-PROJECTION',
  boundary.gates.N76_RIGHT_BOUNDARY.status === 'PASS' &&
  boundary.gates.N76_RIGHT_BOUNDARY.native_one_based_ref === 'p0204#1' &&
  isDeepStrictEqual(projection204.blocks, [actual204.blocks[0]]) &&
  actual204.blocks[0].kind === 'h3' &&
  actual204.blocks[0].lines[0].startsWith('77.') &&
  preparedLesson.number === '76' &&
  preparedLesson.prose.every(object => object.source_refs.every(ref =>
    ref.startsWith('p0202#') || ref.startsWith('p0203#'))), {
    native_ref: 'p0204#1', json_pointer: '/blocks/0',
    actual_heading: actual204.blocks[0].lines[0],
    projection_blocks: projection204.blocks.length,
    note: 'Boundary certificate consumed; not a new SOURCE204 or whole-source review.'
  });

const output = {
  schema: 'd585/n76-author-source-binding-evidence@1',
  review_id: 'd585-n76-first-independent-text-review',
  generated_at_utc: new Date().toISOString(),
  status: blockers.length ? 'FAIL' : 'PASS',
  scope: 'Mechanical integrity and source-text bindings only; not SCI/ZHEN semantics or FIG/DISPLAY.',
  imageOpens: 0, image_files_hashed_as_bytes_only: true,
  candidate_semantics_inspected_by_this_script: false,
  author_freeze_files: freeze.files.length,
  checks_performed: observations.length,
  blocking_list: blockers,
  author_files: actualAuthorFiles.map(filename => ({
    path: filename, sha256: digest(fs.readFileSync(filename)),
    bytes: fs.statSync(filename).size, mode: modeOf(filename)
  })),
  observations
};
const outputPath = path.join(owned, 'author-binding-check.json');
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, { flag: 'wx', mode: 0o444 });
console.log(JSON.stringify({
  status: output.status, author_freeze_files: output.author_freeze_files,
  checks_performed: output.checks_performed, blocking_list: blockers,
  output: outputPath, sha256: digest(fs.readFileSync(outputPath))
}, null, 2));
if (blockers.length) process.exitCode = 1;
