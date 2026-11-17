import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { isDeepStrictEqual } from "node:util";

const cwd = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const tmp = path.join(cwd, ".intentfold/tickets/STEMROBIN-181/tmp");
const author = path.join(tmp, "d035-n130-prose-author");
const owned = path.join(tmp, "d035-n130-science-evidence");
const expectedFreeze = "d21ce3a33e9afa8d9b52dca043eacd58aefeab8ff3e80b706a1a63b33d26df10";
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const abs = (file) => path.resolve(cwd, file);
const checks = [];
const bindings = [];
function check(name, actual, expected) {
  checks.push({ name, pass: isDeepStrictEqual(actual, expected), actual, expected });
}
function binding(label, declaration) {
  const file = abs(declaration.path);
  if (!fs.existsSync(file)) {
    bindings.push({ label, path: file, expected_sha256: declaration.sha256, match: false, missing: true });
    return;
  }
  const bytes = fs.readFileSync(file);
  const actual = hash(bytes);
  bindings.push({
    label, path: file, expected_sha256: declaration.sha256,
    sha256: actual, bytes: bytes.length, match: actual === declaration.sha256,
  });
}
function collect(value, label) {
  if (!value || typeof value !== "object") return;
  if (typeof value.path === "string" && typeof value.sha256 === "string") binding(label, value);
  for (const [key, item] of Object.entries(value)) {
    if (item && typeof item === "object") collect(item, `${label}/${key}`);
  }
}
const freezePath = path.join(author, "prose-freeze.json");
binding("freeze", { path: freezePath, sha256: expectedFreeze });
const freeze = read(freezePath);
collect(freeze, "freeze");
const preparation = read(abs(freeze.preparation.path));
collect(preparation, "preparation");
const source = read(abs(freeze.source.path));
const zh = read(abs(freeze.frozenFiles.lessonTemplate.path));
const en = read(abs(freeze.frozenFiles.englishLesson.path));
const exercises = read(abs(freeze.exercisesSource.path));
const exercisesTemplate = read(abs(freeze.frozenFiles.exercisesTemplate.path));
const figuresTemplate = read(abs(freeze.frozenFiles.figuresTemplate.path));
const texts = read(abs(freeze.texts.path));
const normalization = read(abs(freeze.nativeNormalize.path));
const normalized = JSON.parse(normalization.stdout).documents;
const textCheck = read(abs(freeze.nativeTextCheck.path));
const preNativeFailure = read(path.join(author, "pre-native-schema-failure.json"));
collect(preNativeFailure, "pre-native-failure");
const identity = [
  "id", "card_id", "chapter", "section", "number", "title",
  "printed_title", "start_page", "start_printed", "exercise_count",
];
check("freeze card", freeze.card, "phy9-c2-s6-n130");
check("source objects", source.prose.length, 7);
check("ZH objects", zh.prose.length, 7);
check("EN objects", en.prose.length, 7);
check("source figures", source.figures, []);
check("source tasks", exercises, { lesson: freeze.card, count: 0, exercises: [] });
check("modern tasks", exercisesTemplate.exercises, []);
check("modern figures", figuresTemplate.figures, []);
check("exercises .source snapshot", exercisesTemplate.source.data, exercises);
check("exercises .source path", exercisesTemplate.source.path, `lessons/${freeze.card}/exercises.json`);
check("exercises .source sha", exercisesTemplate.source.sha256, freeze.exercisesSource.sha256);
check("EN translated title", en.translated_title, "Inductance");
check("freeze/preparation closure", freeze.closure, preparation.closure);
check("normalization exit", normalization.exitCode, 0);
check("native text-check exit", textCheck.exitCode, 0);
check("native text-check errors", JSON.parse(textCheck.stdout).errors, []);

const math = (text) => Array.from(text.matchAll(/\$([^$]+)\$/g), (match) => match[1]);
// Localize only descriptive text literals, retaining any numbers inside them.
const signature = (text) => math(text).map((expression) =>
  expression.replace(/\\text\{([^{}]*)\}/g, (_, literal) =>
    `\\text{${(literal.match(/\d+(?:\.\d+)?/g) || []).join("|")}}`));
