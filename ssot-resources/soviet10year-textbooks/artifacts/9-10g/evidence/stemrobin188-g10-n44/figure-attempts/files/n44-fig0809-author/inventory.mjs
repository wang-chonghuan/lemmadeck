import path from 'node:path'
import { owned, repo, sha, write } from './audit.mjs'

const row = (id, description, objects, assertions, requires = []) => ({
  id, description, objects, assertions, ...(requires.length ? { requires } : {})
})
const common = (axisLabels) => [
  row('point-O', 'O is the shared origin and carries the source O label.', ['O'], ['O-on-x']),
  ...['x', 'y', 'z'].map(axis => row(`axis-${axis}-positive`,
    `One solid positive ${axis} ray; no ticks or numeric coordinate values.`,
    [`axis-${axis}-positive`], [`axis-${axis}-positive-connects`])),
  ...['i', 'j', 'k'].map((basis, index) => row(`basis-${basis}`,
    `Source directed basis vector ${basis}, coincident with the positive ${['x', 'y', 'z'][index]} ray.`,
    [`basis-${basis}`], [`basis-${basis}-connects`, `basis-${basis}-aligned`])),
  ...['i', 'j', 'k'].map(basis => row(`label-${basis}`,
    `Source mathematical basis label ${basis} with an overhead vector arrow; modern U+20D7.`,
    [`label-${basis}`], [`label-${basis}-on-basis`])),
  ...axisLabels.map(axis => row(`label-${axis}`,
    `Source ${axis} label; an axis name in fig09, a symbolic component in fig08, never a numeric value.`,
    [`label-${axis}`], [`label-${axis}-on-carrier`]))
]
const fig08 = [
  row('single-frame', 'One schematic oblique coordinate frame, not Euclidean 3D metric geometry.',
    ['O', 'A', 'B', 'M', 'label-i', 'label-j', 'label-k', 'label-x', 'label-y', 'label-z'],
    ['O-on-x', 'A-on-x', 'AB-along-y', 'BM-along-z', 'label-i-on-basis', 'label-j-on-basis',
      'label-k-on-basis', 'label-x-on-carrier', 'label-y-on-carrier', 'label-z-on-carrier'],
    ['pointRelationships']),
  ...common(['x', 'y', 'z']),
  row('point-A', 'A is below-left of O, on the positive x ray; dot and label A.', ['A'], ['A-on-x', 'AB-along-y']),
  row('point-B', 'B is right of A, below M; dot and label B.', ['B'], ['AB-along-y', 'BM-along-z']),
  row('point-M', 'M is above B and above-right of O; dot and label M.', ['M'], ['BM-along-z', 'OM-upper-connects']),
  row('construction-OA', 'O to A is the first leg, on the existing x ray, in the i direction. No extra arrowhead at A.',
    ['axis-x-positive', 'basis-i', 'O', 'A'], ['A-on-x', 'basis-i-aligned']),
  row('construction-AB', 'A to B is horizontal dashed construction, in the j direction. No printed arrowhead at B.',
    ['construction-AB'], ['construction-AB-connects', 'AB-along-y']),
  ...[1, 2, 3, 4].map(n => row(`construction-BM-${n}`,
    `Source BM solid vertical construction portion ${n}; retain the observed interruptions rather than joining across gaps.`,
    [`construction-BM-${n}`], [`construction-BM-${n}-connects`, `construction-BM-${n}-aligned`])),
  row('resultant-OM-lower', 'Solid O-to-M diagonal lower shaft ending before the visible source interruption.',
    ['resultant-OM-lower'], ['resultant-OM-lower-connects', 'OM-lower-aligned']),
  row('resultant-OM-upper', 'Diagonal resumes above the interruption and carries a head directed toward M.',
    ['resultant-OM-upper'], ['OM-upper-connects', 'OM-upper-aligned']),
  row('source-absence', 'No negative dashed axes, numeric coordinates, completed cuboid, extra labels or answer annotations are printed.',
    ['O', 'A', 'B', 'M'], ['named-source-points'])
]
const fig09 = [
  row('single-frame', 'One shared schematic oblique coordinate frame; no metric angle or distance claim.',
    ['O', 'A', 'B', 'label-i', 'label-j', 'label-k', 'label-x', 'label-y', 'label-z'],
    ['OA-connects', 'OB-connects', 'AB-connects', 'label-i-on-basis', 'label-j-on-basis',
      'label-k-on-basis', 'label-x-on-carrier', 'label-y-on-carrier', 'label-z-on-carrier'],
    ['pointRelationships']),
  ...common(['x', 'y', 'z']),
  row('point-A', 'A is to the upper-right of O and lower-right of B; printed dot and A label.', ['A'], ['OA-connects', 'AB-connects']),
  row('point-B', 'B is above-right of O, above-left of A; printed dot and B label.', ['B'], ['OB-connects', 'AB-connects']),
  ...['OA', 'OB', 'AB'].map(vector => row(`vector-${vector}`,
    `Printed directed segment ${vector[0]} to ${vector[1]}, with an arrowhead toward ${vector[1]}.`,
    [`vector-${vector}`], [`${vector}-connects`])),
  ...['x', 'y', 'z'].map(axis => row(`axis-${axis}-negative`,
    `Printed dashed negative ${axis} continuation: ${axis === 'x' ? 'upper-right, stopping well before A' : axis === 'y' ? 'left of O' : 'below O'}.`,
    [`axis-${axis}-negative`], [`axis-${axis}-negative-connects`, `axis-${axis}-negative-aligned`])),
  row('projection-detached', 'One detached dashed fragment below A, parallel to the oblique x ray. Preserve its disconnected endpoints; do not invent a completed rectangle or connect it to A.',
    ['projection-detached'], ['projection-detached-connects', 'projection-detached-aligned'])
]
for (const [id, inventory] of [['fig-g10-08', fig08], ['fig-g10-09', fig09]]) {
  const source = path.join(repo, `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/${id}.png`)
  write(path.join(owned, id, 'source-inventory.json'), {
    figure: id, source: { path: source, sha256: sha(source) },
    recordedBeforeDrawing: true, originalLoaded: true, inventory,
    modernAdditions: [
      'Regularized source line work and label offsets for 480px/300px readability.',
      'Neutral semantic ink and consistent stroke weights.',
      'Schematic internal screen coordinates are construction parameters, never given numerical coordinates.',
      'Source caption is not embedded; the containing lesson owns the Figure caption.'
    ],
    explicitNonClaims: ['No independent review', 'No 3D metric reconstruction', 'No exercise answer annotation']
  })
}
