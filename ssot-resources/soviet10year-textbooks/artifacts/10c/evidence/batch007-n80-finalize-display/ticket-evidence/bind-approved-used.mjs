import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const book = process.env.FIGURE_BOOK || '6-8g'
const edition = 'modern-us-neutral'
const root = `ssot-resources/soviet10year-textbooks/artifacts/${book}/editions/${edition}`
for (const lesson of process.argv.slice(2)) {
  const file = `.tmp/ld-s10y-lesson/adapt/${book}/${edition}/lessons/${lesson}/figures.template.json`
  const manifest = JSON.parse(fs.readFileSync(file))
  for (const figure of manifest.figures) {
    const spec = JSON.parse(fs.readFileSync(path.join(root, figure.spec)))
    const review = JSON.parse(fs.readFileSync(path.join(root, `figures/${figure.id}.review.json`)))
    assert.equal(review.status, 'pass')
    for (const key of ['png', 'svg', 'render', 'review', 'generation', 'artwork']) delete figure[key]
    figure.mode = spec.mode
    figure.review = `figures/${figure.id}.review.json`
    if (spec.mode === 'deterministic') {
      figure.svg = `figures/${figure.id}.svg`
      figure.render = `figures/${figure.id}.render.json`
    } else if (spec.mode === 'generated') {
      assert.equal(spec.assets.length, 1)
      figure.png = path.relative(root, spec.assets[0].path)
      figure.generation = path.relative(root, spec.assets[0].metadata)
    } else if (spec.mode === 'hybrid') {
      figure.artwork = `figures/${figure.id}.artwork.png`
      figure.svg = `figures/${figure.id}.svg`
      figure.render = `figures/${figure.id}.render.json`
    } else {
      throw Error(`Unsupported batch mode ${spec.mode}`)
    }
  }
  manifest.status = 'ready'
  fs.writeFileSync(file, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`${lesson}: ${manifest.figures.length} approved final-output contracts bound`)
}
