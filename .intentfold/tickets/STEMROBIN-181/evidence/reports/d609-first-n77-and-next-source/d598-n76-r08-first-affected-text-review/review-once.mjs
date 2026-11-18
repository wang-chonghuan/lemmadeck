import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const owned = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.dirname(owned);
const repo = path.resolve(tmp, '../../../..');
const oldRoot = path.join(tmp, 'd582-n76-first-bilingual-text-author');
const firstRoot = path.join(tmp, 'd585-n76-first-independent-text-review');
const repairRoot = path.join(tmp, 'd597-n76-r08-first-text-repair');
const inventoryPath = path.join(tmp, 'd569-source203-first-independent-review/sourceinventory.json');
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const pins = new Map();
const checks = [];
const check = (name, action) => {
  action();
  checks.push({ name, status: 'PASS' });
};
const pinned = (file, expected) => {
  const absolute = path.isAbsolute(file) ? file : path.resolve(repo, file);
  assert(absolute.startsWith(`${tmp}/`), `Out-of-scope input: ${absolute}`);
  assert(/\.(json|mjs)$/.test(absolute), `Not a text evidence file: ${absolute}`);
  assert(!fs.lstatSync(absolute).isSymbolicLink(), `Symbolic-link input: ${absolute}`);
  const bytes = fs.readFileSync(absolute);
  const sha256 = hash(bytes);
  if (expected) assert.equal(sha256, expected, `Pin mismatch: ${absolute}`);
  const stat = fs.statSync(absolute);
  const pin = { path: absolute, sha256, bytes: bytes.length, mode: (stat.mode & 0o777).toString(8).padStart(4, '0') };
  if (pins.has(absolute)) assert.deepEqual(pin, pins.get(absolute), `Input changed: ${absolute}`);
  pins.set(absolute, pin);
  return { pin, bytes, json: () => JSON.parse(bytes) };
};
const write = (name, value) => {
  const file = path.join(owned, name);
  const bytes = Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
  fs.writeFileSync(file, bytes, { flag: 'wx', mode: 0o444 });
  return { path: file, sha256: hash(bytes), bytes: bytes.length, mode: '0444' };
};
const deepDiff = (left, right, pointer = '') => {
  if (Object.is(left, right)) return [];
  if (left === null || right === null || typeof left !== 'object' || typeof right !== 'object'
      || Array.isArray(left) !== Array.isArray(right)) return [pointer];
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  return [...keys].flatMap((key) => {
    const next = `${pointer}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`;
    if (!Object.hasOwn(left, key) || !Object.hasOwn(right, key)) return [next];
    return deepDiff(left[key], right[key], next);
  });
};
const mathTokens = (text) => text.match(/\$[^$]*\$/g) ?? [];
const inputsUnchanged = () => {
  for (const pin of pins.values()) {
    const bytes = fs.readFileSync(pin.path);
    assert.equal(hash(bytes), pin.sha256, `Input changed before terminal seal: ${pin.path}`);
    assert.equal(bytes.length, pin.bytes);
    assert.equal((fs.statSync(pin.path).mode & 0o777).toString(8).padStart(4, '0'), pin.mode);
  }
};

