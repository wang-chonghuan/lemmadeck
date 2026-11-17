import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

export const W = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
export const T = path.join(W, '.intentfold/tickets/STEMROBIN-181')
export const A = path.join(T, 'tmp/d045-10p-fig83-author')
export const card = 'phy10-c1-s5-n44'
export const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
export const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
export function write(relative, value) {
  const p = path.resolve(A, relative)
  if (!p.startsWith(`${A}/`)) throw new Error('Ownership boundary')
  if (fs.existsSync(p)) throw new Error(`Refusing overwrite: ${p}`)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, typeof value === 'string' || Buffer.isBuffer(value) ? value : `${JSON.stringify(value, null, 2)}\n`)
  return p
}
export function command(name, executable, args, options = {}) {
  const result = spawnSync(executable, args, {
    cwd: W, encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: path.join(A, 'runtime') },
    ...options,
  })
  write(`receipts/${name}.json`, {
    executable, args, cwd: W, exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr,
    error: result.error?.message ?? null,
  })
  console.log(`${name}: exit ${result.status}`)
  return result
}

if (process.argv[1] === import.meta.filename) {
  fs.mkdirSync(path.join(A, 'runtime'), { recursive: true })
  const inputs = []
  function copy(source, destination, expected) {
    const actual = hash(source)
    if (expected && actual !== expected) throw new Error(`Input hash mismatch: ${source}`)
    const target = write(destination, fs.readFileSync(source))
    inputs.push({ source, path: target, sha256: actual })
    return target
  }
  const source = copy(
    path.join(T, 'tmp/d044-10p-source120-123-author/work/10p/pages/0122/figures/fig-83.png'),
    'inputs/source/fig-83.png',
    'cec42cfeb8c8444a04e5556508b213cf47267bfef5c36d4a20c8caaf14ac0f1c',
  )
  copy(path.join(T, 'tmp/d045-source120-123-review.json'), 'inputs/source-review.json',
    '312b9cfb05bac48a3f258c868e11f4452d9a609493b4e5361ac4d45edc10c774')
  const textRoot = path.join(T, 'tmp/d045-10p-n44-author')
  copy(path.join(textRoot, 'author-freeze.json'), 'inputs/text-author-freeze.json',
    'f604f1ebd5774cc9d94998118fee8a15e1ae801ff991dd96893f2586296d338c')
  const freeze = read(path.join(A, 'inputs/text-author-freeze.json'))
  for (const language of ['zh', 'en']) {
    for (const name of ['prose.md', 'lesson.template.json', 'figures.template.json', 'exercises.template.json']) {
      const upstream = path.join(textRoot, 'frozen', language, name)
      const output = freeze.outputs.find(o => o.language === language)
      const expected = name === 'prose.md' ? output.prose.sha256
        : name === 'lesson.template.json' ? output.frozen.sha256
        : name === 'figures.template.json' ? output.figures.sha256 : output.exercises.sha256
      copy(upstream, `inputs/${language}/${name}`, expected)
    }
    const native = `context/${language}/root/10p`
    copy(source, `${native}/figures/fig-83.png`)
    write(`${native}/editions/modern-us-neutral/lessons/${card}/lesson.json`,
      read(path.join(A, `inputs/${language}/lesson.template.json`)))
    write(`${native}/editions/modern-us-neutral/lessons/${card}/exercises.json`,
      read(path.join(A, `inputs/${language}/exercises.template.json`)))
    command(`context-${language}`, 'python3', [
      path.join(W, '.agents/skills/ld-s10y-image/scripts/build_context.py'),
      '--book', '10p', '--edition', 'modern-us-neutral', '--figure', 'fig-83',
      '--root', path.join(A, `context/${language}/root`),
      '--output', path.join(A, `context/${language}/native-context.json`),
    ])
  }
  for (const relative of [
    '.agents/skills/ld-s10y-image/SKILL.md',
    '.agents/skills/ld-s10y-image/references/routing.md',
    '.agents/skills/ld-s10y-image/references/figure-spec.md',
    '.agents/skills/ld-s10y-image/references/quality-gate.md',
    '.agents/skills/ld-s10y-image/references/generation.md',
    '.agents/skills/ld-s10y-image/scripts/build_context.py',
    '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
    '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
    '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs',
    '.claude/skills/ld-s10y-lesson/tools/render_lesson.js',
    '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
    '.claude/skills/ld-s10y-lesson/tools/edition.py',
    'app/src/styles/app.css',
  ]) copy(path.join(W, relative), `inputs/tools/${relative.replaceAll('/', '__')}`)
  write('source-inventory.json', {
    schema: 'ld-s10y-image/source-inventory-author@1',
    figure: 'fig-83',
    observationSequence: 'Original PNG opened first, before tools, templates, drawing or modern candidates.',
    source: { path: source, sha256: hash(source), width: 457, height: 305 },
    groups: [
      { id: 'fork-left', pixelObservation: 'One upright U-shaped tuning fork at left, two tall narrow arms and rounded lower join, short stem and mounting foot on the left box.' },
      { id: 'fork-right', pixelObservation: 'One same-design U-shaped tuning fork at right, two tall narrow arms and rounded lower join, stem and dark mounting foot on the right box; slightly slanted in the scanned projection.' },
      { id: 'box-left', pixelObservation: 'One separate low wooden-box-shaped block beneath the left fork, visible top plane, long stippled front plane, short end edges, closed bottom contour.' },
      { id: 'box-right', pixelObservation: 'One separate comparable wooden-box-shaped block beneath the right fork, visible top plane, stippled long front plane, end edges, closed bottom contour.' },
      { id: 'pair', pixelObservation: 'Two assemblies side by side at comparable height, clear air gap between their inward ends, no physical connector.' },
      { id: 'hammer', pixelObservation: 'One small hammer in upper right: slender diagonal handle and short transverse head, head near the outer arm of the right fork with a visible gap; no hand.' },
      { id: 'scan-frame', pixelObservation: 'Four-sided black rectangular scan frame surrounds the scene; minor specks and uneven strokes. No instructional text, labels, arrows, measurements, frequency values or clip.' },
    ],
    textBoundFacts: [
      'Complete ZH/EN n44 specifies two identical forks, wooden resonance boxes a short distance apart, box openings facing each other, and tapping one arm with a small hammer.',
      'Inward openings are not clearly legible as dark apertures in this low-resolution PNG. Their orientation is authoritative text, not an independently readable pixel fact.',
      'The clip is a subsequent experiment in the prose and is not present in this source scene; do not add it.',
    ],
    modernAdaptations: [
      'Clean unframed technical view with identical deterministic fork geometry and mirrored box perspective.',
      'Clarify the text-bound inward openings, preserving the two separate assemblies and air gap.',
      'Generated artwork is material-only wood grain; no generated apparatus, geometry, labels or effects.',
      'Omit scan frame, stippling, specks and old-book texture. No visible labels or answer-bearing vibration arrows.',
    ],
    route: {
      mode: 'hybrid', purpose: 'instructional',
      rationale: 'Exact apparatus count, fork congruence, support, facing apertures and hammer-arm adjacency are deterministic. Natural wood material is approved GPT Image artwork, contained within front-face panels only.',
      rejectedGeneratedOnly: 'Generated pixels cannot certify identical mechanical shapes or the facing-aperture relationship.',
    },
    independentReview: false,
  })
  write('input-freeze.json', {
    schema: 'ld-s10y-image/input-freeze-author@1', inputs,
    authority: 'Complete current n44 prose, frozen full templates, independent SOURCE/RAW PASS. Native contexts use isolated draft template copies, not finalized or promoted editions.',
    pending: ['independent SCI', 'independent ZHEN', 'independent modern figure review'],
  })
  const english = fs.readFileSync(path.join(A, 'inputs/en/prose.md'), 'utf8')
  const chinese = fs.readFileSync(path.join(A, 'inputs/zh/prose.md'), 'utf8')
  write('candidates/initial/wood.prompt.txt', [
    'Rendering mode: HYBRID. Modern edition text is authoritative; the original extracted PNG supplies structure only.',
    'Generate MATERIAL ARTWORK ONLY, not a completed apparatus drawing.',
    'One seamless close-up rectangular texture of pale natural unfinished wood for a wooden laboratory resonance box. Subtle straight grain, flat orthographic material view, evenly lit, no perspective, no frame, no objects, no holes, no tuning forks, no hammer, no metal, no borders, no shadows, no background scene.',
    'Fill the whole canvas with the wood surface. Soft near-neutral light gray wood, faint warm natural grain, not saturated brown or orange. No black patches.',
    'No text, letters, numbers, labels, arrows, axes, grid, measurements, symbols, checkerboard, book texture, Soviet imagery or answer annotations.',
    'The deterministic overlay will construct both boxes and their inward openings, both identical forks and the hammer. The texture will be duplicated inside two exact front-face panels, preserving its aspect ratio.',
    'FULL ENGLISH EDITION TEXT:', english,
    'FULL CHINESE EDITION TEXT (context only, DO NOT RENDER ITS TEXT):', chinese,
  ].join('\n\n'))
}
