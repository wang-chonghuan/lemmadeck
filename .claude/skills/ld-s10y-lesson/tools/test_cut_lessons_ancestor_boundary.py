import unittest

import assemble


def block(kind, text, page=53):
    return {
        "kind": kind,
        "lines": [text],
        "page": page,
        "printed_page": page - 12,
        "ref": f"p{page:04d}#{kind}",
    }


class AncestorBoundaryTests(unittest.TestCase):
    def test_chapter_closes_summary_before_unheaded_prose(self):
        summary = block("p", "Summary ends.")
        introduction = block("p", "Next chapter introduction.", 54)
        numbered = block("p", "Numbered unit.", 54)
        units = assemble.cut_lessons([
            block("h3", "Summary"),
            summary,
            block("h1", "Next chapter", 54),
            block("h2", "Next section", 54),
            introduction,
            block("h3", "11. Speed", 54),
            numbered,
        ])
        self.assertEqual([unit["blocks"] for unit in units], [
            [summary], [introduction], [numbered],
        ])
        self.assertEqual(units[1]["title"], "\uff08\u627f\u4e0a\u9875\uff09")
        self.assertEqual(units[2]["number"], "11")
        self.assertEqual(units[2]["chapter"], "Next chapter")
        self.assertEqual(units[2]["section"], "Next section")

    def test_section_closes_previous_unit(self):
        previous = block("p", "Previous section.")
        following = block("p", "Following section.", 54)
        units = assemble.cut_lessons([
            block("h1", "Chapter"),
            block("h3", "1. Previous"),
            previous,
            block("h2", "Following", 54),
            following,
        ])
        self.assertEqual([unit["blocks"] for unit in units], [[previous], [following]])
        self.assertEqual(units[1]["chapter"], "Chapter")
        self.assertEqual(units[1]["section"], "Following")

    def test_unnumbered_unit_and_cross_page_body_remain_intact(self):
        first = block("p", "First page.")
        second = block("p", "Second page.", 54)
        units = assemble.cut_lessons([block("h3", "Introduction"), first, second])
        self.assertEqual(len(units), 1)
        self.assertIsNone(units[0]["number"])
        self.assertEqual(units[0]["title"], "Introduction")
        self.assertEqual(units[0]["blocks"], [first, second])


if __name__ == "__main__":
    unittest.main()
