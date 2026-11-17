import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const cwd = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
assert.equal(process.cwd(), cwd)
const tmp = '.intentfold/tickets/STEMROBIN-184/tmp'
const artifact = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const v6 = `${tmp}/source-9g-p73-counter-candidate/followup-overhead-shaft-attribution`
const finalized = `${tmp}/source-9g-p73-approved-affected-finalize`
const assembled = `${tmp}/assembly-9g-p8-p76`
const archive = `${artifact}/evidence/batch008-counter73-approved-assembly76`
const runRoot = `${tmp}/retain-counter73-approved-assembly76-once`
const helper = path.relative(cwd, fileURLToPath(import.meta.url))
const startedAtUtc = new Date().toISOString()
const sha = bytes => createHash('sha256').update(bytes).digest('hex')
const relative = value => {
  const result = path.relative(cwd, path.resolve(cwd, value))
  assert(result && !result.startsWith('../') && !path.isAbsolute(result), `Outside workspace: ${value}`)
  return result
}
const safeStat = value => {
  const name = relative(value)
  let current = cwd
  for (const part of name.split(path.sep)) {
    current = path.join(current, part)
    const stat = fs.lstatSync(current)
    assert(!stat.isSymbolicLink(), `Symlink forbidden: ${name}`)
  }
  return fs.lstatSync(current)
}
const forbidden = name => /(^|\/)(?:\.venv|venv|node_modules|__pycache__|\.git)(\/|$)/.test(name)
  || /(^|\/)(?:\.env(?:\..*)?|secrets?(?:\..*)?|credentials?(?:\..*)?|id_rsa|id_ed25519)$/.test(name)
