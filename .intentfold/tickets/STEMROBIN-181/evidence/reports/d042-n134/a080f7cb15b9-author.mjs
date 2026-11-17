import assert from "node:assert/strict";
import path from "node:path";
import {
  owned, out, card, edition, tools, python, load, bind, save, snapshot, run,
  templateDir, bookDir, verifyInputs,
} from "./common.mjs";

verifyInputs();
const revision = process.argv[2] ?? "";
assert.ok(["", "repair1"].includes(revision));
const receiptName = (name) => `${name}${revision ? `-${revision}` : ""}`;
const texts = load(out("texts.json"));
const raw = load(`${bookDir("zh")}/lessons/${card}/lesson.json`);
assert.equal(raw.prose.length, 23);
assert.equal(raw.prose.filter((block) => block.kind === "p").length, texts.length);
const lookup = new Map(texts.map((item) => [item.source_refs.join("|"), item]));
assert.equal(lookup.size, texts.length);
const authored = [];

for (const language of ["zh", "en"]) {
  const directory = templateDir(language);
  for (const name of ["lesson.template.json", "exercises.template.json", "figures.template.json"]) {
    snapshot(path.join(directory, name),
      `${revision ? "initial-author" : "prepared"}/${language}/${name}`);
  }
  const template = path.join(directory, "lesson.template.json");
  const lesson = load(template);
  const exercisesBefore = bind(path.join(directory, "exercises.template.json"));
  const figuresBefore = bind(path.join(directory, "figures.template.json"));
  lesson.language = language;
  for (const block of lesson.prose) {
    if (block.kind === "p") {
      const text = lookup.get(block.source_refs.join("|"));
      assert.ok(text, `Unbound author prose: ${block.source_refs}`);
      block.text = text[language];
      block.historical_entities = text.historical_entities ?? [];
    } else if (block.kind === "cap" && language === "en") {
      block.text = block.source_text.replace(/^图\s*/, "Figure ");
    } else {
      assert.ok(block.kind === "cap" || block.kind === "fig");
    }
    block.changes = block.text === block.source_text ? [] : [
      ...(language === "en" ? ["translation"] : []), "wording", "layout",
    ];
    block.numeric_changes = [];
  }
  const normalized = run(receiptName(`normalize-${language}`), python, [
    "-B", "-c",
    [
      "import json,sys",
      "sys.path.insert(0,sys.argv[1])",
      "from edition import normalize_lesson_layout",
      "document=json.load(sys.stdin)",
      "normalize_lesson_layout(document)",
      "json.dump(document,sys.stdout,ensure_ascii=False,indent=2)",
    ].join("\n"), tools,
  ], { input: JSON.stringify(lesson) });
  const modern = JSON.parse(normalized);
  save(path.relative(owned, template), modern, true);
  const initialFlow = JSON.parse(run(receiptName(`prose-flow-${language}-initial`), process.execPath, [
    `${tools}/prose_flow.mjs`, "--json", template,
  ]));
  const starts = ["p0328#4", "p0328#5", "p0328#10", "p0329#6",
    "p0330#2", "p0330#4", "p0330#5"];
  modern.section_breaks = starts.map((ref) => {
    const blockIndex = modern.prose.findIndex((block) => block.source_refs[0] === ref);
    assert.ok(blockIndex >= 0);
    const paragraph = initialFlow.paragraphs.find((item) => item.blockIndex === blockIndex);
    assert.ok(paragraph && paragraph.index > 0);
    return {
      before: initialFlow.paragraphs[paragraph.index - 1].text,
      after: paragraph.text,
    };
  });
  save(path.relative(owned, template), modern, true);
  const finalFlow = JSON.parse(run(receiptName(`prose-flow-${language}`), process.execPath, [
    `${tools}/prose_flow.mjs`, "--json", template,
  ]));
  assert.equal(finalFlow.resolvedBreaks.length, starts.length);
  assert.deepEqual(finalFlow.boundaries.map(({ before, after }) => ({ before, after })),
    modern.section_breaks);
  assert.deepEqual(bind(exercisesBefore.path), exercisesBefore);
  assert.deepEqual(bind(figuresBefore.path), figuresBefore);
  const title = language === "zh" ? "铁磁质的基本性质" : "Basic Properties of Ferromagnetic Materials";
  if (revision) snapshot(out(`lesson-${language}.md`), `initial-author/${language}/prose.md`);
  save(`lesson-${language}.md`, `# 134. ${title}\n\n${
    modern.prose.filter((block) => block.kind === "p" || block.kind === "cap")
      .map((block) => block.text).join("\n\n")
  }\n`, Boolean(revision));
  authored.push({
    language, template: bind(template), exercisesTemplate: exercisesBefore,
    figuresTemplate: figuresBefore,
    proseFlow: bind(out(`${receiptName(`prose-flow-${language}`)}.json`)),
    paragraphs: finalFlow.paragraphs.length, sectionBreaks: starts.length,
  });
}
const check = JSON.parse(run(receiptName("text-check-command"), python,
  ["-B", out("validate-text.py")]));
assert.equal(check.status, "pass");
save("text-check.json", check);
verifyInputs();
save("author-result.json", {
  schema: "ld-s10y-lesson/bounded-bilingual-text-author@1",
  ticket: "STEMROBIN-181", card,
  status: "text-contract-pass-awaiting-independent-SCI-ZHEN-and-modern-figures",
  authored, textCheck: bind(out("text-check.json")),
  authorRepair: revision ? {
    revision,
    originalTextFailure: bind(out("text-check-command.json")),
    cause: "Two numeric-boundary punctuation changes changed the existing native number_signature tokenization.",
    scope: "Preserve 1 and 301; restore compatible punctuation only. Initial templates and prose preserved.",
    sourceOrValidatorChanges: false,
  } : null,
  targetOnly: true, tasks: 0, modernFiguresAuthored: 0,
  independentScienceApproval: false, independentBilingualApproval: false,
  adaptFinalizeRun: false, renderRun: false, sourceImagesOpened: 0,
});
console.log(JSON.stringify({ card, status: check.status, authored }, null, 2));
