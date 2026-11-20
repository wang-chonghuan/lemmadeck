---
name: ips-content-design
description: Load when content is being planned, judged, written, or cleaned up — a page, screen, report, email, help article, empty state, or a prompt and template that will make a model generate many pages. Covers deciding who reads it, what it answers, what goes on it and in what form, what each generated field may contain, and checking the copy line by line for machine-written filler. Triggers include "ips-content-design", "content design", "这个页面该放什么", "帮我设计这个页面的内容", "生成一个内容页", "AI 生成的内容太水", "防止 AI slop", "给生成内容定个内容模型", "审一下文案", "这文案像机器写的", "clean up this copy", "design the content for this page". Do not load for visual styling.
---

# ips-content-design

Use this skill when content is being planned or written: a web page, app screen, report, email, help article, or a prompt and template that will make a model generate many pages. It decides who the reader is and what they came to do, the one question the page answers, what goes on the page and in what order, what form each piece takes, and, for generated pages, what each field may contain. The words are written last, and checked line by line.

## Capabilities

- **cap1 Design**: plan new content, or restructure content that is being rewritten. Workflow below.
- **cap2 Review**: judge an existing page, or a sample of generated pages, at the level of structure: what is on the page and why. Workflow below.
- **cap3 Copy**: write the words for a page whose structure is settled, or audit existing copy line by line. Read `references/copy.md`.

When a request covers both structure and wording, run cap1 or cap2 first. Rewording cannot fix a page that answers the wrong question.

All three produce a brief, a report, or draft copy. Edit the target only when the user asks.

## Why AI content turns into slop

A request like "generate a content page about X" gives the model a topic and an empty page. It does not say who will read the page or what they are trying to do. With no reader defined, nothing the model could write counts as off-topic, so it fills the page with everything plausibly related: an overview, background, benefits, a summary, an FAQ. Each paragraph is fluent, and the page as a whole helps nobody.

Two consequences shape this skill.

First, the fix has to happen before writing. When editors annotated AI-written text, the strongest predictors of calling it slop were relevance to the task, information density, and tone. Relevance and density are about whether the text serves the reader at all, and editing sentences does not change them: a page about the wrong thing stays slop however well each sentence reads. The same study found that LLMs asked to spot slop flagged a quarter or less of what human editors flagged, so a model re-reading its own draft and asking "does this read like slop?" will pass most of it (Shaib et al., *Measuring AI "Slop" in Text*, 2025).

Second, a fixed list of required parts brings the problem back. A common suggestion is to make the model always give a one-line conclusion, key differences, specific numbers, sources, and a confidence level. That list is a new set of empty slots. The model will fill every slot on every page, whether or not this reader needs a comparison or a confidence level. The parts of a page have to be chosen from the reader's job, page by page.

The rule this skill applies:

> Before writing, write down what the reader is trying to do. Every element on the page must help with that. An element that does not help is removed or moved off the page. Rewording it does not fix it.

## Inputs

Required: the content to design or review (a brief, draft, URL, screenshot, or a generator prompt with sample outputs), and its purpose as the owner sees it.

Evidence of what readers need, strongest first:

1. What readers type or say: search queries, site search, support tickets, interview or sales notes, feedback.
2. What readers do: analytics, drop-off, task completion.
3. What the team believes.

Look in the project for the first two before asking the user. When there is no evidence, still write the job story, mark it as an assumption, and say what evidence would confirm it.

Facts come from the data, the source documents, or a domain expert, usually the user. Do not take facts from the model's general knowledge when the page presents them as specific to this product, place, or person.

## cap1: Design

Do the steps in order. Each step can remove material. No step adds material to fill space.

1. **Write the job story.** "When [situation], I want to [do or find out something], so I can [outcome]." Use the reader's own words from the evidence. The situation matters most: the same person needs a different page when comparing options than when they have already chosen one. Two job stories that need different answers mean two pages.

2. **Write the one question the page answers.** One sentence, in the reader's words, that the top of the page will answer. If it needs "and", split the page or turn the second part into a link to another page.

3. **Rank everything that could go on the page.** List every candidate element (facts, data, actions, explanations) and rank them by how much they help the job story. Give each one a line saying why it is there, tied to the job story. Cut any element whose only reason is "pages like this usually have one", "we have the data", or "it might be useful". Move secondary material behind a link, into an expandable section, or to another page. This ranked list is the content priority guide, and it is also the layout order from top to bottom.

4. **Choose the form of each element before writing it.** Prose suits explanation and reasoning. Most other things work better in another form:

   | The reader needs to | Use |
   |---|---|
   | get the answer | one sentence or one number, at the top |
   | compare options | a table |
   | decide or act | a button, link, or choice |
   | work out their own case | an input or a small calculator |
   | follow a process | numbered steps |
   | look up values | a list or label–value pairs |
   | see change or proportion | a chart |

   Many elements need no sentence at all: a number with its label, a status, a link.

