import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { en, questions, zh } from "./prose.mjs";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
assert.equal(process.cwd(), repo, "Use only the authorized checkout.");
const card = "phy10-c2-s3-n83";
const base = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp");
const input = path.join(base, "d747-source225226-consume-prepare83");
const output = path.join(base, "d757-n83-first-bilingual-text-author");
const tools = path.join(repo, ".claude/skills/ld-s10y-lesson/tools");
const python = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const require = createRequire(import.meta.url);
const { proseOutline, sectionBreakIndices } = require(path.join(tools, "htmlfrag.js"));
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const fileHash = (file) => hash(fs.readFileSync(file));
const objectHash = (object) => hash(JSON.stringify(object));
const bind = (file) => ({ path: file, sha256: fileHash(file) });
const save = (file, value) => {
  assert.ok(file.startsWith(`${output}/`), "Refuse writes outside the owned directory.");
  assert.ok(!fs.existsSync(file), `Preserve existing output: ${file}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`);
};
const mathTokens = (text) => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)]
  .map((match) => match[0]);
const outsideMath = (text) => text.replace(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs, "");
const numbers = (text) => [...outsideMath(text).matchAll(/(?<![\w.])-?\d+(?:\.\d+)?(?!\w)/g)]
  .map((match) => match[0]);
