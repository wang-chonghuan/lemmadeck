import assert from 'node:assert/strict';
import { ticket, read, save, bind } from './n42-native.mjs';

const [domFile, stage] = process.argv.slice(2);
const dom = read(domFile);
assert.equal(dom.status, 'BASE_EN_FOUR_SURFACE_DOM_PASS_PIXEL_REVIEW_PENDING');
assert.equal(dom.images.length, 8);
save(`${ticket}/tmp/d1816-${stage}/inputs.json`, {
  card: dom.card, status: 'PIXEL_REVIEW_INPUTS_NOT_APPROVAL',
  images: dom.images, dom: bind(domFile),
  maximumImageOpens: 8, parentImageOpens: 0, reopensAllowed: false, cropsAllowed: false,
  scope: 'Four whole text/worked-example views and four formula/figure viewport captures',
  paidCalls: 0, databaseWrites: 0,
});
console.log(JSON.stringify({ card: dom.card, images: 8, imagesOpened: 0 }));
