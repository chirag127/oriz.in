---
title: "Education loans India: the EMI math, the moratorium trap, Section 80E and the collateral lines"
description: How Indian education loans actually price — interest rates, the moratorium where unpaid interest compounds, collateral thresholds, Section 80E deduction, and the repayment schedules banks do not compute for you.
pubDate: 2026-10-30
author: Chirag Singhal
type: article
tags:
  - education-loan
  - collateral
  - section-80e
  - moratorium
  - vidya-lakshmi
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

An education loan is the first large debt most Indians sign, usually at 18-22, against an income that does not
exist yet. The product's structure — a moratorium during study, interest that compounds during it, a
collateral line that decides which bank wants you, and a tax deduction nobody claims properly — makes the
headline rate almost meaningless until you model the full repayment. This article does the modelling.

## The product's structure: the moratorium is a compounding engine

During the course plus a grace period (typically 6-12 months after completion), most banks offer a moratorium
on _repayment_, not on _interest_. Interest accrues monthly on the disbursed amount and compounds — either
paid by you during study (the smarter option), or added to the principal at course end, where it begins
earning interest of its own. The difference over a two-year course at 10.5%:

| Repayment choice during study                 | Loan ₹15 lakh, 2-yr course, 10.5% | Total repaid over next 7 years |
| --------------------------------------------- | --------------------------------- | ------------------------------ |
| Interest paid monthly during study            | Interest ≈ ₹1.6 lakh over 2 years | EMI ≈ ₹26,100 × 84             |
| Nothing paid (full moratorium)                | Principal grows to ≈ ₹16.6 lakh   | EMI ≈ ₹28,900 × 84             |
| Simple interest serviced, principal untouched | As row 1                          | As row 1                       |

Paying the moratorium interest costs roughly ₹2.4 lakh less over the loan's life — the single highest-ROI
decision an 18-year-old with a part-time income can make. The families who cannot pay during study are
exactly the families who pay the compounding; that is the product's structural cruelty, and knowing it is
worth more than negotiating 25 basis points.

## Rates, collateral and the credit-decision reality

| Loan size         | Typical collateral requirement                 | Typical rate (FY 2025-26) | Notes                                    |
| ----------------- | ---------------------------------------------- | ------------------------- | ---------------------------------------- |
| Up to ₹4 lakh     | None ( RBI's collateral-free norm)             | 9.5-12%                   | CGFSEL guarantee covers up to ₹7.5 lakh  |
| ₹4-7.5 lakh       | No collateral; third-party guarantee or CGFSEL | 9.5-12%                   | Guarantee fee may apply                  |
| Above ₹7.5 lakh   | Tangible collateral or co-borrower income      | 8.5-11% (secured)         | Property/FD lien; processing 0.5-1%      |
| Foreign education | Collateral or co-borrower usually              | 8.5-12.5% + forex markup  | Higher sanctioned amounts, longer tenure |

The collateral-free ceiling is the IBA Model Education Loan Scheme's structure, backed by the Credit
Guarantee Fund for Education Loans. Above it, banks want security or strong co-borrower income — which is
where the loan decision becomes a family-balance-sheet decision, not a student decision. Rates are
risk-weighted: the same bank quotes differently by institution tier (premier colleges get the "listed
institution" discount), course type and co-borrower profile. Negotiate with the CIBIL-healthy parent as
co-borrower and with two competing sanction letters in hand.

## The repayment schedule: what the EMI actually buys

A ₹15 lakh loan at 10.5% for 7 years is an EMI of about ₹25,400; the first EMI splits roughly ₹21,700
interest / ₹3,700 principal. Part-payment changes the curve non-linearly: a ₹1 lakh prepayment in year two
cuts the tenure by about 5-6 months or the EMI by ~₹1,900, depending on which the bank lets you choose —
_education loans typically lack prepayment penalties for individuals_, but confirm in the sanction letter,
because some foreign-education products carry processing and foreclosure clauses. The moratorium interest
choice (above) is worth more than every negotiation: ₹2.4 lakh is a decade of EMI months.

## Section 80E: the deduction nobody claims correctly

Interest on an education loan — for self, spouse, children, or a student for whom you are the legal guardian
— is fully deductible under Section 80E for _eight assessment years starting with the year repayment begins_
(older-regime filers; the new regime also allows 80E — it survived the regime cleanup). The fine print:

| Rule           | Detail                                                                                                |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| What qualifies | Interest only; principal gets no separate benefit (80C does not apply)                                |
| Cap            | None — the full interest is deductible                                                                |
| Duration       | 8 assessment years from the first repayment year                                                      |
| Certificate    | Bank's annual interest certificate — demand it every year                                             |
| Who claims     | The person who took the loan _and_ the person on whose behalf study happened — the same family branch |

Two claim errors: parents claiming 80E when the _student_ took the loan in the student's name (the claimant
must be the borrower or the guardian for the named student — a parent who is only a co-borrower guarantor in
a specific structure may face queries); and splitting the deduction between borrower and parent (it is not
splitable — one claimant, one deduction). When the student starts earning and the parent's 80E continues,
decide deliberately whose slab benefits more; the borrower claims it, and the parent claiming instead needs
the loan structure to actually permit it.

<figure class="callout">
  <div class="callout-title">The certificate that arrives only if you ask</div>
  <p>
    Banks do not mail 80E interest certificates by default; they issue them on request through the branch or
    net-banking portal, once a financial year. Set an April reminder for the life of the loan: without the
    certificate, the deduction is claimed on the EMI statement's rough split, gets rounded wrongly, and
    survives scrutiny only when the bank's number matches yours. One email a year protects eight years of
    deductions.
  </p>
</figure>

## The failure modes and their consequences

Default on an education loan is not a CIBIL footnote. The sequence: 90 days past due the account is flagged
NPA-grade in bureau terms; the bank invokes the guarantor and then the collateral; recovery under the SARFAESI
route applies where secured (possession of the mortgaged property with notice). Settlements damage the
bureau report as "settled" — visible to every future lender for years. The protections that exist are
procedural: RBI's grievance framework for education-loan servicing, the moratorium's own forbearance, and
loan-transfer or rate-reset requests on the Vidya Lakshmi portal's framework. Skipping the EMI "temporarily"
without a written restructure agreement is the classic error — the bureau does not care about the verbal
promise, and the interest does not care about anything.

## The legality note

Education lending is regulated banking: RBI's fair-practices code applies, and the
[rbi.org.in](https://www.rbi.org.in/) interest-rate and grievance frameworks bind lenders. The grey and
illegal edges: agents who "arrange" loans for fees (the sanctioned amount and rate are always verifiable on
the bank's own letterhead — a fee for a sanction that was coming anyway is money out); unregistered
"education loan" NBFC-adjacent apps charging 24-36% with undocumented recovery practices (report to the RBI
Ombudsman and
[consumerhelpline.gov.in](https://consumerhelpline.gov.in)); and forged admission/fee documents to inflate
the sanctioned amount, which is bank fraud with criminal consequences, not a negotiation tactic.

## The bottom line

Model the loan with the moratorium interest included, pay the interest during study if any family cash flow
can manage it, claim 80E every year with the bank's certificate, and treat a sanction letter as a
negotiable document between two offers. The degree's ROI is uncertain; the loan's arithmetic is not — and it
is the arithmetic, not the placement report, that decides the first five years of your cash flow.
