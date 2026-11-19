#!/usr/bin/env python3
"""Offline, AST-only verification of the single edition ref-order repair."""
from __future__ import annotations

import ast
import copy
import hashlib
import json
import re
from pathlib import Path

ROOT = Path('/Users/yong/.codex/worktrees/d9b1/lemmadeck')
assert Path.cwd() == ROOT
OUT = Path(__file__).resolve().parent
B = OUT.parent
PRIOR = B / 'numbering-affected-review/numbering-binding-affected-review'
EDITION = ROOT / '.claude/skills/ld-s10y-lesson/tools/edition.py'
TEST = ROOT / '.claude/skills/ld-s10y-lesson/tests/test_exercise_numbering_errata.py'
CANDIDATE = B / 'n37-source-stage-affected/artifacts/7a/lessons/alg7-c4-s2-n37'
BOOK = ROOT / 'ssot-resources/soviet10year-textbooks/artifacts/7a'
reads = {}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def read(path):
    data = path.read_bytes()
    reads[str(path.relative_to(ROOT))] = sha(data)
    return data


def load(path):
    return json.loads(read(path))


prior_md = PRIOR / 'numbering-binding-affected-review.md'
assert sha(read(prior_md)) == '8a08684b21378ac279764077ef641194350167d4335bc88d614e1420bfdaf95b'
prior = load(PRIOR / 'numbering-binding-affected-review.json')
first = load(PRIOR / 'helper-probes-FIRST.json')
manifest = load(PRIOR / 'report-hashes.json')
preserved = {}
for name, expected in manifest['sha256'].items():
    path = PRIOR / name
    assert sha(read(path)) == expected
    preserved[str(path.relative_to(ROOT))] = expected
for name, expected in manifest['preserved_external_snapshots'].items():
    assert sha(read(ROOT / name)) == expected
    preserved[name] = expected
preserved[str((PRIOR / 'report-hashes.json').relative_to(ROOT))] = sha(read(PRIOR / 'report-hashes.json'))

code = read(EDITION).decode('utf-8')
tree = ast.parse(code)
functions = {node.name: node for node in tree.body if isinstance(node, ast.FunctionDef)}
authority = functions['_authoritative_source_targets']
loop = next(node for node in authority.body if isinstance(node, ast.For)
            and ast.unparse(node.iter) == 'enumerate(zip(raw_items, source_items))')
guard = loop.body[0]
assert isinstance(guard, ast.If)
assert ast.unparse(guard.test) == "raw_item.get('pages') and raw_item['pages'] != source_item.get('pages', [])"
assert guard.end_lineno - guard.lineno + 1 == 5
lines = code.splitlines(keepends=True)
without_guard = ''.join(lines[:guard.lineno - 1] + lines[guard.end_lineno:])
old_hash = prior['code_hash_bindings'][str(EDITION.relative_to(ROOT))]['sha256']
assert sha(without_guard.encode('utf-8')) == old_hash

test_code = read(TEST).decode('utf-8')
test_node = next(node for node in ast.walk(ast.parse(test_code))
                 if isinstance(node, ast.FunctionDef)
                 and node.name == 'test_numbering_only_edition_rejects_continuation_first_refs')
test_body = ast.get_source_segment(test_code, test_node)
assert 'list(reversed(refs)), refs + [refs[0]], refs[1:]' in test_body
assert 'del legacy["exercises"][0]["pages"]' in test_body

# Reuse the previously approved candidate structure, not producer reconstruction.
lesson = load(CANDIDATE / 'lesson.json')
exercises = load(CANDIDATE / 'exercises.json')
page231 = load(BOOK / 'pages/0231/page.json')
page232 = load(BOOK / 'pages/0232/page.json')
for path in (CANDIDATE / 'lesson.json', CANDIDATE / 'exercises.json',
             BOOK / 'pages/0231/page.json', BOOK / 'pages/0232/page.json'):
    assert reads[str(path.relative_to(ROOT))] == first['references'][str(path.relative_to(ROOT))]['sha256']
