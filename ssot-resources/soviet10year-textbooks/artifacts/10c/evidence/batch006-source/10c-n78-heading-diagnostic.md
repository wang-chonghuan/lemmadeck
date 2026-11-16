# 10c N78 Heading Parser Diagnostic

## Scope

Read-only diagnosis of the production heading parser. This report is the only file authored. No tool/source/index/template edits; no assemble/finalize, parser execution, tests, network, database or Git operations. N77 templates remain untouched. The parent owns implementation and one focused verification afterward.

No existing tests were read as a design reference. No answer/choice contents, reviewer records, parent freeze or figure specifications were read.

## Observed Source And Artifact

Read and observed:

- Original physical page 16 PNG: `.tmp/ld-s10y-lesson/10c/pages/0016/page.png`. The printed n78 heading has a raised star followed by spacing, with no printed full stop or enumeration comma.
- Durable source `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0016/page.md:81`:

```text
78$^{*}$　弦长与弦所对的弧长的比的极限
```

The separator after the star is U+3000 IDEOGRAPHIC SPACE. The source heading is an explicitly typed `h3`, physical page 16 / printed page 10.

The task message reverses 弦长/弧长 relative to the actual file. The original PNG, durable source and current zh TOC agree on **弦长与弦所对的弧长的比的极限**. This report uses those observed authoritative bytes, without changing the source.

Current TOC topic:

```json
{
  "id": "ana10-c6-s1-n78",
  "printedNumber": 78,
  "title": "弦长与弦所对的弧长的比的极限",
  "page": 10
}
```

Read only the identity fields of the current partial source lesson:

```json
{
  "id": "x4-78-弦长与弦所对的弧长的比的极限",
  "card_id": null,
  "number": null,
  "title": "78$^{*}$　弦长与弦所对的弧长的比的极限",
  "printed_title": "78$^{*}$　弦长与弦所对的弧长的比的极限",
  "start_page": 16,
  "start_printed": 10,
  "exercise_count": 0
}
```

Its zero exercise count describes this existing partial artifact, not completeness of n78.

## Root Cause And Propagation

Production file: `.claude/skills/ld-s10y-lesson/tools/assemble.py`.

Current SEC_NUM at lines 30–33:

```python
SEC_NUM = re.compile(
    r"^\s*(?:§\s*)?(?=\$?(\d+))(?:\d+(?:\$\^\{\*\}\$)?|\$\d+\^\{\+\}\$)"
    r"\s*(?:\$\\blacktriangledown\$\s*)?[.．、]\s*(.+)$"
)
```

The numbered-prefix alternatives already accept `78$^{*}$`; the failure is the mandatory `[.．、]` following that prefix. U+3000 spacing is consumed by `\s*` but cannot satisfy that punctuation class. This diagnosis follows the regex and observed artifact; no parser run was made in this task.

Propagation in existing production code:

1. `cut_lessons`, lines 98–105, calls SEC_NUM only for an `h3`. The failed match leaves `number=None`, retains the whole heading as `title`, and keeps `printed_title` unchanged.
2. `_card_printed_number`, lines 622–629, obtains 78 directly from the TOC topic's `printedNumber`.
3. `check_toc`, lines 663–685, sends a lesson without a parsed number to the unnumbered-card branch. N78 is a numbered card, so it cannot be claimed through that branch.
4. The fallback identity expression at line 768 produces `x4-` plus the slug of the unparsed full heading, explaining the observed artifact.

No TOC mismatch, source punctuation defect or source-heading rewrite is needed to explain the failure.

## Minimal Generic Patch Recommendation

Change only the second SEC_NUM string, retaining the existing numeric prefix, supported superscripts, optional § and optional black-down-triangle marker:

```diff
-    r"\s*(?:\$\\blacktriangledown\$\s*)?[.．、]\s*(.+)$"
+    r"\s*(?:\$\\blacktriangledown\$\s*)?(?:[.．、]\s*|\s+)(\S.*)$"
```

Rationale:

- The separator must be either an existing supported punctuation mark or **one or more actual whitespace characters**. Python's existing Unicode `\s` covers ASCII spaces and the observed U+3000, without a book-specific exception.
- Do not make punctuation simply optional: `[.．、]?` would also admit glued strings such as `78标题` and permit digit backtracking to manufacture a title.
- Require the title to begin with a non-whitespace character, `(\S.*)`. This prevents the new whitespace-only branch from accepting a number plus blank spacing as a nonempty title. It also rejects an empty punctuation-form heading that the current greedy spaces/`(.+)` can mistakenly accept; no valid nonempty supported heading is lost.
- All added groups are noncapturing. Consumers still obtain number from group 1 and title from group 2.
- Preserve `printed_title` as the exact original heading. Parsing separates identity from faithful printed representation; it does not insert punctuation into either source layer.
- Keep the existing `h3` type gate, and keep TOC matching's number/page and explicit printedName consistency checks. Do not expand SEC_NUM usage to paragraphs, exercise bodies or arbitrary source lines.
- No title-specific fallback, hard-coded 78, page-specific rule, TOC mutation or index repair is recommended.

