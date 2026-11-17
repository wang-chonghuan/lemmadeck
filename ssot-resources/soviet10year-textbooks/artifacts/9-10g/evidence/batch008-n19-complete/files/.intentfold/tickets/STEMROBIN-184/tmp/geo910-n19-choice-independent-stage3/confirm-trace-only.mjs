import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root="/Users/yong/.codex/worktrees/a07e/lemmadeck";
const directory=path.dirname(fileURLToPath(import.meta.url));
const tmp=path.dirname(directory);
const traceDirectory=path.join(tmp,"geo910-n19-choice-current-trace");
const sha=(value)=>crypto.createHash("sha256").update(value).digest("hex");
const canonical=(value)=>{
  if(Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if(value!==null&&typeof value==="object") return `{${Object.keys(value).sort().map((key)=>`${canonical(key)}:${canonical(value[key])}`).join(",")}}`;
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g,(char)=>`\\u${char.charCodeAt(0).toString(16).padStart(4,"0")}`);
};
const inputs=[];
const read=(file,role,expected=null)=>{
  const bytes=fs.readFileSync(file),digest=sha(bytes);
  if(expected!==null) assert.equal(digest,expected,file);
  inputs.push({path:file,realpath:fs.realpathSync(file),sha256:digest,byte_length:bytes.length,role});
  return bytes;
};
const json=(file,role,expected=null)=>JSON.parse(read(file,role,expected));
const oldManifestPath=path.join(directory,"old-stage3-freeze-manifest.json");
const oldManifest=json(oldManifestPath,"old_stage3_frozen_before_trace_disclosure","a8b6b453641808e3b2104616f9cd7780ccf9803230470cc1bd087f343e5f61cf");
assert.equal(oldManifest.trace_only_disclosure_processed,false);
for(const output of oldManifest.outputs) assert.equal(sha(fs.readFileSync(output.path)),output.sha256,output.path);

