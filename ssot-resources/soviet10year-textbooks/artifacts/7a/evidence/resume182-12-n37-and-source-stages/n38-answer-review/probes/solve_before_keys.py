"""Independent, offline n38 solutions. This probe never opens answer keys."""

import hashlib
import json
import re
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP, getcontext
from fractions import Fraction
from pathlib import Path


ROOT = Path('/Users/yong/.codex/worktrees/d9b1/lemmadeck')
assert Path.cwd() == ROOT
BASE = ROOT / '.intentfold/tickets/STEMROBIN-182/tmp/resume182-12'
SOURCE = BASE / 'n38-n39-source-stage/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n38'
OUT = BASE / 'n38-answer-review/source-solutions'
getcontext().prec = 60


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def fixed(number):
    return format(number, 'f')


def sig(number, count):
    quantum = Decimal(1).scaleb(number.adjusted() - count + 1)
    return number.quantize(quantum, rounding=ROUND_HALF_UP)


def normalized(number):
    exponent = number.adjusted()
    return number.scaleb(-exponent), exponent


lesson = json.loads((SOURCE / 'lesson.json').read_text())
exercises = json.loads((SOURCE / 'exercises.json').read_text())
assert lesson['id'] == exercises['lesson'] == 'alg7-c4-s2-n38'
assert lesson['figures'] == []
assert exercises['count'] == len(exercises['exercises']) == 7
assert [e['number'] for e in exercises['exercises']] == [str(n) for n in range(799, 806)]
assert all(e['figures'] == e['figure_refs'] == [] for e in exercises['exercises'])

tasks = []


def square_task(exercise, label, literal, input_sig=None):
    original = Decimal(literal)
    operand = sig(original, input_sig) if input_sig else original
    exact = operand * operand
    mantissa, exponent = normalized(operand)
    rounded = sig(exact, 4)
    record = {
        'exercise': str(exercise), 'task': label, 'input': literal,
        'square_operand': fixed(operand), 'exact_square_of_operand': fixed(exact),
        'four_significant_digit_direct_reference': fixed(rounded),
        'normalized_operand': fixed(mantissa), 'input_scale_exponent': exponent,
        'square_scale_exponent': 2 * exponent,
        'actual_table_lookup': None,
        'table_evidence': 'No external table read; direct arithmetic is not a table observation.',
        'needs_correction_column': mantissa != mantissa.quantize(Decimal('0.01')),
    }
    if input_sig:
        record['input_rounding'] = 'ROUND_HALF_UP to four significant digits BEFORE squaring'
        record['exact_square_without_input_rounding'] = fixed(original * original)
        record['incorrect_square_first_four_sig_control'] = fixed(sig(original * original, 4))
    tasks.append(record)
    return record


groups799 = [
    ('a', ['1.3', '4.7', '2.8', '5.7', '8.3', '7.2', '9.6']),
    ('b', ['2.34', '5.12', '8.37', '9.56', '3.04', '6.19']),
    ('c', ['1.243', '4.325', '7.239', '8.127', '6.571', '9.044']),
]
for label, values in groups799:
    for index, value in enumerate(values, 1):
        assert value in exercises['exercises'][0]['text']
        square_task(799, f'{label}{index}', value)

for label, values in [
    ('a', ['5.243', '52.43', '5243', '0.5243']),
    ('b', ['1.315', '0.1315', '131.5', '13150']),
]:
    for index, value in enumerate(values, 1):
        assert value in exercises['exercises'][1]['text']
        square_task(800, f'{label}{index}', value)

for label, value in zip('abcdefgh', ['0.254', '0.716', '934', '61.7', '0.5892', '23.41', '0.06789', '987600']):
    assert value in exercises['exercises'][2]['text']
    square_task(801, label, value)

for label, value in zip('abcd', ['3.1238', '0.10058', '41.405', '67752']):
    assert value in exercises['exercises'][3]['text']
    square_task(802, label, value, input_sig=4)

