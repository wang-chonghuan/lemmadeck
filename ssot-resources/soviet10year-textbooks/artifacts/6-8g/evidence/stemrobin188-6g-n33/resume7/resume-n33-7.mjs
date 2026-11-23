import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const B = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g';
const L = 'geo68-c3-s1-n33';
const N = `${B}/evidence/stemrobin188-6g-n33`;
const E = `${B}/editions/modern-us-neutral`;
const T = `.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/${L}`;
const R = `${N}/resume7`;
const P = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
};
const copy = (from, to) => {
  if (fs.existsSync(to)) {
    assert.ok(fs.readFileSync(from).equals(fs.readFileSync(to)), `Different existing bytes: ${to}`);
    return;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(to, 0o644);
};
const execute = (name, command, args) => {
  const out = spawnSync(command, args, {
    cwd: W, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', PWDEBUG: '' },
  });
  fs.mkdirSync(R, { recursive: true });
  for (const kind of ['stdout', 'stderr'])
    fs.writeFileSync(`${R}/${name}.${kind}`, out[kind] || '', { flag: 'wx' });
  save(`${R}/${name}.json`, { cwd: W, command, argv: args, exitCode: out.status, error: out.error?.message });
  console.log(out.stdout || '');
  if (out.stderr) console.error(out.stderr);
  assert.equal(out.status, 0, `${name} failed`);
};

if (process.argv[2] === 'install') {
  const preparation = `${N}/preparation-recovery7`;
  const raw = `${preparation}/artifacts/6-8g/lessons/${L}`;
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
    copy(`${raw}/${name}`, `${B}/lessons/${L}/${name}`);
  const pages = read(`${preparation}/manifest.json`).sourcePageLinks;
  for (const page of pages) {
    assert.equal(hash(page.path), page.sha256);
    const target = `${B}/pages/${String(page.physical).padStart(4, '0')}`;
    copy(page.path, `${target}/page.json`);
    for (const name of ['page.md', 'audit.json']) {
      const from = path.join(path.dirname(page.path), name);
      if (fs.existsSync(from)) copy(from, `${target}/${name}`);
    }
  }
  execute(`faithful-page-md-${process.argv[3] || 'first7'}`, P, ['-B', '-c', String.raw`
import json,sys
from pathlib import Path
sys.path.insert(0,sys.argv[1])
import blocks
root=Path(sys.argv[2])
for number in [149,155,156,157,158,159]:
    directory=root/"pages"/f"{number:04d}"
    data=json.loads((directory/"page.json").read_text())
    serialized=[{key:value for key,value in item.items() if key!="id"} for item in data["blocks"]]
    if (directory/"page.md").exists():
        meta,items=blocks.parse((directory/"page.md").read_text())
        assert items==serialized,number
    else:
        md=blocks.dump(data["meta"],data["blocks"],number)
        meta,items=blocks.parse(md)
        assert meta==data["meta"] and items==serialized,number
        (directory/"page.md").write_text(md)
print(json.dumps({"faithfulBlocksUnchanged":True,"pages":6,"sourceFinalizerReplays":0}))
`, path.resolve('.claude/skills/ld-s10y-lesson/tools'), path.resolve(B)]);
  for (const id of [209, 210, 211, 212])
    copy(`${N}/preparation7/artifacts/6-8g/figures/fig-${id}.png`, `${B}/figures/fig-${id}.png`);
  execute('raw-reindex', P, ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'reindex', '--book', '6-8g', '--toc', 'ssot-resources/soviet10year-textbooks/toc/6-8g/zh.json']);
  save(`${R}/installation.json`, {
    lesson: L, rawSource: raw, pages: pages.map(p => p.physical),
    figures: [209, 210, 211, 212], sourceTextChanges: 0,
    sourceFinalizerReplays: 0, imagesLoaded: 0, published: false,
  });
} else if (process.argv[2] === 'modern') {
  execute(`modern-finalize-${process.argv[3] || 'first7'}`, P,
    ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-finalize',
      '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', L]);
} else if (process.argv[2] === 'answers') {
  execute('answer-finalize-first7', 'python3',
    ['.claude/skills/ld-s10y-answer/tools/lesson_answers.py', 'finalize',
      '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', L]);
} else if (process.argv[2] === 'render') {
  execute('render-first7', P, ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render',
    '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', L]);
} else if (process.argv[2] === 'choice-view') {
  const source = '.intentfold/tickets/STEMROBIN-188/tmp/n33-choices7';
  const view = { questions: read(`${source}/draft.json`).questions.map(({ id, view }) => ({ id, view })) };
  const target = `${source}/view-only.json`;
  assert.ok(!fs.existsSync(target));
  save(target, view);
  fs.chmodSync(target, 0o444);
  console.log(JSON.stringify({ path: target, sha256: hash(target), authorKeysIncluded: false }));
} else if (process.argv[2] === 'choice-repair-copy') {
  const source = '.intentfold/tickets/STEMROBIN-188/tmp/n33-choices7';
  copy(`${source}/draft.json`, `${source}/draft.before-equivalence-recovery7.json`);
  fs.chmodSync(`${source}/draft.before-equivalence-recovery7.json`, 0o444);
  copy(`${source}/draft.json`, `${source}/draft.recovery7.json`);
  console.log(JSON.stringify({ originalDraftPreserved: true, originalDraftSha256: hash(`${source}/draft.json`) }));
} else if (process.argv[2] === 'choice-repair-view') {
  const source = '.intentfold/tickets/STEMROBIN-188/tmp/n33-choices7';
  const before = read(`${source}/draft.before-equivalence-recovery7.json`);
  const after = read(`${source}/draft.recovery7.json`);
  assert.deepEqual(before.questions.slice(1), after.questions.slice(1));
  const view = { questions: after.questions.map(({ id, view }) => ({ id, view })) };
  const target = `${source}/view-only.recovery7.json`;
  assert.ok(!fs.existsSync(target));
  save(target, view);
  fs.chmodSync(target, 0o444);
  console.log(JSON.stringify({ path: target, sha256: hash(target), authorKeysIncluded: false,
    otherQuestionsUnchanged: 3 }));
} else if (process.argv[2] === 'choice-repair-validate') {
  const source = '.intentfold/tickets/STEMROBIN-188/tmp/n33-choices7';
  execute('choice-structural-recovery7', 'python3', [
    '.agents/skills/ld-s10y-choice/scripts/validate.py', '--repo', '.',
    '--seed', `${source}/seed.json`, '--draft', `${source}/draft.recovery7.json`,
  ]);
} else if (process.argv[2] === 'choices') {
  const source = '.intentfold/tickets/STEMROBIN-188/tmp/n33-choices7';
  const review = '.intentfold/tickets/STEMROBIN-188/tmp/n33-choice-independent7/review.json';
  assert.equal(read(review).outcome, 'pass');
  assert.ok(fs.readFileSync(`${source}/draft.json`).equals(
    fs.readFileSync(`${source}/draft.before-equivalence-recovery7.json`)));
  fs.copyFileSync(`${source}/draft.recovery7.json`, `${source}/draft.json`);
  copy(review, `${source}/review.json`);
  execute('choice-retain-first7', P, ['-B', '.claude/skills/ld-s10y-lesson/tools/retain_choices.py',
    '--repo', '.', '--book', '6-8g', '--lesson', L, '--source', source]);
  for (const [from, to] of [
    [source, `${N}/choices-author7`],
    ['.intentfold/tickets/STEMROBIN-188/tmp/n33-choice-independent7', `${N}/choices-independent7`],
  ]) {
    assert.ok(!fs.existsSync(to), `Existing retained choice evidence: ${to}`);
    fs.cpSync(from, to, { recursive: true, errorOnExist: true });
  }
} else {
  throw new Error('Select install, modern, answers, render, choice-view or choices');
}
