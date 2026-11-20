import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.dirname(fileURLToPath(import.meta.url));
const authorizedRoot = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8384-author');
if (root !== authorizedRoot || process.cwd() !== repo) throw new Error('Wrong author root or cwd');
const manifestPath = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8384-author-inputs-01/manifest.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size });
const write = (name, value) => {
  const target = path.join(root, name);
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  fs.chmodSync(target, 0o444);
  return bind(target);
};
const manifest = read(manifestPath);
const expectedFIRST = {
  'fig-g10-83': '9db9a4086bd6d7289b194641b3c098b2df3922ed8c01e720102ea35e753f0620',
  'fig-g10-84': '5ee105a028049fdcb1880b6f2dbd6dcd5eedab543ad94f9c192aadb18b644321',
};
const seals = manifest.figures.map(entry => {
  const inventory = path.join(root, `${entry.id}.original-FIRST.inventory.json`);
  if (hash(inventory) !== expectedFIRST[entry.id]) throw new Error('FIRST inventory drift');
  if ((fs.statSync(inventory).mode & 0o777) !== 0o444) throw new Error('FIRST must be sealed');
  if (hash(entry.sourceImage.path) !== entry.sourceImage.sha256) throw new Error('Original image drift');
  return {
    figure: entry.id, source: bind(entry.sourceImage.path), inventory: bind(inventory),
    permissions: '0444', imageOpenOrdinal: read(inventory).imageOpenOrdinal,
    sealOrder: entry.id === 'fig-g10-83'
      ? 'original83 alone -> FIRST83 write -> chmod0444 -> sha256 -> original84'
      : 'original84 alone -> FIRST84 write -> chmod0444 -> sha256 -> complete contexts/contracts',
    semanticApproval: false,
  };
});
const phase = process.argv[2];
if (phase === 'before') {
  const bindings = manifest.bindings.map(entry => ({
    ...bind(entry.path), expectedSha256: entry.sha256, matchesManifest: hash(entry.path) === entry.sha256,
  }));
  if (bindings.length !== 12 || bindings.some(entry => !entry.matchesManifest)) throw new Error('Input binding drift');
  write('bindings-before.json', { schema: 'bounded-author/bindings@1', phase, bindings });
  write('original-FIRST.seals.json', { schema: 'bounded-author/FIRST-seals@1', seals });
  console.log('Bound all 12 supplied inputs; both pixel FIRSTs remain 0444 and hash-current.');
} else if (phase === 'drafts') {
  if (!fs.existsSync(path.join(root, 'bindings-before.json'))) throw new Error('Missing BEFORE bindings');
  const point = (id, at, label, position, extra = {}) => ({
    id, type: 'point', at, ...(label ? { label } : {}),
    visible: true, size: 1, strokeWidth: 1, stroke: 'ink', fill: 'ink',
    fontSize: 28, fontWeight: 400,
    ...(position ? { labelPlacement: { position, gap: position === 'N' ? 24 : 18 } } : {}),
    ...extra,
  });
  const segment = (id, from, to, dashed = false) => ({
    id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 3,
    ...(dashed ? { dash: 2 } : {}),
  });
  const connects = object => ({
    id: `${object.id}-connectivity`, type: 'connects',
    arrow: object.id, from: object.from, to: object.to,
  });
  const offset = (id, from, to, dx, dy) => ({
    id, type: 'displacement', from, to, dx, dy, tolerance: 1e-9,
  });
  const distance = (id, a, b, value) => ({
    id, type: 'distance', a, b, value, tolerance: 1e-9,
  });
  const canvas = height => ({
    width: 480, height, boundingBox: [0, height / 20, 24, 0],
    background: 'paper', keepAspectRatio: true,
  });
  const screen = (at, c) => [
    (at[0] - c.boundingBox[0]) * c.width / (c.boundingBox[2] - c.boundingBox[0]),
    (c.boundingBox[1] - at[1]) * c.height / (c.boundingBox[1] - c.boundingBox[3]),
  ];
  const sourceText = (context, figure) => context.completeEditionProse
    .filter(item => item.kind === 'p' && (figure === 'fig-g10-83'
      ? item.source_refs.some(ref => ['p0218#10', 'p0218#11', 'p0218#12'].includes(ref))
      : item.source_refs.includes('p0219#6')))
    .map(item => ({ lesson: context.lesson, text: item.text }));

  function cone(prefix, model, c, labels) {
    const { center, radius, elevationSin, height, generatorAzimuth } = model;
    const verticalRadius = radius * elevationSin;
    const projectedHeight = height * Math.sqrt(1 - elevationSin ** 2);
    const tangentSin = verticalRadius / projectedHeight;
    if (!(tangentSin > 0 && tangentSin < 1)) throw new Error('Degenerate cone projection');
    const tangentAngle = Math.asin(tangentSin);
    const angles = { B: Math.PI - tangentAngle, C: tangentAngle, A: generatorAzimuth };
    const rim = angle => [
      center[0] + radius * Math.cos(angle),
      center[1] + verticalRadius * Math.sin(angle),
    ];
    const positions = {
      O: center, S: [center[0], center[1] + projectedHeight],
      B: rim(angles.B), C: rim(angles.C), A: rim(angles.A),
    };
    const ids = Object.fromEntries(Object.keys(positions).map(key => [key, `${prefix}-${key}`]));
    const points = Object.entries(positions).map(([key, at]) => point(
      ids[key], at, labels[key], { S: 'N', O: 'E', B: 'W', C: 'E', A: 'SW' }[key],
      key === 'A' ? { labelPlacement: { position: 'SW', gap: 20, offset: [-2, 8] } } : {},
    ));
    const lines = [
      segment(`${prefix}-SB`, ids.S, ids.B),
      segment(`${prefix}-SC`, ids.S, ids.C),
      segment(`${prefix}-SA`, ids.S, ids.A),
      segment(`${prefix}-SO`, ids.S, ids.O, true),
      segment(`${prefix}-OA`, ids.O, ids.A, true),
      ...(labels.B ? [segment(`${prefix}-OB`, ids.O, ids.B, true)] : []),
    ];
    const assertions = [
      offset(`${prefix}-axis-projection`, ids.O, ids.S, 0, projectedHeight),
      distance(`${prefix}-axis-length`, ids.O, ids.S, projectedHeight),
      ...['B', 'C', 'A'].map(key => offset(
        `${prefix}-${key}-rotated-radius-projection`, ids.O, ids[key],
        radius * Math.cos(angles[key]), verticalRadius * Math.sin(angles[key]),
      )),
      ...lines.map(connects),
    ];
    const rx = radius * 20;
    const ry = verticalRadius * 20;
    const coord = at => screen(at, c).map(number => Number(number.toFixed(9))).join(' ');
    // Exact projected-circle arcs; splitting at A binds the interior generator to the rim.
    const paths = [
      {
        id: `${prefix}-front-rim`, type: 'svgPath', stroke: 'ink', strokeWidth: 3,
        d: `M ${coord(positions.B)} A ${rx} ${ry} 0 0 0 ${coord(positions.A)} A ${rx} ${ry} 0 0 0 ${coord(positions.C)}`,
      },
      {
        id: `${prefix}-rear-rim`, type: 'svgPath', stroke: 'ink', strokeWidth: 3, dash: 2,
        d: `M ${coord(positions.C)} A ${rx} ${ry} 0 0 0 ${coord(positions.B)}`,
      },
    ];
    return {
      objects: [...points, ...lines, ...paths], assertions, ids, positions, angles,
      mapping: {
        construction: 'Orthographic projection of a right circular cone obtained by rotating the SOA right triangle about SO.',
        projection: 'P(x,y,z)=(center.x+x, center.y+elevationSin*y+sqrt(1-elevationSin^2)*z)',
        sourceParameters: 'NONE; all lengths, elevation and azimuth below are non-visible modern composition choices.',
        model, projectedHeight, verticalRadius, tangentSin,
        baseCircle: 'V(t)=(R*cos(t),R*sin(t),0); O=(0,0,0); S=(0,0,height).',
        silhouette: 'sin(tangentAngle)=verticalRadius/projectedHeight; tangents touch the projected circle at B and C.',
        visibleRim: 'B -> A -> C counterclockwise in model space, through the lower/front arc; C -> B upper/rear arc dashed.',
        pointMapping: Object.entries(ids).map(([key, id]) => ({
          inventoryPoint: key, specPoint: id,
          executableAssertions: assertions.filter(assertion =>
            [assertion.from, assertion.to, assertion.a, assertion.b].includes(id)).map(assertion => assertion.id),
        })),
        pathMapping: paths.map(object => ({
          object: object.id,
          endpoints: object.id.endsWith('front-rim') ? [ids.B, ids.A, ids.C] : [ids.C, ids.B],
          bindsToModel: 'Analytic ellipse parameters and endpoints; source-screen transform uses 20 pixels per user unit.',
        })),
        noSymmetryAnswer: true, noPrintedDimensions: true,
      },
    };
  }

  for (const entry of manifest.figures) {
    if (hash(entry.context.path) !== entry.context.sha256) throw new Error('Context drift');
    const context = read(entry.context.path);
    const is83 = entry.id === 'fig-g10-83';
    const c = canvas(is83 ? 480 : 320);
    let model;
    let net;
    if (is83) {
      const radius = 7.6;
      const elevationSin = 0.38;
      const height = 14.8 / Math.sqrt(1 - elevationSin ** 2);
      model = { center: [12, 6.4], radius, elevationSin, height, generatorAzimuth: 230 * Math.PI / 180 };
    } else {
      const slantLength = 6.1;
      const sectorAngle = 152 * Math.PI / 180;
      const radius = slantLength * sectorAngle / (2 * Math.PI);
      model = {
        center: [4.05, 7.25], radius, elevationSin: 0.33,
        height: Math.sqrt(slantLength ** 2 - radius ** 2),
        generatorAzimuth: 230 * Math.PI / 180,
      };
      const S = [15.2, 12.6];
      const startAngle = 197 * Math.PI / 180;
      const endAngle = startAngle + sectorAngle;
      const rim = angle => [S[0] + slantLength * Math.cos(angle), S[1] + slantLength * Math.sin(angle)];
      net = {
        slantLength, sectorAngle, startAngle, endAngle,
        S, A: rim(startAngle), A1: rim(endAngle),
      };
    }
    const coneData = cone(is83 ? '83-cone' : '84-cone', model, c, {
      S: 'S', O: 'O', A: 'A', ...(is83 ? { B: 'B', C: 'C' } : {}),
    });
    const objects = [...coneData.objects];
    const assertions = [...coneData.assertions];
    const coneGroupId = is83 ? '83-cone-projection' : '84-cone-panel';
    const inventory = [{
      id: coneGroupId,
      description: `Sealed pixel FIRST: ${entry.id}.original-FIRST.inventory.json group ${coneGroupId}. All apex/rim/center labels and solid/dashed generators and rim halves retained. Modern regularization: analytic projected circular base and true silhouette tangency; unlabeled tiny junctions are not new mathematical labels. No source numerical measurements, angle marks, arrows or symmetry-answer annotations.`,
      objects: objects.map(object => object.id),
      assertions: assertions.map(assertion => assertion.id),
      requires: ['pointRelationships'],
    }];
    const mapping = {
      schema: 'bounded-author/defining-relationship-mapping@1',
      figure: entry.id, FIRST: seals.find(seal => seal.figure === entry.id),
      completeContext: bind(entry.context.path), cone: coneData.mapping,
      modernRegularization: [
        'Clean analytic linework, circular-cone orthographic model, true silhouette tangency, representative proportions and viewing elevation are modern choices, not source givens.',
        'Only the labels visible in the original are printed; O is the conventional edition interpretation of the center-like glyph, not clearance of its original codepoint.',
        'No hidden radius to the right, detached base disk, rotation arrow, numerical measurement or answer annotation added.',
      ],
      review: 'PENDING independent review; author-native evidence is not approval',
    };
    if (net) {
      const netPoints = [
        point('84-sector-S', net.S, 'S', 'N'),
        point('84-sector-A', net.A, 'A', 'W'),
        point('84-sector-A1', net.A1, 'A\u2081', 'E'),
      ];
      const netLines = [
        segment('84-sector-SA', '84-sector-S', '84-sector-A'),
        segment('84-sector-SA1', '84-sector-S', '84-sector-A1'),
      ];
      const netArc = {
        id: '84-sector-outer-arc', type: 'arc', center: '84-sector-S',
        start: '84-sector-A', end: '84-sector-A1', stroke: 'ink', strokeWidth: 3,
      };
      const netAssertions = [
        ...netLines.map(connects),
        distance('84-sector-SA-generator-length', '84-sector-S', '84-sector-A', net.slantLength),
        distance('84-sector-SA1-generator-length', '84-sector-S', '84-sector-A1', net.slantLength),
        { id: '84-sector-equal-generators', type: 'equalDistance', a: '84-sector-S', b: '84-sector-A', c: '84-sector-S', d: '84-sector-A1', tolerance: 1e-9 },
        { id: '84-sector-A-on-outer-circle', type: 'pointOnCircle', point: '84-sector-A', center: '84-sector-S', radius: net.slantLength, tolerance: 1e-9 },
        { id: '84-sector-A1-on-outer-circle', type: 'pointOnCircle', point: '84-sector-A1', center: '84-sector-S', radius: net.slantLength, tolerance: 1e-9 },
        offset('84-sector-opening-start', '84-sector-S', '84-sector-A', net.slantLength * Math.cos(net.startAngle), net.slantLength * Math.sin(net.startAngle)),
        offset('84-sector-opening-end', '84-sector-S', '84-sector-A1', net.slantLength * Math.cos(net.endAngle), net.slantLength * Math.sin(net.endAngle)),
      ];
      const panelA = { id: '84-cone-panel-marker', type: 'text', at: [4.05, 3.3], text: 'a)', fontSize: 28, fontWeight: 400, labelPlacement: { position: 'CENTER' }, labelColor: 'ink' };
      const panelB = { ...panelA, id: '84-sector-panel-marker', at: [15.2, 3.3], text: 'b)' };
      objects.push(...netPoints, ...netLines, netArc, panelA, panelB);
      inventory[0].objects.push(panelA.id);
      inventory.push({
        id: '84-sector-panel',
        description: 'Sealed pixel FIRST 84-sector-panel: exactly one sector, points S,A,A_1, two solid radii and one solid outer arc; original second panel marker modernized to English b). No base disk, flap or extra connection. Modern regularization uses a circular sector consistent with the cone slant length and base circumference; its angle and orientation are internal composition choices, not printed source measurements.',
        objects: [...netPoints, ...netLines, netArc, panelB].map(object => object.id),
        assertions: netAssertions.map(assertion => assertion.id),
        requires: ['pointRelationships'],
      });
      assertions.push(...netAssertions);
      mapping.net = {
        sourceCount: { panels: 2, cones: 1, sectors: 1, detachedBaseDisks: 0 },
        sourceConnectivity: ['cone S-A seam', 'sector S-A', 'sector S-A_1', 'sector A-A_1 outer arc'],
        pointMapping: netPoints.map(object => ({
          inventoryPoint: object.id.replace('84-sector-', ''), specPoint: object.id,
          executableAssertions: netAssertions.filter(assertion =>
            [assertion.from, assertion.to, assertion.a, assertion.b, assertion.c, assertion.d, assertion.point, assertion.center].includes(object.id)).map(assertion => assertion.id),
        })),
        arcMapping: { object: netArc.id, center: netArc.center, start: netArc.start, end: netArc.end, arc: 'counterclockwise lower arc, 152-degree internal representative opening; no angle label' },
        regularizationParameters: net,
        unfolding: {
          coneSlantLength: 'sqrt(height^2 + radius^2) = sector radius',
          circumference: 'sector radius * sectorAngle = 2*pi*cone radius',
          scope: 'Complete edition prose identifies lateral surface only. One sector, not the complete surface net; no correspondence arrows or symmetry inference.',
          executableConstruction: 'author.mjs derives cone radius from slantLength*sectorAngle/(2*pi) and cone height from sqrt(slantLength^2-radius^2); both panels use the same unscaled mathematical units.',
        },
      };
      mapping.modernRegularization.push('English panel markers a), b) and typographic A_1 subscript; original Latin/Cyrillic and fine-font HOLDs remain.');
    }
    const spec = {
      schema: 'ld-s10y-image/figure-spec@2', id: entry.id, mode: 'deterministic',
      description: is83
        ? 'Instructional right circular cone: inspect base, lateral surface, height and generators from the edition definition by rotation. No exercise symmetry answer or measurements are annotated.'
        : 'Instructional two-panel lateral-surface unfolding: one right circular cone and one sector, retaining the original seam and every visible label. No full-surface base disk or measurements are added.',
      source: {
        image: entry.sourceImage, authoritativeText: sourceText(context, entry.id), inventory,
      },
      canvas: c,
      display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 480, widths: [480, 300], minTextPx: 16 },
      layout: { minLabelGap: 2 },
      objects, assertions,
    };
    const specBinding = write(`${entry.id}.spec-FIRST.json`, spec);
    write(`${entry.id}.defining-relationship-mapping.json`, { ...mapping, spec: specBinding, inventoryGroups: inventory });
    write(`${entry.id}.route-FIRST.json`, {
      schema: 'bounded-author/route@1', figure: entry.id, mode: 'deterministic', purpose: 'instructional',
      reason: 'Geometry and mathematical relationships only; no semantic artwork required.',
      source: bind(entry.sourceImage.path), context: bind(entry.context.path),
      pixelFIRST: seals.find(seal => seal.figure === entry.id),
      completeEditionContextRead: true, relevantCompleteProse: spec.source.authoritativeText,
      unrelatedExerciseQuestionsNotUsedAsAnswersOrGeometry: true,
      noModelsNoPaidCalls: true, minTextPx: 16, widths: [480, 300],
      inheritedSourceHolds: manifest.sourceHolds,
      textSemanticPASS: 'Separate inherited 30-object semanticPASS only; not a strict-FIRST or figure approval.',
      priorLate0444ProceduralHOLD: 'UNCHANGED',
      sourceApproval: false, figureApproval: false, templateApplication: false,
    });
    console.log(`Authored ${entry.id} FIRST draft (${objects.length} objects, ${assertions.length} relationships).`);
  }
} else {
  throw new Error('Use before or drafts exactly once');
}
