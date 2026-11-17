import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const tmp = path.resolve('.intentfold/tickets/STEMROBIN-184/tmp')
const evidence = path.resolve('ssot-resources/soviet10year-textbooks/artifacts/10c/evidence')
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const author = `${tmp}/production-source10c196-199-author`
const stageA = `${tmp}/production-source10c196-199-review`
const promotion = `${tmp}/production-promoted10c125`
assert.equal(hash(fs.readFileSync(`${author}/hash-manifest.json`)), '99d70bcc29ef6ecd3df3bbd46d5cc354c78bb17976b053581d7df24245bc526f')
assert.equal(hash(fs.readFileSync(`${stageA}/freeze.sha256`)), 'fa21f10316c574101c11c9fc1c9d26d96c69c38eea649a32f8820510f6356ab7')
const groups = [
  {
    name: 'batch012-125-promotion',
    roots: [[promotion, 'promotion'], [`${tmp}/production-promote125-command`, 'actual-command'],
      [`${tmp}/production-promote10c125-once.mjs`, 'production-promote10c125-once.mjs'],
      [`${tmp}/production-run-promote125-once.mjs`, 'production-run-promote125-once.mjs']],
    consumption: 'Actual sole promotion992cb2 exit0; full promotion ten copies and before/after identities d788f9 consumed. First visual retainedbb6dfa before decision. No acceptance rerun.',
    qualification: 'Only125 OFFLINE_ONLY promoted; local31 complete,114+125 uncommitted. Zero exercises/answers/choices/options/figures. Existing entries and partial source audit retained; prior124/incomplete supplement excluded, historical source-relative wording limitation retained. No Git/DB/product acceptance.',
  },
  {
    name: 'batch012-source196199-first-author',
    roots: [[author, 'author'], [`${tmp}/production-prepare10c196-199-once.mjs`, 'prepare-helper.mjs'],
      [path.resolve('.claude/skills/ld-s10y-lesson/tools/layout.py'), 'frozen-layout.py']],
    manifest: `${author}/hash-manifest.json`,
    consumption: 'Full source inventory/manifest/hashcommand507072, firstretention892734 inherited consumed. Final session8f9fcb, ledgerf4291f, actual command recorda2c4a3, both recorder definitions8e26e8/2b0256 and all four canonical MDs3a9b83/b4e12a/fd50c1/a15834 now fully consumed. Initial197 missing footer remains in first snapshot. No source review acceptance.',
    qualification: 'First author only, permanent7/24 batch7/8. Incoming195/external and198/199 representation/glyph/punctuation holds remain. Original false comparison suppliedPrepareLayoutSha256 versus page layout.json remains immutable. Parent clarification: the prepare helper e96aae assigns that field from shared tools/layout.py, SHA899ea25c2ede96a1f8c60eec3b5565e22f967e2c345d34d8255a11dc21d88a73, NOT per-page layout.json. Distinct-object hash inequality is not a failed prepare or detected drift.',
  },
  {
    name: 'batch012-source196199-stageA',
    roots: [[stageA, 'stageA']],
    hashLists: [[`${stageA}/freeze.sha256`, stageA], [`${stageA}/hashseal.sha256`, stageA],
      [`${stageA}/source-hashes.sha256`, process.cwd()]],
    consumption: 'Full report/ledger/freeze/hashseal7249d2 inherited. Prior combined65f723 truncated;198 missing tail and199 beginning not assumed consumed. Now full198 b3ac16+4e6ce0 and full199 a92c0f consumed; actual command/seal sections previously visible bound without rerun. Source/hash freeze lists1a491b/23d2c0/917133 bound once.',
    qualification: 'Sole source-first StageA frozen with zero author access. Nash permanent7/24 batch7/8, remaining1 new image slot; no reset or reopen. Not source finalization/assembly/unit acceptance. All UNKNOWNs and independent disagreement preserved before sole author disclosure.',
  },
]
const summaries = []
for (const group of groups) {
  const output = `${evidence}/${group.name}`
  assert(!fs.existsSync(output), 'Sole retention; never overwrite historical packages')
  const files = []
  const bySource = new Map()
  function collect(file, retained) {
    file = path.resolve(file)
    if (bySource.has(file)) return
    const stat = fs.lstatSync(file)
    assert(!stat.isSymbolicLink())
    assert(!['.env', '.venv', 'node_modules', '__pycache__'].includes(path.basename(file)))
    if (stat.isDirectory()) {
      for (const name of fs.readdirSync(file).sort()) collect(`${file}/${name}`, `${retained}/${name}`)
    } else {
      assert(stat.isFile())
      const bytes = fs.readFileSync(file)
      const item = { source: file, retained, bytes: bytes.length, sha256: hash(bytes) }
      bySource.set(file, item)
      files.push(item)
    }
  }
  for (const [file, name] of group.roots) collect(file, `${output}/${name}`)
  collect(`${tmp}/production-retain125-promotion196-first-once.mjs`, `${output}/retention-helper.mjs`)
  const externalPath = file => `${output}/external/${path.resolve(file).slice(1)}`
  let payloadBindings = 0
  if (group.manifest) {
    for (const entry of read(group.manifest).files) {
      collect(entry.path, externalPath(entry.path))
      const actual = bySource.get(path.resolve(entry.path))
      assert.equal(actual.sha256, entry.sha256)
      assert.equal(actual.bytes, entry.bytes)
      payloadBindings++
    }
  }
  for (const [file, base] of group.hashLists ?? []) {
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      if (!line || line.startsWith('#')) continue
      const match = /^([a-f0-9]{64}) {2}(.+)$/.exec(line)
      assert(match, `Unrecognized hash binding: ${file}`)
      const source = path.resolve(base, match[2])
      collect(source, externalPath(source))
      assert.equal(bySource.get(source).sha256, match[1])
      payloadBindings++
    }
  }
  for (const item of files) {
    fs.mkdirSync(path.dirname(item.retained), { recursive: true })
    fs.copyFileSync(item.source, item.retained, fs.constants.COPYFILE_EXCL)
    assert.equal(hash(fs.readFileSync(item.retained)), item.sha256)
  }
  const result = {
    ticket: 'STEMROBIN-184', session: 'sameSessionB',
    executable: process.execPath, args: process.argv.slice(1), cwd: process.cwd(), exitCode: 0,
    totalFiles: files.length, totalBytes: files.reduce((sum, item) => sum + item.bytes, 0),
    payloadBindings, copied: files, exclusions: [], consumption: group.consumption,
    qualification: group.qualification, parentImages: 'Permanent24/24 zero opens/payloads',
    acceptanceReruns: 0, historicalStatusesUnchanged: true,
  }
  fs.writeFileSync(`${output}/copy-manifest.json`, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
  summaries.push({ output, totalFiles: result.totalFiles, totalBytes: result.totalBytes,
    payloadBindings, exclusions: [] })
}
console.log(JSON.stringify(summaries, null, 2))
