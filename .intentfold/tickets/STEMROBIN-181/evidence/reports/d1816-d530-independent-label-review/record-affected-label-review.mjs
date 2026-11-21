import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

// Records this completed visual review; it does not render or run browser checks.
const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const reports = path.join(repo, '.intentfold/tickets/STEMROBIN-181/evidence/reports');
const output = path.join(reports, 'd1816-d530-independent-label-review');
assert.equal(path.dirname(import.meta.filename), output);
const reviewedAt = '2026-11-21';
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = (file, expected) => {
  const absolute = path.resolve(repo, file);
  assert(absolute.startsWith(`${repo}/`));
  const bytes = fs.readFileSync(absolute);
  const sha256 = digest(bytes);
  if (expected) assert.equal(sha256, expected, `Reviewed bytes changed: ${absolute}`);
  return { path: absolute, bytes: bytes.length, sha256 };
};
const writeNew = (name, value) => {
  const file = path.join(output, name);
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  return bind(file);
};

const definitions = [
  {
    figure: 'fig-182',
    root: 'd1816-d524-fig182-label-repair',
    object: 's182-d-panel-name',
    label: 's182-d-panel-name-label',
    sourceHash: '1b126e58b3603201b5d341d9e51773c8a91e58f750d219abd1827ff819f46e0a',
    pins: {
      'candidate/spec.json': 'c541f155e15214d9d7877dc951744edbd3c87f22840d128236a3f5eb1b8e5276',
      'candidate/figure.svg': '7ca338819ca3e3d2baa0997b80ff8923920a4ae2b8b3b35b6e1fd1304d96a3f5',
      'candidate/render.json': '04124af80bb4d4d5fa2c6a8397eae0a82fe8eb5dd62351e1c808d62ce4bf6be8',
      'candidate/display-331.png': '4f7ca387c939c2905a9b2e1df5cb9392b341dd5f508f5ed032d6ed4274eb556d',
      'candidate/display-342.png': '47ca3a2fce731f0c9fed231b297c52511ad1f21b3d997fb4e8e08ffcad572452',
      'candidate/display-640.png': '46d52dfb48367d9a18bf83ed14c3624d9c71f49c77130ff382db4eca0e5d9bbf',
      'before/spec.json': 'd5b72e71233da5529eda112cd7a1f5dc676d35a6dff2c37be2f0bed7ab5c783b',
      'before/figure.svg': '6ce20ecc1d52d890a4a648495c17043f21cf9c0d69da81642ddd48fc87b24891',
      'before/render.json': '11c1db61882952cc886620bbf9a56c24383b3182bec28378cb8d4b62949827c1',
      'repair.json': '637c370f53358e3a66ea75e94fc09a628d3ab6a857b335ee0d35737ba8025dab',
      'affected-check.json': '47d9b33aa8a8052401775ac70248e21ec6df9ef2d3da24566839c2ba39246c5d',
      'width-check.json': '6dc127a7ef346183bb58d29b99b7016c86bc8a6faa125c5c82a60086dfc2f599',
      'author-observations.json': '7c25f2ee89c51582867e0ff52d527788568003017edc24cbed135640022b3e38',
      'render-receipt.json': '43f1f757db17305e83672d506a2fa1a42a33fd5657a63c33eff75910e67aacdf',
    },
    before: [348, 768],
    after: [332, 782],
    specDifferences: [
      { path: '/objects/88/at/0', before: 348, after: 332 },
      { path: '/objects/88/at/1', before: 768, after: 782 },
      {
        path: '/source/image/path',
        before: '/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d646-active-stages/d638-n78-first-closed-source-text-author/root/10p/figures/fig-182.png',
        after: '.intentfold/tickets/STEMROBIN-181/evidence/reports/d646-active-stages/d638-n78-first-closed-source-text-author/root/10p/figures/fig-182.png',
        classification: 'Pointer relocation only; exact source SHA256 unchanged.',
      },
    ],
    svgDifferences: [
      { address: '/22/13', label: 's182-d-panel-name-label', attribute: 'x', before: '348', after: '332' },
      { address: '/22/13', label: 's182-d-panel-name-label', attribute: 'y', before: '72', after: '58' },
    ],
    sourceObservations: [
      'The source has three rows in two columns. The upper-right subfigure is the A-to-A-prime focused case with a reduced opening, paired with the upper-left A case.',
      'Its source panel identifier is below that subfigure. Moving the English d identifier above the corresponding modern subfigure preserves attribution, rather than asserting that its original pixel position was above.',
      'In the right-column source subfigures, the stop bars are on the image side, immediately to the right of the lens. The unchanged English prose says before the objective; the Chinese prose also says before the lens. This is an unresolved scientific/source-text disagreement.',
    ],
    textSelection: text => text.includes('182a'),
    textMeaning: 'The relevant unchanged bilingual prose distinguishes the focused A case (a/d) from nearer B (b/e) and farther C (c/f). It also contains the unresolved before-objective aperture statement.',
    observations: {
      331: [
        'The lowercase d is crisp and individually readable just inside the start of the right column. It is at the same row height as a and above the right-hand A; e and f remain far below.',
        'The d glyph has white space before Small opening and does not merge into that heading. The A/A-prime labels, lens, stop bars, and directed ray bundle are not covered by d.',
        'Although d is slightly left of the e/f identifiers, the column split, matching first-row position, and adjacent A diagram make its upper-right-panel association unambiguous. It is neither a point name nor a replacement opening heading.',
      ],
      342: [
        'The d identifier remains distinct beneath and to the left of Small opening, aligned vertically with a. Its placement still points to the first right-column diagram, not to the left column or the second row.',
        'No stroke of d touches Small opening or A, and the ray diagram lies below the identifier with visible white space. The change adds no data and changes no panel classification.',
      ],
      640: [
        'At the full 640-pixel media width, d is plainly visible above the top-right A diagram and level with a. Small opening remains a separate column heading.',
        'The larger rendering confirms clean white space around d, separate A/A-prime labels, and no occlusion of the lens, aperture bars, film line, or arrows by this moved label.',
        'The label still denotes the focused narrow-opening subfigure. This visual PASS does not explain away the source image-side versus prose before-objective aperture conflict.',
      ],
    },
    overall: {
      wholeFigureApproval: 'HOLD',
      scientificApproval: 'HOLD',
      sourceFidelityApproval: 'HOLD',
      courseApproval: 'NOT_GRANTED',
      reason: 'Aperture-side disagreement is genuine and remains unresolved. Changed-label PASS supplies no whole-figure, scientific, source-fidelity, or course approval.',
      otherRetainedHold: 'fig181 missing paid output remains HOLD; no repurchase.',
    },
    checks: {
      panelAttribution: 'PASS',
      legibilityAtEveryReviewedWidth: 'PASS',
      clearanceFromOtherLabelsAndGeometry: 'PASS',
      noMisleadingLabelReclassification: 'PASS',
    },
  },
  {
    figure: 'fig-164',
    root: 'd1816-d527-fig164-label-repair',
    object: 'm164-axis-label',
    label: 'm164-axis-label-label',
    sourceHash: '269e30150d627f2ec5238ab1a1526a2b267de81000e4ff83a77c79dcb786612a',
    pins: {
      'candidate/spec.json': '19c81e9e55f0ed5046674f83f165005de2621a41f98e5aa5787180eecb049f92',
      'candidate/figure.svg': '4f57fc9e95cddff9a8cabb3e6ae32a570a909bc1e88da3dab60624a5ae740998',
      'candidate/render.json': '8a7411ce8d7112bb2753be41d05fc15be20423b97acae9e4e36024c27cbdb934',
      'candidate/display-331.png': '5448a51545e1196bd1564d53fcc9ee231b9c1bf58302ef62b62265dbe873422d',
      'candidate/display-342.png': '53888716e6cbbb0b021e519086c2d5c8ca22550f22ed4c94386391e9feaa0c4f',
      'candidate/display-640.png': '7cf1858920968c959eead3b4a5b7246905bafeea34e2fe2f69948be592361e22',
      'before/spec.json': '407d1a8b2294ac4eb3197594d651a9cb56faddfe55e089be60ce06acbd5a9b86',
      'before/figure.svg': '0374549de9c1985607300239dc2d19ace29f9448949e7227169f98a5fc5bac81',
      'before/render.json': 'f491131cdc001022a215edf69d48388037b08d33a08fe498e4cd9efb3a0bf18b',
      'repair.json': 'fc986cf9800b421638d30db09b9526787bc940b6a2b0cbfdbc444a4f0d4b4962',
      'affected-check.json': 'd360400658afe817ea573e7f06f77dd0fba03040c0480d915ae7e76b27190e10',
      'width-check.json': '036654fdfd6f1bc23449b6b7808fe4650e4b04d1beff6715cbb60c25ab8f90cf',
      'author-observations.json': '219febc9d16f677fc1b1b354f5c11841530568c55bb16cc2c4095303c3abb655',
      'render-receipt.json': '390ddc0b0caa24f8604ea5cdbcbd1e1bfbe3f2059be5e910b3fe1b939c619cae',
    },
    before: [2.95, -1.65],
    after: [2.95, -2.35],
    specDifferences: [
      { path: '/objects/19/at/1', before: -1.65, after: -2.35 },
    ],
    svgDifferences: [
      { address: '/21/8', label: 'm164-axis-label-label', attribute: 'y', before: '381.53846153846155', after: '416' },
    ],
    sourceObservations: [
      'The source shows one shared horizontal axis passing through O1, A, O, B, and O2, with two curved lens boundaries and two oblique radius segments R1 and R2.',
      'Principal axis is an English explanatory caption added in the modern figure, not a recovered source label. The source has no second horizontal axis for this caption to identify.',
      'This review checks the caption position and attribution only. It does not resolve the retained interior-mark or heavy-arrow-stroke uncertainties, judge the regularized fill, or reapprove the finite lens geometry.',
    ],
    textSelection: text => /prose\/(3|12|14|15)\/text/.test(text),
    textMeaning: 'Unchanged bilingual prose defines the principal axis as the line through the two curvature centers O1/O2, distinguishes those centers from O, and identifies l = |AB| separately as lens thickness. These distinguish the caption from the radius and thickness annotations.',
    observations: {
      331: [
        'Principal axis is readable as a complete two-word caption in the empty lower-left area. It is clearly separated from O1 above it and does not cover A, the horizontal axis, or either oblique radius.',
        'The shared O1-to-O2 line remains the only long horizontal line through the lens. The caption under its left portion therefore names that axis; it does not name O1, R2, or a new displaced axis.',
        'The R2 annotation is farther right in the lens region. The l = |AB| bracket is lower and rightward between the vertex guides, so neither competes with this caption for meaning.',
      ],
      342: [
        'The two-word caption remains legible and entirely within the media. O1 is on a separate line above; there is no touching or merged text.',
        'The caption occupies white space left of the lens and the A guide. The visible O1/O2 horizontal axis, rather than either slanted radius or the lower thickness bracket, remains its unambiguous referent.',
      ],
      640: [
        'At 640 pixels, Principal axis is clear in muted ink below the left axis segment. O1 remains distinct above it; both caption words have unobstructed glyphs.',
        'The caption is left of the lens edge and vertical thickness guide, with no intersection with a point marker, surface, radius arrow, or bracket. The R2 label is well to the right and the thickness caption is lower.',
        'Moving this caption downward changes no axis location, orientation, center identity, radius attribution, or thickness definition. It continues to name the shared horizontal O1/O2 line.',
      ],
    },
    overall: {
      wholeFigureApproval: 'PENDING_NOT_GRANTED',
      scientificApproval: 'PENDING_NOT_GRANTED',
      sourceFidelityApproval: 'HOLD',
      courseApproval: 'NOT_GRANTED',
      reason: 'No whole-figure or scientific reapproval was performed. Existing source-inventory HOLDs for interior hatch marks and exact heavy arrow strokes remain, as do other N75 HOLDs.',
    },
    checks: {
      principalAxisAttribution: 'PASS',
      clearanceFromO1AndGeometry: 'PASS',
      legibilityAtEveryReviewedWidth: 'PASS',
      noMisleadingMovedLabelMeaning: 'PASS',
    },
  },
];

