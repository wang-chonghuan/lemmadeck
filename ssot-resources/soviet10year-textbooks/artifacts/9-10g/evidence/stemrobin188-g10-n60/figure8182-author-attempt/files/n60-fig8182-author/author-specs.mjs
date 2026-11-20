import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.dirname(new URL(import.meta.url).pathname);
const [number, attempt] = process.argv.slice(2);
if (!['81', '82'].includes(number) || attempt !== 'draft-01') throw new Error('Initial drafts only');
const id = `fig-g10-${number}`;
const inventoryPath = path.join(root, `${id}.FIRST.inventory.json`);
const inventoryBytes = fs.readFileSync(inventoryPath);
const first = JSON.parse(inventoryBytes);
const inventorySha = crypto.createHash('sha256').update(inventoryBytes).digest('hex');
if ((fs.statSync(inventoryPath).mode & 0o777) !== 0o444) throw new Error('FIRST must be sealed');
const context = JSON.parse(fs.readFileSync(path.join(path.dirname(root), `n60-fig8182-author-inputs-01/${id}.context.json`)));
const spec = {
  schema: 'ld-s10y-image/figure-spec@2',
  id,
  mode: 'deterministic',
  description: '',
  source: {
    image: first.source,
    authoritativeText: context.completeEditionProse.filter(item =>
      item.kind === 'p' && item.source_refs.some(ref =>
        (number === '81' ? ['p0216#9', 'p0217#1', 'p0217#2'] : ['p0217#7']).includes(ref)))
      .map(item => ({ lesson: context.lesson, text: item.text })),
    inventory: [],
  },
  canvas: {},
  display: { layout: 'inline', purpose: 'instructional', widths: [480, 300], minTextPx: 16, maxWidthPx: 480 },
  objects: [],
  assertions: [],
  layout: { minLabelGap: 2 },
};
const mapping = {
  schema: 'stemrobin188-author-inventory-mapping@1',
  figure: id,
  first: { path: inventoryPath, sha256: inventorySha, mode: '0444' },
  namedSourcePoints: [],
  unmarkedConstructionLoci: [],
  modernRegularization: [],
  sourceHolds: first.holds,
  geometryRenderer: 'Existing JSXGraph FigureSpec@2',
  semanticApproval: false,
};
const group = (id, description, requires = []) => {
  const value = { id, description, objects: [], assertions: [], ...(requires.length ? { requires } : {}) };
  spec.source.inventory.push(value);
  return value;
};
const object = (group, value) => {
  spec.objects.push(value);
  group.objects.push(value.id);
  return value.id;
};
const relation = (group, value) => {
  spec.assertions.push({ tolerance: 1e-7, ...value });
  group.assertions.push(value.id);
  return value.id;
};
const point = (g, id, at, label, options = {}) => object(g, {
  id, type: 'point', at, label, visible: false, fontSize: 32, fontWeight: 500,
  stroke: 'ink', fill: 'ink', ...options,
});
const segment = (g, id, from, to, options = {}) => object(g, {
  id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 3, ...options,
});
const text = (g, id, at, value, options = {}) => object(g, {
  id, type: 'text', at, text: value, fontSize: 44, fontWeight: 500,
  labelColor: 'ink', labelPlacement: { position: 'CENTER', gap: 0 }, ...options,
});
const ellipse = (g, id, center, rx, ry, half, options = {}) => {
  const x = center[0], y = spec.canvas.height - center[1];
  const d = half === 'full'
    ? `M ${x-rx} ${y} A ${rx} ${ry} 0 1 1 ${x+rx} ${y} A ${rx} ${ry} 0 1 1 ${x-rx} ${y}`
    : `M ${x-rx} ${y} A ${rx} ${ry} 0 0 ${half === 'rear' ? 1 : 0} ${x+rx} ${y}`;
  return object(g, { id, type: 'svgPath', d, stroke: 'ink', strokeWidth: 3, ...options });
};

