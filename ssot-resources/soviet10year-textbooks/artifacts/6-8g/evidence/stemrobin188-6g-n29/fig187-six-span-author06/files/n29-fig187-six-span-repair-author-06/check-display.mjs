import path from 'node:path'
import { inputPath, owned, repo, run } from './evidence.mjs'

const display = owned('display.mjs')
const receipt = run('fig187-span-visibility-display-repair01',
  [process.execPath, display],
  [inputPath, owned('figures/fig-187.spec.json'), owned('figures/fig-187.svg'), owned('figures/fig-187.render.json'), owned('context/fig-187.context.json')],
  ['display-repair01/fig-187.html', 'display-repair01/fig-187.bounds.json', 'display-repair01/fig-187.contact.svg', 'display-repair01/fig-187.contact.png', 'display-repair01/fig-187.pixel-evidence.json'].map(owned),
  [display, path.join(repo, 'app/src/styles/app.css'), path.join(repo, '.claude/skills/ld-s10y-lesson/tools/svg_raster.js')],
)
console.log(receipt.streams.stdout.text.trim())
