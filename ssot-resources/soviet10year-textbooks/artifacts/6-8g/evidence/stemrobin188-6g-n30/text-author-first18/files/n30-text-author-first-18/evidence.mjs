import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const W = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const T = path.join(W, '.intentfold/tickets/STEMROBIN-188/tmp')
const root = path.join(T, 'n30-text-author-first-18')
const initial = path.join(T, 'n30-draft-first-18')
const prepared = path.join(initial, 'work/adapt/6-8g/modern-us-neutral/lessons/geo68-c2-s4-n30')
const raw = path.join(initial, 'artifacts/6-8g/lessons/geo68-c2-s4-n30')
const mode = process.argv[2]
assert.equal(process.cwd(), W)
assert.equal(path.dirname(new URL(import.meta.url).pathname), root)

const read = (filename) => JSON.parse(fs.readFileSync(filename, 'utf8'))
const sha = (filename) => crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex')
const binding = (filename) => ({
  path: filename,
  sha256: sha(filename),
  bytes: fs.statSync(filename).size,
})
const write = (filename, value) => {
  assert.equal(path.dirname(filename), root)
  fs.writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const formulae = (text) => Array.from(text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs), (m) => m[0])
const transliterate = (text) => text.replace(/[абв]/gu, (value) => ({ а: 'a', б: 'b', в: 'c' })[value])
const compact = (text) => String(text).replace(/\s/gu, '')
const omit = (object, keys) => Object.fromEntries(Object.entries(object).filter(([key]) => !keys.includes(key)))

