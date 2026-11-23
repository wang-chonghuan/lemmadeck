import assert from 'node:assert/strict';
import { ticket, bind, read, save } from './n42-native.mjs';

const previousInputs = `${ticket}/tmp/d1816-d1910-ex1-focused-pixels/inputs.json`;
const scrollFile = `${ticket}/tmp/d1816-d1918-ex1-mobile-formula-scroll/report.json`;
const scroll = read(scrollFile);
assert.equal(scroll.status, 'HORIZONTAL_SCROLL_DOM_PASS_AFFECTED_PIXEL_REVIEW_REQUIRED');
assert.equal(scroll.browserClosed, true);
const focused = read(previousInputs).images.filter(image => image.surface === 'choices' || image.question === 1);
assert.equal(focused.length, 6);
const images = [...focused, ...scroll.images];
assert.equal(images.length, 8);
assert.equal(new Set(images.map(image => image.path)).size, 8);
for (const image of images) assert.equal(bind(image.path).sha256, image.sha256);
save(`${ticket}/tmp/d1816-d1919-ex1-focused-scroll-pixels/inputs.json`, {
  card: 'phy9-c1-s1-t10', status: 'PIXEL_REVIEW_INPUTS_NOT_APPROVAL',
  images, maximumImageOpens: 8, parentImageOpens: 0,
  dom: bind(`${ticket}/tmp/d1816-d1907-ex1-section-display/report.json`),
  originalWholeReview: bind(`${ticket}/tmp/d1816-d1909-ex1-whole-pixels/review.json`),
  scrollInteraction: bind(scrollFile),
  scope: 'Six never-opened focused answer/choice captures plus actual mobile answer8 scroll start/end; seven original whole-page passes reused.',
  reopensAllowed: false, cropsAllowed: false, databaseWrites: 0, paidCalls: 0,
});
console.log(JSON.stringify({ card: 'phy9-c1-s1-t10', images: 8, parentImageOpens: 0 }));