const refs = (text) => [...text.matchAll(/(?:图 |Figure )(\d+)/g)].map((match) => match[1]);
const sequence = (lesson) => lesson.prose.flatMap((block) => [
  { kind: block.kind, id: block.id, refs: block.source_refs },
  ...mathTokens(block.text).map((literal) => ({ math: literal })),
  ...numbers(block.text).map((number) => ({ number })),
]);
const calls = [];
let stage = "source-preflight";
function run(command, args, stdin, receipt) {
  const result = spawnSync(command, args, {
    cwd: repo,
    input: stdin,
    encoding: "utf8",
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
    maxBuffer: 4 * 1024 * 1024,
  });
  const record = {
    stage,
    command: [command, ...args],
    cwd: repo,
    stdin_sha256: stdin === undefined ? null : hash(stdin),
    exitCode: result.status,
    signal: result.signal,
    error: result.error?.message ?? null,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
  calls.push(record);
  save(receipt, record);
  assert.equal(result.status, 0, `${stage}: ${record.stderr || record.error}`);
  return record.stdout;
}

try {
  const preparationPath = path.join(input, "preparation.json");
  const requirementsPath = path.join(input, "preauthor-source-requirements.json");
  const preparation = read(preparationPath);
  const requirements = read(requirementsPath);
  assert.equal(preparation.root, path.join(input, "root"));
  assert.equal(preparation.work, path.join(input, "work"));
  assert.equal(preparation.card, card);
  assert.equal(requirements.card, card);
  assert.equal(fileHash(requirementsPath), preparation.frozenRequirements.sha256);
  assert.equal(fileHash(requirementsPath),
    "71cc473697b8badeed0d5c3704820707e5e39d8dac0512fe66313792dce1f1e3");
  assert.deepEqual(requirements.boundary,
    { first: "p0222#5", last: "p0225#4", nextHeading: "p0225#5" });
  assert.equal(requirements.externalColorPlateIdentityApproved, false);
  assert.equal(requirements.modernAuthoringBeforeFreeze, false);
  assert.equal(requirements.wholeCardApproved, false);
  assert.equal(requirements.sourceQuestions, 3);
  assert.equal(preparation.sourceQuestions, 3);
  assert.equal(preparation.completeCard, false);
  assert.ok(!fs.existsSync(path.join(output, "candidates")), "Do not repeat passed authors.");
  const rawDir = path.join(preparation.root, "10p/lessons", card);
  const workDir = path.join(preparation.work, "adapt/10p/modern-us-neutral/lessons", card);
  const lessonPath = path.join(rawDir, "lesson.json");
  const exercisesPath = path.join(rawDir, "exercises.json");
  const templatePath = path.join(workDir, "lesson.template.json");
  const exerciseTemplatePath = path.join(workDir, "exercises.template.json");
  const figureTemplatePath = path.join(workDir, "figures.template.json");
  const upstreamFailurePath = path.join(repo, preparation.firstTechnicalFAIL.path);
  const page225Path = path.join(preparation.root, "10p/pages/0225/page.json");
  const inputs = [
    preparationPath, requirementsPath, upstreamFailurePath,
    lessonPath, exercisesPath, templatePath, exerciseTemplatePath, figureTemplatePath,
    page225Path,
    path.join(tools, "edition.py"), path.join(tools, "prose_flow.mjs"),
    path.join(tools, "htmlfrag.js"),
    ...["author.mjs", "prose.mjs", "normalize.py"].map((name) => path.join(output, "scripts", name)),
    ...["first-failure.json", "attempt-2-failure.json", "preflight-recovery.json"]
      .map((name) => path.join(output, "reports", name)).filter((file) => fs.existsSync(file)),
  ];
  const before = inputs.map(bind);
  assert.equal(fileHash(lessonPath), preparation.rawLesson.sha256);
  assert.equal(fileHash(exercisesPath), preparation.rawExercises.sha256);
  assert.equal(fileHash(upstreamFailurePath), preparation.firstTechnicalFAIL.sha256);
  const raw = read(lessonPath);
  const rawExercises = read(exercisesPath);
  const template = read(templatePath);
  const exerciseTemplate = read(exerciseTemplatePath);
  const figureTemplate = read(figureTemplatePath);
  const nextHeading = read(page225Path).blocks[4];
  assert.equal(nextHeading.kind, "h3");
  assert.match(nextHeading.lines.join(""), /^(?:\*\*)?84\.\s*光的干涉(?:\*\*)?$/);
  assert.equal(raw.printed_title, requirements.blocks[0].lines.join(""));
  assert.deepEqual(template.source.data, raw);
  assert.deepEqual(exerciseTemplate.source.data, rawExercises);
  assert.deepEqual(raw.figures.map((figure) => figure.id), requirements.figureIds);
  assert.deepEqual(figureTemplate.figures.map((figure) => figure.id), requirements.figureIds);
  assert.equal(raw.exercise_count, 3);
  assert.equal(rawExercises.count, 3);
  assert.deepEqual(rawExercises.exercises.map((item) => item.number), ["1", "2", "3"]);
  assert.deepEqual(rawExercises.exercises.map((item) => item.pages),
    [["p0225#2"], ["p0225#3"], ["p0225#4"]]);

  const preparedCandidates = [];
  const history = [
    ["牛顿", "Newton"],
    ["《光学》", "Opticks"],
    ["罗默", "Roemer"],
    ["木星", "Jupiter"],
  ];
  for (const [locale, texts] of [["zh", zh], ["en", en]]) {
    assert.equal(texts.length, raw.prose.length);
    const lesson = structuredClone(template);
    const exercises = structuredClone(exerciseTemplate);
    lesson.locale = exercises.locale = locale;
    lesson.title = locale === "en" ? "Dispersion of Light" : raw.title;
    const authoring = {
      stage: "FIRST-BILINGUAL-TEXT-AUTHOR",
      revision: "d757-r1",
      review_status: "NOT-REVIEWED",
      whole_card_approved: false,
      images_opened: 0,
      images_authored: 0,
      answers_authored: 0,
      choices_authored: 0,
    };
    lesson.authoring = structuredClone(authoring);
    exercises.authoring = structuredClone(authoring);
    lesson.external_dependencies = requirements.externalColorPlateReferences.map((literal) => ({
      source_ref: "p0223#5",
      literal_reference: literal,
      identity_approved: false,
      identity: null,
      asset: null,
      status: "PLATE-IDENTITY-AND-OWNERSHIP-PENDING",
    }));
    lesson.prose.forEach((block, index) => {
      block.text = texts[index];
      block.changes = block.kind === "p"
        ? ["wording", "layout", ...(locale === "en" ? ["translation"] : [])]
        : block.text !== block.source_text ? ["translation"] : [];
      block.historical_entities = history.filter(([term]) => block.source_text.includes(term))
        .map(([term, localized]) => ({
          term,
          localized_term: locale === "en" ? localized : term,
          source_refs: [...block.source_refs],
          reason: `${block.source_refs.join(", ")} retains the source-bound historical `
            + `${localized} identity, not a fictional cultural setting.`,
        }));
      assert.deepEqual(mathTokens(block.text), mathTokens(block.source_text),
        `${locale} prose[${index}] mathematical token order`);
      assert.deepEqual(numbers(block.text), numbers(block.source_text),
        `${locale} prose[${index}] numerical order`);
      assert.deepEqual(refs(block.text), refs(block.source_text),
        `${locale} prose[${index}] figure reference order`);
      for (const declaration of block.historical_entities) {
        assert.ok(block.text.includes(declaration.term), `${locale} ${declaration.term}`);
        assert.ok(block.source_text.includes(declaration.term));
        if (locale === "en") assert.ok(block.text.includes(declaration.localized_term));
      }
    });
    assert.deepEqual(sequence(lesson), sequence(raw));
    for (const literal of requirements.externalColorPlateReferences) {
      assert.equal([...lesson.prose[5].text.matchAll(new RegExp(`${literal}(?!I)`, "g"))].length, 1);
    }
    assert.equal((zh[2].match(/七/g) ?? []).length, (raw.prose[2].text.match(/七/g) ?? []).length);
    assert.equal((en[2].match(/\bseven\b/g) ?? []).length, 3);
    assert.ok(zh[2].includes("紫、靛、蓝、绿、黄、橙黄、红"));
    assert.ok(en[2].includes("violet, indigo, blue, green, yellow, orange-yellow, and red"));
    exercises.exercises.forEach((item, index) => {
      item.text = questions[locale][index];
      item.lines = item.text.split("\n");
      item.changes = ["wording", "layout", ...(locale === "en" ? ["translation"] : [])];
      assert.deepEqual(numbers(item.text), numbers(item.source_text));
      assert.deepEqual(mathTokens(item.text), mathTokens(item.source_text));
      for (const field of ["number", "source_number", "group", "group_id", "pages", "figure_refs", "figures"]) {
        assert.deepEqual(item[field], rawExercises.exercises[index][field]);
      }
      if (index === 1) {
        assert.equal(item.text.split("优").length - 1, 2);
        assert.equal(item.text.split("良").length - 1, 1);
      }
      for (const forbidden of ["answer", "answerKey", "correct_index", "choices", "interaction"]) {
        assert.equal(item[forbidden], undefined);
      }
    });
    preparedCandidates.push({ locale, lesson, exercises });
  }
  save(path.join(output, "reports/preflight.json"), {
    status: "PASS-AUTHOR-MECHANICAL-PREFLIGHT-NOT-REVIEW",
    revision: "d757-r1",
    source_hashes_verified: true,
    upstream_first_failure: bind(upstreamFailurePath),
    upstream_first_failure_preserved: read(upstreamFailurePath),
    local_first_failure: fs.existsSync(path.join(output, "reports/first-failure.json"))
      ? bind(path.join(output, "reports/first-failure.json")) : null,
    local_preflight_recovery: fs.existsSync(path.join(output, "reports/preflight-recovery.json"))
      ? bind(path.join(output, "reports/preflight-recovery.json")) : null,
    inventory_probe: {
      command: ["ls", "-ld",
        ".intentfold/tickets/STEMROBIN-181/tmp/d757-n83-first-bilingual-text-author",
        ".claude/skills/ld-s10y-lesson/.venv/bin/python"],
      cwd: repo,
      exitCode: 1,
      classification: "EXPECTED-OWNED-DIRECTORY-ABSENT-BEFORE-FIRST-AUTHOR-NOT-NATIVE-FAIL",
      stdout_summary: "Existing native Python symlink found.",
      stderr: "ls: .intentfold/tickets/STEMROBIN-181/tmp/d757-n83-first-bilingual-text-author: No such file or directory",
    },
    boundary: requirements.boundary,
    next_heading: { ref: "p0225#5", kind: nextHeading.kind, lines: nextHeading.lines },
    normalizer_invocations_before_preflight: 0,
    prose_flow_invocations_before_preflight: 0,
    ownership: { checkout: repo, only_writable_root: output },
  });

  const candidates = [];
  for (const payload of preparedCandidates) {
    const { locale } = payload;
    stage = `${locale}-native-normalization`;
    const stdin = JSON.stringify({ lesson: payload.lesson, exercises: payload.exercises });
    const normalized = JSON.parse(run(python,
      ["-B", path.join(output, "scripts/normalize.py")], stdin,
      path.join(output, "reports", `${locale}-normalizer-receipt.json`)));
    const { lesson, exercises } = normalized;
    const normalizedPath = path.join(output, "reports", `${locale}-normalized-input.json`);
    save(normalizedPath, lesson);
    const normalizedExercisesPath = path.join(output, "reports", `${locale}-normalized-exercises.json`);
    save(normalizedExercisesPath, exercises);
    stage = `${locale}-prose-flow`;
    const flowStdout = run("node", [path.join(tools, "prose_flow.mjs"), normalizedPath],
      undefined, path.join(output, "reports", `${locale}-prose-flow-receipt.json`));
    const adjacent = flowStdout.split("\n").filter((line) => line.startsWith("    break: "))
      .map((line) => JSON.parse(line.slice("    break: ".length)));
    const paragraphs = proseOutline(lesson.prose);
    const transitionRefs = ["p0223#1", "p0223#5", "p0223#6", "p0224#2", "p0224#5", "p0224#6"];
    lesson.section_breaks = transitionRefs.map((ref) => {
      const blockIndex = lesson.prose.findIndex((block) => block.source_refs.includes(ref));
      const first = paragraphs.find((paragraph) =>
        paragraph.blockIndex === blockIndex && paragraph.paragraphInBlock === 0);
      assert.ok(first, `No paragraph for ${ref}`);
      const matches = adjacent.filter((pair) => pair.after === first.text);
      assert.equal(matches.length, 1, `Boundary must be uniquely tool-derived for ${ref}`);
      return { before: matches[0].before, after: matches[0].after };
    });
    const resolved = sectionBreakIndices(lesson.prose, lesson.section_breaks);
    assert.deepEqual(lesson.source, template.source);
    assert.deepEqual(exercises.source, exerciseTemplate.source);
    assert.deepEqual(lesson.figures, raw.figures);
    assert.equal(lesson.printed_title, raw.printed_title);
    assert.deepEqual(sequence(lesson), sequence(raw));
    const mapping = lesson.prose.map((block, index) => {
      const source = raw.prose[index];
      for (const field of ["kind", "id", "label", "printed_page", "source_refs"]) {
        assert.deepEqual(block[field], source[field]);
      }
      assert.equal(block.source_text, source.text);
      assert.deepEqual(mathTokens(block.text), mathTokens(source.text));
      assert.deepEqual(numbers(block.text), numbers(source.text));
      assert.deepEqual(refs(block.text), refs(source.text));
      assert.deepEqual(block.numeric_changes, []);
      return {
        target: `prose[${index}]`,
        source_refs: source.source_refs,
        source_block_sha256: objectHash(source),
        source_text_sha256: hash(source.text),
        modern_text_sha256: hash(block.text),
        literal_math_tokens: mathTokens(block.text),
        nonmath_number_tokens: numbers(block.text),
        ordered_figure_references: refs(block.text),
        paragraph_indices: paragraphs.filter((paragraph) => paragraph.blockIndex === index)
          .map((paragraph) => paragraph.index),
        historical_entities: block.historical_entities,
      };
    });
    const paragraphGroups = paragraphs.map((paragraph) => {
      const text = outsideMath(paragraph.text);
      const sentenceCount = locale === "zh" ? (text.match(/[。！？]/g) ?? []).length
        : (text.match(/[.!?](?=\s|$)/g) ?? []).length;
      assert.ok(sentenceCount >= 2 && sentenceCount <= 3,
        `${locale} paragraph[${paragraph.index}] has ${sentenceCount} complete sentences`);
      return { ...paragraph, complete_sentence_count: sentenceCount };
    });
    const exerciseMapping = exercises.exercises.map((item, index) => {
      const source = rawExercises.exercises[index];
      assert.equal(item.source_text, source.text);
      assert.deepEqual(mathTokens(item.text), mathTokens(source.text));
      assert.deepEqual(numbers(item.text), numbers(source.text));
      return {
        target: `exercises[${index}]`,
        number: item.number,
        source_number: item.source_number,
        group: item.group,
        group_id: item.group_id,
        source_refs: item.pages,
        figure_refs: item.figure_refs,
        source_text_sha256: hash(source.text),
        modern_text_sha256: hash(item.text),
        status: "WRITTEN-QUESTION-ONLY-NOT-ANSWERED",
      };
    });
    const dir = path.join(output, "candidates", locale, card);
    const lessonCandidate = path.join(dir, "lesson.template.json");
    const exercisesCandidate = path.join(dir, "exercises.template.json");
    const textCandidate = path.join(dir, "lesson.md");
    const questionCandidate = path.join(dir, "exercises.md");
    save(lessonCandidate, lesson);
    save(exercisesCandidate, exercises);
    save(textCandidate, `# ${lesson.title}\n\n${lesson.prose.map((block) =>
      block.kind === "fig" ? `<!-- retained source slot ${block.id}; artwork pending -->`
        : block.text).join("\n\n")}\n`);
    save(questionCandidate, `${exercises.exercises.map((item) => item.text).join("\n\n")}\n`);
    const mappingPath = path.join(output, "reports", `${locale}-source-mapping.json`);
    save(mappingPath, { prose: mapping, written_questions: exerciseMapping });
    const flowPath = path.join(output, "reports", `${locale}-prose-flow.json`);
    save(flowPath, {
      native_tool_revision: bind(path.join(tools, "prose_flow.mjs")),
      invocation_count: 1,
      stdout: flowStdout,
      all_tool_derived_adjacent_boundaries: adjacent,
      selected_section_breaks: lesson.section_breaks,
      resolved_indices_from_existing_api: resolved,
      paragraph_groups: paragraphGroups,
      all_paragraphs_have_2_or_3_complete_sentences: true,
    });
    candidates.push({
      locale,
      revision: "d757-r1",
      lesson: bind(lessonCandidate),
      exercises: bind(exercisesCandidate),
      text: bind(textCandidate),
      written_questions: bind(questionCandidate),
      source_mapping: bind(mappingPath),
      prose_flow: bind(flowPath),
      source_prose_blocks: raw.prose.length,
      prose_paragraphs: paragraphs.length,
      written_question_count: exercises.exercises.length,
      section_break_count: lesson.section_breaks.length,
      native_normalization_invocations: 1,
      native_prose_flow_invocations: 1,
    });
  }
  stage = "coverage-and-report";
  const frozenBlockMapping = requirements.blocks.map((block) => {
    const proseTargets = raw.prose.flatMap((item, index) =>
      item.source_refs.includes(block.ref) ? [`prose[${index}]`] : []);
    const questionTargets = rawExercises.exercises.flatMap((item, index) =>
      item.pages.includes(block.ref) ? [`exercises[${index}]`] : []);
    const role = block.kind === "h3" ? "EXACT-PRINTED-TITLE-SNAPSHOT"
      : block.kind === "foot" ? "PRINTED-FOLIO-FROZEN-SOURCE-ONLY"
        : block.kind === "exhead" ? "QUESTION-GROUP-AND-GROUP-ID-PRESERVED"
          : "SOURCE-BOUND-CANDIDATE-TARGET";
    const targets = block.kind === "h3" ? ["printed_title"]
      : block.kind === "exhead" ? ["exercises[*].group", "exercises[*].group_id"]
        : [...proseTargets, ...questionTargets];
    if (role === "SOURCE-BOUND-CANDIDATE-TARGET") assert.equal(targets.length, 1);
    return {
      ref: block.ref, kind: block.kind, role, targets,
      frozen_block_sha256: objectHash(block),
      figure_box: block.kind === "fig" ? block.box : null,
      status: "AUTHOR-COVERAGE-ONLY-NOT-REVIEW-PASS",
    };
  });
  const targets = [
    ["frozen_block_mapping", "both-source-mappings", "exact-source-wrappers", "three-written-questions"],
    ["prose[0]", "prose[2]", "prose[5]", "prose[6]", "prose[7]", "prose[10]", "prose[11]", "scientific_limits"],
    ["prose[5]", "external_dependencies", "PLATE-IDENTITY-PENDING", "no-artwork"],
    ["preflight.next_heading", "p0225#5-EXCLUDED", "source84-INCOMPLETE-UNAPPROVED"],
    ["SCI-PENDING", "ZHEN-PENDING", "FIG-PENDING", "ANSWERS-PENDING", "CHOICES-PENDING", "DISPLAY-PENDING"],
    ["source218-localHOLD-UNTOUCHED", "paid181-bytes-localHOLD-UNTOUCHED", "scope-exclusions"],
  ];
  assert.equal(targets.length, requirements.requirements.length);
  const scientificLimits = [
    {
      id: "SCI-ANGLE-INDEPENDENCE",
      refs: ["p0222#6"],
      explanation: "Fixed material/state, homogeneous and isotropic ordinary transparent material. "
        + "Angle independence is not generalized to anisotropic or nonlinear systems.",
    },
    {
      id: "SCI-SEVEN-NAMES-NOT-SEVEN-DISCRETE-COMPONENTS",
      refs: ["p0223#1", "p0223#4"],
      explanation: "Retains three mentions of seven and the exact violet-to-red list including "
        + "orange-yellow; distinguishes the historical naming convention from continuous sunlight.",
    },
    {
      id: "SCI-FILTER-AND-RECOMBINATION",
      refs: ["p0223#5"],
      explanation: "Red/blue aperture tests, separating rather than dyeing light, literal plate I/II "
        + "references, exact 180-degree formula, complete recombination with suitable geometry, "
        + "and selected green light are retained. A turn alone is not sufficient; a finite green "
        + "band can disperse further. No optical geometry or plate identity is approved.",
    },
    {
      id: "SCI-NORMAL-DISPERSION-AND-PHASE-SPEED",
      refs: ["p0223#6", "p0224#1", "p0224#5"],
      explanation: "Violet-largest/red-smallest index and red-fastest/violet-slowest speed are scoped "
        + "to the ordinary glass/visible-light case. Speed denotes phase speed, not an unconditional "
        + "signal or photon-trajectory statement. Vacuum colour speeds are distinguished.",
    },
    {
      id: "SCI-ROEMER-HISTORICAL-LIMIT",
      refs: ["p0224#5"],
      explanation: "Retains Roemer, Jupiter satellite literal $1$, red emergence, violet before "
        + "entry, and absence of that effect as the source's historical argument. Its absence alone "
        + "is not treated as a precise independent vacuum-speed proof or measurement.",
    },
    {
      id: "SCI-REFLECTION-ABSORPTION-IDEALIZATIONS",
      refs: ["p0224#6"],
      explanation: "Retains white paper, red coating, grass/leaves, sunlight, reflection versus "
        + "absorption, ideal red-only glass and almost-black observation. 'Only red/green' is marked "
        + "as the source's idealization; real objects mainly reflect those colours. Assumes ordinary "
        + "non-emitting, non-colour-converting objects.",
    },
    {
      id: "SCI-WRITTEN-QUESTION-3-OBSERVABILITY",
      refs: ["p0225#4"],
      explanation: "Adds 'clearly separated' to the original narrow-beam spectrum question, avoiding "
        + "the implication that a broad beam contains no dispersed components. Narrow/wide beam "
        + "contrast and colour-only-at-edges premise are retained for independent review, not answered.",
    },
    {
      id: "ZHEN-HISTORICAL-ALIASES-AND-WRITTEN-MARKS",
      refs: ["p0222#6", "p0222#7", "p0223#1", "p0223#5", "p0223#6", "p0224#2", "p0224#5", "p0225#3"],
      explanation: "English preserves Chinese source-bound scientist/book/planet aliases to satisfy "
        + "the current source declaration contract. Exercise retains literal 优/良 marks with "
        + "Excellent/Good glosses, the green mark to the left of the red mark, both glass colours "
        + "and the original request. Translation and age-eight clarity still need ZHEN review.",
    },
  ].map((item) => ({ ...item, status: "PENDING-INDEPENDENT-SCI-OR-ZHEN-REVIEW" }));
  const after = inputs.map(bind);
  assert.deepEqual(after, before, "Read-only input bytes changed during authoring.");
  const report = {
    ticket: "STEMROBIN-181",
    card,
    author: "d757",
    candidate_revision: "d757-r1",
    semantic_revisions_after_first_emission: 0,
    status: "FIRST-BILINGUAL-TEXT-CANDIDATES-NOT-REVIEWED",
    review_pass: false,
    whole_card_approved: false,
    scope: { checkout: repo, only_writable_root: output, boundary: requirements.boundary },
    native_source_root: preparation.root,
    native_preparation_work: preparation.work,
    frozen_requirements: bind(requirementsPath),
    preparation: bind(preparationPath),
    source_lesson: bind(lessonPath),
    source_exercises: bind(exercisesPath),
    source_wrappers_preserved: true,
    source_order_sha256: objectHash(sequence(raw)),
    literal_math_sequence: raw.prose.flatMap((block) => mathTokens(block.text)),
    preserved_figures: {
      figures: raw.figures,
      actual_assembled_order: raw.prose.map((block, index) => ({
        index, kind: block.kind, id: block.id, source_refs: block.source_refs,
      })),
      slots: [
        { id: "fig-196", prose_index: 3, caption_index: 4, source_refs: ["p0223#2", "p0223#3"] },
        { id: "fig-197", prose_index: 8, caption_index: 9, source_refs: ["p0224#3", "p0224#4"] },
      ],
      note: "The merged p0223#1/p0223#4 source prose remains before fig-196; fig/cap blocks "
        + "are retained in their actual assembled positions. Figure metadata and frozen crop boxes "
        + "are source facts, not independently inspected inventories or artwork approvals.",
      upstream_figure_template: bind(figureTemplatePath),
      source_asset_bindings_from_preparation: figureTemplate.figures.map(({ id, source }) => ({ id, source })),
      source_images_opened: 0,
      fidelity_review: "PENDING",
    },
    external_color_plates: {
      references: requirements.externalColorPlateReferences,
      source_ref: "p0223#5",
      literals_retained_in_both_locales: true,
      identity_approved: false,
      ownership_approved: false,
      files_or_assets_assigned: [],
      status: "IDENTITY-AGENT-PENDING-NOT-SOLVED",
    },
    frozen_block_mapping: frozenBlockMapping,
    requirements_coverage: requirements.requirements.map((requirement, index) => ({
      requirement,
      requirement_sha256: hash(requirement),
      targets: targets[index],
      status: "AUTHOR-COVERAGE-ONLY-NOT-REVIEW-PASS",
    })),
    candidates,
    counts: {
      source_prose_blocks: raw.prose.length,
      source_written_questions: 3,
      zh_written_questions: 3,
      en_written_questions: 3,
      images_opened: 0,
      images_authored: 0,
      answers_consulted: 0,
      answers_authored: 0,
      choices_consulted: 0,
      choices_authored: 0,
      paid_calls: 0,
      native_normalization_invocations: 2,
      native_prose_flow_invocations: 2,
    },
    exact_calls: calls.map(({ stdout, stderr, ...call }) => ({
      ...call, stdout_sha256: hash(stdout), stderr_sha256: hash(stderr),
    })),
    call_receipts: candidates.flatMap(({ locale }) => [
      bind(path.join(output, "reports", `${locale}-normalizer-receipt.json`)),
      bind(path.join(output, "reports", `${locale}-prose-flow-receipt.json`)),
    ]),
    scientific_limits: scientificLimits,
    preservation: { before, after, unchanged: true },
    upstream_first_failed_receipt: bind(upstreamFailurePath),
    upstream_failure_replayed: false,
    local_first_failed_receipt: fs.existsSync(path.join(output, "reports/first-failure.json"))
      ? bind(path.join(output, "reports/first-failure.json")) : null,
    local_preflight_recovery: fs.existsSync(path.join(output, "reports/preflight-recovery.json"))
      ? bind(path.join(output, "reports/preflight-recovery.json")) : null,
    author_calls: [
      {
        command: ["node", path.join(output, "scripts/author.mjs")],
        cwd: repo,
        exitCode: 1,
        script_sha256: "e5aebcdcfd1d91b215b2b882ec2c4abdf9be80e5670f25a8c00c906d93e6b814",
        native_calls: 0,
        stage: "source-preflight",
      },
      {
        command: ["node", path.join(output, "scripts/author.mjs")],
        cwd: repo,
        exitCode: 1,
        script_sha256: "cf88c0a50752d0358d369ba52ecbcf97a073d610cfee529ebf542d4554ae860e",
        native_calls: 0,
        stage: "source-preflight-english-terminal-number-check",
      },
      {
        command: ["node", path.join(output, "scripts/author.mjs")],
        cwd: repo,
        exitCode: 0,
        script_sha256: fileHash(path.join(output, "scripts/author.mjs")),
        native_calls: calls.length,
        stage: "source-preflight-recovery-and-first-native-authoring",
      },
    ],
    native_tool_revisions: ["edition.py", "prose_flow.mjs", "htmlfrag.js"]
      .map((name) => bind(path.join(tools, name))),
    prior_pattern_reference: path.join(base, "d732-n82-first-bilingual-text-author/scripts/author.mjs"),
    pending_gates: [
      "SCI", "ZHEN", "external-plate-identity-and-ownership", "figures", "artwork", "answers",
      "choices", "native-adapt-finalize", "render", "canonical-retention", "display", "review-approval",
    ],
    untouched_local_holds: ["source218 ambiguity", "lost paid181 bytes", "incomplete source84"],
    exclusions: [
      "canonical", "shared-evidence", "meter", "index", "Git", "backend", "DB", "publisher", "services",
      "chats", "subagents", "full-tests", "new-packages", "images", "artwork", "answers", "choices",
      "native-adapt-finalize", "render", "review-approval", "deployment", "merge", "closure",
    ],
    prohibited_operations_performed: [],
  };
  const reportPath = path.join(output, "reports/author-report.json");
  save(reportPath, report);
  const hashesPath = path.join(output, "reports/hashes.json");
  save(hashesPath, { revision: "d757-r1", candidates, author_report: bind(reportPath) });
  process.stdout.write(`${JSON.stringify({
    status: report.status,
    candidates,
    counts: report.counts,
    report: bind(reportPath),
    hashes: bind(hashesPath),
    pending_gates: report.pending_gates,
  }, null, 2)}\n`);
} catch (error) {
  let attempt = 1;
  let failurePath = path.join(output, "reports/first-failure.json");
  while (fs.existsSync(failurePath)) {
    attempt += 1;
    failurePath = path.join(output, "reports", `attempt-${attempt}-failure.json`);
  }
  save(failurePath, {
    status: "FAIL",
    stage,
    error: error.stack ?? String(error),
    completed_call_count: calls.length,
    calls,
    classification: "AUTHOR-OR-TECHNICAL-FAILURE-NOT-INDEPENDENT-SCI-VERDICT",
    review_pass: false,
    whole_card_approved: false,
  });
  console.error(error);
  process.exitCode = 1;
}