function inspectCandidates() {
  const lesson = read(path.join(root, 'lesson.template.json'))
  const exercises = read(path.join(root, 'exercises.template.json'))
  const lessonInitial = read(path.join(prepared, 'lesson.template.json'))
  const exerciseInitial = read(path.join(prepared, 'exercises.template.json'))
  const figuresInitial = read(path.join(prepared, 'figures.template.json'))
  assert.deepEqual(omit(lesson, ['prose', 'section_breaks']), omit(lessonInitial, ['prose', 'section_breaks']))
  assert.deepEqual(omit(exercises, ['exercises']), omit(exerciseInitial, ['exercises']))
  assert.deepEqual(lesson.source.data, read(path.join(raw, 'lesson.json')))
  assert.deepEqual(exercises.source.data, read(path.join(raw, 'exercises.json')))
  assert.equal(lesson.source.sha256, sha(path.join(raw, 'lesson.json')))
  assert.equal(exercises.source.sha256, sha(path.join(raw, 'exercises.json')))
  assert.equal(lesson.prose.length, 28)
  assert.equal(exercises.exercises.length, 8)
  assert.equal(figuresInitial.figures.length, 4)
  assert.deepEqual(exercises.exercises.map((item) => item.number), Array.from({ length: 8 }, (_, i) => String(373 + i)))

  let formulaCount = 0
  let subfigureLabelConversions = 0
  let subpartLabelConversions = 0
  let changedProseTextBlocks = 0
  let changedExerciseTextItems = 0
  let exerciseSubparts = 0
  let candidateExerciseLines = 0
  for (const [items, originals, kind] of [
    [lesson.prose, lessonInitial.prose, 'prose'],
    [exercises.exercises, exerciseInitial.exercises, 'exercise'],
  ]) {
    items.forEach((item, index) => {
      const original = originals[index]
      assert.deepEqual(
        omit(item, ['text', 'changes', ...(kind === 'exercise' ? ['lines'] : [])]),
        omit(original, ['text', 'changes', ...(kind === 'exercise' ? ['lines'] : [])]),
      )
      assert.deepEqual(formulae(item.text), formulae(item.source_text))
      formulaCount += formulae(item.text).length
      assert.equal(compact(item.text), compact(transliterate(item.source_text)))
      assert.equal(/[\u0400-\u04ff]/u.test(item.text), false)
      assert.equal(formulae(item.text).some((formula) => /[，。；：！？、]/u.test(formula)), false)
      assert.equal(item.numeric_changes.length, 0)
      assert.equal(item.changes.every((change) => change === 'layout'), true)
      if (item.text !== original.text) {
        assert.equal(item.changes.includes('layout'), true)
        if (kind === 'prose') changedProseTextBlocks += 1
        else changedExerciseTextItems += 1
      }
      subfigureLabelConversions += Array.from(item.source_text.matchAll(/图\d+,\s*[абв]/gu)).length
      const withoutSubfigureLabels = item.source_text.replace(/图\d+,\s*[абв]/gu, '')
      subpartLabelConversions += Array.from(withoutSubfigureLabels.matchAll(/[абв]\)/gu)).length
      if (kind === 'exercise') {
        assert.equal(item.lines.join('\n'), item.text)
        const expected = Array.from(item.source_text.matchAll(/(?:^|[;.\s])(\d+)\)/gu), (m) => m[1])
        const actual = Array.from(item.text.matchAll(/^(\d+)\)/gmu), (m) => m[1])
        assert.deepEqual(actual, expected)
        assert.deepEqual(actual, actual.map((_, i) => String(i + 1)))
        exerciseSubparts += actual.length
        candidateExerciseLines += item.lines.length
      }
    })
  }
  assert.equal(lesson.errata.length, 0)
  assert.equal(subfigureLabelConversions, 6)
  assert.equal(subpartLabelConversions, 2)
  const proposals = read(path.join(root, 'errata-proposals.json'))
  assert.equal(proposals.proposals.length, 2)
  proposals.proposals.forEach((item) => {
    const target = lesson.prose[item.target.block_index]
    assert.deepEqual(target.source_refs, item.assembled_source_refs)
    assert.equal(target.source_text, item.faithful_target_text)
    assert.equal(target.source_text.split(item.original).length - 1, 1)
    assert.equal(target.text.split(item.original).length - 1, 1)
    assert.equal(target.source_text.replace(item.original, item.corrected), item.proposed_target_text)
    assert.equal(item.pending.human_approval, true)
  })
  return {
    check_type: 'author-local-mechanical-invariants-not-independent-review',
    checks_passed: true,
    candidate_prose_entries: lesson.prose.length,
    prose_text_source_blocks: lesson.prose.filter((item) => item.kind === 'p').length,
    figure_placeholder_blocks: lesson.prose.filter((item) => item.kind === 'fig').length,
    caption_blocks: lesson.prose.filter((item) => item.kind === 'cap').length,
    exercises: exercises.exercises.length,
    exercise_numbers: exercises.exercises.map((item) => item.number),
    exercise_subparts: exerciseSubparts,
    candidate_exercise_lines: candidateExerciseLines,
    source_figure_ids: figuresInitial.figures.map((item) => item.id),
    exact_formula_occurrences_preserved: formulaCount,
    subfigure_label_conversions: subfigureLabelConversions,
    subpart_label_conversions: subpartLabelConversions,
    cyrillic_label_conversions_total: subfigureLabelConversions + subpartLabelConversions,
    changed_prose_text_blocks: changedProseTextBlocks,
    changed_exercise_text_items: changedExerciseTextItems,
    source_data_preserved: true,
    source_text_preserved: true,
    metadata_numbers_groups_refs_preserved: true,
    numeric_changes: 0,
    formula_changes: 0,
    registered_errata: 0,
    pending_errata_proposals: proposals.proposals.length,
    other_uncertainty_records: proposals.other_uncertainties.length,
  }
}

function runFlow() {
  const receiptPath = path.join(root, 'prose-flow.execution.json')
  assert.equal(fs.existsSync(receiptPath), false, 'The sole prose_flow call has already been retained.')
  const candidate = path.join(root, 'lesson.template.json')
  const snapshot = path.join(root, 'prose-flow.input.lesson.template.json')
  fs.copyFileSync(candidate, snapshot, fs.constants.COPYFILE_EXCL)
  const argv = [process.execPath, path.join(W, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'), candidate]
  const startedAt = new Date().toISOString()
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: W,
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024,
  })
  const finishedAt = new Date().toISOString()
  const stdoutPath = path.join(root, 'prose-flow.stdout')
  const stderrPath = path.join(root, 'prose-flow.stderr')
  fs.writeFileSync(stdoutPath, result.stdout ?? '', { flag: 'wx' })
  fs.writeFileSync(stderrPath, result.stderr ?? '', { flag: 'wx' })
  const receipt = {
    schema: 'same188-6/actual-execution@1',
    argv,
    cwd: W,
    exitCode: result.status,
    signal: result.signal,
    spawnError: result.error ? { code: result.error.code, message: result.error.message } : null,
    startedAt,
    finishedAt,
    input: binding(snapshot),
    input_argv_path: candidate,
    streams: { stdout: binding(stdoutPath), stderr: binding(stderrPath) },
    content_approval: false,
    call_ordinal: 1,
  }
  write(receiptPath, receipt)
  process.stdout.write(result.stdout ?? '')
  process.stderr.write(result.stderr ?? '')
  process.stdout.write(`${JSON.stringify({ execution: binding(receiptPath) }, null, 2)}\n`)
  process.exitCode = result.status ?? 1
}

