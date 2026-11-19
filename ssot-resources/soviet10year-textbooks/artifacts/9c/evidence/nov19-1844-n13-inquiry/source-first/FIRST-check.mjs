import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../..");
const expected = JSON.parse(fs.readFileSync(path.join(here, "FIRST-expectations.json"), "utf8"));
const snapshot = JSON.parse(fs.readFileSync(path.join(here, "FIRST-source-scope.json"), "utf8"));
const control = process.argv.find((arg) => arg.startsWith("--negative-control="))?.split("=")[1];
if (control) assert.ok(expected.negative_controls.includes(control), "unknown negative control");
let checks = 0;

function checked(name, callback) {
  callback();
  checks += 1;
  console.log(`PASS ${name}`);
}

function sha(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function gcd(a, b) {
  a = a < 0n ? -a : a;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

function fraction(n, d = 1n) {
  assert.notEqual(d, 0n, "zero denominator");
  if (d < 0n) [n, d] = [-n, -d];
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

function add(x, y) {
  return fraction(x.n * y.d + y.n * x.d, x.d * y.d);
}

function subtract(x, y) {
  return add(x, { n: -y.n, d: y.d });
}

function pow10(k) {
  assert.ok(Number.isInteger(k) && k >= 0);
  return 10n ** BigInt(k);
}

function decimal(integer, prefix, period) {
  assert.match(prefix, /^\d*$/);
  assert.match(period, /^\d+$/);
  const scale = pow10(prefix.length);
  return add(
    add(fraction(BigInt(integer)), fraction(BigInt(prefix || "0"), scale)),
    fraction(BigInt(period), scale * (pow10(period.length) - 1n)),
  );
}

function digitAt(prefix, period, n) {
  assert.ok(n >= 1);
  return n <= prefix.length ? prefix[n - 1] : period[(n - prefix.length - 1) % period.length];
}

function digits(prefix, period, count) {
  return Array.from({ length: count }, (_, i) => digitAt(prefix, period, i + 1)).join("");
}

function divide(numerator, denominator) {
  assert.ok(denominator > 0n, "division denominator must be positive");
  let integer = numerator / denominator;
  if (numerator % denominator < 0n) integer -= 1n;
  let remainder = numerator - integer * denominator;
  const seen = new Map();
  const emitted = [];
  const remainders = [remainder.toString()];
  const rows = [];
  while (!seen.has(remainder.toString())) {
    seen.set(remainder.toString(), emitted.length);
    const previous = remainder;
    const scaled = previous * 10n;
    const digit = scaled / denominator;
    remainder = scaled - denominator * digit;
    assert.ok(digit >= 0n && digit <= 9n);
    assert.ok(remainder >= 0n && remainder < denominator);
    rows.push({
      previous: previous.toString(),
      scaled: scaled.toString(),
      digit: digit.toString(),
      product: (denominator * digit).toString(),
      next: remainder.toString(),
    });
    emitted.push(digit.toString());
    remainders.push(remainder.toString());
    assert.ok(rows.length <= Number(denominator), "repeat must occur within n transitions");
  }
  const start = seen.get(remainder.toString());
  return {
    integer: integer.toString(),
    prefix: emitted.slice(0, start).join(""),
    period: emitted.slice(start).join(""),
    remainders,
    rows,
  };
}

checked("source hashes, exact n13 boundaries and all 21 JSON pointers", () => {
  assert.equal(snapshot.blocks.length, expected.scope_block_count);
  const actualPointers = [];
  const expectedPointers = [];
  for (const source of expected.source_files) {
    const raw = fs.readFileSync(path.join(repo, source.path));
    assert.equal(raw.length, source.bytes);
    assert.equal(sha(raw), source.sha256, `canonical source drift: page${source.page}`);
    const page = JSON.parse(raw);
    for (const index of source.indices) {
      const pointer = `/blocks/${index}`;
      const item = snapshot.blocks.find((b) => b.page === source.page && b.pointer === pointer);
      assert.ok(item, `missing ${source.page} ${pointer}`);
      const block = page.blocks[index];
      const projection = Object.fromEntries(
        ["kind", "label", "cont", "open", "samerow", "lines"].map((key) => [key, block[key]]),
      );
      assert.deepEqual(item.block, projection);
      assert.equal(item.block_sha256, sha(Buffer.from(JSON.stringify(projection))));
      expectedPointers.push(`${source.page}:${pointer}`);
    }
    if (source.page === 55) {
      assert.equal(page.blocks[1].kind, "h3");
      assert.equal(page.blocks[1].lines.join(""), "13. 循环小数");
      assert.equal(page.blocks[0].label, "114");
    }
    if (source.page === 57) {
      assert.equal(page.blocks[5].kind, "h3");
      assert.match(page.blocks[5].lines.join(""), /^14\.\s*实\s*数$/u);
      assert.equal(page.blocks[4].label, "115");
    }
  }
  for (const b of snapshot.blocks) actualPointers.push(`${b.page}:${b.pointer}`);
  assert.deepEqual(actualPointers, expectedPointers);
  assert.equal(expected.source52_used, false);
  assert.equal(snapshot.images_opened, 0);
});

const sourceText = (page, index) => snapshot.blocks.find(
  (b) => b.page === page && b.pointer === `/blocks/${index}`,
).semantic_text;

checked("annotation-wrap stripping preserves both full-k labels and exponent-k", () => {
  const block = snapshot.blocks.find((b) => b.page === 57 && b.pointer === "/blocks/2");
  const rawText = block.block.lines.join("");
  assert.equal(rawText.split("\u21b5").length - 1, expected.source57_wrap_markers);
  assert.ok(!block.semantic_text.includes("\u21b5"));
  const label = String.raw`\underbrace{2399\cdots9}_{k\text{ 位}}`;
  assert.equal(block.semantic_text.split(label).length - 1, 2);
  assert.ok(block.semantic_text.includes(`${label}=10^{-k}`));
  const page55 = snapshot.blocks.find((b) => b.page === 55 && b.pointer === "/blocks/4");
  assert.equal(page55.block.lines.join("").split("\u21b5").length - 1, expected.source55_wrap_markers);
  assert.ok(page55.semantic_text.includes(String.raw`a_{n+1}=a_n=0`));
});

checked("exercise115 source fractions and Cyrillic labels match the independent inputs", () => {
  const text = sourceText(57, 4);
  for (const item of expected.exercise115) {
    const sign = BigInt(item.numerator) < 0n ? "-" : "";
    const abs = (BigInt(item.numerator) < 0n ? -BigInt(item.numerator) : BigInt(item.numerator)).toString();
    assert.ok(text.includes(`${item.source_label}) $${sign}\\frac{${abs}}{${item.denominator}}$`));
  }
});

for (const item of expected.exercise115) {
  checked(`115${item.part}: exact rational, floor-integer sign, decimal digits and N/p`, () => {
    const input = fraction(BigInt(item.numerator), BigInt(item.denominator));
    const result = divide(input.n, input.d);
    assert.equal(result.integer, item.floor_integer);
    assert.equal(result.prefix, item.prefix);
    assert.equal(result.period, item.period);
    assert.equal(digits(result.prefix, result.period, 12), item.first_digits);
    assert.deepEqual(decimal(item.floor_integer, item.prefix, item.period), input);
    assert.equal(item.N, item.prefix.length + 1);
    assert.equal(item.p, item.period.length);
    for (let n = item.N; n <= 500; n += 1) {
      assert.equal(digitAt(item.prefix, item.period, n + item.p), digitAt(item.prefix, item.period, n));
    }
    if (item.whole_minus_integer !== null) {
      const positive = decimal(item.whole_minus_integer, item.whole_minus_prefix, item.whole_minus_period);
      assert.deepEqual(fraction(-positive.n, positive.d), input);
    }
  });
}

checked("integer-only barnegative rejects a whole-minus tail copied under bar1", () => {
  const candidatePeriod = control === "barnegative" ? "428571" : "571428";
  assert.deepEqual(decimal("-1", "", candidatePeriod), fraction(-3n, 7n), "integer-only bar1 tail must be 571428");
  assert.deepEqual(decimal("-1", "", "428571"), fraction(-4n, 7n));
  assert.deepEqual(decimal("-2", "", "63"), fraction(-15n, 11n));
});

for (const item of expected.source_examples) {
  checked(`source example ${item.name}: exact value and specified digit-period definition`, () => {
    assert.deepEqual(decimal(item.integer, item.prefix, item.period), fraction(BigInt(item.numerator), BigInt(item.denominator)));
    for (let n = item.N; n <= 500; n += 1) {
      assert.equal(digitAt(item.prefix, item.period, n + item.p), digitAt(item.prefix, item.period, n));
    }
    assert.equal(item.N, item.prefix.length + 1);
    assert.equal(item.p, item.period.length);
  });
}

checked("bar2.17(83) parity is tail-scoped, not global; opposite whole-sign reading differs", () => {
  for (let n = 3; n <= 500; n += 1) {
    assert.equal(digitAt("17", "83", n), n % 2 === 1 ? "8" : "3");
  }
  assert.equal(digitAt("17", "83", 1), "1");
  assert.equal(digitAt("17", "83", 2), "7");
  assert.deepEqual(decimal("-2", "17", "83"), fraction(-9017n, 4950n));
  const magnitude = decimal("1", "82", "16");
  assert.deepEqual(fraction(-magnitude.n, magnitude.d), fraction(-9017n, 4950n));
  const wrongMagnitude = decimal("2", "17", "83");
  assert.notDeepEqual(fraction(-wrongMagnitude.n, wrongMagnitude.d), fraction(-9017n, 4950n));
});

checked("12/55 numerical chain, products, remainders, second10 and exact 0.2(18)", () => {
  const result = divide(12n, 55n);
  if (control === "division") result.rows[2].next = "11";
  const literal = expected.long_division_12_55;
  assert.equal(result.integer, literal.integer);
  assert.equal(result.prefix, literal.prefix);
  assert.equal(result.period, literal.period);
  assert.deepEqual(result.rows, literal.rows, "450 - 440 must equal 10");
  assert.deepEqual(result.remainders, literal.remainders);
  assert.equal(result.remainders.lastIndexOf("10"), literal.second_10_step);
  assert.deepEqual(decimal("0", "2", "18"), fraction(12n, 55n));
});

checked("full k-digit 2399...9 truncations differ from0.24 by exactly10^-k", () => {
  for (const k of expected.inequality.sample_k) {
    assert.ok(k >= 3);
    const string = "23" + "9".repeat(k - 2);
    assert.equal(string.length, k);
    const truncation = fraction(BigInt(string), pow10(k));
    const difference = subtract(fraction(6n, 25n), truncation);
    const proposedExponent = control === "exponent-k" ? k + 2 : k;
    assert.deepEqual(difference, fraction(1n, pow10(proposedExponent)), `all ${k} digits belong under the k label`);
    assert.ok(difference.n > 0n);
  }
  assert.deepEqual(subtract(fraction(6n, 25n), fraction(23n, 100n)), fraction(1n, 100n));
});

checked("all9 tails are rational but ordinary division returns terminating zero tails", () => {
  for (const period of ["9", "99", "999"]) {
    assert.deepEqual(decimal("0", "23", period), fraction(6n, 25n));
  }
  assert.deepEqual(decimal("0", "", "9"), fraction(1n));
  const result = divide(6n, 25n);
  assert.equal(result.prefix, expected.inequality.division_prefix);
  assert.equal(result.period, expected.inequality.division_period);
  assert.equal(divide(1n, 1n).period, "0");
});

checked("non-all9 geometric values recover the same decimal stream by division", () => {
  for (const integer of ["-3", "0", "2"]) {
    for (const prefix of ["", "0", "23", "125"]) {
      for (const period of ["0", "6", "18", "09", "83", "571428", "36", "63"]) {
        const value = decimal(integer, prefix, period);
        const result = divide(value.n, value.d);
        assert.equal(result.integer, integer);
        assert.equal(digits(result.prefix, result.period, 120), digits(prefix, period, 120));
      }
    }
  }
});

checked("pigeonhole bound includes initial remainder, integers, zero and absorbing zero", () => {
  let cases = 0;
  for (let n = 1; n <= expected.pigeonhole.positive_denominators_through; n += 1) {
    for (let m = 0; m < n; m += 1) {
      const result = divide(BigInt(m), BigInt(n));
      assert.ok(result.rows.length <= n);
      assert.ok(result.remainders.slice(0, -1).includes(result.remainders.at(-1)));
      assert.equal(new Set(result.remainders.slice(0, -1)).size, result.rows.length);
      if (result.remainders.includes("0")) assert.equal(result.period, "0");
      assert.deepEqual(decimal(result.integer, result.prefix, result.period), fraction(BigInt(m), BigInt(n)));
      cases += 1;
    }
  }
  assert.equal(cases, expected.pigeonhole.cases);
  assert.deepEqual(divide(0n, 1n).remainders, ["0", "0"]);
  assert.equal(divide(5n, 1n).integer, "5");
  assert.equal(divide(-5n, 1n).integer, "-5");
  assert.throws(() => divide(1n, 0n), /positive/);
});

console.log(JSON.stringify({ status: "pass", checks, remainder_cases: expected.pigeonhole.cases, images_opened: 0, negative_control: control ?? null }));
