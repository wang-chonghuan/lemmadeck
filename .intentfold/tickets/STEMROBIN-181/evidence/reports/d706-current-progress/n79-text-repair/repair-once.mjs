import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const prior = path.join(tmp, 'd683-n79-first-bilingual-text-author')
const out = path.join(tmp, 'd700-n79-readability-repair')
const card = 'phy10-c2-s2-n79'
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const replacements = {
  zh: {
    4: [
      ['物体移近时，睫状肌的活动通过悬韧带改变对晶状体的牵拉，使晶状体更凸、眼睛的等效焦距减小，从而使成像位置重新落在视网膜上。',
        '晶状体周围有一圈睫状肌，悬韧带则是连着晶状体的细纤维。\n看近物时，睫状肌收缩，细纤维对晶状体的拉力减小。\n晶状体于是更凸，眼睛的等效焦距减小，使像重新落在视网膜上。'],
    ],
    14: [
      ['在远物成像的模型中，透镜的光焦度需与眼睛的屈光状态和所取的调节状态相配合，使近似平行的入射光经眼睛后聚焦在视网膜上（图 187(b)）。',
        '先约定眼睛的调焦肌肉处于怎样的状态，例如放松还是正在调节。\n在远物成像的模型中，应让眼镜透镜和眼睛一起把近似平行的入射光聚焦到视网膜上（图 187(b)）。\n只有透镜和眼睛的聚焦能力在这个状态下相配合，才能做到这一点。'],
      ['在这一构图的条件下，适当的会聚透镜可减少近看所需的调节，让约定明视距离处的物体也能看清，而不需原来那样大的调节需求。',
        '在这一构图的条件下，合适的会聚透镜让眼睛不必像未戴镜时那样加强调节，就能看清约定明视距离处的物体。'],
    ],
  },
  en: {
    4: [
      ['As the object moves closer, ciliary muscle activity changes the pull on the lens through the suspensory fibers, allowing greater lens curvature and a shorter equivalent focal length so that the image again falls on the retina.',
        'The ciliary muscle is a ring of muscle around the lens, and the suspensory fibers are fine strands attached to the lens.\nFor near viewing, this muscle contracts and the fibers pull less on the lens.\nThe lens becomes rounder, shortening the eye\'s equivalent focal length so that the image falls on the retina again.'],
    ],
    14: [
      ['In the distant-viewing model, its optical power must match the eye\'s refractive state and the assumed accommodation state so that approximately parallel incident rays focus on the retina after passing through the eye (Figure 187(b)).',
        'First specify what the eye\'s focusing muscles are doing, for example whether they are relaxed or adjusting focus.\nIn the distant-viewing model, the spectacle lens and the eye together must focus approximately parallel incoming rays on the retina (Figure 187(b)).\nThis happens only when the lens and the eye\'s focusing ability match in that chosen state.'],
      ['Under the conditions of this construction, a suitable converging lens can reduce the accommodation demand for near viewing and allow clear viewing at the conventional distance of distinct vision without the original greater demand.',
        'Under the conditions of this construction, a suitable converging lens lets the eye see clearly at the conventional distance of distinct vision without adjusting its focus as strongly as it would without the spectacles.'],
    ],
  },
}
const report = {
  ticket: 'STEMROBIN-181', card, status: 'LOCAL-READABILITY-TITLE-REPAIR-NATIVE-PASS-AFFECTED-REVIEW-PENDING',
  changes: replacements, candidates: [], native: [], originalFAILPreserved: true,
  imagesOpened: 0, sourceReviewRepeated: false, figuresOrCardApproved: false,
}
fs.writeFileSync(path.join(out, 'started.json'), JSON.stringify({ startedAt: new Date().toISOString() }), { flag: 'wx' })
function call(name, command, args, input) {
  const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8', input, timeout: 120000 })
  const receipt = path.join(out, `${name}.receipt.json`)
  fs.writeFileSync(receipt, `${JSON.stringify({ command, args, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2)}\n`, { flag: 'wx' })
  report.native.push({ name, path: path.relative(repo, receipt), sha256: sha(receipt), exitCode: result.status })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  return JSON.parse(result.stdout)
}
for (const locale of ['zh', 'en']) {
  const folder = path.join(out, 'candidates', locale, card)
  fs.mkdirSync(folder, { recursive: true })
  const original = path.join(prior, 'candidates', locale, card, 'lesson.template.json')
  const document = read(original)
  const originalAnchors = document.section_breaks
  const oldFlow = read(path.join(prior, 'reports', `prose-flow-${locale}.stdout.json`))
  const changed = []
  for (const index of [4, 14]) {
    const block = document.prose[index]
    let text = block.text
    for (const [before, after] of replacements[locale][index]) {
      assert.equal(text.split(before).length, 2)
      text = text.replace(before, after)
    }
    changed.push({ key: `prose/${index}`, sentences: text.split('\n').filter(Boolean), source_text: block.source_text })
  }
  const normalized = call(`normalize-${locale}`, path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
    ['-B', path.join(prior, 'normalize-prose.py')], JSON.stringify({ blocks: changed }))
  for (const block of normalized.blocks) document.prose[Number(block.key.split('/')[1])].text = block.text
  if (locale === 'en') document.title = 'The Eye and Spectacles'
  document.section_breaks = []
  const flow = call(`prose-flow-${locale}`, process.execPath,
    [path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'), '--stdin'], JSON.stringify(document))
  document.section_breaks = originalAnchors.map((anchor) => {
    const oldAfter = oldFlow.paragraphs.find((paragraph) => paragraph.text === anchor.after)
    assert.ok(oldAfter)
    const current = flow.paragraphs.find((paragraph) => paragraph.blockIndex === oldAfter.blockIndex && paragraph.paragraphInBlock === oldAfter.paragraphInBlock)
    assert.ok(current && current.index > 0)
    return { before: flow.paragraphs[current.index - 1].text, after: current.text }
  })
  const file = path.join(folder, 'lesson.template.json')
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`, { flag: 'wx' })
  report.candidates.push({ locale, path: path.relative(repo, file), sha256: sha(file), prior: { path: path.relative(repo, original), sha256: sha(original) } })
  fs.writeFileSync(path.join(out, `${locale}-tool-outline.json`), `${JSON.stringify(flow, null, 2)}\n`, { flag: 'wx' })
  for (const name of ['exercises.template.json', 'figures.template.json']) {
    fs.copyFileSync(path.join(prior, 'candidates', locale, card, name), path.join(folder, name), fs.constants.COPYFILE_EXCL)
  }
}
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ status: report.status, candidates: report.candidates, native: report.native }))
