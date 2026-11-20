import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
const tmp = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp')
const owned = path.join(tmp, 'd1816-d300-affected-context-review')
if (process.cwd() !== root) throw new Error('Wrong checkout')
const firstAttempt = path.join(owned, 'audit.first.json')
if (fs.existsSync(path.join(owned, 'report.json')) && !fs.existsSync(firstAttempt)) {
  fs.copyFileSync(path.join(owned, 'report.json'), firstAttempt)
}
const sha = value => crypto.createHash('sha256').update(value).digest('hex')
const absolute = value => path.resolve(root, value)
const initial = new Map()
const findings = []
const checks = []
function read(filename) {
  filename = absolute(filename)
  const bytes = fs.readFileSync(filename)
  if (!initial.has(filename)) initial.set(filename, { path: filename, bytes: bytes.length, sha256: sha(bytes) })
  return bytes
}
const json = filename => JSON.parse(read(filename).toString('utf8'))
const text = filename => read(filename).toString('utf8')
const binding = filename => {
  read(filename)
  return initial.get(absolute(filename))
}
function check(id, condition, detail) {
  checks.push({ id, status: condition ? 'pass' : 'fail', detail })
  if (!condition) findings.push({ id, severity: 'blocking', detail })
}
function verify(ref, label) {
  const actual = binding(ref.path)
  check(label, actual.sha256 === ref.sha256 && (ref.bytes === undefined || actual.bytes === ref.bytes),
    { declared: ref, actual })
  return actual
}
function write(filename, value) {
  const target = path.join(owned, filename)
  if (!target.startsWith(owned + path.sep)) throw new Error('Ownership violation')
  fs.writeFileSync(target, JSON.stringify(value, null, 2) + '\n')
}
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const noWhitespace = value => String(value ?? '').replace(/\s+/g, '')
function diff(a, b, prefix = '') {
  if (equal(a, b)) return []
  if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])]
      .flatMap(key => diff(a[key], b[key], `${prefix}.${key}`))
  }
  return [prefix]
}
const mainPath = path.join(tmp, 'd1816-d299-current-figure-text/result.json')
verify({ path: mainPath, sha256: 'f2c03403a61a6401c66867131e771ca5c496d9b3ca794f553e029b331c71dc36' }, 'D299-result')
const current = json(mainPath)
verify(current.textRepair, 'D298-result')
verify(current.layoutRepair, 'D295-result')
verify(current.nativeTool, 'current-native-tool')
const repair = json(current.textRepair.path)
const layout = json(current.layoutRepair.path)
const priorDefinitions = [
  [279, 'd1816-d279-n17n18-text-review', null],
  [285, 'd1816-d285-fig27-review', 'fa37ecd6787f47105317392e873c04b85c8e7e27cae1ede751502444de2ace58'],
  [290, 'd1816-d290-fig2425-review', 'a605e93b92428a989423c51606f688356dba343df3424fb12397de2872d0a9f0'],
  [291, 'd1816-d291-fig26-review', 'c614f84df36fc2817890fc134d8efc1b56e5bfe3460bea52959ca2619851ae2b'],
  [292, 'd1816-d292-n19-text-review', '1620ec0d224943e85b5f2a00b81f0aaaa5df39025096334b774be1d06d6d4936'],
  [294, 'd1816-d294-fig2829-review', '79c5a196799195589ff69ae34419cbb96c66cf0c8520018accac3de70f92b4d8'],
  [296, 'd1816-d296-n19-table-review', '4cdf0330f184d2fa50d93d4010917f2cf97e726bbe1d70f2857bce44bae815f0'],
]
const prior = new Map()
const priorReports = []
for (const [number, directory, expected] of priorDefinitions) {
  const filename = path.join(tmp, directory, 'report.json')
  const document = json(filename)
  if (expected) verify({ path: filename, sha256: expected }, `D${number}-report`)
  prior.set(number, document)
  priorReports.push({ batch: `D${number}`, report: binding(filename), originalVerdict: document.verdict ?? document.status })
}
const historical = json(path.join(tmp, 'd1816-d287-n19-text-recovery/d287-report.json'))
const transplant = json(path.join(tmp, 'd1816-d278-text-transplant/result.json'))
const authorFreeze = json(transplant.authorFreeze.path)
const supplemental = [
  path.join(tmp, 'd1816-d279-n17n18-text-review/hashes.json'),
  path.join(tmp, 'd1816-d290-fig2425-review/hash-bindings.json'),
  path.join(tmp, 'd1816-d296-n19-table-review/selected.json'),
]
const supplementalDocuments = supplemental.map(json)
const declarations = []
function collect(value, origin, pointer = '$') {
  if (!value || typeof value !== 'object') return
  if (typeof value.path === 'string' && /^[0-9a-f]{64}$/.test(value.sha256 ?? '')) {
    declarations.push({ origin, pointer, declared: { path: value.path, sha256: value.sha256, ...(value.bytes === undefined ? {} : { bytes: value.bytes }) } })
  }
  for (const [key, child] of Object.entries(value)) collect(child, origin, `${pointer}.${key}`)
}
priorReports.forEach(({ batch }) => collect(prior.get(Number(batch.slice(1))), batch))
supplementalDocuments.forEach((document, index) => collect(document, supplemental[index]))
collect(historical, 'D287-historical-only')
collect(repair, 'D298')
collect(layout, 'D295')
const historicalBindingObservations = declarations.map(item => {
  const filename = absolute(item.declared.path)
  if (!fs.existsSync(filename)) return { ...item, status: 'unavailable-historical-path', current: null }
  const actual = binding(filename)
  const match = actual.sha256 === item.declared.sha256
  return {
    ...item,
    current: actual,
    status: match ? 'hash-matches' : 'historical-bytes-superseded-not-current-approval',
    bytesMatch: item.declared.bytes === undefined || actual.bytes === item.declared.bytes,
  }
})

