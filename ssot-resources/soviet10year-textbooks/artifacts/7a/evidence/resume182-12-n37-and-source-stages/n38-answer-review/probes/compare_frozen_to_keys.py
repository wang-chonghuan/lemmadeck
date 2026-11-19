"""Read-only comparison against frozen independent solutions; local reports only."""

import hashlib
import json
import re
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP, getcontext
from pathlib import Path


ROOT = Path('/Users/yong/.codex/worktrees/d9b1/lemmadeck')
assert Path.cwd() == ROOT
BASE = ROOT / '.intentfold/tickets/STEMROBIN-182/tmp/resume182-12'
REVIEW = BASE / 'n38-answer-review'
SOURCE = BASE / 'n38-n39-source-stage/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n38'
SOLUTIONS = REVIEW / 'source-solutions/source-solutions.frozen.json'
RECEIPT = REVIEW / 'source-solutions/freeze-receipt.json'
KEY = SOURCE / 'answer-keys.json'
getcontext().prec = 60


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


receipt = json.loads(RECEIPT.read_text())
assert digest(SOLUTIONS) == receipt['source_solution_sha256']
assert receipt['answer_keys_read'] is False
frozen = json.loads(SOLUTIONS.read_text())
assert frozen['phase'] == 'FROZEN_BEFORE_FIRST_ANSWER_KEY_OPEN'
for name, evidence in frozen['inputs'].items():
    assert digest(SOURCE / name) == evidence['sha256'], f'Source changed: {name}'
assert digest(KEY) == 'e45cfdfeb5279022df3503a55453bf7345765e4229d1cb195ffd09d90ca8ec83'
comparison_started = datetime.now(timezone.utc).isoformat()
assert datetime.fromisoformat(receipt['at_utc']) < datetime.fromisoformat(comparison_started)
key_bytes = KEY.read_bytes()
keys = json.loads(key_bytes)
assert keys['schema'] == 'ld-s10y-answer/lesson-answers@1'
assert keys['book'] == '7a' and keys['lesson'] == frozen['inputs']['lesson.json']['path'].split('/')[-2]
assert keys['edition'] == 'modern-us-neutral'
assert [answer['exercise'] for answer in keys['answers']] == list(frozen['counts'])
assert all(answer['source'] == 'derived' for answer in keys['answers'])
assert all(answer['grading'] == 'ungraded' and answer['parts'] == [] for answer in keys['answers'])
assert all('bookRaw' not in answer for answer in keys['answers'])
answers = {answer['exercise']: answer for answer in keys['answers']}


def number(token):
    token = token.strip()
    match = re.fullmatch(r'([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:\\times10\^(?:\{([+-]?\d+)\}|([+-]?\d+)))?', token)
    assert match, f'Unsupported numeric display token: {token!r}'
    return Decimal(match[1]).scaleb(int(match[2] or match[3] or 0))


def sig(number_value, count):
    return number_value.quantize(Decimal(1).scaleb(number_value.adjusted() - count + 1), rounding=ROUND_HALF_UP)


def labelled_sections(text):
    matches = list(re.finditer(r'(?<![A-Za-z])([a-h])\) ', text))
    result = {}
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        result[match[1]] = text[match.end():end]
    return result


def math_chunks(text):
    return re.findall(r'\$([^$]+)\$', text)


def significant_digit_count(token):
    coefficient = token.split('\\times')[0]
    digits = coefficient.replace('.', '').lstrip('0')
    return len(digits)


display_values = {}
for exercise in ['799', '800']:
    sections = labelled_sections(answers[exercise]['displayAnswer'])
    expected_groups = 'abc' if exercise == '799' else 'ab'
    assert ''.join(sections) == expected_groups
    for group in expected_groups:
        values = math_chunks(sections[group])[0].split(',')
        assert len(values) == sum(t['exercise'] == exercise and t['task'].startswith(group) for t in frozen['tasks'])
        for index, token in enumerate(values, 1):
            display_values[(exercise, f'{group}{index}')] = token

sections = labelled_sections(answers['801']['displayAnswer'])
assert ''.join(sections) == 'abcdefgh'
for label, section in sections.items():
    chunks = math_chunks(section)
    assert len(chunks) == 1
    display_values[('801', label)] = chunks[0]

sections802 = labelled_sections(answers['802']['displayAnswer'])
assert ''.join(sections802) == 'abcd'
for label, section in sections802.items():
    chunks = math_chunks(section)
    last_chunk = chunks[-1]
    assert '\\approx' in last_chunk
    display_values[('802', label)] = last_chunk.split('\\approx')[-1]

