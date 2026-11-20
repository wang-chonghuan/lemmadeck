import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
const out = path.dirname(new URL(import.meta.url).pathname)
const base = path.join(repo, '.tmp/STEMROBIN-181/d1816-d350')
const preparation = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d350-n151-preparation')
const editions = ['modern-us-neutral', 'modern-us-neutral-en']
const template = (edition) => path.join(base, 'source-work/adapt/10p', edition, 'lessons/phy10-c4-s1/lesson.template.json')
const digest = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const binding = (file) => {
  const bytes = fs.readFileSync(file)
  return { path: file, bytes: bytes.length, sha256: digest(bytes) }
}
const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
const runtimeFiles = ['edition.py', 'normalize.py', 'htmlfrag.js', 'prose_flow.mjs']
  .map((name) => path.join(repo, '.claude/skills/ld-s10y-lesson/tools', name))
const require = createRequire(import.meta.url)
const htmlfrag = require(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))

function checkImmutable(freeze) {
  for (const item of freeze.immutable) assert.equal(binding(item.path).sha256, item.sha256, item.path)
  for (const edition of editions) {
    const lesson = read(template(edition))
    assert.equal(digest(JSON.stringify(lesson.source)), freeze.sourceObjectDigests[edition])
    assert.deepEqual(lesson.prose.map((p) => p.source_text), freeze.sourceTexts)
    assert.deepEqual(lesson.prose.map((p) => p.source_refs), freeze.sourceRefs)
    assert.equal(lesson.prose.length, 26)
    assert.equal(lesson.id, 'phy10-c4-s1')
    assert.equal(lesson.number, '151')
    assert.equal(lesson.exercise_count, 0)
    assert.deepEqual(lesson.figures, [])
    assert.deepEqual(lesson.errata, [])
  }
}

