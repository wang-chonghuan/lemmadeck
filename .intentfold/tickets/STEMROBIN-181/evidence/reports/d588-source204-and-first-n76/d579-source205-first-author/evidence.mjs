import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const root = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d579-source205-first-author");
const prepared = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d576-source205-first-preparation");
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const write = (relative, data) => {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file)) throw new Error(`Refusing overwrite: ${file}`);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
};
const list = (dir) => fs.readdirSync(dir, { withFileTypes: true })
  .flatMap((entry) => entry.isDirectory() ? list(path.join(dir, entry.name)) : [path.join(dir, entry.name)])
  .sort();
const snapshot = (dirs) => dirs.flatMap((dir) => list(path.join(root, dir)))
  .map((file) => ({
    path: path.relative(root, file),
    sha256: sha(file),
    bytes: fs.statSync(file).size,
    mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, "0"),
  }));

switch (process.argv[2]) {
  case "init": {
    const manifest = path.join(prepared, "manifest.json");
    const expected = "6b585dfb6bf83d93b7b5eb8a1bfab788c45463f6d73f1ffe51b51637f4838f96";
    if (sha(manifest) !== expected) throw new Error("Preparation manifest hash mismatch");
    const data = JSON.parse(fs.readFileSync(manifest, "utf8"));
    if (data.inputs.length !== 4) throw new Error("Expected exactly four prepared inputs");
    const inputs = data.inputs.map((input) => {
      const actual = sha(path.join(repo, input.path));
      if (actual !== input.sha256) throw new Error(`Input hash mismatch: ${input.path}`);
      return { ...input, absolutePath: path.join(repo, input.path), actualSha256: actual, matched: true };
    });
    for (const branch of ["source", "work"]) {
      const from = path.join(prepared, branch, "10p/pages/0205");
      const to = path.join(root, branch, "10p/pages/0205");
      if (fs.existsSync(to)) throw new Error(`Clone destination exists: ${to}`);
      fs.mkdirSync(path.dirname(to), { recursive: true });
      if (branch === "source" && !fs.existsSync(from)) {
        fs.mkdirSync(to);
      } else {
        fs.cpSync(from, to, { recursive: true, errorOnExist: true, force: false });
      }
      for (const file of list(to)) fs.chmodSync(file, 0o444);
    }
    write("input-verification.json", {
      schema: "s10y/first-source-author-inputs@1",
      preparationManifest: manifest,
      preparationManifestSha256: sha(manifest),
      inputs,
      clonedSourceFileCount: list(path.join(root, "source/10p/pages/0205")).length,
      clonedWorkFileCount: list(path.join(root, "work/10p/pages/0205")).length,
      preparationSourceDirectoryExists: fs.existsSync(path.join(prepared, "source/10p/pages/0205")),
      sourceCloneDisposition: "Prepared source directory absent; created empty private author destination. No preparation repeated.",
      firstSetupFailure: path.join(root, "setup/init-first.status.json"),
      initialContextImageCount: 0,
      parentImageCount: 24,
      noReset: true,
      prepareInvocations: 0,
      verifiedAt: new Date().toISOString(),
    });
    console.log(JSON.stringify({ status: "INPUTS-VERIFIED-PRIVATE-CLONE", inputs: 4, root }));
    break;
  }
  case "pre-native": {
    const protectedFiles = ["author-first/page.md", "source-inventory.json", "opens.json", "input-verification.json"];
    const authorPage = path.join(root, "author-first/page.md");
    const privatePage = path.join(root, "source/10p/pages/0205/page.md");
    fs.copyFileSync(authorPage, privatePage, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(privatePage, 0o644);
    for (const relative of protectedFiles) fs.chmodSync(path.join(root, relative), 0o444);
    for (const file of list(path.join(root, "source-detail"))) fs.chmodSync(file, 0o444);
    write("pre-native-freeze.json", {
      schema: "s10y/pre-native-source-freeze@1",
      beforeNative: true,
      sourceIndependent: "pending",
      files: [...protectedFiles, ...list(path.join(root, "source-detail")).map((file) => path.relative(root, file))]
        .map((relative) => ({
          path: path.join(root, relative),
          sha256: sha(path.join(root, relative)),
          mode: (fs.statSync(path.join(root, relative)).mode & 0o777).toString(8).padStart(4, "0"),
        })),
      nativeWorkingPagePath: privatePage,
      nativeWorkingPageSha256: sha(privatePage),
      nativeWorkingPageMode: "0644",
      frozenAt: new Date().toISOString(),
    });
    fs.chmodSync(path.join(root, "pre-native-freeze.json"), 0o444);
    console.log(JSON.stringify({ status: "SOURCE-INVENTORY-AND-FIRST-AUTHOR-FROZEN-0444", privatePage }));
    break;
  }
  case "finalize": {
    const sourceFreeze = JSON.parse(fs.readFileSync(path.join(root, "pre-native-freeze.json"), "utf8"));
    for (const file of sourceFreeze.files) {
      if (sha(file.path) !== file.sha256 || (fs.statSync(file.path).mode & 0o777) !== 0o444) {
        throw new Error(`Pre-native freeze changed: ${file.path}`);
      }
    }
    const prefix = "native/finalize-first";
    write(`${prefix}.pre.json`, { capturedAt: new Date().toISOString(), files: snapshot(["source", "work"]) });
    const executable = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
    const args = [
      path.join(repo, ".claude/skills/ld-s10y-lesson/tools/p2c.py"),
      "finalize", "--book", "10p", "--page", "205",
      "--root", path.join(root, "source"), "--work", path.join(root, "work"),
    ];
    const startedAt = new Date().toISOString();
    const result = spawnSync(executable, args, {
      cwd: repo,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    });
    fs.writeFileSync(path.join(root, `${prefix}.stdout.txt`), result.stdout ?? "", { flag: "wx" });
    fs.writeFileSync(path.join(root, `${prefix}.stderr.txt`), result.stderr ?? "", { flag: "wx" });
    write(`${prefix}.post.json`, { capturedAt: new Date().toISOString(), files: snapshot(["source", "work"]) });
    const receipt = {
      executable, args, cwd: repo, startedAt, endedAt: new Date().toISOString(),
      exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
      status: result.status === 0 ? "PASS" : "FAIL",
      stdoutPath: path.join(root, `${prefix}.stdout.txt`),
      stderrPath: path.join(root, `${prefix}.stderr.txt`),
      stdoutSha256: sha(path.join(root, `${prefix}.stdout.txt`)),
      stderrSha256: sha(path.join(root, `${prefix}.stderr.txt`)),
      firstAttempt: true, invocations: 1, repaired: false,
    };
    write(`${prefix}.status.json`, receipt);
    if (result.status !== 0) write("native/first-FAIL.json", receipt);
    for (const file of list(path.join(root, "native"))) fs.chmodSync(file, 0o444);
    console.log(JSON.stringify(receipt, null, 2));
    console.log(result.stdout ?? "");
    console.error(result.stderr ?? "");
    break;
  }
  case "report": {
    const read = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
    const inventory = read("source-inventory.json");
    const opens = read("opens.json");
    const input = read("input-verification.json");
    const page = read("source/10p/pages/0205/page.json");
    const audit = read("source/10p/pages/0205/audit.json");
    const native = read("native/finalize-first.status.json");
    const hold = read("HOLD.json");
    const fileRecord = (relative) => ({
      path: path.join(root, relative), sha256: sha(path.join(root, relative)),
    });
    const pointerValue = (object, pointer) => pointer.split("/").slice(1)
      .reduce((value, key) => value[key], object);
    const rowMatches = inventory.rows.map((row) => ({
      sourceRow: row.sourceRow, nativeRef: row.nativeRef, pointer: row.pointer,
      matchesFrozenSourceAuthorText: pointerValue(page, row.pointer) === row.text,
    }));
    if (rowMatches.some((row) => !row.matchesFrozenSourceAuthorText)) {
      throw new Error("Native row text differs from frozen source author inventory; stop without overwriting evidence");
    }
    if (inventory.sourceObservedFigureCount !== 0 || audit.figures.length !== 0
      || page.blocks.some((block) => block.kind === "fig")) {
      throw new Error("Zero-figure skip disagrees with frozen inventory/native artifacts");
    }
    if (page.blocks[0].cont || !page.blocks[5].open || page.blocks.some((block) => block.kind === "h3")) {
      throw new Error("Native heading or boundary differs from frozen author observation");
    }
    const unchangedInputs = input.inputs.map((entry) => {
      const relative = `work/10p/pages/0205/${path.basename(entry.path)}`;
      if (sha(path.join(root, relative)) !== entry.sha256 || sha(entry.absolutePath) !== entry.sha256) {
        throw new Error(`Prepared input changed: ${entry.path}`);
      }
      return { ...fileRecord(relative), expectedSha256: entry.sha256, unchanged: true };
    });
    const unchangedSourceFreeze = read("pre-native-freeze.json").files.map((entry) => {
      const same = sha(entry.path) === entry.sha256 && (fs.statSync(entry.path).mode & 0o777) === 0o444;
      if (!same) throw new Error(`Protected source author freeze changed: ${entry.path}`);
      return { path: entry.path, sha256: entry.sha256, unchanged: true, mode: "0444" };
    });
    const skipSnapshot = { files: snapshot(["source", "work"]) };
    write("native/vectorize-zero-figure-skip.json", {
      status: "SKIPPED-NO-SOURCE-FIGURES",
      sourceObservedFigures: 0, nativeFigures: 0, invocations: 0,
      nativeFigurePass: false,
      firstRawFigureCropsInspected: 0, originalSvgPreviews: 0,
      before: skipSnapshot, after: skipSnapshot,
      stdout: null, stderr: null, exitCode: null,
      reason: "No SOURCE205 physical figures. Prose reference 图 179 does not create a figure on this page.",
    });
    write("native/post-finalize-author-consistency.json", {
      status: "MATCHES-FROZEN-AUTHOR-OBSERVATIONS",
      notIndependentSourceReview: true, nativeCountsAreSourceTruth: false,
      rowMatches, sourceFreeze: unchangedSourceFreeze, inputs: unchangedInputs,
      nativeBlockRefsAreOneBased: true, nativeJsonPointersAreZeroBased: true,
    });
    const ready = {
      schema: "s10y/author-ready@1",
      author: "d579", sourcePage: 205,
      status: "READY-FOR-INDEPENDENT-REVIEW-ONLY",
      terminalStatus: hold.status,
      sourceIndependent: "pending", fullCard: false, n77Complete: false,
      reportPath: path.join(root, "report.json"),
      authorFreezePath: path.join(root, "author-freeze.json"),
      marker: fileRecord("READY"), hold: fileRecord("HOLD.json"),
    };
    write("READY.json", ready);
    const report = {
      schema: "s10y/first-source-author-report@1",
      ticket: "STEMROBIN-181", author: "d579", role: "fresh-one-off-first-SOURCE205-author",
      book: "10p", sourcePage: 205, printedPage: 195,
      status: "AUTHOR-READY-INDEPENDENT-PENDING",
      terminalStatus: "HOLD-INDEPENDENT-BOUNDARY-PENDING",
      ownershipRoot: root,
      sharedCheckout: repo,
      originalBranch: "User-supplied originalbranch; no Git command/read was run to independently identify a branch.",
      notAlone: true,
      permanentWorker: false, replacesWorkersAD: false,
      preparation: {
        manifestPath: input.preparationManifest,
        manifestSha256: input.preparationManifestSha256,
        reusedFirstPreparation: true,
        verifiedInputs: input.inputs,
        privateInputsAfterNative: unchangedInputs,
        preparationSourceDirectoryExists: input.preparationSourceDirectoryExists,
        sourceCloneDisposition: input.sourceCloneDisposition,
        clonedSourceFiles: input.clonedSourceFileCount,
        clonedWorkFiles: input.clonedWorkFileCount,
        prepareInvocations: 0,
        privateSourceRoot: path.join(root, "source"),
        privateWorkRoot: path.join(root, "work"),
      },
      sourceInventory: fileRecord("source-inventory.json"),
      sourceInventoryFrozenBeforeNative: true,
      firstAuthorPage: fileRecord("author-first/page.md"),
      preNativeFreeze: fileRecord("pre-native-freeze.json"),
      sourceIndependent: "pending",
      currentSourceIndependentPending: true,
      independentReviewSigned: false,
      nativeMechanicalChecksDoNotSignSource: true,
      sourceUnreadable: false,
      heading: inventory.heading,
      boundaries: inventory.boundaries,
      n77Complete: false, n77ObservationOnly: true, n77Independent: "pending",
      fullCard: false, completeCardsAdded: 0, sourcePagesAdded: 0, privatePagesAuthored: 1,
      sourceObservedRows: 22,
      sourceObservedFigures: 0,
      sourceObservedFigureBoxes: [],
      sourceObservedProseFigureReferences: inventory.proseFigureReferences,
      nativeCountsAreSourceTruth: false,
      native: {
        finalizeInvocations: 1, vectorizeInvocations: 0, prepareInvocations: 0,
        finalizeFirstStatus: native.status, finalizeFirstExitCode: native.exitCode,
        finalizeFirst: fileRecord("native/finalize-first.status.json"),
        preSnapshot: fileRecord("native/finalize-first.pre.json"),
        postSnapshot: fileRecord("native/finalize-first.post.json"),
        stdout: fileRecord("native/finalize-first.stdout.txt"),
        stderr: fileRecord("native/finalize-first.stderr.txt"),
        pageMd: fileRecord("source/10p/pages/0205/page.md"),
        pageJson: fileRecord("source/10p/pages/0205/page.json"),
        audit: fileRecord("source/10p/pages/0205/audit.json"),
        blockCount: page.blocks.length,
        printedLineCount: audit.lines_printed, markdownLineCount: audit.lines_md,
        figureCount: audit.figures.length,
        normalizations: audit.normalizations, errors: audit.errors,
        nativeRefBase: 1, nativeJsonPointerBase: 0,
        blocks: page.blocks.map((block, index) => ({
          ref: `p0205#${index + 1}`, pointer: `/blocks/${index}`,
          kind: block.kind, cont: block.cont, open: block.open, samerow: block.samerow,
          printedRows: block.lines.length,
        })),
        consistency: fileRecord("native/post-finalize-author-consistency.json"),
        vectorizeStatus: "SKIPPED-NO-SOURCE-FIGURES",
        vectorizeSkip: fileRecord("native/vectorize-zero-figure-skip.json"),
        nativeFigurePass: false,
        rawFigureCropReviewStatus: "SKIPPED-NO-SOURCE-FIGURES",
        rawFigureCropInspections: 0,
        originalSvgPreviewInspections: 0,
        figureIndependentReview: "not-applicable-no-source205-figures",
      },
      imageBudget: {
        initialContextCount: 0, batchLimit: 8, contextLimit: 24,
        actualOpenSequence: opens.actualOpenSequence.map((entry) => ({
          ...entry, path: path.join(root, entry.path), sha256: sha(path.join(root, entry.path)),
        })),
        actualOpens: 4, actualBatchCount: 4, currentContextCount: 4,
        reopens: 0, source203ImageOpens: 0, source204ImageOpens: 0,
        parentCountBefore: 24, parentCountAfter: 24, parentNewImages: 0, noReset: true,
        imageBearingDelegations: 0, returnTextPathsAndHashesOnly: true,
        record: fileRecord("opens.json"),
      },
      failuresAndRepairs: {
        firstFAIL: fileRecord("setup/init-first.status.json"),
        firstFAILScope: "Setup clone ENOENT; source root absent in first preparation",
        firstFAILPreserved: true,
        setupCorrections: 1,
        pageIssueRepairs: 0, figureIssueRepairs: 0, specIssueRepairs: 0,
        nativeFirstFAIL: null,
        terminalHOLD: fileRecord("HOLD.json"),
        terminalHOLDPreserved: true,
        otherWorkersFAILHOLDTouched: false,
      },
      constraints: {
        ownershipOnly: true, writesOutsideOwnershipRoot: false,
        gitCommands: 0, databaseOperations: 0, deployments: 0, paidCalls: 0,
        canonicalEdits: 0, source204Edits: 0, source204SelfSigned: false,
        newWorkers: 0, newWorktrees: 0, newBranches: 0,
        modernRewrite: false, assembled: false, published: false,
        pyBytecodeWritesDisabledForNative: true,
      },
      ready: fileRecord("READY.json"),
      authorFreezePath: path.join(root, "author-freeze.json"),
      finalFileMode: "0444",
      selfHash: "External final receipt and author-freeze.json bind this report; no recursive self-hash.",
      generatedAt: new Date().toISOString(),
    };
    write("report.json", report);
    console.log(JSON.stringify({
      status: report.status, terminalStatus: report.terminalStatus,
      reportPath: path.join(root, "report.json"), reportSha256: sha(path.join(root, "report.json")),
      imageOpens: 4, finalizeInvocations: 1, vectorizeInvocations: 0,
    }, null, 2));
    break;
  }
  case "freeze": {
    for (const file of list(root)) fs.chmodSync(file, 0o444);
    write("author-freeze.json", {
      schema: "s10y/author-freeze@1",
      author: "d579", ticket: "STEMROBIN-181", sourcePage: 205,
      status: "AUTHOR-FROZEN-INDEPENDENT-PENDING",
      files: list(root).map((file) => ({
        path: file, sha256: sha(file), bytes: fs.statSync(file).size, mode: "0444",
      })),
      excludesSelf: true,
      selfHash: "external receipt only; SHA-256 cannot include its own file",
      frozenAt: new Date().toISOString(),
    });
    fs.chmodSync(path.join(root, "author-freeze.json"), 0o444);
    if (list(root).some((file) => (fs.statSync(file).mode & 0o777) !== 0o444)) {
      throw new Error("Incomplete read-only freeze");
    }
    console.log(JSON.stringify({
      root, fileCount: list(root).length, allFilesMode: "0444",
      reportPath: path.join(root, "report.json"),
      reportSha256: sha(path.join(root, "report.json")),
      authorFreezePath: path.join(root, "author-freeze.json"),
      authorFreezeSha256: sha(path.join(root, "author-freeze.json")),
      preNativeFreezePath: path.join(root, "pre-native-freeze.json"),
      preNativeFreezeSha256: sha(path.join(root, "pre-native-freeze.json")),
      readyPath: path.join(root, "READY.json"),
      readySha256: sha(path.join(root, "READY.json")),
      sourceInventorySha256: sha(path.join(root, "source-inventory.json")),
      authorPageSha256: sha(path.join(root, "author-first/page.md")),
    }, null, 2));
    break;
  }
  default:
    throw new Error("Expected init, pre-native, finalize, report, or freeze");
}
