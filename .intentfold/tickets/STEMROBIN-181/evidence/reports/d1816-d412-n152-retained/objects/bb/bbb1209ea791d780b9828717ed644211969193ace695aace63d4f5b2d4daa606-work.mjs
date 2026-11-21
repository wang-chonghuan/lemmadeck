import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), repo)
const out = path.dirname(new URL(import.meta.url).pathname)
const base = path.join(repo, '.tmp/STEMROBIN-181/d1816-d392')
const preparation = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d392-n152-preparation')
const editions = ['modern-us-neutral', 'modern-us-neutral-en']
const names = ['lesson', 'exercises', 'figures']
const template = (edition, name = 'lesson') =>
  path.join(base, 'source-work/adapt/10p', edition, 'lessons/phy10-c4-s2', `${name}.template.json`)
const candidate = (edition, name) =>
  path.join(base, 'root/10p/editions', edition, 'lessons/phy10-c4-s2', `${name}.json`)
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const digest = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const bind = (file) => {
  const bytes = fs.readFileSync(file)
  return { path: file, bytes: bytes.length, sha256: digest(bytes) }
}
const write = (file, value) => {
  assert.ok(file.startsWith(`${out}/`) || editions.some((e) => names.some((n) =>
    file === template(e, n) || file === candidate(e, n))), `Unauthorized write: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const receipt = (id, command, input) => {
  const file = path.join(out, 'calls', `${id}.json`)
  assert.equal(fs.existsSync(file), false)
  const startedAt = new Date().toISOString()
  const result = spawnSync(command[0], command.slice(1), {
    cwd: repo, encoding: 'utf8', input, timeout: 330000, maxBuffer: 8000000,
  })
  const record = {
    id, command, cwd: repo, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
    stdinSha256: input === undefined ? null : digest(input),
    stdout: result.stdout ?? '', stderr: result.stderr ?? '',
    imagesOpened: 0, paidCalls: 0,
  }
  write(file, record)
  return record
}
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const tools = path.join(repo, '.claude/skills/ld-s10y-lesson/tools')
const require = createRequire(import.meta.url)
const htmlfrag = require(path.join(tools, 'htmlfrag.js'))
const frozen = () => read(path.join(out, 'input-freeze.json'))
function unchanged(freeze) {
  for (const item of freeze.immutable) assert.equal(bind(item.path).sha256, item.sha256, item.path)
}
function identity(document, freeze, edition) {
  const raw = read(freeze.raw.path)
  assert.equal(digest(JSON.stringify(document.source)), freeze.sourceObjectDigests[edition])
  assert.deepEqual(document.source.data, raw)
  assert.equal(document.source.sha256, freeze.raw.sha256)
  assert.equal(document.id, 'phy10-c4-s2')
  assert.equal(document.prose.length, 18)
  assert.deepEqual(document.prose.map((p) => p.source_text), raw.prose.map((p) => p.text))
  for (const field of ['kind', 'id', 'label', 'printed_page', 'source_refs']) {
    assert.deepEqual(document.prose.map((p) => p[field]), raw.prose.map((p) => p[field]))
  }
  for (const field of ['card_id', 'section', 'chapter', 'number', 'start_page', 'start_printed', 'figures', 'exercise_count']) {
    assert.deepEqual(document[field], raw[field])
  }
  assert.deepEqual(document.errata, [])
  assert.equal(document.status, 'draft')
}

if (process.argv[2] === 'intake') {
  const prepared = read(path.join(preparation, 'prepared.json'))
  assert.equal(prepared.status, 'first-author-ready')
  assert.equal(bind(prepared.source.path).sha256, prepared.source.sha256)
  const raw = read(prepared.source.path)
  assert.equal(raw.prose.length, 18)
  assert.equal(raw.exercise_count, 0)
  assert.deepEqual(raw.figures, [])
  const inherited = read(path.join(preparation, 'input-freeze.json'))
  const sourceReviews = [
    path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d346-source392-393-review/report.json'),
    inherited.firstSourceReview.path, inherited.affectedTwoWords.path, inherited.countingRecovery.path,
  ]
  for (const e of editions) for (const n of names) {
    assert.equal(fs.existsSync(candidate(e, n)), false, 'Existing output must not be replaced')
  }
  const inputs = [
    'AGENTS.md', '.claude/skills/ld-s10y-lesson/SKILL.md',
    '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
    '.claude/skills/ld-s10y-lesson/references/production-resume.md',
    '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json',
    ...['edition.py', 'normalize.py', 'htmlfrag.js', 'prose_flow.mjs'].map((n) =>
      `.claude/skills/ld-s10y-lesson/tools/${n}`),
  ].map((p) => path.join(repo, p))
  const immutable = [
    ...inputs, ...sourceReviews, prepared.source.path,
    path.join(path.dirname(prepared.source.path), 'exercises.json'),
    path.join(preparation, 'prepared.json'), path.join(preparation, 'input-freeze.json'),
    ...inherited.copies.map((p) => p.to.path),
  ].map(bind)
  const initialTemplates = editions.flatMap((edition) => names.map((name) => ({ edition, name, ...bind(template(edition, name)) })))
  const freeze = {
    schema: 'STEMROBIN-181/d395-n152-author-input-freeze@1', createdAt: new Date().toISOString(),
    raw: bind(prepared.source.path),
    exercises: bind(path.join(path.dirname(prepared.source.path), 'exercises.json')),
    preparation: bind(path.join(preparation, 'prepared.json')),
    inheritedInputFreeze: bind(path.join(preparation, 'input-freeze.json')),
    sourceReviews: sourceReviews.map(bind), immutable, initialTemplates,
    sourceObjectDigests: Object.fromEntries(editions.map((e) => [e, digest(JSON.stringify(read(template(e)).source))])),
    baselineFailures: [{
      operation: 'ls -ld authorized author and candidate directories',
      exitCode: 1, classification: 'EXPECTED_ABSENT_OUTPUT_DIRECTORY_DISCOVERY',
      resolution: 'Create only the authorized directories during artifact generation; not a content verdict.',
    }],
    webSearch: { requests: 2, queries: 8, resultBodiesReturned: 0, pageOpens: 0 },
    sourceApproval: {
      fullArchivalSourceApproval: false, countingAffectedReviewPending: true,
      necessarySemantics: 'Reuse D346 and D368 with D378 affected findings; not independently re-adjudicated here.',
      qualifications: ['p0394-r07-punctuation', 'p0396-r10-punctuation',
        'p0396-r17-r19-emphasis-boundaries', 'D368-TYPEFACE-QUALIFICATION',
        'D368-PUNCTUATION-FIRST-READ-QUALIFICATION'],
      future397ScriptOutsideN152: true,
    },
  }
  editions.forEach((e) => identity(read(template(e)), freeze, e))
  write(path.join(out, 'input-freeze.json'), freeze)
  console.log(JSON.stringify(bind(path.join(out, 'input-freeze.json'))))
} else if (process.argv[2] === 'fetch') {
  const sources = read(path.join(out, 'scientific-sources.json'))
  for (const item of sources) {
    const r = receipt(item.id, ['cloak-fetch', item.url])
    console.log(JSON.stringify({ id: item.id, exitCode: r.exitCode, httpStatus: r.stdout.match(/^Status: (\d+)/m)?.[1] ?? null }))
    if (r.exitCode !== 0) break
  }
} else if (process.argv[2] === 'fetch-one') {
  const [id, url] = process.argv.slice(3)
  assert.match(id, /^[a-z0-9-]+$/)
  assert.ok(url.startsWith('https://'))
  const r = receipt(id, ['cloak-fetch', url])
  console.log(JSON.stringify({ id, exitCode: r.exitCode, stdout: r.stdout, stderr: r.stderr }))
} else if (process.argv[2] === 'compose') {
  const freeze = frozen()
  unchanged(freeze)
  const draft = read(path.join(out, 'draft-prose.json'))
  assert.equal(draft.entries.length, 18)
  const documents = editions.map((edition) => {
    assert.equal(bind(template(edition)).sha256, freeze.initialTemplates.find((i) => i.edition === edition && i.name === 'lesson').sha256)
    const d = read(template(edition))
    const locale = edition.endsWith('-en') ? 'en' : 'zh'
    d.locale = locale
    if (locale === 'en') {
      d.title = draft.englishTitle
      d.printed_title = `152. ${draft.englishTitle}`
    }
    d.prose.forEach((p, i) => {
      const a = draft.entries[i]
      assert.deepEqual(a.source_refs, p.source_refs)
      p.text = a[locale]
      p.changes = ['layout', locale === 'en' ? 'translation' : 'wording', ...a.changes]
      p.numeric_changes = []
      p.historical_entities = []
    })
    return d
  })
  const r = receipt('normalize-once-bilingual', [python, '-c',
    'import json,sys; sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools"); from edition import normalize_prose_layout; ds=json.load(sys.stdin); [p.update(text=normalize_prose_layout(p["text"])) for d in ds for p in d["prose"]]; print(json.dumps(ds,ensure_ascii=False))'],
    JSON.stringify(documents))
  assert.equal(r.exitCode, 0, r.stderr)
  const normalized = JSON.parse(r.stdout)
  for (let i = 0; i < editions.length; i++) {
    identity(normalized[i], freeze, editions[i])
    write(path.join(out, 'composed', `${editions[i]}.json`), normalized[i])
  }
  console.log(JSON.stringify({ composed: editions.map((e) => bind(path.join(out, 'composed', `${e}.json`))) }))
} else if (process.argv[2] === 'repair-en-layout') {
  const e = 'modern-us-neutral-en'
  const composed = path.join(out, 'composed', `${e}.json`)
  const before = read(composed)
  const first = path.join(out, 'first-layout-failure')
  if (!fs.existsSync(path.join(first, 'english-composed.json'))) {
    write(path.join(first, 'english-composed.json'), before)
    write(path.join(first, 'english-layout.json'), read(path.join(out, 'layout', `${e}.json`)))
  } else {
    assert.deepEqual(read(path.join(first, 'english-composed.json')), before)
  }
  const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' })
  const d = structuredClone(before)
  const sentences = d.prose.map((p) => [...segmenter.segment(p.text)].map((s) => s.segment.trim()).filter(Boolean))
  d.prose.forEach((p, i) => {
    p.text = sentences[i].join('\n')
    assert.equal(p.text.replace(/\s+/g, ' '), before.prose[i].text.replace(/\s+/g, ' '))
  })
  const oldReceipt = path.join(out, 'calls/normalize-en-layout-repair.json')
  const recovered = fs.existsSync(oldReceipt)
  const r = recovered ? read(oldReceipt) : receipt('normalize-en-layout-repair', [python, '-c',
    'import json,sys; sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools"); from edition import normalize_prose_layout; d=json.load(sys.stdin); [p.update(text=normalize_prose_layout(p["text"])) for p in d["prose"]]; print(json.dumps(d,ensure_ascii=False))'],
    JSON.stringify(d))
  assert.equal(r.exitCode, 0, r.stderr)
  const after = JSON.parse(r.stdout)
  if (recovered) {
    assert.deepEqual(before.prose[16].source_refs, ['p0396#4'])
    assert.equal(sentences[16].length, 2)
    after.prose[16].text = before.prose[16].text
  }
  after.prose.forEach((p, i) => {
    assert.equal(p.text.replace(/\s+/g, ' '), before.prose[i].text.replace(/\s+/g, ' '))
    assert.ok(p.text.split('\n\n').every((paragraph) => paragraph.split('\n').length <= 3))
  })
  identity(after, frozen(), e)
  fs.writeFileSync(composed, `${JSON.stringify(after, null, 2)}\n`)
  write(path.join(out, 'english-layout-repair.json'), {
    reason: 'Initial English prose_flow output grouped lines containing several sentences. It is retained as rejected author-layout evidence, not a scientific review failure.',
    semanticOrMathChange: false, sourceChange: false, classifier: 'AUTHOR_LAYOUT_REPAIR',
    segmenter: 'Intl.Segmenter(en, sentence); complete sentences retain exact words and punctuation.',
    firstComposed: bind(path.join(first, 'english-composed.json')),
    firstLayout: bind(path.join(first, 'english-layout.json')),
    firstProseFlowReceipt: bind(path.join(out, 'calls', `${e}-prose-flow-once.json`)),
    repairedComposed: bind(composed), normalizeReceipt: bind(path.join(out, 'calls/normalize-en-layout-repair.json')),
    technicalRecovery: recovered ? bind(path.join(out, 'layout-recovery.first-failure.json')) : null,
    reusedSuccessfulNormalizerOutput: recovered,
    sentencesPerEntry: sentences.map((s) => s.length),
    rule: 'Final conceptual breaks will be copied from ONE repaired authoritative English prose_flow output; the prior rejected output is not mixed into final anchors. Actual call count is never reset.',
  })
  fs.chmodSync(path.join(first, 'english-composed.json'), 0o444)
  fs.chmodSync(path.join(first, 'english-layout.json'), 0o444)
  console.log(JSON.stringify(bind(path.join(out, 'english-layout-repair.json'))))
} else if (['flow', 'flow-en-repaired'].includes(process.argv[2])) {
  const draft = read(path.join(out, 'draft-prose.json'))
  const affected = process.argv[2] === 'flow-en-repaired' ? ['modern-us-neutral-en'] : editions
  for (const edition of affected) {
    const composed = path.join(out, 'composed', `${edition}.json`)
    const d = read(composed)
    const id = process.argv[2] === 'flow-en-repaired' ? `${edition}-prose-flow-authoritative` : `${edition}-prose-flow-once`
    const r = receipt(id, ['node', path.join(tools, 'prose_flow.mjs'), composed])
    assert.equal(r.exitCode, 0, r.stderr)
    const paragraphs = htmlfrag.proseOutline(d.prose)
    for (const p of paragraphs) assert.ok(r.stdout.includes(`[${p.index}] ${p.text}\n`))
    const reportedBoundaryObjects = r.stdout.split('\n')
      .filter((line) => line.startsWith('    break: '))
      .map((line) => JSON.parse(line.slice('    break: '.length)))
    assert.equal(reportedBoundaryObjects.length, paragraphs.length - 1)
    const observed = { paragraphs, reportedBoundaryObjects, rawOutputSha256: digest(r.stdout),
      ownership: 'Shared htmlfrag.proseOutline identifies entry owners; paragraph text and all boundary objects are verified against the sole CLI stdout.' }
    const boundaries = draft.sectionStarts.map((concept) => {
      const p = observed.paragraphs.findIndex((p) => p.blockIndex === concept.entry)
      assert.ok(p > 0)
      const boundary = reportedBoundaryObjects.find((b) =>
        b.before === paragraphs[p - 1].text && b.after === paragraphs[p].text)
      assert.ok(boundary)
      return structuredClone(boundary)
    })
    const value = {
      commandReceipt: bind(path.join(out, 'calls', `${id}.json`)),
      observed, sectionStarts: draft.sectionStarts, selectedBoundaries: boundaries,
      method: 'Exact reported boundary objects copied from this sole prose_flow.mjs text output; conceptual owners chosen by content, not hand-counted paragraph positions.',
    }
    const layoutFile = path.join(out, 'layout', `${edition}.json`)
    if (process.argv[2] === 'flow-en-repaired') fs.writeFileSync(layoutFile, `${JSON.stringify(value, null, 2)}\n`)
    else write(layoutFile, value)
    console.log(JSON.stringify({ edition, paragraphs: observed.paragraphs.length, concepts: boundaries.length }))
  }
} else if (process.argv[2] === 'freeze') {
  const freeze = frozen()
  unchanged(freeze)
  const draft = read(path.join(out, 'draft-prose.json'))
  const documents = editions.map((edition) => {
    const d = read(path.join(out, 'composed', `${edition}.json`))
    d.section_breaks = read(path.join(out, 'layout', `${edition}.json`)).selectedBoundaries
    identity(d, freeze, edition)
    return d
  })
  const firstCheck = path.join(out, 'calls/pure-text-contract-once.json')
  const check = fs.existsSync(firstCheck) ? read(firstCheck) : receipt('pure-text-contract-once', [python, '-c', [
    'import json,sys',
    'sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools")',
    'from edition import validate_text,validate_lesson_identity,normalize_prose_layout,math_signature,prose_number_signature',
    'ds=json.load(sys.stdin)',
    'profile=json.load(open(".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json"))',
    'out=[]',
    'for d in ds:',
    ' entries=[]',
    ' for i,p in enumerate(d["prose"]):',
    '  errors=validate_text(p["source_text"],p["text"],p["changes"],p["numeric_changes"],str(i),profile["forbidden_terms"],p["historical_entities"])',
    '  if normalize_prose_layout(p["text"])!=p["text"]: errors.append("not layout-idempotent")',
    '  entries.append({"index":i,"errors":errors,"sourceMath":math_signature(p["source_text"]),"modernMath":math_signature(p["text"]),"sourceNumbers":prose_number_signature(p["source_text"])[0],"modernNumbers":prose_number_signature(p["text"])[0]})',
    ' out.append({"edition":d["edition"],"identityErrors":validate_lesson_identity(d["source"]["data"],d),"entries":entries})',
    'print(json.dumps(out,ensure_ascii=False))',
  ].join('\n')], JSON.stringify(documents))
  assert.equal(check.exitCode, 0, check.stderr)
  const local = JSON.parse(check.stdout)
  assert.ok(local.every((d) => !d.identityErrors.length && d.entries.every((p) => !p.errors.length)), JSON.stringify(local))
  const affected = receipt('pure-text-contract-en-entry10-affected', [python, '-c', [
    'import json,sys',
    'sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools")',
    'from edition import validate_text,normalize_prose_layout',
    'p=json.load(sys.stdin)',
    'profile=json.load(open(".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json"))',
    'errors=validate_text(p["source_text"],p["text"],p["changes"],p["numeric_changes"],"10",profile["forbidden_terms"],p["historical_entities"])',
    'if normalize_prose_layout(p["text"])!=p["text"]: errors.append("not layout-idempotent")',
    'print(json.dumps({"entry":10,"errors":errors}))',
  ].join('\n')], JSON.stringify(documents[1].prose[10]))
  assert.equal(affected.exitCode, 0, affected.stderr)
  assert.deepEqual(JSON.parse(affected.stdout).errors, [])
  const sources = read(path.join(out, 'scientific-sources.json')).map((s) => {
    const r = read(path.join(out, 'calls', `${s.id}.json`))
    assert.equal(r.exitCode, 0, s.id)
    if (s.usedForEvidence !== false) {
      assert.match(r.stdout, /^Status: 200/m, s.id)
      assert.ok(!/Checking your browser|reCAPTCHA|Access Denied/.test(r.stdout), s.id)
    }
    return { ...s, observedTitle: r.stdout.split('\n')[0],
      httpStatus: Number(r.stdout.match(/^Status: (\d+)/m)?.[1] ?? 0),
      usedForEvidence: s.usedForEvidence !== false, receipt: bind(path.join(out, 'calls', `${s.id}.json`)) }
  })
  for (const a of draft.entries) for (const id of a.evidence) {
    assert.ok(sources.some((s) => s.id === id && s.usedForEvidence), `Unusable evidence: ${id}`)
  }
  const outputs = []
  const snapshots = []
  const layoutResults = []
  for (let i = 0; i < editions.length; i++) {
    const e = editions[i]
    const d = documents[i]
    const layout = read(path.join(out, 'layout', `${e}.json`))
    const outline = htmlfrag.proseOutline(d.prose)
    if (!i) assert.deepEqual(outline, layout.observed.paragraphs)
    else {
      assert.equal(outline.length, layout.observed.paragraphs.length)
      const changed = outline.filter((p, j) => p.text !== layout.observed.paragraphs[j].text)
      assert.equal(changed.length, 2)
      assert.ok(changed.every((p) => p.blockIndex === 10))
      for (const p of changed) {
        const old = layout.observed.paragraphs[p.index]
        assert.equal(old.blockIndex, p.blockIndex)
        assert.equal(old.paragraphInBlock, p.paragraphInBlock)
        assert.ok(d.section_breaks.every((b) => b.before !== old.text && b.after !== old.text))
      }
    }
    if (i) assert.ok(outline.every((p) => !/^[a-z]/.test(p.text)), 'English paragraph starts with a fragment')
    const resolved = htmlfrag.sectionBreakIndices(d.prose, d.section_breaks)
    assert.equal(resolved.length, draft.sectionStarts.length)
    assert.deepEqual(resolved.map((n) => outline[n].blockIndex), draft.sectionStarts.map((c) => c.entry))
    assert.equal(htmlfrag.proseFlow(d.prose, d.section_breaks).filter((p) => p.sectionBreak).length, resolved.length)
    for (const p of d.prose) {
      assert.ok(p.text.trim())
      assert.ok(!/\[HOLD:|<(?:img|svg|span|iframe)\b/i.test(p.text))
      assert.deepEqual(p.numeric_changes, [])
      assert.ok(!/[А-Яа-яЁё]/.test(p.text))
      if (i) assert.ok(!/[\u3400-\u9fff]/.test(p.text))
    }
    layoutResults.push({ edition: e, sourceEntries: 18, paragraphs: outline.length,
      conceptBreaks: resolved.length, resolvedBreaks: resolved,
      anchors: d.section_breaks, soleProseFlowReceipt: layout.commandReceipt,
      visualOrScientificApproval: false })
    for (const n of names) {
      const file = template(e, n)
      const value = n === 'lesson' ? d : read(file)
      if (n !== 'lesson') {
        assert.deepEqual(value[n], [])
        assert.equal(value.status, 'draft')
      }
      // The authored prose is applied as structured data; normalization and anchor selection are mechanical.
      const originalHash = freeze.initialTemplates.find((f) => f.edition === e && f.name === n).sha256
      if (bind(file).sha256 === originalHash) {
        if (n === 'lesson') fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
      } else assert.deepEqual(read(file), value)
      if (fs.existsSync(candidate(e, n))) assert.deepEqual(read(candidate(e, n)), value)
      else write(candidate(e, n), value)
      const snap = path.join(out, 'candidate-snapshots', e, `${n}.json`)
      if (fs.existsSync(snap)) assert.deepEqual(read(snap), value)
      else write(snap, value)
      fs.chmodSync(snap, 0o444)
      outputs.push({ edition: e, name: n, template: bind(file), candidate: bind(candidate(e, n)) })
      snapshots.push({ edition: e, name: n, ...bind(snap), mode: '0444' })
      assert.equal(bind(snap).sha256, bind(candidate(e, n)).sha256)
    }
  }
  unchanged(freeze)
  const perEntry = draft.entries.map((a, index) => ({
    index, sourceIdentity: { ...read(freeze.raw.path).prose[index], text: undefined },
    source_refs: a.source_refs, sourceTextSha256: digest(documents[0].prose[index].source_text),
    coverage: a.coverage, adaptation: a.adaptation, evidenceIds: a.evidence,
    zh: { text: documents[0].prose[index].text, sha256: digest(documents[0].prose[index].text), changes: documents[0].prose[index].changes },
    en: { text: documents[1].prose[index].text, sha256: digest(documents[1].prose[index].text), changes: documents[1].prose[index].changes },
    sameInstructionalSubstanceAuthored: true, independentCoverageOrScienceApproval: false,
  }))
  write(path.join(out, 'bilingual-adaptation-coverage.json'), { schema: 'STEMROBIN-181/d395-bilingual-map@1', perEntry })
  const calls = fs.readdirSync(path.join(out, 'calls')).filter((n) => n.endsWith('.json')).map((n) => bind(path.join(out, 'calls', n)))
  const usage = {
    firstBilingualAuthorRounds: 1, postCompositionContentRepairs: 0,
    postCompositionLayoutRepairs: 2, authorLayoutCheckFailures: 2,
    preCompositionSentenceBoundaryRefinements: 1,
    normalizerBatchCalls: 2, proseFlowCLICalls: 3,
    proseFlowCLICallsByLocale: { zh: 1, en: 2 },
    finalAuthoritativeProseFlowOutputsPerLocale: 1, rejectedEnglishLayoutOutputs: 1,
    pureTextContractCalls: 2, fullBilingualTextContractCalls: 1, affectedEntryTextContractCalls: 1,
    successfulFullContractReceiptReused: true, successfulChineseCandidatesReused: true,
    scientificCloakFetchCalls: sources.length,
    scientificFetchFailures: sources.filter((s) => s.httpStatus !== 200).length,
    localContractFailures: 0, technicalRecoveries: 1,
    failedOuterLayoutRepairExecutions: 1, failedOuterFreezeExecutions: 1, successfulNormalizerOutputReused: true,
    referenceRelevanceRepairs: 1, referenceUrlRepairs: 2,
    rejectedWrongChapterFetches: 1, blockedDiscoveryFetches: 1, challengeBypasses: 0,
    expectedAbsentDirectoryDiscovery: 1, webSearchRequests: 2, webSearchQueries: 8, webSearchResultBodiesReturned: 0,
    imagesOpened: 0, imagesGenerated: 0, imageFilesCreated: 0, paidCalls: 0,
    sourceAssemblyCalls: 0, adaptPrepareCalls: 0, adaptFinalizeCalls: 0, renderCalls: 0,
    publisherCalls: 0, databaseCalls: 0, backendCalls: 0, gitCalls: 0,
    peerMessages: 0, nestedAgents: 0, independentReviewsPerformed: 0,
    sourcePagesAdded: 0, completeCoursesAdded: 0,
    inferenceTokens: null, inferenceCostUSD: null, tokenUsage: null, cost: null, model: null, reasoningEffort: null,
    telemetryReason: 'No authoritative model/billing telemetry exposed. Zero paid tool calls does not mean zero assistant inference cost.',
    elapsedMsSinceInputFreeze: Date.now() - Date.parse(freeze.createdAt),
  }
  const gates = {
    source: 'Existing scoped D346/D368/D378 evidence reused, archival qualifications retained; no new source approval.',
    countingD391: 'AFFECTED_REVIEW_PENDING',
    SCI: 'PENDING_FIRST_INDEPENDENT_REVIEW',
    ZHEN: 'PENDING_FIRST_INDEPENDENT_REVIEW',
    finalize: 'NOT_RUN', render: 'NOT_RUN', display: 'NOT_REVIEWED',
    publish: 'NOT_AUTHORIZED', fullArchivalSourceApproval: false,
  }
  const report = {
    schema: 'STEMROBIN-181/d395-n152-first-text-author-report@1', createdAt: new Date().toISOString(),
    ticket: 'STEMROBIN-181', stage: 'D395', role: 'FIRST_TEXT_AUTHOR', finish: 'review', grill: 'self',
    card: 'phy10-c4-s2', number: '152', status: 'AUTHOR_COMPLETE_CANDIDATE_FROZEN_PENDING_FIRST_INDEPENDENT_REVIEW',
    finiteAssignmentComplete: true, courseApproval: false,
    sourceEntries: 18, exercises: 0, figures: 0, sourcePhysicalPages: [392, 393, 394, 395, 396],
    inputFreeze: bind(path.join(out, 'input-freeze.json')), source: freeze.raw, sourceExercises: freeze.exercises,
    outputs, snapshots, layoutResults,
    intermediateInputs: editions.flatMap((e) => [
      bind(path.join(out, 'composed', `${e}.json`)), bind(path.join(out, 'layout', `${e}.json`)),
    ]),
    bilingualMap: bind(path.join(out, 'bilingual-adaptation-coverage.json')),
    scientificSources: sources, calls, usage, gates,
    referenceRecovery: {
      wrongChapter: 'NCBI NBK26848 was read, identified as unrelated and rejected. Relevance does not follow from HTTP 200.',
      blockedDiscovery: 'NCBI search returned a browser-check/reCAPTCHA page. No retry, challenge interaction or bypass was attempted. A different publisher source is used instead.',
      missingUrl: 'Attempted IAEA thorium page returned HTTP 404 with process exit 0; record the HTTP failure. WNA authored reference is a separate replacement, not a successful IAEA read.',
      missingHistoricalPressRelease: 'The Nobel 1971 press-release URL returned HTTP 404; a separate Gabor facts page is the replacement evidence, not a successful press-release read.',
      contentRepairsFromReferences: 'Pre-application evidence selection only. No frozen candidate revision or independent review.',
    },
    sourceQualifications: freeze.sourceApproval,
    sourceIntegrity: {
      rawAndPageBytesUnchanged: true, sourceSnapshotsAndHashesUnchanged: true,
      all18EntryIdentitiesCompleteRefsAndOrderingUnchanged: true,
      mathTokensUnchanged: true, numericDigitSignaturesUnchanged: true,
      archivalHoldMarkersRemainInSourceSnapshots: true,
      modernPunctuationNotArchivalAdjudication: true, inventedErrata: false,
    },
    headings: { zh: 'Exact source headings retained.', en: 'Title and printed_title translated; identifier 152 preserved; chapter and structural section remain null.' },
    scientificLimits: 'Primary page observations support explicitly mapped author adaptations, not independent SCI approval. No experiments, exercises, answers, repaired formulas or latest-status claims invented.',
    localVerification: { receipt: bind(path.join(out, 'calls/pure-text-contract-once.json')),
      affectedReceipt: bind(path.join(out, 'calls/pure-text-contract-en-entry10-affected.json')),
      status: 'PURE_TEXT_IDENTITY_AND_LAYOUT_CHECKS_PASS_ONLY', independentReview: false },
    layoutRepair: bind(path.join(out, 'english-layout-repair.json')),
    interiorLayoutRepair: bind(path.join(out, 'interior-layout-repair.json')),
    firstFreezeFailureSnapshot: bind(path.join(out, 'first-freeze-failure/english-composed.json')),
    contentDesign: draft.contentDesign,
    permissions: { images: false, db: false, publish: false, deploy: false, merge: false, closure: false, backend: false, git: false, peer: false, nestedAgents: false, paidCalls: false },
    ownership: { editedExistingFiles: editions.map((e) => template(e)), createdCandidates: outputs.map((o) => o.candidate.path), evidenceDirectory: out, otherEdits: false },
    stop: 'Stop after immutable first-author freeze for independent first review. Do not finalize/render/assemble/review.',
  }
  write(path.join(out, 'report.json'), report)
  const authorFreeze = {
    schema: 'STEMROBIN-181/d395-n152-first-text-author-freeze@1',
    frozenAt: new Date().toISOString(), role: report.role, card: report.card, status: report.status,
    report: bind(path.join(out, 'report.json')), inputFreeze: report.inputFreeze,
    source: freeze.raw, sourceExercises: freeze.exercises,
    outputs, snapshots, bilingualMap: report.bilingualMap, calls, intermediateInputs: report.intermediateInputs,
    layoutRepair: report.layoutRepair,
    interiorLayoutRepair: report.interiorLayoutRepair, firstFreezeFailureSnapshot: report.firstFreezeFailureSnapshot,
    authorInputs: ['draft-prose.json', 'scientific-sources.json', 'work.mjs'].map((n) => bind(path.join(out, n))),
    sourceQualifications: freeze.sourceApproval, gates, usage,
    downstream: 'Review these exact frozen hashes independently. Working candidates remain draft and writable. Preserve this freeze; source approval and D391 affected counting review are not supplied by the author.',
  }
  write(path.join(out, 'author-freeze.json'), authorFreeze)
  for (const n of ['report.json', 'author-freeze.json', 'input-freeze.json', 'draft-prose.json', 'scientific-sources.json', 'work.mjs', 'bilingual-adaptation-coverage.json', 'english-layout-repair.json', 'layout-recovery.first-failure.json', 'interior-layout-repair.json']) fs.chmodSync(path.join(out, n), 0o444)
  for (const c of calls) fs.chmodSync(c.path, 0o444)
  for (const e of editions) {
    fs.chmodSync(path.join(out, 'layout', `${e}.json`), 0o444)
    fs.chmodSync(path.join(out, 'composed', `${e}.json`), 0o444)
  }
  console.log(JSON.stringify({ report: bind(path.join(out, 'report.json')), authorFreeze: bind(path.join(out, 'author-freeze.json')), usage, layoutResults }, null, 2))
} else {
  throw new Error('Expected intake, fetch, fetch-one, compose, flow, repair-en-layout, flow-en-repaired, or freeze')
}