if (process.argv[2] === 'freeze-input') {
  assert.equal(fs.existsSync(path.join(out, 'input-freeze.json')), false)
  const prepared = read(path.join(preparation, 'prepared.json'))
  assert.equal(prepared.proseEntries, 26)
  assert.equal(prepared.originalTasks, 0)
  const raw = read(prepared.source.path)
  assert.equal(binding(prepared.source.path).sha256, prepared.source.sha256)
  assert.equal(binding(prepared.exercises.path).sha256, prepared.exercises.sha256)
  const pageFiles = [388, 389, 390, 391, 392].flatMap((page) =>
    ['page.md', 'page.json', 'audit.json'].map((name) => path.join(base, 'root/10p/pages', String(page).padStart(4, '0'), name)))
  const untouched = editions.flatMap((edition) =>
    ['figures.template.json', 'exercises.template.json'].map((name) => path.join(path.dirname(template(edition)), name)))
  const inherited = read(path.join(preparation, 'input-freeze.json')).inheritedReviews.map((item) => item.path)
  const value = {
    schema: 'STEMROBIN-181/d351-author-input-freeze@1',
    createdAt: new Date().toISOString(),
    scope: 'First N151 bilingual AUTHOR only; no source adjudication, images, tasks, finalization, rendering, publication, git or canonical edits.',
    preparation: binding(path.join(preparation, 'prepared.json')),
    inheritedInputFreeze: binding(path.join(preparation, 'input-freeze.json')),
    raw: binding(prepared.source.path),
    exercises: binding(prepared.exercises.path),
    initialTemplates: editions.map((edition) => ({ edition, ...binding(template(edition)) })),
    sourceObjectDigests: Object.fromEntries(editions.map((edition) => [edition, digest(JSON.stringify(read(template(edition)).source))])),
    sourceTexts: raw.prose.map((p) => p.text),
    sourceRefs: raw.prose.map((p) => p.source_refs),
    immutable: [...pageFiles, ...untouched, ...inherited, ...runtimeFiles, prepared.source.path, prepared.exercises.path,
      path.join(preparation, 'prepared.json'), path.join(preparation, 'input-freeze.json')].map(binding),
    boundary: { firstPhysicalPage: 388, lastPhysicalPage: 392, nextCard: 'N152', nextCardUse: 'boundary only; not authored' },
    inheritedSourceHolds: ['SOURCE388 quote punctuation', 'SOURCE390 colon/semicolon'],
    scientificEvidenceIsNotSourceAdjudication: true,
  }
  checkImmutable(value)
  writeJson(path.join(out, 'input-freeze.json'), value)
  console.log(JSON.stringify(binding(path.join(out, 'input-freeze.json'))))
} else if (['fetch-primary', 'fetch-extra-primary'].includes(process.argv[2])) {
  const sources = process.argv[2] === 'fetch-extra-primary' ? [
    ['feynman-electromagnetic-propagation', 'https://www.feynmanlectures.caltech.edu/I_28.html'],
    ['coherent-weak-scattering', 'https://arxiv.org/abs/1708.01294'],
  ] : [
    ['cern-standard-model', 'https://home.cern/science/physics/standard-model'],
    ['einstein-relativistic-mechanics', 'https://www.einstein-online.info/en/spotlight/postnewton/'],
    ['nuclear-forces-primary', 'https://arxiv.org/abs/1105.2919'],
    ['feynman-quantum-behaviour', 'https://www.feynmanlectures.caltech.edu/III_01.html'],
    ['feynman-state-evolution', 'https://www.feynmanlectures.caltech.edu/III_08.html'],
  ]
  for (const [id, url] of sources) {
    const receiptPath = path.join(out, 'primary-sources', `${id}.receipt.json`)
    assert.equal(fs.existsSync(receiptPath), false)
    const startedAt = new Date().toISOString()
    const start = Date.now()
    const result = spawnSync('cloak-fetch', [url], { cwd: repo, encoding: 'utf8', timeout: 330000, maxBuffer: 4000000 })
    const stdout = path.join(out, 'primary-sources', `${id}.stdout.txt`)
    const stderr = path.join(out, 'primary-sources', `${id}.stderr.txt`)
    fs.mkdirSync(path.dirname(stdout), { recursive: true })
    fs.writeFileSync(stdout, result.stdout ?? '')
    fs.writeFileSync(stderr, result.stderr ?? '')
    const receipt = {
      id, url, command: ['cloak-fetch', url], cwd: repo, startedAt,
      finishedAt: new Date().toISOString(), elapsedMs: Date.now() - start,
      exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
      stdout: binding(stdout), stderr: binding(stderr),
      httpStatus: (result.stdout ?? '').match(/^Status: (\d+)/m)?.[1] ?? null,
      scope: 'Text-only primary scientific reference retrieval, not scientific approval or archival proof.',
      imagesOpened: 0, paidCalls: 0,
    }
    writeJson(receiptPath, receipt)
    console.log(JSON.stringify(receipt))
    if (result.status !== 0) break
  }
} else if (['prepare-patch', 'refresh-patch'].includes(process.argv[2])) {
  const freeze = read(path.join(out, 'input-freeze.json'))
  checkImmutable(freeze)
  const draft = read(path.join(out, 'draft-prose.json'))
  assert.equal(draft.entries.length, 26)
  const documents = editions.map((edition) => {
    const document = read(template(edition))
    if (process.argv[2] === 'prepare-patch') {
      assert.equal(binding(template(edition)).sha256, freeze.initialTemplates.find((item) => item.edition === edition).sha256)
    } else {
      const firstCandidate = path.join(out, 'first-candidate', edition, 'lesson.template.json')
      if (fs.existsSync(firstCandidate)) {
        assert.equal(binding(firstCandidate).sha256, binding(template(edition)).sha256)
      } else {
        writeJson(firstCandidate, document)
      }
    }
    const language = edition.endsWith('-en') ? 'en' : 'zh'
    Object.assign(document, draft.metadata[language])
    document.prose.forEach((p, i) => {
      const authored = draft.entries[i]
      assert.deepEqual(authored.source_refs, p.source_refs)
      p.text = authored[language]
      p.changes = [...new Set(['layout', ...(language === 'en' ? ['translation'] : ['wording']),
        ...(authored.correction ? ['science-correction'] : []), ...(authored.historical_model ? ['historical-context'] : [])])]
      p.numeric_changes = []
      p.historical_entities = (authored.entities ?? []).map((entity) => ({
        term: entity[language], source_term: entity.source_term,
        reason: `${p.source_refs.join(', ')} names this real historical entity; preserve identity, not a fictional scene replacement.`,
      }))
    })
    return document
  })
  const python = spawnSync(path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), ['-c',
    'import sys,json; sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools"); from edition import normalize_prose_layout; ds=json.load(sys.stdin); [p.update(text=normalize_prose_layout(p["text"])) for d in ds for p in d["prose"]]; print(json.dumps(ds,ensure_ascii=False))'],
  { cwd: repo, encoding: 'utf8', input: JSON.stringify(documents), maxBuffer: 4000000 })
  assert.equal(python.status, 0, python.stderr)
  const normalized = JSON.parse(python.stdout)
  const patches = ['*** Begin Patch']
  for (let i = 0; i < editions.length; i++) {
    const document = normalized[i]
    document.section_breaks = []
    const flowCommand = spawnSync('node', [path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'), '--stdin'],
      { cwd: repo, encoding: 'utf8', input: JSON.stringify(document), maxBuffer: 4000000 })
    assert.equal(flowCommand.status, 0, flowCommand.stderr)
    const outline = JSON.parse(flowCommand.stdout).paragraphs
    // Concept ownership comes from the authored source entries; anchors come only from the final shared flow.
    const sectionStarts = draft.sectionStarts.map((item) => item.entry)
    document.section_breaks = sectionStarts.map((entry) => {
      const index = outline.findIndex((p) => p.blockIndex === entry)
      assert.ok(index > 0, `Missing outline owner ${entry}: ${JSON.stringify(outline[0])}`)
      return { before: outline[index - 1].text, after: outline[index].text }
    })
    const flow = htmlfrag.proseFlow(document.prose, document.section_breaks)
    writeJson(path.join(out, 'layout', `${editions[i]}.json`), { outline, flow, sectionStarts: draft.sectionStarts })
    patches.push(`*** Update File: ${template(editions[i])}`, '@@')
    patches.push(...fs.readFileSync(template(editions[i]), 'utf8').trimEnd().split('\n').map((line) => `-${line}`))
    patches.push(...JSON.stringify(document, null, 2).split('\n').map((line) => `+${line}`))
  }
  patches.push('*** End Patch')
  process.stdout.write(`${patches.join('\n')}\n`)
} else {
  throw new Error('Expected freeze-input, fetch-primary, fetch-extra-primary or prepare-patch')
}
