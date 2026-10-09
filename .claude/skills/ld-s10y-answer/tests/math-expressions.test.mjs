import assert from 'node:assert/strict'
import test from 'node:test'
import {validateMathExpected} from '../tools/check_math_expressions.mjs'

test('LaTeX absolute values, fractions and finite numeric keys pass',()=>{
  assert.equal(validateMathExpected([
    {judge:'expression',expected:[String.raw`\left|x\right|`,String.raw`\frac{2}{3}x-4`]},
    {judge:'numeric',expected:[String.raw`\frac{20}{3}`,'-0.4']},
  ]).status,'pass')
})

test('programming abs notation cannot silently become a product of letters',()=>{
  const result=validateMathExpected([{judge:'expression',expected:['abs(x)']}])
  assert.equal(result.status,'fail')
  assert.match(result.failures[0],/programming function notation/)
})

test('numeric keys reject symbols and undefined numbers',()=>{
  const result=validateMathExpected([{judge:'numeric',expected:['x',String.raw`\frac{1}{0}`]}])
  assert.equal(result.status,'fail')
  assert.equal(result.failures.length,2)
})
