import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'
import { chromium } from '/Users/yong/.codex/worktrees/00b1/lemmadeck/app/node_modules/playwright/index.mjs'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const out = path.dirname(new URL(import.meta.url).pathname)
const native = JSON.parse(fs.readFileSync(path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d801-n67-bilingual-native/report.json'), 'utf8'))
const report = { ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n67', checks: [] }
const browser = await chromium.launch({ channel: 'chrome', headless: false })
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  for (const packet of native.outputs) {
    const html = packet.html.find(b => b.path.endsWith('/text.html'))
    await page.goto(pathToFileURL(path.resolve(repo, html.path)).href)
    await page.evaluate(() => document.fonts.ready)
    const formula = page.locator('.para').filter({ hasText: '6.1' })
      .locator('.nb').filter({ has: page.locator('.mfrac') }).first()
    assert.equal(await formula.count(), 1)
    const measure = () => formula.evaluate(n => {
      const rect = n.getBoundingClientRect()
      const s = getComputedStyle(n)
      return {
        html: n.outerHTML, clientWidth: n.clientWidth, clientHeight: n.clientHeight,
        scrollWidth: n.scrollWidth, scrollHeight: n.scrollHeight,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        css: { overflowX: s.overflowX, overflowY: s.overflowY, paddingTop: s.paddingTop, paddingBottom: s.paddingBottom },
        visibleMathBounds: [...n.querySelectorAll('.katex-html .base,.katex-html .vlist-t')]
          .map(b => { const r = b.getBoundingClientRect(); return { top: r.top - rect.top, bottom: r.bottom - rect.top, height: r.height } }),
      }
    })
    const before = await measure()
    assert.equal(before.css.overflowY, 'auto')
    assert.ok(before.scrollHeight > before.clientHeight)
    await page.addStyleTag({ content: '.nb{overflow-y:hidden;padding-block:.15em}' })
    const after = await measure()
    assert.equal(after.css.overflowY, 'hidden')
    assert.ok(after.visibleMathBounds.every(b => b.top >= -0.5 && b.bottom <= after.rect.height + 0.5))
    assert.ok(after.scrollWidth <= after.clientWidth)
    report.checks.push({ locale: packet.locale, before, proposedAfter: after })
  }
  report.status = 'CAUSE-CONFIRMED-PROPOSED-CSS-MATH-BOUNDS-PASS'
} finally {
  await browser.close()
}
fs.writeFileSync(path.join(out, 'diagnosis.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ status: report.status, checks: report.checks.map(c => ({ locale: c.locale, before: [c.before.clientHeight, c.before.scrollHeight], after: [c.proposedAfter.clientHeight, c.proposedAfter.scrollHeight] })) }))
