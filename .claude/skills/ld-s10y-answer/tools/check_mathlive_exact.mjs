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
    await page.goto(`http://127.0.0.1:${address.port}/`)
    return await page.evaluate(async (values) => {
      const { MathfieldElement } = await import('/mathlive.min.mjs')
      MathfieldElement.fontsDirectory = null
      MathfieldElement.soundsDirectory = null
      return values.map((value) => {
        const field = new MathfieldElement()
        document.body.append(field)
        field.value = value
        const emitted = field.value
        field.remove()
        return emitted
      })
    }, inputs)
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
      emitted: emitted[cursor++],
    }))
    return {
      name: item.name,
      source: item.source,
      input: item.input,
      emitted: positive,
      accepted: Boolean(positive?.trim()) && exactMathAnswersMatch(item.expected, positive),
      rejected: negatives.map((negative) => ({
        ...negative,
        rejected: !exactMathAnswersMatch(item.expected, negative.emitted),
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