position = next(i for i, item in enumerate(exercises['exercises']) if str(item['number']) == '786')
original = exercises['exercises'][position]
refs = ['p0231#8', 'p0232#1']
record = next(item for item in page231['meta']['exercise_numbering_errata'] if item['block'] == refs[0])
assert original['pages'] == refs and original['numbering_erratum'] == record
assert str(original['source_number']) == '736'
assert page231['blocks'][7]['kind'] == 'ex' and not page231['blocks'][7].get('cont')
assert page232['blocks'][0].get('cont') is True
assert not page231['meta'].get('errata') and not page232['meta'].get('errata')
candidate = copy.deepcopy(lesson)
candidate['exercises'] = copy.deepcopy(exercises['exercises'])
for block in candidate['prose']:
    block['ref'] = block['source_refs'][0]
    block['spans'] = block['source_refs']

namespace = {'Path': Path, 'load': load, 'authoritative_candidates': [candidate]}
prefix = ast.ImportFrom(module='__future__', names=[ast.alias(name='annotations')], level=0)


def compile_nodes(nodes):
    module = ast.Module(body=[copy.deepcopy(prefix), *nodes], type_ignores=[])
    exec(compile(ast.fix_missing_locations(module), str(EDITION), 'exec'), namespace)


compile_nodes([copy.deepcopy(functions[name]) for name in
               ('source_errata', '_source_target_map', '_refs_by_target')])
tail = copy.deepcopy(authority)
start = next(i for i, node in enumerate(tail.body) if isinstance(node, ast.Assign)
             and any(isinstance(target, ast.Name) and target.id == 'identity_fields' for target in node.targets))
tail.body = [ast.parse('candidates = authoritative_candidates').body[0], *tail.body[start:]]
tail.name = 'authority_tail'
compile_nodes([tail])
trace = {}
ref_map = namespace['_refs_by_target']


def authority_call(book, raw_lesson, raw_exercises):
    trace['authority_calls'] += 1
    result = namespace['authority_tail'](book, raw_lesson, raw_exercises)
    trace['authority_returns'] += 1
    trace['reconstructed_refs'] = [ref for ref, targets in result.items()
                                   if f'exercises[{position}]' in targets]
    return result


def refs_call(targets):
    trace['set_comparisons'] += 1
    return ref_map(targets)


namespace['_authoritative_source_targets'] = authority_call
namespace['_refs_by_target'] = refs_call


class PageView:
    def glob(self, pattern):
        assert pattern == 'pages/*/page.json'
        return [BOOK / 'pages/0231/page.json', BOOK / 'pages/0232/page.json']


def probe(name, changed_refs, reject):
    global trace
    trace = {'authority_calls': 0, 'authority_returns': 0, 'set_comparisons': 0}
    changed = copy.deepcopy(exercises)
    item = changed['exercises'][position]
    if changed_refs is None:
        del item['pages']
    else:
        item['pages'] = changed_refs
    assert item['numbering_erratum'] == record
    try:
        result = namespace['source_errata'](PageView(), lesson, changed)
    except SystemExit as error:
        assert reject and '来源引用顺序' in str(error)
        assert trace == {'authority_calls': 1, 'authority_returns': 0, 'set_comparisons': 0}
        outcome = {'rejected': True, 'error': str(error)}
    else:
        assert not reject and result == []
        assert trace['authority_calls'] == 1 and trace['authority_returns'] == 1
        assert trace['reconstructed_refs'] == refs
        outcome = {'rejected': False, 'source_errata': result}
    return {'case': name, 'status': 'PASS', 'declared_refs': changed_refs,
            'numbering_record_unchanged': True, **outcome, **copy.deepcopy(trace)}


checks = [probe('correct', refs, False),
          probe('continuation-first-same-set', list(reversed(refs)), True),
          probe('duplicate-same-set', refs + [refs[0]], True),
          probe('missing-start-only-continuation', refs[1:], True),
          probe('legacy-missing-pages', None, False),
          probe('legacy-empty-pages', [], False)]
assert set(refs) == set(list(reversed(refs))) == set(refs + [refs[0]])

# A single in-memory guard deletion reproduces the prior defect causally.
mutant = copy.deepcopy(tail)
mutant_loop = next(node for node in mutant.body if isinstance(node, ast.For)
                   and ast.unparse(node.iter) == 'enumerate(zip(raw_items, source_items))')
del mutant_loop.body[0]
mutant.name = 'mutant_tail'
compile_nodes([mutant])
fixed_tail = namespace['authority_tail']
namespace['authority_tail'] = namespace['mutant_tail']
counterfactual = probe('guard-removed-reproduces-prior-acceptance', list(reversed(refs)), False)
namespace['authority_tail'] = fixed_tail

