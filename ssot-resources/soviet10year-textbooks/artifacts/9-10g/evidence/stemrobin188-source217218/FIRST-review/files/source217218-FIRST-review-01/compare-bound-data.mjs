import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { isDeepStrictEqual } from 'node:util'

const root = path.dirname(new URL(import.meta.url).pathname)
const tmp = path.resolve(root, '..')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = value => crypto.createHash('sha256').update(value).digest('hex')
const mdParts = p => {
  const text = fs.readFileSync(p, 'utf8')
  const header = /^---\n([\s\S]*?)\n---\n/.exec(text)
  if (!header) throw new Error(`Missing JSON frontmatter: ${p}`)
  return { meta: JSON.parse(header[1]), body: text.slice(header[0].length) }
}
// Only the explicitly inventoried glyph serializations are equated; punctuation is not normalized.
const glyphs = text => text.replace(/\\text\{([^{}]+)\}/g, '$1')
  .replace(/\\varphi/g, 'φ').replace(/\\alpha/g, 'α').replace(/\\pi/g, 'π')
  .replace(/\\frac\{a\}\{b\}/g, 'a/b').replace(/\^2/g, '²')
  .replace(/\\%/g, '%').replace(/\$/g, '').replace(/\s+/g, '')
const sourceRows = []
for (const n of [217, 218]) {
  const first = read(path.join(root, `FIRST${n}.json`))
  const pageRoot = path.join(tmp, `source216218-author/artifacts/9-10g/pages/0${n}`)
  const candidate = read(path.join(pageRoot, 'page.json'))
  const md = mdParts(path.join(pageRoot, 'page.md'))
  const candidateRows = candidate.blocks.flatMap((block, index) =>
    block.kind === 'foot' ? [] : block.lines.map((text, line) => ({
      ref: `p0${n}#${index + 1}`, line: line + 1, text,
    })))
  const firstRows = first.literalTextRows.filter(row => row.id !== 'footer')
  const comparisons = firstRows.map((row, index) => ({
    firstRow: row.id, firstObject: row.object, firstText: row.text,
    candidate: candidateRows[index] ?? null,
    equalWithExplicitGlyphSerialization: candidateRows[index] !== undefined
      && glyphs(row.text) === glyphs(candidateRows[index].text),
  }))
  const mdRows = md.body.split('\n').filter(line => line.trim() &&
    !line.startsWith('<!--') && !line.startsWith('!['))
  const jsonRows = candidate.blocks.flatMap(block => block.lines)
  sourceRows.push({
    physicalPage: n, firstRows: firstRows.length, candidateRows: candidateRows.length,
    allWordMathNumberPunctuationRowsMatch: firstRows.length === candidateRows.length
      && comparisons.every(row => row.equalWithExplicitGlyphSerialization),
    candidateMDRowsExactlyEqualJSONRows: JSON.stringify(mdRows) === JSON.stringify(jsonRows),
    candidateMDMetaExactlyEqualJSONMeta: isDeepStrictEqual(md.meta, candidate.meta),
    physicalRowsWithFolio: n === 217 ? 18 : 24,
    sourceFolioFlankingDotsInventoriedButNotTextRows: true,
    comparisons,
    blockFlags: candidate.blocks.map((block, index) => ({
      ref: `p0${n}#${index + 1}`, kind: block.kind, label: block.label,
      cont: block.cont, open: block.open, samerow: block.samerow,
      owner_exercise: block.owner_exercise, id: block.id ?? null,
    })),
    numbering_scope: candidate.meta.numbering_scope ?? null,
  })
}
fs.writeFileSync(path.join(root, 'source-row-comparison.json'),
  JSON.stringify({ schema: 'stemrobin188-sealed-source-row-comparison@1',
    notAReplacementForIndependentPixelReview: true, pages: sourceRows }, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify(sourceRows.map(page => ({
  page: page.physicalPage, rows: page.firstRows, allRowsMatch: page.allWordMathNumberPunctuationRowsMatch,
  MDJSONRowsExact: page.candidateMDRowsExactlyEqualJSONRows,
  MDJSONMetaExact: page.candidateMDMetaExactlyEqualJSONMeta,
  mismatch: page.comparisons.filter(row => !row.equalWithExplicitGlyphSerialization),
})), null, 2))

const oldRoot = path.join(tmp, 'source213215-author/artifacts/9-10g/pages/0214')
const newRoot = path.join(tmp, 'source214-owner-separator-repair-01/artifacts/9-10g/pages/0214')
const differences = (before, after, pointer = '') => {
  if (JSON.stringify(before) === JSON.stringify(after)) return []
  if (before === null || after === null || typeof before !== 'object' || typeof after !== 'object')
    return [{ pointer, before: before ?? null, after: after ?? null }]
  return [...new Set([...Object.keys(before), ...Object.keys(after)])].flatMap(key =>
    differences(before[key], after[key], `${pointer}/${key}`))
}
const oldPage = read(path.join(oldRoot, 'page.json'))
const newPage = read(path.join(newRoot, 'page.json'))
const oldMD = mdParts(path.join(oldRoot, 'page.md'))
const newMD = mdParts(path.join(newRoot, 'page.md'))
const oldAudit = read(path.join(oldRoot, 'audit.json'))
const newAudit = read(path.join(newRoot, 'audit.json'))
const expected = structuredClone(oldPage)
expected.blocks[7].owner_exercise = '190'
const newExclusion = {
  kind: 'separator-rule', box: [140, 1877, 438, 6],
  reason: 'Independently sealed FIRST214 identifies this exact printed footnote separator as non-text; exclude only from counting, never source pixels or extraction.',
}
const expectedNote = 'REPAIR1: bind the printed tangent-definition footnote to exercise190 and count-exclude only the independently observed footnote separator at XYWH [140,1877,438,6]. Original FIRST/native19over18 failure and all other glyph/figure/source-scope holds remain preserved.'
expected.meta.count_exclusions = [newExclusion]
expected.meta.notes = [...oldPage.meta.notes, expectedNote]
expected.meta.printed_lines = 18
const first214 = read(path.join(tmp, 'source213214-FIRST-review-01/FIRST214.json'))
const report214 = read(path.join(tmp, 'source213214-FIRST-review-01/report.json'))
const affected = {
  schema: 'stemrobin188-zero-image214-affected-data-comparison@1',
  scope: 'Owner-ex190 and exact separator counting metadata only; no semantic re-review of frozen text or mathematics.',
  JSONDifferences: differences(oldPage, newPage),
  auditDifferences: differences(oldAudit, newAudit),
  allJSONFieldsMatchExactAuthorizedDelta: isDeepStrictEqual(expected, newPage),
  allFrozenBlockFieldsDeepEqualExceptOwner: differences(oldPage.blocks, newPage.blocks)
    .every(item => item.pointer === '/7/owner_exercise'),
  allFrozenTextRowsByteEqual: JSON.stringify(oldPage.blocks.map(block => block.lines))
    === JSON.stringify(newPage.blocks.map(block => block.lines)),
  originalMDHeader: '<!-- foot note -->',
  repairedMDHeader: '<!-- foot note owner-ex 190 -->',
  onlyMDBodyDeltaIsOwnerHeader: oldMD.body.replace('<!-- foot note -->', '<!-- foot note owner-ex 190 -->') === newMD.body,
  preNativeBodyMatchesFinalRepairBody: mdParts(path.join(tmp, 'source214-owner-separator-repair-01/pre-native-repair1.md')).body === newMD.body,
  sourcePixelHashes: [
    'source213215-author/work/9-10g/pages/0214/page.png',
    'source214-owner-separator-repair-01/work/9-10g/pages/0214/page.png',
  ].map(relative => ({ path: path.join(tmp, relative), sha256: hash(fs.readFileSync(path.join(tmp, relative))) })),
  figurePixelHashes: [
    'source213215-author/work/9-10g/pages/0214/figures/fig-g10-75.png',
    'source214-owner-separator-repair-01/work/9-10g/pages/0214/figures/fig-g10-75.png',
  ].map(relative => ({ path: path.join(tmp, relative), sha256: hash(fs.readFileSync(path.join(tmp, relative))) })),
  layoutHashes: [
    'source213215-author/work/9-10g/pages/0214/layout.json',
    'source214-owner-separator-repair-01/work/9-10g/pages/0214/layout.json',
  ].map(relative => ({ path: path.join(tmp, relative), sha256: hash(fs.readFileSync(path.join(tmp, relative))) })),
  independentlySealedOwnerBasis: {
    firstPath: path.join(tmp, 'source213214-FIRST-review-01/FIRST214.json'),
    firstSha256: '6c05ba2e953581bce9141ff740b37762766adb70ef6252a248cbba89d32769f3',
    firstMode: (fs.statSync(path.join(tmp, 'source213214-FIRST-review-01/FIRST214.json')).mode & 0o777).toString(8),
    footnote: first214.footnotes[0],
  },
  independentlySealedSeparatorSemantics: first214.physicalCompleteness.independentlyNonText,
  alreadyBoundExactGeometry: report214.definiteFAIL.find(item => item.id === 'F214-native-count-failure-retained').extraBand,
  savedOriginalNative: read(path.join(tmp, 'source213215-author/native/0214/command.json')),
  savedRepairNative: read(path.join(tmp, 'source214-owner-separator-repair-01/native-affected-once/command.json')),
  savedRepairAuditRows: { printed: newAudit.lines_printed, md: newAudit.lines_md, errors: newAudit.errors },
  originalHistoricalFAILs: report214.definiteFAIL.map(item => item.id),
  originalHistoricalHOLDs: report214.HOLD.map(item => item.id),
  imagesLoaded: 0, nativeCalls: 0, counterCalls: 0, sourceWrites: 0,
}
fs.writeFileSync(path.join(root, 'affected214-data-comparison.json'),
  JSON.stringify(affected, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({
  affected214: {
    allJSONFieldsMatchExactAuthorizedDelta: affected.allJSONFieldsMatchExactAuthorizedDelta,
    allFrozenBlockFieldsDeepEqualExceptOwner: affected.allFrozenBlockFieldsDeepEqualExceptOwner,
    allFrozenTextRowsByteEqual: affected.allFrozenTextRowsByteEqual,
    onlyMDBodyDeltaIsOwnerHeader: affected.onlyMDBodyDeltaIsOwnerHeader,
    preNativeBodyMatchesFinalRepairBody: affected.preNativeBodyMatchesFinalRepairBody,
    JSONDifferences: affected.JSONDifferences,
    auditDifferences: affected.auditDifferences,
    savedRepairRows: affected.savedRepairAuditRows,
  },
}, null, 2))
