import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const T = '.intentfold/tickets/STEMROBIN-181';
const file = `${T}/production-meter.json`;
const meter = JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: file,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
assert(meter.currentResume1816.D267.reviewer === null);
Object.assign(meter.currentResume1816.D267, {
  status: 'RAW55_FIRST_INDEPENDENT_FIDELITY_REVIEW_ACTIVE',
  reviewer: '01a1fa71-e91f-7260-97ad-dd2fba86383b', reviewerClosed: false,
});
assert(!meter.currentResume1816.D268);
meter.currentResume1816.D268 = {
  status: 'SOURCE48_51_FIRST_FAITHFUL_AUTHOR_ACTIVE',
  author: '01a1fa73-8892-7fd2-a1f0-f81ff3aa6d85', authorClosed: false,
  root: '.tmp/STEMROBIN-181/d1816-d268/root',
  work: '.tmp/STEMROBIN-181/d1816-d268/source-work',
  preparationReceipt: bind(`${T}/tmp/d1816-recovery/native/d268-source48-51-first-prepare/receipt.json`),
  authorOutput: `${T}/tmp/d1816-d268-source48-51-author`,
  imagesAuthorized: 8, sourcePagesAdded: 0, completeCoursesAdded: 0,
  targetNewCourses: ['phy10-c1-s3-n17', 'phy10-c1-s3-n18'],
  closesMissingFigureDependenciesFor: 'phy10-c1-s3-n19',
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ updated: true, completeDelivered: meter.currentCheckpoint.completeDeliveredCards,
  activeBoundedContexts: 2, permanentWorkersCreated: 0 }));
