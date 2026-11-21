import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
assert.equal(process.cwd(), cwd);
const out = path.join(cwd, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d496-laboratory-first-independent-review");
const root = path.join(cwd, ".tmp/STEMROBIN-181/d1816-d492/root/10p");
const work = path.join(cwd, ".tmp/STEMROBIN-181/d1816-d492/source-work/adapt/10p");
const ticket = path.join(cwd, ".intentfold/tickets/STEMROBIN-181/tmp");
const native = path.join(ticket, "d1816-recovery/native");
const editions = ["modern-us-neutral", "modern-us-neutral-en"];
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const emit = (name, data) => fs.writeFileSync(path.join(out, name), JSON.stringify(data, null, 2) + "\n");
const stagePath = (name) => path.join(ticket, name);
const assemblyPath = stagePath("d1816-d492-laboratory-assembly-repair/result.json");
const integrationPath = stagePath("d1816-d495-laboratory-figure-integration/result.json");
const checksPath = stagePath("d1816-d494-laboratory-affected-text/current-mechanical-check.json");
const lessonPath = path.join(root, "lessons/phy10-c4-s4/lesson.json");
const localLesson = (edition) => path.join(work, edition, "lessons/phy10-c4-s4/lesson.template.json");

if (process.argv[2] === "freeze") {
  assert.ok(!fs.existsSync(path.join(out, "review-freeze.json")), "Never overwrite the first freeze");
  const files = new Map();
  const add = (file, role, expected) => {
    const absolute = path.resolve(cwd, file);
    assert.ok(absolute.startsWith(cwd + "/"), absolute);
    const actual = sha(absolute);
    if (expected) assert.equal(actual, expected, absolute);
    if (!files.has(absolute)) files.set(absolute, { path: absolute, sha256: actual, bytes: fs.statSync(absolute).size, roles: [] });
    files.get(absolute).roles.push(role);
  };
  for (const [file, role] of [
    [assemblyPath, "D492 approved page reuse and corrected assembly pins"],
    [integrationPath, "D495 integrated figure pins"],
    [checksPath, "D494 current mechanical text check, not independent review"],
    [stagePath("d1816-d490-source410-lab-right-boundary/report.json"), "Inherited closed right-boundary evidence; no page image replay"],
    [stagePath("d1816-d491-lab-fig278-first-author/report.json"), "Author-only context, not approval"],
    [lessonPath, "Actual raw whole lesson"],
    [path.join(root, "lessons/phy10-c4-s4/exercises.json"), "Actual raw empty exercise collection"],
    [".agents/skills/ld-s10y-image/SKILL.md", "Figure review rules only, no setup"],
    [".agents/skills/ld-s10y-image/references/quality-gate.md", "Quality gate"],
    [".agents/skills/ld-s10y-image/scripts/record_review.py", "Existing review recorder"],
    [".agents/skills/ld-s10y-image/scripts/validate_spec.py", "Recorder validation dependency"],
    [".claude/skills/ld-s10y-lesson/tools/assemble.py", "Narrow assembly repair implementation"],
    [".claude/skills/ld-s10y-lesson/tools/test_section_cards.py", "12 targeted test definitions"],
    [".claude/skills/ld-s10y-lesson/tools/test_production.py", "16 regression test definitions"],
    [".claude/skills/ld-s10y-lesson/tools/blocks.py", "Source block joining semantics"],
    [".claude/skills/ld-s10y-lesson/tools/normalize.py", "Source normalization semantics"],
    ["ssot-resources/soviet10year-textbooks/toc/10p/zh.json", "Assembly card identity input; not inferred boundary"],
    ["ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-278.png", "Canonical raw PNG for first modern comparison only"],
  ]) add(file, role);
  const assembly = read(assemblyPath);
  for (const copy of assembly.copies) {
    // Only laboratory source-text/audit bindings and the source PNG are relevant.
    if (/\/pages\/040[2-9]\/(page\.(json|md)|audit\.json)$/.test(copy.to.path) ||
        /\/figures\/fig-278\.png$/.test(copy.to.path)) {
      add(copy.from.path, "D492 reused approved source input", copy.from.sha256);
      add(copy.to.path, "D492 exact reused source copy", copy.to.sha256);
    }
  }
  add(assembly.tooling.path, "D492 pinned assembly implementation", assembly.tooling.sha256);
  for (const record of read(integrationPath).records) {
    for (const key of ["spec", "svg", "render", "preview", "manifest", "receipt"]) {
      add(record[key].path, `D495 ${record.edition} ${key}`, record[key].sha256);
    }
    const spec = read(record.spec.path);
    add(spec.source.image.path, "Current spec source image", spec.source.image.sha256);
    const render = read(record.render.path);
    for (const [name, output] of Object.entries(render.output)) add(output.path, `Render-bound durable ${name}`, output.sha256);
  }
  for (const record of read(checksPath).records) add(record.lesson.path, `D494 current ${record.locale} whole text`, record.lesson.sha256);
  add(read(checksPath).source.path, "D494 unchanged raw source", read(checksPath).source.sha256);
  for (const edition of editions) {
    for (const name of ["lesson", "exercises", "figures"]) add(path.join(work, edition, `lessons/phy10-c4-s4/${name}.template.json`), `Actual ${edition} ${name} template`);
  }
  for (const name of [
    "d492-laboratory-assembly-targeted-tests", "d492-assembly-regression-tests",
    "d492-laboratory-affected-assemble", "d492-laboratory-zh-affected-adapt-prepare",
    "d492-laboratory-en-affected-adapt-prepare",
    "d495-laboratory-modern-us-neutral-first-integrated-figure-render",
    "d495-laboratory-modern-us-neutral-en-first-integrated-figure-render",
  ]) {
    for (const file of ["receipt.json", "stdout.txt", "stderr.txt"]) add(path.join(native, name, file), `${name} ${file}`);
  }
  for (const record of assembly.stages) add(record.path, "D492 pinned stage", record.sha256);
  add(assembly.targetedTests.path, "D492 targeted receipt pin", assembly.targetedTests.sha256);
  fs.mkdirSync(path.join(out, "frozen"), { recursive: true });
  const records = [...files.values()].map((record, i) => {
    const snapshot = path.join(out, "frozen", `${String(i + 1).padStart(3, "0")}-${path.basename(record.path)}`);
    fs.copyFileSync(record.path, snapshot);
    assert.equal(sha(snapshot), record.sha256);
    return { ...record, snapshot };
  });
  emit("review-freeze.json", {
    schemaVersion: 1,
    task: "STEMROBIN-181 D496 FIRST INDEPENDENT REVIEW",
    frozenAt: new Date().toISOString(),
    cwd,
    course: "phy10-c4-s4",
    frozenBeforeFirstImageOpen: true,
    actualImageOpensAtFreeze: 0,
    maxBatchImageOpens: 8,
    maxContextImageOpens: 24,
    plannedImageOpens: [
      { ordinal: 1, path: path.join(cwd, "ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-278.png"), sha256: "c815babe17c81e4c458341108e9617b0a027b03c694081dc3e96a28f53732e79", purpose: "First source-pixel comparison of the new MODERN figure, not old RAW approval replay" },
      { ordinal: 2, path: path.join(root, "editions/modern-us-neutral/figures/fig-278.preview.png"), sha256: "13e6d2b04da36dc569baf4bde9f338bcefeb3f01fdae77e6854f2e7027ed155f", purpose: "First integrated modern pixel review; byte-identical EN preview not reopened" },
    ],
    records,
  });
  console.log(JSON.stringify({ status: "FROZEN", inputs: records.length, freezeSha256: sha(path.join(out, "review-freeze.json")), actualImageOpens: 0 }, null, 2));
}

if (process.argv[2] === "text") {
  const raw = read(lessonPath);
  const zh = read(localLesson(editions[0]));
  const en = read(localLesson(editions[1]));
  const start = Number(process.argv[3] || 0);
  const end = Number(process.argv[4] || 110);
  for (let i = start; i < Math.min(end, 110); i++) {
    console.log(`\n[${i}] ${raw.prose[i].kind} ${raw.prose[i].source_refs.join(",")} printed=${raw.prose[i].printed_page}`);
    console.log("RAW: " + raw.prose[i].text);
    console.log("ZH:  " + zh.prose[i].text);
    console.log("EN:  " + en.prose[i].text);
  }
}

if (process.argv[2] === "integrity") {
  const freeze = read(path.join(out, "review-freeze.json"));
  const changes = freeze.records.filter((r) => sha(r.path) !== r.sha256 || sha(r.snapshot) !== r.sha256);
  assert.equal(changes.length, 0, JSON.stringify(changes));
  const raw = read(lessonPath);
  const pages = new Map();
  for (let p = 402; p <= 409; p++) pages.set(p, read(path.join(root, `pages/${String(p).padStart(4, "0")}/page.json`)));
  const used = new Set();
  const normalize = (text) => text.replace(/\s+/g, "");
  const blocks = raw.prose.map((block, index) => {
    const bound = block.source_refs.map((ref) => {
      const [, page, number] = /^p(\d+)#(\d+)$/.exec(ref);
      const source = pages.get(Number(page)).blocks[Number(number) - 1];
      assert.ok(source, ref);
      assert.ok(!used.has(ref), `Duplicate ${ref}`);
      used.add(ref);
      return { ref, source };
    });
    const sourceText = bound.map(({ source }) => source.lines.join("")).join("");
    assert.equal(normalize(sourceText), normalize(block.text), `Source text ${index}`);
    for (const { source } of bound) assert.equal(source.kind, block.kind, `Kind ${index}`);
    const [firstPage] = bound[0].ref.match(/\d+/);
    assert.equal(block.printed_page, pages.get(Number(firstPage)).meta.printed_page);
    return { index, kind: block.kind, sourceRefs: block.source_refs, rawSha256: crypto.createHash("sha256").update(block.text).digest("hex"), sourceTextIdentity: "PASS" };
  });
  const unaccounted = [];
  for (const [page, doc] of pages) {
    for (const [i, block] of doc.blocks.entries()) {
      const ref = `p${String(page).padStart(4, "0")}#${i + 1}`;
      if (!used.has(ref) && block.kind !== "foot" && !(page === 402 && i === 0 && block.kind === "h1")) unaccounted.push(ref);
    }
  }
  assert.equal(unaccounted.length, 0, JSON.stringify(unaccounted));
  const locales = editions.map((edition) => {
    const lesson = read(localLesson(edition));
    assert.equal(lesson.prose.length, 110);
    assert.equal(lesson.source.sha256, sha(lessonPath));
    assert.deepEqual(lesson.source.data, raw);
    for (const [i, block] of lesson.prose.entries()) {
      for (const key of ["kind", "id", "printed_page", "source_refs"]) assert.deepEqual(block[key], raw.prose[i][key], `${edition} ${i} ${key}`);
      const expectedLabel = edition.endsWith("-en") && ["fig", "cap"].includes(block.kind) ? "Figure 278" : raw.prose[i].label;
      assert.equal(block.label, expectedLabel, `${edition} ${i} localized label`);
      assert.equal(block.source_text, raw.prose[i].text, `${edition} source_text ${i}`);
      assert.deepEqual(block.numeric_changes, []);
    }
    const ex = read(path.join(work, edition, "lessons/phy10-c4-s4/exercises.template.json"));
    assert.equal(ex.count, 0);
    assert.deepEqual(ex.exercises, []);
    assert.equal(ex.source.sha256, sha(path.join(root, "lessons/phy10-c4-s4/exercises.json")));
    const spec = read(path.join(root, `editions/${edition}/figures/fig-278.spec.json`));
    const expectedTexts = editions.flatMap((ed) => {
      const l = read(localLesson(ed));
      return [...l.prose.slice(23, 37), l.prose[38]].map((b) => ({ lesson: raw.id, text: b.text }));
    });
    assert.deepEqual(spec.source.authoritativeText, expectedTexts);
    const render = read(path.join(root, `editions/${edition}/figures/fig-278.render.json`));
    assert.equal(render.spec.sha256, sha(path.join(root, `editions/${edition}/figures/fig-278.spec.json`)));
    assert.equal(render.status, "pass");
    assert.deepEqual(render.displayChecks.map((d) => d.width), [240, 288, 320, 358, 384, 480]);
    for (const check of render.displayChecks) assert.ok(check.measuredMinPx >= 16 && check.status === "pass" && check.failures.length === 0);
    return { edition, blocks: 110, sourceBinding: "PASS", embeddedRawIdentity: "PASS", blockIdentity: "PASS", exerciseCount: 0, authoritativeFigureTextIdentity: "PASS", renderWidths: render.displayChecks };
  });
  assert.equal(raw.prose.length, 110);
  assert.equal(raw.prose.filter((b) => b.kind === "h3").length, 10);
  assert.equal(raw.exercise_count, 0);
  emit("independent-binding-check.json", {
    status: "PASS", checkedAt: new Date().toISOString(),
    scope: "Independent exact source/page/template/spec/render checks; semantic judgments separately recorded in report",
    freezeSha256: sha(path.join(out, "review-freeze.json")),
    unchangedInputs: freeze.records.length,
    sourceBlocksUsed: used.size,
    sourcePageRange: [402, 409],
    unaccountedInstructionalSourceBlocks: unaccounted,
    blocks, locales,
  });
  console.log(JSON.stringify({ status: "PASS", unchangedInputs: freeze.records.length, blocks: blocks.length, sourceBlocksUsed: used.size, locales: locales.length, unaccounted }, null, 2));
}

if (process.argv[2] === "audit") {
  const raw = read(lessonPath);
  const locales = editions.map((edition) => ({ edition, lesson: read(localLesson(edition)) }));
  const ranges = [
    [0, 9, "I", "Pendulum: all six steps, ball clearance 1-2 cm, displacement 5-8 cm, counting time 1-1.5 minutes, l/t/n and the complete g formula, and error estimate retained."],
    [10, 22, "II", "Reflection: complete materials and nine steps, slit/mirror/white paper setup, reflected-ray marking, normal construction, angle measurements and repeated comparison retained. The 402/403 page break does not merge distinct steps."],
    [23, 38, "III", "Glass: complete materials and ten steps, plane-parallel faces, A/B/C tracing, normal, incidence/refraction symbols, sin(alpha)/sin(beta), repetition and fig278/caption retained. The 403/404 break keeps steps 5 and 6 separate."],
    [39, 48, "IV", "Concave mirror: six steps, virtual-image observation, arm-length setup, eye/axis placement, inverted real-image observation and smaller/equal/larger image constructions retained. ZH virtual-image character modernization preserves meaning."],
    [49, 62, "V", "Lens images: nine steps plus the independent approximate-focal-length explanation. Distant object, concave-mirror letter support, 2 focal lengths, millimeter grid, all four parallax eye movements, width/height, distances, ratio orientation and repetition retained."],
    [63, 75, "VI", "Focal length/power: all nine steps, slit screen, filament focus, lamp/image distances and all four formula expressions retained. Current EN prose73 preserves the exact formula/reference order; the prior D493 FAIL is not erased."],
    [76, 83, "VII", "Microscope: materials across 406/407, three steps plus the separate final eyepiece paragraph, objective/eyepiece roles, greater-than-objective-focus condition, Experiment 5 cross-reference, enlarged inverted real intermediate image and equal-or-less eyepiece-focus condition retained."],
    [84, 91, "VIII", "Dispersion: materials and four steps complete. Hydrogen/neon/helium material order and hydrogen/helium/neon observation order preserved, along with 45/60 degrees, continuous versus line spectra and brightest-line recording. ZH prose88 alone corrupts the explanatory separator into a repeated range word; EN remains faithful."],
    [92, 100, "IX", "Interference: two glass plates and all five steps, cleaning/contact/pressure, reflected light with black background and glare exclusion, colored rings or irregular fringes, pressure-dependent shape/location, and attempted transmitted-light observation retained."],
    [101, 109, "X", "Diffraction: one shared straight-filament lamp, vernier caliper and all four steps retained. The 408/409 split joins only the unfinished sentence in step 3. 0.5 mm initial slit, source 0.55-to-0.8 mm later change, both-side colored fringes, marker 1 and its full glass-photographic-plate fallback footnote retained."],
  ];
  const math = (s) => [...s.matchAll(/\$([^$]+)\$/g)].map((m) => m[1].replace(/\s/g, ""));
  const step = (s) => /^(\d+)\.\s/.exec(s)?.[1] || null;
  const blocks = raw.prose.map((block, index) => {
    const experiment = ranges.find(([start, end]) => index >= start && index <= end)[2];
    return {
      index,
      experiment,
      kind: block.kind,
      printedPage: block.printed_page,
      sourceRefs: block.source_refs,
      rawText: block.text,
      sourceBinding: "PASS",
      locales: Object.fromEntries(locales.map(({ edition, lesson }) => {
        const b = lesson.prose[index];
        assert.deepEqual(math(b.text), math(block.text), `${edition} math/reference order ${index}`);
        assert.equal(step(b.text), step(block.text), `${edition} step number ${index}`);
        const defect = edition === "modern-us-neutral" && index === 88;
        return [edition, {
          text: b.text,
          manualCompleteness: "PASS",
          manualLocalization: defect ? "FAIL" : "PASS",
          procedureQuantityFormulaPreservation: "PASS",
          mathAndReferenceOrder: "PASS",
          independentQuestionApplicability: "N/A",
          ...(defect ? { finding: "D496-TEXT-001" } : {}),
        }];
      })),
    };
  });
  const bad = locales[0].lesson.prose[88];
  assert.ok(bad.text.includes("\u81f3\u81f3"));
  assert.ok(raw.prose[88].text.includes("\u2014\u2014"));
  emit("all-110-blocks-text-science-audit.json", {
    status: "FAIL",
    reviewKind: "First actual independent human semantic reading of all 110 raw/ZH/EN blocks, with exact source and mechanical binding checks",
    auditedAt: new Date().toISOString(),
    lesson: { path: lessonPath, sha256: sha(lessonPath) },
    templates: locales.map(({ edition }) => ({ edition, path: localLesson(edition), sha256: sha(localLesson(edition)) })),
    blockCountPerLocale: 110,
    actualLocaleBlockReadings: 220,
    zeroBasedIndices: true,
    mathContainingBlocksPerLocale: 19,
    mathAndReferenceOrder: "PASS",
    independentExerciseCount: 0,
    answerChoiceApplicability: "N/A",
    experiments: ranges.map(([start, end, experiment, observations]) => ({ experiment, startIndex: start, endIndex: end, observations, text: experiment === "VIII" ? "FAIL_ZH_PROSE88_ONLY" : "PASS", science: "PASS_SOURCE_PRESERVING_SCOPE" })),
    blocks,
  });
  const specPath = path.join(root, "editions/modern-us-neutral/figures/fig-278.spec.json");
  const spec = read(specPath);
  const objects = new Map(spec.objects.map((o) => [o.id, o]));
  const A = objects.get("trace-A").at;
  const B = objects.get("trace-B").at;
  const C = objects.get("trace-C").at;
  const delta = (p, q) => p.map((v, i) => v - q[i]);
  const cross = (u, v) => u[0] * v[1] - u[1] * v[0];
  const dot = (u, v) => u[0] * v[0] + u[1] * v[1];
  const almost = (v) => assert.ok(Math.abs(v) < 1e-8, String(v));
  const normal = objects.get("normal");
  const plate = objects.get("plate").points;
  const upperNormal = delta(normal.from, B);
  const lowerNormal = delta(normal.to, B);
  almost(cross(delta(A, B), delta(objects.get("alpha-arc").start, B)));
  almost(cross(upperNormal, delta(objects.get("alpha-arc").end, B)));
  almost(cross(delta(C, B), delta(objects.get("beta-arc").start, B)));
  almost(cross(lowerNormal, delta(objects.get("beta-arc").end, B)));
  assert.ok(dot(delta(A, B), delta(objects.get("alpha-arc").start, B)) > 0);
  assert.ok(dot(upperNormal, delta(objects.get("alpha-arc").end, B)) > 0);
  assert.ok(dot(delta(C, B), delta(objects.get("beta-arc").start, B)) > 0);
  assert.ok(dot(lowerNormal, delta(objects.get("beta-arc").end, B)) > 0);
  almost(dot(delta(normal.to, normal.from), delta(plate[1], plate[0])));
  almost(cross(delta(plate[1], plate[0]), delta(plate[2], plate[3])));
  almost(cross(delta(B, A), delta(objects.get("emergent-ray").to, C)));
  almost(cross(delta(C, B), delta(objects.get("refracted-extension").to, C)));
  const visibleLabels = spec.objects.flatMap((o) => o.label ? [o.label] : o.type === "text" ? [o.text] : []);
  assert.deepEqual(visibleLabels, ["A", "B", "C", "\u03b1", "\u03b2"]);
  const widths = [240, 288, 320, 358, 384, 480];
  const displayEvidence = widths.map((width) => ({
    widthPx: width,
    svgScale: width / spec.canvas.width,
    minimumTextPx: Math.min(...spec.objects.filter((o) => o.label || o.type === "text").map((o) => o.fontSize)) * width / spec.canvas.width,
    rayStrokePx: objects.get("incident-ray").strokeWidth * width / spec.canvas.width,
    normalStrokePx: objects.get("normal").strokeWidth * width / spec.canvas.width,
    status: "PASS_DECLARED_VECTOR_SCALE",
    separateRasterOpen: false,
  }));
  emit("modern-figure-independent-review.json", {
    status: "PASS",
    scope: "First modern source/pixel semantic review and declared-width checks only; final product/offline display is not reviewed",
    reviewedAt: new Date().toISOString(),
    spec: { path: specPath, sha256: sha(specPath) },
    source: { path: path.resolve(cwd, spec.source.image.path), sha256: spec.source.image.sha256 },
    svg: { path: path.join(root, "editions/modern-us-neutral/figures/fig-278.svg"), sha256: sha(path.join(root, "editions/modern-us-neutral/figures/fig-278.svg")) },
    preview: { path: path.join(root, "editions/modern-us-neutral/figures/fig-278.preview.png"), sha256: sha(path.join(root, "editions/modern-us-neutral/figures/fig-278.preview.png")) },
    actualImageOpens: 2,
    currentEnglishPreviewReopened: false,
    independentSourceInventory: { path: path.join(out, "independent-source-pixel-inventory.json"), sha256: sha(path.join(out, "independent-source-pixel-inventory.json")) },
    pixelObservations: [
      "Integrated raster is nonblack and complete at its native 480x780 pixels. One hatched plate, the incident/internal/emergent thick trace, the thin normal and the separate thin BC extension are present and distinguishable.",
      "A is the upper-right start of AB; B lies on the incidence face; C lies below/slightly right on the exit face. B and C markers clarify source intersections without adding measurements.",
      "The short alpha arc joins BA to the upper normal outside the glass. The short beta arc joins BC to the lower normal inside the glass. Neither arc wraps through the opposite reflex sector; the labels are associated with the correct short arcs.",
      "Five visible labels are A, B, C, alpha and beta only. No numerical angle, refractive index, computed result, answer key, foreign-language prose or cultural decoration appears.",
      "B and C labels are offset from their intersection markers; alpha is above its arc and beta lies below/right of its arc. No glyph is visibly cut off, covered by a ray or merged with another label in the opened preview.",
      "The seven interior hatches and isolated unlabelled dot are retained. The dot is not named, included as a new experimental point or assigned a result.",
      "Schematic exact parallel faces, perpendicular normal and incident/emergent parallelism match the disclosed modern regularization. No source scale or measured value is invented."
    ],
    independentDirectedArcAndTopologyChecks: "PASS, correct same-direction arc endpoints, normal perpendicularity, face parallelism, emergent parallelism and BC-extension collinearity checked numerically from the frozen spec",
    visibleLabels,
    declarations: { layout: "inline", purpose: "instructional", maxWidthPx: 480, minimumTextPx: 16 },
    widths: displayEvidence,
    widthEvidenceQualification: "One native-width preview was visually opened. Six smaller/equal widths were checked using current D495 render receipts and exact SVG/spec scale, not by opening six screenshots. Actual 390px viewport media358 is a check declaration; no headed product measurement is claimed.",
    finalDisplayStatus: "PENDING_SEPARATE_BATCH",
    reviewAt1FilesWritten: false,
    reasonNotWritingReviewAt1: "Overall first review is FAIL due to D496-TEXT-001. The user's conditional overall-PASS instruction for writing current scratch figure review files has not been satisfied. No false figure FAIL is recorded for an unrelated text defect.",
    findings: [],
  });
  console.log(JSON.stringify({ text: "FAIL", failedBlocks: [{ edition: "modern-us-neutral", index: 88 }], actualBlockReadings: 220, science: "PASS_SOURCE_PRESERVING_SCOPE", modernFigure: "PASS", imageOpens: 2, figureReviewAt1FilesWritten: false }, null, 2));
}

if (process.argv[2] === "report") {
  assert.ok(!fs.existsSync(path.join(out, "report.json")), "Never overwrite the FIRST overall report");
  const freezePath = path.join(out, "review-freeze.json");
  const freeze = read(freezePath);
  for (const record of freeze.records) {
    assert.equal(sha(record.path), record.sha256, record.path);
    assert.equal(sha(record.snapshot), record.sha256, record.snapshot);
  }
  const evidence = (file) => ({ path: file, sha256: sha(file) });
  const raw = read(lessonPath);
  const zh = read(localLesson(editions[0]));
  const fig = read(path.join(out, "modern-figure-independent-review.json"));
  const text = read(path.join(out, "all-110-blocks-text-science-audit.json"));
  assert.equal(fig.status, "PASS");
  assert.equal(text.status, "FAIL");
  const tests = [
    ["targeted", "d492-laboratory-assembly-targeted-tests", 12, "test_section_cards.py"],
    ["regression", "d492-assembly-regression-tests", 16, "test_production.py"],
  ].map(([scope, name, count, definitions]) => {
    const dir = path.join(native, name);
    const receipt = read(path.join(dir, "receipt.json"));
    const stderr = fs.readFileSync(path.join(dir, "stderr.txt"), "utf8");
    assert.equal(receipt.cwd, cwd);
    assert.equal(receipt.exitCode, 0);
    assert.ok(stderr.includes(`Ran ${count} tests`) && /\nOK\s*$/.test(stderr));
    return {
      scope, status: "PASS", tests: count, rerun: false,
      receipt: evidence(path.join(dir, "receipt.json")),
      stderr: evidence(path.join(dir, "stderr.txt")),
      definitions: evidence(path.join(cwd, ".claude/skills/ld-s10y-lesson/tools", definitions)),
      command: receipt.command,
      coverage: scope === "targeted"
        ? "Section-card identity, heading normalization, page/title/kind eligibility, h1 enclosing laboratory with internal h3 experiments, fallback topic behavior and duplicate course-id protection before deleting existing outputs. Expected duplicate-id diagnostic is a passing negative test."
        : "Existing 16 production CLI workspace, reuse, fail-fast, receipt preservation and JSON-log parsing tests; this is not a claim of 16 additional scientific or all-content assembly tests.",
    };
  });
  const report = {
    schemaVersion: 1,
    status: "FAIL",
    task: "STEMROBIN-181 D496 FIRST INDEPENDENT REVIEW",
    reportKind: "FIRST_OVERALL_REPORT_IMMUTABLE",
    completedAt: new Date().toISOString(),
    cwd,
    course: "phy10-c4-s4",
    gates: { text: "FAIL", science: "PASS", modernFigure: "PASS", assembly: "PASS" },
    findings: [{
      id: "D496-TEXT-001",
      severity: "P2",
      gate: "text",
      status: "OPEN_TARGETED_REPAIR_REQUIRED",
      edition: "modern-us-neutral",
      locale: "zh",
      path: localLesson(editions[0]),
      line: 1461,
      jsonPointer: "/prose/88/text",
      zeroBasedBlockIndex: 88,
      sourceRefs: raw.prose[88].source_refs,
      sourceText: raw.prose[88].text,
      actualText: zh.prose[88].text,
      defect: "The source explanatory separator was converted into the repeated range word U+81F3 U+81F3. This breaks the appositional identification of the observed bright strip as the projected slit image. It is not a numeric range.",
      expectedTargetedRepair: "Replace only the two consecutive U+81F3 characters in current ZH prose[88].text with an explanatory Chinese colon U+FF1A. Keep source_text, raw/page source, quantities, formulas, procedure numbering and all other content unchanged.",
      acceptance: "D496a ZERO-image affected-text check in its separate directory verifies the exact replacement and unchanged remaining 109 ZH blocks, all 110 EN blocks and current figure bindings. No new image open or whole-lesson re-review is needed.",
      repairPerformedByReviewer: false,
      parentAcknowledgedFinding: true,
    }],
    limitations: [
      "This is the first independent text/source-preserving science/modern-figure/assembly review of the frozen inputs, not whole-course publication approval.",
      "Source-page images, old lessons, unrelated figures, old raw SVG approval and approved display were not opened or re-reviewed. Existing approved page text/source bindings were reused and independently reconciled.",
      "Scientific scope is modernization preserving the original procedures, apparatus, quantities and formulas. It does not certify specialist science, laboratory operation or safety, and does not silently lift historic SCI/HOLD evidence.",
      "The integrated preview was visually opened only once at native width 480px. Declared widths 240/288/320/358/384/480 were checked using bound current render reports and independent exact vector scaling. No headed product/offline390 media measurement or final display review is claimed.",
      "Existing 12 targeted and 16 regression receipts were reviewed without rerunning tests. Regression test_production.py covers production CLI behavior, not full curriculum correctness.",
      "Overall FAIL does not authorize review@1 PASS writes in this batch. Both scratch figure review files are untouched. D496a may write them after the targeted text passes and unchanged current spec/render/output/source bindings are verified.",
      "Native finalization, course render and the ONE later separate display-review batch remain with the parent; no course rendering was performed here.",
      "D493 formula-reference-order FAIL, historic prior FAIL/HOLD records, the CLOSED author actual2/8 and CLOSED historic reviewer23/24 are preserved. No history ledger scan, reopening, wake or reset occurred."
    ],
    reviewFreeze: evidence(freezePath),
    inputIntegrity: { status: "PASS", frozenInputs: freeze.records.length, allInputsAndSnapshotsUnchangedAtFirstReport: true, frozenBeforeImages: true },
    text: {
      status: "FAIL",
      completeRawAndLocaleBlocksAudited: 110,
      actualLocaleBlockReadings: 220,
      sourcePhysicalPages: [402, 409],
      sourcePrintedPages: [392, 399],
      instructionalSourceBlocksReconciled: 111,
      unaccountedInstructionalSourceBlocks: 0,
      explanationOf111To110: "The single unfinished step-3 sentence at p0408#17 joins p0409#1 in prose[107]. All other steps, standalone explanations, figure/caption and footnote remain independently accounted for.",
      zh: { completeness: "PASS", localization: "FAIL_PROSE88_ONLY", allOther109Blocks: "PASS" },
      en: { completeness: "PASS", localization: "PASS", all110Blocks: "PASS" },
      mathContainingBlocksPerLocale: 19,
      mathAndFormulaReferenceOrder: "PASS",
      currentEnProse73: "PASS; current formula/reference order equals raw and prior failure remains retained as history",
      report: evidence(path.join(out, "all-110-blocks-text-science-audit.json")),
      bindingCheck: evidence(path.join(out, "independent-binding-check.json")),
      priorMechanicalCheck: evidence(checksPath),
      mechanicalCheckQualification: "D494 PASS correctly establishes identity/formula/numeric checks but did not detect the current semantic separator defect.",
    },
    science: {
      status: "PASS",
      scope: "SOURCE_PRESERVING_MODERNIZATION_ONLY",
      observations: "All ten procedures and their materials, quantities, formula structures, ratio direction, optical terminology, angle/normal assignments, spectrum distinctions and experimental comparisons are preserved in the independently read whole lesson. The sole separator readability defect is reported under text.",
      sourceQualifications: [
        { blocks: [6, 7, 8], qualification: "The source records timing in minutes but does not explicitly restate consistent-unit conversion for g, define n separately or elaborate pendulum-length/small-angle assumptions. No invented values, rewritten formula or new certification were added." },
        { blocks: [43, 45, 46, 53, 55, 72, 73], qualification: "Mirror and lens procedures retain source qualitative distances, arm-length wording, distant-object focal-length approximation and 'any distance d1' wording. Focal/screen-real-image domain conditions are not expanded into a new protocol." },
        { blocks: [51, 78, 86, 88, 90, 91, 106, 109], qualification: "Historical apparatus and viewing procedures remain source-bound, including the concave-mirror letter support, high-voltage induction coil, beveled glass angles and photographic-plate fallback. Specialist or safety certification is outside this review." },
        { blocks: [105, 108], qualification: "Initial 0.5 mm and later 0.55-to-0.8 mm are distinct source quantities. The approved page text explicitly preserves them; the reviewer does not silently correct the source to make them equal." },
      ],
      historicalHoldsLifted: false,
    },
    modernFigure: {
      status: "PASS",
      figure: "fig-278",
      firstActualModernPixelReview: true,
      sharedLocales: editions,
      visibleLabels: fig.visibleLabels,
      noAnswerLeakage: true,
      sourceTopologyAndDirectedArcs: "PASS",
      declaredWidthLegibility: "PASS",
      report: evidence(path.join(out, "modern-figure-independent-review.json")),
      independentSourcePixelInventory: evidence(path.join(out, "independent-source-pixel-inventory.json")),
      currentBindings: read(integrationPath).records,
      reviewAt1FilesWritten: false,
      deferredUntil: "D496a ZERO-image targeted-text PASS with unchanged figure bindings",
      finalDisplayReview: "PENDING_SEPARATE_BATCH",
    },
    assembly: {
      status: "PASS",
      assemblyResult: evidence(assemblyPath),
      implementation: evidence(path.join(cwd, ".claude/skills/ld-s10y-lesson/tools/assemble.py")),
      narrowRepairAssessment: "Matching top-level h1 is claimed only by a unique unnumbered exercises TOC card with exact normalized printed name and printed page. Its internal experiment h3 headings remain inside one card; the state resets at subsequent h1/h2. Other section/exhead/numbered-topic behavior is retained. Duplicate course IDs are rejected before figure promotion or deletion of existing lesson outputs.",
      actualOutput: { courses: 1, experiments: 10, proseBlocks: 110, proseKinds: { h3: 10, p: 98, fig: 1, cap: 1 }, independentlyNumberedExercises: 0, figures: 1 },
      answerChoiceApplicability: "N/A",
      inventedQuestionsOrAnswerKeys: false,
      sourceChanged: false,
      tests,
      rightBoundary: { inheritedReport: evidence(stagePath("d1816-d490-source410-lab-right-boundary/report.json")), conclusion: "Laboratory ends before SOURCE410; no right-boundary image reopened." },
    },
    usage: {
      actualImageOpensThisBatch: 2,
      actualImageOpensThisReviewerContext: 2,
      batchLimit: 8,
      contextLimit: 24,
      opens: freeze.plannedImageOpens.map((r) => ({ ...r, tool: "functions.view_image", actual: true, reopened: false })),
      parentImageOpens: 0,
      paidCalls: 0,
      databaseWrites: false,
      publisherInvoked: false,
      contentEdits: false,
      courseRender: false,
      merge: false,
      deploy: false,
      ticketClosure: false,
      newBranchWorktreeOrChat: false,
      initializationOrBaselineGit: false,
      priorAuthorAndReviewerAwakenedOrReset: false,
    },
    firstReportPreservation: {
      writeOnce: true,
      doNotOverwrite: true,
      nextReviewDirectory: path.join(ticket, "d1816-d496a-laboratory-affected-review"),
      nextReviewNotStarted: true,
      reuse: "All other TEXT/SCI/modernFigure and assembly observations remain hash-bound to this first report. The parent repairs prose88 only and sends the separate ZERO-image affected-text task.",
    },
  };
  const reportPath = path.join(out, "report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n", { flag: "wx" });
  const finalization = {
    status: "FAIL",
    report: evidence(reportPath),
    reviewFreeze: evidence(freezePath),
    firstReportImmutable: true,
    actualImageOpens: 2,
    finalInputHashRecheck: "PASS",
  };
  fs.writeFileSync(path.join(out, "first-report-freeze.json"), JSON.stringify(finalization, null, 2) + "\n", { flag: "wx" });
  console.log(JSON.stringify(finalization, null, 2));
}
