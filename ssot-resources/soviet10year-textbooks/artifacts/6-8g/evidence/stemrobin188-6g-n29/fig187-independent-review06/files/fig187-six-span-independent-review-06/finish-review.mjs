import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { root, repo, binding, write, capture } from "./capture.mjs";

const external = new Map();
function verify(record, replacement = null) {
  const actual = binding(replacement?.path || record.path);
  assert.equal(actual.sha256, record.sha256, `hash drift: ${record.path}`);
  if (record.bytes !== undefined) assert.equal(actual.bytes, record.bytes);
  external.set(actual.path, actual);
  return actual;
}
function read(record) {
  verify(record);
  return JSON.parse(fs.readFileSync(record.path));
}
const sourceManifest = {
  path: path.join(root, "../fig187-six-span-independent-FIRST-inputs-06/source-only/originals.json"),
  sha256: "cf3ed288b27accd95d3fb865cd80ace72f4ec38417901d97cd5971488a890d54"
};
const postManifest = {
  path: path.join(root, "../fig187-six-span-independent-FIRST-inputs-06/post-FIRST/candidates.json"),
  sha256: "645dba834dbc2dd21b74c35cf4e1a23dbc744eb0edb04887843380880d015c0a"
};
const source = read(sourceManifest);
const m = read(postManifest);
const collection = read(m.collection);
read(m.report);
for (const record of Object.values(m.candidates)) verify(record);
verify(m.repair.deltaEvidence);
verify(m.cumulativeHistory.historicalBinding);
verify(m.evidenceFailureAndRepair.retainedFailure);
verify(m.evidenceFailureAndRepair.helperRepair);
verify(m.evidenceFailureAndRepair.counterSnapshot);
verify(source.source);
verify(source.modernProse);

const sealPath = path.join(root, "FIRST-seal.receipt.json");
const seal = JSON.parse(fs.readFileSync(sealPath));
assert.equal(binding(seal.first.path).sha256, seal.first.sha256);
assert.equal(binding(seal.first.path).mode, "0444");
assert.equal(seal.post_FIRST_candidate_access_yet, false);
assert(seal.executions.every(x => x.exit_code === 0));
assert(new Date(seal.seal_completed_at) < new Date("2026-11-22T15:42:44.013Z"));

const approvalRecord = {
  path: path.join(root, "../n28-text-fourteen-keys-and-n29-panel-affected-review-06/Report.json"),
  sha256: "bb580e44bb375d2dc2183364d557ea6dc7ad049f8bb39e378f6d063ea903c0db"
};
const approval = read(approvalRecord);
assert.equal(approval.verdicts.n29AffectedText, "APPROVE");
assert.equal(approval.verdicts.n29ThreeDependentAnchors, "APPROVE");
assert.equal(approval.n29.currentLessonSha256, m.candidates.modernTextCandidate.sha256);
const approvalReuse = {
  report: binding(approvalRecord.path), completed_at: approval.completedAt,
  n28: "Readable text and all14 exact keys APPROVE reused; opaque printing holds remain unchanged",
  n29: "Four affected panel references and three anchors APPROVE reused",
  current_n29_lesson: binding(m.candidates.modernTextCandidate.path),
  nine_keys: "Prior unchanged approval reused; not opened or solved here",
  stale_author_pending_text_note: "Superseded only for separately approved prose/anchors; author was earlier than completed Plato report",
  whole_lesson_approval: false
};

