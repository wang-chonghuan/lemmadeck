import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, bind, save } from './retain-scoped-evidence-02.mjs'

const revision = process.argv[2] ? Number(process.argv[2]) : 2
assert.ok([2, 3].includes(revision))
const own = path.join(tmp, `n32-subpart-signature-repair${revision}-16`)
assert.ok(!fs.existsSync(own))
fs.mkdirSync(own)
const codeFile = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/edition.py')
const snapshotFile = path.join(own, `edition.repair${revision}.py`)
fs.copyFileSync(codeFile, snapshotFile, fs.constants.COPYFILE_EXCL)
fs.chmodSync(snapshotFile, 0o444)
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const template = path.join(tmp,
  'n32-finalize-working-inputs-15/work/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s1-n32/exercises.template.json')
const run = (name, argv) => {
  const startedAt = new Date().toISOString()
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const streams = {}
  for (const stream of ['stdout', 'stderr']) {
    const file = path.join(own, `${name}.${stream}`)
    fs.writeFileSync(file, result[stream] ?? '', { flag: 'wx' })
    streams[stream] = bind(file)
  }
  const receipt = path.join(own, `${name}.execution.json`)
  save(receipt, { cwd: repo, argv, startedAt, endedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, streams, currentCode: bind(snapshotFile) })
  console.log(JSON.stringify({ name, exitCode: result.status, receipt: bind(receipt),
    stdout: result.stdout, stderr: result.stderr }))
  assert.equal(result.status, 0, result.stderr || result.stdout)
  return bind(receipt)
}
const tests = run(`${revision === 2 ? 'eleven' : 'sixteen'}-affected-regressions`, [python, '-B',
  '.claude/skills/ld-s10y-lesson/tests/test_subpart_label_signature.py'])
const sourceContract = run('unchanged-written438-signature', [python, '-B', '-c',
  'import json,sys;sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools");import edition;e=json.load(open(sys.argv[1]))["exercises"][6];assert e["number"]=="438";s=edition.structural_subpart_markers(e["source_text"]);m=edition.structural_subpart_markers(e["text"]);assert len(s)==len(m)==10;errors=edition.validate_text(e["source_text"],e["text"],e["changes"],e["numeric_changes"],"written438",[]);print(json.dumps({"sourceLabels":len(s),"modernLabels":len(m),"sourceDataNumbers":edition.number_signature(edition.canonical_subpart_labels(e["source_text"])),"modernDataNumbers":edition.number_signature(edition.canonical_subpart_labels(e["text"])),"errors":errors},ensure_ascii=False));assert errors==[]',
  template])
save(path.join(own, 'record.json'), {
  status: `SUBPART_SIGNATURE_REPAIR${revision}_TARGETED_TESTS_PASS_INDEPENDENT_REVIEW_PENDING`,
  currentCode: bind(snapshotFile), tests, sourceContract, unchangedExercise: bind(template),
  priorRejectedCode: bind(path.join(tmp, revision === 2
    ? 'n32-modern-technical-recovery-16/edition.after-this-patch.py'
    : 'n32-subpart-signature-repair2-16/edition.repair2.py')),
  priorRejectedReview: bind(path.join(tmp, revision === 2
    ? 'n32-subpart-validator-technical-review-16/manifest.json'
    : 'n32-repair2-and-four-surfaces-independent-review-16/manifest.json')),
  labelsCheckedSeparatelyFromProblemData: true, numericCanonicalLabelsRemoved: true,
  noNativeRendererEditorReplay: true, currentOutputsAndSeedUnchanged: true,
  cumulativeTechnicalCodeRevisions: revision, newContentRevisions: 0,
  parentImageLoads: 0, wholeLessonApproved: false, published: false,
})
