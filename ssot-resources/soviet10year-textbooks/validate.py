#!/usr/bin/env python3
"""Check every transcribed volume against the contract in README.md.

Run from the repo root:  python3 ssot-resources/soviet10year-textbooks/validate.py
Exits non-zero on the first failure, so it can gate a commit.
"""
import json
import hashlib
import pathlib
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent
REPO = ROOT.parent.parent
TOC = ROOT / "toc"
MANIFEST = ROOT / "sources" / "manifest.json"
SUBJECTS = {"early", "algebra", "analysis", "geometry", "physics", "probability"}
KINDS = {"chapter", "exercises", "section"}
EXERCISE_NUMBERING = {"book", "lesson", "lesson-group"}

errors: list[str] = []


def fail(book: str, msg: str) -> None:
    errors.append(f"{book}: {msg}")


def skeleton(doc: dict) -> list:
    """Everything that must be identical across locales — structure, not words."""
    out = []
    for e in doc["contents"]:
        out.append((e["id"], e["kind"], e.get("number"), e.get("page")))
        if e["kind"] == "chapter":
            for l in e["lessons"]:
                out.append(
                    (
                        l["id"],
                        l["kind"],
                        l.get("number"),
                        l.get("page"),
                        json.dumps(l["source"], ensure_ascii=False, sort_keys=True),
                        tuple((t["id"], t.get("printedNumber")) for t in l.get("topics", [])),
                    )
                )
        else:
            out.append((e["id"], "leaf-source", json.dumps(e["source"], ensure_ascii=False, sort_keys=True)))
    return out


def sha256(path: pathlib.Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def resolve_path(value: str) -> pathlib.Path:
    path = pathlib.Path(value)
    return REPO / path if path.parts and path.parts[0] == "ssot-resources" else ROOT / path


def pdf_pages(path: pathlib.Path) -> int | None:
    if shutil.which("pdfinfo") is None:
        return None
    result = subprocess.run(
        ["pdfinfo", str(path)],
        check=True,
        capture_output=True,
        text=True,
    )
    for line in result.stdout.splitlines():
        if line.startswith("Pages:"):
            return int(line.split(":", 1)[1].strip())
    raise RuntimeError(f"pdfinfo did not report a page count for {path}")


def check_manifest() -> dict:
    try:
        manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError) as exc:
        fail("manifest", f"cannot read {MANIFEST.relative_to(REPO)}: {exc}")
        return {}

    for key in ("pdfRoot", "tocRoot", "artifactRoot"):
        path = resolve_path(manifest.get(key, ""))
        if not path.is_dir():
            fail("manifest", f"{key} does not resolve to a directory: {path.relative_to(REPO)}")

    for group in ("skills", "publishers"):
        for name, value in manifest.get(group, {}).items():
            path = REPO / value
            if not path.is_file():
                fail("manifest", f"{group}.{name} does not resolve: {value}")

    pdf_root = resolve_path(manifest.get("pdfRoot", ""))
    records = manifest.get("pdfs", [])
    ids = [record.get("book") for record in records]
    if len(ids) != len(set(ids)):
        fail("manifest", "duplicate PDF book ids")
    declared_files = set()
    for record in records:
        book = record.get("book", "?")
        path = pdf_root / record.get("file", "")
        declared_files.add(path.name)
        if not path.is_file():
            fail(book, f"missing PDF: {path.relative_to(REPO)}")
            continue
        if path.stat().st_size != record.get("bytes"):
            fail(book, f"PDF byte size differs: {path.relative_to(REPO)}")
        if sha256(path) != record.get("sha256"):
            fail(book, f"PDF sha256 differs: {path.relative_to(REPO)}")
        pages = pdf_pages(path)
        if pages is not None and pages != record.get("pages"):
            fail(book, f"PDF page count differs: want {record.get('pages')}, got {pages}")

    actual_files = {path.name for path in pdf_root.glob("*.pdf")} if pdf_root.is_dir() else set()
    if actual_files != declared_files:
        fail(
            "manifest",
            f"PDF set differs: missing={sorted(declared_files - actual_files)}, "
            f"unlisted={sorted(actual_files - declared_files)}",
        )

    pdf_ids = set(ids)
    catalog_ids = set()
    for record in manifest.get("catalogs", []):
        book = record.get("book", "?")
        catalog_ids.add(book)
        if not (TOC / book).is_dir():
            fail(book, f"missing catalog directory: {(TOC / book).relative_to(REPO)}")
        source_pdf = record.get("sourcePdf")
        if source_pdf is not None and source_pdf not in pdf_ids:
            fail(book, f"sourcePdf {source_pdf!r} is not declared")
        numbering = record.get("exerciseNumbering", "book")
        if numbering not in EXERCISE_NUMBERING:
            fail(book, f"unknown exerciseNumbering {numbering!r}")
        toc_source = resolve_path(record.get("tocSource", ""))
        if not toc_source.is_file():
            fail(book, f"missing TOC source: {toc_source.relative_to(REPO)}")

    actual_catalogs = {path.name for path in TOC.iterdir() if path.is_dir()}
    if actual_catalogs != catalog_ids:
        fail(
            "manifest",
            f"catalog set differs: missing={sorted(catalog_ids - actual_catalogs)}, "
            f"unlisted={sorted(actual_catalogs - catalog_ids)}",
        )
    if set(manifest.get("uncataloguedPdfs", [])) != pdf_ids - {
        record.get("sourcePdf")
        for record in manifest.get("catalogs", [])
        if record.get("sourcePdf")
    }:
        fail("manifest", "uncataloguedPdfs does not match the PDF-to-catalog mapping")
    return manifest


