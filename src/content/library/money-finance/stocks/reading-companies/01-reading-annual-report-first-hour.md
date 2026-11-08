---
title: "The first hour with an annual report: a reading order that finds the truth"
description: How to spend your first hour with an Indian annual report — the six pages to read before the shareholders letter, what to search, and the numbers that expose weak businesses.
pubDate: 2026-07-15
author: Chirag Singhal
type: article
tags:
  - annual-report
  - fundamental-analysis
  - financial-statements
  - research
  - due-diligence
difficulty: intermediate
toc: true
legal: reference
source:
  title: Rupee Realism
  url: https://github.com/chirag127/arac
  license: MIT
disclaimer: This article is educational and does not constitute financial, tax, investment, or legal advice. Rules, rates, and product terms change; verify current details with the relevant authority or a qualified professional before acting.
reviewStatus: editorial
license: CC BY 4.0
---

An annual report is a legally required disclosure, not a marketing brochure — though the first thirty pages are
marketing. The management discussion, the photographs of factories, the vision statements: skip all of it on
your first pass. The report is around 250 pages; about 20 of them contain everything that matters, and they are
in fixed locations because the Companies Act, 2013 and SEBI's listing regulations prescribe them. This is a
reading order for the first hour — where to go, what to search, and what a good answer looks like.

## Minutes 0-10: the financial highlights and the auditor

Open the report and find the **financial highlights** page (usually the second or third page). Five numbers,
five years: revenue, operating profit, net profit, EPS, dividend. You are looking for shape, not level. Revenue
flat but profit up 40% — margins are doing the work; ask what changed. Revenue up 30% a year with profit up 5%
— growth is being bought; ask with what. Profit up with a dividend payout ratio that keeps falling — ask where
the cash is going.

Then the **Independent Auditor's Report** — the single most under-read page in Indian investing. Read the
_opinion_ paragraph first: "in our opinion ... a true and fair view" is unqualified; anything beginning "except
for", "subject to", or "based on our consideration of ..." is qualified, and a qualified opinion is a serious
finding. Then the **Key Audit Matters** and **Emphasis of Matter** paragraphs, which flag items the auditor
cannot cleanly sign: unsettled litigation, going-concern doubt, related-party balances, prior-period
restatements. An emphasis-of-matter paragraph on recoverability of loans to related parties has preceded more
Indian corporate disasters than any screen ever has.

| Auditor phrase                     | Plain meaning                                        | Severity                         |
| ---------------------------------- | ---------------------------------------------------- | -------------------------------- |
| "True and fair view" (unmodified)  | Clean opinion                                        | Normal                           |
| "Based on our consideration of..." | Opinion leaning on another auditor's work            | Look into the subsidiary         |
| "Subject to the outcome of..."     | Matter unresolved; numbers may move                  | Investigate the contingency      |
| "Except for the effects of..."     | Qualified opinion — a real disagreement              | Treat as a red flag              |
| Adverse opinion / disclaimer       | Statements are not fairly stated / scope too limited | Walk away or price for the worst |

## Minutes 10-25: the notes that carry the skeletons

The **Notes to Accounts** are where the balance sheet stops being a summary and becomes a confession. Three
notes carry most of the truth:

**Related party transactions (AS 24 / Ind AS 24).** Every rupee the company paid or received from entities its
promoters control, with names and amounts. Read the _character_ of the flow: does the listed company sell
services to promoter-owned entities (revenue possibly inflated), buy from them (costs possibly padded), lend
them money (a cash exit route), or guarantee their borrowings (contingent liability)? A note showing ₹180 crore
of sales to a promoter-group marketing company that received ₹180 crore of "services" in return deserves an
explanation. There is a whole article on
[related-party transaction detection](/money-finance/stocks/related-party-transaction-detection/) for the deeper method.

**Contingent liabilities.** What the company could owe but does not yet: disputed taxes, pending litigation,
corporate guarantees, letters of credit. Sum them and compare with net worth. Contingent liabilities over 25% of
net worth means a court case can restructure the company.

**Segment reporting.** If the company reports multiple segments, check which segment actually earns the profit
and which is consuming it. Many "diversified" companies are one good business funding three slow ones, and the
market values the whole at the good business's multiple until it looks closely.

## Minutes 25-40: cash flow versus profit, over five years

