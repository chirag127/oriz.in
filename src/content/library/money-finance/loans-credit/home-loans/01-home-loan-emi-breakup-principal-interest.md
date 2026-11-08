---
title: "Home loan EMI breakup: how much of your first EMI is interest, and when the principal finally moves"
description: The amortisation maths behind a home loan EMI — year-by-year principal and interest split, how rate changes move the tenure, and the tax deductions that alter the effective cost.
pubDate: 2026-08-11
learningPaths:
  - personal-finance-without-hype
  - india-money-decisions
related:
  - prepay-home-loan-or-invest-the-surplus
  - compound-interest-guide
  - emergency-fund-sizing
keyPoints:
  - "The EMI stays fixed, but the interest component falls and the principal component rises every month."
  - "On a ₹50 lakh, 8.5%, 20-year loan, the first EMI is about ₹43,391, of which roughly ₹35,417 is interest."
  - "A longer tenure lowers the EMI but raises total interest; the payment is not the cost of the loan."
  - "Prepayment before the crossover month removes principal from the most interest-intensive stretch."
  - "Tax deductions can change the effective cost; verify the current regime and eligibility before assuming a benefit."
author: Chirag Singhal
type: article
tags:
  - home-loan
  - emi
  - amortisation
  - section-24b
  - floating-rate
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

The first EMI of a home loan feels like a payment on the house. It is not, mostly. On a ₹50 lakh loan at 8.5 per
cent for 20 years, the EMI is ₹43,393 — and ₹35,417 of the first instalment is interest, with ₹7,976 touching the
principal. That is the amortisation curve working exactly as designed, and understanding it changes how you think
about prepayment, tenure and every rate reset for the next two decades.

## The EMI formula and where the money goes

The EMI is a fixed payment computed so that, discounted at the monthly rate, it exactly pays off the principal over
the tenure: **EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1)**, where r is the annual rate divided by 12 and n is the
months. Every EMI pays the accrued interest first and the remainder retires principal — which is why early EMIs
are interest-heavy and late EMIs nearly all principal.

| Year | Interest paid (₹) | Principal repaid (₹) | Outstanding at year end (₹) |
| ---- | ----------------- | -------------------- | --------------------------- |
| 1    | 4,21,056          | 99,660               | 49,00,340                   |
| 5    | 3,80,916          | 1,39,800             | 44,06,000                   |
| 10   | 2,98,216          | 2,22,500             | 34,89,300                   |
| 15   | 1,95,216          | 3,25,500             | 21,11,800                   |
| 20   | 28,316            | 4,92,400             | 0                           |

(₹50 lakh, 20 years, 8.5 per cent fixed illustration; figures rounded.) Across the full tenure the borrower pays
₹1.04 crore in EMIs — ₹50 lakh of principal and **₹54.1 lakh of interest**. The loan costs more than double the
house at this rate, which is the honest denominator behind every "renting is throwing money away" argument.

The crossover point — where principal exceeds interest inside a single EMI — arrives around month 130-135 on this
loan. Before that, more than half of every payment is interest; a borrower who sells in year 6 discovers they have
paid ₹26 lakh to the bank and retired only ₹6 lakh of debt, because the outstanding is still ₹44 lakh.

## What a rate change actually does

Home loans float on an external benchmark (repo-linked, for most banks since October 2019) plus a spread. A 50
basis point move does not change what you owe; it changes either the EMI or the tenure, and lenders at reset
typically stretch the tenure first:

| Rate | EMI (₹50 lakh, 20 yrs) | Total interest | Tenure if EMI held at ₹43,393 |
| ---- | ---------------------- | -------------- | ----------------------------- |
| 8.0% | 41,822                 | 50.4 lakh      | ~18 yrs 7 mo                  |
| 8.5% | 43,393                 | 54.1 lakh      | 20 yrs                        |
| 9.0% | 44,987                 | 58.0 lakh      | ~22 yrs 1 mo                  |
| 9.5% | 46,607                 | 61.9 lakh      | ~24 yrs 3 mo                  |

Holding the EMI constant and letting the tenure absorb the rate is the expensive default: at 9.5 per cent the same
EMI stretches the loan past 24 years. The RBI's floating-rate framework requires lenders to offer the borrower the
choice at every reset — increase EMI, extend tenure, or switch to a fixed rate (a switch lenders can charge for,
with the fee structure disclosed) — and to notify the borrower of the reset's impact. Most borrowers never
exercise the choice and silently accept the longer tenure; the proactive move is to hold or raise the EMI after
every cut and to recompute after every hike.

## Prepayment: the lever that shortens the curve