5. **Model the content if the page is generated, templated, or repeated** (product pages, profile pages, reports built from data, anything a model produces many times). Define every field (purpose, source, length, form, and what happens when its data is missing) before writing a prompt or template. Read `references/content-model.md` for the format and for how to turn the model into a generator prompt and checks. Skip this step for a one-off page.

6. **Write the words.**
   - Put the answer first: in the title, the first sentence, and the first words of each heading and list item.
   - Keep one idea per paragraph. GOV.UK keeps most sentences under about 25 words and writes for a reading age of 9 even for specialists, because specialists also read faster in plain language.
   - Use the words from the evidence in step 1. Translate or cut any term that exists only inside the team or the codebase.
   - Name the subject and use active verbs, so the reader can see who does what.
   - Leave out introductions that describe the page, summaries that repeat it, and FAQ sections. GOV.UK dropped FAQs because they repeat content that should have been structured around the reader's need in the first place.

   Then run cap3 on the draft.

7. **Test the draft.**
   - Deletion test, on every element: remove it and ask what the reader in the job story loses. If they lose nothing, leave it deleted.
   - First-screen test: hide everything below the first screen. Check whether the reader can answer the one question from what is left.
   - Highlighter test, when real readers are available: ask them to mark what helps them in green and what confuses them or makes them doubt the page in red. Rewrite the red parts, and check that the green parts sit where the priority guide put them. Follow up with a task-based usability test, then with product data such as search exits, support contacts, and task completion.
   - Do not use "does this read like AI?" as the check, from yourself or another model. As noted above, models miss most of it.

8. **Work with whoever knows the facts.** Act as the content designer, and treat the user or a named expert as the domain expert. You are responsible for the reader's need, the structure, and the plain language. They are responsible for whether it is true. Ask them for any fact you do not have, and do not write a plausible one in its place. Before drafting at scale, show them the job story, the priority guide, and the content model if there is one, and ask for a quick critique. A mistake at that stage is repeated on every generated page.

cap1 returns a brief:

```markdown
# Content Design: <page>

## Job story
When ..., I want to ..., so I can ...
Evidence: <queries, tickets, notes; or "assumption, confirm with ...">

## The question this page answers

## Priority guide
| # | Element | Why it is here | Form | Where the facts come from |

## Cut or moved
| Element | Moved to, or cut | Why |

## Content model
<only for generated or repeated pages; see references/content-model.md>

## Draft
<only when asked, or when the page is short>

## How to test it
```

## cap2: Review

1. Reconstruct the job story from the evidence. If the page cannot be tied to any reader need, report that as the main finding.
2. Write the question the page should answer, and the question it answers now. Note when it answers none, or several.
3. For each element, record why it is there (tied to the job story) and whether to keep it, move it, or cut it.
4. Check the form of each kept element against the table in cap1 step 4.
5. For generated pages, check whether a content model exists. Read 5 to 10 real outputs, including ones with sparse data, and look at what the page shows when data is missing and whether every page repeats the same sentence shapes.
6. Run the deletion test and the first-screen test.
7. If the wording is also in scope, run a cap3 audit after the structural findings, on the elements that survive.

cap2 returns a report:

```markdown
# Content Design Review

## Verdict
- Status: Pass | Needs Improvement | Fail
- Target:
- Job story: <with evidence, or marked as assumption>
- Question it should answer:
- Question it answers now:

## Findings
1. Severity: Blocker | Major | Minor
   Element:
   Problem:
   Change: keep | move to ... | cut | change form to ...

## Recommended priority guide
```

If there are no findings, write `No findings.` under `## Findings`.

Severity:

- **Blocker**: the reader in the job story cannot get the answer, or gets a wrong one, for example invented facts or missing data presented as content.
- **Major**: the answer is there but buried under elements that do not serve the job story, or given in the wrong form.
- **Minor**: order and wording that would improve on a second pass.

## Rules

- Do not write copy until the job story and the one question are written down.
- Do not use a fixed list of sections as the design. Include a conclusion, a comparison, sources, or a confidence level only when this reader's job needs it, and then once, at the point where the reader decides.
- When data for an element is missing, leave the element out. Do not write a sentence about the missing data.
- Do not invent facts, numbers, quotes, or reader needs to complete a section. Remove the section instead.
- Do not keep an element only because the data for it exists.
- Keep methodology, data-quality notes, and how the page was generated out of the body. If the reader needs them to trust a number, add one short note at the end.
- Lists of AI-sounding words ("delve", "tapestry") describe symptoms. Removing them does not help a page that answers the wrong question, and such lists go out of date as models change. Fix relevance first. The defect list in cap3 is different: each item there is a way a line fails the reader, found on real pages.
