import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { ticket, bind, exists, immutableWrite } from './retain-d016-evidence.mjs';

const original = `${ticket}/tmp/offline-d019-check.mjs`;
const target = `${ticket}/tmp/offline-d020-check.mjs`;
assert.ok(!await exists(target));
const source = await fs.readFile(original, 'utf8');
assert.equal(source.match(/tmp\/offline-d019/g)?.length, 1);
assert.ok(source.includes('text.size >= spec.display.minTextPx'));
assert.ok(source.includes('chromium.launch({ headless: true })'));
assert.ok(source.includes('delete process.env.PWDEBUG'));
await immutableWrite(target, source.replace('tmp/offline-d019', 'tmp/offline-d020'));
await immutableWrite(`${ticket}/tmp/d020-offline-check-preparation.json`,
  `${JSON.stringify({
    ticket: 'STEMROBIN-181', batch: 'D020',
    basis: await bind(original), current: await bind(target),
    delta: 'Evidence directory only. Existing selected-card desktop/mobile conditions, strict16px floor, semantic boundaries and reachable scroll/page ends retained.',
    gateInvocations: 0,
  }, null, 2)}\n`);
console.log(target);
