import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const cwd = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const own = path.dirname(new URL(import.meta.url).pathname);
const tools = path.join(cwd, '.claude/skills/ld-s10y-lesson/tools');
const card = 'phy10-c2-s2-n78';
const require = createRequire(import.meta.url);
const { proseOutline } = require(path.join(tools, 'htmlfrag.js'));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: sha(file), bytes: fs.statSync(file).size });
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
function write(relative, value) {
  const file = path.join(own, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  return bind(file);
}
const entries = [
  {
    ref: 'p0206#13', requirements: ['N78-R02', 'N78-R15'],
    rationale: 'Retain geometrical optics, real imaging and chemical fixation; explicitly limit chemical recording to photosensitive plates/film rather than all contemporary cameras.',
    zh: '各种光学仪器的构造和作用都以几何光学定律为基础。\n本课先研究形成实像的情况。\n在感光片或胶卷摄影中，利用光的化学作用记录这个像，再经过定影等处理把它保存下来。\n这里的化学记录过程指感光材料摄影，不是数字相机的电子记录方式。',
    en: 'The construction and operation of optical instruments are based on geometrical optics.\nWe first consider instruments that form real images.\nIn photography with photosensitive plates or film, the chemical action of light records the image, which is then fixed and preserved.\nThis chemical process describes photographic materials, not electronic recording in a digital camera.',
  },
  {
    ref: 'p0206#14', requirements: ['N78-R03', 'N78-R15'],
    rationale: 'Keep the textbook history explicitly attributed without silently changing19/30 to a new historical date. Retain every development/use category; English supplies readable spelled-out history with the exact numeric source notation.',
    zh: '按照原书的历史概述，摄影是在 19 世纪 30 年代发明的，随后走过了漫长的发展道路。\n摄影技术逐渐实现了小型化、快速拍摄、彩色摄影和立体摄影，并广泛应用于生活的各个领域。\n它在研究自然界时也有重要作用：既能记录微观物体，也能记录宇宙中的物体，还能记录不可见的辐射。\n艺术摄影具有重要意义，电影也是摄影技术在艺术中的一种发展。',
    en: "The textbook dates photography's invention to the nineteenth century's thirties (century 19, decade 30).\nPhotography then followed a long path of development.\nIt became compact and fast, with color and stereoscopic techniques, and found wide use in everyday life.\nPhotography is also important in the study of nature.\nIt can record objects from microscopic to astronomical scales, as well as invisible radiation.\nArtistic photography is significant, and cinema developed from photography as an art form.",
  },
  {
    ref: 'p0207#1', requirements: ['N78-R04', 'N78-R15'],
    rationale: 'Identify181 as the source example rather than calling an old design universally current. Preserve the dark box/objective/film and usual reduced real image; qualify the optical model.',
    zh: '**照相机** 图 181 是原书所举的一种照相机的外形。\n照相机的主要部分是暗箱和称为镜头（物镜）的透镜组，最简单的镜头就是一个会聚透镜。\n在薄透镜、近轴近似下，镜头在靠近暗箱后壁的位置形成被摄物体的倒立实像。\n通常，被摄物体到镜头的距离大于两倍焦距，因此得到缩小的像。\n在成像位置放置感光片，或者放置涂有摄影乳剂等感光材料的胶卷。',
    en: '**Camera** Figure 181 shows a camera used as an example in the textbook.\nIts main parts are a light-tight box and a group of lenses called the objective; the simplest objective is a single converging lens.\nIn the thin-lens, paraxial approximation, the objective forms an inverted real image near the back wall of the box.\nThe object is usually farther from the objective than twice its focal length, so the image is reduced.\nA photosensitive plate, or film coated with a photographic emulsion, is placed at the image plane.',
  },
  {
    ref: 'p0207#5', requirements: ['N78-R05', 'N78-R15'],
    rationale: 'Explain the source mechanical focusing examples and changing image distance without generalizing whole-objective translation to every camera.',
    zh: '被摄物体可以位于离照相机不同的距离处。\n在薄透镜近似下，物距改变时，清晰实像的位置也会改变，因此需要相应调整镜头到感光片或胶卷的距离。\n原书举出的做法是利用螺纹机构移动镜头，或让暗箱伸缩；后者把暗箱做成像“手风琴”一样的皮腔。\n这些做法说明了调焦的原理，并不表示所有相机都靠整个镜头平移来调焦。',
    en: 'Objects being photographed can be at different distances from the camera.\nIn the thin-lens approximation, changing the object distance changes the position of the sharp real image.\nThe objective-to-plate or objective-to-film distance must therefore be adjusted accordingly.\nThe textbook describes moving the objective with a threaded mechanism or extending a light-tight bellows box, folded like an accordion.\nThese examples explain focusing; they do not imply that every camera focuses by translating the whole objective.',
  },
  {
    ref: 'p0207#6', requirements: ['N78-R06', 'N78-R15'],
    rationale: 'Retain shutter/exposure/sensitivity/illumination and both aperture roles. Scope the aperture/image-distance irradiance comparison to fixed radiance/transmission and near-axis geometrical optics.',
    zh: '快门通过开放光路的时间来控制感光层接收到的光能，这段时间叫作曝光时间。\n所需的曝光时间取决于摄影乳剂的灵敏度和胶片的照度。\n比较时若物体亮度、镜头透光率等条件相同，在近轴几何光学近似下，有效孔径越大、感光层到镜头的像侧距离越短，胶片的照度越高。\n这比较的是光束在成像感光层上产生的照度，不能据此断言仅改变对焦距离就必然怎样改变曝光。\n光圈可以改变镜头有效通光部分的直径，从而调节胶片照度。\n但光圈还有另一项作用：改变不同物距处物体在照片中的清晰程度。',
    en: 'The shutter controls the light energy reaching the photosensitive layer by opening the light path for an exposure time.\nThe required exposure time depends on the sensitivity of the photographic emulsion and the irradiance at the film.\nCompare images with the same object radiance and lens transmission, within the near-axis geometrical-optics approximation.\nA larger effective opening, or a shorter image-side distance from the objective to the photosensitive layer, gives greater film irradiance.\nThis compares illumination at the image plane; it does not mean that changing focusing distance alone universally determines exposure.\nThe aperture changes the effective diameter of the objective and therefore adjusts film irradiance.\nIt also affects how sharp objects at different distances appear in the photograph.',
  },
  {
    ref: 'p0207#7', requirements: ['N78-R07', 'N78-R08', 'N78-R10', 'N78-R15'],
    rationale: 'Use the accepted207208 completion, all original A/B/C math tokens and all five182 reference occurrences; localize panel suffixes in occurrence order. Qualify ideal point focus, nonzero defocus circles, acceptable sharpness and the geometric/diffraction range.',
    zh: '假设相机对准某一距离上的发光点 $A$ 调焦；在薄透镜、近轴几何光学的理想模型中，它的像落在胶片上，是一个点（图 182a）。\n离镜头较近的点 $B$（图 182b）和离镜头较远的点 $C$（图 182c），在同一个胶片平面上则形成散焦的小圆斑。\n在镜头前加上光圈（图 182d、e、f）后，有效孔径越小，散焦圆斑的直径就越小（图 182e、f）。\n因此，缩小光圈可以使一定范围内、离相机不同距离的物体都显得足够清晰，这就是景深增加。\n“足够清晰”不表示这些物体全都精确成像于同一个平面，也不表示散焦圆斑都变成了数学上的点。\n这一结论适用于几何光学散焦占主导的范围；光圈很小时，衍射也会使像变模糊。\n真实镜头还存在像差，所以理想模型中的像点不表示任意角度、任意有限孔径的光线都严格交于一点。',
    en: 'Suppose the camera is focused on a luminous point $A$ at a particular distance.\nIn the ideal thin-lens, paraxial geometrical-optics model, its image is a point on the film (Figure 182a).\nA nearer point $B$ (Figure 182b) and a farther point $C$ (Figure 182c) instead produce small circles of defocus on that same film plane.\nWith an aperture in front of the objective (Figure 182d, e, f), a smaller effective opening gives smaller defocus circles (Figure 182e, f).\nStopping down can therefore make objects over a range of distances look sufficiently sharp: the depth of field increases.\nSufficient sharpness does not mean that all these objects focus exactly on the same plane, or that every defocus circle becomes a mathematical point.\nThis conclusion applies where geometrical defocus dominates; at very small apertures, diffraction also blurs the image.\nReal lenses have aberrations as well, so the ideal image point does not imply exact concurrence for arbitrary ray angles or finite apertures.',
  },
  {
    ref: 'p0208#4', requirements: ['N78-R11', 'N78-R15'],
    rationale: 'Retain screen/rear illumination/slide/objective and condenser roles with O,D,K exactly once in source order. Add only an explicit thin-lens focused-enlargement condition in words.',
    zh: '**投影仪** 用来在屏幕上获得物体放大的实像。\n被投影的物体可以是从后面照明的透明图片或幻灯片，图 183 是这种仪器的结构简图。\n镜头 $O$ 在屏幕上形成幻灯片 $D$ 的像。\n称为聚光器的透镜组 $K$ 把光源发出的光集中到幻灯片上，负责照亮幻灯片；物镜负责把被照亮的幻灯片成像在屏幕上。\n图中展示了光从幻灯片经镜头到达屏幕的光路。\n在薄透镜、近轴模型中，要用会聚物镜得到放大的实像，幻灯片应位于焦距和两倍焦距之间，屏幕应放在相应的实像位置。',
    en: '**Projector** A projector forms an enlarged real image of an object on a screen.\nThe object can be a transparent picture or slide illuminated from behind; Figure 183 shows the arrangement.\nThe objective $O$ forms an image of the slide $D$ on the screen.\nThe lens group $K$, called the condenser, concentrates light from the source onto the slide.\nThe condenser illuminates the slide, while the objective images the illuminated slide on the screen.\nThe diagram shows the light path from the slide through the objective to the screen.\nIn the thin-lens, paraxial model, an enlarged real image requires the slide to lie between one and two focal lengths from the converging objective.\nThe screen must be at the corresponding real-image position.',
  },
  {
    ref: 'p0208#5', requirements: ['N78-R12', 'N78-R15'],
    rationale: 'Preserve coupled objective/slide and projector/screen motions; clarify maintained focus in the thin-lens model without adding a formula or measured magnification.',
    zh: '把镜头移近或移远幻灯片，同时改变投影仪到屏幕的距离，就可以改变投影放大率。\n在固定焦距的薄透镜模型中，物距和像距需要配合调整，使屏幕仍位于清晰实像的位置。\n只移动镜头却任意固定屏幕位置，并不能保证放大后的像仍然清晰。',
    en: 'Moving the objective toward or away from the slide, while also changing the projector-to-screen distance, changes the magnification.\nIn the fixed-focal-length thin-lens model, the object and image distances must be adjusted together to keep a sharp real image on the screen.\nMoving only the objective while arbitrarily fixing the screen position does not guarantee a sharp enlarged image.',
  },
  {
    ref: 'p0208#6', requirements: ['N78-R13', 'N78-R14', 'N78-R15'],
    rationale: 'Retain the accepted208209 terminal opaque-object paragraph and book-illustration example. Explain reflected rather than transmitted illumination without inventing mirror geometry.',
    zh: '不透明物体也可以像透明物体一样，被投影成像在屏幕上。\n用于这种投影的仪器叫作反射映画器。\n例如，要把书上的插图投影到屏幕上，需要用很强的光照亮插图，再由镜头把插图成像在屏幕上。\n这里进入镜头的是物体反射的光，不是穿过不透明物体的光。',
    en: 'Opaque objects, like transparent ones, can also be imaged on a screen by projection.\nAn instrument for this purpose is called an opaque projector, or episcope, corresponding to the source term for reflected-light projection.\nTo project a book illustration, for example, it must be illuminated strongly and imaged onto the screen by the objective.\nThe light entering the objective is reflected from the opaque object, rather than transmitted through it.',
  },
];

assert.deepEqual(process.argv.slice(2), ['--execute']);
assert.equal(fs.existsSync(path.join(own, 'candidate')), false);
const preparation = read(path.join(own, 'preparation-manifest.json'));
for (const file of preparation.outputs) assert.equal(sha(file.path), file.sha256);
const requirementsFreeze = read(path.join(own, 'requirements-freeze.json'));
for (const file of requirementsFreeze.files) assert.equal(sha(file.path), file.sha256);
const prepared = path.join(own, 'work/adapt/10p/modern-us-neutral/lessons', card);
const source = read(path.join(prepared, 'lesson.template.json'));
const exercises = read(path.join(prepared, 'exercises.template.json'));
const sourceFigures = read(path.join(prepared, 'figures.template.json'));
assert.equal(source.prose.filter(item => item.kind === 'p').length, entries.length);
const mappings = entries.map(entry => {
  const index = source.prose.findIndex(item => item.kind === 'p' && item.source_refs.includes(entry.ref));
  assert.ok(index >= 0, entry.ref);
  return { ...entry, index, source_refs: source.prose[index].source_refs, source_text: source.prose[index].source_text };
});
assert.equal(new Set(mappings.map(item => item.index)).size, entries.length);
for (const locale of ['zh', 'en']) {
  const lesson = structuredClone(source);
  for (const entry of mappings) {
    const block = lesson.prose[entry.index];
    block.text = entry[locale];
    block.changes = block.text === block.source_text ? [] : ['language', 'layout', 'clarification'];
  }
  for (const block of lesson.prose.filter(item => item.kind === 'cap')) {
    block.text = locale === 'zh' ? block.source_text : `Figure ${block.label.match(/\d+/)[0]}`;
    block.changes = block.text === block.source_text ? [] : ['language'];
  }
  for (const block of lesson.prose.filter(item => item.kind === 'fig')) block.changes = [];
  const figures = structuredClone(sourceFigures);
  for (const figure of figures.figures) {
    figure.changes = ['planned'];
    figure.modern_author_status = 'PENDING';
    figure.brief_limits = 'TEXT-ONLY: original RAW/SVG bytes are copied as source bindings, not modern artifacts. No original image has been opened here. Independent source inventory and first modern figure author/review must follow; no modern specification, rendering or approval is supplied.';
  }
  write(`candidate/${locale}/lesson.template.json`, lesson);
  write(`candidate/${locale}/exercises.template.json`, exercises);
  write(`candidate/${locale}/figures.template.json`, figures);
}
function commandOnce(name, command) {
  const started = write(`native/${name}/started.json`, { command, cwd, recordedAt: new Date().toISOString(), attempt: 1 });
  const result = spawnSync(command[0], command.slice(1), {
    cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: path.join(own, 'runtime-tmp') },
  });
  const dir = path.join(own, 'native', name);
  fs.writeFileSync(path.join(dir, 'stdout.txt'), result.stdout ?? '', { flag: 'wx' });
  fs.writeFileSync(path.join(dir, 'stderr.txt'), result.stderr ?? '', { flag: 'wx' });
  const receipt = write(`native/${name}/receipt.json`, {
    command, cwd, attempt: 1, started, exitCode: result.status, signal: result.signal,
    error: result.error?.message ?? null,
    stdout: bind(path.join(dir, 'stdout.txt')), stderr: bind(path.join(dir, 'stderr.txt')),
    textOnly: true, imagesOpenedDecodedRendered: 0,
  });
  if (result.status !== 0) {
    write(`first-failure-${name}.json`, { status: 'FAIL-PRESERVED-NO-RETRY-LOOP', receipt });
    console.log(JSON.stringify(receipt));
    process.exit(1);
  }
  return { result, receipt };
}
const normalization = commandOnce('normalize-and-text-contract-first', [
  path.join(cwd, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), '-B',
  path.join(own, 'normalize-and-check-once.py'), '--execute',
]);
const flows = [];
for (const locale of ['zh', 'en']) {
  const file = path.join(own, `candidate/${locale}/lesson.template.json`);
  const lesson = read(file);
  const outline = proseOutline(lesson.prose);
  const conceptRefs = ['p0207#1', 'p0207#5', 'p0207#7', 'p0208#4', 'p0208#6'];
  const requested = conceptRefs.map(ref => {
    const blockIndex = lesson.prose.findIndex(item => item.kind === 'p' && item.source_refs.includes(ref));
    const after = outline.find(item => item.blockIndex === blockIndex && item.paragraphInBlock === 0);
    assert.ok(after && after.index > 0);
    return { ref, before: outline[after.index - 1].text, after: after.text };
  });
  lesson.section_breaks = requested.map(({ before, after }) => ({ before, after }));
  fs.writeFileSync(file, `${JSON.stringify(lesson, null, 2)}\n`);
  const flow = commandOnce(`prose-flow-${locale}-first`, ['node', path.join(tools, 'prose_flow.mjs'), '--json', file]);
  const native = JSON.parse(flow.result.stdout);
  assert.deepEqual(native.boundaries.map(({ before, after }) => ({ before, after })), lesson.section_breaks);
  flows.push({
    locale, commandReceipt: flow.receipt,
    normalizedBeforeBoundaryDerivation: true,
    anchorsFrom: 'existing htmlfrag.proseOutline on normalized final paragraph text; verified/copied from native prose_flow output',
    concepts: requested, paragraphCount: native.paragraphs.length,
    boundaries: native.boundaries,
  });
}
write('source-text-mapping.json', {
  schema: 'STEMROBIN-181/n78-first-author-source-coverage@1', ticket: 'STEMROBIN-181', batch: 'd638', card,
  requirementsFreeze: bind(path.join(own, 'requirements-freeze.json')),
  source: preparation.outputs.filter(item => /\/lesson\.(json|md)$/.test(item.path)),
  mappings: mappings.map(({ zh, en, ...entry }) => ({
    ...entry,
    zh: read(path.join(own, 'candidate/zh/lesson.template.json')).prose[entry.index].text,
    en: read(path.join(own, 'candidate/en/lesson.template.json')).prose[entry.index].text,
  })),
  sourceQuestionCount: 0, exerciseGroupCount: 0,
  heading: { source_ref: 'p0206#12', nativeTitle: '照相机 投影仪', nativePrintedTitle: '78. 照相机 投影仪' },
  panelLocalization: {
    source_refs: ['p0207#7', 'p0208#3'],
    sourceSuffixesInOccurrenceOrder: ['а', 'б', 'в', 'г', 'д', 'е', 'д', 'е'],
    modernSuffixesInOccurrenceOrder: ['a', 'b', 'c', 'd', 'e', 'f', 'e', 'f'],
    sourceRowMajorOrderRetainedForFutureFigures: ['а', 'г', 'б', 'д', 'в', 'е'],
    actualPixelInventoryNotAuthoredHere: true,
  },
  noSourceDataCorrections: true, noUnsolvedQuestionsCreated: true,
});
write('section-boundaries.json', { schema: 'STEMROBIN-181/n78-final-paragraph-boundaries@1', flows });
write('math-reuse.json', {
  schema: 'STEMROBIN-181/n78-source-math-reuse@1',
  sourceTokensInBlockOrder: [{ index: 7, tokens: ['A', 'B', 'C'] }, { index: 10, tokens: ['O', 'D', 'K'] }],
  newMathSpans: 0, sourceMathOccurrences: 6, candidateMathOccurrencesPerLocale: 6,
  physicalQuantitiesAndEquationsChanged: false,
  newKaTeXValidationRequired: false,
  existingKaTeXEvidence: bind(path.join(own, 'native/assemble-first/receipt.json')),
  existingSpansValidatedOnceBySparseNativeAssemble: true,
  addedThinLensExposureDepthOfFieldApplicabilityExplainedInWordsOnly: true,
});
console.log(JSON.stringify({
  status: 'FIRST-BILINGUAL-TEXT-AUTHORED-NORMALIZED-READY-TO-FREEZE',
  normalization: normalization.receipt,
  flows: flows.map(item => ({ locale: item.locale, paragraphs: item.paragraphCount, breaks: item.boundaries.length, receipt: item.commandReceipt })),
  outputs: ['zh', 'en'].flatMap(locale => ['lesson.template.json', 'exercises.template.json', 'figures.template.json'].map(name => bind(path.join(own, 'candidate', locale, name)))),
}, null, 2));
