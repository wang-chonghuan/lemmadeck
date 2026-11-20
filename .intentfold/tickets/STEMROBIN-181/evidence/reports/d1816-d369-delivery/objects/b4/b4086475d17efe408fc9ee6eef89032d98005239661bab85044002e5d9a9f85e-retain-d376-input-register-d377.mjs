import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d376-remaining-scope-inventory`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const meterFile = `${T}/production-meter.json`;
const inventoryFile = `${O}/inventory.json`;
const inventory = read(inventoryFile);
assert.equal(bind(meterFile).sha256, inventory.deliveredRecordSnapshot.sha256);
const snapshotFile = `${O}/production-meter.snapshot.json`;
fs.copyFileSync(meterFile, snapshotFile, fs.constants.COPYFILE_EXCL);
assert.equal(bind(snapshotFile).sha256, inventory.deliveredRecordSnapshot.sha256);
fs.writeFileSync(`${O}/input-snapshot-receipt.json`, JSON.stringify({
  inventory: bind(inventoryFile), actualFrozenInput: bind(snapshotFile),
  matchesOriginallyRecordedMeterHash: true, originalInventoryUnchanged: true,
}, null, 2) + '\n', { flag: 'wx' });
const meter = read(meterFile);
meter.currentResume1816.D376 = { status: 'REMAINING_SCOPE_INVENTORY_ONLY',
  inventory: bind(inventoryFile), actualInputSnapshot: bind(snapshotFile),
  expectedCards: { '9p': 153, '10p': 171 }, completeDeliveredCards: 142,
  presenceIsNotApproval: true, firstLocalStatusFilterFailurePreserved: true,
  formalHandoff: false, wholeProjectChecks: false, imagesOpened: 0 };
meter.currentResume1816.D377 = { status: 'FIRST_SOURCE401403_AUTHOR_ACTIVE',
  author: '01a1fb1f-2632-70a3-841e-77c3e51ad61e', imagesAuthorized: 8,
  sourcePagesAdded: 0, completeCoursesAdded: 0 };
meter.currentResume1816.D363 = { status: 'FIRST_EIGHT_OFFLINE_SURFACES_AUTOMATIC_PASS',
  result: bind(`${T}/tmp/d1816-d363-n149-n151-display/result.json`),
  receipt: bind(`${T}/tmp/d1816-recovery/native/d363-n149-n151-first-eight-offline-surfaces/receipt.json`),
  headless: true, sourcePagesAdded: 0, completeCoursesAdded: 0 };
meter.currentResume1816.D364 = { status: 'FINAL_DISPLAY_PIXEL_REVIEW_QUEUED_AFTER_D368',
  reviewer: '01a1fb1a-a46e-7631-ac1c-a9bac41653f8', imagesAuthorized: 8,
  sourcePagesAdded: 0, completeCoursesAdded: 0 };
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ inputSnapshot: bind(snapshotFile), registered: ['D376', 'D377', 'D363', 'D364'] }));
