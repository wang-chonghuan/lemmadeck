# SOURCE AUTHOR: 9-10g physical66/67

Ticket STEMROBIN-184; active same invocation; independent fresh author, not reviewer.
Inputs: only the two page grids, two original PNGs, two layout JSON files, two templates; TOC used only after the actual §18 heading was seen, for identities §17/§18.
No old transcription/review/answer/choice/modern/SVG/spec/other-page pixels were opened. No prepare, backend, Git, DB, build/test, production, publish, deploy, assemble, vectorize, adapt, promote, merge or close action was run.
Both durable target directories were absent before writing. Complete source/tool/book input bytes, absence records, raw authored bytes and after-finalize bytes are retained.

## First finalizations
- physical66: exit 0; 2026-11-16T12:59:31.587Z to 2026-11-16T12:59:32.079Z; argv [".claude/skills/ld-s10y-lesson/.venv/bin/python","-B",".claude/skills/ld-s10y-lesson/tools/p2c.py","finalize","--book","9-10g","--page","66"]; full stdout/stderr/start/result and before/after tree snapshots in /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/018-finalize-0066.
- physical67: exit 0; 2026-11-16T12:59:52.022Z to 2026-11-16T12:59:52.631Z; argv [".claude/skills/ld-s10y-lesson/.venv/bin/python","-B",".claude/skills/ld-s10y-lesson/tools/p2c.py","finalize","--book","9-10g","--page","67"]; full stdout/stderr/start/result and before/after tree snapshots in /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/019-finalize-0067.
No first actual pipeline/helper failure occurred; no retry, repair, counter adjustment, count exclusion or count override was made.

## Full source observations
```json
{
  "schema": "source-author-observations@1",
  "role": "fresh SOURCE AUTHOR; no reviewer output read",
  "scope": {
    "book": "9-10g",
    "physical_pages": [
      66,
      67
    ],
    "printed_pages": [
      59,
      60
    ]
  },
  "input_context": {
    "section17": "OPEN; prior body proof closed",
    "exercises168_173": "closed; text-only premise, not independently read",
    "exercise174": "OPEN",
    "exact_previous_row": "174. 已知两条射线是：1）同方向的；2）反方向的. 经"
  },
  "source_boundaries": [
    {
      "physical_page": 66,
      "row": 1,
      "owner": "exercise174",
      "role": "ex cont",
      "first": "过",
      "last": "另一条.",
      "outgoing": "closed"
    },
    {
      "physical_page": 66,
      "rows": [
        2,
        3
      ],
      "owner": "exercise175",
      "role": "ex",
      "outgoing": "closed"
    },
    {
      "physical_page": 66,
      "rows": [
        4
      ],
      "owner": "exercise176",
      "role": "ex",
      "outgoing": "closed"
    },
    {
      "physical_page": 66,
      "rows": [
        5,
        6
      ],
      "owner": "exercise177",
      "role": "ex",
      "outgoing": "closed"
    },
    {
      "physical_page": 66,
      "rows": [
        7,
        8,
        9
      ],
      "owner": "exercise178",
      "role": "ex",
      "outgoing": "closed"
    },
    {
      "physical_page": 66,
      "row": 10,
      "owner": "geo910-c1-s2-n18",
      "role": "h3",
      "actual_heading": "§18. 向量的加法",
      "boundary_basis": "source pixels; TOC used only afterwards for actual identity"
    },
    {
      "physical_page": 66,
      "rows": [
        11,
        12
      ],
      "role": "p",
      "owner": "geo910-c1-s2-n18"
    },
    {
      "physical_page": 66,
      "row": 13,
      "role": "p theorem9",
      "owner": "geo910-c1-s2-n18"
    },
    {
      "physical_page": 66,
      "rows": [
        14,
        15,
        16
      ],
      "role": "p open theorem9-proof",
      "owner": "geo910-c1-s2-n18",
      "wrap": "a(M) then =M_1",
      "outgoing": "open across fig71 and page boundary"
    },
    {
      "physical_page": 66,
      "row": 17,
      "role": "cap",
      "text": "图 71",
      "samerow": false
    },
    {
      "physical_page": 66,
      "row": 18,
      "role": "foot",
      "text": "bullet 59 bullet",
      "samerow": false
    },
    {
      "physical_page": 67,
      "rows": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "role": "p cont theorem9-proof",
      "owner": "geo910-c1-s2-n18",
      "wrap": "[M_1N_1) then double-up-arrow [M_2N_2)"
    },
    {
      "physical_page": 67,
      "rows": [
        7,
        8,
        9
      ],
      "role": "p theorem9-proof conclusion",
      "last": "成立. black square",
      "proof_outgoing": "closed by printed black square"
    },
    {
      "physical_page": 67,
      "rows": [
        10,
        11
      ],
      "role": "p definition vector sum"
    },
    {
      "physical_page": 67,
      "rows": [
        12,
        13,
        14
      ],
      "role": "p equation3",
      "equation_row": 14
    },
    {
      "physical_page": 67,
      "row": 15,
      "role": "p open",
      "last": "映射成",
      "outgoing": "open across fig72 and next physical page; no next-page pixels read"
    },
    {
      "physical_page": 67,
      "row": 16,
      "role": "cap",
      "text": "图 72",
      "samerow": false
    },
    {
      "physical_page": 67,
      "row": 17,
      "role": "foot",
      "text": "bullet 60 bullet",
      "samerow": false
    }
  ],
  "unit_ownership": {
    "incoming": {
      "id": "geo910-c1-s2-n17",
      "printedNumber": 17,
      "title": "向量",
      "contents_in_this_batch": "exercise174 tail and complete exercises175-178",
      "closed_at": "source-observed §18 heading"
    },
    "outgoing": {
      "id": "geo910-c1-s2-n18",
      "printedNumber": 18,
      "title": "向量的加法",
      "state": "OPEN"
    },
    "no_unit_boundary_from_toc": true,
    "all_figures_owner_exercise": null,
    "figure_ownership_basis": "explicit body references to fig71 and fig72; no figure is an unnumbered exercise figure"
  },
  "math_and_givens": {
    "exercise174": "tail only; exact previous row supplied by user; no answer supplied",
    "exercise175": "two planes: 1) parallel, 2) intersecting; question whether a vector maps one onto the other",
    "exercise176": "opposite faces of a parallelepiped",
    "exercise177": "triangle plane parallel to projection plane; triangle and projection congruent",
    "exercise178": {
      "solid": "ABCDA_1B_1C_1D_1",
      "pairs": [
        [
          "angle BC_1C",
          "angle AD_1D"
        ],
        [
          "angle CBD_1",
          "angle AD_1B"
        ],
        [
          "angle ADC",
          "angle A_1B_1C_1"
        ]
      ],
      "given_numeric_measurements": [],
      "no_figure_for_exercise": true
    },
    "theorem9": "composition of two vectors is a vector",
    "maps": [
      "a(M)=M_1",
      "a(N)=N_1",
      "b(M_1)=M_2",
      "b(N_1)=N_2"
    ],
    "composition_order": "b dot a",
    "equation1": "|MN|=|M_2N_2|",
    "ray_relations": [
      "[MN) double-up-arrow [M_1N_1)",
      "[M_1N_1) double-up-arrow [M_2N_2)",
      "[MN) double-up-arrow [M_2N_2)"
    ],
    "proof_cases": [
      "rays MN and M_2N_2 not on one straight line",
      "rays [MN) and [M_2N_2) on the same straight line"
    ],
    "parallelogram_order": "MNN_2M_2",
    "conclusion": "vector MM_2 = vector NN_2",
    "definition": "b dot a = c rewritten a + b = c, all a,b,c with printed vector arrows",
    "equation3": "vector AB + vector BC = vector AC",
    "section_refs": [
      "§17 property1",
      "§17 property2",
      "§16"
    ],
    "no_expected_exercise_answers": true
  },
  "figures": {
    "fig-71": {
      "physical_page": 66,
      "caption": "图 71",
      "owner": "geo910-c1-s2-n18 theorem9 proof",
      "owner_exercise": null,
      "rough_box": [
        390,
        1435,
        630,
        410
      ],
      "panels": 1,
      "point_labels": [
        "M",
        "N",
        "M_1",
        "N_1",
        "M_2",
        "N_2"
      ],
      "strokes": [
        "standalone ascending lower-left to upper-right directed stroke labelled a with small over-arrow",
        "standalone descending upper-left to lower-right directed stroke labelled italic b",
        "M to M_1, with arrow near M_1",
        "N to N_1, with arrow near N_1",
        "M_1 to M_2, with arrow near M_2",
        "N_1 to N_2, with arrow near N_2",
        "M to N, with arrow near N",
        "M_1 through N_1 to N_2, downward-right stroke",
        "M to M_2, shallow upward-right stroke through/near N_1",
        "N to N_2, shallow upward-right directed stroke"
      ],
      "incidence": [
        "M at shared left vertex of upward, downward and shallow-right strokes",
        "M_1 at upper vertex",
        "N at lower vertex",
        "M_2 and N_1 are distinct close points in the central-right overlap region",
        "N_2 at far-right vertex; exact handwritten subscript stroke partially degraded"
      ],
      "givens": [
        "labels only",
        "directed solid strokes; no numeric measurements"
      ],
      "ambiguities": [
        "Do not equate M_2 and N_1 merely because their dark strokes are close.",
        "Fine ordering of overlapping central strokes and every individual overprinted arrow barb is UNKNOWN at available scan resolution.",
        "No separate over-arrow above standalone b is confirmed.",
        "Rightmost handwritten subscript is degraded: N_2 is source-text-bound, not a repaired glyph."
      ],
      "caption_inside_crop": false,
      "source_emphasis": "UNKNOWN for handwritten labels; no boldness semantics inferred"
    },
    "fig-72": {
      "physical_page": 67,
      "caption": "图 72",
      "owner": "geo910-c1-s2-n18 equation3 explanation",
      "owner_exercise": null,
      "rough_box": [
        170,
        1270,
        1050,
        570
      ],
      "panels": 3,
      "panel_inventory": [
        {
          "label": "а)",
          "location": "lower left",
          "point_labels": [
            "A",
            "B",
            "C"
          ],
          "incidence": [
            "A lower-left, B upper, C lower-right; three noncollinear points"
          ],
          "directed_strokes": [
            "A to B diagonal ascending",
            "B to C diagonal descending",
            "A to C horizontal rightward"
          ],
          "givens": [
            "no numerical measurement"
          ]
        },
        {
          "label": "б)",
          "location": "upper right",
          "point_labels": [
            "A",
            "B",
            "C"
          ],
          "incidence": [
            "A upper-left, B between A and C, C lower-right; three collinear points"
          ],
          "directed_strokes": [
            "A to B descending-right",
            "B to C descending-right; long A-C stroke overlaps collinear component strokes"
          ],
          "givens": [
            "no numerical measurement"
          ],
          "ambiguity": "Individual overlaid A-C arrowhead separation is UNKNOWN; do not add a separately invented barb."
        },
        {
          "label": "в)",
          "location": "lower right",
          "point_labels": [
            "A",
            "C",
            "B"
          ],
          "incidence": [
            "A left, C between A and B, B right; three collinear points"
          ],
          "directed_strokes": [
            "A toward B rightward with arrow near B",
            "B toward C leftward with arrow near C",
            "A toward C rightward with arrow near C"
          ],
          "givens": [
            "no numerical measurement"
          ]
        }
      ],
      "ambiguous_strokes": [
        "isolated rough dark wedge above/near upper-right panel A, within rough box; UNKNOWN whether scan blemish or source marking; retain exact pixels",
        "small separated dark fleck below/left of panel а) A has UNKNOWN meaning; no new point inferred"
      ],
      "label_script": "Cyrillic а U+0430; б U+0431; в U+0432; no Latin replacement",
      "caption_inside_crop": false,
      "source_emphasis": "UNKNOWN for handwritten panel/point labels"
    }
  },
  "limits": {
    "pixel_comparison": "not performed; no pixel PASS claimed",
    "count_override": false,
    "count_exclusions": [],
    "invented_errata": [],
    "reopened_grid": false,
    "reviewer_outputs_read": false,
    "other_page_pixels_read": false,
    "other_book_or_grade_read": false
  }
}
```

## Official crops
Both official crops were inspected once. The only geometries used are the first-finalize audit boxes, with actual padding 12. No pixel comparison was performed and no pixel PASS is claimed.
Each per-crop JSON file is a dictionary, not an aggregate list treated as a crop dictionary.
```json
[
  {
    "schema": "source-author-official-crop@1",
    "id": "fig-71",
    "physical_page": 66,
    "source": [
      {
        "path": ".tmp/ld-s10y-lesson/9-10g/pages/0066/page.grid.png",
        "category": "source-input",
        "exists": true,
        "type": "file",
        "sha256": "8615cc4de1012080b4b23e868f8b2c084518ff1dbb1b60cb16c3237fd09ce86a",
        "size": 86594,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.tmp/ld-s10y-lesson/9-10g/pages/0066/page.grid.png"
      },
      {
        "path": ".tmp/ld-s10y-lesson/9-10g/pages/0066/page.png",
        "category": "source-input",
        "exists": true,
        "type": "file",
        "sha256": "c3c1ace7c4dd3a9ceb5e0d6f1250982218eb95894e3825e8bc2b2135e17c21b4",
        "size": 70629,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.tmp/ld-s10y-lesson/9-10g/pages/0066/page.png"
      },
      {
        "path": ".tmp/ld-s10y-lesson/9-10g/pages/0066/layout.json",
        "category": "source-input",
        "exists": true,
        "type": "file",
        "sha256": "c11f23e510972a29d52ed93eecd9a3249baf6f4faba7b059800b8233e1895fff",
        "size": 918,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.tmp/ld-s10y-lesson/9-10g/pages/0066/layout.json"
      },
      {
        "path": ".tmp/ld-s10y-lesson/9-10g/pages/0066/page.template.md",
        "category": "source-input",
        "exists": true,
        "type": "file",
        "sha256": "00a8a3bec6a63b743088e4f08fb3bff82efbd031e9e53aac2016659319a8514b",
        "size": 1459,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.tmp/ld-s10y-lesson/9-10g/pages/0066/page.template.md"
      }
    ],
    "crop": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9-10g/pages/0066/figures/fig-71.png",
      "bytes": 7538,
      "sha256": "526e2dea9df1cc4da72df3df526d029f4c9f27d8d0a4122b0495512b6c74cdee"
    },
    "retained_copy": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/fig-71.official-crop.png",
      "bytes": 7538,
      "sha256": "526e2dea9df1cc4da72df3df526d029f4c9f27d8d0a4122b0495512b6c74cdee"
    },
    "actual_machine_geometry": {
      "id": "fig-71",
      "label": "图 71",
      "box": [
        396,
        1443,
        623,
        392
      ],
      "components": 24,
      "from": [
        390,
        1435,
        630,
        410
      ]
    },
    "padding": 12,
    "dimensions": {
      "width": 647,
      "height": 416
    },
    "semantic_inventory": {
      "physical_page": 66,
      "caption": "图 71",
      "owner": "geo910-c1-s2-n18 theorem9 proof",
      "owner_exercise": null,
      "rough_box": [
        390,
        1435,
        630,
        410
      ],
      "panels": 1,
      "point_labels": [
        "M",
        "N",
        "M_1",
        "N_1",
        "M_2",
        "N_2"
      ],
      "strokes": [
        "standalone ascending lower-left to upper-right directed stroke labelled a with small over-arrow",
        "standalone descending upper-left to lower-right directed stroke labelled italic b",
        "M to M_1, with arrow near M_1",
        "N to N_1, with arrow near N_1",
        "M_1 to M_2, with arrow near M_2",
        "N_1 to N_2, with arrow near N_2",
        "M to N, with arrow near N",
        "M_1 through N_1 to N_2, downward-right stroke",
        "M to M_2, shallow upward-right stroke through/near N_1",
        "N to N_2, shallow upward-right directed stroke"
      ],
      "incidence": [
        "M at shared left vertex of upward, downward and shallow-right strokes",
        "M_1 at upper vertex",
        "N at lower vertex",
        "M_2 and N_1 are distinct close points in the central-right overlap region",
        "N_2 at far-right vertex; exact handwritten subscript stroke partially degraded"
      ],
      "givens": [
        "labels only",
        "directed solid strokes; no numeric measurements"
      ],
      "ambiguities": [
        "Do not equate M_2 and N_1 merely because their dark strokes are close.",
        "Fine ordering of overlapping central strokes and every individual overprinted arrow barb is UNKNOWN at available scan resolution.",
        "No separate over-arrow above standalone b is confirmed.",
        "Rightmost handwritten subscript is degraded: N_2 is source-text-bound, not a repaired glyph."
      ],
      "caption_inside_crop": false,
      "source_emphasis": "UNKNOWN for handwritten labels; no boldness semantics inferred"
    },
    "crop_observation": {
      "image_load_ordinal": 5,
      "opened_once": true,
      "detail": "original",
      "actual_first_finalize_box": [
        396,
        1443,
        623,
        392
      ],
      "actual_padding": 12,
      "actual_png_dimensions": [
        647,
        416
      ],
      "observations": [
        "All six source-text-bound point positions and both standalone directed strokes are present.",
        "M_2 and N_1 remain separately visible in the central-right overlap.",
        "Rightmost point label visibly reads N followed by degraded small strokes; the subscript 2 is UNKNOWN from that glyph alone, though source prose names N_2.",
        "Standalone b has no confirmed over-arrow.",
        "Caption and prose do not appear inside the crop.",
        "No vectorization, relabelling, repair, pixel metric or aligned comparison was performed."
      ],
      "per_crop_dictionary": "fig-71.official-crop.json"
    },
    "owner_exercise": null,
    "inspected_once": true,
    "pixel_comparison": {
      "performed": false,
      "status": "NOT_RUN",
      "no_pixel_pass_claim": true
    }
  },
  {
    "schema": "source-author-official-crop@1",
    "id": "fig-72",
    "physical_page": 67,
    "source": [
      {
        "path": ".tmp/ld-s10y-lesson/9-10g/pages/0067/page.grid.png",
        "category": "source-input",
        "exists": true,
        "type": "file",
        "sha256": "9f77f8117ce8812304e925fa0cbbddb297d7703d1b4bd425a114b81917a91e04",
        "size": 87331,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.tmp/ld-s10y-lesson/9-10g/pages/0067/page.grid.png"
      },
      {
        "path": ".tmp/ld-s10y-lesson/9-10g/pages/0067/page.png",
        "category": "source-input",
        "exists": true,
        "type": "file",
        "sha256": "8ce5663f309c7c576c8aa7564b07e79e0be0be1be78e95e2daba4c38edd0202e",
        "size": 71864,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.tmp/ld-s10y-lesson/9-10g/pages/0067/page.png"
      },
      {
        "path": ".tmp/ld-s10y-lesson/9-10g/pages/0067/layout.json",
        "category": "source-input",
        "exists": true,
        "type": "file",
        "sha256": "5b472bb47058255b480ababf7c4c0bab98599636387f09e283355b4e0f882be4",
        "size": 988,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.tmp/ld-s10y-lesson/9-10g/pages/0067/layout.json"
      },
      {
        "path": ".tmp/ld-s10y-lesson/9-10g/pages/0067/page.template.md",
        "category": "source-input",
        "exists": true,
        "type": "file",
        "sha256": "11ba89157bc54e37f09cef6f9d5b07e4c9ea9d29576ec5e62e5c753ac888b87b",
        "size": 1459,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.tmp/ld-s10y-lesson/9-10g/pages/0067/page.template.md"
      }
    ],
    "crop": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9-10g/pages/0067/figures/fig-72.png",
      "bytes": 8448,
      "sha256": "624fff3e4e489bc1fc9762b50518fda09f9e8579a2575e127c439a01ffc1bb4a"
    },
    "retained_copy": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/fig-72.official-crop.png",
      "bytes": 8448,
      "sha256": "624fff3e4e489bc1fc9762b50518fda09f9e8579a2575e127c439a01ffc1bb4a"
    },
    "actual_machine_geometry": {
      "id": "fig-72",
      "label": "图 72",
      "box": [
        179,
        1278,
        1022,
        553
      ],
      "components": 39,
      "from": [
        170,
        1270,
        1050,
        570
      ]
    },
    "padding": 12,
    "dimensions": {
      "width": 1046,
      "height": 577
    },
    "semantic_inventory": {
      "physical_page": 67,
      "caption": "图 72",
      "owner": "geo910-c1-s2-n18 equation3 explanation",
      "owner_exercise": null,
      "rough_box": [
        170,
        1270,
        1050,
        570
      ],
      "panels": 3,
      "panel_inventory": [
        {
          "label": "а)",
          "location": "lower left",
          "point_labels": [
            "A",
            "B",
            "C"
          ],
          "incidence": [
            "A lower-left, B upper, C lower-right; three noncollinear points"
          ],
          "directed_strokes": [
            "A to B diagonal ascending",
            "B to C diagonal descending",
            "A to C horizontal rightward"
          ],
          "givens": [
            "no numerical measurement"
          ]
        },
        {
          "label": "б)",
          "location": "upper right",
          "point_labels": [
            "A",
            "B",
            "C"
          ],
          "incidence": [
            "A upper-left, B between A and C, C lower-right; three collinear points"
          ],
          "directed_strokes": [
            "A to B descending-right",
            "B to C descending-right; long A-C stroke overlaps collinear component strokes"
          ],
          "givens": [
            "no numerical measurement"
          ],
          "ambiguity": "Individual overlaid A-C arrowhead separation is UNKNOWN; do not add a separately invented barb."
        },
        {
          "label": "в)",
          "location": "lower right",
          "point_labels": [
            "A",
            "C",
            "B"
          ],
          "incidence": [
            "A left, C between A and B, B right; three collinear points"
          ],
          "directed_strokes": [
            "A toward B rightward with arrow near B",
            "B toward C leftward with arrow near C",
            "A toward C rightward with arrow near C"
          ],
          "givens": [
            "no numerical measurement"
          ]
        }
      ],
      "ambiguous_strokes": [
        "isolated rough dark wedge above/near upper-right panel A, within rough box; UNKNOWN whether scan blemish or source marking; retain exact pixels",
        "small separated dark fleck below/left of panel а) A has UNKNOWN meaning; no new point inferred"
      ],
      "label_script": "Cyrillic а U+0430; б U+0431; в U+0432; no Latin replacement",
      "caption_inside_crop": false,
      "source_emphasis": "UNKNOWN for handwritten panel/point labels"
    },
    "crop_observation": {
      "image_load_ordinal": 6,
      "opened_once": true,
      "detail": "original",
      "actual_first_finalize_box": [
        179,
        1278,
        1022,
        553
      ],
      "actual_padding": 12,
      "actual_png_dimensions": [
        1046,
        577
      ],
      "observations": [
        "All three source subfigures are present in one crop.",
        "Cyrillic panel labels а), б), в) remain legible and are not substituted with Latin letters.",
        "Panel а has A lower-left, B upper and C lower-right, with directed A-B, B-C and A-C strokes.",
        "Panel б has collinear A-B-C and rightward descending arrows near B and C; no extra overlaid arrowhead is invented.",
        "Panel в has collinear A-C-B, rightward arrows near C and B, and a leftward arrow immediately right of C.",
        "The isolated dark wedge above/near A in panel б is retained; its meaning remains UNKNOWN.",
        "Caption and prose do not appear inside the crop.",
        "No vectorization, relabelling, repair, pixel metric or aligned comparison was performed."
      ],
      "per_crop_dictionary": "fig-72.official-crop.json"
    },
    "owner_exercise": null,
    "inspected_once": true,
    "pixel_comparison": {
      "performed": false,
      "status": "NOT_RUN",
      "no_pixel_pass_claim": true
    }
  }
]
```

