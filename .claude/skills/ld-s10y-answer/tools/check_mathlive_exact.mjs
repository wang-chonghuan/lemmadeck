#!/usr/bin/env node

import { createServer } from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'

import { exactMathAnswersMatch } from '../../../../app/src/lib/answer-normalize.ts'

const repo = path.resolve(import.meta.dirname, '../../../..')
const app = path.join(repo, 'app')
const require = createRequire(path.join(app, 'package.json'))
const { chromium } = require('@playwright/test')

function parseArgs(argv) {
  const options = { cases: [], answerKeys: [], headed: false, output: null }
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]
    if (value === '--cases') options.cases.push(argv[++index])
    else if (value === '--answer-key') options.answerKeys.push(argv[++index])
    else if (value === '--output') options.output = argv[++index]
    else if (value === '--headed') options.headed = true
    else throw new Error(`unknown argument: ${value}`)
  }
  if (!options.cases.length && !options.answerKeys.length) {
    throw new Error('provide --cases <json> or --answer-key <json>')
  }
  return options
}

async function loadCases(options) {
  const cases = []
  for (const filename of options.cases) {
    const document = JSON.parse(await readFile(filename, 'utf8'))
    for (const item of document.cases ?? []) cases.push({ ...item, source: filename })
  }
  for (const filename of options.answerKeys) {
    const document = JSON.parse(await readFile(filename, 'utf8'))
    for (const answer of document.answers ?? []) {
      for (const [partIndex, part] of (answer.parts ?? []).entries()) {
        if (answer.grading !== 'auto' || part.judge !== 'exact') continue
        for (const candidate of part.expected ?? []) {
          cases.push({
            name: `${document.lesson}/${answer.exercise}/${part.label ?? partIndex}`,
            input: candidate,
            expected: part.expected,
            reject: [],
            source: filename,
          })
        }
      }
    }
  }
  return cases
}

async function editMathLiveValue(page, url, input, targetedKeyboard) {
  await page.goto(url)
  const initialized = await page.evaluate(async (value) => {
    const { MathfieldElement } = await import('/mathlive.min.mjs')
    MathfieldElement.fontsDirectory = null
    MathfieldElement.soundsDirectory = null
    const element = new MathfieldElement()
    element.addEventListener('input', () => {
      element.dataset.inputEvents = String(Number(element.dataset.inputEvents ?? '0') + 1)
    })
    document.body.append(element)
    element.value = value
    element.dataset.inputEvents = '0'
    return {
      value: element.value,
      expanded: element.getValue('latex-expanded'),
    }
  }, input)
  const field = page.locator('math-field')
  await field.click()
  await field.evaluate((element) => {
    element.focus()
    element.executeCommand('moveToMathfieldEnd')
  })
  if (targetedKeyboard) await field.pressSequentially('+1')
  else await page.keyboard.type('+1')
  let insertionObserved = true
  let insertedExpanded = null
  try {
    const changed = await page.waitForFunction(
      (expanded) => {
        const current = document
          .querySelector('math-field')
          ?.getValue('latex-expanded')
        return current !== expanded ? current : false
      },
      initialized.expanded,
      { timeout: 1000 },
    )
    insertedExpanded = await changed.jsonValue()
  } catch {
    insertionObserved = false
  }
  let restorationObserved = false
  if (insertionObserved) {
    await field.click()
    await field.evaluate((element) => {
      element.focus()
      element.executeCommand('moveToMathfieldEnd')
    })
    await page.keyboard.press('Backspace')
    await page.keyboard.press('Backspace')
    try {
      await page.waitForFunction(
        (expanded) => (
          document.querySelector('math-field')?.getValue('latex-expanded') === expanded
        ),
        initialized.expanded,
        { timeout: 1000 },
      )
      restorationObserved = true
    } catch {
      restorationObserved = false
    }
  }
  const edited = await field.evaluate((element) => ({
    value: element.value,
    expanded: element.getValue('latex-expanded'),
    inputEvents: Number(element.dataset.inputEvents ?? '0'),
  }))
  return {
    initialized: initialized.value,
    expanded: edited.expanded,
    emitted: edited.value,
    inputEvents: edited.inputEvents,
    insertedExpanded,
    inserted: insertionObserved,
    preserved: (
      restorationObserved
      && initialized.expanded === edited.expanded
    ),
  }
}

async function mathLiveValues(browser, inputs) {
  const server = createServer(async (request, response) => {
    if (request.url === '/mathlive.min.mjs') {
      response.setHeader('Content-Type', 'text/javascript')
      response.end(await readFile(path.join(app, 'node_modules/mathlive/mathlive.min.mjs')))
      return
    }
    response.setHeader('Content-Type', 'text/html')
    response.end('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>')
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  const page = await browser.newPage()
  try {
    const url = `http://127.0.0.1:${address.port}/`
    const results = []
    for (const input of inputs) {
      let result
      let attempts = 0
      for (; attempts < 3; attempts += 1) {
        result = await editMathLiveValue(page, url, input, attempts > 0)
        if (result.inserted && result.inputEvents > 0 && result.preserved) break
      }
      results.push({
        ...result,
        attempts: Math.min(attempts + 1, 3),
      })
    }
    return results
  } finally {
    await page.close()
    await new Promise((resolve) => server.close(resolve))
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const cases = await loadCases(options)
  const flattened = cases.flatMap((item) => [item.input, ...(item.reject ?? [])])
  let emitted = []
  if (flattened.length) {
    const browser = await chromium.launch({ headless: !options.headed })
    try {
      emitted = await mathLiveValues(browser, flattened)
    } finally {
      await browser.close()
    }
  }

  let cursor = 0
  const results = cases.map((item) => {
    const positive = emitted[cursor++]
    const negatives = (item.reject ?? []).map((input) => ({
      input,
      ...emitted[cursor++],
    }))
    return {
      name: item.name,
      source: item.source,
      input: item.input,
      ...positive,
      accepted: (
        positive.inserted
        && positive.inputEvents > 0
        && positive.preserved
        && Boolean(positive.emitted?.trim())
        && exactMathAnswersMatch(item.expected, positive.emitted)
      ),
      rejected: negatives.map((negative) => ({
        ...negative,
        rejected: (
          negative.inserted
          && negative.inputEvents > 0
          && negative.preserved
          && !exactMathAnswersMatch(item.expected, negative.emitted)
        ),
      })),
    }
  })
  const failures = results.filter(
    (item) => !item.accepted || item.rejected.some((negative) => !negative.rejected),
  )
  const report = {
    schema: 'ld-s10y-answer/mathlive-exact-report@1',
    status: failures.length ? 'fail' : 'pass',
    caseCount: results.length,
    failures: failures.length,
    results,
  }
  const serialized = `${JSON.stringify(report, null, 2)}\n`
  if (options.output) await writeFile(options.output, serialized)
  process.stdout.write(serialized)
  if (failures.length) process.exitCode = 2
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error))
  process.exitCode = 2
})
