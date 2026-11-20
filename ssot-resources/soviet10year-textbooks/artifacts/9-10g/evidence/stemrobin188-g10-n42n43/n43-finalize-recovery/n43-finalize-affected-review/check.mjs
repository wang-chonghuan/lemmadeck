import assert from 'node:assert/strict'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), root)
const tmp = '.intentfold/tickets/STEMROBIN-188/tmp'
const work = `${tmp}/g10-n42n43/work/adapt/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n43`
const book = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const durable = `${book}/editions/modern-us-neutral/figures`
const retained = `${book}/evidence/stemrobin188-g10-n42n43/geo910-c2-s1-n43-figures`
const bindings = new Map()
function bytes(path) {
  assert.ok(!/\.(png|jpe?g|webp|pdf)$/i.test(path), 'No image or PDF reads')
  const data = fs.readFileSync(path)
  bindings.set(path, {
    path,
    sha256: crypto.createHash('sha256').update(data).digest('hex'),
    bytes: data.length,
  })
  return data
}
function json(path) { return JSON.parse(bytes(path).toString('utf8')) }
function bound(path, expected) {
  bytes(path)
  const actual = bindings.get(path)
  assert.equal(actual.sha256, expected, path)
  return actual
}
function diff(before, after, pointer = '') {
  if (Object.is(before, after)) return []
  if (!before || !after || typeof before !== 'object' || typeof after !== 'object') {
    return [{ pointer, before, after }]
  }
  assert.equal(Array.isArray(before), Array.isArray(after), pointer)
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])]
  return keys.flatMap(key => diff(
    before[key], after[key],
    `${pointer}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`,
  ))
}

const firstCommand = json(`${tmp}/n43-adapt-finalize-01/command.json`)
const firstStdout = bytes(`${tmp}/n43-adapt-finalize-01/stdout.txt`).toString('utf8')
const firstAudit = json(`${tmp}/n43-adapt-finalize-01/adaptation.audit.json`)
assert.equal(firstCommand.exitCode, 2)
assert.equal(firstAudit.status, 'fail')
assert.equal(firstAudit.errors.length, 4)
assert.ok(firstAudit.errors.every(error => firstStdout.includes(error)))

const beforePath = `${tmp}/n43-adapt-finalize-01/lesson.template.before.json`
const currentPath = `${work}/lesson.template.json`
const beforeBytes = bytes(beforePath)
const currentBytes = bytes(currentPath)
const before = JSON.parse(beforeBytes)
const current = JSON.parse(currentBytes)
const beforeSha = '7a68b45b3f468865cdb2f15632b420f868d6f2bf0bc90c62e8c738183a002e58'
assert.equal(bindings.get(beforePath).sha256, beforeSha)
const delta = diff(before, current)
assert.equal(delta.length, 1)
assert.equal(delta[0].pointer, '/section_breaks/0/after')
assert.equal(delta[0].after, delta[0].before.replace('\u95ee\u98982\u3002', '\u95ee\u98982\u3002\n'))
let prefix = 0
while (prefix < beforeBytes.length && beforeBytes[prefix] === currentBytes[prefix]) prefix++
assert.deepEqual(currentBytes.subarray(0, prefix), beforeBytes.subarray(0, prefix))
assert.deepEqual(currentBytes.subarray(prefix + 2), beforeBytes.subarray(prefix))
assert.equal(currentBytes.subarray(prefix, prefix + 2).toString('utf8'), '\\n')
const restored = structuredClone(current)
restored.section_breaks[0].after = before.section_breaks[0].after
assert.deepEqual(restored, before)
assert.deepEqual(current.prose, before.prose)
assert.deepEqual(current.source, before.source)

