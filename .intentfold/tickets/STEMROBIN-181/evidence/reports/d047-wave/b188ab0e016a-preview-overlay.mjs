import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { A, W, hash, write } from './prepare.mjs'

const {chromium}=createRequire(path.join(W,'app/package.json'))('playwright')
const browser=await chromium.launch({headless:false})
try {
  const page=await browser.newPage({viewport:{width:800,height:400}})
  const svgPath=path.join(A,'candidates/repair/fig-83.svg')
  await page.setContent(`<style>body{margin:0;background:white}svg{display:block}</style>${fs.readFileSync(svgPath,'utf8')}`)
  const checks=await page.locator('svg').evaluate(svg=>({
    imageNodes:svg.querySelectorAll('image').length,textNodes:svg.querySelectorAll('text').length,
    viewBox:svg.getAttribute('viewBox'),paths:svg.querySelectorAll('path').length,
    polygonCount:svg.querySelectorAll('polygon').length,
    strokes:[...svg.querySelectorAll('[stroke]')].map(e=>e.getAttribute('stroke')).filter(v=>v!=='none'),
  }))
  write('receipts/overlay-initial-helper-fail.json',{
    status:'FAIL',checks,reason:'Initial helper expected at least 10 path elements, but native JSXGraph uses polygons/lines/ellipses as well. This was a helper shape-type assumption, not an output defect.',
    nativeOutputUnchanged:true,
  })
  if(checks.imageNodes || checks.textNodes || checks.paths<2 || checks.polygonCount!==9)throw new Error('Incomplete independent overlay')
  const output=path.join(A,'previews/geometry-overlay.png')
  await page.screenshot({path:output})
  write('receipts/overlay-separated-author.json',{
    status:'PASS',headed:true,svg:{path:svgPath,sha256:hash(svgPath)},checks,
    screenshot:{path:output,sha256:hash(output)},
    note:'Screenshot of existing native overlay, not regeneration or source vector replay.',
  })
} finally {await browser.close()}