const scriptBinding = bind(import.meta.filename);
const gates = [
  '.intentfold/readme.md',
  '.intentfold/project.json',
  '.intentfold/charter/product.md',
  '.intentfold/charter/engineering.md',
  '.intentfold/charter/ui.md',
  '.intentfold/charter/operations.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
].map(file => bind(file));
const completed = [];
const globalLedger = [];

for (const definition of definitions) {
  const root = path.join(reports, definition.root);
  const bindings = Object.fromEntries(Object.entries(definition.pins).map(([file, hash]) =>
    [file, bind(path.join(root, file), hash)]));
  const spec = read(bindings['candidate/spec.json'].path);
  const source = bind(spec.source.image.path, definition.sourceHash);
  assert.equal(spec.source.image.sha256, source.sha256);
  const render = read(bindings['candidate/render.json'].path);
  const widths = read(bindings['width-check.json'].path);
  assert.equal(render.spec.sha256, bindings['candidate/spec.json'].sha256);
  assert.equal(render.output.svg.sha256, bindings['candidate/figure.svg'].sha256);
  const images = [source, ...[331, 342, 640].map(width => bindings[`candidate/display-${width}.png`])];
  const imageLedger = images.map((image, index) => ({
    openIndexInBatch: globalLedger.length + index + 1,
    figure: definition.figure,
    role: index === 0 ? 'source-png' : 'candidate-display',
    ...image,
    tool: 'functions.view_image',
    opens: 1,
    reopened: false,
    cropped: false,
    ...(index === 0 ? {} : { actualMediaWidthPx: [331, 342, 640][index - 1] }),
  }));
  globalLedger.push(...imageLedger);
  const widthObservations = widths.receipts.map(receipt => {
    const width = receipt.width;
    assert.equal(receipt.screenshot.sha256, bindings[`candidate/display-${width}.png`].sha256);
    const target = receipt.dom.labels.find(label => label.id === definition.label);
    const reference = receipt.dom.labels.find(label => label.id ===
      (definition.figure === 'fig-182' ? 'opening-small-label' : 's164-o1-label'));
    return {
      actualMediaWidthPx: width,
      image: bindings[`candidate/display-${width}.png`],
      screenshotDimensionsPx: [receipt.pixels.width, receipt.pixels.height],
      independentVisualVerdict: 'PASS',
      observations: definition.observations[width],
      authorMeasurementsReusedNotRerun: {
        evidence: bindings['width-check.json'],
        headless: widths.headless,
        measuredTargetTextPx: target.px,
        targetBoundsPx: [target.left, target.top, target.right, target.bottom],
        inMedia: target.inMedia,
        overlappingLabelIds: receipt.dom.overlap,
        darkGlyphPixelsInTargetBox: receipt.pixels.dDark,
        referenceLabel: reference.id,
        referenceBoundsPx: [reference.left, reference.top, reference.right, reference.bottom],
        clearancePx: definition.figure === 'fig-182'
          ? { horizontalToSmallOpening: reference.left - target.right }
          : { verticalBelowO1: target.top - reference.bottom },
        limitations: 'Existing local SVG DOM/pixel evidence, not a newly executed check, full-card DISPLAY, or independently measured geometry.',
      },
    };
  });
  const review = {
    schema: 'stemrobin-181/affected-label-review@1',
    ticket: 'STEMROBIN-181',
    stage: 'D530',
    figure: `10p ${definition.figure}`,
    reviewedAt,
    status: 'PASS',
    statusScope: 'changed-label-placement-only',
    reviewerIsAuthor: false,
    reviewerRole: 'Sole independent affected-figure reviewer in this user-authorized continuation.',
    independence: {
      authoredCandidate: false,
      inheritedImageHistory: false,
      forkContext: false,
      authorEvidenceReadAsSupportingEvidenceOnly: true,
      verdictBasedOnOwnEightPermittedImageOpens: true,
      priorApprovalInherited: false,
    },
    changedLabel: {
      object: definition.object,
      svgLabel: definition.label,
      property: 'at',
      before: definition.before,
      after: definition.after,
      onlyLabelPlacementApproved: true,
    },
    bindings: {
      source,
      spec: bindings['candidate/spec.json'],
      svg: bindings['candidate/figure.svg'],
      render: bindings['candidate/render.json'],
      reviewedImages: images,
      beforeSpec: bindings['before/spec.json'],
      beforeSvg: bindings['before/figure.svg'],
      beforeRender: bindings['before/render.json'],
      repair: bindings['repair.json'],
      affectedCheck: bindings['affected-check.json'],
      widthCheck: bindings['width-check.json'],
      authorObservations: bindings['author-observations.json'],
      renderReceipt: bindings['render-receipt.json'],
      authorRepairScript: bind(path.join(root, `repair-${definition.figure.replace('-', '')}-label.mjs`)),
      authorWidthScript: bind(path.join(root, definition.figure === 'fig-182'
        ? 'check-fig182-label.mjs' : 'check-fig-164-label.mjs')),
      reviewerRecordingScript: scriptBinding,
      applicableLocalRules: gates,
    },
    independentReadOnlyDifferenceInspection: {
      method: 'Recursive structured JSON comparison and Python standard-library ElementTree comparison of old/new SVG XML, including all attributes, text, tails, tags, and children. No renderer or browser was invoked.',
      actualSpecDifferences: definition.specDifferences,
      actualSvgDifferences: definition.svgDifferences,
      allOtherSpecAndSvgContentUnchanged: true,
      sourceHashUnchanged: true,
      sourceTextUnchanged: true,
      noManualSvgEditByReviewer: true,
    },
    sourceAndTextContext: {
      independentSourcePixelObservationsScopedToLabel: definition.sourceObservations,
      authoritativeTextLocation: 'source.authoritativeText in the hash-pinned candidate/spec.json; relevant bilingual passages only. No DB or live lesson was accessed.',
      relevantTextEntries: spec.source.authoritativeText
        .map((entry, index) => ({ jsonPointer: `/source/authoritativeText/${index}`, lesson: entry.lesson, text: entry.text }))
        .filter(entry => definition.textSelection(entry.text)),
      meaningUsedForLabelAttribution: definition.textMeaning,
      fullSourceInventoryOrWholeFigureReapprovalPerformed: false,
    },
    existingMechanicalEvidence: {
      provenance: 'Read existing author scripts, before/current render reports, receipts, and width/pixel evidence; passed commands were not rerun.',
      nativeRenderStatus: render.status,
      objects: render.objects,
      labels: render.labels,
      currentCollisions: render.collisions,
      declaredDisplay: spec.display,
      originalFailedRenderStatus: read(bindings['before/render.json'].path).status,
      countEvidenceIsNotSourceFidelityApproval: true,
      formalFullCardDisplayReplayed: false,
    },
    imageLedger,
    imageOpensThisFigure: 4,
    totalImageOpensInBatch: 8,
    widthObservations,
    affectedChecks: definition.checks,
    reviseFindings: [],
    holdOnChangedLabel: false,
    approvalBoundary: {
      fullLdS10yImageReview: false,
      notSchemaLdS10yImageReview1: true,
      notPromotableByThisReview: true,
      ...definition.overall,
      historicalFailAndRepair1Preserved: true,
      sourceGeometryOrAssertionsApprovedByThisReview: false,
      canonicalAssetModified: false,
      historicalOrParentReviewModified: false,
      productionMeterModified: false,
      promoted: false,
      published: false,
    },
  };
  completed.push({
    figure: review.figure,
    affectedLabel: definition.object,
    affectedVerdict: review.status,
    statusScope: review.statusScope,
    reviewerIsAuthor: false,
    overallApproval: review.approvalBoundary.wholeFigureApproval,
    report: writeNew(`${definition.figure}-affected-review.json`, review),
  });
}

