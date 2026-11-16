import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'

const work = '.tmp/STEMROBIN-181/9p-d019-n69-figures'
const output = `${work}/author-observations.json`
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert(!fs.existsSync(output), 'Preserve the sole author pixel observation record')
const configurations = [
  {
    id: 'fig-121', finalAttempt: 'repair', repairsUsed: 1,
    observations: 'Fourteen readable plus circles and twenty-one readable minus circles retained; upper-left hatch carries no invented charge identity. English uncertainty note remains visible. Sole expanded spacing repair still fails the strict native label/stroke gate at negative-16-sign-label. All declared widths satisfy >=16px but this does not override that failure.',
    defects: ['Native negative-16-sign-label collision score10000; one targeted composition repair exhausted. Exclude candidate and stop.'],
  },
  {
    id: 'fig-122', finalAttempt: 'initial', repairsUsed: 0,
    observations: 'One unmarked sphere and eight rightward arrowheads remain visible; four solid lines cross the circle, two above and two below. E overhead vector and initial-applied-field title render at full width and both mobile widths, with no clipped symbol or title/arrow overlap. No equilibrium total-field or invented surface-charge labels.',
    defects: [],
  },
  {
    id: 'fig-124', finalAttempt: 'initial', repairsUsed: 0,
    observations: 'Open wire cage, top aperture, movable axial rod/knob, three supports/base, three exterior strips and the lower paired leaves visible at640/331/342. Paired leaves remain below the cage and the shown-outside qualifier is readable. Mesh is schematic; no hidden electrical joint/material/charge is asserted. Three English labels remain separated from rods/rims and are not clipped.',
    defects: [],
  },
]
const figures = configurations.map(item => {
  const dir = `${work}/${item.id}/${item.finalAttempt}`
  const previews = JSON.parse(fs.readFileSync(`${dir}/width-previews.json`, 'utf8'))
  const images = [`${dir}/${item.id}.png`, ...previews.previews.map(preview => preview.path)].map(file => ({
    path: file, sha256: sha(file), actuallyOpened: true, detail: 'original',
    observer: 'session-D-n69-figure-author', observations: item.observations,
  }))
  return { ...item, authorOnly: true, images }
})
fs.writeFileSync(output, `${JSON.stringify({
  role: 'author-observations-not-independent-gate', figures,
  firstFailed121FullPNGOpened: {
    path: `${work}/fig-121/initial/fig-121.png`, sha256: sha(`${work}/fig-121/initial/fig-121.png`),
    actuallyOpened: true, detail: 'original', observation: 'Initial native collisions retained; no approval from visual appearance.',
  },
  originalPNGs: ['fig-121', 'fig-122', 'fig-123', 'fig-124'].map(id => {
    const file = `ssot-resources/soviet10year-textbooks/artifacts/9p/figures/${id}.png`
    return { id, path: file, sha256: sha(file), actuallyOpened: true, detail: 'original' }
  }),
  nativeRendererInvocations: { 'fig-121': 2, 'fig-122': 1, 'fig-123': 0, 'fig-124': 1 },
  headlessOnly: true, taskOwnedBrowserClosedByNativeRendererFinally: true,
  noThresholdWeakeningNoFurtherRepair: true,
}, null, 2)}\n`)
console.log(JSON.stringify({ path: output, sha256: sha(output) }, null, 2))
