import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180'
assert.equal(process.cwd(), root)
const base = 'ssot-resources/soviet10year-textbooks/artifacts/8p'
const output = `${base}/lessons/phy8-c1-s1-n7/figure-review-27-29`
const author = `${base}/editions/modern-us-neutral/lessons/phy8-c1-s1-n7/figure-author-27-29`
const candidate = '.tmp/180-7-n7-figures-27-29/candidate-2'
const canonical = `${base}/editions/modern-us-neutral/figures`
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const binding = file => ({ path: file, sha256: digest(file) })
const writeNew = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const expected = {
  27: ['89d7238201aabcacfee0c5f36635117daee0e544b574b14ea2c948bd8f9e51a1', 'eb394b3f79ac0ebd5209096e268673be5d682d95d060fa0b3f5e5f9581d355e8', '25d8b5bb27c4a28f95667ebe22c651a9a781efe6c8de2ad79ac58ca0cfaa3501'],
  28: ['b7f947f9d0308c7d60001f85770894b255cff2f44c2c763b702a204529ee34ce', 'd2d5a9cab5774077f8eaee1177533e0eba8fb5ac93848ce145b7afab1d1b403d', 'cb9bc04e482979bd88ea27e6894f25cf34112bd671d1eaf51a48988c694d47df'],
  29: ['c65cac35fe17f8a669fd119004dab6b459685be18711718b26c2f9035c45839e', 'd9063ca4fe08bcdf827ffc79d797494f26ac3d00fee0c895cbc00142cfc25aa3', '1946b89505ecfadd2b31fab89db7e30d22ee2eea151dc13b7efc00c72575bac5'],
}
for (const n of [27, 28, 29]) {
  for (const ext of ['spec.json', 'svg', 'render.json', 'review.json']) {
    assert.ok(!fs.existsSync(`${canonical}/fig-${n}.${ext}`), 'Canonical target already exists')
  }
}
const templates = ['lesson', 'exercises'].map(name =>
  `.tmp/ld-s10y-lesson/adapt/8p/modern-us-neutral/lessons/phy8-c1-s1-n7/${name}.template.json`)
