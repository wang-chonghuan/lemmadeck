import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { root, repo, json, save, saveJson, fileReceipt, sha256 } from './common.mjs'

const require = createRequire(path.join(repo, 'app/package.json'))
const bundle = path.join(path.dirname(require.resolve('playwright-core/package.json')), 'lib/utilsBundle.js')
const { PNG } = require(bundle)
const browser = json('browser-results.json')
assert.equal(browser.status, 'PASS_OFFLINE_BROWSER_PENDING_VISUAL')
assert.equal(browser.browserClosed, true)
const images = []
const read = (file) => PNG.sync.read(fs.readFileSync(file))
const region = (image, clip) => {
  assert(clip.x >= 0 && clip.y >= 0 && clip.x + clip.width <= image.width && clip.y + clip.height <= image.height)
  const bytes = Buffer.alloc(clip.width * clip.height * 4)
  for (let row = 0; row < clip.height; row++) {
    const start = ((clip.y + row) * image.width + clip.x) * 4
    image.data.copy(bytes, row * clip.width * 4, start, start + clip.width * 4)
  }
  return bytes
}
const paste = (target, source, clip, x, y) => {
  const bytes = region(source, clip)
  assert(x + clip.width <= target.width && y + clip.height <= target.height)
  for (let row = 0; row < clip.height; row++) bytes.copy(target.data,
    ((y + row) * target.width + x) * 4, row * clip.width * 4, (row + 1) * clip.width * 4)
  assert.equal(sha256(region(target, { x, y, width: clip.width, height: clip.height })), sha256(bytes))
  return sha256(bytes)
}
const canvas = (width, height) => {
  const png = new PNG({ width, height })
  png.data.fill(255)
  return png
}
const writeImage = (name, png, parts) => {
  assert(png.width <= 2048 && png.height <= 4096)
  const receipt = save(`visual/${name}.png`, PNG.sync.write(png))
  const entry = { slot: images.length + 1, ...receipt, width: png.width, height: png.height,
    nativeScale: 1, resized: false, modelLoads: 0, parts }
  images.push(entry)
  return entry
}

const text = browser.results.filter((surface) => surface.kind === 'text')
const exercises = browser.results.filter((surface) => surface.kind === 'exercises')
const plan = {
  createdBeforeAnyModelImageLoad: true, lifetimeBefore: 0, batchBefore: 0, batchLimit: 8, lifetimeLimit: 24,
  modelLoadsPlanned: 6, maxNativeWidth: 2048, maxNativeHeight: 4096, scale: 1,
  crops: text.map((surface) => {
    const half = surface.geometry.docHeight / 2
    const gaps = surface.geometry.paragraphs.slice(1).map((row, index) =>
      Math.floor((row.rect.y + surface.geometry.paragraphs[index].rect.bottom) / 2))
    const y = gaps.reduce((best, candidate) => Math.abs(candidate - half) < Math.abs(best - half) ? candidate : best)
    return { width: surface.viewport.width, source: surface.fullPageUnopened,
      height: surface.geometry.docHeight, regions: [
        { x: 0, y: 0, width: surface.viewport.width, height: y },
        { x: 0, y, width: surface.viewport.width, height: surface.geometry.docHeight - y },
      ] }
  }),
  exercises: 'One side-by-side native contact sheet, desktop x=0 and mobile x=1448, y=0; complete screenshots, no crops omitted.',
  endpoints: 'One native contact sheet: rows ordered desktop then mobile, ascending wrapper index; START left x=8, END right x=390; row source receipts and exact placements retained.',
  unopenedEvidence: 'All originals/full-page screenshots and individual formula endpoint PNGs remain unopened; only these six projections are loaded.',
}
assert.equal(text.length, 2)
assert.equal(exercises.length, 2)
const planReceipt = saveJson('visual-allocation-before-load.json', plan)
for (const target of plan.crops) {
  const source = read(target.source.path)
  assert.equal(source.width, target.width)
  assert.equal(source.height, target.height)
  for (const [index, clip] of target.regions.entries()) {
    const output = canvas(clip.width, clip.height)
    const pixelSha256 = paste(output, source, clip, 0, 0)
    writeImage(`text-${target.width}-segment-${index + 1}`, output, [{
      source: target.source, sourceClip: clip, destination: { x: 0, y: 0, width: clip.width, height: clip.height },
      coverage: `[${clip.y},${clip.y + clip.height})`, rawRgbaSha256: pixelSha256,
    }])
  }
}
const exerciseSources = exercises.map((surface) => ({ surface, png: read(surface.fullPageUnopened.path) }))
const exerciseCanvas = canvas(1838, Math.max(...exerciseSources.map(({ png }) => png.height)))
const exerciseParts = exerciseSources.map(({ surface, png }, index) => {
  const clip = { x: 0, y: 0, width: png.width, height: png.height }
  const x = index === 0 ? 0 : 1448
  return { viewport: surface.viewport, source: surface.fullPageUnopened, sourceClip: clip,
    destination: { ...clip, x }, coverage: `[0,${png.height})`,
    rawRgbaSha256: paste(exerciseCanvas, png, clip, x, 0) }
})
writeImage('empty-exercises-native-contact-sheet', exerciseCanvas, exerciseParts)
const endpoints = text.flatMap((surface) => (surface.scrollChecks || []).map((check) => ({
  viewport: surface.viewport, check,
  start: read(check.startScreenshot.path), end: read(check.endScreenshot.path),
})))
assert.equal(endpoints.length, 10)
const contactHeight = endpoints.reduce((sum, row) => sum + Math.max(row.start.height, row.end.height) + 16, 8)
const contact = canvas(756, contactHeight)
let y = 8
const endpointParts = []
for (const row of endpoints) {
  for (const [state, x] of [['start', 8], ['end', 390]]) {
    const png = row[state]
    const clip = { x: 0, y: 0, width: png.width, height: png.height }
    endpointParts.push({ viewport: row.viewport, wrapperIndex: row.check.wrapperIndex, state,
      tex: row.check.tex, source: row.check[`${state}Screenshot`], sourceClip: clip,
      destination: { x, y, width: png.width, height: png.height },
      rawRgbaSha256: paste(contact, png, clip, x, y) })
  }
  y += Math.max(row.start.height, row.end.height) + 16
}
writeImage('all-formula-scroll-endpoints-native-contact-sheet', contact, endpointParts)
assert.equal(images.length, 6)
const rawBrowserStderr = fs.readFileSync(path.join(root, 'commands/browser-check.stderr.raw'), 'utf8')
const launching = rawBrowserStderr.split('\n').find((line) => line.includes('pw:browser <launching> '))
assert(launching)
const actualBrowserExecutable = launching.split('pw:browser <launching> ')[1].split(' --')[0]
const projection = saveJson('native-image-projection.json', {
  status: 'NATIVE_PIXEL_PROJECTION_ONLY_NOT_VISUAL_PASS', planReceipt, images,
  modelImagesLoaded: 0, resizeCount: 0, pixelEqualityChecked: true,
  actualBrowserExecutable: fileReceipt(actualBrowserExecutable),
  actualBrowserExecutableEvidence: fileReceipt(path.join(root, 'commands/browser-check.stderr.raw')),
  pngRuntime: fileReceipt(bundle),
  loadedCommonJsFiles: Object.keys(require.cache).map(fileReceipt),
})
console.log(JSON.stringify({ projection, planReceipt, images: images.map(({ slot, path, sha256, width, height }) =>
  ({ slot, path, sha256, width, height })) }))
