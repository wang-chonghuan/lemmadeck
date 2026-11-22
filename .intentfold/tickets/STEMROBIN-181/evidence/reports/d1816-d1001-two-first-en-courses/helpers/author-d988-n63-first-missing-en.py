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


prepared_file = ticket / "tmp/d1816-d987-n63-first-missing-en/prepared.json"
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
units = [
    (r"\text{" + "\u5e93\u4ed1" + "}", r"\text{C}"),
    (r"\text{" + "\u725b\u987f" + "}", r"\text{N}"),
    (r"\text{" + "\u7c73" + "}", r"\text{m}"),
]


def localized_units(text):
    for before, after in units:
        text = text.replace(before, after)
    return text


texts = [
    "A unit of electric charge can be established by convention, but once the unit is fixed, measurements and calculations must follow the same conventions.\nChoosing different units does not change the physical laws; it changes only the numerical expression of physical quantities.\nThe question is how to choose convenient, reproducible units.",
    "A macroscopic charged object may lose net charge through poor insulation, discharges through air, and other routes, so it is unsuitable as a directly unchanging long-term material standard of charge.\nThis does not mean that charge cannot be measured precisely, and the original textbook's analogy with a material meter standard must not be treated as the present definition of the unit.\nThe magnitude of an electron's charge provides a natural microscopic scale of charge.\n\nAn electron is negatively charged, while the elementary charge e denotes a positive magnitude.\nElectrons were not yet known when Coulomb studied electrostatic forces.\nThis microscopic charge scale is very small and is often inconvenient for expressing macroscopic amounts of charge.",
    "Coulomb's law can be used to define an electrostatic unit of charge so that the numerical value of the coefficient $k$ in formula (8-2) is 1. **For two equal point charges in vacuum, separated by 1 centimeter and interacting with a force of magnitude 1 dyne ($10^{-5}$ newton), the magnitude of each charge is defined as one absolute electrostatic unit.**\nThis convention specifies the units of length, force, and charge together; it does not arbitrarily remove a coefficient from formulas expressed in other systems of units.",
    "Using centimeters, dynes, and the electrostatic charge unit defined above, the magnitude of the electrostatic force between point charges in vacuum can be written as:",
    "$F=\\frac{|q_1|\\cdot|q_2|}{r^2}$.\n(8-3)",
    "The charge unit established in this way is called the absolute electrostatic unit, denoted CGSE in the original textbook.\nIt belongs to the centimeter-gram-second electrostatic system of units.\nAn electron is negatively charged; e below denotes the magnitude of its charge, not its signed charge.\n\nThe original textbook gives the approximate value:",
    "$e=4.8\\times10^{-10}$ CGSE.\nThe original textbook's rounded value is retained here.",
    "The International System of Units (SI) uses another set of unit conventions; the meter, second, kilogram, and ampere are all base units.\nThe seventh-grade textbook mentioned in the original source described the method then used to establish the ampere standard from forces between current-carrying wires.\nThe present SI instead defines the ampere through the fixed numerical value of the elementary charge and the second; the historical method must not be presented as today's definition.\n\nThe coulomb is the unit of charge formed from the ampere and second. **For a steady current of 1 ampere, the charge passing through a conductor's cross-section in 1 second is 1 coulomb.**\nThis unit relationship holds under both the old and new definitions.\n\nWhen current varies with time, the charge accumulated over the interval must be calculated; a current value at just one instant is insufficient.\nWith the approximate conversion used in this lesson, one coulomb is about $3\\times10^9$ absolute electrostatic units:",
    "1 coulomb $=3\\times10^9$ absolute electrostatic units.\n(8-4)\nThis is the approximate conversion used in the original textbook; the rounded value after the equality sign is not an exact definition of the unit.",
    "For ordinary electrostatic experiments, 1 coulomb is a very large net charge.\nTake two point charges of the same sign in vacuum, separated by 1 kilometer, each carrying that amount of charge: their repulsive force is slightly smaller than the weight of an object of mass 1 metric ton at Earth's surface.\nThis compares the order of magnitude of forces in the point-charge approximation.\n\nFor an ordinary isolated object whose dimensions are on the order of meters, retaining 1 coulomb of net charge in common environments is very difficult: the strong electric field promotes discharge, air breakdown, or material instability.\nThis does not establish that such a charge can never be retained under any material, confinement, or environmental conditions.\nOn the other hand, 1 coulomb can describe the cumulative charge passing through a conductor's cross-section without requiring the conductor as a whole to have that much net charge.\n\nOrdinary conductors carrying a current remain approximately neutral overall.\nFor the original textbook's 100-watt bulb with a rated voltage of 127 volts, dividing rated power by rated voltage gives an estimated current slightly below 1 ampere.\nThis illustrates an order of magnitude; the lesson does not require performing this operation in practice.",
    "In SI, the elementary charge is still denoted by the positive quantity e.\nThe approximate value in the original textbook is retained below, rather than all the significant digits used in the present unit definition:",
    "$e=1.6\\times10^{-19}$ coulomb.\n(8-5)",
    "When Coulomb's law is expressed in SI, the numerical value of the coefficient $k$ is not 1, and its unit is newton-meter$^2$/coulomb$^2$.\nRearranging Coulomb's law gives $k=\\frac{Fr^2}{|q_1|\\cdot|q_2|}$, so the coefficient's numerical values in different unit systems cannot be compared while ignoring their units.",
    "To explain the numerical value of this coefficient, first use the CGSE unit conventions to calculate the magnitude of the electrostatic force between two point charges in vacuum, separated by 1 meter and each carrying 1 coulomb:",
    "$F=\\frac{3\\times10^9\\times3\\times10^9}{10^4}$ dynes.\nThe denominator comes from converting the distance to centimeters and then squaring it.\nThe conversion describes the same distance; it does not change the separation of the charges.",
    "Converting with 1 dyne $=10^{-5}$ newton gives $F=9\\times10^9$ newtons.\nThe rounded constants of the original textbook are used, so the result has only the corresponding approximate precision.",
    "For Coulomb's law (8-2) to give the same force in SI, at the precision used in this lesson $k$ should be taken as $9\\times10^9$ newton-meter$^2$/coulomb$^2$.\nSubstituting the point charges and distance above gives:",
    localized_units(zh["prose"][17]["text"]).replace("\u725b\u987f", "newtons").replace("\u3002", "."),
    "Thus, the coefficient used in this lesson in this system of units is:",
    "$k=9\\times10^9$ newton-meter$^2$/coulomb$^2$.\nThis is a convenient approximate value for calculation, not an exactly defined constant.",
    "To simplify later formulas, the coefficient $k$ can also be written as:",
    "$k=\\frac{1}{4\\pi\\varepsilon_0}$.\n(8-6)",
    "The quantity $\\varepsilon_0$ is called **vacuum permittivity**, termed the **electric constant** in the original textbook.\nIn the present SI its numerical value is determined experimentally.\nThis lesson uses only an approximate value convenient for textbook calculations:",
    localized_units(zh["errata"][0]["corrected"]) + ".\n(8-7)\n\nThe numerical value follows the original textbook's approximation; the unit follows from the dimensions of the coefficient.",
    "Thus, Coulomb's law expressed in SI using vacuum permittivity is:",
    "$F=\\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{|q_1|\\cdot|q_2|}{r^2}$.\n(8-8)\nHere, F is the magnitude of the electrostatic force, the charge magnitudes are used, and r is the distance between the two point charges.\n\nThe direction is determined separately: charges of the same sign repel, and charges of opposite signs attract.\nThis formula applies to stationary charges in vacuum that can be treated as point charges; it cannot be applied without qualification to macroscopic media or arbitrary charge distributions.",
]
assert len(texts) == len(lesson["prose"]) == len(raw["prose"]) == 26
for block, text in zip(lesson["prose"], texts):
    block["text"] = text
