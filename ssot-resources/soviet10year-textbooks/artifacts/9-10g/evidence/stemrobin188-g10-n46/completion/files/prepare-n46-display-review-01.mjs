import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const core = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const lesson = 'geo910-c2-s1-n46'
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const display = path.join(tmp, 'offline-display-9-10g_geo910-c2-s1-n46-surfaces')
const resultPath = path.join(display, 'result.json')
const scrollPath = path.join(display, 'scroll-result.json')
const results = json(resultPath).results
const scrollResults = json(scrollPath).results
assert.equal(results.length, 4)
assert.equal(scrollResults.length, 1)
const screenshots = [...results, ...scrollResults].map(item => {
  assert.equal(hash(item.screenshot), item.screenshotSha256)
  return { kind: item.kind, viewport: item.viewport,
    path: item.screenshot, sha256: item.screenshotSha256,
    layout: item.layout, endpoints: item.endpoints || [],
  }
})
const media = results.filter(item => item.kind === 'text').map(item => item.layout)
assert.deepEqual(media.map(item => item.figures.find(figure => figure.id === 'fig-g10-14').width), [640, 640])
const endpoint = scrollResults[0].endpoints[0]
assert.equal(endpoint.id, 'fig-g10-14')
assert.equal(endpoint.scrollWidth, 640)
assert.equal(endpoint.clientWidth, 358)
assert.equal(endpoint.scrollLeft, 282)
assert.equal(endpoint.rightEdge, endpoint.viewportRight)
for (const stage of ['adapt-finalize-n46-01', 'render-n46-01'])
  assert.equal(json(path.join(tmp, 'g10-n46', stage, 'command.json')).exitCode, 0)
const sourceFiles = ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
  .map(name => path.join(core, 'editions/modern-us-neutral/lessons', lesson, name))
const figures = json(sourceFiles[2]).figures
const assets = figures.flatMap(figure => ['spec', 'svg', 'render', 'review'].map(field =>
  path.join(core, 'editions/modern-us-neutral', figure[field])))
const files = [...sourceFiles, ...assets, resultPath, scrollPath,
  ...screenshots.map(item => item.path),
  path.join(tmp, 'n46-text-fig1213-review-01/modern-review.json'),
  ...['adapt-finalize-n46-01', 'render-n46-01'].map(stage => path.join(tmp, 'g10-n46', stage, 'command.json')),
]
const bindings = [...new Map(files.map(file => [file, bind(file)])).values()]
for (const binding of bindings) assert.equal(hash(binding.path), binding.sha256)
const output = path.join(tmp, 'n46-display-review-inputs-01')
assert.ok(!fs.existsSync(output))
fs.mkdirSync(output)
fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify({
  status: 'pending-first-whole-n46-text-exercise-display-review',
  lesson, screenshots, imageOpensPlanned: 5, bindings,
  inheritedModernSemanticPass: bind(path.join(tmp, 'n46-text-fig1213-review-01/modern-review.json')),
  semanticsRepeated: false, figureAuthorImagesReopened: false,
  measuredOfflineMedia: {
    desktopInline: 480, mobileInline: 358, scrollMedia: 640,
    mobileScrollContainer: 358, mobileScrollEnd: 282,
    minimumTextPx: Math.min(...media.map(item => item.minFigureTextPx)),
    authorPreviewMobile300And340NotClaimedAsCurrentLessonMeasurements: true,
  },
  liveAppClaimed: false, headlessOffline: true,
  rendererRepeated: false, published: false,
}, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ output, bindings: bindings.length, imageOpensPlanned: 5 }))