def check_book(d: pathlib.Path) -> None:
    book = d.name
    files = {p.stem: p for p in d.glob("*.json")}
    docs = {}
    for loc, p in files.items():
        try:
            docs[loc] = json.loads(p.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            return fail(book, f"{p.name} is not valid JSON: {exc}")
    if not docs:
        return fail(book, "no locale files")

    # Which locale is the printed one. The Soviet series was read off Chinese
    # editions, so zh is the authority there and the field may be omitted; a book
    # transcribed from another language names it, and every file must agree —
    # otherwise two files could each claim to be what the book prints.
    declared = {doc.get("extractedLocale", "zh") for doc in docs.values()}
    if len(declared) > 1:
        return fail(book, f"locales disagree on extractedLocale: {sorted(declared)}")
    src_loc = declared.pop()
    if src_loc not in docs:
        return fail(book, f"extractedLocale is {src_loc!r} but there is no {src_loc}.json")

    zh = docs[src_loc]
    if zh.get("authority") != "extracted":
        fail(book, f'{src_loc}.json must carry "authority": "extracted"')
    if zh.get("book") != book:
        fail(book, f'book field {zh.get("book")!r} does not match its directory')
    if zh.get("subject") not in SUBJECTS:
        fail(book, f'unknown subject {zh.get("subject")!r}')
    if not isinstance(zh.get("grade"), int):
        fail(book, "grade must be an integer (the volume's entry grade)")

    ids: set[str] = set()
    for e in zh["contents"]:
        if e["kind"] not in KINDS:
            fail(book, f'{e["id"]}: unknown kind {e["kind"]!r}')
        entries = e["lessons"] if e["kind"] == "chapter" else [e]
        if e["kind"] == "chapter" and not e["lessons"]:
            fail(book, f'{e["id"]}: a chapter with no lessons — it is a leaf, use its own kind')
        for l in entries:
            if l["id"] in ids:
                fail(book, f'duplicate id {l["id"]}')
            ids.add(l["id"])
            src = l.get("source")
            if not isinstance(src, dict) or not ({"printedSection", "printedName"} & src.keys()):
                fail(book, f'{l["id"]}: source must carry printedSection or printedName')
            if "page" not in l:
                fail(book, f'{l["id"]}: missing page')
            for pos, tp in enumerate(l.get("topics", []), 1):
                # Numbered where the book numbers it, positional where it does not
                # (物理 prints 引言 / 第一章提要 among numbered items).
                want = (
                    f'{l["id"]}-n{tp["printedNumber"]}'
                    if tp.get("printedNumber") is not None
                    else f'{l["id"]}-t{pos}'
                )
                if tp.get("id") != want:
                    fail(book, f'topic under {l["id"]}: id should be {want}, got {tp.get("id")!r}')
                if tp["id"] in ids:
                    fail(book, f'duplicate id {tp["id"]}')
                ids.add(tp["id"])

    base = skeleton(zh)
    for loc, doc in docs.items():
        if loc == src_loc:
            continue
        if doc.get("authority") != "translated":
            fail(book, f'{loc}.json must carry "authority": "translated"')
        if skeleton(doc) != base:
            first = next(
                (f"{a!r} vs {b!r}" for a, b in zip(base, skeleton(doc)) if a != b),
                "length differs",
            )
            fail(book, f"{loc}.json skeleton differs from zh.json — {first}")


def check_figure_metadata(manifest: dict) -> int:
    artifact_root = resolve_path(manifest.get("artifactRoot", ""))
    checked = 0
    if not artifact_root.is_dir():
        return checked

    for metadata_path in sorted(artifact_root.glob("*/editions/*/figures/*.*.json")):
        if metadata_path.name.endswith(".spec.json"):
            continue
        try:
            metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            fail(
                metadata_path.parts[-5],
                f"{metadata_path.relative_to(REPO)} is not valid JSON: {exc}",
            )
            continue
        spec = metadata.get("spec")
        if not isinstance(spec, dict) or not isinstance(spec.get("sha256"), str):
            continue
        checked += 1
        spec_value = spec.get("path", "")
        if not spec_value.startswith("ssot-resources/"):
            fail(
                metadata_path.parts[-5],
                f"{metadata_path.relative_to(REPO)} has non-durable FigureSpec path "
                f"{spec_value!r}",
            )
            continue
        spec_path = REPO / spec_value
        if not spec_path.is_file():
            fail(
                metadata_path.parts[-5],
                f"{metadata_path.relative_to(REPO)} references missing FigureSpec "
                f"{spec.get('path')!r}",
            )
        elif sha256(spec_path) != spec["sha256"]:
            fail(
                metadata_path.parts[-5],
                f"{metadata_path.relative_to(REPO)} has a stale FigureSpec sha256",
            )

        for kind, output in metadata.get("output", {}).items():
            if not isinstance(output, dict) or not isinstance(output.get("sha256"), str):
                continue
            output_value = output.get("path", "")
            if not output_value.startswith("ssot-resources/"):
                fail(
                    metadata_path.parts[-5],
                    f"{metadata_path.relative_to(REPO)} has non-durable {kind} output "
                    f"{output_value!r}",
                )
                continue
            output_path = REPO / output_value
            if not output_path.is_file():
                fail(
                    metadata_path.parts[-5],
                    f"{metadata_path.relative_to(REPO)} references missing {kind} output "
                    f"{output.get('path')!r}",
                )
            elif sha256(output_path) != output["sha256"]:
                fail(
                    metadata_path.parts[-5],
                    f"{metadata_path.relative_to(REPO)} has a stale {kind} sha256",
                )
    return checked


def main() -> int:
    manifest = check_manifest()
    books = sorted(p for p in TOC.iterdir() if p.is_dir())
    if not books:
        print("no volumes under toc/", file=sys.stderr)
        return 1
    for d in books:
        check_book(d)
    figure_metadata = check_figure_metadata(manifest)
    for e in errors:
        print("FAIL", e, file=sys.stderr)
    if errors:
        return 1
    lessons = 0
    for d in books:
        doc = json.loads((d / "zh.json").read_text(encoding="utf-8"))
        lessons += sum(
            len(e["lessons"]) if e["kind"] == "chapter" else 1 for e in doc["contents"]
        )
    print(
        f"OK — {len(manifest.get('pdfs', []))} PDFs, "
        f"{len(books)} catalog volumes, {lessons} lessons, "
        f"{figure_metadata} figure render records"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
