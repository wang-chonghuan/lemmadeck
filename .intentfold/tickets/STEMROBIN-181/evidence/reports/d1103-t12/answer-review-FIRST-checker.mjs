import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const cwd = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const own = path.join(cwd, ".intentfold/tickets/STEMROBIN-181/tmp/d1080-t12-first-independent-answer-review");
const native = path.join(cwd, ".intentfold/tickets/STEMROBIN-181/tmp/d1064-t12-first-bilingual-native");
const author = path.join(cwd, ".intentfold/tickets/STEMROBIN-181/tmp/d1065-t12-first-readonly-answer-author");
const card = "phy10-c2-s3-t12";
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const binding = (file) => ({ path: file, sha256: hash(fs.readFileSync(file)) });
const write = (name, data) => {
  const file = path.join(own, name);
  assert.ok(file.startsWith(own + path.sep));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", { flag: "wx" });
};
const localeRoot = (locale) => path.join(native, locale, "artifacts/10p");
const lessonRoot = (locale) => path.join(localeRoot(locale), "editions/modern-us-neutral/lessons", card);
const figureRoot = (locale) => path.join(localeRoot(locale), "editions/modern-us-neutral/figures");
const phase = process.argv[2];

if (phase === "preview") {
  const report = read(path.join(native, "report.json"));
  const entries = [binding(path.join(native, "report.json")), binding(path.join(author, "report.json"))];
  for (const locale of ["zh", "en"]) {
    for (const item of report.outputs[locale].nativeFiles) {
      const actual = binding(item.path);
      assert.equal(actual.sha256, item.sha256);
      entries.push(actual);
    }
    for (const suffix of ["answer-keys.FIRST.json", "answer-keys.json"]) {
      entries.push(binding(path.join(author, locale, suffix)));
    }
    for (const id of ["fig-213", "fig-214"]) {
      entries.push(binding(path.join(localeRoot(locale), "figures", id + ".png")));
      for (const suffix of [".svg", ".spec.json", ".render.json", ".review.json"]) {
        entries.push(binding(path.join(figureRoot(locale), id + suffix)));
      }
    }
    entries.push(binding(path.join(localeRoot(locale), "lessons", card, "exercises.json")));
    entries.push(binding(path.join(native, locale, "work/10p/modern-us-neutral/lessons", card, "answer-keys.template.json")));
  }
  assert.equal(entries[0].sha256, "d4c2d58c9c60e9ce860effd3e5733cfcd968e2af53196bc6f6d47a3b978969ef");
  for (const [locale, expected] of [
    ["zh", "8b56a7382b9df64ec17334d816e0f626c031c6cc143ec8738072cf23b6516384"],
    ["en", "18cb64c3de9edf8ebedf9ba4643adb5ed943187ca6ee63726e3795cb4dda1a62"],
  ]) {
    assert.equal(binding(path.join(author, locale, "answer-keys.FIRST.json")).sha256, expected);
  }
  write("input-bindings.json", { capturedAt: new Date().toISOString(), entries, candidateContentRead: false });
  const require = createRequire(path.join(cwd, ".claude/skills/ld-s10y-lesson/package.json"));
  const { Resvg } = require("@resvg/resvg-js");
  const previews = [];
  for (const id of ["fig-213", "fig-214"]) {
    const svgFile = path.join(figureRoot("zh"), id + ".svg");
    const spec = read(path.join(figureRoot("zh"), id + ".spec.json"));
    assert.equal(binding(svgFile).sha256, binding(path.join(figureRoot("en"), id + ".svg")).sha256);
    assert.equal(binding(path.join(figureRoot("zh"), id + ".spec.json")).sha256,
      binding(path.join(figureRoot("en"), id + ".spec.json")).sha256);
    const svg = fs.readFileSync(svgFile, "utf8").replace(/var\(--[^,]+,\s*([^)]+)\)/g, "$1");
    const png = new Resvg(svg, { background: "#ffffff", font: { loadSystemFonts: true } }).render().asPng();
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);
    assert.equal(width, spec.canvas.width);
    assert.equal(height, spec.canvas.height);
    const output = path.join(own, "inspection", id + ".full.png");
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, png, { flag: "wx" });
    previews.push({
      id, input: binding(svgFile), preview: binding(output), width, height,
      fullAspectRatio: true, cropped: false,
      transform: "Resolve CSS var fallback colors in memory only; rasterize existing SVG at intrinsic canvas with existing resvg. No figure renderer or production stage replay.",
    });
  }
  write("preview-bindings.json", { createdAt: new Date().toISOString(), previews });
  console.log(JSON.stringify({ phase, inputs: entries.length, previews, candidateContentRead: false }, null, 2));
} else if (phase === "solve") {
  assert.equal(fs.existsSync(path.join(own, "candidate-inspected.json")), false);
  const c = 3e8;
  const totalPathM = 71e3;
  const travelTimeS = totalPathM / c;
  const rotationsDuringTravel = 1 / 8;
  const sourceSeparationM = 0.3e-3;
  const sourceScreenM = 6;
  const wavelengthM = 5e-5 * 1e-2;
  const longerPathM = Math.hypot(sourceScreenM, sourceSeparationM);
  const pathDifferenceM = sourceSeparationM ** 2 / (longerPathM + sourceScreenM);
  const phaseRad = 2 * Math.PI * pathDifferenceM / wavelengthM;
  const angleRad = (2 + 30 / 60) * Math.PI / 180;
  const gratingSpacingCm = 1.2e-3;
  write("independent-solve.json", {
    frozenAt: new Date().toISOString(),
    phase: "FIRST independent solving before candidate solution inspection",
    candidateContentRead: false,
    originalAndModernFiguresInspected: ["fig-213", "fig-214"],
    arithmetic: {
      q1: { totalPathM, c, travelTimeS, rotationsDuringTravel, rateRevPerS: rotationsDuringTravel / travelTimeS },
      q2: {
        red: { vacuumWavelengthCm: 7e-5, index: 1.33, waterWavelengthCm: 7e-5 / 1.33, speedMPerS: c / 1.33 },
        violet: { vacuumWavelengthCm: 4e-5, index: 1.343, waterWavelengthCm: 4e-5 / 1.343, speedMPerS: c / 1.343 },
      },
      q3: {
        sourceSeparationM, sourceScreenM, wavelengthM, longerPathM, pathDifferenceM,
        pathDifferenceOverWavelength: pathDifferenceM / wavelengthM,
        phaseRad, phaseDeg: phaseRad * 180 / Math.PI,
        intensityOverOneSource: 2 * (1 + Math.cos(phaseRad)),
        intensityOverMaximum: (1 + Math.cos(phaseRad)) / 2,
        constructiveNotExactMaximum: true,
      },
      q4: {
        angleDeg: 2.5, angleRad, gratingSpacingCm,
        estimateWavelengthCm: gratingSpacingCm * angleRad,
        estimateWavelengthM: gratingSpacingCm * angleRad * 1e-2,
        estimateWavelengthNm: gratingSpacingCm * angleRad * 1e7,
        secondOrderAngleEstimateRad: 2 * angleRad,
        thirdOrderAngleEstimateRad: 3 * angleRad,
        exactInverseTrigAnswerNotUsed: true,
      },
    },
    derivation: read(path.join(own, "independent-reasoning.json")),
  });
  console.log(JSON.stringify(read(path.join(own, "independent-solve.json")), null, 2));
} else if (phase === "compare") {
  const solved = read(path.join(own, "independent-solve.json"));
  assert.equal(solved.candidateContentRead, false);
  const checks = [];
  const check = (id, action) => {
    try {
      const evidence = action();
      checks.push({ id, status: "PASS", evidence: evidence ?? null });
    } catch (error) {
      checks.push({ id, status: "FAIL", message: error.message });
    }
  };
  const candidates = {};
  const mappings = [];
  const mappingFile = path.join(author, "source-mapping.json");
  const authorMapping = read(mappingFile);
  const authorReport = read(path.join(author, "report.json"));
  const extraBindings = [binding(mappingFile)];
  const banned = new Set([
    "expected", "accept", "answer", "answerKey", "answer_key",
    "correct_index", "correctIndex", "correct", "judge", "widget",
    "options", "interaction", "interactions", "input", "inputs",
  ]);
  const scan = (object, location = "") => {
    if (object === null || typeof object !== "object") return;
    for (const [key, value] of Object.entries(object)) {
      assert.equal(banned.has(key), false, location + "/" + key);
      scan(value, location + "/" + key);
    }
  };
  for (const locale of ["zh", "en"]) {
    const file = path.join(author, locale, "answer-keys.FIRST.json");
    const candidate = read(file);
    candidates[locale] = candidate;
    const exercisesFile = path.join(lessonRoot(locale), "exercises.json");
    const exercises = read(exercisesFile);
    const template = read(path.join(native, locale, "work/10p/modern-us-neutral/lessons", card, "answer-keys.template.json"));
    const pageFile = path.join(localeRoot(locale), "pages/0244/page.json");
    const page = read(pageFile);
    const bookFile = path.join(localeRoot(locale), "book.json");
    const book = read(bookFile);
    extraBindings.push(binding(pageFile), binding(bookFile));
    check(locale + ":identity-and-frozen-bytes", () => {
      assert.equal(candidate.schema, "ld-s10y-answer/lesson-answers@1");
      assert.equal(candidate.book, "10p");
      assert.equal(candidate.lesson, card);
      assert.equal(candidate.edition, "modern-us-neutral");
      assert.equal(candidate.locale, locale);
      assert.equal(candidate.status, "draft");
      assert.equal(candidate.answers.length, exercises.count);
      assert.equal(candidate.answers.length, 4);
      assert.equal(new Set(candidate.answers.map(a => a.exercise)).size, 4);
      assert.equal(binding(file).sha256, authorReport.outputs[locale].FIRST.sha256);
      assert.equal(binding(file).sha256, binding(path.join(author, locale, "answer-keys.json")).sha256);
      assert.equal(fs.statSync(file).mode & 0o777, 0o444);
      return { candidate: binding(file), permissionMode: "0444", rawBookNumbering: book.exercise_numbering };
    });
    check(locale + ":native-raw-source-snapshot", () => {
      const rawFile = path.join(localeRoot(locale), exercises.source.path);
      assert.equal(binding(rawFile).sha256, exercises.source.sha256);
      assert.deepEqual(read(rawFile), exercises.source.data);
      return binding(rawFile);
    });
    check(locale + ":no-input-grading-or-interaction-keys", () => {
      scan(candidate);
      scan(exercises);
      scan(read(path.join(lessonRoot(locale), "lesson.json")));
      scan(read(path.join(lessonRoot(locale), "figures.json")));
      for (const name of ["answer-keys.json", "answer-keys.FIRST.json", "interactions.json"]) {
        assert.equal(fs.existsSync(path.join(lessonRoot(locale), name)), false);
      }
      return { forbiddenKeys: [...banned], nativeAnswerAndInteractionFilesAbsent: true };
    });
    check(locale + ":author-mapping-current-native-bindings", () => {
      for (const name of ["lesson", "exercises", "figures", "prepareTemplate"]) {
        const reference = authorMapping.locales[locale][name];
        assert.equal(binding(path.resolve(cwd, reference.path)).sha256, reference.sha256);
      }
      assert.equal(authorMapping.approvedInput.sha256, binding(path.join(native, "report.json")).sha256);
      return { sourceMapping: binding(mappingFile), locale };
    });
    for (let i = 0; i < 4; i++) {
      const exercise = exercises.exercises[i];
      const answer = candidate.answers[i];
      const rawExercise = exercises.source.data.exercises[i];
      const sourceMap = authorMapping.questionMapping[i];
      const key = locale + ":exercise-" + exercise.number;
      check(key + ":readonly-fields", () => {
        assert.equal(answer.exercise, exercise.number);
        assert.equal(answer.prompt, exercise.text);
        assert.equal(answer.prompt, template.answers[i].prompt);
        assert.equal(answer.source, "derived");
        assert.equal(answer.grading, "ungraded");
        assert.ok(Object.hasOwn(answer, "bookRaw"));
        assert.equal(answer.bookRaw, null);
        assert.deepEqual(answer.parts, []);
        assert.ok(answer.displayAnswer.trim().length > 0);
        assert.deepEqual(answer.figureEvidence, template.answers[i].figureEvidence);
        return { source: "derived", grading: "ungraded", bookRaw: null, parts: [], promptMatchesExactly: true };
      });
      check(key + ":exact-source-identity", () => {
        assert.equal(exercise.group_id, "g0");
        assert.equal(exercise.source_number, exercise.number);
        assert.equal(rawExercise.number, exercise.number);
        assert.equal(rawExercise.group_id, exercise.group_id);
        assert.equal(rawExercise.source_number, exercise.source_number);
        assert.deepEqual(rawExercise.pages, exercise.pages);
        assert.deepEqual(rawExercise.figure_refs, exercise.figure_refs);
        assert.equal(exercise.source_text, rawExercise.text);
        assert.equal(sourceMap.exercise, exercise.number);
        assert.equal(sourceMap.groupId, exercise.group_id);
        assert.equal(sourceMap.sourceNumber, exercise.source_number);
        assert.equal(sourceMap.nativeJsonPointer, "/exercises/" + i);
        assert.deepEqual(sourceMap.sourceRefs, exercise.pages);
        assert.deepEqual(sourceMap.figureRefs, exercise.figure_refs);
        for (const ref of exercise.pages) {
          const match = /^p0244#(\d+)$/.exec(ref);
          assert.ok(match);
          const sourceBlock = page.blocks[Number(match[1])];
          assert.equal(sourceBlock.kind, "ex");
          assert.equal(sourceBlock.label, exercise.source_number);
          assert.deepEqual(sourceBlock.lines, rawExercise.lines);
        }
        const entry = {
          locale, exercise: exercise.number, groupId: exercise.group_id,
          sourceNumber: exercise.source_number, nativePointer: "/exercises/" + i,
          sourceRefs: exercise.pages, figureRefs: exercise.figure_refs,
        };
        mappings.push(entry);
        return entry;
      });
      check(key + ":source-bound-historical-entities", () => {
        assert.equal(answer.historical_entities.length, exercise.historical_entities.length);
        for (let j = 0; j < answer.historical_entities.length; j++) {
          const entity = answer.historical_entities[j];
          const nativeEntity = exercise.historical_entities[j];
          assert.equal(entity.term, nativeEntity.term);
          assert.ok(entity.reason.trim().length > 0);
          assert.ok(answer.prompt.includes(entity.term));
          assert.ok(answer.displayAnswer.includes(entity.term));
          const sourceTerm = entity.source_term ?? entity.term;
          assert.ok(rawExercise.text.includes(sourceTerm));
          if (locale === "en") assert.equal(entity.source_term, nativeEntity.source_term);
        }
        return answer.historical_entities;
      });
      check(key + ":figure-evidence-hashes", () => {
        assert.deepEqual(answer.figureEvidence.map(f => f.id), exercise.figure_refs);
        const observed = [];
        for (const figure of answer.figureEvidence) {
          for (const field of ["originalPng", "editionAsset", "figureSpec"]) {
            assert.ok(figure[field].startsWith(localeRoot(locale) + path.sep));
          }
          const spec = read(figure.figureSpec);
          const authorityFile = path.resolve(cwd, spec.source.image.path);
          assert.equal(binding(authorityFile).sha256, spec.source.image.sha256);
          assert.equal(binding(figure.originalPng).sha256, spec.source.image.sha256);
          extraBindings.push(binding(authorityFile));
          observed.push({ id: figure.id, original: binding(figure.originalPng), modern: binding(figure.editionAsset), spec: binding(figure.figureSpec) });
        }
        return observed;
      });
    }
  }
  for (let i = 0; i < 4; i++) {
    check("bilingual:exercise-" + (i + 1) + ":display-equations", () => {
      const blocks = (text) => [...text.matchAll(/\$\$([\s\S]*?)\$\$/g)].map(m => m[1]);
      const zh = blocks(candidates.zh.answers[i].displayAnswer);
      const en = blocks(candidates.en.answers[i].displayAnswer);
      assert.ok(zh.length > 0);
      assert.deepEqual(zh, en);
      return { identicalDisplayEquationBlocks: zh.length };
    });
  }
  const quantities = [
    [solved.arithmetic.q1.rateRevPerS],
    [
      solved.arithmetic.q2.red.waterWavelengthCm, solved.arithmetic.q2.red.speedMPerS,
      solved.arithmetic.q2.violet.waterWavelengthCm, solved.arithmetic.q2.violet.speedMPerS,
    ],
    [solved.arithmetic.q3.pathDifferenceM],
    [solved.arithmetic.q4.estimateWavelengthCm, solved.arithmetic.q4.estimateWavelengthM],
  ];
  for (const locale of ["zh", "en"]) {
    for (let i = 0; i < 4; i++) {
      check(locale + ":exercise-" + (i + 1) + ":independent-rounded-arithmetic", () => {
        const text = candidates[locale].answers[i].displayAnswer;
        const scientificNumbers = [...text.matchAll(/(\d+(?:\.\d+)?)\\times10\^\{?(-?\d+)\}?/g)]
          .map(m => Number(m[1]) * 10 ** Number(m[2]));
        const expected = quantities[i].map(x => Number(x.toPrecision(i === 2 ? 2 : 3)));
        for (const value of expected) {
          assert.ok(scientificNumbers.some(x => Math.abs(x - value) <= Math.abs(value) * 1e-12), "Missing independently rounded quantity: " + value);
        }
        if (i === 2) {
          assert.ok(text.includes("0.015\\lambda"));
          assert.ok(text.includes("0.0942"));
          assert.ok(text.includes("3.991I_0"));
          assert.ok(text.includes("0.9978"));
          assert.ok(text.includes("99.8\\%"));
          assert.equal(Number(solved.arithmetic.q3.intensityOverMaximum.toFixed(4)), 0.9978);
        }
        if (i === 3) assert.ok(text.includes("524\\,\\mathrm{nm}"));
        return { independentlyRoundedQuantities: expected, interpretationRequiresEditorialReview: true };
      });
    }
  }
  const opened = read(path.join(own, "image-opens.json"));
  check("bounded-actual-image-opens", () => {
    assert.equal(opened.actualOpens, opened.opens.length);
    assert.equal(opened.actualOpens, 4);
    assert.ok(opened.actualOpens <= opened.limit);
    for (const item of opened.opens) {
      assert.equal(item.observed, true);
      assert.equal(binding(item.path).sha256, item.sha256);
    }
    return { actualOpens: 4, allowed: 8, reopens: 0, crops: 0 };
  });
  check("preflight-bound-inputs-unchanged", () => {
    const input = read(path.join(own, "input-bindings.json"));
    for (const item of input.entries) assert.equal(binding(item.path).sha256, item.sha256, item.path);
    return { unchangedFiles: input.entries.length };
  });
  write("candidate-inspected.json", {
    recordedAt: new Date().toISOString(),
    firstCandidateContentReadExecOrdinal: 26,
    contentReadAfterIndependentSolveFreeze: true,
    independentSolve: binding(path.join(own, "independent-solve.json")),
    solveFrozenAt: solved.frozenAt,
    firstReadWallClock: null,
    clockReason: "The first candidate read followed solve in tool history; that cat command did not emit a timestamp.",
    prohibitedOraclesRead: { authorIndependentDerivations: false, choiceDrafts: false },
    authorReportUse: "Read after independent solve only to verify bindings/provenance; its workedResults and self-check are not independent solver evidence.",
  });
  const uniqueExtras = [...new Map(extraBindings.map(x => [x.path, x])).values()];
  write("mechanical-checks.json", {
    checkedAt: new Date().toISOString(),
    status: checks.every(x => x.status === "PASS") ? "PASS" : "FAIL",
    checks, mappings, extraBindings: uniqueExtras,
    independentSolve: binding(path.join(own, "independent-solve.json")),
  });
  console.log(JSON.stringify({
    phase, status: checks.every(x => x.status === "PASS") ? "PASS" : "FAIL",
    checks: checks.length, failures: checks.filter(x => x.status === "FAIL"), mappings,
  }, null, 2));
} else {
  throw new Error("Supported stages: preview, solve, compare");
}
