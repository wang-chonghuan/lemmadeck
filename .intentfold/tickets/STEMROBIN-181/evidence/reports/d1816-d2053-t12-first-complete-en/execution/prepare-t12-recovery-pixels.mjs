import assert from 'node:assert/strict';
import { ticket, read, save, bind } from './n42-native.mjs';

const domFile = `${ticket}/tmp/d1816-t12-answer-layout-display/report.json`;
const dom = read(domFile);
assert.equal(dom.browserClosed, true);
assert.equal(dom.status, 'FIRST_EN_EIGHT_SURFACE_DOM_PASS_PIXEL_REVIEW_PENDING');
const common = {
  card: dom.card, status: 'PIXEL_REVIEW_INPUTS_NOT_APPROVAL', dom: bind(domFile),
  maximumImageOpens: 8, parentImageOpens: 0,
  reopensAllowed: false, cropsAllowed: false, databaseWrites: 0, paidCalls: 0,
};
const answerViews = dom.views.filter(view => view.surface === 'answers');
const changedImages = answerViews.flatMap(view => [
  { surface: view.surface, viewport: view.viewport.name, ...view.screenshot },
  ...view.focused.map((image, index) => ({
    surface: view.surface, viewport: view.viewport.name, answerNumber: index + 2, ...image,
  })),
]);
assert.equal(changedImages.length, 8);
save(`${ticket}/tmp/d1816-t12-answer-layout-pixels/inputs.json`, {
  ...common,
  scope: 'Changed answer surface only: desktop/mobile whole answers and existing focused answer 2-4 viewports.',
  images: changedImages,
});
const originalDom = read(`${ticket}/tmp/d1816-d2049-t12-first-en-display/report.json`);
const unchangedImages = originalDom.views.flatMap(view =>
  view.surface === 'answers' ? [{
    surface: view.surface, viewport: view.viewport.name, answerNumber: 1, ...view.focused[0],
  }] : view.surface === 'choices' ? view.focused.map((image, index) => ({
    surface: view.surface, viewport: view.viewport.name, choiceNumber: index === 0 ? 1 : 4, ...image,
  })) : []);
assert.equal(unchangedImages.length, 6);
save(`${ticket}/tmp/d1816-t12-unaffected-focused-pixels/inputs.json`, {
  ...common,
  scope: 'Six previously unreviewed unchanged focused viewports: answer 1 and choices 1/4 on desktop/mobile. Superseded answer 4 captures excluded.',
  images: unchangedImages,
});
console.log(JSON.stringify({ card: dom.card, changedImages: 8, unchangedImages: 6, imagesOpened: 0 }));
