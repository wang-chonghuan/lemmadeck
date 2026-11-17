import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const owned = path.dirname(fileURLToPath(import.meta.url));
const card = "phy9-c2-s7-n133";
const edition = "modern-us-neutral";
const hash = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");
const load = (file) => JSON.parse(readFileSync(file, "utf8"));
const bind = (file) => ({ path: file, sha256: hash(file) });
const out = (relative) => path.join(owned, relative);

function save(relative, value) {
  const file = out(relative);
  assert.ok(file.startsWith(`${owned}/`));
  assert.ok(!existsSync(file), `Frozen output already exists: ${file}`);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`);
  return bind(file);
}

function snapshot(file, relative) {
  const target = out(relative);
  assert.ok(!existsSync(target));
  mkdirSync(path.dirname(target), { recursive: true });
  copyFileSync(file, target);
  assert.equal(hash(file), hash(target));
  return { ...bind(target), originalPath: file };
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
}

if (process.argv[2] === "verify") {
  const freeze = load(out("author-freeze.json"));
  for (const file of freeze.artifacts) assert.equal(hash(file.path), file.sha256, file.path);
  for (const file of freeze.originalInputs) assert.equal(hash(file.path), file.sha256, file.path);
  assert.equal(freeze.closedCards.length, 1);
  assert.equal(freeze.closedCards[0], card);
  console.log(`Verified ${freeze.artifacts.length} frozen artifacts and ${freeze.originalInputs.length} unchanged inputs.`);
  process.exit(0);
}

assert.equal(process.argv[2], "create");
assert.ok(!existsSync(out("author-freeze.json")));
const inputs = load(out("inputs/input-freeze.json"));
const originalInputs = [...inputs.inputs, ...inputs.pageCopies, ...inputs.figureCopies].map((item) => {
  assert.equal(hash(item.path), item.sha256);
  assert.equal(hash(item.originalPath), item.sha256);
  return { path: item.originalPath, sha256: item.sha256 };
});
const toc = load(out("inputs/9p.zh.toc.json"));
function findIds(value, id) {
  if (!value || typeof value !== "object") return [];
  return [
    ...(value.id === id ? [value] : []),
    ...Object.values(value).flatMap((child) => findIds(child, id)),
  ];
}
const targets = findIds(toc, card);
const next = findIds(toc, "phy9-c2-s7-n134");
assert.equal(targets.length, 1);
assert.equal(next.length, 1);
assert.equal(targets[0].title, "铁的磁导率的测定");
assert.equal(targets[0].printedNumber, 133);
assert.equal(targets[0].page, 318);
assert.equal(next[0].printedNumber, 134);
const page = load(out("root/9p/pages/0327/page.json"));
assert.equal(page.blocks[1].lines.join(""), "133. 铁的磁导率的测定");
assert.equal(page.blocks[7].lines.join(""), "134. 铁磁质的基本性质");
assert.equal(page.blocks[8].open, true);
assert.deepEqual(page.meta.errata, []);

const rawDirectory = out(`root/9p/lessons/${card}`);
const raw = load(path.join(rawDirectory, "lesson.json"));
assert.equal(raw.id, card);
assert.equal(raw.exercise_count, 0);
assert.deepEqual(raw.prose.map((block) => block.source_refs), [
  ["p0327#3"], ["p0327#4", "p0327#7"], ["p0327#5"], ["p0327#6"],
]);
assert.deepEqual(raw.figures.map((figure) => figure.id), ["fig-300"]);
const rawThreeFiles = ["lesson.json", "lesson.md", "exercises.json"].map((name) =>
  snapshot(path.join(rawDirectory, name), `frozen/raw/${name}`));
const frozen = [];
const formulaTokens = (text) => text.match(/\$[^$]*\$/g) ?? [];
const numberTokens = (text) => (text.replace(/\$[^$]*\$/g, "").match(/\d+(?:\.\d+)?/g) ?? []);

for (const language of ["zh", "en"]) {
  const root = language === "zh" ? "root" : "root-en";
  const work = language === "zh" ? "work" : "work-en";
  const templateDirectory = out(`${work}/adapt/9p/${edition}/lessons/${card}`);
  const lesson = load(path.join(templateDirectory, "lesson.template.json"));
  const exercises = load(path.join(templateDirectory, "exercises.template.json"));
  const figures = load(path.join(templateDirectory, "figures.template.json"));
  assert.equal(lesson.language, language);
  assert.equal(lesson.status, "draft");
  assert.deepEqual(lesson.source.data, raw);
  assert.equal(lesson.source.sha256, hash(path.join(rawDirectory, "lesson.json")));
  assert.equal(lesson.prose.length, raw.prose.length);
  assert.deepEqual(lesson.errata, []);
  assert.deepEqual(exercises.exercises, []);
  assert.deepEqual(figures.figures.map((figure) => figure.id), ["fig-300"]);
  for (let index = 0; index < raw.prose.length; index++) {
    const source = raw.prose[index];
    const modern = lesson.prose[index];
    assert.equal(modern.source_text, source.text);
    assert.deepEqual(modern.source_refs, source.source_refs);
    assert.deepEqual(formulaTokens(modern.text), formulaTokens(source.text));
    assert.deepEqual(numberTokens(modern.text), numberTokens(source.text));
    assert.deepEqual(modern.numeric_changes, []);
  }
  for (const name of ["lesson.json", "lesson.md", "exercises.json"]) {
    assert.equal(hash(out(`${root}/9p/lessons/${card}/${name}`)), hash(path.join(rawDirectory, name)));
  }
  for (const name of ["page.json", "page.md", "audit.json"]) {
    assert.equal(hash(out(`${root}/9p/pages/0327/${name}`)),
      inputs.pageCopies.find((item) => item.path.endsWith(`/${name}`)).sha256);
  }
  const auditPath = out(`${root}/9p/editions/${edition}/lessons/${card}/adaptation.audit.json`);
  const audit = load(auditPath);
  assert.equal(audit.status, "fail");
  assert.equal(audit.errors.length, 1);
  assert.match(audit.errors[0], /^缺少(?:现代 SVG| SVG spec): /);
  assert.ok(!existsSync(out(`${root}/9p/editions/${edition}/lessons/${card}/lesson.json`)));
  assert.ok(!existsSync(out(`${root}/9p/editions/${edition}/book.json`)));
  const templates = ["lesson.template.json", "exercises.template.json", "figures.template.json"]
    .map((name) => snapshot(path.join(templateDirectory, name), `frozen/${language}/${name}`));
  const flow = load(out(`prose-flow-${language}.json`));
  const prose = save(`frozen/${language}/prose.json`, {
    card, language, status: "author-frozen-SCI-pending",
    sourceLesson: bind(path.join(rawDirectory, "lesson.json")),
    prose: lesson.prose.filter((block) => block.kind === "p"),
    paragraphs: flow.paragraphs, section_breaks: lesson.section_breaks,
  });
  const title = language === "zh" ? "铁的磁导率的测定" : "Measuring the Permeability of Iron";
  const markdown = save(`frozen/${language}/prose.md`,
    `# 133. ${title}\n\n${lesson.prose.filter((block) => block.kind === "p")
      .map((block) => block.text).join("\n\n")}\n`);
  frozen.push({ language, templates, prose, markdown, paragraphCount: flow.paragraphs.length,
    nativeAdaptationAudit: bind(auditPath), pendingFigureFailure: audit.errors[0] });
}

const result = {
  schema: "ld-s10y-lesson/bounded-text-author-result@1",
  ticket: "STEMROBIN-181", card,
  status: "AUTHOR-TEXT-FROZEN-MODERN-FIGURE300-AND-SCI-PENDING",
  rawAssembly: { receipt: bind(out("assemble.json")), exitCode: 0, rawThreeFiles },
  textContract: {
    status: "pass-for-text-contract-only",
    evidence: ["finalize-zh-text-repair.json", "finalize-en.json"].map((name) => bind(out(name))),
    formulaAndNumericTokensUnchanged: true, sourceSnapshotsUnchanged: true,
    exercises: 0, choices: 0, answersAuthored: 0, errata: 0,
    effectivePermeabilityScopedToSameCurrentAndGeometry: true,
    fluxChangeComparedThroughTotalChargeAndCalibratedShortPulseDeflection: true,
    universalInstantaneousVoltageRatioClaimExcluded: true,
    initialAuthorFailurePreserved: bind(out("initial/adaptation-zh.audit.json")),
    authorRepair: "Restored the omitted second source mu token in the introduction; no source edit or erratum.",
  },
  closedCards: [card],
  boundary: {
    physicalPage: 327, printedPage: 318,
    startsAt: "p0327#2", closesBefore: "p0327#8",
    excludedIncomingText: "p0327#1",
    nextCard: "phy9-c2-s7-n134", nextOpening: "p0327#9",
    nextCardComplete: false,
    scratchAssemblyIncludesBoundaryFragmentsWithoutClosureApproval: true,
  },
  sourceEvidence: {
    sourceReview: bind(out("inputs/source-review.json")),
    sourceText327: "PASS reused; historical whole-batch FAIL retained",
    nativeCount327: "18/18 reused; no recount or page finalize",
    rawCropReview: bind(out("inputs/crop-review.json")),
    rawCrop300: "Independent PASS reused",
    sourceSvgFidelity: "Human-supplied existing 4/4 mechanical PASS reused; not rerun",
  },
  frozen,
  pending: {
    modernFigure300: "Delegated next; no figure assets or FigureSpec authored here",
    adaptationReady: false,
    render: "Not run: finalized modern edition unavailable; no source fallback",
    SCI: "Independent review follows; no SCI approval claimed",
    promotion: "Parent-owned; no canonical promotion performed",
  },
  ownership: {
    onlyOwnedPath: owned, imageOpens: 0, decodedImages: 0,
    canonicalWrites: 0, databaseOperations: 0, gitOperations: 0,
    appOperations: 0, skillEdits: 0, browserOperations: 0,
    agentsCreated: 0, supervisorMessages: 0, othersPreserved: true,
  },
};
save("result.json", result);
const artifacts = walk(owned).sort().map(bind);
save("author-freeze.json", {
  schema: "ld-s10y-lesson/bounded-prose-author-freeze@1",
  ticket: "STEMROBIN-181", card, frozenAt: new Date().toISOString(),
  status: result.status, closedCards: [card], rawThreeFiles, frozen,
  originalInputs, result: bind(out("result.json")), artifacts,
});
console.log(`Author freeze created: ${artifacts.length} artifacts; only ${card} closed; modern figure and SCI pending.`);