const textReviewPath = `${tmp}/g10-modern-text-review/review.json`
const textReview = json(textReviewPath)
assert.equal(textReview.status, 'revise')
assert.equal(textReview.approvals.modern_text_semantics, true)
const inheritedChecks = textReview.content_checks.flatMap(group => group.checks)
assert.equal(inheritedChecks.length, 35)
assert.ok(inheritedChecks.every(check => (check.semantic_status ?? check.status) === 'pass'))
const n43Checks = textReview.content_checks.filter(group => group.lesson === current.id)
assert.equal(n43Checks.flatMap(group => group.checks).length, 15)
const n43TextBindings = textReview.bindings.filter(binding => binding.id.startsWith('n43-'))
for (const binding of n43TextBindings) {
  if (binding.id === 'n43-lesson-template') {
    assert.equal(binding.sha256, beforeSha)
    assert.equal(binding.path, currentPath)
  } else {
    bound(binding.path, binding.sha256)
  }
}
for (const binding of textReview.bindings.filter(binding => /^p015[56]-page\./.test(binding.id))) {
  bound(binding.path, binding.sha256)
}
const rawLesson = json(`${book}/${current.source.path}`)
assert.deepEqual(current.source.data, rawLesson)
bound(`${book}/${current.source.path}`, current.source.sha256)
const exercises = json(`${work}/exercises.template.json`)
assert.deepEqual(exercises.source.data, json(`${book}/${exercises.source.path}`))
bound(`${book}/${exercises.source.path}`, exercises.source.sha256)

const firstFigurePath = `${tmp}/n43-modern-figure-review/report.json`
const firstFigureSha = '9d98c0540adf213965b1352cdd77ca5633b8eb878bd0fac9975fd0ec7bd5b246'
bound(firstFigurePath, firstFigureSha)
const firstFigure = json(firstFigurePath)
bound(`${retained}/independent-review.json`, firstFigureSha)
const admission = json(`${tmp}/n43-figure-admission.json`)
assert.equal(admission.review.sha256, firstFigureSha)
assert.equal(admission.status, 'pass-for-listed-figures-only')
const promotion = json(`${retained}/promotion-bindings.json`)
assert.equal(promotion.metadataOnlyRelocation, true)
assert.equal(promotion.changedSpecs, false)
assert.equal(promotion.changedSvg, false)
assert.equal(promotion.rendererCalls, 0)
assert.equal(promotion.contentRepairsReset, false)
const promotionChecks = []
for (const binding of promotion.bindings) {
  if (binding.retained.endsWith('.png')) {
    const figure = firstFigure.figures.find(item => binding.original === item.bindings.png.relativePath)
    assert.ok(figure)
    assert.equal(binding.sha256, figure.bindings.png.sha256)
    promotionChecks.push({ ...binding, mode: 'Inherited metadata only; PNG not opened or rehashed' })
    continue
  }
  bound(binding.retained, binding.sha256)
  if (!binding.original.endsWith('/figures.template.json')) bound(binding.original, binding.sha256)
  promotionChecks.push({ ...binding, mode: 'Text/SVG SHA256 match' })
}
const figures = firstFigure.figures.map(figure => {
  assert.equal(figure.status, 'pass')
  const id = figure.id
  const admitted = admission.figures.find(item => item.id === id)
  assert.ok(admitted)
  const specPath = `${durable}/${id}.spec.json`
  const svgPath = `${durable}/${id}.svg`
  const renderPath = `${durable}/${id}.render.json`
  const reviewPath = `${durable}/${id}.review.json`
  for (const [kind, path] of [['spec', specPath], ['svg', svgPath]]) {
    bound(path, figure.bindings[kind].sha256)
    bound(figure.bindings[kind].relativePath, figure.bindings[kind].sha256)
    assert.equal(admitted[kind].sha256, figure.bindings[kind].sha256)
  }
  const originalRender = json(figure.bindings.render.relativePath)
  bound(figure.bindings.render.relativePath, figure.bindings.render.sha256)
  const render = json(renderPath)
  const renderDelta = diff(originalRender, render)
  assert.ok(renderDelta.length > 0)
  assert.ok(renderDelta.every(item => ['/spec/path', '/output/svg/path'].includes(item.pointer)))
  assert.equal(render.spec.path, specPath)
  assert.equal(render.output.svg.path, svgPath)
  assert.equal(render.spec.sha256, figure.bindings.spec.sha256)
  assert.equal(render.output.svg.sha256, figure.bindings.svg.sha256)
  assert.equal(render.status, 'pass')
  const review = json(reviewPath)
  assert.equal(review.schema, 'ld-s10y-image/review@1')
  assert.equal(review.figure, id)
  assert.equal(review.status, 'pass')
  assert.equal(review.source.path, figure.bindings.source.relativePath)
  assert.equal(review.source.sha256, figure.bindings.source.sha256)
  assert.deepEqual(review.spec, { path: specPath, sha256: bindings.get(specPath).sha256 })
  assert.deepEqual(review.render, { path: renderPath, sha256: bindings.get(renderPath).sha256 })
  assert.deepEqual(review.outputs.svg, { path: svgPath, sha256: bindings.get(svgPath).sha256 })
  assert.ok(review.notes.includes(firstFigureSha))
  assert.ok(review.notes.includes('not reset'))
  assert.equal(figure.priorContentRepairs, 1)
  assert.equal(figure.newContentRepairs, 0)
  assert.equal(figure.contentRepairQuotaRemaining, 0)
  return {
    id, status: 'PASS_INHERITED_ONLY',
    spec: bindings.get(specPath), svg: bindings.get(svgPath),
    originalRender: bindings.get(figure.bindings.render.relativePath),
    render: bindings.get(renderPath), review: bindings.get(reviewPath),
    renderDelta, sourceBindingInheritedWithoutImageRead: review.source,
    priorContentRepairs: figure.priorContentRepairs,
    newContentRepairs: 0,
    contentRepairQuotaRemaining: figure.contentRepairQuotaRemaining,
  }
})
assert.deepEqual(figures.map(figure => figure.id), ['fig-g10-03', 'fig-g10-04', 'fig-g10-05'])