receipts = []
for name, count in (('numbering-start-order-tests-affected', 8),
                    ('numbering-start-order-edition-tests-affected', 51)):
    path = B / 'stages' / f'{name}.receipt.json'
    receipt = load(path)
    start_receipt = load(B / 'stages' / f'{name}.start.json')
    assert receipt['cwd'] == str(ROOT) and receipt['exit'] == 0
    assert receipt['signal'] is None and receipt['error'] is None
    assert all(receipt[key] == start_receipt[key] for key in ('cwd', 'command', 'startedAt'))
    streams = []
    for stream in receipt['streams']:
        data = read(ROOT / stream['path'])
        assert sha(data) == stream['sha256']
        streams.append(stream)
        if stream['path'].endswith('.stderr'):
            text = data.decode('utf-8')
            assert re.search(rf'Ran {count} tests in [\d.]+s\s+OK\s*$', text)
            if count == 8:
                assert test_node.name + ' (' in text
    receipts.append({'path': str(path.relative_to(ROOT)), 'sha256': sha(read(path)),
                     'exit': 0, 'tests': count, 'streams': streams, 'rerun': False,
                     'embedded_code_digests': False})

read(Path(__file__))
assert all(sha((ROOT / name).read_bytes()) == expected for name, expected in reads.items())
summary = {
    'schema': 'ld-s10y-numbering-start-order-affected-review@1',
    'ticket': 'STEMROBIN-182', 'date': '2026-11-19', 'finish': 'review',
    'cwd': str(ROOT), 'offline': True, 'status': 'PASS', 'findings': [],
    'inherited': {'P1': 'PASS; not rerun or re-reviewed',
                  'numbering_only_early_return': 'PASS; not re-reviewed',
                  'sources_and_candidate_fidelity': 'PASS; hashes only, no content re-review'},
    'exact_delta': {'five_line_guard': [guard.lineno, guard.end_lineno],
                    'current_edition_sha256': sha(code.encode('utf-8')),
                    'guard_removed_matches_prior_full_edition_sha256': old_hash,
                    'guard_before_authority_return_and_set_comparison': True},
    'test_binding': {'path': str(TEST.relative_to(ROOT)), 'sha256': sha(test_code.encode('utf-8')),
                     'function': test_node.name, 'line': test_node.lineno,
                     'function_sha256': sha(test_body.encode('utf-8'))},
    'actual786': {'candidate': str(CANDIDATE.relative_to(ROOT)), 'number': '786',
                  'source_number': '736', 'authoritative_refs': refs,
                  'record_start': record['block'], 'first_is_ex_noncont': True,
                  'reversed_first_is_continuation': True, 'input_hashes_match_prior': True},
    'checks': checks, 'guard_removed_counterfactual': counterfactual,
    'receipts': receipts,
    'receipt_limit': 'Verified supplied receipts and stream hashes; no embedded code digests. Current hashes are review-time bindings, not proof of suite-time file identity.',
    'execution_limit': 'Exact current edition authority binding tail with inherited approved candidate; source_errata uses actual pages231/232. No producer imports or upstream load/merge/cut/split/figure reconstruction.',
    'preserved_prior_reports_FIRST_and_snapshots': preserved,
    'read_set_sha256': reads,
    'controls': {'image_opens': 0, 'suite_pipeline_reruns': 0, 'source_content_re_reviews': 0,
                 'unchanged_P1_helper_reviews': 0, 'git_writes': 0, 'DB_network_app_deps_publish_interaction': 0,
                 'cap3_E_merge_deploy_closure': 0, 'agents_chats': 0,
                 'writes_only': str(OUT.relative_to(ROOT)), 'reverts': 0},
    'not_authorized': 'No mathematical/content approval, promotion, publication, merge, deploy or closure.'
}
result_path = OUT / 'numbering-start-order-affected-review.json'
with result_path.open('x', encoding='utf-8') as handle:
    handle.write(json.dumps(summary, ensure_ascii=True, indent=2) + '\n')
print(json.dumps({'status': 'PASS', 'checks': len(checks),
                  'edition_sha256': summary['exact_delta']['current_edition_sha256'],
                  'test_sha256': summary['test_binding']['sha256'],
                  'json_sha256': sha(result_path.read_bytes()),
                  'image_opens': 0}, indent=2))
