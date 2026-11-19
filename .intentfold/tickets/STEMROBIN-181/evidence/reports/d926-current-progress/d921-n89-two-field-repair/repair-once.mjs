import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const out = path.dirname(fileURLToPath(import.meta.url))
const first = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d916-n89-first-bilingual-text-author')
const tools = path.join(repo, '.claude/skills/ld-s10y-lesson/tools')
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const bind = f => ({ path: f, sha256: sha(f) })
const save = (name, value) => {
  const f = path.join(out, name)
  fs.mkdirSync(path.dirname(f), { recursive: true })
  fs.writeFileSync(f, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(f)
}
const originals = read(path.join(first, 'report.json')).candidate
if (process.argv[2] === 'prepare') {
  const inputs = [bind(path.join(first, 'report.json')), bind(path.join(first, 'author-freeze.json'))]
  save('prepare-started.json', { inputs, stage: 'WRITABLE-COPY-ONLY' })
  for (const locale of ['zh', 'en']) {
    for (const [field, name] of [['lesson', 'lesson.template.json'], ['exercises', 'exercises.template.json']]) {
      const source = path.join(first, locale, name)
      assert.equal(sha(source), originals[locale][field].sha256)
      const target = path.join(out, locale, name)
      fs.mkdirSync(path.dirname(target), { recursive: true })
      fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
      fs.chmodSync(target, 0o644)
      assert.equal(sha(target), sha(source))
      inputs.push(bind(source))
    }
  }
  save('prepared.json', { inputs, firstUnchanged: true })
  console.log('Writable n89 copies prepared; FIRST unchanged.')
} else if (['check', 'finish'].includes(process.argv[2])) {
  const finish = process.argv[2] === 'finish'
  if (finish) assert.ok(fs.existsSync(path.join(out, 'affected-failure.json')))
  const inputs = read(path.join(out, 'prepared.json')).inputs
  for (const b of inputs) assert.equal(sha(b.path), b.sha256)
  save(finish ? 'finish-started.json' : 'check-started.json', { stage: 'TWO-FIELD-AFFECTED-ONLY-ONCE',
    passedNativeStagesReplayed: false })
  const native = (name, executable, args, input) => {
    const r = spawnSync(executable, args, { cwd: repo, input, encoding: 'utf8',
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }, timeout: 60000 })
    save(`native/${name}.receipt.json`, { command: [executable, ...args], cwd: repo,
      exit: r.status, stdout: r.stdout, stderr: r.stderr, error: r.error?.message ?? null, affectedOnly: true })
    assert.equal(r.status, 0, r.stderr || r.stdout)
    return JSON.parse(r.stdout)
  }
  try {
    const candidates = {}
    const changes = []
    for (const locale of ['zh', 'en']) {
      const old = read(path.join(first, locale, 'lesson.template.json'))
      const current = read(path.join(out, locale, 'lesson.template.json'))
      const unchanged = structuredClone(current)
      unchanged.prose[6].text = old.prose[6].text
      assert.deepEqual(unchanged, old, 'Only prose[6].text may change')
      assert.notEqual(current.prose[6].text, old.prose[6].text)
      assert.equal(sha(path.join(out, locale, 'exercises.template.json')),
        sha(path.join(first, locale, 'exercises.template.json')))
      candidates[locale] = current
      changes.push({ locale, pointer: '/prose/6/text', sourceRefs: current.prose[6].source_refs,
        before: old.prose[6].text, after: current.prose[6].text })
    }
    const code = `
import copy, json, re, sys
from pathlib import Path
sys.path.insert(0, sys.argv[1])
import edition as e
import mathcheck
p = json.load(sys.stdin)
profile = e.load(Path(p["profile"]))
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
results = {}
for locale, d in p["candidates"].items():
    normalized = copy.deepcopy(d)
    e.normalize_lesson_layout(normalized)
    assert normalized == d
    b = d["prose"][6]
    errors = e.validate_text(b["source_text"],b["text"],b["changes"],b["numeric_changes"],
        f"{locale}.prose[6]",forbidden,b["historical_entities"],None,b.get("notation_changes"))
    errors += mathcheck.check_delimiters(b["text"])
    source_math = [m.group(0) for m in e.MATH.finditer(b["source_text"])]
    candidate_math = [m.group(0) for m in e.MATH.finditer(b["text"])]
    assert source_math == candidate_math
    assert candidate_math[-2:] == ["$ABC$","$AC$"]
    assert b["source_refs"] == ["p0237#7"]
    numbers = lambda s: re.findall(r"\\d+(?:\\.\\d+)?",e.MATH.sub("",s))
    assert numbers(b["source_text"]) == numbers(b["text"])
    assert b["numeric_changes"] == [] and not errors, errors
    results[locale] = {"status":"pass","sourceRefs":b["source_refs"],"mathTokens":candidate_math,"errors":errors}
print(json.dumps({"status":"pass","affected":results}))
`
    const text = finish
      ? JSON.parse(read(path.join(out, 'native/affected-text.receipt.json')).stdout)
      : native('affected-text', python, ['-B', '-c', code, tools], JSON.stringify({
        candidates, profile: path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'),
      }))
    assert.equal(text.status, 'pass')
    const previous = read(path.join(first, 'native-text-only-evidence.json'))
    for (const locale of ['zh', 'en']) {
      const flow = finish && locale === 'zh'
        ? JSON.parse(read(path.join(out, 'native/affected-flow-zh.receipt.json')).stdout)
        : native(`affected-flow-${locale}`, process.execPath,
          [path.join(tools, 'prose_flow.mjs'), '--json', path.join(out, locale, 'lesson.template.json')])
      const before = previous.lessons[locale].flow
      assert.deepEqual(flow.boundaries, before.boundaries)
      assert.equal(flow.paragraphs.length, before.paragraphs.length)
    }
    const katex = native('inserted-AC-katex', process.execPath, [path.join(tools, 'katex_check.js')],
      JSON.stringify(['zh', 'en'].map(locale => ({ id: `${locale}.prose[6].inserted-AC`,
        field: 'text', tex: 'AC', display: false }))))
    for (const b of inputs) assert.equal(sha(b.path), b.sha256)
    const changed = save('changed-fields.json', changes)
    const report = save('report.json', {
      schema: 'STEMROBIN-181/d921-affected-repair@1', ticket: 'STEMROBIN-181', card: 'phy10-c2-s3-n89',
      status: 'TWO-FIELD-AFFECTED-TEXT-FLOW-PASS-INDEPENDENT-SCI-ZHEN-PENDING',
      first: bind(path.join(first, 'report.json')), changedFields: changed, nativeText: text, katex,
      candidates: Object.fromEntries(['zh', 'en'].map(locale => [locale, {
        lesson: bind(path.join(out, locale, 'lesson.template.json')),
        exercises: bind(path.join(out, locale, 'exercises.template.json')),
      }])),
      nativeCalls: 4, reusedPassingCalls: finish ? 2 : 0, pendingFinishCalls: finish ? 2 : 0,
      executionFailure: finish ? bind(path.join(out, 'affected-failure.json')) : null,
      originalQuestions: 0, firstFailuresPreserved: true, nativeAuthorReplays: 0,
      independentApproval: false, completeCard: false, colourPlateIVAndModernFigureApproval: 'HOLD-NOT-WAIVED',
      usage: { parentImagesCumulative: 22, parentNewImages: 0, paidCalls: 0, tokens: null, costUsd: null },
      testsBuild: false, commitPush: false, databasePublisherDeploy: false,
    })
    save('freeze.json', { report, changedFields: changed, inputs })
    console.log(JSON.stringify({ report, nativeCalls: 4, status: 'AFFECTED-ONLY-PASS' }))
  } catch (error) {
    save(finish ? 'finish-failure.json' : 'affected-failure.json',
      { message: error.stack, dependentStagesStopped: true, firstFailuresPreserved: true })
    throw error
  }
} else {
  throw new Error('Choose prepare or check')
}
