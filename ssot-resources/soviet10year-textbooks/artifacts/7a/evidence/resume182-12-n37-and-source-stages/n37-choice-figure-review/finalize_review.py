#!/usr/bin/env python3
"""Persist the independent observations after exactly eight original-size opens."""

import json
import math
from pathlib import Path
import re
import subprocess
import sys
import xml.etree.ElementTree as ET

from audit_inputs import IDENTITY, OWNER, ROOT, close, record


OBSERVATIONS = {
    "fig-choice-n37-cubic-A": (
        "Opened the entire final 640x420 PNG once at original resolution. "
        "The left heading y=x^3 sits over a decreasing, flattened-at-zero odd cubic; "
        "its endpoints are screen (52,75) and (268,345), corresponding to "
        "(-1.5,3.375) and (1.5,-3.375). The right heading y=-x^3 sits over "
        "the increasing reflection, endpoints (372,345) and (588,75). "
        "Both curves cross their axis intersection. This is exactly the declared "
        "exchange of +x^3 and -x^3, not an accidental sign defect. The y ticks "
        "are +3 above and -3 below; x ticks are -1.5 left and +1.5 right. "
        "Both right-hand curve ends and both bottom Origin (0,0) captions are visible."
    ),
    "fig-choice-n37-cubic-B": (
        "Opened the entire final 640x420 PNG once at original resolution. "
        "The left y=x^3 panel rises from screen (52,345) through (160,210) to "
        "(268,75); the right y=-x^3 panel falls from (372,75) through (480,210) "
        "to (588,345). The flattened tangent at zero and increasing growth away "
        "from zero distinguish the two curves from straight lines. Independent "
        "substitution gives left y=-1,0,1 at x=-1,0,1 and the opposite values "
        "on the right. Both panels show y, x, +/-3 and +/-1.5 on the correct axes. "
        "The lower-right endpoint and both bottom origin captions are fully present."
    ),
    "fig-choice-n37-cubic-C": (
        "Opened the entire final 640x420 PNG once at original resolution. "
        "The left panel visibly draws a straight rising line from screen (52,270) "
        "to (268,150), and the right draws a straight falling line from (372,150) "
        "to (588,270). Both pass through their axis intersection with a nonzero "
        "tangent. Thus the drawn models are +x and -x under the retained cubic "
        "headings, exactly the declared linear substitutes. At x=+/-1.5 their "
        "vertical magnitude is 1.5, not the cubic magnitude 3.375. No curve is "
        "missing because it lacks cubic curvature; that is deliberate. "
        "The right endpoints, +/-3 y labels and both bottom origin captions are visible."
    ),
    "fig-choice-n37-cubic-D": (
        "Opened the entire final 640x420 PNG once at original resolution. "
        "The left panel is an upward even parabola, with equal endpoint heights "
        "at screen (52,120) and (268,120), and vertex (160,210). The right is its "
        "downward reflection, endpoints (372,300),(588,300), vertex (480,210). "
        "Independent values at x=+/-1 are +1 on the left and -1 on the right, "
        "and at +/-1.5 are +2.25 and -2.25. These are the declared +x^2/-x^2 "
        "substitutes under cubic headings. Evenness and the turn at zero are "
        "intentional, not grounds to reject the authored figure. Rightmost objects "
        "and both bottom origin captions are intact; x and y scale labels remain clear."
    ),
    "fig-choice-n37-quadratic-A": (
        "Opened the entire final 640x420 PNG once at original resolution. "
        "The left y=1.73x^2 heading has the declared downward reflection "
        "(-1.73x^2), vertex (160,210), endpoints (52,300),(268,300). "
        "The right y=-14.8x^2 heading has the declared upward reflection "
        "(+14.8x^2), vertex (480,210), endpoints (372,120),(588,120). "
        "The vertical title is y, not x or a normalized axis. Visible y ticks "
        "are +/-5.19 on the left and +/-44.4 on the right at 120 px from zero; "
        "hence the units are 40/1.73=23.121387 px/y and 40/14.8=2.702703 px/y. "
        "Equal-looking curve widths do not imply equal y scales. At x=+/-1 the "
        "declared values are -1.73 and +14.8; at +/-1.5 they are -3.8925 and "
        "+33.3. The sign exchange is deliberate. Rightmost x, lower y ticks "
        "and both bottom origin captions are readable and uncropped."
    ),
    "fig-choice-n37-quadratic-B": (
        "Opened the entire final 640x420 PNG once at original resolution. "
        "The left heading y=ax^2, a>0 has an upward parabola with endpoints "
        "(52,120),(268,120), vertex (160,210). The right heading y=ax^2, a<0 "
        "has a downward parabola with endpoints (372,300),(588,300), vertex "
        "(480,210). Both vertical axes visibly read y/|a|, with +/-3 normalized "
        "ticks; neither heading nor axis assigns a numeric value to a. "
        "Dividing ax^2 by |a| independently yields +x^2 for a>0 and -x^2 for a<0. "
        "At x=+/-1 the normalized values are +1 and -1, and at +/-1.5 they are "
        "+2.25 and -2.25. The normalization text is separated from the equation "
        "and +3 tick. The right-hand objects and both bottom origin captions are complete."
    ),
    "fig-choice-n37-quadratic-C": (
        "Opened the entire final 640x420 PNG once at original resolution. "
        "Both parameter panels visibly open downward, with vertices "
        "(160,210),(480,210) and endpoint pairs (52,300),(268,300) and "
        "(372,300),(588,300). Both axes explicitly read y/|a|; headings retain "
        "a>0 on the left and a<0 on the right with no fixed a. Their drawn "
        "normalized values are -1 at x=+/-1 and -2.25 at +/-1.5. "
        "This faithfully draws the declared -x^2 in both panels, including the "
        "intentional sign alternative under a>0. It is not rejected for differing "
        "from the positive-parameter source relationship. +/-3 y/|a| and +/-1.5 "
        "x labels are on the correct axes. Lower-right curve end and both bottom "
        "origin captions are visible with no text collision."
    ),
    "fig-choice-n37-quadratic-D": (
        "Opened the entire final 640x420 PNG once at original resolution. "
        "The y=1.73x^2 panel opens upward with vertex (160,210), endpoints "
        "(52,120),(268,120); y=-14.8x^2 opens downward with vertex (480,210), "
        "endpoints (372,300),(588,300). Independent substitution at x=+/-1 gives "
        "1.73 and -14.8; at +/-1.5 it gives 3.8925 and -33.3. The actual "
        "vertical axes are titled y and show +/-5.19 and +/-44.4, respectively, "
        "120 px from zero. Therefore different vertical units, 23.121387 and "
        "2.702703 px per actual y unit, explain the equal screen silhouettes. "
        "Horizontal ticks are +/-1.5 with 72 px per x unit in both panels. "
        "The negative right y tick, rightmost x label and both bottom Origin (0,0) "
        "captions are visible; nothing is clipped or overlapped."
    ),
}

