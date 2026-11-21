import copy
import json
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))

import assemble
import blocks


def block(kind, ref, text, **fields):
    return {"kind": kind, "ref": ref, "lines": [text], **fields}


class ExerciseScopeParagraphTests(unittest.TestCase):
    def test_plural_header_round_trip_preserves_paragraph_and_count(self):
        meta = {"page": 146}
        md = "---\n" + json.dumps(meta) + '\n---\n<!-- p owners-ex ["309","310"] -->\n'
        md += "Use the definition.\n<!-- ex 309 -->\n309. First statement.\n"
        parsed_meta, parsed = blocks.parse(md)
        self.assertEqual(parsed[0]["kind"], "p")
        self.assertEqual(parsed[0]["owner_exercises"], ["309", "310"])
        self.assertIsNone(parsed[0]["label"])
        self.assertEqual(blocks.printed_lines(parsed), 2)
        self.assertEqual(blocks.parse(blocks.dump(parsed_meta, parsed, 146)), (parsed_meta, parsed))

    def test_invalid_plural_declarations_fail(self):
        for declaration in ('[]', '["309","309"]', '[309]', '["309 bad"]', '"309"', '[bad]'):
            with self.subTest(declaration=declaration), self.assertRaises(ValueError):
                blocks.parse('---\n{}\n---\n<!-- p owners-ex ' + declaration + " -->\nText\n")
        with self.assertRaises(ValueError):
            blocks.parse('---\n{}\n---\n<!-- fig owners-ex ["309"] -->\n')
        with self.assertRaises(ValueError):
            blocks.parse('---\n{}\n---\n<!-- p owner-ex 309 owners-ex ["310"] -->\n')

    def test_shared_instruction_and_single_hint_follow_declared_owners(self):
        lesson = {"blocks": [
            block("p", "p0146#2", "Ordinary prose."),
            block("exhead", "p0146#3", "Exercises"),
            block("p", "p0146#4", "Use the definition.",
                  owner_exercises=["309", "310", "311", "312", "313"]),
            *[block("ex", f"p0146#{number - 304}", f"{number}. Statement.", label=str(number))
              for number in range(309, 314)],
            block("p", "p0146#10", "Hint: use the identity.", owner_exercise="313"),
        ]}
        original = copy.deepcopy(lesson)
        prose, exercises = assemble.split_lesson(lesson)
        self.assertEqual([item["ref"] for item in prose], ["p0146#2"])
        self.assertEqual(len(exercises), 5)
        for exercise in exercises:
            number = exercise["number"]
            expected = f"Use the definition.\n\n{number}. Statement."
            if number == "313":
                expected += "\n\nHint: use the identity."
            self.assertEqual(exercise["text"], expected)
            self.assertEqual(blocks.text_of(exercise), expected)
            self.assertEqual(exercise["pages"][0], "p0146#4")
        self.assertEqual(exercises[-1]["pages"], ["p0146#4", "p0146#9", "p0146#10"])
        self.assertEqual(lesson, original)

    def test_unowned_paragraph_is_not_guessed_from_position(self):
        lesson = {"blocks": [
            block("p", "p0001#1", "Instruction-like ordinary prose."),
            block("ex", "p0001#2", "1. Statement.", label="1"),
            block("p", "p0001#3", "Hint-like ordinary prose."),
        ]}
        prose, exercises = assemble.split_lesson(lesson)
        self.assertEqual(len(prose), 2)
        self.assertEqual(exercises[0]["text"], "1. Statement.")
        self.assertEqual(exercises[0]["pages"], ["p0001#2"])

    def test_missing_owner_fails_instead_of_dropping_text(self):
        lesson = {"blocks": [
            block("p", "p0001#1", "Instruction.", owner_exercises=["1", "2"]),
            block("ex", "p0001#2", "1. Statement.", label="1"),
        ]}
        with self.assertRaisesRegex(ValueError, "2"):
            assemble.split_lesson(lesson)

    def test_repeated_source_number_requires_group_qualified_owner(self):
        lesson = {"blocks": [
            block("exhead", "p0001#1", "First group"),
            block("ex", "p0001#2", "1. First.", label="1"),
            block("exhead", "p0001#3", "Second group"),
            block("ex", "p0001#4", "1. Second.", label="1"),
            block("p", "p0001#5", "Second-group hint.", owner_exercise="1"),
        ]}
        with self.assertRaises(ValueError):
            assemble.split_lesson(lesson, exercise_numbering="lesson-group")
        lesson["blocks"][-1]["owner_exercise"] = "g2-1"
        _, exercises = assemble.split_lesson(lesson, exercise_numbering="lesson-group")
        self.assertEqual(exercises[0]["text"], "1. First.")
        self.assertEqual(exercises[1]["text"], "1. Second.\n\nSecond-group hint.")

    def test_scope_spans_and_multiple_paragraphs_retain_source_order(self):
        lesson = {"blocks": [
            block("p", "p0001#1", "First instruction.", owner_exercise="1",
                  spans=["p0001#1", "p0002#1"]),
            block("p", "p0002#2", "Second instruction.", owner_exercise="1"),
            block("ex", "p0002#3", "1. Statement.", label="1",
                  spans=["p0002#3", "p0003#1"]),
            block("p", "p0003#2", "Hint.", owner_exercise="1"),
        ]}
        _, exercises = assemble.split_lesson(lesson)
        self.assertEqual(exercises[0]["text"],
                         "First instruction.\n\nSecond instruction.\n\n1. Statement.\n\nHint.")
        self.assertEqual(exercises[0]["pages"],
                         ["p0001#1", "p0002#1", "p0002#2", "p0002#3", "p0003#1", "p0003#2"])

    def test_cross_page_continuation_inherits_head_ownership(self):
        stream = [
            block("p", "p0001#1", "Instruction part one.", page=1, open=True,
                  owner_exercises=["1", "2"]),
            block("p", "p0002#1", "Part two.", page=2, cont=True),
            block("ex", "p0002#2", "1. First.", page=2, label="1"),
            block("ex", "p0002#3", "2. Second.", page=2, label="2"),
        ]
        merged, warnings = assemble.merge_across_pages(stream)
        self.assertEqual(warnings, [])
        _, exercises = assemble.split_lesson({"blocks": merged})
        self.assertEqual(exercises[0]["text"], "Instruction part one.Part two.\n\n1. First.")
        self.assertEqual(exercises[1]["pages"], ["p0001#1", "p0002#1", "p0002#3"])

    def test_different_continuation_owners_fail_before_merge(self):
        stream = [
            block("p", "p0001#1", "First.", page=1, open=True, owner_exercise="1"),
            block("p", "p0002#1", "Second.", page=2, cont=True, owner_exercise="2"),
        ]
        with self.assertRaises(ValueError):
            assemble.merge_across_pages(stream)

    def test_unnumbered_exercise_has_no_none_source_identity(self):
        lesson = {"blocks": [
            block("p", "p0001#1", "Instruction.", owner_exercise="None"),
            block("ex", "p0001#2", "Statement."),
        ]}
        with self.assertRaises(ValueError):
            assemble.split_lesson(lesson)
        lesson["blocks"][0]["owner_exercise"] = "q1"
        _, exercises = assemble.split_lesson(lesson)
        self.assertEqual(exercises[0]["text"], "Instruction.\n\nStatement.")

    def test_bare_and_repeated_plural_declarations_fail(self):
        for declaration in ('owners-ex', 'owners-ex ["1"] owners-ex ["2"]'):
            with self.subTest(declaration=declaration), self.assertRaises(ValueError):
                blocks.parse('---\n{}\n---\n<!-- p ' + declaration + " -->\nText\n")

    def test_first_group_qualified_identity_can_own_shared_instruction(self):
        lesson = {"blocks": [
            block("p", "p0001#1", "First-group instruction.", owner_exercise="g1-1"),
            block("exhead", "p0001#2", "First group"),
            block("ex", "p0001#3", "1. First.", label="1"),
            block("exhead", "p0001#4", "Second group"),
            block("ex", "p0001#5", "1. Second.", label="1"),
        ]}
        _, exercises = assemble.split_lesson(lesson, exercise_numbering="lesson-group")
        self.assertEqual(exercises[0]["number"], "1")
        self.assertEqual(exercises[0]["text"], "First-group instruction.\n\n1. First.")
        self.assertEqual(exercises[1]["text"], "1. Second.")

    def test_scoped_instruction_figure_reference_stays_with_exercise(self):
        figure = block("fig", "p0001#2", "", label="\u56fe 7", id="fig-07", page=1)
        lesson = {"title": "Sample", "blocks": [
            block("p", "p0001#1", "See \u56fe 7.", owner_exercise="1"),
            figure,
            block("ex", "p0001#3", "1. Statement.", label="1"),
        ]}
        lesson["prose"], lesson["exercises"] = assemble.split_lesson(lesson)
        errors, warnings = assemble.claim_figures([lesson], lesson["blocks"])
        self.assertEqual((errors, warnings), ([], []))
        self.assertEqual(lesson["prose"], [])
        self.assertEqual(lesson["exercises"][0]["figure_refs"], ["fig-07"])
        self.assertEqual(lesson["exercises"][0]["figures"],
                         [{"id": "fig-07", "label": "\u56fe 7"}])

    def test_ownership_survives_text_only_serialization_and_lesson_cut(self):
        md = ('---\n{"page":1}\n---\n<!-- h3 -->\n1. Sample\n'
              '<!-- p owners-ex ["1","2"] -->\nInstruction.\n'
              '<!-- ex 1 -->\n1. First.\n<!-- ex 2 -->\n2. Second.\n')
        meta, parsed = blocks.parse(md)
        meta, parsed = blocks.parse(blocks.dump(meta, parsed, 1))
        stream = [{**item, "page": 1, "ref": f"p0001#{index + 1}"}
                  for index, item in enumerate(parsed)]
        lessons = assemble.cut_lessons(stream)
        self.assertEqual(len(lessons), 1)
        prose, exercises = assemble.split_lesson(lessons[0])
        self.assertEqual(prose, [])
        self.assertEqual([item["text"] for item in exercises],
                         ["Instruction.\n\n1. First.", "Instruction.\n\n2. Second."])
        self.assertEqual(exercises[1]["pages"], ["p0001#2", "p0001#4"])


if __name__ == "__main__":
    unittest.main()