if (number === '81') {
  spec.canvas = { width: 480, height: 640, boundingBox: [0, 640, 480, 0], background: 'paper' };
  spec.description = `Cylinder and its defining diameter rectangle, axis and M/N interior generator. FIRST ${inventorySha}; duplicate O-like center labels retained without invented subscripts. All alignment is explicit modern regularization, not source measured data.`;
  const g = group('cylinder', 'Single source cylinder; all eight defining labelled points, both base ellipses, solid side edges, dashed lower diameter, axis and MN. Modern exact alignment and repeated O visual forms do not clear source codepoints.', ['pointRelationships']);
  const P = {
    'top-left': [115, 480], 'top-center': [240, 480], 'top-right': [365, 480],
    'bottom-left': [115, 180], 'bottom-center': [240, 180], 'bottom-right': [365, 180],
    M: [280, 455], N: [280, 155],
  };
  point(g, 'top-left', P['top-left'], 'A', { labelPlacement: { position: 'W' } });
  point(g, 'top-center', P['top-center'], 'O', { visible: true, size: 3, labelPlacement: { position: 'N', offset: [0, -22] } });
  point(g, 'top-right', P['top-right'], 'A\u2081', { fontSize: 40, labelPlacement: { position: 'E' } });
  point(g, 'bottom-left', P['bottom-left'], 'B', { labelPlacement: { position: 'W' } });
  point(g, 'bottom-center', P['bottom-center'], 'O', { visible: true, size: 3, labelPlacement: { position: 'NE', offset: [14, -12] } });
  point(g, 'bottom-right', P['bottom-right'], 'B\u2081', { fontSize: 40, labelPlacement: { position: 'E' } });
  point(g, 'M', P.M, 'M', { visible: true, size: 3, labelPlacement: { position: 'E' } });
  point(g, 'N', P.N, 'N', { visible: true, size: 3, labelPlacement: { position: 'E', offset: [0, -2] } });
  ellipse(g, 'upper-base-ellipse', P['top-center'], 125, 65, 'full');
  ellipse(g, 'lower-base-rear-arc', P['bottom-center'], 125, 65, 'rear', { dash: 2 });
  ellipse(g, 'lower-base-front-arc', P['bottom-center'], 125, 65, 'front');
  const edges = [
    ['upper-diameter', 'top-left', 'top-right', {}],
    ['lower-diameter', 'bottom-left', 'bottom-right', { dash: 2 }],
    ['left-generator', 'top-left', 'bottom-left', {}],
    ['right-generator', 'top-right', 'bottom-right', {}],
    ['center-axis', 'top-center', 'bottom-center', { dash: 2 }],
    ['MN-generator', 'M', 'N', { dash: 2 }],
  ];
  for (const [id, from, to, style] of edges) {
    segment(g, id, from, to, style);
    relation(g, { id: `${id}-endpoints`, type: 'connects', arrow: id, from, to });
  }
  relation(g, { id: 'upper-diameter-collinear', type: 'collinear', a: 'top-left', b: 'top-center', c: 'top-right' });
  relation(g, { id: 'lower-diameter-collinear', type: 'collinear', a: 'bottom-left', b: 'bottom-center', c: 'bottom-right' });
  relation(g, { id: 'upper-center-midpoint', type: 'equalDistance', a: 'top-left', b: 'top-center', c: 'top-center', d: 'top-right' });
  relation(g, { id: 'lower-center-midpoint', type: 'equalDistance', a: 'bottom-left', b: 'bottom-center', c: 'bottom-center', d: 'bottom-right' });
  for (const [top, bottom] of [['top-left', 'bottom-left'], ['top-center', 'bottom-center'], ['top-right', 'bottom-right'], ['M', 'N']]) {
    relation(g, { id: `${top}-${bottom}-translation`, type: 'displacement', from: top, to: bottom, dx: 0, dy: -300 });
  }
  relation(g, { id: 'equal-base-diameters', type: 'equalDistance', a: 'top-left', b: 'top-right', c: 'bottom-left', d: 'bottom-right' });
  relation(g, { id: 'MN-axis-parallel', type: 'parallel', a: 'M', b: 'N', c: 'top-center', d: 'bottom-center' });
  relation(g, { id: 'right-half-defining-rectangle', type: 'perpendicular', a: 'top-center', b: 'top-right', c: 'top-right', d: 'bottom-right' });
  relation(g, { id: 'M-interior-offset', type: 'displacement', from: 'top-center', to: 'M', dx: 40, dy: -25 });
  relation(g, { id: 'N-interior-offset', type: 'displacement', from: 'bottom-center', to: 'N', dx: 40, dy: -25 });
  mapping.namedSourcePoints = first.points.map(item => ({
    firstId: item.id, objectId: item.id, groupId: g.id, coordinate: P[item.id],
    assertions: g.assertions.filter(id => {
      const assertion = spec.assertions.find(item => item.id === id);
      return Object.values(assertion).includes(item.id);
    }),
  }));
  mapping.modernRegularization = [...first.justifiedModernRegularization];
  mapping.ellipseConstruction = {
    justification: 'FigureSpec@2 has no ellipse object. Analytic svgPath is the supported curve-only fallback; defining points, labels, lines and all relations remain native objects/assertions.',
    upper: { center: 'top-center', rx: 125, ry: 65, rim: ['top-left', 'top-right'] },
    lower: { center: 'bottom-center', rx: 125, ry: 65, rim: ['bottom-left', 'bottom-right'] },
    MInsideNormalizedDisk: (40 / 125) ** 2 + (25 / 65) ** 2,
    NInsideNormalizedDisk: (40 / 125) ** 2 + (25 / 65) ** 2,
  };
} else {
  spec.canvas = { width: 800, height: 720, boundingBox: [0, 720, 800, 0], background: 'paper' };
  spec.description = `Cylinder and connected whole-surface net. FIRST ${inventorySha}. The displayed C-like glyph is a visual proxy only, not a resolved Latin/Cyrillic source codepoint or conventional circumference-variable identity; preserve the source equality RHS. Modern a/b is profile transliteration. Geometry is exact from admitted text, not measured source pixels.`;
  const a = group('a-cylinder', 'Source unmarked cylindrical base/axis/radius junctions are literal construction coordinates, not invented point dots or labels. Every defining locus has group-contained executable relations; no objectCount substitute.');
  const b = group('b-net', 'Source rectangle and both connected circular bases. All unmarked corners, centers and contacts are literal construction coordinates, fully covered by group-contained assertions. C-shaped glyph uncertainty remains; modern b) is transliteration.');
  const r = 75, h = 200, xLeft = 260, xRight = xLeft + 2 * Math.PI * r, xCenter = (xLeft + xRight) / 2;
  const P = {
    'a-top-left': [55, 500], 'a-top-center': [130, 500], 'a-top-right': [205, 500],
    'a-bottom-left': [55, 300], 'a-bottom-center': [130, 300], 'a-bottom-right': [205, 300],
    'b-top-left': [xLeft, 500], 'b-top-right': [xRight, 500],
    'b-bottom-left': [xLeft, 300], 'b-bottom-right': [xRight, 300],
    'b-upper-circle-center': [xCenter, 575], 'b-upper-circle-contact': [xCenter, 500],
    'b-lower-circle-center': [xCenter, 225], 'b-lower-circle-contact': [xCenter, 300],
  };
  const use = id => P[id];
  const literalEdges = (g, values) => {
    for (const [id, from, to, style] of values) {
      segment(g, id, use(from), use(to), style);
      relation(g, { id: `${id}-endpoints`, type: 'connects', arrow: id, from: use(from), to: use(to) });
    }
  };
  ellipse(a, 'a-upper-base', use('a-top-center'), r, 35, 'full');
  ellipse(a, 'a-lower-rear-arc', use('a-bottom-center'), r, 35, 'rear', { dash: 2 });
  ellipse(a, 'a-lower-front-arc', use('a-bottom-center'), r, 35, 'front');
  literalEdges(a, [
    ['a-left-generator', 'a-top-left', 'a-bottom-left', {}],
    ['a-right-generator', 'a-top-right', 'a-bottom-right', {}],
    ['a-axis', 'a-top-center', 'a-bottom-center', { dash: 2 }],
    ['a-top-radius', 'a-top-left', 'a-top-center', {}],
    ['a-bottom-radius', 'a-bottom-left', 'a-bottom-center', { dash: 2 }],
  ]);
  text(a, 'a-H', [24, 400], 'H');
  text(a, 'a-R', [24, 300], 'R');
  text(a, 'a-panel', [130, 170], 'a)');
  relation(a, { id: 'a-upper-center-midpoint', type: 'equalDistance', a: use('a-top-left'), b: use('a-top-center'), c: use('a-top-center'), d: use('a-top-right') });
  relation(a, { id: 'a-lower-center-midpoint', type: 'equalDistance', a: use('a-bottom-left'), b: use('a-bottom-center'), c: use('a-bottom-center'), d: use('a-bottom-right') });
  relation(a, { id: 'a-rim-height', type: 'distance', a: use('a-top-left'), b: use('a-bottom-left'), value: h });
  relation(a, { id: 'a-radius-value', type: 'distance', a: use('a-bottom-left'), b: use('a-bottom-center'), value: r });
  relation(a, { id: 'a-radius-axis-perpendicular', type: 'perpendicular', a: use('a-top-left'), b: use('a-top-center'), c: use('a-top-center'), d: use('a-bottom-center') });
  literalEdges(b, [
    ['b-top-edge', 'b-top-left', 'b-top-right', {}],
    ['b-bottom-edge', 'b-bottom-left', 'b-bottom-right', {}],
    ['b-left-edge', 'b-top-left', 'b-bottom-left', {}],
    ['b-right-edge', 'b-top-right', 'b-bottom-right', {}],
  ]);
  object(b, { id: 'b-upper-circle', type: 'circle', center: use('b-upper-circle-center'), radius: r, stroke: 'ink', strokeWidth: 3 });
  object(b, { id: 'b-lower-circle', type: 'circle', center: use('b-lower-circle-center'), radius: r, stroke: 'ink', strokeWidth: 3 });
  text(b, 'b-H', [770, 400], 'H');
  text(b, 'b-width-equation', [xCenter, 340], 'C = 2\u03c0R');
  text(b, 'b-panel', [740, 170], 'b)');
  relation(b, { id: 'b-width-from-admitted-text', type: 'distance', a: use('b-top-left'), b: use('b-top-right'), value: 2 * Math.PI * r });
  relation(b, { id: 'b-height-from-admitted-text', type: 'distance', a: use('b-top-right'), b: use('b-bottom-right'), value: h });
  relation(b, { id: 'b-opposite-horizontal-edges', type: 'parallel', a: use('b-top-left'), b: use('b-top-right'), c: use('b-bottom-left'), d: use('b-bottom-right') });
  relation(b, { id: 'b-opposite-vertical-edges', type: 'parallel', a: use('b-top-left'), b: use('b-bottom-left'), c: use('b-top-right'), d: use('b-bottom-right') });
  relation(b, { id: 'b-rectangle-right-angle', type: 'perpendicular', a: use('b-top-left'), b: use('b-top-right'), c: use('b-top-right'), d: use('b-bottom-right') });
  for (const side of ['upper', 'lower']) {
    const center = `b-${side}-circle-center`, contact = `b-${side}-circle-contact`;
    const edge = side === 'upper' ? ['b-top-left', 'b-top-right'] : ['b-bottom-left', 'b-bottom-right'];
    relation(b, { id: `b-${side}-contact-on-edge`, type: 'pointOnLine', point: use(contact), a: use(edge[0]), b: use(edge[1]) });
    relation(b, { id: `b-${side}-contact-on-circle`, type: 'pointOnCircle', point: use(contact), center: use(center), radius: r });
    relation(b, { id: `b-${side}-tangent-radius`, type: 'perpendicular', a: use(center), b: use(contact), c: use(edge[0]), d: use(edge[1]) });
    relation(b, { id: `b-${side}-contact-midpoint`, type: 'equalDistance', a: use(edge[0]), b: use(contact), c: use(contact), d: use(edge[1]) });
  }
  relation(b, { id: 'b-two-equal-base-radii', type: 'equalDistance', a: use('b-upper-circle-center'), b: use('b-upper-circle-contact'), c: use('b-lower-circle-center'), d: use('b-lower-circle-contact') });
  const coordinateFields = ['a', 'b', 'c', 'd', 'point', 'center', 'from', 'to'];
  mapping.unmarkedConstructionLoci = first.points.map(item => {
    const g = item.id.startsWith('a-') ? a : b;
    return {
      firstId: item.id, coordinate: use(item.id), groupId: g.id,
      visibleBoundaryObjects: g.objects.filter(id => spec.objects.find(obj => obj.id === id).type !== 'text'),
      assertions: g.assertions.filter(id => {
        const value = spec.assertions.find(item => item.id === id);
        return coordinateFields.some(field => JSON.stringify(value[field]) === JSON.stringify(use(item.id)));
      }),
      representation: 'Literal coordinates in visible boundary geometry; no fictitious dots or point-name labels',
    };
  });
  mapping.literalPointContract = {
    canonicalRequires: 'pointRelationships applies to groups with declared point objects; this source has no marked/named point objects. Using hidden unlabeled point objects in source.inventory would falsely satisfy neither visibility nor fidelity.',
    supplementalExecutableCoverage: 'All 14 inventoried unmarked loci are checked against native assertion coordinate fields and visible group boundary objects, with no group escape. These assertions themselves execute in validate_spec.py.',
    weakeningOrObjectCountSubstitution: false,
  };
  mapping.modernRegularization = [...first.justifiedModernRegularization,
    'Radius R is moved immediately outside the small lower ellipse, beside its left radius endpoint, to preserve min16 mobile legibility without new dots or leaders. It remains the same radius label, not a source-position fact.'];
  mapping.glyphBinding = {
    sourceVisual: 'C-like open curved leading glyph',
    renderedVisualProxy: 'C',
    renderingTokenCodepoint: 'U+0043 chosen only as a C-shaped visual proxy',
    sourceCodepoint: null,
    sourceLatinOrCyrillicIdentityCleared: false,
    conventionalCircumferenceMeaningAssigned: false,
    symbolSubstitutionInferredFromFormula: false,
    retainedEquationRightSide: '2 pi R',
    historicalHold: 'H217-FIG82-LEADING-GLYPH',
  };
  mapping.panelTransliteration = { sourceFacts: 'a-shaped/be-shaped markers, exact codepoints unresolved', modernProfileChoice: ['a)', 'b)'], sourceCodepointsCleared: false };
  mapping.ellipseConstruction = { rx: r, ry: 35, topCenter: use('a-top-center'), bottomCenter: use('a-bottom-center'), exactModernProjectionNotSourceMeasurement: true };
}
const dir = path.join(root, id, attempt);
if (fs.existsSync(dir)) throw new Error('Never overwrite an actual draft');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'spec.json'), JSON.stringify(spec, null, 2) + '\n');
fs.writeFileSync(path.join(dir, 'mapping.json'), JSON.stringify(mapping, null, 2) + '\n');
console.log(JSON.stringify({ figure: id, attempt, spec: path.join(dir, 'spec.json'), firstSha256: inventorySha }));