sections803 = labelled_sections(answers['803']['displayAnswer'])
for label, section in sections803.items():
    display_values[('803', label)] = math_chunks(section)[-1]

sections804 = labelled_sections(answers['804']['displayAnswer'])
assert ''.join(sections804) == 'abcdef'
for label, section in sections804.items():
    display_values[('804', label)] = math_chunks(section)[0].split('\\approx')[-1]

pair_matches = re.findall(r'\$x=(\d+),y=(\d+)\$', answers['805']['displayAnswer'])
assert len(pair_matches) == 2

comparisons = []
for task in frozen['tasks']:
    exercise = task['exercise']
    label = task['task']
    if exercise == '805':
        pair = pair_matches['ab'.index(label)]
        assert pair == (task['x'], task['y'])
        displayed = {'x': pair[0], 'y': pair[1]}
        expected = displayed
    else:
        displayed = display_values[(exercise, label)]
        expected = task['precision_matched_approximate_square'] if exercise == '804' else task['four_significant_digit_direct_reference']
        assert number(displayed) == Decimal(expected), f'Mismatch {exercise}{label}: {displayed} != {expected}'
        requested_digits = task['input_significant_digits'] if exercise == '804' else 4
        assert significant_digit_count(displayed) == requested_digits, f'Precision mismatch {exercise}{label}'
    table_dependency = exercise in {'799', '800', '801'} and task['needs_correction_column']
    comparisons.append({
        'exercise': exercise, 'task': label, 'displayed_reference': displayed,
        'independent_reference': expected, 'reference_match': True,
        'actual_lookup_verified': False if table_dependency else None,
        'correction_lookup_requirement_unsettled': table_dependency,
    })

additional_checks = []


def check(name, passed, details):
    assert passed, name
    additional_checks.append({'name': name, 'passed': True, 'details': details})


independent = {(t['exercise'], t['task']): t for t in frozen['tasks']}
sections799 = labelled_sections(answers['799']['displayAnswer'])
exact_c = math_chunks(sections799['c'])[1].split(',')
check('799c exact squares', len(exact_c) == 6 and all(number(value) == Decimal(independent[('799', f'c{i}')]['exact_square_of_operand']) for i, value in enumerate(exact_c, 1)), exact_c)
check('799c2 ROUND_HALF_UP', number(display_values[('799', 'c2')]) == Decimal('18.71'), '4.325^2=18.705625 -> 18.71 (direct rounding only)')

for label, section in sections802.items():
    task = independent[('802', label)]
    chunks = math_chunks(section)
    rounded_input = chunks[0].split('\\approx')[-1]
    check('802' + label + ' input rounded before squaring', number(rounded_input) == Decimal(task['square_operand']), {'displayed_rounded_input': rounded_input, 'independent_rounded_input': task['square_operand']})
    if label != 'd':
        operand, exact_then_approx = chunks[1].split('^2=')
        exact_displayed = exact_then_approx.split('\\approx')[0]
        passed = number(operand) == Decimal(task['square_operand']) and number(exact_displayed) == Decimal(task['exact_square_of_operand'])
    else:
        exact_displayed = chunks[1].split('\\approx')[0]
        passed = number(exact_displayed) == Decimal(task['exact_square_of_operand'])
    check('802' + label + ' exact rounded-input square', passed, {'displayed_exact_square': exact_displayed, 'square_first_control_exact': task['exact_square_without_input_rounding'], 'square_first_control_four_sig': task['incorrect_square_first_four_sig_control']})

for label, section in sections803.items():
    task = independent[('803', label)]
    equality = math_chunks(section)[0].split('=')
    component_strings = equality[1].split(task['operator'])
    check('803' + label + ' exact components and expression', len(equality) == 3 and [number(s) for s in component_strings] == [Decimal(s) for s in task['exact_component_squares']] and number(equality[-1]) == Decimal(task['exact_expression']), equality)

check('800 squared scale exponents', [independent[('800', f'a{i}')]['square_scale_exponent'] for i in range(1, 5)] == [0, 2, 6, -2] and [independent[('800', f'b{i}')]['square_scale_exponent'] for i in range(1, 5)] == [0, -2, 4, 8], {'a': [0, 2, 6, -2], 'b': [0, -2, 4, 8]})
check('801 no binary float rounding', all(number(display_values[('801', label)]) == sig(Decimal(independent[('801', label)]['exact_square_of_operand']), 4) for label in 'abcdefgh'), '60-digit Decimal, no float; f displays 548.0 with four significant digits.')
check('804 input precision retained', [significant_digit_count(display_values[('804', label)]) for label in 'abcdef'] == [3, 3, 3, 3, 3, 2], 'All are approximate reference squares of input center values, not exact squares of unknown x.')
check('805 original-system substitution', all(independent[('805', label)]['original_equation_residuals'] == ['0', '0'] for label in 'ab'), {'a': {'x': '11', 'y': '9'}, 'b': {'x': '25', 'y': '16'}})

