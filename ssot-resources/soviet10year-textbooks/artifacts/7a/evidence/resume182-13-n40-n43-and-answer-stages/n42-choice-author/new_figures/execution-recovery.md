# FigureSpec contract-shape recovery

Both initial render commands exited 1 before a browser or SVG was created.
The validator reported that collinear assertions require named `a`, `b`, `c`
coordinate fields. The initial specs used a `points` array.

The initial specs are retained as `*.spec.failed-contract.json`. The repair
only transcribes the identical three coordinates into the required named
fields. No curve, line, frame, intended relationship, or source fact changes.
This is execution-contract recovery, not mathematical or visual approval.
Paid calls: zero. Network calls: zero. Installed dependencies: zero.
