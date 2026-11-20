import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const root = path.resolve('.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8586-author')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const indexPath = path.join(root, 'output-index.json')
const digestPath = path.join(root, 'output-index.sha256')
if (fs.existsSync(indexPath) || fs.existsSync(digestPath)) throw new Error('Output index already sealed')
const resultPath = path.join(root, 'author-result.json')
const result = JSON.parse(fs.readFileSync(resultPath, 'utf8'))
const finalizeReceipt = JSON.parse(fs.readFileSync(path.join(root, 'finalize-author.command.json'), 'utf8'))
result.actualCommands.push({
  ...finalizeReceipt,
  receipt: 'finalize-author.command.json',
  result: JSON.parse(fs.readFileSync(path.join(root, finalizeReceipt.exit), 'utf8')),
  note: 'Its stdout SHA binds the pre-index accounting snapshot; output-index binds the final accounting record.',
})
result.packagingCommand = {
  cwd: process.cwd(), executable: process.execPath, argv: process.argv.slice(1),
  role: 'Administrative artifact indexing only; no figure stage rerun',
  externalDigest: 'Returned by this command; index and its digest exclude themselves.',
}
for (const source of result.sourceImages.filter(item => !item.frameMetadataMatches)) {
  result.holds.push({
    id: 'FIG85-FIRST-FRAME-METADATA',
    scope: 'figure85 FIRST metadata accuracy only',
    status: 'HOLD',
    reason: 'Sealed FIRST estimated height 442; actual PNG-header height is 439. FIRST is not corrected, and neither original image nor figure draft was reopened. Geometry and labels were not altered.',
    actual: source.pngHeaderDimensions,
  })
}
fs.writeFileSync(resultPath, JSON.stringify(result, null, 2) + '\n')
const outputs = fs.readdirSync(root).filter(name => !['output-index.json', 'output-index.sha256'].includes(name)).sort().map(name => {
  const file = path.join(root, name)
  if (!fs.statSync(file).isFile()) throw new Error('Unexpected nested artifact directory')
  return { path: name, sha256: hash(file), bytes: fs.statSync(file).size }
})
fs.writeFileSync(indexPath, JSON.stringify({
  schema: 'stemrobin188-author-output-index@1',
  root: '.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8586-author',
  selfExcluded: ['output-index.json', 'output-index.sha256'],
  outputs,
}, null, 2) + '\n', { flag: 'wx' })
const digest = hash(indexPath)
fs.writeFileSync(digestPath, `${digest}  output-index.json\n`, { flag: 'wx' })
for (const output of outputs) {
  const file = path.join(root, output.path)
  if (hash(file) !== output.sha256 || fs.statSync(file).size !== output.bytes) throw new Error(`Package changed: ${output.path}`)
}
fs.chmodSync(indexPath, 0o444)
fs.chmodSync(digestPath, 0o444)
console.log(JSON.stringify({ outputIndex: indexPath, sha256: digest, indexedOutputs: outputs.length, digestFile: digestPath }))