LAYOUT = (
    "At the declared scroll-media width 640 px, the inspected PNG is already "
    "the natural display size: the SVG has 20 px formula headings and 18 px "
    "axis titles, numeric labels and origin captions, all above the 16 px "
    "minimum. All 16 labels are visible and match the SVG text. The two origins "
    "are screen (160,210) and (480,210), and their captions are centered below "
    "at (160,395),(480,395); the captions identify coordinates, not a second "
    "plotted origin. The rightmost x title at (617,210), top headings at y=20 "
    "and bottom captions at y=395 have visible clearance from the 640x420 edge. "
    "No black raster, accidental text/curve overlap, clipping, missing arrowhead, "
    "missing right/bottom object, or cultural/foreign-language label is observed. "
    "The finite sampled x window [-1.5,1.5] is not a domain claim: axes extend "
    "beyond the curves and there are no filled endpoint markers or domain labels. "
    "No app, scroll interaction, alternative viewport screenshot or lesson surface "
    "was opened; display approval is limited to this declared 640 px figure contract."
)


def write_json(path, value):
    assert path.is_relative_to(OWNER) and not path.exists()
    path.write_text(json.dumps(value, ensure_ascii=True, indent=2) + "\n")


def unchanged(audit):
    bindings = [audit["seed"], audit["requests"]]
    bindings += [b for f in audit["figures"] for b in f["bindings"].values()]
    for binding in bindings:
        assert record(Path(binding["path"])) == binding, "Candidate changed during review"


