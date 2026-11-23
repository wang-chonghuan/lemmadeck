import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
if (fs.realpathSync(process.cwd()) !== W) throw new Error('Wrong production workdir');
const B = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g';
const N = `${B}/evidence/stemrobin188-6g-n30`;
const L = 'geo68-c2-s4-n30';
const E = `${B}/editions/modern-us-neutral`;
const T = `.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/${L}`;
const R = `${N}/resume7`;
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const save = (p, value) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`);
};
const copy = (from, to) => {
  const bytes = fs.readFileSync(from);
  if (fs.existsSync(to)) {
    if (!fs.readFileSync(to).equals(bytes)) throw new Error(`Different existing bytes: ${to}`);
    return;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.writeFileSync(to, bytes, { mode: 0o644 });
};
const execute = (name, command, args) => {
  const out = spawnSync(command, args, { cwd: W, encoding: 'utf8', env: { ...process.env, PWDEBUG: '' } });
  fs.mkdirSync(R, { recursive: true });
  fs.writeFileSync(`${R}/${name}.stdout`, out.stdout || '');
  fs.writeFileSync(`${R}/${name}.stderr`, out.stderr || '');
  console.log(out.stdout || '');
  if (out.stderr) console.error(out.stderr);
  save(`${R}/${name}.json`, { cwd: W, command, argv: args, exitCode: out.status, error: out.error?.message });
  if (out.status !== 0) throw new Error(`${name} failed: ${out.status}`);
};

if (process.argv[2] === 'install') {
  const raw = `${N}/assembly-and-prepare-first18/files/n30-draft-first-18/artifacts/6-8g/lessons/${L}`;
  for (const f of ['lesson.json', 'lesson.md', 'exercises.json']) copy(`${raw}/${f}`, `${B}/lessons/${L}/${f}`);
  const pages = {
    '0138': `${B}/evidence/stemrobin188-6g-source137138/author-first04/files/source6g137138-author-first-04/artifacts/6-8g/pages/0138`,
    '0139': `${N}/errata-registration-and-binding18/files/n30-errata-bound-working-18/artifacts/6-8g/pages/0139`,
    '0140': `${B}/evidence/stemrobin188-6g-source139140/author-first04/files/source6g139140-author-first-04/artifacts/6-8g/pages/0140`,
    '0141': `${B}/evidence/stemrobin188-6g-source141142/author-first05/files/source6g141142-author-first-05/artifacts/6-8g/pages/0141`,
    '0142': `${B}/evidence/stemrobin188-6g-source141142/author-first05/files/source6g141142-author-first-05/artifacts/6-8g/pages/0142`,
  };
  for (const [page, from] of Object.entries(pages)) {
    for (const file of ['page.json', 'page.md', 'audit.json']) {
      if (fs.existsSync(`${from}/${file}`)) copy(`${from}/${file}`, `${B}/pages/${page}/${file}`);
    }
  }
  const modern = `${N}/errata-registration-and-binding18/files/n30-errata-bound-working-18/work/adapt/6-8g/modern-us-neutral/lessons/${L}`;
  copy(`${modern}/lesson.template.json`, `${T}/lesson.template.json`);
  copy(`${N}/text-author-first18/files/n30-text-author-first-18/exercises.template.json`, `${T}/exercises.template.json`);
  copy(`${N}/assembly-and-prepare-first18/files/n30-draft-first-18/work/adapt/6-8g/modern-us-neutral/lessons/${L}/figures.template.json`, `${T}/figures.template.json`);
  const approved = `${N}/answer378-exact-approved-replacement19/files/n30-content-review-collection-19/answer-keys.approved-exact378-replacement.json`;
  copy(approved, `${E}/lessons/${L}/answer-keys.json`);
  const collection = read(`${N}/answer378-exact-approved-replacement19/files/n30-content-review-collection-19/collection.json`);
  const keys = read(approved);
  for (const replacement of collection.appliedReplacements) {
    const field = replacement.jsonTarget.split('/').at(-1);
    if (keys.answers.find(a => a.exercise === replacement.exercise)[field] !== replacement.proposedValue) {
      throw new Error(`Approved exact replacement mismatch: ${field}`);
    }
  }
  for (const group of ['190191', '192193']) {
    for (const id of group === '190191' ? ['fig-190', 'fig-191'] : ['fig-192', 'fig-193']) {
      const spec = read(`${N}/four-figure-metadata-rebindings18/files/n30-fig${group}-bound-candidates-18/${id}/${id}.spec.json`);
      copy(spec.source.image.path, `${B}/figures/${id}.png`);
    }
  }
  save(`${R}/installation.json`, {
    lesson: L, source: raw, sourceHashes: ['lesson.json', 'exercises.json'].map(file => ({ file, sha256: hash(fs.readFileSync(`${raw}/${file}`)) })),
    answerKeysSha256: hash(fs.readFileSync(approved)), exactReplacements: collection.changedFieldsOnly,
    reusedSubstantiveReview: true, sourceReplays: 0, imageLoads: 0, finalized: false, published: false,
  });
} else if (process.argv[2] === 'answers') {
  execute('answer-finalize-first7', 'python3', ['.claude/skills/ld-s10y-answer/tools/lesson_answers.py', 'finalize', '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', L]);
} else if (process.argv[2] === 'promote') {
  const [group, reviewPath] = process.argv.slice(3);
  if (!['190191', '192193'].includes(group) || !fs.existsSync(reviewPath)) throw new Error('Missing substantive review evidence');
  const ids = group === '190191' ? ['fig-190', 'fig-191'] : ['fig-192', 'fig-193'];
  for (const id of ids) {
    const bound = `${N}/four-figure-metadata-rebindings18/files/n30-fig${group}-bound-candidates-18/${id}`;
    const sourceSvg = group === '190191'
      ? `${N}/fig190191-author-first18/files/n30-fig190191-author-first-18/figures/${id}.svg`
      : `${N}/fig192193-author-first18/files/n30-fig192193-author-first-18/${id}/${id}.svg`;
    copy(`${bound}/${id}.spec.json`, `${E}/figures/${id}.spec.json`);
    copy(sourceSvg, `${E}/figures/${id}.svg`);
    const render = read(`${bound}/${id}.render.json`);
    if (render.output.svg.sha256 !== hash(fs.readFileSync(sourceSvg))) throw new Error(`Changed approved SVG: ${id}`);
    render.spec.path = `${E}/figures/${id}.spec.json`;
    render.output.svg.path = `${E}/figures/${id}.svg`;
    save(`${E}/figures/${id}.render.json`, render);
    execute(`record-review-${id}-first7`, 'python3', [
      '.agents/skills/ld-s10y-image/scripts/record_review.py',
      '--spec', `${E}/figures/${id}.spec.json`, '--render', `${E}/figures/${id}.render.json`,
      '--output', `${E}/figures/${id}.review.json`, '--status', 'pass',
      '--notes', `Substantive independent source/mathematics/culture/visual review: ${reviewPath}, SHA256 ${hash(fs.readFileSync(reviewPath))}. Original source uncertainty and prior failures retained. Only output metadata paths relocated; source, spec and SVG unchanged. This records existing review, not a new image inspection or renderer run.`,
    ]);
  }
  const figures = read(`${T}/figures.template.json`);
  for (const figure of figures.figures.filter(f => ids.includes(f.id))) {
    figure.svg = `figures/${figure.id}.svg`;
    figure.render = `figures/${figure.id}.render.json`;
    figure.review = `figures/${figure.id}.review.json`;
  }
  save(`${T}/figures.template.json`, figures);
} else if (process.argv[2] === 'modern') {
  execute(`modern-finalize-${process.argv[3] || 'first7'}`, '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-finalize',
    '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', L,
  ]);
} else if (process.argv[2] === 'render') {
  execute('render-first7', '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render',
    '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', L,
  ]);
} else {
  throw new Error('Select install, promote, modern, answers or render');
}
