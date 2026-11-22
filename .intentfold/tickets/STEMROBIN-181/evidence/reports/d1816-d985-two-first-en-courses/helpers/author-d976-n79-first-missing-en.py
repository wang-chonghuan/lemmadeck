import copy
import hashlib
import json
import sys
from pathlib import Path

repo = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == repo
ticket = repo / ".intentfold/tickets/STEMROBIN-181"
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import edition


def bind(file):
    return {"path": str(file), "bytes": file.stat().st_size,
            "sha256": hashlib.sha256(file.read_bytes()).hexdigest()}


def save(file, data):
    with file.open("x") as stream:
        stream.write(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


prepared_file = ticket / "tmp/d1816-d975-n79-first-missing-en/prepared.json"
prepared = edition.load(prepared_file)
zh_file = Path(prepared["approvedZh"]["path"])
assert bind(zh_file)["sha256"] == prepared["approvedZh"]["sha256"]
zh = edition.load(zh_file)
raw = edition.load(Path(prepared["source"]["path"]))
lesson = copy.deepcopy(zh)
toc_file = repo / "ssot-resources/soviet10year-textbooks/toc/9p/en.json"
toc = edition.load(toc_file)
matching = [(chapter, section, topic)
            for chapter in toc["contents"]
            for section in chapter.get("lessons", [])
            for topic in section.get("topics", [])
            if topic.get("id") == prepared["card"]]
assert len(matching) == 1
chapter, section, topic = matching[0]
lesson.update({"edition": "modern-us-neutral-en", "locale": "en", "status": "draft",
               "title": topic["title"], "chapter": chapter["title"],
               "printed_title": f'{topic["printedNumber"]}. {topic["title"]}'})
texts = [
    "Capacitance describes the relationship between a conductor's change in charge and its change in potential.\nFor an isolated conductor whose shape, surrounding medium, and the positions of external conductors remain fixed, formula (8-33) can be used to define the unit of capacitance.",
    "**Under these conditions, if adding 1 coulomb of charge to a conductor raises its potential by 1 volt, that conductor's capacitance is defined as the SI unit of capacitance: the farad.**\nThe comparison is between the potentials before and after the charge is added, with the same potential reference point.",
    '**The "centimeter" in the electrostatic system of units**\nAccording to formula (8-35), in the **electrostatic system of units**, the capacitance of an isolated conducting sphere of radius 1 centimeter in vacuum is taken as the unit of capacitance.\nThis historical unit is also called the "centimeter".\n\nHere, "centimeter" denotes a unit of capacitance; it does not mean that capacitance is a length.',
    "Converting the units of charge and potential gives the relationship between the farad and the electrostatic unit of capacitance.\nThe conversion below retains the approximate values used in the original textbook; the equality signs mean that the result is obtained using those approximate values:",
    r"1 farad $=\frac{1}{1}$ coulomb/volt $=\frac{3\times10^9}{\frac{1}{300}}$ electrostatic charge unit/electrostatic potential unit $=9\times10^{11}$ centimeters.",
    "**The scale of a farad and common smaller units**\nFor an isolated conducting sphere in vacuum, 1 farad is a very large capacitance.\nUsing the approximate scale comparison in the original textbook, a sphere with a capacitance of 1 farad has a radius slightly more than 13 times the Sun's radius.\n\nSmaller capacitances are therefore often expressed in microfarads, $10^{-6}$ farad, or picofarads, $10^{-12}$ farad.\nWhen Earth is modeled as an isolated conducting sphere in vacuum, unaffected by other conductors, the original textbook estimates its capacitance as 709 microfarads.\nThis is not an exact value for Earth's capacitance in every environment.",
    "**The unit of vacuum permittivity**\nAccording to formula (8-34), in the model of an isolated conducting sphere surrounded by a homogeneous, linear, isotropic medium, the sphere's capacitance and radius can be used to express the vacuum permittivity $\\varepsilon_0$:",
    "Rearranging with the notation of the original textbook gives:\n$\\varepsilon_0=\\frac{C}{4\\pi\\varepsilon r}.$",
    "Here, C is the sphere's capacitance and r is its radius.\nThe medium coefficient in the denominator is the relative permittivity, a dimensionless quantity.\nThus, when capacitance is measured in farads and radius in meters, vacuum permittivity has the unit farad per meter.\n\nThis explains the unit and dimensions; it does not mean that vacuum permittivity changes with the size of the chosen conducting sphere.",
]
assert len(texts) == len(lesson["prose"]) == len(raw["prose"]) == 9
for block, text in zip(lesson["prose"], texts):
    block["text"] = text
out = ticket / "tmp/d1816-d976-n79-first-missing-en"
out.mkdir()
before_file = out / "en.before-native.json"
save(before_file, lesson)
edition.normalize_lesson_layout(lesson)
flow, errors = edition.prose_flow_contract(lesson["prose"], [])
boundaries = []
for heading in ['**The "centimeter" in', "**The scale of a farad", "**The unit of vacuum permittivity**"]:
    indices = [index for index, paragraph in enumerate(flow["paragraphs"])
               if paragraph["text"].startswith(heading)]
    assert len(indices) == 1 and indices[0] > 0, (heading, indices)
    index = indices[0]
    boundaries.append({"before": flow["paragraphs"][index - 1]["text"],
                       "after": flow["paragraphs"][index]["text"]})
lesson["section_breaks"] = boundaries
flow, flow_errors = edition.prose_flow_contract(lesson["prose"], boundaries)
errors.extend(flow_errors)
errors.extend(edition.validate_lesson_identity(raw, lesson))
profile = edition.load(repo / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
for index, (source, modern, approved) in enumerate(zip(raw["prose"], lesson["prose"], zh["prose"])):
    assert edition.math_signature(modern["text"]) == edition.math_signature(approved["text"])
    errors.extend(edition.validate_identity_fields(
        source, modern, ["kind", "id", "label", "printed_page", "source_refs"], f"en.prose[{index}]"))
    errors.extend(edition.validate_text(
        source["text"], modern["text"], modern["changes"], modern["numeric_changes"],
        f"en.prose[{index}]", profile["forbidden_terms"] + profile["forbidden_person_names"],
        modern.get("historical_entities")))
candidate_file = out / "en.lesson.draft.json"
flow_file = out / "en.prose-flow.json"
save(candidate_file, lesson)
save(flow_file, flow)
report_file = out / "authored.json"
save(report_file, {
    "task": "D976", "card": prepared["card"],
    "status": "FIRST_MISSING_EN_AUTHOR_NATIVE_PASS" if not errors else "FIRST_MISSING_EN_AUTHOR_NATIVE_FAIL",
    "prepared": bind(prepared_file), "source": prepared["source"],
    "approvedZh": prepared["approvedZh"],
    "historicalZhNative": prepared["completeChineseHistoricalNative"],
    "historicalZhScience": prepared["historicalZhScience"],
    "englishToc": bind(toc_file), "englishBeforeNative": bind(before_file),
    "englishDraft": bind(candidate_file), "englishFlow": bind(flow_file),
    "errors": errors, "originalObjects": 9, "originalTasks": 0, "originalFigures": 0,
    "derivedConceptBoundaries": len(boundaries), "flowParagraphs": len(flow["paragraphs"]),
    "sourceSectionIdentityRetainedForOfficialTocDisplayTranslation": True,
    "mathAndNumericalGivensUnchanged": True, "independentEnglishReview": "pending",
    "originalSourceAndZhReviewReplayed": False, "alreadyCountedInD020": True,
    "fullCourseApproval": False, "parentNewImages": 0, "newCompleteCourses": 0, "newSourcePages": 0,
})
print(json.dumps({"report": bind(report_file), "candidate": bind(candidate_file),
                  "status": "PASS" if not errors else "FAIL", "errors": errors}))
sys.exit(1 if errors else 0)
