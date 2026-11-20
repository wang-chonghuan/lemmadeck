#!/usr/bin/env python3
"""Verify hash-bound review evidence and emit the output hash manifest."""

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path


OUT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n17-visual-review")


def sha256_file(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def load_json(path):
    with Path(path).open(encoding="utf-8") as handle:
        return json.load(handle)


def main():
    review = load_json(OUT / "review.json")
    receipt = load_json(OUT / "transform-receipt.json")
    assert review["status"] == "pass"
    assert review["imagesObserved"] == review["sourceScreenshots"] == 6
    assert review["reopens"] == review["extraCrops"] == 0
    assert review["unresolvedVisualUncertainty"] == []
    assert len(review["views"]) == len(receipt["images"]) == 6
    assert [view["observationOrdinal"] for view in review["views"]] == list(
        range(1, 7)
    )
    by_name = {image["name"]: image for image in receipt["images"]}
    source_entries = []
    for view in review["views"]:
        name = f"{view['page']}-{view['viewportWidth']}"
        record = by_name[name]
        assert view["status"] == "pass"
        assert view["originalPath"] == record["original"]["path"]
        assert view["sheetPath"] == record["sheet"]["path"]
        assert view["originalDimensions"] == [
            record["original"]["width"], record["original"]["height"]
        ]
        assert view["sheetDimensions"] == [
            record["sheet"]["width"], record["sheet"]["height"]
        ]
        assert view["columnsObserved"] == len(record["tiles"])
        assert record["verification"]["status"] == "pass"
        for path_key, hash_key, transform_key in [
            ("originalPath", "originalSha256", "original"),
            ("sheetPath", "sheetSha256", "sheet"),
        ]:
            current_hash = sha256_file(view[path_key])
            assert current_hash == view[hash_key]
            assert current_hash == record[transform_key]["sha256"]
        source_entries.append({
            "path": view["originalPath"],
            "sha256": view["originalSha256"],
        })
    source_results = receipt["sourceResults"]
    assert sha256_file(source_results["path"]) == source_results["sha256"]
    assert receipt["transformCode"]["sha256"] == sha256_file(OUT / "transform.py")
    source_entries.append({
        "path": source_results["path"],
        "sha256": source_results["sha256"],
    })
    manifest_path = OUT / "output-hashes.json"
    entries = []
    for path in sorted(OUT.iterdir()):
        if path.is_file() and path != manifest_path:
            entries.append({
                "path": str(path),
                "bytes": path.stat().st_size,
                "sha256": sha256_file(path),
            })
    manifest = {
        "schema": "n17-visual-review-output-hashes@1",
        "createdUtc": datetime.now(timezone.utc).isoformat(),
        "status": "pass",
        "reviewStatus": review["status"],
        "imagesObserved": review["imagesObserved"],
        "originalAndSheetHashesReverifiedAfterReview": True,
        "outputDirectory": str(OUT),
        "selfHashExcluded": True,
        "selfHashPolicy": "Report manifest SHA256 externally after writing.",
        "outputs": entries,
        "unchangedSourceEvidence": source_entries,
    }
    with manifest_path.open("x", encoding="ascii") as handle:
        json.dump(manifest, handle, indent=2, ensure_ascii=True)
        handle.write("\n")
    print(json.dumps({
        "status": "pass",
        "visualReview": review["status"],
        "imagesObserved": review["imagesObserved"],
        "outputFilesHashed": len(entries),
        "reviewPath": str(OUT / "review.json"),
        "reviewSha256": sha256_file(OUT / "review.json"),
        "reportPath": str(OUT / "report.md"),
        "reportSha256": sha256_file(OUT / "report.md"),
        "transformReceiptPath": str(OUT / "transform-receipt.json"),
        "transformReceiptSha256": sha256_file(OUT / "transform-receipt.json"),
        "manifestPath": str(manifest_path),
        "manifestSha256": sha256_file(manifest_path),
    }, indent=2))


if __name__ == "__main__":
    main()