const contractPaths = [
  '.intentfold/readme.md',
  '.intentfold/charter/engineering.md',
  '.intentfold/charter/operations.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
  '.claude/skills/ld-s10y-lesson/tools/render_lesson.js',
  'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
  'ssot-resources/soviet10year-textbooks/toc/10p/en.json',
]
const contracts = contractPaths.map(binding)
const require = createRequire(import.meta.url)
const { proseOutline, sectionBreakIndices, proseFlow } = require(path.join(root, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
const entries = node => [
  ...(node.id && node.title ? [node] : []),
  ...['contents', 'lessons', 'topics'].flatMap(key => (node[key] ?? []).flatMap(entries)),
]
const metadataKey = label => label.replace(/\s+/g, ' ').trim().replace(/(?<=[\u3400-\u9fff]) (?=[\u3400-\u9fff])/g, '')
const enTitles = new Map(entries(json(contractPaths.at(-1))).map(node => [node.id, node.title]))
const metadata = new Map(entries(json(contractPaths.at(-2))).map(node => [metadataKey(node.title), enTitles.get(node.id)]))
const translate = (value, locale) => !value || locale !== 'en' ? value : metadata.get(metadataKey(value))
const templates = []
const templateDocuments = new Map()
for (const record of current.templates) {
  verify(record.template, `N${record.number}-${record.locale}-operative-template`)
  verify(record.text, `N${record.number}-${record.locale}-full-text`)
  const document = json(record.template.path)
  templateDocuments.set(`${record.number}/${record.locale}`, document)
  const body = document.prose.map(block => (block.text || block.label || '').trim()).filter(Boolean).join('\n\n')
  const crumbs = [document.chapter, document.section].filter(Boolean).map(value => translate(value, record.locale))
  check(`N${record.number}-${record.locale}-TOC-identity-resolution`, crumbs.every(Boolean), { raw: [document.chapter, document.section], translated: crumbs })
  const expected = `# ${document.number}. ${document.title}\n\n> ${crumbs.join(' | ')}\n\n${body}`
  check(`N${record.number}-${record.locale}-full-text-exact`, text(record.text.path) === expected,
    { template: record.template, fullText: record.text, method: 'Complete title, current TOC-localized raw breadcrumbs, every prose/caption/figure-label entry, exact whitespace; no ellipsis or truncation.' })
  const sourceRoot = record.number === 19
    ? '.tmp/STEMROBIN-181/d1816-d287/source-root/10p'
    : '.tmp/STEMROBIN-181/d1816-d276/root/10p'
  const sourcePath = path.join(root, sourceRoot, document.source.path)
  verify({ path: sourcePath, sha256: document.source.sha256 }, `N${record.number}-${record.locale}-raw-source`)
  const raw = json(sourcePath)
  check(`N${record.number}-${record.locale}-source-snapshot-unchanged`, equal(raw, document.source.data), binding(sourcePath))
  const identityFields = ['id', 'card_id', 'chapter', 'section', 'number', 'printed_title', 'start_page', 'start_printed', 'exercise_count']
  check(`N${record.number}-${record.locale}-native-raw-identity`, identityFields.every(key => equal(document[key], raw[key])),
    { fields: identityFields, EnglishTitle: record.locale === 'en' ? document.title : null, titleIsOnlyLocalizedIdentityField: true })
  check(`N${record.number}-${record.locale}-block-source-identity`, document.prose.length === raw.prose.length &&
    document.prose.every((block, index) => ['kind', 'id', 'printed_page', 'source_refs'].every(key => equal(block[key], raw.prose[index][key])) &&
      block.source_text === raw.prose[index].text), { source: binding(sourcePath), blocks: document.prose.length })
  const outline = proseOutline(document.prose)
  const breakIndices = sectionBreakIndices(document.prose, document.section_breaks)
  templates.push({
    ...record, source: binding(sourcePath), paragraphCount: outline.length, boundaryIndices: breakIndices,
    rawBreadcrumbs: [document.chapter, document.section], actualEnglishBreadcrumbsFromRepositoryTOC: record.locale === 'en' ? crumbs : null,
    title: document.title,
  })
}
check('six-current-templates', templates.length === 6 && templateDocuments.size === 6, templates.map(value => `${value.number}/${value.locale}`))

const whitespaceReview = []
for (const record of templates.filter(value => value.number !== 19)) {
  const document = templateDocuments.get(`${record.number}/${record.locale}`)
  const authored = transplant.results.find(value => value.id === document.id && value.edition === record.edition).authored
  verify(authored, `N${record.number}-${record.locale}-D279-authored-prose-basis`)
  const frozenAuthor = authorFreeze.templates.find(value => value.path === authored.path)
  check(`N${record.number}-${record.locale}-author-freeze-chain`, frozenAuthor?.sha256 === authored.sha256,
    { authorFreeze: binding(transplant.authorFreeze.path), authored })
  const authoredDocument = json(authored.path)
  check(`N${record.number}-${record.locale}-D279-teaching-and-source-ref-order`, document.prose.every((block, index) =>
    noWhitespace(block.text) === noWhitespace(authoredDocument.prose[index].text) &&
    equal(block.source_refs, authoredDocument.prose[index].source_refs)),
  { originallyReviewedTransplantSha256: prior.get(279).basis.candidate_sha256[`${record.edition}/${document.id}`],
    originalAuthor: authored, current: record.template,
    scope: 'The D279-reviewed transplant carries these exact authored texts in this source-ref order. Original raw snapshots differ and are not substituted.' })
  const original = layout.changes.find(value => value.lesson === document.id && value.edition === record.edition).original
  verify(original, `N${record.number}-${record.locale}-D295-before-snapshot`)
  const before = json(original.path)
  const changedBlockIndices = document.prose.flatMap((block, index) => block.text !== before.prose[index].text ? [index] : [])
  const contentUnchanged = document.prose.every((block, index) => noWhitespace(block.text) === noWhitespace(before.prose[index].text))
  const math = prose => prose.filter(block => block.kind === 'p').flatMap(block => [...block.text.matchAll(/\$\$[\s\S]+?\$\$|\$[^$]+?\$/g)].map(match => match[0]))
  check(`N${record.number}-${record.locale}-whitespace-only-and-formulas`, contentUnchanged && equal(math(document.prose), math(before.prose)),
    { changedBlockIndices, before: original, current: record.template })
  const changes = diff(before, document)
  check(`N${record.number}-${record.locale}-D295-D299-only-allowed-fields`, changes.every(field =>
    ['.chapter', '.section', '.printed_title', '.prose', '.section_breaks'].includes(field)),
  { changedFields: changes })
  check(`N${record.number}-${record.locale}-nontext-block-fields`, document.prose.every((block, index) => {
    const a = { ...block }, b = { ...before.prose[index] }
    delete a.text
    delete b.text
    return equal(a, b)
  }), { changedBlockIndices })
  const beforeOutline = proseOutline(before.prose)
  const afterOutline = proseOutline(document.prose)
  const beforeIndices = sectionBreakIndices(before.prose, before.section_breaks)
  const afterIndices = sectionBreakIndices(document.prose, document.section_breaks)
  const semanticOffsets = (outline, indices) => indices.map(index => noWhitespace(outline.slice(0, index).map(value => value.text).join('')).length)
  const oldOffsets = semanticOffsets(beforeOutline, beforeIndices)
  const newOffsets = semanticOffsets(afterOutline, afterIndices)
  check(`N${record.number}-${record.locale}-concept-boundaries-intact`, equal(oldOffsets, newOffsets),
    { beforeIndices, currentIndices: afterIndices, beforeNonWhitespaceOffsets: oldOffsets, currentNonWhitespaceOffsets: newOffsets })
  whitespaceReview.push({
    number: record.number, locale: record.locale, before: original, current: record.template,
    originalAuthorTextBasis: authored,
    changedTextBlockIndices: changedBlockIndices, teachingAndMathUnchanged: contentUnchanged,
    beforeParagraphCount: beforeOutline.length, currentParagraphCount: afterOutline.length,
    beforeBoundaryIndices: beforeIndices, currentBoundaryIndices: afterIndices, semanticConceptOffsets: newOffsets,
    rationale: 'Only whitespace within existing source-bound teaching blocks changed; punctuation, bold markers and all math tokens are unchanged. Adjacent anchors resolve uniquely at the same non-whitespace concept positions, even where paragraph indices differ.',
  })
}

const n19Review = []
for (const locale of ['zh', 'en']) {
  const document = templateDocuments.get(`19/${locale}`)
  const frozen = historical.languages[locale].snapshots.lesson.frozen
  verify(frozen, `N19-${locale}-D287-frozen-template`)
  const before = json(frozen.path)
  const beforeOutline = proseOutline(before.prose)
  const outline = proseOutline(document.prose)
  const changedParagraphIndices = outline.flatMap((paragraph, index) => paragraph.text !== beforeOutline[index]?.text ? [index] : [])
  const changedFields = diff(before, document)
  const changedBlockFields = document.prose.map((block, index) => ({ index, fields: diff(before.prose[index], block) }))
  check(`N19-${locale}-only-authorized-affected-fields`, changedFields.every(field => ['.prose', '.figures'].includes(field)) &&
    changedBlockFields.every(({ index, fields }) => fields.every(field =>
      (index === 0 && locale === 'en' && field === '.text') ||
      ([2, 3].includes(index) && field === '.figures') ||
      (index === 5 && locale === 'en' && field === '.label'))),
  { changedFields, changedBlockFields })
  check(`N19-${locale}-changed-paragraph-scope`, equal(changedParagraphIndices, locale === 'en' ? [0, 1] : []) &&
    outline.length === (locale === 'en' ? 12 : 10), { changedParagraphIndices, paragraphCount: outline.length })
  check(`N19-${locale}-source-and-boundaries-preserved`, equal(before.source, document.source) &&
    equal(before.section_breaks, document.section_breaks), { source: document.source.sha256, boundaryIndices: sectionBreakIndices(document.prose, document.section_breaks) })
  const anchors = []
  for (const [figure, ref, blockIndex] of [['fig-28', 'p0053#3', 2], ['fig-29', 'p0053#4', 3]]) {
    const matches = document.prose.flatMap((block, index) => (block.figures ?? []).some(value => value.id === figure) ? [index] : [])
    const rawReferenceMatches = document.prose.flatMap((block, index) =>
      new RegExp(`\\u56fe\\s*(?:\\$\\s*)?${figure.slice(4)}(?!\\d)`).test(block.source_text ?? '') ? [index] : [])
    const label = locale === 'en' ? `Figure ${figure.slice(4)}` : `\u56fe ${figure.slice(4)}`
    const flow = proseFlow(document.prose, document.section_breaks)
    const figureIndex = flow.findIndex(block => block.kind === 'fig' && block.id === figure)
    const blockParagraphs = proseOutline([document.prose[blockIndex]])
    const placement = figureIndex > 0 && flow[figureIndex - 1].text === blockParagraphs.at(-1).text
    check(`N19-${locale}-${figure}-unique-source-reference-anchor`, equal(matches, [blockIndex]) &&
      equal(rawReferenceMatches, [blockIndex]) && equal(document.prose[blockIndex].source_refs, [ref]) &&
      document.prose[blockIndex].figures[0].label === label && placement, { matches, rawReferenceMatches, ref, blockIndex, label, afterFinalParagraph: placement })
    anchors.push({ figure, blockIndex, sourceRef: ref, label, afterFinalParagraph: placement })
  }
  const tableLabel = locale === 'en' ? 'Table' : '\u8868'
  check(`N19-${locale}-table-labels`, document.prose[5].label === tableLabel &&
    document.figures[0].label === tableLabel && document.prose[5].id === 'tbl-p0053-01' &&
    equal(document.prose[5].source_refs, ['p0053#6']), { prose: document.prose[5].label, lesson: document.figures[0].label })
  const currentTemplate = templates.find(value => value.number === 19 && value.locale === locale).template
  const manifestRef = repair.templates.find(value => value.locale === locale).manifest
  verify(manifestRef, `N19-${locale}-figure-manifest`)
  const manifest = json(manifestRef.path)
  check(`N19-${locale}-manifest-figure-set`, equal(manifest.figures.map(value => value.id).sort(), ['fig-28', 'fig-29', 'tbl-p0053-01']),
    { figureIds: manifest.figures.map(value => value.id), status: manifest.status, promotionNotInferred: true })
  for (const entry of manifest.figures) {
    const expectedLabel = entry.id === 'tbl-p0053-01' ? tableLabel : locale === 'en' ? `Figure ${entry.id.slice(4)}` : `\u56fe ${entry.id.slice(4)}`
    check(`N19-${locale}-${entry.id}-manifest-label`, entry.label === expectedLabel, entry.label)
    for (const type of ['png', 'svg']) {
      const source = entry.source[type]
      const sourcePath = path.join(root, '.tmp/STEMROBIN-181/d1816-d287/source-root/10p', source.path)
      verify({ ...source, path: sourcePath }, `N19-${locale}-${entry.id}-source-${type}`)
      const canonicalPath = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/10p', source.path)
      verify({ ...source, path: canonicalPath }, `N19-${locale}-${entry.id}-canonical-source-${type}`)
    }
  }
  if (locale === 'zh') {
    verify(historical.languages.zh.combinedParagraphText, 'N19-approved-Chinese-combined-text')
    check('N19-ten-approved-Chinese-paragraphs-exact', equal(outline.map(value => value.text), historical.languages.zh.proseFlow.paragraphs.map(value => value.text)) &&
      sha(outline.map(value => value.text).join('\n\n')) === historical.equality.retainedCombinedSha256,
    { approvedCombinedSha256: historical.equality.retainedCombinedSha256, paragraphs: 10 })
    verify(historical.equality.historicalSCI, 'N19-historical-Chinese-SCI')
  }
  n19Review.push({
    locale, frozenBefore: frozen, currentTemplate, manifest: manifestRef, changedParagraphIndices,
    paragraphCount: outline.length, sharedFigureAnchors: anchors, tableLabel,
    unchangedOtherProseParagraphs: locale === 'zh' ? 10 : 10,
    preservedSourceSnapshot: document.source.sha256,
    changedFields, changedBlockFields,
  })
}
const opening = proseOutline(templateDocuments.get('19/en').prose).slice(0, 2).map(value => value.text)
check('N19-EN-opening-complete-independent-paragraphs', opening[0].endsWith('chosen axis.') &&
  opening[1].startsWith('In electrical oscillations, the changing quantities are the charge $q$') &&
  opening[1].endsWith('are similar.') && !opening[0].endsWith(';'),
{ paragraphs: opening })

const reviewedOriginal = new Map()
for (const figure of ['fig-24', 'fig-25']) {
  const original = current.records.find(value => value.figure === figure)
  const verdict = prior.get(290).figures[figure]
  check(`${figure}-original-review-hashes`, verdict.specSha256 === original.previousSpec.sha256 &&
    verdict.renderSha256 === original.previousRender.sha256 && verdict.svgSha256 === original.svg.sha256, verdict)
  reviewedOriginal.set(figure, { batch: 'D290', spec: original.previousSpec, render: original.previousRender, svg: original.svg })
}
reviewedOriginal.set('fig-26', { batch: 'D291', ...prior.get(291).inputs })
reviewedOriginal.set('fig-27', { batch: 'D285', ...prior.get(285).hashBindings })
for (const record of prior.get(294).records) reviewedOriginal.set(record.id, { batch: 'D294', ...record })
reviewedOriginal.set('tbl-p0053-01', { batch: 'D296', ...prior.get(296).inputs })
const figureReview = []
for (const record of current.records) {
  for (const key of ['previousSpec', 'previousRender', 'spec', 'render', 'svg']) verify(record[key], `${record.figure}-${key}`)
  const spec = json(record.spec.path)
  const render = json(record.render.path)
  const previous = json(record.previousSpec.path)
  const previousRender = json(record.previousRender.path)
  const original = reviewedOriginal.get(record.figure)
  verify(original.spec, `${record.figure}-originally-reviewed-spec`)
  verify(original.render, `${record.figure}-originally-reviewed-render`)
  verify(original.svg, `${record.figure}-originally-reviewed-svg`)
  const originalSpec = json(original.spec.path)
  const originalRender = json(original.render.path)
  const specDiff = diff(previous, spec)
  const originalDiff = diff(originalSpec, spec)
  const allowedSpecChanges = changes => changes.every(field => ['.source.authoritativeText', '.source.image.path'].includes(field))
  check(`${record.figure}-context-only-spec-chain`, allowedSpecChanges(specDiff) && allowedSpecChanges(originalDiff),
    { previousToCurrentChangedFields: specDiff, reviewedOriginalToCurrentChangedFields: originalDiff })
  const renderDiff = diff(previousRender, render)
  const originalRenderDiff = diff(originalRender, render)
  check(`${record.figure}-render-metadata-only-chain`, [renderDiff, originalRenderDiff].every(changes =>
    changes.every(field => ['.spec.path', '.spec.sha256'].includes(field))),
  { previousToCurrentChangedFields: renderDiff, reviewedOriginalToCurrentChangedFields: originalRenderDiff })
  check(`${record.figure}-unchanged-SVG-original-review`, original.svg.sha256 === record.svg.sha256,
    { originallyReviewed: original.svg, current: record.svg })
  verify(spec.source.image, `${record.figure}-current-source-image`)
  const source = binding(spec.source.image.path)
  check(`${record.figure}-same-source-image-bytes`, spec.source.image.sha256 === originalSpec.source.image.sha256,
    { originallyReviewedSource: originalSpec.source.image, currentSource: source })
  const expectedContexts = record.templateBindings.map(value => ({
    lesson: templateDocuments.get(`${value.number}/${value.locale}`).id,
    locale: value.locale,
    text: text(value.text.path),
  }))
  check(`${record.figure}-complete-current-bilingual-context-exact`, equal(spec.source.authoritativeText, expectedContexts),
    { contextEntries: expectedContexts.map(value => ({ lesson: value.lesson, locale: value.locale, textSha256: sha(value.text), utf8Bytes: Buffer.byteLength(value.text) })), templateBindings: record.templateBindings })
  check(`${record.figure}-current-template-binding-set`, record.templateBindings.every(value => {
    const currentBinding = templates.find(candidate => candidate.number === value.number && candidate.locale === value.locale)
    return currentBinding && equal(value.template, currentBinding.template) && equal(value.text, currentBinding.text)
  }), { count: record.templateBindings.length })
  const expectedLessonNumbers = record.figure === 'fig-27' ? [18] : ['fig-28', 'fig-29'].includes(record.figure) ? [18, 19] : record.figure === 'tbl-p0053-01' ? [19] : [17]
  check(`${record.figure}-complete-relevant-lesson-set`, equal(record.templateBindings.map(value => `${value.number}/${value.locale}`),
    expectedLessonNumbers.flatMap(number => [`${number}/zh`, `${number}/en`])), expectedLessonNumbers)
  check(`${record.figure}-render-current-spec-and-original-output-hashes`, render.spec.sha256 === record.spec.sha256 &&
    absolute(render.spec.path) === record.spec.path && render.output.svg.sha256 === record.svg.sha256 &&
    absolute(render.output.svg.path) === record.svg.path && render.status === 'pass',
  { spec: render.spec, output: render.output, historicalRenderStatusReusedNotRerun: render.status })
  figureReview.push({
    figure: record.figure, source, spec: record.spec, render: record.render, svg: record.svg,
    previousSpec: record.previousSpec, previousRender: record.previousRender,
    originalReview: priorReports.find(value => value.batch === original.batch),
    originallyReviewedBindings: { spec: original.spec, render: original.render, svg: original.svg, source: originalSpec.source.image },
    authoritativeTextEntries: expectedContexts.map(value => ({ lesson: value.lesson, locale: value.locale, sha256: sha(value.text), bytes: Buffer.byteLength(value.text) })),
    currentTemplateBindings: record.templateBindings, changedSpecFields: originalDiff, changedRenderFields: originalRenderDiff,
    objectsSha256: sha(JSON.stringify(spec.objects)), assertionsSha256: sha(JSON.stringify(spec.assertions)),
    inventorySha256: sha(JSON.stringify(spec.source.inventory)),
    objectsAssertionsInventoryAndAllOtherSpecFieldsUnchanged: allowedSpecChanges(originalDiff),
    geometryRerenders: 0, independentImagesOpened: 0,
  })
}
check('seven-context-spec-render-pairs', figureReview.length === 7, figureReview.map(value => value.figure))
check('D291-source-math-visual-culture-reuse', ['sourceReview', 'mathReview', 'visualReview', 'culturalReview'].every(key =>
  prior.get(291)[key].status === 'pass'), { originalOverallStatus: prior.get(291).status, integrationFailureOnly: 'D291-F1 old exact EN whitespace binding, now replaced by hash-exact current full text.' })
check('D292-unchanged-English-science-reuse', prior.get(292).outcomes.EnglishScience === 'PASS' &&
  prior.get(292).outcomes.EnglishSemanticTranslationCoverage === 'PASS', prior.get(292).outcomes)
check('D279-original-science-text-status', prior.get(279).verdict === 'PASS_TEXT_ONLY', priorReports.find(value => value.batch === 'D279'))
check('D285-original-figure-stage-statuses', prior.get(285).status === 'pass' &&
  ['mathematical', 'visual', 'cultural'].every(key => prior.get(285).verdicts[key].status === 'pass'),
priorReports.find(value => value.batch === 'D285'))
check('D290-original-figure-stage-statuses', prior.get(290).status === 'pass' &&
  Object.values(prior.get(290).figures).every(value => ['mathSourceReview', 'visualReview', 'culturalReview'].every(key => value[key] === 'pass')),
priorReports.find(value => value.batch === 'D290'))
check('D294-original-figure-stage-statuses', prior.get(294).status === 'pass' &&
  prior.get(294).records.every(value => ['sourceVerdict', 'mathematicalVerdict', 'visualVerdict', 'culturalVerdict'].every(key => value[key].status === 'pass')),
priorReports.find(value => value.batch === 'D294'))
check('D296-original-table-stage-statuses', prior.get(296).status === 'pass' &&
  ['sourceReview', 'mathematicsReview', 'visualReview', 'culturalReview'].every(key => prior.get(296)[key].status === 'pass'),
priorReports.find(value => value.batch === 'D296'))
const editionTool = text(current.nativeTool.path)
check('current-native-explicit-paragraph-bold-and-Table-contract', editionTool.includes('explicit_paragraphs = re.split') &&
  editionTool.includes('if len(explicit_paragraphs) > 1:') &&
  editionTool.includes('joined_lines[-1] += closing.group(1)') &&
  editionTool.includes('if source == "\u8868":\n        return modern == "Table"'),
{ actualCurrentTool: current.nativeTool, historicalD287Tool: historical.nativeToolBindings.find(value => value.path.endsWith('/edition.py')), runtimeValidationNotPerformed: true })

const historicalDrift = historicalBindingObservations.filter(value => value.status !== 'hash-matches')
const permittedHistoricalDrift = filename => templates.some(value => value.template.path === filename) ||
  repair.templates.some(value => value.manifest.path === filename) ||
  filename === absolute('.claude/skills/ld-s10y-lesson/tools/edition.py') ||
  filename === '/Users/yong/.agents/skills/intentfold/SKILL.md'
for (const item of historicalDrift) {
  check(`historical-drift-disposition:${item.origin}:${item.pointer}`, permittedHistoricalDrift(absolute(item.declared.path)),
    { ...item, disposition: 'Original receipt/report stays immutable and historical. Current six templates, authorized D298 manifests and actual tool are separately hash-bound; no old template, manifest or tool hash is asserted current.' })
}
const driftDuringAudit = []
for (const input of initial.values()) {
  const bytes = fs.readFileSync(input.path)
  if (sha(bytes) !== input.sha256) driftDuringAudit.push({ before: input, after: { path: input.path, bytes: bytes.length, sha256: sha(bytes) } })
}
check('all-bound-inputs-unchanged-at-seal', driftDuringAudit.length === 0, driftDuringAudit)
const verdict = findings.length ? 'FAIL' : 'PASS_AFFECTED_TEXT_AND_CONTEXT_ONLY'
const report = {
  schema: 'd300/affected-text-and-context-review@1',
  ticket: 'STEMROBIN-181', batch: 'D300', date: '2026-11-20', reviewedAt: new Date().toISOString(),
  cwd: root, ownedDirectory: owned, verdict, findings,
  scope: {
    affectedOnly: true, actualImages: 0, actualImageOpens: 0,
    reviewed: [
      'D298 English N19 native opening paragraphs 0/1, their standalone completeness and equivalent comparison meaning.',
      'Current N19 reconstructed raw identity/source snapshot, unique shared fig-28/29 source-reference anchors, unnumbered Table aliases/source metadata; exact ten approved Chinese paragraphs and their old flow.',
      'D295 N17/N18 whitespace-only teaching changes and uniquely resolved semantic concept boundaries; D299 raw English identity restoration with repository TOC breadcrumbs.',
      'All seven D299 full current bilingual FigureSpec contexts and exact current template/full-text bindings, unchanged source/inventory/objects/assertions/SVG, metadata-only render rebinding.',
      'Actual current native tool hash and explicit historical disposition of D287 receipts.',
    ],
    notReviewedOrAuthorized: [
      'No repeated whole science, original pixels, geometry, visual or cultural review.',
      'No review@1 recording, durable promotion, whole-lesson/course acceptance, publication, deployment, DB, Git, backend, capability/freshness operation, paid call or peer message.',
      'No claim that the lost original N19 template bytes were recovered.',
      'No new normalizer/finalization/runtime/renderer validation pass; only existing parser calls for affected text/anchor equality.',
    ],
    ticketPremise: 'Offline parent live ticket read and freshness already satisfied as directly supplied by the human.',
  },
  resultBindings: { D299: binding(mainPath), D298: binding(current.textRepair.path), D295: binding(current.layoutRepair.path), D287Historical: binding(path.join(tmp, 'd1816-d287-n19-text-recovery/d287-report.json')) },
  priorLocalAuditAttempt: fs.existsSync(firstAttempt) ? {
    path: firstAttempt,
    sha256: sha(fs.readFileSync(firstAttempt)),
    classification: 'Local audit-script bookkeeping failure, not a content-review failure: six duplicate declarations of the two D298-authorized current figure manifests were not yet included in the historical-drift classification. Their actual current source metadata and exact hashes passed. Corrected only this owned audit script; no candidate edits or passed-stage reruns.',
  } : null,
  currentNativeTool: current.nativeTool,
  historicalNativeReceipts: {
    report: binding(path.join(tmp, 'd1816-d287-n19-text-recovery/d287-report.json')),
    receipts: historical.nativeReceipts,
    originalTool: historical.nativeToolBindings.find(value => value.path.endsWith('/edition.py')),
    disposition: 'D287 receipts and their success are historical at their own original tool hash. They were preserved, hash-read only, never relabelled as current-tool validation or rerun.',
    currentToolBehaviorInspection: 'Current explicit blank-line paragraphs are retained; closing bold markers attach to preceding lines; exact English Table alias is allowed only for the raw unnumbered table label. This is read-only affected-contract inspection, not a new native validation receipt.',
  },
  currentTemplates: templates,
  N19AffectedReview: {
    locales: n19Review, EnglishOpeningParagraphs: opening,
    judgment: 'The mechanical paragraph ends its coordinate/velocity comparison with a full stop. The next starts with an explicit electrical-oscillation subject and names charge/current without antecedent-dependent they. The different physical meanings versus similar periodic time changes remain explicit; no numerical/dimensional equality is introduced. All other ten EN native paragraphs and all ten ZH native paragraphs are exact old approved/reviewed text.',
    D292FindingsDisposition: [
      { id: 'D292-EN-01', disposition: 'Resolved by D298 sole targeted paragraph-0/1 repair; examined here only for standalone completeness and unchanged comparison science.' },
      { id: 'D292-BINDING-declared-reference-44', disposition: 'Historical-tool disposition resolved: actual current tool bound; original D287 receipts retained as historical, no false current-tool execution claim.' },
    ],
  },
  N17N18WhitespaceAndConceptBoundaries: whitespaceReview,
  figures: figureReview,
  priorReviewReports: priorReports,
  reuseScope: {
    D279: 'Only existing approved bilingual N17/N18 teaching/science assessments. D300 checks whitespace and anchors, not a new complete SCI review.',
    D292: 'Reuse passing unchanged EN science/coverage/conventions and source metadata; D292 overall FAIL remains historical. D300 resolves only its two identified affected issues.',
    N19Chinese: { historicalSCI: historical.equality.historicalSCI, approvedParagraphsSha256: historical.equality.retainedCombinedSha256, paragraphs: 10, newSCI: false },
    originalIndependentFigureReviewsRequiredSeparately: priorReports.filter(value => [285, 290, 291, 294, 296].includes(Number(value.batch.slice(1)))),
    figureSelectionRule: 'A current spec/svg/render/reviewReport selection may reference D300 ONLY for affected text/context integration. The separately listed original source/math/visual/cultural reports and their original source/spec/render/SVG bindings remain mandatory. D300 alone is not figure approval, formal review@1, promotion or publication.',
    D291: 'Reuse only source/math/visual/cultural PASS and its independent checks supporting nonblocking assertion limits. Do not reinterpret old overall FAIL as overall PASS; current exact-context integration is settled here.',
    invalidation: 'Any later change to current result/template/text/spec/render/SVG/source or reused report binding invalidates this affected hash-bound selection and needs only genuinely affected reassessment.',
  },
  contracts: contracts,
  priorReviewAndRepairInputBindings: historicalBindingObservations,
  historicalDriftDispositions: historicalDrift,
  inputBindings: [...initial.values()],
  allInputsUnchangedAtSeal: driftDuringAudit.length === 0,
  checks,
  actualOperations: {
    actualImages: 0, imageOpens: 0, imageDecodeOrViewing: 0, redraws: 0, geometryRerenders: 0,
    passedStageReruns: 0, sourceMathVisualCulturalRereviews: 0, wholeScienceRereviews: 0,
    candidateTemplateEdits: 0, sourceOrAssetEdits: 0, reviewAt1Writes: 0,
    backendReadsOrWrites: 0, capabilities: 0, freshnessOperations: 0, GitCommands: 0,
    databaseConnections: 0, publishActions: 0, deployActions: 0, fullChecks: 0, paidCalls: 0, peerMessages: 0,
    binaryHashReadsOnly: true, writesOnlyWithinOwnedDirectory: true, reverts: 0,
  },
  reproduction: { path: path.join(owned, 'audit.mjs'), sha256: sha(fs.readFileSync(path.join(owned, 'audit.mjs'))), note: 'Read-only affected equality/hash audit. Writes only its report and, on pass, context-only selection records in this owned directory. No stage producers are invoked.' },
}
write('report.json', report)
const reportBytes = fs.readFileSync(path.join(owned, 'report.json'))
const reportBinding = { path: path.join(owned, 'report.json'), bytes: reportBytes.length, sha256: sha(reportBytes) }
if (verdict !== 'FAIL') {
  for (const figure of figureReview) {
    write(`${figure.figure}.selection.json`, {
      schema: 'd300/affected-context-only-selection@1', ticket: 'STEMROBIN-181', figure: figure.figure,
      verdict, scope: 'AFFECTED_TEXT_AND_CONTEXT_ONLY', spec: figure.spec, svg: figure.svg, render: figure.render,
      source: figure.source, reviewReport: reportBinding,
      requiredSeparateSourceMathVisualCulturalReport: figure.originalReview,
      originallyReviewedBindings: figure.originallyReviewedBindings,
      originalReportOverallFailureIsNotOverridden: figure.figure === 'fig-26',
      formalReviewRecorded: false, promoted: false, actualImages: 0,
      rule: report.reuseScope.figureSelectionRule,
    })
  }
}
console.log(JSON.stringify({ verdict, report: reportBinding, checks: checks.length, inputFiles: initial.size, historicalDrift: historicalDrift.length, findings }, null, 2))
