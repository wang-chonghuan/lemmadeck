import hashlib
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


SKILL = Path(__file__).resolve().parents[1]
MODULE_SPEC = importlib.util.spec_from_file_location(
    "audit_corpus",
    SKILL / "scripts" / "audit_corpus.py",
)
MODULE = importlib.util.module_from_spec(MODULE_SPEC)
MODULE_SPEC.loader.exec_module(MODULE)


def dump(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value), encoding="utf-8")


class AuditCorpusTests(unittest.TestCase):
    def make_lesson(self, root: Path, manifest: list[dict]) -> Path:
        lesson = (
            root
            / "5m"
            / "editions"
            / "modern-us-neutral"
            / "lessons"
            / "lesson-1"
        )
        dump(lesson / "lesson.json", {"prose": []})
        dump(lesson / "exercises.json", {
            "exercises": [{
                "number": "1",
                "figure_refs": ["fig-01"],
                "figures": [{"id": "fig-01"}],
            }],
        })
        dump(lesson / "figures.json", {"figures": manifest})
        return lesson

    def test_missing_manifest_is_reported_from_exercise_reference(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            self.make_lesson(root, [])
            report = MODULE.audit(root, "modern-us-neutral", False)
            self.assertEqual(report["counts"]["referencedFigures"], 1)
            self.assertTrue(any(
                item["code"] == "missing-manifest" for item in report["issues"]
            ))

    def test_require_current_rejects_referenced_legacy_spec(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            edition = root / "5m" / "editions" / "modern-us-neutral"
            self.make_lesson(root, [{
                "id": "fig-01",
                "spec": "figures/fig-01.spec.json",
            }])
            dump(edition / "figures" / "fig-01.spec.json", {
                "schema": "ld-s10y-image/figure-spec@1",
            })
            report = MODULE.audit(root, "modern-us-neutral", True)
            self.assertEqual(report["counts"]["legacyFigures"], 1)
            self.assertTrue(any(
                item["code"] == "legacy-spec" for item in report["issues"]
            ))

    def test_current_review_hashes_are_checked(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            edition = root / "5m" / "editions" / "modern-us-neutral"
            source = root / "source.png"
            source.write_bytes(b"source")
            svg = edition / "figures" / "fig-01.svg"
            render = edition / "figures" / "fig-01.render.json"
            spec = edition / "figures" / "fig-01.spec.json"
            review = edition / "figures" / "fig-01.review.json"
            svg.parent.mkdir(parents=True)
            svg.write_text("<svg/>", encoding="utf-8")
            dump(render, {"schema": "ld-s10y-image/render@2"})
            dump(spec, {
                "schema": MODULE.CURRENT_SPEC,
                "id": "fig-01",
                "mode": "deterministic",
                "source": {
                    "image": {
                        "path": source.as_posix(),
                        "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
                    },
                    "inventory": [{"id": "source"}],
                },
            })
            dump(review, {
                "schema": MODULE.CURRENT_REVIEW,
                "figure": "fig-01",
                "status": "pass",
                "source": {"sha256": hashlib.sha256(source.read_bytes()).hexdigest()},
                "spec": {"sha256": hashlib.sha256(spec.read_bytes()).hexdigest()},
                "render": {"sha256": "0" * 64},
                "outputs": {
                    "svg": {"sha256": hashlib.sha256(svg.read_bytes()).hexdigest()},
                },
            })
            self.make_lesson(root, [{
                "id": "fig-01",
                "spec": "figures/fig-01.spec.json",
                "svg": "figures/fig-01.svg",
                "render": "figures/fig-01.render.json",
                "review": "figures/fig-01.review.json",
            }])
            report = MODULE.audit(root, "modern-us-neutral", True)
            self.assertTrue(any(
                item["code"] == "stale-review-render"
                for item in report["issues"]
            ))


if __name__ == "__main__":
    unittest.main()
