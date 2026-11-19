const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");

const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const scratch = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12/source235-242-author";
const root = "ssot-resources/soviet10year-textbooks/artifacts";
const books = "ssot-resources/soviet10year-textbooks/sources/soviet10years";
const python = ".claude/skills/ld-s10y-lesson/.venv/bin/python";
const tool = ".claude/skills/ld-s10y-lesson/tools/p2c.py";
const runner = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12/run-stage.cjs";
const digest = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const writeNew = (file, value) => fs.writeFileSync(file, value, { flag: "wx" });
const jsonNew = (file, value) => writeNew(file, `${JSON.stringify(value, null, 2)}\n`);
const frontmatter = (text) => JSON.parse(text.match(/^---\n([\s\S]*?)\n---/)[1]);
const pages = Array.from({ length: 8 }, (_, i) => i + 235);
const argsFor = (n) => [
  tool, "finalize", "--book", "7a", "--page", String(n),
  "--root", root, "--books", n === 235 ? books : "ssot-resources/soviet10year-textbooks/sources",
  "--work", `${scratch}/work`,
];

if (process.argv[2] === "init") {
  const inputs = pages.map((n) => {
    const id = String(n).padStart(4, "0");
    const source = `.tmp/ld-s10y-lesson/7a/pages/${id}`;
    const working = `${scratch}/work/7a/pages/${id}`;
    fs.mkdirSync(working, { recursive: true });
    for (const file of ["page.png", "layout.json"]) {
      assert(fs.existsSync(`${source}/${file}`));
      fs.symlinkSync(path.resolve(source, file), `${working}/${file}`);
    }
    const md = `${root}/7a/pages/${id}/page.md`;
    const text = fs.readFileSync(md, "utf8");
    const fm = frontmatter(text);
    assert.equal(fm.page, n);
    assert.equal(fm.printed_page, n - 6);
    const grid = `${source}/page.grid.png`;
    const png = `${source}/page.png`;
    return {
      page: n,
      author_md: { path: md, sha256: digest(md) },
      images: [
        { path: grid, sha256: digest(grid), visual_opens: 1 },
        { path: png, sha256: digest(png), visual_opens: 0 },
      ],
      prepared_layout: { path: `${source}/layout.json`, sha256: digest(`${source}/layout.json`) },
      first_command: {
        environment: { PYTHONDONTWRITEBYTECODE: "1" },
        argv: ["node", runner, `../source235-242-author/p${id}-finalize-FIRST`, python, ...argsFor(n)],
      },
    };
  });
  jsonNew(`${scratch}/author-inputs.json`, inputs);
  console.log(JSON.stringify({ initialized: pages, work: `${scratch}/work`, images_opened: 8 }));
} else if (process.argv[2] === "report") {
  const inputs = JSON.parse(fs.readFileSync(`${scratch}/author-inputs.json`, "utf8"));
  const results = inputs.map((input) => {
    const id = String(input.page).padStart(4, "0");
    const directory = `${root}/7a/pages/${id}`;
    const receiptPath = `${scratch}/p${id}-finalize-FIRST.receipt.json`;
    const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
    assert.deepEqual(receipt.command, [python, ...argsFor(input.page)]);
    const triplet = ["page.md", "page.json", "audit.json"].map((file) => {
      const target = `${directory}/${file}`;
      return fs.existsSync(target)
        ? { path: target, sha256: digest(target), bytes: fs.statSync(target).size }
        : { path: target, missing: true, sha256: null };
    });
    const md = fs.readFileSync(`${directory}/page.md`, "utf8");
    const fm = frontmatter(md);
    const body = md.slice(md.indexOf("\n---", 4) + 4);
    // Split by block headers so empty figure blocks are retained.
    const blocks = body.split(/(?=^<!-- )/m).filter((value) => value.startsWith("<!-- ")).map((value) => {
      const [, header, text] = value.match(/^<!-- (.*?) -->\s*\n?([\s\S]*)$/);
      const lines = text.trim().split("\n").filter((line) => line.trim().length);
      return {
        header,
        physical_lines: header.startsWith("fig ") ? 0 : lines.length + (text.match(/↵/g) ?? []).length,
      };
    });
    const types = {};
    for (const block of blocks) {
      const type = block.header.split(" ")[0];
      types[type] = (types[type] ?? 0) + 1;
    }
    const audit = fs.existsSync(`${directory}/audit.json`)
      ? JSON.parse(fs.readFileSync(`${directory}/audit.json`, "utf8")) : null;
    return {
      page: input.page, printed_page: fm.printed_page,
      triplet, images: input.images, pre_finalize_md_sha256: input.author_md.sha256,
      counts: {
        blocks: blocks.length, by_type: types,
        exercise_blocks: types.ex ?? 0, figures: types.fig ?? 0,
        author_physical_lines_excluding_foot: blocks.filter((b) => !b.header.startsWith("foot")).reduce((sum, b) => sum + b.physical_lines, 0),
        normalized_printed_lines: fm.printed_lines ?? null,
        exercise_numbers: blocks.filter((b) => b.header.startsWith("ex ")).map((b) => b.header.split(" ")[1]),
      },
      figure_records: blocks.filter((b) => b.header.startsWith("fig ")).map((b) => ({
        header: b.header,
        output: {
          path: `${scratch}/work/7a/pages/${id}/figures/fig-55.png`,
          sha256: digest(`${scratch}/work/7a/pages/${id}/figures/fig-55.png`),
          visual_opens: 0,
        },
      })),
      audit,
      boundary_markers: blocks.filter((b) => /\b(open|cont)\b/.test(b.header)).map((b) => b.header),
      notes: fm.notes, errata: fm.errata,
      first: {
        environment: input.first_command.environment,
        argv: ["node", runner, `../source235-242-author/p${id}-finalize-FIRST`, ...receipt.command],
        receipt: { path: receiptPath, sha256: digest(receiptPath) },
        exit: receipt.exit, signal: receipt.signal, error: receipt.error,
        streams: receipt.streams,
        tool_stdout_lines: fs.readFileSync(`${scratch}/p${id}-finalize-FIRST.stdout`, "utf8").split("\n").filter(Boolean).length,
        errors: audit?.errors ?? (receipt.exit !== 0
          ? ["Book resolution failed: --books was one directory too deep; no page.json or audit.json produced."] : []),
      },
    };
  });
  const failed = results.filter((result) => result.first.exit !== 0).map((result) => result.page);
  const report = {
    schema: "source235-242-author@1", ticket: "STEMROBIN-182",
    cwd, declared_branch: "codex/STEMROBIN-182-textbooks", branch_read: false,
    finish: "review", role: "fresh-source-author", independent_approval: false,
    status: failed.length ? "FIRST-finalize-failures-preserved" : "authored-FIRST-finalize-complete",
    scope: { book: "7a", physical_pages: [235, 242], printed_pages: [229, 236] },
    image_usage: { grid_opens: 8, sequence: pages, reopens: 0, crops_opened: 0, other_images_opened: 0 },
    preparation: { reused: true, prepare_invocations: 0, provided_prepare_exit: 0 },
    finalize: { invocations: 8, per_page_invocations: 1, failed_pages: failed, reruns: 0, post_finalize_content_edits: 0 },
    downstream: { executed: [], dependent_stages_stopped: failed.length > 0, assembly: false, publish: false, network: false, db: false },
    boundaries: [
      "234 -> 235: p open / p cont, 7.34^2 multiplication confirmed; 234 text is UNAPPROVED context only.",
      "236 -> 237: 803 complete; 237 begins 804. n38 includes 804 and review 805.",
      "237 begins n39 at printed 231; example 2 proceeds in a new paragraph on 238.",
      "239 -> 240: ex 806 open / cont.",
      "240 -> 241: 813 complete; 241 begins 814.",
      "241 -> 242: ex 819 open / cont; figure 55 and caption stay owned by 819 on 241.",
      "242 begins n40 at printed 236; final p open after writing 9a^7 as ..., 243 not read.",
    ],
    important_uncertainties: [
      "238: small star/dot-shaped footnote marker transcribed as *; exact glyph shape unresolved.",
      "241: figure 55 box is a coarse one-look estimate; mechanical snapping is not an independent visual approval.",
    ],
    confirmed_errata: ["p0239-math-1: sqrt(2.45) approximately 1.555 retained faithfully; reason recorded in source."],
    correction_proposals: [
      {
        page: 235, kind: "technical-invocation",
        proposal: "Only after separate authorization, retry the held page with --books ssot-resources/soviet10year-textbooks/sources. This author invocation did not retry.",
        applied: false,
      },
      {
        page: 237, kind: "physical-line-accounting",
        proposal: "805 has top equations [756,828], standalone mid-row Cyrillic labels [835,866], and bottom equations [882,958]. Re-evaluate representing all three physical rows without changing the equations; current page note incorrectly calls the mid-row labels not an additional row.",
        evidence: ".tmp/ld-s10y-lesson/7a/pages/0237/layout.json",
        applied: false,
      },
      {
        page: 238, kind: "non-text-line-detection",
        proposal: "The extra [1929,1933] band is the thin footnote separator observed in the one permitted grid view, between final formula [1827,1866] and footnote text [1964,1993]. Exclude that non-text rule in a separately authorized mechanical correction; do not invent an extra text line or fake a formula break.",
        evidence: ".tmp/ld-s10y-lesson/7a/pages/0238/layout.json",
        applied: false,
      },
    ],
    pages: results,
  };
  report.totals = {
    blocks: results.reduce((sum, result) => sum + result.counts.blocks, 0),
    exercise_blocks: results.reduce((sum, result) => sum + result.counts.exercise_blocks, 0),
    unique_exercises: new Set(results.flatMap((result) => result.counts.exercise_numbers)).size,
    figures: results.reduce((sum, result) => sum + result.counts.figures, 0),
    existing_triplet_files: results.reduce((sum, result) => sum + result.triplet.filter((file) => !file.missing).length, 0),
    missing_triplet_files: results.flatMap((result) => result.triplet.filter((file) => file.missing).map((file) => file.path)),
  };
  jsonNew(`${scratch}/source235-242-author.json`, report);
  const table = results.map((result) => {
    const c = result.counts;
    return `| ${result.page} | ${result.printed_page} | ${c.blocks} | ${c.exercise_blocks} | ${c.figures} | ${result.audit?.lines_md ?? c.author_physical_lines_excluding_foot + 1} | ${result.audit?.lines_printed ?? "not run"} | ${result.first.exit} |`;
  }).join("\n");
  const markdown = [
    "# Source 235-242 Author", "",
    `STEMROBIN-182; book 7a; finish:review; authoring only, not independent approval.`,
    `Cwd: ${cwd}. Declared branch: codex/STEMROBIN-182-textbooks (not read).`,
    `Eight sequential grid opens, no reopen/crop/other image opens; reused prepared pages, no prepare invocation.`,
    `Finalize exactly once per page. FIRST failures: ${failed.length ? failed.join(", ") : "none"}. No post-finalize content edits or downstream operations.`, "",
    "| Physical | Printed | Blocks | Ex blocks | Figures | Block lines (with foot) | Detected lines | FIRST exit |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |", table, "",
    "## Boundaries", ...report.boundaries.map((value) => `- ${value}`), "",
    "## Errata And Uncertainties", ...report.confirmed_errata.map((value) => `- ${value}`),
    ...report.important_uncertainties.map((value) => `- ${value}`), "",
    "## Unapplied Correction Proposals",
    ...report.correction_proposals.map((value) => `- ${value.page}: ${value.proposal}`), "",
    "## Evidence",
    "- source235-242-author.json contains SHA-256 for every existing page triplet and prepared grid/source image, block and line counts, complete audits, and exact FIRST argv, exits and immutable receipt/stream hashes. Missing 235 page.json/audit.json have null hashes, not fabricated files.",
    "- author-inputs.json records hashes and planned commands before finalization; actual FIRST start/stdout/stderr/receipt files are adjacent. Remaining independent pages corrected --books after 235's first failure.",
    "- work/ contains only this batch's linked prepared page inputs and mechanical finalize outputs; no figures were reopened.",
    "- No independent approval, assembly, modern/answer/choice authoring, publisher, DB, network, dependency, or Git operation.", "",
  ].join("\n");
  writeNew(`${scratch}/source235-242-author.md`, markdown);
  console.log(JSON.stringify({
    json: `${scratch}/source235-242-author.json`, md: `${scratch}/source235-242-author.md`,
    failed_pages: failed, totals: results.reduce((sum, result) => ({
      blocks: sum.blocks + result.counts.blocks,
      exercise_blocks: sum.exercise_blocks + result.counts.exercise_blocks,
      figures: sum.figures + result.counts.figures,
    }), { blocks: 0, exercise_blocks: 0, figures: 0 }),
    pages: results.map((result) => ({
      page: result.page, counts: result.counts, exit: result.first.exit,
      audit_keys: result.audit ? Object.keys(result.audit) : null,
    })),
  }));
} else {
  throw new Error("Use init or report");
}
