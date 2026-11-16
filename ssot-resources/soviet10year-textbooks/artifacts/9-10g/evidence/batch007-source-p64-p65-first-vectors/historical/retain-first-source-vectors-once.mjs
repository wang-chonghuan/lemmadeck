import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const evidence = `${ticket}/source-reviewed-pairs-first-vectors`
const data = JSON.parse(fs.readFileSync(`${evidence}/after.json`))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const books = [...new Set(data.results.map(result => result.book))]
const plans = books.map(book => {
  const base = `ssot-resources/soviet10year-textbooks/artifacts/${book}`
  const pages = data.results.filter(result => result.book === book)
  const destination = `${base}/evidence/batch007-source-p${pages[0].page}-p${pages.at(-1).page}-first-vectors`
  assert(!fs.existsSync(destination), 'First retention only')
  const files = new Map()
  const add = (file, relative) => {
    assert(fs.lstatSync(file).isFile() && !fs.lstatSync(file).isSymbolicLink())
    files.set(file, { relative, sha256: hash(file), bytes: fs.statSync(file).size })
  }
  for (const name of ['before.json', 'after.json'])
    add(`${evidence}/${name}`, `historical/${name}`)
  add(`${ticket}/vectorize-reviewed-source-pairs-first.mjs`, 'historical/first-vectorize.mjs')
  add(process.argv[1], 'historical/retain-first-source-vectors-once.mjs')
  for (const item of pages) {
    assert.equal(item.record.exitCode, 0)
    for (const suffix of ['start.json', 'command.json', 'stdout.txt', 'stderr.txt']) {
      const file = `${evidence}/${book}-p${String(item.page).padStart(4, '0')}.${suffix}`
      add(file, `historical/${path.basename(file)}`)
    }
    for (const output of item.outputs) {
      assert.equal(hash(output.path), output.sha256)
      add(output.path, `vectors/${path.basename(output.path)}`)
      const png = output.path.replace(/\.svg$/, '.png')
      const expected = data.protectedFiles.find(item => item.path === png)
      assert(expected)
      assert.equal(hash(png), expected.sha256)
      add(png, `vectors/${path.basename(png)}`)
    }
  }
  return { book, destination, pages: pages.map(page => page.page), files }
})
for (const plan of plans) {
  fs.mkdirSync(plan.destination)
  for (const [file, record] of plan.files) {
    const output = `${plan.destination}/${record.relative}`
    fs.mkdirSync(path.dirname(output), { recursive: true })
    fs.copyFileSync(file, output, fs.constants.COPYFILE_EXCL)
    assert.equal(hash(output), record.sha256)
    fs.chmodSync(output, 0o444)
  }
  const record = {
    role: 'MECHANICAL_EXACT_BYTE_RETENTION_ONLY',
    status: 'SOURCE_VECTORS_NOT_ASSEMBLED_NOT_COMPLETE',
    book: plan.book, physicalPages: plan.pages, timestamp: new Date().toISOString(),
    files: [...plan.files].map(([file, item]) => ({ ...item, historicalSourcePathOnly: file })),
    filesCopied: plan.files.size,
    bytesCopied: [...plan.files.values()].reduce((sum, file) => sum + file.bytes, 0),
    limits: 'No images or semantic review, regeneration, count/finalize, assembly, book/modern edits, publishing or Git. Prior source uncertainty and failures remain in the original retention.',
    runtimeDependencies: [],
  }
  const file = `${plan.destination}/retention.json`
  fs.writeFileSync(file, JSON.stringify(record, null, 2) + '\n', { flag: 'wx', mode: 0o444 })
  console.log(JSON.stringify({ book: plan.book, files: record.filesCopied + 1, bytes: record.bytesCopied, retention: file, sha256: hash(file) }))
}
