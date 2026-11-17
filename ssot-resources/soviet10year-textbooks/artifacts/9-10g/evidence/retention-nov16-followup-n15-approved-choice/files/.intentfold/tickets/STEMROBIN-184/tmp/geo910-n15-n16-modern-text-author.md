# STEMROBIN-184: n15-n16 Modern TEXT Author

Date: 2026-11-16.
Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
T: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp`.

## Delivery State

The complete modern body and all nine tasks are authored in the current prepared templates. This is a TEXT-author handoff, not a mathematical approval, figure approval, finalized lesson, or publication.

**Production scoped TEXT validator: FAIL.** Seven exercises fail the existing non-formula-number check because their printed numeric subpart labels have been converted to the required Latin labels. The exact errors are retained below. They were not filtered, waived, or converted into PASS. `edition.validate_text_only` does not exist in the current production module, so the existing scoped-helper pattern was used with production source, errata, identity, text, layout and KaTeX functions.

All other checks in that invocation returned no errors: source snapshots and hashes, authoritative errata bindings, identity fields, source texts, task lines, exercise layout, final-paragraph anchors, mathematical-expression preservation subject to the two registered corrections, delimiters, KaTeX, and Chinese punctuation outside math. Both production layout normalizers are now no-ops on the authored templates. These are mechanical observations, not substantive mathematical approval.

Counts: 11 + 17 = 28 original body objects, including every figure/caption object; 5 + 4 = 9 tasks, 159-167; 20 Latin subparts; 22 semantic leaves. New images: 0. Both figure manifests remain byte-identical DRAFTs.

The parent still owns one substantive independent original-to-new-TEXT comparison, the unresolved validator label contract, modern figures, and any later finalize/render/publication.

## Ownership And Access

Only these files were edited:

- `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s2-n15/lesson.template.json`
- `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s2-n15/exercises.template.json`
- `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s2-n16/lesson.template.json`
- `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s2-n16/exercises.template.json`
- `T/geo910-n15-n16-modern-text-author.md`
- `T/geo910-n15-n16-modern-text-author.manifest.json`

All manual edits used `apply_patch`. No adapt-prepare, assemble, page finalize, adapt-finalize, render, source edit, image opening/generation, answer/choice edit, Git operation, backend write, DB/app/dependency edit, or stable-tool edit was performed.

The current new templates were used directly. The parent's once-completed official `adapt-prepare --force` and approved original mathematics were reused, not repeated.

Read the lesson skill and edition-text-contract, project routing/charter instructions, current template source snapshots, production TEXT helper implementations, and the existing scoped-helper implementation `ana10-n79-marker-contract-check.py`. No previous modern output, answer key, choice artifact, mathematical-author answer artifact, or derived-answer precursor was opened.

Access qualification: a heading/constraint keyword locator over the permitted `geo910-n15-n16-math-independent-review.md` also emitted task-comparison row snippets containing conclusions. This exposure is disclosed rather than described as a perfectly constraints-only read. No full solution derivation was opened and no answer content was incorporated. The report's qualifications concerning inclusive domains, schematic-figure assumptions, and literal `C_1D` were used only as authoring constraints. Its earlier uncertainty about physical printing is superseded by the parent's separately confirmed observations and registered errata; this author performed no new source observation or mathematical approval.

## Exact Changes

All object ordering, identity fields, source_refs/pages, source_text, source.data, source.path, source.sha256, task numbers/groups and figure references are retained. Titles and printed titles are unchanged.

| Lesson | Zero-based prose index / source refs | Changes |
|---|---|---|
| n15 | 0 / p0058#4 | language, layout: complete sentence lines; image terminology uses 像 |
| n15 | 1 / p0058#5 | language, layout: original central-symmetry proof retained, without added mathematical assumptions |
| n15 | 2 / p0058#6 | unchanged fig-60 object; text empty |
| n15 | 3 / p0058#7 | unchanged 图 60 caption |
| n15 | 4 / p0058#8 | language, layout: definition1, not a solved exercise |
| n15 | 5 / p0058#9 | language, layout: a/b/c property labels; 恒等变形 becomes 恒等变换 |
| n15 | 6 / p0058#10, p0059#1 | language, layout: whole line/plane image properties retained |
| n15 | 7 / p0059#2 | language, layout: segment/half-plane/half-space/tetrahedron/angle properties retained |
| n15 | 8 / p0059#3 | language, layout: definition2 retained |
| n15 | 9 / p0059#4 | language, layout: congruence notation, punctuation outside math |
| n15 | 10 / p0059#5 | language, layout, math-correction: registered reflexivity replacement only |
| n16 | 0 / p0060#5 | language, layout, context: aircraft/space-station introduction; eight-grade reference retained |
| n16 | 1 / p0060#6, p0061#1 | language, layout: distinct parallel carriers; figure62 a/b references |
| n16 | 2,3 / p0060#7,#8 | unchanged fig-62 and 图 62 caption |
| n16 | 4 / p0061#2 | language, layout: coincident carriers; figure63 a/b/c/d references |
| n16 | 5,6,7,8 / p0061#3,#4,#5,#6 | unchanged fig-63, fig-64 and both captions |
| n16 | 9 / p0061#7 | language, layout: both signs and the original construction, retaining all mathematical expressions |
| n16 | 10 / p0061#8 | language, layout: every spatial origin, exactly one same and one opposite ray |
| n16 | 11 / p0061#9 | language, layout: original central-symmetry statement and proof instruction |
| n16 | 12 / p0062#1 | language, layout: all three same-direction properties and figure65 |
| n16 | 13 / p0062#2 | language, math-correction: registered direction-by-ray replacement only |
| n16 | 14 / p0062#3,#6 | language, layout: a ray determines the whole direction class |
| n16 | 15,16 / p0062#4,#5 | unchanged fig-65 and 图 65 caption |

All nine tasks have language changes. Tasks160-166 additionally have layout changes, including numeric printed subpart labels changed to Latin a/b/... in natural order, each on its own line. Task166's `1°)` subpart marker becomes `a)`; its source snapshot remains literal. Printed task markers `159°.`, `164°.`, `165°.` are retained. `numeric_changes=[]` throughout: no quantity was changed; the strict validator nevertheless counts the removed numeric ordinals.

No task solution is added. Parallel wording does not add disjointness/distinctness restrictions to the inclusive source meanings. Task160 retains only the stated plane/line intersection, parallel-image-line and midpoint conditions, not perpendicularity. Task165 remains a general parallelepiped, not a rectangle or rectangular solid, and retains the actual `$C_1D$`. Task163 retains all seven shape requests without publishing their loci as answers. Task167 asks for all possible relative positions, not just the direction relation or one incidence branch.

## Errata Bindings

Only the following two target objects carry `math-correction`.

| Erratum | Target | Physical / printed page | Block | Original | Corrected |
|---|---|---|---|---|---|
| p0059-reflexivity | lesson.prose[10] in n15 | 59 / 52 | p0059#5 | `反身性（$\Phi\cong\Phi_1$）` | `反身性（$\Phi\cong\Phi$）` |
| p0062-direction-ray | lesson.prose[13] in n16 | 62 / 55 | p0062#2 | `同一条直线` | `同一条射线` |

The page JSON bindings are respectively `4f9a454c2ea249bb224d6246ce84749c8d47c0845e1a0c8d4bb4d4cb01640cb5` and `9952bb2c4447ff1e7452e9342eed6924954cec9fe9b985066bbd3d9e340fea52`.
Both bind PDF SHA-256 `1900be5207d00404f64e5a40ab855fbfb8495bd2a06c5ce295ae0e145444578a`.
Every inherited erratum field except `corrected` is unchanged.

Parent-provided official affected page-finalize evidence was reused. A read-only structured read of current audit.json corroborates p0059 `lines_printed=25`, `lines_md=25`, `errors=[]`; p0062 `lines_printed=24`, `lines_md=24`, `errors=[]`. This author did not rerun finalize or inspect pixels, blocks, or crops. The parent reports all blocks/crops unchanged.

## Complete Modern Body: n15

The following text is the complete authored body, in original object order. Blank lines match the final template.

### prose[0], p0058#4

```text
在所有变换中，有一类变换保持距离不变。
在这样的变换下，任意两点之间的距离都等于它们的像之间的距离。
中心对称就是一种保距变换。

