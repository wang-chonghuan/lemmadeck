import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const work = '.tmp/STEMROBIN-181/9p-n58-portrait'
const id = 'tbl-p0146-01'
const helper = `${work}/build-portrait.mjs`
const freezePath = '.intentfold/tickets/STEMROBIN-181/tmp/d017-n58-portrait-author-freeze.json'
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const azure = '/Users/yong/.agents/skills/n-azure/scripts/generate_image.py'
const template = '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s1/lesson.template.json'
const sourceLessonPath = 'ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/phy9-c2-s1/lesson.json'
const sciencePath = '.intentfold/tickets/STEMROBIN-181/tmp/9p-n58-science-review.json'
const proseFreezePath = '.intentfold/tickets/STEMROBIN-181/tmp/9p-n58-prose-freeze.json'
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const bind = file => ({ path: file, sha256: hash(fs.readFileSync(file)) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const save = (file, value) => {
  const bytes = typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`
  fs.mkdirSync(path.dirname(file), { recursive: true })
  if (fs.existsSync(file)) assert.equal(fs.readFileSync(file, 'utf8'), bytes, `Preserve existing output: ${file}`)
  else fs.writeFileSync(file, bytes, { flag: 'wx' })
}
const lessonBinding = bind(template)
const sourceLesson = bind(sourceLessonPath)
const science = bind(sciencePath)
const source = bind(`ssot-resources/soviet10year-textbooks/artifacts/9p/figures/${id}.png`)
assert.equal(lessonBinding.sha256, 'cf202764fc900951a8cf8cdd445f6b86eb01beeea23d4ffbd60be8db92915ccd')
assert.equal(sourceLesson.sha256, '469a5a60cf55024df3824100cab1afbfde74c4f4d42ba74a47568c2b740e9a4b')
assert.equal(source.sha256, '36ff069364e07a17d7d00275bed3b38b2b6ff7a4479402a1d5baa8188d6ec559')
assert.equal(read(sciencePath).status, 'pass')
assert.deepEqual(read(sciencePath).bindings.template, lessonBinding)
assert.deepEqual(read(sciencePath).bindings.source, sourceLesson)
const lesson = read(template)
const fullText = [lesson.printed_title, ...lesson.prose.map(block => block.text)].join('\n\n')
assert.equal(lesson.id, 'phy9-c2-s1')
assert.equal(lesson.prose.length, 10)
assert.equal(lesson.exercise_count, 0)
const env = { ...process.env, PYTHONDONTWRITEBYTECODE: '1', PLAYWRIGHT_HTML_OPEN: 'never' }
delete env.PWDEBUG
const run = (args, input) => spawnSync(python, ['-B', ...args], {
  env, input, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024,
})
const inventory = [
  {
    id: 'source-maxwell-identity-cues',
    description: 'Original PNG actually opened at native resolution before this authoring pass: one male head-and-shoulders/chest bust, three-quarter facing image LEFT. Broad high/receding forehead, wavy/curly swept-back hair, strong eyebrows and nose, visible image-right ear, thick moustache and long full beard across chest. No spectacles. The bound lesson p0146#3 identifies J. C. Maxwell (1831-1879); pixels alone do not independently identify a name.',
    objects: [], assertions: [],
  },
  {
    id: 'source-civilian-bust-and-empty-background',
    description: 'Dark civilian lapelled coat and light shirt opening; complete head, beard and shoulder/chest framing against plain white. Monochrome printed hatching is a source rendering style, not an instructional relationship. No inscription, number, equation, apparatus, flag, uniform, hat, medal or additional person. These requirements map semantically to the single maxwell-portrait artwork asset, not invented geometric assertions.',
    objects: [], assertions: [],
  },
]

function validate(stage) {
  const result = run(['.agents/skills/ld-s10y-image/scripts/validate_spec.py', `${work}/${id}.spec.json`, '--stage', stage, '--json'])
  assert.equal(result.status, 0, result.stdout || result.stderr)
  save(`${work}/${id}.${stage}-validation.json`, JSON.parse(result.stdout))
}

function build() {
  save(`${work}/${id}.source-inventory.json`, {
    ticket: 'STEMROBIN-181', lesson: lesson.id, figure: id,
    status: 'author-source-pixel-inventory-complete', source,
    inspection: { actuallyOpened: true, resolution: 'original', reviewer: 'Session D, figure author', timing: 'Before spec construction and generation; retained observation across continuation.' },
    identityBinding: { name: 'James Clerk Maxwell', printedName: 'J. C. 麦克斯韦', sourceRefs: ['p0146#2', 'p0146#3'], sourceLesson, lesson: lessonBinding },
    inventory, uncertainty: ['Exact historical hair/clothing colors are not established by monochrome source pixels.'],
    modernAdditions: ['Contemporary color textbook drawing replaces print hatching, without an archival-photo claim or historically measured colors.'],
    independentReview: 'pending',
  })
  const result = run(['-c', `
import json,sys
from pathlib import Path
sys.path.insert(0,'.agents/skills/ld-s10y-image/scripts')
import build_context as B
p=json.load(sys.stdin)
w,h=B.png_size(Path(p['source']['path']))
nearby=B.prose_context([dict(b,label=b.get('label') or '') for b in p['lesson']['prose']],p['id'])
assert nearby
print(json.dumps({'schema':'ld-s10y-image/context@1','book':'9p','edition':'modern-us-neutral','figure':p['id'],
'authoritativeRule':'Complete frozen modern prose is authoritative; original PNG supplies portrait identity/pose/appearance cues. No answer or key context.',
'sourceImage':dict(p['source'],width=w,height=h),'suggestedSize':B.suggested_size(w,h),
'lessons':[{'lesson':p['lesson']['id'],'title':p['lesson']['printed_title'],'prose':nearby,
'fullProse':p['lesson']['prose'],'authoritativeText':p['fullText'],'exercises':[]}],
'inputs':p['inputs'],'construction':'Existing native build_context API applied to complete frozen scratch template.'},ensure_ascii=False))
`], JSON.stringify({ id, source, lesson, fullText, inputs: { lesson: lessonBinding, sourceLesson, science, proseFreeze: bind(proseFreezePath) } }))
  assert.equal(result.status, 0, result.stderr)
  save(`${work}/${id}.context.json`, JSON.parse(result.stdout))
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'generated',
    description: 'Decorative identification portrait of the authentic source-bound James Clerk Maxwell for lesson58. Contemporary textbook color illustration preserves source three-quarter leftward bust, high forehead, swept-back wavy hair, moustache/full beard and civilian shoulders. No embedded text, archival claim, apparatus or instructional mathematical detail.',
    source: { image: source, authoritativeText: [{ lesson: lesson.id, text: fullText }], inventory },
    canvas: { width: 1024, height: 1024, boundingBox: [0, 1024, 1024, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'decorative', layout: 'inline', maxWidthPx: 160, widths: [160], minTextPx: 16 },
    assets: [{ id: 'maxwell-portrait', role: 'artwork', path: `${work}/${id}.png`, metadata: `${work}/${id}.png.json` }],
    objects: [], assertions: [],
  }
  save(`${work}/${id}.initial.spec.json`, spec)
  save(`${work}/${id}.spec.json`, spec)
  save(`${work}/${id}.prompt.txt`, [
    'Mode: generated semantic artwork. Create ONE contemporary textbook illustrated portrait of James Clerk Maxwell (J. C. Maxwell, 1831-1879), the authentic historical physicist identified in the complete frozen lesson below.',
    'The complete modern-edition text is authoritative and overrides source pixels. The attached original source portrait supplies recognizable face, three-quarter pose, hair/beard and shoulder/chest cues, NOT an archival reproduction style.',
    'A crisp newly drawn/painted full-color educational editorial portrait on a plain white opaque background, suitable at actual desktop/mobile inline media width160px. Use clear facial forms and restrained natural colors; do not imitate a photograph, old-book engraving, sepia print or paper texture.',
    'Preserve the source three-quarter bust facing image LEFT: broad high/receding forehead, wavy/curly swept-back hair, strong brows and nose, visible image-right ear, thick moustache joining the long full beard flowing over chest. No spectacles. Keep complete head/hair/beard and both shoulders within the canvas, with modest white space. Dark civilian lapelled coat with light shirt opening; no uniform or insignia. Restrained natural brown hair/beard is an illustrative choice, not a measured historical color.',
    'Make the actual Maxwell recognizable, not a generic unrelated bearded man. Exactly one person. No apparatus, laboratory, other scene, diagram, equation, letter, number, date, signature, watermark, frame, flag, medal, propaganda, cultural text, archival-photo look, monochrome hatching or distressed texture. Do NOT put any lesson words in the image.',
    'COMPLETE FROZEN MODERN LESSON (context only; never embed these words):',
    fullText,
  ].join('\n\n') + '\n')
  validate('draft')
  console.log('Draft spec/context/source inventory ready.')
}

function generate() {
  assert(!fs.existsSync(`${work}/${id}.generation-attempt.json`), 'Initial attempt already recorded; do not retry automatically.')
  assert.equal(read(`${work}/${id}.draft-validation.json`).status, 'pass')
  save(`${work}/${id}.generation-attempt.json`, {
    ticket: 'STEMROBIN-181', figure: id, initialGenerationAttempts: 1, targetedRepairAttempts: 0,
    helper: bind(azure), prompt: bind(`${work}/${id}.prompt.txt`), source, lesson: lessonBinding,
    request: { model: 'gpt-image-2', size: '1024x1024', quality: 'medium', background: 'opaque', n: 1, automaticRetries: 0 },
    authorization: 'Current assigned author-only figure task permits the existing approved Azure generation dependency; no purchase/setup/deployment/dependency changes.',
    actualCostUsd: null, usage: null, accounting: 'Unknown: helper metadata does not expose billed cost or response usage. No invented cost ceiling.',
  })
  const result = run([azure, '--prompt-file', `${work}/${id}.prompt.txt`,
    '--reference-image', source.path, '--output', `${work}/${id}.png`,
    '--size', '1024x1024', '--quality', 'medium', '--background', 'opaque', '--retries', '0'])
  save(`${work}/${id}.generation-command.json`, { exitCode: result.status, stdout: result.stdout, stderr: result.stderr })
  console.log(result.stdout || result.stderr)
  if (result.status !== 0) {
    save(freezePath, {
      ticket: 'STEMROBIN-181', lesson: lesson.id, figure: id, status: 'blocked-generation-external-premise',
      bindings: { source, lesson: lessonBinding, sourceLesson, science, context: bind(`${work}/${id}.context.json`), spec: bind(`${work}/${id}.spec.json`) },
      attempt: bind(`${work}/${id}.generation-attempt.json`), command: bind(`${work}/${id}.generation-command.json`),
      blocker: result.stderr || 'Generation helper failed; no fallback or automatic retry.',
      independentReview: 'not ready', actualCostUsd: null, usage: null, promoted: false,
    })
    process.exitCode = 1
  }
}

function preview() {
  const generation = read(`${work}/${id}.png.json`)
  assert.equal(generation.output.sha256, bind(`${work}/${id}.png`).sha256)
  const file = `${work}/${id}.w160.png`
  assert(!fs.existsSync(file), 'Preserve existing compact preview.')
  const result = run(['-c', `
from PIL import Image
import sys
im=Image.open(sys.argv[1])
w=160
h=round(im.height*w/im.width)
im.resize((w,h),Image.Resampling.LANCZOS).save(sys.argv[2])
print(f'{w}x{h}')
`, `${work}/${id}.png`, file])
  assert.equal(result.status, 0, result.stderr)
  validate('rendered')
  console.log(`${file}: ${result.stdout.trim()}`)
}

function freeze() {
  const generation = read(`${work}/${id}.png.json`)
  const observations = read(`${work}/author-pixel-observations.json`)
  assert.equal(generation.output.sha256, bind(`${work}/${id}.png`).sha256)
  assert.equal(generation.references.length, 1)
  assert.deepEqual({ path: generation.references[0].path, sha256: generation.references[0].sha256 }, source)
  assert.equal(generation.prompt, fs.readFileSync(`${work}/${id}.prompt.txt`, 'utf8').trim())
  assert(generation.prompt.includes(fullText))
  assert.equal(read(`${work}/${id}.spec.json`).source.authoritativeText[0].text, fullText)
  assert(observations.actualImages.every(image => image.actuallyOpened === true))
  save(freezePath, {
    ticket: 'STEMROBIN-181', lesson: lesson.id, figure: id,
    status: observations.hardBlockers.length ? 'author-pixel-blocked' : 'author-frozen-independent-review-pending',
    author: 'Session D', mode: 'generated',
    bindings: {
      source, context: bind(`${work}/${id}.context.json`), lesson: lessonBinding, sourceLesson, science,
      spec: bind(`${work}/${id}.spec.json`), png: bind(`${work}/${id}.png`), generation: bind(`${work}/${id}.png.json`),
      preview: bind(`${work}/${id}.w160.png`),
    },
    inventory: bind(`${work}/${id}.source-inventory.json`), initialSpec: bind(`${work}/${id}.initial.spec.json`),
    prompt: bind(`${work}/${id}.prompt.txt`), helper: bind(helper), proseFreeze: bind(proseFreezePath),
    draftValidation: bind(`${work}/${id}.draft-validation.json`), renderedValidation: bind(`${work}/${id}.rendered-validation.json`),
    generationAttempt: bind(`${work}/${id}.generation-attempt.json`), generationCommand: bind(`${work}/${id}.generation-command.json`),
    observations: bind(`${work}/author-pixel-observations.json`), hardBlockers: observations.hardBlockers,
    fullAuthoritativeProseBound: true, proseBlocks: lesson.prose.length, tasks: 0,
    display: read(`${work}/${id}.spec.json`).display,
    widthEvidence: { desktopMediaPx: 160, mobileMediaPx: 160, actualRasterPreviewPx: 160, method: 'Actual160px PNG preview, no product/browser measurement or surface approval.' },
    initialGenerationAttempts: 1, targetedRepairAttempts: 0, maximumTargetedRepairs: 1,
    actualCostUsd: null, usage: null, accounting: 'Unknown: existing approved helper metadata omits usage and billed cost.',
    independentReview: 'pending; author-only observations are not independent approval',
    limits: 'No SCI repetition, answer/key context, promotion, finalize, durable content write, DB, browser, resource/dependency changes or git operations.',
  })
  console.log(JSON.stringify(bind(freezePath)))
}

const [command] = process.argv.slice(2)
if (command === 'build') build()
else if (command === 'generate') generate()
else if (command === 'preview') preview()
else if (command === 'freeze') freeze()
else throw new Error('Use build/generate/preview/freeze.')
