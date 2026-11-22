#!/usr/bin/env python3
"""Bind candidate text, exact first-stage receipts, and unviewed outputs."""

from __future__ import annotations

import hashlib
import json
import math
from pathlib import Path
import re
import xml.etree.ElementTree as ET


REPO = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
PARENT = REPO / ".tmp/stemrobin-184-six/n88-fig38-41-author"
OWNER = PARENT / "candidate"
FREEZE = PARENT / "source-freeze"
RELEASE = REPO / ".tmp/stemrobin-184-six/n88-figure-text-release"
TEXTS = RELEASE / "input/10c/editions/modern-us-neutral/lessons/ana10-c6-s3-n88"
SVG_NS = "{http://www.w3.org/2000/svg}"
EXPECTED_RELEASE = "ad2498fc54f7995be1fee1c7d83aba1a9c33d0e9be746183b8fde9ad1514fa3c"
EXPECTED_FREEZE = "8e55fa93d0b366c03630072c208b663692c0e6fe2e6ce731b9516a6f391e299b"
EXPECTED_LESSON = "f25f3d3c67a2fd900d0d36e06a2ca7f73cc86da3902bb08621de536ef434adb4"
EXPECTED_EXERCISES = "c415dabb6e8145256181b508970807808618a1856e9f994e7adfe9eea326a917"


def load(file: Path) -> dict:
    return json.loads(file.read_text())


def binding(file: Path) -> dict:
    data = file.read_bytes()
    return {
        "path": str(file),
        "sha256": hashlib.sha256(data).hexdigest(),
        "bytes": len(data),
    }


def save(file: Path, value: dict) -> None:
    file.write_text(json.dumps(value, ensure_ascii=True, indent=2) + "\n")


def verify_binding(item: dict) -> None:
    assert binding(Path(item["path"]))["sha256"] == item["sha256"], item["path"]


def verify_receipt(file: Path) -> dict:
    receipt = load(file)
    assert receipt["cwd"] == str(REPO)
    assert receipt["exitCode"] == 0
    assert receipt["signal"] is None
    assert receipt["error"] is None
    assert receipt["approvalClaimed"] is False
    for item in receipt["inputs"] + receipt["outputs"]:
        verify_binding(item)
    for item in receipt["streams"].values():
        verify_binding(item)
    if "executedScript" in receipt:
        verify_binding(receipt["executedScript"])
    return receipt


def curve_nodes(d: str) -> list[tuple[float, float]]:
    tokens = d.split()
    assert len(tokens) % 3 == 0
    result = []
    for index in range(0, len(tokens), 3):
        assert tokens[index] == ("M" if index == 0 else "L")
        point = float(tokens[index + 1]), float(tokens[index + 2])
        assert all(math.isfinite(value) for value in point)
        result.append(point)
    return result