# This explicitly hypothetical construction demonstrates that rounding is not additive.
# It does NOT infer the original table's correction digits or claim table observations.
hypothetical_rounding = []
for exercise, labels in [('799', ['c2', 'c4', 'c5']), ('801', ['e', 'f'])]:
    for label in labels:
        task = independent[(exercise, label)]
        mantissa = Decimal(task['normalized_operand'])
        base_operand = mantissa.quantize(Decimal('0.01'), rounding='ROUND_DOWN')
        exact_base_square = base_operand ** 2
        base_reference = sig(exact_base_square, 4)
        increment = mantissa ** 2 - exact_base_square
        unit = Decimal(1).scaleb(base_reference.as_tuple().exponent)
        hypothetical_increment = increment.quantize(unit, rounding=ROUND_HALF_UP)
        scale = Decimal(1).scaleb(task['square_scale_exponent'])
        two_stage = (base_reference + hypothetical_increment) * scale
        direct = sig(mantissa ** 2, 4) * scale
        assert two_stage != direct
        hypothetical_rounding.append({
            'exercise': exercise, 'task': label, 'normalized_operand': str(mantissa),
            'exact_base_square': str(exact_base_square), 'rounded_base': str(base_reference),
            'exact_increment': str(increment), 'hypothetical_rounded_increment': str(hypothetical_increment),
            'hypothetical_two_stage_result': str(two_stage), 'direct_reference': str(direct),
            'is_actual_table_observation': False,
            'purpose': 'Non-additivity witness only. Actual row correction and printed last digit remain unknown.',
        })

unsettled = [c['exercise'] + c['task'] for c in comparisons if c['correction_lookup_requirement_unsettled']]
assert len(comparisons) == 49 and len(unsettled) == 18
for name, evidence in frozen['inputs'].items():
    assert digest(SOURCE / name) == evidence['sha256']
assert hashlib.sha256(key_bytes).hexdigest() == digest(KEY)
assert digest(SOLUTIONS) == receipt['source_solution_sha256']