## Full input and tool byte bindings
```json
{
  "preserved_before": {
    "schema": "source-author-preservation@1",
    "captured_at": "2026-11-16T12:52:31.533Z",
    "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
    "scope": {
      "book": "9-10g",
      "physical_pages": [
        66,
        67
      ],
      "ticket": "STEMROBIN-184"
    },
    "targets": [
      "ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0066",
      "ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0067"
    ],
    "book_guard": "ssot-resources/soviet10year-textbooks/artifacts/9-10g/book.json",
    "records": [
      {
        "path": ".tmp/ld-s10y-lesson/9-10g/pages/0066/page.grid.png",
        "category": "source-input",
        "exists": true,
        "type": "file",
        "sha256": "8615cc4de1012080b4b23e868f8b2c084518ff1dbb1b60cb16c3237fd09ce86a",
        "size": 86594,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.tmp/ld-s10y-lesson/9-10g/pages/0066/page.grid.png"
      },
      {
        "path": ".tmp/ld-s10y-lesson/9-10g/pages/0066/page.png",
        "category": "source-input",
        "exists": true,
        "type": "file",
        "sha256": "c3c1ace7c4dd3a9ceb5e0d6f1250982218eb95894e3825e8bc2b2135e17c21b4",
        "size": 70629,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.tmp/ld-s10y-lesson/9-10g/pages/0066/page.png"
      },
      {
        "path": ".tmp/ld-s10y-lesson/9-10g/pages/0066/layout.json",
        "category": "source-input",
        "exists": true,
        "type": "file",
        "sha256": "c11f23e510972a29d52ed93eecd9a3249baf6f4faba7b059800b8233e1895fff",
        "size": 918,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.tmp/ld-s10y-lesson/9-10g/pages/0066/layout.json"
      },
      {
        "path": ".tmp/ld-s10y-lesson/9-10g/pages/0066/page.template.md",
        "category": "source-input",
        "exists": true,
        "type": "file",
        "sha256": "00a8a3bec6a63b743088e4f08fb3bff82efbd031e9e53aac2016659319a8514b",
        "size": 1459,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.tmp/ld-s10y-lesson/9-10g/pages/0066/page.template.md"
      },
      {
        "path": ".tmp/ld-s10y-lesson/9-10g/pages/0067/page.grid.png",
        "category": "source-input",
        "exists": true,
        "type": "file",
        "sha256": "9f77f8117ce8812304e925fa0cbbddb297d7703d1b4bd425a114b81917a91e04",
        "size": 87331,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.tmp/ld-s10y-lesson/9-10g/pages/0067/page.grid.png"
      },
      {
        "path": ".tmp/ld-s10y-lesson/9-10g/pages/0067/page.png",
        "category": "source-input",
        "exists": true,
        "type": "file",
        "sha256": "8ce5663f309c7c576c8aa7564b07e79e0be0be1be78e95e2daba4c38edd0202e",
        "size": 71864,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.tmp/ld-s10y-lesson/9-10g/pages/0067/page.png"
      },
      {
        "path": ".tmp/ld-s10y-lesson/9-10g/pages/0067/layout.json",
        "category": "source-input",
        "exists": true,
        "type": "file",
        "sha256": "5b472bb47058255b480ababf7c4c0bab98599636387f09e283355b4e0f882be4",
        "size": 988,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.tmp/ld-s10y-lesson/9-10g/pages/0067/layout.json"
      },
      {
        "path": ".tmp/ld-s10y-lesson/9-10g/pages/0067/page.template.md",
        "category": "source-input",
        "exists": true,
        "type": "file",
        "sha256": "11ba89157bc54e37f09cef6f9d5b07e4c9ea9d29576ec5e62e5c753ac888b87b",
        "size": 1459,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.tmp/ld-s10y-lesson/9-10g/pages/0067/page.template.md"
      },
      {
        "path": ".intentfold/readme.md",
        "category": "instruction",
        "exists": true,
        "type": "file",
        "sha256": "f8dd29bc96c49c08a668dfece3de3fee85dab43f49460ecf3fffe0cb605b1e76",
        "size": 4096,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.intentfold/readme.md"
      },
      {
        "path": ".intentfold/charter/engineering.md",
        "category": "instruction",
        "exists": true,
        "type": "file",
        "sha256": "d4b38ea7ed61f21c70da56d600500f113f9eab8987b9267be6baf905c924977c",
        "size": 14249,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.intentfold/charter/engineering.md"
      },
      {
        "path": ".intentfold/charter/product.md",
        "category": "instruction",
        "exists": true,
        "type": "file",
        "sha256": "7a9e402ce45be292afb0313e0c9f14cfee8e5e6d8a173621f3d8b783ceaaee19",
        "size": 2573,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.intentfold/charter/product.md"
      },
      {
        "path": ".intentfold/charter/operations.md",
        "category": "instruction",
        "exists": true,
        "type": "file",
        "sha256": "dd990c52a21b6ad8d4ae414bf939d20133b26fdaef6757885a94c4d257a41ee9",
        "size": 14439,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.intentfold/charter/operations.md"
      },
      {
        "path": ".claude/skills/ld-s10y-lesson/SKILL.md",
        "category": "instruction",
        "exists": true,
        "type": "file",
        "sha256": "af17828a2178010d9f1c33ae463651ca92113d773e13aca24e53ec138a6f58c5",
        "size": 35455,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.claude/skills/ld-s10y-lesson/SKILL.md"
      },
      {
        "path": ".agents/skills/ld-s10y-image/SKILL.md",
        "category": "instruction",
        "exists": true,
        "type": "file",
        "sha256": "112c2d61d81bfe6ee0862790afc8605c380f8ed756c83160b83646ee022593cf",
        "size": 12053,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.agents/skills/ld-s10y-image/SKILL.md"
      },
      {
        "path": "ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json",
        "category": "toc-identity-only",
        "exists": true,
        "type": "file",
        "sha256": "9a553a6743bec97066cddff9df7fcb7c98ee1a0dce20e4dbfd6a2aa34429ee0c",
        "size": 22171,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json"
      },
      {
        "path": "ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0066",
        "category": "target-before",
        "exists": false
      },
      {
        "path": "ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0067",
        "category": "target-before",
        "exists": false
      },
      {
        "path": "ssot-resources/soviet10year-textbooks/artifacts/9-10g/book.json",
        "category": "book-guard",
        "exists": true,
        "type": "file",
        "sha256": "34ae066f8c1369116330f6b423c4b5a2e5b743b40c0901bfdd45f427c48a07f7",
        "size": 5450,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/ssot-resources/soviet10year-textbooks/artifacts/9-10g/book.json"
      },
      {
        "path": ".claude/skills/ld-s10y-lesson/tools/p2c.py",
        "category": "tool-identity",
        "exists": true,
        "type": "file",
        "sha256": "691f50adcd8e3e8b72f035ef0f3521c943b03e30f6d57daa099d40d3b16725e1",
        "size": 24371,
        "mode": 33188,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.claude/skills/ld-s10y-lesson/tools/p2c.py"
      },
      {
        "path": ".claude/skills/ld-s10y-lesson/.venv/bin/python",
        "category": "python-identity",
        "exists": true,
        "type": "symlink",
        "link": "/Users/yong/.local/share/uv/python/cpython-3.13-macos-aarch64-none/bin/python3.13",
        "realpath": "/Users/yong/.local/share/uv/python/cpython-3.13.13-macos-aarch64-none/bin/python3.13",
        "sha256": "7fc33c67b5d5d91b3ce9ab16d2a354ad623f438c24eed3f543a57fc635aea683",
        "size": 17439616,
        "mode": 41453,
        "raw_copy": ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/before/.claude/skills/ld-s10y-lesson/.venv/bin/python"
      }
    ]
  },
  "current": [
    {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9-10g/pages/0066/page.grid.png",
      "bytes": 86594,
      "sha256": "8615cc4de1012080b4b23e868f8b2c084518ff1dbb1b60cb16c3237fd09ce86a",
      "expected_sha256": "8615cc4de1012080b4b23e868f8b2c084518ff1dbb1b60cb16c3237fd09ce86a",
      "unchanged": true
    },
    {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9-10g/pages/0066/page.png",
      "bytes": 70629,
      "sha256": "c3c1ace7c4dd3a9ceb5e0d6f1250982218eb95894e3825e8bc2b2135e17c21b4",
      "expected_sha256": "c3c1ace7c4dd3a9ceb5e0d6f1250982218eb95894e3825e8bc2b2135e17c21b4",
      "unchanged": true
    },
    {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9-10g/pages/0066/layout.json",
      "bytes": 918,
      "sha256": "c11f23e510972a29d52ed93eecd9a3249baf6f4faba7b059800b8233e1895fff",
      "expected_sha256": "c11f23e510972a29d52ed93eecd9a3249baf6f4faba7b059800b8233e1895fff",
      "unchanged": true
    },
    {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9-10g/pages/0066/page.template.md",
      "bytes": 1459,
      "sha256": "00a8a3bec6a63b743088e4f08fb3bff82efbd031e9e53aac2016659319a8514b",
      "expected_sha256": "00a8a3bec6a63b743088e4f08fb3bff82efbd031e9e53aac2016659319a8514b",
      "unchanged": true
    },
    {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9-10g/pages/0067/page.grid.png",
      "bytes": 87331,
      "sha256": "9f77f8117ce8812304e925fa0cbbddb297d7703d1b4bd425a114b81917a91e04",
      "expected_sha256": "9f77f8117ce8812304e925fa0cbbddb297d7703d1b4bd425a114b81917a91e04",
      "unchanged": true
    },
    {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9-10g/pages/0067/page.png",
      "bytes": 71864,
      "sha256": "8ce5663f309c7c576c8aa7564b07e79e0be0be1be78e95e2daba4c38edd0202e",
      "expected_sha256": "8ce5663f309c7c576c8aa7564b07e79e0be0be1be78e95e2daba4c38edd0202e",
      "unchanged": true
    },
    {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9-10g/pages/0067/layout.json",
      "bytes": 988,
      "sha256": "5b472bb47058255b480ababf7c4c0bab98599636387f09e283355b4e0f882be4",
      "expected_sha256": "5b472bb47058255b480ababf7c4c0bab98599636387f09e283355b4e0f882be4",
      "unchanged": true
    },
    {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9-10g/pages/0067/page.template.md",
      "bytes": 1459,
      "sha256": "11ba89157bc54e37f09cef6f9d5b07e4c9ea9d29576ec5e62e5c753ac888b87b",
      "expected_sha256": "11ba89157bc54e37f09cef6f9d5b07e4c9ea9d29576ec5e62e5c753ac888b87b",
      "unchanged": true
    },
    {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json",
      "bytes": 22171,
      "sha256": "9a553a6743bec97066cddff9df7fcb7c98ee1a0dce20e4dbfd6a2aa34429ee0c",
      "expected_sha256": "9a553a6743bec97066cddff9df7fcb7c98ee1a0dce20e4dbfd6a2aa34429ee0c",
      "unchanged": true
    },
    {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/book.json",
      "bytes": 5450,
      "sha256": "34ae066f8c1369116330f6b423c4b5a2e5b743b40c0901bfdd45f427c48a07f7",
      "expected_sha256": "34ae066f8c1369116330f6b423c4b5a2e5b743b40c0901bfdd45f427c48a07f7",
      "unchanged": true
    },
    {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/p2c.py",
      "bytes": 24371,
      "sha256": "691f50adcd8e3e8b72f035ef0f3521c943b03e30f6d57daa099d40d3b16725e1",
      "expected_sha256": "691f50adcd8e3e8b72f035ef0f3521c943b03e30f6d57daa099d40d3b16725e1",
      "unchanged": true
    },
    {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python",
      "bytes": 17439616,
      "sha256": "7fc33c67b5d5d91b3ce9ab16d2a354ad623f438c24eed3f543a57fc635aea683",
      "expected_sha256": "7fc33c67b5d5d91b3ce9ab16d2a354ad623f438c24eed3f543a57fc635aea683",
      "unchanged": true
    }
  ],
  "helper_modules": [
    {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/blocks.py",
      "bytes": 5945,
      "sha256": "1b6540373067b80cdc34ab7973a26ccfc1b21b62f655139731f16408ea072b66",
      "expected_sha256": "1b6540373067b80cdc34ab7973a26ccfc1b21b62f655139731f16408ea072b66",
      "unchanged": true
    },
    {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/layout.py",
      "bytes": 33685,
      "sha256": "1fc40bd09c423c94c1497de995b43c98f497710c29c7fd753076414b9c96ed48",
      "expected_sha256": "1fc40bd09c423c94c1497de995b43c98f497710c29c7fd753076414b9c96ed48",
      "unchanged": true
    },
    {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/normalize.py",
      "bytes": 9019,
      "sha256": "65db6b013806f0dd9de0a739e09714c8cdfaebd8f9cb41c4edcb5e242beae29f",
      "expected_sha256": "65db6b013806f0dd9de0a739e09714c8cdfaebd8f9cb41c4edcb5e242beae29f",
      "unchanged": true
    },
    {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/mathcheck.py",
      "bytes": 3443,
      "sha256": "8f703e723234c3ccc4d9b329d8e2f7b0053d0af261d0526169c31110a53fa8f7",
      "expected_sha256": "8f703e723234c3ccc4d9b329d8e2f7b0053d0af261d0526169c31110a53fa8f7",
      "unchanged": true
    },
    {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json",
      "bytes": 1705,
      "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849",
      "expected_sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849",
      "unchanged": true
    }
  ],
  "observed_nested_tools": [
    {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/katex_check.js",
      "bytes": 1338,
      "sha256": "59c500172eca6dd76baea669aa0d92f67c28512253a751018782a5006a619b56",
      "raw_copy": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/observed-tools-after/.claude/skills/ld-s10y-lesson/tools/katex_check.js",
      "timing": "observed after first finalizations; not claimed a pre-finalize snapshot"
    },
    {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/node_modules/katex/package.json",
      "bytes": 6430,
      "sha256": "940355baf91a1b07d0b42c15e38edb25704cd5a7020b2d1aceeca37708e35b29",
      "raw_copy": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/observed-tools-after/.claude/skills/ld-s10y-lesson/node_modules/katex/package.json",
      "timing": "observed after first finalizations; not claimed a pre-finalize snapshot"
    },
    {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/node_modules/katex/dist/katex.js",
      "bytes": 618563,
      "sha256": "b6d127a59e590859c5a12e92f7eb5a4a21be58f3ffc1dff7616b0584c4d5f631",
      "raw_copy": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/observed-tools-after/.claude/skills/ld-s10y-lesson/node_modules/katex/dist/katex.js",
      "timing": "observed after first finalizations; not claimed a pre-finalize snapshot"
    }
  ]
}
```

## Image budget
```json
{
  "schema": "source-author-image-budget@1",
  "batch_limit": 8,
  "context_limit": 24,
  "prior_context_images": 0,
  "loads": [
    {
      "ordinal": 1,
      "tool": "functions.view_image",
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9-10g/pages/0066/page.grid.png",
      "detail": "original",
      "role": "physical66-source-grid",
      "sha256": "8615cc4de1012080b4b23e868f8b2c084518ff1dbb1b60cb16c3237fd09ce86a",
      "state": "loaded-once"
    },
    {
      "ordinal": 2,
      "tool": "functions.view_image",
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9-10g/pages/0067/page.grid.png",
      "detail": "original",
      "role": "physical67-source-grid",
      "sha256": "9f77f8117ce8812304e925fa0cbbddb297d7703d1b4bd425a114b81917a91e04",
      "state": "loaded-once"
    },
    {
      "ordinal": 3,
      "tool": "functions.view_image",
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9-10g/pages/0066/page.png",
      "detail": "original",
      "role": "physical66-ungridded-original",
      "sha256": "c3c1ace7c4dd3a9ceb5e0d6f1250982218eb95894e3825e8bc2b2135e17c21b4",
      "state": "loaded-once"
    },
    {
      "ordinal": 4,
      "tool": "functions.view_image",
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9-10g/pages/0067/page.png",
      "detail": "original",
      "role": "physical67-ungridded-original",
      "sha256": "8ce5663f309c7c576c8aa7564b07e79e0be0be1be78e95e2daba4c38edd0202e",
      "state": "loaded-once"
    },
    {
      "ordinal": 5,
      "tool": "functions.view_image",
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9-10g/pages/0066/figures/fig-71.png",
      "detail": "original",
      "role": "official-first-finalize-crop",
      "geometry": [
        396,
        1443,
        623,
        392
      ],
      "padding": 12,
      "byte_binding": "commands/018-finalize-0066/after-finalize.json",
      "state": "loaded-once"
    },
    {
      "ordinal": 6,
      "tool": "functions.view_image",
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/9-10g/pages/0067/figures/fig-72.png",
      "detail": "original",
      "role": "official-first-finalize-crop",
      "geometry": [
        179,
        1278,
        1022,
        553
      ],
      "padding": 12,
      "byte_binding": "commands/019-finalize-0067/after-finalize.json",
      "state": "loaded-once"
    }
  ],
  "images_loaded": 6,
  "batch_remaining": 2,
  "context_images": 6,
  "context_remaining": 18,
  "no_further_loads": true
}
```

