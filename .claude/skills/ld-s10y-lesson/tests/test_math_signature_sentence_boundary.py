"""Focused contract cases for prose punctuation at TeX formula boundaries."""

import sys
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))

import edition


class MathSentenceBoundaryTests(unittest.TestCase):
    def assert_same_signature(self, source, modern):
        self.assertEqual(
            edition.math_signature(source), edition.math_signature(modern),
        )

    def assert_different_signature(self, source, modern):
        self.assertNotEqual(
            edition.math_signature(source), edition.math_signature(modern),
        )

    def test_terminal_prose_marks(self):
        for mark in (",", "."):
            with self.subTest(mark=mark):
                self.assert_same_signature(
                    f"$F=-kx{mark}$", f"$F=-kx${mark}",
                )

    def test_numbered_equation_boundary_keeps_label(self):
        self.assert_same_signature(
            r"$f'(t)=-A\omega\sin t,\qquad(3)$",
            r"$f'(t)=-A\omega\sin t\qquad(3)$,",
        )
        self.assert_same_signature(
            r"$c=\omega^2.\qquad(6)$",
            r"$c=\omega^2\qquad(6)$.",
        )
        self.assert_same_signature(r"$f=x.\tag{12}$", r"$f=x\tag{12}$.")
        self.assert_same_signature(
            r"$x=\varphi.\qquad(10\text{a})$",
            r"$x=\varphi\qquad(10\text{a})$.",
        )

    def test_final_system_row_only(self):
        for environment in ("aligned", "cases"):
            with self.subTest(environment=environment):
                source = (
                    r"\begin{" + environment
                    + r"}x&=x_0,\\v&=-A\omega\sin\varphi.\end{"
                    + environment + r"}\qquad(10)"
                )
                modern = source.replace(r"\varphi.", r"\varphi")
                self.assert_same_signature(f"${source}$", f"${modern}$.")
                self.assert_different_signature(
                    f"${source}$", f"${modern.replace('x_0,', 'x_0')}$",
                )

    def test_decimal_point_is_not_a_sentence_mark(self):
        self.assert_different_signature("$x=0.8$", "$x=08$")
        self.assert_different_signature("$x=.8$", "$x=8$")
        self.assert_different_signature("$x=1.$", "$x=1$")
        self.assert_same_signature("$x=0.8.$", "$x=0.8$.")
        self.assert_same_signature(
            r"$y=0.8\sin(t/3+\pi).$", r"$y=0.8\sin(t/3+\pi)$.",
        )

    def test_internal_commas_coordinates_sets_and_conditions(self):
        for source, modern in (
            ("$f(x,y)$", "$f(xy)$"),
            ("$P=(1,2)$", "$P=(12)$"),
            (r"$S=\{1,2\}$", r"$S=\{12\}$"),
            (r"$a,b,\quad c$", r"$ab,\quad c$"),
            (r"$x=0,\quad v=-A$", r"$x=0\quad v=-A$"),
            (r"$x\in\{t:t>0,t<1\}$", r"$x\in\{t:t>0t<1\}$"),
        ):
            with self.subTest(source=source):
                self.assert_different_signature(source, modern)
        self.assert_same_signature("$P=(1,2),$", "$P=(1,2)$,")

    def test_interval_and_domain_delimiters_survive(self):
        for source, modern in (
            (r"$x\in[0,2\pi[$", r"$x\in]0,2\pi[$"),
            ("$x\\in[0,1)$", "$x\\in[0,1]$"),
            ("$x\\in[0,1]$", "$x\\in[01]$"),
            ("$x>0$", "$x\\ge0$"),
        ):
            with self.subTest(source=source):
                self.assert_different_signature(source, modern)
        for interval in (r"[0,2\pi[", "]0,1[", "(0,1]", "[0,1)"):
            with self.subTest(interval=interval):
                self.assert_same_signature(
                    f"$x\\in{interval}.\\qquad(7)$",
                    f"$x\\in{interval}\\qquad(7)$.",
                )

    def test_equation_tag_numbers_and_math_differences_are_not_ignored(self):
        for source, modern in (
            (r"$x=f.\qquad(3)$", r"$x=f\qquad(4)$."),
            (r"$x=f.\tag{3}$", r"$x=f\tag{4}$."),
            ("$F=-kx,$", "$F=kx$,"),
            ("$F=-kx.$", "$F=-2kx$."),
            (r"$y=\sin x.$", r"$y=\cos x$."),
            (r"$x=\frac{k}{m}.$", r"$x=\frac{m}{k}$."),
            ("$f(x).$", "$f(y)$."),
        ):
            with self.subTest(source=source):
                self.assert_different_signature(source, modern)

    def test_raw_text_literal_contents_are_not_boundary_punctuation(self):
        for expression in (
            r"\text{a,b.}", r"\text{x=0.8}", r"\text{[0,1)}",
            r"\operatorname{a.b}", r"\frac{a.}{b}",
        ):
            with self.subTest(expression=expression):
                self.assertEqual(
                    edition.normalize_math_sentence_boundary(expression),
                    expression,
                )
        self.assertEqual(
            edition.normalize_math_sentence_boundary(r"\text{a,b.},"),
            r"\text{a,b.}",
        )
        self.assert_different_signature(r"$\text{0.8}$", r"$\text{08}$")
        self.assert_different_signature(r"$\text{10}$", r"$\text{11}$")

    def test_unclosed_groups_escapes_ellipsis_and_matrix_entries(self):
        for expression in (
            "(x,y,", "[0,x.", r"\text{unfinished.",
            r"x\,", r"x\.", "x...", r"x+\!",
            r"\begin{bmatrix}x,y.\end{bmatrix}",
            r"x,\qquad(1,2)", r"\begin{cases}x.",
        ):
            with self.subTest(expression=expression):
                self.assertEqual(
                    edition.normalize_math_sentence_boundary(expression),
                    expression,
                )


if __name__ == "__main__":
    unittest.main()
