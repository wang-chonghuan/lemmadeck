import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const owned = path.dirname(fileURLToPath(import.meta.url));
const workspace = path.resolve(owned, "../../../../..");
const scratch = path.dirname(owned);
const native = path.join(scratch, "d037-source324-327-native");
const card = "phy9-c2-s7-n133";
const edition = "modern-us-neutral";
const python = path.join(workspace, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const tool = path.join(workspace, ".claude/skills/ld-s10y-lesson/tools/p2c.py");
const hash = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");
const load = (file) => JSON.parse(readFileSync(file, "utf8"));
const binding = (file) => ({ path: file, sha256: hash(file) });

function dump(file, value) {
  assert.ok(file.startsWith(`${owned}/`), `Unowned output: ${file}`);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function copy(source, destination) {
  assert.ok(destination.startsWith(`${owned}/`));
  assert.ok(!existsSync(destination), `Preserve existing file: ${destination}`);
  mkdirSync(path.dirname(destination), { recursive: true });
  copyFileSync(source, destination);
  assert.equal(hash(source), hash(destination));
  return { ...binding(destination), originalPath: source };
}

function command(name, args) {
  const result = spawnSync(python, [tool, ...args], {
    cwd: workspace, encoding: "utf8",
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
    maxBuffer: 8 * 1024 * 1024,
  });
  dump(path.join(owned, `${name}.json`), {
    command: [python, tool, ...args], cwd: workspace,
    exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
    error: result.error?.message ?? null,
  });
  console.log(`${name}: exit ${result.status}\n${result.stdout}${result.stderr}`);
  return result.status;
}

const common = (language) => [
  "--book", "9p",
  "--root", path.join(owned, language === "zh" ? "root" : "root-en"),
  "--work", path.join(owned, language === "zh" ? "work" : "work-en"),
];

if (process.argv[2] === "prepare") {
  const reviews = [
    ["source-review.json", "d037-source324-327-review.json",
      "6e3e19dcf5c8f67c10a6446774e492a4d3d01d7b8e3412e61ea49511e3fcf49f"],
    ["crop-review.json", "d037-source324-327-crop-review.json",
      "3095030eeb27047590a4cc78a2c6e26ee09a7bac1825e05c187fa03c0a69ef3e"],
  ];
  const inputs = reviews.map(([name, original, expected]) => {
    const file = path.join(scratch, original);
    assert.equal(hash(file), expected);
    return copy(file, path.join(owned, "inputs", name));
  });
  const sourceReview = load(inputs[0].path);
  assert.equal(sourceReview.pages.find((page) => page.page === 327).text, "pass");
  const cropReview = load(inputs[1].path);
  const figure = cropReview.figures.find((item) => item.id === "fig-300");
  assert.equal(figure.status, "PASS");
  assert.equal(figure.rawApproval, true);

  inputs.push(copy(path.join(native, "result.json"), path.join(owned, "inputs/native-result.json")));
  inputs.push(copy(path.join(native, "finalize-327.json"), path.join(owned, "inputs/finalize-327.json")));
  inputs.push(copy(
    path.join(workspace, "ssot-resources/soviet10year-textbooks/toc/9p/zh.json"),
    path.join(owned, "inputs/9p.zh.toc.json"),
  ));
  const nativePage = load(path.join(native, "root/9p/pages/0327/page.json"));
  const audit = load(path.join(native, "root/9p/pages/0327/audit.json"));
  assert.equal(audit.lines_printed, 18);
  assert.equal(audit.lines_md, 18);
  assert.deepEqual(audit.errors, []);
  assert.deepEqual(nativePage.meta.errata, []);
  const pageCopies = ["page.md", "page.json", "audit.json"].map((name) =>
    copy(path.join(native, "root/9p/pages/0327", name),
      path.join(owned, "root/9p/pages/0327", name)));
  assert.equal(hash(figure.crop.path), figure.crop.sha256);
  const figureCopies = [".png", ".svg"].map((suffix) =>
    copy(path.join(native, "work/9p/pages/0327/figures", `fig-300${suffix}`),
      path.join(owned, "work/9p/pages/0327/figures", `fig-300${suffix}`)));
  dump(path.join(owned, "inputs/input-freeze.json"), {
    card, inputs, pageCopies, figureCopies, sourceText: "PASS-page327-only",
    nativeCount: "18/18", rawCrop300: "PASS", imageOpens: 0,
    sourceSvgMechanicalFidelity: "4/4 PASS supplied by human; not repeated",
  });

  assert.equal(command("assemble", [
    "assemble", ...common("zh"), "--toc", inputs.at(-1).path,
  ]), 0);
  assert.ok(!existsSync(path.join(owned, "root-en")));
  cpSync(path.join(owned, "root"), path.join(owned, "root-en"), { recursive: true });
  for (const language of ["zh", "en"]) {
    assert.equal(command(`prepare-${language}`, [
      "adapt-prepare", ...common(language), "--edition", edition, "--lesson", card,
    ]), 0);
  }
} else if (process.argv[2] === "normalize") {
  for (const language of ["zh", "en"]) {
    const work = path.join(owned, language === "zh" ? "work" : "work-en");
    const file = path.join(work, "adapt/9p", edition, "lessons", card, "lesson.template.json");
    const result = spawnSync(python, ["-c", [
      "import json,sys",
      "from edition import normalize_lesson_layout",
      "document=json.load(sys.stdin)",
      "normalize_lesson_layout(document)",
      "json.dump(document,sys.stdout,ensure_ascii=False,indent=2)",
    ].join(";")], {
      cwd: workspace, encoding: "utf8", input: readFileSync(file, "utf8"),
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1",
        PYTHONPATH: path.dirname(tool) },
    });
    assert.equal(result.status, 0, result.stderr);
    dump(file, JSON.parse(result.stdout));
    const flowTool = path.join(path.dirname(tool), "prose_flow.mjs");
    const flow = spawnSync(process.execPath, [flowTool, "--json", file], {
      cwd: workspace, encoding: "utf8",
    });
    assert.equal(flow.status, 0, flow.stderr);
    dump(path.join(owned, `prose-flow-${language}.json`), JSON.parse(flow.stdout));
    console.log(`${language}: ${JSON.parse(flow.stdout).paragraphs.length} normalized paragraphs`);
  }
} else if (process.argv[2] === "finalize") {
  for (const language of ["zh", "en"]) {
    const receipt = path.join(owned, `finalize-${language}.json`);
    const auditPath = path.join(owned, language === "zh" ? "root" : "root-en",
      "9p/editions", edition, "lessons", card, "adaptation.audit.json");
    let name = `finalize-${language}`;
    if (existsSync(receipt)) {
      const previous = load(auditPath);
      assert.equal(language, "zh");
      if (existsSync(path.join(owned, "finalize-zh-text-repair.json"))) {
        assert.equal(previous.errors.length, 1);
        assert.match(previous.errors[0], /^缺少 SVG spec: .*fig-300\.spec\.json$/);
        console.log("zh: corrected text already validated; no missing-figure retry");
        continue;
      }
      assert.ok(previous.errors.some((error) => error.startsWith("lesson.prose[0]")));
      assert.ok(!existsSync(path.join(owned, "finalize-zh-text-repair.json")));
      copy(auditPath, path.join(owned, "initial/adaptation-zh.audit.json"));
      name = "finalize-zh-text-repair";
    }
    assert.equal(command(name, [
      "adapt-finalize", ...common(language), "--edition", edition, "--lesson", card,
    ]), 2);
    const audit = load(auditPath);
    assert.equal(audit.status, "fail");
    assert.equal(audit.errors.length, 1);
    assert.match(audit.errors[0], /^缺少(?:现代 SVG| SVG spec): /);
  }
} else {
  throw new Error("Use prepare, normalize or finalize");
}