const image = name => /\.(?:png|jpe?g|webp|gif|tiff?|pdf)$/i.test(name)
const binary = bytes => {
  const magic = bytes.subarray(0, 4).toString('hex')
  return ['7f454c46', 'feedface', 'feedfacf', 'cefaedfe', 'cffaedfe', 'cafebabe', 'bebafeca'].includes(magic)
    || bytes.subarray(0, 2).toString() === 'MZ'
}
const observed = new Map()
const identity = value => {
  const name = relative(value)
  assert(!forbidden(name), `Forbidden file: ${name}`)
  const stat = safeStat(name)
  assert(stat.isFile(), `Not a regular file: ${name}`)
  const bytes = fs.readFileSync(name)
  assert(!binary(bytes), `Interpreter/executable binary forbidden: ${name}`)
  const record = { path: name, bytes: bytes.length, sha256: sha(bytes) }
  const previous = observed.get(name)
  if (previous) assert.deepEqual(record, previous, `Input changed during retention: ${name}`)
  observed.set(name, record)
  return record
}
const readJson = name => {
  identity(name)
  return JSON.parse(fs.readFileSync(name, 'utf8'))
}
const walk = root => {
  const stat = safeStat(root)
  if (stat.isFile()) return [relative(root)]
  assert(stat.isDirectory(), `Unsupported file: ${root}`)
  return fs.readdirSync(root).sort().flatMap(name => walk(path.join(root, name)))
}
const must = {
  [`${v6}/report.md`]: '22db870a480d117c186098cdc620505f2feeafaf7c1416592b86b50b7d757e93',
  [`${v6}/candidate/layout.py`]: '0e03889f54d21a3f509e1da1f3d1eebef88d9f531a558a346197c59aada25014',
  [`${v6}/baseline/layout.py`]: 'eb6fca6d9a62663ed7e97d7f39cda32d803375f61bf71adbf9aac84b4c335c3d',
  [`${v6}/baseline-to-candidate.diff`]: 'd161bb5580c04d51b72ec94beaee2ad893c55d23550cc5f66f43ef5cda651071',
  [`${v6}/comparison-v6.json`]: '08cc47d2cc60d427d90abfe8dbdb5a22f17caf962f58bb64c650f73745764658',
  [`${v6}/tests-full-v6.json`]: '09d9d3c51cf97a0fec09ea560ad91368387bb2ef299ee39eb93460073b5c584b',
  [`${v6}/manifest.json`]: '13976f26610d1b3539b4be746ea3722d271c777403e6fc51c3bdb50818b44da1',
  [`${tmp}/counter73-parent-approval.json`]: '45759de7d8897eb841e310a4e3b72febca6ca3a4d98f7c85c573a29a10580aec',
  [`${finalized}/release.json`]: 'ca5d1336e4c2a4066a44954959a2d2ec9bf98c7bdc9d0f323652da191eef2d96',
  [`${assembled}/inputs.json`]: '794c8ce9177bc29706fe6ef4d6a59bb2d1418bbfc2c98c34e9a12febdc521a84',
  [`${assembled}/promotion.json`]: '907f9f846927f2ec0798f20d1fa202c0bf52a095d6cce9d5fce9a3770ce59ce4',
  [`${assembled}/operations/assemble.command.json`]: '582fdc6c6b05201fbc43fd2271613e4ab2df2ca9d5c1c650bc3f0d953844d38b',
  [`${assembled}/before-book.json`]: '3f45753a2dc5398ed5ae9612770a535d831c3dd5d6b80b289963160bd78d6c35',
  ['.claude/skills/ld-s10y-lesson/tools/layout.py']: '0e03889f54d21a3f509e1da1f3d1eebef88d9f531a558a346197c59aada25014',
  [`${tmp}/counter-vector-rows/report.md`]: '534986e4919a34cb448dfa0a9497cf5f75785f82bc201bfd24e41868bccd60bb',
  [`${artifact}/book.json`]: '5b63a28aa65fe2ce87bf8ddb4a3c9dcb3eef85b572d42812ce84172e25a4b20d',
}
const priorManifests = [
  ['batch008-late-text-source-counter-reviews', 'e99373fb13740fd461e67bfeea94751552730c4a037ec75b2d20cd345a188a08'],
  ['batch008-source71-assembly73-diagnostic76-author', 'e980611ed346b78b26d866e81d37fdf2642f140ccfaa2c2d98a0d3aff58361fd'],
  ['batch008-counter-and-source-p72-p75-disposition', 'a5fd2b32a6d8f1f8ed9da5dc4f4b20cc1cafe25f9a6335d78d2d23627816ff40'],
]
const priorByHash = new Map()
const priorRecords = []
const candidatesByHash = new Map()
const planned = new Map()
const excluded = []
const references = new Map()
const referenceMap = []
const historicalPreservation = []
const files = []
const addCandidate = record => {
  if (!candidatesByHash.has(record.sha256)) candidatesByHash.set(record.sha256, [])
  candidatesByHash.get(record.sha256).push(record)
}
const plan = value => {
  const record = identity(value)
  if (image(record.path)) {
    if (!excluded.some(item => item.path === record.path)) excluded.push({
      ...record, action: 'SOURCE_IMAGE_REFERENCE_ONLY_NO_PAYLOAD_COPY', runtimeDependency: false,
    })
  } else {
    planned.set(record.path, record)
  }
  addCandidate(record)
  return record
}
const collectRefs = (value, origin) => {
  if (!value || typeof value !== 'object') return
  if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256 || '')) {
    const name = relative(value.path)
    const key = `${name}\0${value.sha256}`
    if (!references.has(key)) references.set(key, {
      originalPath: value.path, sourcePathProvenanceOnly: name, sha256: value.sha256, origins: [],
    })
    references.get(key).origins.push(origin)
  }
  if (Array.isArray(value)) value.forEach((item, index) => collectRefs(item, `${origin}[${index}]`))
  else for (const [key, item] of Object.entries(value)) collectRefs(item, `${origin}.${key}`)
}
const exactCurrent = (name, expected) => {
  if (forbidden(name) || !fs.existsSync(name)) return null
  const stat = safeStat(name)
  if (!stat.isFile()) return null
  const record = identity(name)
  return record.sha256 === expected ? record : null
}
const matchingPrior = expected => {
  for (const item of priorByHash.get(expected) || []) {
    const record = exactCurrent(item.retainedPath, expected)
    if (record) return { record, priorManifest: item.manifest }
  }
  return null
}
const resolve = ref => {
  const name = ref.sourcePathProvenanceOnly
  const expected = ref.sha256
  if (forbidden(name)) return {
    ...ref, action: 'EXCLUDED_ENVIRONMENT_OR_SECRET_REFERENCE_ONLY_NOT_READ',
    runtimeDependency: false, payloadCopied: false,
  }
  const existing = [...planned.values()].find(item => item.sha256 === expected && !image(item.path))
  if (existing) return {
    ...ref, action: 'NEW_EXACT_ARCHIVE_WITNESS',
    witness: { ...existing, retainedPath: `${archive}/files/${existing.path}` }, runtimeDependency: false,
  }
  const prior = matchingPrior(expected)
  if (prior && !image(prior.record.path)) return {
    ...ref, action: 'REUSED_EXACT_PRIOR_RETAINED_IDENTITY', witness: prior.record,
    priorManifest: prior.priorManifest, runtimeDependency: false,
  }
  const current = exactCurrent(name, expected)
  if (image(name)) {
    const alternate = current || (candidatesByHash.get(expected) || []).find(item => image(item.path))
    return {
      ...ref, action: alternate ? 'SOURCE_IMAGE_REFERENCE_ONLY_EXACT_PRESENT' : 'SOURCE_IMAGE_REFERENCE_ONLY_FROZEN_HASH',
      witness: alternate || null, runtimeDependency: false, payloadCopied: false,
    }
  }
  if (current && name.startsWith('ssot-resources/')) return {
    ...ref, action: 'REUSED_EXACT_DURABLE_INPUT', witness: current, runtimeDependency: false,
  }
  if (current) {
    plan(name)
    return {
      ...ref, action: 'NEW_EXACT_ARCHIVE_WITNESS',
      witness: { ...current, retainedPath: `${archive}/files/${name}` }, runtimeDependency: false,
    }
  }
  const snapshot = (candidatesByHash.get(expected) || []).find(item => !image(item.path))
  if (snapshot) {
    plan(snapshot.path)
    return {
      ...ref, action: 'NEW_EXACT_ARCHIVE_WITNESS',
      witness: { ...snapshot, retainedPath: `${archive}/files/${snapshot.path}` }, runtimeDependency: false,
    }
  }
  return { ...ref, action: 'UNRESOLVED_FROZEN_REFERENCE', runtimeDependency: false }
}
const write = (name, bytes) => {
  fs.mkdirSync(path.dirname(name), { recursive: true })
  fs.writeFileSync(name, bytes, { flag: 'wx' })
}
const writeJson = (name, value) => write(name, JSON.stringify(value, null, 2) + '\n')
const copy = record => {
  const retainedPath = `${archive}/files/${record.path}`
  const bytes = fs.readFileSync(record.path)
  assert.equal(sha(bytes), record.sha256)
  write(retainedPath, bytes)
  assert.equal(sha(fs.readFileSync(retainedPath)), record.sha256)
  const output = {
    ...record, sourcePathProvenanceOnly: record.path, retainedPath,
    action: 'NEW_EXCLUSIVE_EXACT_BYTE_COPY', runtimeDependency: false, inertHistoricalEvidence: true,
  }
  files.push(output)
  return output
}

