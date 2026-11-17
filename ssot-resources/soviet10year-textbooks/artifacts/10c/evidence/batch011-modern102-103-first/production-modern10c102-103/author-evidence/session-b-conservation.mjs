import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
const production = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp/production-modern10c102-103')
const templates = path.join(production, 'adapt/10c/modern-us-neutral/lessons')
const before = path.join(production, 'author-evidence/session-b-before.vZT0wf')
const originals = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/10c/lessons')
const flowTool = path.join(root, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs')
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const read = (filename) => {
  const bytes = fs.readFileSync(filename)
  return { path: filename, sha256: sha(bytes), data: JSON.parse(bytes) }
}
const withoutWhitespace = (text) => text.replace(/\s/gu, '')
const math = (text) => [...text.matchAll(/\$([^$]+)\$/gu)].map((match) => match[1])
const proseCharacters = (text) => withoutWhitespace(text.replace(/\$[^$]+\$/gu, ''))
const modernLabels = (text) => text.replace(/а\)/gu, 'a)').replace(/б\)/gu, 'b)')
const outside = (object, keys) => Object.fromEntries(
  Object.entries(object).filter(([key]) => !keys.includes(key)),
)

// This collects source conservation evidence only; it does not run pipeline acceptance.
const report = {
  scope: 'Session B: six text/layout templates only; no figures or pipeline stages',
  files: [],
  lessons: [],
}
for (const [id, expectedProse, expectedExercises] of [
  ['ana10-c7-s2-n102', 9, 0],
  ['ana10-c7-s2-n103', 8, 4],
]) {
  const lessonReport = { id, proseOwners: [], exercises: [] }
  for (const name of ['lesson', 'exercises', 'figures']) {
    const filename = `${name}.template.json`
    const current = read(path.join(templates, id, filename))
    const snapshot = read(path.join(before, id, filename))
    const entry = {
      path: current.path,
      sha256: current.sha256,
      before_path: snapshot.path,
      before_sha256: snapshot.sha256,
      byte_changed: current.sha256 !== snapshot.sha256,
    }
    if (name === 'figures') {
      assert.deepEqual(current.data, snapshot.data)
      assert.deepEqual(current.data.figures, [])
      report.files.push(entry)
      continue
    }
    const source = read(path.join(originals, id, `${name}.json`))
    entry.source_path = source.path
    entry.source_sha256 = source.sha256
    assert.equal(current.data.source.sha256, source.sha256)
    assert.deepEqual(current.data.source.data, source.data)
    assert.deepEqual(current.data.source, snapshot.data.source)
    const collection = name === 'lesson' ? 'prose' : 'exercises'
    assert.deepEqual(
      outside(current.data, [collection, 'section_breaks']),
      outside(snapshot.data, [collection, 'section_breaks']),
    )
    const items = current.data[collection]
    assert.equal(items.length, name === 'lesson' ? expectedProse : expectedExercises)
    assert.equal(items.length, source.data[collection].length)
    for (const [index, item] of items.entries()) {
      const original = source.data[collection][index]
      const first = snapshot.data[collection][index]
      const normalize = name === 'exercises' && item.number === '443'
        ? modernLabels : (text) => text
      assert.equal(item.source_text, original.text)
      assert.equal(withoutWhitespace(item.text), withoutWhitespace(normalize(original.text)))
      assert.deepEqual(math(item.text), math(original.text))
      assert.deepEqual(item.numeric_changes, [])
      assert.deepEqual(
        outside(item, ['text', 'lines', 'changes']),
        outside(first, ['text', 'lines', 'changes']),
      )
      assert.deepEqual(
        outside(item, ['text', 'lines', 'source_text', 'changes', 'numeric_changes', 'historical_entities']),
        outside(original, ['text', 'lines']),
      )
      assert.equal(/[、，；。？！：]/u.test(math(item.text).join('')), false)
      assert.equal(/[\u0400-\u04ff]/u.test(item.text), false)
      assert.equal(item.text.includes('\u3000'), false)
      if (name === 'exercises') assert.equal(item.lines.join('\n'), item.text)
      const sourceCharacters = proseCharacters(normalize(original.text))
      const modernCharacters = proseCharacters(item.text)
      assert.equal(modernCharacters, sourceCharacters)
      const row = {
        owner: index + 1,
        ...(name === 'exercises' ? { number: item.number } : {}),
        source_refs: item.source_refs ?? item.pages,
        source_math_spans: math(original.text).length,
        modern_math_spans: math(item.text).length,
        exact_formula_sequence: true,
        canonical_text_sha256: sha(withoutWhitespace(normalize(original.text))),
        prose_character_count: [...sourceCharacters].length,
        prose_character_sha256: sha(sourceCharacters),
        exact_prose_sequence: true,
        changes: item.changes,
        numeric_changes: item.numeric_changes,
      }
      lessonReport[name === 'lesson' ? 'proseOwners' : 'exercises'].push(row)
    }
    report.files.push(entry)
    if (name === 'lesson') {
      assert.deepEqual(current.data.errata, [])
      const flow = spawnSync(process.execPath, [flowTool, '--json', current.path], { encoding: 'utf8' })
      assert.equal(flow.status, 0, flow.stderr)
      const outline = JSON.parse(flow.stdout)
      lessonReport.prose_flow = {
        command: `${process.execPath} ${flowTool} --json ${current.path}`,
        paragraph_count: outline.paragraphs.length,
        boundaries: outline.boundaries,
      }
      const expectedBreaks = id.endsWith('n102') ? [3] : [5, 8]
      assert.deepEqual(outline.resolvedBreaks, expectedBreaks)
      if (id.endsWith('n103')) {
        assert.equal(outline.paragraphs.at(-1).blockIndex, 7)
        assert.equal(outline.paragraphs.at(-2).blockIndex, 7)
        lessonReport.worked_example = {
          owner: 8,
          source_refs: items[7].source_refs,
          full_statement_and_derivation_retained: true,
          remains_prose: true,
          candidate_seed_created: false,
        }
      } else {
        lessonReport.proof = {
          full_statement_and_proof_retained: true,
          remains_prose: true,
          candidate_seed_created: false,
          invented_exercises: 0,
        }
      }
    }
    if (name === 'exercises' && id.endsWith('n103')) {
      assert.deepEqual(items.map((item) => item.number), ['440', '441', '442', '443'])
      assert.deepEqual(items[0].lines.slice(1).map((line) => line.match(/^([1-3])\)/u)?.[1]), ['1', '2', '3'])
      assert.deepEqual(items[3].lines.slice(1).map((line) => line.match(/^([ab])\)/u)?.[1]), ['a', 'b'])
      assert.equal(items[2].text.includes('$v=Rt+a\\sqrt{t}$'), true)
      assert.equal(items[2].text.includes('所通过的路程'), true)
      assert.equal(items[2].text.includes('位移'), false)
      assert.deepEqual(items[3].changes, ['layout', 'orthography'])
      lessonReport.exercise_formatting = {
        '440': 'Prefix + 1), 2), 3), each on its own line; original order and scope',
        '441': 'Two complete original sentences on separate lines',
        '442': 'Two complete original sentences; no coefficient assumptions; path length unchanged',
        '443': 'Prefix + a), b), each on its own line; Cyrillic labels changed only in modern text',
      }
    }
  }
  lessonReport.total_prose_math_spans = lessonReport.proseOwners.reduce((sum, row) => sum + row.source_math_spans, 0)
  lessonReport.total_exercise_math_spans = lessonReport.exercises.reduce((sum, row) => sum + row.source_math_spans, 0)
  report.lessons.push(lessonReport)
}
console.log(JSON.stringify(report, null, 2))
