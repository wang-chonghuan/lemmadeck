#!/usr/bin/env python3
"""Record visual review evidence tied to the current spec, source, and outputs."""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

from validate_spec import SCHEMA, load, sha256, validate


REVIEW_SCHEMA = "ld-s10y-image/review@1"
RENDER_SCHEMA = "ld-s10y-image/render@2"


def portable(path: Path) -> str:
    absolute = path.resolve()
    try:
        return absolute.relative_to(Path.cwd().resolve()).as_posix()
    except ValueError:
        return absolute.as_posix()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--spec", required=True, type=Path)
    evidence = parser.add_mutually_exclusive_group(required=True)
    evidence.add_argument("--render", type=Path)
    evidence.add_argument("--generation", type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--status", choices=("pass", "fail"), required=True)
    parser.add_argument("--notes", required=True)
    args = parser.parse_args()

    failures = validate(args.spec, "rendered")
    if failures:
        raise SystemExit("\n".join(f"ERROR: {failure}" for failure in failures))

    spec = load(args.spec)
    if spec.get("schema") != SCHEMA:
        raise SystemExit(f"ERROR: reviews require {SCHEMA}")
    evidence_name = "render" if args.render else "generation"
    evidence_path = args.render or args.generation
    producer = load(evidence_path)
    if evidence_name == "render":
        if producer.get("schema") != RENDER_SCHEMA:
            raise SystemExit(f"ERROR: render evidence must use {RENDER_SCHEMA}")
        if producer.get("figure") != spec.get("id"):
            raise SystemExit("ERROR: render figure does not match spec")
        if producer.get("status") != "pass":
            raise SystemExit("ERROR: a failing render cannot receive visual approval")
        if producer.get("spec", {}).get("sha256") != sha256(args.spec):
            raise SystemExit("ERROR: render evidence uses a stale FigureSpec")
    else:
        if spec.get("mode") != "generated":
            raise SystemExit("ERROR: generation evidence is only valid for generated mode")
        if producer.get("schema") != "n-azure/image-generation@1":
            raise SystemExit("ERROR: invalid generation evidence")

    source = spec["source"]["image"]
    if evidence_name == "render":
        outputs = producer.get("output")
        if not isinstance(outputs, dict) or not outputs:
            raise SystemExit("ERROR: render evidence has no durable outputs")
        for name, record in outputs.items():
            output_path = Path(record.get("path", ""))
            if not output_path.is_file() or record.get("sha256") != sha256(output_path):
                raise SystemExit(f"ERROR: stale or missing render output {name}")
    else:
        output_record = producer.get("output", {})
        output_path = Path(output_record.get("path", ""))
        if not output_path.is_file() or output_record.get("sha256") != sha256(output_path):
            raise SystemExit("ERROR: stale or missing generated output")
        outputs = {
            "png": {
                "path": portable(output_path),
                "sha256": sha256(output_path),
            },
        }

    payload = {
        "schema": REVIEW_SCHEMA,
        "figure": spec["id"],
        "status": args.status,
        "reviewedAt": datetime.now(timezone.utc).isoformat(),
        "source": {
            "path": source["path"],
            "sha256": source["sha256"],
        },
        "spec": {
            "path": portable(args.spec),
            "sha256": sha256(args.spec),
        },
        evidence_name: {
            "path": portable(evidence_path),
            "sha256": sha256(evidence_path),
        },
        "outputs": outputs,
        "notes": args.notes,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"{args.status.upper()}: {spec['id']} -> {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
