import copy
import unittest

import assemble


def block(kind, text, page=310, printed=300, index=1):
    return {
        "kind": kind,
        "lines": [text],
        "page": page,
        "printed_page": printed,
        "ref": f"p{page:04d}#{index}",
        "cont": False,
        "open": False,
        "samerow": False,
    }


def section(title="Introduction", page=300):
    return {
        "id": "intro",
        "kind": "section",
        "title": title,
        "page": page,
        "source": {"printedName": title},
    }


class SectionCardTests(unittest.TestCase):
    def test_independent_section_does_not_leak_into_prior_exercises(self):
        cards = [section(), {"id": "next", "printedNumber": 119, "title": "Atoms", "page": 301}]
        stream = [
            block("h3", "Exercises", 308, 298),
            block("ex", "7. Find the momentum.", 309, 299),
            block("h1", "Atomic Physics"),
            block("h2", "Introduction", index=2),
            block("p", "An atomic model.", index=3),
            block("h2", "Chapter Eleven", 311, 301),
            block("h3", "119. Atoms", 311, 301, 2),
            block("p", "Scattering.", 311, 301, 3),
        ]
        original = copy.deepcopy(stream)
        lessons = assemble.cut_lessons(stream, cards)
        self.assertEqual([item["title"] for item in lessons], ["Exercises", "Introduction", "Atoms"])
        self.assertEqual([item["kind"] for item in lessons[0]["blocks"]], ["ex"])
        self.assertEqual([item["lines"] for item in lessons[1]["blocks"]], [["An atomic model."]])
        self.assertEqual(lessons[1]["chapter"], "Atomic Physics")
        self.assertEqual(lessons[1]["start_printed"], 300)
        self.assertEqual(stream, original)

    def test_printed_heading_spacing_is_not_card_identity(self):
        card = section("Intro")
        stream = [block("h2", "I n t r o"), block("p", "Body.", index=2)]
        lesson = assemble.cut_lessons(stream, [card])[0]
        self.assertEqual(lesson["title"], "Intro")
        self.assertEqual(lesson["printed_title"], "I n t r o")

    def test_whole_heading_emphasis_is_presentation_only(self):
        lesson = assemble.cut_lessons(
            [block("h2", "**Introduction**"), block("p", "Body.", index=2)],
            [section()],
        )[0]
        self.assertEqual(lesson["title"], "Introduction")
        self.assertEqual(lesson["printed_title"], "**Introduction**")

    def test_explicit_printed_name_keeps_toc_identity(self):
        card = {**section(), "source": {"printedName": "Preface"}}
        lesson = assemble.cut_lessons(
            [block("h2", "Preface"), block("p", "Body.", index=2)],
            [card],
        )[0]
        self.assertEqual(lesson["title"], "Introduction")
        self.assertEqual(lesson["printed_title"], "Preface")

    def test_heading_requires_matching_printed_page(self):
        lessons = assemble.cut_lessons(
            [block("h3", "1. Existing"), block("h2", "Introduction"), block("p", "Body.")],
            [section(page=301)],
        )
        self.assertEqual(len(lessons), 1)

    def test_wrong_title_or_nonsection_does_not_open_card(self):
        for card in [section("Other"), {**section(), "kind": "exercises"}]:
            with self.subTest(card=card):
                lessons = assemble.cut_lessons(
                    [block("h3", "1. Existing"), block("h2", "Introduction"), block("p", "Body.")],
                    [card],
                )
                self.assertEqual(len(lessons), 1)

    def test_numbered_parent_section_remains_structural(self):
        card = {**section(), "printedNumber": 1}
        lessons = assemble.cut_lessons(
            [block("h2", "Introduction"), block("h3", "1. Topic"), block("p", "Body.")],
            [card],
        )
        self.assertEqual(len(lessons), 1)
        self.assertEqual(lessons[0]["number"], "1")

    def test_ambiguous_section_fails(self):
        with self.assertRaisesRegex(ValueError, "p0310#1"):
            assemble.cut_lessons([block("h2", "Introduction")], [section(), {**section(), "id": "other"}])

    def test_independent_exhead_and_numbered_topics_keep_existing_behavior(self):
        card = {"id": "exercise-set", "kind": "exercises", "title": "Exercises", "page": 300}
        lessons = assemble.cut_lessons(
            [block("h3", "118. Sound"), block("exhead", "Questions"),
             block("exhead", "Exercises"), block("ex", "1. Draw.")],
            [card],
        )
        self.assertEqual(len(lessons), 2)
        self.assertEqual(lessons[0]["title"], "Sound")
        self.assertEqual(lessons[1]["title"], "Exercises")
        self.assertEqual([item["kind"] for item in lessons[1]["blocks"]], ["exhead", "ex"])


if __name__ == "__main__":
    unittest.main()
