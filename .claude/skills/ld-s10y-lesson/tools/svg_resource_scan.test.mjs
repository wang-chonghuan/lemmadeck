import assert from 'node:assert/strict'
import { test } from 'node:test'
import { svgResourceScan } from './svg_resource_scan.mjs'

const font = Buffer.from('known renderer font')
const style = `<style>@font-face{font-family:LDVectorAccents;src:url(data:font/woff2;base64,${font.toString('base64')}) format("woff2");}</style>`
const svg = `<svg xmlns="http://www.w3.org/2000/svg">${style}<text>i</text></svg>`

test('only the byte-identical bundled font is allowed', () => {
  assert.doesNotMatch(svgResourceScan(svg, font), /data:|https?:\/\//)
  assert.match(svgResourceScan(svg, Buffer.from('different')), /data:/)
  assert.match(svgResourceScan(svg, null), /data:/)
})

test('other embedded resources and external URLs remain visible to the gate', () => {
  assert.match(svgResourceScan(svg.replace('</svg>', '<image href="data:image/png;base64,eA=="/></svg>'), font), /data:/)
  assert.match(svgResourceScan(svg.replace('</svg>', '<use href="https://example.org/x"/></svg>'), font), /https:\/\//)
})
