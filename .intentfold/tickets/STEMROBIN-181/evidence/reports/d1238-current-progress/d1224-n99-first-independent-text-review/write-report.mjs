import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = process.cwd();
assert.equal(repo, '/Users/yong/.codex/worktrees/00b1/lemmadeck');
const owned = path.join(repo, 'tmp/d1224-n99-first-independent-text-review');
const ticket = '.intentfold/tickets/STEMROBIN-181';
const author = `${ticket}/tmp/d1212-n99-two-errata-repair`;
const original = `${ticket}/tmp/d1204-n99-first-bilingual-text-author`;
const hash = (filename) => crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex');
const read = (filename) => JSON.parse(fs.readFileSync(path.resolve(repo, filename), 'utf8'));
const binding = (filename) => ({
  path: path.resolve(repo, filename),
  sha256: hash(path.resolve(repo, filename)),
  bytes: fs.statSync(path.resolve(repo, filename)).size,
});
const reportPath = `${author}/report.json`;
assert.equal(hash(reportPath), 'a421cb31c010f2387bb41cf9220d4f6dd5fea61934d37acd5398e50bdb7c8660');
const authorReport = read(reportPath);
const freeze = read(path.join(owned, 'inventory-freeze.json'));
assert.equal(hash(freeze.inventory.path), freeze.inventory.sha256);
const inventory = read(freeze.inventory.path);
assert.equal(inventory.independence.author_materials_opened_before_freeze, false);
const judgmentPath = path.join(owned, 'semantic-review.json');
const judgment = read(judgmentPath);
assert.equal(judgment.coverage.length, 19);
const raw = read(authorReport.rawSource.lesson.path);
const rawExercises = read(authorReport.rawSource.exercises.path);
assert.equal(hash(authorReport.rawSource.lesson.path), inventory.inputs[1].sha256);
assert.equal(hash(authorReport.rawSource.exercises.path), inventory.inputs[2].sha256);
const receipts = [];
for (const item of [
  authorReport.baseline.nativeTextReceipt,
  authorReport.nativeAffectedCheck.receipt,
  authorReport.nativeSourceErrataBinding.receipt,
]) {
  assert.equal(hash(item.path), item.sha256);
  const receipt = read(item.path);
  assert.equal(receipt.exitCode, 0);
  assert.equal(hash(receipt.stdout.path), receipt.stdout.sha256);
  const output = read(receipt.stdout.path);
  if (!Array.isArray(output)) {
    assert.equal(output.status, 'pass');
    assert.deepEqual(output.errors, []);
  }
  receipts.push({
    receipt: binding(item.path),
    stdout: binding(receipt.stdout.path),
    exit_code: 0,
    observed_status: Array.isArray(output) ? 'two canonical source-bound records' : output.status,
    executed_in_this_review: false,
    historical_scope: receipt.scope ?? 'D1204 FIRST mechanical text contract',
  });
}
const rawBindings = [binding(authorReport.rawSource.lesson.path), binding(authorReport.rawSource.exercises.path)];
const candidates = [];
const structural = [];
const expectedCorrections = {
  zh: ['约$15$千米/秒', '$35$--$40$米/秒'],
  en: ['approximately $15$ km/s', '$35$--$40$ m/s'],
};
for (const locale of ['zh', 'en']) {
  const lessonPath = `${author}/${locale}/lesson.template.json`;
  const exercisePath = `${author}/${locale}/exercises.template.json`;
  const lesson = read(lessonPath);
  const exercises = read(exercisePath);
  for (const kind of ['lesson', 'exercises']) {
    const item = authorReport.currentCandidates.find((x) => x.locale === locale && x.kind === kind);
    assert.equal(hash(item.current.path), item.current.sha256);
    assert.equal(hash(item.CURRENT.path), item.CURRENT.sha256);
    assert.equal(item.current.sha256, item.CURRENT.sha256);
    candidates.push({ locale, kind, ...binding(item.current.path), immutable_snapshot: binding(item.CURRENT.path) });
  }
  assert.equal(lesson.locale, locale);
  assert.equal(exercises.locale, locale);
  assert.equal(lesson.source.sha256, rawBindings[0].sha256);
  assert.equal(exercises.source.sha256, rawBindings[1].sha256);
  assert.deepEqual(lesson.source.data, raw);
  assert.deepEqual(exercises.source.data, rawExercises);
  assert.equal(lesson.prose.length, raw.prose.length);
  assert.equal(exercises.count, 0);
  assert.deepEqual(exercises.exercises, []);
  assert.equal(lesson.exercise_count, 0);
  assert.deepEqual(lesson.figures, raw.figures);
  const rows = [];
  for (let index = 0; index < raw.prose.length; index++) {
    const source = raw.prose[index];
    const current = lesson.prose[index];
    assert.equal(current.source_text, source.text);
    for (const key of ['kind', 'id', 'label', 'printed_page', 'source_refs']) {
      assert.deepEqual(current[key], source[key]);
    }
    assert.deepEqual(current.numeric_changes, []);
    const tokens = (text) => [...text.matchAll(/\$([^$]*)\$/g)].map((x) => x[1]);
    const sourceTokens = tokens(source.text);
    const currentTokens = tokens(current.text);
    const expectedTokens = index === 10
      ? sourceTokens.map((token, position) => position === 0 ? '15' : token)
      : sourceTokens;
    assert.deepEqual(currentTokens, expectedTokens);
    assert.ok(!/<(?:span|script|iframe)\b/i.test(current.text));
    assert.ok(!/[А-Яа-яЁё]/u.test(current.text));
    for (const entity of current.historical_entities) {
      assert.ok(current.text.includes(entity.term));
      assert.ok(source.text.includes(entity.source_term ?? entity.term));
      if (locale === 'en') assert.ok(current.changes.includes('translation'));
    }
    rows.push({
      index,
      target: `lesson.prose[${index}]`,
      source_refs: source.source_refs,
      source_text_sha256: crypto.createHash('sha256').update(current.source_text).digest('hex'),
      current_text_sha256: crypto.createHash('sha256').update(current.text).digest('hex'),
      source_math_tokens: sourceTokens,
      current_math_tokens: currentTokens,
      identity_and_snapshot: 'PASS',
      numeric_changes: [],
      ...judgment.coverage[index],
    });
  }
  assert.equal(lesson.errata.length, 2);
  for (let i = 0; i < 2; i++) {
    const record = lesson.errata[i];
    const canonical = inventory.registered_errata[i];
    for (const key of ['id', 'target', 'source', 'original', 'reason']) {
      assert.deepEqual(record[key], canonical[key]);
    }
    assert.equal(record.corrected, expectedCorrections[locale][i]);
    assert.equal(lesson.prose[10].text.split(record.corrected).length - 1, 1);
    assert.equal(lesson.prose[10].source_text.split(record.original).length - 1, 1);
    assert.ok(lesson.prose[10].changes.includes('math-correction'));
    const page = read(`ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0266/page.json`);
    assert.equal(hash('ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0266/page.json'), record.source.sha256);
    assert.equal(page.meta.printed_page, record.source.printed_page);
    assert.equal(page.meta.source.pdf_sha256, record.source.pdf_sha256);
    assert.equal(page.blocks[0].lines.join('').split(record.original).length - 1, 1);
  }
  structural.push({
    locale,
    status: 'PASS',
    source_snapshot: 'exact raw data and byte-file hash binding',
    identity_refs_order: 'all19 raw objects and22 non-heading source block refs preserved',
    questions: 0,
    invented_questions: 0,
    errata: lesson.errata,
    declared_numeric_changes_outside_errata: 0,
    math: 'exact token sequence except the registered90->15 replacement; unit correction matches each localized record',
    coverage: rows,
  });
}
for (const item of authorReport.beforeCandidates) {
  assert.equal(hash(item.baseline.path), item.baseline.sha256);
  assert.equal(hash(item.before.path), item.before.sha256);
}
assert.equal(hash(authorReport.baseline.report.path), authorReport.baseline.report.sha256);
assert.equal(hash(authorReport.baseline.FIRSTFreeze.path), authorReport.baseline.FIRSTFreeze.sha256);

