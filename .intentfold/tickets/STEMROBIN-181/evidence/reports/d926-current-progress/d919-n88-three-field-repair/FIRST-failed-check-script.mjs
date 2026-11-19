import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const out = path.dirname(fileURLToPath(import.meta.url))
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const first = path.join(ticket, 'tmp/d907-n88-first-bilingual-text-author')
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
const original = read(path.join(first, 'report.json'))
const watched = [
  path.join(first, 'report.json'), path.join(first, 'FIRST-freeze.json'),
  ...['zh', 'en'].flatMap(locale => [
    path.join(first, locale, 'lesson.template.json'),
    path.join(first, locale, 'exercises.template.json'),
  ]),
]
if (process.argv[2] === 'prepare') {
  save('prepare-started.json', {
    ticket: 'STEMROBIN-181', successor: 'successor181-3', onlyWriteRoot: out,
    stage: 'THREE-FIELD-REPAIR-PREPARATION', inputs: watched.map(bind),
    parentNewImages: 0, paidCalls: 0,
  })
  for (const locale of ['zh', 'en']) {
    for (const name of ['lesson.template.json', 'exercises.template.json']) {
      const source = path.join(first, locale, name)
      const expected = original.candidate[locale][name.startsWith('lesson') ? 'lesson' : 'exercises']
      assert.equal(sha(source), expected.sha256)
      const target = path.join(out, locale, name)
      fs.mkdirSync(path.dirname(target), { recursive: true })
      fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
      fs.chmodSync(target, 0o644)
      assert.equal(sha(source), sha(target))
    }
  }
  save('prepared.json', { status: 'WRITABLE-COPIES-FIRST-UNCHANGED', inputs: watched.map(bind) })
  console.log('Prepared writable copies; no content changes or native stage replay.')
} else if (process.argv[2] === 'check') {
  const inputs = read(path.join(out, 'prepare-started.json')).inputs
  for (const input of inputs) assert.equal(sha(input.path), input.sha256)
  save('check-started.json', { stage: 'AFFECTED-ONLY-ONCE', first: bind(path.join(first, 'report.json')) })
  const native = (name, executable, args, input) => {
    const result = spawnSync(executable, args, {
      cwd: repo, input, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
      timeout: 60000, maxBuffer: 8 * 1024 * 1024,
    })
    save(`native/${name}.receipt.json`, {
      command: [executable, ...args], cwd: repo, exit: result.status,
      stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
      affectedOnly: true,
    })
    assert.equal(result.status, 0, result.stderr || result.stdout)
    return JSON.parse(result.stdout)
  }
  try {
    const changes = []
    const candidates = {}
    for (const locale of ['zh', 'en']) {
      const old = read(path.join(first, locale, 'lesson.template.json'))
      const current = read(path.join(out, locale, 'lesson.template.json'))
      const indices = locale === 'zh' ? [8] : [8, 12]
      const unchanged = structuredClone(current)
      for (const index of indices) {
        assert.notEqual(current.prose[index].text, old.prose[index].text)
        unchanged.prose[index].text = old.prose[index].text
        changes.push({ locale, pointer: `/prose/${index}/text`, sourceRefs: current.prose[index].source_refs,
          before: old.prose[index].text, after: current.prose[index].text })
      }
      assert.deepEqual(unchanged, old, 'Only the three authorized text fields may differ')
      assert.equal(sha(path.join(out, locale, 'exercises.template.json')),
        sha(path.join(first, locale, 'exercises.template.json')))
      candidates[locale] = current
    }
    assert.equal(changes.length, 3)
    const code = `
import copy, json, re, sys
sys.path.insert(0, sys.argv[1])
import edition as e
import mathcheck
p = json.load(sys.stdin)
profile = e.load(p["profile"])
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
results = {}
for locale, d in p["candidates"].items():
    normalized = copy.deepcopy(d)
    e.normalize_lesson_layout(normalized)
    assert normalized == d, "Changed candidate must remain normalized"
    results[locale] = []
    for i in ([8] if locale == "zh" else [8,12]):
        b = d["prose"][i]
        errors = e.validate_text(b["source_text"], b["text"], b["changes"], b["numeric_changes"],
            f"{locale}.prose[{i}]", forbidden, b["historical_entities"], None, b.get("notation_changes"))
        errors += mathcheck.check_delimiters(b["text"])
        source_math = [m.group(0) for m in e.MATH.finditer(b["source_text"])]
        candidate_math = [m.group(0) for m in e.MATH.finditer(b["text"])]
        assert source_math == candidate_math
        if i == 8:
            assert candidate_math == ["$B$","$R$","$B$","$ab$","$B$","$SB$"]
        numbers = lambda s: re.findall(r"\\d+(?:\\.\\d+)?", e.MATH.sub("", s))
        assert numbers(b["source_text"]) == numbers(b["text"])
        assert b["numeric_changes"] == [] and not errors, errors
        results[locale].append({"index":i,"sourceRefs":b["source_refs"],"mathTokens":candidate_math,
            "numericTokens":numbers(b["text"]),"errors":errors,"status":"pass"})
print(json.dumps({"status":"pass","affected":results}))
`
    const text = native('affected-text', python, ['-B', '-c', code, tools], JSON.stringify({
      candidates, profile: path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'),
    }))
    const flows = {}
    for (const locale of ['zh', 'en']) {
      flows[locale] = native(`affected-flow-${locale}`, process.execPath,
        [path.join(tools, 'prose_flow.mjs'), '--json', path.join(out, locale, 'lesson.template.json')])
      const previous = JSON.parse(read(path.join(first, `native/flow-${locale}.receipt.json`)).stdout)
      assert.deepEqual(flows[locale].boundaries, previous.boundaries, 'Named conceptual boundaries must stay unchanged')
      assert.equal(flows[locale].paragraphs.length, previous.paragraphs.length)
    }
    const katex = native('inserted-B-katex', process.execPath, [path.join(tools, 'katex_check.js')],
      JSON.stringify(['zh', 'en'].map(locale => ({
        id: `${locale}.prose[8].inserted-B`, field: 'text', tex: 'B', display: false,
      }))))
    for (const input of inputs) assert.equal(sha(input.path), input.sha256)
    const changed = save('changed-fields.json', changes)
    const report = save('report.json', {
      schema: 'STEMROBIN-181/d919-affected-repair@1', ticket: 'STEMROBIN-181',
      status: 'THREE-FIELD-AFFECTED-TEXT-FLOW-PASS-INDEPENDENT-SCI-ZHEN-PENDING',
      card: 'phy10-c2-s3-n88', first: bind(path.join(first, 'report.json')), changedFields: changed,
      candidates: Object.fromEntries(['zh', 'en'].map(locale => [locale, {
        lesson: bind(path.join(out, locale, 'lesson.template.json')),
        exercises: bind(path.join(out, locale, 'exercises.template.json')),
      }])),
      nativeText: text, katex, nativeCalls: 4, originalQuestions: 0,
      firstFailuresPreserved: true, authorReplay: false, assemblyReplay: false,
      independentApproval: false, completeCard: false,
      historicalSource235HelperDeviationHOLDWaived: false, modernFiguresAndPortraitApproval: 'PENDING',
      usage: { parentImagesCumulative: 22, parentNewImages: 0, paidCalls: 0, tokens: null, costUsd: null },
      databasePublisherDeploy: false, testsBuild: false, commitPush: false,
    })
    save('freeze.json', { report, inputs, changedFields: changed,
      candidates: ['zh', 'en'].map(locale => bind(path.join(out, locale, 'lesson.template.json'))) })
    console.log(JSON.stringify({ report, status: 'AFFECTED-ONLY-PASS', nativeCalls: 4 }))
  } catch (error) {
    save('affected-failure.json', { message: error.stack, firstFailuresPreserved: true, dependentStagesStopped: true })
    throw error
  }
} else {
  throw new Error('Choose prepare or check')
}