const resolutions = collection.historicalBindingResolutions;
const reused = [];
for (const summary of [...m.native.exactArgvCwdExitCodeAndStreams, ...m.evidenceFailureAndRepair.calls]) {
  const r = read(summary.binding);
  assert.deepEqual(r.argv, summary.argv);
  assert.equal(r.cwd, summary.cwd);
  assert.equal(r.cwd, repo);
  assert.equal(r.exitCode, summary.exitCode);
  const streams = {};
  for (const name of ["stdout", "stderr"]) {
    streams[name] = verify(r.streams[name]);
    assert.equal(r.streams[name].sha256, summary.streams[name].sha256);
    if (r.streams[name].text !== undefined) {
      assert.equal(fs.readFileSync(r.streams[name].path, "utf8"), r.streams[name].text);
    }
  }
  const helperBindings = [];
  for (const h of r.helpers || []) {
    const resolution = resolutions.find(x => x.historical.path === h.path && x.historical.sha256 === h.sha256);
    if (resolution) {
      const snapshot = verify(h, resolution.exactSnapshot);
      assert.equal(snapshot.sha256, resolution.historical.sha256);
      helperBindings.push({
        recorded_working_path: h.path, recorded_sha256: h.sha256,
        exact_historical_snapshot: snapshot,
        current_working_path_is_not_historical_bytes: true
      });
    } else {
      helperBindings.push(verify(h));
    }
  }
  for (const record of [...(r.inputs || []), ...(r.inputsAfter || []), ...(r.outputs || [])]) verify(record);
  reused.push({
    original_receipt: binding(summary.binding.path),
    argv: r.argv, cwd: r.cwd, exit_code: r.exitCode,
    started_at: r.startedAt, ended_at: r.completedAt, signal: r.signal,
    streams, helpers: helperBindings, rerun: false
  });
}
const boundsRecord = m.authorVisual.executableEvidence.bounds;
const pixelsRecord = m.authorVisual.executableEvidence.pixels;
verify(boundsRecord);
verify(pixelsRecord);
const render = JSON.parse(fs.readFileSync(m.candidates.render.path));
assert.equal(render.status, "pass");
assert.equal(render.spec.sha256, m.candidates.spec.sha256);
assert.equal(render.output.svg.sha256, m.candidates.svg.sha256);
const auditPath = path.join(root, "independent-audit.stdout.txt");
const audit = JSON.parse(fs.readFileSync(auditPath));
assert.equal(audit.status, "pass");
assert.equal(audit.failures.length, 0);
const notesPath = path.join(root, "review-notes.json");
const notes = JSON.parse(fs.readFileSync(notesPath));
assert.equal(notes.verdict, "APPROVE");
const bindingsCheck = write("bindings-and-reused-receipts.json", {
  schema: "FIG187/verified-read-only-receipt-bindings@1",
  status: "pass", checked_at: new Date().toISOString(),
  external_files: [...external.values()], reused_receipts: reused,
  historical_display_helper_resolution: resolutions,
  approval_reuse: approvalReuse,
  no_receipt_replays: true,
  prior_failures_preserved: {
    native: 3, figure_repairs: 4, visual: 1, author_conservative_images: 24,
    new_evidence_helper_failures: 1, new_evidence_helper_repairs: 1
  }
});