下面证明这一点。
```

### prose[1], p0058#5

```text
设中心对称$Z_0$把空间中任意两点$M$和$N$分别映射成$M_1$和$N_1$（图60）。
点$O$、$M$、$N$、$M_1$、$N_1$都在同一个平面内，用$\alpha$表示这个平面。
在中心对称$Z_0$下，平面$\alpha$映射成自身。

限制在这个平面内的映射，就是平面$\alpha$内关于中心$O$的中心对称。
平面内的中心对称保持距离不变，因此$|M_1N_1|=|MN|$。
```

### prose[2], p0058#6; prose[3], p0058#7

Unchanged figure object: kind=fig, id=fig-60, label=图 60, text="".
Unchanged caption text:

```text
图 60
```

### prose[4], p0058#8

```text
定义1。
空间中保持距离不变的变换叫做位移。
```

### prose[5], p0058#9

```text
由位移的定义，可以得到下列性质：
a) 恒等变换是位移。
b) 位移的逆变换是位移。

c) 两个位移的合成是位移。
```

### prose[6], p0058#10 + p0059#1

```text
位移还有其他性质，后面也会用到。
任何位移都把直线映射成直线，把平面映射成平面。
```

### prose[7], p0059#2

```text
同样可以证明，位移$F$把线段$AB$映射成线段$F(A)F(B)$。
它把以$p$为边界的半平面映射成以$F(p)$为边界的半平面，把以$\alpha$为边界的半空间映射成以$F(\alpha)$为边界的半空间。
它也把四面体$ABCD$映射成四面体$F(A)F(B)F(C)F(D)$，等等。

