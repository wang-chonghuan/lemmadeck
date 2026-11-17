import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root="/Users/yong/.codex/worktrees/a07e/lemmadeck";
const directory=path.dirname(fileURLToPath(import.meta.url));
const tmp=path.dirname(directory);
const previous=path.join(tmp,"geo910-n19-choice-independent-source-first-evidence");
const viewPath=path.join(tmp,"geo910-n19-choice-author/view-projection.json");
const sha=(bytes)=>crypto.createHash("sha256").update(bytes).digest("hex");
const canonical=(value)=>{
  if(Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if(value!==null&&typeof value==="object") return `{${Object.keys(value).sort().map((key)=>`${canonical(key)}:${canonical(value[key])}`).join(",")}}`;
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g,(char)=>`\\u${char.charCodeAt(0).toString(16).padStart(4,"0")}`);
};
const inputRecords=[];
const record=(file,role,expected=null,parsed=false,strict=true)=>{
  const bytes=fs.readFileSync(file);
  const digest=sha(bytes);
  if(expected!==null&&strict) assert.equal(digest,expected,file);
  inputRecords.push({path:file,realpath:fs.realpathSync(file),role,sha256:digest,expected_sha256:expected,matches_expected:expected===null?null:digest===expected,byte_length:bytes.length,parsed_as_json:parsed});
  return bytes;
};
const parse=(file,role,expected=null)=>JSON.parse(record(file,role,expected,true));
const emit=(name,value)=>{
  const file=path.join(directory,name);
  assert(file.startsWith(`${directory}/`));
  fs.writeFileSync(file,`${JSON.stringify(value,null,2)}\n`,{flag:"wx"});
  return file;
};
const projectionBytes=record(viewPath,"sole_new_author_side_input_only_six_ordered_views","1c367422b9bc7b29eebc482b43f9929410e18a6ef107c8483a0bb2ad7e84492d",true);
const views=JSON.parse(projectionBytes);
assert.equal(sha(canonical(views)),"216ddb69385534bf89ffc6e696ce541230487b8d517b98903afa9344f75489c5");
assert(Array.isArray(views)&&views.length===6);
for(const view of views){
  assert.deepEqual(Object.keys(view).sort(),["figure_ids","mode","options","stem"]);
  assert(["single","multiple"].includes(view.mode));
  assert.deepEqual(view.options.map((item)=>item.id),["A","B","C","D"]);
  for(const option of view.options) assert.deepEqual(Object.keys(option).sort(),["figure_ids","id","text"]);
}
const manifestPath=path.join(previous,"freeze-manifest.json");
const phase1Manifest=parse(manifestPath,"frozen_phase1_manifest_lineage","ac6b1c4143af087eb884a610326910322810eaee23ec9240a66dc2b3dc1219cc");
for(const output of phase1Manifest.outputs) assert.equal(sha(fs.readFileSync(output.path)),output.sha256,`Phase1 frozen output changed: ${output.path}`);
const phase1=parse(path.join(previous,"phase1.json"),"frozen_complete_source_solutions_reused","4badbaaab17ead450654885350c72759d09e7efc0d79ef92234cb8b66214c4fc");
const phase1Ledger=parse(path.join(previous,"complete-inputhashledger.json"),"frozen_phase1_complete_input_ledger_lineage","f34d76111f261f629c981e63914f5c1a209dfd70c10b52c21c4718764c125c2b");
record(path.join(tmp,"geo910-n19-choice-independent-source-first.md"),"frozen_source_first_report_reused_hash_check_only","6b8496e1eed21d1b1f9cb161eb3c6638af2fb97f65e68c31b7b8b68abe3bef9a");
assert.equal(sha(canonical(phase1.exact_source)),"21aba5ade30915e19ae40469c14a891e7b70f16f33ac4e9c32f7fe14536de2f4");
record(path.join(tmp,"geo910-n19-choice-seed.json"),"unchanged_seed_hash_only","387ab4aeea2bb091ca3e07ce97dfb23e0854c05e27eb4a5c826e2a499c1d3e96");
for(const trace of phase1.exact_source.trace) record(path.join(root,trace.path),"source_trace_freshness_hash_only_no_extra_prose",trace.sha256,false,false);
for(const figure of phase1.exact_source.figures){
  for(const asset of figure.assets) record(path.join(root,asset.path),"unchanged_exact_source_svg_hash_only_no_image_open",asset.sha256);
}
const prePath=path.join(directory,"pre-mathematics.json");
const pre=parse(prePath,"reviewer_owned_fidelity_redundancy_leakage_before_option_math","db0014fca51397d2251b854b03cd5599d70ace301a63b10aaeb6e435301b2451");
const core=parse(path.join(directory,"solution-core.json"),"reviewer_owned_independent_ordinal_option_derivations");
const arithmetic=parse(path.join(directory,"mathematics-evidence.json"),"reviewer_owned_arithmetic_and_linear_coefficient_check");
assert.equal(arithmetic.assertions_completed,true);
assert.equal(arithmetic.ordinal_count,6);
assert.equal(arithmetic.option_count,24);
assert.equal(core.formal_review_outcome,null);
assert.equal(core.author_key_seen,false);
assert.equal(core.author_reasoning_or_judgments_seen,false);
assert.equal(core.image_scope.phase2_opens,0);
assert.equal(core.image_scope.phase2_reopens,0);
assert.equal(core.image_scope.cumulative_opens,2);
assert.equal(core.image_scope.cumulative_reopens,0);
assert.equal(pre.image_opens_this_phase,0);
const figureIds=[...new Set(views.flatMap((view)=>[
  ...view.figure_ids,...view.options.flatMap((option)=>option.figure_ids),
]))];
assert.deepEqual(figureIds.sort(),["fig-75","fig-76"]);
for(let index=0;index<views.length;index++){
  const solution=core.view_solutions[index];
  const view=views[index];
  assert.equal(solution.ordinal,index+1);
  assert.equal(solution.mode,view.mode);
  assert.deepEqual(solution.option_checks.map((item)=>item.option_id),view.options.map((item)=>item.id));
  assert.deepEqual(solution.option_checks.filter((item)=>item.truth).map((item)=>item.option_id),solution.independent_true_set);
  if(view.mode==="single") assert.equal(solution.independent_true_set.length,1);
  assert(solution.option_checks.every((item)=>item.evidence.length>0));
}
assert.equal(core.package_comparison.source_coverage.flatMap((item)=>item.task_units_retained).length,12);
assert.equal(core.package_comparison.definite_revisions_required_from_authorized_text.length,0);
const frozenAt=new Date().toISOString();
const ambientTraceChecks=inputRecords.filter((item)=>item.role==="source_trace_freshness_hash_only_no_extra_prose");
const traceDrift=ambientTraceChecks.filter((item)=>item.matches_expected===false);
assert.equal(traceDrift.length,1,"The documented hold covers precisely the book trace drift, not additional changed source files.");
assert.equal(traceDrift[0].path,path.join(root,"ssot-resources/soviet10year-textbooks/artifacts/9-10g/book.json"));
assert.equal(traceDrift[0].sha256,"5b63a28aa65fe2ce87bf8ddb4a3c9dcb3eef85b572d42812ce84172e25a4b20d");
assert(core.holds.some((item)=>item.id==="ambient_book_trace_drift"));
const solutions=core.view_solutions.map((solution,index)=>({
  ...solution,
  view_sha256:sha(canonical(views[index])),
  exact_disclosed_view:views[index],
  option_hashes:views[index].options.map((option)=>({
    option_id:option.id,
    canonical_sha256:sha(canonical(option)),
    text_utf8_sha256:sha(option.text),
  })),
}));
const phase2Path=emit("phase2.json",{
  ...core,
  schema:"s10y-choice-independent-phase2-ordinal-viewhash-freeze-v1",
  status:"frozen_view_only_independent_solutions_awaiting_explicit_stage3_and_display",
  frozen_at:frozenAt,
  projection_path:viewPath,
  projection_raw_sha256:sha(projectionBytes),
  projection_canonical_sha256:sha(canonical(views)),
  phase1_lineage:{
    manifest_path:manifestPath,
    manifest_sha256:sha(fs.readFileSync(manifestPath)),
    phase1_json_sha256:sha(fs.readFileSync(path.join(previous,"phase1.json"))),
    report_sha256:sha(fs.readFileSync(path.join(tmp,"geo910-n19-choice-independent-source-first.md"))),
    complete_input_ledger_sha256:sha(fs.readFileSync(path.join(previous,"complete-inputhashledger.json"))),
    seed_canonical_sha256:phase1.seed_sha256,
    frozen_outputs_verified_unchanged:phase1Manifest.outputs.length,
    source_solutions_revised:false,
  },
  view_solutions:solutions,
  mathematics_evidence_path:path.join(directory,"mathematics-evidence.json"),
  ambient_trace_freshness:{
    status:"unresolved_book_trace_drift",
    checks:ambientTraceChecks,
    refreshed_seed:false,
    book_contents_parsed:false,
    mathematical_impact_inferred:false,
  },
  source_figures_reused:phase1.figure_checks,
});
const outputPaths=[
  path.join(directory,"comparison.md"),
  path.join(directory,"pre-mathematics.json"),
  path.join(directory,"solution-core.json"),
  path.join(directory,"check-mathematics.mjs"),
  path.join(directory,"mathematics-evidence.json"),
  path.join(directory,"freeze-phase2.mjs"),
  path.join(directory,"freeze-attempt-1.json"),
  phase2Path,
];
const outputs=outputPaths.map((file)=>({path:file,sha256:sha(fs.readFileSync(file)),byte_length:fs.statSync(file).size}));
const ledgerPath=emit("complete-inputhashledger.json",{
  schema:"s10y-choice-independent-phase2-complete-inputhashledger-v1",
  ticket:"STEMROBIN-184",
  frozen_at:frozenAt,
  workspace:root,
  allowed_writes:[directory],
  outside_allowed_writes:[],
  sole_new_author_input:viewPath,
  inputs:inputRecords,
  prior_phase1_input_lineage:{
    path:path.join(previous,"complete-inputhashledger.json"),
    sha256:sha(fs.readFileSync(path.join(previous,"complete-inputhashledger.json"))),
    input_records:phase1Ledger.inputs,
    phase1_image_events:phase1Ledger.image_open_events,
    note:"Historical Phase 1 access records are lineage, not new Phase 2 image reads. Phase 2 verifies selected hashes only and reuses already-frozen solutions.",
  },
  view_bindings:solutions.map((solution)=>({
    ordinal:solution.ordinal,
    canonical_view_sha256:solution.view_sha256,
    option_hashes:solution.option_hashes,
    independent_true_set:solution.independent_true_set,
  })),
  exact_authorized_frozen_seed_and_projection_unchanged:true,
  all_ambient_source_trace_hashes_match:false,
  ambient_trace_checks:ambientTraceChecks,
  source_freshness_status:"unresolved_book_trace_drift",
  retained_failed_freeze_attempt:path.join(directory,"freeze-attempt-1.json"),
  phase1_outputs_unchanged:phase1Manifest.outputs.length,
  stage2_review_order:{
    first:"Read only the exact authorized projection after both digests matched.",
    second:"Freeze fidelity, redundancy and leakage in pre-mathematics.json.",
    third:"Independently derive every option and complete true sets, then package dependencies.",
    fourth:"Run reviewer-owned arithmetic/coefficient checks and bind ordinals to canonical view hashes.",
    source_solving:"Reuse frozen Phase 1; no new source solutions or source snapshot.",
  },
  image_scope:core.image_scope,
  phase2_image_open_events:[],
  author_directory_access:"Only the exact explicitly disclosed view-projection.json; no enumeration or search.",
  undisclosed_and_unread:[
    "Internal question IDs",
    "Draft and intent/source_solution",
    "Author key, rationales and misconception derivations",
    "Author reports, coverage records and judgments",
    "Other reviewer outputs",
    "Author renderer code or caption fix",
    "Previous choices, answers, interactions, judging parts and old skill tests",
    "Actual learner HTML and desktop/mobile screenshots",
  ],
  parent_caption_renderer_statement:"User-provided context only; not inspected as implementation or treated as visual evidence.",
  no_browser_or_server_run:true,
  no_source_edition_database_publish_git_or_workflow_write:true,
  no_draft_repair:true,
  formal_review_outcome:null,
  outputs,
});
const finalOutputs=[...outputs,{path:ledgerPath,sha256:sha(fs.readFileSync(ledgerPath)),byte_length:fs.statSync(ledgerPath).size}];
const freezePath=emit("freeze-manifest.json",{
  schema:"s10y-choice-independent-phase2-freeze-manifest-v1",
  phase:"phase2_view_only",
  frozen_at:frozenAt,
  projection_path:viewPath,
  projection_raw_sha256:sha(projectionBytes),
  projection_canonical_sha256:sha(canonical(views)),
  phase1_manifest_sha256:sha(fs.readFileSync(manifestPath)),
  pre_mathematics_sha256:sha(fs.readFileSync(prePath)),
  outputs:finalOutputs,
  ordinal_results:solutions.map((solution)=>({
    ordinal:solution.ordinal,
    view_sha256:solution.view_sha256,
    independent_true_set:solution.independent_true_set,
  })),
  definite_text_or_math_revisions:[],
  holds:core.holds,
  ambient_source_freshness:"unresolved_book_trace_drift",
  phase2_image_opens:0,
  cumulative_image_opens:2,
  cumulative_reopens:0,
  formal_review_outcome:null,
  next_action_requires:"Separate explicit Stage 3 internal comparison disclosure. Actual learner display evidence remains a separate visual hold.",
});
for(const output of phase1Manifest.outputs) assert.equal(sha(fs.readFileSync(output.path)),output.sha256);
console.log(JSON.stringify({
  status:"phase2_frozen",
  projection_raw_sha256:sha(projectionBytes),
  projection_canonical_sha256:sha(canonical(views)),
  report_sha256:sha(fs.readFileSync(path.join(directory,"comparison.md"))),
  phase2_json_sha256:sha(fs.readFileSync(phase2Path)),
  input_ledger_sha256:sha(fs.readFileSync(ledgerPath)),
  freeze_manifest_sha256:sha(fs.readFileSync(freezePath)),
  ordinal_results:solutions.map((solution)=>({ordinal:solution.ordinal,view_sha256:solution.view_sha256,independent_true_set:solution.independent_true_set})),
  image_opens_this_phase:0,
  cumulative_image_opens:2,
  reopens:0,
  formal_review_outcome:null,
},null,2));
