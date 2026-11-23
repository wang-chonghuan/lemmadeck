import { ticket, read, save, bind } from './n42-native.mjs';

const config = process.argv[2] ? read(process.argv[2]) : {};
const domFile = config.domFile ?? `${ticket}/tmp/d1816-d1925-ex9-first-en-display/report.json`;
const dom = read(domFile);
const common = {
  card: dom.card, status: 'PIXEL_REVIEW_INPUTS_NOT_APPROVAL',
  dom: bind(domFile), maximumImageOpens: 8, parentImageOpens: 0,
  reopensAllowed: false, cropsAllowed: false, databaseWrites: 0, paidCalls: 0,
};
save(`${ticket}/tmp/d1816-${config.wholeStage ?? 'd1940-ex9-whole-pixels'}/inputs.json`, {
  ...common, scope: 'Eight whole desktop/mobile surfaces',
  images: dom.views.map(view => ({
    surface: view.surface, viewport: view.viewport.name, ...view.screenshot,
  })),
});
save(`${ticket}/tmp/d1816-${config.focusedStage ?? 'd1941-ex9-focused-pixels'}/inputs.json`, {
  ...common, scope: 'Eight existing focused answer/choice viewport captures',
  images: dom.views.flatMap(view => view.focused.map((image, index) => ({
    surface: view.surface, viewport: view.viewport.name,
    focusedIndex: index + 1, ...image,
  }))),
});
console.log(JSON.stringify({ card: dom.card, wholeImages: 8, focusedImages: 8, imagesOpened: 0 }));
