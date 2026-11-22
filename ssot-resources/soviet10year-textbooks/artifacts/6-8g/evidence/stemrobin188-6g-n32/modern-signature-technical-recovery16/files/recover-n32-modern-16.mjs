import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

const own = path.join(tmp, 'n32-modern-technical-recovery-16')
assert.ok(!fs.existsSync(own))
fs.mkdirSync(own)
const working = path.join(tmp, 'n32-finalize-working-inputs-15')
const firstFile = path.join(working, 'native/modern/execution.json')
const first = read(firstFile)
assert.equal(first.exitCode, 2)
const book = path.join(working, 'artifacts/6-8g')
const target = path.join(book, 'editions/modern-us-neutral/lessons/geo68-c3-s1-n32')
assert.deepEqual(fs.readdirSync(target), ['adaptation.audit.json'])
const auditSnapshot = path.join(own, 'adaptation.FIRST-failed.audit.json')
fs.copyFileSync(path.join(target, 'adaptation.audit.json'), auditSnapshot, fs.constants.COPYFILE_EXCL)
fs.chmodSync(auditSnapshot, 0o444)

const codeFile = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/edition.py')
const currentCode = fs.readFileSync(codeFile, 'utf8')
const currentHelper = currentCode.slice(
  currentCode.indexOf('def numbered_subpart_markers('),
  currentCode.indexOf('    if len(markers) < 2:\n        return text\n    order = marker_order(markers)', currentCode.indexOf('def normalize_numbered_subparts(')),
)
assert.ok(currentHelper.startsWith('def numbered_subpart_markers('))
const originalHelper = `def normalize_numbered_subparts(text: str) -> str:
    """Sort a complete numeric or lettered sequence and line-break its parts."""
    if not isinstance(text, str):
        return text
    text = re.sub(r"^(\\s*\\d+\\.)\\s*(?=1[)）])", r"\\1\\n", text)
    masked_text = masked_math(text)
    depths = nesting_depths(masked_text)
    markers = [
        marker
        for marker in PART_MARKER.finditer(masked_text)
        if depths[marker.start()] == 0
        and (
            not marker.group("open")
            or (marker.group("open"), marker.group("close")) in {("(", ")"), ("（", "）")}
        )
        and not re.search(r"图\\s*$", masked_text[max(0, marker.start() - 3):marker.start()])
    ]
`
const currentCanonical = '    canonical_source = canonical_subpart_labels(normalize_numbered_subparts(source))\n    canonical_modern = canonical_subpart_labels(normalize_numbered_subparts(modern))'
assert.equal(currentCode.split(currentCanonical).length, 2)
const beforeCode = currentCode.replace(currentHelper, originalHelper).replace(currentCanonical,
  '    canonical_source = normalize_numbered_subparts(source)\n    canonical_modern = normalize_numbered_subparts(modern)')
const beforeFile = path.join(own, 'edition.before-this-patch.reconstructed.py')
fs.writeFileSync(beforeFile, beforeCode, { flag: 'wx' })
fs.chmodSync(beforeFile, 0o444)
const currentSnapshot = path.join(own, 'edition.after-this-patch.py')
fs.writeFileSync(currentSnapshot, currentCode, { flag: 'wx' })
fs.chmodSync(currentSnapshot, 0o444)
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const run = (directory, name, argv, inputs) => {
  fs.mkdirSync(directory, { recursive: true })
  const startedAt = new Date().toISOString()
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const streams = {}
  for (const stream of ['stdout', 'stderr']) {
    const file = path.join(directory, `${name === 'execution' ? '' : name + '.'}${stream}`)
    fs.writeFileSync(file, result[stream] ?? '', { flag: 'wx' })
    streams[stream] = bind(file)
  }
  const file = path.join(directory, `${name}.json`)
  save(file, { cwd: repo, argv, startedAt, endedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, streams, inputs,
    parentImageLoads: 0, wholeLessonApproved: false, published: false })
  console.log(JSON.stringify({ name, exitCode: result.status, receipt: bind(file),
    stdout: result.stdout, stderr: result.stderr }))
  return result
}
const priorTest = run(own, 'before-existing-prose-test.execution',
  [python, '-B', '-c',
    'import sys,importlib.util,unittest; sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools"); sys.path.insert(0,".claude/skills/ld-s10y-lesson/tests"); import test_edition; spec=importlib.util.spec_from_file_location("edition_before",sys.argv[1]); old=importlib.util.module_from_spec(spec); spec.loader.exec_module(old); test_edition.edition=old; result=unittest.TextTestRunner().run(unittest.TestSuite([test_edition.EditionTest("test_prose_is_line_broken_at_sentences_and_introduced_formulas")])); sys.exit(not result.wasSuccessful())',
    beforeFile], [bind(beforeFile)])
assert.equal(priorTest.status, 1, 'Unexpected pre-patch outcome requires diagnosis.')
const wrapper = path.join(tmp, 'run-n32-scoped-native-15.mjs')
const oldWrapper = fs.readFileSync(wrapper, 'utf8')
const oldGuard = "read(path.join(native, 'modern/execution.json')).exitCode"
assert.equal(oldWrapper.split(oldGuard).length, 2)
const downstreamFile = path.join(own, 'run-n32-scoped-native.after-modern-recovery.mjs')
const downstream = oldWrapper.replace(oldGuard,
  "read(path.join(native, 'modern-recovery1/execution.json')).exitCode")
const importPrefix = "from './"
assert.equal(downstream.split(importPrefix).length, 3)
fs.writeFileSync(downstreamFile, downstream.replaceAll(importPrefix, "from '../"), { flag: 'wx' })
const stageDir = path.join(working, 'native/modern-recovery1')
assert.ok(!fs.existsSync(stageDir))
const inputs = first.inputs.map(item => {
  assert.equal(hash(item.path), item.sha256, item.path)
  return item
})
const result = run(stageDir, 'execution', first.argv, inputs)
save(path.join(own, 'recovery.json'), {
  status: result.status === 0 ? 'N32_MODERN_NATIVE_RECOVERED_AFTER_SUBPART_LABEL_ROLE_FIX'
    : 'N32_MODERN_RECOVERY_FAILED_DEPENDENT_STAGES_STOPPED',
  firstFailure: bind(firstFile), firstFailureAudit: bind(auditSnapshot),
  recovery: bind(path.join(stageDir, 'execution.json')),
  oldCodeReconstructedByInvertingOnlyThisPatch: bind(beforeFile),
  currentCodeSnapshot: bind(currentSnapshot), downstreamWrapper: bind(downstreamFile),
  priorUnrelatedProseFailureReproduced: true,
  templatesFiguresAnswersAndSourceUnchanged: true,
  newContentRevisions: 0, producerReplaysOfPassedStages: 0,
  parentImageLoads: 0, wholeLessonApproved: false, published: false,
})
process.exitCode = result.status ?? 1
