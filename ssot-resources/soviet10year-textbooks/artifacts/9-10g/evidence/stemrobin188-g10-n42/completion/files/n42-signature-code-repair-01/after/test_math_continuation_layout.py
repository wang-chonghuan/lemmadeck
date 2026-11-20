import unittest

from edition import math_signature


class MathContinuationLayoutTests(unittest.TestCase):
    def test_closed_equation_continuations_preserve_tokens(self):
        source = r"$a=x_1x_2\vec{i}^2+y_1x_2\vec{j}\cdot\vec{i}$ $+z_1z_2\vec{k}^2.$"
        wrapped = "$a=x_1x_2\\vec{i}^2$\n$+y_1x_2\\vec{j}\\cdot\\vec{i}$\n$+z_1z_2\\vec{k}^2.$"
        self.assertEqual(math_signature(source), math_signature(wrapped))
        self.assertEqual(math_signature("$a=b=c$"), math_signature("$a=b$\n$=c$"))

    def test_formula_whitespace_is_layout(self):
        self.assertEqual(math_signature(r"$a+\alpha b$"), math_signature(r"$ a + \alpha  b $"))

    def test_noncontinuations_remain_separate(self):
        self.assertNotEqual(math_signature("$a$ $b$"), math_signature("$ab$"))
        self.assertNotEqual(math_signature("$a$ then $+b$"), math_signature("$a+b$"))
        self.assertNotEqual(math_signature("$a$,$+b$"), math_signature("$a+b$"))
        self.assertNotEqual(math_signature("$a=1$ $-b=2$"), math_signature("$a=1-b=2$"))

    def test_unrenderable_fragments_cannot_continue(self):
        for source, split in (
            (r"$\frac{a+b}{c}$", "$\\frac{a$\n$+b}{c}$"),
            (r"$\begin{aligned}a+b\end{aligned}$", "$\\begin{aligned}a$\n$+b\\end{aligned}$"),
            (r"$\left(a+b\right)$", "$\\left(a$\n$+b\\right)$"),
            (r"$\frac a+b$", "$\\frac a$\n$+b$"),
        ):
            with self.subTest(source=source, split=split):
                self.assertNotEqual(math_signature(source), math_signature(split))

    def test_mathematical_changes_still_fail(self):
        for source, changed in (
            (r"$a+\alpha b$", r"$a+\alphab$"),
            (r"$\frac{a+b}{c}$", r"$\frac{a}{c}+b$"),
            ("$a+b$", "$a-b$"),
            ("$a+b$", "$ab$"),
            ("$a+(b+c)$", "$a+b+c$"),
            (r"$x_1x_2\vec{i}^2$", r"$x_1x_2\vec{j}^2$"),
        ):
            with self.subTest(source=source, changed=changed):
                self.assertNotEqual(math_signature(source), math_signature(changed))


if __name__ == "__main__":
    unittest.main()
