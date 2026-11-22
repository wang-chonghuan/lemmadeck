import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const own = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/appendix-s9-text-author-01')
const template = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/appendix-s9-draft-02/work/adapt/9-10g/modern-us-neutral/lessons/geo910-appendix-s9/lesson.template.json')
const raw = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/appendix-s9-draft-02/artifacts/9-10g/lessons/geo910-appendix-s9/lesson.json')
const tools = path.join(root, '.claude/skills/ld-s10y-lesson/tools')
if (process.cwd() !== root) throw new Error('wrong cwd')

const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const binding = file => ({ path: file, sha256: sha(fs.readFileSync(file)), bytes: fs.statSync(file).size })
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const output = (name, value) => fs.writeFileSync(path.join(own, name), `${JSON.stringify(value, null, 2)}\n`)
const receipts = []
function run(label, command, argv) {
  const startedAt = new Date().toISOString()
  const child = spawnSync(command, argv, {
    cwd: root, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const stdout = path.join(own, `${label}.stdout.json`)
  const stderr = path.join(own, `${label}.stderr.txt`)
  fs.writeFileSync(stdout, child.stdout ?? '')
  fs.writeFileSync(stderr, child.stderr ?? '')
  const receipt = {
    label, cwd: root, command, argv, startedAt, endedAt: new Date().toISOString(),
    exitCode: child.status, error: child.error?.message ?? null,
    streams: { stdout: binding(stdout), stderr: binding(stderr) },
    input: binding(argv.at(-1)), template: binding(template),
  }
  output(`${label}.execution.json`, receipt)
  receipts.push(receipt)
  if (child.status !== 0) throw new Error(`${label} failed: ${child.stderr || child.error}`)
  return { document: JSON.parse(child.stdout), path: stdout }
}

const phase = process.argv[2]
if (!['construct', 'verify'].includes(phase)) throw new Error('expected construct or verify')
if (phase === 'verify' && fs.existsSync(path.join(own, 'author-report.json'))) {
  throw new Error('author verification is single-use')
}
const normalized = run(`${phase}-normalize`, path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), [
  '-B', path.join(own, 'normalize_layout.py'), template,
])
const flow = run(`${phase}-flow`, 'node', [
  path.join(tools, 'prose_flow.mjs'), '--json', normalized.path,
])
if (phase === 'construct') {
  const headings = normalized.document.prose
    .filter(block => /^第[一二三四五]组\./u.test(block.text))
    .map(block => block.text)
  const boundaries = flow.document.paragraphs
    .filter(paragraph => headings.includes(paragraph.text)
      || paragraph.text.startsWith('上面列举的五组 17 个公理'))
    .map(paragraph => ({
      before: flow.document.paragraphs[paragraph.index - 1].text,
      after: paragraph.text,
    }))
  output('suggested-section-breaks.json', {
    derivation: 'native normalize_lesson_layout then prose_flow.mjs; adjacent published paragraphs, not raw block counts',
    input: binding(template), normalized: binding(normalized.path),
    flow: binding(flow.path), section_breaks: boundaries,
  })
  console.log(JSON.stringify({ normalized: normalized.path, paragraphs: flow.document.paragraphs, section_breaks: boundaries }, null, 2))
} else {
  const initial = load(path.join(own, 'lesson.template.initial.json'))
  const current = load(template)
  const source = load(raw)
  const checks = []
  const check = (name, ok, detail = null) => checks.push({ name, ok, detail })
  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b)
  const protectedDocument = document => {
    const clone = structuredClone(document)
    delete clone.section_breaks
    for (const block of clone.prose) {
      delete block.text
      delete block.changes
    }
    return clone
  }
  const maths = text => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)]
    .map(match => match[1] ?? match[2])
  const outside = text => text.replace(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs, '')
  const compact = text => text.replace(/\s/gu, '')
  const fullTokens = text => compact(text.replace(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs,
    (_, display, inline) => `$${display ?? inline}$`))
  const changed = []
  check('initial_backup_matches_observed_pre_edit_template_bytes',
    binding(path.join(own, 'lesson.template.initial.json')).sha256 === '1a2248708670b024a73d417a46ef1027cc5c69c0cdf0d4c0167b8087b954d8c9')
  check('protected_metadata_source_refs_snapshots_errata_identity_unchanged',
    equal(protectedDocument(initial), protectedDocument(current)))
  check('raw_source_hash_matches_retained_provenance', binding(raw).sha256 === initial.source.sha256)
  check('raw_source_snapshot_unchanged_and_matches_retained_source', equal(source, current.source.data))
  check('28_prose_blocks_zero_exercises_zero_figures', current.prose.length === 28
    && current.exercise_count === 0 && equal(current.figures, []) && current.prose.every(block => block.kind === 'p'))
  for (const [index, block] of current.prose.entries()) {
    const before = initial.prose[index]
    const edited = before.text !== block.text
    if (edited) changed.push({ blockIndex: index, source_refs: block.source_refs })
    check(`prose[${index}].all_ordered_words_punctuation_givens_domains_preserved`,
      compact(outside(before.text)) === compact(outside(block.text)))
    check(`prose[${index}].ordered_tex_bodies_byte_exact`, equal(maths(before.text), maths(block.text)))
    check(`prose[${index}].word_math_interleaving_unchanged`, fullTokens(before.text) === fullTokens(block.text))
    check(`prose[${index}].changes_layout_only`, equal(block.changes, edited ? ['layout'] : before.changes))
  }
  const indices = document => document.prose.flatMap(block => maths(block.text))
    .filter(tex => /^\\mathrm\{[IV]+\}_\d+$/u.test(tex))
  const expectedIndices = [['I', 4], ['II', 4], ['III', 4], ['IV', 2], ['V', 3]]
    .flatMap(([group, count]) => Array.from({ length: count }, (_, index) => `\\mathrm{${group}}_${index + 1}`))
  check('all_five_group_identities_and_17_axiom_indices', equal(indices(current), expectedIndices)
    && equal(indices(initial), indices(current))
    && equal(initial.prose.filter(block => /^第[一二三四五]组\./u.test(block.text)).map(block => block.text),
      current.prose.filter(block => /^第[一二三四五]组\./u.test(block.text)).map(block => block.text)))
  check('weyl_kolmogorov_and_history_verbatim', compact(initial.prose.at(-1).text) === compact(current.prose.at(-1).text))
  check('no_actual_cyrillic_panel_lettering_in_scoped_text', !current.prose.some(block => /[\u0400-\u04ff]/u.test(block.text)))
  check('authored_layout_matches_actual_native_normalized_text',
    current.prose.every((block, index) => block.text === normalized.document.prose[index].text))
  const suggestions = load(path.join(own, 'suggested-section-breaks.json'))
  check('anchors_copied_from_native_normalized_flow', equal(current.section_breaks, suggestions.section_breaks))
  check('normalized_anchor_validation_once_six_unique_adjacent_pairs',
    flow.document.resolvedBreaks.length === 6
    && equal(flow.document.boundaries.map(({ before, after }) => ({ before, after })), current.section_breaks))
  check('native_normalized_outline_matches_retained_construction_flow',
    equal(flow.document.paragraphs, load(path.join(own, 'construct-flow.stdout.json')).paragraphs))
  const constructionReceipts = ['construct-normalize', 'construct-flow']
    .map(label => load(path.join(own, `${label}.execution.json`)))
  const failures = checks.filter(item => !item.ok)
  const report = {
    schema: 's9-text-author-report@1', ticket: 'STEMROBIN-188', assignment: 'SAME188-6/S9',
    cwd: root, role: 'modern-text-author-only', status: failures.length ? 'LOCAL_HOLD' : 'AUTHOR_COMPLETE_REVIEW_PENDING',
    independent_pass: false, whole_lesson_approval: false,
    source_review: {
      status: 'pending', title_location_as_handed_off: 'physical 320 p0320#7 through physical 322',
      source321_322_and_323_title_boundary: 'independent review in flight; not read or assumed approved',
      pixels_opened: 0, reviewer_outputs_read: 0,
    },
    local_semantic_holds: [], mathematical_corrections: 0,
    layout: {
      changed_blocks: changed, display_formulas: current.prose.reduce((count, block) => count + [...block.text.matchAll(/\$\$(.+?)\$\$/gs)].length, 0),
      actual_native_normalized_paragraphs: flow.document.paragraphs.length,
      section_breaks: flow.document.boundaries,
      cyrillic_conversions: 0, historical_entities_metadata: 'unchanged under layout-only authorization; no new history declarations',
      normalization_adjustments_before_verification: 'recorded by construction output, not a failed acceptance check',
    },
    counts: {
      author_invariant_runs: 1, normalized_anchor_validation_runs: 1,
      failed_checks: failures.length, failed_calls: [...constructionReceipts, ...receipts].filter(receipt => receipt.exitCode !== 0).length,
      content_repair_count: 0, technical_repair_count: 0,
      native_normalization_calls: 2, native_flow_calls: 2,
      flow_call_purposes: ['unanchored construction from native normalized text', 'single final normalized anchor validation'],
    },
    bindings: {
      initial_template: binding(path.join(own, 'lesson.template.initial.json')), template: binding(template),
      raw_lesson: binding(raw), suggested_section_breaks: binding(path.join(own, 'suggested-section-breaks.json')),
      normalized_final: binding(normalized.path), normalized_flow: binding(flow.path),
      author_script: binding(path.join(own, 'author_evidence.mjs')),
      normalization_script: binding(path.join(own, 'normalize_layout.py')),
      native_normalizer: binding(path.join(tools, 'edition.py')),
      native_flow_helper: binding(path.join(tools, 'prose_flow.mjs')),
      native_paragraph_helper: binding(path.join(tools, 'htmlfrag.js')),
      text_contract: binding(path.join(root, '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md')),
      production_resume: binding(path.join(root, '.claude/skills/ld-s10y-lesson/references/production-resume.md')),
    },
    initial_backup_execution: {
      cwd: root, command: 'cp', argv: ['-p', template, path.join(own, 'lesson.template.initial.json')],
      exitCode: 0, saved_before_first_template_edit: true,
      pre_edit_template_and_backup_sha256: '1a2248708670b024a73d417a46ef1027cc5c69c0cdf0d4c0167b8087b954d8c9',
      hash_comparison_command: 'shasum',
      hash_comparison_argv: ['-a', '256', template, path.join(own, 'lesson.template.initial.json')],
      hash_comparison_exitCode: 0,
    },
    checks, failures, receipts: [...constructionReceipts, ...receipts],
    forbidden_stages_not_run: ['source pixel review', 'images', 'questions', 'answers', 'choices', 'DB', 'Plane', 'Git', 'other chats', 'services', 'subagents', 'setup', 'freshness', 'Grill', 'adapt-finalize', 'render', 'publication'],
  }
  output('author-report.json', report)
  const text = [
    `S9 modern text author: ${report.status}`, `cwd: ${root}`, 'No independent PASS or whole-lesson approval.',
    'Source321/322 and323-title boundary review remains pending; no pixels or reviewer outputs read.',
    `Changed prose blocks: ${changed.length}; native normalized paragraphs: ${flow.document.paragraphs.length}; display formulas: ${report.layout.display_formulas}; conceptual boundaries: ${flow.document.boundaries.length}.`,
    'All wording, formula bodies, axiom indices, group identities, historical statements, source_refs, provenance, snapshots, title, errata and zero-exercise/zero-figure state retained.',
    `Author invariant runs: 1; normalized anchor validations: 1; failures: ${failures.length}; content repairs: 0; technical repairs: 0.`,
    'No actual Cyrillic panel lettering in scoped text; no substitutions. Historical declarations metadata unchanged under layout-only scope.',
    'Local semantic holds identified by author: none. This is not a source/math reviewer verdict.',
    ...Object.entries(report.bindings).map(([name, item]) => `${name}: ${item.path}\nsha256: ${item.sha256}`),
  ].join('\n') + '\n'
  fs.writeFileSync(path.join(own, 'author-report.txt'), text)
  output('delivery-hashes.json', {
    cwd: root, status: report.status,
    template: binding(template), report_json: binding(path.join(own, 'author-report.json')),
    report_text: binding(path.join(own, 'author-report.txt')),
  })
  console.log(JSON.stringify(load(path.join(own, 'delivery-hashes.json')), null, 2))
  if (failures.length) process.exitCode = 2
}
