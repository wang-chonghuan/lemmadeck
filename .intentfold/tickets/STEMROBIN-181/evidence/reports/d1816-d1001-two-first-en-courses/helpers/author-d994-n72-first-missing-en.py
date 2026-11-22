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


prepared_file = ticket / "tmp/d1816-d993-n72-first-missing-en/prepared.json"
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
texts = {
    0: "**Polar molecules without an external field** The centers of the positive and negative charge distributions in a polar molecule do not coincide, so the molecule can be regarded as an electric dipole.\nIn an ordinary material with no external electric field and no spontaneous polarization, **thermal motion** produces a disordered distribution of dipole directions (Figure 134a).\nAveraged over a region containing many molecules, such as the hatched rectangle in Figure 134a, the dipoles' effects cancel and the material shows no macroscopic polarization.\n\nIn this unpolarized model, the average bound surface charge and the average net charge in the interior are zero, as is the macroscopically averaged electric field.\nThis does not mean that microscopic electric fields are absent near molecules; nor does zero net charge in a region alone establish that its electric field is zero.",
    3: "**Orientational polarization in an external field** Place the dielectric between two parallel metal plates carrying charges of opposite signs.\nIf the plates' lateral dimensions are much larger than their separation and edge effects are neglected, the central electric field can be approximated as uniform (see \u00a768).\nIf the uniform-field approximation is also used on the molecular scale, the positive and negative charges of an electric dipole experience forces equal in magnitude and opposite in direction (Figure 135).\n\nThese forces generally produce a torque that turns the dipole, tending to align its direction from negative charge to positive charge with the electric field (Figure 136).\nThermal motion continually disrupts the dipoles' orientations and competes with the field's orienting effect.\nThe original textbook associates alignment of all dipoles with the field direction with absolute zero.\n\nThis is an idealized limit of a classical model of freely rotating, independent dipoles when thermal disturbance vanishes.\nReal materials are also affected by intermolecular interactions, structural constraints, and quantum effects: absolute zero must not be taken as a sufficient condition for complete alignment in every material, nor may this model claim be treated as a universal necessary condition.\nIn an ordinary state of thermal equilibrium, an external electric field biases the orientation distribution toward the field direction rather than aligning all dipoles in one direction.\n\nIn the original textbook's intuitive description, on average there are more dipoles biased toward the field direction than against it.\nFigure 134b illustrates this orientational bias: negative bound charge appears on the dielectric surface near the positively charged plate, and positive bound charge on the surface near the negatively charged plate.\nIn a uniformly polarized interior, the dipoles' positive and negative charges cancel in the macroscopic average, so the average volume bound charge remains zero.\n\nThis conclusion requires polarization to be spatially uniform.\nNonuniform polarization can also produce volume bound charge in the interior.",
    8: "**Electric polarization and the internal field** When electric dipoles in a dielectric acquire an orientational bias, or the positive and negative charge distributions within molecules shift relative to one another, macroscopic polarization develops and bound charge can appear; this process is called electric polarization.\nThe bound charge here arises from a change in the material's internal charge distribution, not from free charge flowing from one plate through the dielectric to the other.",
    9: "Bound charge produces an electric field $\\vec{E}_1$.\nIn the parallel-plate model used here, $\\vec{E}_1$ inside the dielectric is opposite to the external field $\\vec{E}_0$ produced by free charge on the plates (Figure 137), so their superposition reduces the total internal field.\n\nIf a homogeneous, isotropic, linear dielectric fills the space between the plates, reaches its static response, and edge effects, leakage, and breakdown are neglected, then with the free charge on the plates fixed, the internal field magnitude becomes $\\frac{1}{\\varepsilon}$ times that of the original vacuum field.\nThe symbol in the denominator denotes the material's static relative permittivity.\nThe comparison is between fields with and without the dielectric, for the same free plate charge and the same parallel-plate geometry.\n\nIf the plates are connected to a source that maintains a fixed voltage, the source changes the free charge on the plates; that condition must not be confused with the fixed-free-charge comparison above.",
    10: '**Polarization of nonpolar molecules** Without an external electric field, the centers of positive and negative charge distributions in a nonpolar molecule coincide, but a dielectric made of these molecules can still be polarized by a field.\nAn external field shifts the positive and negative charge distributions within a molecule in opposite directions relative to one another, so their centers no longer coincide.\nThe original textbook describes this deformation by saying that the molecule is "stretched".\n\nHere this mainly means a change in charge distribution, not that every molecule undergoes the same geometric elongation.\nThe deformed molecule has an induced electric dipole.\nIn the isotropic linear model used here, its direction follows the local electric field.\n\nAs in a dielectric made of polar molecules, uniform polarization also produces bound charge on the dielectric surfaces near the charged plates.',
}
assert len(lesson["prose"]) == len(raw["prose"]) == 13
for index, block in enumerate(lesson["prose"]):
    if block["kind"] == "p":
        block["text"] = texts[index]
    elif block["kind"] in ["fig", "cap"]:
        number = block["label"].replace("\u56fe", "").strip()
        block["label"] = f"Figure {number}"
        if block["kind"] == "cap":
            block["text"] = block["label"]
            block["changes"] = ["translation"]
