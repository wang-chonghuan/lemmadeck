import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { inline, proseInline } = require("./htmlfrag.js");
const opening = '<span style="text-emphasis: filled dot; text-emphasis-position: under;">';
const source = '<span style="text-emphasis: dot; text-emphasis-position: under;">Projection</span>';

test("source dot shorthand renders as a canonical emphasis span", () => {
  assert.equal(inline(source), `${opening}Projection</span>`);
});

test("prose preserves dot emphasis without exposing source markup", () => {
  const html = proseInline(source);
  assert.ok(html.startsWith(opening));
  assert.ok(!html.includes("&lt;span"));
  assert.ok(html.includes('class="sr-prose-math"'));
});

test("adjacent source spans each retain emphasis", () => {
  const html = inline(source + source);
  assert.equal(html.split(opening).length - 1, 2);
  assert.ok(!html.includes("&lt;"));
});

test("formula rendering remains opaque inside emphasis", () => {
  const html = inline(source.replace("Projection", "$a_x$"));
  assert.ok(html.startsWith(opening));
  assert.ok(html.includes('class="katex"'));
  assert.ok(!html.includes("$a_x$"));
});

test("extra style declarations remain escaped", () => {
  const html = inline(source.replace("dot;", "dot; color: red;"));
  assert.ok(html.includes("&lt;span"));
  assert.ok(!html.startsWith("<span"));
});

test("event handlers remain escaped", () => {
  const html = inline(source.replace('style="', 'onclick="alert(1)" style="'));
  assert.ok(html.includes("&lt;span"));
  assert.ok(!html.startsWith("<span"));
});

test("unpaired source span remains escaped", () => {
  const html = inline(source.replace("</span>", ""));
  assert.ok(html.includes("&lt;span"));
});
