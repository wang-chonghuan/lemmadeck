import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const ticket = path.join(repo, ".intentfold/tickets/STEMROBIN-181");
const root = path.join(ticket, "tmp/d846-n71-native-recovery");
const first = path.join(ticket, "tmp/d822-n71-first-bilingual-native");
const python = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const bind = (file) => ({ path: file, sha256: crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex") });
const report = read(path.join(root, "report.json"));
assert.equal(process.cwd(), repo);
const receipts = [];
function write(file, value) {
  assert.ok(file.startsWith(`${root}/`));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
}
function call(id, args) {
  const result = spawnSync(python, args, { cwd: repo, encoding: "utf8", timeout: 90000, maxBuffer: 8 * 1024 * 1024 });
  const receipt = { id, cwd: repo, command: python, args, exit: result.status, stdout: result.stdout, stderr: result.stderr };
  const file = path.join(root, "choice-rebinding", `${id}.receipt.json`);
  write(file, receipt);
  receipts.push(bind(file));
  console.log(`${id}: ${result.status}`);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
}
const changes = [];
for (const locale of ["zh", "en"]) {
  assert.equal(report.outputs[locale].interactions, "PASS");
  const currentRepo = path.join(root, locale, "current-choice-source");
  const book = path.join(currentRepo, "ssot-resources/soviet10year-textbooks/artifacts/10p");
  const nativeBook = path.join(report.outputs[locale].artifactRoot, "10p");
  for (const suffix of ["book.json", ...["lesson", "exercises", "figures"].map((name) => `editions/modern-us-neutral/lessons/phy10-c2-s2-n71/${name}.json`)]) {
    const target = path.join(book, suffix);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(nativeBook, suffix), target, fs.constants.COPYFILE_EXCL);
  }
  for (const pack of ["q12", "q3"]) {
    const original = path.join(root, locale, "original-choice-set", pack);
    call(`${locale}-${pack}-historical-exact-FIRST`, [
      "-B", ".agents/skills/ld-s10y-choice/scripts/validate.py",
      "--repo", path.join(first, locale, "choice-source-snapshot"),
      "--seed", path.join(original, "seed.json"), "--draft", path.join(original, "draft.json"), "--review", path.join(original, "review.json"),
    ]);
    const destination = path.join(root, locale, "current-choice-set", pack);
    call(`${locale}-${pack}-current-source-prepare-FIRST`, [
      "-B", "-c", [
        "import sys,json,copy",
        "from pathlib import Path",
        'sys.path.insert(0,".agents/skills/ld-s10y-choice/scripts")',
        "from prepare import prepare_seed,load_json,digest",
        "repo,oldroot,out=map(Path,sys.argv[1:])",
        'oldseed=load_json(oldroot/"seed.json")',
        'seed=prepare_seed(repo,"10p","phy10-c2-s2-n71",[x["number"] for x in oldseed["exercises"]],[x["block"] for x in oldseed["concepts"]],oldseed["source"]["concept_figure_ids"])',
        'assert seed["source"]==oldseed["source"] and seed["exercises"]==oldseed["exercises"] and seed["figures"]==oldseed["figures"]',
        'assert [x["block"] for x in seed["concepts"]]==[x["block"] for x in oldseed["concepts"]]',
        'assert all(a["block"] in (6,12) or "".join(a["text"].split())=="".join(b["text"].split()) for a,b in zip(seed["concepts"],oldseed["concepts"]))',
        'draft=load_json(oldroot/"draft.json"); review=load_json(oldroot/"review.json")',
        "original_draft=copy.deepcopy(draft); original_review=copy.deepcopy(review)",
        'draft["seed_sha256"]=digest(seed); review["seed_sha256"]=digest(seed); review["draft_sha256"]=digest(draft)',
        'check=copy.deepcopy(draft); check["seed_sha256"]=original_draft["seed_sha256"]; assert check==original_draft',
        'check=copy.deepcopy(review); check["seed_sha256"]=original_review["seed_sha256"]; check["draft_sha256"]=original_review["draft_sha256"]; assert check==original_review',
        "out.mkdir(parents=True,exist_ok=True)",
        'for name,document in (("seed.json",seed),("draft.json",draft),("review.json",review)):',
        ' with (out/name).open("x") as f: json.dump(document,f,ensure_ascii=True,indent=2); f.write("\\n")',
        'print("PASS original questions/options/keys/verdicts unchanged; current trace and concept projection recorded; affected q3 semantic approval remains pending")',
      ].join("\n"), currentRepo, original, destination,
    ]);
    const oldSeed = read(path.join(original, "seed.json"));
    const seed = read(path.join(destination, "seed.json"));
    changes.push({
      locale, package: pack, sourceRepo: currentRepo, original: ["seed", "draft", "review"].map((name) => bind(path.join(original, `${name}.json`))),
      current: ["seed", "draft", "review"].map((name) => bind(path.join(destination, `${name}.json`))),
      conceptChanges: seed.concepts.map((item, i) => ({ block: item.block, before: oldSeed.concepts[i].text, after: item.text })).filter((item) => item.before !== item.after),
      status: pack === "q3" ? "CURRENT_SOURCE_BINDING_AFFECTED_REVIEW_PENDING" : "EXACT_EXERCISES_OPTIONS_KEYS_PRIOR_REVIEW_REUSED_TRACE_ONLY",
      historicalApprovalsExpanded: false,
    });
  }
}
write(path.join(root, "choice-rebinding/report.json"), {
  card: "phy10-c2-s2-n71", changes, receipts, mechanicalCalls: receipts.length,
  originalFailuresAndHistoricalHashesUnchanged: true, newChoicesAuthored: 0, newImages: 0, paidCalls: 0,
  q3AffectedChoiceReview: "PENDING", firstDisplay: "NOT_RUN", completeCard: false,
});
