import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const ticket = path.join(repo, ".intentfold/tickets/STEMROBIN-181");
const own = path.join(ticket, "tmp/d775-source229-first-author");
const preparation = path.join(ticket, "tmp/d774-source229-preparation");
const work = path.join(own, "work");
const root = path.join(own, "root");
const pageDir = path.join(root, "10p/pages/0229");
const sourceHash = "4525f1795c8daddca72e11897b264e91c3b114d5614c68132f204c8e8a08faf4";
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const fileRecord = (file) => {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: sha256(bytes), bytes: bytes.length };
};
const save = (file, bytes) => {
  if (!path.resolve(file).startsWith(`${own}/`)) {
    throw new Error(`Write outside author directory refused: ${file}`);
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes, { flag: "wx" });
};
const saveJson = (file, data) => save(file, `${JSON.stringify(data, null, 2)}\n`);
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
if (process.cwd() !== repo) throw new Error("Wrong working directory");

const stage = process.argv[2];
if (stage === "copy") {
  const manifestPath = path.join(preparation, "manifest.json");
  const manifest = readJson(manifestPath);
  if (manifest.book !== "10p" || manifest.page !== 229) {
    throw new Error("Prepared page identity mismatch");
  }
  const expectedNames = ["page.png", "page.grid.png", "layout.json", "page.template.md"];
  const copied = [];
  for (const name of expectedNames) {
    const source = path.join(preparation, "work/10p/pages/0229", name);
    const declaration = manifest.outputs.find((item) => item.path === source);
    const bytes = fs.readFileSync(source);
    const hash = sha256(bytes);
    if (!declaration || declaration.sha256 !== hash) {
      throw new Error(`Prepared hash mismatch: ${name}`);
    }
    if (name === "page.png" && hash !== sourceHash) {
      throw new Error("Rendered source hash mismatch");
    }
    const destination = path.join(work, "10p/pages/0229", name);
    save(destination, bytes);
    copied.push({ source, ...fileRecord(destination) });
  }
  saveJson(path.join(own, "prepared-copy.json"), {
    method: "Sorted explicit prepared-file allowlist; byte-identical copies; no prepare call.",
    manifest: fileRecord(manifestPath),
    copied,
  });
  console.log(JSON.stringify({ stage, copied: copied.length, work, root }));
} else if (stage === "finalize") {
  const candidate = path.join(pageDir, "page.md");
  const snapshot = path.join(own, "candidate.before-finalize.md");
  save(snapshot, fs.readFileSync(candidate));
  const command = [
    path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python"),
    "-B",
    path.join(repo, ".claude/skills/ld-s10y-lesson/tools/p2c.py"),
    "finalize",
    "--root", root,
    "--work", work,
    "--book", "10p",
    "--page", "229",
  ];
  saveJson(path.join(own, "finalize.0001.started.json"), {
    command, cwd: repo, candidate: fileRecord(snapshot), actualInvocation: 1,
  });
  const result = spawnSync(command[0], command.slice(1), {
    cwd: repo,
    encoding: "utf8",
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
    maxBuffer: 16 * 1024 * 1024,
  });
  const stdout = path.join(own, "finalize.0001.stdout");
  const stderr = path.join(own, "finalize.0001.stderr");
  save(stdout, result.stdout ?? "");
  save(stderr, result.stderr ?? "");
  const receipt = {
    command,
    cwd: repo,
    exitCode: result.status,
    signal: result.signal,
    executionError: result.error?.message ?? null,
    stdout: fileRecord(stdout),
    stderr: fileRecord(stderr),
    candidateBefore: fileRecord(snapshot),
    candidateAfter: fs.existsSync(candidate) ? fileRecord(candidate) : null,
    actualInvocation: 1,
    retryCount: 0,
    independentApproval: false,
  };
  saveJson(path.join(own, "finalize.0001.receipt.json"), receipt);
  if (result.status !== 0) {
    saveJson(path.join(own, "first-failure.json"), {
      phase: "native-source-finalize",
      receipt: fileRecord(path.join(own, "finalize.0001.receipt.json")),
      ...receipt,
      contentRetries: 0,
    });
  }
  console.log(JSON.stringify(receipt, null, 2));
} else if (stage === "freeze") {
  const receiptPath = path.join(own, "finalize.0001.receipt.json");
  const receipt = readJson(receiptPath);
  const observationsPath = path.join(own, "observations.json");
  const observations = readJson(observationsPath);
  const auditPath = path.join(pageDir, "audit.json");
  const audit = fs.existsSync(auditPath) ? readJson(auditPath) : null;
  const toolNames = [
    "tools/p2c.py", "tools/blocks.py", "tools/layout.py", "tools/normalize.py",
    "tools/mathcheck.py", "tools/katex_check.js", "profiles/soviet-cn.json",
  ];
  const tools = toolNames.map((name) =>
    fileRecord(path.join(repo, ".claude/skills/ld-s10y-lesson", name)));
  const files = [
    path.join(own, "author.mjs"),
    observationsPath,
    path.join(own, "prepared-copy.json"),
    path.join(own, "candidate.before-finalize.md"),
    path.join(pageDir, "page.md"),
    path.join(pageDir, "page.json"),
    auditPath,
    path.join(own, "finalize.0001.started.json"),
    receiptPath,
    path.join(own, "finalize.0001.stdout"),
    path.join(own, "finalize.0001.stderr"),
    path.join(own, "first-failure.json"),
  ].filter((file) => fs.existsSync(file)).map(fileRecord);
  const cropsDir = path.join(work, "10p/pages/0229/figures");
  const nativeCrops = fs.existsSync(cropsDir)
    ? fs.readdirSync(cropsDir).sort().filter((name) => name.endsWith(".png"))
      .map((name) => fileRecord(path.join(cropsDir, name)))
    : [];
  const imageLedger = [
    {
      ordinal: 1, kind: "grid", reopen: false,
      ...fileRecord(path.join(preparation, "work/10p/pages/0229/page.grid.png")),
      observations: "Printed219; indentation, physical line inventory, no figures or headings, final comma.",
    },
    {
      ordinal: 2, kind: "original", reopen: false,
      ...fileRecord(path.join(preparation, "work/10p/pages/0229/page.png")),
      observations: "Ungriddded confirmation of literal text, subscripts, equations and page footer.",
    },
  ];
  const report = {
    schema: "ld-s10y-lesson/source-first-author-report@1",
    ticket: "STEMROBIN-181", book: "10p", physicalPage: 229, printedPageObserved: 219,
    status: "AUTHOR-FROZEN-INDEPENDENT-REVIEW-PENDING",
    source: fileRecord(path.join(work, "10p/pages/0229/page.png")),
    preparationManifest: fileRecord(path.join(preparation, "manifest.json")),
    previousPageTextOnly: fileRecord(path.join(ticket,
      "tmp/d758-source227228-consume-prepare84-85/root/10p/pages/0228/page.md")),
    root, work,
    inventory: observations,
    candidateBefore: fileRecord(path.join(own, "candidate.before-finalize.md")),
    candidateAfter: fileRecord(path.join(pageDir, "page.md")),
    native: {
      actualFinalizeInvocations: 1,
      contentRetries: 0, technicalRetries: 0,
      receipt: fileRecord(receiptPath),
      exitCode: receipt.exitCode,
      linesPrinted: audit?.lines_printed ?? null,
      linesCandidate: audit?.lines_md ?? null,
      errors: audit?.errors ?? null,
      katexWarnings: audit?.katex_warnings ?? null,
      firstFailure: fs.existsSync(path.join(own, "first-failure.json"))
        ? fileRecord(path.join(own, "first-failure.json")) : null,
      executionIsSourcePass: false,
      toolHashes: tools,
    },
    crops: nativeCrops,
    cropObservations: {
      status: nativeCrops.length === 0 ? "NOT-APPLICABLE-NO-SOURCE-FIGURES" : "PENDING",
      sourceFiguresObserved: 0, nativeCropsObserved: 0,
    },
    imageUsage: {
      batchActual: imageLedger.length, contextActual: imageLedger.length,
      limits: { batch: 8, context: 24 },
      gridOpens: 1, originalOpens: 1, detailCropOpens: 0,
      nativeCropOpens: 0, reopens: 0, previousPageImageOpens: 0,
      ledger: imageLedger,
    },
    holds: observations.holds,
    gates: {
      SOURCE: "INDEPENDENT-PENDING",
      RAW: "INDEPENDENT-PENDING",
      modern: "PENDING-NOT-STARTED",
    },
    completeCardClaim: false,
    outsideScope: {
      canonicalWrites: 0, meterWrites: 0, indexWrites: 0, toolsWrites: 0,
      databaseWrites: 0, publisherCalls: 0, deployCalls: 0,
      gitOperations: 0, chatMessages: 0, prepareCalls: 0, paidCalls: 0,
    },
    files,
  };
  const reportPath = path.join(own, "report.json");
  saveJson(reportPath, report);
  const freezePath = path.join(own, "author-freeze.json");
  saveJson(freezePath, {
    schema: "ld-s10y-lesson/source-author-freeze@1",
    ticket: "STEMROBIN-181", book: "10p", physicalPage: 229,
    status: report.status,
    source: report.source,
    candidate: report.candidateAfter,
    report: fileRecord(reportPath),
    nativeReceipt: report.native.receipt,
    crops: nativeCrops,
    imageUsage: report.imageUsage,
    gates: report.gates,
    holds: report.holds,
    completeCardClaim: false,
    files,
  });
  console.log(JSON.stringify({
    authorFreeze: fileRecord(freezePath), report: fileRecord(reportPath),
    candidate: report.candidateAfter, source: report.source,
    nativeExitCode: receipt.exitCode, images: imageLedger.length,
  }, null, 2));
} else {
  throw new Error("Expected copy, finalize or freeze");
}