const forceCounterexample = {
  model: 'one component p(t)=t^2 on[0,1]',
  interval_average_force: (1 ** 2 - 0 ** 2) / (1 - 0),
  instantaneous_force_at_start: 2 * 0,
  instantaneous_force_at_end: 2 * 1,
};
assert.notEqual(forceCounterexample.interval_average_force, forceCounterexample.instantaneous_force_at_end);
const usage = {
  schema: 'offline-bounded-review-usage/v1',
  ticket: 'STEMROBIN-181',
  batch: 'D037',
  card: 'phy10-c2-s4-n99',
  review_kind: 'FIRST full independent SCI + bilingual TEXT review',
  paid_calls: 0,
  image_opens: 0,
  parent_image_opens: 0,
  source_pixel_reviews: 0,
  figure_reviews: 0,
  content_revisions: 0,
  image_revisions: 0,
  native_adapt_prepare: 0,
  native_adapt_finalize: 0,
  native_finalize: 0,
  native_render: 0,
  native_contract_replays: 0,
  read_only_current_prose_flow_inspections: 2,
  substantive_review_replays: 0,
  outbound_chats: 0,
  delegated_subagents: 0,
  network_requests: 0,
  db_reads: 0,
  db_writes: 0,
  app_starts: 0,
  app_or_production_code_edits: 0,
  outside_owned_root_writes: 0,
  production_meter_edits: 0,
  complete_cards: 0,
  output_root: owned,
};
const usagePath = path.join(owned, 'usage.json');
fs.writeFileSync(usagePath, `${JSON.stringify(usage, null, 2)}\n`, { flag: 'wx' });
const finalReport = {
  schema: 'stemrobin/first-independent-science-bilingual-text-review@1',
  ticket: 'STEMROBIN-181',
  batch: 'D037',
  card: 'phy10-c2-s4-n99',
  book: '10p',
  edition: 'modern-us-neutral',
  role: 'FIRST full independent n99 SCI + ZH/EN TEXT review',
  status: 'FIRST-SCI-FAIL-ONE-SMALLEST-FINDING-TEXT-PASS',
  SCI: judgment.SCI,
  TEXT: judgment.TEXT,
  reviewed_at: new Date().toISOString(),
  cwd: repo,
  branch: 'codex/STEMROBIN-181-textbooks',
  observed_HEAD_at_entry: 'e4bcc19aab2a94a72a9b36123792c27ee76fe571',
  exclusive_output_root: owned,
  input_path_resolution: 'Requested source/author tmp paths are ticket-relative; the authorized output tmp directory is literal repo-root tmp/d1224-n99-first-independent-text-review.',
  inventory: binding(freeze.inventory.path),
  inventory_freeze: binding(path.join(owned, 'inventory-freeze.json')),
  current_author_report: binding(reportPath),
  current_candidates: candidates,
  raw_bindings: rawBindings,
  original_author_evidence: {
    report: binding(authorReport.baseline.report.path),
    FIRST_freeze: binding(authorReport.baseline.FIRSTFreeze.path),
    preserved_unchanged: true,
    native_TEXT_PASS: 'Existing mechanical pass retained; no replay, rebinding or substantive science approval inferred.',
  },
  source_errata_evidence: {
    retained: binding(`${ticket}/evidence/reports/d1211-source266-errata/retained.json`),
    registration: binding(`${ticket}/evidence/reports/d1211-source266-errata/registration.json`),
    independent_numerics: binding(`${ticket}/evidence/reports/d1211-source266-errata/independent-numerics/report.json`),
    modern_records: binding(`${ticket}/evidence/reports/d1211-source266-errata/modern-errata-records.json`),
    canonical_page266: binding('ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0266/page.json'),
    verdict: 'PASS_EXACT_TWO_RECORD_BINDING_AND_BOTH_LOCALIZED_CORRECTIONS',
    faithful_print_originals_unchanged: true,
    registration_metadata_delta_not_a_source_text_revision: true,
  },
  independent_numerics: inventory.numerics,
  force_counterexample: forceCounterexample,
  findings: judgment.findings.map((finding) => ({
    ...finding,
    locations: finding.locations.map((location) => ({
      ...location,
      file: path.join(repo, author, location.locale, 'lesson.template.json'),
      current_sha256: candidates.find((x) => x.locale === location.locale && x.kind === 'lesson').sha256,
    })),
  })),
  checked_scientific_and_text_contracts: structural,
  bilingual: judgment.bilingual,
  paragraphs_and_sections: {
    ...judgment.paragraphs_and_sections,
    observed_commands: ['zh', 'en'].map((locale) => ({
      cwd: repo,
      argv: ['node', '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', `${author}/${locale}/lesson.template.json`],
      exit_code: 0,
      current_input: candidates.find((x) => x.locale === locale && x.kind === 'lesson'),
      observed_result: judgment.paragraphs_and_sections[locale],
    })),
  },
  preexisting_native_receipts_reused: receipts,
  contracts_read: [
    binding('.claude/skills/ld-s10y-lesson/SKILL.md'),
    binding('.claude/skills/ld-s10y-lesson/references/edition-text-contract.md'),
    binding('.claude/skills/ld-s10y-lesson/references/production-resume.md'),
  ],
  nonblocking_notes: judgment.nonblocking_notes,
  review_judgment: binding(judgmentPath),
  reproduction_scripts: [binding(path.join(owned, 'freeze-source.mjs')), binding(path.join(owned, 'write-report.mjs'))],
  usage: binding(usagePath),
  not_reviewed_or_approved: [
    'Source or modern pixels, figures/spec/render/review files, typography or visual layout',
    'SOURCE267 or successor-heading confirmation',
    'Native adapt/finalize, rendering, full-card completeness or delivery',
    'Publication, DB, app, production counters, other cards, outbound chats or further delegation',
  ],
  author_materials_opened_before_inventory_freeze: false,
  paid_calls: 0,
  image_opens: 0,
  complete_card: false,
  full_card_approval: false,
  figure_approval: false,
  consumption_approval: false,
  repair_performed: false,
  next_step: 'Authorized author may make only the bilingual average-force/zero-interval clarification; subsequent review is affected-only. This report does not authorize an author worker or mutate the current candidate.',
};
const output = path.join(owned, 'report.json');
fs.writeFileSync(output, `${JSON.stringify(finalReport, null, 2)}\n`, { flag: 'wx' });
fs.writeFileSync(path.join(owned, 'report.sha256'), `${hash(output)}  report.json\n`, { flag: 'wx' });
console.log(JSON.stringify({
  report: binding(output),
  SCI: finalReport.SCI,
  TEXT: finalReport.TEXT,
  findings: finalReport.findings.map((x) => ({ id: x.id, priority: x.priority, target: x.target })),
  inventory: finalReport.inventory,
  usage: finalReport.usage,
  paid_calls: 0,
  image_opens: 0,
  complete_card: false,
}, null, 2));
