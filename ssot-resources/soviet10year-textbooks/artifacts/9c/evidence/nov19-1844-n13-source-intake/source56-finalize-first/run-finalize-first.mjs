import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const repo = "/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck";
const dir = path.join(repo, ".tmp/stemrobin-184-resume/n13-source56-finalize-first");
const input = JSON.parse(fs.readFileSync(path.join(dir, "input-hashes.json"), "utf8"));
const mdPath = path.join(repo, input.md_snapshot.original);
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const save = (name, data) => fs.writeFileSync(
  path.join(dir, name), `${JSON.stringify(data, null, 2)}\n`, { flag: "wx" }
);
const document = (raw) => {
  const front = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert(front, "JSON frontmatter required");
  return { meta: JSON.parse(front[1]), body: raw.slice(front[0].length) };
};

assert.equal(process.cwd(), repo);
assert.equal(sha(path.join(dir, "before.page.md")), input.md_snapshot.sha256);
assert.equal(sha(mdPath), sha(path.join(dir, "pre-finalize.page.md")));
for (const file of input.inputs) assert.equal(sha(path.join(repo, file.path)), file.sha256, file.path);
for (const name of ["attempt-start.json", "native.stdout", "native.stderr", "native-receipt.json"]) {
  assert(!fs.existsSync(path.join(dir, name)), `Attempt already exists: ${name}`);
}
const pageDir = path.dirname(mdPath);
assert(!fs.existsSync(path.join(pageDir, "audit.json")), "First audit must not exist yet");
assert(!fs.existsSync(path.join(pageDir, "page.json")), "First page JSON must not exist yet");

const before = document(fs.readFileSync(path.join(dir, "before.page.md"), "utf8"));
const edited = document(fs.readFileSync(path.join(dir, "pre-finalize.page.md"), "utf8"));
const { notes: oldNotes, ...oldOther } = before.meta;
const { notes: newNotes, ...newOther } = edited.meta;
assert.deepEqual(newOther, oldOther, "Manual metadata changes must be notes only");
assert.deepEqual(newNotes.slice(0, oldNotes.length), oldNotes, "Historical notes unchanged");
assert.equal(newNotes.length, oldNotes.length + 2);
assert(newNotes[3].includes("U01") && newNotes[3].includes("UNKNOWN"));
assert(newNotes[4].includes("source55/page.json") && newNotes[4].includes("source57"));

const replacements = [
  ["$\\frac{12}{55}=0.2(18)$。", "$\\frac{12}{55}=0.2(18)$.", 47],
  ["$0,1,2,\\cdots,(n-1)$。", "$0,1,2,\\cdots,(n-1)$.", 51],
  ["· 49 ·", "• 49 •", 67],
];
let expectedBody = before.body;
for (const [oldText, newText] of replacements) {
  assert.equal(expectedBody.split(oldText).length - 1, 1);
  expectedBody = expectedBody.replace(oldText, newText);
}
assert.equal(edited.body, expectedBody, "Only authorized body edits permitted");
const headers = (body) => body.match(/^<!--.*-->$/gm);
assert.deepEqual(headers(edited.body), headers(before.body));
assert(edited.body.includes("<!-- foot note -->\n注 如果"));
assert(edited.body.includes("<!-- fig 长除法 box 650,735,385,420 -->"));
const math = (body) => body.match(/\$[^$]*\$/g);
assert.deepEqual(math(edited.body), math(before.body));
assert.equal(edited.body.split("\n").length, before.body.split("\n").length);
assert(!Object.hasOwn(edited.meta, "count_exclusions"));

save("manual-edits-proof.json", {
  schema: "stemrobin-184/source56-manual-edits-proof@1",
  verified_utc: new Date().toISOString(),
  before_md_sha256: input.md_snapshot.sha256,
  pre_finalize_md_sha256: sha(mdPath),
  changed_metadata_paths: ["notes[3]", "notes[4]"],
  original_notes_unchanged: true,
  changed_body_lines: replacements.map(([beforeText, afterText, originalMDLine]) => ({
    original_md_line: originalMDLine, before: beforeText, after: afterText,
  })),
  exact_body_equals_only_authorized_replacements: true,
  all_math_tokens_unchanged: true,
  line_breaks_and_wraps_unchanged: true,
  headers_open_cont_unchanged: true,
  foot_note_header_and_ASCII_marker_spacing_kept: true,
  rough_box_kept: [650, 735, 385, 420],
  count_exclusions_absent: true,
  body_note_position: {
    frozen_lines: ["L14", "L15"],
    encoding: "foot note",
    skill_line: 215,
    teaching_note_retained_as_body: true,
    physical_position: "Body flow, after general remainder argument and before theorem2 introductory question.",
    physical_page_bottom_footnote_claim: false,
  },
  authorization_clarification: input.authorization_clarification,
  images_loaded_into_context: "1/4",
});

const command = input.required_native_command;
const started = new Date().toISOString();
save("attempt-start.json", {
  schema: "stemrobin-184/source56-official-finalize-start@1",
  attempt: 1, cwd: repo, argv: command, started_utc: started,
  pre_finalize_md_sha256: sha(mdPath), retry_authorized: false,
});
const stdoutPath = path.join(dir, "native.stdout");
const stderrPath = path.join(dir, "native.stderr");
const out = fs.openSync(stdoutPath, "wx");
const err = fs.openSync(stderrPath, "wx");
let result;
try {
  result = spawnSync(command[0], command.slice(1), {
    cwd: repo, stdio: ["ignore", out, err],
  });
} finally {
  fs.closeSync(out);
  fs.closeSync(err);
}
fs.writeFileSync(path.join(dir, "native.exit-code"), `${result.status ?? "UNKNOWN"}\n`, { flag: "wx" });
const receipt = {
  schema: "stemrobin-184/source56-first-official-finalize-receipt@1",
  attempt: 1, cwd: repo, argv: command,
  started_utc: started, ended_utc: new Date().toISOString(),
  native_exit_code: result.status,
  signal: result.signal,
  spawn_error: result.error ? { code: result.error.code, message: result.error.message } : null,
  stdout: { path: stdoutPath, bytes: fs.statSync(stdoutPath).size, sha256: sha(stdoutPath), complete: true },
  stderr: { path: stderrPath, bytes: fs.statSync(stderrPath).size, sha256: sha(stderrPath), complete: true },
  exit_file: { path: path.join(dir, "native.exit-code"), sha256: sha(path.join(dir, "native.exit-code")) },
  pre_finalize_md_sha256: sha(path.join(dir, "pre-finalize.page.md")),
  current_md_sha256: sha(mdPath),
  runs: 1, retries: 0,
  no_dependent_stages_executed: true,
  new_visual_image_opens: 0,
  cumulative_visual_images: "1/4",
  verdict_scope: "Native mechanical result only; not scientific/source/whole-lesson approval.",
  stop: true,
};
save("native-receipt.json", receipt);
console.log(JSON.stringify(receipt, null, 2));
process.exitCode = result.status ?? 1;
