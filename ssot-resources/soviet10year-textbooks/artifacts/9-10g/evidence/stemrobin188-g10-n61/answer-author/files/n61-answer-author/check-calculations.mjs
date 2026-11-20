import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const output = path.dirname(fileURLToPath(import.meta.url))
const pi = Math.PI
const close = (a, b) => assert.ok(Math.abs(a - b) <= 1e-10 * Math.max(1, Math.abs(a), Math.abs(b)))
const checks = []

for (const [l, phi] of [[5, pi / 3], [7, pi / 2]]) {
  const r = l * Math.sin(phi / 2)
  const h = l * Math.cos(phi / 2)
  const Q = pi * r * r
  close(r * h, Math.sqrt(Q * (pi * l * l - Q)) / pi)
  checks.push({exercise: '208', l, phi, r, h, Q, axialArea: r * h})
}

for (const [R, alpha, phi] of [[3, pi / 6, pi / 3], [3, pi / 6, pi / 2], [5, pi / 4, pi / 3]]) {
  const H = R * Math.tan(alpha)
  const d = H * Math.cos(phi) / Math.sin(phi)
  const direct = Math.sqrt(R * R - d * d) * Math.hypot(H, d)
  const formula = R * R * Math.tan(alpha) * Math.sqrt(Math.sin(phi) ** 2 - Math.tan(alpha) ** 2 * Math.cos(phi) ** 2) / Math.sin(phi) ** 2
  close(direct, formula)
  checks.push({exercise: '209', R, alpha, phi, H, d, direct, formula})
}

const roofArea = 3 * pi * Math.sqrt(13)
const roofMaterial = roofArea * 1.1
const roofSheetArea = 0.7 * 1.4
const roofQuotient = roofMaterial / roofSheetArea
assert.equal(Math.ceil(roofQuotient), 39)
checks.push({exercise: '210', roofArea, roofMaterial, roofSheetArea, roofQuotient, sheets: Math.ceil(roofQuotient)})

const a = 2
const rho = a * Math.sqrt(3) / 2
const twoCones = pi * rho * a + pi * rho * a * Math.sqrt(3)
close(twoCones, pi * a * a * (3 + Math.sqrt(3)) / 2)
checks.push({exercise: '211.1', a, rho, area: twoCones})
for (const [b, phi] of [[4, pi / 3], [5, 2 * pi / 3]]) {
  const leg = b / (2 * Math.sin(phi / 2))
  const radius = b * Math.cos(phi / 2) / (2 * Math.sin(phi / 2))
  const direct = 2 * pi * radius * leg
  close(direct, pi * b * b * Math.cos(phi / 2) / (2 * Math.sin(phi / 2) ** 2))
  checks.push({exercise: '211.2', b, phi, leg, radius, area: direct})
}

const alpha212 = 287 * pi / 1800
const S212 = 12.56
const Q212 = 15.31
const l212 = Math.sqrt(2 * S212 / Math.sin(alpha212))
const R212 = Math.sqrt(Q212 / pi)
const h212 = Math.sqrt(l212 ** 2 - R212 ** 2)
const lateral212 = pi * R212 * l212
close(lateral212, Math.sqrt(2 * pi * Q212 * S212 / Math.sin(alpha212)))
assert.ok(l212 > R212)
assert.ok(l212 * Math.sin(alpha212 / 2) <= R212)
checks.push({exercise: '212', alphaRadians: alpha212, alphaDegrees: 28.7, S: S212, Q: Q212, l: l212, R: R212, h: h212, halfChord: l212 * Math.sin(alpha212 / 2), lateralArea: lateral212, lowerQBound: pi * S212 * Math.tan(alpha212 / 2), upperQBound: 2 * pi * S212 / Math.sin(alpha212)})

close(Math.hypot(6, 10 - 2), 10)
checks.push({exercise: '213.1', slant: 10, lateralArea: 120 * pi, totalArea: 224 * pi})
for (const h of [2, 5]) {
  const r = h / 2
  const R = 3 * h / 2
  const l = Math.hypot(h, R - r)
  const direct = pi * ((R + r) * l + R * R + r * r)
  close(direct, pi * h * h * (2 * Math.sqrt(2) + 2.5))
  checks.push({exercise: '213.2', h, r, R, l, totalArea: direct})
}

const h214 = 12 * Math.sin(pi / 3)
const R214 = 2 + 12 * Math.cos(pi / 3)
close(h214, 6 * Math.sqrt(3))
close(R214, 8)
close(pi * ((R214 + 2) * 12 + R214 * R214 + 4), 188 * pi)
checks.push({exercise: '214', h: h214, r: 2, R: R214, l: 12, totalArea: 188 * pi})

for (const [part, R, r, h] of [[1, 5, 2, 4], [2, 14, 10, 24]]) {
  const l = Math.hypot(h, R - r)
  const outer = R * l / (R - r)
  const inner = r * l / (R - r)
  const theta = 2 * pi * (R - r) / l
  const outerArc = 2 * pi * R
  const innerArc = 2 * pi * r
  close(outer - inner, l)
  close(outer * theta, outerArc)
  close(inner * theta, innerArc)
  close(theta * (outer * outer - inner * inner) / 2, pi * (R + r) * l)
  const item = {exercise: `215.${part}`, R, r, h, l, outerRadius: outer, innerRadius: inner, thetaRadians: theta, thetaDegrees: theta * 180 / pi, outerArc, innerArc, lateralAreaCm2: pi * (R + r) * l}
  if (part === 2) {
    item.materialCm2 = pi * ((R + r) * l + r * r)
    item.materialM2 = item.materialCm2 / 10000
    close(item.materialM2, pi * (24 * Math.sqrt(37) + 25) / 2500)
  }
  checks.push(item)
}

const report = {status: 'pass', purpose: 'numerical arithmetic only; no generated reasoning', checks}
fs.writeFileSync(path.join(output, 'calculation-results.json'), JSON.stringify(report, null, 2) + '\n', {flag: 'wx'})
console.log(JSON.stringify(report, null, 2))