Limitation stated explicitly: a regex cannot semantically distinguish an intentionally numbered `h3` from numeric prose incorrectly labeled `h3`. The existing typed-block contract is the protection. A normal `p` beginning `78 ...` is not passed to SEC_NUM and must not start a lesson. Numeric `source.printedName` values gain the same separator support, while existing title/number consistency checks must remain active.

## Independently Expected Focused Cases

These expectations are proposed before implementation, derived from the observed source and existing supported grammar. **They were not executed and are not PASS evidence.** In the table, `　` denotes the real U+3000 separator, not an inserted full stop.

### Heading Positives And Preservation

| Input Heading | Independently Expected (Number, Title) | Purpose |
| --- | --- | --- |
| `78$^{*}$　弦长与弦所对的弧长的比的极限` | `("78", "弦长与弦所对的弧长的比的极限")` | Actual failing source; no invented punctuation |
| `78$^{*}$ 弦长与弦所对的弧长的比的极限` | Same as actual source | Ordinary-space equivalent |
| `79 二阶导数` | `("79", "二阶导数")` | Generic unstarred whitespace separator |
| `75. 正弦函数的导函数` | `("75", "正弦函数的导函数")` | Existing ASCII full stop preserved |
| `77$^{*}$. 三角函数的连续性` | `("77", "三角函数的连续性")` | Existing starred punctuation form preserved |
| `12．集合` and `12、集合` | `("12", "集合")` for each | Both existing non-ASCII punctuation forms preserved |
| `§ 15. 三角函数的导函数` | `("15", "三角函数的导函数")` | Existing section-symbol form preserved |
| `$12^{+}$. 集合` | `("12", "集合")` | Existing math-wrapped plus superscript form preserved |
| `12 $\blacktriangledown$. 集合` | `("12", "集合")` | Existing supplemental marker preserved |
| `12 $\blacktriangledown$ 集合` | `("12", "集合")` | Same known marker with whitespace separator |
| `78 2026年的例子` | `("78", "2026年的例子")` | Keep full leading title digits; no new number interpretation |

### Negative Boundaries

| Input | Independently Expected | Purpose |
| --- | --- | --- |
| `78标题` | No SEC_NUM match | No glued number/title acceptance |
| `78$^{*}$标题` | No SEC_NUM match | Star is not itself an implicit separator |
| `78` and `78$^{*}$` | No SEC_NUM match | Number/marker alone is not a heading |
| `78 ` and `78$^{*}$　` | No SEC_NUM match | Whitespace-only title rejected |
| `78.   ` | No SEC_NUM match | Empty punctuation-form title rejected |
| `78: 标题` | No SEC_NUM match | Do not silently add colon as a supported numbered-heading delimiter |
| `定理 78 连续性` | No SEC_NUM match | Noninitial number not parsed |
| `补充习题` | No SEC_NUM match | Unnumbered heading remains unnumbered |
| `78x 标题` | No SEC_NUM match | Do not split an alphanumeric token into number/title |

### Typed-Block And TOC Cases

1. A minimal typed stream with an `h3` containing the exact original n78 heading at physical 16 / printed 10 must yield `number="78"`, the undecorated source title above, and `printed_title` exactly equal to the original bytes.
2. With the actual current n78 TOC topic and printed page 10, that parsed lesson must claim `ana10-c6-s1-n78`. No change to title spelling or punctuation is needed.
3. The same parsed number at the wrong printed start page must **not** claim the n78 card. Preserve the existing TOC page-mismatch warning.
4. A `p` block beginning `78 这是普通正文。` following a real heading must remain prose in that lesson, not create a numbered lesson. This is a cut_lessons type-gate case, not a standalone regex semantic claim.
5. A TOC `source.printedName="78 标题"` with a conflicting declared printedNumber or title must remain unclaimed with the existing consistency warning; whitespace support must not bypass validation.

The parent can implement the single regex-line patch and verify this one focused parser/typed-stream/TOC set afterward. No full-book assembly, source-finalize or broad tests are needed to establish these parser expectations. This author has not executed that verification.

## Handoff

Recommendation: accept real whitespace as a required alternative separator and require a nonblank title, preserving the current supported prefix grammar and captures. Leave all source pages, TOC, lesson/index files and n77 text as-is. Stop here for parent implementation and focused verification.