## Commands and audit limits
# Initial command log

All commands use cwd `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Tool: `functions.exec_command`, invoked through `multi_tool_use.parallel` where noted.
No backend, Git, DB, prepare, test or build command was run.

1. `pwd`: exit 0, stdout `/Users/yong/.codex/worktrees/a07e/lemmadeck\n`, empty stderr; tool chunk `1c415e`, duration 0.0000 s. This initial command was NOT pre-recorded; it preceded the user's required command logging. This is an audit limitation, not a claimed compliant pre-log.
2. `sed -n '1,260p' .intentfold/readme.md`: pre-announced, parallel group 1; exit 0; chunk `a9b149`, 0.0058 s.
3. `sed -n '1,260p' .intentfold/charter/engineering.md`: pre-announced, parallel group 1; exit 0; chunk `ce1b2a`, 0.0000 s.
4. `sed -n '1,260p' .intentfold/charter/product.md`: pre-announced, parallel group 1; exit 0; chunk `dfcf46`, 0.0646 s.
5. `sed -n '1,260p' .intentfold/charter/operations.md`: pre-announced, parallel group 1; exit 0; chunk `50a3ef`, 0.0264 s.
6. `sed -n '1,280p' .claude/skills/ld-s10y-lesson/SKILL.md`: pre-announced, parallel group 1; exit 0; chunk `ecfe92`, 0.0657 s.
7. `sed -n '1,280p' .agents/skills/ld-s10y-image/SKILL.md`: pre-announced, parallel group 1; exit 0; chunk `83af19`, 0.0534 s.
8. Initial preservation: `node --input-type=module -e` with the exact JavaScript retained in `bootstrap-command.txt`; pre-announced; exit 0; chunk `17b6cf`, 0.0000 s; captured at `2026-11-16T12:52:31.533Z`. Complete returned JSON is `preservation-before.json`. Opaque raw input, instruction, tool, TOC and book copies are under `before/`. Both durable targets were absent.

Initial read-command stdout is recoverable exactly by the recorded `sed` range against the corresponding preserved raw instruction bytes. The initial tool did not expose separately timestamped start/end records or separate stderr files; no such records are fabricated. Subsequent actual subprocess commands are recorded BEFORE execution by `audit-runner.mjs`, with full raw stdout/stderr and start/result records.

Manual code/artifact edits use `functions.apply_patch`; their exact tool payloads remain in the calling chat. This file, `bootstrap-command.txt`, and `audit-runner.mjs` are the first manual writes, after the complete preservation snapshot. No pre-existing file was overwritten.

Exact bootstrap command:
```text
node --input-type=module -e 'import fs from "node:fs"; import path from "node:path"; import crypto from "node:crypto"; const root=process.cwd(); const out=path.join(root,".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence"); const h=b=>crypto.createHash("sha256").update(b).digest("hex"); const inputs=[66,67].flatMap(n=>["page.grid.png","page.png","layout.json","page.template.md"].map(f=>`.tmp/ld-s10y-lesson/9-10g/pages/${String(n).padStart(4,"0")}/${f}`)); const docs=[".intentfold/readme.md",".intentfold/charter/engineering.md",".intentfold/charter/product.md",".intentfold/charter/operations.md",".claude/skills/ld-s10y-lesson/SKILL.md",".agents/skills/ld-s10y-image/SKILL.md"]; const targetRoots=[66,67].map(n=>`ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/${String(n).padStart(4,"0")}`); const guard="ssot-resources/soviet10year-textbooks/artifacts/9-10g/book.json"; const tool=".claude/skills/ld-s10y-lesson/tools/p2c.py"; const py=".claude/skills/ld-s10y-lesson/.venv/bin/python"; const all=[]; function inventory(rel,category){ const abs=path.join(root,rel); if(!fs.existsSync(abs)){all.push({path:rel,category,exists:false});return;} const st=fs.lstatSync(abs); if(st.isDirectory()){all.push({path:rel,category,exists:true,type:"directory",mode:st.mode}); for(const name of fs.readdirSync(abs).sort())inventory(path.join(rel,name),category); }else if(st.isSymbolicLink()){const real=fs.realpathSync(abs); const bytes=fs.readFileSync(real); all.push({path:rel,category,exists:true,type:"symlink",link:fs.readlinkSync(abs),realpath:real,sha256:h(bytes),size:bytes.length,bytes,mode:st.mode});}else{const bytes=fs.readFileSync(abs);all.push({path:rel,category,exists:true,type:"file",sha256:h(bytes),size:bytes.length,bytes,mode:st.mode});}} for(const p of inputs)inventory(p,"source-input"); for(const p of docs)inventory(p,"instruction"); inventory("ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json","toc-identity-only"); for(const p of targetRoots)inventory(p,"target-before"); inventory(guard,"book-guard"); inventory(tool,"tool-identity"); inventory(py,"python-identity"); if(fs.existsSync(out))throw new Error("Evidence directory already exists; no overwrite"); const missing=all.filter(x=>!x.exists&&["source-input","instruction","toc-identity-only","tool-identity","python-identity"].includes(x.category)); if(missing.length)throw new Error(JSON.stringify(missing)); fs.mkdirSync(out,{recursive:true}); for(const rec of all){if(rec.bytes){const dest=path.join(out,"before",rec.path);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,rec.bytes,{flag:"wx"});rec.raw_copy=path.relative(root,dest);delete rec.bytes;}} const state={schema:"source-author-preservation@1",captured_at:new Date().toISOString(),cwd:root,scope:{book:"9-10g",physical_pages:[66,67],ticket:"STEMROBIN-184"},targets:targetRoots,book_guard:guard,records:all}; fs.writeFileSync(path.join(out,"preservation-before.json"),JSON.stringify(state,null,2)+"\n",{flag:"wx"}); console.log(JSON.stringify(state,null,2));'

