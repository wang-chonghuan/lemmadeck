"""Reproduce only SOURCE266's two speed-deficit/mass-factor calculations."""

from decimal import Decimal, localcontext
import json


def calculate():
    with localcontext() as ctx:
        ctx.prec = 70
        c = Decimal("300000")

        def gamma(delta):
            return c / (delta * (2 * c - delta)).sqrt()

        def inverse_deficit(factor):
            # Rationalization avoids cancellation when gamma is large.
            inverse_squared = 1 / (factor * factor)
            return c * inverse_squared / (1 + (1 - inverse_squared).sqrt())

        cases = [
            ("source-90-km/s", Decimal("90")),
            ("source-35-km/s", Decimal("35")),
            ("source-40-km/s", Decimal("40")),
            ("modern-15-km/s", Decimal("15")),
            ("modern-35-m/s", Decimal("0.035")),
            ("modern-40-m/s", Decimal("0.040")),
        ]
        inverses = [
            (Decimal("100"), inverse_deficit(Decimal("100"))),
            (Decimal("2000"), inverse_deficit(Decimal("2000"))),
        ]
        output = {
            "precision_decimal_digits": ctx.prec,
            "c_km_per_s": str(c),
            "forward_formula": "gamma = c/sqrt(delta*(2*c-delta)), delta=c-v",
            "inverse_formula": "delta = (c/G^2)/(1+sqrt(1-1/G^2))",
            "forward_cases": [
                {
                    "id": name,
                    "delta_km_per_s": str(delta),
                    "gamma": str(gamma(delta)),
                }
                for name, delta in cases
            ],
            "inverse_cases": [
                {
                    "gamma": str(factor),
                    "delta_km_per_s": str(delta),
                    "delta_m_per_s": str(1000 * delta),
                    "recomputed_gamma": str(gamma(delta)),
                    "relative_roundtrip_error": str(
                        abs(gamma(delta) - factor) / factor
                    ),
                }
                for factor, delta in inverses
            ],
            "low_speed_optional_algebra_only": {
                "v_km_per_s": "10",
                "quantity": "sqrt(1-v^2/c^2) = 1/gamma, not gamma",
                "value": str((1 - (Decimal("10") / c) ** 2).sqrt()),
                "gamma": str(1 / (1 - (Decimal("10") / c) ** 2).sqrt()),
            },
        }
        for factor, delta in inverses:
            assert abs(gamma(delta) - factor) / factor < Decimal("1e-65")
        assert gamma(Decimal("90")) < Decimal("100")
        assert gamma(Decimal("40")) < gamma(Decimal("35")) < Decimal("2000")
        assert Decimal("99.99") < gamma(Decimal("15")) < Decimal("100.01")
        assert gamma(Decimal("0.040")) < Decimal("2000") < gamma(Decimal("0.035"))
        return output


if __name__ == "__main__":
    print(json.dumps(calculate(), ensure_ascii=True, indent=2))
