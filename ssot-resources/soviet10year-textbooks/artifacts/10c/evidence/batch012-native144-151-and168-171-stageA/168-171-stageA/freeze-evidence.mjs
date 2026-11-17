import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.dirname(fileURLToPath(import.meta.url));
const workspace = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const relativeRoot = ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c168-171-review";
if (root !== path.join(workspace, relativeRoot)) throw new Error("Wrong owned root");
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const json = (name, value) => fs.writeFileSync(path.join(root, name), `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
const textReads = [
  { id: "C01", file: ".intentfold/readme.md", first: 1, last: 240, chunk: "5d4c3f" },
  { id: "C02", file: ".intentfold/charter/engineering.md", first: 1, last: 260, chunk: "e4d898" },
  { id: "C03", file: ".intentfold/charter/operations.md", first: 1, last: 260, chunk: "2091cb" },
  { id: "C04", file: ".claude/skills/ld-s10y-lesson/SKILL.md", first: 1, last: 280, chunk: "e69cdd" },
  { id: "C05", file: ".agents/skills/ld-s10y-image/SKILL.md", first: 1, last: 300, chunk: "09c435" },
  { id: "C06", file: ".intentfold/charter/operations.md", first: 261, last: 360, chunk: "64b6a5" },
];
const sources = [
  { page: "0168", physical: 168, printed: 162, bytes: 100536, width: 1695, height: 2580, sha256: "2a8a56c0c5d8e760ce475c8cc5ad7fa5f83fbd7fd4f591b881bfafde1fb6ed47", chunk: "8cd68e" },
  { page: "0169", physical: 169, printed: 163, bytes: 70154, width: 1695, height: 2580, sha256: "e23fe27e5bd58e156818675741d31e6754140a61bad63477a59455ff4ce63e00", chunk: "e94cae" },
  { page: "0170", physical: 170, printed: 164, bytes: 59392, width: 1695, height: 2580, sha256: "68ffce71c08910ed4882f42608268333d84ecef250b35404795d23d96aeb343b", chunk: "c884eb" },
  { page: "0171", physical: 171, printed: 165, bytes: 88539, width: 1695, height: 2580, sha256: "862be0f3c9fdec5e99f1f62efff80cb5c102eac1efc82d896ff3833309424eea", chunk: "fda73c" },
].map((s) => ({
  ...s,
  path: path.join(workspace, `.intentfold/tickets/STEMROBIN-184/tmp/production-source10c168-171/10c/pages/${s.page}/page.png`),
}));

if (process.argv[2] === "--project-read-streams") {
  fs.mkdirSync(path.join(root, "read-projections"));
  for (const r of textReads) {
    const source = fs.readFileSync(path.join(workspace, r.file), "utf8");
    const lines = source.match(/[^\n]*\n|[^\n]+$/g) ?? [];
    fs.writeFileSync(path.join(root, `read-projections/${r.id}.stdout.projection.txt`), lines.slice(r.first - 1, r.last).join(""), { flag: "wx" });
  }
} else {
  const projection = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--project-read-streams"], { cwd: workspace, encoding: "utf8" });
  if (projection.error || projection.status !== 0) {
    json("projection-command.failure.json", {
      command: [process.execPath, fileURLToPath(import.meta.url), "--project-read-streams"],
      stdout: projection.stdout,
      stderr: projection.stderr,
      exitCode: projection.status,
      signal: projection.signal,
      error: projection.error?.message ?? null,
    });
    throw new Error("Projection child did not succeed; no repair attempted");
  }

  const textCommands = textReads.map((r) => {
    const projectionPath = path.join(root, `read-projections/${r.id}.stdout.projection.txt`);
    return {
      id: r.id,
      tool: "functions.exec_command",
      command: `sed -n '${r.first},${r.last}p' ${r.file}`,
      cwd: workspace,
      reportedExitCode: 0,
      observedToolChunkId: r.chunk,
      stderr: { separatelyCaptured: false, actualSeparateStream: null, note: "No separate stderr stream retained by original exec tool; not asserted empty." },
      observedOutputReference: {
        chatToolChunkId: r.chunk,
        reconstructionPath: projectionPath,
        reconstructionSha256: sha(fs.readFileSync(projectionPath)),
        kind: "TEXT READ STREAM PROJECTION, NOT CONTEMPORANEOUS TEE",
        provenance: "Reconstructed from the instruction file and original sed line range at freeze time.",
        equalityToOriginalContemporaneousBytes: "UNKNOWN; original instruction bytes were not hashed before those reads.",
      },
    };
  });

  const metadataCommands = sources.map((s, i) => {
    const relative = `.intentfold/tickets/STEMROBIN-184/tmp/production-source10c168-171/10c/pages/${s.page}/page.png`;
    const existsCode = i === 0 ? 'reviewRootExists:fs.existsSync(path.resolve(".intentfold/tickets/STEMROBIN-184/tmp/production-source10c168-171-review")),' : "";
    const command = `node -e 'const fs=require("node:fs"),c=require("node:crypto"),path=require("node:path");const p=path.resolve("${relative}"),b=fs.readFileSync(p);if(b.subarray(0,8).toString("hex")!=="89504e470d0a1a0a"||b.subarray(12,16).toString()!=="IHDR")throw Error("not PNG IHDR");console.log(JSON.stringify({${existsCode}path:p,bytes:b.length,pngWidth:b.readUInt32BE(16),pngHeight:b.readUInt32BE(20),sha256:c.createHash("sha256").update(b).digest("hex")},null,2));'`;
    const observed = { ...(i === 0 ? { reviewRootExists: false } : {}), path: s.path, bytes: s.bytes, pngWidth: s.width, pngHeight: s.height, sha256: s.sha256 };
    return {
      id: `C${String(7 + i).padStart(2, "0")}`,
      tool: "functions.exec_command",
      command,
      cwd: workspace,
      reportedExitCode: 0,
      observedToolChunkId: s.chunk,
      observedToolOutput: `${JSON.stringify(observed, null, 2)}\n`,
      outputProvenance: "Exact metadata text reconstructed from the returned tool result, not a contemporaneous tee.",
      stderr: { separatelyCaptured: false, actualSeparateStream: null, note: "No separate stderr stream retained by original exec tool; not asserted empty." },
      followedBeforeAnyNextImageBy: { tool: "functions.view_image", arguments: { path: s.path, detail: "original" } },
    };
  });

  json("actual-commandrecords.json", {
    scope: "Own-root StageA evidence only; no production command",
    initialInstructionReads: textCommands,
    originalPreloads: metadataCommands,
    capturedProjectionCommand: {
      command: [process.execPath, fileURLToPath(import.meta.url), "--project-read-streams"],
      cwd: workspace,
      stdout: projection.stdout,
      stderr: projection.stderr,
      exitCode: projection.status,
      signal: projection.signal,
      capture: "Actual contemporaneous separated child-process streams and returned exit.",
    },
    enclosingFreezeInvocation: {
      command: `node ${relativeRoot}/freeze-evidence.mjs`,
      outputAndExitLocation: "The immediately enclosing functions.exec_command response in this chat.",
      exitCodeInThisPreExitArtifact: null,
      note: "Not predicted before return. Final binding output and reported exit must be read from the actual tool result.",
    },
    toolWriteEvents: [
      { after: "view 0168", tool: "functions.apply_patch", action: "Added 0168.inventory.md", reportedExitCode: 0, observedOutput: "Success. Updated the following files:\nA /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c168-171-review/0168.inventory.md" },
      { after: "view 0169", tool: "functions.apply_patch", action: "Added 0169.inventory.md", reportedExitCode: 0, observedOutput: "Success. Updated the following files:\nA /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c168-171-review/0169.inventory.md" },
      { after: "view 0170", tool: "functions.apply_patch", action: "Added 0170.inventory.md", reportedExitCode: 0, observedOutput: "Success. Updated the following files:\nA /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c168-171-review/0170.inventory.md" },
      { after: "view 0171", tool: "functions.apply_patch", action: "Added 0171.inventory.md", reportedExitCode: 0, observedOutput: "Success. Updated the following files:\nA /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c168-171-review/0171.inventory.md" },
    ],
  });

  json("ledger.json", {
    stage: "A",
    status: "FROZEN_STAGEA_TEXT_PATH_HASH_ONLY_WAIT",
    ownerRoot: root,
    parentImageLifetimeAsSuppliedByUser: { used: 24, limit: 24, noParentImagePayloads: true },
    freshSessionImageLifetime: { start: 0, end: 4, limit: 24, resets: 0 },
    batches: [{ id: "NEW10c168-171", start: 0, end: 4, limit: 8 }],
    events: sources.map((s, i) => ({
      ordinal: i + 1,
      preloadToolChunkId: s.chunk,
      preloadMetadataBeforeView: true,
      preloadPath: s.path,
      preloadBytes: s.bytes,
      preloadDimensions: [s.width, s.height],
      preloadSha256: s.sha256,
      viewTool: "functions.view_image",
      viewArguments: { path: s.path, detail: "original" },
      lifetimeBefore: i,
      lifetimeAfter: i + 1,
      batchBefore: i,
      batchAfter: i + 1,
      imageLoaded: true,
      originalOnly: true,
      inventoryPath: path.join(root, `${s.page}.inventory.md`),
    })),
    ownershipEstablished: { firstPreloadReportedReviewRootExists: false, writesRestrictedTo: root },
    genuineBoundaryObservations: [
      { physical: 168, printed: 162, row: "r01", kind: "topic", title: "114*. 自然对数作为具有可变积分上限的积分", startObserved: true },
      { physical: 171, printed: 165, beforeRow: "r20", topic: "114*", endObservedAtNewSection: true },
      { physical: 171, printed: 165, row: "r20", kind: "section", title: "§ 23. 幂函数" },
      { physical: 171, printed: 165, row: "r21", kind: "topic", title: "115. 幂函数和它的导函数", rightBoundary: "OPEN_NOT_OBSERVED", finalSentenceTail: "可以确" },
    ],
    sourceSentenceContinuation: { from: "0170 r21 ends 函数", to: "0171 r01 begins 值的集合", observed: true },
    prohibitedMaterialReadsPerformed: false,
    prohibitedProductionActionsPerformed: false,
    stageB: {
      started: false,
      authorArtifactReads: 0,
      authorHashDisclosureReceived: false,
      requiredBeforeStart: ["Parent fully consumes this exact frozen StageA", "Explicit authorization with exact author artifact hash disclosure"],
    },
    nextAction: "WAIT; return only text, paths, hashes. Do not reopen originals or reset lifetime.",
  });

  const inputBindings = sources.map((s) => {
    const b = fs.readFileSync(s.path);
    const actual = { bytes: b.length, width: b.readUInt32BE(16), height: b.readUInt32BE(20), sha256: sha(b) };
    if (actual.bytes !== s.bytes || actual.width !== s.width || actual.height !== s.height || actual.sha256 !== s.sha256) throw new Error(`Original bytes changed after view: ${s.page}; stop without repair`);
    const inventoryPath = path.join(root, `${s.page}.inventory.md`);
    return {
      physical: s.physical,
      printed: s.printed,
      sourcePath: s.path,
      preloadAndFreezeMetadata: actual,
      originalViewCount: 1,
      sourceImageCopied: false,
      inventoryPath,
      inventorySha256: sha(fs.readFileSync(inventoryPath)),
      stage: "Independent source-only A",
    };
  });
  const outputNames = [
    "0168.inventory.md", "0169.inventory.md", "0170.inventory.md", "0171.inventory.md",
    "report.md", "ledger.json", "actual-commandrecords.json", "freeze-evidence.mjs",
    ...textReads.map((r) => `read-projections/${r.id}.stdout.projection.txt`),
  ];
  const outputs = outputNames.map((name) => {
    const absolute = path.join(root, name);
    const bytes = fs.readFileSync(absolute);
    return { path: absolute, bytes: bytes.length, sha256: sha(bytes), media: "text only" };
  });
  json("input-outputbindings.json", {
    stage: "A",
    frozenState: "TEXT_PATH_HASH_ONLY_WAIT",
    inputBindings,
    outputs,
    selfHash: "Supplied by the returned freeze-command stdout; omitted here to avoid a self-referential hash.",
    completeClaim: "All four original-source inventories frozen; no author-validation or production PASS claim.",
  });
  const bindingPath = path.join(root, "input-outputbindings.json");
  console.log(JSON.stringify({
    status: "FROZEN_STAGEA_TEXT_PATH_HASH_ONLY_WAIT",
    ownerRoot: root,
    bindingPath,
    bindingSha256: sha(fs.readFileSync(bindingPath)),
    reportPath: path.join(root, "report.md"),
    reportSha256: sha(fs.readFileSync(path.join(root, "report.md"))),
    imageBudget: { batch: "4/8", lifetime: "4/24", resets: 0 },
    sourceSha256UnchangedSincePreload: true,
    nextAction: "WAIT FOR FULL PARENT CONSUMPTION AND EXPLICIT EXACT AUTHOR HASH DISCLOSURE",
  }, null, 2));
}
