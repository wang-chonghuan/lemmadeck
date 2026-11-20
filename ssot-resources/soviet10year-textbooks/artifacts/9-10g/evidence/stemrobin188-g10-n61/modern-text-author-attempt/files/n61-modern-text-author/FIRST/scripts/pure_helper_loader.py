"""Load only existing pure text helpers, without importing pipeline entry points."""
from __future__ import annotations

import ast
import hashlib
import re
from pathlib import Path


def load_helpers(repo: Path):
    filename = repo / ".claude/skills/ld-s10y-lesson/tools/edition.py"
    source = filename.read_text(encoding="utf-8")
    constants = {
        "MATH", "MATH_TEXT_LITERAL", "MATH_BOUNDARY_PUNCTUATION",
        "MATH_SENTENCE_BOUNDARY", "MATH_BOUNDARY_TOKEN", "NUMBER",
        "PART_MARKER", "LATIN_PARTS", "CYRILLIC_PARTS", "CYRILLIC",
        "IDENTITY_FIELDS",
    }
    functions = {
        "normalize_math_sentence_boundary", "math_signature", "number_signature",
        "masked_math", "nesting_depths", "normalize_prose_layout", "marker_order",
        "normalize_numbered_subparts", "validate_numbered_subpart_layout",
        "validate_identity_fields", "validate_text",
    }
    selected = []
    spans = []
    for node in ast.parse(source, filename=str(filename)).body:
        names = {target.id for target in node.targets if isinstance(target, ast.Name)} if isinstance(node, ast.Assign) else set()
        if names & constants or isinstance(node, ast.FunctionDef) and node.name in functions:
            selected.append(node)
            spans.append({"name": node.name if isinstance(node, ast.FunctionDef) else sorted(names)[0],
                          "start": node.lineno, "end": node.end_lineno})
    if len(selected) != len(constants) + len(functions):
        raise RuntimeError("Pure helper allowlist did not resolve exactly")

    def forbidden_katex_call(_items):
        raise RuntimeError("Unexpected syntax-validation call in pure comparison; stop")

    namespace = {"re": re, "katex_validate": forbidden_katex_call}
    module = ast.Module(body=selected, type_ignores=[])
    exec(compile(module, str(filename), "exec", flags=__future_annotations()), namespace)
    return namespace, {
        "path": str(filename),
        "sha256": hashlib.sha256(source.encode("utf-8")).hexdigest(),
        "selectedUnmodifiedDefinitions": spans,
        "loading": "Python AST isolation of existing pure definitions; no page/source parser, native counter, renderer, pipeline entry point or module import executed.",
        "katexCalls": 0,
    }


def __future_annotations():
    import __future__
    return __future__.annotations.compiler_flag
