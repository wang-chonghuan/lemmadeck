import fs from "node:fs";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const root = ".intentfold/tickets/STEMROBIN-182/tmp/";
const own = `${root}reviewer-8a-modern/`;
const source = `${root}batch16-source/8a/`;
const work = `${root}batch16-work/adapt/8a/modern-us-neutral/`;
const table = `${work}figure-authoring/tbl-p0011-01/`;
const hash = path => crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
const read = path => JSON.parse(fs.readFileSync(path, "utf8"));
const bind = path => ({ path, sha256: hash(path) });
const maths = text => [...text.matchAll(/\$([^$]+)\$/g)].map(m => m[1]);
const normalizeExercise = text => text
  .replace(/[абвгдежз](?=\))/g, c => "abcdefgh"["абвгдежз".indexOf(c)])
  .replaceAll("Б", "B")
  .replace(/\s+/gu, "");
const baselinePath = `${own}source-baseline.json`;
const baseline = read(baselinePath);
const independentSourceBindings = [
  baseline.pdf,
  ...baseline.actual_pdf_pixels_opened,
  ...baseline.raw_inputs,
  { path: baseline.table_inventory_before_modern_spec.source_image,
    sha256: baseline.table_inventory_before_modern_spec.source_sha256 }
];
for (const entry of independentSourceBindings) assert.equal(hash(entry.path), entry.sha256);

const lessons = [];
for (const number of [1, 2]) {
  const id = `alg8-c1-s1-n${number}`;
  const rawBase = `${source}lessons/${id}/`;
  const modernBase = number === 1
    ? `${source}editions/modern-us-neutral/lessons/${id}/`
    : `${work}lessons/${id}/`;
  const suffix = number === 1 ? ".json" : ".template.json";
  const bindings = {};
  const documents = {};
  for (const kind of ["lesson", "exercises", "figures"]) {
    const path = `${modernBase}${kind}${suffix}`;
    bindings[kind] = bind(path);
    documents[kind] = read(path);
  }
  const rawLessonPath = `${rawBase}lesson.json`;
  const rawExercisePath = `${rawBase}exercises.json`;
  const rawLesson = read(rawLessonPath);
  const rawExercises = read(rawExercisePath);
  const lesson = documents.lesson;
  const exercises = documents.exercises;
  assert.deepEqual(lesson.source.data, rawLesson);
  assert.deepEqual(exercises.source.data, rawExercises);
  assert.equal(lesson.source.sha256, hash(rawLessonPath));
  assert.equal(exercises.source.sha256, hash(rawExercisePath));
  assert.equal(lesson.id, rawLesson.id);
  assert.equal(lesson.prose.length, rawLesson.prose.length);
  assert.equal(exercises.exercises.length, rawExercises.exercises.length);
  const prose = lesson.prose.map((entry, index) => {
    const raw = rawLesson.prose[index];
    assert.equal(entry.source_text, raw.text);
    assert.deepEqual(maths(entry.text), maths(raw.text));
    for (const field of ["kind", "id", "label", "printed_page", "source_refs"]) {
      assert.deepEqual(entry[field], raw[field]);
    }
    return {
      index,
      kind: entry.kind,
      source_refs: entry.source_refs,
      formulas: maths(entry.text),
      formula_sequence_exact: true,
      original_source_text_exact: true,
      provenance_exact: true
    };
  });
  const exerciseChecks = exercises.exercises.map((entry, index) => {
    const raw = rawExercises.exercises[index];
    assert.equal(entry.source_text, raw.text);
    assert.equal(normalizeExercise(entry.text), normalizeExercise(raw.text));
    assert.deepEqual(maths(entry.text), maths(raw.text));
    for (const field of ["number", "source_number", "group", "group_id", "pages", "figure_refs", "figures"]) {
      assert.deepEqual(entry[field], raw[field]);
    }
    const parts = entry.lines.filter(line => /^[a-h]\)/.test(line));
    const expected = baseline[`n${number}`].ordered_subpart_counts[index];
    assert.equal(parts.length, expected);
    return {
      source_number: entry.source_number,
      source_pages: entry.pages,
      subpart_count: parts.length,
      ordered_subpart_texts: parts,
      formulas: maths(entry.text),
      formula_sequence_exact: true,
      full_text_equal_except_whitespace_and_enumeration_and_formula_B: true,
      original_source_text_exact: true,
      provenance_exact: true
    };
  });
  lessons.push({
    id,
    current_status: lesson.status,
    bindings,
    raw_lesson: bind(rawLessonPath),
    raw_exercises: bind(rawExercisePath),
    embedded_raw_data_exact: true,
    raw_digest_binding_exact: true,
    exercise_count: exerciseChecks.length,
    subpart_count: exerciseChecks.reduce((sum, ex) => sum + ex.subpart_count, 0),
    prose,
    exercises: exerciseChecks
  });
}

