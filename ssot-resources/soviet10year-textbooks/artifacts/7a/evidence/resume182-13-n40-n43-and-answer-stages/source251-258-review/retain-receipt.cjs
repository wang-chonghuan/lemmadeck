"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const out = path.join(root, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/source251-258-review");
const author = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/source251-258-author";
const durable = "ssot-resources/soviet10year-textbooks/artifacts/7a/pages";
const scratch = ".tmp/ld-s10y-lesson/7a/pages";
if (process.cwd() !== root || __dirname !== out) throw new Error("Wrong review workspace");

const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const read = rel => fs.readFileSync(path.join(root, rel));
const json = rel => JSON.parse(read(rel).toString("utf8"));
const write = (name, value) => {
  const target = path.join(out, name);
  if (path.dirname(target) !== out) throw new Error("Write outside owned directory");
  fs.writeFileSync(target, JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
};

// Initial byte hashes bind the text and exact grids observed in this review.
const initial = {
  251: [
    "4349f4623b0942e4b3cbb7e8009553a70ecf55cdd2929c7c3d0344f03cdd7bf9",
    "d06e84e51ac509ea9c53fb16426791579b349f3f6081be99cfdd1f7cbf5c3362",
    "6f6e5c9f0a92d82c3d7eba6a0451589a392849e16c072bb96188c6f274845426",
    "9ecf02a9f6c1a5429aebf28b0d9c987ecc4b8bfb5ac80e7211957293322e7eff"
  ],
  252: [
    "7a01d5825917b302eb89582109e42b5bf83be120db9b7f88ec0189fa6c9bfda6",
    "69ab7e504324b758393a4a818ae84d733e6c35c72bbba663dbb7205652649b94",
    "631856168ffcb5b8363f52649dcd4f0fef7c644b6b5d0192aaccc27702bc36bc",
    "973d2db918f04d3e83ce8e037e9d6796dee01e64e128c726159be6dbc37f17ef"
  ],
  253: [
    "592bd43c06db15b0d13bf6e8588eed0475126f8b5ebae0eed172d80d58e28bbe",
    "a1c08aaf95bd6d246504edafdba968bb8c3b4ab24ab7f859d251e1e0aa3f9ba8",
    "dfe19cf17728d6027b6969adc8ea918e62620714668928fdfaa589fbaa28d6b6",
    "2f858900b9491ec46482d8bcf614c3995e08b5c826e996d245f361f72ee13f7a"
  ],
  254: [
    "d767d5f9722d1a4f00821eb9c82bebf69c58227638d2a35908e70a2337ba1327",
    "9f8e273a364997e50fe11e9295d4cc17243aa495f11c0dbc13b2b1f669786dbf",
    "3e14a6545e128c1d35846a9c2c78486d9655de65c254fa91e2af0644aa32fff1",
    "fe9b1ed3598e8c70f84a3b3d20c20cf15715674f7dc1b697d21549914711a8eb"
  ],
  255: [
    "879900cdf0b18c81007f241660618bc8c8887d885b34f4ab3441adbe03ed36dc",
    "fd4b2282745ec4f6f9537b938c1d761027f8091c088d20f38bf3a95b77a66b95",
    "b50a6ffbf978ed7844c349c313b8f2a7c283a51071b131997c6ef42ba67704a3",
    "29925bc6c44c97e6e92edcd4336c65423fad0473bc5e0376353a35d2fd19d22c"
  ],
  256: [
    "b3c25ef1a9151627b0a969ed2e0a02aebb85dff2ddd0c359ba1bea32c8b7f143",
    "11d66ad808b23d55e6f4f503e52083f9c2641fd8d7e6e8cd1e75a2a1e34efa84",
    "0f90ab96a395f8e94cb7d4523ace8d5fc98d2316244559943a24688921e69a93",
    "6138eb1e68a5a076654983c82cad99eca0b25a5bbe9490705f4abc9cb562b578"
  ],
  257: [
    "013ac19afb1c7956b2d6fc2598d094e9e9301d4e9ed1b676523e29c170e814a7",
    "bb0a8f5f415346eb29150ed86a4a03d36aa21cf867eeb49781f91f399b282696",
    "0e5ac672a8401d21ce7ecc9eed1e1bfe515e93f1fd21d137c56cd090d378f6d5",
    "e54d87212d0cd94160fbd25cd7d93c5e9ec3caafb6fcd0bb4c8737c69766ec82"
  ],
  258: [
    "ae66761d04cadfcb2cf123f18bf721c116df2fe15a66117f87a828d3e2d69db7",
    "e568f12df28170be06cf2c3801d36e7899813ce44d6fee5876d36e294a7ddc1f",
    "8f29244e5f0ef73780e7792f740aab3ab557c0437ff11a8ae7c9701b4779ecfb",
    "b47187da80535f4abc7719dea797dc90d0abd1168b5bca60eca645fffb5fcab2"
  ]
};
const layouts = {
  251: "5085633aae5aae0606b0244c009bff46215c094be422fbb7a86dc7f7262e24bc",
  252: "dc72c2216fb4dcb5eef77b09a27eb8b04cca8775850bb2de6497d26150a4abc9",
  253: "a1ca1b5a19fec0d162131adc4f0b3334040c1b8634120be8ea5bd8d3ccb8d614",
  254: "2e6a54c8833c4b35a06ec599b910f37dc7595fd09b67d9e785a5e4a176214697",
  255: "e7e5c3894bcd0efae8aebadeeda94bd8eae1ccf6868dea86a0325b80e5b051e8",
  256: "519662037e9b299f89deeb4ec89dc67c491297d50e54e75a0822835d48f48a18",
  257: "38b96ba8bc97cd85b2c2fcdef3cf0a03e40ec89dd3564d0008d3ba7cc779b787",
  258: "3af1c71e7355fb8fc3c396fc592a39a9fb30ba9152cb08e99f5a27184a264c31"
};
const rows = [19, 11, 26, 26, 24, 21, 20, 21];
const blockRows = [
  [4,2,1,1,2,4,4,1],
  [0,1,1,0,1,4,1,1,1,1],
  [1,2,2,2,2,3,1,1,2,4,2,1,2,1],
  [3,0,8,7,0,2,2,3,1],
  [1,1,3,1,1,1,1,5,2,1,1,1,1,1,1,1,1],
  [1,3,1,1,4,2,1,1,3,1,1,1,1],
  [1,1,1,1,1,1,2,1,4,2,1,1,1,1,1],
  [2,4,2,1,2,1,4,1,1,1,1,1]
];
const files = [];
const bind = (rel, role, expected) => {
  const bytes = read(rel);
  const hash = sha(bytes);
  if (expected && hash !== expected) throw new Error(`Input changed during review: ${rel}`);
  const entry = {
    path: path.join(root, rel),
    role,
    bytes: bytes.length,
    sha256: hash
  };
  if (expected) {
    entry.initial_sha256 = expected;
    entry.unchanged_since_initial_observation = true;
  }
  files.push(entry);
  return entry;
};
const pages = [];
const images = [];
for (let n = 251; n <= 258; n++) {
  const p = String(n).padStart(4, "0");
  const i = n - 251;
  const grid = bind(`${scratch}/${p}/page.grid.png`, "exact observed grid", initial[n][0]);
  const md = bind(`${durable}/${p}/page.md`, "reviewed durable MD", initial[n][1]);
  const pj = bind(`${durable}/${p}/page.json`, "reviewed durable JSON", initial[n][2]);
  const audit = bind(`${durable}/${p}/audit.json`, "existing official audit", initial[n][3]);
  bind(`${scratch}/${p}/layout.json`, "existing detected bands", layouts[n]);
  bind(`${author}/page${p}.first-source.md`, "frozen FIRST author text");
  bind(`${author}/finalize${p}.receipt.json`, "existing single-call execution receipt");
  const data = json(`${durable}/${p}/page.json`);
  const a = json(`${durable}/${p}/audit.json`);
  pages.push({
    physical_page: n,
    printed_page: data.meta.printed_page,
    verdict: "pass",
    verdict_scope: "faithful source of this page only",
    independent_visual_rows: rows[i],
    independent_visual_block_contributions: blockRows[i],
    md_rows: a.lines_md,
    official_detected_rows: a.lines_printed,
    mechanical_reconciliation: a.errors.length ? "still failed; parent owns repair" : "existing audit pass",
    genuine_misread_findings: [],
    source_grid: grid.path,
    source_grid_sha256: grid.sha256,
    reviewed_md_sha256: md.sha256,
    reviewed_json_sha256: pj.sha256,
    reviewed_audit_sha256: audit.sha256,
    recorded_pdf_provenance: data.meta.source,
    recorded_unopened_page_render_provenance: data.meta.render,
    figures: data.blocks.filter(b => b.kind === "fig").map(b => ({
      id: b.id,
      box: b.box,
      owner_exercise: b.owner_exercise,
      independent_owner: b.owner_exercise ? `exercise ${b.owner_exercise}` : "n42 prose",
      independent_rough_box: a.figures.find(f => f.id === b.id).from,
      rough_box_and_owner_verdict: "pass from same page grid only"
    }))
  });
  images.push({
    sequence: i + 1,
    physical_page: n,
    path: grid.path,
    sha256: grid.sha256,
    tool: "functions.view_image",
    detail: "original",
    counter_before: i,
    counter_after: i + 1,
    opens: 1,
    reopens: 0,
    crop_views: 0
  });
}
for (const rel of [
  ".intentfold/readme.md",
  ".intentfold/project.json",
  ".intentfold/charter/product.md",
  ".intentfold/charter/engineering.md",
  ".intentfold/charter/operations.md",
  ".claude/skills/ld-s10y-lesson/SKILL.md",
  ".claude/skills/ld-s10y-lesson/references/production-resume.md",
  ".agents/skills/ld-s10y-image/SKILL.md",
  ".agents/skills/ld-s10y-image/references/quality-gate.md",
  "ssot-resources/soviet10year-textbooks/toc/7a/zh.json",
  `${author}/binding0251.md`,
  `${author}/binding0251.resolution.md`,
  `${author}/report.json`,
  `${author}/summary.md`,
  `${author}/hashes.json`,
  `${author}/image-ledger.json`
]) bind(rel, "read-only rules, scope, author or boundary evidence");

write("bindings.json", {
  schema: "STEMROBIN-182/source251-258-review-bindings@1",
  algorithm: "sha256",
  workspace: root,
  branch: "codex/STEMROBIN-182-textbooks",
  initial_observed_inputs_unchanged: true,
  pdf_and_page_png_hashes: "recorded page metadata provenance only; no PDF/page.png image was opened",
  files
});
write("image-ledger.json", {
  schema: "STEMROBIN-182/source251-258-review-image-ledger@1",
  fresh_counter_before: 0,
  final_counter: 8,
  exact_grid_opens: 8,
  reopen_count: 0,
  extra_images: 0,
  crops: 0,
  page_png_views: 0,
  modern_render_views: 0,
  batch_finished: true,
  images
});
write("receipt.json", {
  schema: "STEMROBIN-182/source251-258-independent-FIRST-review@1",
  recorded_at: new Date().toISOString(),
  workspace: root,
  branch: "codex/STEMROBIN-182-textbooks",
  scope: "physical pages 251-258 only",
  image_count: 8,
  all_page_source_verdicts: "pass",
  independent_visual_rows_total: 168,
  source_figure_count: 3,
  genuine_misread_findings: [],
  technical_findings: [
    {
      page: 251,
      block: "p0251#2",
      body_line: 2,
      character_replacement: null,
      detected_bands: [[772,817],[818,862]],
      diagnosis: "One radical/fraction inequality split into numerator and denominator bands; no missing row.",
      independent_rows: 19,
      official_rows: 20,
      owner_of_repair: "parent"
    },
    {
      page: 258,
      block: null,
      body_line: null,
      character_replacement: null,
      detected_band: [111,164],
      rough_margin_extent: [900,75,430,115],
      first_actual_text_band: [232,321],
      diagnosis: "Top-margin non-text outline/stroke counted as a row; no missing row. Its physical provenance remains unconfirmed.",
      independent_rows: 21,
      official_rows: 22,
      owner_of_repair: "parent"
    }
  ],
  boundary_facts: {
    physical_250_tail: "Direct user text only: 842 complete with two fraction expressions; footer 244; no open tail.",
    physical_251_head: "New printed 843; no artificial cont; original HOLD preserved, technical resolution separate.",
    toc_physical_starts: { n41: 246, n42: 252, n43: 255, n44: 258 },
    n44: "Boundary only; not whole-unit approved."
  },
  did_not_perform: [
    "source/author edits", "finalize", "prepare", "assemble", "render",
    "app/browser/tests", "dependency/tool/environment changes",
    "DB/model/network operations", "agent operations", "Git mutation"
  ],
  no_whole_lesson_source_or_product_approval: true,
  pages,
  evidence: Object.fromEntries(["review.md", "bindings.json", "image-ledger.json"].map(name => [
    name, { path: path.join(out, name), sha256: sha(fs.readFileSync(path.join(out, name))) }
  ]))
});
write("output-hashes.json", {
  schema: "STEMROBIN-182/source251-258-review-output-hashes@1",
  algorithm: "sha256",
  files: ["review.md", "bindings.json", "image-ledger.json", "receipt.json", "retain-receipt.cjs"].map(name => ({
    path: path.join(out, name),
    sha256: sha(fs.readFileSync(path.join(out, name)))
  }))
});
console.log(JSON.stringify({
  output: out,
  bound_files: files.length,
  inputs_unchanged: true,
  receipt_sha256: sha(fs.readFileSync(path.join(out, "receipt.json"))),
  review_sha256: sha(fs.readFileSync(path.join(out, "review.md"))),
  bindings_sha256: sha(fs.readFileSync(path.join(out, "bindings.json"))),
  image_ledger_sha256: sha(fs.readFileSync(path.join(out, "image-ledger.json"))),
  output_hashes_sha256: sha(fs.readFileSync(path.join(out, "output-hashes.json")))
}, null, 2));
