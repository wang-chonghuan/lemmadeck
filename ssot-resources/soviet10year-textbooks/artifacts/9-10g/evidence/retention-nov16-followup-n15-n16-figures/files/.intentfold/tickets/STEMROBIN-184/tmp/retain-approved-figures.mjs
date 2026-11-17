import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = process.cwd()
const hash = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = (file) => JSON.parse(fs.readFileSync(file))
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n')
const root = `ssot-resources/soviet10year-textbooks/artifacts/${process.env.FIGURE_BOOK || '6-8g'}/editions/modern-us-neutral/figures`
fs.mkdirSync(root, { recursive: true })

for (const id of process.argv.slice(2)) {
  assert(/^(?:fig-\d+|tbl-p\d+-\d+)$/.test(id))
  const scratch = process.env.FIGURE_SCRATCH_DIR
    || path.join(process.env.FIGURE_SCRATCH_ROOT || '.tmp/s10y-image/6-8g', id)
  const specFile = path.join(scratch, fs.existsSync(path.join(scratch, `${id}.spec.json`))
    ? `${id}.spec.json` : 'spec.json')
  const renderFile = path.join(scratch, `${id}.render.json`)
  const reviewFile = path.join(scratch, `${id}.review.json`)
  const spec = read(specFile)
  if (spec.mode === 'hybrid') {
    const render = read(renderFile)
    const review = read(reviewFile)
    assert.equal(render.status, 'pass')
    assert.equal(review.status, 'pass')
    assert.equal(render.spec.sha256, hash(specFile))
    assert.equal(review.spec.sha256, hash(specFile))
    assert.equal(review.render.sha256, hash(renderFile))
    assert.equal(review.source.sha256, hash(spec.source.image.path))
    const approvedSpecHash = hash(specFile)
    const assetsRoot = path.join(root, `${id}.assets`)
    fs.mkdirSync(assetsRoot, { recursive: true })
    for (const asset of spec.assets) {
      const observed = render.assets.find(record => record.id === asset.id)
      assert(observed)
      assert.equal(observed.sha256, hash(asset.path))
      assert.equal(observed.metadata.sha256, hash(asset.metadata))
      const generation = read(asset.metadata)
      assert.equal(generation.output.sha256, hash(generation.output.path))
      const copies = [asset.path, generation.output.path]
      const rebound = new Map()
      for (const from of new Set(copies)) {
        const to = path.join(assetsRoot, path.basename(from))
        if (fs.existsSync(to)) assert.equal(hash(to), hash(from))
        else fs.copyFileSync(from, to)
        assert.equal(hash(to), hash(from))
        rebound.set(from, to)
      }
      generation.output.path = rebound.get(generation.output.path)
      // The repair's extra reference is retained as evidence, never scratch-bound.
      for (const reference of generation.references ?? []) {
        if (!reference.path?.startsWith('.tmp/')) continue
        const from = reference.path
        assert.equal(reference.sha256, hash(from))
        const to = path.join(assetsRoot, `reference-${path.basename(path.dirname(from))}-${path.basename(from)}`)
        if (fs.existsSync(to)) assert.equal(hash(to), hash(from))
        else fs.copyFileSync(from, to)
        reference.path = to
      }
      const metadataTarget = path.join(assetsRoot, path.basename(asset.metadata))
      write(metadataTarget, generation)
      asset.path = rebound.get(asset.path)
      asset.metadata = metadataTarget
      observed.path = asset.path
      observed.metadata = { path: metadataTarget, sha256: hash(metadataTarget) }
    }
    for (const [name, output] of Object.entries(render.output)) {
      assert.equal(output.sha256, hash(output.path))
      assert.equal(review.outputs[name].sha256, output.sha256)
      const to = path.join(root, `${id}.${name === 'svg' ? 'svg' : 'artwork.png'}`)
      if (fs.existsSync(to)) assert.equal(hash(to), output.sha256)
      else fs.copyFileSync(output.path, to)
      output.path = to
      review.outputs[name].path = to
    }
    const specTarget = path.join(root, `${id}.spec.json`)
    const renderTarget = path.join(root, `${id}.render.json`)
    write(specTarget, spec)
    render.spec = { path: specTarget, sha256: hash(specTarget) }
    write(renderTarget, render)
    review.spec = render.spec
    review.render = { path: renderTarget, sha256: hash(renderTarget) }
    review.notes += ` Path-only hybrid promotion from approved spec ${approvedSpecHash}: source, raw/alpha artwork, full-canvas artwork and SVG bytes unchanged; metadata asset/output/reference paths and dependent hashes rebound. Separate layers retained; no flattened composite, rerender or repeated semantic review.`
    write(path.join(root, `${id}.review.json`), review)
    console.log(`${id}: byte-identical hybrid layers retained; asset/evidence paths rebound`)
    continue
  }
  if (spec.mode === 'generated') {
    const review = read(reviewFile)
    assert.equal(review.status, 'pass')
    assert.equal(review.spec.sha256, hash(specFile))
    assert.equal(review.source.sha256, hash(spec.source.image.path))
    assert.equal(spec.assets.length, 1)
    const asset = spec.assets[0]
    const generation = read(asset.metadata)
    assert.equal(review.generation.sha256, hash(asset.metadata))
    assert.equal(review.outputs.png.sha256, hash(asset.path))
    assert.equal(generation.output.sha256, hash(asset.path))
    assert(generation.references.some((reference) => reference.sha256 === review.source.sha256))
    const approvedSpecHash = hash(specFile)
    const approvedGenerationHash = hash(asset.metadata)
    const pngTarget = path.join(root, `${id}.png`)
    const specTarget = path.join(root, `${id}.spec.json`)
    const generationTarget = path.join(root, `${id}.png.json`)
    if (fs.existsSync(pngTarget)) assert.equal(hash(pngTarget), hash(asset.path))
    else fs.copyFileSync(asset.path, pngTarget)
    generation.output.path = pngTarget
    write(generationTarget, generation)
    asset.path = pngTarget
    asset.metadata = generationTarget
    write(specTarget, spec)
    review.spec = { path: specTarget, sha256: hash(specTarget) }
    review.generation = { path: generationTarget, sha256: hash(generationTarget) }
    review.outputs.png.path = pngTarget
    review.notes = review.notes.replaceAll('/tmp/', '/evidence/')
    review.notes += ` Parent path-only promotion: PNG/source/prompt/request/reference bytes or values unchanged. Approved scratch spec ${approvedSpecHash} and generation ${approvedGenerationHash}; only asset/output paths and dependent hashes rebound, without generation or repeated semantic review.`
    write(path.join(root, `${id}.review.json`), review)
    console.log(`${id}: byte-identical generated PNG retained; approved path-only metadata rebound`)
    continue
  }
  const svgFile = path.join(scratch, `${id}.svg`)
  const render = read(renderFile)
  const review = read(reviewFile)
  assert.equal(spec.mode, 'deterministic')
  assert.equal(render.status, 'pass')
  assert.equal(review.status, 'pass')
  assert.equal(render.spec.sha256, hash(specFile))
  assert.equal(review.spec.sha256, hash(specFile))
  assert.equal(review.render.sha256, hash(renderFile))
  assert.equal(review.outputs.svg.sha256, hash(svgFile))
  assert.equal(render.output.svg.sha256, hash(svgFile))
  assert.equal(review.source.sha256, hash(path.resolve(repo, spec.source.image.path)))
  assert.equal(review.source.sha256, spec.source.image.sha256)

  const targets = Object.fromEntries(['spec.json', 'render.json', 'review.json', 'svg']
    .map((extension) => [extension, path.join(root, `${id}.${extension}`)]))
  for (const [source, target] of [[specFile, targets['spec.json']], [svgFile, targets.svg]]) {
    if (fs.existsSync(target)) assert.equal(hash(target), hash(source))
    else fs.copyFileSync(source, target)
  }
  render.spec.path = targets['spec.json']
  render.output.svg.path = targets.svg
  write(targets['render.json'], render)
  review.spec.path = targets['spec.json']
  review.render = { path: targets['render.json'], sha256: hash(targets['render.json']) }
  review.outputs.svg.path = targets.svg
  review.notes += ' Parent path-only promotion: source/spec/SVG hashes unchanged; retained render metadata paths and its hash rebound without repeating the render or independent semantic review.'
  write(targets['review.json'], review)
  console.log(`${id}: byte-identical spec/SVG retained; approved evidence rebound to durable paths`)
}