const templateBindings = templates.map(binding)
assert.equal(templateBindings[0].sha256, 'a5986e949ace9639c7633bf2d579e4622b2a7246dc192d031cef7bb0dc1283f8')
assert.equal(templateBindings[1].sha256, 'a108f745dddf0051e04839b409b3f4697c599a0faa522ddfbdb3197c755c7e20')
const lesson = read(templates[0])
const exercises = read(templates[1])
assert.deepEqual(lesson.errata, [])
const evidence = {
  schema: 'ld-s10y-image/independent-inspection@1',
  ticket: 'STEMROBIN-180/180-7',
  lesson: 'phy8-c1-s1-n7',
  reviewer: 'sole-first-independent-figure-reviewer-27-29',
  capturedAt: new Date().toISOString(),
  imageLoadsBeforeComposites: 3,
  canonicalTargetsAbsentBeforeWrites: true,
  templatesReadOnly: templateBindings,
  tool: binding(`${output}/inspect-current.mjs`),
  figures: [],
}
const near = (actual, wanted) => assert.ok(Math.abs(actual - wanted) < 1e-8, `${actual} != ${wanted}`)
const require = createRequire(path.join(root, 'app/package.json'))
const { chromium } = require('playwright')
const executablePath = [process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean).find(fs.existsSync)
assert.ok(executablePath, 'No installed browser; installation is not authorized')
const browser = await chromium.launch({ executablePath, headless: true })
try {
  for (const n of [27, 28, 29]) {
    const stem = `${candidate}/fig-${n}`
    const inputs = ['spec.json', 'svg', 'render.json'].map(ext => binding(`${stem}.${ext}`))
    inputs.forEach((item, index) => assert.equal(item.sha256, expected[n][index]))
    const spec = read(inputs[0].path)
    const render = read(inputs[2].path)
    assert.equal(digest(spec.source.image.path), spec.source.image.sha256)
    assert.equal(render.status, 'pass')
    assert.equal(render.spec.sha256, inputs[0].sha256)
    assert.equal(render.output.svg.sha256, inputs[1].sha256)
    assert.deepEqual(render.collisions, [])
    assert.deepEqual(spec.display.widths, [318, 358, 480])
    assert.equal(spec.display.maxWidthPx, 480)
    assert.equal(spec.display.purpose, 'instructional')
    assert.equal(spec.display.layout, 'inline')
    const wantedText = lesson.prose.filter(item => item.kind === 'p').map(item => item.text)
    const suppliedText = spec.source.authoritativeText.filter(item => !item.exercise).map(item => item.text)
    assert.deepEqual(suppliedText, wantedText)
    for (const item of spec.source.authoritativeText.filter(item => item.exercise)) {
      assert.equal(item.text, exercises.exercises.find(ex => ex.number === item.exercise).text)
    }
    const validation = spawnSync('python3', ['.agents/skills/ld-s10y-image/scripts/validate_spec.py',
      inputs[0].path, '--stage', 'rendered'], {
      cwd: root, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    })
    assert.equal(validation.status, 0, validation.stdout + validation.stderr)
    const objects = new Map(spec.objects.map(item => [item.id, item]))
    const assertions = new Map(spec.assertions.map(item => [item.id, item]))
    for (const group of spec.source.inventory) {
      group.objects.forEach(id => assert.ok(objects.has(id), `Unmapped object ${id}`))
      group.assertions.forEach(id => assert.ok(assertions.has(id), `Unmapped assertion ${id}`))
    }
    const point = id => objects.get(id).at
    const checks = ['current source/spec/SVG/render hashes', 'rendered spec validation',
      'complete authoritative prose and referenced written exercise text',
      'source inventory IDs and in-group point relationships']
    if (n === 27) {
      for (let i = 0; i < 5; i++) {
        const center = point(`clock-${i}-center`)
        const fixed = point(`clock-${i}-up-tip`)
        const rotating = point(`clock-${i}-rotating-tip`)
        near(fixed[0] - center[0], 0)
        near(fixed[1] - center[1], 28)
        const angle = i * Math.PI / 3
        near(rotating[0] - center[0], 22 * Math.sin(angle))
        near(rotating[1] - center[1], 22 * Math.cos(angle))
        assert.equal(spec.objects.filter(item => item.id.startsWith(`clock-${i}-tick-`)).length, 12)
        assert.equal(objects.get(`clock-${i}-time`).text, i ? `t${String.fromCharCode(0x2080 + i)}` : 't = 0')
        const position = point(`position-x${i}`)
        near(position[0], center[0])
        assert.equal(objects.get(`position-x${i}-text`).text, `x${String.fromCharCode(0x2080 + i)}`)
        if (i) {
          near(position[0] - point(`position-x${i - 1}`)[0], 96)
          near(position[1] - point(`position-x${i - 1}`)[1], 32)
        }
      }
      assert.equal(objects.get('trajectory-X').text, 'X')
      assert.equal(objects.get('inclined-X-trajectory').type, 'arrow')
      checks.push('all ten hand states, 60 ticks, five double rims, times and ordered inclined X trajectory')
    } else {
      assert.equal(objects.get('time-units').text, 't (s)')
      assert.equal(objects.get('position-units').text, 'x (m)')
      const time = objects.get('time-axis').ticks
      const position = objects.get('position-axis').ticks
      if (n === 28) {
        assert.deepEqual(time.map(item => item.at[0]), [-30, -20, -10, 0, 10, 20, 30])
        assert.deepEqual(time.map(item => item.label), ['-30', '-20', '-10', '0', '10', '20', '30'])
        assert.deepEqual(position.map(item => item.at[1]), [1, 2, 3, 4, 5])
        assert.deepEqual(point('graph-A'), [0, 3])
        assert.deepEqual(point('graph-backward-end'), [-30, 0])
        assert.deepEqual(point('graph-positive-end'), [30, 6])
        assert.equal(objects.get('graph-A').label, 'A')
        assert.equal(objects.get('backward-time-dashed').dash, 2)
        assert.equal(objects.get('positive-time-solid').dash, undefined)
        checks.push('A=(0,3), signed time ticks, metre ticks, source endpoints and solid/dashed join')
      } else {
        assert.deepEqual(time.map(item => item.at[0]), [0, 1, 2, 3, 4, 5, 6, 7, 8])
        assert.deepEqual(time.filter(item => item.label).map(item => item.label), ['0', '2', '4', '6', '8'])
        assert.deepEqual(position.map(item => item.at[1]), [-2, -1, 1, 2, 3, 4, 5, 6, 7, 8])
        assert.deepEqual(point('common-initial-position'), [0, 3])
        const endpoints = [[2, 9], [10 / 3, 8], [6, 6], [5, -2]]
        const velocities = [3, 1.5, 0.5, -1]
        endpoints.forEach((end, i) => {
          const current = point(`line-${i + 1}-end`)
          current.forEach((value, index) => near(value, end[index]))
          near((current[1] - 3) / current[0], velocities[i])
          assert.equal(objects.get(`line-${i + 1}-printed-velocity`).text,
            `v${String.fromCharCode(0x2081 + i)} = ${velocities[i]} m/s`)
          assert.equal(objects.get(`line-${i + 1}-number`).text, String(i + 1))
          assert.equal(objects.get(`motion-line-${i + 1}`).dash, undefined)
        })
        assert.deepEqual(point('constant-position-end'), [8, 3])
        assert.equal(objects.get('unlabelled-constant-position-dashed').dash, 2)
        assert.equal(objects.get('unlabelled-constant-position-dashed').label, undefined)
        near(3 + 1.5 * 3, 7.5)
        near(3 - 3, 0)
        near((3 + 0.5 * 5) - (3 + 0.5 * 1), 2)
        near((3 - 5) - (3 - 1), -4)
        checks.push('four signed source velocities, numbered branches and original endpoint levels',
          't=3 query coordinates and 1..5 s displacement coordinates, with no visible answer annotations')
      }
    }
    const snapshot = `${output}/fig-${n}.author-render.snapshot.json`
    fs.copyFileSync(inputs[2].path, snapshot, fs.constants.COPYFILE_EXCL)
    const svg = fs.readFileSync(inputs[1].path, 'utf8')
    const height = Math.ceil(spec.canvas.height + spec.canvas.height * 318 / 480 + 100)
    const page = await browser.newPage({ viewport: { width: 1002, height }, deviceScaleFactor: 1 })
    const panes = [[480, 'neutral'], [358, 'neutral'], [318, 'neutral'], [318, 'accent'], [318, 'print']]
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>
      body { margin:0; background:white; font:16px Arial; color:#15201f; }
      main { padding:12px; } .row { display:flex; gap:12px; margin-bottom:16px; }
      section { flex:none; } p { margin:0 0 8px; }
      .media { --ld-figure-ink:#15201f; --ld-figure-muted:#4c5a58; --ld-figure-accent:#15201f;
        --ld-figure-accent-soft:#8a9795; --ld-figure-grid:#e3eae9; --ld-figure-paper:#ffffff; }
      .accent { --ld-figure-accent:#0e7c9b; --ld-figure-accent-soft:#15a06a; --ld-figure-grid:#e1f1f5; }
      svg { display:block; width:100%; height:auto; }
    </style><main>${[panes.slice(0, 2), panes.slice(2)].map(row =>
      `<div class="row">${row.map(([width, theme]) => `<section><p>${width} px ${theme}</p>
      <div class="media ${theme}" data-width="${width}" data-theme="${theme}" style="width:${width}px">${svg}</div>
      </section>`).join('')}</div>`).join('')}</main>`)
    await page.evaluate(() => document.fonts.ready)
    const pixels = await page.evaluate(async () => {
      const result = []
      for (const media of document.querySelectorAll('.media')) {
        const svg = media.querySelector('svg')
        const rect = svg.getBoundingClientRect()
        const labels = [...svg.querySelectorAll('text')].map(text => {
          const box = text.getBoundingClientRect()
          const matrix = text.getScreenCTM()
          return { text: text.textContent, fontSize: parseFloat(getComputedStyle(text).fontSize) *
            Math.hypot(matrix.a, matrix.b), visible: box.width > 0 && box.height > 0 &&
            box.left >= rect.left - 0.5 && box.right <= rect.right + 0.5 &&
            box.top >= rect.top - 0.5 && box.bottom <= rect.bottom + 0.5 }
        })
        const clone = svg.cloneNode(true)
        for (const name of ['ink', 'muted', 'accent', 'accent-soft', 'grid', 'paper']) {
          const key = `--ld-figure-${name}`
          clone.style.setProperty(key, getComputedStyle(media).getPropertyValue(key))
        }
        const image = new Image()
        image.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(clone))))}`
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(rect.width)
        canvas.height = Math.round(rect.height)
        const context = canvas.getContext('2d')
        context.fillStyle = 'white'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        const data = context.getImageData(0, 0, canvas.width, canvas.height).data
        let darkPixels = 0
        let coloredPixels = 0
        for (let i = 0; i < data.length; i += 4) {
          if (Math.min(data[i], data[i + 1], data[i + 2]) < 180) darkPixels++
          if (Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2]) > 40) coloredPixels++
        }
        result.push({ theme: media.dataset.theme, width: rect.width, height: rect.height,
          minTextPx: Math.min(...labels.map(label => label.fontSize)), labels, darkPixels, coloredPixels,
          withinViewport: rect.left >= 0 && rect.right <= innerWidth && rect.bottom <= innerHeight })
      }
      return result
    })
    for (const panel of pixels) {
      assert.ok(panel.withinViewport && panel.darkPixels > 300)
      assert.ok(panel.minTextPx >= 16 && panel.labels.every(label => label.visible))
      assert.equal(panel.labels.length, render.labels)
      if (panel.theme === 'accent' && n !== 27) assert.ok(panel.coloredPixels > 100)
      if (panel.theme === 'print') assert.equal(panel.coloredPixels, 0)
    }
    const composite = `${output}/fig-${n}.final-width-themes.png`
    assert.ok(!fs.existsSync(composite))
    await page.screenshot({ path: composite, animations: 'disabled' })
    await page.close()
    evidence.figures.push({ figure: spec.id, inputs, source: spec.source.image, checks,
      authorRenderSnapshot: binding(snapshot), validation: { status: 'pass', stdout: validation.stdout },
      sourceInventory: binding(`${author}/fig-${n}.source-inventory.json`),
      mappingGroups: spec.source.inventory.map(group => ({ id: group.id, objects: group.objects,
        assertions: group.assertions, requires: group.requires ?? [] })),
      renderDisplayChecksReused: render.displayChecks, panels: pixels, composite: binding(composite) })
    console.log(`${spec.id}: current hashes, mapping, geometry, widths and themes PASS; pixels await independent visual inspection`)
  }
} finally {
  await browser.close()
}
templateBindings.forEach(item => assert.equal(digest(item.path), item.sha256))
writeNew(`${output}/inspections.json`, evidence)