```
All later subprocess argv were durably recorded before launch by the wrapper. Initial instruction outputs are recoverable from preserved bytes plus recorded sed ranges.
The nested KaTeX command is `node .claude/skills/ld-s10y-lesson/tools/katex_check.js` with skill-directory cwd, invoked by unchanged mathcheck.py. The pipeline captures that child's stdout/stderr internally; they are not separately exposed by p2c. Its contract/code identity is retained; no separately timestamped nested child record is invented.
The packaging command's start record is included below; its stdout/stderr/result are written by the wrapper after this generated manifest/report. Those post-package log files remain in the evidence directory and are outside the self-referential hash inventory.
```json
[
  {
    "directory": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/009-intentfold",
    "start": {
      "id": "009-intentfold",
      "mode": "run",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "run",
        "009-intentfold",
        "sed",
        "-n",
        "1,260p",
        "/Users/yong/.agents/skills/intentfold/SKILL.md"
      ],
      "actual_argv": [
        "sed",
        "-n",
        "1,260p",
        "/Users/yong/.agents/skills/intentfold/SKILL.md"
      ],
      "started_at": "2026-11-16T12:53:43.289Z",
      "wrapper_sha256": "70ba02ee99d39e1d6125ed193d9656dc5244d2eaccc6c65957c6574edc171327"
    },
    "result": {
      "id": "009-intentfold",
      "mode": "run",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "run",
        "009-intentfold",
        "sed",
        "-n",
        "1,260p",
        "/Users/yong/.agents/skills/intentfold/SKILL.md"
      ],
      "actual_argv": [
        "sed",
        "-n",
        "1,260p",
        "/Users/yong/.agents/skills/intentfold/SKILL.md"
      ],
      "started_at": "2026-11-16T12:53:43.289Z",
      "wrapper_sha256": "70ba02ee99d39e1d6125ed193d9656dc5244d2eaccc6c65957c6574edc171327",
      "ended_at": "2026-11-16T12:53:43.316Z",
      "exit_code": 0,
      "signal": null,
      "error": null,
      "stdout_sha256": "b24c40e3db353613e90cf7f6023b1a265acae0d93cdbbd4b8e6fd53a93234680",
      "stderr_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    "stdout": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/009-intentfold/stdout.raw",
      "bytes": 17707,
      "sha256": "b24c40e3db353613e90cf7f6023b1a265acae0d93cdbbd4b8e6fd53a93234680"
    },
    "stderr": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/009-intentfold/stderr.raw",
      "bytes": 0,
      "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
  },
  {
    "directory": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/010-input-text",
    "start": {
      "id": "010-input-text",
      "mode": "run",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "run",
        "010-input-text",
        "node",
        "--input-type=module",
        "-e",
        "import fs from \"node:fs\"; for(const n of [\"0066\",\"0067\"]){ for(const f of [\"layout.json\",\"page.template.md\"]){const p=`.tmp/ld-s10y-lesson/9-10g/pages/${n}/${f}`; console.log(JSON.stringify({path:p,raw:fs.readFileSync(p,\"utf8\")}));}}"
      ],
      "actual_argv": [
        "node",
        "--input-type=module",
        "-e",
        "import fs from \"node:fs\"; for(const n of [\"0066\",\"0067\"]){ for(const f of [\"layout.json\",\"page.template.md\"]){const p=`.tmp/ld-s10y-lesson/9-10g/pages/${n}/${f}`; console.log(JSON.stringify({path:p,raw:fs.readFileSync(p,\"utf8\")}));}}"
      ],
      "started_at": "2026-11-16T12:53:43.292Z",
      "wrapper_sha256": "70ba02ee99d39e1d6125ed193d9656dc5244d2eaccc6c65957c6574edc171327"
    },
    "result": {
      "id": "010-input-text",
      "mode": "run",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "run",
        "010-input-text",
        "node",
        "--input-type=module",
        "-e",
        "import fs from \"node:fs\"; for(const n of [\"0066\",\"0067\"]){ for(const f of [\"layout.json\",\"page.template.md\"]){const p=`.tmp/ld-s10y-lesson/9-10g/pages/${n}/${f}`; console.log(JSON.stringify({path:p,raw:fs.readFileSync(p,\"utf8\")}));}}"
      ],
      "actual_argv": [
        "node",
        "--input-type=module",
        "-e",
        "import fs from \"node:fs\"; for(const n of [\"0066\",\"0067\"]){ for(const f of [\"layout.json\",\"page.template.md\"]){const p=`.tmp/ld-s10y-lesson/9-10g/pages/${n}/${f}`; console.log(JSON.stringify({path:p,raw:fs.readFileSync(p,\"utf8\")}));}}"
      ],
      "started_at": "2026-11-16T12:53:43.292Z",
      "wrapper_sha256": "70ba02ee99d39e1d6125ed193d9656dc5244d2eaccc6c65957c6574edc171327",
      "ended_at": "2026-11-16T12:53:43.343Z",
      "exit_code": 0,
      "signal": null,
      "error": null,
      "stdout_sha256": "3d7e90609ef9ae464025d55cde667fcd582154ab46e48a861b4446a6604a136d",
      "stderr_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    "stdout": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/010-input-text/stdout.raw",
      "bytes": 5552,
      "sha256": "3d7e90609ef9ae464025d55cde667fcd582154ab46e48a861b4446a6604a136d"
    },
    "stderr": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/010-input-text/stderr.raw",
      "bytes": 0,
      "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
  },
  {
    "directory": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/011-p2c-read",
    "start": {
      "id": "011-p2c-read",
      "mode": "run",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "run",
        "011-p2c-read",
        "sed",
        "-n",
        "1,340p",
        ".claude/skills/ld-s10y-lesson/tools/p2c.py"
      ],
      "actual_argv": [
        "sed",
        "-n",
        "1,340p",
        ".claude/skills/ld-s10y-lesson/tools/p2c.py"
      ],
      "started_at": "2026-11-16T12:53:43.349Z",
      "wrapper_sha256": "70ba02ee99d39e1d6125ed193d9656dc5244d2eaccc6c65957c6574edc171327"
    },
    "result": {
      "id": "011-p2c-read",
      "mode": "run",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "run",
        "011-p2c-read",
        "sed",
        "-n",
        "1,340p",
        ".claude/skills/ld-s10y-lesson/tools/p2c.py"
      ],
      "actual_argv": [
        "sed",
        "-n",
        "1,340p",
        ".claude/skills/ld-s10y-lesson/tools/p2c.py"
      ],
      "started_at": "2026-11-16T12:53:43.349Z",
      "wrapper_sha256": "70ba02ee99d39e1d6125ed193d9656dc5244d2eaccc6c65957c6574edc171327",
      "ended_at": "2026-11-16T12:53:43.357Z",
      "exit_code": 0,
      "signal": null,
      "error": null,
      "stdout_sha256": "98ca9456ab97b7e37416a3bdda69865a2ed60e56ca9440d48b39d8c9c1366610",
      "stderr_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    "stdout": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/011-p2c-read/stdout.raw",
      "bytes": 13489,
      "sha256": "98ca9456ab97b7e37416a3bdda69865a2ed60e56ca9440d48b39d8c9c1366610"
    },
    "stderr": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/011-p2c-read/stderr.raw",
      "bytes": 0,
      "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
  },
  {
    "directory": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/012-finalize-rest",
    "start": {
      "id": "012-finalize-rest",
      "mode": "run",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "run",
        "012-finalize-rest",
        "sed",
        "-n",
        "340,470p",
        ".claude/skills/ld-s10y-lesson/tools/p2c.py"
      ],
      "actual_argv": [
        "sed",
        "-n",
        "340,470p",
        ".claude/skills/ld-s10y-lesson/tools/p2c.py"
      ],
      "started_at": "2026-11-16T12:54:38.271Z",
      "wrapper_sha256": "70ba02ee99d39e1d6125ed193d9656dc5244d2eaccc6c65957c6574edc171327"
    },
    "result": {
      "id": "012-finalize-rest",
      "mode": "run",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "run",
        "012-finalize-rest",
        "sed",
        "-n",
        "340,470p",
        ".claude/skills/ld-s10y-lesson/tools/p2c.py"
      ],
      "actual_argv": [
        "sed",
        "-n",
        "340,470p",
        ".claude/skills/ld-s10y-lesson/tools/p2c.py"
      ],
      "started_at": "2026-11-16T12:54:38.271Z",
      "wrapper_sha256": "70ba02ee99d39e1d6125ed193d9656dc5244d2eaccc6c65957c6574edc171327",
      "ended_at": "2026-11-16T12:54:38.279Z",
      "exit_code": 0,
      "signal": null,
      "error": null,
      "stdout_sha256": "a0b1fb0e4534e0c504f30be8d9ba610c6c9da63f0f3bfaff189e3da7c9a22c78",
      "stderr_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    "stdout": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/012-finalize-rest/stdout.raw",
      "bytes": 6039,
      "sha256": "a0b1fb0e4534e0c504f30be8d9ba610c6c9da63f0f3bfaff189e3da7c9a22c78"
    },
    "stderr": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/012-finalize-rest/stderr.raw",
      "bytes": 0,
      "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
  },
  {
    "directory": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/013-block-parser",
    "start": {
      "id": "013-block-parser",
      "mode": "run",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "run",
        "013-block-parser",
        "sed",
        "-n",
        "1,310p",
        ".claude/skills/ld-s10y-lesson/tools/blocks.py"
      ],
      "actual_argv": [
        "sed",
        "-n",
        "1,310p",
        ".claude/skills/ld-s10y-lesson/tools/blocks.py"
      ],
      "started_at": "2026-11-16T12:54:38.284Z",
      "wrapper_sha256": "70ba02ee99d39e1d6125ed193d9656dc5244d2eaccc6c65957c6574edc171327"
    },
    "result": {
      "id": "013-block-parser",
      "mode": "run",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "run",
        "013-block-parser",
        "sed",
        "-n",
        "1,310p",
        ".claude/skills/ld-s10y-lesson/tools/blocks.py"
      ],
      "actual_argv": [
        "sed",
        "-n",
        "1,310p",
        ".claude/skills/ld-s10y-lesson/tools/blocks.py"
      ],
      "started_at": "2026-11-16T12:54:38.284Z",
      "wrapper_sha256": "70ba02ee99d39e1d6125ed193d9656dc5244d2eaccc6c65957c6574edc171327",
      "ended_at": "2026-11-16T12:54:38.289Z",
      "exit_code": 0,
      "signal": null,
      "error": null,
      "stdout_sha256": "1b6540373067b80cdc34ab7973a26ccfc1b21b62f655139731f16408ea072b66",
      "stderr_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    "stdout": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/013-block-parser/stdout.raw",
      "bytes": 5945,
      "sha256": "1b6540373067b80cdc34ab7973a26ccfc1b21b62f655139731f16408ea072b66"
    },
    "stderr": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/013-block-parser/stderr.raw",
      "bytes": 0,
      "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
  },
  {
    "directory": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/014-toc-identity",
    "start": {
      "id": "014-toc-identity",
      "mode": "run",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "run",
        "014-toc-identity",
        "node",
        "--input-type=module",
        "-e",
        "import fs from \"node:fs\"; const toc=JSON.parse(fs.readFileSync(\"ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json\",\"utf8\")); function visit(v,anc=[]){ if(Array.isArray(v)){v.forEach(x=>visit(x,anc));return;} if(!v||typeof v!==\"object\")return; const self=Object.fromEntries(Object.entries(v).filter(([k,x])=>x===null||typeof x!==\"object\")); const s=JSON.stringify(self); if(s.includes(\"向量的加法\")||s.includes(\"向量的定义\"))console.log(JSON.stringify({ancestors:anc,identity:self})); for(const [k,x]of Object.entries(v)){if(x&&typeof x===\"object\")visit(x,[...anc,self]);}} visit(toc);"
      ],
      "actual_argv": [
        "node",
        "--input-type=module",
        "-e",
        "import fs from \"node:fs\"; const toc=JSON.parse(fs.readFileSync(\"ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json\",\"utf8\")); function visit(v,anc=[]){ if(Array.isArray(v)){v.forEach(x=>visit(x,anc));return;} if(!v||typeof v!==\"object\")return; const self=Object.fromEntries(Object.entries(v).filter(([k,x])=>x===null||typeof x!==\"object\")); const s=JSON.stringify(self); if(s.includes(\"向量的加法\")||s.includes(\"向量的定义\"))console.log(JSON.stringify({ancestors:anc,identity:self})); for(const [k,x]of Object.entries(v)){if(x&&typeof x===\"object\")visit(x,[...anc,self]);}} visit(toc);"
      ],
      "started_at": "2026-11-16T12:54:38.275Z",
      "wrapper_sha256": "70ba02ee99d39e1d6125ed193d9656dc5244d2eaccc6c65957c6574edc171327"
    },
    "result": {
      "id": "014-toc-identity",
      "mode": "run",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "run",
        "014-toc-identity",
        "node",
        "--input-type=module",
        "-e",
        "import fs from \"node:fs\"; const toc=JSON.parse(fs.readFileSync(\"ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json\",\"utf8\")); function visit(v,anc=[]){ if(Array.isArray(v)){v.forEach(x=>visit(x,anc));return;} if(!v||typeof v!==\"object\")return; const self=Object.fromEntries(Object.entries(v).filter(([k,x])=>x===null||typeof x!==\"object\")); const s=JSON.stringify(self); if(s.includes(\"向量的加法\")||s.includes(\"向量的定义\"))console.log(JSON.stringify({ancestors:anc,identity:self})); for(const [k,x]of Object.entries(v)){if(x&&typeof x===\"object\")visit(x,[...anc,self]);}} visit(toc);"
      ],
      "actual_argv": [
        "node",
        "--input-type=module",
        "-e",
        "import fs from \"node:fs\"; const toc=JSON.parse(fs.readFileSync(\"ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json\",\"utf8\")); function visit(v,anc=[]){ if(Array.isArray(v)){v.forEach(x=>visit(x,anc));return;} if(!v||typeof v!==\"object\")return; const self=Object.fromEntries(Object.entries(v).filter(([k,x])=>x===null||typeof x!==\"object\")); const s=JSON.stringify(self); if(s.includes(\"向量的加法\")||s.includes(\"向量的定义\"))console.log(JSON.stringify({ancestors:anc,identity:self})); for(const [k,x]of Object.entries(v)){if(x&&typeof x===\"object\")visit(x,[...anc,self]);}} visit(toc);"
      ],
      "started_at": "2026-11-16T12:54:38.275Z",
      "wrapper_sha256": "70ba02ee99d39e1d6125ed193d9656dc5244d2eaccc6c65957c6574edc171327",
      "ended_at": "2026-11-16T12:54:38.308Z",
      "exit_code": 0,
      "signal": null,
      "error": null,
      "stdout_sha256": "786c11ae0f0e1f32dc23839562bfa0db6d31c059d5c08b7dcbd0867cf1a806ed",
      "stderr_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    "stdout": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/014-toc-identity/stdout.raw",
      "bytes": 1226,
      "sha256": "786c11ae0f0e1f32dc23839562bfa0db6d31c059d5c08b7dcbd0867cf1a806ed"
    },
    "stderr": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/014-toc-identity/stderr.raw",
      "bytes": 0,
      "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
  },
  {
    "directory": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/015-layout-geometry",
    "start": {
      "id": "015-layout-geometry",
      "mode": "run",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "run",
        "015-layout-geometry",
        "rg",
        "-n",
        "-A",
        "92",
        "def snap|def crop|def line_bands|def figure_ink",
        ".claude/skills/ld-s10y-lesson/tools/layout.py"
      ],
      "actual_argv": [
        "rg",
        "-n",
        "-A",
        "92",
        "def snap|def crop|def line_bands|def figure_ink",
        ".claude/skills/ld-s10y-lesson/tools/layout.py"
      ],
      "started_at": "2026-11-16T12:56:46.780Z",
      "wrapper_sha256": "70ba02ee99d39e1d6125ed193d9656dc5244d2eaccc6c65957c6574edc171327"
    },
    "result": {
      "id": "015-layout-geometry",
      "mode": "run",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "run",
        "015-layout-geometry",
        "rg",
        "-n",
        "-A",
        "92",
        "def snap|def crop|def line_bands|def figure_ink",
        ".claude/skills/ld-s10y-lesson/tools/layout.py"
      ],
      "actual_argv": [
        "rg",
        "-n",
        "-A",
        "92",
        "def snap|def crop|def line_bands|def figure_ink",
        ".claude/skills/ld-s10y-lesson/tools/layout.py"
      ],
      "started_at": "2026-11-16T12:56:46.780Z",
      "wrapper_sha256": "70ba02ee99d39e1d6125ed193d9656dc5244d2eaccc6c65957c6574edc171327",
      "ended_at": "2026-11-16T12:56:46.812Z",
      "exit_code": 0,
      "signal": null,
      "error": null,
      "stdout_sha256": "78719d2a76777bed2f72c30d94b3ca599156cc32eadc0406cf67e5b4c6e07115",
      "stderr_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    "stdout": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/015-layout-geometry/stdout.raw",
      "bytes": 7726,
      "sha256": "78719d2a76777bed2f72c30d94b3ca599156cc32eadc0406cf67e5b4c6e07115"
    },
    "stderr": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/015-layout-geometry/stderr.raw",
      "bytes": 0,
      "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
  },
  {
    "directory": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/016-tools-preserve",
    "start": {
      "id": "016-tools-preserve",
      "mode": "run",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "run",
        "016-tools-preserve",
        "node",
        "--input-type=module",
        "-e",
        "import fs from \"node:fs\";import path from \"node:path\";import crypto from \"node:crypto\";const E=\".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence\";const files=[\"blocks.py\",\"layout.py\",\"normalize.py\",\"mathcheck.py\"].map(f=>`.claude/skills/ld-s10y-lesson/tools/${f}`).concat([\".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json\"]);const records=files.map(p=>{const b=fs.readFileSync(p);const c=path.join(E,\"tool-inputs-before\",p);fs.mkdirSync(path.dirname(c),{recursive:true});fs.writeFileSync(c,b,{flag:\"wx\"});return {path:p,sha256:crypto.createHash(\"sha256\").update(b).digest(\"hex\"),size:b.length,raw_copy:c};});fs.writeFileSync(path.join(E,\"tool-inputs-before.json\"),JSON.stringify(records,null,2)+\"\\n\",{flag:\"wx\"});console.log(JSON.stringify(records,null,2)); const t=JSON.parse(fs.readFileSync(\"ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json\",\"utf8\"));function visit(v){if(Array.isArray(v)){v.forEach(visit);return;}if(!v||typeof v!==\"object\")return;if([17,18].includes(v.printedNumber))console.log(JSON.stringify({id:v.id,printedNumber:v.printedNumber,title:v.title}));Object.values(v).filter(x=>x&&typeof x===\"object\").forEach(visit);}visit(t);"
      ],
      "actual_argv": [
        "node",
        "--input-type=module",
        "-e",
        "import fs from \"node:fs\";import path from \"node:path\";import crypto from \"node:crypto\";const E=\".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence\";const files=[\"blocks.py\",\"layout.py\",\"normalize.py\",\"mathcheck.py\"].map(f=>`.claude/skills/ld-s10y-lesson/tools/${f}`).concat([\".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json\"]);const records=files.map(p=>{const b=fs.readFileSync(p);const c=path.join(E,\"tool-inputs-before\",p);fs.mkdirSync(path.dirname(c),{recursive:true});fs.writeFileSync(c,b,{flag:\"wx\"});return {path:p,sha256:crypto.createHash(\"sha256\").update(b).digest(\"hex\"),size:b.length,raw_copy:c};});fs.writeFileSync(path.join(E,\"tool-inputs-before.json\"),JSON.stringify(records,null,2)+\"\\n\",{flag:\"wx\"});console.log(JSON.stringify(records,null,2)); const t=JSON.parse(fs.readFileSync(\"ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json\",\"utf8\"));function visit(v){if(Array.isArray(v)){v.forEach(visit);return;}if(!v||typeof v!==\"object\")return;if([17,18].includes(v.printedNumber))console.log(JSON.stringify({id:v.id,printedNumber:v.printedNumber,title:v.title}));Object.values(v).filter(x=>x&&typeof x===\"object\").forEach(visit);}visit(t);"
      ],
      "started_at": "2026-11-16T12:56:46.848Z",
      "wrapper_sha256": "70ba02ee99d39e1d6125ed193d9656dc5244d2eaccc6c65957c6574edc171327"
    },
    "result": {
      "id": "016-tools-preserve",
      "mode": "run",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "run",
        "016-tools-preserve",
        "node",
        "--input-type=module",
        "-e",
        "import fs from \"node:fs\";import path from \"node:path\";import crypto from \"node:crypto\";const E=\".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence\";const files=[\"blocks.py\",\"layout.py\",\"normalize.py\",\"mathcheck.py\"].map(f=>`.claude/skills/ld-s10y-lesson/tools/${f}`).concat([\".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json\"]);const records=files.map(p=>{const b=fs.readFileSync(p);const c=path.join(E,\"tool-inputs-before\",p);fs.mkdirSync(path.dirname(c),{recursive:true});fs.writeFileSync(c,b,{flag:\"wx\"});return {path:p,sha256:crypto.createHash(\"sha256\").update(b).digest(\"hex\"),size:b.length,raw_copy:c};});fs.writeFileSync(path.join(E,\"tool-inputs-before.json\"),JSON.stringify(records,null,2)+\"\\n\",{flag:\"wx\"});console.log(JSON.stringify(records,null,2)); const t=JSON.parse(fs.readFileSync(\"ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json\",\"utf8\"));function visit(v){if(Array.isArray(v)){v.forEach(visit);return;}if(!v||typeof v!==\"object\")return;if([17,18].includes(v.printedNumber))console.log(JSON.stringify({id:v.id,printedNumber:v.printedNumber,title:v.title}));Object.values(v).filter(x=>x&&typeof x===\"object\").forEach(visit);}visit(t);"
      ],
      "actual_argv": [
        "node",
        "--input-type=module",
        "-e",
        "import fs from \"node:fs\";import path from \"node:path\";import crypto from \"node:crypto\";const E=\".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence\";const files=[\"blocks.py\",\"layout.py\",\"normalize.py\",\"mathcheck.py\"].map(f=>`.claude/skills/ld-s10y-lesson/tools/${f}`).concat([\".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json\"]);const records=files.map(p=>{const b=fs.readFileSync(p);const c=path.join(E,\"tool-inputs-before\",p);fs.mkdirSync(path.dirname(c),{recursive:true});fs.writeFileSync(c,b,{flag:\"wx\"});return {path:p,sha256:crypto.createHash(\"sha256\").update(b).digest(\"hex\"),size:b.length,raw_copy:c};});fs.writeFileSync(path.join(E,\"tool-inputs-before.json\"),JSON.stringify(records,null,2)+\"\\n\",{flag:\"wx\"});console.log(JSON.stringify(records,null,2)); const t=JSON.parse(fs.readFileSync(\"ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json\",\"utf8\"));function visit(v){if(Array.isArray(v)){v.forEach(visit);return;}if(!v||typeof v!==\"object\")return;if([17,18].includes(v.printedNumber))console.log(JSON.stringify({id:v.id,printedNumber:v.printedNumber,title:v.title}));Object.values(v).filter(x=>x&&typeof x===\"object\").forEach(visit);}visit(t);"
      ],
      "started_at": "2026-11-16T12:56:46.848Z",
      "wrapper_sha256": "70ba02ee99d39e1d6125ed193d9656dc5244d2eaccc6c65957c6574edc171327",
      "ended_at": "2026-11-16T12:56:46.883Z",
      "exit_code": 0,
      "signal": null,
      "error": null,
      "stdout_sha256": "64fb59fbb3eaa3bdde94c5becec12c3b9dd8eb12796ff12cbb5826e6b85d168d",
      "stderr_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    "stdout": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/016-tools-preserve/stdout.raw",
      "bytes": 1790,
      "sha256": "64fb59fbb3eaa3bdde94c5becec12c3b9dd8eb12796ff12cbb5826e6b85d168d"
    },
    "stderr": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/016-tools-preserve/stderr.raw",
      "bytes": 0,
      "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
  },
  {
    "directory": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/017-mathcheck-identify",
    "start": {
      "id": "017-mathcheck-identify",
      "mode": "run",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "run",
        "017-mathcheck-identify",
        "sed",
        "-n",
        "1,220p",
        ".claude/skills/ld-s10y-lesson/tools/mathcheck.py"
      ],
      "actual_argv": [
        "sed",
        "-n",
        "1,220p",
        ".claude/skills/ld-s10y-lesson/tools/mathcheck.py"
      ],
      "started_at": "2026-11-16T12:58:26.510Z",
      "wrapper_sha256": "18b20d03851ba3924a435940eaa693754235196213d001110b1680176651e79b"
    },
    "result": {
      "id": "017-mathcheck-identify",
      "mode": "run",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "run",
        "017-mathcheck-identify",
        "sed",
        "-n",
        "1,220p",
        ".claude/skills/ld-s10y-lesson/tools/mathcheck.py"
      ],
      "actual_argv": [
        "sed",
        "-n",
        "1,220p",
        ".claude/skills/ld-s10y-lesson/tools/mathcheck.py"
      ],
      "started_at": "2026-11-16T12:58:26.510Z",
      "wrapper_sha256": "18b20d03851ba3924a435940eaa693754235196213d001110b1680176651e79b",
      "ended_at": "2026-11-16T12:58:26.517Z",
      "exit_code": 0,
      "signal": null,
      "error": null,
      "stdout_sha256": "8f703e723234c3ccc4d9b329d8e2f7b0053d0af261d0526169c31110a53fa8f7",
      "stderr_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    "stdout": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/017-mathcheck-identify/stdout.raw",
      "bytes": 3443,
      "sha256": "8f703e723234c3ccc4d9b329d8e2f7b0053d0af261d0526169c31110a53fa8f7"
    },
    "stderr": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/017-mathcheck-identify/stderr.raw",
      "bytes": 0,
      "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
  },
  {
    "directory": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/018-finalize-0066",
    "start": {
      "id": "018-finalize-0066",
      "mode": "finalize",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "finalize",
        "018-finalize-0066",
        "66"
      ],
      "actual_argv": [
        ".claude/skills/ld-s10y-lesson/.venv/bin/python",
        "-B",
        ".claude/skills/ld-s10y-lesson/tools/p2c.py",
        "finalize",
        "--book",
        "9-10g",
        "--page",
        "66"
      ],
      "started_at": "2026-11-16T12:59:31.587Z",
      "wrapper_sha256": "18b20d03851ba3924a435940eaa693754235196213d001110b1680176651e79b"
    },
    "result": {
      "id": "018-finalize-0066",
      "mode": "finalize",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "finalize",
        "018-finalize-0066",
        "66"
      ],
      "actual_argv": [
        ".claude/skills/ld-s10y-lesson/.venv/bin/python",
        "-B",
        ".claude/skills/ld-s10y-lesson/tools/p2c.py",
        "finalize",
        "--book",
        "9-10g",
        "--page",
        "66"
      ],
      "started_at": "2026-11-16T12:59:31.587Z",
      "wrapper_sha256": "18b20d03851ba3924a435940eaa693754235196213d001110b1680176651e79b",
      "ended_at": "2026-11-16T12:59:32.079Z",
      "exit_code": 0,
      "signal": null,
      "error": null,
      "stdout_sha256": "a6ff8a1cbc4b9fd7bf4c00d6fc8131400f14ae5ae7b8e5e7e252db762b5ca754",
      "stderr_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    "stdout": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/018-finalize-0066/stdout.raw",
      "bytes": 178,
      "sha256": "a6ff8a1cbc4b9fd7bf4c00d6fc8131400f14ae5ae7b8e5e7e252db762b5ca754"
    },
    "stderr": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/018-finalize-0066/stderr.raw",
      "bytes": 0,
      "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
  },
  {
    "directory": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/019-finalize-0067",
    "start": {
      "id": "019-finalize-0067",
      "mode": "finalize",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "finalize",
        "019-finalize-0067",
        "67"
      ],
      "actual_argv": [
        ".claude/skills/ld-s10y-lesson/.venv/bin/python",
        "-B",
        ".claude/skills/ld-s10y-lesson/tools/p2c.py",
        "finalize",
        "--book",
        "9-10g",
        "--page",
        "67"
      ],
      "started_at": "2026-11-16T12:59:52.022Z",
      "wrapper_sha256": "18b20d03851ba3924a435940eaa693754235196213d001110b1680176651e79b"
    },
    "result": {
      "id": "019-finalize-0067",
      "mode": "finalize",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "finalize",
        "019-finalize-0067",
        "67"
      ],
      "actual_argv": [
        ".claude/skills/ld-s10y-lesson/.venv/bin/python",
        "-B",
        ".claude/skills/ld-s10y-lesson/tools/p2c.py",
        "finalize",
        "--book",
        "9-10g",
        "--page",
        "67"
      ],
      "started_at": "2026-11-16T12:59:52.022Z",
      "wrapper_sha256": "18b20d03851ba3924a435940eaa693754235196213d001110b1680176651e79b",
      "ended_at": "2026-11-16T12:59:52.631Z",
      "exit_code": 0,
      "signal": null,
      "error": null,
      "stdout_sha256": "f33d8e2ed865c99dba761426abc4bcc21b88d515bd533ad129864280a93cc4ac",
      "stderr_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    "stdout": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/019-finalize-0067/stdout.raw",
      "bytes": 178,
      "sha256": "f33d8e2ed865c99dba761426abc4bcc21b88d515bd533ad129864280a93cc4ac"
    },
    "stderr": {
      "path": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/019-finalize-0067/stderr.raw",
      "bytes": 0,
      "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
  },
  {
    "directory": "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/commands/020-package",
    "start": {
      "id": "020-package",
      "mode": "run",
      "cwd": "/Users/yong/.codex/worktrees/a07e/lemmadeck",
      "wrapper_argv": [
        "/Users/yong/.local/opt/node-v24.16.0/bin/node",
        "/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/audit-runner.mjs",
        "run",
        "020-package",
        "node",
        ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/package.mjs"
      ],
      "actual_argv": [
        "node",
        ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p66-p67-author-evidence/package.mjs"
      ],
      "started_at": "2026-11-16T13:02:24.319Z",
      "wrapper_sha256": "18b20d03851ba3924a435940eaa693754235196213d001110b1680176651e79b"
    },
    "result": null,
    "stdout": null,
    "stderr": null
  }
]
```

## Physical66: Full raw authored page
```markdown
---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9-10g",
  "page": 66,
  "printed_page": 59,
  "source": {
    "pdf": "9-10g 苏联十年制学校数学教材 几何 9-10年级.pdf",
    "pdf_sha256": "1900be5207d00404f64e5a40ab855fbfb8495bd2a06c5ce295ae0e145444578a",
    "pdf_page": 66
  },
  "render": {
    "dpi": 300,
    "w": 1506,
    "h": 2126,
    "sha256": "c3c1ace7c4dd3a9ceb5e0d6f1250982218eb95894e3825e8bc2b2135e17c21b4"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "本页首行承接上页第174题的“经”，并在本行句点处闭合。第175—178题均由本页像素确认，未由目录推断。",
    "本页印有§18标题，才据目录认领geo910-c1-s2-n18；此前习题归§17。",
    "证明中的向量映射公式在a(M)后实际换行，使用↵保留断点；证明在图71后跨页继续。",
    "图71归§18定理9证明，不归练习；手写点标下标及重叠箭头局部磨损，按原像素保留。图中独立b标上未确认箭头，UNKNOWN，不补画。",
    "未使用计行排除、人工行数覆盖或数学勘误；边缘孤立墨迹不补为文字。"
  ],
  "errata": [],
  "source_emphasis": [
    {"block": "p0066#6", "span": "§18. 向量的加法", "style": "bold", "basis": "本页源像素"},
    {"block": "p0066#8", "span": "定理9. 两个向量的合成是向量.", "style": "bold", "basis": "本页源像素"},
    {"blocks": ["p0066#1", "p0066#2", "p0066#3", "p0066#4", "p0066#5", "p0066#7", "p0066#9", "p0066#11", "p0066#12"], "span": "UNKNOWN", "style": "UNKNOWN"}
  ]
}
---

<!-- ex 174 cont -->
过怎样的位移后，这两条射线中的一条映射成另一条.

<!-- ex 175 -->
175. 已知两个平面是：1）平行的；2）相交的，是否存
在向量将两个平面中的一个映射成另一个.

<!-- ex 176 -->
176. 证明：平行六面体相对的两个面合同.

<!-- ex 177 -->
177. 证明：如果三角形所在的平面和投影平面平行，那
么三角形和它在投影平面的射影合同.

<!-- ex 178 -->
178. 已知平行六面体 $ABCDA_1B_1C_1D_1$. 证明下列每两
个角合同：1）$\angle BC_1C$，$\angle AD_1D$；2）$\angle CBD_1$，$\angle AD_1B$；3）
$\angle ADC$，$\angle A_1B_1C_1$.

<!-- h3 -->
§18. 向量的加法

<!-- p -->
我们首先研究一个定理，再根据它引入两个向量的和的
概念.

<!-- p -->
定理9. 两个向量的合成是向量.

<!-- p open -->
证明. 假设已知两个向量 $\vec a$ 和 $\vec b$. 证明它们的合成也是
一个向量. 研究两个任意的不相同的点 $M$ 和 $N$. 有：$\vec a(M)↵=M_1$，$\vec a(N)=N_1$，$\vec b(M_1)=M_2$，$\vec b(N_1)=N_2$（图 71）.

<!-- fig 图 71 box 390,1435,630,410 -->

<!-- cap 图 71 -->
图 71

<!-- foot -->
$\bullet$ 59 $\bullet$

