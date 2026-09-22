#!/usr/bin/env node

import fs from 'node:fs'
import process from 'node:process'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { proseOutline, sectionBreakIndices } = require('./htmlfrag.js')

function inspect(document) {
  const prose = document.prose ?? []
  const sectionBreaks = document.section_breaks ?? []
  const outline = proseOutline(prose)
  const resolvedBreaks = sectionBreakIndices(prose, sectionBreaks)
  return {
    paragraphs: outline,
    resolvedBreaks,
    boundaries: resolvedBreaks.map((index) => ({
      index,
      before: outline[index - 1].text,
      after: outline[index].text,
    })),
  }
}

function main() {
  const args = process.argv.slice(2)
  const stdin = args.includes('--stdin')
  const json = args.includes('--json') || stdin
  const filename = args.find((value) => !value.startsWith('--'))
  if (!stdin && !filename) {
    throw new Error('usage: prose_flow.mjs [--json] <lesson.json> | --stdin')
  }
  const raw = stdin ? fs.readFileSync(0, 'utf8') : fs.readFileSync(filename, 'utf8')
  const report = inspect(JSON.parse(raw))
  if (json) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
    return
  }
  for (const paragraph of report.paragraphs) {
    process.stdout.write(`[${paragraph.index}] ${paragraph.text}\n`)
    if (paragraph.index > 0) {
      const before = report.paragraphs[paragraph.index - 1].text
      process.stdout.write(
        `    break: ${JSON.stringify({ before, after: paragraph.text })}\n`,
      )
    }
  }
}

try {
  main()
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 2
}
