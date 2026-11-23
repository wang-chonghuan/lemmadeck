const assert = require("node:assert/strict")
const test = require("node:test")
const { inline, proseInline } = require("./htmlfrag.js")

test("a printed acceleration unit stays with its separate squared power", () => {
  const html = inline("1.6 米/秒$^2$，试求时间")
  assert.ok(html.includes('<span style="white-space:nowrap">米/秒<span class="sr-nb">'))
  assert.ok(html.endsWith("</span></span>试求时间"))
  assert.ok(html.includes("<annotation encoding=\"application/x-tex\">^2</annotation>"))
})

test("metric length units accept squared and cubic powers", () => {
  for (const [unit, power] of [["cm", "^{2}"], ["毫米", "^3"], ["m/s", "^{ 2 }"]]) {
    const html = inline(`面积为 ${unit}$${power}$`)
    assert.ok(html.includes(`<span style="white-space:nowrap">${unit}<span class="sr-nb">`))
  }
})

test("ordinary words, full formulas and source tags do not acquire a unit wrapper", () => {
  for (const text of ["system$^2$", "变量 $v^2$", "<strong>米/秒</strong>$^2$"]) {
    assert.ok(!inline(text).includes('style="white-space:nowrap"'))
  }
})

test("prose rendering retains its existing wrapping", () => {
  assert.ok(!proseInline("米/秒$^2$").includes('style="white-space:nowrap"'))
})