report = {
    'schema': 'independent-n38-answer-review@1', 'verdict': 'BLOCKED',
    'comparison_started_at_utc': comparison_started, 'completed_at_utc': datetime.now(timezone.utc).isoformat(),
    'sole_cwd': str(ROOT), 'image_opens': 0,
    'scope': 'Offline independent Gate 2 answer content review only; parent must finalize after gate. No source/key/tool edits, pipeline/suite reruns, runtime, network, DB, app, git writes, interaction/choice work, chats, or publication.',
    'inputs': {**frozen['inputs'], 'answer-keys.json': {'path': str(KEY), 'sha256': digest(KEY)}},
    'frozen_solution_sha256': digest(SOLUTIONS), 'freeze_receipt_sha256': digest(RECEIPT),
    'freeze_receipt': receipt, 'comparison_probe_sha256': digest(Path(__file__)),
    'identity_coverage': {'exercise_numbers': list(frozen['counts']), 'counts': frozen['counts'], 'primary_tasks': 49, 'answer_scalars_including_both_system_unknowns': 51, 'reference_matches': 49, 'arithmetic_mismatches': 0, 'unsettled_correction_lookup_tasks': 18, 'unsettled_task_ids': unsettled},
    'key_contract': {'status': keys['status'], 'all_derived': True, 'all_ungraded': True, 'all_parts_empty': True, 'bookRaw_absent': True, 'MathLive_or_auto_judging_check': 'Not applicable to these empty ungraded parts; no finalize or runtime check run or claimed.', 'grading_policy_note': 'All-ungraded is the supplied parent contract, so this audit neither invents expected parts nor certifies future auto grading. Deterministic tasks are auto-eligible under ordinary cap2 authoring; that separate policy decision is not a numeric mismatch.'},
    'per_exercise': [
        {'exercise': '799', 'verdict': 'BLOCKED', 'tasks': 19, 'reference_matches': 19, 'finding': 'a/b (13) match exact/base-cell rounded values. c (6) match independent direct rounding and exact squares; c2 is correctly 18.71, not 18.70, as a DIRECT reference. These do not establish actual correction-column answers for the six source lookup tasks.', 'key_lines': [9, 10, 11], 'source_uncertainty': ['799c1', '799c2', '799c3', '799c4', '799c5', '799c6']},
        {'exercise': '800', 'verdict': 'BLOCKED', 'tasks': 8, 'reference_matches': 8, 'finding': 'All references and the squaring of powers-of-ten exponents are correct: a [0,2,6,-2], b [0,-2,4,8]. All eight derive from 5.243/1.315, which require corrections; no actual base/correction lookup result is established.', 'key_lines': [14, 15, 16], 'source_uncertainty': ['800a1', '800a2', '800a3', '800a4', '800b1', '800b2', '800b3', '800b4']},
        {'exercise': '801', 'verdict': 'BLOCKED', 'tasks': 8, 'reference_matches': 8, 'finding': 'All eight Decimal roundings correct, including 0.06452, 0.5127, 548.0 and 9.754e11. a-d are determined base-cell references. e-h need correction columns, so actual lookup last digits remain unverified.', 'key_lines': [19, 20, 21], 'source_uncertainty': ['801e', '801f', '801g', '801h']},
        {'exercise': '802', 'verdict': 'PASS', 'tasks': 4, 'reference_matches': 4, 'finding': 'Inputs rounded first to 3.124, 0.1006, 41.41 and 67750; exact squares 9.759376, 0.01012036, 1714.7881 and 4590062500; four-digit references match. This exercise asks round then square, not explicitly read a table. Exact intermediate answers honestly complete it; no actual lookup values are certified.', 'key_lines': [24, 25, 26], 'source_uncertainty': []},
        {'exercise': '803', 'verdict': 'PASS', 'tasks': 2, 'reference_matches': 2, 'finding': 'Exact 301.9796 and 55.599375, separately rounded to 302.0 and 55.60. Correct components and no exact/approximation conflation.', 'key_lines': [29, 30, 31], 'source_uncertainty': []},
        {'exercise': '804', 'verdict': 'PASS', 'tasks': 6, 'reference_matches': 6, 'finding': '10.6, 0.266, 2.28e3, 6.59e5, 2.32e11 (three significant digits), 2.6e-8 (two). Display and notes correctly describe approximate center-value references, not guaranteed exact squares of unknown x.', 'key_lines': [34, 35, 36], 'source_uncertainty': []},
        {'exercise': '805', 'verdict': 'PASS', 'tasks': 2, 'reference_matches': 2, 'finding': 'a (11,9), b (25,16); denominator-cleared equations correct, and substitution residuals zero for all four original equations.', 'key_lines': [39, 40], 'source_uncertainty': []},
    ],
    'gate_reason': 'Honest derived references settle mathematical reference correctness, not completion of explicitly requested correction-table lookup in 799c, 800 and 801e-h. Notes avoid fabrication but do not supply those method-specific answers. BLOCKED rather than REVISE: no proved arithmetic defect or warranted substitute last digit can be patched with the allowed evidence.',
    'needed_to_unblock': 'Parent needs authoritative relevant base and correction table entries (or explicit human acceptance of a direct-reference-only task/answer scope). Do not replace the unresolved lookup answers with hypothetical two-stage values. No entire-table scan or network access was attempted.',
    'comparisons': comparisons, 'additional_checks': additional_checks,
    'probe_diagnostics': ['First local comparison invocation stopped before report output because its numeric parser did not accept unbraced LaTeX 10^7. Only this review probe was repaired to accept both exponent formats. This is not a key arithmetic failure; no product pipeline/suite was run or rerun.'],
    'hypothetical_rounding_non_additivity_witnesses_not_table_observations': hypothetical_rounding,
    'files_unchanged_at_end': True,
}

out = REVIEW / 'reports'
out.mkdir(parents=True, exist_ok=True)
with (out / 'answer-review-evidence.json').open('x') as stream:
    json.dump(report, stream, indent=2, ensure_ascii=True)
    stream.write('\n')

lines = [
    '# n38 Independent Answer Gate', '', '**BLOCKED**: 49/49 arithmetic references match; 18 correction-lookup tasks remain source-specific uncertainty. No demonstrated arithmetic error. Image opens: **0**.', '',
    'Review is offline and read-only outside this review directory. The independent 49-task solution was frozen and hashed before the first answer-key open. No original answers, figures/images, text-fidelity review, application, network, database, git writes, pipeline/suite runs, interaction/choice authoring, publish, merge, deploy or closure was performed.', '',
    '## Per-Exercise Findings', '',
    '| Exercise | Verdict | Matches | Finding |', '| --- | --- | --- | --- |',
]
for entry in report['per_exercise']:
    lines.append(f"| {entry['exercise']} | {entry['verdict']} | {entry['reference_matches']}/{entry['tasks']} | {entry['finding']} |")