位移还有一个重要性质：它保持角度不变。
```

### prose[8], p0059#3

```text
定义2。
如果存在一个位移把图形$\Phi$映射成图形$\Phi_1$，就称图形$\Phi_1$为图形$\Phi$的合同图形。
```

### prose[9], p0059#4

```text
图形合同记作：
$\Phi_1\cong\Phi$。
```

### prose[10], p0059#5

```text
由位移的性质a)至c)，可以得到图形合同的三个性质。
图形合同具有反身性（$\Phi\cong\Phi$）。
它具有对称性：如果$\Phi_1\cong\Phi$，那么$\Phi\cong\Phi_1$。

它也具有传递性：如果$\Phi_1\cong\Phi$，且$\Phi_2\cong\Phi_1$，那么$\Phi_2\cong\Phi$。
```

## Complete Modern Body: n16

### prose[0], p0060#5

```text
日常生活中，我们常说飞机的飞行方向或空间站的运动方向。
在八年级课程中，我们已经认识了平面上的方向。
下面说明空间中的方向。
```

### prose[1], p0060#6 + p0061#1

```text
1. 设射线$h_1=[O_1A_1)$和$h_2=[O_2A_2)$在两条不同的平行直线上。
这两条直线在同一个平面$\alpha$内（§3）。
直线$(O_1O_2)$把这个平面分成两个半平面$\alpha_1$和$\alpha_2$。

如果两条射线在同一个半平面内，就称它们同方向（图62，a）。
如果$h_1$和$h_2$在不同的半平面内，就称它们反方向（图62，b）。
```

### prose[2], p0060#7; prose[3], p0060#8

Unchanged figure object: kind=fig, id=fig-62, label=图 62, text="".
Unchanged caption text:

```text
图 62
```

### prose[4], p0061#2

```text
2. 设射线$h_1$和$h_2$在同一条直线上。
如果它们的交集是一条射线，就称它们同方向（图63，a）。
如果$h_1\cap h_2$不是射线，就称它们反方向（图63，b、c、d）。
```

### prose[5], p0061#3; prose[6], p0061#4

Unchanged figure objects: fig-63 and fig-64, each kind=fig, text="", with respective original labels 图 63 and 图 64.

### prose[7], p0061#5; prose[8], p0061#6

Unchanged caption texts, in this order:

```text
图 63
```

```text
图 64
```

### prose[9], p0061#7

```text
射线$h_1$和$h_2$同方向，记作$h_1\uparrow\uparrow h_2$。
射线$h_1$和$h_2$反方向，记作$h_1\uparrow\downarrow h_2$。
给定射线$AB$和点$M$（图64）。

