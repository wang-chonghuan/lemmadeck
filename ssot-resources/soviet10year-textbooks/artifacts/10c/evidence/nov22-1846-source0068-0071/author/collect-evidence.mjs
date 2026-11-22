import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const R = "/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck";
const W = path.join(R, ".tmp/stemrobin-184-six/source10c5255-work");
const A = path.join(R, ".tmp/stemrobin-184-six/source10c6871-author");
if (process.cwd() !== R) throw new Error("Unexpected cwd");

const digest = (file) => {
  const bytes = fs.readFileSync(file);
  return {
    path: file,
    bytes: bytes.length,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
  };
};
const readJSON = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const faults = [];
const checkedFile = (declared) => {
  const actual = digest(declared.path);
  if (actual.sha256 !== declared.sha256 || actual.bytes !== declared.bytes) {
    faults.push({ kind: "receipt-file-drift", declared, actual });
  }
  return actual;
};
const receipt = (stage) => {
  const file = path.join(W, "receipts", stage, "execution.json");
  const data = readJSON(file);
  if (data.cwd !== R) faults.push({ kind: "receipt-cwd", stage, cwd: data.cwd });
  const files = [];
  if (data.input_page) files.push(checkedFile(data.input_page));
  for (const stream of Object.values(data.streams ?? {})) {
    files.push(checkedFile(stream));
  }
  for (const output of data.outputs ?? []) files.push(checkedFile(output));
  const counts = {};
  const methods = {};
  let records = 0;
  for (const trace of data.image_call_traces ?? []) {
    files.push(checkedFile(trace));
    const lines = fs.readFileSync(trace.path, "utf8").split("\n").filter(Boolean);
    for (const line of lines) {
      const event = JSON.parse(line);
      records++;
      counts[event.category] = (counts[event.category] ?? 0) + 1;
      const method = `${event.module}.${event.method}`;
      methods[method] = (methods[method] ?? 0) + 1;
    }
  }
  return {
    stage,
    execution: digest(file),
    cwd: data.cwd,
    argv: data.argv,
    exitCode: data.exitCode,
    startedAt: data.startedAt,
    finishedAt: data.finishedAt,
    input: data.input_page,
    streams: data.streams,
    outputs: data.outputs,
    traceFiles: data.image_call_traces,
    traceRecords: records,
    traceCategories: counts,
    traceMethods: methods,
    verifiedFiles: files,
  };
};

const inheritedPrepare = receipt("nov22-prepare-p0068-0071-01");
const expectedPrepareSHA = "cc3c000a5bda964767c4ee362667ed8e18d021b3574e5714cdae8aae53058da2";
if (inheritedPrepare.execution.sha256 !== expectedPrepareSHA) {
  faults.push({ kind: "prepare-receipt-sha", expected: expectedPrepareSHA });
}

