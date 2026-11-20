import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const root = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n61-fig838485-review-01");
const manifest = JSON.parse(fs.readFileSync(path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n61-fig838485-review-inputs-01/manifest.json"), "utf8"));
const sha = b => crypto.createHash("sha256").update(b).digest("hex");
const near = n => Math.abs(n) < 1e-8;
const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const refKeys = {
  displacement: ["from", "to"],
  distance: ["a", "b"],
  equalDistance: ["a", "b", "c", "d"],
  connects: ["from", "to"],
  pointOnCircle: ["point", "center"],
  collinear: ["a", "b", "c"]
};
const results = [];
for (const figure of manifest.figures) {
  const spec = JSON.parse(fs.readFileSync(figure.spec.path, "utf8"));
  const objects = new Map(spec.objects.map(o => [o.id, o]));
  const assertions = new Map(spec.assertions.map(a => [a.id, a]));
  const groups = spec.source.inventory.map(group => {
    const groupIds = new Set(group.objects);
    const relations = group.assertions.map(id => {
      const a = assertions.get(id);
      const values = (refKeys[a.type] || []).map(k => a[k]).filter(v => v !== undefined);
      const pointRefs = [...new Set(values.filter(v => typeof v === "string"))];
      const literalCoordinates = values.filter(v => Array.isArray(v));
      const outsideRefs = pointRefs.filter(id => !groupIds.has(id) || objects.get(id)?.type !== "point");
      return { id, type: a.type, pointRefs, literalCoordinates, outsideRefs, multiPoint: values.length >= 2, countIsNotRelationshipEvidence: a.type === "objectCount" };
    });
    const pointCoverage = group.objects.filter(id => objects.get(id)?.type === "point").map(id => ({
      point: id,
      at: objects.get(id).at,
      label: objects.get(id).label ?? null,
      markerVisible: objects.get(id).visible !== false,
      mappedRelationsWhollyInsideGroup: relations.filter(r => r.multiPoint && r.outsideRefs.length === 0 && r.pointRefs.includes(id)).map(r => r.id)
    }));
    return { id: group.id, requires: group.requires, pointCoverage, relations, complete: pointCoverage.every(p => p.mappedRelationsWhollyInsideGroup.length > 0) && relations.every(r => r.outsideRefs.length === 0) };
  });
  const svgBytes = fs.readFileSync(figure.svg.path);
  const png = fs.readFileSync(figure.snapshot.path);
  const savedNative = JSON.parse(fs.readFileSync(figure.render.path, "utf8"));
  const result = {
    figure: figure.id,
    scope: "Independent source-inventory relationship inspection, not native/schema validation or a renderer rerun",
    groups,
    svgHash: sha(svgBytes),
    svgMatchesManifest: sha(svgBytes) === figure.svg.sha256,
    svgMatchesSavedNativeOutput: sha(svgBytes) === savedNative.output.svg.sha256,
    savedNativeSpecMatchesCurrentSpec: savedNative.spec.sha256 === sha(fs.readFileSync(figure.spec.path)),
    snapshot: { path: figure.snapshot.path, sha256: sha(png), width: png.readUInt32BE(16), height: png.readUInt32BE(20), matchesManifest: sha(png) === figure.snapshot.sha256 },
    savedNativeStatusReused: savedNative.status,
    savedNativeDisplayChecksReused: savedNative.displayChecks,
    semanticNumericObservations: {}
  };
  if (figure.id !== "fig-g10-85") {
    const prefix = figure.id.endsWith("83") ? "83-cone-" : "84-cone-";
    const O = objects.get(prefix + "O").at;
    const S = objects.get(prefix + "S").at;
    const radii = figure.id.endsWith("83") ? [7.6, 2.888] : [2.5755555555555554, 0.8499333333333333];
    const [rx, ry] = radii;
    const H = S[1] - O[1];
    const ellipsePoints = ["A", "B", "C"].map(name => {
      const P = objects.get(prefix + name).at;
      const dx = P[0] - O[0], dy = P[1] - O[1];
      return { point: prefix + name, dx, dy, projectedEuclideanRadius: distance(P, O), ellipseEquationResidual: (dx / rx) ** 2 + (dy / ry) ** 2 - 1 };
    });
    result.semanticNumericObservations.coneProjection = {
      chosenEllipseRadii: radii,
      chosenCompression: ry / rx,
      chosenProjectedAxisHeight: H,
      axisDx: S[0] - O[0],
      ellipsePoints,
      tangencyResiduals: ["B", "C"].map(name => {
        const P = objects.get(prefix + name).at;
        const dx = P[0] - O[0], dy = P[1] - O[1];
        return { point: prefix + name, residual: dx * (S[0] - P[0]) / rx ** 2 + dy * (S[1] - P[1]) / ry ** 2 };
      }),
      AFrontBelowO: objects.get(prefix + "A").at[1] < O[1],
      BAndCAboveOAtSameProjectionHeight: near(objects.get(prefix + "B").at[1] - objects.get(prefix + "C").at[1]) && objects.get(prefix + "B").at[1] > O[1],
      projectedRadiiEqualityIsNotClaimed: true,
      coneInventoryHasNoEqualDistanceAssertion: groups[0].relations.every(r => r.type !== "equalDistance"),
      rimStyles: ["front-rim", "rear-rim"].map(name => ({ id: prefix + name, type: objects.get(prefix + name).type, dash: objects.get(prefix + name).dash ?? 0, d: objects.get(prefix + name).d })),
      regularizationNotSourceGivens: true
    };
    if (figure.id.endsWith("84")) {
      const sectorS = objects.get("84-sector-S").at;
      const sectorA = objects.get("84-sector-A").at;
      const sectorA1 = objects.get("84-sector-A1").at;
      const va = sectorA.map((v, i) => v - sectorS[i]);
      const vb = sectorA1.map((v, i) => v - sectorS[i]);
      const L = distance(sectorS, sectorA);
      const angle = Math.acos((va[0] * vb[0] + va[1] * vb[1]) / (L * distance(sectorS, sectorA1)));
      const chosenTrueHeight = H / Math.sqrt(1 - (ry / rx) ** 2);
      result.semanticNumericObservations.sectorCompatibility = {
        sectorLeftRadius: L,
        sectorRightRadius: distance(sectorS, sectorA1),
        angleRadians: angle,
        sectorArcLength: L * angle,
        latentConeBaseCircumference: 2 * Math.PI * rx,
        arcMinusCircumference: L * angle - 2 * Math.PI * rx,
        chosenTrueHeight,
        sectorSlantSquaredMinusConeRadiusHeightSquared: L ** 2 - rx ** 2 - chosenTrueHeight ** 2,
        regularizationNotSourceGivens: true,
        circleOrAttachmentAdded: false
      };
    }
  } else {
    const S = objects.get("S").at, O = objects.get("O").at;
    const A = objects.get("A").at, A1 = objects.get("A1").at;
    const L = distance(S, A), R = objects.get("base-circle").radius;
    const va = A.map((v, i) => v - S[i]), vb = A1.map((v, i) => v - S[i]);
    const angle = Math.acos((va[0] * vb[0] + va[1] * vb[1]) / (L * distance(S, A1)));
    const contact = assertions.get("contact-on-base").point;
    result.semanticNumericObservations.completeNet = {
      leftSectorRadius: L,
      rightSectorRadius: distance(S, A1),
      baseRadius: R,
      angleRadians: angle,
      sectorArcLength: L * angle,
      baseCircumference: 2 * Math.PI * R,
      arcMinusCircumference: L * angle - 2 * Math.PI * R,
      contact,
      contactSectorCircleResidual: distance(contact, S) - L,
      contactBaseCircleResidual: distance(contact, O) - R,
      externalTangencyResidual: distance(S, O) - L - R,
      centerNormalCrossProduct: (O[0] - S[0]) * (contact[1] - S[1]) - (O[1] - S[1]) * (contact[0] - S[0]),
      centerDotPreserved: objects.get("O").visible === true,
      endpointMarkersNotAdded: ["S", "A", "A1"].every(id => objects.get(id).visible === false),
      contactHasNoAddedPointObjectOrLabel: !spec.objects.some(o => o.id.toLowerCase().includes("contact")),
      regularizationNotSourceGivens: true
    };
  }
  results.push(result);
}
const schemaPath = path.join(repo, ".agents/skills/ld-s10y-image/assets/figure-spec.schema.json");
const schemaBytes = fs.readFileSync(schemaPath);
const output = {
  schema: "independent-current-figure-comparison@1",
  observedAt: new Date().toISOString(),
  results,
  schemaReadOnlyBinding: { path: schemaPath, sha256: sha(schemaBytes), bytes: schemaBytes.length, timing: "Supplemental before final input-after observation; no schema validator executed" },
  nativeValidatorCalls: 0,
  nativeRendererCalls: 0,
  imageReopens: 0,
  productFrameCalls: 0
};
fs.writeFileSync(path.join(root, "current-comparison.json"), JSON.stringify(output, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify(results.map(r => ({ figure: r.figure, groupCoverage: r.groups.map(g => ({ id: g.id, complete: g.complete, pointCoverage: g.pointCoverage })), svgMatchesManifest: r.svgMatchesManifest, svgMatchesSavedNativeOutput: r.svgMatchesSavedNativeOutput, snapshot: r.snapshot, semanticNumericObservations: r.semanticNumericObservations })), null, 2));
