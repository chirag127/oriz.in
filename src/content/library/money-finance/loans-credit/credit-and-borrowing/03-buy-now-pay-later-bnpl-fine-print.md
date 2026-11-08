---
title: "Buy Now Pay Later: the fine print that turns a free instalment scheme into a 30% loan"
description: How BNPL actually works in India — the credit line behind the checkout button, late fees and interest structures, RBI's lending rules, bureau reporting and the risks the marketing skips.
pubDate: 2026-09-15
author: Chirag Singhal
type: article
tags:
  - bnpl
  - credit-line
  - fintech
  - consumer-credit
  - rbi-regulation
difficulty: beginner
toc: true
legal: grey
source:
  title: Rupee Realism
  url: https://github.com/chirag127/arac
  license: MIT
disclaimer: This article is educational and does not constitute financial, tax, investment, or legal advice. Rules, rates, and product terms change; verify current details with the relevant authority or a qualified professional before acting.
reviewStatus: editorial
license: CC BY 4.0
---

Buy Now Pay Later is marketed as a payment option and structured as a loan. At checkout, the button says "pay in
3 instalments, zero interest"; underneath it sits a credit line from an NBFC or a bank, extended through a fintech
app, underwritten in seconds, and reported — or not reported — to credit bureaus in ways that determine your next
home loan. The gap between what the button promises and what the contract says is this article's subject.

## What is actually being lent

The typical Indian BNPL stack has three parties: the merchant or platform offering the option, the fintech that
runs the app and the underwriting, and a regulated lender (an NBFC, or a bank co-lending) that holds the credit
exposure. The product variants:

| Variant                          | Typical tenor | Interest                                 | Where you see it                                |
| -------------------------------- | ------------- | ---------------------------------------- | ----------------------------------------------- |
| Pay-in-3 / pay-in-4              | 30-90 days    | Zero if paid on time; late fee otherwise | E-commerce checkout, food delivery, travel apps |
| Pay-in-30-days                   | 30 days       | Zero on time; penalty after              | Quick-commerce, retail POS                      |
| EMI-style BNPL                   | 3-12 months   | 12-36% annualised, often shown flat      | App-native checkout, big-ticket carts           |
| Embedded credit line (card-like) | Revolving     | 30-45% on revolving balance              | Wallet + UPI-linked credit                      |

The "zero interest" headline is real for on-time pay-in-3 — the fintech's revenue comes from a merchant discount
rate (MDR-style fee of 2-4 per cent paid by the seller) plus late fees. What is not real is the impression that
there is no cost anywhere in the system: the merchant's fee is priced into what you buy, the late fees are steep
relative to the tenor, and the variants with tenors beyond 90 days are ordinary consumer loans at ordinary consumer
loan prices.

## The late fee arithmetic

Late-fee schedules are the fine print that decides whether BNPL is cheap:

| Structure (illustrative)             | Trigger                 | Cost                                                  |
| ------------------------------------ | ----------------------- | ----------------------------------------------------- |
| Flat ₹100-₹250 per missed instalment | Any delay past due date | On ₹4,500 repaid in 3, one miss ≈ ₹100-₹250           |
| Percentage of outstanding: 2-4%      | Delay                   | ₹90-₹180 on a ₹4,500 balance                          |
| Capped cumulative fee                | Multiple misses         | Often capped at 50-100% of principal on small tickets |
| Interest on overdue balance          | Varies; some stack it   | 24-36% annualised on the overdue portion              |

