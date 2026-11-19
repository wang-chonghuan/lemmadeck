import hashlib
import json
from pathlib import Path
import zipfile

repo = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == repo
archive = Path("/Users/yong/.local/share/ips-cloakbrowser/output/BradisenTablitzen.zip")
output = repo / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/bradis-source"
output.mkdir(parents=True, exist_ok=True)
pdf = output / "book.pdf"
assert not pdf.exists()

# The ZIP's legacy filename cannot be created on this host; preserve its bytes
# while assigning a local ASCII filename to the single PDF payload.
with zipfile.ZipFile(archive) as source:
    entries = source.infolist()
    assert len(entries) == 1 and entries[0].filename.lower().endswith(".pdf")
    entry = entries[0]
    payload = source.read(entry)
    assert payload.startswith(b"%PDF-") and len(payload) == entry.file_size
    with pdf.open("xb") as target:
        target.write(payload)

record = {
    "status": "downloaded-candidate-not-yet-authoritative-table-evidence",
    "page_url": "https://dpva.ru/Guide/GuideMathematics/GuideMathematicsFiguresTables/BradisTables/BradisenTablitzen/",
    "download_url": "https://www.dpva.ru/netcat_files/File/FilesForLoading/GuideMathematics/FiguresTables/BradisenTablitzen.zip",
    "download_method": "CloakBrowser navigation to the observed page link; browser closed",
    "archive_sha256": hashlib.sha256(archive.read_bytes()).hexdigest(),
    "zip_filename_decoded_by_zipfile": entry.filename,
    "pdf_path": str(pdf.relative_to(repo)),
    "pdf_sha256": hashlib.sha256(payload).hexdigest(),
    "pdf_bytes": len(payload),
    "prior_unzip_exit": 50,
    "prior_unzip_failure": "Illegal byte sequence in legacy archive filename",
    "payload_bytes_modified": False,
    "table_values_read": 0,
    "source_holds_lifted": False,
}
with (output / "download.json").open("x", encoding="utf-8") as target:
    json.dump(record, target, indent=2)
    target.write("\n")
print(json.dumps(record))