assert.equal(globalLedger.length, 8);
const aggregate = writeNew('aggregate.json', {
  schema: 'stemrobin-181/affected-label-review-batch@1',
  ticket: 'STEMROBIN-181',
  stage: 'D530',
  reviewedAt,
  status: 'AFFECTED_REVIEWS_RECEIVED',
  reviewerIsAuthor: false,
  scope: 'Only the changed fig182 d label and fig164 Principal axis caption.',
  affectedReviews: completed,
  imageOpenCount: 8,
  imageOpenLimit: 8,
  exactImageLedger: globalLedger,
  additionalImagesOpened: 0,
  reopens: 0,
  crops: 0,
  nativePreviewImagesOpenedSeparately: 0,
  imagePayloadsReturnedToParent: false,
  oldImagesOrParentImageHistoryInherited: false,
  fullFigureOrMathematicalApprovalGranted: false,
  retainedBoundaries: [
    'fig182 aperture image-side versus prose before-objective scientific/source-fidelity HOLD remains.',
    'fig181 missing paid output HOLD remains; no repurchase.',
    'fig164 historical FAIL/repair1 and pre-existing interior-mark/heavy-stroke source HOLDs remain.',
    'No overall figure, course, publication, or promotion approval is inferred from affected-label PASS.',
  ],
  actionsNotPerformed: [
    'Rendering, paid generation, global audits/tests, DB access, capability restart, bootstrap.',
    'Creating chats, worktrees, branches, children, or messaging any thread.',
    'Credential, model, quota, canonical asset, parent review, or production-meter changes.',
    'Publishing, merging, deploying, or closing.',
  ],
  filesCreated: [
    scriptBinding.path,
    ...completed.map(item => item.report.path),
    path.join(output, 'aggregate.json'),
  ],
  preExistingFilesModified: [],
});
console.log(JSON.stringify({ affectedReviews: completed, aggregate, imagesOpened: 8, filesCreated: 4 }, null, 2));
