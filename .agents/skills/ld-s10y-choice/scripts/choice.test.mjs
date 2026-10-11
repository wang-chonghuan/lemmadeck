import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateDocument, context, documentHash, selectLessons } from './choice.mjs'
import { graphSpec } from './graph-options.mjs'
import fs from 'node:fs'

const ctx = context('6a', 'modern-us-neutral', 'alg6-c2-s3-n16')
const document = JSON.parse(fs.readFileSync(`${ctx.directory}/choices.json`, 'utf8'))
test('selected range derives exactly the three requested lessons', () => {
  assert.equal(selectLessons('6a', '16-18').length, 3)
  assert.throws(() => selectLessons('6a', '999'), /missing|selected/)
})
test('source drift and omitted declared target fail', () => {
  const changed = structuredClone(document)
  changed.source.exercises = 'changed'
  assert.throws(() => validateDocument(changed, ctx), /Source changed/)
  const omitted = structuredClone(document)
  omitted.questions.pop()
  assert.throws(() => validateDocument(omitted, ctx), /Uncovered/)
})
test('duplicate equivalent answers and display mismatch fail', () => {
  const changed = structuredClone(document)
  const question = changed.questions.find(q => q.verification.kind === 'numeric')
  question.options[1].value = question.options[0].value
  question.options[1].text = `$${question.options[0].value}$单位`
  assert.throws(() => validateDocument(changed, ctx), /equivalent/)
  const mismatch = structuredClone(document)
  mismatch.questions.find(q => q.verification.kind === 'numeric').options[0].text = '$12345$'
  assert.throws(() => validateDocument(mismatch, ctx), /displayed value/)
})
test('question and option order are not the answer key', () => {
  const changed = structuredClone(document)
  for (const question of changed.questions) question.options.reverse()
  assert.equal(validateDocument(changed, ctx).questions, document.questions.length)
  assert.notEqual(documentHash(changed), documentHash(document))
})
test('source relationships remain internal and cannot enter student copy', () => {
  assert.equal(validateDocument(document, ctx).questions, document.questions.length)
  for (const field of ['prompt', 'explanation', 'text', 'misconception']) {
    const changed = structuredClone(document)
    const target = ['prompt', 'explanation'].includes(field) ? changed.questions[0] : changed.questions[0].options[0]
    target[field] = '查看原题或原表。'
    assert.throws(() => validateDocument(changed, ctx), /source reference in student copy/)
  }
})

const setDocument = () => {
  const changed = structuredClone(document)
  Object.assign(changed.questions[0], {
    prompt: '哪个集合是给定函数的值域？',
    figureRefs: [],
    options: [
      { id: 'a', text: '$\\{1,\\frac{1}{2}\\}$', value: '\\{1,\\frac{1}{2}\\}' },
      { id: 'b', text: '$\\{1,2\\}$', value: '\\{1,2\\}', misconception: '把二分之一取了倒数。' },
      { id: 'c', text: '$\\{-1,\\frac{1}{2}\\}$', value: '\\{-1,\\frac{1}{2}\\}', misconception: '把正一误写成负一。' },
    ],
    correctOptionId: 'a',
    explanation: '逐个求值后得到一和二分之一。',
    verification: { kind: 'set', expected: '\\{0.5,1\\}' },
  })
  return changed
}

test('finite sets ignore order and recognize decimal/fraction equivalence', () => {
  assert.equal(validateDocument(setDocument(), ctx).questions, document.questions.length)
  const duplicate = setDocument()
  duplicate.questions[0].options[1] = {
    id: 'b', text: '$\\{0.5,1,1\\}$', value: '\\{0.5,1,1\\}', misconception: '重复元素不改变集合。',
  }
  assert.throws(() => validateDocument(duplicate, ctx), /equivalent options/)
})

test('finite sets cannot bypass mathematical checks as literal text', () => {
  const changed = setDocument()
  changed.questions[0].verification = { kind: 'literal', reason: 'Reviewed.' }
  assert.throws(() => validateDocument(changed, ctx), /finite sets require set verification/)
  const mismatch = setDocument()
  mismatch.questions[0].options[0].text = '$\\{1,3\\}$'
  assert.throws(() => validateDocument(mismatch, ctx), /displayed value mismatch/)
})

test('graph source inventory is inspected input, never a previous lesson template', () => {
  const reference = {
    description: 'Inspected orthogonal source frame; comparison curves are authored additions.',
    authoritativeText: [{ text: 'Draw the function defined by the given equation.' }],
  }
  const source = { path: 'source.png', sha256: 'source-hash' }
  assert.throws(() => graphSpec('figure', { k: 0.2, type: 'direct' }, source, 'Select its graph.'), /inventory/)
  const spec = graphSpec('figure', { k: 0.2, type: 'direct' }, source, 'Select its graph.', reference)
  assert.equal(spec.source.inventory[0].description, reference.description)
  assert.deepEqual(spec.source.authoritativeText, [...reference.authoritativeText, { text: 'Select its graph.' }])
  assert(!JSON.stringify(spec).includes('exercise288'))
})
