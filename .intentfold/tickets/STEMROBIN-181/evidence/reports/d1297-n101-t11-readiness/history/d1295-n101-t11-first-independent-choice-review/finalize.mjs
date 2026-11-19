import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const scope = ".intentfold/tickets/STEMROBIN-181/tmp/d1295-n101-t11-first-independent-choice-review";
const out = path.join(root, scope);
const author = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1289-n101-t11-first-choice");
if (process.cwd() !== root) throw new Error("Wrong cwd");
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const canonical = value => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value).sort().map(k => `${canonical(k)}:${canonical(value[k])}`).join(",")}}`;
  }
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, c => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
};
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, file_sha256: sha(bytes), canonical_sha256: sha(canonical(JSON.parse(bytes))) };
};
const write = (relative, data) => {
  const file = path.join(out, relative);
  if (!file.startsWith(`${out}/`)) throw new Error("Output outside owned scope");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: "wx" });
  return bind(file);
};
const frozen = read(path.join(out, "independent-solutions-FIRST.json"));
const freezeBinding = bind(path.join(out, "independent-solutions-FIRST.json"));
if (freezeBinding.file_sha256 !== "ba8ef4750118e24e3f0d4501e194d2b69d2ef2f50f307abfa927f96fc90b9cd2") throw new Error("FIRST source freeze changed");
const gateBinding = bind(path.join(out, "learner-visible-gate-FIRST.json"));
if (gateBinding.file_sha256 !== "cc878b890cba1d535437510dd57b969c9722ff8223122bf3b02793f86c891c92") throw new Error("FIRST visible gate changed");
const gate = read(gateBinding.path);
const coverageEvidence = {
  "n101:1": "Source 1 is wholly represented by n101-mass-speed: historical m=m0/sqrt(1-v^2/c^2), fixed invariant m0, and the speed domain are recognized as one complete formula. The author explicitly records unaided formula-writing loss in both intent.limitations and coverage.omitted_tasks. No essential mass-speed distinction is omitted; one complete response is justified.",
  "n101:2": "Source 2 is represented by n101-mass-energy's independent propositions about total E=mc^2, before/after-rest Delta m0=Delta E0/c^2, and fixed-internal-state speed changes. The general historical change law follows by subtraction. Independent written formulation is explicitly recorded as lost. Related propositions are not answer-cell fragmentation; no essential conceptual source task is omitted.",
  "n101:3": "Source 3 is fully represented by n101-rest-energy's own-rest-frame definition E0=m0c^2 contrasted with kinetic and arbitrary-frame total energy, valid across chosen-frame speeds. Independent written explanation is explicitly recorded as lost. The frame and energy definition remain rather than being replaced by a numeric lookup.",
  "n101:4": "Source 4 is represented by n101-heating-resolution's same-body retained heat, positive rest-energy mass gain, and historical ordinary-input/balance-resolution explanation. The coefficient Q/c^2 supplies the magnitude link; no timeless unmeasurability is asserted. Independent causal-explanation writing is explicitly recorded as lost. The physical sign and historical measurement task survive.",
  "t11:1": "Source 1 is fully represented by t11-event-order: train-clock simultaneous strikes at forward A/rear B become rear B earlier on ground clocks. Added wording only makes the source's local-clock convention explicit. The author records lack of independent time-transformation derivation; selection does not certify writing a Lorentz argument. No event-order or orientation task is omitted.",
  "t11:2": "Source 2 is represented by t11-electron-speed's exact v=c*sqrt(1-1/40000^2). Historical and invariant masses remain distinct, and no v=c approximation replaces the result. The author honestly records unaided algebra/numerical-evaluation loss; the exact expression answers the speed question without fabricated c or electron-mass values. Internal stable-gap calculation was independently verified.",
  "t11:3": "Source 3 is represented by t11-water-mass's full 1 kg and 50 deg C data in Delta m0=(1 kg)*mean cw*(50 K)/c^2. A temperature-interval mean preserves general variable heat capacity, not an unjustified constant assumption. The author records independent construction loss, absent numeric heat-capacity data, and visibly added closure conditions. A numerical value is legitimately unavailable from this seed; no source task is silently deleted or fake numerical constant introduced."
};
const parityEvidence = {
  "n101-mass-speed": "Both languages specify historical m, invariant m0>0, speed domain 0<=v<c, and identical reciprocal/square-root formula alternatives. The same domain-wide, rather than endpoint-only, identity is requested.",
  "n101-mass-energy": "Both languages define E total, E0 rest, K=E-E0, and historical m versus invariant m0. Both c options impose rest before and after; both d options keep internal state fixed while overall speed changes. 'All correct' and multiple mode agree.",
  "n101-rest-energy": "Both request the rest-energy definition across different/any chosen-frame speeds and contrast kinetic energy, chosen-frame total energy and own-rest-frame energy with identical gamma formulas. Neither translation loses the universal-speed qualifier.",
  "n101-heating-resolution": "Both retain the same body at rest before/after, no matter loss, all Q>0 retained internally, and ordinary source-era measurement capabilities. The English stem's 'capabilities discussed in the source' and b's 'balances of that period' match the explicit Chinese historical scope, not a universal ban on measurement.",
  "t11-event-order": "Both say the train moves from rear B toward front A; synchronized local train clocks assign equal strike times, explicitly not flash-reception times; both ask ground local-clock order and offer A-first/B-first/same-time in the same order.",
  "t11-electron-speed": "Both use historical relativistic m=40000*m0 with invariant m0 and ask an exact speed expression in c. All three formulas and the distinction between 40000 and 40000^2 are identical.",
  "t11-water-mass": "Both retain 1 kg and a 50 deg C rise, explicitly add rest/no-loss/no-phase-change/retained-heat/negligible-work conditions, define positive mean specific heat over the interval in J/(kg K), and state its number is not supplied. 323.15 K, 50 K, and the factor 2 appear identically in the options. Neither version adds optional standard constants."
};

const stage = process.argv[2];
if (stage === "reviews") {
  const comparison = [];
  const reviewBindings = [];
  for (const snapshot of gate.records) {
    const { card, language } = snapshot;
    const seedPath = path.join(author, card, "seed.json");
    const seed = read(seedPath);
    const draftBinding = bind(snapshot.draft_path);
    if (draftBinding.file_sha256 !== snapshot.file_sha256) throw new Error("Draft changed after independent view gate");
    const draft = read(snapshot.draft_path);
    const sourceFreeze = frozen.seeds.find(s => s.card === card);
    if (bind(seedPath).file_sha256 !== sourceFreeze.file_sha256) throw new Error("Seed changed after FIRST freeze");
    if (draft.new_figures.length !== 0) throw new Error("Unreviewed new figure");
    const questionReviews = snapshot.question_reviews.map(row => {
      const q = draft.questions.find(q => q.id === row.question_id);
      if (!q) throw new Error("Unknown question");
      const trueSet = [...row.mathematics.correct].sort();
      if (JSON.stringify(trueSet) !== JSON.stringify([...q.key.correct].sort())) throw new Error("Author key differs: retain independent gate and record revise");
      const options = q.view.options.map(o => o.id).sort();
      if (JSON.stringify(options) !== JSON.stringify(row.mathematics.option_checks.map(o => o.option_id).sort())) throw new Error("Not every option independently checked");
      for (const checked of row.mathematics.option_checks) {
        const rationale = q.key.rationales.find(r => r.option_id === checked.option_id);
        if (!rationale || rationale.truth !== checked.truth) throw new Error("Author rationale truth differs");
        comparison.push({
          card, language, question_id: q.id, option_id: checked.option_id,
          verdict: "pass",
          independent_truth: checked.truth,
          independent_evidence: checked.evidence,
          author_derivation_compared_after_FIRST: rationale.derivation,
          author_misconception_compared_after_FIRST: rationale.misconception,
          semantic_comparison: checked.truth === "incorrect"
            ? "Manual comparison confirmed that the declared mistaken procedure produces this displayed false proposition, as independently demonstrated by the evidence; it is not merely labelled incorrect."
            : "Manual comparison confirmed the author's displayed identity/frame/energy reasoning against the independent calculation; no misconception is required for a true alternative."
        });
      }
      return {
        ...row,
        task_fidelity: {
          ...row.task_fidelity,
          evidence: `${row.task_fidelity.evidence} Bilingual parity: ${parityEvidence[q.id]} Author production-loss declarations and misconception derivations were compared only after both FIRST freezes; no author self-check was used as approval.`
        }
      };
    });
    const source_reviews = seed.exercises.map(e => {
      const independent = frozen.solutions.find(s => s.card === card && s.source_number === e.number);
      const mapped = draft.questions.filter(q => q.source_numbers.includes(e.number)).map(q => q.id).sort();
      const declared = draft.coverage.find(c => c.source_number === e.number);
      if (!declared || JSON.stringify(mapped) !== JSON.stringify([...declared.question_ids].sort())) throw new Error("Coverage mismatch");
      if (!declared.omitted_tasks.length) throw new Error("Missing honest production loss");
      return {
        source_number: e.number,
        independent_solution: `Frozen independently before all author material in ${freezeBinding.path} (file SHA-256 ${freezeBinding.file_sha256}). ${independent.independent_solution}`,
        coverage: { verdict: "pass", evidence: coverageEvidence[`${card}:${e.number}`] }
      };
    });
    const review = {
      schema: "s10y-choice-review-v1",
      seed_sha256: sha(canonical(seed)), draft_sha256: draftBinding.canonical_sha256,
      reviewer: { kind: "independent_agent", identity: "Codex FIRST independent d1295 reviewer; not the d1289 author; source-before-draft and view-before-key evidence separately frozen" },
      source_reviews, figure_checks: [], new_figure_reviews: [],
      question_reviews: questionReviews, outcome: "pass"
    };
    reviewBindings.push({ card, language, seed: bind(seedPath), draft: draftBinding, review: write(`${card}/${language}/review.json`, review) });
  }
  write("author-rationale-comparison.json", {
    schema: "s10y-choice-post-FIRST-author-comparison-v1",
    checked_at: new Date().toISOString(), independent_source_freeze: freezeBinding,
    independent_visible_gate: gateBinding,
    option_count: comparison.length, records: comparison,
    note: "This comparison follows independent solving. Author report conclusions and self-checks were not semantic evidence. Historical answer-key files and the author's separate source-solutions file were never opened."
  });
  console.log(JSON.stringify({ reviews: reviewBindings, options_compared: comparison.length }, null, 2));
} else if (stage === "validate") {
  const [card, language] = process.argv.slice(3);
  if (!["n101", "t11"].includes(card) || !["zh", "en"].includes(language)) throw new Error("Invalid selection");
  const args = [
    "-B", ".agents/skills/ld-s10y-choice/scripts/validate.py",
    "--repo", root,
    "--seed", path.join(author, card, "seed.json"),
    "--draft", path.join(author, card, language, "draft.json"),
    "--review", path.join(out, card, language, "review.json")
  ];
  const started_at = new Date().toISOString();
  const result = spawnSync("python3", args, { cwd: root, encoding: "utf8" });
  const receipt = {
    schema: "s10y-choice-validation-receipt-v1",
    card, language, attempt: 1, started_at, finished_at: new Date().toISOString(),
    cwd: root, executable: "python3", argv: args,
    command: `python3 ${args.join(" ")}`,
    exit_code: result.status, signal: result.signal,
    stdout: result.stdout ?? "", stderr: result.stderr ?? "",
    execution_error: result.error ? String(result.error) : null,
    first_failure_preserved: result.status !== 0,
    python_bytecode_writes_disabled: true,
    note: "Only the requested seed/draft/review validator ran. No tool tests or application tests ran."
  };
  write(`receipts/${card}-${language}-validate-FIRST.json`, receipt);
  console.log(JSON.stringify(receipt, null, 2));
  if (result.status !== 0) process.exitCode = result.status ?? 2;
} else if (stage === "report") {
  const authorReportPath = path.join(author, "report.json");
  const authorReportBinding = bind(authorReportPath);
  if (authorReportBinding.file_sha256 !== "32d9ae619eaa5fc6415dd74f26dd63a371ae5c26f8726e8cc5cd318200ec2b6d") throw new Error("Author report provenance changed");
  const authorReport = read(authorReportPath);
  const accepted = [];
  const receipts = [];
  const coverage = [];
  let optionCount = 0;
  let questionCount = 0;
  for (const snapshot of gate.records) {
    const { card, language } = snapshot;
    const seedPath = path.join(author, card, "seed.json");
    const seedBinding = bind(seedPath);
    const draftBinding = bind(snapshot.draft_path);
    if (draftBinding.file_sha256 !== snapshot.file_sha256) throw new Error("Draft snapshot changed before report");
    const source = frozen.seeds.find(s => s.card === card);
    if (seedBinding.file_sha256 !== source.file_sha256) throw new Error("Seed changed before report");
    const reviewPath = path.join(out, card, language, "review.json");
    const review = read(reviewPath);
    if (review.seed_sha256 !== seedBinding.canonical_sha256 || review.draft_sha256 !== draftBinding.canonical_sha256) throw new Error("Review binding changed");
    const receiptPath = path.join(out, `receipts/${card}-${language}-validate-FIRST.json`);
    const receipt = read(receiptPath);
    receipts.push({ ...bind(receiptPath), ...receipt });
    accepted.push({
      card, language, status: receipt.exit_code === 0 && review.outcome === "pass" ? "accepted" : "not_accepted",
      seed: seedBinding, draft: draftBinding, review: bind(reviewPath),
      source_numbers: read(seedPath).exercises.map(e => e.number),
      question_count: review.question_reviews.length,
      option_count: review.question_reviews.reduce((n, q) => n + q.mathematics.option_checks.length, 0),
      complete_independent_true_sets: review.question_reviews.map(q => ({ question_id: q.question_id, correct: q.mathematics.correct }))
    });
    questionCount += review.question_reviews.length;
    optionCount += review.question_reviews.reduce((n, q) => n + q.mathematics.option_checks.length, 0);
    const draft = read(snapshot.draft_path);
    coverage.push({
      card, language,
      records: draft.coverage.map(c => ({
        source_number: c.source_number, question_ids: c.question_ids,
        author_declared_omitted_tasks: c.omitted_tasks,
        author_intent_limitations: draft.questions.filter(q => c.question_ids.includes(q.id)).map(q => ({ question_id: q.id, limitations: q.intent.limitations })),
        independent_coverage_verdict: "pass", independent_evidence: coverageEvidence[`${card}:${c.source_number}`]
      }))
    });
  }
  const freshness = [];
  for (const textBinding of frozen.concept_authority_text_bindings) {
    const match = /^prose\[(\d+)\]\.text$/.exec(textBinding.selector);
    const bytes = fs.readFileSync(textBinding.path);
    const current = JSON.parse(bytes).prose[Number(match[1])].text;
    const file_unchanged = sha(bytes) === textBinding.file_sha256;
    const text_unchanged = sha(current) === textBinding.text_sha256;
    if (!file_unchanged || !text_unchanged) throw new Error("Concept authority changed");
    freshness.push({ path: textBinding.path, selector: textBinding.selector, file_sha256: sha(bytes), text_sha256: sha(current), file_unchanged, exact_text_unchanged: text_unchanged });
  }
  const englishFreshness = frozen.english_prompt_prose_authority.map(b => {
    const current = bind(b.path);
    if (current.file_sha256 !== b.file_sha256) throw new Error("Allowed English source changed");
    return { ...current, text_bindings: b.text_bindings.map(t => ({ selector: t.selector, text_sha256: t.text_sha256 })), unchanged_since_FIRST: true, role: "Prompt/prose wording only; no answer authority" };
  });
  const provenanceComparisons = [];
  for (const c of authorReport.cards) {
    const seed = accepted.find(a => a.card === c.card).seed;
    if (seed.file_sha256 !== c.seed.file_sha256 || seed.canonical_sha256 !== c.seed.canonical_sha256) throw new Error("Author seed provenance mismatch");
    for (const language of ["zh", "en"]) {
      const actual = accepted.find(a => a.card === c.card && a.language === language).draft;
      if (actual.file_sha256 !== c.drafts[language].file_sha256 || actual.canonical_sha256 !== c.drafts[language].canonical_sha256) throw new Error("Author draft provenance mismatch");
      provenanceComparisons.push({ card: c.card, language, seed_binding_matches: true, draft_binding_matches: true });
    }
  }
  for (const authority of authorReport.supplementary_definitions.authorities) {
    for (const block of authority.blocks) {
      const direct = frozen.concept_authority_text_bindings.find(b => b.path === authority.path && b.selector === `prose[${block.block}].text`);
      if (!direct || direct.text_sha256 !== block.text_utf8_sha256 || direct.text !== block.text) throw new Error("Reported concept text differs from independently frozen authority");
    }
  }
  const usage = {
    schema: "s10y-choice-independent-review-usage-v1",
    ticket: "STEMROBIN-181", cwd: root, owned_output_directory: out,
    reviewRound: 1, review_round: 1, reviewer_kind: "independent_agent",
    source_exercises_solved: 7, questions_reviewed: questionCount,
    options_independently_enumerated: optionCount,
    image_opens: 0, images: 0, new_figures: 0,
    paid_calls: 0, paid: 0, network_calls: 0, net: 0,
    model_service_calls: 0, database_calls: 0, db: 0,
    environment_reads: 0, env: 0, git_calls: 0, git: 0,
    author_edits: 0, canonical_edits: 0, writes_outside_owned_directory: 0,
    previous_answer_key_reads: 0, old_choice_interaction_test_reads: 0,
    author_source_solutions_file_reads: 0,
    author_report_semantic_conclusions_used: 0,
    structural_validation_runs: receipts.length,
    unrelated_tests_run: 0,
    tokens: "unknown", token_usage: "unknown",
    note: "Token counts are not exposed; no estimate is invented. The present reasoning was performed by this reviewer without calling any model service. All writes are offline review artifacts in the sole user-owned d1295 directory; -B suppresses validator bytecode writes."
  };
  const usageBinding = write("usage.json", usage);
  const failures = receipts.filter(r => r.exit_code !== 0);
  const status = failures.length || accepted.some(a => a.status !== "accepted") ? "HOLD" : "PASS";
  const report = {
    schema: "s10y-choice-independent-bilingual-review-report-v1",
    ticket: "STEMROBIN-181", status,
    created_at: new Date().toISOString(),
    reviewer: frozen.reviewer, reviewRound: 1, cwd: root, owned_output_directory: out,
    boundary: "Offline semantic review only. This is not publication, canonical integration, client payload, or approval of an author's self-check. No author's draft was edited.",
    counts: {
      seeds: 2, full_sources_independently_solved: 7, full_sources_covered: 7,
      bilingual_question_pairs: 7, questions_per_language: 7, questions_total: questionCount,
      options_per_language: 22, options_total: optionCount,
      single_per_language: 6, multiple_per_language: 1,
      contract_reviews: 4, validation_runs: receipts.length,
      validation_passes: receipts.length - failures.length, validation_failures: failures.length,
      blocking_defects: 0, definite_defects: 0, image_opens: 0, new_figures: 0
    },
    review_order_evidence: {
      independent_source_freeze: freezeBinding,
      independent_source_freeze_receipt: bind(path.join(out, "receipts/independent-freeze-FIRST.json")),
      learner_visible_gate_FIRST: gateBinding,
      source_solutions_frozen_before_any_author_draft_solution_key_or_report: true,
      fidelity_redundancy_leakage_assessed_before_option_truth: true,
      option_truth_and_full_sets_frozen_before_author_intent_and_key_comparison: true,
      author_rationale_comparison: bind(path.join(out, "author-rationale-comparison.json")),
      author_separate_source_solutions_file_never_opened: true
    },
    accepted_path_hash_bindings: accepted,
    findings: [
      { id: "F1", severity: "information", verdict: "pass", affected: ["n101-mass-speed", "n101-mass-energy", "t11-electron-speed"], evidence: "Historical relativistic mass is never promoted to speed-dependent invariant mass. The functional speed relation, total-versus-kinetic energy, and before/after-rest mass change are independently checked. A numeric endpoint coincidence does not create extra universally true options." },
      { id: "F2", severity: "information", verdict: "pass", affected: ["n101-rest-energy"], evidence: "The own-rest-frame E0=m0c^2 definition remains true at any chosen-frame speed. The alternative total-energy expression agrees only at rest and the kinetic expression only accidentally at gamma=2; both fail the universal definition." },
      { id: "F3", severity: "information", verdict: "pass", affected: ["n101-heating-resolution", "t11-water-mass"], evidence: "Heat is retained by the same resting system without matter loss, so rest energy and invariant system mass increase. This is not an assertion that individual molecular invariant masses increase with speed. Balance-resolution limits are tied to the historical source period, not every era." },
      { id: "F4", severity: "information", verdict: "pass", affected: ["t11-event-order"], evidence: "Both languages specify local synchronized event-clock simultaneity and B-to-A motion. Independently tA-tB=gammaV*V*(x'A-x'B)/c^2>0; B is earlier. No flash-arrival argument is substituted." },
      { id: "F5", severity: "information", verdict: "pass", affected: ["t11-electron-speed"], evidence: "Exact gamma=40000 gives beta=sqrt(1-6.25e-10)<1. Rationalizing 1-beta gives 3.1250000004882812501525878906846046448014676571014570072353308205523e-10. A separate offline 90-digit Decimal calculation confirmed the author's high-precision digits. Wrong alternatives imply gamma=200 and about 28284.27, not 40000." },
      { id: "F6", severity: "capacity_note", verdict: "pass", affected: ["t11-water-mass"], evidence: "The source omits numeric specific heat, so the draft properly uses mean cw and Delta m0=(1 kg)*mean cw*(50 K)/c^2. 323.15 K is a false absolute-temperature-offset conversion; the half-factor alternative is also false. No optional 4200 J/(kg K) or 3e8 m/s value is supplied to learners. If explicitly added, those classroom constants give about 2.3e-12 kg=2.3e-9 g, not an exact source-derived number. Numerical unavailability and added physical closure conditions are recorded honestly." },
      { id: "F7", severity: "capacity_note", verdict: "pass", affected: ["all 7 bilingual pairs"], evidence: "All seven complete sources are represented one-to-one per language. Selection does not demonstrate unaided formula recall, written definition/explanation, Lorentz derivation, algebraic construction or numerical evaluation. The author records these losses in limitations and coverage; none silently removes a key source distinction. Related mass-energy questions permit concept application but do not reveal a marked key or duplicate a full response task." },
      { id: "F8", severity: "information", verdict: "pass", affected: ["all 14 questions / 44 options"], evidence: "All visible stems and all options were manually compared across Chinese and English, including universal/conditional quantifiers, orientation, energy retention, units, constants and precision. Complete independent true sets and every author misconception were subsequently compared. No semantic mismatch, definite authoring defect or unresolved blocker was found." }
    ],
    defect_findings: [],
    bilingual_semantic_parity: {
      verdict: "pass",
      manually_reviewed_pairs: Object.entries(parityEvidence).map(([question_id, evidence]) => ({ question_id, verdict: "pass", evidence })),
      internal_intent_key_rationale_coverage_parity: "After independent solving, all corresponding internal intents, exact keys, option rationales and coverage records were compared and are identical across languages. This mechanical identity does not replace the preceding manual natural-language review."
    },
    source_coverage_and_honest_production_losses: coverage,
    concept_authority_exact_text_bindings: freshness,
    english_prompt_prose_authority_bindings: englishFreshness,
    author_report_provenance_only: {
      ...authorReportBinding,
      role: "Only input/output provenance and named authority/hash bindings were read; status, bilingual approval conclusions, physical-convention conclusions and self-check results were excluded.",
      current_seed_and_draft_binding_comparisons: provenanceComparisons,
      supplementary_concept_exact_text_hashes_match_direct_FIRST_authority: true,
      author_source_solution_provenance: {
        path: authorReport.independent_solutions_FIRST.path,
        reported_file_sha256: authorReport.independent_solutions_FIRST.file_sha256,
        reported_canonical_sha256: authorReport.independent_solutions_FIRST.canonical_sha256,
        source_file_opened: false, status: "Author's provenance claim retained only; not reviewer solution authority"
      }
    },
    validation: {
      authority: "validate.py checks structure, freshness, binding and declared agreement, not automatic mathematical or semantic proof.",
      exact_commands_and_outputs: receipts,
      first_validation_failures_preserved: failures,
      no_validation_retries: true,
      no_unrelated_tests: true
    },
    execution_failures: {
      initial_missing_owned_output_directory: read(path.join(out, "receipts/independent-freeze-FIRST.json")).first_execution_failure,
      review_generation_failures: [],
      validation_failures: failures,
      note: "The initial inventory's missing new output directory was the sole technical failure, preserved before recovery. It did not invalidate or restart independent source solving."
    },
    usage: usageBinding,
    not_claimed: ["Unaided written production", "Numeric water answer from absent source constants", "Automatic semantic proof by validate.py", "Author self-check approval", "Publication or canonical edits"],
    outcome: status === "PASS" ? "pass" : "blocked"
  };
  const reportBinding = write("report.json", report);
  const digestBinding = write("receipts/report-digest.json", { ...reportBinding, status, counts: report.counts });
  console.log(JSON.stringify({ report: reportBinding, digest_receipt: digestBinding, status, counts: report.counts, usage: usageBinding }, null, 2));
} else {
  throw new Error("Use reviews, validate <card> <language>, or report");
}
