#!/usr/bin/env python3
"""Whitelist source preparation only. No option generation or answer lookup."""

import argparse
import hashlib
import json
from pathlib import Path
import re
import sys

ARTIFACTS = Path("ssot-resources/soviet10year-textbooks/artifacts")
SEED_SCHEMA = "s10y-choice-seed-v1"


class ContractError(ValueError):
    pass


def require(condition, message):
    if not condition:
        raise ContractError(message)


def text(value, where):
    require(isinstance(value, str) and bool(value.strip()), f"{where}: nonempty text required")
    return value


def unique(values, where):
    require(isinstance(values, list), f"{where}: list required")
    require(len(values) == len(set(values)), f"{where}: duplicate entries")
    return values


def no_duplicate_keys(pairs):
    result = {}
    for key, value in pairs:
        require(key not in result, f"JSON: duplicate key {key}")
        result[key] = value
    return result


def load_json(path):
    def reject_constant(value):
        raise ContractError(f"JSON: non-finite constant {value}")

    return json.loads(Path(path).read_text(encoding="utf-8"), object_pairs_hook=no_duplicate_keys,
                      parse_constant=reject_constant)


def digest(value):
    encoded = json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":"))
    return hashlib.sha256(encoded.encode("utf-8")).hexdigest()


def file_hash(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def inside(path, root):
    resolved = path.resolve()
    require(resolved.is_relative_to(root.resolve()), f"path escapes allowed root: {path}")
    return resolved


def component(value, where):
    require(isinstance(value, str) and re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_-]*", value),
            f"{where}: invalid path component")
    return value


def source_files(repo, book, lesson):
    repo = Path(repo).resolve()
    base = inside(repo / ARTIFACTS / component(book, "book"), repo / ARTIFACTS)
    directory = inside(base / "editions/modern-us-neutral/lessons" /
                       component(lesson, "lesson"), base)
    paths = [base / "book.json"] + [directory / name for name in
                                   ("lesson.json", "exercises.json", "figures.json")]
    data = [load_json(inside(path, base)) for path in paths]
    require(any(item.get("id") == lesson for item in data[0]["lessons"]),
            "lesson absent from original book.json")
    require(data[1].get("id") == lesson, "lesson.json identity mismatch")
    return repo, base, directory, paths, data


def exercise_projection(item):
    number = text(item["number"], "exercise.number")
    body = text(item["text"], f"exercise {number}.text")
    refs = item.get("figure_refs", [])
    require(isinstance(refs, list), f"exercise {number}.figure_refs: list required")
    refs = [text(ref, "figure reference") for ref in refs]
    embedded = item.get("figures", [])
    require(isinstance(embedded, list), f"exercise {number}.figures: list required")
    refs += [text(figure["id"], "figure id") for figure in embedded]
    return {"number": number, "text": body, "figure_ids": list(dict.fromkeys(refs))}


def inventory(repo, book, lesson):
    _, _, _, _, data = source_files(repo, book, lesson)
    exercises = [exercise_projection(item) for item in data[2]["exercises"]]
    unique([item["number"] for item in exercises], "source exercise numbers")
    candidates = [{"block": i, "text": text(block["text"], f"prose[{i}]")}
                  for i, block in enumerate(data[1]["prose"])
                  if block.get("kind") == "p" and block.get("text")]
    return {"exercises": exercises, "concept_candidates": candidates,
            "figures": [{"id": figure["id"], "label": figure.get("label")}
                        for figure in data[3]["figures"]]}


def project_figure(figure, repo, base, directory):
    edition = directory.parent.parent
    paths = [figure[kind] for kind in ("svg", "png", "artwork") if figure.get(kind)]
    final_output = bool(paths)
    if not final_output:
        source = figure.get("source", {})
        paths = [source[kind]["path"] for kind in ("png", "svg")
                 if source.get(kind, {}).get("path")]
    assets = []
    for value in dict.fromkeys(paths):
        value = text(value, "figure asset path")
        relative = Path(value)
        require(not relative.is_absolute() and ".." not in relative.parts,
                f"unsafe figure asset path: {value}")
        path = repo / relative if relative.parts[:len(ARTIFACTS.parts)] == ARTIFACTS.parts \
            else edition / relative
        resolved = inside(path, base)
        require(resolved.suffix.lower() in {".png", ".svg", ".jpg", ".jpeg", ".webp"},
                f"not an image asset: {value}")
        # Source renditions may be absent; declared final outputs must exist.
        if not final_output and not resolved.exists():
            continue
        assets.append({"path": path.relative_to(repo).as_posix(), "sha256": file_hash(resolved)})
    require(bool(assets), f"figure {figure['id']}: no usable image asset")
    label = figure.get("label")
    require(label is None or isinstance(label, str), "figure label must be text or null")
    return {"id": text(figure["id"], "figure id"), "label": label, "assets": assets}


