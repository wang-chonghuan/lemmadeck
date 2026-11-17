import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory=path.dirname(fileURLToPath(import.meta.url));
const tmp=path.dirname(directory);
const root="/Users/yong/.codex/worktrees/a07e/lemmadeck";
const sha=(bytes)=>crypto.createHash("sha256").update(bytes).digest("hex");
const canonical=(value)=>{
  if(Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if(value!==null&&typeof value==="object") return `{${Object.keys(value).sort().map((key)=>`${canonical(key)}:${canonical(value[key])}`).join(",")}}`;
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g,(char)=>`\\u${char.charCodeAt(0).toString(16).padStart(4,"0")}`);
};
const inputs=[];
const read=(file,role,expected=null)=>{
  const bytes=fs.readFileSync(file),digest=sha(bytes);
  if(expected!==null) assert.equal(digest,expected,file);
  inputs.push({path:file,role,sha256:digest,byte_length:bytes.length});
  return bytes;
};
const json=(file,role,expected=null)=>JSON.parse(read(file,role,expected));
const emit=(name,value)=>{
  const file=path.join(directory,name);
  assert(file.startsWith(`${directory}/`));
  fs.writeFileSync(file,`${JSON.stringify(value,null,2)}\n`,{flag:"wx"});
  return file;
};
const p1dir=path.join(tmp,"geo910-n19-choice-independent-source-first-evidence");
const p2dir=path.join(tmp,"geo910-n19-choice-independent-phase2");
const priorManifestRecords=[];
for(const [file,expected] of [
  [path.join(p1dir,"freeze-manifest.json"),"ac6b1c4143af087eb884a610326910322810eaee23ec9240a66dc2b3dc1219cc"],
  [path.join(p2dir,"freeze-manifest.json"),"3ff621b18e29f3f5c9a8ce5e8e5a643032bcfdf8a2ed00179d38b1b35936d3f7"],
  [path.join(directory,"old-stage3-freeze-manifest.json"),"a8b6b453641808e3b2104616f9cd7780ccf9803230470cc1bd087f343e5f61cf"],
]){
  const manifest=json(file,"immutable_prior_stage_freeze",expected);
  for(const output of manifest.outputs) assert.equal(sha(fs.readFileSync(output.path)),output.sha256,output.path);
  priorManifestRecords.push({path:file,sha256:expected,verified_outputs:manifest.outputs.length});
}
const p1=json(path.join(p1dir,"phase1.json"),"frozen_source_solutions_reused_not_resolved","4badbaaab17ead450654885350c72759d09e7efc0d79ef92234cb8b66214c4fc");
const p2=json(path.join(p2dir,"phase2.json"),"frozen_option_solutions_reused_not_resolved","c0ace941b0ed1643056ffbd84e79320605fcb64206177818a6c9bcfb25575fec");
const old=json(path.join(directory,"old-stage3-comparison.json"),"frozen_complete_internal_and_visual_comparison","c1f4b89bce741d7ba99e2d1a50add97c3f3be2eba1fdeafded3bef685845c8e1");
const trace=json(path.join(directory,"trace-confirmation.json"),"prospective_trace_only_confirmation","367a2b2f147af0f3784ad4bf4491b06d8a636e52bda3fcd4cd55c81458618146");
const html=json(path.join(directory,"html-resolution.json"),"prospective_exact_actual_html_resolution","c735f646b3fa7133b768fe7f4dd0575268c2d9d1ea2c198c331d4d86a03ece15");
assert.equal(trace.trace_confirmation_status,"pass");
assert.equal(html.status,"pass");
assert.equal(html.all_six_complete_views_match,true);
assert.equal(html.option_count,24);
assert.equal(html.image_budget.opens_added,0);
assert.equal(old.definite_math_or_authoring_defects.length,0);
assert(old.rationale_misconception_comparisons.every((item)=>item.agrees&&item.generates_actual_option));
const traceDirectory=path.join(tmp,"geo910-n19-choice-current-trace");
const seed=json(path.join(traceDirectory,"seed.json"),"exact_current_review_binding_only_not_new_source_check","75407854ceca1d1058c0dac057f840707951dc09911e0ea8208839eb864d3c5b");
const draft=json(path.join(traceDirectory,"draft.json"),"exact_current_review_binding_only_not_new_option_check","ca93970e0d8d7517828dfd2c9584925b266f088fcebb2cebf9fe261de7427305");
const seedDigest=sha(canonical(seed)),draftDigest=sha(canonical(draft));
assert.equal(seedDigest,"ca8db4e6562985a58ec8e37905bbee7df6c305e89d6d60c0ffc74b8f0ffe29df");
assert.equal(draftDigest,"2e9a8b1d0d276528e6ed4918656641aff8880f07f9d43ad99d099fd8e10e8174");
assert.equal(draft.seed_sha256,seedDigest);
assert.equal(draft.new_figures.length,0);

