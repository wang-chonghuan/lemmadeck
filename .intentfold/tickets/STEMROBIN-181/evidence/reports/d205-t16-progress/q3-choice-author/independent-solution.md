# Independent Source Solution

Recorded before constructing any alternatives. Author scope: STEMROBIN-181, D032 t16, source exercise 3 only. This is an author's derivation, not an independent semantic review or an approval.

## Input Authority

Only the Chinese and English prepared seeds under `d190-t16-q3-inputs/{zh,en}-choice-repo/.tmp/seed.json` supply the written problem. Both contain exactly source number 3: fixed inductance L = 2 x 10^-4 H and variable capacitance C from 12 to 450 pF, with Figure 120. Neither seed selects a concept paragraph. No answer, standard solution, previous choice, ticket history, answer-inputs.json or large manifest was consulted.

The two actually opened images are recorded in opens.json. The original pixels show an antenna and ground, an inductor and variable capacitor connected across the same two tuning nodes, followed by a diode and a separate output capacitor/headphone branch. The complete 640 x 400 modern preview preserves these connections and explicitly labels L, C, Diode and Headphones. The rightmost headphone symbols and bottom ground/label are visible. The output capacitor is not the variable tuning C.

## Task and Necessary Conditions

Determine the full attainable tuning-wavelength interval, not one wavelength at an arbitrary capacitance. Determine which capacitance endpoint produces each wavelength endpoint.

Use the textbook ideal LC resonance model: fixed L, positive continuously variable C including both stated endpoints, and negligible damping/loading and parasitic capacitance. The given C represents the effective tuning capacitance; do not add the separate detector/output capacitor. Take electromagnetic-wave speed c = 3.0 x 10^8 m/s. These modeling/numerical assumptions must be visible in the authored stem, since the seeds do not supply selected definitions or a numerical wave speed.

The incident signal must have frequency equal to the tuning circuit's resonant frequency for resonant tuning. The calculation describes the ideal tuning interval; it does not guarantee a broadcast signal, sufficient antenna signal, practical bandwidth or receiver sensitivity at every wavelength.

## Derivation

For free ideal LC oscillations, L d^2q/dt^2 + q/C = 0, hence angular frequency omega_0 = 1/sqrt(LC), ordinary frequency f_0 = 1/(2 pi sqrt(LC)), and period T_0 = 2 pi sqrt(LC). Resonant tuning requires f_signal = f_0. Therefore lambda = c/f_0 = c T_0 = 2 pi c sqrt(LC).

Convert capacitance before substitution:

- 12 pF = 12 x 10^-12 F = 1.2 x 10^-11 F.
- 450 pF = 450 x 10^-12 F = 4.5 x 10^-10 F.

At C = 12 pF:

- LC = 2.4 x 10^-15 s^2.
- T_0 = 3.0781195923884737 x 10^-7 s.
- f_0 = 3.248736671806984 x 10^6 Hz.
- lambda = 12 pi sqrt(6) m = 92.34358777165421 m.

At C = 450 pF:

- LC = 9.0 x 10^-14 s^2.
- T_0 = 1.884955592153876 x 10^-6 s.
- f_0 = 5.305164769729844 x 10^5 Hz.
- lambda = 180 pi m = 565.4866776461628 m.

For L > 0 and C > 0, d(lambda)/dC = pi c sqrt(L)/sqrt(C) > 0. Thus increasing C increases wavelength and decreases resonant frequency. Continuity and attainable capacitance endpoints give the complete closed interval [12 pi sqrt(6), 180 pi] m, approximately 92.3 to 565.5 m. The minimum wavelength corresponds to 12 pF and the maximum to 450 pF. Square brackets apply to the exact endpoints; displayed decimals are rounded to one decimal place, not newly exact cutoffs.

Dimensional check: H F = s^2, so c sqrt(LC) has units m. Range ratio: lambda_max/lambda_min = sqrt(450/12) = sqrt(37.5) = 6.123724356957945.

## Intended Response Unit

One complete result, containing the range with units and its two capacitance-endpoint correspondences, is one coherent mathematical task. A native single-choice question can measure resonance-model application, SI conversion, square-root scaling, frequency/wavelength direction and endpoint reasoning without splitting the result into arithmetic blanks. Do not provide the LC formula or endpoint direction in the visible stem.

## Capacity Limits

Selection cannot demonstrate unaided production of the LC formula, numerical calculations or a written monotonicity/resonance explanation. These losses must remain explicit in draft coverage. No source numerical endpoint or tuning-range subtask is omitted; the result remains conditional on the stated ideal model. Do not add an artificial open-ended question to conceal the production loss.
