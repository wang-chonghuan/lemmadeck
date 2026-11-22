import path from 'node:path'
import { inputPath, owned, repo, run } from './evidence.mjs'

const scriptRoot = path.join(repo, '.agents/skills/ld-s10y-image')
const spec = owned('figures/fig-187.spec.json')
const context = owned('context/fig-187.context.json')
const validator = path.join(scriptRoot, 'scripts/validate_spec.py')
const renderer = path.join(scriptRoot, 'scripts/render_spec.mjs')
const helpers = [
  validator, renderer, path.join(scriptRoot, 'scripts/materialize_arrowheads.mjs'),
  path.join(scriptRoot, 'assets/figure-spec.schema.json'),
]
const validation = run(
  'fig187-native-draft-validation',
  ['/usr/bin/python3', validator, spec, '--stage', 'draft', '--json'],
  [inputPath, spec, context], [], helpers,
)
console.log(validation.streams.stdout.text.trim())
const rendered = run(
  'fig187-native-render-repair04',
  [process.execPath, renderer, '--spec', spec, '--svg', owned('figures/fig-187.svg'), '--report', owned('figures/fig-187.render.json')],
  [inputPath, spec, context],
  [owned('figures/fig-187.svg'), owned('figures/fig-187.render.json')], helpers,
)
console.log(rendered.streams.stdout.text.trim())
