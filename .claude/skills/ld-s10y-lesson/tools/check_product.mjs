#!/usr/bin/env node
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const require = createRequire(path.join(root, 'app/package.json'))
const { chromium, expect } = require('@playwright/test')

async function hideKeyboard(page) {
  await page.evaluate(() => window.mathVirtualKeyboard?.hide({ animate: false }))
}

export async function assertKeyboardCoverage(scope) {
  const errors = await scope.evaluate(container => {
    const fields = [...container.querySelectorAll('input:not([type=hidden]), textarea, math-field')]
    return fields.flatMap(field => {
      const button = [...container.querySelectorAll('button[aria-controls]')]
        .find(button => button.getAttribute('aria-controls') === field.id)
      return field.id && button && button.getAttribute('aria-label') && !button.disabled
        ? [] : [`Answer field missing an enabled keyboard control: ${field.id || field.tagName}`]
    })
  })
  assert.deepEqual(errors, [])
}

export function expectedFigureCoverage(lesson, exercises) {
  const prose = (lesson.prose ?? [])
    .filter(block => block?.kind === 'fig' && typeof block.id === 'string')
    .map(block => block.id)
  const exercise = exercises.flatMap(item =>
    (item.figures ?? [])
      .filter(figure => typeof figure?.id === 'string')
      .map(figure => figure.id)
  )
  return {
    prose: [...new Set(prose)],
    exercise: [...new Set(exercise)],
    print: [...new Set([...prose, ...exercise])],
  }
}

async function assertFigurePixels(figure, page) {
  const png = await figure.screenshot()
  const marks = await page.evaluate(async base64 => {
    const image = new Image()
    image.src = `data:image/png;base64,${base64}`
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0)
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
    let marks = 0
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index + 3] > 0 && Math.min(...pixels.slice(index, index + 3)) < 180) marks += 1
    }
    return marks
  }, png.toString('base64'))
  assert.ok(marks > 100, 'Figure screenshot has no visible drawing')
}

async function assertPublishedFigure({ figure, asset, book, edition, lesson, page }) {
  await expect(figure).toBeAttached()
  if (asset.svg) {
    const assetPath = path.join(book, 'editions', edition, asset.svg)
    const currentSVG = fs.readFileSync(assetPath, 'utf8')
    assert.equal(await figure.evaluate((element, expected) => {
      const host = document.createElement('div')
      host.innerHTML = expected
      return element.querySelector('svg')?.outerHTML === host.querySelector('svg')?.outerHTML
    }, currentSVG), true, `${lesson}/${asset.id}: published SVG is stale`)
  }
  const imageAsset = asset.artwork || asset.png
  if (imageAsset) {
    const assetPath = path.join(book, 'editions', edition, imageAsset)
    assert.equal(
      await figure.locator('img').getAttribute('src'),
      `data:image/png;base64,${fs.readFileSync(assetPath).toString('base64')}`,
    )
  }
  if (asset.artwork) {
    await expect(figure.locator('.sr-figure-artwork')).toHaveCount(1)
    await expect(figure.locator('.sr-figure-vector svg')).toHaveCount(1)
  }
  const state = await figure.evaluate(async element => {
    const svg = element.querySelector('svg')
    const image = element.querySelector('img')
    if (image) await image.decode()
    const media = svg || image
    if (!media) return null
    const rect = media.getBoundingClientRect()
    element.scrollLeft = element.scrollWidth
    const atEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - 1
    element.scrollLeft = 0
    return {
      width: rect.width,
      height: rect.height,
      atEnd,
      marks: svg
        ? svg.querySelectorAll('path,line,polygon,circle,text,rect').length
        : image.naturalWidth,
    }
  })
  assert.ok(
    state?.width > 0 && state.height > 0 && state.marks > 0 && state.atEnd,
    `${lesson}/${asset.id}: missing, blank or unreachable figure`,
  )
  await assertFigurePixels(figure, page)
}