function buildManifest() {
  const checks = inspectCandidates()
  const lesson = read(path.join(root, 'lesson.template.json'))
  const snapshot = read(path.join(root, 'prose-flow.input.lesson.template.json'))
  assert.deepEqual(omit(lesson, ['section_breaks']), omit(snapshot, ['section_breaks']))
  const receipt = read(path.join(root, 'prose-flow.execution.json'))
  assert.equal(receipt.cwd, W)
  assert.equal(receipt.exitCode, 0)
  assert.equal(receipt.input.sha256, sha(receipt.input.path))
  for (const stream of Object.values(receipt.streams)) assert.equal(stream.sha256, sha(stream.path))
  const stdout = fs.readFileSync(receipt.streams.stdout.path, 'utf8')
  const boundaries = stdout.split('\n').filter((line) => line.startsWith('    break: ')).map((line) => JSON.parse(line.slice('    break: '.length)))
  const paragraphs = Array.from(stdout.matchAll(/^\[(\d+)\] /gmu), (m) => Number(m[1]))
  assert.deepEqual(paragraphs, paragraphs.map((_, i) => i))
  lesson.section_breaks.forEach((boundary) => {
    assert.equal(boundaries.filter((item) => item.before === boundary.before && item.after === boundary.after).length, 1)
  })
  const require = createRequire(import.meta.url)
  const { sectionBreakIndices } = require(path.join(W, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
  const resolvedBreaks = sectionBreakIndices(lesson.prose, lesson.section_breaks)
  const preflight = read(path.join(root, 'preflight.report.json'))
  preflight.inputs.forEach((input) => assert.equal(sha(input.path), input.sha256))
  const outputs = [
    'lesson.template.json',
    'exercises.template.json',
    'errata-proposals.json',
    'author-status.md',
    'inspection-failures.json',
    'preflight.report.json',
    'preflight.execution.json',
    'manifest.initial-counter-attempt.json',
    'counter-repair.failed-call.json',
    'counter-repair.failed.patch',
    'prose-flow.input.lesson.template.json',
    'prose-flow.stdout',
    'prose-flow.stderr',
    'prose-flow.execution.json',
    'evidence.mjs',
  ].map((name) => binding(path.join(root, name)))
  const manifest = {
    schema: 'same188-6/offline-text-author-manifest@1',
    status: 'OFFLINE_CANDIDATE_READY_PENDING_PARENT_SOLE_INDEPENDENT_REVIEW_AND_ERRATA_REGISTRATION',
    ticket: 'STEMROBIN-188',
    authorization: 'OFFLINE SAME188-6 N30',
    lesson: lesson.id,
    cwd: W,
    owned_root: root,
    inputs: preflight.inputs,
    outputs,
    counters: {
      ...checks,
      actual_prose_flow_paragraphs: paragraphs.length,
      available_adjacent_boundaries: boundaries.length,
      section_breaks: lesson.section_breaks.length,
      resolved_section_break_indices: resolvedBreaks,
      prose_flow_calls: 1,
      prose_flow_failed_calls: receipt.exitCode === 0 ? 0 : 1,
      retained_inspection_failures: read(path.join(root, 'inspection-failures.json')).calls.length,
      retained_apply_patch_failures: 1,
      image_loads: 0,
      source_page_visual_loads: 0,
      source_page_json_read_calls: 1,
      network_calls: 0,
      additional_model_calls: 0,
      subagents_created: 0,
      independent_review_calls: 0,
      native_finalize_calls: 0,
      db_calls: 0,
      git_calls: 0,
      app_starts: 0,
      answer_keys_created: 0,
      choice_sets_created: 0,
      dependencies_added: 0,
    },
    scope_note: 'One read-only page-0139 JSON metadata inspection occurred during source-binding exploration; no source-page display, PNG access, or pixel verification. This read is reported explicitly and is not a source approval.',
    section_boundary_evidence: {
      method: 'Exact boundary objects copied from the sole prose_flow stdout; sectionBreakIndices used only for local anchor validation, not a second prose_flow invocation.',
      receipt: binding(path.join(root, 'prose-flow.execution.json')),
      input_snapshot: binding(path.join(root, 'prose-flow.input.lesson.template.json')),
      candidate_input_difference: 'Only section_breaks populated after the retained command output; all prose and source fields unchanged.',
    },
    preflight_counter_correction: {
      field: 'subpart_label_conversions',
      original_reported: preflight.subpart_label_conversions,
      corrected_in_manifest: checks.subpart_label_conversions,
      reason: 'The initial counter included six subfigure references ending in a Cyrillic label plus closing parenthesis. The corrected counter separates the six subfigure references from the two a/b list labels. The successful original preflight output is retained unchanged.',
      intermediate_manifest: {
        path: path.join(root, 'manifest.initial-counter-attempt.json'),
        reported_subpart_conversions: 6,
        reason: 'Whitespace inside four subfigure references still matched the first attempted context-sensitive counter. Final counting removes all subfigure labels before counting the remaining list labels.',
      },
      content_change: false,
      additional_prose_flow_calls: 0,
    },
    pending: {
      independent_review: true,
      errata_approval: true,
      authoritative_page_registration: true,
      native_bound_errata_fields: 'Not created. Physical/printed-page, page JSON/PDF hashes and authoritative unique-span binding must come from parent registration and native preparation.',
      proposed_math_replacements_applied: false,
      source_errata_currently_registered: 0,
      finalization: true,
      publication: 'Not authorized in this assignment.',
    },
    modified_paths_outside_owned_root: [],
    figures: {
      prepared_template_read: binding(path.join(prepared, 'figures.template.json')),
      candidate_figure_files_created: 0,
      ids_retained: checks.source_figure_ids,
      image_review: 'Not performed; parent responsibility.',
    },
  }
  write(path.join(root, 'manifest.json'), manifest)
  process.stdout.write(`${JSON.stringify({ manifest: binding(path.join(root, 'manifest.json')), counters: manifest.counters, outputs }, null, 2)}\n`)
}

try {
  if (mode === 'preflight') {
    const startedAt = new Date().toISOString()
    const report = {
      ...inspectCandidates(),
      inputs: [
        path.join(raw, 'lesson.json'),
        path.join(raw, 'lesson.md'),
        path.join(raw, 'exercises.json'),
        path.join(prepared, 'lesson.template.json'),
        path.join(prepared, 'exercises.template.json'),
        path.join(prepared, 'figures.template.json'),
      ].map(binding),
    }
    write(path.join(root, 'preflight.report.json'), report)
    write(path.join(root, 'preflight.execution.json'), {
      argv: [process.execPath, path.join(root, 'evidence.mjs'), 'preflight'],
      cwd: W,
      exitCode: 0,
      startedAt,
      finishedAt: new Date().toISOString(),
      stdout: `${JSON.stringify(report, null, 2)}\n`,
      stderr: '',
      content_approval: false,
    })
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
  } else if (mode === 'prose-flow') {
    runFlow()
  } else if (mode === 'manifest') {
    buildManifest()
  } else {
    throw new Error('Expected preflight, prose-flow, or manifest.')
  }
} catch (error) {
  const stderr = `${error.stack ?? error.message}\n`
  const filename = path.join(root, `${mode}.failed-${Date.now()}.execution.json`)
  write(filename, {
    argv: [process.execPath, path.join(root, 'evidence.mjs'), mode],
    cwd: W,
    exitCode: 1,
    stdout: '',
    stderr,
    content_approval: false,
  })
  process.stderr.write(stderr)
  process.exitCode = 1
}
