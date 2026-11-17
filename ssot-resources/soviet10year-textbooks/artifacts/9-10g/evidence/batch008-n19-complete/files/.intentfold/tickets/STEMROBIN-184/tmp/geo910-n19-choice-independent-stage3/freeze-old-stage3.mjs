import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory=path.dirname(fileURLToPath(import.meta.url));
const tmp=path.dirname(directory);
const sha=(value)=>crypto.createHash("sha256").update(value).digest("hex");
const canonical=(value)=>{
  if(Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if(value!==null&&typeof value==="object") return `{${Object.keys(value).sort().map((key)=>`${canonical(key)}:${canonical(value[key])}`).join(",")}}`;
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g,(char)=>`\\u${char.charCodeAt(0).toString(16).padStart(4,"0")}`);
};
const inputs=[];
const read=(file,role,expected=null)=>{
  const bytes=fs.readFileSync(file),hash=sha(bytes);
  if(expected!==null) assert.equal(hash,expected,file);
  inputs.push({path:file,sha256:hash,byte_length:bytes.length,role});
  return bytes;
};
const json=(file,role,expected=null)=>JSON.parse(read(file,role,expected));
const core=json(path.join(directory,"old-comparison-core.json"),"reviewer_owned_old_stage3_semantic_and_visual_comparison");
const p1dir=path.join(tmp,"geo910-n19-choice-independent-source-first-evidence");
const p2dir=path.join(tmp,"geo910-n19-choice-independent-phase2");
for(const [dir,expected] of [[p1dir,"ac6b1c4143af087eb884a610326910322810eaee23ec9240a66dc2b3dc1219cc"],[p2dir,"3ff621b18e29f3f5c9a8ce5e8e5a643032bcfdf8a2ed00179d38b1b35936d3f7"]]){
  const manifest=json(path.join(dir,"freeze-manifest.json"),"immutable_prior_phase_manifest",expected);
  for(const output of manifest.outputs) assert.equal(sha(fs.readFileSync(output.path)),output.sha256,output.path);
}
const p1=json(path.join(p1dir,"phase1.json"),"immutable_independent_source_solution_evidence","4badbaaab17ead450654885350c72759d09e7efc0d79ef92234cb8b66214c4fc");
const p2=json(path.join(p2dir,"phase2.json"),"immutable_view_only_option_evidence","c0ace941b0ed1643056ffbd84e79320605fcb64206177818a6c9bcfb25575fec");
const draft=json(path.join(tmp,"geo910-n19-choice-draft.json"),"authorized_old_internal_draft","66177023f289c68af900d9d4da709e47da4b8cd6c7ec4292f1ca96580dbbda25");
assert.equal(sha(canonical(draft)),"ba38e6e96f906c523187d27433793c61bd5672c845a249556404187c719ee46e");
const bindings=json(path.join(tmp,"geo910-n19-choice-author/snapshot-bindings.json"),"authorized_author_binding_record","0abe5d3b0351973291a63fa50063356084edfb9e376e88a7a688e2ad6767c215");
const validation=json(path.join(tmp,"geo910-n19-choice-author/validation-record.json"),"authorized_historical_author_validation_only","6832612d1f5a8b52c1f1302bd555f1ccfc1cd8824f9b07b5acb3bd0bb68c19ee");
json(path.join(tmp,"geo910-n19-choice-author/command-provenance.json"),"authorized_author_command_provenance","25f9a148db697f5d6040140403d4d3652a485417d4addb5e4bc32d7490f05244");
read(path.join(tmp,"geo910-n19-choice-author-report.md"),"authorized_author_report","a1698fe618a0d46ebbd7f7b04d8499ca88dec1ce68e472b148926486f7d2016e");
const authorFreeze=path.join(tmp,"geo910-n19-choice-author/source-solutions-frozen.md");
read(authorFreeze,"authorized_author_source_freeze","480ff771e1f48b9769fa18e725a0b3281bab674ed6962d6935f1d0189291dcb5");
assert.equal(bindings.files["source-solutions-frozen.md"].file_sha256,sha(fs.readFileSync(authorFreeze)));
assert.equal(validation.draft_file_sha256,sha(fs.readFileSync(path.join(tmp,"geo910-n19-choice-draft.json"))));
assert.equal(validation.exit_code,0);
assert.equal(validation.review_argument,null);
const offline=path.join(tmp,"offline/geo910-c1-s2-n19");
const displayReport=json(path.join(offline,"choices-report.json"),"authorized_learner_geometry_report_not_a_semantic_verdict","d6bad43525ac22eceb4b07043d40381b1298d96b970870f758dacaa5230529b1");
for(const shot of [core.learner_screenshot_comparison.desktop,core.learner_screenshot_comparison.mobile]){
  const bytes=read(shot.path,"authorized_full_screenshot_opened_once",shot.sha256);
  assert.equal(bytes.readUInt32BE(16),shot.dimensions[0]);
  assert.equal(bytes.readUInt32BE(20),shot.dimensions[1]);
}
assert.deepEqual(displayReport.questionIds,draft.questions.map((item)=>item.id));
assert(displayReport.observations.every((item)=>item.geometry.options.length===24));
const htmlPath=path.join(offline,"choices.html");
assert.equal(fs.existsSync(htmlPath),false,"If exact HTML has appeared, inspect it explicitly before changing the hold.");
for(let index=0;index<draft.questions.length;index++){
  const q=draft.questions[index],prior=p2.view_solutions[index],comparison=core.question_key_comparisons[index];
  assert.equal(sha(canonical(q.view)),prior.view_sha256);
  assert.equal(q.id,comparison.question_id);
  assert.deepEqual(q.key.correct,prior.independent_true_set);
  assert.deepEqual(q.source_numbers,[p1.source_reviews[index].source_number]);
  assert.deepEqual(draft.coverage[index].question_ids,[q.id]);
  assert(q.intent.limitations.length>0&&draft.coverage[index].omitted_tasks.length>0);
  for(const rationale of q.key.rationales){
    const check=core.rationale_misconception_comparisons.find((item)=>item.ordinal===index+1&&item.option_id===rationale.option_id);
    assert(check.agrees&&check.generates_actual_option);
    assert.equal(rationale.truth,check.author_truth);
    assert.equal(rationale.truth==="correct",prior.option_checks.find((item)=>item.option_id===rationale.option_id).truth);
  }
}
assert.equal(core.rationale_misconception_comparisons.length,24);
assert.equal(core.learner_screenshot_comparison.image_count.cumulative_opens,4);
assert.equal(core.learner_screenshot_comparison.image_count.reopens,0);
const frozenAt=new Date().toISOString();
const emit=(name,value)=>{
  const file=path.join(directory,name);
  fs.writeFileSync(file,`${JSON.stringify(value,null,2)}\n`,{flag:"wx"});
  return file;
};
const snapshotPath=emit("old-stage3-comparison.json",{
  ...core,frozen_at:frozenAt,
  trace_only_files_read_before_this_freeze:false,
  view_bindings:draft.questions.map((q,index)=>({ordinal:index+1,id:q.id,view_sha256:sha(canonical(q.view)),key:q.key.correct})),
  independent_evidence_lineage:{phase1_sha256:sha(fs.readFileSync(path.join(p1dir,"phase1.json"))),phase2_sha256:sha(fs.readFileSync(path.join(p2dir,"phase2.json")))},
});
const outputs=[snapshotPath,path.join(directory,"old-comparison-core.json"),path.join(directory,"old-snapshot-comparison.md"),fileURLToPath(import.meta.url)].map((file)=>({path:file,sha256:sha(fs.readFileSync(file)),byte_length:fs.statSync(file).size}));
const ledgerPath=emit("old-stage3-inputhashledger.json",{
  schema:"s10y-choice-independent-old-stage3-inputhashledger-v1",frozen_at:frozenAt,inputs,
  failed_exact_path_accesses:[{path:htmlPath,operation:"read and exact stat",error:"ENOENT",expected_sha256:"7365b1bf83cd1a75425e2e034ae9b1817d58823956c4156527d3bc9bbcaa706c",alternative_search:false}],
  image_events:[core.learner_screenshot_comparison.desktop,core.learner_screenshot_comparison.mobile].map((shot,index)=>({sequence:index+3,path:shot.path,sha256:shot.sha256,viewer:"functions.view_image detail original",full_image:true,crop:false,reopen:false})),
  cumulative_image_count:core.learner_screenshot_comparison.image_count,
  outputs,allowed_writes:[directory],outside_allowed_writes:[],author_directory_search:false,
  old_source_freshness_hold_preserved:true,validator_runs:0,trace_only_disclosure_processed:false,
});
outputs.push({path:ledgerPath,sha256:sha(fs.readFileSync(ledgerPath)),byte_length:fs.statSync(ledgerPath).size});
const manifestPath=emit("old-stage3-freeze-manifest.json",{
  schema:"s10y-choice-independent-old-stage3-freeze-manifest-v1",frozen_at:frozenAt,outputs,
  old_seed_sha256:core.old_seed_canonical_sha256,old_draft_sha256:core.old_draft_canonical_sha256,
  trace_only_disclosure_processed:false,cumulative_image_opens:4,reopens:0,holds:core.holds,
  semantic_defects:core.definite_math_or_authoring_defects,official_review_created:false,
});
console.log(JSON.stringify({old_stage3_frozen:true,report_sha256:sha(fs.readFileSync(path.join(directory,"old-snapshot-comparison.md"))),structured_sha256:sha(fs.readFileSync(snapshotPath)),input_ledger_sha256:sha(fs.readFileSync(ledgerPath)),manifest_sha256:sha(fs.readFileSync(manifestPath)),option_comparisons:24,cumulative_image_opens:4,reopens:0,holds:core.holds.map((item)=>item.id)},null,2));