const equationRefs = (text) => Array.from(text.matchAll(/\(12-\d+\)/g), (match) => match[0]);
const plainNumbers = (text) => text.replace(/\$[^$]+\$/g, "").match(/\d+(?:\.\d+)?/g) || [];
const objects = [];
for (const [language, doc] of [["zh", zh], ["en", en]]) {
  for (const field of identity) check(`${language} identity ${field}`, doc[field], source[field]);
  check(`${language} .source path`, doc.source.path, `lessons/${freeze.card}/lesson.json`);
  check(`${language} .source sha`, doc.source.sha256, freeze.source.sha256);
  check(`${language} .source snapshot`, doc.source.data, source);
  check(`${language} errata`, doc.errata, []);
  const normalDoc = normalized.find((item) => item.language === language);
  const frozenWithoutAnchors = { ...doc, section_breaks: [] };
  check(`${language} normalized full document except subsequently derived anchors`, normalDoc, frozenWithoutAnchors);
  const annotation = doc.prose.filter((item) => item.label === "footnote");
  const callers = doc.prose.filter((item) => item.label !== "footnote" && item.text.includes("\u2460"));
  check(`${language} unique footnote objects`, annotation.length, 1);
  check(`${language} unique footnote caller`, callers.length, 1);
  check(`${language} footnote source`, annotation[0].source_refs, ["p0319#7"]);
  check(`${language} footnote owner`, callers[0].source_refs, ["p0319#5"]);
  for (let index = 0; index < source.prose.length; index++) {
    const raw = source.prose[index];
    const item = doc.prose[index];
    for (const field of ["kind", "id", "label", "printed_page", "source_refs"]) {
      check(`${language} object ${index} ${field}`, item[field], raw[field]);
    }
    check(`${language} object ${index} source_text`, item.source_text, raw.text);
    check(`${language} object ${index} math shape`, signature(item.text), signature(raw.text));
    check(`${language} object ${index} equation references`, equationRefs(item.text), equationRefs(raw.text));
    check(`${language} object ${index} plain numbers`, plainNumbers(item.text), plainNumbers(raw.text));
    check(`${language} object ${index} numeric changes`, item.numeric_changes, []);
    check(`${language} object ${index} historical entities`, item.historical_entities, []);
    if (language === "zh") check(`ZH object ${index} raw math exact`, math(item.text), math(raw.text));
    if (language === "zh") {
      objects.push({
        index, kind: raw.kind, label: raw.label, source_refs: raw.source_refs,
        source: raw.text, authoredZH: item.text, authoredEN: en.prose[index].text,
        source_math: math(raw.text), zh_math: math(item.text), en_math: math(en.prose[index].text),
        source_shape_signature: signature(raw.text),
        equation_references: equationRefs(raw.text),
      });
    }
  }
}
check("source math token count", objects.reduce((sum, item) => sum + item.source_math.length, 0), 12);

const flows = [];
for (const flow of freeze.flows) {
  const doc = flow.language === "zh" ? zh : en;
  const receipt = read(abs(flow.receipt.path));
  const result = JSON.parse(receipt.stdout);
  check(`${flow.language} flow receipt exit`, receipt.exitCode, 0);
  check(`${flow.language} flow input exact frozen path`, abs(receipt.command.at(-1)),
    abs(flow.language === "zh" ? freeze.frozenFiles.lessonTemplate.path : freeze.frozenFiles.englishLesson.path));
  check(`${flow.language} freeze report matches receipt`, result, flow.report);
  const grouped = doc.prose.map((_, blockIndex) =>
    result.paragraphs.filter((item) => item.blockIndex === blockIndex).map((item) => item.text).join("\n\n"));
  check(`${flow.language} complete flow paragraphs reproduce frozen objects`, grouped, doc.prose.map((item) => item.text));
  check(`${flow.language} derived anchors equal native boundary objects`,
    doc.section_breaks, result.boundaries.map(({ before, after }) => ({ before, after })));
  for (const boundary of result.boundaries) {
    check(`${flow.language} boundary ${boundary.index} previous paragraph`,
      boundary.before, result.paragraphs[boundary.index - 1].text);
    check(`${flow.language} boundary ${boundary.index} next paragraph`,
      boundary.after, result.paragraphs[boundary.index].text);
  }
  flows.push({
    language: flow.language, receipt: flow.receipt, paragraphs: result.paragraphs.length,
    resolvedBreaks: result.resolvedBreaks, anchors: doc.section_breaks, exact: true,
  });
}