const pages = [68, 69, 70, 71].map((physical) => {
  const name = String(physical).padStart(4, "0");
  const dir = path.join(W, "artifacts", "10c", "pages", name);
  const prepared = path.join(W, "10c", "pages", name);
  const page = readJSON(path.join(dir, "page.json"));
  const audit = readJSON(path.join(dir, "audit.json"));
  const execution = receipt(`nov22-finalize-p${name}-01`);
  const artifacts = ["page.md", "page.json", "audit.json"].map((file) =>
    digest(path.join(dir, file)),
  );
  const preparedFiles = ["page.png", "page.grid.png", "page.template.md"].map((file) =>
    digest(path.join(prepared, file)),
  );
  for (let i = 0; i < artifacts.length; i++) {
    const snapshot = execution.outputs?.[i];
    if (!snapshot || snapshot.sha256 !== artifacts[i].sha256) {
      faults.push({ kind: "native-artifact-snapshot-drift", physical, artifact: artifacts[i] });
    }
  }
  const figures = audit.figures.map((figure) => ({
    ...figure,
    file: digest(path.join(prepared, "figures", `${figure.id}.png`)),
  }));
  return {
    physical,
    printed: page.meta.printed_page,
    source: page.meta.source,
    blocks: page.blocks.length,
    printLines: audit.lines_printed,
    authorLines: audit.lines_md,
    exercises: page.blocks.filter((block) => block.kind === "ex").map((block) => ({
      number: block.label,
      lines: block.lines,
      open: block.open,
      cont: block.cont,
    })),
    conditionBlocks: page.blocks.flatMap((block, index) =>
      block.owner_exercises || block.owner_exercise
        ? [{ index, lines: block.lines, owners: block.owner_exercises ?? [block.owner_exercise] }]
        : [],
    ),
    continuationBlocks: page.blocks.flatMap((block, index) =>
      block.open || block.cont
        ? [{ index, kind: block.kind, open: block.open, cont: block.cont, lines: block.lines }]
        : [],
    ),
    figures,
    auditErrors: audit.errors,
    normalizations: audit.normalizations,
    unknownChars: audit.unknown_chars,
    katexWarnings: audit.katex_warnings,
    countExclusions: audit.count_exclusions,
    artifacts,
    preparedFiles,
    execution,
  };
});

const totalCategories = {};
for (const page of pages) {
  for (const [category, count] of Object.entries(page.execution.traceCategories)) {
    totalCategories[category] = (totalCategories[category] ?? 0) + count;
  }
}
const evidence = {
  schema: "source10c6871-author/evidence@1",
  cwd: R,
  work: W,
  authorization: "STEMROBIN-184 /184-6; offline SOURCE AUTHOR; finish=review; physical68-71",
  status: "AUTHOR_COMPLETE_NATIVE_PARTIAL_FAILURE_REVIEW_REQUIRED",
  sourceUnit: { number: 88, physical: [67, 72], completeWithinAssignment: false },
  inheritedPrepare,
  tools: [
    digest(path.join(R, ".tmp/stemrobin-184-six/source10c5255-author/receipt_runner.py")),
    digest(path.join(R, ".claude/skills/ld-s10y-lesson/tools/p2c.py")),
    digest(path.join(R, ".claude/skills/ld-s10y-lesson/.venv/bin/python")),
  ],
  pages,
  usage: {
    originalPayloads: 4,
    roiCreated: 0,
    roiPayloads: 0,
    reopens: 0,
    conservativeImageActions: 4,
    inheritedParentPayloads: 24,
    imagesReturnedToParent: 0,
    currentPrepareInvocations: 0,
    finalizeInvocations: 4,
    finalizeRetries: 0,
    nativeTraceRecords: pages.reduce((sum, page) => sum + page.execution.traceRecords, 0),
    nativeTraceCategories: totalCategories,
    manualPILCalls: 0,
    codecFees: "UNKNOWN",
    modelFees: "UNKNOWN",
    modelTokens: "UNKNOWN",
    paidCallsInvoked: 0,
    networkCallsInvoked: 0,
    browserCallsInvoked: 0,
    cuaCallsInvoked: 0,
  },
  bindingFaults: faults,
};
const output = path.join(A, "evidence.json");
fs.writeFileSync(output, `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify({
  output: digest(output),
  pages: pages.map((page) => ({
    physical: page.physical,
    printed: page.printed,
    exit: page.execution.exitCode,
    blocks: page.blocks,
    print: page.printLines,
    author: page.authorLines,
    tasks: page.exercises.map((exercise) => exercise.number),
    hashes: page.artifacts,
    receipt: page.execution.execution,
    nativePIL: page.execution.traceCategories,
    traceMethods: page.execution.traceMethods,
    figures: page.figures.map((figure) => ({ id: figure.id, box: figure.box, file: figure.file })),
  })),
  usage: evidence.usage,
  bindingFaults: faults,
}, null, 2));
if (faults.length) process.exitCode = 1;