```
## Physical66: Full finalized page
```markdown
---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9-10g",
  "page": 66,
  "printed_page": 59,
  "source": {
    "pdf": "9-10g 苏联十年制学校数学教材 几何 9-10年级.pdf",
    "pdf_sha256": "1900be5207d00404f64e5a40ab855fbfb8495bd2a06c5ce295ae0e145444578a",
    "pdf_page": 66
  },
  "render": {
    "dpi": 300,
    "w": 1506,
    "h": 2126,
    "sha256": "c3c1ace7c4dd3a9ceb5e0d6f1250982218eb95894e3825e8bc2b2135e17c21b4"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "本页首行承接上页第174题的“经”，并在本行句点处闭合。第175—178题均由本页像素确认，未由目录推断。",
    "本页印有§18标题，才据目录认领geo910-c1-s2-n18；此前习题归§17。",
    "证明中的向量映射公式在a(M)后实际换行，使用↵保留断点；证明在图71后跨页继续。",
    "图71归§18定理9证明，不归练习；手写点标下标及重叠箭头局部磨损，按原像素保留。图中独立b标上未确认箭头，UNKNOWN，不补画。",
    "未使用计行排除、人工行数覆盖或数学勘误；边缘孤立墨迹不补为文字。"
  ],
  "errata": [],
  "source_emphasis": [
    {
      "block": "p0066#6",
      "span": "§18. 向量的加法",
      "style": "bold",
      "basis": "本页源像素"
    },
    {
      "block": "p0066#8",
      "span": "定理9. 两个向量的合成是向量.",
      "style": "bold",
      "basis": "本页源像素"
    },
    {
      "blocks": [
        "p0066#1",
        "p0066#2",
        "p0066#3",
        "p0066#4",
        "p0066#5",
        "p0066#7",
        "p0066#9",
        "p0066#11",
        "p0066#12"
      ],
      "span": "UNKNOWN",
      "style": "UNKNOWN"
    }
  ],
  "printed_lines": 18,
  "figures": [
    {
      "id": "fig-71",
      "label": "图 71",
      "box": [
        396,
        1443,
        623,
        392
      ]
    }
  ],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- ex 174 cont -->
过怎样的位移后，这两条射线中的一条映射成另一条.

<!-- ex 175 -->
175. 已知两个平面是：1）平行的；2）相交的，是否存
在向量将两个平面中的一个映射成另一个.

<!-- ex 176 -->
176. 证明：平行六面体相对的两个面合同.

<!-- ex 177 -->
177. 证明：如果三角形所在的平面和投影平面平行，那
么三角形和它在投影平面的射影合同.

<!-- ex 178 -->
178. 已知平行六面体 $ABCDA_1B_1C_1D_1$. 证明下列每两
个角合同：1）$\angle BC_1C$，$\angle AD_1D$；2）$\angle CBD_1$，$\angle AD_1B$；3）
$\angle ADC$，$\angle A_1B_1C_1$.

<!-- h3 -->
§18. 向量的加法

<!-- p -->
我们首先研究一个定理，再根据它引入两个向量的和的
概念.

<!-- p -->
定理9. 两个向量的合成是向量.

<!-- p open -->
证明. 假设已知两个向量 $\vec a$ 和 $\vec b$. 证明它们的合成也是
一个向量. 研究两个任意的不相同的点 $M$ 和 $N$. 有：$\vec a(M)↵=M_1$，$\vec a(N)=N_1$，$\vec b(M_1)=M_2$，$\vec b(N_1)=N_2$（图 71）.

<!-- fig 图 71 box 396,1443,623,392 -->
![图 71](figures/fig-71.png)

<!-- cap 图 71 -->
图 71

<!-- foot -->
$\bullet$ 59 $\bullet$

