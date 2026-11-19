"""Affected-only table arithmetic review; no roots or exact squares are solved."""

import argparse
import hashlib
import json
import re
import subprocess
from datetime import datetime, timezone
from decimal import Decimal as D, ROUND_FLOOR, ROUND_HALF_UP, getcontext
from pathlib import Path

getcontext().prec = 60
ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
BASE = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13"
OWN = BASE / "table-answer-review"
FIRST = BASE / "table-answer-author/FIRST"
LESSONS = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons"
HASHES = {}


def load(path):
    path = Path(path)
    data = path.read_bytes()
    HASHES[str(path)] = hashlib.sha256(data).hexdigest()
    return json.loads(data)


def write_new(name, value):
    with (OWN / name).open("x") as out:
        json.dump(value, out, ensure_ascii=True, indent=2)
        out.write("\n")


def decimal(value):
    return D(value.replace(",", "."))


def display_decimal(value):
    match = re.fullmatch(r"([0-9]+(?:\.[0-9]+)?)\\times10\^\{?(-?[0-9]+)\}?", value)
    if match:
        return D(match[1]).scaleb(int(match[2]))
    return D(value)


def fixed(value):
    assert value.is_finite()
    return format(value, "f")


def significant(value, digits):
    return value.quantize(D(1).scaleb(value.adjusted() - digits + 1), rounding=ROUND_HALF_UP)