out = ticket / "tmp/d1816-d994-n72-first-missing-en"
out.mkdir()
before_file = out / "en.before-native.json"
save(before_file, lesson)
edition.normalize_lesson_layout(lesson)
flow, errors = edition.prose_flow_contract(lesson["prose"], [])
boundaries = []
for prefix in ["**Orientational polarization", "**Electric polarization", "**Polarization of nonpolar"]:
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
profile = edition.load(repo / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
for index, (source, modern, approved) in enumerate(zip(raw["prose"], lesson["prose"], zh["prose"])):
    assert edition.math_signature(modern["text"]) == edition.math_signature(approved["text"])
    errors.extend(edition.validate_identity_fields(
        source, modern, ["kind", "id", "printed_page", "source_refs"], f"en.prose[{index}]"))
    if not edition.same_figure_label(source.get("label"), modern.get("label"), "en"):
        errors.append(f"en.prose[{index}].label is not the native supported localized source alias")
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
    "task": "D994", "card": prepared["card"],
    "status": "FIRST_MISSING_EN_AUTHOR_NATIVE_PASS" if not errors else "FIRST_MISSING_EN_AUTHOR_NATIVE_FAIL",
    "prepared": bind(prepared_file), "source": prepared["source"], "approvedZh": prepared["approvedZh"],
    "historicalZhNative": prepared["completeChineseHistoricalNative"],
    "historicalZhScience": prepared["historicalZhScience"],
    "historicalFigureGate": prepared["historicalFigureGate"], "englishToc": bind(toc_file),
    "englishBeforeNative": bind(before_file), "englishDraft": bind(candidate_file), "englishFlow": bind(flow_file),
    "errors": errors, "originalObjects": 13, "originalTasks": 0, "originalFigures": 4,
    "proseObjects": 5, "captionObjects": 4, "figureObjects": 4,
    "derivedConceptBoundaries": len(boundaries), "flowParagraphs": len(flow["paragraphs"]),
    "sourceSectionIdentityRetainedForOfficialTocDisplayTranslation": True,
    "mathNumericAndSourceGivensUnchanged": True, "independentEnglishReview": "pending",
    "originalSourceZhAndFigureReviewReplayed": False, "alreadyCountedInD020": True,
    "englishFigureTuplesStillPending": True, "fullCourseApproval": False,
    "parentNewImages": 0, "newCompleteCourses": 0, "newSourcePages": 0,
})
print(json.dumps({"report": bind(report_file), "candidate": bind(candidate_file),
                  "status": "PASS" if not errors else "FAIL", "errors": errors}))
sys.exit(1 if errors else 0)