for label, first, second, sign in [('a', '17.3', '1.64', 1), ('b', '8.14', '3.265', -1)]:
    first_square = Decimal(first) ** 2
    second_square = Decimal(second) ** 2
    exact = first_square + sign * second_square
    direct_square_reference = sig(first_square, 4) + sign * sig(second_square, 4)
    tasks.append({
        'exercise': '803', 'task': label,
        'inputs': [first, second], 'operator': '+' if sign == 1 else '-',
        'exact_component_squares': [fixed(first_square), fixed(second_square)],
        'exact_expression': fixed(exact),
        'four_significant_digit_direct_reference': fixed(sig(exact, 4)),
        'four_sig_component_reference_expression': fixed(direct_square_reference),
        'actual_table_lookup': None,
        'interpretation': 'Exact computation is allowed by the wording; four-digit approximations must be explicitly approximate, not equalities.',
    })

for label, value, count in zip('abcdef', ['3.26', '0.516', '47.8', '812', '4.82e5', '1.6e-4'], [3, 3, 3, 3, 3, 2]):
    approximate = Decimal(value)
    midpoint_square = approximate ** 2
    input_quantum = Decimal(1).scaleb(approximate.adjusted() - count + 1)
    half_unit = input_quantum / 2
    tasks.append({
        'exercise': '804', 'task': label, 'approximate_input': value,
        'input_significant_digits': count,
        'exact_square_of_given_approximation_not_unknown_x': fixed(midpoint_square),
        'precision_matched_approximate_square': fixed(sig(midpoint_square, count)),
        'scientific_approximation': format(sig(midpoint_square, count).normalize(), 'E'),
        'input_half_last_unit': fixed(half_unit),
        'possible_x_square_lower': fixed((approximate - half_unit) ** 2),
        'possible_x_square_upper': fixed((approximate + half_unit) ** 2),
        'interpretation': 'Reported square follows given input precision (3 significant digits for a-e, 2 for f); extra calculator digits are not precision of unknown x.',
    })


def linear_solution(label, a, b, c, d, e, f):
    determinant = a * e - b * d
    assert determinant != 0
    x = Fraction(c * e - b * f, determinant)
    y = Fraction(a * f - c * d, determinant)
    if label == 'a':
        residuals = [(x + y) / 4 - y / 3 - 2, (x + y) / 5 + x - 15]
    else:
        residuals = [(x - y) / 3 + x / 5 - 8, x / 10 - y / 32 - 2]
    assert residuals == [0, 0]
    tasks.append({
        'exercise': '805', 'task': label,
        'integer_equations': [[a, b, c], [d, e, f]],
        'determinant': determinant, 'x': str(x), 'y': str(y),
        'original_equation_residuals': [str(r) for r in residuals],
        'method': 'Independently clear denominators, solve with exact rational determinants, substitute in original equations.',
    })


linear_solution('a', 3, -1, 24, 6, 1, 75)
linear_solution('b', 8, -5, 120, 16, -5, 320)

counts = {str(n): sum(t['exercise'] == str(n) for t in tasks) for n in range(799, 806)}
assert counts == {'799': 19, '800': 8, '801': 8, '802': 4, '803': 2, '804': 6, '805': 2}
assert len(tasks) == 49
assert next(t for t in tasks if t['exercise'] == '799' and t['task'] == 'c2')['four_significant_digit_direct_reference'] == '18.71'
assert next(t for t in tasks if t['exercise'] == '802' and t['task'] == 'c')['square_operand'] == '41.41'
assert next(t for t in tasks if t['exercise'] == '805' and t['task'] == 'a')['x'] == '11'
assert next(t for t in tasks if t['exercise'] == '805' and t['task'] == 'b')['y'] == '16'

