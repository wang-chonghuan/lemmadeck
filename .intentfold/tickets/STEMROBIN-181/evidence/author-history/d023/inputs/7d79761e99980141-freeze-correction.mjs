import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(import.meta.filename)
const tmp = path.dirname(out)
const oldDir = path.join(tmp, 'd023-source220-223-author')
const initialFile = path.join(tmp, 'd023-source220-223-source-review.json')
const priorFile = path.join(tmp, 'd022-source216-219-correction/independent-affected-review.json')
const freezeFile = path.join(oldDir, 'author-freeze.json')
const initialSHA = 'b4a1e81d355cb0f5d713f021ccfd72eb7a48c25c030e60fc456c82dad0548073'
const priorSHA = 'dc55350274504076a138affb0458bb3b1040ae6cb678d5edb010208389cadd2d'
const summaryFreezeSHA = '120a7756c56c31e3239bd51b51c284a87b891ac208c74ea4697d3a6db5e78ce3'
const nativeDir = path.join(root, '.tmp/ld-s10y-lesson/9p/pages')
const layoutFile = path.join(nativeDir, '0220/layout.json')
const candidate220 = path.join(oldDir, '0220.page.md')
const incoming219 = path.join(oldDir, 'bound-inputs/incoming-0219.page.md')
const corrected219 = path.join(out, '0219.page.md')
const helper = path.join(out, 'affected-counts.py')
const skill = path.join(root, '.claude/skills/ld-s10y-lesson')
const python = path.join(skill, '.venv/bin/python')
const reason = `INITIAL SOURCE C220-01 report SHA256 ${initialSHA} identifies saved native24th band y2151-2173 as a black scan corner, not a printed row. Existing native symmetric edge_margin_px100 excludes x0-99 and x1404-1503 in the counting copy only; all23 legitimate rows and footer211 remain for independent affected review. No source pixels or candidate bytes changed; author opens zero images.`
const boundaryNote = `Ten small-font biographical caption rows accompany the portrait: nine beside it, then the final row spans below it. They are cap \u6b27\u59c6, not an exercise, and not samerow with preceding large-font body text. Reuse independent S219-01 period PASS from prior219 affected SOURCE report SHA256 ${priorSHA}; the final row still ends \u5173\u7cfb. INITIAL220 observation B219-220-01 from report SHA256 ${initialSHA} establishes ordinary resistance prose and no biography continuation on220. Remove only the unsupported cap open token; no219 glyph re-review, image open, recount or portrait change. Boundary flag/note correction awaits independent affected review; no source89, closed-caption approval or complete-card claim.`
const sha = data => crypto.createHash('sha256').update(data).digest('hex')
const bind = file => {
  const data = fs.readFileSync(file)
  return { path: path.resolve(file), sha256: sha(data), bytes: data.length }
}
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const save = (name, data) => {
  const file = path.resolve(out, name)
  assert(file.startsWith(`${out}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, data, { flag: 'wx' })
  return bind(file)
}
const json = (name, value) => save(name, `${JSON.stringify(value, null, 2)}\n`)
const assertBound = entry => {
  const actual = bind(entry.path)
  assert.equal(actual.sha256, entry.sha256, entry.path)
  if (entry.bytes !== undefined) assert.equal(actual.bytes, entry.bytes, entry.path)
}
const split = text => {
  assert(text.startsWith('---\n'))
  const end = text.indexOf('\n---\n', 4)
  assert(end > 4)
  return { meta: JSON.parse(text.slice(4, end)), body: text.slice(end + 5) }
}
const uniqueReplace = (text, before, after) => {
  assert.equal(text.split(before).length, 2, 'Unique exact replacement required.')
  return text.replace(before, after)
}

assert.equal(bind(initialFile).sha256, initialSHA, 'Pinned INITIAL report bytes.')
assert.equal(bind(priorFile).sha256, priorSHA)
const initial = load(initialFile)
assert.equal(initial.bindings.author_freeze.path, freezeFile)
assertBound(initial.bindings.author_freeze)
const original = load(freezeFile)
const prior = load(priorFile)
const savedFile = path.join(oldDir, 'author-counts.stdout.json')
assertBound(initial.bindings.saved_native_counts)
assertBound(initial.bindings.incoming219_text)
assertBound(initial.bindings.prior219_affected_SOURCE_review)
const saved = load(savedFile)
const p220 = initial.pages.find(item => item.pdf_page === 220)
const oldCount220 = saved.pages.find(item => item.pdf_page === 220)
assert.deepEqual(p220.physical_rows.false_band_y, [2151, 2173])
assert.equal(p220.physical_rows.independent_visual_rows, 23)
assert.equal(oldCount220.native_masked_rows, 24)
assert.equal(oldCount220.candidate_rows, 23)
const boundary = initial.affected_correction_handoff.find(item => item.id === 'B219-220-01')
assert.equal(boundary.source220_side_result, 'pass-no-biography-continuation')
const prior219 = prior.effective_pages.find(item => item.pdf_page === 219)
assert.equal(prior219.status, 'pass')
assert(prior219.resolved_findings.includes('S219-01'))
assert.equal(prior219.sha256, bind(incoming219).sha256)

if (process.argv[2] === 'bind-before-edit') {
  assert(!fs.existsSync(path.join(out, 'before-freeze.json')), 'No binding replay.')
  assert(!fs.existsSync(corrected219), 'Before candidate creation.')
  const oldPreflightFile = path.join(oldDir, 'bindings-before-native-call.json')
  const previous = load(oldPreflightFile)
  const helpers = ['p2c.py', 'blocks.py', 'layout.py', 'normalize.py', 'mathcheck.py']
    .map(name => original.exactBindings.find(item => item.path === path.join(skill, 'tools', name)))
  assert(helpers.every(Boolean))
  const receipts = original.exactBindings.filter(item => (
    item.path.startsWith(`${oldDir}/`) && (
      /\/prepare-\d+\.(json|stdout\.txt|stderr\.txt)$/.test(item.path)
      || /\/(author-counts\.(stdout\.json|stderr\.txt|command\.json)|preparation-checkpoint\.json|native-memory-geometry\.json)$/.test(item.path)
    )
  ))
  const preservedLayout = original.exactBindings.find(item => (
    item.path === path.join(oldDir, 'bound-inputs/prepared/220/layout.json')
  ))
  assert(preservedLayout)
  const paths = new Map([
    ...previous.bindings, ...helpers, ...receipts, preservedLayout,
    ...[initialFile, priorFile, freezeFile, oldPreflightFile, incoming219].map(bind),
  ].map(entry => [entry.path, entry]))
  const preserved = [...paths.values()]
  preserved.forEach(assertBound)
  assert(!Object.hasOwn(load(layoutFile), 'counting'))
  assert.equal(bind(layoutFile).sha256, preservedLayout.sha256)
  const runtimeFiles = [
    fs.realpathSync(process.execPath), fs.realpathSync(python),
    ...Object.values(saved.runtime.dependencies).map(item => item.entrypoint),
  ].map(bind)
  const before = json('before-freeze.json', {
    schema: 'STEMROBIN-181/d023-source-correction-before@1',
    role: 'metadata-author-only',
    owning_initial_report: bind(initialFile), owning_prior219_report: bind(priorFile),
    original_author_freeze: bind(freezeFile),
    author_freeze_hash_authority: 'Actual file verified against pinned INITIAL.bindings.author_freeze; no report substitution.',
    supplied_summary_freeze_sha256: summaryFreezeSHA,
    supplied_summary_consistent: summaryFreezeSHA === bind(freezeFile).sha256,
    prior_input_bindings_reused_from: bind(oldPreflightFile),
    preserved_bindings: preserved,
    before220_candidate: bind(candidate220), before220_layout: bind(layoutFile),
    original220_layout_bytes_reused_at: preservedLayout,
    before219_candidate: bind(incoming219),
    runtime: {
      prior_identity_reused_from: bind(savedFile), prior_identity: saved.runtime,
      specific_current_binary_and_dependency_entrypoint_bindings: runtimeFiles,
      node_version: process.version, invoked_python: python,
      all_runtime_enumeration_or_copy: false,
    },
    manual_edits_allowed: [corrected219, layoutFile],
    literal220_candidate_edit_allowed: false,
    author_image_opens: 0, native_counts_so_far: 0,
    original_captures_copied: false,
  })
  console.log(JSON.stringify({ before }, null, 2))
} else if (process.argv[2] === 'measure') {
  assert(!fs.existsSync(path.join(out, 'bindings-before-native-call.json')), 'No count replay.')
  const beforeFile = path.join(out, 'before-freeze.json')
  const before = load(beforeFile)
  const immutable = before.preserved_bindings.filter(item => item.path !== layoutFile)
  immutable.forEach(assertBound)
  before.runtime.specific_current_binary_and_dependency_entrypoint_bindings.forEach(assertBound)
  assertBound(before.before220_candidate)
  const oldLayoutText = fs.readFileSync(before.original220_layout_bytes_reused_at.path, 'utf8')
  const currentLayoutText = fs.readFileSync(layoutFile, 'utf8')
  const insertion = `  "counting": {\n    "edge_margin_px": 100,\n    "reason": ${JSON.stringify(reason)}\n  },\n`
  assert.equal(currentLayoutText, uniqueReplace(oldLayoutText, '  "line_bands": [\n', `${insertion}  "line_bands": [\n`))
  assert.deepEqual(load(layoutFile), { ...JSON.parse(oldLayoutText), counting: { edge_margin_px: 100, reason } })
  const old219Text = fs.readFileSync(incoming219, 'utf8')
  const current219Text = fs.readFileSync(corrected219, 'utf8')
  const old219 = split(old219Text)
  const current219 = split(current219Text)
  const oldFlag = '<!-- cap \u6b27\u59c6 open -->'
  const newFlag = '<!-- cap \u6b27\u59c6 -->'
  const expected219 = uniqueReplace(
    uniqueReplace(old219Text, JSON.stringify(old219.meta.notes[3]), JSON.stringify(boundaryNote)),
    oldFlag, newFlag,
  )
  assert.equal(current219Text, expected219, 'Only exact note and flag changes; no glyph edits.')
  const expectedMeta = structuredClone(old219.meta)
  expectedMeta.notes[3] = boundaryNote
  assert.deepEqual(current219.meta, expectedMeta)
  assert.equal(current219.body, uniqueReplace(old219.body, oldFlag, newFlag))
  assert(current219.body.includes('\u53d1\u73b0\u4e86\u7535\u963b\u4e0e\u5bfc\u4f53\u7684\u957f\u5ea6\u53ca\u5176\u6a2a\u622a\u9762\u79ef\u7684\u5173\u7cfb.\n'))
  const line = (text, needle) => text.split('\n').findIndex(item => item.includes(needle)) + 1
  const diff = json('structured-diff.json', {
    schema: 'STEMROBIN-181/d023-exact-source-correction-diff@1',
    owning_initial_report: bind(initialFile), owning_prior219_report: bind(priorFile),
    page220: {
      finding: 'C220-01', before_candidate: before.before220_candidate,
      current_candidate: bind(candidate220), exact_candidate_bytes_unchanged: true,
      before_layout: before.before220_layout, current_layout: bind(layoutFile),
      original_layout_bytes: before.original220_layout_bytes_reused_at,
      delta: { field: 'counting', before: null, after: load(layoutFile).counting },
      inserted_before_original_line: line(oldLayoutText, '"line_bands"'),
      inserted_lines: insertion.trimEnd().split('\n'),
      existing_layout_bands_dimensions_content_width_unchanged: true,
      false_band_y_inclusive: [2151, 2173],
      original_saved_candidate_native: [23, 24], expected_affected_candidate_native: [23, 23],
    },
    page219: {
      finding: 'B219-220-01', before_candidate: bind(incoming219), current_candidate: bind(corrected219),
      deltas: [
        { field: 'notes[3]', old_line: line(old219Text, old219.meta.notes[3]), new_line: line(current219Text, boundaryNote), before: old219.meta.notes[3], after: boundaryNote },
        { field: 'caption-open-flag', old_line: line(old219Text, oldFlag), new_line: line(current219Text, newFlag), before: oldFlag, after: newFlag },
      ],
      exact_expected_bytes_match: true, glyphs_rows_portrait_other_metadata_unchanged: true,
      prior_S219_01_period_pass_reused: true, saved_counts_reused: [27, 27],
      recount: false, new_glyph_review: false,
    },
    untouched_pages: [221, 222, 223], untouched_native_metadata_and_candidates: true,
    independent_affected_review: 'required-later-not-performed',
  })
  const command = [python, '-B', helper]
  const boundFiles = [
    ...immutable, bind(layoutFile), bind(corrected219), bind(beforeFile), diff,
    bind(import.meta.filename), bind(helper),
    ...before.runtime.specific_current_binary_and_dependency_entrypoint_bindings,
  ]
  const preflight = json('bindings-before-native-call.json', {
    schema: 'STEMROBIN-181/d023-affected-count-preflight@1',
    command, cwd: root, bound_files: boundFiles,
    runtime: before.runtime,
    pages_counted_once: [220], pages_not_prepared_or_recounted: [219, 221, 222, 223],
    effective_counting_meta: 'Unchanged220 candidate meta plus scratch220 layout.counting, in memory only.',
    native_APIs: ['blocks.load', 'blocks.printed_lines', 'layout.ink_mask', 'p2c._counting_line_bands', 'layout.line_bands'],
    exact_mask_capture: 'Return-frame ink from native layout.line_bands; lossless packed binary, no image generation.',
    author_image_opens: 0, image_decodes_for_count_only: 1, screenshots_crops: 0,
  })
  boundFiles.forEach(assertBound)
  json('count-attempt-started.json', { command, pages: [220], attempts: 1, retry_allowed: false })
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    timeout: 180000, maxBuffer: 4 * 1024 * 1024,
  })
  const stdout = save('author-counts.stdout.json', result.stdout ?? Buffer.alloc(0))
  const stderr = save('author-counts.stderr.txt', result.stderr ?? Buffer.alloc(0))
  const invocation = json('author-counts.command.json', {
    command, cwd: root, exit_code: result.status, signal: result.signal,
    error: result.error?.message ?? null, process_finished: true,
    native_count_invocations: 1, count_pages: [220], stdout, stderr,
  })
  const after = boundFiles.map(entry => {
    const current = bind(entry.path)
    return { before: entry, current, unchanged: current.sha256 === entry.sha256 && current.bytes === entry.bytes }
  })
  const afterFile = json('bindings-after-native-call.json', {
    schema: 'STEMROBIN-181/d023-affected-count-postflight@1',
    input_bindings: after, stdout, stderr, invocation,
  })
  const report = result.status === 0 ? JSON.parse(result.stdout) : null
  const blockers = []
  if (!report) blockers.push('Native count failed; no retry permitted.')
  if (after.some(item => !item.unchanged)) blockers.push('Bound input changed during invocation.')
  if (report && !(report.candidate_rows === 23 && report.native_masked_rows === 23)) blockers.push('Expected23/23 not met; no retry permitted.')
  if (report && !report.only_false_saved_band_removed) blockers.push('Saved band delta differs from exactly y2151-2173.')
  if (report && !report.false_band_final_mask_clear) blockers.push('False band retains ink in exact native final mask.')
  if (report) {
    assertBound(report.trace)
    assertBound(report.exact_counter_mask.file)
    assert.equal(report.runtime.version, saved.runtime.version)
    assert.equal(report.runtime.executable, saved.runtime.executable)
    assert.deepEqual(report.runtime.dependencies, saved.runtime.dependencies)
  }
  const reviewAssignment = json('affected-review-assignment.json', {
    schema: 'STEMROBIN-181/d023-affected-review-assignment@1',
    status: 'independent-affected-review-required-not-performed',
    owning_initial_report: bind(initialFile), owning_prior219_report: bind(priorFile),
    structured_diff: diff, corrected219_candidate: bind(corrected219),
    unchanged220_candidate: bind(candidate220), current220_layout: bind(layoutFile),
    saved_count_output: stdout, exact_native_mask: report?.exact_counter_mask ?? null,
    checks: [
      'C220-01: exact saved native counter mask retains23 legitimate rows/footer211 and removes only the false24th saved band y2151-2173.',
      'B219-220-01: verify only incoming219 cap open token and provisional continuation note changed; reuse prior219 S219-01 period PASS and INITIAL220 observation.',
      'Do not recertify219 glyphs, recount219/221-223, replay full INITIAL, or infer crop/geometry/science/source89/card completion.',
    ],
    author_image_opens: 0, new_images_screenshots_crops: 0,
    other_chat_or_children_dispatched: false,
  })
  const correction = json('correction.json', {
    schema: 'STEMROBIN-181/d023-source-correction-freeze@1',
    ticket: 'STEMROBIN-181', role: 'AUTHOR-metadata-only',
    status: blockers.length ? 'frozen-with-blockers-no-retry' : 'frozen-pending-independent-affected-review',
    ownership: { directory: out, only_external_write: layoutFile },
    owning_initial_report: bind(initialFile), owning_prior219_report: bind(priorFile),
    original_author_freeze: bind(freezeFile),
    freeze_hash_authority: 'Pinned INITIAL.bindings.author_freeze checked against actual original file.',
    summary_freeze_sha_consistent: before.supplied_summary_consistent,
    before_freeze: bind(beforeFile), structured_diff: diff,
    before_current: {
      page220_candidate: { before: before.before220_candidate, current: bind(candidate220), unchanged: true },
      page220_layout: { before: before.before220_layout, current: bind(layoutFile), original_bytes: before.original220_layout_bytes_reused_at },
      page219_candidate: { before: before.before219_candidate, current: bind(corrected219), glyphs_unchanged: true },
    },
    native_count: {
      invocation, preflight, postflight: afterFile, saved_output: stdout,
      pdf_page: 220, attempts: 1,
      saved_candidate_rows: report?.candidate_rows ?? null,
      saved_native_rows: report?.native_masked_rows ?? null,
      only_false_saved_band_removed: report?.only_false_saved_band_removed ?? false,
      exact_counter_mask: report?.exact_counter_mask ?? null, trace: report?.trace ?? null,
    },
    reused219: {
      prior_report: bind(priorFile), initial220_report: bind(initialFile),
      findings: ['S219-01', 'B219-220-01'], saved_candidate_native: [27, 27],
      saved_counts_reference: prior.bindings.saved_original_counts,
      recount: false, new_glyph_certification: false,
    },
    unchanged221_223: initial.pages.filter(item => item.pdf_page !== 220).map(item => ({
      pdf_page: item.pdf_page, candidate: item.candidate,
      native_layout: before.preserved_bindings.find(entry => entry.path === path.join(nativeDir, `${item.pdf_page.toString().padStart(4, '0')}/layout.json`)),
      saved_candidate_rows: item.physical_rows.saved_candidate_rows,
      saved_native_rows: item.physical_rows.saved_native_rows,
      prior_INITIAL_scope_reused: true, preparation_replay: false, recount: false,
    })),
    original_freeze_reports_candidates_and_unaffected_native_bytes_preserved: after.every(item => item.unchanged),
    runtime: before.runtime, helper_bindings: [bind(import.meta.filename), bind(helper)],
    procedure: {
      model_visible_image_opens: 0, native220_decode_for_count_only: report ? 1 : null,
      screenshots_crops_new_images: 0, durable_source_writes: false,
      finalizer_vectorize_assemble: false, native_snap_calls: 0,
      product_app_dependency_DB_Git_full_tests: false, other_chats_children: false,
      all_runtime_enumeration_or_copy: false, large_capture_recreation: false,
    },
    affected_review_assignment: reviewAssignment, blockers,
    approval_claims: {
      independent_affected_review_performed: false, SOURCE_completion: false,
      source89_or_complete_card: false, closed_caption_approval: false,
      SCI_or_crop_or_geometry: false,
    },
    frozen_policy: 'Write once; no recount or author re-review. Independent affected review is required later.',
  })
  console.log(JSON.stringify({
    correction, structured_diff: diff, corrected219: bind(corrected219),
    current220_layout: bind(layoutFile), saved_counts: stdout, blockers,
  }, null, 2))
  if (blockers.length) process.exitCode = 1
} else {
  throw new Error('Use bind-before-edit once, manual apply_patch edits, then measure once.')
}