for original, translated in zip(zh["errata"], lesson["errata"]):
    translated["corrected"] = localized_units(original["corrected"])
    assert edition.math_signature(translated["corrected"]) == edition.math_signature(original["corrected"])
    assert {**original, "corrected": translated["corrected"]} == translated
out = ticket / "tmp/d1816-d988-n63-first-missing-en"
out.mkdir()
before_file = out / "en.before-native.json"
save(before_file, lesson)
edition.normalize_lesson_layout(lesson)
flow, errors = edition.prose_flow_contract(lesson["prose"], [])
boundaries = []
for prefix in [
    "Coulomb's law can be used", "The International System of Units (SI)",
    "When Coulomb's law is expressed in SI", "To simplify later formulas",
]:
    indices = [index for index, paragraph in enumerate(flow["paragraphs"])
               if paragraph["text"].startswith(prefix)]
    assert len(indices) == 1 and indices[0] > 0, (prefix, indices)
    index = indices[0]
    boundaries.append({"before": flow["paragraphs"][index - 1]["text"],
                       "after": flow["paragraphs"][index]["text"]})
lesson["section_breaks"] = boundaries
flow, flow_errors = edition.prose_flow_contract(lesson["prose"], boundaries)
errors.extend(flow_errors)
errors.extend(edition.validate_lesson_identity(raw, lesson))
book = repo / "ssot-resources/soviet10year-textbooks/artifacts/9p"
raw_exercises = edition.load(book / f'lessons/{prepared["card"]}/exercises.json')
modern_exercises = edition.load(book / f'editions/modern-us-neutral/lessons/{prepared["card"]}/exercises.json')
corrections, errata_errors = edition.validate_errata(book, raw, raw_exercises, lesson, modern_exercises)
errors.extend(errata_errors)
profile = edition.load(repo / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
for index, (source, modern, approved) in enumerate(zip(raw["prose"], lesson["prose"], zh["prose"])):
    assert edition.math_signature(modern["text"]) == edition.math_signature(approved["text"])
    errors.extend(edition.validate_identity_fields(
        source, modern, ["kind", "id", "label", "printed_page", "source_refs"], f"en.prose[{index}]"))
    errors.extend(edition.validate_text(
        source["text"], modern["text"], modern["changes"], modern["numeric_changes"],
        f"en.prose[{index}]", profile["forbidden_terms"] + profile["forbidden_person_names"],
        modern.get("historical_entities"), corrections.get(f"lesson.prose[{index}]", [])))
candidate_file = out / "en.lesson.draft.json"
flow_file = out / "en.prose-flow.json"
save(candidate_file, lesson)
save(flow_file, flow)
report_file = out / "authored.json"
save(report_file, {
    "task": "D988", "card": prepared["card"],
    "status": "FIRST_MISSING_EN_AUTHOR_NATIVE_PASS" if not errors else "FIRST_MISSING_EN_AUTHOR_NATIVE_FAIL",
    "prepared": bind(prepared_file), "source": prepared["source"], "approvedZh": prepared["approvedZh"],
    "historicalZhNative": prepared["completeChineseHistoricalNative"],
    "historicalZhScience": prepared["historicalZhScience"], "englishToc": bind(toc_file),
    "englishBeforeNative": bind(before_file), "englishDraft": bind(candidate_file), "englishFlow": bind(flow_file),
    "unitLiteralLocalizations": units,
    "registeredErratumLocalization": {
        "changedField": "Only locale candidate errata[0].corrected unit text literals",
        "originalRegistrySourceTargetIdReasonAndPrintedOriginalFormulaUnchanged": True,
        "correctedMathematicalCoreAndChargeSquareUnchanged": True,
        "officialValidateErrataStatus": "PASS" if not errata_errors else "FAIL",
        "errors": errata_errors,
    },
    "errors": errors, "originalObjects": 26, "originalTasks": 0, "originalFigures": 0,
    "derivedConceptBoundaries": len(boundaries), "flowParagraphs": len(flow["paragraphs"]),
    "sourceSectionIdentityRetainedForOfficialTocDisplayTranslation": True,
    "mathAndNumericalGivensUnchangedFromApprovedZh": True, "independentEnglishReview": "pending",
    "originalSourceAndZhReviewReplayed": False, "alreadyCountedInD018": True,
    "fullCourseApproval": False, "parentNewImages": 0, "newCompleteCourses": 0, "newSourcePages": 0,
})
print(json.dumps({"report": bind(report_file), "candidate": bind(candidate_file),
                  "status": "PASS" if not errors else "FAIL", "errors": errors}))
sys.exit(1 if errors else 0)
