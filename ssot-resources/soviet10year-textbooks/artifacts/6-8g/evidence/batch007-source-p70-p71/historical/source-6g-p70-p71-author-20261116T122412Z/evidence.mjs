import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repo = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const out = path.dirname(fileURLToPath(import.meta.url));
const python = `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`;
const tool = `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`;
const work = `${repo}/.tmp/ld-s10y-lesson/6-8g/pages`;
const durable = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages`;
const expected = {
  "0070": "069bafde193ad80bfbdfdbaf0efe1b896bdbb5c76860f66a7ab5b9e1728bc6ee",
  "0071": "10a1ace0f1eba03ff7de38acfa5bdbeb60eb1bd1277047cc49e6800374eaedd8",
};

function record(file) {
  const bytes = fs.readFileSync(file);
  const stat = fs.statSync(file);
  const result = {
    path: file,
    bytes: bytes.length,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    mtime: stat.mtime.toISOString(),
    observedAt: new Date().toISOString(),
  };
  if (file.endsWith(".png") && bytes.subarray(1, 4).toString() === "PNG") {
    result.width = bytes.readUInt32BE(16);
    result.height = bytes.readUInt32BE(20);
  }
  return result;
}

function files(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
}

function writeNew(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
}

function snapshot(name, pages = ["0070", "0071"]) {
  const result = { name, observedAt: new Date().toISOString(), directories: [], files: [] };
  for (const page of pages) {
    for (const [kind, base] of [["prepared", work], ["durable", durable]]) {
      const dir = path.join(base, page);
      result.directories.push({ path: dir, exists: fs.existsSync(dir) });
      for (const file of files(dir)) {
        const item = record(file);
        const copy = path.join(out, "bytes", name, kind, page, path.relative(dir, file));
        fs.mkdirSync(path.dirname(copy), { recursive: true });
        fs.copyFileSync(file, copy, fs.constants.COPYFILE_EXCL);
        item.savedBytes = copy;
        result.files.push(item);
      }
    }
  }
  writeNew(path.join(out, `${name}.json`), result);
  return result;
}

const [action, arg] = process.argv.slice(2);
if (action === "baseline") {
  for (const page of Object.keys(expected)) {
    if (record(path.join(work, page, "page.png")).sha256 !== expected[page]) throw new Error(`Source mismatch ${page}`);
    if (fs.existsSync(path.join(durable, page))) throw new Error(`Existing durable directory ${page}; refusing overwrite`);
  }
  console.log(JSON.stringify(snapshot("baseline"), null, 2));
} else if (action === "finalize") {
  const page = String(Number(arg)).padStart(4, "0");
  if (!Object.hasOwn(expected, page)) throw new Error("Page outside scope");
  if (fs.existsSync(path.join(out, "STOP.json"))) throw new Error("Stopped after first failure");
  const startPath = path.join(out, `finalize-${page}-start.json`);
  if (fs.existsSync(startPath)) throw new Error("Finalize already attempted; no retry");
  snapshot(`before-finalize-${page}`, [page]);
  const argv = [python, tool, "finalize", "--book", "6-8g", "--page", String(Number(page))];
  const start = new Date().toISOString();
  writeNew(startPath, { argv, cwd: repo, start, policy: "first official finalize only; no retry" });
  const run = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" }, encoding: "utf8", maxBuffer: 16 * 1024 * 1024,
  });
  const end = new Date().toISOString();
  writeNew(path.join(out, `finalize-${page}.stdout.txt`), run.stdout ?? "");
  writeNew(path.join(out, `finalize-${page}.stderr.txt`), run.stderr ?? "");
  const result = { argv, cwd: repo, start, end, exit: run.status, signal: run.signal, error: run.error?.message ?? null };
  writeNew(path.join(out, `finalize-${page}.json`), result);
  snapshot(`after-finalize-${page}`, [page]);
  if (run.status !== 0) writeNew(path.join(out, "STOP.json"), result);
  console.log(JSON.stringify(result, null, 2));
  console.log(run.stdout ?? "");
  console.error(run.stderr ?? "");
  process.exitCode = run.status ?? 1;
} else if (action === "package") {
  const suffix = arg === "final" ? "-final" : "";
  const manifestPath = path.join(out, `manifest${suffix}.json`);
  const reportPath = path.join(out, `author-report${suffix}.md`);
  const current = snapshot(`author-final-package${suffix}`);
  const tools = [
    tool,
    `${repo}/.claude/skills/ld-s10y-lesson/tools/layout.py`,
    `${repo}/.claude/skills/ld-s10y-lesson/tools/blocks.py`,
    `${repo}/.claude/skills/ld-s10y-lesson/tools/normalize.py`,
    `${repo}/.claude/skills/ld-s10y-lesson/tools/mathcheck.py`,
    `${repo}/.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json`,
  ].map(record);
  const snapshots = files(out).filter((file) => /^\/.*\/(?:baseline|before-finalize-\d+|after-finalize-\d+)\.json$/.test(file))
    .map((file) => ({ evidence: record(file), snapshot: JSON.parse(fs.readFileSync(file, "utf8")) }));
  const finalize = ["0070", "0071"].flatMap((page) => {
    const file = path.join(out, `finalize-${page}.json`);
    return fs.existsSync(file) ? [{ result: JSON.parse(fs.readFileSync(file, "utf8")), record: record(file),
      stdout: record(path.join(out, `finalize-${page}.stdout.txt`)), stderr: record(path.join(out, `finalize-${page}.stderr.txt`)) }] : [];
  });
  const audits = ["0070", "0071"].flatMap((page) => {
    const file = path.join(durable, page, "audit.json");
    return fs.existsSync(file) ? [{ record: record(file), audit: JSON.parse(fs.readFileSync(file, "utf8")) }] : [];
  });
  const observations = JSON.parse(fs.readFileSync(path.join(out, "observations.json"), "utf8"));
  const cropRun = spawnSync(python, [path.join(out, "crop_facts.py")], {
    cwd: repo, env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" }, encoding: "utf8", maxBuffer: 8 * 1024 * 1024,
  });
  if (cropRun.status !== 0) throw new Error(`Crop facts failed: ${cropRun.stderr}`);
  const cropFacts = JSON.parse(cropRun.stdout);
  writeNew(path.join(out, `crop-facts${suffix}.json`), cropFacts);
  const preservation = snapshots.flatMap(({ snapshot: prior }) => prior.files.map((before) => {
    const now = current.files.find((file) => file.path === before.path);
    const saved = record(before.savedBytes);
    return {
      phase: prior.name, path: before.path, before_sha256: before.sha256, before_bytes: before.bytes,
      savedBytes: saved, saved_bytes_match_record: saved.sha256 === before.sha256 && saved.bytes === before.bytes,
      current_sha256: now?.sha256 ?? null, current_bytes: now?.bytes ?? null,
      current_equals_record: now?.sha256 === before.sha256 && now?.bytes === before.bytes,
    };
  }));
  const rawPages = ["0070", "0071"].map((page) => {
    const raw = snapshots.find(({ snapshot: prior }) => prior.name === `before-finalize-${page}`)
      ?.snapshot.files.find((file) => file.path === path.join(durable, page, "page.md"));
    return { page, rawBeforeFinalize: raw ?? null,
      current: current.files.find((file) => file.path === path.join(durable, page, "page.md")) ?? null };
  });
  const manifest = {
    schema: "source-page-author-evidence@1", scope: "STEMROBIN-184 source 6-8g physical 70/71 only",
    createdAt: new Date().toISOString(), expectedSourceHashes: expected, snapshots, current, finalize, audits,
    toolsObservedOnlyAtFinalPackage: tools,
    toolPolicy: "Parent owns concurrent counter edits; these are current observations, not immutable guards or proof of execution-time identity.",
    observations, rawPages, cropFacts, preservation,
    supersededMeasurement: suffix ? {
      report: path.join(out, "author-report.md"),
      manifest: path.join(out, "manifest.json"),
      reason: "Initial pixel comparison used unpadded source content against the padded official PNG, causing shifted/incommensurate comparison. Earlier evidence preserved byte-for-byte. This final package accounts for actual 12px white padding; no official finalize rerun and no source/output edit.",
    } : null,
    independentReview: "NOT PERFORMED", fullCourseClaim: "NONE",
  };
  const report = [
    "# STEMROBIN-184 Source Page Author Report",
    "",
    `Author package observed at ${manifest.createdAt}. Fresh source-only author, book 6-8g, physical 70/71 (printed 60/61).`,
    "",
    "## Scope And Outcome",
    "",
    ...finalize.map(({ result }) => `- Physical ${result.argv.at(-1)}: first official finalize only, start ${result.start}, end ${result.end}, exit ${result.exit}.`),
    ...audits.map(({ audit }) => `- Physical ${audit.page}: ${audit.lines_md}/${audit.lines_printed} authored/printed lines; ${audit.figures.length} figure; ${audit.errors.length} official errors; ${audit.normalizations.length} normalizations; ${audit.count_exclusions.length} exclusions.`),
    "- No prepare rerun, retry, counter edit, exclusion, override or fabricated wrap.",
    "- No independent review or full-course claim. No assembly, lessons, modern figures, DB, production, publishing, deployment, Git write, other chat or ticket lifecycle action.",
    "- Only the two new durable page.md files, official page-local outputs and this scratch-prefix directory were written. Both durable directories were absent at baseline.",
    `- ${observations.discoveryNote}`,
    "",
    "## Boundaries And Literal Source",
    "",
    JSON.stringify(observations.boundary, null, 2),
    "",
    ...observations.literalDecisions.map((decision) => `- ${decision}`),
    "- The actual source page has a non-text separator line on p71; no invented text row or exclusion was used for it.",
    "",
    "## Raw And Current Page Hashes",
    "",
    ...rawPages.flatMap(({ page, rawBeforeFinalize: raw, current: now }) => [
      `### Physical ${Number(page)}`,
      `- Durable path: ${now?.path ?? path.join(durable, page, "page.md")}`,
      `- Raw before finalize: SHA-256 ${raw?.sha256 ?? "NOT RECORDED"}, ${raw?.bytes ?? 0} bytes; saved exact bytes ${raw?.savedBytes ?? "NONE"}.`,
      `- Current: SHA-256 ${now?.sha256 ?? "NONE"}, ${now?.bytes ?? 0} bytes; mtime ${now?.mtime ?? "NONE"}; observed ${now?.observedAt ?? "NONE"}.`,
      "- Differences between raw and current page.md include the official frontmatter/figure-reference serialization. Official audits report zero text normalizations.",
      "",
      "Raw author body, before official serialization:",
      "```markdown",
      raw ? fs.readFileSync(raw.savedBytes, "utf8").split("---").slice(2).join("---").trim() : "NOT FINALIZED",
      "```",
      "",
    ]),
    "## Source Hashes And Byte Preservation",
    "",
    ...current.files.filter((file) => ["page.png", "page.grid.png", "layout.json", "page.template.md"].includes(path.basename(file.path)))
      .map((file) => `- ${file.path}: SHA-256 ${file.sha256}; ${file.bytes} bytes; mtime ${file.mtime}; observed ${file.observedAt}.`),
    `- Baseline prepared files unchanged: ${preservation.filter((item) => item.phase === "baseline").every((item) => item.current_equals_record)}.`,
    `- Every saved snapshot byte copy matches its recorded original hash/size: ${preservation.every((item) => item.saved_bytes_match_record)}.`,
    "- Baseline, before-finalize, after-finalize and final-package snapshots retain all observed source/raw/crop bytes. See manifest.preservation for each exact comparison.",
    "- Source PDF provenance digest was recomputed by official finalize and is retained in page metadata; no unrelated PDF content was opened for authorship.",
    "",
    "## Object Ownership And Source Inventory",
    "",
    JSON.stringify(observations.semanticRoles, null, 2),
    "",
    JSON.stringify(observations.visualInventory, null, 2),
    "",
    "## Every Actual Crop",
    "",
    ...cropFacts.flatMap((crop) => [
      `- ${crop.output}`,
      `  Kind ${crop.kind}; original source ${crop.source}; source SHA-256 ${crop.source_sha256}.`,
      `  Actual xywh ${JSON.stringify(crop.box_xywh)}; raster ${JSON.stringify(crop.size)}; PNG ${crop.png_bytes} bytes; SHA-256 ${crop.png_sha256}.`,
      `  Padding ltrb ${JSON.stringify(crop.padding_px_ltrb)}; source extent including padding ${JSON.stringify(crop.source_extent_xywh_with_padding)}; expected raster ${JSON.stringify(crop.expected_size)}; raster size matches ${crop.actual_size_matches_expected}.`,
      `  Original-region RGB SHA-256 ${crop.source_region_rgb_sha256}; output content-region RGB SHA-256 ${crop.actual_content_region_rgb_sha256}; expected padded RGB SHA-256 ${crop.expected_padded_rgb_sha256}; output RGB SHA-256 ${crop.actual_crop_rgb_sha256}.`,
      `  Aligned differing RGB pixels ${crop.different_rgb_pixels}; difference bbox ${JSON.stringify(crop.source_pixel_difference_bbox_crop_local)}. Comparison accounts for the actual white padding.`,
      ...(crop.official_audit_figure ? [`  Official figure facts ${JSON.stringify(crop.official_audit_figure)}.`] : []),
    ]),
    "",
    "## Image Budget",
    "",
    `Exactly ${observations.imageBudget.totalLoads}/${observations.imageBudget.batchLimit} loads in this fresh context: two source grids, five original-pixel author crops and one official crop. No reopens. Context cap 24; current total 8. No further images may be loaded in this batch.`,
    "",
    ...observations.imageBudget.imageLedgerInLoadOrder.map((image) => `- Load ${image.load}: ${image.path}; detail ${image.detail}.`),
    observations.officialCropObservation,
    "",
    "## Tool Observation And Execution Evidence",
    "",
    "- Parent owns concurrent counter/tool edits. No tool was hashed as an immutable author guard before this final package.",
    "- These hashes/timestamps are final-package observations only. They do not establish immutable identity or the exact execution-time revision across concurrent changes.",
    ...tools.map((file) => `- ${file.path}: SHA-256 ${file.sha256}; ${file.bytes} bytes; mtime ${file.mtime}; observed ${file.observedAt}.`),
    ...finalize.flatMap(({ result, record: entry, stdout, stderr }) => [
      `- argv ${JSON.stringify(result.argv)}; cwd ${result.cwd}; start ${result.start}; end ${result.end}; exit ${result.exit}; signal ${result.signal}.`,
      `  Record ${entry.path}; SHA-256 ${entry.sha256}.`,
      `  stdout ${stdout.path}; SHA-256 ${stdout.sha256}; ${stdout.bytes} bytes.`,
      `  stderr ${stderr.path}; SHA-256 ${stderr.sha256}; ${stderr.bytes} bytes.`,
    ]),
    "",
    "## Remaining Uncertainty",
    "",
    "- Fine-stroke decomposition, arrowhead geometry and incidental tiny marks not resolved from source remain UNKNOWN; source pixels are retained. No semantic correction was inferred.",
    "- Exercise 182 continues beyond the inspected pages; no next-page content, figure83 pixels or answer was inferred.",
    "- Official fig-81 crop was not reopened because the bounded image allowance was assigned to both original pages and fig-82. Hash/box/pixel facts are recorded without an independent visual PASS.",
    "",
    ...(manifest.supersededMeasurement ? [
      "## Superseded Measurement",
      "",
      manifest.supersededMeasurement.reason,
      `Earlier preserved report: ${manifest.supersededMeasurement.report}`,
      `Earlier preserved manifest: ${manifest.supersededMeasurement.manifest}`,
      "",
    ] : []),
    `Manifest: ${manifestPath}`,
    "",
  ].join("\n");
  writeNew(reportPath, report);
  manifest.report = record(reportPath);
  manifest.scratchEvidence = files(out).filter((file) => !file.includes("/bytes/")).map(record);
  writeNew(manifestPath, manifest);
  console.log(JSON.stringify(manifest.report, null, 2));
  console.log(JSON.stringify(record(manifestPath), null, 2));
} else {
  throw new Error("Expected baseline, finalize <70|71>, or package");
}