try {
  assert(!fs.existsSync(archive), 'Archive already exists; do not overwrite or rerun')
  assert(!fs.existsSync(runRoot), 'Retention invocation already exists; do not rerun')
  for (const [name, expected] of Object.entries(must)) assert.equal(identity(name).sha256, expected, name)
  const approval = readJson(`${tmp}/counter73-parent-approval.json`)
  const release = readJson(`${finalized}/release.json`)
  const promotion = readJson(`${assembled}/promotion.json`)
  assert.equal(approval.status, 'COUNTER73_CANDIDATE_APPROVED_FOR_SOLE_AFFECTED_FINALIZE')
  assert(approval.preservedFailure.includes('Failed to find expected lines: def line_bands('))
  assert.equal(release.status, 'COUNTER73_PROMOTED_AFFECTED_FINALIZE_PASS')
  assert.equal(promotion.status, 'SOURCE_N20_CLOSED_N21_OPEN_ONLY')
  const primaryRoots = [v6, finalized, assembled]
  const rootInventories = primaryRoots.map(root => ({ root, files: walk(root).map(identity) }))
  for (const inventory of rootInventories) for (const item of inventory.files) plan(item.path)
  for (const name of [
    `${tmp}/counter73-parent-approval.json`, `${tmp}/finalize-counter73-approved-once.mjs`,
    `${tmp}/assemble-9g-through76-once.mjs`, `${tmp}/rebind-book-trace.py`,
    '.claude/skills/ld-s10y-lesson/tools/layout.py', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    `${tmp}/counter-vector-rows/report.md`, `${artifact}/book.json`, helper,
  ]) plan(name)
  for (const [name, expected] of priorManifests) {
    const manifest = `${artifact}/evidence/${name}/retention.json`
    const record = identity(manifest)
    assert.equal(record.sha256, expected)
    priorRecords.push(record)
    const value = readJson(manifest)
    for (const item of value.files || []) {
      if (!item.retainedPath || !/^[a-f0-9]{64}$/.test(item.sha256 || '')) continue
      if (!priorByHash.has(item.sha256)) priorByHash.set(item.sha256, [])
      priorByHash.get(item.sha256).push({ retainedPath: item.retainedPath, manifest: record })
    }
  }
  const previous = readJson(`${v6}/before.json`).previous_inventory
  assert.equal(previous.length, 341)
  for (const item of previous) {
    const ref = { originalPath: item.path, sourcePathProvenanceOnly: relative(item.path), sha256: item.sha256,
      origins: [`${v6}/before.json.previous_inventory`], bytes: item.bytes }
    const current = exactCurrent(ref.sourcePathProvenanceOnly, ref.sha256)
    if (current) addCandidate(current)
    historicalPreservation.push(resolve(ref))
  }
  const primaryJson = [...planned.keys()].filter(name => name.endsWith('.json'))
  for (const name of primaryJson) collectRefs(readJson(name), name)
  for (const ref of references.values()) referenceMap.push(resolve(ref))
  const unresolved = [...historicalPreservation, ...referenceMap].filter(item => item.action === 'UNRESOLVED_FROZEN_REFERENCE')
  assert.equal(unresolved.length, 0, `Unresolved nonimage frozen references: ${JSON.stringify(unresolved)}`)
  const before = [...observed.values()].sort((a, b) => a.path.localeCompare(b.path))
  const beforeInventorySha256 = sha(Buffer.from(JSON.stringify(before)))
  fs.mkdirSync(runRoot)
  fs.mkdirSync(archive)
  writeJson(`${runRoot}/before.json`, { startedAtUtc, files: before, inventorySha256: beforeInventorySha256 })
  for (const record of [...planned.values()].sort((a, b) => a.path.localeCompare(b.path))) copy(record)
  const after = before.map(record => {
    const actual = identity(record.path)
    assert.deepEqual(actual, record)
    return actual
  })
  for (const inventory of rootInventories) assert.deepEqual(walk(inventory.root), inventory.files.map(item => item.path))
  const afterInventorySha256 = sha(Buffer.from(JSON.stringify(after)))
  assert.equal(afterInventorySha256, beforeInventorySha256)
  writeJson(`${runRoot}/after.json`, { finishedAtUtc: new Date().toISOString(), files: after,
    inventorySha256: afterInventorySha256, exactBeforeAfter: true })
  const counts = {
    copiedInputFiles: files.length, copiedInputBytes: files.reduce((sum, item) => sum + item.bytes, 0),
    v6RegularMembers: rootInventories[0].files.length,
    v6ImagePayloadsExcluded: rootInventories[0].files.filter(item => image(item.path)).length,
    finalizeRegularMembers: rootInventories[1].files.length,
    assemblyRegularMembers: rootInventories[2].files.length,
    assemblyImagePayloadsExcluded: rootInventories[2].files.filter(item => image(item.path)).length,
    frozenV1V5Members: historicalPreservation.length, hashedReferenceOccurrences: referenceMap.reduce((n, item) => n + item.origins.length, 0),
    uniqueHashedReferences: referenceMap.length, unresolvedNonimageReferences: unresolved.length,
    workflowsExecuted: { tests: 0, sourceGates: 0, prepare: 0, finalize: 0, assemble: 0, promotion: 0 },
  }
  const stdout = `Retention-only archive completed.\nArchive: ${archive}\nCopied input files: ${counts.copiedInputFiles}\nFrozen v1-v5 members mapped: ${counts.frozenV1V5Members}\nUnresolved nonimage references: 0\nTests/gates/prepare/finalize/assembly/promotion executed: 0/0/0/0/0/0\n`
  write(`${runRoot}/stdout.raw`, stdout)
  write(`${runRoot}/stderr.raw`, '')
  writeJson(`${runRoot}/command.json`, {
    executable: process.execPath, argv: process.argv.slice(1), cwd, startedAtUtc,
    finishedAtUtc: new Date().toISOString(), exit: 0, signal: null, error: null,
    invocationCount: 1, task: 'retention only', helper: identity(helper),
    noChildCommands: true, workflowsExecuted: counts.workflowsExecuted,
  })
  for (const name of walk(runRoot)) copy(identity(name))
  writeJson(`${archive}/reference-map.json`, {
    interpretation: 'Verbatim inputs retain original paths; witness mapping is inert provenance, not a rewritten input or runtime dependency.',
    references: referenceMap, frozenV1V5Members: historicalPreservation,
    excludedPayloads: excluded, priorManifests: priorRecords,
  })
  const report = [
    '# Approved Counter73 And Assembly76 Retention',
    '',
    'Ticket: STEMROBIN-184. Retention only; no workflow restart or source review.',
    '',
    'The complete regular-file v6 package, parent approval, sole73 affected-finalize tree,',
    'and assembly-through76 operations/inputs/protected/promotion records are retained verbatim.',
    'Full nonimage assembly input/output records, approved production code, parent command helpers,',
    'test declarations/harnesses, baseline/candidate code, complete diffs and NPZ arrays are included.',
    'Source images are reference-only; no interpreter, environment, secret or symlink was copied.',
    '',
    `Copied input files: ${counts.copiedInputFiles}; bytes: ${counts.copiedInputBytes}.`,
    `V6 membership: ${counts.v6RegularMembers} regular files, ${counts.v6ImagePayloadsExcluded} PNG excluded.`,
    `Finalize membership: ${counts.finalizeRegularMembers} regular files, all copied.`,
    `Assembly membership: ${counts.assemblyRegularMembers} regular files, ${counts.assemblyImagePayloadsExcluded} PNG excluded.`,
    `All ${counts.frozenV1V5Members} named frozen v1-v5 members have exact byte/hash or image-reference dispositions.`,
    `${counts.uniqueHashedReferences} unique hashed references are mapped; unresolved nonimage references: 0.`,
    '',
    '## Exact Approved Bindings',
    '',
    `V6 report: ${must[`${v6}/report.md`]}`,
    `Approved production/candidate: ${must['.claude/skills/ld-s10y-lesson/tools/layout.py']}`,
    `Complete eb6-to-v6 diff: ${must[`${v6}/baseline-to-candidate.diff`]}`,
    `Parent approval: ${must[`${tmp}/counter73-parent-approval.json`]}`,
    `Sole73 release: ${must[`${finalized}/release.json`]}`,
    `Assembly book: ${must[`${artifact}/book.json`]}`,
    '',
    '## History And Disposition',
    '',
    'Historical v6 reports/manifests still say candidate/unapproved: those bytes are not rewritten.',
    'Parent approval and release provide the later authority. Historical v1-v5 FAIL logs remain FAIL.',
    'The historical eb6 production reference maps to exact frozen baseline bytes, not current production.',
    'The release protected old book3f45753a maps to assembly before-book.json; current book5b63a28a',
    'is the authorized assembly result. This is recorded authorized succession, not unauthorized drift.',
    '',
    'Parent first patch-anchor failure, verbatim from approval:',
    '',
    approval.preservedFailure,
    '',
    'Recorded parent outcome only (not rerun): sole73 exit0,24/24; page.md and full page.json unchanged;',
    'no exclusions, normalizations or figures. Assembly exit0;201 exercises,84 figures,22 units;',
    'n20 closed192-197; n21 remains OPEN at p0076#11. No broader modern/answer/choice clearance is claimed.',
    '',
    '## Byte Mapping And Operation',
    '',
    'retention.json maps each new regular copy source path to its durable path, exact size and SHA256.',
    'reference-map.json maps all hashed input references and named protected v1-v5 members to exact',
    'new/prior/durable witnesses. Original documentary paths, including interpreter argv, remain intact.',
    'All witnesses are inert history and have runtimeDependency:false; no local runtime is archived.',
    'Copied before/after inventories attest observed source and used prior witness bytes unchanged.',
    'The helper ran once; command.json/stdout.raw/stderr.raw are retained as actual retention evidence.',
    'Tests, source gates, prepare, finalize, assembly and promotion executions in this operation: all0.',
    'No source/code/history edits, DB, Git, browser, image displays, dependencies or other-worker writes.',
    '',
  ].join('\n')
  write(`${archive}/report.md`, report)
  const reportRecord = identity(`${archive}/report.md`)
  const referenceRecord = identity(`${archive}/reference-map.json`)
  writeJson(`${archive}/retention.json`, {
    schema: 'STEMROBIN-184/counter73-approved-assembly76-retention/v1', ticket: 'STEMROBIN-184',
    status: 'RETENTION_COMPLETE_ONLY_PARENT_CONSUMPTION_PENDING', retainedAtUtc: new Date().toISOString(),
    archive, counts, approvedBindings: must, parentFirstPatchAnchorFailure: approval.preservedFailure,
    recordedParentStatuses: { approval: approval.status, release: release.status, assembly: promotion.status,
      noNewAcceptanceOrPublicationClaim: true },
    historyInterpretation: 'Old reports, failed logs and original documentary references remain unchanged. Approval/finalize/assembly succession is separately retained.',
    sourcePreservation: { beforeInventorySha256, afterInventorySha256, exact: true },
    files, referenceMap: referenceRecord, report: reportRecord, priorManifests: priorRecords,
    completePrimaryMembership: rootInventories,
    limits: 'Only exact retention; no source image copies/interpreters/venv/secrets/symlinks or repeated workflows. No production/source/history writes.',
  })
  process.stdout.write(stdout)
} catch (error) {
  const raw = `${error.stack || error}\n`
  if (!fs.existsSync(runRoot)) fs.mkdirSync(runRoot)
  for (const [name, value] of [['stdout.raw', ''], ['stderr.raw', raw]]) {
    if (!fs.existsSync(`${runRoot}/${name}`)) write(`${runRoot}/${name}`, value)
  }
  if (!fs.existsSync(`${runRoot}/command.json`)) writeJson(`${runRoot}/command.json`, {
    executable: process.execPath, argv: process.argv.slice(1), cwd, startedAtUtc,
    finishedAtUtc: new Date().toISOString(), exit: 1, signal: null, error: error.message,
    invocationCount: 1, task: 'retention only; preserve failure; no retry',
  })
  process.stderr.write(raw)
  process.exitCode = 1
}
