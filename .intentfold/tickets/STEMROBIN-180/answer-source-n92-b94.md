# n92 ANSWER SOURCE-only, b94

Status: **PASS_SOURCE_ONLY**. All **5** written questions independently solved from the frozen source/candidate lesson and question texts after FIRST TEXT PASS was frozen. Complete reference facets by question: **3 / 2 / 3 / 4 / 5**, total **17**. No author answers, keys, book answers, answer drafts/history, choices, internal intents or images were read. No key comparison or answer-key approval is claimed.

TEXT prerequisite: `tmp/resume-180-4/n92-FIRST-TEXT/manifest.json` below this ticket, 4370 bytes, SHA-256 `70b7cc83c8e7d1a54f2d83bee84c6cb464f25acc191766edd360114ce8b7ff3b`, verified/frozen mode `0444`.

The direct user SOURCE-before-key contract controls the sequencing, in addition to `ld-s10y-answer` SKILL and Gate 2's complete-solution/unit/grading requirements. The worktree's Gate 2 does not separately define the SOURCE/key split; no missing split rule was invented as a completed key review.

## 1. 比热定义

Source: question `p0242#5`; lesson `p0240#14`, prose[1].

**解：**使单位质量（1克或1千克）的某种物质温度升高1摄氏度所需的热量，叫做这种物质的比热。

Three facets: unit mass of a specified material; rise of 1 degree Celsius, not an absolute temperature; required/absorbed heat under those conditions. “每千克物质每升温1摄氏度所吸收的热量” is an equivalent definition. Listing all three unit conventions or the letter c is not required. Omitting mass normalization or temperature increment is incomplete.

Solvable directly from text, no figure. **Ungraded/free**: open semantic definition, not a numeric result.

## 2. 水的比热，两个指定单位

Source: question `p0242#6`; lesson `p0240#13`, `p0240#14`, `p0241#6` + `p0242#1`, prose[0,1,7].

**解：**依题目单位顺序，为 **4200 焦耳/(千克·摄氏度)** 和 **1 卡/(克·摄氏度)**。

Two facets: 4200 with the first unit; 1 with the second unit. The lesson gives 1 千卡/(千克·摄氏度); multiplying both numerator and denominator by 1000 yields 1 卡/(克·摄氏度). This is prefix conversion, not a new joule/calorie precision. The table is unnecessary. Keep the source's 4200, not 4184.

Accepted number-equivalent forms include 4200 or 4.2×10^3 for the first fixed-unit part, and 1 or 1.0 for the second. Unit spellings J/(kg·°C) and cal/(g·°C) carry the same requested meaning. Units must be explicitly associated with their respective part; units need not be typed again into a fixed-unit numeric field.

Solvable. **Numeric grading feasible only as two separately labeled parts**, in the printed order; neither a one-part answer nor a combined free-text string establishes both quantities. No runtime or author-key validation performed.

## 3. 铅的 140 的意义

Source: question `p0242#7`; lesson `p0241#4`, prose[5].

**解：**1千克铅温度升高1摄氏度时需要吸收140焦耳；同样质量的铅温度降低1摄氏度时放出140焦耳。

Three complete reference facets: 1 kg lead; +1 degree Celsius / absorb 140 J; -1 degree Celsius / release 140 J. “每千克铅每升温1摄氏度吸热140焦耳，每降温1摄氏度放热140焦耳” is equivalent. The printed heating-only definition-side explanation is scientifically valid but omits the full reference's cooling counterpart; it must not be called false solely for that omission.

Solvable directly. **Ungraded/free**: the requested interpretation needs mass, temperature and heat direction, not just the number 140.

## 4. 比热与内能变化

Source: question `p0242#8`; lesson `p0240#14`, `p0241#4`, `p0241#5`, `p0241#6` + `p0242#1`, prose[1,5,6,7].

**解：**比热表示1千克某种物质升温1摄氏度时，其内能增加多少焦耳（或千卡）。相同质量、相同温差下，比热越大，内能变化量越大。本课仅考虑传热、物态不变时，升温增加内能，降温放热则减少内能。

Four complete reference facets: reference mass/temperature normalization; the corresponding internal-energy increase and energy unit; the cooling/decrease counterpart; larger c gives a larger change magnitude at equal mass/temperature change. The first two are the direct bold source statement; the latter two are explanatory consequences, not grounds to call an otherwise correct core statement scientifically false.

The derived relation ΔU = cmΔT is an accepted **optional** elaboration when m is in kg, ΔT in degrees Celsius, c in J/(kg·degree Celsius), ΔU in J, and only heat exchange, fixed state and effectively constant c are assumed. It is not required wording. It must not be applied unchanged through a phase transition or asserted for arbitrary mechanical work. Specific heat is not total internal energy.

Solvable from text. **Ungraded/free**: a bare formula does not assess the requested physical meaning and conditions.

## 5. 水域附近气温

Source: question `p0242#9`; lesson `p0242#2`, prose[8].

**解：**水比热大，夏季水温升高时吸收大量热，使附近地区不那么炎热；冬季水温下降时又放出大量热，使附近不那么寒冷。因此大型水域缓和附近气温。

Five facets: large water specific heat; summer absorption; nearby summer heat moderation; winter release; nearby winter cold moderation. “夏季吸热使附近较凉爽，冬季放热使附近较暖和” is equivalent when connected to large specific heat. One season alone is incomplete; heat directions cannot be reversed. No numeric temperature, additional weather mechanism or table evidence is needed.

Solvable directly. **Ungraded/free**: multi-facet seasonal causal reasoning.

## Freeze And Stop

Machine solution: `tmp/resume-180-4/n92-ANSWER-SOURCE/solutions.json`; exact full-input/output bindings: its sibling `manifest.json`, below this ticket. This note and those two files are frozen mode `0444`.

Parent must bind the SOURCE manifest and exact solution/note hashes **before any author-answer disclosure**. This worker stops at SOURCE freeze. Pending modern table FIG work remains independent and unapproved here; no template/source/figure/app edit, finalize, promotion, browser, DB, network, paid call, Git or full test was performed.
