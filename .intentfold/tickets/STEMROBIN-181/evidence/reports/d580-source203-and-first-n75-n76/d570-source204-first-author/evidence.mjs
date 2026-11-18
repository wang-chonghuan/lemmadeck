import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const owned = path.dirname(fileURLToPath(import.meta.url));
const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const prepared = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d567-source203-svg-and-source204-preparation");
const manifestSha = "8952c2945682f8ef2ee97b895bb2fe514d6e8b22f9637342da8ecc9226928909";
const digest = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const writeJSON = (relative, value) => {
  const destination = path.join(owned, relative);
  if (fs.existsSync(destination)) throw new Error(`Refusing overwrite: ${destination}`);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, JSON.stringify(value, null, 2) + "\n");
};
const walk = (directory) => fs.existsSync(directory)
  ? fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlink forbidden: ${file}`);
    return entry.isDirectory() ? walk(file) : [file];
  }).sort()
  : [];
const record = (file) => ({
  path: path.relative(owned, file),
  sha256: digest(file),
  bytes: fs.statSync(file).size,
  mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, "0"),
});
const snapshot = (name) => {
  const entries = [];
  for (const tree of ["source", "work"]) {
    for (const file of walk(path.join(owned, tree))) {
      const relative = path.relative(owned, file);
      const destination = path.join(owned, "snapshots", name, relative);
      if (fs.existsSync(destination)) throw new Error(`Snapshot exists: ${destination}`);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.copyFileSync(file, destination, fs.constants.COPYFILE_EXCL);
      fs.chmodSync(destination, 0o444);
      entries.push(record(destination));
    }
  }
  writeJSON(`snapshots/${name}/manifest.json`, { name, entries });
  fs.chmodSync(path.join(owned, `snapshots/${name}/manifest.json`), 0o444);
};

const operation = process.argv[2];
if (operation === "setup") {
  const manifestFile = path.join(prepared, "manifest.json");
  if (digest(manifestFile) !== manifestSha) throw new Error("Manifest SHA mismatch");
  const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
  if (manifest.inputs.length !== 4) throw new Error("Expected exactly four prepared inputs");
  const bindings = manifest.inputs.map((input) => {
    const file = path.join(repo, input.path);
    if (digest(file) !== input.sha256) throw new Error(`Input SHA mismatch: ${file}`);
    return { original: file, sha256: input.sha256, basename: path.basename(file) };
  });
  for (const tree of ["inputs/prepared", "source/10p/pages/0204", "work/10p/pages/0204"]) {
    fs.mkdirSync(path.join(owned, tree), { recursive: true });
    for (const binding of bindings) {
      const destination = path.join(owned, tree, binding.basename);
      fs.copyFileSync(binding.original, destination, fs.constants.COPYFILE_EXCL);
      if (digest(destination) !== binding.sha256) throw new Error("Clone mismatch");
      if (tree === "inputs/prepared") fs.chmodSync(destination, 0o444);
    }
  }
  fs.copyFileSync(manifestFile, path.join(owned, "inputs/prepared-manifest.json"), fs.constants.COPYFILE_EXCL);
  fs.copyFileSync(bindings[0].original, path.join(owned, "inputs/sourcepage.png"), fs.constants.COPYFILE_EXCL);
  for (const [name, source] of [
    ["lesson-SKILL.md", ".claude/skills/ld-s10y-lesson/SKILL.md"],
    ["image-SKILL.md", ".agents/skills/ld-s10y-image/SKILL.md"],
    ["p2c.py", ".claude/skills/ld-s10y-lesson/tools/p2c.py"],
    ["blocks.py", ".claude/skills/ld-s10y-lesson/tools/blocks.py"],
    ["layout.py", ".claude/skills/ld-s10y-lesson/tools/layout.py"],
    ["vectorize.py", ".claude/skills/ld-s10y-lesson/tools/vectorize.py"],
    ["soviet-cn.json", ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json"],
  ]) {
    fs.mkdirSync(path.join(owned, "inputs/contracts"), { recursive: true });
    fs.copyFileSync(path.join(repo, source), path.join(owned, "inputs/contracts", name), fs.constants.COPYFILE_EXCL);
  }
  writeJSON("input-bindings.json", {
    task: "d570 first physical SOURCE204 author, one-off",
    manifest: { original: manifestFile, sha256: manifestSha },
    bindings,
    prepareInvocations: 0,
    source203TextOnlyCarry: {
      tail: "于焦点和透镜之间，所以点 S 的像 S₁ 是虚像.",
      finalParagraph: "closed",
      numberedHeading: false,
      independent: "PENDING",
      certifiedByD570: false,
    },
    originalSource204DirectoryExisted: false,
    imageCounterStart: 0,
    contextLimit: 24,
    batchLimit: 8,
    noReset: true,
    parentImageCount: 24,
    fullCard: false,
    SOURCEIndependent: "PENDING",
    n76RightBoundary: "AUTHOR-ONLY-PENDING-INDEPENDENT",
  });
  snapshot("prepared-clone");
  console.log(JSON.stringify({ owned, inputHashesVerified: 4, imageOpens: 0, prepareInvocations: 0 }));
} else if (operation === "stage-author") {
  const original = path.join(owned, "original-inventory-boundaries-rows.json");
  const typed = path.join(owned, "typedpage.md");
  const destination = path.join(owned, "source/10p/pages/0204/page.md");
  const inventory = JSON.parse(fs.readFileSync(original, "utf8"));
  if (inventory.basis.nativeInvocationsBeforeFreeze !== 0) throw new Error("Inventory not pre-native");
  fs.copyFileSync(typed, destination, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(original, 0o444);
  fs.chmodSync(typed, 0o444);
  writeJSON("original-author-freeze.json", {
    status: "ORIGINAL-INVENTORY-BOUNDARIES-ROWS-FROZEN-BEFORE-FIRST-NATIVE",
    frozenAt: new Date().toISOString(),
    entries: [original, typed, path.join(owned, "inputs/sourcepixelcrop-first-paragraph.png")].map(record),
    actualOpens: 3,
    nativeInvocations: 0,
    fullCard: false,
    SOURCEIndependent: "PENDING",
  });
  fs.chmodSync(path.join(owned, "original-author-freeze.json"), 0o444);
  snapshot("author-staged");
  console.log(JSON.stringify({ staged: record(destination), inventory: record(original), frozenBeforeNative: true }));
} else if (operation === "snapshot") {
  snapshot(process.argv[3]);
  console.log(`Retained snapshot: ${process.argv[3]}`);
} else if (operation === "native") {
  const command = process.argv[3];
  if (!["finalize", "vectorize"].includes(command)) throw new Error("Only scoped native commands allowed");
  const label = process.argv[4] || `first-${command}`;
  if (!fs.existsSync(path.join(owned, "original-author-freeze.json"))) throw new Error("Original inventory must freeze before native");
  const receipt = path.join(owned, "native", `${label}.receipt.json`);
  if (fs.existsSync(receipt)) throw new Error(`Invocation already recorded: ${label}`);
  snapshot(`${label}-pre`);
  const executable = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
  const args = [
    "-B", path.join(repo, ".claude/skills/ld-s10y-lesson/tools/p2c.py"),
    command, "--book", "10p", "--page", "204",
    "--root", path.join(owned, "source"), "--work", path.join(owned, "work"),
  ];
  const started = new Date().toISOString();
  const result = spawnSync(executable, args, {
    cwd: repo, encoding: "utf8", maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  });
  fs.mkdirSync(path.dirname(receipt), { recursive: true });
  for (const [suffix, content] of [["stdout.txt", result.stdout || ""], ["stderr.txt", result.stderr || ""]]) {
    fs.writeFileSync(path.join(owned, "native", `${label}.${suffix}`), content, { flag: "wx" });
  }
  writeJSON(`native/${label}.receipt.json`, {
    command: [executable, ...args], started, ended: new Date().toISOString(),
    invocations: 1, exitCode: result.status, signal: result.signal,
    error: result.error?.message || null, stdout: result.stdout || "", stderr: result.stderr || "",
  });
  snapshot(`${label}-post`);
  if (result.status !== 0 && !fs.existsSync(path.join(owned, "native/firstFAIL.json"))) {
    writeJSON("native/firstFAIL.json", {
      command, label, exitCode: result.status, signal: result.signal,
      receipt: record(receipt), status: "RETAINED-FIRST-FAIL",
    });
  }
  console.log(result.stdout || "");
  console.error(result.stderr || "");
  console.log(JSON.stringify({ label, exitCode: result.status, signal: result.signal }));
} else if (operation === "verify") {
  const pagePath = path.join(owned, "source/10p/pages/0204/page.json");
  const auditPath = path.join(owned, "source/10p/pages/0204/audit.json");
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const audit = JSON.parse(fs.readFileSync(auditPath, "utf8"));
  const original = JSON.parse(fs.readFileSync(path.join(owned, "original-inventory-boundaries-rows.json"), "utf8"));
  const rows = page.blocks.flatMap((block) => block.lines);
  if (JSON.stringify(rows) !== JSON.stringify(original.rowInventory.map((row) => row.text))) {
    throw new Error("Native rows differ from frozen original author inventory");
  }
  if (page.blocks.length !== 4 || rows.length !== 20 || audit.lines_printed !== 20 || audit.lines_md !== 20) {
    throw new Error("Native counts differ from frozen original");
  }
  if (audit.errors.length || audit.normalizations.length || audit.figures.length) {
    throw new Error("Unexpected native failure, normalization or figure");
  }
  const nativeRefs = page.blocks.map((block, index) => {
    const expected = original.boundaryFlags.blocks[index];
    if (block.kind !== expected.kind || block.cont !== expected.cont || block.open !== expected.open) {
      throw new Error(`Boundary mismatch: p0204#${index + 1}`);
    }
    return {
      nativeOneBasedRef: `p0204#${index + 1}`, jsonZeroBasedPointer: `/blocks/${index}`,
      kind: block.kind, rows: block.lines.length, cont: block.cont, open: block.open,
      textFirst: block.lines[0], textLast: block.lines.at(-1),
    };
  });
  const ledger = JSON.parse(fs.readFileSync(path.join(owned, "image-opens.json"), "utf8"));
  if (ledger.actualOpens !== 3 || ledger.entries.length !== 3) throw new Error("Image ledger mismatch");
  const imageEntries = ledger.entries.map((entry) => ({
    ...entry, binding: record(path.join(owned, entry.path)),
  }));
  const bindings = JSON.parse(fs.readFileSync(path.join(owned, "input-bindings.json"), "utf8"));
  if (digest(bindings.manifest.original) !== manifestSha) throw new Error("External manifest changed");
  for (const input of bindings.bindings) {
    if (digest(input.original) !== input.sha256) throw new Error(`External prepared input changed: ${input.original}`);
    for (const tree of ["inputs/prepared", "source/10p/pages/0204", "work/10p/pages/0204"]) {
      if (digest(path.join(owned, tree, input.basename)) !== input.sha256) throw new Error(`Private clone changed: ${tree}/${input.basename}`);
    }
  }
  const receipts = ["first-finalize", "first-vectorize"].map((name) => {
    const file = path.join(owned, "native", `${name}.receipt.json`);
    const receipt = JSON.parse(fs.readFileSync(file, "utf8"));
    if (receipt.invocations !== 1 || receipt.exitCode !== 0 || receipt.signal || receipt.error) {
      throw new Error(`Unexpected native result: ${name}`);
    }
    return { name, exitCode: receipt.exitCode, invocations: receipt.invocations, binding: record(file) };
  });
  const raw = walk(path.join(owned, "work/10p/pages/0204/figures")).filter((file) => file.endsWith(".png"));
  const svg = walk(path.join(owned, "work/10p/pages/0204/figures")).filter((file) => file.endsWith(".svg"));
  if (raw.length || svg.length) throw new Error("Unexpected local figures");
  const actualHeading = nativeRefs.find((block) => block.kind === "h3");
  writeJSON("verification.json", {
    status: "AUTHOR-NATIVE-PASS-INDEPENDENT-PENDING",
    frozenRowsExactlyRetained: true,
    externalPreparedInputsUnchanged: true,
    preparedInputBindings: bindings.bindings,
    nativeRefs,
    firstHeading: {
      text: actualHeading.textFirst,
      nativeOneBasedRef: actualHeading.nativeOneBasedRef,
      jsonZeroBasedPointer: actualHeading.jsonZeroBasedPointer,
      textPointer: `${actualHeading.jsonZeroBasedPointer}/lines/0`,
      beforeHeadingCarryover: [],
    },
    exactLastBodyRow: page.blocks[2].lines.at(-1),
    exactLastBodyRowPointer: "/blocks/2/lines/15",
    lastBodyParagraphOpenPointer: "/blocks/2/open",
    lastFormulaComplete: true,
    lastBodyParagraphOpen: true,
    SOURCE203TextOnlyClosedTail: bindings.source203TextOnlyCarry,
    counts: {
      blocks: 4, printedRows: 20, authoredRows: 20,
      figures: audit.figures.length, rawCrops: raw.length, svgOutputs: svg.length,
      vectorizePassed: 0, vectorizeFailed: 0,
      normalizations: audit.normalizations.length, errors: audit.errors.length,
      unknownCharacters: audit.unknown_chars.length, katexWarnings: audit.katex_warnings.length,
      errata: audit.errata,
      actualImageOpens: ledger.actualOpens, rawCropOpens: 0, svgPreviewOpens: 0,
      nativeFinalizeInvocations: 1, nativeVectorizeInvocations: 1,
      prepareInvocations: 0, targetedRepairs: 0,
    },
    imageEntries,
    figureIdList: [],
    coarseWholeFigureBoxes: [],
    RAWInspection: "NOT-APPLICABLE-ZERO-SOURCE204-FIGURES",
    originalSVGInspection: "NOT-PERFORMED-ZERO-SOURCE204-SVG",
    receipts,
    firstFAIL: { occurred: false, reason: "Both first native commands exited0; no fabricated firstFAIL", retainedFailureFiles: [] },
    terminalHOLD: false,
    fullCard: false,
    SOURCEIndependent: "PENDING",
    n76RightBoundary: "AUTHOR-ONLY-PENDING-INDEPENDENT",
    noOriginalSVGPreviewInspection: true,
    noCanonicalEdits: true,
    noGitNewWorktreeBranchDBDeployPaidCalls: true,
    artifactBindings: [pagePath, auditPath, path.join(owned, "source/10p/pages/0204/page.md"), path.join(owned, "typedpage.md")].map(record),
  });
  console.log(JSON.stringify({ status: "AUTHOR-NATIVE-PASS-INDEPENDENT-PENDING", refs: nativeRefs, verification: record(path.join(owned, "verification.json")) }, null, 2));
} else if (operation === "freeze") {
  if (fs.existsSync(path.join(owned, "author-freeze.json"))) throw new Error("Already frozen");
  for (const file of walk(owned)) fs.chmodSync(file, 0o444);
  writeJSON("author-freeze.json", {
    schema: "d570/author-freeze@1", status: "FULL-AUTHOR-FREEZE",
    fullCard: false, SOURCEIndependent: "PENDING",
    entries: walk(owned).map(record),
    hashSemantics: "Lists every owned file before this manifest; READY binds report and freeze. READY is not self-hashed.",
  });
  fs.chmodSync(path.join(owned, "author-freeze.json"), 0o444);
  writeJSON("READY.json", {
    status: "READY-FOR-INDEPENDENT-SOURCE-REVIEW",
    report: record(path.join(owned, "report.md")),
    boundary: record(path.join(owned, "original-inventory-boundaries-rows.json")),
    typedPage: record(path.join(owned, "typedpage.md")),
    nativePage: record(path.join(owned, "source/10p/pages/0204/page.md")),
    authorFreeze: record(path.join(owned, "author-freeze.json")),
    imageOpens: JSON.parse(fs.readFileSync(path.join(owned, "image-opens.json"), "utf8")).actualOpens,
    fullCard: false, SOURCEIndependent: "PENDING",
    n76RightBoundary: "AUTHOR-ONLY-PENDING-INDEPENDENT",
  });
  fs.chmodSync(path.join(owned, "READY.json"), 0o444);
  const files = walk(owned);
  const wrongMode = files.filter((file) => (fs.statSync(file).mode & 0o777) !== 0o444);
  if (wrongMode.length) throw new Error(`Freeze mode failure: ${wrongMode}`);
  for (const entry of JSON.parse(fs.readFileSync(path.join(owned, "author-freeze.json"), "utf8")).entries) {
    if (digest(path.join(owned, entry.path)) !== entry.sha256) throw new Error(`Freeze hash failure: ${entry.path}`);
  }
  console.log(JSON.stringify({
    owned, files: files.length, mode: "0444", hashesVerified: true,
    READY: record(path.join(owned, "READY.json")),
    report: record(path.join(owned, "report.md")),
    authorFreeze: record(path.join(owned, "author-freeze.json")),
    typedPage: record(path.join(owned, "typedpage.md")),
  }, null, 2));
} else {
  throw new Error(`Unknown operation: ${operation}`);
}