const page318 = read(path.join(author, "root/9p/pages/0318/page.json"));
const page319 = read(path.join(author, "root/9p/pages/0319/page.json"));
const page320Path = path.join(author, "root/9p/pages/0320/page.json");
const page320 = read(page320Path);
const boundaryReceiptPath = path.join(author, "commands/derive-boundary320.json");
const boundaryReceipt = read(boundaryReceiptPath);
check("actual heading 130", page318.blocks[6].lines, [source.printed_title]);
check("actual 318 incoming object open", page318.blocks[7].open, true);
check("actual 319 continuation", page319.blocks[0].cont, true);
check("actual 319 continuation closes", page319.blocks[0].open, false);
check("actual last ordinary source paragraph closes", page319.blocks[5].open, false);
check("actual own footnote label", page319.blocks[6].label, "footnote");
check("actual boundary only page 320", page320.blocks.length, 1);
check("actual next heading kind", page320.blocks[0].kind, "h3");
check("actual next heading", page320.blocks[0].lines, [freeze.closure.rightBoundaryHeading]);
check("boundary derivation receipt content", JSON.parse(boundaryReceipt.stdout), page320);
for (const [label, file] of [
  ["local-page318", path.join(author, "root/9p/pages/0318/page.json")],
  ["local-page319", path.join(author, "root/9p/pages/0319/page.json")],
  ["local-page320", page320Path],
  ["boundary-derivation", boundaryReceiptPath],
  ["pre-native-failure-receipt", path.join(author, "pre-native-schema-failure.json")],
  ["reviewer-verifier", path.join(owned, "verify-inputs.mjs")],
]) binding(label, { path: file, sha256: hash(fs.readFileSync(file)) });

const output = {
  schema: "s10y-independent-science-bilingual-input-bindings@1",
  date: "2026-11-17", cwd, card: freeze.card, freeze: { path: freezePath, sha256: expectedFreeze },
  method: "Read-only exact SHA/snapshot/math-shape/receipt/anchor checks. No native, SOURCE, layout, render, test or build command is executed.",
  bindings,
  all_bindings_exact: bindings.every((item) => item.match),
  binding_count: bindings.length,
  checks,
  all_checks_pass: checks.every((item) => item.pass),
  check_count: checks.length,
  objects,
  flows,
  closure: freeze.closure,
  native_receipts_consumed: {
    normalize_exit: normalization.exitCode,
    text_check: JSON.parse(textCheck.stdout),
    flow_exits: freeze.flows.map((flow) => read(abs(flow.receipt.path)).exitCode),
    original_assembly_diagnostics: preparation.assemblyDiagnostics,
    original_pre_native_failure: preNativeFailure,
  },
  author_text_payload_is_pre_normalization: true,
  source_gate_replayed: false, image_opens: 0, browser_opens: 0,
};
const outputPath = path.join(owned, "input-bindings.json");
if (fs.existsSync(outputPath)) throw new Error("Refusing to overwrite existing reviewer evidence");
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({
  path: outputPath, sha256: hash(fs.readFileSync(outputPath)),
  binding_count: output.binding_count, all_bindings_exact: output.all_bindings_exact,
  check_count: output.check_count, all_checks_pass: output.all_checks_pass,
  binding_failures: bindings.filter((item) => !item.match),
  check_failures: checks.filter((item) => !item.pass),
  flows: flows.map(({ language, paragraphs, resolvedBreaks }) => ({ language, paragraphs, resolvedBreaks })),
  source_math_tokens: objects.reduce((sum, item) => sum + item.source_math.length, 0),
}, null, 2));
if (!output.all_bindings_exact || !output.all_checks_pass) process.exitCode = 1;
