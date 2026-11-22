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


prepared_file = ticket / "tmp/d1816-d1002-n73-first-missing-en/prepared.json"
prepared = edition.load(prepared_file)
zh_file = Path(prepared["approvedZh"]["path"])
assert bind(zh_file) == prepared["approvedZh"]
zh = edition.load(zh_file)
raw = edition.load(Path(prepared["source"]["path"]))
lesson = copy.deepcopy(zh)
toc_file = repo / "ssot-resources/soviet10year-textbooks/toc/9p/en.json"
toc = edition.load(toc_file)
matching = [(chapter, section, topic) for chapter in toc["contents"]
            for section in chapter.get("lessons", [])
            for topic in section.get("topics", []) if topic.get("id") == prepared["card"]]
assert len(matching) == 1
chapter, section, topic = matching[0]
lesson.update({"edition": "modern-us-neutral-en", "locale": "en", "status": "draft",
               "title": topic["title"], "chapter": chapter["title"],
               "printed_title": f'{topic["printedNumber"]}. {topic["title"]}'})
texts = {
    0: "The electric interaction between charged bodies can produce attraction or repulsion.\nWhen their relative positions change, the electrostatic force may do work, as in the movement of an electroscope's gold leaves.\nIn an electrostatic model with fixed charges, this conservative interaction is associated with the system's electrostatic potential energy.\n\nIt is not a property of an isolated charge by itself.",
    1: "The binding of electrons to nuclei in atoms and chemical bonding in molecules both involve electromagnetic interactions, but a complete description of microscopic energy also requires quantum mechanics; macroscopic electrostatic potential energy alone is not enough.\nThe original textbook also attributes energy released by a nuclear reactor to the consumption of electrostatic energy within nuclei, an explanation that is too simple.\nCharged particles inside a nucleus do interact electrically, but nuclear binding also involves the strong interaction.\n\nEnergy released in a nuclear reaction is related to the difference in rest energy before and after the reaction.\nIt can become kinetic energy and ultimately heat, and must not simply be attributed to stored electrostatic energy.",
    2: 'The original textbook uses the "short-range action" viewpoint to explain that a charge experiences a force through the electric field at its location.\nThe electric force does work only when it has a component along the displacement, and the potential energy corresponds to the interaction between the charge and the field sources.\nThis section considers a fixed external electrostatic field and treats the moving charge as a test charge that does not significantly disturb the source-charge distribution; radiation, self-field effects, and changes in the medium are neglected.',
    3: "**Work in a uniform electric field** Two large, parallel metal plates carrying charges of opposite signs produce an approximately uniform electric field in the region between them far from their edges.\nWith the charge distribution on the plates fixed, the electric force on a test charge $q$ is $\\vec{F}=q\\vec{E}$, analogous to the gravitational force $\\vec{P}=m\\vec{g}$ on a stone near Earth's surface.\n\nIn Figure 138, the plates are vertical: the left plate $B$ is negatively charged and the right plate $D$ is positively charged, so the electric field points from right to left.\nWe calculate the work done by the electric force as a positive charge $q$ moves from point 1 to point 2.\nThe distance from point 1 to plate $B$ is $d_1$, the distance from point 2 to plate $B$ is $d_2$, and $d_2<d_1$.\n\nPoints 1 and 2 lie on the same electric field line.",
    4: "Moving left along the field line covers a distance $\\Delta d=d_1-d_2$.\nThe electric force and displacement have the same direction, so the field does positive work.\nIn the following expression, the field strength is its magnitude; the work is",
    5: "$A=qE(d_1-d_2)$. (8-20)",
    10: "**This work is independent of the path**, as is the work done by gravity.\nAny smooth curve connecting points 1 and 2 can be approximated by many small steps, as shown in Figure 139.\nOn step segments perpendicular to the electric field $\\vec{E}$, the electric force does no work.\n\nOn segments parallel to the electric field $\\vec{E}$, displacements along and against the field enter with opposite signs.\nThe algebraic sum of the horizontal displacements is $\\Delta d=d_1-d_2$, so the total work is still given by (8-20).\nThe staircase is a method of calculation, not the particle's actual trajectory.",
    11: "**Work and the change in potential energy** The electrostatic force is conservative, and its work equals the negative of the corresponding change in potential energy, just as in mechanics.\nTherefore,",
    12: "$A=qE(d_1-d_2)=-(qEd_2-qEd_1)=-(E_{P_2}-E_{P_1})=-\\Delta E_P$,\n(8-21)",
    13: "Here, if the negative plate is chosen as the zero of potential energy, the charge's potential energy can be written as",
    14: "$E_P=qEd$ (8-22)",
    15: "Here $d$ is the distance from the charge to the negative plate.\nWhen the field does positive work, the potential energy decreases, so $\\Delta E_P<0$.\nIf the electric force is the only force doing work and energy transfers such as radiation are neglected, the lost potential energy becomes the particle's kinetic energy.\n\nThe original textbook cites electron acceleration in vacuum tubes and television picture tubes as applications; high-voltage equipment must not be treated as a do-it-yourself experiment.\nConversely, when a positive charge moves opposite to the electric field $\\vec{E}$, the field does negative work, so $\\Delta E_P>0$.\nUnder the same energy assumptions, potential energy increases and kinetic energy decreases.\n\nThis means that the particle is decelerated, not that it must immediately stop.",
    16: "In a fixed electrostatic field, a charge that follows a closed path back to the initial point 1 returns to its original position-dependent potential energy.\nThe total work done by the field is therefore zero:",
    17: "$A=-\\Delta E_P=-(E_{P_1}-E_{P_1})=0$.",
    18: "**The zero of potential energy** Equation (8-22) chooses the surface of plate $B$ as the zero, so the potential energy is zero on plate $B$.\nAs with gravitational potential energy, the zero can be chosen arbitrarily.\nWe can instead set $E_P=0$ at a position a distance $d_0$ from plate $B$, giving",
    19: "$E_P=qEd-qEd_0$.",
    20: "Within the same field-source model, shifting the zero only adds a position-independent constant to the potential energy; it does not change the electrostatic force or its work.\nThe absolute numerical value of potential energy depends on the chosen zero.\nComparing the potential energies at two positions determines the work done by the field during that motion.",
    21: 'Equation (8-22) resembles the formula $E_P=mgh$ for gravitational potential energy near Earth\'s surface.\nUnlike mass, however, the charge $q$ can be positive or negative.\nWith the negative plate chosen as zero and $d$ taken as the nonnegative distance to that plate, a charge with $q<0$ has negative potential energy according to (8-22) at positions between the plates away from the zero; its potential energy at the zero is still zero.\n\nA negative value does not mean that energy conservation fails or that there is some kind of "negative kinetic energy".',
}
assert len(lesson["prose"]) == len(raw["prose"]) == 22
for index, block in enumerate(lesson["prose"]):
    if block["kind"] == "p":
        block["text"] = texts[index]
    elif block["kind"] == "cap":
        number = block["label"].replace("\u56fe", "").strip()
        block["text"] = f"Figure {number}"
    if block["text"] != zh["prose"][index]["text"] and "translation" not in block["changes"]:
        block["changes"].append("translation")