const review={
  schema:"s10y-choice-review-v1",
  seed_sha256:seedDigest,
  draft_sha256:draftDigest,
  reviewer:old.reviewer,
  source_reviews:p1.source_reviews.map((source,index)=>{
    const coverage=p2.package_comparison.source_coverage[index];
    const authorComparison=old.source_solution_comparisons[index];
    const omitted=draft.coverage[index].omitted_tasks;
    return {
      source_number:source.source_number,
      independent_solution:source.independent_solution,
      coverage:{
        verdict:"pass",
        evidence:`${coverage.retained_judgment} All original task units ${source.task_units.join(", ")} retain substantive mathematical judgment. ${authorComparison.evidence} Author explicitly records production losses: ${omitted.join(" ")} Recognizing these relations does not demonstrate independently drawing or writing proofs. ${authorComparison.measurement_limit||authorComparison.logical_dependence||""} No essential source task is silently omitted. The new trace-only snapshot preserves these exact semantic leaves.`,
      },
    };
  }),
  figure_checks:p1.figure_checks.map((check)=>{
    const figure=seed.figures.find((item)=>item.id===check.figure_id);
    const asset=figure.assets[0];
    return {
      figure_id:check.figure_id,
      asset_path:asset.path,
      asset_sha256:asset.sha256,
      observation:`${check.observation} This exact source was opened once in Phase 1. Full 1440x3263 and 390x4016 learner screenshots were each opened once in Stage 3; both show the complete concept figure and its rightmost/bottommost meaningful objects without clipping. All 24 options and last 6D plus bottom margin are visible. Corrected actual HTML hash ${html.actual_html_sha256} matches the screenshot report and contains the same two figure placements. No image reopens; cumulative four opens. Source geometry is concept evidence, not independent proof of an unseen construction.`,
    };
  }),
  new_figure_reviews:[],
  question_reviews:p2.view_solutions.map((solution,index)=>{
    const question=draft.questions[index];
    const author=old.question_key_comparisons[index];
    assert.equal(question.id,author.question_id);
    const internalChecks=old.rationale_misconception_comparisons.filter((item)=>item.ordinal===index+1);
    return {
      question_id:question.id,
      task_fidelity:{
        verdict:"pass",
        evidence:`${solution.task_fidelity.evidence} Recorded production losses: ${solution.task_fidelity.capacity_losses.join(" ")} ${solution.task_fidelity.claim_limit||solution.task_fidelity.scope_note||""} Author intent/coverage explicitly agrees with these limitations. Static actual HTML reproduces the complete reviewed view and full desktop/mobile screenshots show all four alternatives.`,
      },
      redundancy:{
        verdict:"pass",
        evidence:`${solution.redundancy.evidence} ${solution.redundancy.independent_measurement_claim||""} Whole-package comparison found shared subtraction/midpoint concepts require actual transformations rather than a previous marked answer. Corrected HTML does not introduce duplicate questions or alternatives.`,
      },
      answer_leakage:{
        verdict:"pass",
        evidence:`${solution.answer_leakage.evidence} Full static HTML parsing matches six stems and 24 alternatives, with blank controls, no scripts, hidden answer attributes, internal keys, source solutions, rationales or coverage payloads. Both full learner screenshots show no correctness highlighting or source mappings. Mathematical transfer and acknowledged logical implications are not a marked complete-answer disclosure.`,
      },
      mathematics:{
        verdict:"pass",
        independent_solution:solution.independent_solution,
        correct:solution.independent_true_set,
        option_checks:solution.option_checks.map((option)=>{
          const rationale=internalChecks.find((item)=>item.option_id===option.option_id);
          return {
            option_id:option.option_id,
            truth:option.truth?"correct":"incorrect",
            evidence:`${option.evidence} ${option.counterexample?`Independent counterexample: ${option.counterexample} `:""}Author rationale/misconception comparison: ${rationale.evidence}`,
          };
        }),
      },
    };
  }),
  outcome:"pass",
};
assert.equal(review.source_reviews.length,6);
assert.equal(review.question_reviews.length,6);
assert.equal(review.question_reviews.flatMap((item)=>item.mathematics.option_checks).length,24);
assert.equal(review.reviewer.kind,"independent_agent");
const reviewPath=emit("review.json",review);
const p1Ledger=json(path.join(p1dir,"complete-inputhashledger.json"),"immutable_full_phase1_input_and_image_lineage","f34d76111f261f629c981e63914f5c1a209dfd70c10b52c21c4718764c125c2b");
const p2Ledger=json(path.join(p2dir,"complete-inputhashledger.json"),"immutable_full_phase2_input_and_image_lineage","da9fd5d2bc5dadad08d9a2eb16c2927c161283b9d9b4e7d5871ffbe0a71801bc");
const oldLedger=json(path.join(directory,"old-stage3-inputhashledger.json"),"immutable_full_old_stage3_input_and_image_lineage","272fc4def6198552b0ff1cba7bd98bb91640b1c3107818a78edf465dd8e9da56");
read(path.join(root,".agents/skills/ld-s10y-choice/references/contract.md"),"contract_reread_before_official_review","a9a44012fb526b24d8d0718c4e5e8966a49313c2a01548416cdd8699c2910083");
read(path.join(root,".agents/skills/ld-s10y-choice/references/review.md"),"review_order_and_semantic_gate_reread","7ab367601247bece0fa05b60a9cd1555d78f1169ed581db76f18385f75aaacea");
const fileNames=[
  "old-comparison-core.json","old-snapshot-comparison.md","freeze-old-stage3.mjs",
  "old-stage3-comparison.json","old-stage3-inputhashledger.json","old-stage3-freeze-manifest.json",
  "confirm-trace-only.mjs","trace-confirmation.json","trace-confirmation.md",
  "resolve-html.py","html-resolution.json","html-resolution.md","final-report.md",
  "finalize-review.mjs","review.json",
];
const outputs=fileNames.map((name)=>{
  const file=path.join(directory,name);
  return {path:file,sha256:sha(fs.readFileSync(file)),byte_length:fs.statSync(file).size};
});
const imageEvents=[
  ...p1Ledger.image_open_events.map((item)=>({phase:"phase1_source_first",...item})),
  ...oldLedger.image_events.map((item)=>({phase:"stage3_first_learner_observation",...item})),
];
assert.equal(imageEvents.length,4);
assert(imageEvents.every((item)=>!item.reopen));
const completedAt=new Date().toISOString();
const fullLedgerPath=emit("complete-inputhashledger.json",{
  schema:"s10y-choice-independent-stage3-complete-inputhashledger-v1",
  ticket:"STEMROBIN-184",completed_at:completedAt,
  reviewer:review.reviewer,
  final_seed_path:path.join(traceDirectory,"seed.json"),
  final_seed_raw_sha256:trace.seed_binding.current_raw_sha256,
  final_seed_canonical_sha256:seedDigest,
  final_draft_path:path.join(traceDirectory,"draft.json"),
  final_draft_raw_sha256:trace.draft_binding.current_raw_sha256,
  final_draft_canonical_sha256:draftDigest,
  stage_lineage:priorManifestRecords,
  current_finalization_inputs:inputs,
  phase1_full_inputs:p1Ledger.inputs,
  phase1_source_field_hashes:p1Ledger.source_fields,
  phase2_full_inputs:p2Ledger.inputs,
  phase2_view_option_hash_bindings:p2Ledger.view_bindings,
  stage3_old_full_inputs:oldLedger.inputs,
  trace_only_full_inputs:trace.inputs,
  html_resolution_full_inputs:html.inputs,
  all_image_open_events:imageEvents,
  image_budget:{total_opens:4,reopens:0,hard_limit:8,remaining:4,finalization_opens:0,parent_image_payloads_sent:0},
  review_order:["Phase1 exact-source independent solve and actual source figures.","Phase2 view-only fidelity/redundancy/leakage freeze before complete independent option truth sets.","Stage3 old snapshot internal keys/solutions/rationale/coverage comparison and two full learner screenshot observations.","Independent trace-only exact-scalar/byte recovery and selected-unit provenance confirmation.","New explicit actual HTML disclosure, full static view-only parse and prospective missing-path resolution.","Official current-bound review assembled from immutable independent evidence; no new source or option solve."],
  historical_failures_and_holds:{
    phase1_arithmetic_positive_negative_zero_attempt:"Retained in original Phase1 arithmetic-attempt-1.json; repaired numeric comparison before Phase1 freeze.",
    phase2_book_trace_drift:"Retained unchanged in Phase2 freeze-attempt-1.json, report and ledger; resolved prospectively for the current trace-only seed.",
    stage3_wrong_html_path_ENOENT:oldLedger.failed_exact_path_accesses,
    old_stage3_holds:old.holds,
    retrospective_pass:false,
    prospective_resolutions:[{path:path.join(directory,"trace-confirmation.json"),sha256:sha(fs.readFileSync(path.join(directory,"trace-confirmation.json")))},{path:path.join(directory,"html-resolution.json"),sha256:sha(fs.readFileSync(path.join(directory,"html-resolution.json")))}],
    unresolved_holds_for_exact_current_offline_content:[],
  },
  no_other_reviewer_verdict_read:true,no_author_tree_search:true,
  validator_runs_by_reviewer:0,with_review_validator_runs:0,parent_first_current_validator_pending:true,
  no_source_draft_or_other_worker_repairs:true,no_browser_capture_rerender_or_new_image_open:true,
  no_git_workflow_database_publish_or_dependency_write:true,
  allowed_writes:[directory],outside_allowed_writes:[],
  review_path:reviewPath,review_raw_sha256:sha(fs.readFileSync(reviewPath)),review_canonical_sha256:sha(canonical(review)),outcome:"pass",
  outputs,
});
const finalOutputs=[...outputs,{path:fullLedgerPath,sha256:sha(fs.readFileSync(fullLedgerPath)),byte_length:fs.statSync(fullLedgerPath).size}];
const manifestPath=emit("final-freeze-manifest.json",{
  schema:"s10y-choice-independent-stage3-final-freeze-manifest-v1",
  completed_at:completedAt,seed_sha256:seedDigest,draft_sha256:draftDigest,
  reviewer:review.reviewer,outcome:"pass",outputs:finalOutputs,
  prior_stage_freezes_unchanged:priorManifestRecords,
  historical_failures_retained:true,prospective_trace_and_HTML_resolution_pass:true,
  cumulative_image_opens:4,reopens:0,validator_run:false,
  scope:"Exact offline choice seed/draft semantic and supplied HTML/screenshot presentation review only; not app integration, judging, persistence, publishing or proof/drawing production.",
});
const listingPath=emit("file-list-hashes.json",{
  schema:"reviewer_owned_stage3_exact_file_list_v1",
  created_at:completedAt,
  files:[...finalOutputs,{path:manifestPath,sha256:sha(fs.readFileSync(manifestPath)),byte_length:fs.statSync(manifestPath).size}],
  self_hash:"Reported in tool output/final response; excluded from own list to avoid self-reference.",
});
console.log(JSON.stringify({
  outcome:review.outcome,seed_canonical_sha256:seedDigest,draft_canonical_sha256:draftDigest,
  review_raw_sha256:sha(fs.readFileSync(reviewPath)),review_canonical_sha256:sha(canonical(review)),
  final_report_sha256:sha(fs.readFileSync(path.join(directory,"final-report.md"))),
  complete_input_ledger_sha256:sha(fs.readFileSync(fullLedgerPath)),
  final_manifest_sha256:sha(fs.readFileSync(manifestPath)),
  file_list_sha256:sha(fs.readFileSync(listingPath)),
  keys:review.question_reviews.map((item)=>({id:item.question_id,correct:item.mathematics.correct})),
  cumulative_image_opens:4,reopens:0,validator_runs:0,unresolved_current_offline_holds:0,
  exact_files:[...finalOutputs,{path:manifestPath,sha256:sha(fs.readFileSync(manifestPath))},{path:listingPath,sha256:sha(fs.readFileSync(listingPath))}],
},null,2));
