import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const ticket = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp');
const work = path.join(root, '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons');
const book = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9p');
const skill = path.join(root, '.claude/skills/ld-s10y-lesson');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const binding = file => ({
  path: file,
  sha256: createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const digest = text => createHash('sha256').update(text).digest('hex');
const names = ['lesson.template.json', 'exercises.template.json', 'figures.template.json'];

const content = {
  'phy9-c1-s7-n56': {
    sectionStarts: [4, 7],
    sections: ['自由参考长度与相对变化', '系数和长度关系', '数量级与因瓦合金应用'],
    texts: {
      0: String.raw`实验表明，对没有明显外部约束、温度近似均匀且不发生相变的固体，在温度变化不大、相对长度变化很小时，某一方向的长度变化可近似与温度变化成正比，如图99所示。同样的温度变化产生的伸长或缩短还取决于原来长度，因此采用相对变化量描述。长度变化为$\Delta l=l-l_0$，以原来长度$l_0$作为参照。相对变化量$\frac{\Delta l}{l_0}$与温度变化量$\Delta t=t-t_0$近似成正比；升温和降温的温差应按各自的符号代入。`,
      3: String.raw`以原来长度为基准，线膨胀的近似关系为：$\frac{\Delta l}{l_0}=\beta\Delta t$。（7-1）`,
      4: String.raw`比例系数$\beta$叫做**线膨胀系数**，描述在该近似模型中温度升高1°C时，长度增长量占原来长度的比例。它取决于材料和温度，也针对所考察的方向；各向异性材料不同方向的系数可能不同。在不太大的温度范围内，可忽略$\beta$随温度的变化，把它近似当作常量。这里的度表示温差的单位，而不是绝对温度的数值。`,
      5: '由公式(7-1)可得，在上述自由膨胀、系数近似不变的条件下，长度与温度变化的关系为：',
      6: String.raw`$l=l_0(1+\beta\Delta t)$。（7-2）`,
      7: String.raw`许多常见固体的线膨胀较小。源书给出的典型数量级是$\beta$为$10^{-5}\sim10^{-6}$度$^{-1}$，这并非所有材料和温度下都适用的固定范围。书末附表列有一些材料的线膨胀系数，采用时应注意相应材料和温度条件。`,
      8: '因瓦合金(殷钢)在适用温度范围内的线膨胀系数特别小，因此可用于对尺寸稳定性有要求的精密器具。用它制成的仪器尺寸对微小温度变化较不敏感，但并非完全不发生热膨胀，也不能把这种性能推广到任意温度范围。',
    },
  },
  'phy9-c1-s7-n57': {
    sectionStarts: [7, 9, 10, 14, 23],
    sections: ['相对体积变化与系数', '线膨胀与体膨胀的联系', '液体与容器', '水的反常膨胀', '酒精吸热例题', '固定钢弦张力例题'],
    texts: {
      0: '对自由膨胀、各方向线膨胀为正的固体，升温时各方向尺寸增大，体积也增大；这不是所有材料都必然满足的规律。与长度变化类似，对固定数量的物质，用相对于初始体积的变化量描述体膨胀更方便：',
      1: String.raw`$\frac{\Delta V}{V_0}=\frac{V-V_0}{V_0}$。`,
      2: '测量表明，在温度近似均匀、压力条件保持相同、不发生相变且温度变化范围不大的条件下，可以把相对体积变化近似看作与温差成正比：',
      3: String.raw`$\frac{\Delta V}{V_0}=\alpha\Delta t=\alpha(t-t_0)$。（7-3）`,
      4: String.raw`**体膨胀系数**$\alpha$描述在这一近似模型中温度升高1°C时，体积改变量占原来体积的比例。它与材料及温度有关，在不大的温度区间内可近似取常量。源书给出的许多常见固体的数量级是$10^{-5}\sim10^{-4}$度$^{-1}$，不是所有物质的通用范围。`,
      5: String.raw`如果$V_0$是温度为$t_0$时的初始体积，由公式(7-3)可得变化后的体积$V$：`,
      6: String.raw`$V=V_0(1+\alpha\Delta t)$。（7-4）`,
      7: String.raw`线膨胀系数$\beta$与体膨胀系数$\alpha$有联系。以各向同性、自由膨胀的立方体为例，各方向采用相同的线膨胀系数，在膨胀量很小、忽略较高阶变化时，有$\alpha\approx3\beta$。这个近似不能直接推广到任意各向异性材料，也不是大温度跨度下的精确关系。`,
      8: '液体也会发生体膨胀。由于液体没有自身保持的固定形状，不像固体那样定义一个不受容器影响的固定方向长度，因此通常讨论它的体膨胀，而不采用固体那样的线膨胀概念。',
      9: String.raw`加热容器中的液体时，可通过液面变化观测其体积变化，但容器的容量也可能改变，解释液面升降时须区分两者。许多常见液体的体膨胀系数一般比常见固体大，其数量级可达到$10^{-3}$度$^{-1}$。比较这些系数仍须使用相应的材料、压力和温度条件，不能认为液面在所有加热过程中都必然上升。`,
      10: '水是地球上常见的液体，它在热膨胀方面有特殊性质。在接近普通大气压的条件下，对固定质量的液态水，在0°C～4°C内加热时，体积反而减小；从4°C开始继续升温时，体积才开始增大。由此可见，4°C附近水的体积最小、密度最大，如图100所示。这些温度是源书的近似值，不是任意压力或任意水溶液都具有的固定特征。',
      13: '水的这种性质影响水库中的热交换。当较暖的表层水冷却时，密度增大，可能下沉并形成对流；达到4°C附近后，进一步冷却反而使密度减小，较冷的水因而可能留在表层。在足够深、混合扰动较小而能形成这种分层的水库中，即使气温很低，深层水温仍可约为4°C。浅水、强混合或其他条件下不能保证这一结果。',
      14: '**例题**\n\n以下保留源书的两道正文例题，作为近似模型的理论计算。',
      15: String.raw`1. 加热酒精时体积增大$\Delta V=5.5$厘米$^3$。题设酒精密度为$\rho=800$千克/米$^3$，体膨胀系数为$\alpha=1.1\times10^{-3}$度$^{-1}$，比热为$c=2.4\times10^3$焦耳/千克·度。试求传给酒精的热量。把这些物性作为本次有限温度区间内的近似值，按近似恒压、无相变且酒精质量不变的过程计算；这里只计酒精吸收的热量，不计容器吸热或装置损失。`,
      16: String.raw`**解**：以$V_0$表示初始体积，加热后的体积近似为$V=V_0(1+\alpha\Delta t)$，因此体积变化量为：`,
      17: String.raw`$\Delta V=V-V_0=V_0\alpha\Delta t$。`,
      18: String.raw`在题设比热适用于该过程并近似不变时，酒精吸收的热量为$Q=cm\Delta t$，其中$m=\rho V_0$是酒精质量，密度取初始状态的值。`,
      19: String.raw`源书假设加热期间密度变化很小；这里也把体膨胀系数和比热在该温度区间内近似视为常量。将$\Delta V$与$Q$的表达式相除，消去初始体积及温差，得到：`,
      20: String.raw`$\frac{\Delta V}{Q}=\frac{\alpha}{\rho c}$。`,
      21: '由此可求酒精吸收的热量。代入前须把体积增量从立方厘米换算成立方米，并统一其余单位：',
      22: String.raw`$Q=\Delta V\frac{\rho c}{\alpha}$；$Q=9600$焦耳。这个结果对应题设的物性近似，不是加热装置需要提供的总能量。`,
      23: String.raw`2. 在地板和天花板之间竖直张紧一根长$l=3$米的钢弦。当它降温$\Delta t=30$°C时，张力改变多少？已知在力$F$作用下，弹性伸长量$\Delta l$与力成正比，即$F=k\Delta l$，其中$k=7\times10^4$牛顿/米，线膨胀系数为$\beta=1.1\times10^{-5}$度$^{-1}$。固定点不动，钢弦温度近似均匀，变化保持在弹性范围内，所给刚度及系数近似不变；原有弹性伸长相对弦长很小。本例用正值表示降温的幅度，求的是张力的变化，而不是未知的初始张力或总张力。`,
      24: String.raw`**解**：先考察没有端点约束时的热缩短，以原弦长作为近似自由参考长度。降温后的自由参考长度为$l_1=l(1-\beta\Delta t)$，缩短量的大小为$|\Delta l|=|l_1-l|=l\beta\Delta t$。端点间距不变，必须增加弹性拉伸来补偿热缩短，这一部分附加力为$F=k|\Delta l|$。这里的$F$表示抑制热缩短所需的端点力增量，不是含有原先张力的总力；也不是说把实际固定的弦重新拆下再安装。`,
      25: String.raw`把求得的$|\Delta l|$代入力$F$的表达式，得到张力的增加量：`,
      26: String.raw`$F=k|\Delta l|=kl\beta\Delta t$，$F\approx70$牛顿。保留源书的近似取值和舍入；在给定条件下，降温使张力增加。`,
    },
  },
};

const nativeCode = `
import copy, json, sys
from pathlib import Path
root = Path(sys.argv[1])
sys.path.insert(0, str(root / ".claude/skills/ld-s10y-lesson/tools"))
import edition, mathcheck
payload = json.load(sys.stdin)
lesson = payload["lesson"]
if payload["action"] == "normalize":
    edition.normalize_lesson_layout(lesson)
    print(json.dumps(lesson, ensure_ascii=False))
    raise SystemExit(0)
id = lesson["id"]
book = root / "ssot-resources/soviet10year-textbooks/artifacts/9p"
target = root / ".tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons" / id
raw = edition.load(book / "lessons" / id / "lesson.json")
raw_exercises = edition.load(book / "lessons" / id / "exercises.json")
exercises = edition.load(target / "exercises.template.json")
figures = edition.load(target / "figures.template.json")
profile = edition.load(root / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
forbidden = [*profile.get("forbidden_terms", []), *profile.get("forbidden_person_names", [])]
errors = edition.validate_source(book, lesson["source"], book / "lessons" / id / "lesson.json", "lesson")
errors += edition.validate_source(book, exercises["source"], book / "lessons" / id / "exercises.json", "exercises")
corrections, errata_errors = edition.validate_errata(book, raw, raw_exercises, lesson, exercises)
errors += errata_errors
block_checks = []
for i, (source, modern) in enumerate(zip(raw["prose"], lesson["prose"])):
    label = "lesson.prose[" + str(i) + "]"
    errors += edition.validate_identity_fields(source, modern, ("kind", "id", "label", "printed_page", "source_refs"), label)
    if modern["source_text"] != source["text"]:
        errors.append(label + " source_text differs")
    errors += edition.validate_text(
        source["text"], modern["text"], modern["changes"], modern["numeric_changes"],
        label, forbidden, modern.get("historical_entities"),
        corrections.get(label), modern.get("notation_changes")
    )
    expected = source["text"]
    for correction in corrections.get(label, []):
        expected = expected.replace(correction["original"], correction["corrected"], 1)
    exact_tokens = [m.group(0) for m in edition.MATH.finditer(expected)] == [m.group(0) for m in edition.MATH.finditer(modern["text"])]
    if not exact_tokens:
        errors.append(label + " exact uncorrected math-token bytes differ")
    errors += [label + ": " + error for error in edition.validate_numbered_subpart_layout(modern["text"])]
    block_checks.append({
        "index": i, "source_refs": source["source_refs"],
        "exact_math_tokens_equal_after_registered_erratum": exact_tokens,
        "source_numbers": edition.number_signature(source["text"]),
        "modern_numbers": edition.number_signature(modern["text"]),
        "registered_math_corrections": len(corrections.get(label, []))
    })
errors += edition.validate_figure_references(lesson["prose"], exercises["exercises"], figures["figures"])
flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
errors += flow_errors
normalized = copy.deepcopy(lesson)
edition.normalize_lesson_layout(normalized)
if normalized != lesson:
    errors.append("normalization is not idempotent")
math_blocks = [{"id": "prose-" + str(i), "text": item["text"]} for i, item in enumerate(lesson["prose"])]
math_errors, math_warnings = mathcheck.collect_and_check(math_blocks, lambda block: [("text", block["text"])])
errors += math_errors
print(json.dumps({
    "errors": errors, "math_warnings": math_warnings,
    "scope": "Author text/source identity/errata/math/numbers/native prose_flow only; modern figure spec/render/review excluded.",
    "normalization_is_idempotent": normalized == lesson,
    "blocks": block_checks,
    "prose_blocks": len(lesson["prose"]),
    "actual_paragraphs": len(flow.get("paragraphs", [])),
    "written_tasks": len(exercises["exercises"]),
    "source_figures": [figure["id"] for figure in figures["figures"]],
    "registered_errata": len(lesson["errata"])
}, ensure_ascii=False))
`;
const native = payload => JSON.parse(execFileSync(
  path.join(skill, '.venv/bin/python'), ['-c', nativeCode, root],
  { encoding: 'utf8', input: JSON.stringify(payload), maxBuffer: 4 * 1024 * 1024 },
));
const flow = lesson => JSON.parse(execFileSync(
  'node', [path.join(skill, 'tools/prose_flow.mjs'), '--stdin'],
  { encoding: 'utf8', input: JSON.stringify(lesson), maxBuffer: 4 * 1024 * 1024 },
));
const summaries = [];
for (const [id, config] of Object.entries(content)) {
  const short = id.split('-').at(-1);
  const target = path.join(work, id);
  const before = path.join(ticket, '9p-n56-n57-before', id);
  const lessonPath = path.join(target, 'lesson.template.json');
  const freezePath = path.join(ticket, `9p-${short}-prose-freeze.json`);
  assert(!fs.existsSync(freezePath), 'Preserve an existing author freeze.');
  for (const name of names) {
    assert.equal(binding(path.join(target, name)).sha256, binding(path.join(before, name)).sha256);
  }
  const baseline = read(path.join(before, 'lesson.template.json'));
  let lesson = structuredClone(baseline);
  assert.equal(lesson.prose.length, short === 'n56' ? 9 : 27);
  assert.equal(lesson.exercise_count, 0);
  for (const [index, text] of Object.entries(config.texts)) {
    const block = lesson.prose[Number(index)];
    assert.equal(block.kind, 'p');
    block.text = text;
    block.changes = text.replace(/[。；，：（）]/g, '') === block.source_text.replace(/[.;,:()]/g, '')
      ? ['layout'] : ['context', 'layout'];
  }
  if (short === 'n56') {
    assert.equal(lesson.errata.length, 1);
    const erratum = lesson.errata[0];
    assert.equal(erratum.id, 'p0140-linear-expansion-reference-length');
    assert.equal(erratum.target, 'lesson.prose[3]');
    assert.equal(erratum.original, String.raw`$\frac{\Delta l}{l}=\beta\Delta t$`);
    erratum.corrected = String.raw`$\frac{\Delta l}{l_0}=\beta\Delta t$`;
    lesson.prose[3].changes.push('math-correction');
  } else {
    assert.deepEqual(lesson.errata, []);
  }
  lesson = native({ action: 'normalize', lesson });
  const outline = flow(lesson).paragraphs;
  lesson.section_breaks = config.sectionStarts.map(blockIndex => {
    const paragraph = outline.find(item => item.blockIndex === blockIndex);
    assert(paragraph && paragraph.index > 0);
    return { before: outline[paragraph.index - 1].text, after: paragraph.text };
  });
  const finalFlow = flow(lesson);
  assert.deepEqual(
    finalFlow.boundaries.map(({ before, after }) => ({ before, after })),
    lesson.section_breaks,
  );
  const checks = native({ action: 'validate', lesson });
  assert.deepEqual(checks.errors, []);
  assert.deepEqual(checks.math_warnings, []);
  const withoutAuthoredFields = document => ({
    ...document,
    section_breaks: [],
    errata: document.errata.map(item => ({ ...item, corrected: '' })),
    prose: document.prose.map(item => {
      const { text, changes, ...rest } = item;
      return rest;
    }),
  });
  assert.deepEqual(withoutAuthoredFields(lesson), withoutAuthoredFields(baseline));
  assert.deepEqual(lesson.source, baseline.source);
  fs.writeFileSync(lessonPath, JSON.stringify(lesson, null, 2) + '\n');
  for (const name of ['exercises.template.json', 'figures.template.json']) {
    assert.equal(binding(path.join(target, name)).sha256, binding(path.join(before, name)).sha256);
  }
  const pages = [...new Set(lesson.prose.flatMap(item => item.source_refs.map(ref => Number(ref.slice(1).split('#')[0]))))].sort((a, b) => a - b);
  const figures = read(path.join(target, 'figures.template.json'));
  const sourceFigures = figures.figures.map(figure => {
    const files = Object.fromEntries(Object.entries(figure.source).map(([type, item]) => {
      const result = binding(path.join(book, item.path));
      assert.equal(result.sha256, item.sha256);
      return [type, result];
    }));
    return { id: figure.id, files, pixels_reopened: false };
  });
  const record = {
    ticket: 'STEMROBIN-181',
    batch: 'D016',
    lesson: id,
    role: 'modern-prose-author-only',
    status: 'frozen-pending-main-independent-science-and-figure-work',
    created_at: new Date().toISOString(),
    templates: Object.fromEntries(names.map(name => [name, binding(path.join(target, name))])),
    before_templates: Object.fromEntries(names.map(name => [name, binding(path.join(before, name))])),
    source: {
      lesson: binding(path.join(book, 'lessons', id, 'lesson.json')),
      exercises: binding(path.join(book, 'lessons', id, 'exercises.json')),
      pages: pages.map(page => ({ page, ...binding(path.join(book, 'pages', String(page).padStart(4, '0'), 'page.json')) })),
      figures: sourceFigures,
    },
    counts: {
      source_prose_blocks: checks.prose_blocks,
      actual_native_paragraphs: checks.actual_paragraphs,
      original_written_tasks: 0,
      authored_written_tasks: 0,
      figures: checks.source_figures,
      worked_examples_remain_prose: short === 'n57' ? 2 : 0,
    },
    sections: config.sections,
    section_breaks: lesson.section_breaks,
    prose_changes: lesson.prose.flatMap((item, index) => item.text === baseline.prose[index].text ? [] : [{
      index,
      source_refs: item.source_refs,
      changes: item.changes,
      before_text: baseline.prose[index].text,
      current_text: item.text,
      source_text_sha256: digest(item.source_text),
      current_text_sha256: digest(item.text),
    }]),
    registered_errata: lesson.errata,
    preservation: {
      all_source_snapshots_identity_order_references_and_fig_cap_blocks_unchanged: true,
      exact_math_tokens_unchanged_except_registered_n56_reference_length: true,
      original_numbers_and_unit_tokens_unchanged: true,
      no_new_written_tasks_or_example_reclassification: true,
      exercises_and_figure_templates_byte_identical_to_prepare: true,
      no_new_historical_entities_or_history_invented: true,
      source_fig99_fig100_hashed_only_not_reopened: true,
      native_prepare_run_once_for_exact_two_lessons: true,
    },
    native_author_text_validation: { status: 'pass', ...checks },
    native_prose_flow: finalFlow,
    pending: ['Main unique independent SCI', 'Main modern figure authoring and separate independent figure gate'],
    modern_figure_validation: { status: 'not-performed', reason: 'Author prose scope only; manifests remain native placeholders.' },
    helper: binding(fileURLToPath(import.meta.url)),
    native_inputs: {
      edition: binding(path.join(skill, 'tools/edition.py')),
      prose_flow: binding(path.join(skill, 'tools/prose_flow.mjs')),
      htmlfrag: binding(path.join(skill, 'tools/htmlfrag.js')),
      mathcheck: binding(path.join(skill, 'tools/mathcheck.py')),
      profile: binding(path.join(skill, 'profiles/modern-us-neutral.json')),
    },
    self_independent_approval: false,
    source_finalize_assemble_pixels_modern_figures_answers_choices_production_db_git_browser_or_dependency_actions: [],
    in_flight_processes: 0,
  };
  fs.writeFileSync(freezePath, JSON.stringify(record, null, 2) + '\n');
  summaries.push({
    lesson: id,
    freeze: binding(freezePath),
    template: binding(lessonPath),
    counts: record.counts,
    text_validation: 'pass',
    independent_science: 'pending',
  });
}
console.log(JSON.stringify({ lessons: summaries, in_flight_processes: 0 }, null, 2));