const oldSeedBytes=read(path.join(tmp,"geo910-n19-choice-seed.json"),"immutable_old_seed","387ab4aeea2bb091ca3e07ce97dfb23e0854c05e27eb4a5c826e2a499c1d3e96");
const oldDraftBytes=read(path.join(tmp,"geo910-n19-choice-draft.json"),"immutable_old_draft","66177023f289c68af900d9d4da709e47da4b8cd6c7ec4292f1ca96580dbbda25");
const copiedSeedBytes=read(path.join(traceDirectory,"before-seed.json"),"authorized_exact_before_seed_copy",sha(oldSeedBytes));
const copiedDraftBytes=read(path.join(traceDirectory,"before-draft.json"),"authorized_exact_before_draft_copy",sha(oldDraftBytes));
assert(oldSeedBytes.equals(copiedSeedBytes));
assert(oldDraftBytes.equals(copiedDraftBytes));
const currentSeedBytes=read(path.join(traceDirectory,"seed.json"),"authorized_trace_only_current_seed","75407854ceca1d1058c0dac057f840707951dc09911e0ea8208839eb864d3c5b");
const currentDraftBytes=read(path.join(traceDirectory,"draft.json"),"authorized_trace_only_current_draft","ca93970e0d8d7517828dfd2c9584925b266f088fcebb2cebf9fe261de7427305");
const oldSeed=JSON.parse(oldSeedBytes),oldDraft=JSON.parse(oldDraftBytes);
const currentSeed=JSON.parse(currentSeedBytes),currentDraft=JSON.parse(currentDraftBytes);
assert.equal(sha(canonical(currentSeed)),"ca8db4e6562985a58ec8e37905bbee7df6c305e89d6d60c0ffc74b8f0ffe29df");
assert.equal(sha(canonical(currentDraft)),"2e9a8b1d0d276528e6ed4918656641aff8880f07f9d43ad99d099fd8e10e8174");
const pointer=(value)=>value.replace(/~/g,"~0").replace(/\//g,"~1");
const differences=(before,after,prefix="")=>{
  if(canonical(before)===canonical(after)) return [];
  if(before===null||after===null||typeof before!=="object"||typeof after!=="object"||Array.isArray(before)!==Array.isArray(after)) return [prefix||"/"];
  if(Array.isArray(before)&&before.length!==after.length) return [prefix||"/"];
  const keys=[...new Set([...Object.keys(before),...Object.keys(after)])].sort();
  return keys.flatMap((key)=>Object.hasOwn(before,key)&&Object.hasOwn(after,key)
    ?differences(before[key],after[key],`${prefix}/${pointer(key)}`)
    :[`${prefix}/${pointer(key)}`]);
};
const seedDifferences=differences(oldSeed,currentSeed);
const draftDifferences=differences(oldDraft,currentDraft);
assert.deepEqual(seedDifferences,["/trace/0/sha256"]);
assert.deepEqual(draftDifferences,["/seed_sha256"]);
assert.equal(currentDraft.seed_sha256,sha(canonical(currentSeed)));
assert.equal(oldDraft.seed_sha256,sha(canonical(oldSeed)));
const reverseOnlyScalar=(afterBytes,afterScalar,beforeScalar,beforeBytes)=>{
  const text=afterBytes.toString("utf8");
  const token=JSON.stringify(afterScalar),oldToken=JSON.stringify(beforeScalar);
  const index=text.indexOf(token);
  assert(index>=0&&text.indexOf(token,index+token.length)<0,"Expected exactly one scalar token");
  const reversed=Buffer.from(text.slice(0,index)+oldToken+text.slice(index+token.length),"utf8");
  assert(reversed.equals(beforeBytes),"Reverse scalar replacement must recover every exact old byte");
  return {after_token:token,before_token:oldToken,byte_offset:Buffer.byteLength(text.slice(0,index),"utf8"),recovered_raw_sha256:sha(reversed),all_other_bytes_identical:true};
};
const seedReverse=reverseOnlyScalar(currentSeedBytes,currentSeed.trace[0].sha256,oldSeed.trace[0].sha256,oldSeedBytes);
const draftReverse=reverseOnlyScalar(currentDraftBytes,currentDraft.seed_sha256,oldDraft.seed_sha256,oldDraftBytes);
const parentReport=json(path.join(traceDirectory,"report.json"),"authorized_parent_trace_report_not_substitute_for_independent_check");
read(path.join(tmp,"n19-trace-only-snapshot-once.py"),"authorized_parent_script_read_only_not_executed");
const promotion=json(path.join(tmp,"assembly-9g-p8-p76/promotion.json"),"authorized_assembly_provenance_only","907f9f846927f2ec0798f20d1fa202c0bf52a095d6cce9d5fce9a3770ce59ce4");
const beforeBook=json(path.join(tmp,"assembly-9g-p8-p76/before-book.json"),"authorized_before_book_only_source_unit_and_structure_comparison",oldSeed.trace[0].sha256);
const currentBook=json(path.join(root,currentSeed.trace[0].path),"authorized_current_book_only_source_unit_and_structure_comparison",currentSeed.trace[0].sha256);
assert.equal(promotion.book.sha256,currentSeed.trace[0].sha256);
assert.equal(promotion.status,"SOURCE_N20_CLOSED_N21_OPEN_ONLY");
assert.equal(parentReport.current_book.sha256,currentSeed.trace[0].sha256);
const lesson=oldSeed.source.lesson;
const select=(book)=>{
  const entries=book.lessons.filter((item)=>item.id===lesson);
  assert.equal(entries.length,1);
  return entries[0];
};
const beforeUnit=select(beforeBook),currentUnit=select(currentBook);
assert.deepEqual(beforeUnit,currentUnit);
assert.deepEqual(beforeUnit,parentReport.selected_book_unit_identical);
const sourceChecks=[];
for(const item of currentSeed.trace.slice(1)){
  read(path.join(root,item.path),"selected_modern_json_hash_only_not_new_source_solution",item.sha256);
  sourceChecks.push({path:path.join(root,item.path),sha256:item.sha256,type:"selected_modern_json"});
}
for(const figure of currentSeed.figures){
  for(const asset of figure.assets){
    read(path.join(root,asset.path),"selected_actual_svg_hash_only_no_reopen",asset.sha256);
    sourceChecks.push({path:path.join(root,asset.path),sha256:asset.sha256,type:"actual_svg"});
  }
}
assert.equal(sourceChecks.length,5);
for(const item of sourceChecks){
  const parentEntry=parentReport.unchanged_source_and_assets.find((entry)=>entry.path===item.path);
  assert(parentEntry&&parentEntry.sha256===item.sha256);
}
for(const key of ["source","exercises","concepts","figures"]) assert.deepEqual(oldSeed[key],currentSeed[key]);
for(const key of ["questions","coverage","new_figures"]) assert.deepEqual(oldDraft[key],currentDraft[key]);
const p2=json(path.join(tmp,"geo910-n19-choice-independent-phase2/phase2.json"),"frozen_independent_view_truth_sets","c0ace941b0ed1643056ffbd84e79320605fcb64206177818a6c9bcfb25575fec");
currentDraft.questions.forEach((question,index)=>{
  assert.equal(sha(canonical(question.view)),p2.view_solutions[index].view_sha256);
  assert.deepEqual(question.key.correct,p2.view_solutions[index].independent_true_set);
});
const structuralBookDifferences=differences(beforeBook,currentBook);
const record={
  schema:"s10y-choice-independent-stage3-trace-confirmation-v1",
  confirmed_at:new Date().toISOString(),
  reviewer_check:"Independent structured JSON comparison, exact reverse scalar byte recovery, source-unit comparison and hash-only selected source/asset checks; parent script not executed.",
  trace_confirmation_status:"pass",
  seed_binding:{old_canonical_sha256:sha(canonical(oldSeed)),current_canonical_sha256:sha(canonical(currentSeed)),old_raw_sha256:sha(oldSeedBytes),current_raw_sha256:sha(currentSeedBytes)},
  draft_binding:{old_canonical_sha256:sha(canonical(oldDraft)),current_canonical_sha256:sha(canonical(currentDraft)),old_raw_sha256:sha(oldDraftBytes),current_raw_sha256:sha(currentDraftBytes)},
  exact_changed_fields:{seed:seedDifferences,draft:draftDifferences},
  exact_byte_recovery:{seed:seedReverse,draft:draftReverse},
  before_copies_equal_old_original_bytes:true,
  unchanged_source_unit:beforeUnit,
  source_unit_canonical_sha256:sha(canonical(beforeUnit)),
  selected_modern_jsons_and_actual_svgs:sourceChecks,
  unchanged_semantic_leaves:{full_source_prose_and_definitions:true,figures_and_assets:true,question_ids_modes_stems_options:true,internal_intents_solutions_keys_rationales:true,coverage_and_limitations:true},
  book_structural_differences:structuralBookDifferences,
  book_diff_scope_note:"Book inventory/audit/page/unit extension was compared structurally; only selected n19 source-unit entry is emitted as content. No other lesson is used as mathematical input.",
  old_stage3_frozen_before_trace:{path:oldManifestPath,sha256:sha(fs.readFileSync(oldManifestPath)),trace_only_disclosure_processed:oldManifest.trace_only_disclosure_processed},
  historical_hold_disposition:"Phase 2 and old Stage 3 continue to record the historical book-trace mismatch. Current snapshot prospectively matches current book and unchanged n19 leaves; prior artifacts were not edited or retroactively passed.",
  semantic_review_reused:"All frozen independent source/view evidence and old Stage 3 comparisons transfer to the new exact snapshot because their semantic leaves are byte-identical.",
  image_count:{cumulative_opens:4,reopens:0,trace_confirmation_image_opens:0,remaining:4},
  remaining_hold:"The exact authorized choices.html path remains absent unless separately made available or an actual path is disclosed. No official final review is produced merely by trace confirmation.",
  validator_runs:0,parent_script_runs:0,seed_prepare_runs:0,source_resolves:0,source_or_draft_writes:0,
  inputs,
};
fs.writeFileSync(path.join(directory,"trace-confirmation.json"),`${JSON.stringify(record,null,2)}\n`,{flag:"wx"});
console.log(JSON.stringify({
  trace_confirmation_status:record.trace_confirmation_status,
  exact_changed_fields:record.exact_changed_fields,
  reverse_byte_recovery:true,
  selected_unit_unchanged:true,
  selected_source_asset_hashes_match:5,
  seed_canonical_sha256:record.seed_binding.current_canonical_sha256,
  draft_canonical_sha256:record.draft_binding.current_canonical_sha256,
  confirmation_raw_sha256:sha(fs.readFileSync(path.join(directory,"trace-confirmation.json"))),
  cumulative_image_opens:4,reopens:0,
  remaining_hold:record.remaining_hold,
},null,2));
