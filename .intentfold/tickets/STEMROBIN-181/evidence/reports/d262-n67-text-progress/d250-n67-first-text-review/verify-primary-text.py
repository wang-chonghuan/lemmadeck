import hashlib
import json
import re
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

OUT = Path(__file__).resolve().parent
sources = json.loads((OUT / "primary-source-notes.json").read_text())["sources"]

class TextParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.hidden = 0
        self.parts = []
    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style"}:
            self.hidden += 1
        if tag in {"p", "div", "br", "li", "h1", "h2", "h3"}:
            self.parts.append("\n")
    def handle_endtag(self, tag):
        if tag in {"script", "style"}:
            self.hidden = max(0, self.hidden - 1)
        if tag in {"p", "div", "li", "h1", "h2", "h3"}:
            self.parts.append("\n")
    def handle_data(self, data):
        if not self.hidden:
            self.parts.append(data)

results = []
for source in sources:
    result = {"id": source["id"], "requestedUrl": source["url"]}
    try:
        request = urllib.request.Request(source["url"], headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(request, timeout=25) as response:
            payload = response.read()
            result.update({"httpStatus": response.status, "resolvedUrl": response.url, "responseSha256": hashlib.sha256(payload).hexdigest(), "responseBytes": len(payload)})
        parser = TextParser()
        parser.feed(payload.decode("utf-8", errors="replace"))
        text = re.sub(r"\s+", " ", "".join(parser.parts)).strip()
        result["textSha256"] = hashlib.sha256(text.encode()).hexdigest()
        result["title"] = re.search(r"<title[^>]*>(.*?)</title>", payload.decode("utf-8", errors="replace"), re.S | re.I).group(1).strip()
        expressions = {
            "NIST-CANDELA": ["spectral responsivity", "555 nm", "Xv", "luminous intensity", "steradian"],
            "CIE-POINT-SOURCE": ["dimensions", "uniformly", "point source"],
            "CIE-INTENSITY": ["quotient of", "luminous intensity"],
            "CIE-STERADIAN": ["cuts off", "steradian"],
            "BIPM-SOLID-ANGLE": ["area", "dimensionless"],
            "CIE-LUMEN": ["SI unit of luminous flux", "lumen"],
        }[source["id"]]
        windows = []
        for phrase in expressions:
            pos = text.casefold().find(phrase.casefold())
            if pos >= 0:
                excerpt = text[max(0, pos - 100):pos + 600]
                windows.append({"searchPhrase": phrase, "excerptSha256": hashlib.sha256(excerpt.encode()).hexdigest()})
        result["necessaryTextWindows"] = windows
        result["status"] = "TEXT-RETRIEVED" if windows else "HOLD-NO-RELEVANT-TEXT"
    except Exception as error:
        result.update({"status": "HOLD-RETRIEVAL-FAILED", "error": str(error)})
    results.append(result)
record = {
    "schema": "stemrobin/necessary-primary-http-text-binding@1",
    "access": "Direct standard-library HTTP and HTML text parser; no browser or page/image rendering.",
    "results": results,
    "responseHashScope": "Hashes bind response bytes read in memory; only necessary text windows are retained.",
    "newImagesOpened": 0,
    "cumulativeContextImages": 24
}
with (OUT / "primary-text-bindings.json").open("x") as handle:
    json.dump(record, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
print(json.dumps(record, ensure_ascii=False))