```
## Physical66: All blocks, rows, row ends, math, audit
```json
{
  "metadata": {
    "schema": "ld-s10y-lesson/page@3",
    "book": "9-10g",
    "page": 66,
    "printed_page": 59,
    "source": {
      "pdf": "9-10g 苏联十年制学校数学教材 几何 9-10年级.pdf",
      "pdf_sha256": "1900be5207d00404f64e5a40ab855fbfb8495bd2a06c5ce295ae0e145444578a",
      "pdf_page": 66
    },
    "render": {
      "dpi": 300,
      "w": 1506,
      "h": 2126,
      "sha256": "c3c1ace7c4dd3a9ceb5e0d6f1250982218eb95894e3825e8bc2b2135e17c21b4"
    },
    "profile": {
      "id": "soviet-cn",
      "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
    },
    "notes": [
      "本页首行承接上页第174题的“经”，并在本行句点处闭合。第175—178题均由本页像素确认，未由目录推断。",
      "本页印有§18标题，才据目录认领geo910-c1-s2-n18；此前习题归§17。",
      "证明中的向量映射公式在a(M)后实际换行，使用↵保留断点；证明在图71后跨页继续。",
      "图71归§18定理9证明，不归练习；手写点标下标及重叠箭头局部磨损，按原像素保留。图中独立b标上未确认箭头，UNKNOWN，不补画。",
      "未使用计行排除、人工行数覆盖或数学勘误；边缘孤立墨迹不补为文字。"
    ],
    "errata": [],
    "source_emphasis": [
      {
        "block": "p0066#6",
        "span": "§18. 向量的加法",
        "style": "bold",
        "basis": "本页源像素"
      },
      {
        "block": "p0066#8",
        "span": "定理9. 两个向量的合成是向量.",
        "style": "bold",
        "basis": "本页源像素"
      },
      {
        "blocks": [
          "p0066#1",
          "p0066#2",
          "p0066#3",
          "p0066#4",
          "p0066#5",
          "p0066#7",
          "p0066#9",
          "p0066#11",
          "p0066#12"
        ],
        "span": "UNKNOWN",
        "style": "UNKNOWN"
      }
    ],
    "printed_lines": 18,
    "figures": [
      {
        "id": "fig-71",
        "label": "图 71",
        "box": [
          396,
          1443,
          623,
          392
        ]
      }
    ],
    "provenance": {
      "cap": "1",
      "normalized": true
    }
  },
  "full_final_blocks": [
    {
      "block_ref": "p0066#1",
      "kind": "ex",
      "label": "174",
      "box": null,
      "owner_exercise": null,
      "cont": true,
      "open": false,
      "samerow": false,
      "lines": [
        "过怎样的位移后，这两条射线中的一条映射成另一条."
      ],
      "physical_rows": [
        {
          "ordinal": 1,
          "block_ref": "p0066#1",
          "kind": "ex",
          "label": "174",
          "cont": true,
          "open": false,
          "samerow": false,
          "text": "过怎样的位移后，这两条射线中的一条映射成另一条.",
          "final_codepoints": [
            "过",
            "怎",
            "样",
            "的",
            "位",
            "移",
            "后",
            "，",
            "这",
            "两",
            "条",
            "射",
            "线",
            "中",
            "的",
            "一",
            "条",
            "映",
            "射",
            "成",
            "另",
            "一",
            "条",
            "."
          ],
          "trailing_ascii_spaces": 0
        }
      ]
    },
    {
      "block_ref": "p0066#2",
      "kind": "ex",
      "label": "175",
      "box": null,
      "owner_exercise": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "lines": [
        "175. 已知两个平面是：1）平行的；2）相交的，是否存",
        "在向量将两个平面中的一个映射成另一个."
      ],
      "physical_rows": [
        {
          "ordinal": 2,
          "block_ref": "p0066#2",
          "kind": "ex",
          "label": "175",
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "175. 已知两个平面是：1）平行的；2）相交的，是否存",
          "final_codepoints": [
            " ",
            "已",
            "知",
            "两",
            "个",
            "平",
            "面",
            "是",
            "：",
            "1",
            "）",
            "平",
            "行",
            "的",
            "；",
            "2",
            "）",
            "相",
            "交",
            "的",
            "，",
            "是",
            "否",
            "存"
          ],
          "trailing_ascii_spaces": 0
        },
        {
          "ordinal": 3,
          "block_ref": "p0066#2",
          "kind": "ex",
          "label": "175",
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "在向量将两个平面中的一个映射成另一个.",
          "final_codepoints": [
            "在",
            "向",
            "量",
            "将",
            "两",
            "个",
            "平",
            "面",
            "中",
            "的",
            "一",
            "个",
            "映",
            "射",
            "成",
            "另",
            "一",
            "个",
            "."
          ],
          "trailing_ascii_spaces": 0
        }
      ]
    },
    {
      "block_ref": "p0066#3",
      "kind": "ex",
      "label": "176",
      "box": null,
      "owner_exercise": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "lines": [
        "176. 证明：平行六面体相对的两个面合同."
      ],
      "physical_rows": [
        {
          "ordinal": 4,
          "block_ref": "p0066#3",
          "kind": "ex",
          "label": "176",
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "176. 证明：平行六面体相对的两个面合同.",
          "final_codepoints": [
            "1",
            "7",
            "6",
            ".",
            " ",
            "证",
            "明",
            "：",
            "平",
            "行",
            "六",
            "面",
            "体",
            "相",
            "对",
            "的",
            "两",
            "个",
            "面",
            "合",
            "同",
            "."
          ],
          "trailing_ascii_spaces": 0
        }
      ]
    },
    {
      "block_ref": "p0066#4",
      "kind": "ex",
      "label": "177",
      "box": null,
      "owner_exercise": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "lines": [
        "177. 证明：如果三角形所在的平面和投影平面平行，那",
        "么三角形和它在投影平面的射影合同."
      ],
      "physical_rows": [
        {
          "ordinal": 5,
          "block_ref": "p0066#4",
          "kind": "ex",
          "label": "177",
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "177. 证明：如果三角形所在的平面和投影平面平行，那",
          "final_codepoints": [
            ".",
            " ",
            "证",
            "明",
            "：",
            "如",
            "果",
            "三",
            "角",
            "形",
            "所",
            "在",
            "的",
            "平",
            "面",
            "和",
            "投",
            "影",
            "平",
            "面",
            "平",
            "行",
            "，",
            "那"
          ],
          "trailing_ascii_spaces": 0
        },
        {
          "ordinal": 6,
          "block_ref": "p0066#4",
          "kind": "ex",
          "label": "177",
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "么三角形和它在投影平面的射影合同.",
          "final_codepoints": [
            "么",
            "三",
            "角",
            "形",
            "和",
            "它",
            "在",
            "投",
            "影",
            "平",
            "面",
            "的",
            "射",
            "影",
            "合",
            "同",
            "."
          ],
          "trailing_ascii_spaces": 0
        }
      ]
    },
    {
      "block_ref": "p0066#5",
      "kind": "ex",
      "label": "178",
      "box": null,
      "owner_exercise": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "lines": [
        "178. 已知平行六面体 $ABCDA_1B_1C_1D_1$. 证明下列每两",
        "个角合同：1）$\\angle BC_1C$，$\\angle AD_1D$；2）$\\angle CBD_1$，$\\angle AD_1B$；3）",
        "$\\angle ADC$，$\\angle A_1B_1C_1$."
      ],
      "physical_rows": [
        {
          "ordinal": 7,
          "block_ref": "p0066#5",
          "kind": "ex",
          "label": "178",
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "178. 已知平行六面体 $ABCDA_1B_1C_1D_1$. 证明下列每两",
          "final_codepoints": [
            "B",
            "C",
            "D",
            "A",
            "_",
            "1",
            "B",
            "_",
            "1",
            "C",
            "_",
            "1",
            "D",
            "_",
            "1",
            "$",
            ".",
            " ",
            "证",
            "明",
            "下",
            "列",
            "每",
            "两"
          ],
          "trailing_ascii_spaces": 0
        },
        {
          "ordinal": 8,
          "block_ref": "p0066#5",
          "kind": "ex",
          "label": "178",
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "个角合同：1）$\\angle BC_1C$，$\\angle AD_1D$；2）$\\angle CBD_1$，$\\angle AD_1B$；3）",
          "final_codepoints": [
            "C",
            "B",
            "D",
            "_",
            "1",
            "$",
            "，",
            "$",
            "\\",
            "a",
            "n",
            "g",
            "l",
            "e",
            " ",
            "A",
            "D",
            "_",
            "1",
            "B",
            "$",
            "；",
            "3",
            "）"
          ],
          "trailing_ascii_spaces": 0
        },
        {
          "ordinal": 9,
          "block_ref": "p0066#5",
          "kind": "ex",
          "label": "178",
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "$\\angle ADC$，$\\angle A_1B_1C_1$.",
          "final_codepoints": [
            "A",
            "D",
            "C",
            "$",
            "，",
            "$",
            "\\",
            "a",
            "n",
            "g",
            "l",
            "e",
            " ",
            "A",
            "_",
            "1",
            "B",
            "_",
            "1",
            "C",
            "_",
            "1",
            "$",
            "."
          ],
          "trailing_ascii_spaces": 0
        }
      ]
    },
    {
      "block_ref": "p0066#6",
      "kind": "h3",
      "label": null,
      "box": null,
      "owner_exercise": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "lines": [
        "§18. 向量的加法"
      ],
      "physical_rows": [
        {
          "ordinal": 10,
          "block_ref": "p0066#6",
          "kind": "h3",
          "label": null,
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "§18. 向量的加法",
          "final_codepoints": [
            "§",
            "1",
            "8",
            ".",
            " ",
            "向",
            "量",
            "的",
            "加",
            "法"
          ],
          "trailing_ascii_spaces": 0
        }
      ]
    },
    {
      "block_ref": "p0066#7",
      "kind": "p",
      "label": null,
      "box": null,
      "owner_exercise": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "lines": [
        "我们首先研究一个定理，再根据它引入两个向量的和的",
        "概念."
      ],
      "physical_rows": [
        {
          "ordinal": 11,
          "block_ref": "p0066#7",
          "kind": "p",
          "label": null,
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "我们首先研究一个定理，再根据它引入两个向量的和的",
          "final_codepoints": [
            "我",
            "们",
            "首",
            "先",
            "研",
            "究",
            "一",
            "个",
            "定",
            "理",
            "，",
            "再",
            "根",
            "据",
            "它",
            "引",
            "入",
            "两",
            "个",
            "向",
            "量",
            "的",
            "和",
            "的"
          ],
          "trailing_ascii_spaces": 0
        },
        {
          "ordinal": 12,
          "block_ref": "p0066#7",
          "kind": "p",
          "label": null,
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "概念.",
          "final_codepoints": [
            "概",
            "念",
            "."
          ],
          "trailing_ascii_spaces": 0
        }
      ]
    },
    {
      "block_ref": "p0066#8",
      "kind": "p",
      "label": null,
      "box": null,
      "owner_exercise": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "lines": [
        "定理9. 两个向量的合成是向量."
      ],
      "physical_rows": [
        {
          "ordinal": 13,
          "block_ref": "p0066#8",
          "kind": "p",
          "label": null,
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "定理9. 两个向量的合成是向量.",
          "final_codepoints": [
            "定",
            "理",
            "9",
            ".",
            " ",
            "两",
            "个",
            "向",
            "量",
            "的",
            "合",
            "成",
            "是",
            "向",
            "量",
            "."
          ],
          "trailing_ascii_spaces": 0
        }
      ]
    },
    {
      "block_ref": "p0066#9",
      "kind": "p",
      "label": null,
      "box": null,
      "owner_exercise": null,
      "cont": false,
      "open": true,
      "samerow": false,
      "lines": [
        "证明. 假设已知两个向量 $\\vec a$ 和 $\\vec b$. 证明它们的合成也是",
        "一个向量. 研究两个任意的不相同的点 $M$ 和 $N$. 有：$\\vec a(M)↵=M_1$，$\\vec a(N)=N_1$，$\\vec b(M_1)=M_2$，$\\vec b(N_1)=N_2$（图 71）."
      ],
      "physical_rows": [
        {
          "ordinal": 14,
          "block_ref": "p0066#9",
          "kind": "p",
          "label": null,
          "cont": false,
          "open": true,
          "samerow": false,
          "text": "证明. 假设已知两个向量 $\\vec a$ 和 $\\vec b$. 证明它们的合成也是",
          "final_codepoints": [
            "a",
            "$",
            " ",
            "和",
            " ",
            "$",
            "\\",
            "v",
            "e",
            "c",
            " ",
            "b",
            "$",
            ".",
            " ",
            "证",
            "明",
            "它",
            "们",
            "的",
            "合",
            "成",
            "也",
            "是"
          ],
          "trailing_ascii_spaces": 0
        },
        {
          "ordinal": 15,
          "block_ref": "p0066#9",
          "kind": "p",
          "label": null,
          "cont": false,
          "open": true,
          "samerow": false,
          "text": "一个向量. 研究两个任意的不相同的点 $M$ 和 $N$. 有：$\\vec a(M)",
          "final_codepoints": [
            " ",
            "$",
            "M",
            "$",
            " ",
            "和",
            " ",
            "$",
            "N",
            "$",
            ".",
            " ",
            "有",
            "：",
            "$",
            "\\",
            "v",
            "e",
            "c",
            " ",
            "a",
            "(",
            "M",
            ")"
          ],
          "trailing_ascii_spaces": 0
        },
        {
          "ordinal": 16,
          "block_ref": "p0066#9",
          "kind": "p",
          "label": null,
          "cont": false,
          "open": true,
          "samerow": false,
          "text": "=M_1$，$\\vec a(N)=N_1$，$\\vec b(M_1)=M_2$，$\\vec b(N_1)=N_2$（图 71）.",
          "final_codepoints": [
            "$",
            "\\",
            "v",
            "e",
            "c",
            " ",
            "b",
            "(",
            "N",
            "_",
            "1",
            ")",
            "=",
            "N",
            "_",
            "2",
            "$",
            "（",
            "图",
            " ",
            "7",
            "1",
            "）",
            "."
          ],
          "trailing_ascii_spaces": 0
        }
      ]
    },
    {
      "block_ref": "p0066#10",
      "kind": "fig",
      "label": "图 71",
      "box": [
        396,
        1443,
        623,
        392
      ],
      "owner_exercise": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "lines": [],
      "id": "fig-71",
      "physical_rows": []
    },
    {
      "block_ref": "p0066#11",
      "kind": "cap",
      "label": "图 71",
      "box": null,
      "owner_exercise": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "lines": [
        "图 71"
      ],
      "physical_rows": [
        {
          "ordinal": 17,
          "block_ref": "p0066#11",
          "kind": "cap",
          "label": "图 71",
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "图 71",
          "final_codepoints": [
            "图",
            " ",
            "7",
            "1"
          ],
          "trailing_ascii_spaces": 0
        }
      ]
    },
    {
      "block_ref": "p0066#12",
      "kind": "foot",
      "label": null,
      "box": null,
      "owner_exercise": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "lines": [
        "$\\bullet$ 59 $\\bullet$"
      ],
      "physical_rows": [
        {
          "ordinal": 18,
          "block_ref": "p0066#12",
          "kind": "foot",
          "label": null,
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "$\\bullet$ 59 $\\bullet$",
          "final_codepoints": [
            "$",
            "\\",
            "b",
            "u",
            "l",
            "l",
            "e",
            "t",
            "$",
            " ",
            "5",
            "9",
            " ",
            "$",
            "\\",
            "b",
            "u",
            "l",
            "l",
            "e",
            "t",
            "$"
          ],
          "trailing_ascii_spaces": 0
        }
      ]
    }
  ],
  "full_physical_rows": [
    {
      "ordinal": 1,
      "block_ref": "p0066#1",
      "kind": "ex",
      "label": "174",
      "cont": true,
      "open": false,
      "samerow": false,
      "text": "过怎样的位移后，这两条射线中的一条映射成另一条.",
      "final_codepoints": [
        "过",
        "怎",
        "样",
        "的",
        "位",
        "移",
        "后",
        "，",
        "这",
        "两",
        "条",
        "射",
        "线",
        "中",
        "的",
        "一",
        "条",
        "映",
        "射",
        "成",
        "另",
        "一",
        "条",
        "."
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 2,
      "block_ref": "p0066#2",
      "kind": "ex",
      "label": "175",
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "175. 已知两个平面是：1）平行的；2）相交的，是否存",
      "final_codepoints": [
        " ",
        "已",
        "知",
        "两",
        "个",
        "平",
        "面",
        "是",
        "：",
        "1",
        "）",
        "平",
        "行",
        "的",
        "；",
        "2",
        "）",
        "相",
        "交",
        "的",
        "，",
        "是",
        "否",
        "存"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 3,
      "block_ref": "p0066#2",
      "kind": "ex",
      "label": "175",
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "在向量将两个平面中的一个映射成另一个.",
      "final_codepoints": [
        "在",
        "向",
        "量",
        "将",
        "两",
        "个",
        "平",
        "面",
        "中",
        "的",
        "一",
        "个",
        "映",
        "射",
        "成",
        "另",
        "一",
        "个",
        "."
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 4,
      "block_ref": "p0066#3",
      "kind": "ex",
      "label": "176",
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "176. 证明：平行六面体相对的两个面合同.",
      "final_codepoints": [
        "1",
        "7",
        "6",
        ".",
        " ",
        "证",
        "明",
        "：",
        "平",
        "行",
        "六",
        "面",
        "体",
        "相",
        "对",
        "的",
        "两",
        "个",
        "面",
        "合",
        "同",
        "."
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 5,
      "block_ref": "p0066#4",
      "kind": "ex",
      "label": "177",
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "177. 证明：如果三角形所在的平面和投影平面平行，那",
      "final_codepoints": [
        ".",
        " ",
        "证",
        "明",
        "：",
        "如",
        "果",
        "三",
        "角",
        "形",
        "所",
        "在",
        "的",
        "平",
        "面",
        "和",
        "投",
        "影",
        "平",
        "面",
        "平",
        "行",
        "，",
        "那"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 6,
      "block_ref": "p0066#4",
      "kind": "ex",
      "label": "177",
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "么三角形和它在投影平面的射影合同.",
      "final_codepoints": [
        "么",
        "三",
        "角",
        "形",
        "和",
        "它",
        "在",
        "投",
        "影",
        "平",
        "面",
        "的",
        "射",
        "影",
        "合",
        "同",
        "."
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 7,
      "block_ref": "p0066#5",
      "kind": "ex",
      "label": "178",
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "178. 已知平行六面体 $ABCDA_1B_1C_1D_1$. 证明下列每两",
      "final_codepoints": [
        "B",
        "C",
        "D",
        "A",
        "_",
        "1",
        "B",
        "_",
        "1",
        "C",
        "_",
        "1",
        "D",
        "_",
        "1",
        "$",
        ".",
        " ",
        "证",
        "明",
        "下",
        "列",
        "每",
        "两"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 8,
      "block_ref": "p0066#5",
      "kind": "ex",
      "label": "178",
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "个角合同：1）$\\angle BC_1C$，$\\angle AD_1D$；2）$\\angle CBD_1$，$\\angle AD_1B$；3）",
      "final_codepoints": [
        "C",
        "B",
        "D",
        "_",
        "1",
        "$",
        "，",
        "$",
        "\\",
        "a",
        "n",
        "g",
        "l",
        "e",
        " ",
        "A",
        "D",
        "_",
        "1",
        "B",
        "$",
        "；",
        "3",
        "）"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 9,
      "block_ref": "p0066#5",
      "kind": "ex",
      "label": "178",
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "$\\angle ADC$，$\\angle A_1B_1C_1$.",
      "final_codepoints": [
        "A",
        "D",
        "C",
        "$",
        "，",
        "$",
        "\\",
        "a",
        "n",
        "g",
        "l",
        "e",
        " ",
        "A",
        "_",
        "1",
        "B",
        "_",
        "1",
        "C",
        "_",
        "1",
        "$",
        "."
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 10,
      "block_ref": "p0066#6",
      "kind": "h3",
      "label": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "§18. 向量的加法",
      "final_codepoints": [
        "§",
        "1",
        "8",
        ".",
        " ",
        "向",
        "量",
        "的",
        "加",
        "法"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 11,
      "block_ref": "p0066#7",
      "kind": "p",
      "label": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "我们首先研究一个定理，再根据它引入两个向量的和的",
      "final_codepoints": [
        "我",
        "们",
        "首",
        "先",
        "研",
        "究",
        "一",
        "个",
        "定",
        "理",
        "，",
        "再",
        "根",
        "据",
        "它",
        "引",
        "入",
        "两",
        "个",
        "向",
        "量",
        "的",
        "和",
        "的"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 12,
      "block_ref": "p0066#7",
      "kind": "p",
      "label": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "概念.",
      "final_codepoints": [
        "概",
        "念",
        "."
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 13,
      "block_ref": "p0066#8",
      "kind": "p",
      "label": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "定理9. 两个向量的合成是向量.",
      "final_codepoints": [
        "定",
        "理",
        "9",
        ".",
        " ",
        "两",
        "个",
        "向",
        "量",
        "的",
        "合",
        "成",
        "是",
        "向",
        "量",
        "."
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 14,
      "block_ref": "p0066#9",
      "kind": "p",
      "label": null,
      "cont": false,
      "open": true,
      "samerow": false,
      "text": "证明. 假设已知两个向量 $\\vec a$ 和 $\\vec b$. 证明它们的合成也是",
      "final_codepoints": [
        "a",
        "$",
        " ",
        "和",
        " ",
        "$",
        "\\",
        "v",
        "e",
        "c",
        " ",
        "b",
        "$",
        ".",
        " ",
        "证",
        "明",
        "它",
        "们",
        "的",
        "合",
        "成",
        "也",
        "是"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 15,
      "block_ref": "p0066#9",
      "kind": "p",
      "label": null,
      "cont": false,
      "open": true,
      "samerow": false,
      "text": "一个向量. 研究两个任意的不相同的点 $M$ 和 $N$. 有：$\\vec a(M)",
      "final_codepoints": [
        " ",
        "$",
        "M",
        "$",
        " ",
        "和",
        " ",
        "$",
        "N",
        "$",
        ".",
        " ",
        "有",
        "：",
        "$",
        "\\",
        "v",
        "e",
        "c",
        " ",
        "a",
        "(",
        "M",
        ")"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 16,
      "block_ref": "p0066#9",
      "kind": "p",
      "label": null,
      "cont": false,
      "open": true,
      "samerow": false,
      "text": "=M_1$，$\\vec a(N)=N_1$，$\\vec b(M_1)=M_2$，$\\vec b(N_1)=N_2$（图 71）.",
      "final_codepoints": [
        "$",
        "\\",
        "v",
        "e",
        "c",
        " ",
        "b",
        "(",
        "N",
        "_",
        "1",
        ")",
        "=",
        "N",
        "_",
        "2",
        "$",
        "（",
        "图",
        " ",
        "7",
        "1",
        "）",
        "."
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 17,
      "block_ref": "p0066#11",
      "kind": "cap",
      "label": "图 71",
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "图 71",
      "final_codepoints": [
        "图",
        " ",
        "7",
        "1"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 18,
      "block_ref": "p0066#12",
      "kind": "foot",
      "label": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "$\\bullet$ 59 $\\bullet$",
      "final_codepoints": [
        "$",
        "\\",
        "b",
        "u",
        "l",
        "l",
        "e",
        "t",
        "$",
        " ",
        "5",
        "9",
        " ",
        "$",
        "\\",
        "b",
        "u",
        "l",
        "l",
        "e",
        "t",
        "$"
      ],
      "trailing_ascii_spaces": 0
    }
  ],
  "full_row_ends": [
    {
      "ordinal": 1,
      "block_ref": "p0066#1",
      "text": "过怎样的位移后，这两条射线中的一条映射成另一条.",
      "last24_codepoints": [
        "过",
        "怎",
        "样",
        "的",
        "位",
        "移",
        "后",
        "，",
        "这",
        "两",
        "条",
        "射",
        "线",
        "中",
        "的",
        "一",
        "条",
        "映",
        "射",
        "成",
        "另",
        "一",
        "条",
        "."
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 2,
      "block_ref": "p0066#2",
      "text": "175. 已知两个平面是：1）平行的；2）相交的，是否存",
      "last24_codepoints": [
        " ",
        "已",
        "知",
        "两",
        "个",
        "平",
        "面",
        "是",
        "：",
        "1",
        "）",
        "平",
        "行",
        "的",
        "；",
        "2",
        "）",
        "相",
        "交",
        "的",
        "，",
        "是",
        "否",
        "存"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 3,
      "block_ref": "p0066#2",
      "text": "在向量将两个平面中的一个映射成另一个.",
      "last24_codepoints": [
        "在",
        "向",
        "量",
        "将",
        "两",
        "个",
        "平",
        "面",
        "中",
        "的",
        "一",
        "个",
        "映",
        "射",
        "成",
        "另",
        "一",
        "个",
        "."
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 4,
      "block_ref": "p0066#3",
      "text": "176. 证明：平行六面体相对的两个面合同.",
      "last24_codepoints": [
        "1",
        "7",
        "6",
        ".",
        " ",
        "证",
        "明",
        "：",
        "平",
        "行",
        "六",
        "面",
        "体",
        "相",
        "对",
        "的",
        "两",
        "个",
        "面",
        "合",
        "同",
        "."
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 5,
      "block_ref": "p0066#4",
      "text": "177. 证明：如果三角形所在的平面和投影平面平行，那",
      "last24_codepoints": [
        ".",
        " ",
        "证",
        "明",
        "：",
        "如",
        "果",
        "三",
        "角",
        "形",
        "所",
        "在",
        "的",
        "平",
        "面",
        "和",
        "投",
        "影",
        "平",
        "面",
        "平",
        "行",
        "，",
        "那"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 6,
      "block_ref": "p0066#4",
      "text": "么三角形和它在投影平面的射影合同.",
      "last24_codepoints": [
        "么",
        "三",
        "角",
        "形",
        "和",
        "它",
        "在",
        "投",
        "影",
        "平",
        "面",
        "的",
        "射",
        "影",
        "合",
        "同",
        "."
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 7,
      "block_ref": "p0066#5",
      "text": "178. 已知平行六面体 $ABCDA_1B_1C_1D_1$. 证明下列每两",
      "last24_codepoints": [
        "B",
        "C",
        "D",
        "A",
        "_",
        "1",
        "B",
        "_",
        "1",
        "C",
        "_",
        "1",
        "D",
        "_",
        "1",
        "$",
        ".",
        " ",
        "证",
        "明",
        "下",
        "列",
        "每",
        "两"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 8,
      "block_ref": "p0066#5",
      "text": "个角合同：1）$\\angle BC_1C$，$\\angle AD_1D$；2）$\\angle CBD_1$，$\\angle AD_1B$；3）",
      "last24_codepoints": [
        "C",
        "B",
        "D",
        "_",
        "1",
        "$",
        "，",
        "$",
        "\\",
        "a",
        "n",
        "g",
        "l",
        "e",
        " ",
        "A",
        "D",
        "_",
        "1",
        "B",
        "$",
        "；",
        "3",
        "）"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 9,
      "block_ref": "p0066#5",
      "text": "$\\angle ADC$，$\\angle A_1B_1C_1$.",
      "last24_codepoints": [
        "A",
        "D",
        "C",
        "$",
        "，",
        "$",
        "\\",
        "a",
        "n",
        "g",
        "l",
        "e",
        " ",
        "A",
        "_",
        "1",
        "B",
        "_",
        "1",
        "C",
        "_",
        "1",
        "$",
        "."
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 10,
      "block_ref": "p0066#6",
      "text": "§18. 向量的加法",
      "last24_codepoints": [
        "§",
        "1",
        "8",
        ".",
        " ",
        "向",
        "量",
        "的",
        "加",
        "法"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 11,
      "block_ref": "p0066#7",
      "text": "我们首先研究一个定理，再根据它引入两个向量的和的",
      "last24_codepoints": [
        "我",
        "们",
        "首",
        "先",
        "研",
        "究",
        "一",
        "个",
        "定",
        "理",
        "，",
        "再",
        "根",
        "据",
        "它",
        "引",
        "入",
        "两",
        "个",
        "向",
        "量",
        "的",
        "和",
        "的"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 12,
      "block_ref": "p0066#7",
      "text": "概念.",
      "last24_codepoints": [
        "概",
        "念",
        "."
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 13,
      "block_ref": "p0066#8",
      "text": "定理9. 两个向量的合成是向量.",
      "last24_codepoints": [
        "定",
        "理",
        "9",
        ".",
        " ",
        "两",
        "个",
        "向",
        "量",
        "的",
        "合",
        "成",
        "是",
        "向",
        "量",
        "."
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 14,
      "block_ref": "p0066#9",
      "text": "证明. 假设已知两个向量 $\\vec a$ 和 $\\vec b$. 证明它们的合成也是",
      "last24_codepoints": [
        "a",
        "$",
        " ",
        "和",
        " ",
        "$",
        "\\",
        "v",
        "e",
        "c",
        " ",
        "b",
        "$",
        ".",
        " ",
        "证",
        "明",
        "它",
        "们",
        "的",
        "合",
        "成",
        "也",
        "是"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 15,
      "block_ref": "p0066#9",
      "text": "一个向量. 研究两个任意的不相同的点 $M$ 和 $N$. 有：$\\vec a(M)",
      "last24_codepoints": [
        " ",
        "$",
        "M",
        "$",
        " ",
        "和",
        " ",
        "$",
        "N",
        "$",
        ".",
        " ",
        "有",
        "：",
        "$",
        "\\",
        "v",
        "e",
        "c",
        " ",
        "a",
        "(",
        "M",
        ")"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 16,
      "block_ref": "p0066#9",
      "text": "=M_1$，$\\vec a(N)=N_1$，$\\vec b(M_1)=M_2$，$\\vec b(N_1)=N_2$（图 71）.",
      "last24_codepoints": [
        "$",
        "\\",
        "v",
        "e",
        "c",
        " ",
        "b",
        "(",
        "N",
        "_",
        "1",
        ")",
        "=",
        "N",
        "_",
        "2",
        "$",
        "（",
        "图",
        " ",
        "7",
        "1",
        "）",
        "."
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 17,
      "block_ref": "p0066#11",
      "text": "图 71",
      "last24_codepoints": [
        "图",
        " ",
        "7",
        "1"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 18,
      "block_ref": "p0066#12",
      "text": "$\\bullet$ 59 $\\bullet$",
      "last24_codepoints": [
        "$",
        "\\",
        "b",
        "u",
        "l",
        "l",
        "e",
        "t",
        "$",
        " ",
        "5",
        "9",
        " ",
        "$",
        "\\",
        "b",
        "u",
        "l",
        "l",
        "e",
        "t",
        "$"
      ],
      "trailing_ascii_spaces": 0
    }
  ],
  "all_math_spans": [
    {
      "tex": "ABCDA_1B_1C_1D_1",
      "display": false
    },
    {
      "tex": "\\angle BC_1C",
      "display": false
    },
    {
      "tex": "\\angle AD_1D",
      "display": false
    },
    {
      "tex": "\\angle CBD_1",
      "display": false
    },
    {
      "tex": "\\angle AD_1B",
      "display": false
    },
    {
      "tex": "\\angle ADC",
      "display": false
    },
    {
      "tex": "\\angle A_1B_1C_1",
      "display": false
    },
    {
      "tex": "\\vec a",
      "display": false
    },
    {
      "tex": "\\vec b",
      "display": false
    },
    {
      "tex": "M",
      "display": false
    },
    {
      "tex": "N",
      "display": false
    },
    {
      "tex": "\\vec a(M)=M_1",
      "display": false
    },
    {
      "tex": "\\vec a(N)=N_1",
      "display": false
    },
    {
      "tex": "\\vec b(M_1)=M_2",
      "display": false
    },
    {
      "tex": "\\vec b(N_1)=N_2",
      "display": false
    },
    {
      "tex": "\\bullet",
      "display": false
    },
    {
      "tex": "\\bullet",
      "display": false
    }
  ],
  "audit": {
    "page": 66,
    "lines_printed": 18,
    "lines_md": 18,
    "figures": [
      {
        "id": "fig-71",
        "label": "图 71",
        "box": [
          396,
          1443,
          623,
          392
        ],
        "components": 24,
        "from": [
          390,
          1435,
          630,
          410
        ]
      }
    ],
    "normalizations": [],
    "unknown_chars": [],
    "katex_warnings": [],
    "errata": 0,
    "count_exclusions": [],
    "errors": []
  }
}
```

## Physical67: Full raw authored page
```markdown
---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9-10g",
  "page": 67,
  "printed_page": 60,
  "source": {
    "pdf": "9-10g 苏联十年制学校数学教材 几何 9-10年级.pdf",
    "pdf_sha256": "1900be5207d00404f64e5a40ab855fbfb8495bd2a06c5ce295ae0e145444578a",
    "pdf_page": 67
  },
  "render": {
    "dpi": 300,
    "w": 1506,
    "h": 2126,
    "sha256": "8ce5663f309c7c576c8aa7564b07e79e0be0be1be78e95e2daba4c38edd0202e"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "首段承接物理66页定理9证明；下段末源页黑方块为证明结束标志。",
    "射线记号[M_1N_1)之后实际换行再印双上箭头；使用↵保留公式断点，不改为线段或普通平行号。",
    "图72为同一编号的三幅子图，标签依原书记为西里尔а)、б)、в)；归§18正文，不归练习。",
    "最后正文段在“映射成”后由图72隔断，本页无后续正文；标open，不能推断下一页内容。",
    "图72上方子图A附近有孤立粗墨笔，来源含义UNKNOWN；原像素保留，不认作新点、箭头或数学给定。",
    "未使用计行排除、人工行数覆盖或数学勘误。"
  ],
  "errata": [],
  "source_emphasis": [
    {"block": "p0067#3", "span": "向量 $\\vec a$ 与 $\\vec b$ 的和", "style": "bold", "basis": "本页源像素中的定义名"},
    {"blocks": ["p0067#1", "p0067#2", "p0067#4", "p0067#5", "p0067#7", "p0067#8"], "span": "UNKNOWN", "style": "UNKNOWN"}
  ]
}
---

<!-- p cont -->
合成 $\vec b\cdot\vec a$ 将点 $M$ 和 $N$ 分别映射成 $M_2$ 和 $N_2$. 为了证明
定理，只需断定 $\overrightarrow{MM_2}=\overrightarrow{NN_2}$ 就是够了. 向量是位移（§17，
性质 1）. 因此 $|MN|=|M_1N_1|$，$|M_1N_1|=|M_2N_2|$. 因此，
$|MN|=|M_2N_2|$（1）. 向量将每一条射线映射成和它同方向
的射线（§17，性质 2），这时 $[MN)\uparrow\uparrow[M_1N_1)$，$[M_1N_1)↵\uparrow\uparrow[M_2N_2)$. 由此得出（§16）$[MN)\uparrow\uparrow[M_2N_2)$. （2）

<!-- p -->
如果射线 $MN$ 和 $M_2N_2$ 不在一条直线上，那么由（2）和
（1）推得 $MNN_2M_2$ 是平行四边形，于是 $\overrightarrow{MM_2}=\overrightarrow{NN_2}$. 如果
$[MN)$ 和 $[M_2N_2)$ 在同一条直线上，这个等式同样成立. $\blacksquare$

<!-- p -->
向量 $\vec a$ 和 $\vec b$ 的合成通常叫做向量 $\vec a$ 与 $\vec b$ 的和. 这时，记
法 $\vec b\cdot\vec a=\vec c$ 可以写成 $\vec a+\vec b=\vec c$.

<!-- p -->
研究任意的点 $A$，$B$，$C$（图 72，а）. 从关于两个向量的合
成的定理推出等式：
$\overrightarrow{AB}+\overrightarrow{BC}=\overrightarrow{AC}$ （3）

<!-- p open -->
实际上，向量 $\overrightarrow{AB}$ 将 $A$ 映射成 $B$，向量 $\overrightarrow{BC}$ 将 $B$ 映射成

<!-- fig 图 72 box 170,1270,1050,570 -->

<!-- cap 图 72 -->
图 72

<!-- foot -->
$\bullet$ 60 $\bullet$

```
## Physical67: Full finalized page
```markdown
---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9-10g",
  "page": 67,
  "printed_page": 60,
  "source": {
    "pdf": "9-10g 苏联十年制学校数学教材 几何 9-10年级.pdf",
    "pdf_sha256": "1900be5207d00404f64e5a40ab855fbfb8495bd2a06c5ce295ae0e145444578a",
    "pdf_page": 67
  },
  "render": {
    "dpi": 300,
    "w": 1506,
    "h": 2126,
    "sha256": "8ce5663f309c7c576c8aa7564b07e79e0be0be1be78e95e2daba4c38edd0202e"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "首段承接物理66页定理9证明；下段末源页黑方块为证明结束标志。",
    "射线记号[M_1N_1)之后实际换行再印双上箭头；使用↵保留公式断点，不改为线段或普通平行号。",
    "图72为同一编号的三幅子图，标签依原书记为西里尔а)、б)、в)；归§18正文，不归练习。",
    "最后正文段在“映射成”后由图72隔断，本页无后续正文；标open，不能推断下一页内容。",
    "图72上方子图A附近有孤立粗墨笔，来源含义UNKNOWN；原像素保留，不认作新点、箭头或数学给定。",
    "未使用计行排除、人工行数覆盖或数学勘误。"
  ],
  "errata": [],
  "source_emphasis": [
    {
      "block": "p0067#3",
      "span": "向量 $\\vec a$ 与 $\\vec b$ 的和",
      "style": "bold",
      "basis": "本页源像素中的定义名"
    },
    {
      "blocks": [
        "p0067#1",
        "p0067#2",
        "p0067#4",
        "p0067#5",
        "p0067#7",
        "p0067#8"
      ],
      "span": "UNKNOWN",
      "style": "UNKNOWN"
    }
  ],
  "printed_lines": 17,
  "figures": [
    {
      "id": "fig-72",
      "label": "图 72",
      "box": [
        179,
        1278,
        1022,
        553
      ]
    }
  ],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p cont -->
合成 $\vec b\cdot\vec a$ 将点 $M$ 和 $N$ 分别映射成 $M_2$ 和 $N_2$. 为了证明
定理，只需断定 $\overrightarrow{MM_2}=\overrightarrow{NN_2}$ 就是够了. 向量是位移（§17，
性质 1）. 因此 $|MN|=|M_1N_1|$，$|M_1N_1|=|M_2N_2|$. 因此，
$|MN|=|M_2N_2|$（1）. 向量将每一条射线映射成和它同方向
的射线（§17，性质 2），这时 $[MN)\uparrow\uparrow[M_1N_1)$，$[M_1N_1)↵\uparrow\uparrow[M_2N_2)$. 由此得出（§16）$[MN)\uparrow\uparrow[M_2N_2)$. （2）

<!-- p -->
如果射线 $MN$ 和 $M_2N_2$ 不在一条直线上，那么由（2）和
（1）推得 $MNN_2M_2$ 是平行四边形，于是 $\overrightarrow{MM_2}=\overrightarrow{NN_2}$. 如果
$[MN)$ 和 $[M_2N_2)$ 在同一条直线上，这个等式同样成立. $\blacksquare$

<!-- p -->
向量 $\vec a$ 和 $\vec b$ 的合成通常叫做向量 $\vec a$ 与 $\vec b$ 的和. 这时，记
法 $\vec b\cdot\vec a=\vec c$ 可以写成 $\vec a+\vec b=\vec c$.

<!-- p -->
研究任意的点 $A$，$B$，$C$（图 72，а）. 从关于两个向量的合
成的定理推出等式：
$\overrightarrow{AB}+\overrightarrow{BC}=\overrightarrow{AC}$ （3）

<!-- p open -->
实际上，向量 $\overrightarrow{AB}$ 将 $A$ 映射成 $B$，向量 $\overrightarrow{BC}$ 将 $B$ 映射成

<!-- fig 图 72 box 179,1278,1022,553 -->
![图 72](figures/fig-72.png)

<!-- cap 图 72 -->
图 72

<!-- foot -->
$\bullet$ 60 $\bullet$

```
## Physical67: All blocks, rows, row ends, math, audit
```json
{
  "metadata": {
    "schema": "ld-s10y-lesson/page@3",
    "book": "9-10g",
    "page": 67,
    "printed_page": 60,
    "source": {
      "pdf": "9-10g 苏联十年制学校数学教材 几何 9-10年级.pdf",
      "pdf_sha256": "1900be5207d00404f64e5a40ab855fbfb8495bd2a06c5ce295ae0e145444578a",
      "pdf_page": 67
    },
    "render": {
      "dpi": 300,
      "w": 1506,
      "h": 2126,
      "sha256": "8ce5663f309c7c576c8aa7564b07e79e0be0be1be78e95e2daba4c38edd0202e"
    },
    "profile": {
      "id": "soviet-cn",
      "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
    },
    "notes": [
      "首段承接物理66页定理9证明；下段末源页黑方块为证明结束标志。",
      "射线记号[M_1N_1)之后实际换行再印双上箭头；使用↵保留公式断点，不改为线段或普通平行号。",
      "图72为同一编号的三幅子图，标签依原书记为西里尔а)、б)、в)；归§18正文，不归练习。",
      "最后正文段在“映射成”后由图72隔断，本页无后续正文；标open，不能推断下一页内容。",
      "图72上方子图A附近有孤立粗墨笔，来源含义UNKNOWN；原像素保留，不认作新点、箭头或数学给定。",
      "未使用计行排除、人工行数覆盖或数学勘误。"
    ],
    "errata": [],
    "source_emphasis": [
      {
        "block": "p0067#3",
        "span": "向量 $\\vec a$ 与 $\\vec b$ 的和",
        "style": "bold",
        "basis": "本页源像素中的定义名"
      },
      {
        "blocks": [
          "p0067#1",
          "p0067#2",
          "p0067#4",
          "p0067#5",
          "p0067#7",
          "p0067#8"
        ],
        "span": "UNKNOWN",
        "style": "UNKNOWN"
      }
    ],
    "printed_lines": 17,
    "figures": [
      {
        "id": "fig-72",
        "label": "图 72",
        "box": [
          179,
          1278,
          1022,
          553
        ]
      }
    ],
    "provenance": {
      "cap": "1",
      "normalized": true
    }
  },
  "full_final_blocks": [
    {
      "block_ref": "p0067#1",
      "kind": "p",
      "label": null,
      "box": null,
      "owner_exercise": null,
      "cont": true,
      "open": false,
      "samerow": false,
      "lines": [
        "合成 $\\vec b\\cdot\\vec a$ 将点 $M$ 和 $N$ 分别映射成 $M_2$ 和 $N_2$. 为了证明",
        "定理，只需断定 $\\overrightarrow{MM_2}=\\overrightarrow{NN_2}$ 就是够了. 向量是位移（§17，",
        "性质 1）. 因此 $|MN|=|M_1N_1|$，$|M_1N_1|=|M_2N_2|$. 因此，",
        "$|MN|=|M_2N_2|$（1）. 向量将每一条射线映射成和它同方向",
        "的射线（§17，性质 2），这时 $[MN)\\uparrow\\uparrow[M_1N_1)$，$[M_1N_1)↵\\uparrow\\uparrow[M_2N_2)$. 由此得出（§16）$[MN)\\uparrow\\uparrow[M_2N_2)$. （2）"
      ],
      "physical_rows": [
        {
          "ordinal": 1,
          "block_ref": "p0067#1",
          "kind": "p",
          "label": null,
          "cont": true,
          "open": false,
          "samerow": false,
          "text": "合成 $\\vec b\\cdot\\vec a$ 将点 $M$ 和 $N$ 分别映射成 $M_2$ 和 $N_2$. 为了证明",
          "final_codepoints": [
            "别",
            "映",
            "射",
            "成",
            " ",
            "$",
            "M",
            "_",
            "2",
            "$",
            " ",
            "和",
            " ",
            "$",
            "N",
            "_",
            "2",
            "$",
            ".",
            " ",
            "为",
            "了",
            "证",
            "明"
          ],
          "trailing_ascii_spaces": 0
        },
        {
          "ordinal": 2,
          "block_ref": "p0067#1",
          "kind": "p",
          "label": null,
          "cont": true,
          "open": false,
          "samerow": false,
          "text": "定理，只需断定 $\\overrightarrow{MM_2}=\\overrightarrow{NN_2}$ 就是够了. 向量是位移（§17，",
          "final_codepoints": [
            "{",
            "N",
            "N",
            "_",
            "2",
            "}",
            "$",
            " ",
            "就",
            "是",
            "够",
            "了",
            ".",
            " ",
            "向",
            "量",
            "是",
            "位",
            "移",
            "（",
            "§",
            "1",
            "7",
            "，"
          ],
          "trailing_ascii_spaces": 0
        },
        {
          "ordinal": 3,
          "block_ref": "p0067#1",
          "kind": "p",
          "label": null,
          "cont": true,
          "open": false,
          "samerow": false,
          "text": "性质 1）. 因此 $|MN|=|M_1N_1|$，$|M_1N_1|=|M_2N_2|$. 因此，",
          "final_codepoints": [
            "$",
            "|",
            "M",
            "_",
            "1",
            "N",
            "_",
            "1",
            "|",
            "=",
            "|",
            "M",
            "_",
            "2",
            "N",
            "_",
            "2",
            "|",
            "$",
            ".",
            " ",
            "因",
            "此",
            "，"
          ],
          "trailing_ascii_spaces": 0
        },
        {
          "ordinal": 4,
          "block_ref": "p0067#1",
          "kind": "p",
          "label": null,
          "cont": true,
          "open": false,
          "samerow": false,
          "text": "$|MN|=|M_2N_2|$（1）. 向量将每一条射线映射成和它同方向",
          "final_codepoints": [
            "2",
            "|",
            "$",
            "（",
            "1",
            "）",
            ".",
            " ",
            "向",
            "量",
            "将",
            "每",
            "一",
            "条",
            "射",
            "线",
            "映",
            "射",
            "成",
            "和",
            "它",
            "同",
            "方",
            "向"
          ],
          "trailing_ascii_spaces": 0
        },
        {
          "ordinal": 5,
          "block_ref": "p0067#1",
          "kind": "p",
          "label": null,
          "cont": true,
          "open": false,
          "samerow": false,
          "text": "的射线（§17，性质 2），这时 $[MN)\\uparrow\\uparrow[M_1N_1)$，$[M_1N_1)",
          "final_codepoints": [
            "a",
            "r",
            "r",
            "o",
            "w",
            "[",
            "M",
            "_",
            "1",
            "N",
            "_",
            "1",
            ")",
            "$",
            "，",
            "$",
            "[",
            "M",
            "_",
            "1",
            "N",
            "_",
            "1",
            ")"
          ],
          "trailing_ascii_spaces": 0
        },
        {
          "ordinal": 6,
          "block_ref": "p0067#1",
          "kind": "p",
          "label": null,
          "cont": true,
          "open": false,
          "samerow": false,
          "text": "\\uparrow\\uparrow[M_2N_2)$. 由此得出（§16）$[MN)\\uparrow\\uparrow[M_2N_2)$. （2）",
          "final_codepoints": [
            "o",
            "w",
            "\\",
            "u",
            "p",
            "a",
            "r",
            "r",
            "o",
            "w",
            "[",
            "M",
            "_",
            "2",
            "N",
            "_",
            "2",
            ")",
            "$",
            ".",
            " ",
            "（",
            "2",
            "）"
          ],
          "trailing_ascii_spaces": 0
        }
      ]
    },
    {
      "block_ref": "p0067#2",
      "kind": "p",
      "label": null,
      "box": null,
      "owner_exercise": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "lines": [
        "如果射线 $MN$ 和 $M_2N_2$ 不在一条直线上，那么由（2）和",
        "（1）推得 $MNN_2M_2$ 是平行四边形，于是 $\\overrightarrow{MM_2}=\\overrightarrow{NN_2}$. 如果",
        "$[MN)$ 和 $[M_2N_2)$ 在同一条直线上，这个等式同样成立. $\\blacksquare$"
      ],
      "physical_rows": [
        {
          "ordinal": 7,
          "block_ref": "p0067#2",
          "kind": "p",
          "label": null,
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "如果射线 $MN$ 和 $M_2N_2$ 不在一条直线上，那么由（2）和",
          "final_codepoints": [
            "$",
            "M",
            "_",
            "2",
            "N",
            "_",
            "2",
            "$",
            " ",
            "不",
            "在",
            "一",
            "条",
            "直",
            "线",
            "上",
            "，",
            "那",
            "么",
            "由",
            "（",
            "2",
            "）",
            "和"
          ],
          "trailing_ascii_spaces": 0
        },
        {
          "ordinal": 8,
          "block_ref": "p0067#2",
          "kind": "p",
          "label": null,
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "（1）推得 $MNN_2M_2$ 是平行四边形，于是 $\\overrightarrow{MM_2}=\\overrightarrow{NN_2}$. 如果",
          "final_codepoints": [
            "v",
            "e",
            "r",
            "r",
            "i",
            "g",
            "h",
            "t",
            "a",
            "r",
            "r",
            "o",
            "w",
            "{",
            "N",
            "N",
            "_",
            "2",
            "}",
            "$",
            ".",
            " ",
            "如",
            "果"
          ],
          "trailing_ascii_spaces": 0
        },
        {
          "ordinal": 9,
          "block_ref": "p0067#2",
          "kind": "p",
          "label": null,
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "$[MN)$ 和 $[M_2N_2)$ 在同一条直线上，这个等式同样成立. $\\blacksquare$",
          "final_codepoints": [
            "这",
            "个",
            "等",
            "式",
            "同",
            "样",
            "成",
            "立",
            ".",
            " ",
            "$",
            "\\",
            "b",
            "l",
            "a",
            "c",
            "k",
            "s",
            "q",
            "u",
            "a",
            "r",
            "e",
            "$"
          ],
          "trailing_ascii_spaces": 0
        }
      ]
    },
    {
      "block_ref": "p0067#3",
      "kind": "p",
      "label": null,
      "box": null,
      "owner_exercise": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "lines": [
        "向量 $\\vec a$ 和 $\\vec b$ 的合成通常叫做向量 $\\vec a$ 与 $\\vec b$ 的和. 这时，记",
        "法 $\\vec b\\cdot\\vec a=\\vec c$ 可以写成 $\\vec a+\\vec b=\\vec c$."
      ],
      "physical_rows": [
        {
          "ordinal": 10,
          "block_ref": "p0067#3",
          "kind": "p",
          "label": null,
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "向量 $\\vec a$ 和 $\\vec b$ 的合成通常叫做向量 $\\vec a$ 与 $\\vec b$ 的和. 这时，记",
          "final_codepoints": [
            "c",
            " ",
            "a",
            "$",
            " ",
            "与",
            " ",
            "$",
            "\\",
            "v",
            "e",
            "c",
            " ",
            "b",
            "$",
            " ",
            "的",
            "和",
            ".",
            " ",
            "这",
            "时",
            "，",
            "记"
          ],
          "trailing_ascii_spaces": 0
        },
        {
          "ordinal": 11,
          "block_ref": "p0067#3",
          "kind": "p",
          "label": null,
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "法 $\\vec b\\cdot\\vec a=\\vec c$ 可以写成 $\\vec a+\\vec b=\\vec c$.",
          "final_codepoints": [
            " ",
            "$",
            "\\",
            "v",
            "e",
            "c",
            " ",
            "a",
            "+",
            "\\",
            "v",
            "e",
            "c",
            " ",
            "b",
            "=",
            "\\",
            "v",
            "e",
            "c",
            " ",
            "c",
            "$",
            "."
          ],
          "trailing_ascii_spaces": 0
        }
      ]
    },
    {
      "block_ref": "p0067#4",
      "kind": "p",
      "label": null,
      "box": null,
      "owner_exercise": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "lines": [
        "研究任意的点 $A$，$B$，$C$（图 72，а）. 从关于两个向量的合",
        "成的定理推出等式：",
        "$\\overrightarrow{AB}+\\overrightarrow{BC}=\\overrightarrow{AC}$ （3）"
      ],
      "physical_rows": [
        {
          "ordinal": 12,
          "block_ref": "p0067#4",
          "kind": "p",
          "label": null,
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "研究任意的点 $A$，$B$，$C$（图 72，а）. 从关于两个向量的合",
          "final_codepoints": [
            "$",
            "，",
            "$",
            "C",
            "$",
            "（",
            "图",
            " ",
            "7",
            "2",
            "，",
            "а",
            "）",
            ".",
            " ",
            "从",
            "关",
            "于",
            "两",
            "个",
            "向",
            "量",
            "的",
            "合"
          ],
          "trailing_ascii_spaces": 0
        },
        {
          "ordinal": 13,
          "block_ref": "p0067#4",
          "kind": "p",
          "label": null,
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "成的定理推出等式：",
          "final_codepoints": [
            "成",
            "的",
            "定",
            "理",
            "推",
            "出",
            "等",
            "式",
            "："
          ],
          "trailing_ascii_spaces": 0
        },
        {
          "ordinal": 14,
          "block_ref": "p0067#4",
          "kind": "p",
          "label": null,
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "$\\overrightarrow{AB}+\\overrightarrow{BC}=\\overrightarrow{AC}$ （3）",
          "final_codepoints": [
            "\\",
            "o",
            "v",
            "e",
            "r",
            "r",
            "i",
            "g",
            "h",
            "t",
            "a",
            "r",
            "r",
            "o",
            "w",
            "{",
            "A",
            "C",
            "}",
            "$",
            " ",
            "（",
            "3",
            "）"
          ],
          "trailing_ascii_spaces": 0
        }
      ]
    },
    {
      "block_ref": "p0067#5",
      "kind": "p",
      "label": null,
      "box": null,
      "owner_exercise": null,
      "cont": false,
      "open": true,
      "samerow": false,
      "lines": [
        "实际上，向量 $\\overrightarrow{AB}$ 将 $A$ 映射成 $B$，向量 $\\overrightarrow{BC}$ 将 $B$ 映射成"
      ],
      "physical_rows": [
        {
          "ordinal": 15,
          "block_ref": "p0067#5",
          "kind": "p",
          "label": null,
          "cont": false,
          "open": true,
          "samerow": false,
          "text": "实际上，向量 $\\overrightarrow{AB}$ 将 $A$ 映射成 $B$，向量 $\\overrightarrow{BC}$ 将 $B$ 映射成",
          "final_codepoints": [
            "i",
            "g",
            "h",
            "t",
            "a",
            "r",
            "r",
            "o",
            "w",
            "{",
            "B",
            "C",
            "}",
            "$",
            " ",
            "将",
            " ",
            "$",
            "B",
            "$",
            " ",
            "映",
            "射",
            "成"
          ],
          "trailing_ascii_spaces": 0
        }
      ]
    },
    {
      "block_ref": "p0067#6",
      "kind": "fig",
      "label": "图 72",
      "box": [
        179,
        1278,
        1022,
        553
      ],
      "owner_exercise": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "lines": [],
      "id": "fig-72",
      "physical_rows": []
    },
    {
      "block_ref": "p0067#7",
      "kind": "cap",
      "label": "图 72",
      "box": null,
      "owner_exercise": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "lines": [
        "图 72"
      ],
      "physical_rows": [
        {
          "ordinal": 16,
          "block_ref": "p0067#7",
          "kind": "cap",
          "label": "图 72",
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "图 72",
          "final_codepoints": [
            "图",
            " ",
            "7",
            "2"
          ],
          "trailing_ascii_spaces": 0
        }
      ]
    },
    {
      "block_ref": "p0067#8",
      "kind": "foot",
      "label": null,
      "box": null,
      "owner_exercise": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "lines": [
        "$\\bullet$ 60 $\\bullet$"
      ],
      "physical_rows": [
        {
          "ordinal": 17,
          "block_ref": "p0067#8",
          "kind": "foot",
          "label": null,
          "cont": false,
          "open": false,
          "samerow": false,
          "text": "$\\bullet$ 60 $\\bullet$",
          "final_codepoints": [
            "$",
            "\\",
            "b",
            "u",
            "l",
            "l",
            "e",
            "t",
            "$",
            " ",
            "6",
            "0",
            " ",
            "$",
            "\\",
            "b",
            "u",
            "l",
            "l",
            "e",
            "t",
            "$"
          ],
          "trailing_ascii_spaces": 0
        }
      ]
    }
  ],
  "full_physical_rows": [
    {
      "ordinal": 1,
      "block_ref": "p0067#1",
      "kind": "p",
      "label": null,
      "cont": true,
      "open": false,
      "samerow": false,
      "text": "合成 $\\vec b\\cdot\\vec a$ 将点 $M$ 和 $N$ 分别映射成 $M_2$ 和 $N_2$. 为了证明",
      "final_codepoints": [
        "别",
        "映",
        "射",
        "成",
        " ",
        "$",
        "M",
        "_",
        "2",
        "$",
        " ",
        "和",
        " ",
        "$",
        "N",
        "_",
        "2",
        "$",
        ".",
        " ",
        "为",
        "了",
        "证",
        "明"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 2,
      "block_ref": "p0067#1",
      "kind": "p",
      "label": null,
      "cont": true,
      "open": false,
      "samerow": false,
      "text": "定理，只需断定 $\\overrightarrow{MM_2}=\\overrightarrow{NN_2}$ 就是够了. 向量是位移（§17，",
      "final_codepoints": [
        "{",
        "N",
        "N",
        "_",
        "2",
        "}",
        "$",
        " ",
        "就",
        "是",
        "够",
        "了",
        ".",
        " ",
        "向",
        "量",
        "是",
        "位",
        "移",
        "（",
        "§",
        "1",
        "7",
        "，"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 3,
      "block_ref": "p0067#1",
      "kind": "p",
      "label": null,
      "cont": true,
      "open": false,
      "samerow": false,
      "text": "性质 1）. 因此 $|MN|=|M_1N_1|$，$|M_1N_1|=|M_2N_2|$. 因此，",
      "final_codepoints": [
        "$",
        "|",
        "M",
        "_",
        "1",
        "N",
        "_",
        "1",
        "|",
        "=",
        "|",
        "M",
        "_",
        "2",
        "N",
        "_",
        "2",
        "|",
        "$",
        ".",
        " ",
        "因",
        "此",
        "，"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 4,
      "block_ref": "p0067#1",
      "kind": "p",
      "label": null,
      "cont": true,
      "open": false,
      "samerow": false,
      "text": "$|MN|=|M_2N_2|$（1）. 向量将每一条射线映射成和它同方向",
      "final_codepoints": [
        "2",
        "|",
        "$",
        "（",
        "1",
        "）",
        ".",
        " ",
        "向",
        "量",
        "将",
        "每",
        "一",
        "条",
        "射",
        "线",
        "映",
        "射",
        "成",
        "和",
        "它",
        "同",
        "方",
        "向"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 5,
      "block_ref": "p0067#1",
      "kind": "p",
      "label": null,
      "cont": true,
      "open": false,
      "samerow": false,
      "text": "的射线（§17，性质 2），这时 $[MN)\\uparrow\\uparrow[M_1N_1)$，$[M_1N_1)",
      "final_codepoints": [
        "a",
        "r",
        "r",
        "o",
        "w",
        "[",
        "M",
        "_",
        "1",
        "N",
        "_",
        "1",
        ")",
        "$",
        "，",
        "$",
        "[",
        "M",
        "_",
        "1",
        "N",
        "_",
        "1",
        ")"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 6,
      "block_ref": "p0067#1",
      "kind": "p",
      "label": null,
      "cont": true,
      "open": false,
      "samerow": false,
      "text": "\\uparrow\\uparrow[M_2N_2)$. 由此得出（§16）$[MN)\\uparrow\\uparrow[M_2N_2)$. （2）",
      "final_codepoints": [
        "o",
        "w",
        "\\",
        "u",
        "p",
        "a",
        "r",
        "r",
        "o",
        "w",
        "[",
        "M",
        "_",
        "2",
        "N",
        "_",
        "2",
        ")",
        "$",
        ".",
        " ",
        "（",
        "2",
        "）"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 7,
      "block_ref": "p0067#2",
      "kind": "p",
      "label": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "如果射线 $MN$ 和 $M_2N_2$ 不在一条直线上，那么由（2）和",
      "final_codepoints": [
        "$",
        "M",
        "_",
        "2",
        "N",
        "_",
        "2",
        "$",
        " ",
        "不",
        "在",
        "一",
        "条",
        "直",
        "线",
        "上",
        "，",
        "那",
        "么",
        "由",
        "（",
        "2",
        "）",
        "和"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 8,
      "block_ref": "p0067#2",
      "kind": "p",
      "label": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "（1）推得 $MNN_2M_2$ 是平行四边形，于是 $\\overrightarrow{MM_2}=\\overrightarrow{NN_2}$. 如果",
      "final_codepoints": [
        "v",
        "e",
        "r",
        "r",
        "i",
        "g",
        "h",
        "t",
        "a",
        "r",
        "r",
        "o",
        "w",
        "{",
        "N",
        "N",
        "_",
        "2",
        "}",
        "$",
        ".",
        " ",
        "如",
        "果"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 9,
      "block_ref": "p0067#2",
      "kind": "p",
      "label": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "$[MN)$ 和 $[M_2N_2)$ 在同一条直线上，这个等式同样成立. $\\blacksquare$",
      "final_codepoints": [
        "这",
        "个",
        "等",
        "式",
        "同",
        "样",
        "成",
        "立",
        ".",
        " ",
        "$",
        "\\",
        "b",
        "l",
        "a",
        "c",
        "k",
        "s",
        "q",
        "u",
        "a",
        "r",
        "e",
        "$"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 10,
      "block_ref": "p0067#3",
      "kind": "p",
      "label": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "向量 $\\vec a$ 和 $\\vec b$ 的合成通常叫做向量 $\\vec a$ 与 $\\vec b$ 的和. 这时，记",
      "final_codepoints": [
        "c",
        " ",
        "a",
        "$",
        " ",
        "与",
        " ",
        "$",
        "\\",
        "v",
        "e",
        "c",
        " ",
        "b",
        "$",
        " ",
        "的",
        "和",
        ".",
        " ",
        "这",
        "时",
        "，",
        "记"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 11,
      "block_ref": "p0067#3",
      "kind": "p",
      "label": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "法 $\\vec b\\cdot\\vec a=\\vec c$ 可以写成 $\\vec a+\\vec b=\\vec c$.",
      "final_codepoints": [
        " ",
        "$",
        "\\",
        "v",
        "e",
        "c",
        " ",
        "a",
        "+",
        "\\",
        "v",
        "e",
        "c",
        " ",
        "b",
        "=",
        "\\",
        "v",
        "e",
        "c",
        " ",
        "c",
        "$",
        "."
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 12,
      "block_ref": "p0067#4",
      "kind": "p",
      "label": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "研究任意的点 $A$，$B$，$C$（图 72，а）. 从关于两个向量的合",
      "final_codepoints": [
        "$",
        "，",
        "$",
        "C",
        "$",
        "（",
        "图",
        " ",
        "7",
        "2",
        "，",
        "а",
        "）",
        ".",
        " ",
        "从",
        "关",
        "于",
        "两",
        "个",
        "向",
        "量",
        "的",
        "合"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 13,
      "block_ref": "p0067#4",
      "kind": "p",
      "label": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "成的定理推出等式：",
      "final_codepoints": [
        "成",
        "的",
        "定",
        "理",
        "推",
        "出",
        "等",
        "式",
        "："
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 14,
      "block_ref": "p0067#4",
      "kind": "p",
      "label": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "$\\overrightarrow{AB}+\\overrightarrow{BC}=\\overrightarrow{AC}$ （3）",
      "final_codepoints": [
        "\\",
        "o",
        "v",
        "e",
        "r",
        "r",
        "i",
        "g",
        "h",
        "t",
        "a",
        "r",
        "r",
        "o",
        "w",
        "{",
        "A",
        "C",
        "}",
        "$",
        " ",
        "（",
        "3",
        "）"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 15,
      "block_ref": "p0067#5",
      "kind": "p",
      "label": null,
      "cont": false,
      "open": true,
      "samerow": false,
      "text": "实际上，向量 $\\overrightarrow{AB}$ 将 $A$ 映射成 $B$，向量 $\\overrightarrow{BC}$ 将 $B$ 映射成",
      "final_codepoints": [
        "i",
        "g",
        "h",
        "t",
        "a",
        "r",
        "r",
        "o",
        "w",
        "{",
        "B",
        "C",
        "}",
        "$",
        " ",
        "将",
        " ",
        "$",
        "B",
        "$",
        " ",
        "映",
        "射",
        "成"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 16,
      "block_ref": "p0067#7",
      "kind": "cap",
      "label": "图 72",
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "图 72",
      "final_codepoints": [
        "图",
        " ",
        "7",
        "2"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 17,
      "block_ref": "p0067#8",
      "kind": "foot",
      "label": null,
      "cont": false,
      "open": false,
      "samerow": false,
      "text": "$\\bullet$ 60 $\\bullet$",
      "final_codepoints": [
        "$",
        "\\",
        "b",
        "u",
        "l",
        "l",
        "e",
        "t",
        "$",
        " ",
        "6",
        "0",
        " ",
        "$",
        "\\",
        "b",
        "u",
        "l",
        "l",
        "e",
        "t",
        "$"
      ],
      "trailing_ascii_spaces": 0
    }
  ],
  "full_row_ends": [
    {
      "ordinal": 1,
      "block_ref": "p0067#1",
      "text": "合成 $\\vec b\\cdot\\vec a$ 将点 $M$ 和 $N$ 分别映射成 $M_2$ 和 $N_2$. 为了证明",
      "last24_codepoints": [
        "别",
        "映",
        "射",
        "成",
        " ",
        "$",
        "M",
        "_",
        "2",
        "$",
        " ",
        "和",
        " ",
        "$",
        "N",
        "_",
        "2",
        "$",
        ".",
        " ",
        "为",
        "了",
        "证",
        "明"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 2,
      "block_ref": "p0067#1",
      "text": "定理，只需断定 $\\overrightarrow{MM_2}=\\overrightarrow{NN_2}$ 就是够了. 向量是位移（§17，",
      "last24_codepoints": [
        "{",
        "N",
        "N",
        "_",
        "2",
        "}",
        "$",
        " ",
        "就",
        "是",
        "够",
        "了",
        ".",
        " ",
        "向",
        "量",
        "是",
        "位",
        "移",
        "（",
        "§",
        "1",
        "7",
        "，"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 3,
      "block_ref": "p0067#1",
      "text": "性质 1）. 因此 $|MN|=|M_1N_1|$，$|M_1N_1|=|M_2N_2|$. 因此，",
      "last24_codepoints": [
        "$",
        "|",
        "M",
        "_",
        "1",
        "N",
        "_",
        "1",
        "|",
        "=",
        "|",
        "M",
        "_",
        "2",
        "N",
        "_",
        "2",
        "|",
        "$",
        ".",
        " ",
        "因",
        "此",
        "，"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 4,
      "block_ref": "p0067#1",
      "text": "$|MN|=|M_2N_2|$（1）. 向量将每一条射线映射成和它同方向",
      "last24_codepoints": [
        "2",
        "|",
        "$",
        "（",
        "1",
        "）",
        ".",
        " ",
        "向",
        "量",
        "将",
        "每",
        "一",
        "条",
        "射",
        "线",
        "映",
        "射",
        "成",
        "和",
        "它",
        "同",
        "方",
        "向"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 5,
      "block_ref": "p0067#1",
      "text": "的射线（§17，性质 2），这时 $[MN)\\uparrow\\uparrow[M_1N_1)$，$[M_1N_1)",
      "last24_codepoints": [
        "a",
        "r",
        "r",
        "o",
        "w",
        "[",
        "M",
        "_",
        "1",
        "N",
        "_",
        "1",
        ")",
        "$",
        "，",
        "$",
        "[",
        "M",
        "_",
        "1",
        "N",
        "_",
        "1",
        ")"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 6,
      "block_ref": "p0067#1",
      "text": "\\uparrow\\uparrow[M_2N_2)$. 由此得出（§16）$[MN)\\uparrow\\uparrow[M_2N_2)$. （2）",
      "last24_codepoints": [
        "o",
        "w",
        "\\",
        "u",
        "p",
        "a",
        "r",
        "r",
        "o",
        "w",
        "[",
        "M",
        "_",
        "2",
        "N",
        "_",
        "2",
        ")",
        "$",
        ".",
        " ",
        "（",
        "2",
        "）"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 7,
      "block_ref": "p0067#2",
      "text": "如果射线 $MN$ 和 $M_2N_2$ 不在一条直线上，那么由（2）和",
      "last24_codepoints": [
        "$",
        "M",
        "_",
        "2",
        "N",
        "_",
        "2",
        "$",
        " ",
        "不",
        "在",
        "一",
        "条",
        "直",
        "线",
        "上",
        "，",
        "那",
        "么",
        "由",
        "（",
        "2",
        "）",
        "和"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 8,
      "block_ref": "p0067#2",
      "text": "（1）推得 $MNN_2M_2$ 是平行四边形，于是 $\\overrightarrow{MM_2}=\\overrightarrow{NN_2}$. 如果",
      "last24_codepoints": [
        "v",
        "e",
        "r",
        "r",
        "i",
        "g",
        "h",
        "t",
        "a",
        "r",
        "r",
        "o",
        "w",
        "{",
        "N",
        "N",
        "_",
        "2",
        "}",
        "$",
        ".",
        " ",
        "如",
        "果"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 9,
      "block_ref": "p0067#2",
      "text": "$[MN)$ 和 $[M_2N_2)$ 在同一条直线上，这个等式同样成立. $\\blacksquare$",
      "last24_codepoints": [
        "这",
        "个",
        "等",
        "式",
        "同",
        "样",
        "成",
        "立",
        ".",
        " ",
        "$",
        "\\",
        "b",
        "l",
        "a",
        "c",
        "k",
        "s",
        "q",
        "u",
        "a",
        "r",
        "e",
        "$"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 10,
      "block_ref": "p0067#3",
      "text": "向量 $\\vec a$ 和 $\\vec b$ 的合成通常叫做向量 $\\vec a$ 与 $\\vec b$ 的和. 这时，记",
      "last24_codepoints": [
        "c",
        " ",
        "a",
        "$",
        " ",
        "与",
        " ",
        "$",
        "\\",
        "v",
        "e",
        "c",
        " ",
        "b",
        "$",
        " ",
        "的",
        "和",
        ".",
        " ",
        "这",
        "时",
        "，",
        "记"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 11,
      "block_ref": "p0067#3",
      "text": "法 $\\vec b\\cdot\\vec a=\\vec c$ 可以写成 $\\vec a+\\vec b=\\vec c$.",
      "last24_codepoints": [
        " ",
        "$",
        "\\",
        "v",
        "e",
        "c",
        " ",
        "a",
        "+",
        "\\",
        "v",
        "e",
        "c",
        " ",
        "b",
        "=",
        "\\",
        "v",
        "e",
        "c",
        " ",
        "c",
        "$",
        "."
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 12,
      "block_ref": "p0067#4",
      "text": "研究任意的点 $A$，$B$，$C$（图 72，а）. 从关于两个向量的合",
      "last24_codepoints": [
        "$",
        "，",
        "$",
        "C",
        "$",
        "（",
        "图",
        " ",
        "7",
        "2",
        "，",
        "а",
        "）",
        ".",
        " ",
        "从",
        "关",
        "于",
        "两",
        "个",
        "向",
        "量",
        "的",
        "合"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 13,
      "block_ref": "p0067#4",
      "text": "成的定理推出等式：",
      "last24_codepoints": [
        "成",
        "的",
        "定",
        "理",
        "推",
        "出",
        "等",
        "式",
        "："
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 14,
      "block_ref": "p0067#4",
      "text": "$\\overrightarrow{AB}+\\overrightarrow{BC}=\\overrightarrow{AC}$ （3）",
      "last24_codepoints": [
        "\\",
        "o",
        "v",
        "e",
        "r",
        "r",
        "i",
        "g",
        "h",
        "t",
        "a",
        "r",
        "r",
        "o",
        "w",
        "{",
        "A",
        "C",
        "}",
        "$",
        " ",
        "（",
        "3",
        "）"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 15,
      "block_ref": "p0067#5",
      "text": "实际上，向量 $\\overrightarrow{AB}$ 将 $A$ 映射成 $B$，向量 $\\overrightarrow{BC}$ 将 $B$ 映射成",
      "last24_codepoints": [
        "i",
        "g",
        "h",
        "t",
        "a",
        "r",
        "r",
        "o",
        "w",
        "{",
        "B",
        "C",
        "}",
        "$",
        " ",
        "将",
        " ",
        "$",
        "B",
        "$",
        " ",
        "映",
        "射",
        "成"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 16,
      "block_ref": "p0067#7",
      "text": "图 72",
      "last24_codepoints": [
        "图",
        " ",
        "7",
        "2"
      ],
      "trailing_ascii_spaces": 0
    },
    {
      "ordinal": 17,
      "block_ref": "p0067#8",
      "text": "$\\bullet$ 60 $\\bullet$",
      "last24_codepoints": [
        "$",
        "\\",
        "b",
        "u",
        "l",
        "l",
        "e",
        "t",
        "$",
        " ",
        "6",
        "0",
        " ",
        "$",
        "\\",
        "b",
        "u",
        "l",
        "l",
        "e",
        "t",
        "$"
      ],
      "trailing_ascii_spaces": 0
    }
  ],
  "all_math_spans": [
    {
      "tex": "\\vec b\\cdot\\vec a",
      "display": false
    },
    {
      "tex": "M",
      "display": false
    },
    {
      "tex": "N",
      "display": false
    },
    {
      "tex": "M_2",
      "display": false
    },
    {
      "tex": "N_2",
      "display": false
    },
    {
      "tex": "\\overrightarrow{MM_2}=\\overrightarrow{NN_2}",
      "display": false
    },
    {
      "tex": "|MN|=|M_1N_1|",
      "display": false
    },
    {
      "tex": "|M_1N_1|=|M_2N_2|",
      "display": false
    },
    {
      "tex": "|MN|=|M_2N_2|",
      "display": false
    },
    {
      "tex": "[MN)\\uparrow\\uparrow[M_1N_1)",
      "display": false
    },
    {
      "tex": "[M_1N_1)\\uparrow\\uparrow[M_2N_2)",
      "display": false
    },
    {
      "tex": "[MN)\\uparrow\\uparrow[M_2N_2)",
      "display": false
    },
    {
      "tex": "MN",
      "display": false
    },
    {
      "tex": "M_2N_2",
      "display": false
    },
    {
      "tex": "MNN_2M_2",
      "display": false
    },
    {
      "tex": "\\overrightarrow{MM_2}=\\overrightarrow{NN_2}",
      "display": false
    },
    {
      "tex": "[MN)",
      "display": false
    },
    {
      "tex": "[M_2N_2)",
      "display": false
    },
    {
      "tex": "\\blacksquare",
      "display": false
    },
    {
      "tex": "\\vec a",
      "display": false
    },
    {
      "tex": "\\vec b",
      "display": false
    },
    {
      "tex": "\\vec a",
      "display": false
    },
    {
      "tex": "\\vec b",
      "display": false
    },
    {
      "tex": "\\vec b\\cdot\\vec a=\\vec c",
      "display": false
    },
    {
      "tex": "\\vec a+\\vec b=\\vec c",
      "display": false
    },
    {
      "tex": "A",
      "display": false
    },
    {
      "tex": "B",
      "display": false
    },
    {
      "tex": "C",
      "display": false
    },
    {
      "tex": "\\overrightarrow{AB}+\\overrightarrow{BC}=\\overrightarrow{AC}",
      "display": false
    },
    {
      "tex": "\\overrightarrow{AB}",
      "display": false
    },
    {
      "tex": "A",
      "display": false
    },
    {
      "tex": "B",
      "display": false
    },
    {
      "tex": "\\overrightarrow{BC}",
      "display": false
    },
    {
      "tex": "B",
      "display": false
    },
    {
      "tex": "\\bullet",
      "display": false
    },
    {
      "tex": "\\bullet",
      "display": false
    }
  ],
  "audit": {
    "page": 67,
    "lines_printed": 17,
    "lines_md": 17,
    "figures": [
      {
        "id": "fig-72",
        "label": "图 72",
        "box": [
          179,
          1278,
          1022,
          553
        ],
        "components": 39,
        "from": [
          170,
          1270,
          1050,
          570
        ]
      }
    ],
    "normalizations": [],
    "unknown_chars": [],
    "katex_warnings": [],
    "errata": 0,
    "count_exclusions": [],
    "errors": []
  }
}
```

## Freeze
Source author batch stops here. §17 and exercises174-178 are closed by this source batch; §18 remains OPEN, with the last physical67 paragraph ending exactly in 映射成. No next-page inference is supplied.
Parent may disclose the full package only after the independent Stage A freeze; no reviewer output was read.