def normalized(value, table):
    exponent = value.adjusted()
    if table == "IV":
        exponent = (exponent // 2) * 2
    argument = value.scaleb(-exponent)
    result_exponent = 2 * exponent if table == "III" else exponent // 2
    assert D(1) <= argument < D(10 if table == "III" else 100)
    return argument, result_exponent


def address(argument, table):
    main_step = D("0.1") if table == "IV" and argument >= 10 else D("0.01")
    row_step = main_step * 10
    row = (argument / row_step).to_integral_value(rounding=ROUND_FLOOR) * row_step
    column = int((argument - row) / main_step)
    excess = (argument - row - column * main_step) / (main_step / 10)
    assert excess == excess.to_integral_value() and 0 <= excess <= 9
    row_printed = (fixed(row.quantize(D("0.1"))).replace(".", ",")
                   if row < 10 else str(int(row)) + ",")
    return row_printed, str(column), str(int(excess)) if excess else None


def source_stage():
    records = []
    for page in range(33, 41):
        path = BASE / f"bradis-cell-review/capture-{page}.json"
        capture = load(path)
        for index, record in enumerate(capture["records_in_request_address_order"]):
            records.append({
                **record, "table": capture["table"], "pdf_page": capture["pdf_image"],
                "printed_page": capture["printed_page"], "path": str(path),
                "pointer": f"/records_in_request_address_order/{index}",
            })

    source_rules = load(BASE / "bradis-tables-source-review/source-rules.corrected.json")
    general_rules = load(BASE / "bradis-method-rules/source-rules.json")
    work = load(BASE / "bradis-tables-source-review/transcriptions.corrected.json")
    affected = load(BASE / "bradis-cell-review/affected-binding-review.json")
    assert affected["status"] == "PASS_AFFECTED_BINDINGS"
    for binding in affected["bindings"].values():
        if isinstance(binding, dict) and "path" in binding and "sha256" in binding:
            path = Path(binding["path"])
            actual = hashlib.sha256(path.read_bytes()).hexdigest()
            HASHES[str(path)] = actual
            assert actual == binding["sha256"], str(path)
    for lesson in ("n38", "n39"):
        for name in ("lesson.json", "exercises.json"):
            load(LESSONS / f"alg7-c4-s2-{lesson}" / name)
    for path in (
        ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n38-answer-review/reports/answer-review.md",
        BASE / "n39-answer-review/stage2-review.md",
    ):
        HASHES[str(path)] = hashlib.sha256(path.read_bytes()).hexdigest()

    calls = []
    outputs = []

    def lookup(raw, table, purpose):
        original = D(raw)
        argument, scale = normalized(original, table)
        row, column, correction = address(argument, table)
        matches = [r for r in records if r["table"] == table and r["row"] == row
                   and r["main"]["column"] == column
                   and (correction is None or any(c["column"] == correction for c in r["corrections"]))]
        assert matches, (purpose, table, raw, row, column, correction)
        mains = {r["main"]["printed"] for r in matches}
        assert len(mains) == 1
        main = decimal(next(iter(mains)))
        unit = D(1).scaleb(main.as_tuple().exponent)
        correction_integer = 0
        if correction:
            corrections = {c["printed"] for r in matches for c in r["corrections"] if c["column"] == correction}
            assert len(corrections) == 1
            correction_integer = int(next(iter(corrections)))
        result = main + correction_integer * unit
        scaled = result.scaleb(scale).quantize(unit.scaleb(scale))
        record = matches[0]
        call = {
            "purpose": purpose, "table": table, "original": raw,
            "normalized_argument": fixed(argument), "result_scale_exponent": scale,
            "pdf_page": record["pdf_page"], "printed_page": record["printed_page"],
            "row": row, "main_column": column,
            "physical_line": "upper" if table == "III" and row == "3,1" and int(column) <= 6 else None,
            "correction_column": correction, "main_printed": record["main"]["printed"],
            "correction_integer": correction_integer, "last_place_unit": fixed(unit),
            "normalized_result": fixed(result), "scaled_result": fixed(scaled),
            "source": {"path": record["path"], "sha256": HASHES[record["path"]],
                       "json_pointer": record["pointer"]},
        }
        calls.append(call)
        return scaled, call

    def single(identity, raw, table="IV", figures=None, quantum=None, preprocess=False):
        original = raw
        if preprocess:
            raw = fixed(significant(D(raw), 4))
        value, call = lookup(raw, table, identity)
        shown = significant(value, figures) if figures else value
        if quantum:
            shown = value.quantize(D(quantum), rounding=ROUND_HALF_UP)
        item = {"id": identity, "original": original, "lookup_input": raw,
                "table_result": fixed(value), "display_result": fixed(shown), "calls": [call]}
        if figures:
            item["final_significant_digits"] = figures
        if quantum:
            item["quantum"] = quantum
        outputs.append(item)

    for i, raw in enumerate(("1.243", "4.325", "7.239", "8.127", "6.571", "9.044"), 1):
        single(f"799.c{i}", raw, "III")
    for group, values in (("a", ("5.243", "52.43", "5243", "0.5243")),
                          ("b", ("1.315", "0.1315", "131.5", "13150"))):
        for i, raw in enumerate(values, 1):
            single(f"800.{group}{i}", raw, "III")
    for label, raw in zip("efgh", ("0.5892", "23.41", "0.06789", "987600")):
        single(f"801.{label}", raw, "III")
    for group, values in (
        ("a", ("4.3", "6.2", "8.9", "10", "50", "75")),
        ("b", ("1.25", "14.7", "20.8", "40.1", "83.2")),
        ("c", ("1.143", "4.835", "60.37", "81.92")),
        ("d", ("1.0058", "6.83251", "20.156")),
    ):
        for i, raw in enumerate(values, 1):
            single(f"806.{group}{i}", raw, preprocess=group == "d")
    for label, raw in zip("abcdefghijkl", ("5.1", "6", "48", "2.07", "31.5", "54.8",
                                          "7.153", "28.04", "66.38", "37.21", "53.49", "87.25")):
        single(f"807.{label}", raw)
    for group, values in (("a", ("6.52", "652", "6520", "0.652")),
                          ("b", ("3.278", "3278", "0.03278", "327800"))):
        for i, raw in enumerate(values, 1):
            single(f"809.{group}{i}", raw)
    for label, raw in zip("abcdefgh", ("345", "290", "1281", "3720", "25740", "0.351", "0.0724", "0.00425")):
        single(f"810.{label}", raw)
    for label, values, sign in (("a", ("376.8", "37.68"), 1), ("b", ("82340", "8234"), -1)):
        components = [lookup(raw, "IV", f"811.{label}.component{i}") for i, raw in enumerate(values)]
        left, right = [c[0] for c in components]
        place = D(1).scaleb(max(left.as_tuple().exponent, right.as_tuple().exponent))
        subtotal = left + sign * right
        outputs.append({"id": f"811.{label}", "components": [fixed(left), fixed(right)],
                        "table_result": fixed(subtotal), "final_place": fixed(place),
                        "guard_place": fixed(place / 10),
                        "display_result": fixed(subtotal.quantize(place, rounding=ROUND_HALF_UP)),
                        "calls": [c[1] for c in components]})
    for label, factors in (("a", ("7", "5")), ("b", ("3.1", "4.5"))):
        single(f"813.{label}", fixed(D(factors[0]) * D(factors[1])), quantum="0.01")
    single("814.sqrt18", "18")
    single("814.sqrt2", "2")
    factors = [lookup(raw, "IV", "814.approximate-product") for raw in ("18", "2")]
    product = factors[0][0] * factors[1][0]
    outputs.append({"id": "814.approximate-product", "components": [fixed(c[0]) for c in factors],
                    "table_result": fixed(product), "display_result": fixed(significant(product, 4)),
                    "calls": [c[1] for c in factors], "final_significant_digits": 4})
    single("815.a", "6.24", figures=3)
    single("815.b", "71", figures=2)
    for label, values, sign in (("a", ("31.4", "27.1"), 1), ("b", ("43.7", "21.6"), -1)):
        squares = [lookup(raw, "III", f"816.{label}.square{i}") for i, raw in enumerate(values)]
        radicand = squares[0][0] + sign * squares[1][0]
        guard_radicand = significant(radicand, 4)
        root, root_call = lookup(fixed(guard_radicand), "IV", f"816.{label}.root")
        outputs.append({"id": f"816.{label}", "square_components": [fixed(c[0]) for c in squares],
                        "unrounded_table_radicand": fixed(radicand),
                        "rounded_lookup_radicand": fixed(guard_radicand),
                        "table_result": fixed(root), "display_result": fixed(significant(root, 3)),
                        "calls": [c[1] for c in squares] + [root_call], "final_significant_digits": 3})
    assert len(outputs) == 75 and len({o["id"] for o in outputs}) == 75

    # Bind only addresses actually used in this affected answer review.
    work_checks = []
    for call in calls:
        matches = [r for r in records if r["path"] == call["source"]["path"]
                   and r["pointer"] == call["source"]["json_pointer"]]
        record = matches[0]
        entry = work[record["key"]][record["index"]]
        assert entry["pdf_image"] == call["pdf_page"]
        assert entry["row_printed"] == call["row"]
        assert entry["main"] == record["main"]
        if call["correction_column"]:
            assert int(entry["corrections"][call["correction_column"]]) == call["correction_integer"]
            if "unit" in entry:
                assert D(entry["unit"]) == D(call["last_place_unit"])
        work_checks.append({"purpose": call["purpose"], "pointer": f"/{record['key']}/{record['index']}",
                            "status": "PASS"})
    receipt = {
        "schema": "table-answer-independent-source-derivation@1",
        "time": datetime.now(timezone.utc).isoformat(), "cwd": str(ROOT),
        "branch": subprocess.check_output(["git", "branch", "--show-current"], cwd=ROOT, text=True).strip(),
        "head": subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip(),
        "inputs": HASHES, "outputs": outputs, "work_binding_checks": work_checks,
        "counts": {"n38": 18, "n39": 57, "lookup_calls": len(calls),
                   "new_images": 0, "full_exact_resolves": 0},
        "independence": "Derived from prompt operands, selected explicit conventions and frozen captures, not author values or author checker. Author route/provenance had already been inspected; this is not a blind pre-provenance claim.",
        "table_rule_ids": [r["id"] for t in source_rules["tables"] for r in t["rules"]],
        "general_rule_ids": [r["id"] for r in general_rules["rules"]],
    }
    write_new("source-derivation.json", receipt)
    print(json.dumps(receipt["counts"], indent=2))


def comparison_stage():
    source = load(OWN / "source-derivation.json")
    expected = {o["id"]: o for o in source["outputs"]}
    failures = []
    checks = []

    def check(identity, kind, condition, detail=None):
        row = {"id": identity, "check": kind, "status": "PASS" if condition else "FAIL"}
        if detail is not None:
            row["detail"] = detail
        checks.append(row)
        if not condition:
            failures.append(row)

    for path, sha in source["inputs"].items():
        actual = hashlib.sha256(Path(path).read_bytes()).hexdigest()
        HASHES[path] = actual
        check(path, "source-hash-unchanged", actual == sha)
    freeze = load(FIRST / "freeze.json")
    for binding in freeze["artifacts"]:
        path = Path(binding["path"])
        actual = hashlib.sha256(path.read_bytes()).hexdigest()
        HASHES[str(path)] = actual
        check(str(path), "FIRST-freeze-hash", actual == binding["sha256"])
    bindings = load(FIRST / "bindings.json")
    for binding in bindings["input_bindings"].values():
        path = Path(binding["path"])
        actual = hashlib.sha256(path.read_bytes()).hexdigest()
        HASHES[str(path)] = actual
        check(str(path), "author-input-current-hash", actual == binding["sha256"])
    provenance = load(FIRST / "provenance.json")
    candidate = {o["id"]: o for o in provenance["outputs"]}
    check("scope", "75-unique-output-IDs", len(candidate) == 75 and set(candidate) == set(expected))
    lookups = {o["lookup_ref"]: o for o in provenance["lookups"]}
    used_refs = set()
    for identity, derived in expected.items():
        item = candidate[identity]
        check(identity, "final-numeric-result", display_decimal(item["display_result"]) == D(derived["display_result"]),
              {"independent": derived["display_result"], "author": item["display_result"]})
        if "." in derived["display_result"]:
            check(identity, "display-precision", display_decimal(item["display_result"]).as_tuple().exponent ==
                  D(derived["display_result"]).as_tuple().exponent)
        refs = item["lookup_refs"]
        check(identity, "lookup-component-count", len(refs) == len(derived["calls"]))
        for ref, call in zip(refs, derived["calls"]):
            used_refs.add(ref)
            entry = lookups[ref]
            check(identity, "normalized-address-and-source-cell",
                  entry["table"] == call["table"]
                  and D(entry["argument"]) == D(call["normalized_argument"])
                  and entry["pdf_page"] == call["pdf_page"]
                  and entry["printed_page"] == call["printed_page"]
                  and entry["row_printed"] == call["row"]
                  and entry["main"]["column"] == call["main_column"]
                  and entry["main"]["printed"] == call["main_printed"]
                  and entry["chosen_correction_column"] == call["correction_column"],
                  {"ref": ref, "source_address": [call["table"], call["pdf_page"], call["row"],
                                                call["main_column"], call["correction_column"]]})
            check(identity, "finite-table-arithmetic", D(entry["result"]) == D(call["normalized_result"]))
            if call["correction_column"]:
                correction = next(c for c in entry["corrections_printed"] if c["column"] == call["correction_column"])
                check(identity, "correction-scaling",
                      D(entry["correction_result_unit"]) == D(call["last_place_unit"])
                      and int(correction["printed"]) == call["correction_integer"])
            if call["physical_line"]:
                check(identity, "III-3,1-upper-physical-line", "upper" in entry["physical_line"])
        if item["kind"] == "table-lookup-and-decimal-rescaling":
            call = derived["calls"][0]
            check(identity, "result-scaling", item["result_scale_exponent"] == call["result_scale_exponent"]
                  and D(item["normalized_result"]) == D(call["normalized_result"])
                  and D(item["table_result"]) == D(derived["table_result"]))
        if identity.startswith("806.d"):
            preprocessing = item["preprocessing"]
            check(identity, "four-figure-preprocessing", preprocessing["original_argument"] == derived["original"]
                  and preprocessing["lookup_argument"] == derived["lookup_input"]
                  and preprocessing["significant_digits"] == 4
                  and not preprocessing["alternative_extended_correction_selected"])
        if identity.startswith("811."):
            subtotal = item.get("table_sum_with_guard", item.get("table_difference_with_guard"))
            check(identity, "table-first-component-precision",
                  item["component_results"] == derived["components"]
                  and D(subtotal) == D(derived["table_result"])
                  and D(item["final_result_place"]) == D(derived["final_place"])
                  and D(item["least_precise_component_place"]) == D(derived["final_place"])
                  and D(item["guard_place"]) == D(derived["guard_place"]))
        if identity.startswith("813."):
            rounding = item["final_rounding"]
            check(identity, "explicit-final-half-up", rounding["quantum"] == "0.01"
                  and rounding["mode"] == "positive-decimal-half-up"
                  and rounding["origin"] == "EXPLICIT_AUTHOR_CONVENTION_NOT_SOURCED_BRADIS_TIE_RULE")
        if identity == "814.approximate-product":
            check(identity, "table-first-finite-product", item["factors"] == derived["components"]
                  and D(item["finite_decimal_product"]) == D(derived["table_result"])
                  and item["final_significant_digits"] == 4
                  and item["exact_radical_product"]["separately_preserved_not_a_new_table_output"])
        if identity.startswith("816."):
            check(identity, "squares-before-root-staging", item["square_table_components"] == derived["square_components"]
                  and D(item["unrounded_table_radicand"]) == D(derived["unrounded_table_radicand"])
                  and D(item["rounded_lookup_radicand"]) == D(derived["rounded_lookup_radicand"])
                  and item["guard_radicand_significant_digits"] == 4
                  and item["final_significant_digits"] == 3
                  and D(item["scaled_root"]) == D(derived["table_result"])
                  and D(item["normalized_lookup_radicand"]) == D(derived["calls"][-1]["normalized_argument"])
                  and item["radicand_scale_exponent"] == 2 * derived["calls"][-1]["result_scale_exponent"])

    for ref in used_refs:
        entry = lookups[ref]
        frozen = entry["frozen_source"]
        capture = load(frozen["path"])
        record = capture
        for token in frozen["json_pointer"].strip("/").split("/"):
            record = record[int(token)] if isinstance(record, list) else record[token]
        check(ref, "author-frozen-pointer-current-hash", HASHES[frozen["path"]] == frozen["sha256"]
              and record["main"] == entry["main"] and record["row"] == entry["row_printed"]
              and record["corrections"] == entry["corrections_printed"])
        transcribed = entry["corrected_transcription"]
        working = load(transcribed["path"])
        record = working
        for token in transcribed["json_pointer"].strip("/").split("/"):
            record = record[int(token)] if isinstance(record, list) else record[token]
        check(ref, "author-corrected-pointer-current-hash", HASHES[transcribed["path"]] == transcribed["sha256"]
              and record["main"] == entry["main"] and record["row_printed"] == entry["row_printed"])

    key_objects = {}
    old_objects = {}
    for lesson, input_key, unchanged in (
        ("n38", "n38_keys", ("802", "803", "804", "805")),
        ("n39", "n39_keys", ("808", "812", "817", "818", "819")),
    ):
        key = load(FIRST / lesson / "answer-keys.json")
        prior = load(bindings["input_bindings"][input_key]["path"])
        keys = {a["exercise"]: a for a in key["answers"]}
        old = {a["exercise"]: a for a in prior["answers"]}
        key_objects.update(keys)
        old_objects.update(old)
        exercises = load(LESSONS / f"alg7-c4-s2-{lesson}" / "exercises.json")
        check(lesson, "exercise-coverage", set(keys) == {e["number"] for e in exercises["exercises"]})
        check(lesson, "draft-derived-ungraded-contract", key["status"] == "draft"
              and all(a["source"] == "derived" and a["grading"] == "ungraded" and a["parts"] == []
                      for a in key["answers"]))
        for identity in unchanged:
            check(identity, "prior-PASS-object-preserved", keys[identity] == old[identity])

    displayed = {}

    def put(identity, value):
        assert identity not in displayed
        displayed[identity] = value

    def vector(identities, text):
        values = text.split(",")
        assert len(identities) == len(values)
        for identity, value in zip(identities, values):
            put(identity, value)

    def maths(text):
        return re.findall(r"\$([^$]+)\$", text)

    def answer_text(exercise):
        return key_objects[str(exercise)]["displayAnswer"]

    vector([f"799.c{i}" for i in range(1, 7)],
           re.search(r"^c\) \$([^$]+)\$", answer_text(799), re.M)[1])
    for group, value in zip("ab", re.findall(r"结果依次为\$([^$]+)\$", answer_text(800))):
        vector([f"800.{group}{i}" for i in range(1, 5)], value)
    for label in "efgh":
        line = re.search(rf"^{label}\) .+$", answer_text(801), re.M)[0]
        put(f"801.{label}", maths(line)[-1].split("=")[-1])
    for group in "abc":
        value = re.search(rf"^{group}\) 依次为\$([^$]+)\$", answer_text(806), re.M)[1]
        count = {"a": 6, "b": 5, "c": 4}[group]
        vector([f"806.{group}{i}" for i in range(1, count + 1)], value)
    vector([f"806.d{i}" for i in range(1, 4)],
           re.search(r"所以本条预处理路线的结果依次为\$([^$]+)\$", answer_text(806))[1])
    for label in "abcdefghijkl":
        put(f"807.{label}", re.search(rf"^{label}\) .+结果\$([^$]+)\$", answer_text(807), re.M)[1])
    for group, value in zip("ab", re.findall(r"题目四项依次为\$([^$]+)\$", answer_text(809))):
        vector([f"809.{group}{i}" for i in range(1, 5)], value)
    for label in "abcdefgh":
        line = re.search(rf"^{label}\) .+$", answer_text(810), re.M)[0]
        put(f"810.{label}", maths(line)[-1].split("=")[-1])
    for label, value in zip("ab", re.findall(r"最后舍入到[^：]+：\$([^$]+)\$", answer_text(811))):
        put(f"811.{label}", value)
    for label in "ab":
        line = re.search(rf"^{label}\) .+$", answer_text(813), re.M)[0]
        put(f"813.{label}", maths(line)[-1].split(r"\approx")[-1])
    put("814.sqrt18", re.search(r"\\sqrt\{18\}\\approx([0-9.]+)", answer_text(814))[1])
    put("814.sqrt2", re.search(r"\\sqrt2\\approx([0-9.]+)", answer_text(814))[1])
    put("814.approximate-product", re.search(r"报告近似积为\$([^$]+)\$", answer_text(814))[1])
    for label in "ab":
        line = re.search(rf"^{label}\) .+$", answer_text(815), re.M)[0]
        put(f"815.{label}", maths(line)[-1].split(r"\approx")[-1])
    for label, value in zip("ab", re.findall(r"最后三位有效数字为\$([^$]+)\$", answer_text(816))):
        put(f"816.{label}", value)
    check("displayAnswer", "75-ordered-displayed-output-IDs", set(displayed) == set(expected))
    for identity, value in displayed.items():
        actual = display_decimal(value)
        wanted = D(expected[identity]["display_result"])
        check(identity, "actual-answer-key-display-value", actual == wanted, {"displayed": value})
        if "." in expected[identity]["display_result"]:
            check(identity, "actual-answer-key-display-precision",
                  actual.as_tuple().exponent == wanted.as_tuple().exponent)
    for group in "ab":
        old_line = re.search(rf"^{group}\).+$", old_objects["799"]["displayAnswer"], re.M)[0]
        new_line = re.search(rf"^{group}\).+$", answer_text(799), re.M)[0]
        check(f"799.{group}", "prior-PASS-display-line-preserved", old_line == new_line)
    for value in ("0.06452", "0.5127", r"8.724\times10^5", "3807"):
        check("801.a-d", "prior-PASS-display-substring-preserved",
              value in old_objects["801"]["displayAnswer"] and value in answer_text(801))
    exact_product = "准确积可以完整求出："
    old_paragraph = next(line for line in old_objects["814"]["displayAnswer"].splitlines()
                         if line.startswith(exact_product))
    check("814.exact-product", "prior-PASS-exact-paragraph-preserved", old_paragraph in answer_text(814))
    report = {
        "schema": "table-answer-independent-comparison@1",
        "time": datetime.now(timezone.utc).isoformat(),
        "status": "PASS_MECHANICAL_COMPARISON" if not failures else "REWORK_REQUIRED",
        "counts": {"affected_outputs": 75, "n38": 18, "n39": 57, "used_lookup_refs": len(used_refs),
                   "displayed_outputs": len(displayed), "checks": len(checks),
                   "failures": len(failures), "images": 0, "full_exact_resolves": 0},
        "checks": checks, "failures": failures, "inputs": HASHES,
        "scope_limit": "Display text and method/source claims require the accompanying human-readable review. No finalization, promotion, runtime grading or pipeline status changed.",
    }
    write_new("comparison.json", report)
    print(json.dumps({"status": report["status"], "counts": report["counts"], "failures": failures}, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("stage", choices=("source", "compare"))
    args = parser.parse_args()
    assert Path.cwd() == ROOT
    (source_stage if args.stage == "source" else comparison_stage)()
