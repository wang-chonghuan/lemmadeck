import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const source = path.join(tmp, 'n32-draft-first-10/work/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s1-n32/exercises.template.json')
const prior = read(source)
const candidate = structuredClone(prior)
const item = candidate.exercises.find(exercise => exercise.number === '438')
const oldItem = prior.exercises.find(exercise => exercise.number === '438')
const prefixes = ['а)', 'б)', 'в)', 'г)', 'д)', 'е)', 'ж)', 'з)', 'и)', 'к)']
assert.equal(item.lines.length, 11)
item.lines = item.lines.map((line, index) => {
  if (index === 0) return line
  const prefix = prefixes[index - 1]
  assert.ok(line.startsWith(prefix + ' '), line)
  return `${index})` + line.slice(prefix.length)
})
const footnoteBoundary = '．* 象角 1 和角 8'
assert.ok(item.lines[10].includes(footnoteBoundary))
item.lines[10] = item.lines[10].replace(footnoteBoundary, '．\n\n* 象角 1 和角 8')
item.text = item.lines.join('\n')
item.lines = item.text.split('\n')
const math = text => [...text.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g)].map(match => match[0])
assert.deepEqual(math(item.text), math(oldItem.text))
assert.equal(item.source_text, oldItem.source_text)
assert.deepEqual(
  candidate.exercises.filter(exercise => exercise.number !== '438'),
  prior.exercises.filter(exercise => exercise.number !== '438'),
)
const oldBody = oldItem.lines.slice(1).map((line, index) => line.slice(prefixes[index].length))
const restoredBody = item.text.split('\n').slice(1, 11)
  .map((line, index) => line.slice(`${index + 1})`.length))
restoredBody[9] += '\n\n' + item.text.split('\n').slice(12).join('\n')
assert.deepEqual(
  restoredBody.map(line => line.replace('\n\n* 象角 1 和角 8', '* 象角 1 和角 8')),
  oldBody,
)
const own = path.join(tmp, 'n32-438-modern-submarkers-revision1-13')
fs.mkdirSync(own)
const output = path.join(own, 'exercises.template.json')
save(output, candidate)
const record = {
  status: 'MODERN438_LABEL_LAYOUT_REPAIR_ONLY_NOT_APPROVED',
  sourceTemplate: bind(source), changedTemplate: bind(output),
  exercise: '438', changedFields: ['text', 'lines'],
  oldSubmarkers: prefixes, newSubmarkers: prefixes.map((_, index) => `${index + 1})`),
  sourceTextAndFormulaSequenceUnchanged: true,
  sourceFootnotePreservedWithSeparateParagraph: true,
  otherEightExerciseObjectsUnchanged: true,
  modern438PresentationRevisionsUsed: 1,
  originalFIRSTsFailuresUnknownsAndCountersPreserved: true,
  figureContextBindingsNotYetUpdated: true, figureTemplatesApplied: false,
  figure204206SemanticHOLDAnd205CollisionUnchanged: true,
  adaptFinalizeRun: false, renderRun: false, nativeAnswerFinalizeRun: false,
  imageLoads: 0, activeExecSessions: [], wholeLessonApproved: false,
  requiredAffectedReview: 'Only numeric submarker order, ten unchanged formula targets and separated unchanged footnote; reuse original source/text/math PASS. Downstream figure context binding updates remain pending.',
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
console.log(JSON.stringify({
  candidate: bind(output),
  retention: retainCurrent6g(
    'evidence/stemrobin188-6g-n32/438-modern-submarkers-revision1-13',
    [bind(source), bind(output), bind(recordFile), bind(path.join(tmp, 'repair-n32-438-modern-submarkers-13.mjs'))],
    ['evidence/stemrobin188-6g-n32/assembly-and-prepare-first10/retention.json'],
    record,
  ),
}))
