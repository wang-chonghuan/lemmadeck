"""Invoke the existing p2c entry and record its actually loaded assembler."""
import hashlib
import json
import runpy
import sys
from pathlib import Path

owned = Path(__file__).resolve().parent
tools = Path.cwd() / ".claude/skills/ld-s10y-lesson/tools"
entry = tools / "p2c.py"
receipt = owned / "commands/assemble.loaded-modules.json"
assert not receipt.exists()
sys.path.insert(0, str(tools))
sys.argv = [str(entry), *sys.argv[1:]]
before = {
    name: hashlib.sha256((tools / name).read_bytes()).hexdigest()
    for name in ("p2c.py", "assemble.py", "blocks.py", "normalize.py", "mathcheck.py")
}
try:
    runpy.run_path(str(entry), run_name="__main__")
finally:
    loaded = []
    for name in ("assemble", "blocks", "normalize", "mathcheck"):
        module = sys.modules.get(name)
        assert module is not None, name
        file = Path(module.__file__).resolve()
        assert file == (tools / f"{name}.py").resolve(), file
        digest = hashlib.sha256(file.read_bytes()).hexdigest()
        assert digest == before[f"{name}.py"], file
        loaded.append({"module": name, "path": str(file), "sha256": digest})
    assert hashlib.sha256(entry.read_bytes()).hexdigest() == before["p2c.py"]
    receipt.write_text(
        json.dumps(
            {"entry": str(entry), "argv": sys.argv, "entrySha256": before["p2c.py"],
             "loadedModules": loaded, "moduleBytesStableDuringInvocation": True,
             "scope": "Actual runpy p2c assemble invocation; no alternate assembler."},
            indent=2,
        ) + "\n",
        encoding="utf-8",
    )