Read the last two rows together: a ₹4,500 pay-in-3 where you miss two instalments can accrue ₹300-₹450 in fees
plus interest — on a 60-day loan, that is an effective annualised cost in the neighbourhood of 60-100 per cent.
The fee is capped on most platforms (the RBI's guidelines on recovery of fees require caps to be disclosed), but
the cap is frequently 50 per cent or more of the principal, which is not the "free credit" the checkout implied.

## The regulation, and the parts still settling

BNPL in India is regulated credit, though the industry's structure took years to make that obvious. The key rules:

- **First Loss Default Guarantee (FLDG) arrangements** — where the fintech compensates the lender for defaults —
  were formally recognised and ring-fenced by the RBI's June 2023 circular on digital lending guarantees, capping
  the guarantee at 5 per cent of the underlying portfolio and requiring the regulated lender to hold the credit
  risk in substance.
- **Digital lending guidelines (2022, tightened since)** require the loan to be underwritten by an RBI-regulated
  entity, the Key Fact Statement to be issued to the borrower, and data consent to be explicit. The RBI's
  consolidated digital lending directions are at [rbi.org.in](https://www.rbi.org.in/).
- **BNPL through UPI** was formalised in 2023 with a credit line on UPI, capped for small values and tied to
  regulated issuers — putting the product inside the payments rail rather than outside it.
- **Bureau reporting**: the 2022 digital-lending framework and subsequent reporting harmonisation push lenders to
  report short-tenor credit to bureaus. In practice, reporting practices across pay-in-3 products have been
  inconsistent, and the grey zone this creates is real: a borrower may believe their on-time BNPL usage is building
  a credit history when the product is not reported at all, or discover missed instalments were reported and
  scarred their report — both situations exist in the wild.

The grey zone worth naming: **several BNPL products still sit at the reporting boundary, and the consumer rarely
knows which side their app falls on.** The consequence is asymmetric — nobody complains about the credit history
you built invisibly, but a missed ₹2,000 instalment on an app that turns out to report can surface years later as
a DPD entry under a lender name you never recognised, and disputing it means unravelling a chain of
fintech-NBFC assignments. Before using any BNPL product, ask the app directly whether it reports to CIBIL/Experian/
CRIF and under which lender's name; a fintech that cannot answer in one line is telling you something.

## The underwriting, and why it is simultaneously generous and dangerous

BNPL underwriting in seconds is possible because the exposure is small and the data is behavioural: device
fingerprinting, SMS parsing of your bank statements, e-commerce history. The sanction limit of ₹10,000-₹2 lakh is
assigned without income proof, which is generous relative to a personal loan's documentation — and dangerous in
the specific way consumer credit is always dangerous when friction is removed: the marginal borrower is approved
for the purchase they would not have made with cash. The default rates on Indian BNPL books have been high enough
(RBI's trend-and-progress reviews and industry commentary put early-stage delinquency in these books well above
credit-card books) that several fintechs have tightened limits since 2023 — the product is not as free-floating as
its growth phase suggested.

| Behaviour pattern                                        | Outcome                                                                              |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Pay-in-3 used as a cash-flow tool, autopay on            | Zero cost, possible bureau benefit if reported                                       |
| Multiple apps, cumulative exposure ₹50,000+, no tracking | Overlapping due dates, fee pile-up, score damage                                     |
| BNPL used to bridge a salary gap repeatedly              | Revolving dependence; effectively a 30%+ loan                                        |
| Defaults ignored until the app blocks the account        | Bureau entry under the NBFC's name; recovery calls; closure requires full settlement |

## The practical rules

Treat BNPL as a short-tenor, high-penalty loan and it is a useful instrument. Four rules hold across platforms:

1. **Autopay the full instalment** from an account you reconcile; the late fee is the product's real revenue and
   the easiest thing to deny it.
2. **One platform, not five.** Exposure scattered across apps with different due dates is the classic path to
   accidental default; the cumulative outstanding is invisible to you and visible to nobody who cares about
   your interest.
3. **Check reporting status once**, in writing (the app's help/FAQ usually states it), and treat non-reporting as
   neutral — do not manufacture a credit history with pay-in-3.
4. **Never finance a depreciating discretionary purchase over 6 months** on BNPL EMI variants; at 24-36 per cent
   effective, the interest exceeds the product's resale value by the time it is paid off.

## Consequences of default

The recovery side of Indian BNPL has been an enforcement theme: the RBI's digital-lending framework requires
recovery agents to be empanelled, prohibits harassment, and mandates notice periods; but the practical
**consequences** of an ignored BNPL default are real and escalate — app-level blocking, then recovery agency
contact, then a bureau DPD entry under the lender NBFC's name, then legal notice for amounts that are small enough
to be settled but large enough to be reported. The **penalt**y structure (late fees that stack, interest on
overdue balances) is disclosed in the Key Fact Statement, which almost nobody reads; read it once for the app you
actually use, and you know the true price of the checkout button.

<figure class="callout">
<p><strong>BNPL's honest use case is a 30-90 day cash-flow tool with autopay on.</strong> The moment it stretches
into months or multiple apps, you are running an unsecured consumer-loan portfolio at consumer-loan rates with
consumer-loan consequences — just with a friendlier button.</p>
</figure>
