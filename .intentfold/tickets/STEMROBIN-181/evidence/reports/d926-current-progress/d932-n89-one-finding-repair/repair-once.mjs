import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const out = path.dirname(fileURLToPath(import.meta.url))
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const previous = path.join(tmp, 'd921-n89-two-field-repair')
const reviewFile = path.join(tmp, 'd924-n89-first-independent-text-review/report.json')
const tools = path.join(repo, '.claude/skills/ld-s10y-lesson/tools')
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const bind = f => ({ path: f, sha256: sha(f) })
const save = (name, data) => {
  const f = path.join(out, name)
  fs.mkdirSync(path.dirname(f), { recursive: true })
  fs.writeFileSync(f, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' })
  return bind(f)
}
assert.equal(sha(reviewFile), 'a75b8258bcd4a49e9b47f718959879c12c2889913e2387d693d3590a1b4b34b6')
const original = read(path.join(previous, 'report.json'))
if (process.argv[2] === 'prepare') {
  const inputs = [bind(reviewFile), bind(path.join(previous, 'report.json'))]
  save('prepare-started.json', { scope: 'D924-TEXT-001 only', inputs })
  for (const locale of ['zh', 'en']) {
    for (const [field, name] of [['lesson', 'lesson.template.json'], ['exercises', 'exercises.template.json']]) {
      const source = path.join(previous, locale, name)
      assert.equal(sha(source), original.candidates[locale][field].sha256)
      const target = path.join(out, locale, name)
      fs.mkdirSync(path.dirname(target), { recursive: true })
      fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
      fs.chmodSync(target, 0o644)
      inputs.push(bind(source))
    }
  }
  save('prepared.json', { inputs })
  console.log('Fresh writable copies prepared for one finding.')
} else if (process.argv[2] === 'check') {
  const inputs = read(path.join(out, 'prepared.json')).inputs
  for (const b of inputs) assert.equal(sha(b.path), b.sha256)
  save('check-started.json', { scope: 'Only changed prose[0] in two locales' })
  const native = (name, exe, args, input) => {
    const r = spawnSync(exe, args, { cwd: repo, input, encoding: 'utf8', timeout: 60000,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } })
    save(`native/${name}.receipt.json`, { command: [exe, ...args], cwd: repo, exit: r.status,
      stdout: r.stdout, stderr: r.stderr, error: r.error?.message ?? null, affectedOnly: true })
    assert.equal(r.status, 0, r.stderr || r.stdout)
    return JSON.parse(r.stdout)
  }
  try {
    const candidates = {}
    const changed = []
    for (const locale of ['zh', 'en']) {
      const before = read(path.join(previous, locale, 'lesson.template.json'))
      const after = read(path.join(out, locale, 'lesson.template.json'))
      const unchanged = structuredClone(after)
      unchanged.prose[0].text = before.prose[0].text
      assert.deepEqual(unchanged, before)
      assert.notEqual(after.prose[0].text, before.prose[0].text)
      assert.equal(sha(path.join(out, locale, 'exercises.template.json')),
        sha(path.join(previous, locale, 'exercises.template.json')))
      candidates[locale] = after
      changed.push({ locale, pointer: '/prose/0/text', sourceRefs: after.prose[0].source_refs,
        before: before.prose[0].text, after: after.prose[0].text })
    }
    const code = `
import copy,json,re,sys
from pathlib import Path
sys.path.insert(0,sys.argv[1])
import edition as e
import mathcheck
p=json.load(sys.stdin)
profile=e.load(Path(p["profile"]))
forbidden=profile["forbidden_terms"]+profile["forbidden_person_names"]
results={}
for locale,d in p["candidates"].items():
    n=copy.deepcopy(d)
    e.normalize_lesson_layout(n)
    assert n==d
    b=d["prose"][0]
    errors=e.validate_text(b["source_text"],b["text"],b["changes"],b["numeric_changes"],
        f"{locale}.prose[0]",forbidden,b["historical_entities"],None,b.get("notation_changes"))
    errors+=mathcheck.check_delimiters(b["text"])
    spans=lambda s:[m.group(0) for m in e.MATH.finditer(s)]
    numbers=lambda s:re.findall(r"\\d+(?:\\.\\d+)?",e.MATH.sub("",s))
    assert spans(b["source_text"])==spans(b["text"])
    assert numbers(b["source_text"])==numbers(b["text"])
    assert not errors and b["numeric_changes"]==[],errors
    results[locale]={"status":"pass","sourceRefs":b["source_refs"],"errors":errors}
print(json.dumps({"status":"pass","affected":results}))
`
    const text = native('affected-text', path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
      ['-B', '-c', code, tools], JSON.stringify({ candidates,
        profile: path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json') }))
    for (const locale of ['zh', 'en']) {
      const flow = native(`affected-flow-${locale}`, process.execPath,
        [path.join(tools, 'prose_flow.mjs'), '--json', path.join(out, locale, 'lesson.template.json')])
      const before = JSON.parse(read(path.join(previous, `native/affected-flow-${locale}.receipt.json`)).stdout)
      assert.deepEqual(flow.boundaries, before.boundaries)
      assert.equal(flow.paragraphs.length, before.paragraphs.length)
    }
    const changedFields = save('changed-fields.json', changed)
    const report = save('report.json', {
      schema: 'STEMROBIN-181/d932-affected-repair@1', ticket: 'STEMROBIN-181', card: 'phy10-c2-s3-n89',
      status: 'D924-TEXT-001-AFFECTED-NATIVE-PASS-INDEPENDENT-AFFECTED-REVIEW-PENDING',
      previous: bind(path.join(previous, 'report.json')), firstReview: bind(reviewFile), changedFields,
      candidates: Object.fromEntries(['zh', 'en'].map(locale => [locale, {
        lesson: bind(path.join(out, locale, 'lesson.template.json')),
        exercises: bind(path.join(out, locale, 'exercises.template.json')),
      }])),
      nativeText: text, nativeCalls: 3, mathTokensChanged: false, katexReplays: 0,
      independentApproval: false, completeCard: false, colourPlateIVAndModernFigureApproval: 'HOLD-NOT-WAIVED',
      firstFailuresPreserved: true, originalQuestions: 0,
      usage: { parentImagesCumulative: 22, parentNewImages: 0, paidCalls: 0, tokens: null, costUsd: null },
      testsBuild: false, commitPush: false, databasePublisherDeploy: false,
    })
    save('freeze.json', { report, inputs, changedFields })
    console.log(JSON.stringify({ report, nativeCalls: 3 }))
  } catch (error) {
    save('affected-failure.json', { message: error.stack, dependentStagesStopped: true })
    throw error
  }
} else {
  throw new Error('Choose prepare or check')
}
