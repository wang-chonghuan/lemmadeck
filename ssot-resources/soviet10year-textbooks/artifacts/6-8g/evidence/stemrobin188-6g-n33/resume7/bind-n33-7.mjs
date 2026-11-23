import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const B = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g';
const E = `${B}/editions/modern-us-neutral`;
const L = 'geo68-c3-s1-n33';
const N = `${B}/evidence/stemrobin188-6g-n33`;
const R = `${N}/resume7`;
const T = `.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/${L}`;
const P = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
};
const copy = (from, to) => {
  if (fs.existsSync(to)) {
    assert.ok(fs.readFileSync(from).equals(fs.readFileSync(to)), `Different retained bytes: ${to}`);
    return;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(to, fs.statSync(from).mode & 0o777);
};
const execute = (name, command, args) => {
  const result = spawnSync(command, args, {
    cwd: W, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', PWDEBUG: '' },
  });
  for (const kind of ['stdout', 'stderr'])
    fs.writeFileSync(`${R}/${name}.${kind}`, result[kind] || '', { flag: 'wx' });
  save(`${R}/${name}.json`, { cwd: W, command, argv: args, exitCode: result.status });
  console.log(result.stdout || '');
  if (result.stderr) console.error(result.stderr);
  assert.equal(result.status, 0, `${name} failed`);
};

if (process.argv[2] === 'content') {
  const independent = '.intentfold/tickets/STEMROBIN-188/tmp/n33-content-independent7';
  const approvalFile = `${N}/content-independent7/approval.json`;
  assert.equal(hash(`${independent}/approval.json`), '2367df111a70419c4f90dfb1d6d341a344bcc82a9fca10a6ae607283c3de767c');
  for (const name of ['SOURCE-FIRST.md', 'CANDIDATE-COMPARISON.md', 'approval.json']) {
    assert.equal(fs.statSync(`${independent}/${name}`).mode & 0o777, 0o444);
    copy(`${independent}/${name}`, `${N}/content-independent7/${name}`);
  }
  const approval = read(approvalFile);
  assert.equal(approval.textWithApprovedCorrections, 'approved-for-source-math-content-only');
  assert.equal(approval.approvedCorrections.length, 3);
  assert.equal(approval.approvedAnswers.length, 5);
  assert.deepEqual(approval.answerReplacements, []);
  for (const binding of Object.values(approval.candidateBindings))
    assert.equal(hash(binding.path), binding.sha256);
  execute('metadata-only-errata-registration', P, ['-B', '-c', String.raw`
import json,sys,copy
from pathlib import Path
sys.path.insert(0,sys.argv[1])
import blocks,p2c
root,approval_file=map(Path,sys.argv[2:])
approval=json.loads(approval_file.read_text())
changed=[]
for correction in approval["approvedCorrections"]:
    number=int(correction["block"].split("#")[0][1:])
    directory=root/"pages"/f"{number:04d}"
    page_file=directory/"page.json"
    original=json.loads(page_file.read_text())
    source=json.loads(Path(correction["sourcePage"]["path"]).read_text())
    assert original==source,number
    old_meta,old_blocks=blocks.parse((directory/"page.md").read_text())
    candidate=copy.deepcopy(original)
    assert not candidate["meta"].get("errata"),number
    candidate["meta"]["errata"]=[{
        "id":correction["id"],"block":correction["block"],"original":correction["original"],
        "reason":correction["rationale"]
    }]
    restored=copy.deepcopy(candidate)
    restored["meta"]["errata"]=original["meta"].get("errata",[])
    if "errata" not in original["meta"]:
        del restored["meta"]["errata"]
    assert restored==original,number
    errors=p2c._validate_page_errata(candidate["meta"],candidate["blocks"],number)
    assert not errors,errors
    md=blocks.dump(candidate["meta"],candidate["blocks"],number)
    new_meta,new_blocks=blocks.parse(md)
    assert new_meta==candidate["meta"] and new_blocks==old_blocks,number
    page_file.write_text(json.dumps(candidate,ensure_ascii=False,indent=2)+"\n")
    (directory/"page.md").write_text(md)
    changed.append(correction["block"])
print(json.dumps({"nativeErrataValidation":"PASS","unchangedFaithfulBlocks":True,
 "registered":changed,"sourceFinalizerReplays":0}))
`, path.resolve('.claude/skills/ld-s10y-lesson/tools'), path.resolve(B), path.resolve(approvalFile)]);
  execute('affected-adapt-prepare', P, ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'adapt-prepare', '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', L]);
  copy(`${T}/lesson.template.json`, `${R}/lesson.native-bound-errata.json`);
  const native = read(`${T}/lesson.template.json`);
  const candidate = read(`${N}/text-author7/lesson.template.json`);
  assert.deepEqual(candidate.source, native.source);
  assert.equal(native.errata.length, 3);
  candidate.errata = native.errata.map(item => {
    const correction = approval.approvedCorrections.find(c => c.id === item.id);
    assert.ok(correction);
    assert.equal(item.source.block, correction.block);
    assert.equal(item.original, correction.original);
    const index = Number(correction.target.pointer.split('/')[2]);
    assert.equal(item.target, `lesson.prose[${index}]`);
    const block = candidate.prose[index];
    assert.equal(block.text.split(correction.target.original).length, 2);
    block.text = block.text.replace(correction.target.original, correction.corrected);
    block.changes = [...new Set([...block.changes, 'math-correction'])];
    return { ...item, corrected: correction.corrected };
  });
  assert.deepEqual(candidate.source, native.source);
  save(`${T}/lesson.template.json`, candidate);
  const exercises = read(`${N}/text-author7/exercises.template.json`);
  assert.deepEqual(exercises.source, read(`${T}/exercises.template.json`).source);
  save(`${T}/exercises.template.json`, exercises);
  copy(`${N}/answers-author7/candidate-answer-keys.json`, `${E}/lessons/${L}/answer-keys.json`);
  fs.chmodSync(`${E}/lessons/${L}/answer-keys.json`, 0o644);
  save(`${R}/content-binding.json`, {
    approval: { path: approvalFile, sha256: hash(approvalFile) },
    appliedExactCorrections: approval.approvedCorrections.map(c => ({ id: c.id, block: c.block, target: c.target.pointer })),
    approvedAnswersUnchanged: ['441', '442', '443', '444', '445'],
    candidate: { path: `${T}/lesson.template.json`, sha256: hash(`${T}/lesson.template.json`) },
    sourceTextChanges: 0, imageLoads: 0, sourceFinalizerReplays: 0,
    sourceMathContentApproved: true, figuresPending: true, finalized: false, published: false,
  });
} else if (process.argv[2] === 'figures') {
  const candidate = read(`${T}/lesson.template.json`);
  const inputs = {
    209: { stem: `${N}/fig209210-author7/fig-209`, spec: 'spec.json', render: 'render.json', index: 0 },
    210: { stem: `${N}/fig209210-author7/fig-210`, spec: 'spec.json', render: 'render.json', index: 5 },
    211: { stem: `${N}/fig211212-author7/fig-211/candidate-2`, spec: 'spec.json', render: 'render.json', index: 7, directory: true },
    212: { stem: `${N}/fig211212-author7/fig-212/candidate-1`, spec: 'spec.json', render: 'render.json', index: 13, directory: true },
  };
  const bindings = [];
  for (const [number, input] of Object.entries(inputs)) {
    const id = `fig-${number}`;
    const specFile = input.directory ? `${input.stem}/${input.spec}` : `${input.stem}.${input.spec}`;
    const renderFile = input.directory ? `${input.stem}/${input.render}` : `${input.stem}.${input.render}`;
    const svgFile = input.directory ? `${input.stem}/${id}.svg` : `${input.stem}.svg`;
    const spec = read(specFile);
    const originalSpec = structuredClone(spec);
    assert.equal(spec.source.image.sha256, hash(`${B}/figures/${id}.png`));
    spec.source.image.path = `${B}/figures/${id}.png`;
    spec.source.authoritativeText = [{ lesson: L, text: candidate.prose[input.index].text }];
    const restored = structuredClone(spec);
    restored.source.image.path = originalSpec.source.image.path;
    restored.source.authoritativeText = originalSpec.source.authoritativeText;
    assert.deepEqual(restored, originalSpec);
    const boundSpec = `${R}/figure-bindings/${id}.spec.json`;
    save(boundSpec, spec);
    const render = read(renderFile);
    assert.equal(render.spec.sha256, hash(specFile));
    assert.equal(render.output.svg.sha256, hash(svgFile));
    render.spec = { path: `${E}/figures/${id}.spec.json`, sha256: hash(boundSpec) };
    render.output.svg.path = `${E}/figures/${id}.svg`;
    const boundRender = `${R}/figure-bindings/${id}.render.json`;
    save(boundRender, render);
    bindings.push({ id, originalSpec: specFile, boundSpec, boundRender, svg: svgFile,
      sourceText: `lesson.prose[${input.index}]`, geometryChanges: 0, rendererReplays: 0 });
  }
  save(`${R}/figure-bindings/bindings.json`, { bindings, imageLoads: 0, independentReviewPending: true });
} else if (process.argv[2] === 'promote') {
  const [group, report] = process.argv.slice(3);
  assert.ok(['209210', '211212'].includes(group) && fs.existsSync(report));
  assert.equal(read(report).status, 'pass');
  const rows = read(`${R}/figure-bindings/bindings.json`).bindings;
  const ids = group === '209210' ? ['fig-209', 'fig-210'] : ['fig-211', 'fig-212'];
  const figures = read(`${T}/figures.template.json`);
  for (const row of rows.filter(item => ids.includes(item.id))) {
    copy(row.boundSpec, `${E}/figures/${row.id}.spec.json`);
    copy(row.boundRender, `${E}/figures/${row.id}.render.json`);
    copy(row.svg, `${E}/figures/${row.id}.svg`);
    execute(`record-review-${row.id}`, 'python3', ['.agents/skills/ld-s10y-image/scripts/record_review.py',
      '--spec', `${E}/figures/${row.id}.spec.json`, '--render', `${E}/figures/${row.id}.render.json`,
      '--output', `${E}/figures/${row.id}.review.json`, '--status', 'pass',
      '--notes', `Independent source-first/current-text/visual review ${report}, SHA256 ${hash(report)}. Geometry unchanged; metadata-only rebinding is explicit. Historical uncertainty and author failures remain retained.`]);
    Object.assign(figures.figures.find(item => item.id === row.id), {
      svg: `figures/${row.id}.svg`, render: `figures/${row.id}.render.json`, review: `figures/${row.id}.review.json`,
    });
  }
  save(`${T}/figures.template.json`, figures);
} else {
  throw new Error('Select content, figures or promote');
}