def main() -> int:
    assert not (OWNER / "hash-manifest.json").exists(), "Do not replay the package producer"
    assert binding(RELEASE / "manifest.json")["sha256"] == EXPECTED_RELEASE
    assert binding(FREEZE / "hash-manifest.json")["sha256"] == EXPECTED_FREEZE
    assert binding(TEXTS / "lesson.json")["sha256"] == EXPECTED_LESSON
    assert binding(TEXTS / "exercises.json")["sha256"] == EXPECTED_EXERCISES
    freeze = load(FREEZE / "hash-manifest.json")
    for source in freeze["entries"]:
        assert binding(Path(source["inventory_path"]))["sha256"] == source["inventory_sha256"]
    verify_binding(freeze["usage_ledger"])
    lesson = load(TEXTS / "lesson.json")
    authoritative = [
        {"lesson": "ana10-c6-s3-n88", "text": block["text"]}
        for block in lesson["prose"]
        if block["kind"] == "p" and block["text"].strip()
    ]
    author_receipt = verify_receipt(OWNER / "author.execution.json")
    results = []
    all_svg_ids = set()
    context_receipts = []
    render_receipts = []
    standalone_validation_receipts = []
    failures = []
    for number, source in zip(range(38, 42), freeze["entries"], strict=True):
        figure = f"fig-{number}"
        directory = OWNER / f"fig{number}"
        try:
            context_receipt = verify_receipt(directory / "context.execution.json")
            validation_receipt = verify_receipt(directory / "validate.execution.json")
            render_receipt = verify_receipt(directory / "render.execution.json")
            context_receipts.append(context_receipt)
            standalone_validation_receipts.append(validation_receipt)
            render_receipts.append(render_receipt)
            context = load(directory / "context.json")
            spec = load(directory / "spec.json")
            basis = load(directory / "mathematical-basis.json")
            validation = load(directory / "validate.stdout.txt")
            report = load(directory / "render.json")
            assert context["sourceImage"]["sha256"] == source["source_sha256_observed"]
            assert spec["source"]["image"] == {
                "path": source["source_path"], "sha256": source["source_sha256_observed"],
            }
            assert spec["schema"] == "ld-s10y-image/figure-spec@2"
            assert spec["mode"] == "deterministic"
            assert spec["source"]["authoritativeText"] == authoritative
            assert [group["id"] for group in spec["source"]["inventory"]] == source["stable_group_ids"]
            assert spec["display"] == {
                "layout": "scroll", "purpose": "instructional",
                "minTextPx": 16, "widths": [640],
            }
            assert validation["status"] == "pass" and validation["errors"] == []
            assert report["status"] == "pass" and report["collisions"] == []
            assert report["spec"]["sha256"] == binding(directory / "spec.json")["sha256"]
            assert report["displayChecks"][0]["width"] == 640
            assert all(check["status"] == "pass" for check in report["displayChecks"])
            assert all(check["measuredMinPx"] >= 16 for check in report["displayChecks"])
            assert basis["reviewApprovalClaimed"] is False
            assert basis["sourceFidelityHoldRetained"] is True
            objects = {obj["id"]: obj for obj in spec["objects"]}
            assertions = {item["id"]: item for item in spec["assertions"]}
            for group in spec["source"]["inventory"]:
                assert group["objects"] or group["assertions"]
                assert all(item in objects for item in group["objects"])
                assert all(item in assertions for item in group["assertions"])
                assert "MODERN/TEXT-DERIVED, NOT PIXEL FACT" in group["description"]
                assert "RETAINED UNKNOWN/HOLD" in group["description"]
            xml = ET.parse(directory / f"{figure}.svg")
            root = xml.getroot()
            assert root.tag == SVG_NS + "svg"
            assert int(root.attrib["width"]) == spec["canvas"]["width"]
            assert int(root.attrib["height"]) == spec["canvas"]["height"]
            ids = [node.attrib["id"] for node in root.iter() if "id" in node.attrib]
            assert len(ids) == len(set(ids))
            assert not all_svg_ids.intersection(ids)
            all_svg_ids.update(ids)
            assert not list(root.iter(SVG_NS + "image"))
            assert not list(root.iter(SVG_NS + "foreignObject"))
            labels = [
                node.text or "" for node in root.iter(SVG_NS + "text")
                if "data-label-id" in node.attrib
            ]
            expected_labels = [
                obj["text"] for obj in spec["objects"] if obj["type"] == "text"
            ]
            assert labels == expected_labels
            assert len(labels) == report["labels"]
            paths = {
                node.attrib["d"]: node for node in root.iter(SVG_NS + "path")
                if "d" in node.attrib
            }
            xmin, ymax, xmax, ymin = spec["canvas"]["boundingBox"]
            scale_y = spec["canvas"]["height"] / (ymax - ymin)
            curve_checks = []
            for curve in basis["curves"]:
                object_path = objects[curve["id"]]
                assert object_path["type"] == "svgPath"
                assert object_path["d"] in paths
                assert paths[object_path["d"]].attrib["vector-effect"] == "non-scaling-stroke"
                samples = [
                    (x + xmin, ymax - y)
                    for x, y in curve_nodes(object_path["d"])
                ]
                assert len(samples) == curve["sampleCount"]
                is_inverse = number == 40
                residual = 0.0
                midpoint_error_px = 0.0
                for index, (x, y) in enumerate(samples):
                    assert xmin < x < xmax and ymin < y < ymax
                    exact = math.atan2(1, x) if is_inverse else math.cos(x) / math.sin(x)
                    residual = max(residual, abs(y - exact))
                    if is_inverse:
                        assert 0 < y < math.pi
                    else:
                        left, right = curve["domain"]["openInterval"]
                        assert left < x < right
                    if index:
                        previous_x, previous_y = samples[index - 1]
                        assert x > previous_x and y < previous_y
                        middle_x = (previous_x + x) / 2
                        middle_y = (previous_y + y) / 2
                        middle_exact = (
                            math.atan2(1, middle_x) if is_inverse
                            else math.cos(middle_x) / math.sin(middle_x)
                        )
                        midpoint_error_px = max(
                            midpoint_error_px, abs(middle_y - middle_exact) * scale_y,
                        )
                assert residual < 2e-8
                assert midpoint_error_px < 0.01
                curve_checks.append({
                    "id": curve["id"], "status": "pass",
                    "sampleCount": len(samples),
                    "pathNodesFiniteAndStrictlyInsideCanvas": True,
                    "strictlyDescendingNodeAndPolylineOrder": True,
                    "openDomainOrRange": curve["domain"] if not is_inverse else curve["range"],
                    "maxSerializedNodeEquationResidual": residual,
                    "maxSegmentMidpointErrorCanvasPx": midpoint_error_px,
                    "analyticContinuumAccuracyNotAnIndependentReview": True,
                })
            assert len(curve_checks) == (5 if number == 39 else 1)
            points = [obj for obj in spec["objects"] if obj["type"] == "point"]
            assert len(points) == (2 if number == 41 else 0)
            if number == 39:
                poles = [obj for obj in spec["objects"] if re.fullmatch("f39-dash-0[1-5]", obj["id"])]
                assert len(poles) == 5
                assert [obj["from"][0] for obj in poles] == [
                    k * math.pi for k in [-2, -1, 1, 2, 3]
                ]
                assert len([obj for obj in spec["objects"] if re.fullmatch("f39-label-mid-0[1-5]", obj["id"])]) == 5
            if number == 41:
                upper = objects["f41-guide-upper"]["from"][1]
                lower = objects["f41-guide-lower"]["from"][1]
                assert upper > 0 > lower
                upper_foot = objects["f41-point-upper-foot"]["at"]
                lower_foot = objects["f41-point-lower-foot"]["at"]
                assert upper_foot[0] < math.pi / 2 < lower_foot[0]
                assert abs(upper_foot[0] - math.atan2(1, upper)) < 1e-12
                assert abs(lower_foot[0] - math.atan2(1, lower)) < 1e-12
                assert upper_foot[1] == lower_foot[1] == 0
                for obj in points:
                    element_id = f"ld-{figure}_ld-{obj['id']}"
                    element = next(node for node in root.iter() if node.attrib.get("id") == element_id)
                    expected_x = (obj["at"][0] - xmin) * spec["canvas"]["width"] / (xmax - xmin)
                    expected_y = (ymax - obj["at"][1]) * scale_y
                    assert abs(float(element.attrib["cx"]) - expected_x) < 1e-5
                    assert abs(float(element.attrib["cy"]) - expected_y) < 1e-5
            artifacts = [
                binding(file) for file in sorted(directory.iterdir())
                if file.is_file()
            ]
            results.append({
                "figure": figure, "source": source,
                "context": binding(directory / "context.json"),
                "spec": binding(directory / "spec.json"),
                "mathematicalBasis": binding(directory / "mathematical-basis.json"),
                "validation": {"status": validation["status"], "receipt": binding(directory / "validate.execution.json")},
                "render": {
                    "status": report["status"], "renderer": report["renderer"],
                    "receipt": binding(directory / "render.execution.json"),
                    "report": binding(directory / "render.json"),
                    "svg": binding(directory / f"{figure}.svg"),
                    "preview": binding(directory / "preview.png"),
                    "previewModelViewed": False, "collisions": report["collisions"],
                    "displayChecks": report["displayChecks"],
                },
                "fullGroupMapping": spec["source"]["inventory"],
                "curvePathChecks": curve_checks,
                "artifacts": artifacts,
                "candidateTechnicalChecksOnly": True,
                "approvalClaimed": False,
            })
        except Exception as error:
            failures.append({
                "figure": figure, "stage": "text-and-svg-binding",
                "errorType": type(error).__name__, "message": str(error),
                "dependentFurtherStagesStopped": True,
                "producerReplayed": False,
            })
    ledger = load(OWNER / "usage-ledger.json")
    assert ledger["image_context"]["author_source_model_views_used"] == 4
    assert ledger["image_context"]["parent_model_views_used"] == 24
    ledger["status"] = "candidate-first-stages-frozen" if not failures else "candidate-binding-failure-retained"
    technical = ledger["technical_image_accounting"]
    technical["original_png_header_reads_actual"] = sum(
        receipt["technicalAccounting"]["originalPngHeaderReads"]
        for receipt in context_receipts
    )
    technical["source_png_hash_reads_inside_official_context"] = sum(
        receipt["technicalAccounting"]["sourcePngHashReadsInsideOfficialContext"]
        for receipt in context_receipts
    )
    technical["first_render_invocations"] = len(render_receipts)
    technical["preview_pngs_created"] = sum(
        receipt["technicalAccounting"]["newPreviewPngs"] for receipt in render_receipts
    )
    technical["standalone_draft_validator_invocations"] = len(standalone_validation_receipts)
    technical["renderer_internal_draft_validator_invocations"] = len(render_receipts)
    technical["candidate_package_original_png_reads"] = 0
    technical["preview_hash_reads_are_bytes_only_not_headers_or_payloads"] = True
    ledger["candidate_specs_authored"] = 4
    ledger["candidate_render_statuses"] = {
        result["figure"]: result["render"]["status"] for result in results
    }
    ledger["failures"] = failures
    ledger["retained_holds"].extend([
        "Source curve ends are not mathematical endpoints; plotting windows are explicit modern choices.",
        "Figure 41 levels/meeting coordinates are illustrative modern choices, not recovered source data.",
        "All figures declare fixed 640px scroll media; headed product/mobile scroll/visual review is NOT performed.",
        "Formula path-node and midpoint checks are technical evidence, not independent science/source-fidelity approval.",
    ])
    save(OWNER / "usage-ledger.json", ledger)
    lines = [
        "# N88 figures 38-41: deterministic candidate TEXT handoff",
        "",
        "Candidate-only authoring and first rendering. No figure/source/crop/science/lesson approval.",
        f"Repository: `{REPO}`",
        f"Owned output: `{OWNER}`",
        f"TEXT release manifest SHA-256: `{EXPECTED_RELEASE}`",
        f"Frozen inventory manifest SHA-256, unchanged: `{EXPECTED_FREEZE}`",
        "Source inventory intake supplied: d3970d / receipt8d54ca66, retained once.",
        "",
        "## Outcomes",
        "",
        "| Figure | Draft | First render | Collisions | Min text at 640px | Curves |",
        "| --- | --- | --- | --- | --- | --- |",
    ]
    for result in results:
        render = result["render"]
        measured = min(check["measuredMinPx"] for check in render["displayChecks"])
        lines.append(f"| {result['figure']} | pass | {render['status']} | {len(render['collisions'])} | {measured:g}px | {len(result['curvePathChecks'])} |")
    lines.extend([
        "",
        "Renderer: installed JSXGraph 1.13.1 through the unchanged official render_spec.mjs.",
        "Each standalone draft validator and first render ran once. The renderer's internal draft validation is accounted separately.",
        "Actual executable, argv, cwd, exit, signal, streams, input/output hashes and technical image counts are retained in each execution receipt.",
        "SVGs and preview PNGs were not model-viewed. Preview PNGs were created by the installed renderer's --png path in the same first render.",
        "",
        "## Mathematical and modern regularization limits",
        "",
        "Curves are deterministic formula samples represented only by svgPath M/L curves; labels, axes, guides and points remain renderer-owned objects.",
        "Serialized path nodes were checked for finiteness, canvas bounds, strict descending order and the stated formula. Segment midpoints were checked to <0.01 canvas px.",
        "This is floating-point/polyline technical evidence, not an exact analytic primitive or independent mathematical/visual approval.",
        "Figures 38, 39 and 41 show author-chosen |y|<=3.2 windows. Figure 40 shows x in [-5.25,5.25], always strictly inside the proper output range (0,pi).",
        "Figure 39 retains one shared frame, all five branches, all five dashed pole guides, the solid zero-pole axis, and all five half-period labels.",
        "Its half-period labels use a lower row and inline mathematical typography as explicit modern legibility regularization.",
        "Figure 41 uses two distinct unlabelled illustrative levels, 1.5 and -1.2, and formula-derived projections. These numbers/coordinates are NOT source facts or visible exercise-answer labels.",
        "Both certain projection-foot dots remain; no ambiguous curve/guide junction dots, rounded-ink endpoints or guide arrowheads are invented.",
        "Modern x/y/0/pi meanings and exact scales are text-derived or author-chosen; source codepoint identity and optical exact coordinates remain UNKNOWN.",
        "",
        "## Full Source Group Mapping",
        "",
    ])
    for result in results:
        lines.extend([
            f"### {result['figure']}",
            f"Spec: `{result['spec']['path']}`",
            f"Spec SHA-256: `{result['spec']['sha256']}`",
            f"SVG SHA-256: `{result['render']['svg']['sha256']}`",
            f"Render report SHA-256: `{result['render']['report']['sha256']}`",
            "",
        ])
        for group in result["fullGroupMapping"]:
            lines.extend([
                f"- `{group['id']}`",
                "  Objects: " + (", ".join(f"`{item}`" for item in group["objects"]) or "none; no reconstructed unknown marks"),
                "  Assertions: " + ", ".join(f"`{item}`" for item in group["assertions"]),
                "  Requires: " + (", ".join(group.get("requires", [])) or "no grid / no multi-point requirement for this group"),
            ])
        lines.append("")
    lines.extend([
        "## Retained HOLDs and Accounting",
        "",
        "Original-page/extraction fidelity, unknown source codepoints/scales/coordinates/end intent, upstream science comparison and independent output/display review remain unresolved.",
        "No record_review, durable promotion, edition finalize, browser/display interaction, network, paid generation, DB, Git, install, backend, chat, managed-workspace or new-agent operation.",
        "Source model views: 4/4 unchanged; parent: 24/24 exhausted. No reset, reopen, ROI/crop, new model payload or output image view.",
        "Native original PNG-header reads: exactly 4, only the four official context builders; parent headers 0. Their four SHA reads are separate byte work.",
        "First renders: 4; preview PNGs created: 4; extra render/converter calls: 0.",
        "Charges supplied/carried: 74; paid calls: 0; fees UNKNOWN; complete 0; approvals 0.",
        "All exec/child sessions exited; no running session is needed.",
        f"Failures retained: {json.dumps(failures)}",
        "",
    ])
    (OWNER / "text-report.md").write_text("\n".join(lines))
    manifest = {
        "schema": "n88-modern-figure-candidate-freeze@1",
        "ticket": "STEMROBIN-184", "pipeline": "184-6",
        "lesson": "ana10-c6-s3-n88", "book": "10c",
        "offline": True, "finish": "review", "candidateOnly": True,
        "approvalClaimed": False, "ownerRoot": str(OWNER),
        "release": {
            "manifest": binding(RELEASE / "manifest.json"),
            "lesson": binding(TEXTS / "lesson.json"),
            "exercises": binding(TEXTS / "exercises.json"),
            "scientificComparison": "Active upstream, not yet approval; no reports or keys read.",
        },
        "immutableSourceInventory": {
            "manifest": binding(FREEZE / "hash-manifest.json"),
            "intakeSupplied": {"result": "d3970d", "receipt": "8d54ca66", "retainedOnce": True},
            "sourceModelViewsSpent": 4,
            "reset": False,
        },
        "authorExecution": binding(OWNER / "author.execution.json"),
        "authoringRecord": binding(OWNER / "authoring-record.json"),
        "entries": results,
        "report": binding(OWNER / "text-report.md"),
        "ledger": binding(OWNER / "usage-ledger.json"),
        "localProducers": [
            binding(OWNER / "run-official.mjs"),
            binding(OWNER / "author-candidates.mjs"),
            binding(OWNER / "package-candidates.py"),
        ],
        "installedToolBindings": [
            binding(REPO / ".agents/skills/ld-s10y-image/assets/figure-spec.schema.json"),
            *[
                binding(REPO / ".agents/skills/ld-s10y-image/scripts" / name)
                for name in ["build_context.py", "validate_spec.py", "render_spec.mjs"]
            ],
        ],
        "failures": failures,
        "stopBoundary": "Author/first-render candidate stage only; no output model image view, review approval, source-fidelity clearance or promotion.",
        "sourceOrPreviewHeadersReadByPackage": 0,
        "finalPackageReceipt": str(OWNER / "package.execution.json"),
        "finalPackageReceiptBindingDirection": "Execution receipt hashes this manifest after exit; excluded here to avoid a hash cycle.",
    }
    save(OWNER / "hash-manifest.json", manifest)
    print(json.dumps({
        "status": "candidate-text-and-svg-bindings-pass" if not failures else "failure-retained",
        "manifest": binding(OWNER / "hash-manifest.json"),
        "report": binding(OWNER / "text-report.md"),
        "ledger": binding(OWNER / "usage-ledger.json"),
        "results": [
            {
                "figure": result["figure"], "render": result["render"]["status"],
                "minTextPx": result["render"]["displayChecks"][0]["measuredMinPx"],
                "mappedGroups": len(result["fullGroupMapping"]),
            } for result in results
        ],
        "failures": failures,
        "approvalClaimed": False,
    }))
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