lines += [
    '', 'Counts: 19+8+8+4+2+6+2 = **49 primary tasks**; **51 answer scalars** if x and y are counted separately for the two systems. No missing/duplicate exercise or displayed task; all sources are derived, no bookRaw, all ungraded with parts=[] as supplied.', '',
    '## Why Not PASS', '',
    '799, 800 and 801 explicitly ask for lookup. The provided lesson determines the rounded base cells but describes adding a separately tabulated correction for four-digit mantissas. Correct direct rounding is not guaranteed to reproduce that procedure. The key notes honestly disclose that no actual table was read. That prevents a false provenance claim, but does not finish the six 799c, eight 800, and four 801e-h method-specific answers.', '',
    'Concrete non-additivity witnesses below are HYPOTHETICAL ARITHMETIC, not reconstructed/observed correction-table entries. Even rounding the exact increment separately can differ from direct rounding. The actual table correction is UNKNOWN:', '',
    '| Task | Rounded base | Exact increment | Hypothetical separately rounded increment | Hypothetical two-stage result | Direct reference |',
    '| --- | --- | --- | --- | --- | --- |',
]
for witness in hypothetical_rounding:
    lines.append('| ' + ' | '.join(witness[name] for name in ['exercise']) + witness['task'] + ' | ' + ' | '.join(witness[name] for name in ['rounded_base', 'exact_increment', 'hypothetical_rounded_increment', 'hypothetical_two_stage_result', 'direct_reference']) + ' |')
lines += [
    '', 'In particular, 799c2 directly rounds 18.705625 to **18.71**. The hypothetical 18.70 shown above must NOT be substituted as a purported table correction answer. Likewise, 801f directly rounds 548.0281 to **548.0**, not the hypothetical two-stage 548.1.', '',
    '802 is materially different: it explicitly asks to round the input then square, not to report an observed lookup. Both rounded operands and exact squares are present and correct, so the direct reference honestly completes that task. 803 exact results, 804 precision-matched approximate references and 805 exact systems are complete.', '',
    'All-ungraded/parts=[] is the supplied parent artifact contract, not a claim that these tasks cannot ever be auto-graded. Deterministic tasks are ordinarily auto-eligible in cap2; this review did not create expected values, execute MathLive, finalize, or certify runtime grading.', '',
    '## Unblock Requirement', '',
    'Obtain authoritative relevant base/correction entries for the unresolved tasks, or obtain explicit human acceptance of a direct-reference-only scope. Do not invent correction last digits or relabel calculated values as actual table readings. Parent finalization remains gated; this report performs no finalize or closure.', '',
    '## Hash Evidence', '',
    '| Artifact | SHA-256 |', '| --- | --- |',
]
for name, entry in report['inputs'].items():
    lines.append(f"| {name} | `{entry['sha256']}` |")
lines += [
    f"| Frozen independent source solutions | `{digest(SOLUTIONS)}` |",
    f"| Freeze receipt | `{digest(RECEIPT)}` |",
    f"| Independent solver probe | `{receipt['solver_probe_sha256']}` |",
    f"| Comparison probe | `{digest(Path(__file__))}` |", '',
    f"Freeze time: {receipt['at_utc']}. Comparison began: {comparison_started}. Source/key/frozen hashes were rechecked unchanged at the end.", '',
    'Reproducible comparison command from the sole allowed cwd (run once; output creation is exclusive to preserve existing evidence):', '',
    '```sh', 'python3 -B .intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n38-answer-review/probes/compare_frozen_to_keys.py', '```', '',
    'Machine evidence: reports/answer-review-evidence.json. Frozen independent working: source-solutions/source-solutions.frozen.json and .md. The solver never opens answer-keys.json.', '',
]
with (out / 'answer-review.md').open('x') as stream:
    stream.write('\n'.join(lines))

print(json.dumps({
    'verdict': report['verdict'], 'reference_matches': len(comparisons), 'arithmetic_mismatches': 0,
    'unsettled_lookup_tasks': unsettled, 'image_opens': 0,
    'additional_checks_passed': len(additional_checks),
    'per_exercise': [{key: entry[key] for key in ['exercise', 'verdict', 'tasks']} for entry in report['per_exercise']],
    'hypothetical_rounding_witnesses': hypothetical_rounding,
    'key_sha256': digest(KEY), 'source_solution_sha256': digest(SOLUTIONS),
    'evidence_path': str(out / 'answer-review-evidence.json'), 'report_path': str(out / 'answer-review.md'),
}, indent=2))
