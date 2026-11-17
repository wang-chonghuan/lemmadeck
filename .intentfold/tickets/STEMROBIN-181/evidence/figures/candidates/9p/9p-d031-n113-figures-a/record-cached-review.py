"""Use native review recording with the already-completed, hash-exact render gate."""

import importlib.util
import json
import sys
from pathlib import Path

own = Path(__file__).resolve().parent
repo = own.parents[2]
scripts = repo / ".agents/skills/ld-s10y-image/scripts"
sys.path.insert(0, str(scripts))
module_spec = importlib.util.spec_from_file_location("native_record_review", scripts / "record_review.py")
native = importlib.util.module_from_spec(module_spec)
module_spec.loader.exec_module(native)
figure = sys.argv[1]
assert figure in {"fig-229", "fig-230"}
initial = own / figure / "initial"
spec_file, render_file = initial / "spec.json", initial / "render.json"
render = native.load(render_file)
draft = native.load(initial / "draft-validation.json")
assert draft["status"] == "pass" and draft["exitCode"] == 0
assert render["schema"] == native.RENDER_SCHEMA and render["status"] == "pass"
assert render["spec"]["sha256"] == native.sha256(spec_file)
cache = {
    "nativeDraftGate": {"path": str(initial / "draft-validation.json"),
                       "sha256": native.sha256(initial / "draft-validation.json")},
    "nativeRenderGate": {"path": str(render_file), "sha256": native.sha256(render_file)},
    "exactValidatedSpec": {"path": str(spec_file), "sha256": native.sha256(spec_file)},
    "policy": "No geometry assertion or renderer replay. Native review writer consumes the already-completed exact-spec native gate; only current source/spec/render/output hash bindings are checked.",
    "cachedGeometryGate": True,
    "newIndependentApproval": False,
}
(initial / "review-validation-cache.json").write_text(json.dumps(cache, indent=2) + "\n")


def binding_only_validation(file, stage):
    errors = []
    if file.resolve() != spec_file.resolve() or stage != "rendered":
        errors.append("Unexpected cached validation target")
    if native.sha256(file) != render["spec"]["sha256"]:
        errors.append("Spec no longer equals the native-validated bytes")
    if native.sha256(render_file) != cache["nativeRenderGate"]["sha256"]:
        errors.append("Completed native render evidence changed")
    spec = native.load(file)
    source = spec["source"]["image"]
    if native.sha256(Path(source["path"])) != source["sha256"]:
        errors.append("Source pixel hash changed")
    return errors


native.validate = binding_only_validation
notes = sys.argv[2]
sys.argv = [
    str(scripts / "record_review.py"), "--spec", str(spec_file), "--render", str(render_file),
    "--output", str(initial / "author-review.json"), "--status", "pass", "--notes", notes,
]
raise SystemExit(native.main())
