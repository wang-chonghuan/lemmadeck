import fs from 'node:fs'
import path from 'node:path'
import { W, A, F, editions, id, hash, save } from './receipt.mjs'
const installed = '/Users/yong/work/lemmadeck-ws/lemmadeck/.agents/skills/node_modules'
const tools = ['render_spec.mjs', 'validate_spec.py', 'materialize_arrowheads.mjs']
save(path.join(A, 'runtime-recovery.json'), {
  schema: 'STEMROBIN-181/exact-native-runtime-reuse@1',
  firstFailure: 'receipts/render-fig34.json',
  cause: 'W has no skill node_modules; first render stopped before output.',
  copiedNativeTools: tools.map(file => {
    const input = path.join(W, '.agents/skills/ld-s10y-image/scripts', file)
    const runtime = path.join(F, 'runtime/ld-s10y-image/scripts', file)
    if (hash(input) !== hash(runtime)) throw new Error('Native bytes mismatch')
    return { source: input, runtime, sha256: hash(input), codeChanges: false }
  }),
  dependencyDirectory: installed,
  dependencyLink: path.join(F, 'runtime/node_modules'),
  dependencyLinkTarget: fs.readlinkSync(path.join(F, 'runtime/node_modules')),
  dependencyInstalls: 0, dependencyManifestChanges: 0, sharedDirectoryChanges: 0,
  existingPackages: ['playwright-core', 'jsxgraph'].map(name => ({
    name, path: path.join(installed, name, 'package.json'),
    sha256: hash(path.join(installed, name, 'package.json')),
  })),
  executionCwd: W,
  setupPartialFailure: {
    receipt: 'receipts/finish-setup.json',
    cause: 'Provenance lookup for jsxgraph/package.json hit exports restriction after text/spec/runtime files had already been written.',
    recovery: 'Record the existing package file by absolute path, no setup rerun or dependency change.',
  },
})
save(path.join(A, 'figure-localized-repair.json'), {
  schema: 'STEMROBIN-181/author-figure-repair@1', role: 'author',
  firstFailure: 'receipts/validate-fig35.json',
  preservedCandidates: editions.map(n => `first-failure/${n}-fig-35.spec.json`),
  cause: 'Optional svgPath fill:none is not a semantic color role.',
  repair: 'Delete only optional fill from the two curve objects. Native default is no fill.',
  figureGeometryOrStyleRevisionCount: 1,
  affectedContextRefresh: 'Restore omitted second R in bilingual text, refreshing spec authoritativeText only.',
  sourcePixelsModified: false,
})
