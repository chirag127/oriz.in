---
title: "Rental income India: the 30% standard deduction, municipal taxes, pre-paid interest and what the tenant deducts"
description: The full arithmetic of rental income — house property head, the 30% standard deduction, municipal-tax timing, home-loan interest on let-out vs self-occupied property, tenant TDS under 194-IB and the GST question.
pubDate: 2026-10-30
author: Chirag Singhal
type: article
tags:
  - rental-income
  - house-property
  - 194-ib
  - tds
  - let-out
difficulty: intermediate
toc: true
legal: legal
source:
  title: Rupee Realism
  url: https://github.com/chirag127/arac
  license: MIT
disclaimer: This article is educational and does not constitute financial, tax, investment, or legal advice. Rules, rates, and product terms change; verify current details with the relevant authority or a qualified professional before acting.
reviewStatus: editorial
license: CC BY 4.0
---

Rental income is the side income most Indians already have or plan for, and its tax arithmetic is settled law
that keeps being computed wrongly — because the calculation has five moving parts (GAV, municipal taxes,
standard deduction, interest, set-offs) and two regime-dependent answers for the interest part. This article
computes the whole thing in order, then adds the two things the landlord meets in practice: the tenant's TDS
obligation and the GST question nobody below commercial scale needs to answer.

## The computation, in the order the Act computes it

| Step | Item                              | Rule                                                                                      |
| ---- | --------------------------------- | ----------------------------------------------------------------------------------------- |
| 1    | Gross annual value (GAV)          | Actual rent receivable; municipality-assessed value where higher applies to older regimes |
| 2    | Less municipal taxes              | Paid _by you_ in this financial year, not "for" this year                                 |
| 3    | Net annual value (NAV)            | GAV − municipal taxes                                                                     |
| 4    | Less 30% standard deduction       | Flat 30% of NAV, all comers, no bills needed                                              |
| 5    | Less interest on borrowed capital | Let-out: no cap; self-occupied: ₹2 lakh cap (conditions)                                  |
| 6    | Loss from house property          | Let-out loss capped at ₹2 lakh per year set-off against other heads                       |

The 30% standard deduction is the blunt gift: ₹4.8 lakh of rent with ₹40,000 of municipal taxes paid leaves
NAV ₹4.4 lakh; deduction 30% is ₹1.32 lakh; the taxable house-property income before interest is ₹3.08 lakh.
No maintenance bills, no insurance receipts, no proof of anything — the 30% exists precisely so the
department does not audit a landlord's plumber invoices. Claiming actual expenses _instead_ is not an option;
the 30% replaced the old repair-and-collection allowances in 2017.

## Interest: the let-out property's uncapped deduction and the self-occupied cap

Borrowed-capital interest has the widest gap between the two property types:

- **Let-out property:** interest is fully deductible, no cap — and if it exceeds the rent, the resulting loss
  (capped at ₹2 lakh a year for set-off against other heads) carries forward eight years _within the head_.
  A young landlord with a ₹9 lakh rent and ₹11 lakh interest on a let-out flat reports ₹2 lakh loss, set it
  off against salary, and carries the rest forward.
- **Self-occupied property:** the deduction is capped at ₹2 lakh _only if_ acquisition or construction
  completed within five years of the loan's end; otherwise ₹30,000. No loss is claimable — the self-occupied
  house property income is nil by definition, and the interest creates a loss only within the ₹2 lakh cap
  (which may still be set off against other heads).

The old-regime-only note: the ₹1.5 lakh additional deduction under Section 80EEA for affordable housing
lapsed; new-regime filers get no interest deduction on the self-occupied house at all. Old-regime filers keep
the ₹2 lakh cap. A second self-occupied property (the "deemed self-occupied" for up to two houses) produces
nil income in the old regime; under the new regime, the second property is treated as deemed let-out at
market value — a structural difference that surprises new-regime filers with two flats.

## The tenant's side: 194-IB TDS and why landlords should care

