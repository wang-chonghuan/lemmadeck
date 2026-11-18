#!/usr/bin/env python3
"""Use the existing edition helper without reading or changing source files."""

import json
import sys

TOOLS = "/Users/yong/.codex/worktrees/00b1/lemmadeck/.claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, TOOLS)

import edition


request = json.load(sys.stdin)
results = []
for block in request["blocks"]:
    sentences = block["sentences"]
    text = edition.normalize_prose_layout("\n".join(sentences))
    if text.replace("\n", "") != "".join(sentences):
        raise ValueError(f"Normalization changed sentence content: {block['key']}")
    if edition.normalize_prose_layout(text) != text:
        raise ValueError(f"Normalization is not idempotent: {block['key']}")
    groups = [paragraph.split("\n") for paragraph in text.split("\n\n")]
    if any(len(group) not in (2, 3) for group in groups):
        raise ValueError(f"Not a two- or three-sentence paragraph: {block['key']}")
    if any(not sentence.endswith((".", "。", "!", "！", "?", "？")) for sentence in sentences):
        raise ValueError(f"Incomplete sentence ending: {block['key']}")
    source = block["source_text"]
    errors = edition.validate_text(
        source, text, ["modernized", "clarification", "layout"], [],
        block["key"], [],
    )
    if errors:
        raise ValueError("; ".join(errors))
    source_tokens = [match.group(0) for match in edition.MATH.finditer(source)]
    modern_tokens = [match.group(0) for match in edition.MATH.finditer(text)]
    if source_tokens != modern_tokens:
        raise ValueError(f"Exact math-token order changed: {block['key']}")
    source_figures = [match.group(1) for match in edition.FIGURE_REFERENCE.finditer(source)]
    modern_figures = [match.group(1) for match in edition.FIGURE_REFERENCE.finditer(text)]
    if source_figures != modern_figures:
        raise ValueError(f"Figure-reference occurrence order changed: {block['key']}")
    def reference_flow(value):
        tokens = [(match.start(), "math", match.group(0)) for match in edition.MATH.finditer(value)]
        tokens.extend(
            (match.start(), "figure", match.group(1))
            for match in edition.FIGURE_REFERENCE.finditer(value)
        )
        return [[kind, token] for _, kind, token in sorted(tokens)]
    if reference_flow(source) != reference_flow(text):
        raise ValueError(f"Interleaved math/figure order changed: {block['key']}")
    results.append({
        "key": block["key"],
        "text": text,
        "sentenceCount": len(sentences),
        "paragraphSentenceCounts": [len(group) for group in groups],
        "mathTokens": modern_tokens,
        "figureReferenceOccurrences": modern_figures,
        "interleavedMathAndFigureOrder": reference_flow(text),
        "sourceNumbersAndReferences": edition.prose_number_signature(source),
        "modernNumbersAndReferences": edition.prose_number_signature(text),
    })


class EvidenceEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, set):
            return sorted(obj)
        return super().default(obj)


json.dump({"blocks": results}, sys.stdout, ensure_ascii=False, indent=2, cls=EvidenceEncoder)
sys.stdout.write("\n")
