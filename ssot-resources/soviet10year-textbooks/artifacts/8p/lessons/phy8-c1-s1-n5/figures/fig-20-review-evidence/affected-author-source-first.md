# Figure 20 independent source-pixel freeze

Recorded on 2026-11-23 before reading any previous Figure 20 spec, author
report, or reviewer report. The original PNG was opened exactly once:
ssot-resources/soviet10year-textbooks/artifacts/8p/figures/fig-20.png.
No crops, alternate images, or reopens were loaded.

## Actual relevant pixels

- One planar vector construction above a horizontal x-axis. Four named
  projection feet have left-to-right order A, B, D, C.
- Vector a goes from the upper point above A to the upper point above B,
  slightly upwards and rightwards. Vector b continues from that point to
  the highest point above C. Vector c goes from that highest point
  downwards and leftwards to the point above D. Vector f goes directly
  from the start above A rightwards to the endpoint above D, with a
  slight downward slope in the source.
- The source prints arrow-decorated a, b, c, f labels by those vectors.
  Vertical broken projection drops connect the four vector vertices
  to their feet. The drop above B is partly visible through the vector
  construction; those above D and C are longer, visibly broken lines.
- A separate horizontal projection-indicator family lies between the
  foot labels and the x-axis. It has directed horizontal strokes,
  including an A-to-D rightward indication and a C-to-D leftward
  indication. These are not the two curved brackets below the axis.
  The above-axis family visibly mixes continuous and broken horizontal
  strokes, notably a continuous left portion and a broken B-to-D
  portion near the upper projection row. Preserve this distinction;
  an all-solid dimension treatment loses source information.
- The above-axis projection labels are f_x over the A-to-D span and
  c_x over the D-to-C span. Short bends/humps are visible in the upper
  horizontal strokes. The low-resolution scan alone does not justify
  converting every bend into an additional mathematical bracket.
- Below the axis there are two genuinely curved underbrackets:
  a_x spans A to B, and b_x spans B to C, sharing the B boundary.
  There are no numeric tick labels, coordinate values, or extra named
  projection endpoints in the source.
- The x-axis itself is solid, points right, and is labelled x near
  its right arrowhead. Projection arrows above it must remain distinct
  from the axis and the below-axis a_x/b_x brackets.

## Boundaries of this observation

The source is a thick, low-resolution monochrome scan. The exact shape
of tiny arrowheads, the short curved upper strokes, and stroke widths
are not numerical data. Any straightened/offset projection row,
auxiliary endpoint marker, colour, or deterministic coordinate is a
modern rendering choice and must be declared separately from source
facts. No extra bracket, label, numerical tick, coordinate, or altered
vector/component mathematics is authorized by this freeze.

Image-load budget used at freeze: source 1/1; repaired preview 0/1.
This file is frozen and will not be revised to match prior reports.
