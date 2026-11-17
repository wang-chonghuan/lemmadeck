"""Changed-only checks for title/separator boundaries, independent of old suites."""
import json

from check_heading import load_pattern


def main():
    pattern = load_pattern()
    cases = [
        ("whitespace-makes-math-title", r"$23^{*}$ $\blacktriangle$. Title",
         ("23", r"$\blacktriangle$. Title")),
        ("unsupported-adjacent-decoration", r"$23^{*}$$\blacktriangle$. Title", None),
    ]
    for name, text, expected in cases:
        for method in ("match", "fullmatch"):
            match = getattr(pattern, method)(text)
            observed = match.groups() if match else None
            print(json.dumps({"case": name, "input": text, "method": method,
                              "expected": expected, "observed": observed}), flush=True)
            assert observed == expected, f"{name}/{method}: {observed!r} != {expected!r}"
    print(json.dumps({"cases": len(cases), "asserted_matches": len(cases) * 2,
                      "scope": "changed-only title boundary; previous successful cases not rerun"}))


if __name__ == "__main__":
    main()