// A single official call records the independent verdict after all substantive checks.
const officialPath = path.join(root, "fig-187.review.json");
assert(!fs.existsSync(officialPath), "official review already exists; do not replay");
const script = path.join(repo, ".agents/skills/ld-s10y-image/scripts/record_review.py");
const notesArg = [
  "Independent original187 pixel FIRST sealed0444 before candidate access.",
  "Source/spec/actual SVG and one retained contact inspected: all six h/r brackets visible and attached to correct intervals;",
  "36 segment representations preserve intent; circle membership, feet, lengths, betweenness and0/1/2 intersections independently verified.",
  "Current N29 prose hash5a6d01be3826357fe66dca4f3f4741e86140ad9f838ae3a27b0c9874d2dfa64a compatible;",
  "separate panel-reference/anchor approval reused. Cultural and visual PASS.",
  `Detailed independent evidence: ${notesPath}; ${auditPath}; ${sealPath}.`,
  "Native/dimension/browser evidence reused without replay. FIG187 offline candidate only, no whole-lesson approval or promotion."
].join(" ");
const official = capture("record-review", [
  "/usr/bin/python3", script,
  "--spec", m.candidates.spec.path,
  "--render", m.candidates.render.path,
  "--output", officialPath,
  "--status", "pass",
  "--notes", notesArg
], [script, m.candidates.spec.path, m.candidates.render.path, m.candidates.svg.path, m.candidates.source.path, notesPath, auditPath, sealPath], [officialPath]);
if (official.receipt.exit_code !== 0) {
  console.log(JSON.stringify({ status: "HOLD_OFFICIAL_RECORD_EXECUTION", receipt: official.binding, stderr: official.stderr }));
  process.exit(1);
}
const officialPayload = JSON.parse(fs.readFileSync(officialPath));
assert.equal(officialPayload.status, "pass");
assert.equal(officialPayload.spec.sha256, m.candidates.spec.sha256);
assert.equal(officialPayload.render.sha256, m.candidates.render.sha256);
assert.equal(officialPayload.outputs.svg.sha256, m.candidates.svg.sha256);
fs.chmodSync(officialPath, 0o444);
const ledger = write("image-ledger.json", {
  schema: "FIG187/independent-image-ledger@1",
  ...notes.image_ledger,
  events: [
    { ordinal: 1, tool: "functions.view_image", kind: "original source", binding: binding(m.candidates.source.path), charge: 1, before_FIRST_seal: true, reopen: false, crop: false },
    { ordinal: 2, tool: "functions.view_image", kind: "retained contact", binding: binding(m.candidates.contact.path), charge: 1, after_FIRST_seal: true, reopen: false, crop: false }
  ],
  hash_reads_not_image_views: true,
  contact_component_views_not_regenerated_or_separately_loaded: true
});
const report = {
  schema: "STEMROBIN-188/FIG187-six-span-independent-review@1",
  status: "SCOPED_OFFLINE_REVIEW_COMPLETE_APPROVE_NOT_PROMOTED",
  ticket: "STEMROBIN-188", continuation: "SAME188-6",
  completed_at: new Date().toISOString(), finish: "review",
  repository: repo, owned_root: root,
  authority: {
    installed: "db613601", corresponding: "093a4baa",
    same_invocation: true, direct_human_offline_review_authorization: true,
    setup_update_grill_run: false, authority_not_rederived_by_git: true
  },
  verdicts: {
    fig187_source_fidelity: "APPROVE",
    all_six_h_r_intervals: "APPROVE",
    spec_and_actual_SVG_mathematics: "APPROVE",
    retained_contact_visual_display: "APPROVE",
    cultural: "APPROVE",
    current_prose_figure_compatibility: "APPROVE_SCOPED",
    official_hash_bound_review: "PASS",
    N28_text_all14keys_and_N29_fourrefs_threeanchors: "SEPARATE_APPROVE_REUSED",
    N29_ninekeys: "UNCHANGED_PRIOR_APPROVAL_NOT_REREVIEWED",
    figures186188189: "SEPARATE_APPROVAL_PROMOTION_UNTOUCHED_NOT_OPENED",
    overall_lesson: "NOT_APPROVED"
  },
  findings: [],
  candidate: Object.fromEntries(["source", "spec", "svg", "render", "contact", "modernTextCandidate"].map(k => [k, binding(m.candidates[k].path)])),
  FIRST: {
    inventory: binding(seal.first.path), seal_receipt: binding(sealPath),
    physical_mode: binding(seal.first.path).mode,
    seal_completed_at: seal.seal_completed_at,
    post_FIRST_first_access: {
      at: "2026-11-22T15:42:44.013Z",
      tool: "functions.exec_command",
      tool_result_id: "adedcc",
      exit_code: 0,
      manifest: binding(postManifest.path),
      occurred_after_physical_chmod_stat_hash: true,
      evidence_note: "Exact access timestamp and SHA were printed by the actual terminal call; this report records that observation, not a fabricated subprocess stream."
    },
    seal_sequence: seal.sequence
  },
  substantive_review: binding(notesPath),
  independent_actual_geometry_audit: {
    evidence: binding(auditPath),
    receipt: binding(path.join(root, "independent-audit.receipt.json")),
    status: audit.status, checks: audit.checks.length,
    source_derived_panel_relationships: audit.panels,
    source_derived_interval_endpoints: audit.six_spans,
    not_count_only_not_hash_only: true
  },
  reused_evidence: bindingsCheck,
  official_review: binding(officialPath),
  official_record_receipt: official.binding,
  official_record_calls: 1,
  approval_reuse: approvalReuse,
  image_ledger: ledger,
  counters: notes.image_ledger,
  retained_history: {
    native_failures: 3, figure_repairs: 4, visual_failures: 1,
    author_conservative_charges: 24,
    new_evidence_helper_failures: 1, new_evidence_helper_repairs: 1,
    old_display_helper: resolutions,
    historical_counts_not_reset: true,
    failed_native_and_visual_evidence_not_reclassified_as_PASS: true
  },
  sessions: {
    own_exec_sessions_remaining: 0, own_browser_sessions_started: 0,
    own_browser_sessions_remaining: 0, all_own_exec_calls_synchronous_exited: true,
    shared_unrelated_sessions_not_touched: true
  },
  forbidden_actions_performed: {
    network: 0, DB: 0, env_reads: 0, paid: 0, git: 0,
    setup: 0, update: 0, grill: 0, candidate_edits: 0, canonical_edits: 0,
    source_replay: 0, renderer_replay: 0, browser_replay: 0,
    promotion: 0, finalization: 0, whole_lesson_approval: 0,
    other_figure_opens: 0, image_payloads_returned_to_parent: 0
  },
  scope_limits: notes.limits,
  evidence_manifest: path.join(root, "evidence-manifest.json"),
  evidence_manifest_policy: "Exact paths/hashes for all own files including Report.json and external reused evidence. Manifest excludes itself; its hash is returned separately.",
  promoted: false, finalized: false, published: false, whole_lesson_approved: false
};
const reportBinding = write("Report.json", report);
const ownFiles = fs.readdirSync(root).filter(name => name !== "evidence-manifest.json").sort().map(name => binding(path.join(root, name)));
const manifestBinding = write("evidence-manifest.json", {
  schema: "FIG187/independent-evidence-manifest@1",
  owned_root: root, own_files: ownFiles,
  external_reused_files: [...external.values()],
  report: reportBinding,
  self_hash_excluded: true,
  no_external_file_copies_or_image_payloads: true
});
console.log(JSON.stringify({
  verdict: "APPROVE_FIG187_ONLY",
  report: reportBinding, manifest: manifestBinding,
  official_review: binding(officialPath), official_record_receipt: official.binding,
  FIRST: binding(seal.first.path), FIRST_seal: binding(sealPath),
  image_charges_this_review: 2, author_historical_image_charges: 24,
  own_exec_sessions: 0, own_browser_sessions: 0
}, null, 2));
