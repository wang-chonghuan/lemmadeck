import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const ticket = '.intentfold/tickets/STEMROBIN-181';
const output = `${ticket}/tmp/d1816-d270-source48-51-native-recovery`;
const root = '.tmp/STEMROBIN-181/d1816-d270/root';
const work = '.tmp/STEMROBIN-181/d1816-d270/source-work';
const previousRoot = '.tmp/STEMROBIN-181/d1816-d268/root';
const previousWork = '.tmp/STEMROBIN-181/d1816-d268/source-work';
const firstFile = `${ticket}/tmp/d1816-d268-source48-51-native/result.json`;
const first = JSON.parse(fs.readFileSync(firstFile));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (name, data) => {
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(`${output}/${name}`, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
};
assert.equal(first.firstFailure.name, 'd268-source49-first-finalize');

if (process.argv[2] === 'prepare') {
  assert(!fs.existsSync(root));
  fs.cpSync(previousRoot, root, { recursive: true, dereference: false });
  for (const page of [48, 49, 50, 51]) {
    const directory = `10p/pages/${String(page).padStart(4, '0')}`;
    fs.mkdirSync(`${work}/${directory}`, { recursive: true });
    for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
      fs.symlinkSync(path.resolve(`${previousWork}/${directory}/${name}`), `${work}/${directory}/${name}`);
    }
  }
  save('prepared.json', { root, work, firstFailure: bind(firstFile),
    source48PassedReceiptReused: first.stages.find(stage => stage.name === 'd268-source48-first-finalize'),
    reason: 'Keep original native failure and outputs unchanged. Recover only caption counting and figure25 padding; source48 is not finalized again.',
    candidate49Before: bind(`${root}/10p/pages/0049/page.md`),
  });
  console.log(JSON.stringify({ prepared: bind(`${output}/prepared.json`), root, work }));
} else {
  assert.equal(process.argv[2], 'run');
  assert(fs.existsSync(`${output}/prepared.json`));
  assert(!fs.existsSync(`${output}/result.json`));
  const stages = [];
  let firstFailure = null;
  const native = (name, command, extra = []) => {
    try {
      execFileSync(process.execPath, [
        `${ticket}/tmp/d1816-recovery/run-native.mjs`, name,
        '.claude/skills/ld-s10y-lesson/.venv/bin/python',
        '.claude/skills/ld-s10y-lesson/tools/p2c.py', command,
        '--book', '10p', '--root', root, '--work', work, ...extra,
      ], { cwd: repo, stdio: 'inherit' });
      stages.push({ name, command, status: 'pass',
        receipt: bind(`${ticket}/tmp/d1816-recovery/native/${name}/receipt.json`) });
    } catch (error) {
      firstFailure = { name, command, exitCode: error.status,
        receipt: bind(`${ticket}/tmp/d1816-recovery/native/${name}/receipt.json`) };
      stages.push({ ...firstFailure, status: 'fail' });
    }
  };
  for (const page of [49, 50, 51]) {
    native(`d270-source${page}-${page === 49 ? 'caption-recovery' : 'first'}-finalize`,
      'finalize', ['--page', String(page)]);
    if (firstFailure) break;
  }
  for (const [name, command, args] of [
    ['d270-source48-53-first-assemble', 'assemble',
      ['--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json']],
    ['d270-source48-51-first-vectorize', 'vectorize', []],
    ['d270-source48-53-after-vectorize-assemble', 'assemble',
      ['--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json']],
  ]) {
    if (firstFailure) break;
    native(name, command, args);
  }
  const indexFile = `${root}/10p/book.json`;
  const index = fs.existsSync(indexFile) ? JSON.parse(fs.readFileSync(indexFile)) : null;
  save('result.json', { batch: 'D270', book: '10p', root, work, stages, firstFailure,
    status: firstFailure ? 'native-failure' : 'native-pass-review-pending',
    originalNativeFailure: bind(firstFile), source48NativePassReused: true,
    assembledCards: index?.lessons?.map(row => row.id) || [],
    sourceApproval: false, completeCoursesAdded: 0, canonicalPromotions: 0,
    paidCalls: 0, databaseWrites: false, formalHandoff: false,
  });
  console.log(JSON.stringify({ result: bind(`${output}/result.json`), firstFailure }));
}
