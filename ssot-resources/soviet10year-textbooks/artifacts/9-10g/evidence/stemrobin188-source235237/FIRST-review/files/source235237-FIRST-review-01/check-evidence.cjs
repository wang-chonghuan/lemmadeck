const t = require("./evidence-tools.cjs");
const path = require("node:path");
const json = (file) => JSON.parse(t.read(file));
const base = ".intentfold/tickets/STEMROBIN-188/tmp/";
const manifest = json(base + "source235237-review-inputs-01/manifest.json");
const joint = json(base + "source235237-n48figure27-review-inputs-01/manifest.json");
const pages = [];
for (const p of manifest.pages) {
  const dir = path.join(p.authorRoot, "artifacts/9-10g/pages/" + String(p.page).padStart(4, "0"));
  const md = t.read(path.join(dir, "page.md")).toString();
  const page = json(path.join(dir, "page.json"));
  const audit = json(path.join(dir, "audit.json"));
  const first = JSON.parse(require("node:fs").readFileSync(path.join(t.root, "FIRST-p" + String(p.page).padStart(4, "0") + ".json")));
  const frontEnd = md.indexOf("\n---", 4);
  const meta = JSON.parse(md.slice(4, frontEnd));
  const body = md.slice(frontEnd + 4);
  const parsed = [...body.matchAll(/<!-- ([^\n]+) -->\n([\s\S]*?)(?=\n<!-- |$)/g)];
  const comparisons = parsed.map((item, i) => {
    const b = page.blocks[i];
    const text = item[2].trim();
    return {
      ref: "p" + String(p.page).padStart(4, "0") + "#" + (i + 1),
      header: item[1],
      kind: b?.kind,
      lineCount: b?.lines.length,
      markdownJsonTextEqual: b?.kind === "fig" ? /^!\[/.test(text) : text === b?.lines.join("\n"),
      open: b?.open,
      cont: b?.cont,
      samerow: b?.samerow,
      ownerExercise: b?.owner_exercise
    };
  });
  const computedLines = page.blocks.reduce((n, b) => n + b.lines.length - (b.samerow ? (b.kind === "cap" ? b.lines.length : Math.min(1, b.lines.length)) : 0), 0);
  const ownCount = first.lineInventory.totalVisibleTextLines ?? first.lineInventory.totalVisibleTextRows;
  pages.push({
    page: p.page,
    blockCount: page.blocks.length,
    independentOriginalRows: ownCount,
    computedCandidateRows: computedLines,
    nativePrintedRows: audit.lines_printed,
    nativeMarkdownRows: audit.lines_md,
    allCountsEqual: [ownCount, audit.lines_printed, audit.lines_md, page.meta.printed_lines].every((x) => x === computedLines),
    markdownFrontmatterEqualsJsonMeta: JSON.stringify(meta) === JSON.stringify(page.meta),
    markdownJsonBlocksEqual: comparisons.length === page.blocks.length && comparisons.every((b) => b.markdownJsonTextEqual),
    sourceHashMatchesIntake: page.meta.render.sha256 === p.original.sha256 && t.digest(t.read(p.original.path)) === p.original.sha256,
    errors: audit.errors,
    unknownChars: audit.unknown_chars,
    katexWarnings: audit.katex_warnings,
    countExclusions: audit.count_exclusions,
    nativeAuditReexecuted: false,
    semanticApprovalImplied: false,
    blocks: comparisons
  });
}
const spec = json(joint.figure27.spec.path);
const render = json(joint.figure27.render.path);
const svg = t.read(joint.figure27.svg.path);
const objects = new Map(spec.objects.map((o) => [o.id, o]));
const xy = (id) => typeof id === "string" ? objects.get(id).at : id;
const vec = (a, b) => xy(b).map((v, i) => v - xy(a)[i]);
const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
const checks = spec.assertions.map((a) => {
  let value;
  const tolerance = a.tolerance ?? 1e-6;
  if (a.type === "displacement") value = Math.max(...vec(a.from, a.to).map((v, i) => Math.abs(v - [a.dx, a.dy][i])));
  else if (a.type === "objectCount") value = Math.abs(spec.objects.filter((o) => o.type === a.objectType).length - a.count);
  else if (a.type === "connects") {
    const line = objects.get(a.arrow);
    value = line && JSON.stringify(xy(line.from)) === JSON.stringify(xy(a.from)) && JSON.stringify(xy(line.to)) === JSON.stringify(xy(a.to)) ? 0 : Infinity;
  } else if (a.type === "pointOnLine") value = Math.abs(cross(vec(a.a, a.b), vec(a.a, a.point))) / Math.hypot(...vec(a.a, a.b));
  else if (a.type === "parallel") value = Math.abs(cross(vec(a.a, a.b), vec(a.c, a.d))) / (Math.hypot(...vec(a.a, a.b)) * Math.hypot(...vec(a.c, a.d)));
  else throw new Error("Unreviewed assertion: " + a.type);
  return { id: a.id, type: a.type, residual: value, tolerance, pass: value <= tolerance };
});
const sourceMappings = spec.source.inventory.map((group) => ({
  id: group.id,
  idsResolve: group.objects.every((id) => objects.has(id)) && group.assertions.every((id) => spec.assertions.some((a) => a.id === id)),
  pointRelationshipCoverage: group.requires?.includes("pointRelationships") ? group.objects.filter((id) => objects.get(id).type === "point").every((id) => group.assertions.some((aid) => {
    const a = spec.assertions.find((item) => item.id === aid);
    if (a.type === "objectCount") return false;
    const involved = ["from", "to", "point", "a", "b", "c", "d"].map((key) => a[key]).filter((v) => typeof v === "string" && objects.get(v)?.type === "point");
    return involved.includes(id) && involved.every((v) => group.objects.includes(v));
  })) : null,
  sourcePixelTruthProven: false
}));
const lesson = json(joint.modernText[0].path);
const exercises = json(joint.modernText[1].path);
const prior = json(joint.modernText[2].path);
const textComparisons = prior.fullcomparisons.map((c) => {
  const current = c.object.startsWith("prose[") ? lesson.prose[Number(c.object.match(/\[(\d+)\]/)[1])] : exercises.exercises.find((e) => c.object === "exercise[" + e.number + "]");
  return { object: c.object, exactCurrentObjectBinding: JSON.stringify(current) === JSON.stringify(c.currentObject), priorScopedStatus: c.status };
});
const f59 = exercises.exercises.find((e) => e.number === "59");
const figure = {
  currentSpecHash: t.digest(t.read(joint.figure27.spec.path)),
  currentSvgHash: t.digest(svg),
  currentRenderHash: t.digest(t.read(joint.figure27.render.path)),
  specRenderBindingEqual: render.spec.sha256 === joint.figure27.spec.sha256,
  svgRenderBindingEqual: render.output.svg.sha256 === t.digest(svg),
  outputPathResolvesToCurrentFinal: path.resolve(t.repo, render.output.svg.path) === joint.figure27.svg.path,
  sourceHashEqual: spec.source.image.sha256 === t.digest(t.read(spec.source.image.path)),
  objectCount: spec.objects.length,
  pointCount: spec.objects.filter((o) => o.type === "point").length,
  segmentCount: spec.objects.filter((o) => o.type === "segment").length,
  labelTokens: spec.objects.filter((o) => o.label).map((o) => o.label),
  labelsEnglishOrMathOnly: spec.objects.filter((o) => o.label).every((o) => /^[A-Za-z\u2080-\u2089]+$/.test(o.label)),
  nativeStatus: render.status,
  nativeCollisions: render.collisions,
  nativeDisplayChecks: render.displayChecks,
  semanticCssVariablesPresent: svg.toString().includes("var(--"),
  allNumericAssertionsPass: checks.every((a) => a.pass),
  assertions: checks,
  sourceMappings,
  fullN48ModernProseObjectsRead: lesson.prose.length,
  fullN48ModernExercisesRead: exercises.exercises.length,
  priorReviewedCurrentObjectBindings: textComparisons,
  allReviewedCurrentTextBindingsEqual: textComparisons.length === 25 && textComparisons.every((c) => c.exactCurrentObjectBinding),
  currentFigure59Text: f59.text,
  currentFigure59Refs: f59.figure_refs,
  specAuthoritativeTextLiteralCurrentBinding: false,
  specTextBindingNote: "Spec says initial-template text; current complete Chinese text is hash-bound separately and has the same figure59 task. No spec rewrite by reviewer.",
  rendererInvoked: false,
  officialValidatorInvoked: false,
  nativeReviewWritten: false,
  statusMeaning: "Arithmetic, bindings and existing native report only. These checks cannot resolve the reviewer's disputed source-FIRST relationship inventory."
};
t.output("mechanical-checks.json", { schema: "independent-review-mechanical-evidence@1", pages, figure });
console.log(JSON.stringify({ pageChecks: pages.map((p) => ({ page: p.page, rows: p.computedCandidateRows, allCountsEqual: p.allCountsEqual, markdownJsonBlocksEqual: p.markdownJsonBlocksEqual })), mathAssertions: checks.length, allNumericAssertionsPass: figure.allNumericAssertionsPass, allTextBindingsEqual: figure.allReviewedCurrentTextBindingsEqual, sourceMappings: sourceMappings.map((g) => ({ id: g.id, idsResolve: g.idsResolve, pointRelationshipCoverage: g.pointRelationshipCoverage })) }, null, 2));