An individual tenant paying rent above ₹50,000 a month (not liable to tax audit) deducts TDS under Section
194-IB — 2% from 1 October 2024 (it was 5%) — once a year, at the time of the last rent payment of the year
or the tenancy's end, using Form 26QC and a challan-cum-certificate. The landlord's takeaways:

| Tenant behaviour                    | Landlord consequence             | Fix                                  |
| ----------------------------------- | -------------------------------- | ------------------------------------ |
| No PAN shared                       | TDS at 20% under Section 206AA   | Give PAN in writing on the agreement |
| TDS deducted, never deposited       | Credit missing in 26AS at filing | Chase with the 26QC acknowledgment   |
| Deducts monthly, files nothing      | Mismatch flags the return        | Reconcile quarterly, not in March    |
| Pays deposit, not rent (adjustment) | No TDS on refundable deposits    | Distinguish deposit from licence fee |

The landlord's remedy for missing TDS credit is paperwork: the 26QC certificate number and the tenant's
challan. The penalty for the _tenant_ defaulting (Section 206C: contribution in default, 1% per month) is the
tenant's problem — but the credit's absence becomes the landlord's refund delay, which is why the agreement
itself should name the TDS obligation.

## GST on rent: the ₹20 lakh line and the reverse-charge wrinkle

Residential dwelling rent is GST-exempt (Notification 12/2017, as amended) when let to a _registered
person_ — for unregistered individual tenants, residential rent never attracts GST. Commercial rent
(shops, offices, co-working) attracts 18% GST, and the landlord's registration threshold is ₹20 lakh of
aggregate turnover — rental income counts. The reverse-charge entry: rents paid to an _unregistered_ landlord
by a registered tenant attract GST under RCM at 18% when the monthly rent exceeds ₹20,000 — meaning a small
landlord below the ₹20 lakh threshold with commercial tenants above ₹20,000/month sees tenants deposit GST
on their behalf under RCM (the landlord does not collect it; the tenant pays it to the government). The
landlord's compliance here is minimal, but the question "why is my tenant asking for my GSTIN?" is answered
by the RCM rule.

<figure class="callout">
  <div class="callout-title">The vacancy year that still files a return</div>
  <p>
    A flat vacant for the whole year produces rent of ₹0 — but if it was _let and vacated_ during the year,
    the GAV is the rent for the occupied months, municipal taxes still count when paid, and the standard
    deduction applies to whatever NAV emerges. For a genuinely vacant second property (never let), the old
    regime's deemed self-occupied treatment gives nil; the new regime's deemed let-out assigns notional rent
    _if it is the second house_. A vacant flat is not a tax-free flat; know which treatment your regime gives it.
  </p>
</figure>

## The legality note

The standard deductions exist so you need no grey methods. The failure modes are: not reporting rent at all
(the AIS matches tenant TDS, bank credits and municipal records — concealment penalty up to 200% under
Section 270A plus interest), splitting rent across family members' accounts without genuine ownership
(Section 64 clubbing for spouse/minors; genuine co-ownership with rent split per ownership share is
legitimate), claiming the 30% deduction _plus_ actual repair bills (not allowed — the 30% replaced them), and
charging "maintenance" billed separately from rent to look below thresholds (the department reads substance;
a charge for facilities enjoyed is rent). Cash rent is legal; unreported rent is not. Forms, rates and the
26QC mechanics are at
[incometax.gov.in](https://incometax.gov.in/iec/foportal/), GST notifications at
[gst.gov.in](https://www.gst.gov.in/).

## The bottom line

Compute the house-property head in the Act's order — GAV, municipal taxes, the 30% standard deduction,
interest with its let-out/self-occupied split — and let the arithmetic tell you what the property earns
after tax, not before. Name the tenant's TDS obligation in the agreement, reconcile their 26QC against your
26AS in April, and check the GST position once: exempt residential, RCM or registered-landlord commercial.
Rental income is the least grey of all side incomes; the only people it punishes are the ones who never
computed it.
