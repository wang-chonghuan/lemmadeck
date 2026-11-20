import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { W, A, F, T, editions, id, load, hash, save } from './receipt.mjs'

for (const name of editions) {
  const language = name.endsWith('-en') ? 'en' : 'zh'
  const report = load(path.join(A, 'receipts', `prose-flow-${language}-localized.stdout.txt`))
  const p = path.join(T, name, 'lessons', id, 'lesson.template.json')
  const lesson = load(p)
  lesson.section_breaks = [4, 8].map(block => {
    const target = report.paragraphs.find(q => q.blockIndex === block && q.paragraphInBlock === 0)
    const position = report.paragraphs.indexOf(target)
    if (!target || position <= 0) throw new Error('Missing native section anchor')
    return { before: report.paragraphs[position - 1].text, after: target.text }
  })
  fs.writeFileSync(p, JSON.stringify(lesson, null, 2) + '\n')
  const specPath = path.join(F, name, 'lessons', id, 'figures/fig-35.spec.json')
  const spec = load(specPath)
  save(path.join(A, 'first-failure', name + '-fig-35.spec.json'), spec)
  for (const obj of spec.objects.filter(o => o.type === 'svgPath')) {
    if (obj.fill !== 'none') throw new Error('Unexpected repair target')
    delete obj.fill
  }
  fs.writeFileSync(specPath, JSON.stringify(spec, null, 2) + '\n')
}
const installed = '/Users/yong/work/lemmadeck-ws/lemmadeck/.agents/skills/node_modules'
const runtime = path.join(F, 'runtime')
const scripts = path.join(runtime, 'ld-s10y-image/scripts')
fs.mkdirSync(scripts, { recursive: true })
fs.symlinkSync(installed, path.join(runtime, 'node_modules'), 'dir')
const tools = ['render_spec.mjs', 'validate_spec.py', 'materialize_arrowheads.mjs']
const copied = tools.map(file => {
  const input = path.join(W, '.agents/skills/ld-s10y-image/scripts', file)
  const output = path.join(scripts, file)
  fs.copyFileSync(input, output, fs.constants.COPYFILE_EXCL)
  if (hash(input) !== hash(output)) throw new Error('Native tool changed in copying')
  return { source: input, runtime: output, sha256: hash(input), codeChanges: false }
})
const req = createRequire(path.join(installed, 'package.json'))
save(path.join(A, 'runtime-recovery.json'), {
  schema: 'STEMROBIN-181/exact-native-runtime-reuse@1',
  firstFailure: 'receipts/render-fig34.json',
  cause: 'Worktree has no .agents/skills/node_modules; original command failed before render.',
  mainRendererNotUsed: 'Main renderer hash differs in vector-accent support. Current W native bytes copied unchanged into the owned figure workspace instead.',
  copiedNativeTools: copied,
  dependencyDirectory: installed,
  dependencyLink: path.join(runtime, 'node_modules'),
  dependencyInstalls: 0, dependencyManifestChanges: 0, sharedDirectoryChanges: 0,
  existingPlaywright: req.resolve('playwright-core/package.json'),
  existingJSXGraph: req.resolve('jsxgraph/package.json'),
  executionCwd: W,
})
save(path.join(A, 'figure-localized-repair.json'), {
  schema: 'STEMROBIN-181/author-figure-repair@1', role: 'author',
  firstFailure: 'receipts/validate-fig35.json',
  preservedCandidates: editions.map(n => `first-failure/${n}-fig-35.spec.json`),
  cause: 'Optional svgPath fill:none is rejected as a nonsemantic color role.',
  repair: 'Delete only optional fill from the two curve objects in both byte-identical locale specs. Native renderer default is no fill.',
  figureContentRevisionCount: 1, rerenderCount: 0, imageLoadsAdded: 0,
})
