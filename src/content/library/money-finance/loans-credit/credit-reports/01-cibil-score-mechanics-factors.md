---
title: "CIBIL score mechanics: what the number is made of, what moves it, and what does not"
description: How your CIBIL score is actually computed — the weightings on repayment history, utilisation, credit mix, hard enquiries and age — with the ranges, the myths and the timelines that apply.
pubDate: 2026-08-25
author: Chirag Singhal
type: article
tags:
  - cibil
  - credit-score
  - credit-utilisation
  - borrowing
  - credit-report
difficulty: beginner
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

A three-digit number between 300 and 900 decides the rate you are offered on every loan and, increasingly, whether
you are offered credit at all. Most advice about it is folklore — close the cards, raise the limit, check it
weekly. The score is a model, the model has documented inputs, and the inputs have measurable weights. Here is
what the number is made of.

## The composition

CIBIL (TransUnion CIBIL, licensed by the RBI as a credit information company) scores on the standard weighting
across consumer bureau models:

| Factor                  | Weight | What it measures                                                           |
| ----------------------- | ------ | -------------------------------------------------------------------------- |
| Payment history         | ~30%   | On-time payments across loans and cards; defaults, settlements, write-offs |
| Credit exposure         | ~25%   | How much of available credit you use and owe across accounts               |
| Credit mix and duration | ~25%   | Share of secured vs unsecured; age of oldest account                       |
| Hard enquiries          | ~20%   | Recent applications for credit                                             |
| Other factors           | —      | New accounts, recency of activity                                          |

The precise formula is proprietary and weighted variants exist across scores (CIBIL's own score versions change),
but the ordering is stable and universal across bureaus: pay on time, keep utilisation low, keep accounts old,
apply rarely. Nothing else in the folklore — income, savings balance, keeping money in the same bank, closing old
cards to "simplify" — enters the model in the way people believe.

## Utilisation: the fastest-moving input

Credit utilisation ratio (CUR) is the balance you report against the limit on each card and in aggregate. It is
reported monthly from lender data feeds, which makes it the only major factor you can move within a single
statement cycle:

| Aggregate CUR | Typical score effect                            |
| ------------- | ----------------------------------------------- |
| Below 30%     | Neutral to positive                             |
| 30-50%        | Mild drag over 2-3 cycles                       |
| 50-70%        | Significant drag; flags revolving dependence    |
| Above 70%     | Severe drag; often categorised as credit-hungry |

The number that matters is the one printed on the statement, not the one you imagine after paying the bill. A
₹2 lakh limit card on which you spend ₹1.4 lakh in a month and repay in full at the due date still reports a 70
per cent CUR for that cycle — repayment _before_ the statement cut-off (an early or interim payment) is the
practical fix, as is asking the issuer to report a higher limit or spreading spends across two cards. Bureau
practices vary on intra-month reporting; the statement snapshot is the reliable planning unit.

## Hard enquiries and the application cascade

Every credit application triggers a hard pull that remains on the report for 24-36 months, with the strongest
effect in the first 6. A cluster of three-four enquiries in two months (the classic pattern of someone shopping
for a personal loan across five apps in a weekend) can drop a good score by 20-40 points and materially raises the
rate the eventual lender offers, because enquiry density is itself priced. The mechanics that work:

- **Pre-approved or pre-qualified checks** run as soft pulls and leave no enquiry trail; use them to shortlist.
- **A 90-day gap** between fresh credit applications is the practical hygiene rule when you know a home loan is
  coming.
- **Checking your own report** is a soft pull, costs nothing against the score, and is free once a year from each
  bureau — and mandatory to review before any large application, because report errors are common enough to
  routinely deny loans.

## What moves the score, and how long it takes

| Action                                              | Direction  | Visible effect                                                  |
| --------------------------------------------------- | ---------- | --------------------------------------------------------------- |
| Missing one EMI/card due by 30+ days                | Down       | 30-60 points; DPD (days past due) marks '30' on the report      |
| Paying a card after "settlement" for less owed      | Down, hard | Settlement status scars the report for years; lenders price it  |
| Closing an old card                                 | Down, mild | Average account age falls; utilisation on remaining cards rises |
| Increasing limit without spending more              | Up         | CUR drops immediately                                           |
| Taking a secured loan (gold loan, LAP)              | Up, slow   | Improves mix; no enquiry spike if pre-approved                  |
| Multiple personal loans in 3 months                 | Down       | Enquiry density + unsecured-heavy mix                           |
| Credit-builder loan / secured card with on-time EMI | Up         | The standard thin-file repair path                              |

The settlement point deserves its own line: "settled" on a credit report is not "closed" — it is a status that
records you paid less than owed, and underwriters treat it as a near-default event. A written-off account
(DWO status codes on the report) is worse. If you genuinely cannot pay, negotiating a full-and-final with the
account restructured rather than settled, and the status updated to "closed", is worth more than any score-repair
app's promises.

## Scores, bureaus and the rate you actually get

Four bureaus are licensed in India — TransUnion CIBIL, Equifax, Experian and CRIF High Mark — and they can differ
by 30-50 points on the same person because their feeds and models differ. Lenders pull one (sometimes two) and
underwrite against their own cut-offs:

| Score band | Typical lending consequence                                       |
| ---------- | ----------------------------------------------------------------- |
| 750+       | Best published rates; pre-approved offers; premium card approvals |
| 700-749    | Standard rates; some premium products closed                      |
| 650-699    | Higher spreads; smaller sanction; co-applicant often demanded     |
| Below 650  | Frequent rejection; NBFC pricing at 14-24%                        |

Two mechanics worth knowing beyond the band. First, the RBI's rules on charging: from the 2022 regulatory
framework, lenders must quote the risk-based annual rate they actually charge, and the spread over the external
benchmark for individual borrowers — so the score's price impact is now visible in the offer letter, not buried.
Second, the **complimentary full credit report** regime: each bureau must provide one free report annually, and
the RBI's consumer education pages at [rbi.org.in](https://www.rbi.org.in/) list the grievance path when a report
is wrong. Disputes are raised on the bureau's portal, which forwards to the lender; the lender must respond within
the framework's timelines, and the correction propagates to the bureau once acknowledged.

## The repair timeline, honestly stated

A score is repairable, but on the bureau's clock, not yours. Missed payments and DPD entries stay on the report
for up to 36 months (enquiries 24); a settlement scar can shadow underwriting for longer even as its score impact
fades. The realistic recovery from a 620 to a 760 on clean behaviour is 9-18 months: all accounts current, CUR
under 30 per cent continuously, no new enquiries, one secured product reporting on time. Anyone promising faster
is selling a dispute-letter mill or a new identity file, and both have **consequences** — scores are never "reset"
by any service, and gaming the report by disputing genuine entries is a misrepresentation to a regulated system
with real downside when the next lender's underwriter pulls the underlying documents.

<figure class="callout">
<p><strong>The 30 per cent utilisation line is the one habit that pays every month.</strong> It is the only major
score input you control within a single billing cycle, it costs nothing, and it is the difference between the rate
you are offered and the rate the bank's best borrower gets.</p>
</figure>
