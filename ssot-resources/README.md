# Resource source of truth

`ssot-resources/` is the repository's only committed product-resource root.

| Path | Ownership |
|---|---|
| `soviet10year-textbooks/` | Original scans, TOCs, durable extraction data, lessons, exercises, figures, answers and interactions |
| `public/` | Static files served by Vite and copied into the application build |
| `reference/` | Human-authored product and design references |
| `brand/` | Original brand artwork and reference exports |
| `content/` | Retained course source material that is not part of the 10y pipeline |
| `tyurin-probability/` | Printed-source notes for the probability supplement |

Temporary renders, generated templates, previews, batch output and backups belong under `.tmp/`.
Nothing under `.tmp/` is authoritative or required to rebuild, validate, publish or operate the
product.

Code-owned schemas, profiles and test fixtures stay beside their code. They are not product-resource
roots. Run `python3 ssot-resources/audit.py` from the repository root to enforce this boundary.