Single-year cash flow statements mislead; five-year patterns do not. Build this table — it takes ten minutes and
is the highest-value analysis an individual investor can do:

| ₹ crore (5-year totals, illustrative) | Good compounding machine | Serial capital sink | Possible fabri­cation risk |
| ------------------------------------- | ------------------------ | ------------------- | -------------------------- |
| Net profit                            | 1,000                    | 1,000               | 1,000                      |
| Operating cash flow                   | 1,150                    | 700                 | 1,050                      |
| Capex (fixed assets + CWIP)           | 550                      | 1,600               | 300                        |
| Free cash flow (OCF − capex)          | 600                      | −900                | 750                        |
| Debt over the period                  | Flat                     | Up 1,200            | Flat                       |

The first column is a business funding its own growth and returning the surplus. The second is a business that
converts profit into fixed assets nobody can value — check whether revenue per rupee of gross block is rising;
if a company's gross block triples while revenue doubles, capacity is being built without earning capacity. The
third is the dangerous one: profit close to operating cash flow but _no capex and no debt increase_ — the money
must have gone somewhere. Look for it in "loans and advances", "investments in group concerns" or
"other current assets". This is the classic signature of the Satyam-era style of misreporting, and it is findable
in five-year data.

## Minutes 40-50: management discussion, read against the numbers

Only now read the MD&A — and read it as a claim sheet to be verified. Every statement has a testable form:
"margin expansion driven by operating leverage" — check the margin; "deleveraging on track" — check the
debt/equity and interest coverage; "strong order book" — check whether disclosure norms require it to be
quantified and whether the number appeared; "focused on shareholder value" — check dividend, buyback and
promoter stake history. Then read the **related party section of the Board's report** and the **remuneration of
directors**: promoter salary rising steadily with profit flat is the quiet wealth transfer no screen catches.

Also check the Board's report against the mandatory disclosures of the listing regulations — related-party
transactions (Regulation 23), the auditor-complied secretarial standards, and the percentage of independent
directors actually meeting the definition. A board where the independent directors have served 12 years is not
independent in any practical sense.

## Minutes 50-60: search the document

The fastest due diligence is Ctrl+F. Run these searches before forming any opinion: "pledge" (promoter
encumbrance), "default" (any missed obligation), "CIRP" and "insolvency" (IBC proceedings), "litigation"
(quantified contingencies), "related party" (the note's location), "resignation" (auditor or CFO exits), "statutory
auditor" (whether the same firm has signed for years — a long relationship is comfort to some, tail risk to
others), "subjudice", "restat", "receivable" and "CWIP" (capital work in progress — CWIP that never converts to
gross block is capital that went somewhere). Every hit deserves one minute. The ones that land on auditor notes
deserve ten.

<figure class="callout">
  <div class="callout-title">The five-year check that beats a spreadsheet</div>
  <p>
    Compute cumulative five-year free cash flow and divide by cumulative five-year net profit. Below 0.5, the
    reported profit has not become cash; the business either consumes capital or embellishes numbers. Above 0.8,
    the profit is real and the argument is only about growth and price.
  </p>
</figure>

## The legality note

The annual report's content requirements are statutory: the Companies Act, 2013 read with Schedule III of the
financial statement rules fixes the form of the financial statements, board report and auditor's report, and the
SEBI (LODR) Regulations, 2015 add the disclosures specific to listed companies. Companies that understate
liabilities, round-trip revenue or misstate related-party flows face scrutiny by SEBI's investigation arm and
the Serious Fraud Investigation Office, and can face penalties, disgorgement and prosecution of officers — which
is why the auditor's report and notes, being the legally signed parts of the document, deserve the first and not
the last minutes of your hour. The listing regulations are at
[sebi.gov.in](https://www.sebi.gov.in).

## What you can and cannot conclude in an hour

An hour of reading will not tell you whether the business will compound. It _will_ tell you whether the
reporting is coherent, whether the auditor had to strain to sign, whether cash follows profit, and whether
promoters transact with their own listed company in ways that need explaining. That is the difference between a
stock you own because a screen said cheap and a stock you own because you have read the document that the law
required them to write. Do the hour on two or three companies a year, and the annual report stops being a
gate-keeping chore and becomes what it is: the company's own account of itself, signed by people who can go to
jail for getting it wrong.