out = ticket / "tmp/d1816-d1004-n73-first-missing-en"
out.mkdir()
save(out / "en.before-native.json", lesson)
edition.normalize_lesson_layout(lesson)
flow, errors = edition.prose_flow_contract(lesson["prose"], [])
boundaries = []
for prefix in ["**Work in a uniform electric field", "**Work and the change", "**The zero of potential energy"]:
    matches = [index for index, paragraph in enumerate(flow["paragraphs"])
               if paragraph["text"].startswith(prefix)]
    assert len(matches) == 1 and matches[0] > 0
    index = matches[0]
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
        source, modern, ["kind", "id", "printed_page", "source_refs"], f"en.prose[{index}]"))
    assert edition.same_figure_label(source.get("label"), modern.get("label"), "en")
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
    "task": "D1004", "card": prepared["card"],
    "status": "FIRST_MISSING_EN_AUTHOR_NATIVE_PASS" if not errors else "FIRST_MISSING_EN_AUTHOR_NATIVE_FAIL",
    "prepared": bind(prepared_file), "source": prepared["source"], "approvedZh": prepared["approvedZh"],
    "historicalZhNative": prepared["completeChineseHistoricalNative"],
    "historicalZhScience": prepared["historicalZhScience"], "historicalFigureGate": prepared["historicalFigureGate"],
    "englishToc": bind(toc_file), "englishDraft": bind(candidate_file), "englishFlow": bind(flow_file),
    "errors": errors, "originalObjects": 22, "originalTasks": 0, "originalFigures": 2,
    "proseObjects": 18, "captionObjects": 2, "figureObjects": 2,
    "flowParagraphs": len(flow["paragraphs"]), "derivedConceptBoundaries": len(boundaries),
    "sourceSectionAndUnspacedFigureMachineLabelsRetained": True,
    "visibleCaptionTextAndBodyReferencesEnglish": True, "completeEnglishAccessibilityApproval": False,
    "mathNumericAndSourceGivensUnchanged": True, "independentEnglishReview": "pending",
    "originalSourceZhAndFigureReviewReplayed": False, "alreadyCountedInD019": True,
    "englishFigureTuplesStillPending": True, "fullCourseApproval": False,
    "parentNewImages": 0, "newCompleteCourses": 0, "newSourcePages": 0,
})
print(json.dumps({"report": bind(report_file), "candidate": bind(candidate_file),
                  "status": "PASS" if not errors else "FAIL", "errors": errors}))
sys.exit(1 if errors else 0)
