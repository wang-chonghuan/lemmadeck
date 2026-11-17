import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const root = '.intentfold/tickets/STEMROBIN-184/tmp/production-counter-detached-fraction'
const output = `${root}/first-affected-check`
assert(!fs.existsSync(output), 'Preserve first affected check')
fs.mkdirSync(output)
const args = ['.claude/skills/ld-s10y-lesson/tools/test_layout_carrier_rows.py', '-v',
  'CarrierRows.test_bare_fraction_is_one_printed_row',
  'CarrierRows.test_scaled_bare_fraction_is_one_printed_row',
  'CarrierRows.test_bare_fraction_does_not_absorb_following_text_row',
  'CarrierRows.test_offset_rule_between_text_rows_is_not_a_fraction']
const started = new Date().toISOString()
const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args,
  { encoding: 'utf8' })
fs.writeFileSync(`${output}/command.json`, JSON.stringify({
  args, started, finished: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, error: result.error?.message ?? null,
}, null, 2) + '\n')
fs.writeFileSync(`${output}/stdout.txt`, result.stdout ?? '')
fs.writeFileSync(`${output}/stderr.txt`, result.stderr ?? '')
for (const name of ['layout.py', 'test_layout_carrier_rows.py']) {
  fs.copyFileSync(`.claude/skills/ld-s10y-lesson/tools/${name}`, `${output}/${name}`)
}
process.stdout.write(result.stdout ?? '')
process.stderr.write(result.stderr ?? '')
process.exitCode = result.status ?? 1