过点$M$作直线$m$，使它平行于$(AB)$（§4，问题），这样的直线只有一条。
在直线$m$上，以$M$为公共始点的两条射线是$m_1$和$m_2$。
其中一条与射线$AB$同方向，就是图64中的$m_1$。

另一条与$[AB)$反方向。
```

### prose[10], p0061#8

```text
因此，以空间中任意一个点为始点，恰有一条射线与已知射线同方向。
也恰有一条射线与已知射线反方向。
```

### prose[11], p0061#9

```text
中心对称把每一条射线映射成与它反方向的射线。
要证明这一点，只需作一个包含这条射线和对称中心的平面，再利用公理9。
```

### prose[12], p0062#1

```text
与平面上的情况一样，空间中射线同方向的关系具有反身性：
$h\uparrow\uparrow h$。
它具有对称性：如果$h_1\uparrow\uparrow h_2$，那么$h_2\uparrow\uparrow h_1$。

它也具有传递性：如果$h_1\uparrow\uparrow h_2$和$h_2\uparrow\uparrow h_3$，那么$h_1\uparrow\uparrow h_3$（图65）。
```

### prose[13], p0062#2

```text
所有与同一条射线方向相同的射线组成的集合，叫做空间中的一个方向。
```

### prose[14], p0062#3 + p0062#6

```text
任意一条射线都完全确定了与它同方向的全体射线组成的集合。
因此，以后用一条射线来给出空间中的一个方向。
```

### prose[15], p0062#4; prose[16], p0062#5

Unchanged figure object: kind=fig, id=fig-65, label=图 65, text="".
Unchanged caption text:

```text
图 65
```

## Complete Modern Tasks

All remain group `习　题`, group_id=`g1`.

### 159, p0059#7

```text
159°. 任意一个把空间映射到自身的保距映射，都是空间变换吗？
```

### 160, p0059#8 + p0059#11

```text
160. 已知平面$\alpha$和与$\alpha$相交的直线$l$。对每个点$M\notin\alpha$，规定它对应的点$M_1$满足：$(MM_1)\parallel l$，且平面$\alpha$平分线段$MM_1$（图61）。平面$\alpha$上的每个点都对应自身。对这样给出的空间到自身的映射，分别判断：
a) 它是空间变换吗？
b) 它是位移吗？
```

Its sole original figure reference/display object remains fig-61, label 图 61. No figure content was edited or opened.

### 161, p0059#12 + p0060#1

```text
161. 分别判断位移是否保持下列平行关系：
a) 两条直线互相平行。
b) 一条直线与一个平面平行。
c) 两个平面互相平行。
```

### 162, p0060#2

```text
162. 证明中心对称具有下列性质：
a) 它把一条直线映射成与这条直线平行的直线。
b) 它把一个平面映射成与这个平面平行的平面。
```

### 163, p0060#3

```text
163. 如果关于点$O$的中心对称把一个图形映射成自身，就称点$O$为这个图形的对称中心。下列各个图形分别有多少个对称中心？
a) 一条线段。
b) 一条直线。
c) 一个平面。
d) 两个平行平面的并集。
e) 两个相交平面的并集。
f) 一条直线与一个同它相交的平面的并集。
g) 一条直线与一个同它平行的平面的并集。
```

### 164, p0062#8

```text
164°. 已知四面体$ABCD$。在射线$AB$、$AC$、$AD$、$CD$中，分别判断：
a) 有没有同方向的射线？
b) 有没有反方向的射线？
```

### 165, p0062#9

```text
165°. 已知平行六面体$ABCDA_1B_1C_1D_1$。在射线$AB$、$AD$、$AA_1$、$BC$、$C_1D$、$BB_1$、$C_1C$、$A_1D_1$中，分别指出：
a) 哪些射线同方向？
b) 哪些射线反方向？
```

### 166, p0062#10

```text
166.
a) 射线反方向的关系具有传递性吗？
b) 证明：如果两条射线都与第三条射线反方向，那么这两条射线同方向。
```

### 167, p0062#11

```text
167. 已知$[AB)\uparrow\uparrow[MN)$，$[CD)\uparrow\downarrow[MN)$。射线$AB$和$CD$有哪些可能的相对位置？
```

## Boundary Evidence

The explicit author CLI invocation was executed once for each edited lesson:

```bash
node .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs .tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s2-n15/lesson.template.json
node .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs .tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s2-n16/lesson.template.json
```

Both exited 0 and emitted real paragraphs and adjacent `{before,after}` suggestions. An additional in-memory production-normalization check exposed that some initial anchors were not stable under `normalize_lesson_layout`; this was a real FAIL, not omitted evidence:

```json
[
  {"lesson":"geo910-c1-s2-n15","normalization_changed_indices":[0,1,4,5,7,8,10],"errors":["lesson.section_breaks 无法由 proseFlow 解析: section_breaks[0] must identify exactly one adjacent paragraph pair; matched 0"],"files_written":0},
  {"lesson":"geo910-c1-s2-n16","normalization_changed_indices":[1,9,12],"errors":["lesson.section_breaks 无法由 proseFlow 解析: section_breaks[0] must identify exactly one adjacent paragraph pair; matched 0"],"files_written":0}
]
```

Normalization's text differences were inspected, then applied manually as layout-only edits. The same production `edition.prose_flow_contract` internally invokes `prose_flow.mjs`; its normalized paragraph output was paired programmatically, selecting semantic starts rather than hand-counting indices. Those actual adjacent objects were copied into the templates. Thus the direct CLI count is one per lesson, but there were additional internal parser invocations for validation and normalized-boundary recovery. This is disclosed explicitly; no claim of exactly one total parser execution is made.

Final section_breaks are in the templates and manifest. The final validator resolves n15 `[4,10]`, n16 `[3,5,9,11]`; both normalization checks are true and all six anchors remain valid.

## Reproduce Final Scoped TEXT Check

Run from the workspace root. This invokes no figure validator, performs no writes, and exits 1 for the unwaived numeric-label errors.

```bash
.claude/skills/ld-s10y-lesson/.venv/bin/python -B - <<'PY'
import copy
import json
import sys
from pathlib import Path
sys.path.insert(0, str(Path('.claude/skills/ld-s10y-lesson/tools').resolve()))
import edition
import mathcheck
book = Path('ssot-resources/soviet10year-textbooks/artifacts/9-10g')
work = Path('.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons')
profile = edition.load(Path('.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'))
forbidden = [*profile.get('forbidden_terms', []), *profile.get('forbidden_person_names', [])]
reports = []
for n in (15, 16):
    lesson_id = f'geo910-c1-s2-n{n}'
    target, raw = work / lesson_id, book / 'lessons' / lesson_id
    lesson, exercises = (edition.load(target / f'{name}.template.json') for name in ('lesson', 'exercises'))
    raw_lesson, raw_exercises = (edition.load(raw / f'{name}.json') for name in ('lesson', 'exercises'))
    errors = []
    assert lesson['schema'] == edition.LESSON_SCHEMA and exercises['schema'] == edition.EXERCISES_SCHEMA
    assert lesson['status'] == exercises['status'] == 'draft'
    assert lesson['edition'] == exercises['edition'] == 'modern-us-neutral'
    assert len(lesson['prose']) == len(raw_lesson['prose'])
    assert exercises['count'] == raw_exercises['count'] == len(exercises['exercises'])
    errors += edition.validate_identity_fields(raw_lesson, lesson, edition.IDENTITY_FIELDS, 'lesson')
    for name, document in (('lesson', lesson), ('exercises', exercises)):
        errors += edition.validate_source(book, document.get('source'), raw / f'{name}.json', name)
    corrections, errata_errors = edition.validate_errata(book, raw_lesson, raw_exercises, lesson, exercises)
    errors += errata_errors
    normalized_lesson, normalized_exercises = copy.deepcopy(lesson), copy.deepcopy(exercises)
    edition.normalize_lesson_layout(normalized_lesson)
    edition.normalize_exercise_layout(normalized_exercises)
    assert normalized_lesson == lesson and normalized_exercises == exercises
    flow, flow_errors = edition.prose_flow_contract(lesson['prose'], lesson['section_breaks'])
    errors += flow_errors
    blocks = []
    for domain, sources, items, fields in (
        ('lesson.prose', raw_lesson['prose'], lesson['prose'], ('kind', 'id', 'label', 'printed_page', 'source_refs')),
        ('exercises', raw_exercises['exercises'], exercises['exercises'], ('number', 'source_number', 'group', 'group_id', 'pages', 'figure_refs', 'figures')),
    ):
        for i, (source, item) in enumerate(zip(sources, items)):
            label = f'{domain}[{i}]'
            assert item['source_text'] == source['text']
            errors += edition.validate_identity_fields(source, item, fields, label)
            errors += edition.validate_text(source['text'], item['text'], item['changes'], item['numeric_changes'], label, forbidden, item['historical_entities'], corrections.get(label))
            if domain == 'exercises':
                assert item['lines'] == item['text'].splitlines()
                errors += [f'{label}: {e}' for e in edition.validate_numbered_subpart_layout(item['text'])]
            blocks.append({'id': label, 'text': item['text']})
    math_errors, warnings = mathcheck.collect_and_check(blocks, lambda b: [('text', b['text'])])
    errors += math_errors
    punctuation = [b['id'] for b in blocks for tex, _ in mathcheck.find_math_spans(b['text']) if edition.MATH_BOUNDARY_PUNCTUATION.search(tex)]
    assert not punctuation
    reports.append({'lesson': lesson_id, 'source_objects': len(lesson['prose']), 'tasks': [e['number'] for e in exercises['exercises']], 'resolved_section_breaks': flow.get('resolvedBreaks'), 'errata_targets': list(corrections), 'normalize_lesson_layout_noop': normalized_lesson == lesson, 'normalize_exercise_layout_noop': normalized_exercises == exercises, 'math_spans': sum(len(mathcheck.find_math_spans(b['text'])) for b in blocks), 'katex_errors': math_errors, 'katex_warnings': warnings, 'cjk_punctuation_in_math': punctuation, 'errors': errors, 'template_sha256': {name: edition.sha256(target / f'{name}.template.json') for name in ('lesson', 'exercises', 'figures')}})
