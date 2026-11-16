import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const T = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp');
const work = path.join(T, 'd021-n83-n84-text-20261116-a');
const book = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9p');
const tools = path.join(root, '.claude/skills/ld-s10y-lesson/tools');
const prepared = path.join(root, '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons');
const cards = ['phy9-c2-s2-n83', 'phy9-c2-s2-n84'];
const native = path.join(T, 'd021-n83-n84-native-text-20261116-a.py');
const python = path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: digest(bytes), bytes: bytes.length };
};
const json = value => `${JSON.stringify(value, null, 2)}\n`;
const writeNew = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value, { flag: 'wx' });
};
const save = (file, value) => writeNew(file, json(value));
const snapshot = (file, label) => {
  const copy = path.join(work, label);
  writeNew(copy, fs.readFileSync(file));
  return { active: bind(file), snapshot: bind(copy) };
};
const runNative = payload => JSON.parse(execFileSync(python, [native], {
  cwd: root, input: json({ book, ...payload }), encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
}));
const verify = entries => {
  for (const entry of entries) assert.deepEqual(bind(entry.path), entry, entry.path);
};
const manifestPath = path.join(work, 'before.json');
const phase = process.argv[2];

if (phase === 'preserve') {
  const archived = [];
  for (const filename of ['page.md', 'page.json', 'audit.json']) {
    archived.push(snapshot(path.join(book, 'pages/0207', filename), `before/page207/${filename}`));
  }
  for (const filename of ['lesson.md', 'lesson.json', 'exercises.json']) {
    archived.push(snapshot(path.join(book, 'lessons', cards[1], filename), `before/source84/${filename}`));
  }
  archived.push(snapshot(path.join(book, 'book.json'), 'before/book.json'));
  for (const card of cards) for (const filename of [
    'lesson.template.json', 'exercises.template.json', 'figures.template.json',
  ]) {
    archived.push(snapshot(path.join(prepared, card, filename), `before/templates/${card}/${filename}`));
  }
  const sourceCards = fs.readdirSync(path.join(book, 'lessons')).flatMap(card => {
    const folder = path.join(book, 'lessons', card);
    return fs.readdirSync(folder).filter(file => fs.statSync(path.join(folder, file)).isFile())
      .map(file => bind(path.join(folder, file)));
  });
  const sourcePages = fs.readdirSync(path.join(book, 'pages')).flatMap(page =>
    ['page.md', 'page.json', 'audit.json'].map(file => bind(path.join(book, 'pages', page, file))));
  save(manifestPath, { ticket: 'STEMROBIN-181', batch: 'D021', archived,
    sourceCards, sourcePages,
    independentSourceObservation: bind(path.join(T, 'source-review-9p-0204-0207.json')),
    tools: ['p2c.py', 'assemble.py', 'blocks.py', 'edition.py', 'normalize.py',
      'mathcheck.py', 'prose_flow.mjs', 'htmlfrag.js'].map(file => bind(path.join(tools, file))),
    sourceIndex: bind(path.join(book, 'book.json')),
  });
  console.log(json({ preserved: bind(manifestPath), sourceCardFiles: sourceCards.length }));
} else if (phase === 'register') {
  const before = read(manifestPath);
  verify(before.archived.map(item => item.active));
  const folder = path.join(book, 'pages/0207');
  const erratum = {
    id: 'p0207-first-series-capacitance-subscript',
    block: 'p0207#8',
    original: '$C=\\frac{\\varepsilon_0 S}{x}$',
    reason: '原页独立观察确认首式印为 C，没有下标；随后串联式区分总电容 C 与两段电容 C_1、C_2。首式计算第一段间隙的电容，应标为 C_1。忠实正文、公式、块身份与行数保持原印刷内容，仅现代层按此来源绑定勘误改下标。',
  };
  const result = runNative({ mode: 'metadata', md: fs.readFileSync(path.join(folder, 'page.md'), 'utf8'),
    page: read(path.join(folder, 'page.json')), audit: read(path.join(folder, 'audit.json')), erratum });
  save(path.join(work, 'metadata-native-result.json'), result);
  fs.writeFileSync(path.join(folder, 'page.md'), result.md);
  fs.writeFileSync(path.join(folder, 'page.json'), json(result.page));
  fs.writeFileSync(path.join(folder, 'audit.json'), json(result.audit));
  verify(before.sourceCards);
  verify(before.sourcePages.filter(item => !item.path.includes('/pages/0207/')));
  verify([before.sourceIndex]);
  const assembly = runNative({ mode: 'assembly', toc: path.join(root, 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json'),
    index: read(path.join(book, 'book.json')), lesson: read(path.join(book, 'lessons', cards[1], 'lesson.json')),
    exercises: read(path.join(book, 'lessons', cards[1], 'exercises.json')) });
  save(path.join(work, 'metadata-native-assembly.json'), {
    status: 'source-bound-metadata-registered-and-native-target-assembled',
    result: assembly, sourceCardsExactBytesUnchanged: true, sourceIndexExactBytesUnchanged: true,
    nativePageValidation: bind(path.join(work, 'metadata-native-result.json')),
    page: bind(path.join(folder, 'page.json')), audit: bind(path.join(folder, 'audit.json')),
    noFullSourceGatesImagesVectorizePromotionOrSharedToolChanges: true,
  });
  verify(before.sourceCards);
  console.log(json(assembly));
} else if (phase === 'prepare84') {
  assert.equal(read(path.join(work, 'metadata-native-assembly.json')).status,
    'source-bound-metadata-registered-and-native-target-assembled');
  const held83 = ['lesson.template.json', 'exercises.template.json', 'figures.template.json']
    .map(file => bind(path.join(prepared, cards[0], file)));
  const bookTemplate = path.join(root, '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/book.template.json');
  const sharedBefore = fs.existsSync(bookTemplate)
    ? snapshot(bookTemplate, 'before/adapt-book.template.json') : null;
  const args = [path.join(tools, 'p2c.py'), 'adapt-prepare', '--book', '9p',
    '--edition', 'modern-us-neutral', '--lesson', cards[1], '--force'];
  const output = execFileSync(python, args, { cwd: root, encoding: 'utf8' });
  verify(held83);
  const baseline = [];
  for (const file of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
    baseline.push(snapshot(path.join(prepared, cards[1], file), `prepared84/${file}`));
  }
  save(path.join(work, 'prepare84.json'), { command: [python, ...args], output,
    precededBy: bind(path.join(work, 'metadata-native-assembly.json')), baseline, held83,
    sharedBookTemplate: { before: sharedBefore, after: bind(bookTemplate),
      note: 'Native adapt-prepare book template side effect retained; no other lesson template touched.' } });
  console.log(output);
} else {
  throw new Error(`Unknown phase ${phase}`);
}