Because interest is charged on the outstanding balance, a prepayment in the early years removes principal that
would have generated interest for two decades. The arithmetic is lopsided in favour of early prepayment:

| One-time prepayment (year 5)             | Effect on ₹50 lakh / 20 yr / 8.5% loan                                |
| ---------------------------------------- | --------------------------------------------------------------------- |
| ₹5 lakh, EMI unchanged                   | Tenure drops ~3 years; interest saved ~₹11.7 lakh                     |
| ₹5 lakh, tenure unchanged                | EMI drops to ~₹38,850; interest saved ~₹6.9 lakh over original tenure |
| ₹1 lakh/year via SIP-style annual prepay | Tenure drops ~5 years; interest saved ~₹17 lakh                       |

Lenders cannot charge prepayment penalties on floating-rate loans to individuals — the RBI's borrower-lending
regulations are explicit — though fixed-rate loans and loans to non-individuals remain chargeable, and some lenders
apply processing fees on part-prepayment above a threshold. The practical instruction: every prepayment instruction
should specify **"adjust against principal, keep tenure unchanged"**; the default at many lenders is to recompute
the EMI, which quietly converts your prepayment into a lower EMI instead of a shorter loan.

## The tax layer

For a self-occupied property, the interest deduction under Section 24(b) is capped at ₹2 lakh a year and the
principal qualifies within the ₹1.5 lakh Section 80C ceiling — both available only under the old tax regime. In
year 1 of the illustrative loan, ₹4.21 lakh of interest means the ₹2 lakh cap binds: the effective subsidy is
₹60,000 for a 30 per cent slab borrower, not the ₹1.26 lakh the full interest would suggest.

| Component                     | Old regime                                          | New regime (FY 2025-26)    |
| ----------------------------- | --------------------------------------------------- | -------------------------- |
| Interest, self-occupied (24b) | Up to ₹2 lakh                                       | Not available              |
| Interest, let-out property    | Up to ₹2 lakh against rent; balance carried forward | Up to ₹2 lakh against rent |
| Principal (80C)               | Within ₹1.5 lakh ceiling                            | Not available              |
| Joint borrowers               | Each claims their funded share of both caps         | Same limitation            |

For a 30 per cent slab borrower on the old regime, the first-year effective interest cost is ₹4.21 lakh minus
₹60,000 of tax saved, or about 8.0 per cent post-tax on the interest portion. For a new-regime borrower, the
deduction disappears and the loan must be justified on housing merit alone — which is precisely why the
new-regime/default rate should enter the rent-versus-buy decision _before_ the loan is taken, not after.

## Reading the amortisation statement like a lender

Three practical habits. First, download the amortisation schedule at disbursement and verify it against the
sanction letter's rate and tenure — mis-keyed tenures and silent spread changes are common enough that the check
pays for itself. Second, track the repo-linked benchmark's movement rather than the bank's letterhead: the RBI
publishes the external benchmark framework and lender disclosures at [rbi.org.in](https://www.rbi.org.in/), and a
borrower who knows the repo path knows whether their reset letter is arithmetic or negotiation. Third, when the
reset letter arrives, run the two-year comparison — EMI constant versus tenure constant — and answer in writing;
lenders honour the first instruction they receive and the default is the expensive one.

<figure class="callout">
<p><strong>The crossover month is the loan's real milestone.</strong> Around month 130 on a 20-year loan, your EMI
finally begins paying more principal than interest. Every prepayment before that month is worth roughly double the
same prepayment after it, because it removes principal from the most interest-intensive stretch of the
schedule.</p>
</figure>

## The formula and the ORIZ calculator

The [loan EMI calculator](/tools/loan-emi/) and the [amortisation calculator](/tools/loan-amortization/) expose the
same arithmetic used above. For a fixed annual nominal rate, the monthly payment is:

$$
\text{EMI} = P \times \frac{r(1+r)^n}{(1+r)^n - 1}
$$

where \(P\) is the principal, \(r\) is the monthly interest rate as a decimal, and \(n\) is the number of monthly
payments. A 20-year loan at 8.5% uses \(r = 0.085 / 12\) and \(n = 240\).

For a ₹50,00,000 loan at 8.5% over 240 months, the model produces an EMI of about ₹43,391. The first month's
interest is roughly ₹35,417 and the principal repayment is about ₹7,974. In the first year, about ₹4.21 lakh goes
to interest and only about ₹99,500 to principal. That is why a rupee prepaid in the first few years is worth more
than the same rupee prepaid near the end.

The calculator shows the yearly split, the remaining balance, and the effect of changing the rate or tenure. Use it
with your sanction letter's rate, outstanding principal, and remaining term; a model is a planning aid, not a
lender quote.