let report;
try {
  const criterionSeal = pinned(path.join(owned, 'criterion-freeze.json'), '235e147a315fd1eeefde9bb6ce3ff90c04b6474853f1177fb769e2a21cd4f671');
  const seal = criterionSeal.json();
  const criterionFile = pinned(seal.extracted.path, seal.extracted.sha256);
  const extracted = criterionFile.json();
  check('Affected criterion was sealed before repair material was read', () => {
    assert.equal(seal.phase, 'SEALED_BEFORE_D597_REPORT_DELTA_OR_CANDIDATE_READ');
    assert.equal(seal.author_material_read, false);
    assert.equal(extracted.criterion.id, 'N76-R08');
    assert.equal(extracted.first_HOLD.id, 'N76-R08-H01');
  });
  const firstReport = pinned(path.join(firstRoot, 'report.json'), extracted.originals.report.sha256);
  const originalCriteria = pinned(path.join(firstRoot, 'criteria.json'), extracted.originals.criteria.sha256);
  const first = firstReport.json();
  check('Original R08 criterion and H01 are unchanged structured objects', () => {
    assert.deepEqual(extracted.criterion, originalCriteria.json().requirements[7]);
    assert.deepEqual(extracted.first_HOLD, first.blocking_list[0]);
  });
  const oldReviewFreeze = pinned(path.join(firstRoot, 'review-freeze.json'));
  check('Old sealed review files remain byte-bound; no old semantic re-review', () => {
    for (const entry of oldReviewFreeze.json().files) {
      assert(entry.path.startsWith(`${firstRoot}/`));
      const actual = pinned(entry.path, entry.sha256).pin;
      assert.equal(actual.bytes, entry.bytes);
      assert.equal(actual.mode, entry.mode);
    }
  });
  const repairReport = pinned(path.join(repairRoot, 'report.json'), 'e9451961ef81508ed3b364ab18b4446aa307ff247d4d335f2aca1c0bd3384a6e');
  const repairFreeze = pinned(path.join(repairRoot, 'author-freeze.json'), 'f662fe7b088655e6b5333fd6d685d9b7b286c24e2b347ba86db224a1fac46ed6');
  const repaired = repairReport.json();
  check('Repair manifest and all candidate/delta/report pins match actual bytes', () => {
    for (const entry of repairFreeze.json().files) {
      const actual = pinned(entry.path, entry.sha256).pin;
      assert(actual.path.startsWith(`${repairRoot}/`));
      assert.equal(actual.mode, '0444');
    }
    for (const entry of repaired.candidates) pinned(entry.path, entry.sha256);
    assert.equal(repaired.repairsUsed, 1);
    assert.deepEqual(repaired.affectedRequirements, ['N76-R08']);
  });
  const oldFreeze = pinned(first.author_entry_pins.author_freeze.path, first.author_entry_pins.author_freeze.sha256);
  const oldAuthorReport = pinned(first.author_entry_pins.report.path, first.author_entry_pins.report.sha256);
  check('All original author/source snapshots still match inherited original byte pins', () => {
    for (const entry of oldFreeze.json().files) {
      const actual = pinned(entry.path, entry.sha256).pin;
      assert(actual.path.startsWith(`${oldRoot}/`));
      assert.equal(actual.mode, '0444');
    }
    assert.equal(repaired.originalAuthor.sha256, oldAuthorReport.pin.sha256);
    assert.equal(repaired.originalAuthorFreeze.sha256, oldFreeze.pin.sha256);
    assert.equal(repaired.firstReview.sha256, firstReport.pin.sha256);
  });
  const deltaFile = pinned(repaired.delta.path, repaired.delta.sha256);
  const delta = deltaFile.json();
  const inventoryFile = pinned(inventoryPath, 'ecdedaf5e2d2041acf216ac52e26204111f14046bb34eeaa88b95f80b8541897');
  check('Delta is repair1/R08 only and references unchanged original HOLD and existing source inventory', () => {
    assert.equal(delta.repairNumber, 1);
    assert.equal(delta.affectedRequirement, 'N76-R08');
    assert.deepEqual(delta.deltas.map((item) => item.locale).sort(), ['en', 'zh']);
    assert.equal(delta.originalSCI_HOLD.sha256, firstReport.pin.sha256);
    assert.equal(delta.acceptedSourceInventory.sha256, inventoryFile.pin.sha256);
  });
  const inventory = inventoryFile.json();
  const figureIndex = inventory.figures.findIndex((item) => item.id === 'fig-180');
  const observedFigure = inventory.figures[figureIndex];
  check('Existing fig180 text observation identifies F right of O and transverse dashed CF plane', () => {
    assert.equal(figureIndex, 1);
    assert.equal(observedFigure.shape_inventory[0], 'Horizontal solid principal axis runs left to right, with a rightward arrow; S_1 and S lie on its left portion, O at lens, F right of O.');
    assert.equal(observedFigure.shape_inventory[5], 'Dashed vertical focal plane passes through C and F, extending below F; C is above F.');
  });
  const sourceObservation = write('source-observation.json', {
    schema: 'n76-r08-existing-source-text-observation-v1',
    inventory: inventoryFile.pin,
    consumption: 'Existing independent SOURCE203 actual-pixel inventory consumed as text only; no new image opening or source re-review.',
    observations: [0, 5].map((index) => ({
      pointer: `/figures/${figureIndex}/shape_inventory/${index}`,
      text: observedFigure.shape_inventory[index],
    })),
    imageOpens: 0,
    FIG_PASS_inferred: false,
    newly_certified_source_pixels: false,
  });
  const comparisons = [];
  const contexts = {};
  for (const locale of ['zh', 'en']) {
    const beforeFile = pinned(path.join(oldRoot, `candidate/${locale}/lesson.template.json`));
    const afterFile = pinned(path.join(repairRoot, `candidate/${locale}/lesson.template.json`));
    const before = beforeFile.json();
    const after = afterFile.json();
    const beforeText = before.prose[10].text;
    const afterText = after.prose[10].text;
    const beforeLines = beforeText.split('\n');
    const afterLines = afterText.split('\n');
    const row = delta.deltas.find((item) => item.locale === locale);
    check(`${locale}: only /prose/10/text, only text line 4; all remaining fields deeply equal`, () => {
      assert.equal(row.pointer, '/prose/10/text');
      assert.equal(row.affectedLineOneBased, 4);
      assert.equal(row.historicalFinding, 'N76-R08-H01');
      assert.equal(beforeLines.length, 7);
      assert.equal(afterLines.length, beforeLines.length);
      assert.equal(beforeLines[3], row.before);
      assert.equal(afterLines[3], row.after);
      assert.notEqual(beforeLines[3], afterLines[3]);
      assert.deepEqual(beforeLines.filter((_, index) => index !== 3), afterLines.filter((_, index) => index !== 3));
      assert.deepEqual(deepDiff(before, after), ['/prose/10/text']);
      const maskedBefore = structuredClone(before);
      const maskedAfter = structuredClone(after);
      maskedBefore.prose[10].text = null;
      maskedAfter.prose[10].text = null;
      assert.deepEqual(maskedAfter, maskedBefore);
      assert.deepEqual(mathTokens(beforeText), mathTokens(afterText));
    });
    const unchangedFiles = [];
    for (const name of ['figures.template.json', 'exercises.template.json']) {
      const originalFile = pinned(path.join(oldRoot, `candidate/${locale}/${name}`));
      const currentFile = pinned(path.join(repairRoot, `candidate/${locale}/${name}`));
      check(`${locale}: ${name} unchanged bytes and structured objects`, () => {
        assert.deepEqual(currentFile.bytes, originalFile.bytes);
        assert.deepEqual(currentFile.json(), originalFile.json());
        if (name === 'exercises.template.json') {
          assert.equal(currentFile.json().count, 0);
          assert.deepEqual(currentFile.json().exercises, []);
        }
      });
      unchangedFiles.push({ name, original: originalFile.pin, current: currentFile.pin, byte_equal: true, deep_equal: true });
    }
    contexts[locale] = after.prose.slice(10, 13);
    comparisons.push({
      locale, before: beforeFile.pin, after: afterFile.pin,
      changed_pointers: ['/prose/10/text'],
      masked_pointer: '/prose/10/text', masked_deep_equality: true,
      changed_text_lines_one_based: [4],
      text_line_count: 7,
      before_line4: beforeLines[3], after_line4: afterLines[3],
      all_other_text_lines_unchanged: true,
      all_other_fields_including_source_text_and_figure_objects_unchanged: true,
      math_tokens_unchanged: true,
      exercise_count: 0,
      unchanged_files: unchangedFiles,
    });
  }
  const inherited = first.requirements.filter((item) => /^N76-R0[1-7]$/.test(item.id)).map((item) => ({
    id: item.id, SCI: item.SCI, ZHEN: item.ZHEN, status: item.status,
    blocking_list: item.blocking_list, evidence_origin: firstReport.pin,
    re_reviewed: false, untouched_binding_verified: true,
  }));
  check('Old R01-R07 SCI PASS and old ZHEN PASS can be inherited without re-review', () => {
    assert.equal(inherited.length, 7);
    assert.deepEqual(inherited.map((item) => item.id), Array.from({ length: 7 }, (_, index) => `N76-R0${index + 1}`));
    for (const item of inherited) {
      assert.equal(item.status, 'PASS');
      assert.equal(item.SCI, 'PASS');
      assert.equal(item.ZHEN, 'PASS');
      assert.deepEqual(item.blocking_list, []);
    }
    assert.equal(first.ZHEN, 'PASS');
    assert.equal(first.gates.ZHEN.status, 'PASS');
    assert.deepEqual(first.gates.ZHEN.blocking_list, []);
    assert.equal(first.gates.SCI.status, 'HOLD');
    assert.deepEqual(first.gates.SCI.blocking_list, ['N76-R08-H01']);
    for (const original of first.reviewed_candidates.filter((item) => item.locale)) pinned(original.path, original.sha256);
  });
  const mechanical = write('delta-binding-check.json', {
    schema: 'n76-r08-affected-delta-byte-binding-v1',
    status: 'PASS', blocking_list: [],
    criterion_seal: criterionSeal.pin,
    old_review_freeze: oldReviewFreeze.pin,
    repair_report: repairReport.pin,
    repair_freeze: repairFreeze.pin,
    delta: deltaFile.pin,
    checks,
    comparisons,
    original_source_snapshots: [...pins.values()].filter((pin) => pin.path.startsWith(`${oldRoot}/source/`)),
    imageOpens: 0,
    source_snapshots_verified_as_bytes_not_whole_page_re_review: true,
    mathematical_tokens_and_all_unmasked_objects_unchanged: true,
    not_an_automatic_semantic_PASS: true,
  });
  const semanticEvidence = write('affected-r08-evidence.json', {
    schema: 'n76-r08-first-affected-semantic-review-v1',
    criterion: criterionFile.pin,
    requirement: 'N76-R08',
    candidate_context_pointers: ['/prose/10', '/prose/11', '/prose/12'],
    contexts,
    changed_phrase: comparisons.map((item) => ({
      locale: item.locale, pointer: '/prose/10/text', text_line_one_based: 4,
      text: item.after_line4,
    })),
    SCI: {
      status: 'PASS', blocking_list: [],
      judgment: 'Both locales now expressly select the outgoing-light/image-side focal plane through F, not the object-side focus. This resolves the sole frozen H01 uncertainty.',
      physics: 'In the stated paraxial converging-lens construction, the optical-center secondary axis is parallel to incident SB. Its intersection C with the image-side transverse focal plane gives the direction point for refracted BC. The axial ray is the second path. An object between the incident-side focus and lens gives divergent emerging rays; their backward construction extensions locate virtual S_1 rather than representing actual backward light propagation.',
      source_support: sourceObservation,
      full_context: 'L1-L2 retain the axial point and three coincident special rays; L3 retains SB and B at the lens; L4 retains PQ through the optical center parallel to SB, F defining a perpendicular plane, and the plane-axis intersection C; L5 retains paraxial BC and the axial second ray; L6-L7 retain inside-focus divergence, virtual S_1, and the backward-extension warning. The changed L4 does not negate or redirect those steps.',
    },
    ZHEN: {
      status: 'PASS', blocking_list: [],
      judgment: 'The changed Chinese outgoing-light side and image-side focus qualifications correspond to the English outgoing-light side and image-side focus. Both preserve PQ, SB, F, C, perpendicularity, intersection order and the plane-versus-point distinction; F is not renamed or moved in any source/figure object.',
      full_context: 'The seven lines correspond in axial degeneracy, arbitrary SB/B ray, PQ/plane/C construction, paraxial BC plus axial ray, inside-focus virtual S_1, and the no-backward-propagation warning. Only R08 and its changed phrase were semantically judged in this batch.',
    },
    dimensions: {
      complete_source_coverage: { status: 'PASS', evidence: 'All frozen R08 propositions and the existing p0203#5/#8 source-text join remain. Figure 180 ID and caption retain their text-only identity; no geometry is certified.' },
      physics_soundness: { status: 'PASS', evidence: 'Outgoing/image-side plane explicitly resolves H01; all ray-construction and virtual-image qualifications remain in full context.' },
      ZHEN_correspondence: { status: 'PASS', evidence: 'Full R08 context and the new focal-side phrase correspond.' },
      teaching_enumeration_as_prose: { status: 'PASS', evidence: 'R08 remains kind=p; no question, distance, measurement, scale or exercise has been added. Both exercise templates retain count=0.' },
    },
    reviewer_authored_candidate_changes: 0,
    imageOpens: 0,
    visual_or_whole_source_certification: false,
  });
  check('All read input pins and permission modes remain unchanged at final assessment', inputsUnchanged);
  const inputBindings = write('input-pins.json', {
    schema: 'n76-r08-final-input-pins-v1', status: 'PASS', blocking_list: [],
    files: [...pins.values()].sort((left, right) => left.path.localeCompare(right.path)),
    semantics_read: 'Only original R08 criterion/H01, original gate/status binding metadata, repair delta, repaired R08 full context, and two existing fig180 inventory text observations.',
    other_old_source_or_review_material: 'Byte hash checks only; no semantic re-review.',
    all_inputs_reverified_before_report: true,
    image_files_read_or_hashed: 0,
    imageOpens: 0,
  });
  report = {
    schema: 'd598/n76-r08-first-affected-text-review@1',
    ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n76',
    review_id: path.basename(owned), owned_root: owned,
    recorded_at_utc: new Date().toISOString(),
    status: 'FIRST-AFFECTED-R08-PASS-EFFECTIVE-COMPOSED-TEXT-PASS',
    role: 'Fresh bounded one-off affected-only reviewer; not permanent/replacement A-D.',
    attempt: { affected_review: 1, repair_number: 1, author_repairs_by_reviewer: 0, further_author_repairs_allowed: false },
    SCI: 'PASS', ZHEN: 'PASS',
    gates: {
      SCI: { status: 'PASS', blocking_list: [], kind: 'EFFECTIVE-COMPOSED-PASS', basis: 'Fresh R08 SCI PASS plus original byte-bound untouched R01-R07 SCI PASS. R01-R07 not re-reviewed.' },
      ZHEN: { status: 'PASS', blocking_list: [], kind: 'EFFECTIVE-COMPOSED-PASS', basis: 'Fresh affected R08 full-context and changed-phrase ZHEN PASS plus old byte-bound ZHEN PASS for untouched content. Old pass not re-reviewed or replaced.' },
      AFFECTED_R08_SCI: { status: 'PASS', blocking_list: [], kind: 'FRESH-AFFECTED-ONLY-PASS', evidence: semanticEvidence },
      AFFECTED_R08_ZHEN: { status: 'PASS', blocking_list: [], kind: 'FRESH-AFFECTED-ONLY-PASS', evidence: semanticEvidence },
      BYTE_BINDINGS_AND_ALLOWED_DELTA: { status: 'PASS', blocking_list: [], evidence: mechanical },
      SOURCE: { status: 'EXISTING-TEXT-OBSERVATION-CONSUMED-NOT-RE-REVIEWED', whole_source_certified: false },
      FIG: { status: 'NOT-REVIEWED', visual_PASS_claimed: false },
      DISPLAY: { status: 'NOT-RUN', PASS_claimed: false },
    },
    blocking_list: [],
    affected_requirement: {
      id: 'N76-R08', SCI: 'PASS', ZHEN: 'PASS', blocking_list: [],
      immutable_criterion: criterionFile.pin,
      original_criterion_object_rewritten: false,
      assessed_context: ['/prose/10/text L1-L7', '/prose/11 text-only figure identity', '/prose/12 text-only caption'],
      changed_location: { pointer: '/prose/10/text', text_line_one_based: 4, locales: ['zh', 'en'] },
      evidence: semanticEvidence,
    },
    inherited_not_re_reviewed: {
      original_report: firstReport.pin,
      R01_R07: inherited,
      old_ZHEN: { status: 'PASS', blocking_list: [], re_reviewed: false, original_pass_replaced: false, byte_bindings_verified: true },
      eligibility: 'All inherited report/evidence/author/source hashes match; current candidates deeply equal originals outside the allowed text pointer and all text lines outside L4 remain unchanged.',
    },
    first_HOLD_retention: {
      finding: 'N76-R08-H01', original_status: 'HOLD',
      original_report: firstReport.pin,
      first_findings: pins.get(path.join(firstRoot, 'first-findings.json')),
      original_report_and_findings_unchanged_0444: true,
      original_HOLD_rewritten_deleted_or_replaced: false,
      resolved_only_in_this_append_only_affected_review: true,
    },
    pins: {
      criterion_freeze: criterionSeal.pin, criteria: originalCriteria.pin,
      original_review: firstReport.pin, original_review_freeze: oldReviewFreeze.pin,
      original_author_report: oldAuthorReport.pin, original_author_freeze: oldFreeze.pin,
      repair_report: repairReport.pin, author_freeze: repairFreeze.pin, delta: deltaFile.pin,
      source_inventory: inventoryFile.pin,
      source_snapshots: [...pins.values()].filter((pin) => pin.path.startsWith(`${oldRoot}/source/`)),
      original_candidates: comparisons.map((item) => item.before),
      current_candidates: comparisons.map((item) => item.after),
      full_input_bindings: inputBindings,
    },
    evidence_files: { delta_binding: mechanical, source_observation: sourceObservation, affected_R08: semanticEvidence },
    imageOpens: 0, imagesOpened: 0, returned_image_payloads: 0,
    constraints_observed: {
      only_owned_d598_writes_or_chmods: true,
      shared_worktree_other_active_work_preserved: true,
      git_operations: 0, DB_operations: 0, deploy_operations: 0,
      canonical_writes: 0, author_writes: 0, rollback: false,
      native_runs: 0, browser_or_image_viewer_calls: 0,
      passed_R01_R07_semantic_re_reviews: 0, old_ZHEN_semantic_re_review: false,
      source_whole_page_re_reviews: 0, FIG_re_reviews: 0, DISPLAY_runs: 0,
      new_permanent_or_replacement_workers: 0, image_budget_reset: false,
    },
    completeCard: false, fullcard: false,
    terminal: { repair1: true, additional_author_repair: false, bounded_batch_ended: true },
    batch_end: true,
    final_freeze: {
      path: path.join(owned, 'review-freeze.json'),
      policy: 'All owned files 0444; manifest pins every other owned file with full SHA-256, byte size and mode. Self hash returned separately in text.',
    },
  };
} catch (error) {
  report = {
    schema: 'd598/n76-r08-first-affected-text-review@1',
    ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n76',
    review_id: path.basename(owned), owned_root: owned,
    status: 'TERMINAL-REPAIR1-AFFECTED-REVIEW-HOLD',
    recorded_at_utc: new Date().toISOString(),
    gates: {
      SCI: { status: 'HOLD', blocking_list: ['N76-R08-D598-BINDING-HOLD'], effective_composed_PASS_claimed: false },
      ZHEN: { status: 'HOLD', blocking_list: ['N76-R08-D598-BINDING-HOLD'], effective_composed_PASS_claimed: false },
    },
    blocking_list: [{ id: 'N76-R08-D598-BINDING-HOLD', status: 'HOLD', observation: error.message }],
    completed_checks: checks, checked_input_pins: [...pins.values()],
    original_HOLD_untouched: true, imageOpens: 0,
    further_author_repairs_allowed: false,
    completeCard: false, fullcard: false,
    terminal: { repair1: true, additional_author_repair: false, bounded_batch_ended: true },
    batch_end: true,
  };
}
const reportPin = write('report.json', report);
for (const name of fs.readdirSync(owned)) {
  const file = path.join(owned, name);
  assert(fs.lstatSync(file).isFile(), `Unexpected owned entry: ${file}`);
  fs.chmodSync(file, 0o444);
}
const files = fs.readdirSync(owned).sort().map((name) => {
  const file = path.join(owned, name);
  const bytes = fs.readFileSync(file);
  assert.equal(fs.statSync(file).mode & 0o777, 0o444);
  return { path: file, sha256: hash(bytes), bytes: bytes.length, mode: '0444' };
});
const finalFreeze = write('review-freeze.json', {
  schema: 'd598/n76-r08-first-affected-review-freeze@1',
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n76',
  owned_root: owned, sealed_at_utc: new Date().toISOString(),
  status: report.status,
  gates: { SCI: report.gates.SCI.status, ZHEN: report.gates.ZHEN.status },
  blocking_list: report.blocking_list,
  imageOpens: 0,
  files,
  self: { path: path.join(owned, 'review-freeze.json'), mode: '0444', sha256_policy: 'Supplied separately in textual handoff; not self-referential.' },
  terminal: { repair_number: 1, further_author_repair: false, bounded_batch_ended: true },
});
console.log(JSON.stringify({ status: report.status, report: reportPin, review_freeze: finalFreeze }, null, 2));