def main():
    assert Path.cwd().resolve() == ROOT
    audit_path = OWNER / "input-audit.json"
    audit = json.loads(audit_path.read_text())
    assert [f["figure_id"] for f in audit["figures"]] == list(OBSERVATIONS)
    assert all(not f["failures"] for f in audit["figures"])
    unchanged(audit)
    reviewer = {"kind": "independent_agent", "identity": IDENTITY}
    new_reviews = []
    results = []
    ledger = []
    for ordinal, figure in enumerate(audit["figures"], 1):
        fid = figure["figure_id"]
        directory = OWNER / fid
        if directory.exists():
            assert not any(directory.iterdir()), "Preserve existing review records"
        else:
            directory.mkdir(exist_ok=False)
        spec = json.loads(Path(figure["bindings"]["spec"]["path"]).read_text())
        svg = ET.parse(figure["bindings"]["svg"]["path"]).getroot()
        elements = {e.get("id"): e for e in svg.iter() if e.get("id")}
        arrowheads = {e.get("data-arrowhead-for"): e for e in svg.iter()
                      if e.get("data-arrowhead-for")}
        geometry_count = 0
        axis_checks = []
        for obj in spec["objects"]:
            if obj["type"] not in ("segment", "arrow"):
                continue
            element = elements[f"ld-{fid}_ld-{obj['id']}"]
            drawn = [float(element.get(k)) for k in ("x1", "y1", "x2", "y2")]
            expected = [obj["from"][0], 420 - obj["from"][1],
                        obj["to"][0], 420 - obj["to"][1]]
            if obj["type"] == "segment":
                assert close(drawn, expected), obj["id"]
                geometry_count += 1
            else:
                assert close(drawn[:2], expected[:2]), obj["id"]
                head = arrowheads[element.get("id")]
                transform = re.fullmatch(
                    r"translate\(([-\d.eE]+) ([-\d.eE]+)\) rotate\(([-\d.eE]+)\) "
                    r"scale\(([-\d.eE]+)\) translate\(([-\d.eE]+) ([-\d.eE]+)\)",
                    head.get("transform"),
                )
                assert transform is not None, obj["id"]
                tx, ty, angle, scale, dx, dy = map(float, transform.groups())
                assert close([tx, ty], drawn[2:]), obj["id"]
                path = next(child for child in head if child.tag.endswith("}path"))
                assert path.get("d") == "M 0,0 L 10,5 L 0,10 z", obj["id"]
                radians = math.radians(angle)
                ux, uy = scale * (10 + dx), scale * (5 + dy)
                tip = [tx + ux * math.cos(radians) - uy * math.sin(radians),
                       ty + ux * math.sin(radians) + uy * math.cos(radians)]
                tip_error = math.dist(tip, expected[2:])
                assert tip_error < 0.05, obj["id"]
                axis_checks.append({
                    "object": obj["id"], "declared_screen_endpoint": expected[2:],
                    "shaft_screen_endpoint": drawn[2:], "arrowhead_screen_tip": tip,
                    "tip_error_canvas_px": tip_error,
                    "note": "Shaft shortened for materialized head; composite endpoint preserved.",
                })
            assert all(0 <= p[0] <= 640 and 0 <= p[1] <= 420
                       for p in (obj["from"], obj["to"])), obj["id"]
        assert geometry_count == 136 and len(axis_checks) == 4
        evidence = OBSERVATIONS[fid] + " " + LAYOUT
        review_path = directory / "figure.review.json"
        notes = (
            f"Independent reviewer {IDENTITY}; authored-figure-only pass. "
            f"Opened final PNG once, original 640x420, ordinal {ordinal}/8, "
            f"PNG SHA-256 {figure['bindings']['png']['sha256']}. "
            + evidence
            + " Recomputed all 65 nodes per panel and matched all 128 curve segments "
            "to SVG coordinates and canonical endpoint/connectivity assertions. "
            "No author solution, answer key, draft intent/key, old-choice/history, "
            "producer rerender or original source image was used. Candidate review "
            "only: no promotion, source/view/question gate, or whole-lesson credit."
        )
        completed = subprocess.run(
            [sys.executable, "-B", str(ROOT / ".agents/skills/ld-s10y-image/scripts/record_review.py"),
             "--spec", figure["bindings"]["spec"]["path"],
             "--render", figure["bindings"]["render"]["path"],
             "--output", str(review_path), "--status", "pass", "--notes", notes],
            cwd=ROOT, capture_output=True, text=True, check=True,
        )
        print(completed.stdout.strip())
        provenance = json.loads(review_path.read_text())
        assert provenance["schema"] == "ld-s10y-image/review@1"
        assert provenance["status"] == "pass" and provenance["figure"] == fid
        assert provenance["spec"]["sha256"] == figure["bindings"]["spec"]["sha256"]
        assert provenance["render"]["sha256"] == figure["bindings"]["render"]["sha256"]
        assert provenance["outputs"]["svg"]["sha256"] == figure["bindings"]["svg"]["sha256"]
        node_count = sum(p["unique_sample_nodes"] for p in figure["panels"])
        result = {
            "schema": "n37-choice-figure-independent-review@1",
            "figure_id": fid,
            "asset_sha256": figure["bindings"]["svg"]["sha256"],
            "reviewer": reviewer,
            "verdict": "pass",
            "scope": "Authored-figure fidelity only; deliberate alternatives accepted as declared.",
            "source_number": figure["source_number"],
            "authored_basis": figure["authored_basis"],
            "bindings": figure["bindings"],
            "image_open": {"ordinal": ordinal, "count": 1, "tool": "functions.view_image",
                           "detail": "original", "dimensions": [640, 420],
                           "path": figure["bindings"]["png"]["path"],
                           "sha256": figure["bindings"]["png"]["sha256"]},
            "evidence": evidence,
            "mathematical_checks": {
                "independent_polynomial_sample_nodes": node_count,
                "curve_segments": 128,
                "finite_svg_segments_exactly_matched": geometry_count,
                "axis_shaft_and_arrowhead_checks": axis_checks,
                "total_spec_assertions": len(spec["assertions"]),
                "endpoint_and_connectivity_assertions_matched": 384,
                "inventory_objects_and_assertion_mappings": "complete",
                "max_sample_coordinate_error_px": 0,
                "max_svg_segment_coordinate_error_px": 0,
                "canonical_samples": figure["panels"],
                "interpolation_note": (
                    "x=+/-1 are between sample nodes. Linear interpolation differs "
                    "from exact cubics by 0.05889892578125 canvas px, quadratics by "
                    "0.01953125 px, and linear alternatives by 0 px. Origin and "
                    "window endpoints are exact nodes; no false exact-node claim."
                ),
            },
            "readability_checks": {"display": figure["display"],
                                   "render_display_checks": figure["display_checks"],
                                   "svg_labels": figure["labels"],
                                   "visual_evidence": LAYOUT},
            "render_status": figure["render_status"],
            "ld_s10y_image_review": record(review_path),
            "input_freshness": "All final PNG/SVG/spec/render, request and seed hashes unchanged.",
            "actionable_findings": [],
            "path_resolution_note": (
                "The authoritative repair1 request names preview.png, spec.json and "
                "render.json with figure.svg. No figure.png exists. These named final "
                "bytes were reviewed in place; no rename, copy or rerender was made."
            ),
            "excluded_checks": ["source gate", "view gate", "answer-key comparison",
                                "question gate", "whole-lesson approval", "promotion"],
        }
        result_path = directory / "result.json"
        write_json(result_path, result)
        markdown_path = directory / "review.md"
        assert not markdown_path.exists()
        rows = [
            f"# {fid}", "",
            "Verdict: pass. Scope: independent authored-figure review only.",
            f"Reviewer: independent_agent `{IDENTITY}`.",
            f"Image opens: 1 (batch ordinal {ordinal}/8), original 640x420.", "",
            "## Observed Image", "", OBSERVATIONS[fid], "",
            "## Mathematical Binding", "", figure["authored_basis"], "",
            f"Recomputed {node_count} polynomial nodes, 128 curve segments and their "
            "384 endpoint/connectivity assertions. All 136 finite SVG segments "
            "(curves and ticks) match spec coordinates; four axis shafts plus "
            "materialized arrowheads preserve each full endpoint within 0.05 px. "
            "All 398 spec assertions "
            "passed the record_review.py rendered-stage validation. Canonical "
            "values and subpixel interpolation errors are retained in result.json. "
            "No answer-key comparison was performed.", "",
            "## Layout And Display", "", LAYOUT, "",
            "## Current Byte Bindings", "",
        ]
        for name, binding in figure["bindings"].items():
            rows += [f"- {name}: `{binding['path']}`", f"  SHA-256: `{binding['sha256']}`"]
        rows += ["", f"- Review: `{review_path}`",
                 f"  SHA-256: `{record(review_path)['sha256']}`", "",
                 "## Findings", "", "No definite asset defect; no repair requested.",
                 "The repair1 array names preview.png rather than figure.png. "
                 "The authoritative final path was opened; no substitute was generated.",
                 "Inputs were hash-checked before and after review. Original assets "
                 "and FIRST files were untouched. No app or lesson approval is implied.", ""]
        markdown_path.write_text("\n".join(rows))
        new_reviews.append({
            "figure_id": fid, "asset_sha256": figure["bindings"]["svg"]["sha256"],
            "reviewer": reviewer, "verdict": "pass",
            "evidence": evidence + f" PNG SHA-256 {figure['bindings']['png']['sha256']}; "
            f"spec SHA-256 {figure['bindings']['spec']['sha256']}; "
            f"render SHA-256 {figure['bindings']['render']['sha256']}. "
            f"All 130 sampled nodes, 128 SVG curve segments and canonical assertions "
            f"match the independent basis; detailed evidence: {result_path}.",
        })
        results.append({"figure_id": fid, "verdict": "pass",
                        "result": record(result_path), "markdown": record(markdown_path),
                        "ld_s10y_image_review": record(review_path)})
        ledger.append(result["image_open"] | {"figure_id": fid})
    unchanged(audit)
    new_path = OWNER / "new-figure-reviews.json"
    write_json(new_path, new_reviews)
    ledger_path = OWNER / "image-opens.json"
    write_json(ledger_path, {"initial": 0, "final": 8, "limit": 8,
                             "crops": 0, "reopens": 0, "rerenders": 0,
                             "additional_screenshots": 0, "opens": ledger})
    summary_path = OWNER / "result.json"
    write_json(summary_path, {
        "schema": "n37-choice-figure-review-summary@1", "reviewer": reviewer,
        "scope": "Offline independent new-figure review only, sources 794/795.",
        "outcome": "pass", "images_opened": 8, "figures_reviewed": 8,
        "passes": 8, "revisions": 0, "blocked": 0, "actionable_findings": [],
        "input_audit": record(audit_path), "image_ledger": record(ledger_path),
        "new_figure_reviews": record(new_path), "per_asset_reports": results,
        "boundary_note": "No source/view/key/question gate or whole-lesson credit.",
        "preservation": "Original candidates and FIRST files were not modified.",
        "path_note": "Final PNGs are the repair1 array's preview.png paths, not figure.png.",
    })
    report_path = OWNER / "review.md"
    lines = [
        "# N37 Independent New-Figure Review", "",
        f"Reviewer: independent_agent `{IDENTITY}`.",
        "Outcome: pass. Images opened: 8/8, each once at original 640x420 resolution.",
        "Scope: eight authored graph assets only, mathematical prose 794/795.",
        "No actionable asset defects. Eight hash-bound ld-s10y-image/review@1 pass records.",
        "No source/view/key/question gate, option key comparison or whole-lesson credit.", "",
        "## Results", "",
        "| Figure | Verdict | Observed declared geometry |",
        "| --- | --- | --- |",
        "| cubic-A | pass | Exchanged decreasing/increasing odd cubics |",
        "| cubic-B | pass | Increasing x^3, decreasing -x^3 |",
        "| cubic-C | pass | Straight +x and -x substitutes |",
        "| cubic-D | pass | Even +x^2 and -x^2 substitutes |",
        "| quadratic-A | pass | Reflected numeric signs; actual y-axis scales |",
        "| quadratic-B | pass | Opposite parameter signs; visible y/|a| normalization |",
        "| quadratic-C | pass | Both negative normalized parabolas as declared |",
        "| quadratic-D | pass | Numeric pair with actual +/-5.19, +/-44.4 y ticks |",
        "", "## Evidence Limits", "",
        LAYOUT, "",
        "Every candidate has 130 independently recomputed nodes and 128 SVG curve "
        "segments, with exact sample-coordinate agreement; x=+/-1 falls between "
        "nodes with only the documented subpixel polyline error. record_review.py "
        "validated current specs/renders/outputs without rerendering the producer.",
        "The authoritative repair1 array names preview.png, spec.json, render.json "
        "and figure.svg. No figure.png exists; the named final PNGs were inspected "
        "in place. All original candidates and FIRST evidence were left unchanged.", "",
        "## Report Index", "",
        f"New-figure contract array: `{new_path}`",
        f"SHA-256: `{record(new_path)['sha256']}`", "",
    ]
    for item in results:
        lines += [f"### {item['figure_id']}", ""]
        for name in ("result", "markdown", "ld_s10y_image_review"):
            binding = item[name]
            lines += [f"- {name}: `{binding['path']}`", f"  SHA-256: `{binding['sha256']}`"]
        lines.append("")
    assert not report_path.exists()
    report_path.write_text("\n".join(lines))
    manifest_path = OWNER / "report-manifest.json"
    write_json(manifest_path, {
        "schema": "n37-choice-figure-report-manifest@1", "images_opened": 8,
        "outcome": "pass", "actionable_findings": [],
        "files": [record(p) for p in sorted(OWNER.rglob("*"))
                  if p.is_file() and p != manifest_path],
    })
    print(json.dumps({"result": record(summary_path), "review": record(report_path),
                      "new_figure_reviews": record(new_path),
                      "manifest": record(manifest_path)}, indent=2))


if __name__ == "__main__":
    main()
