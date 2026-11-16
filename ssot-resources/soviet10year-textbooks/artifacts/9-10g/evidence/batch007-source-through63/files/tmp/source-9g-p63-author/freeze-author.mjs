import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const cwd = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const base = "tmp/source-9g-p63-author";
const report = "tmp/source-9g-p63-author.md";
const manifestPath = "tmp/source-9g-p63-author.manifest.json";
const capture = `${base}/first-finalize-p0063`;
const durable = "ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0063";
const absolute = (relative) => path.join(cwd, relative);
const digest = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const readJSON = (relative) => JSON.parse(fs.readFileSync(absolute(relative), "utf8"));
const record = (relative) => {
  const bytes = fs.readFileSync(absolute(relative));
  return { path: relative, absolute_path: absolute(relative), bytes: bytes.length, sha256: digest(bytes) };
};
const files = (relative) => fs.readdirSync(absolute(relative), { withFileTypes: true })
  .sort((a, b) => a.name.localeCompare(b.name))
  .flatMap((entry) => entry.isDirectory() ? files(`${relative}/${entry.name}`)
    : entry.isFile() ? [`${relative}/${entry.name}`] : []);

if (fs.existsSync(absolute(manifestPath))) throw new Error("Author manifest already frozen; no rerun.");
const before = readJSON(`${capture}/before.inventory.json`);
const after = readJSON(`${capture}/after.inventory.json`);
const command = readJSON(`${capture}/command-result.json`);
const audit = readJSON(`${capture}/after/${durable}/audit.json`);
const sourceOutputs = ["page.md", "page.json", "audit.json"].map((name) => record(`${durable}/${name}`));
const evidenceFiles = files(base).map(record);
const manifest = {
  schema: "ld-s10y-lesson/source-author-freeze@1",
  ticket: "STEMROBIN-184",
  role: "SOURCE AUTHOR ONLY",
  cwd,
  book: "9-10g",
  physical_page: 63,
  printed_page: 56,
  status: "FIRST_OFFICIAL_FINALIZE_FAILED_PRESERVED_WITHOUT_REPAIR_OR_RETRY",
  frozen_at: new Date().toISOString(),
  author_report: record(report),
  official_command: command,
  image_budget: readJSON(`${base}/image-ledger.json`),
  official_audit: {
    lines_printed: audit.lines_printed,
    lines_md: audit.lines_md,
    normalizations: audit.normalizations,
    errata: audit.errata,
    count_exclusions: audit.count_exclusions,
    errors: audit.errors
  },
  first_draft: before.files.find((item) => item.path === `${durable}/page.md`),
  durable_source_outputs: sourceOutputs.map((item) => ({
    ...item,
    first_finalize_snapshot: after.files.find((entry) => entry.path === item.path)
  })),
  parent_owned_boundary: before.parent_owned_boundary,
  before_inventory: before,
  after_inventory: after,
  evidence_files: evidenceFiles,
  supplied_prior_provenance: {
    old_report_path: "tmp/source-9g-p60-p63-author.md",
    old_report_sha256: "bda299305fc8e166c50a145c6c831b7445b9e38b6924493fe1bb16452e7d72a8",
    exact_unverified_draft_path: ".intentfold/tickets/STEMROBIN-184/tmp/evidence/usedhelper/source-9g-p60-p63-author/unfinalized-drafts/0063/page.md",
    prior_final_manifest_sha256: "6913a8f2b75e1b6402e5532bca066ce9dc4996be9fd14fcaf18add47dbea5bee",
    prior_immutable_disclosure_root: "tmp/source-9g-p60-p62-corrected-disclosure/",
    authority: "User-supplied only; prior files/draft/disclosure not read or independently verified."
  },
  constraints: {
    prepare_invocations: 0,
    official_finalize_invocations: 1,
    retries: 0,
    repairs_after_first_command: 0,
    full_validation: false,
    independent_review: "NOT PERFORMED",
    independent_acceptance_claim: false,
    original_or_crop_reopens: 0,
    parent_owned_page62_image_opened: false,
    section17_closed_by_this_page: false,
    assemble_or_book_change: false,
    git_db_app_browser_livebackend_modern_answers_choices: false,
    agent_messages: 0,
    unrelated_changes_reverted: false
  },
  hash_policy: {
    algorithm: "SHA-256",
    input: "exact raw bytes, no normalization",
    self_hash: "Manifest does not contain its own hash; the freezing command prints its exact raw hash.",
    copies: "Before/after inputs, draft, active tools, failed source outputs and actual crops retained as exact-byte evidence.",
    freeze: "Report, manifest and evidence files are set read-only after manifest creation; live durable/prepared inputs are not chmodded."
  }
};
fs.writeFileSync(absolute(manifestPath), `${JSON.stringify(manifest, null, 2)}\n`, { flag: "wx" });
for (const relative of [...evidenceFiles.map((item) => item.path), report, manifestPath]) {
  fs.chmodSync(absolute(relative), 0o444);
}
console.log(JSON.stringify({
  report: record(report),
  manifest: record(manifestPath),
  source_outputs: sourceOutputs,
  actual_images_loaded: 3,
  official_finalize_invocations: 1,
  official_exit_code: command.exit_code,
  evidence_files: evidenceFiles.length,
  independent_review: "NOT PERFORMED"
}, null, 2));
