#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(root, '../../../../..')
const manifestPath = path.join(root, '../n62-modern-text-author-inputs-01/manifest.json')
const read = (filename) => JSON.parse(fs.readFileSync(filename, 'utf8'))
const manifest = read(manifestPath)
const plan = read(path.join(root, 'authoring-plan.json'))
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const binding = (filename) => {
  const bytes = fs.readFileSync(filename)
  return { path: filename, sha256: hash(bytes), bytes: bytes.length }
}
function write(filename, bytes) {
  const absolute = path.resolve(root, filename)
  if (!absolute.startsWith(root + path.sep)) throw new Error('Write outside ownroot')
  fs.mkdirSync(path.dirname(absolute), { recursive: true })
  fs.writeFileSync(absolute, bytes, { flag: 'wx' })
}
const json = (filename, value) => write(filename, JSON.stringify(value, null, 2) + '\n')
const relativeBinding = (filename) => {
  const result = binding(path.join(root, filename))
  return { ...result, path: filename }
}
const inputFiles = [
  manifestPath,
  manifest.rawLesson.path,
  manifest.rawExercises.path,
  ...manifest.initialTemplates.map((item) => item.path),
  manifest.figureContractsOnly.path,
  manifest.sourceAdmission.path,
  path.join(repo, '.claude/skills/ld-s10y-lesson/SKILL.md'),
  path.join(repo, '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md'),
  path.join(repo, '.claude/skills/ld-s10y-lesson/references/production-resume.md'),
  path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'),
  path.join(repo, '.claude/skills/ld-s10y-lesson/tools/edition.py'),
  path.join(repo, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'),
  path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'),
]

function command(stage, executable, args) {
  const directory = path.join(root, stage)
  if (fs.existsSync(directory)) throw new Error(`Existing stage must be reused, not rerun: ${stage}`)
  const result = spawnSync(executable, args, {
    cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  write(`${stage}/stdout.txt`, result.stdout ?? '')
  write(`${stage}/stderr.txt`, result.stderr ?? '')
  json(`${stage}/command.json`, {
    executable, args, cwd: repo, exit_code: result.status,
    signal: result.signal, technical_error: result.error?.message ?? null,
  })
  if (result.error || result.status !== 0) {
    throw new Error(`${stage} failed; saved exact command/stdout/stderr; no downstream output regenerated`)
  }
  return result.stdout
}

const mode = process.argv[2]
if (mode === 'author-initial') {
  const before = inputFiles.map(binding)
  json('input-bindings-before.json', before)
  const expected = [
    manifest.rawLesson, manifest.rawExercises, ...manifest.initialTemplates,
    manifest.figureContractsOnly, manifest.sourceAdmission,
  ]
  for (const item of expected) {
    if (before.find((value) => value.path === item.path)?.sha256 !== item.sha256) {
      throw new Error(`Bound input differs from manifest: ${item.path}`)
    }
  }
  const lesson = read(manifest.initialTemplates[0].path)
  const exercises = read(manifest.initialTemplates[1].path)
  for (const item of plan.objects) {
    const object = item.target.startsWith('prose[')
      ? lesson.prose[Number(item.target.slice(6, -1))]
      : exercises.exercises.find((value) => value.number === item.target.split(':')[1])
    object.text = item.text
    object.changes = item.changes
    object.numeric_changes = []
    object.historical_entities = []
    if (item.target.startsWith('exercise:')) object.lines = item.text.split('\n')
  }
  // This is a mechanical projection of apply_patch-authored text into unchanged input structures.
  json('lesson.template.json', lesson)
  json('exercises.template.json', exercises)
  for (const filename of ['lesson.template.json', 'exercises.template.json']) {
    write(`FIRST/${filename}`, fs.readFileSync(path.join(root, filename)))
    fs.chmodSync(path.join(root, 'FIRST', filename), 0o444)
  }
  json('FIRST/receipt.json', {
    status: 'FROZEN_BEFORE_FOCUSED_CHECKS',
    candidates: ['FIRST/lesson.template.json', 'FIRST/exercises.template.json'].map(relativeBinding),
    mode: '0444',
    initial_authored_candidate: true,
    initial_focused_check_runs: 0,
    prose_flow_runs: 0,
    content_repairs_used: 0,
    source_admission_repeated: false,
  })
  fs.chmodSync(path.join(root, 'FIRST/receipt.json'), 0o444)
  console.log('Initial candidates authored; FIRST snapshots frozen 0444; no checks run.')
} else if (mode === 'initial-flow') {
  const stdout = command('prose-flow-initial-01', process.execPath, [
    path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'),
    path.join(root, 'FIRST/lesson.template.json'),
  ])
  const paragraphs = []
  const boundaries = []
  let current = null
  for (const line of stdout.trimEnd().split('\n')) {
    const start = line.match(/^\[(\d+)\] (.*)$/)
    if (start) {
      current = { index: Number(start[1]), text: start[2] }
      paragraphs.push(current)
    } else if (line.startsWith('    break: ')) {
      boundaries.push(JSON.parse(line.slice('    break: '.length)))
      current = null
    } else if (current) {
      current.text += '\n' + line
    } else {
      throw new Error('Unrecognized saved prose_flow stdout; recover only extraction, not flow.')
    }
  }
  const switches = plan.section_switches.map((item) => {
    const matches = boundaries.filter((boundary) => boundary.after.startsWith(item.after_starts_with))
    if (matches.length !== 1) throw new Error('Concept switch is not uniquely present in saved flow.')
    return { meaning: item.meaning, boundary: matches[0] }
  })
  json('prose-flow-initial-01/saved-flow.json', {
    producer: 'prose_flow.mjs default stdout, called exactly once on frozen FIRST',
    stdout: relativeBinding('prose-flow-initial-01/stdout.txt'),
    candidate: relativeBinding('FIRST/lesson.template.json'),
    paragraphs, boundaries, selected_concept_switches: switches,
    selection_basis: 'Copy exact boundary JSON objects already printed by the saved producer; no handcomputed paragraph indices.',
    post_anchor_flow_runs: 0,
  })
  console.log(JSON.stringify({ paragraphs: paragraphs.length, concept_switches: switches }, null, 2))
} else if (mode === 'initial-focus') {
  const stdout = command('focused-author-initial-01', 'python3', [
    '-B', path.join(root, 'focused-author-check.py'),
  ])
  const check = JSON.parse(stdout)
  json('focused-author-initial-01/check.json', check)
  console.log(JSON.stringify({
    status: check.status, objects: check.objects.length,
    failures: check.objects.filter((item) => item.status !== 'PASS').map((item) => item.target),
    content_repairs_used: 0, independent_review_needed: true,
  }))
} else if (mode === 'report-seal') {
  const initial = read(path.join(root, 'FIRST/receipt.json'))
  const check = read(path.join(root, 'focused-author-initial-01/check.json'))
  const flow = read(path.join(root, 'prose-flow-initial-01/saved-flow.json'))
  const lesson = read(path.join(root, 'lesson.template.json'))
  const selected = flow.selected_concept_switches.map((item) => item.boundary)
  if (JSON.stringify(lesson.section_breaks) !== JSON.stringify(selected)) {
    throw new Error('Final anchors must be copied exactly from saved final flow.')
  }
  if (check.status !== 'PASS') throw new Error('Preserve initial failure; no report regeneration or approval')
  const before = read(path.join(root, 'input-bindings-before.json'))
  const after = inputFiles.map(binding)
  json('input-bindings-after.json', after)
  const unchanged = before.every((item, index) => item.sha256 === after[index].sha256)
  if (!unchanged) throw new Error('Input drift; preserve valid outputs and report only failed binding stage.')
  for (const filename of ['lesson.template.json', 'exercises.template.json']) {
    fs.chmodSync(path.join(root, filename), 0o444)
  }
  json('author-report.json', {
    schema: 'stemrobin188-n62-modern-text-author-report@1',
    ticket: 'STEMROBIN-188', assignment: 'SAME188-6',
    lesson: 'geo910-c2-s3-n62', edition: 'modern-us-neutral',
    role: 'N62 MODERN TEXT AUTHOR ONLY, NOT reviewer',
    status: 'AUTHORED_ONLY_INDEPENDENT_REVIEW_NEEDED',
    ownroot: root,
    object_counts: { prose: 13, figure_slots: 3, captions: 3, exercises: 7, all: 20 },
    outputs: ['lesson.template.json', 'exercises.template.json'].map(relativeBinding),
    final_template_mode: '0444',
    first: initial,
    initial_content_result: {
      status: check.status,
      evidence: relativeBinding('focused-author-initial-01/check.json'),
      failure: null, repair_snapshot: null,
      reason: 'No actual content/layout failure occurred; no content repair was made.',
    },
    counters: {
      initial_focused_author_checks: 1, unaffected_pass_reruns: 0,
      prose_flow_initial: 1, prose_flow_affected: 0, post_anchor_flow_reruns: 0,
      content_repairs_used: 0, content_repair_limit: 1,
      syntax_helper_runs: 0, images_created_or_read: 0, figure_review_runs: 0,
      source_review_or_approval_runs: 0, source_pipeline_reruns: 0,
      formal_project_checks: 0, native_parser_counter_render_adaptfinalize_runs: 0,
      answers_created_or_read: 0, network_dependency_paid_model_calls: 0,
      backend_db_credentials_peer_messages: 0,
      template_application_or_promotion: 0, commits_pushes_publication_merge_deploy_closure: 0,
      technical_failed_file_discovery_calls: 1, technical_file_discovery_recoveries: 1,
    },
    semantic_change_mapping: check.objects,
    numeric_changes: [], historical_entities: [],
    formula_policy: 'All ordered delimited math tokens are literally preserved per object and per subpart, not merely normalized-equivalent.',
    units_givens_and_objectives: 'No unit, quantity, given, context, grade, objective or requested operation was changed; no invented explanation, historical entity or answer added.',
    special_bindings: {
      proof: ['p0222#11', 'p0223#3'],
      proof_figure_slot: { id: 'fig-g10-91', source_refs: ['p0223#1'] },
      proof_caption: { text: '图 91', source_refs: ['p0223#2'] },
      exercise220: ['p0223#10', 'p0224#1'],
      exercise221: ['p0224#2'],
      exercise222_starred: ['p0224#3'],
      exercise222_math_split: 'Both original ordered tokens $S(2,$ and $-1,3)$ remain on the same complete first-subpart line; the signs, coordinates, R=4 and second-subpart R=\\sqrt{3} are unchanged.',
      exercise216_markers: ['1°)', '2°)'],
      exercise217_prefix: '217°.',
      raised_marker_identity: 'Plain question/subpart marker identity retained; no angle or math claim and no source codepoint re-review.',
      right_boundary_excluded: 'p0224#4 and all N63/source225 candidates remain outside this scope; no reads of their content or corrections.',
    },
    prose_flow: {
      command: relativeBinding('prose-flow-initial-01/command.json'),
      actual_stdout: relativeBinding('prose-flow-initial-01/stdout.txt'),
      actual_stderr: relativeBinding('prose-flow-initial-01/stderr.txt'),
      structured_final_flow: relativeBinding('prose-flow-initial-01/saved-flow.json'),
      paragraphs: flow.paragraphs,
      saved_boundaries: flow.boundaries,
      selected_concept_switches: flow.selected_concept_switches,
      final_anchors: lesson.section_breaks,
      final_text_flow_is_initial: true,
      no_post_anchor_flow_rerun: true,
    },
    input_bindings: {
      before: { file: relativeBinding('input-bindings-before.json'), bindings: before },
      after: { file: relativeBinding('input-bindings-after.json'), bindings: after },
      consumed_inputs_unchanged: unchanged,
      source_admission: 'Existing admission reused read-only; hash binding is not a new source approval.',
      unconsumed_manifest_bindings: 'Retained only in the input manifest; source-page payloads, source pixels, historical audit content and excluded/active peer roots were not opened.',
    },
    source_holds: {
      manifest: binding(manifestPath),
      json_pointer: '/sourceHolds',
      status: 'ALL_INHERITED_HOLDS_RETAINED_UNCHANGED',
      source222223_ids: manifest.sourceHolds.source222223.map((item) => item.id),
      source224_ids: manifest.sourceHolds.source224.map((item) => item.id),
      reason_preservation: 'Exact historic reasons remain in the bound read-only input manifest, not rewritten as new findings or used to provide excluded candidate mathematics.',
      current_admission_scope: 'Existing N62 readable-only admission is reused; font, panel, emphasis, punctuation and raised-marker HOLDs remain. No repeated source approval.',
    },
    holds_unchanged: true,
    historical_source224_crop_firstfail_and_repair1_of_1: 'PRESERVED_UNCHANGED; not counted against this author repair budget.',
    independent_review_holds: [
      'Independent modern-text semantic review still required; author cannot approve own semantics.',
      'Modern figures and their review are outside this text-only task.',
      'Source font, panel, emphasis, punctuation and raised-marker HOLDs remain held.',
      'No whole-lesson or product approval, template application/promotion or publication.',
    ],
    technical_receipts: {
      failed_read_command: relativeBinding('technical-read-01/command.json'),
      failed_read_stdout: relativeBinding('technical-read-01/stdout.txt'),
      failed_read_stderr: relativeBinding('technical-read-01/stderr.txt'),
      initial_focus_command: relativeBinding('focused-author-initial-01/command.json'),
      initial_focus_stdout: relativeBinding('focused-author-initial-01/stdout.txt'),
      initial_focus_stderr: relativeBinding('focused-author-initial-01/stderr.txt'),
      recovery: 'Only failed file-discovery stage recovered; valid input reads reused; no candidate or report regenerated after a failed content stage.',
    },
    author_self_semantic_approval: false,
    independent_review_still_needed: true,
    source_approval_repeated: false,
    templates_applied: false, whole_lesson_approved: false, published: false,
    collection: 'Parent COLLECTS + CLOSES this author before reading ownroot outputs.',
  })
  const inventory = []
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const filename = path.join(directory, entry.name)
      if (entry.isDirectory()) visit(filename)
      else {
        const relative = path.relative(root, filename)
        if (relative === 'output-index.json' || /(^|\/)(?:external-)?digest(?:\.[^/]*)?$/.test(relative)) continue
        const item = relativeBinding(relative)
        inventory.push({ path: relative, sha256: item.sha256, bytes: item.bytes })
      }
    }
  }
  visit(root)
  inventory.sort((left, right) => left.path.localeCompare(right.path, 'en'))
  json('output-index.json', { outputs: inventory })
  fs.chmodSync(path.join(root, 'output-index.json'), 0o444)
  console.log('externalSHA ' + binding(path.join(root, 'output-index.json')).sha256)
} else {
  throw new Error('Use author-initial, initial-flow, initial-focus, or report-seal')
}
