import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(".claude/skills/ld-s10y-lesson/tools").resolve()))
from edition import load, sha256, update_book_index

parser = argparse.ArgumentParser()
parser.add_argument("--book", required=True, type=Path)
parser.add_argument("--carrier", required=True, type=Path)
parser.add_argument("--edition", required=True)
parser.add_argument("--lesson", required=True)
args = parser.parse_args()
carrier_index = load(args.carrier / "editions" / args.edition / "book.json")
rows = [row for row in carrier_index["lessons"]
        if row["id"] == args.lesson]
assert len(rows) == 1
profile = Path(carrier_index["profile"]["path"])
assert sha256(profile) == carrier_index["profile"]["sha256"]
profile = profile.resolve().relative_to(Path.cwd().resolve())
update_book_index(args.book, args.book / "editions" / args.edition, profile, rows)
print(f"PASS: native index row retained for {args.lesson} / {args.edition}")