export async function checkProduct({ book, edition, lessons, baseURL, output, viewports }) {
  assert.match(baseURL, /^http:\/\/(?:localhost|127\.0\.0\.1):\d+$/, 'Acceptance must use localhost')
  assert.ok(lessons.length, 'No lessons selected')
  fs.mkdirSync(output, { recursive: true })
  const browser = await chromium.launch({ headless: false })
  const report = []
  let current = {}
  let activePage
  try {
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport })
      const page = await context.newPage()
      page.setDefaultTimeout(15000)
      activePage = page
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      for (const lesson of lessons) {
        const dir = path.join(book, 'editions', edition, 'lessons', lesson)
        const lessonDocument = JSON.parse(fs.readFileSync(path.join(dir, 'lesson.json')))
        const exercises = JSON.parse(fs.readFileSync(path.join(dir, 'exercises.json'))).exercises
        const answers = JSON.parse(fs.readFileSync(path.join(dir, 'answer-keys.json'))).answers
        const interactions = JSON.parse(fs.readFileSync(path.join(dir, 'interactions.json'))).interactions
        const figureManifest = JSON.parse(fs.readFileSync(path.join(dir, 'figures.json'))).figures
        const coverage = expectedFigureCoverage(lessonDocument, exercises)
        assert.deepEqual(
          new Set(figureManifest.map(figure => figure.id)),
          new Set(coverage.print),
          `${lesson}: figure manifest differs from prose/exercise coverage`,
        )

        await page.goto(`${baseURL}/card/${lesson}`)
        await expect(page.locator('.sr-deck-title')).toBeVisible()
        await expect(page.locator('.sr-read')).toBeVisible()
        for (const figureId of coverage.prose) {
          current = { lesson, figure: figureId, viewport: viewport.width, surface: 'prose' }
          const figure = page.locator(`.sr-read [data-figure-id="${figureId}"]`)
          await expect(figure).toHaveCount(1)
          const asset = figureManifest.find(item => item.id === figureId)
          assert.ok(asset, `Missing prose figure manifest entry: ${figureId}`)
          await assertPublishedFigure({ figure, asset, book, edition, lesson, page })
        }

        if (viewport.width === 1440) {
          await page.emulateMedia({ media: 'print' })
          const print = page.getByTestId('lesson-print')
          await expect(print).toBeVisible()
          for (const figureId of coverage.print) {
            current = { lesson, figure: figureId, viewport: 'print', surface: 'print' }
            const figures = print.locator(`[data-figure-id="${figureId}"]`)
            assert.ok(await figures.count(), `${lesson}/${figureId}: missing from print`)
            const asset = figureManifest.find(item => item.id === figureId)
            assert.ok(asset, `Missing print figure manifest entry: ${figureId}`)
            await assertPublishedFigure({
              figure: figures.first(), asset, book, edition, lesson, page,
            })
          }
          const printGeometry = await print.evaluate(element => {
            const figures = [...element.querySelectorAll('[data-figure-id]')]
            return {
              width: element.scrollWidth,
              clientWidth: element.clientWidth,
              clipped: figures.some(figure => {
                const media = figure.querySelector('svg, img')
                if (!media) return true
                const outer = figure.getBoundingClientRect()
                const inner = media.getBoundingClientRect()
                return inner.width <= 0 || inner.height <= 0 || inner.right > outer.right + 1
              }),
            }
          })
          assert.ok(printGeometry.clientWidth > 0)
          assert.equal(printGeometry.width > printGeometry.clientWidth + 1, false)
          assert.equal(printGeometry.clipped, false)
          await page.screenshot({
            path: path.join(output, `${lesson}-print.png`),
            fullPage: true,
          })
          await page.emulateMedia({ media: 'screen' })
        }

        if (exercises.length === 0) {
          await expect(page.locator('[role="tablist"]')).toHaveCount(0)
          await page.goto(`${baseURL}/card/${lesson}?tab=ex`)
          await expect(page.locator('.sr-read')).toBeVisible()
        } else {
          await page.goto(`${baseURL}/card/${lesson}?tab=ex`)
        }
        const articles = page.locator('article[id^="ex-"]')
        await expect(articles).toHaveCount(exercises.length)
        const initialPadding = await page.locator('.sr-d-scroll').evaluate(element => element.style.paddingBottom)
        let fieldsChecked = 0, figuresChecked = 0
        const widgets = new Set()
        for (const exercise of exercises) {
          current = { lesson, exercise: exercise.number, viewport: viewport.width }
          const article = page.locator(`#ex-${exercise.number}`)
          const answer = answers.find(item => String(item.exercise) === String(exercise.number))
          const interaction = interactions.find(item => String(item.exercise) === String(exercise.number))
          assert.ok(answer, `Missing answer for ${lesson}/${exercise.number}`)
          const grid = ['grid-point', 'grid-plot'].includes(interaction?.widget)
          const expectedFields = grid ? 0 : answer.grading === 'auto' ? answer.parts.length : 1
          const fields = article.locator('math-field, input:not([type=hidden]), textarea')
          await expect(fields).toHaveCount(expectedFields)
          await expect(article.locator('[aria-busy="true"]')).toHaveCount(0)
          await assertKeyboardCoverage(article)
          fieldsChecked += expectedFields

          for (const reference of exercise.figure_refs) {
            const figure = page.locator(`.sr-ex-list [data-figure-id="${reference}"]`).first()
            await expect(figure).toBeAttached()
          }
          for (const figureSpec of exercise.figures) {
            await hideKeyboard(page)
            const figure = article.locator(`[data-figure-id="${figureSpec.id}"]`)
            await expect(figure).toHaveCount(1)
            const asset = figureManifest.find(item => item.id === figureSpec.id)
            assert.ok(asset, `Missing figure manifest entry: ${figureSpec.id}`)
            await assertPublishedFigure({ figure, asset, book, edition, lesson, page })
            figuresChecked += 1
          }

          if (expectedFields) {
            // Every blank must target its own math field. The actual virtual
            // key is clicked; no grading or learner database writes are made.
            for (let index = 0; index < expectedFields; index += 1) {
              const field = fields.nth(index)
              current.input = index
              const id = await field.getAttribute('id')
              const button = article.locator('button[aria-controls]').nth(index)
              assert.equal(await button.getAttribute('aria-controls'), id)
              const before = await fields.evaluateAll(items => items.map(item => item.value))
              await button.evaluate(element => element.click())
              await expect(field).toBeFocused()
              const key = page.locator('.ML__keyboard [data-keycap-value="7"]:visible').first()
              await expect(key).toBeVisible()
              await key.click()
              await expect.poll(() => field.evaluate(element => element.value),
                { message: JSON.stringify(current) }).not.toBe(before[index])
              const after = await fields.evaluateAll(items => items.map(item => item.value))
              after.forEach((value, other) => {
                if (other !== index) assert.equal(value, before[other], 'Keyboard changed another blank')
              })
            }
            // Real pointer accessibility and viewport framing for each widget.
            if (!widgets.has(interaction?.widget)) {
              widgets.add(interaction?.widget)
              await hideKeyboard(page)
              const button = article.locator('button[aria-controls]').first()
              await button.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }))
              await button.click()
              await expect(fields.first()).toBeFocused()
              await expect(page.locator('.ML__keyboard [data-keycap-value="7"]:visible').first()).toBeVisible()
              await page.screenshot({
                path: path.join(output, `${lesson}-${interaction?.widget}-${viewport.width}.png`),
              })
            }
          }
        }
        const lastField = articles.locator('math-field').last()
        if (await lastField.count()) {
          await hideKeyboard(page)
          const lastButton = articles.locator('button[aria-controls]').last()
          await lastButton.scrollIntoViewIfNeeded()
          await lastButton.click()
          await expect(lastField).toBeFocused()
          await expect.poll(() => lastField.evaluate(element => {
            const field = element.getBoundingClientRect()
            const plate = document.querySelector('.ML__keyboard .MLK__plate')?.getBoundingClientRect()
            return !!plate && plate.height > 0 && field.top >= 0 && field.bottom <= plate.top
          })).toBe(true)
          await lastField.locator('[part="virtual-keyboard-toggle"]').click()
        }
        await expect(page.locator('.ML__keyboard .MLK__plate:visible')).toHaveCount(0)
        await expect.poll(() => page.locator('.sr-d-scroll').evaluate(element => element.style.paddingBottom)).toBe(initialPadding)
        const freeSample = answers.find(answer =>
          answer.grading === 'ungraded' &&
          interactions.some(item =>
            String(item.exercise) === String(answer.exercise) && item.widget === 'free'
          )
        )
        if (freeSample) {
          current = {
            lesson,
            exercise: freeSample.exercise,
            viewport: viewport.width,
            check: 'ungraded-chinese',
          }
          const article = page.locator(`#ex-${freeSample.exercise}`)
          const field = article.locator('math-field, input:not([type=hidden]), textarea').first()
          await field.evaluate(element => {
            element.value = ''
            element.dispatchEvent(new Event('input', { bubbles: true }))
          })
          await field.focus()
          await page.keyboard.insertText('观察和实验')
          await expect.poll(() => field.evaluate(element => element.value)).toContain('观察')
          await article.locator('.sr-math-submit').click()
          const result = article.locator('.sr-math-result.ungraded')
          await expect(result).toBeVisible()
          await expect(result.locator('.sr-math-standard p')).not.toHaveText('')
          assert.equal((await context.cookies()).some(cookie => cookie.name === 'sr_session'), false)
        }
        const answerRenderSample = answers.find(answer =>
          answer.grading === 'auto' &&
          answer.displayAnswer?.includes('$') &&
          answer.parts?.length > 0 &&
          answer.parts.every(part =>
            part.judge === 'numeric' && typeof part.expected?.[0] === 'string'
          )
        )
        if (answerRenderSample) {
          const interaction = interactions.find(item =>
            String(item.exercise) === String(answerRenderSample.exercise)
          )
          const grid = ['grid-point', 'grid-plot'].includes(interaction?.widget)
          if (!grid) {
            current = {
              lesson,
              exercise: answerRenderSample.exercise,
              viewport: viewport.width,
              check: 'rendered-answer',
            }
            const article = page.locator(`#ex-${answerRenderSample.exercise}`)
            const fields = article.locator('math-field, input:not([type=hidden]), textarea')
            await expect(fields).toHaveCount(answerRenderSample.parts.length)
            for (const [index, part] of answerRenderSample.parts.entries()) {
              await fields.nth(index).evaluate((element, value) => {
                element.value = value
                element.dispatchEvent(new Event('input', { bubbles: true }))
              }, part.expected[0])
            }
            await article.locator('.sr-math-submit').click()
            await expect(article.locator('.sr-math-result.correct')).toBeVisible()
            const standard = article.locator('.sr-math-standard')
            await expect(standard.locator('.katex').first()).toBeVisible()
            assert.equal((await standard.textContent()).includes('$'), false)
          }
        }
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
        assert.deepEqual(errors, [])
        const row = {
          lesson,
          viewport: viewport.width,
          exercises: exercises.length,
          inputs: fieldsChecked,
          proseFigures: coverage.prose.length,
          exerciseFigures: figuresChecked,
          printFigures: viewport.width === 1440 ? coverage.print.length : null,
          ungradedSubmission: freeSample?.exercise ?? null,
          renderedAnswer: answerRenderSample?.exercise ?? null,
        }
        report.push(row)
        fs.writeFileSync(path.join(output, 'product-check.json'), `${JSON.stringify(report, null, 2)}\n`)
        console.log(`PASS ${JSON.stringify(row)}`)
      }
      await context.close()
    }
    return report
  } catch (error) {
    console.error('Failed at', current)
    await activePage?.screenshot({ path: path.join(output, 'failure.png') }).catch(() => {})
    throw error
  } finally {
    await browser.close()
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const value = flag => args[args.indexOf(flag) + 1]
  for (const flag of ['--book-dir', '--edition', '--base-url', '--output']) {
    assert.ok(args.includes(flag), `Missing ${flag}`)
  }
  const book = path.resolve(value('--book-dir')), edition = value('--edition')
  const lessons = args.includes('--all')
    ? fs.readdirSync(path.join(book, 'editions', edition, 'lessons')).sort()
    : args.flatMap((arg, index) => arg === '--lesson' ? [args[index + 1]] : [])
  await checkProduct({
    book, edition, lessons, baseURL: value('--base-url'), output: path.resolve(value('--output')),
    viewports: [{ width: 1440, height: 960 }, { width: 390, height: 844 }],
  })
}