def prepare_seed(repo, book, lesson, numbers, blocks, concept_figures):
    repo, base, directory, paths, data = source_files(repo, book, lesson)
    require(bool(numbers), "select at least one exercise")
    unique(numbers, "selected exercises")
    unique(blocks, "selected concept blocks")
    unique(concept_figures, "selected concept figures")
    all_exercises = [exercise_projection(item) for item in data[2]["exercises"]]
    unique([item["number"] for item in all_exercises], "source exercise numbers")
    by_number = {item["number"]: item for item in all_exercises}
    require(set(numbers) <= set(by_number), "unknown exercise number")
    exercises = [by_number[number] for number in numbers]
    concepts = []
    for index in blocks:
        require(type(index) is int and 0 <= index < len(data[1]["prose"]),
                f"invalid concept block: {index}")
        block = data[1]["prose"][index]
        require(block.get("kind") == "p", f"concept block {index} is not prose")
        concepts.append({"block": index, "text": text(block["text"], f"concept block {index}")})
    require(not concept_figures or bool(concepts), "concept figures need selected concept prose")
    figures_by_id = {}
    for figure in data[3]["figures"]:
        figure_id = text(figure["id"], "source figure id")
        require(figure_id not in figures_by_id, f"duplicate source figure: {figure_id}")
        figures_by_id[figure_id] = figure
    needed = list(dict.fromkeys([ref for item in exercises for ref in item["figure_ids"]] +
                               concept_figures))
    require(set(needed) <= set(figures_by_id), "referenced figure absent from figures.json")
    return {"schema": SEED_SCHEMA,
            "source": {"book": book, "lesson": lesson, "concept_figure_ids": concept_figures},
            "exercises": exercises, "concepts": concepts,
            "figures": [project_figure(figures_by_id[ref], repo, base, directory) for ref in needed],
            "trace": [{"path": path.relative_to(repo).as_posix(), "sha256": file_hash(path)}
                      for path in paths]}


def scratch_path(path, repo):
    repo = Path(repo).resolve()
    resolved = inside(Path(path) if Path(path).is_absolute() else repo / path, repo)
    parts = resolved.relative_to(repo).parts
    allowed = (len(parts) >= 2 and parts[0] == ".tmp") or \
        (len(parts) >= 5 and parts[:2] == (".intentfold", "tickets") and parts[3] == "tmp")
    require(allowed, "outputs must be inside ticket tmp/ or repository .tmp/")
    return resolved


def write_seed(path, value, repo):
    target = scratch_path(path, repo)
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, indent=2, ensure_ascii=True)
        stream.write("\n")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    hash_command = commands.add_parser("digest", help="canonical JSON SHA-256")
    hash_command.add_argument("file")
    for name in ("inspect", "prepare"):
        sub = commands.add_parser(name)
        sub.add_argument("--repo", required=True)
        sub.add_argument("--book", required=True)
        sub.add_argument("--lesson", required=True)
        if name == "prepare":
            sub.add_argument("--exercise", action="append", required=True)
            concepts = sub.add_mutually_exclusive_group(required=True)
            concepts.add_argument("--concept-block", type=int, action="append")
            concepts.add_argument("--no-concepts", action="store_true")
            sub.add_argument("--concept-figure", action="append", default=[])
            sub.add_argument("--out", required=True)
    args = parser.parse_args()
    try:
        if args.command == "digest":
            print(digest(load_json(args.file)))
        elif args.command == "inspect":
            print(json.dumps(inventory(args.repo, args.book, args.lesson), indent=2, ensure_ascii=True))
        else:
            seed = prepare_seed(args.repo, args.book, args.lesson, args.exercise,
                                args.concept_block or [], args.concept_figure)
            write_seed(args.out, seed, args.repo)
            print(f"prepared {len(seed['exercises'])} written seeds; no questions generated")
            print(f"seed_sha256={digest(seed)}")
        return 0
    except (ContractError, OSError, KeyError, TypeError, IndexError, json.JSONDecodeError) as error:
        print(f"input error: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
