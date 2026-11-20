import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d299-current-figure-text`;
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const raw = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: raw.length,
    sha256: crypto.createHash('sha256').update(raw).digest('hex') };
};
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const entries = node => [
  ...(node.id && node.title ? [node] : []),
  ...['contents', 'lessons', 'topics'].flatMap(key => (node[key] || []).flatMap(entries)),
];
const key = label => label.replace(/\s+/g, ' ').trim()
  .replace(/(?<=[\u3400-\u9fff]) (?=[\u3400-\u9fff])/g, '');
const en = new Map(entries(read('ssot-resources/soviet10year-textbooks/toc/10p/en.json'))
  .map(node => [node.id, node.title]));
const translations = new Map(entries(read('ssot-resources/soviet10year-textbooks/toc/10p/zh.json'))
  .map(node => [key(node.title), en.get(node.id)]));
const identityRepairs = [];
for (const number of [17, 18]) {
  const file = `.tmp/STEMROBIN-181/d1816-d276/source-work/adapt/10p/modern-us-neutral-en/lessons/phy10-c1-s3-n${number}/lesson.template.json`;
  const lesson = read(file);
  const original = structuredClone(lesson);
  save(`${O}/before-identity/n${number}.en.json`, original);
  for (const field of ['chapter', 'section', 'printed_title'])
    lesson[field] = lesson.source.data[field];
  assert.deepEqual(lesson.prose, original.prose);
  assert.deepEqual(lesson.source, original.source);
  assert.deepEqual(lesson.section_breaks, original.section_breaks);
  const before = bind(file);
  fs.writeFileSync(file, JSON.stringify(lesson, null, 2) + '\n');
  identityRepairs.push({ number, before, after: bind(file),
    fields: ['chapter', 'section', 'printed_title'], proseChanged: false });
}
const templates = [];
const texts = new Map();
for (const number of [17, 18, 19])
  for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
    const base = number === 19 ? 'd1816-d287/work' : 'd1816-d276/source-work';
    const file = `.tmp/STEMROBIN-181/${base}/adapt/10p/${edition}/lessons/phy10-c1-s3-n${number}/lesson.template.json`;
    const lesson = read(file);
    const heading = label => {
      if (!label) return null;
      if (locale === 'zh') return label;
      const value = translations.get(key(label));
      assert(value, label);
      return value;
    };
    const text = `# ${number}. ${lesson.title}\n\n` +
      `> ${[heading(lesson.chapter), heading(lesson.section)].filter(Boolean).join(' | ')}\n\n` +
      lesson.prose.map(block => block.text || block.label || '').filter(Boolean).join('\n\n');
    const textFile = `${O}/texts-current/n${number}.${locale}.md`;
    fs.mkdirSync(path.dirname(textFile), { recursive: true });
    if (fs.existsSync(textFile)) assert.equal(fs.readFileSync(textFile, 'utf8'), text);
    else fs.writeFileSync(textFile, text, { flag: 'wx' });
    templates.push({ number, locale, edition, template: bind(file), text: bind(textFile) });
    texts.set(`${number}-${locale}`, { lesson: lesson.id, locale, text });
  }
const records = [];
for (const number of [24, 25, 26, 27, 28, 29, null]) {
  const figure = number === null ? 'tbl-p0053-01' : `fig-${number}`;
  let specFile;
  let renderFile;
  if (number === 24 || number === 25) {
    const dir = `${T}/tmp/d1816-d280-fig2425-author/${figure}`;
    specFile = `${dir}/spec.json`;
    renderFile = `${dir}/${figure}.render.json`;
  } else if (number === 26) {
    const dir = `${T}/tmp/d1816-d282-fig26-author`;
    specFile = `${dir}/fig-26.repair.spec.json`;
    renderFile = `${dir}/fig-26.repair.render.json`;
  } else if (number === 27) {
    const dir = `${T}/tmp/d1816-d283-fig27-author`;
    specFile = `${dir}/spec.json`;
    renderFile = `${dir}/fig-27.render.json`;
  } else {
    const dir = `${T}/tmp/d1816-d298-n19-affected-author/figures/${figure}`;
    specFile = `${dir}/spec.json`;
    renderFile = `${dir}/${figure}.render.json`;
  }
  const original = read(specFile);
  const spec = structuredClone(original);
  const lessons = number === null ? [19] : number <= 26 ? [17] : number === 27 ? [18] : [18, 19];
  spec.source.authoritativeText = lessons.flatMap(lesson =>
    ['zh', 'en'].map(locale => texts.get(`${lesson}-${locale}`)));
  spec.source.image.path = `${canonical}/figures/${figure}.png`;
  assert.equal(bind(spec.source.image.path).sha256, spec.source.image.sha256);
  for (const field of ['objects', 'assertions', 'canvas', 'display', 'layout', 'description'])
    assert.deepEqual(spec[field], original[field]);
  assert.deepEqual(spec.source.inventory, original.source.inventory);
  const targetSpec = `${O}/figures/${figure}/spec.json`;
  save(targetSpec, spec);
  const render = read(renderFile);
  assert.equal(render.status, 'pass');
  assert.equal(render.spec.sha256, bind(specFile).sha256);
  assert.equal(bind(render.output.svg.path).sha256, render.output.svg.sha256);
  render.spec = { path: targetSpec, sha256: bind(targetSpec).sha256 };
  const targetRender = `${O}/figures/${figure}/${figure}.render.json`;
  save(targetRender, render);
  records.push({ figure, previousSpec: bind(specFile), previousRender: bind(renderFile),
    spec: bind(targetSpec), render: bind(targetRender), svg: bind(render.output.svg.path),
    templateBindings: templates.filter(entry => lessons.includes(entry.number)),
    geometryChanged: false, inventoryChanged: false, geometryRerenders: 0 });
}
save(`${O}/result.json`, { batch: 'D299', status: 'affected-context-review-pending',
  records, templates, identityRepairs,
  firstBindingFailure: { exitCode: 1, error: 'Untranslated identity mapping assertion: Chapter 2: Electrical Oscillations',
    partialOutputPreserved: true, lessonProseChanged: false,
    diagnosis: 'N17/N18 EN author translated native chapter/printed_title identity fields. Restore raw identity; renderer translates breadcrumbs from TOC and uses English title.' },
  nativeTool: bind('.claude/skills/ld-s10y-lesson/tools/edition.py'),
  textRepair: bind(`${T}/tmp/d1816-d298-n19-affected-author/result.json`),
  layoutRepair: bind(`${T}/tmp/d1816-d295-native-layout/result.json`),
  geometryRerenders: 0, actualParentImageOpens: 0, completeCoursesAdded: 0,
  databaseWrites: false, paidCalls: 0 });
console.log(JSON.stringify({ result: bind(`${O}/result.json`) }));
