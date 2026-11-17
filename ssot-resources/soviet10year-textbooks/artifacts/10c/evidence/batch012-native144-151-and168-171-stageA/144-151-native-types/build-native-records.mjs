import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const out = path.dirname(fileURLToPath(import.meta.url));
const targets = ['144', '146A', '146B', '147', '148', '150', '151'];
const read = (filename) => JSON.parse(fs.readFileSync(filename));
const shaFile = (filename) => crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex');
const write = (filename, data) => fs.writeFileSync(filename, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
const crops = read(path.join(out, 'crop-bindings.json'));
const entries = targets.map((target) => {
  const viewPath = path.join(out, 'views', `${target}.json`);
  const view = read(viewPath);
  const metadataPath = path.join(out, 'crops', target, 'metadata.json');
  const metadata = read(metadataPath);
  return {
    ...metadata,
    native_view: view,
    record_bindings: {
      metadata: { path: metadataPath, sha256: shaFile(metadataPath) },
      view: { path: viewPath, sha256: shaFile(viewPath) },
      preload: {
        path: path.join(out, view.preload_receipt),
        sha256: shaFile(path.join(out, view.preload_receipt)),
      },
    },
  };
});
const ledger = {
  status: 'NATIVE_TYPE_ONLY_COMPLETE_WAIT',
  lifetime_model_images_before: '0/24',
  lifetime_model_images_after: '7/24',
  lifetime_remaining: 17,
  batch_limit: 8,
  batch_images_used: 7,
  batch_remaining_unused: 1,
  parent_model_image_budget: '24/24; unchanged; no image payload sent',
  exact_native_crop_creation_count: 7,
  successful_single_image_view_count: 7,
  original_model_views: 0,
  reopens: 0,
  resize_contrast_ocr_montage_grids: 0,
  optional145: 'NOT_CREATED_OR_VIEWED; no further visual architecture certification claimed',
  numeric_reruns_counters_tests_finalize_exclusions_edits: 0,
  verdict_counts: {
    UNKNOWN: entries.filter((item) => item.native_view.visible_type === 'UNKNOWN').length,
    SCANEDGE: 0,
    PRINTORNAMENT: 0,
    LEGIBLETEXT: 0,
    FORMULA: 0,
  },
  classification_basis: 'Visible native-crop morphology only; coordinates are identity/provenance, not TYPE evidence',
  tool_record_basis: 'Each view record documents the actual observed functions.view_image call; image-tool responses are not claimed CLI stdout/stderr captures',
  retained: '7 firstFAIL / oldHOLD / UNKNOWN / 149PASS unchanged; prior numeric freeze untouched',
  entries,
};
write(path.join(out, 'ledger.json'), ledger);
write(path.join(out, 'final-bindings.json'), {
  status: 'NATIVE_SOURCE_CROP_AND_PRELOAD_BINDINGS',
  numeric_inputs: crops.numeric_inputs,
  originals: crops.source_originals.map((item) => ({
    ...item, final_sha256: shaFile(item.path),
    unchanged_since_frozen_first: shaFile(item.path) === item.sha256,
  })),
  crops: entries.map((item) => ({
    ...item.crop,
    final_sha256: shaFile(item.crop.path),
    unchanged_since_creation: shaFile(item.crop.path) === item.crop.sha256,
    ...item.record_bindings,
  })),
});

const lines = [
  '# STEMROBIN-184 SessionB: bounded native TYPE record',
  '',
  '2026-11-17. Native TYPE only. Seven exact new crops created once and viewed',
  'once each. No original image tool view, reopen, resized/contrast-enhanced image,',
  'OCR, montage, grid, additional crop, numerical trace or acceptance was run.',
  '',
  'Lifetime modelimages: 0/24 -> 7/24; 17 remain. This batch used7 of its max8;',
  'the eighth authorization was not used or treated as a budget reset.',
  'Parent remains24/24; no image payload is returned or sent to parent.',
  '',
  '## Outcome',
  '',
  'All seven remain UNKNOWN. No legible text, digit, recognizable formula or',
  'identifiable ornament pattern was discernible in the authorized native strips.',
  'That observation does not establish a scan-edge/scan-artifact origin or the',
  'absence of degraded printing. The crops show limited line-like traces without',
  'enough direct context to distinguish scan-edge from a degraded printed rule.',
  'Coordinates and full CC envelopes are not used as semantic approval.',
  '',
  '| Target | Exact half-open xyxy | Native WH | TYPE | Visible evidence |',
  '| --- | --- | --- | --- | --- |',
  ...entries.map((item) => `|${item.target} |[${item.crop.halfopen_xyxy.join(',')}] |${item.crop.dimensions_wh.join('x')} |${item.native_view.visible_type} |${item.native_view.visible_evidence} |`),
  '',
  'Each decision is bounded to this crop. No folio/ornament relation, readable',
  'expression, exclusion, expected-number adjustment, counter PASS or repair is',
  'approved. UNKNOWN is retained because the authorized context cannot settle TYPE.',
  '',
  '## Per-View Provenance',
  '',
];
for (const item of entries) {
  lines.push(
    `### ${item.target}`,
    '',
    `Source PATH: ${item.source.path}`,
    `Source bytes/WH/mode: ${item.source.bytes} / ${item.source.dimensions_wh.join('x')} / ${item.source.mode}`,
    `Source SHA256: ${item.source.sha256}`,
    `Crop PATH: ${item.crop.path}`,
    `Crop exact half-open xyxy: [${item.crop.halfopen_xyxy.join(',')}]`,
    `Crop bytes/WH/mode: ${item.crop.bytes} / ${item.crop.dimensions_wh.join('x')} / ${item.crop.mode}`,
    `Crop SHA256: ${item.crop.sha256}`,
    `Preload receipt PATH: ${item.record_bindings.preload.path}`,
    `Preload receipt SHA256: ${item.record_bindings.preload.sha256}`,
    `Actual image tool: functions.view_image(path=crop PATH, detail=original), sequence${item.native_view.view_sequence}, once.`,
    `Native TYPE: ${item.native_view.visible_type}`,
    `Visible evidence: ${item.native_view.visible_evidence}`,
    `Unresolved distinction: ${item.native_view.distinction}`,
    '',
  );
}
lines.push(
  '## Binding And Execution',
  '',
  'Each source matches the already frozen first-source SHA. Source and crop',
  'path/bytes/dimensions/SHA were loaded into model context in the successful',
  'preload command immediately before that single view. Crop bytes were unchanged.',
  'Source RGB pixels were cropped by PIL at the exact supplied half-open bounds',
  'and saved as PNG, with no pixel conversion, resampling or other transform.',
  '',
  '`crop-bindings.json`, `final-bindings.json` and `ledger.json` bind all six',
  'originals, seven crops, seven preload receipts and seven actual view records.',
  'View judgements were written after each observed image-tool response. No image',
  'tool response is misrepresented as a command stdout/stderr capture.',
  '',
  '`command-index.json` supplies actual executable/args/cwd/exits and the paths,',
  'bytes and SHA256 of stdout.raw/stderr.raw for crop creation, each preload,',
  'record packaging and the sealing child. Descriptors were opened before spawn;',
  'there is no reconstructed stream or tee claim. Recorded script hashes are',
  'collected after child termination, not independently observed launch hashes.',
  'The final child streams close and its receipt is written before the one-time',
  'manifest hashes the completed files. Manifest and its sidecar are excluded',
  'from the manifest file list to avoid self-reference.',
  '',
  '## Scope Preserved',
  '',
  'Optional145 [340,2104,410,2219] was not created/viewed. The previous numerical',
  'R21 broken3/7bar diagnosis is unchanged; this batch makes no added native',
  'architecture certification. No149, oldHOLD,531 mark, fig69 ticks or old barred',
  'pages were rereviewed or computed. No counter, tool repair, test, validator,',
  'exclusion, source/body/figure/schema/dependency/gate/expectation edit,',
  'finalize, assembly, backend operation, skill refresh or setup was performed.',
  '',
  'Seven firstFAILs, all oldHOLD/UNKNOWN and149PASS retain their previous states.',
  'The consumed original partial and final numerical freezes were not rewritten.',
  'No other person edits were reverted. Parent owns retention and further source',
  'production; this task performs no retention operation.',
  '',
  'WAIT. TEXT/PATH/HASH only; no image payload.',
  '',
);
fs.writeFileSync(path.join(out, 'report.md'), lines.join('\n'), { flag: 'wx' });
console.log(JSON.stringify({
  status: ledger.status,
  views: ledger.successful_single_image_view_count,
  lifetime_modelimages: ledger.lifetime_model_images_after,
  classifications: ledger.verdict_counts,
  optional145: ledger.optional145,
  output: ['report.md', 'ledger.json', 'final-bindings.json'],
  numeric_reruns: 0,
}, null, 2));