frozen = {
    'schema': 'independent-n38-source-solutions@1',
    'phase': 'FROZEN_BEFORE_FIRST_ANSWER_KEY_OPEN',
    'frozen_at_utc': datetime.now(timezone.utc).isoformat(),
    'sole_cwd': str(ROOT),
    'inputs': {name: {'path': str(SOURCE / name), 'sha256': digest(SOURCE / name)} for name in ['lesson.json', 'exercises.json']},
    'source_snapshot_sha256_fields': {name: obj['source']['sha256'] for name, obj in [('lesson.json', lesson), ('exercises.json', exercises)]},
    'counts': counts, 'task_count': len(tasks), 'primary_answer_scalar_count': len(tasks) + 2,
    'book_answers_available': False, 'full_four_digit_table_available': False,
    'answer_keys_opened_before_freeze': False, 'image_opens': 0,
    'method': 'Python standard-library Decimal, precision 60, ROUND_HALF_UP; Fraction for systems. Operands transcribed independently from modern exercise text, checked against it. No floats, no table corrections guessed.',
    'gate_preconditions': {
        '799': 'a/b have direct base-cell rounding determined by lesson; c requires unavailable correction-column readings to certify table-produced last digits.',
        '800': 'All 8 require correction-column readings; exact math and squared scale exponents are independently settled.',
        '801': 'a-d base-cell roundings follow lesson; e-h require unavailable correction-column readings.',
        '802': 'Input-first rounding and exact squares are determinate. No explicit lookup imperative in this exercise; if answer claims lookup values, actual corrections remain unavailable.',
        '803': 'Exact results and independently rounded approximate results are determinate; no table observation asserted.',
        '804': 'Unknown x is approximate; preserve supplied input significant digits, not four calculator digits.',
        '805': 'Both exact solution pairs and original-equation substitutions are determinate.',
    },
    'tasks': tasks,
}

OUT.mkdir(parents=True, exist_ok=True)
output = OUT / 'source-solutions.frozen.json'
with output.open('x') as stream:
    json.dump(frozen, stream, indent=2, ensure_ascii=True)
    stream.write('\n')

lines = ['# Independent n38 Source Solutions', '', 'FROZEN before first answer-key open. No images or external tables opened.', '',
         '| Task | Operand or inputs | Exact reference | Rounded reference (NOT observed table value) |',
         '| --- | --- | --- | --- |']
for task in tasks:
    exercise = task['exercise']
    if exercise in {'799', '800', '801', '802'}:
        operand = task['square_operand']
        if exercise == '802':
            operand = task['input'] + ' -> ' + operand
        exact = task['exact_square_of_operand']
        rounded = task['four_significant_digit_direct_reference']
    elif exercise == '803':
        operand = task['operator'].join(value + '^2' for value in task['inputs'])
        exact = task['exact_expression']
        rounded = task['four_significant_digit_direct_reference']
    elif exercise == '804':
        operand = 'x approximately ' + task['approximate_input']
        exact = task['exact_square_of_given_approximation_not_unknown_x'] + ' (midpoint only)'
        rounded = task['precision_matched_approximate_square'] + ' (' + str(task['input_significant_digits']) + ' significant digits)'
    else:
        operand = 'linear system'
        exact = 'x=' + task['x'] + ', y=' + task['y']
        rounded = 'Exact; original-equation residuals 0, 0'
    lines.append('| ' + exercise + task['task'] + ' | ' + operand + ' | ' + exact + ' | ' + rounded + ' |')
lines += ['', '49 primary tasks; 51 primary answer scalars when both x and y are counted in each system.', '',
          'Correction-column values are UNOBSERVED. Direct four-significant-digit rounding is never relabeled as a table lookup.',
          '802 rounds the INPUT first. 804 squares approximate data and retains 3 significant digits (a-e) / 2 (f).',
          '805a: 3x-y=24, 6x+y=75 -> x=11, y=9.',
          '805b: 8x-5y=120, 16x-5y=320 -> x=25, y=16.', '']
with (OUT / 'source-solutions.frozen.md').open('x') as stream:
    stream.write('\n'.join(lines))

receipt = {
    'event': 'INDEPENDENT_SOLUTIONS_FROZEN_BEFORE_KEYS', 'at_utc': datetime.now(timezone.utc).isoformat(),
    'source_solution_sha256': digest(output),
    'source_solution_markdown_sha256': digest(OUT / 'source-solutions.frozen.md'),
    'solver_probe_sha256': digest(Path(__file__)),
    'input_sha256': {name: frozen['inputs'][name]['sha256'] for name in frozen['inputs']},
    'answer_keys_read': False, 'image_opens': 0,
}
with (OUT / 'freeze-receipt.json').open('x') as stream:
    json.dump(receipt, stream, indent=2)
    stream.write('\n')
print(json.dumps(receipt, indent=2))
print('\n'.join(lines))
