import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const owned = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author')
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const edition = `${root}/editions/modern-us-neutral`
const lesson = `${edition}/lessons/geo910-c2-s1-n44`
if (process.cwd() !== cwd) throw Error('wrong cwd')
const files = [
  '.claude/skills/ld-s10y-answer/SKILL.md',
  '.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.claude/skills/ld-s10y-answer/tools/lesson_answers.py',
  '.claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs',
  'app/src/lib/answer-normalize.ts',
  'app/src/lib/textbook-answer.ts',
  `${root}/book.json`,
  `${lesson}/lesson.json`,
  `${lesson}/exercises.json`,
  `${lesson}/figures.json`,
  `${lesson}/adaptation.audit.json`,
  `${root}/figures/fig-g10-08.png`,
  `${edition}/figures/fig-g10-08.spec.json`,
  `${edition}/figures/fig-g10-08.svg`,
  `${edition}/figures/fig-g10-08.render.json`,
  `${edition}/figures/fig-g10-08.review.json`,
]
const bindings = files.map(relativePath => {
  const absolutePath = path.join(cwd, relativePath)
  const bytes = fs.readFileSync(absolutePath)
  return {path: absolutePath, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length}
})
const document = {
  schema: 'n44-answer-author/input-bindings@1',
  cwd,
  capturedAt: new Date().toISOString(),
  bindings,
  bookAnswerEvidence: {
    path: path.join(cwd, `${root}/answers.json`),
    exists: fs.existsSync(path.join(cwd, `${root}/answers.json`)),
    contentsRead: false,
    pdfRead: false,
  },
  prerequisite: {
    suppliedByHuman: 'N44 adapt-finalize/render first exit 0; exercises 16-22 and four figures ready.',
    observed: {lesson: 'ready', exercises: 'ready', figures: 'ready', exerciseCount: 7, figureCount: 4},
    answerApproval: false,
    rerun: false,
  },
}
if (document.bookAnswerEvidence.exists) throw Error('unexpected book answers: do not read')
fs.writeFileSync(path.join(owned, 'input-bindings.json'), JSON.stringify(document, null, 2) + '\n', {flag: 'wx', mode: 0o444})
console.log(JSON.stringify(document, null, 2))