const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const pythonCode = String.raw`
import base64, copy, inspect, json, sys
import xml.etree.ElementTree as ET
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools")
import edition
payload = json.load(sys.stdin)
before, current = payload["before"], payload["current"]
edition.normalize_lesson_layout(before)
edition.normalize_lesson_layout(current)
assert before["prose"] == current["prose"]
_, prior_errors = edition.prose_flow_contract(before["prose"], before["section_breaks"])
assert len(prior_errors) == 1 and "matched 0" in prior_errors[0]
flow, errors = edition.prose_flow_contract(current["prose"], current["section_breaks"])
assert not errors, errors
assert flow["resolvedBreaks"] == [4]
assert len(flow["boundaries"]) == 1
boundary = flow["boundaries"][0]
assert boundary["before"] == current["section_breaks"][0]["before"]
assert boundary["after"] == current["section_breaks"][0]["after"]
assert boundary["after"].startswith("\u95ee\u98982\u3002\n")
assert flow["paragraphs"][3]["text"] == boundary["before"]
assert flow["paragraphs"][4]["text"] == boundary["after"]
font = Path(".claude/skills/ld-s10y-lesson/node_modules/katex/dist/fonts/KaTeX_Main-Regular.woff2")
uri = "data:font/woff2;base64," + base64.b64encode(font.read_bytes()).decode("ascii")
css = "@font-face{font-family:LDVectorAccents;src:url(" + uri + ') format("woff2");}'
svg_scans = []
for figure in payload["figures"]:
    tree = ET.fromstring(Path(figure["svg"]["path"]).read_text())
    unchanged = ET.tostring(tree)
    styles = [node for node in tree.iter() if edition.local_name(node.tag) == "style"]
    assert len(styles) == 1 and styles[0].text == css
    scanned = edition.svg_resource_scan(tree)
    assert ET.tostring(tree) == unchanged
    assert not any(marker in scanned for marker in ["data:", "http://", "https://"])
    assert not ({edition.local_name(node.tag) for node in tree.iter()} & {"image", "foreignObject", "script"})
    svg_scans.append({"figure": figure["id"], "exactFontStyle": True,
                      "actualSvgNotMutated": True, "remainingForbiddenUris": [],
                      "bannedNodes": []})
class MemorySVG:
    def __init__(self, body): self.body = body
    def exists(self): return True
    def read_text(self, encoding=None):
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1">' + self.body + '<text>x</text></svg>'
    def __str__(self): return "in-memory-security-probe.svg"
cases = [
    ("exact-font", "<style>" + css + "</style>", False, None),
    ("unknown-font-bytes", "<style>" + css.replace(uri, "data:font/woff2;base64,bad") + "</style>", True, None),
    ("unknown-font-family", "<style>" + css.replace("LDVectorAccents", "UnknownFont") + "</style>", True, None),
    ("other-uri", "<style>text{fill:url(data:image/svg+xml;base64,bad)}</style>", True, None),
    ("non-style", "<text>" + css + "</text>", True, None),
    ("appended-https", "<style>" + css + "text{fill:url(https://example.com/x)}</style>", True, None),
    ("separate-http", "<style>" + css + '</style><use href="http://example.com/x"/>', True, None),
    ("separate-https", "<style>" + css + '</style><use href="https://example.com/x"/>', True, None),
    ("style-attribute-uri", '<style data-extra="data:bad">' + css + "</style>", True, None),
    ("style-tail-uri", "<style>" + css + "</style>data:bad", True, None),
    ("image-with-exact-font", "<style>" + css + '</style><image href="' + uri + '"/>', True, "image"),
    ("foreignObject-with-exact-font", "<style>" + css + "</style><foreignObject/>", False, "foreignObject"),
    ("script-with-exact-font", "<style>" + css + "</style><script/>", False, "script"),
]
security = []
# Stub only the unrelated FigureSpec validator; execute the actual SVG security guards.
with patch.object(edition, "validate_figure_spec", return_value=({"mode": "deterministic"}, [])):
    for name, body, reject_uri, banned in cases:
        found = edition.validate_svg(MemorySVG(body), Path(payload["figures"][0]["spec"]["path"]),
                                     {"id": "security-probe"})
        assert any("\u7981\u6b62 data URI" in error for error in found) == reject_uri, (name, found)
        if banned:
            assert any("\u7981\u6b62\u8282\u70b9" in error and banned in error for error in found), (name, found)
        if name == "exact-font": assert found == [], found
        security.append({"case": name, "status": "PASS",
                         "uriRejected": reject_uri, "bannedNodeRejected": banned})
print(json.dumps({
    "normalization": {"beforeStillFails": prior_errors, "currentErrors": errors,
                      "resolvedBreaks": flow["resolvedBreaks"], "boundary": boundary,
                      "paragraphCount": len(flow["paragraphs"]), "boundaryPreserved": True,
                      "normalizedProseBeforeCurrentIdentical": True,
                      "adjacencyChecksUnchanged": True},
    "svgSecurity": {"durableScans": svg_scans, "integrationCases": security,
                    "unrelatedSpecValidationStubbed": True,
                    "sourceFunctions": {
                        name: inspect.getsource(getattr(edition, name))
                        for name in ["normalize_lesson_layout", "prose_flow_contract", "svg_resource_scan"]
                    }}
}, ensure_ascii=False))
`
const run = spawnSync(python, ['-B', '-c', pythonCode], {
  cwd: root,
  input: JSON.stringify({ before, current, figures }),
  encoding: 'utf8',
})
assert.equal(run.status, 0, run.stderr || run.stdout)
const focused = JSON.parse(run.stdout)
const selectedFontsPath = `${tmp}/vector-font-recovery/test-fixed/selected-fonts.json`
const pixelsPath = `${tmp}/vector-font-recovery/test-fixed/image-pixels.json`
const selectedFonts = json(selectedFontsPath)
const pixels = json(pixelsPath)
assert.ok(selectedFonts.some(font => font.postScriptName === 'KaTeX_Main-Regular' && font.isCustomFont && font.glyphCount > 0))
assert.ok(pixels.accent.top < pixels.withoutAccent.top)
assert.ok(pixels.accent.count > pixels.withoutAccent.count)
for (const path of [
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
  '.claude/skills/ld-s10y-lesson/tests/test_embedded_vector_font.py',
  '.claude/skills/ld-s10y-lesson/node_modules/katex/dist/fonts/KaTeX_Main-Regular.woff2',
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '.agents/skills/ld-s10y-image/tests/vector-accent-font.test.mjs',
]) bytes(path)
const evidence = {
  schema: 'n43-finalize-affected-review/check-evidence@1',
  status: 'PASS', cwd: root, date: '2026-11-20',
  checkSha256: crypto.createHash('sha256').update(fs.readFileSync(new URL(import.meta.url))).digest('hex'),
  firstFailure: {
    command: bindings.get(`${tmp}/n43-adapt-finalize-01/command.json`),
    audit: bindings.get(`${tmp}/n43-adapt-finalize-01/adaptation.audit.json`),
    stdout: bindings.get(`${tmp}/n43-adapt-finalize-01/stdout.txt`),
    exitCode: firstCommand.exitCode, originalStatus: firstAudit.status,
    errors: firstAudit.errors,
  },
  templateDelta: {
    before: bindings.get(beforePath), current: bindings.get(currentPath),
    changes: delta, rawInsertion: { offset: prefix, utf8Bytes: 2, escapedBytes: '\\n' },
    allOtherFileBytesIdentical: true, sourceAndProseStructurallyUnchanged: true,
    exercisesCurrentMatchesInheritedSha: true,
    sourceSnapshotsEqualBoundRaw: true,
  },
  semanticInheritance: {
    review: bindings.get(textReviewPath), originalStatusPreserved: textReview.status,
    inheritedProseSemanticPasses: textReview.content_checks.filter(group => group.collection === 'prose').flatMap(group => group.checks).length,
    inheritedTotalSemanticPasses: 35, n43InheritedProseSemanticPasses: 7,
    n43InheritedTotalSemanticPasses: 15, independentResolvingOrContentReview: false,
    originalFindingsUnchanged: textReview.findings.map(finding => ({
      id: finding.id, status: finding.status, source: `${textReviewPath}#/findings`,
    })),
  },
  ...focused,
  figureInheritance: {
    firstReview: bindings.get(firstFigurePath),
    firstStatus: firstFigure.status, admission: bindings.get(`${tmp}/n43-figure-admission.json`),
    promotionBindings: bindings.get(`${retained}/promotion-bindings.json`),
    promotionChecks, figures, newApproval: false,
    pngAndSourceImagesOpenedOrRehashed: false,
  },
  parentGlyphAndPixelEvidence: {
    selectedFonts: bindings.get(selectedFontsPath), pixels: bindings.get(pixelsPath),
    reusedWithoutBrowserOrRerender: true,
  },
  inputBindings: [...bindings.values()],
  imageOpens: 0, imageLoads: 0, screenshots: 0, renderCalls: 0,
  adaptFinalizeCalls: 0, writesByCheck: process.argv.includes('--evidence') ? 1 : 0,
}
if (process.argv.includes('--evidence')) {
  const evidencePath = `${tmp}/n43-finalize-affected-review/check-evidence.json`
  fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, { flag: 'wx' })
  console.log(JSON.stringify({
    status: evidence.status, path: evidencePath,
    sha256: crypto.createHash('sha256').update(fs.readFileSync(evidencePath)).digest('hex'),
    template: evidence.templateDelta.current,
    boundary: evidence.normalization.boundary.index,
    figures: evidence.figureInheritance.figures.map(figure => ({
      id: figure.id, reviewSha256: figure.review.sha256,
    })),
  }, null, 2))
} else {
  console.log(JSON.stringify(evidence, null, 2))
}
