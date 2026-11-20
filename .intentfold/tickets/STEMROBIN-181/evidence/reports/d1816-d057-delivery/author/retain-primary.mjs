import fs from 'node:fs'
import path from 'node:path'
import { A, load, hash, save } from './receipt.mjs'

const selections = [
  ['primary-unsw', [
    ['instantaneous-amplitude-rms', 'Some terminology', 'So for instance,'],
    ['ideal-resistor-ohm-phase', "Resistors and Ohm's law in AC circuits\n", 'The rotating lines'],
    ['resistance-reactance-distinction', 'What are impedance and reactance?\nCircuits', 'Capacitors and charging\nThe voltage'],
    ['frequency-capacitive-effect', 'Another difference between reactance and resistance', 'Thus for a capacitor'],
    ['frequency-inductive-effect', 'Again we note that the reactance is frequency dependent: XL', 'Impedance of components\n'],
    ['stored-energy-exchange', 'You get a big voltage in the circuit', 'Bandwidth and Q factor\n'],
  ]],
  ['primary-power', [
    ['resistor-conversion', 'The power p converted in a resistor', 'We use lower case'],
    ['rms-definition', 'This last set of equations', 'When talking of AC'],
    ['ideal-reactive-average-power', 'Power in inductors and capacitors.', 'Three phase AC\n'],
  ]],
]
const references = selections.map(([name, sections]) => {
  const p = path.join(A, 'receipts', name + '.stdout.txt')
  const raw = fs.readFileSync(p, 'utf8')
  const receipt = load(path.join(A, 'receipts', name + '.json'))
  if (receipt.exitCode !== 0 || !raw.includes('Status: 200')) throw new Error(`Unread source: ${name}`)
  const passages = sections.map(([id, start, end]) => {
    const a = raw.indexOf(start)
    const b = raw.indexOf(end, a + start.length)
    if (a < 0 || b < 0) throw new Error(`Missing actual passage: ${id}`)
    return { id, startByte: Buffer.byteLength(raw.slice(0, a)),
      endByte: Buffer.byteLength(raw.slice(0, b)), text: raw.slice(a, b).trim() }
  })
  return { name, receipt: name + '.json', stdout: { path: p, sha256: hash(p) },
    url: receipt.command[1], httpStatus: 200, method: 'cloak-fetch rendered page read',
    institutionalPublisher: 'School of Physics, University of New South Wales (Physclips)',
    passages }
})
save(path.join(A, 'primary-reading.json'), {
  schema: 'STEMROBIN-181/retained-primary-reading@1',
  role: 'author', references,
  reasoning: [
    { target: 'prose[1]: source causality qualification',
      basis: ['resistance-reactance-distinction', 'resistor-conversion', 'ideal-reactive-average-power', 'stored-energy-exchange'],
      interpretation: 'Resistance dissipates supplied electrical energy. Dissipation is not itself the reason a circuit has no reactive effects. Ideal reactive elements exchange stored energy rather than taking nonzero average power.' },
    { target: 'prose[1]: ideal-ohmic and frequency-dependent approximation',
      basis: ['ideal-resistor-ohm-phase', 'frequency-capacitive-effect', 'frequency-inductive-effect'],
      interpretation: 'Constant R and negligible wire resistance are declared modeling assumptions. Inductive/capacitive effects must be negligible in the chosen model at the studied frequency; a small inductance alone is not a universal frequency-independent guarantee.' },
    { target: 'prose[1], prose[4]: distinguish resistance from effective/RMS values and amplitude',
      basis: ['instantaneous-amplitude-rms', 'rms-definition'],
      interpretation: 'The source amplitude symbols retain their exact equations. Effective/RMS terminology describes voltage/current magnitudes, not a separate resistor type.' },
    { target: 'prose[8], Figure 35',
      basis: ['ideal-resistor-ohm-phase'],
      interpretation: 'The equations require zero relative phase; graph heights have no numerical volts/amperes comparison because the original graph has no labeled numerical scale.' },
  ],
  exclusions: [
    'No domestic mains numbers, wiring advice, experiments, or safety assertions are adapted from the reference.',
    'Not all displayed equations on the webpages appear in rendered text; no missing image equation is claimed as a read passage.',
    'No search-result snippets or fabricated citations serve as primary reading.',
  ],
})