const specPath = `${table}spec.json`;
const renderPath = `${table}render.json`;
const svgPath = `${table}tbl-p0011-01.svg`;
const spec = read(specPath);
const render = read(renderPath);
assert.equal(hash(spec.source.image.path), spec.source.image.sha256);
assert.equal(render.spec.path, specPath);
assert.equal(render.spec.sha256, hash(specPath));
assert.equal(render.output.svg.path, svgPath);
assert.equal(render.output.svg.sha256, hash(svgPath));
assert.equal(render.status, "pass");
assert.equal(spec.objects.length, 20);
assert.equal(spec.objects.filter(o => o.type === "text").length, 18);
const capturePath = `${work}evidence/actual-visual-checks.json`;
const captures = read(capturePath);
const screens = captures.records.filter(record => record.kind === "table-actual-svg").map(record => {
  assert.equal(hash(record.screenshot.path), record.screenshot.sha256);
  const png = fs.readFileSync(record.screenshot.path);
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  assert.equal(width, record.width);
  assert.equal(height, 320);
  const name = record.screenshot.path.split("/").at(-1);
  return {
    filename: name,
    ...record.screenshot,
    pixel_dimensions: [width, height],
    independently_opened_before_recording: true,
    opening_tool: "view_image",
    capture_metrics: record.metrics
  };
});
assert.equal(screens.length, 12);
for (const theme of ["neutral", "accent", "print"]) {
  for (const part of ["full-640", "390-left", "390-middle", "390-right"]) {
    assert.equal(screens.filter(s => s.filename === `${theme}-${part}.png`).length, 1);
  }
}
const output = {
  stage: "read-only-binding-of-already-reviewed-content-and-actual-images",
  independent_source_baseline: bind(baselinePath),
  original_inputs_still_match_independent_baseline: true,
  lessons,
  table: {
    source: bind(spec.source.image.path),
    spec: bind(specPath),
    render: bind(renderPath),
    svg: bind(svgPath),
    current_source_spec_output_bindings_exact: true,
    render_status: render.status,
    objects: render.objects,
    labels: render.labels,
    collisions: render.collisions,
    existing_display_checks: render.displayChecks,
    capture_metadata: bind(capturePath),
    capture_browser_configuration: captures.browser,
    screenshot_binding_limitation: "Existing capture records identify actual SVG table views and bind their PNG bytes. Current source/spec/render/SVG bytes are independently hashed. The captures contain no separate SVG digest, so a cryptographic raster-to-SVG provenance certificate is not claimed; visual content, label positions and viewport metrics were independently compared to this current SVG/spec. No recapture was performed.",
    actual_opened_images: screens
  },
  boundary: {
    new_browser_sessions: 0,
    new_render_commands: 0,
    canonical_commands: 0,
    author_or_durable_edits: 0,
    parent_or_author_mathematical_notes_read: false
  },
  model: null,
  usage: null
};
fs.writeFileSync(`${own}reviewed-snapshot.json`, JSON.stringify(output, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({
  status: "pass",
  path: `${own}reviewed-snapshot.json`,
  sha256: hash(`${own}reviewed-snapshot.json`),
  lessons: lessons.map(l => ({ id: l.id, exercises: l.exercise_count, subparts: l.subpart_count, status: l.current_status })),
  table_images: screens.length,
  command_kind: "read-only input comparison with reviewer scratch evidence output; not renderer or canonical gate"
}, null, 2));
