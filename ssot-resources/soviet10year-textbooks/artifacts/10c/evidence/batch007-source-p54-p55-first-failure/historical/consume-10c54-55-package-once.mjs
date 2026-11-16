import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const T = '/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp'
const E = path.join(T, 'source-10c-p54-p55-author-evidence')
const output = path.join(T, 'source-10c-p54-p55-full-consumption.json')
assert(!fs.existsSync(output), 'One completed package consumption only')
const sha = bytes => createHash('sha256').update(bytes).digest('hex')
const hash = file => sha(fs.readFileSync(file))
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const manifestPath = path.join(E, 'full-author-manifest.json')
const reportPath = path.join(E, 'full-author-report.md')
assert.equal(hash(manifestPath), '0b676c6ef8b0c4b8ab0e48ac895ce8f152e437ca9a6522914c58123554ccffeb')
assert.equal(hash(reportPath), '8e5858fb7f09b8fb62cc37d4905495d601d7a47adbccbb3d566906563f6376ad')
const m = read(manifestPath)
const i = m.authorInventory
assert.deepEqual(i, read(path.join(E, 'author-inventory.json')))
const checked = new Set()
for (const entry of m.entries) {
  assert.equal(fs.statSync(entry.path).size, entry.size, entry.path)
  assert.equal(hash(entry.path), entry.sha256, entry.path)
  checked.add(entry.path)
}
const missingReferences = []
const historicalReferences = []
const consumeBindings = value => {
  if (!value || typeof value !== 'object') return
  if (value.sha256 && value.path) {
    const file = value.bytecopy || value.path
    if (file.startsWith(E + '/')) {
      if (!fs.existsSync(file)) missingReferences.push(value)
      else {
        assert.equal(hash(file), value.sha256, file)
        if (value.size !== undefined) assert.equal(fs.statSync(file).size, value.size, file)
        checked.add(file)
      }
    } else historicalReferences.push(value)
  }
  for (const child of Object.values(value)) consumeBindings(child)
}
consumeBindings(i)
let rows = 0
let glyphs = 0
for (const p of i.pages) {
  const finalDir = path.join(E, 'targetafter/durable', String(p.physicalPage).padStart(4, '0'))
  const data = read(path.join(finalDir, 'page.json'))
  assert.deepEqual(p.completeFrontmatter, data.meta)
  assert.deepEqual(p.audit, read(path.join(finalDir, 'audit.json')))
  assert.equal(hash(p.sourceMdAfterFirstFinalize.path), hash(p.sourceMdFinal.path))
  assert.equal(
    p.beforeAfterBytesEqual,
    hash(p.sourceMdBeforeFirstFinalize.path) === hash(p.sourceMdAfterFirstFinalize.path),
  )
  assert.equal(data.blocks.length, p.completeSerializedBlocks.length)
  for (const [index, block] of p.completeSerializedBlocks.entries()) {
    const { ordinal, sourceObservation, rows: blockRows, ...serialized } = block
    assert.deepEqual(serialized, data.blocks[index])
    assert.deepEqual(sourceObservation, p.blocks[index])
    assert.equal(ordinal, index + 1)
    assert.deepEqual((blockRows || []).map(row => row.text), block.lines)
    for (const row of blockRows || []) {
      assert.equal(row.utf8Sha256, sha(Buffer.from(row.text)))
      assert.equal(row.unicodeGlyphsInOrder.map(item => item.glyph).join(''), row.text)
      for (const [position, item] of row.unicodeGlyphsInOrder.entries()) {
        assert.equal(item.position, position)
        assert.equal(item.codepoint, `U+${item.glyph.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`)
        glyphs++
      }
      for (const span of row.mathSpans) {
        assert.equal(row.text.slice(span.utf16Offset, span.utf16Offset + span.literal.length), span.literal)
        assert.deepEqual(span.latexCommands, span.content.match(/\\[a-zA-Z]+/g) || [])
      }
      rows++
    }
    console.log(JSON.stringify({
      page: p.physicalPage, ...serialized, sourceObservation,
      math: (blockRows || []).map(row => row.mathSpans),
      emphasis: (blockRows || []).map(row => row.encodedEmphasis),
    }))
  }
  console.log(JSON.stringify({
    page: p.physicalPage, glyphAndEmphasisFacts: p.glyphAndEmphasisFacts,
    imageInventory: p.imageInventory, unknowns: p.unknowns,
    metadata: p.completeFrontmatter, audit: p.audit,
  }))
  for (const variant of p.allTargetVariants) {
    const phase = i.completePhases.find(item => item.phase === variant.phase)
    assert.deepEqual(variant.metadata, phase.metadata)
    assert.deepEqual(variant.target, phase.targets.find(item => Number(item.page) === p.physicalPage))
  }
}
for (const phase of i.completePhases) {
  const metadata = read(phase.metadata.path)
  assert.deepEqual(phase.targets, metadata.targets)
  consumeBindings(metadata)
  console.log(JSON.stringify({
    phase: phase.phase, capturedAt: metadata.capturedAt,
    targets: phase.targets.map(target => ({
      page: target.page, durableState: target.durable.state,
      mdState: target.sourceMd.state, mdSha256: target.sourceMd.sha256,
    })),
    tools: metadata.tools.map(tool => ({
      path: tool.path, sha256: tool.sha256, resolvedSha256: tool.resolvedSha256,
    })),
  }))
}
for (const command of i.completeCommands) {
  console.log(JSON.stringify({
    name: command.name, executable: command.start.executable,
    args: command.start.args, cwd: command.start.cwd,
    startedAt: command.start.startedAt, endedAt: command.result.endedAt,
    exit: command.result.exit, stdout: command.result.stdout, stderr: command.result.stderr,
    tools: command.start.tools?.map(tool => ({ path: tool.path, sha256: tool.sha256 })),
  }))
}
console.log(JSON.stringify({ scope: i.scope, pipelineOutcome: i.pipelineOutcome }))
const result = {
  role: 'FULL_STRUCTURED_PACKAGE_CONSUMPTION_NOT_SECOND_SOURCE_REVIEW',
  reportSha256: hash(reportPath), manifestSha256: hash(manifestPath),
  manifestEntries: m.entries.length, checkedFilePaths: checked.size, rows, glyphs,
  pages: i.pages.length, commands: i.completeCommands.length, phases: i.completePhases.length,
  embeddedInventoryExactlyCompared: true, serializedRowsAndGlyphsExactlyCompared: true,
  repeatedVariantsExactlyCompared: true, missingReferences,
  historicalBindingCount: historicalReferences.length,
  historicalToolLimits: 'Saved tool hashes and non-access-time metadata are historical declarations. Shared layout changed in parent; snapshots do not certify which module bytes the finalize subprocess loaded.',
  pipelineOutcome: i.pipelineOutcome,
  diagnosticClientFailure: {
    toolChunk: 'ec3333', exitCode: 1,
    cause: 'Shape-only read assumed first serialized block had a first text row; page55 begins with an empty figure block.',
    sourceOrPipelineFailure: false, authorPackageModified: false,
  },
  timestamp: new Date().toISOString(),
}
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify(result))