print(json.dumps({'check': 'production helpers; scoped TEXT ONLY; source/errata/identity/text/layout/KaTeX', 'validate_text_only_available': hasattr(edition, 'validate_text_only'), 'reports': reports, 'whole_lesson_ready': False, 'figure_validation': 'NOT RUN'}, ensure_ascii=False, indent=2))
sys.exit(1 if any(r['errors'] for r in reports) else 0)
PY
```

## Final Raw Validator Log

Exit code: **1**.

```json
{
  "check": "production helpers; scoped TEXT ONLY; source/errata/identity/text/layout/KaTeX",
  "validate_text_only_available": false,
  "reports": [
    {
      "lesson": "geo910-c1-s2-n15",
      "source_objects": 11,
      "tasks": ["159", "160", "161", "162", "163"],
      "resolved_section_breaks": [4, 10],
      "errata_targets": ["lesson.prose[10]"],
      "normalize_lesson_layout_noop": true,
      "normalize_exercise_layout_noop": true,
      "math_spans": 47,
      "katex_errors": [],
      "katex_warnings": [],
      "cjk_punctuation_in_math": [],
      "errors": [
        "exercises[1] 的非公式数字变化未被准确声明: want=['160', '61', '1', '2'], got=['160', '61']",
        "exercises[2] 的非公式数字变化未被准确声明: want=['161', '1', '2', '3'], got=['161']",
        "exercises[3] 的非公式数字变化未被准确声明: want=['162', '1', '2'], got=['162']",
        "exercises[4] 的非公式数字变化未被准确声明: want=['163', '1', '2', '3', '4', '5', '6', '7'], got=['163']"
      ],
      "template_sha256": {
        "lesson": "a089ee985c5f397f2d48ca1fe5acc5aaebf5f4346e8089ee71b4d5e79d8bd171",
        "exercises": "2dd0c57aeec4ea0f19f93527d4b971a6862c958f242590a62d7287d61b257ae0",
        "figures": "92d0d235108090a8e0c344d5a3650fb42f38cba480f9569a7b827166e72a92c2"
      }
    },
    {
      "lesson": "geo910-c1-s2-n16",
      "source_objects": 17,
      "tasks": ["164", "165", "166", "167"],
      "resolved_section_breaks": [3, 5, 9, 11],
      "errata_targets": ["lesson.prose[13]"],
      "normalize_lesson_layout_noop": true,
      "normalize_exercise_layout_noop": true,
      "math_spans": 53,
      "katex_errors": [],
      "katex_warnings": [],
      "cjk_punctuation_in_math": [],
      "errors": [
        "exercises[0] 的非公式数字变化未被准确声明: want=['164', '1', '2'], got=['164']",
        "exercises[1] 的非公式数字变化未被准确声明: want=['165', '1', '2'], got=['165']",
        "exercises[2] 的非公式数字变化未被准确声明: want=['166', '1', '2'], got=['166']"
      ],
      "template_sha256": {
        "lesson": "03a194601450544f3bb1a60870b79b16198706b3ccc651e9cf1451f92d5245f7",
        "exercises": "b58cbb1011dbd4576c8e4561700f2a1c6e5977285e9b917701e7687c842abafc",
        "figures": "8b7029831803d72c73f81161c40b82363a495d7479092b45b1b9f0778ff99de7"
      }
    }
  ],
  "whole_lesson_ready": false,
  "figure_validation": "NOT RUN"
}
```

The first scoped invocation had these same seven numeric-label errors but reported `normalize_lesson_layout_noop=false` for both lessons. The separate normalized-anchor FAIL above prompted the layout-only correction. The final invocation supersedes the first for current-template validation; neither FAIL is represented as PASS.

A separate read-only structured Node check derived the actual Latin sequences per task: `0,2,3,2,7,2,2,2,0`, checked each as natural a/b/... order, and produced `source_objects=28`, `tasks=9`, `explicit_subparts=20`, `semantic_leaves=22`. It also confirmed both figure-manifest hashes match their pre-edit bytes and both statuses are `draft`. This is structural accounting only, not comparison of answers or mathematical conclusions.

## Raw Hashes

All hashes are SHA-256 of raw file bytes, not normalized JSON. Before/after template hashes, original snapshots, affected page files, validator inputs and all bindings are listed in the companion manifest.

| File | Before | After |
|---|---|---|
| n15 lesson.template.json | a191ddd635409441966f54a37dffd552e8b6b85b4c28526019b61fb9b3a3980d | a089ee985c5f397f2d48ca1fe5acc5aaebf5f4346e8089ee71b4d5e79d8bd171 |
| n15 exercises.template.json | 05c99ead4b120fe68b9e435df85c404d961d1c99f314398cbd1df0c06d49ab11 | 2dd0c57aeec4ea0f19f93527d4b971a6862c958f242590a62d7287d61b257ae0 |
| n16 lesson.template.json | 1b723174abebf2d6d82f4b4e5a4abf4e7c23351dbb3ae56ff9f1e3f2e5324e08 | 03a194601450544f3bb1a60870b79b16198706b3ccc651e9cf1451f92d5245f7 |
| n16 exercises.template.json | d45a9e3c7540234adfea9af296524565aa2d009c86a4b6c9df6b2c36141929c9 | b58cbb1011dbd4576c8e4561700f2a1c6e5977285e9b917701e7687c842abafc |
| n15 figures.template.json | 92d0d235108090a8e0c344d5a3650fb42f38cba480f9569a7b827166e72a92c2 | identical |
| n16 figures.template.json | 8b7029831803d72c73f81161c40b82363a495d7479092b45b1b9f0778ff99de7 | identical |

No mathematical PASS is issued by this author. The existing original-source mathematical PASS is reused only within the parent's stated scope. Independent modern TEXT comparison remains pending.
