---
title: "Advance tax: the instalment schedule, the interest rules, and who actually owes it"
description: Who must pay advance tax under Section 208, the four instalment dates with percentages, the 234B and 234C interest arithmetic with worked numbers, and the exceptions salaried people miss.
pubDate: 2026-08-18
author: Chirag Singhal
type: article
tags:
  - advance-tax
  - section-234b
  - section-234c
  - salaried
  - capital-gains
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

Advance tax is the rule that tax is paid when income is earned, not when the return is filed. For salaried
people whose only income is salary, the employer's TDS handles it and the rule is invisible. The moment a
second income stream exists — interest, dividends, freelancing, capital gains, rent — the rule activates, and
the instalment calendar becomes a genuine deadline with interest attached. Most salaried taxpayers meet it for
the first time in the year they sell shares or a flat, which is exactly the year they are least equipped to
compute it.

## Who owes advance tax

Section 208: tax liability of **₹10,000 or more** in a financial year after TDS must be paid as advance tax.
This applies to individuals, and there is a relief: **resident senior citizens (60+) with no business income
are exempt** from advance tax entirely under Section 207 — they can pay everything as self-assessment tax.

Salaried people meet the ₹10,000 test through: bank FD interest above the TDS threshold (the tax on it, not the
interest itself, counts), dividend income, freelance or consulting income taxed at slab, capital gains, rent
received on a second property, and ESOP perquisites if the employer under-deducted. The test is on _total tax
after TDS credits_, so a person whose TDS covers everything owes nothing in advance tax even with multiple
incomes.

| Income addition                        | Tax at 31% slab (illustrative)       | Advance tax due?     |
| -------------------------------------- | ------------------------------------ | -------------------- |
| ₹60,000 bank interest, TDS 10% already | Tax ₹18,600, TDS ₹6,000, net ₹12,600 | Yes                  |
| ₹40,000 dividends, TDS 10%             | Tax ₹12,400, TDS ₹4,000, net ₹8,400  | No                   |
| ₹3,00,000 freelance profit, no TDS     | Tax ₹93,000                          | Yes                  |
| ₹2,00,000 LTCG on listed equity        | Tax ₹9,375 after 112A exemption      | No                   |
| ₹5,00,000 LTCG on property             | Tax ₹6,25,000 (12.5% flat)           | Yes, and it is large |

## The instalment schedule

For everyone except those opting for the presumptive schemes, four instalments with specified percentages of
the estimated annual tax liability:

| Instalment | Due date     | Cumulative % payable | Shortfall penalty basis                             |
| ---------- | ------------ | -------------------- | --------------------------------------------------- |
| 1          | 15 June      | 15%                  | 234C on 15% shortfall at 1%/month for 3 months      |
| 2          | 15 September | 45%                  | 234C on 30% shortfall at 1%/month for 3 months      |
| 3          | 15 December  | 75%                  | 234C on 75% shortfall at 1%/month for 2 months      |
| 4          | 15 March     | 100%                 | 234C on the final shortfall at 1%/month for 1 month |

For taxpayers under the presumptive taxation schemes (Sections 44AD/44ADA — eligible businesses and
professionals), the entire advance tax can be paid by **15 March** as a single instalment.

**The capital gains exception, which is the one that matters.** Sections 234C(2) and (3): tax on _capital gains_
(and on casual income such as lottery winnings) is chargeable as advance tax **only in the instalment due after
the transfer**. Sell shares in August, the gain enters the 15 September instalment. Sell in February, it enters
the 15 March instalment. This is the single most useful exception for investors — and the one most frequently
miscalculated, because the instalment must include _all prior instalments' cumulative liability_.

## The interest arithmetic, with numbers

**Section 234C — shortfall in instalments.** Simple interest at 1% per month (or part month) on the shortfall,
for the specified period. On a ₹1,00,000 shortfall at the 15 June instalment: 3% of ₹15,000-portion (if the
shortfall is in the 15% tranche) — computed tranche by tranche. The formula per tranche: 1% × (months of delay)
× (shortfall in that tranche).

**Section 234B — default in aggregate.** If 90% of the assessed tax is not paid as advance tax by 31 March,
interest at 1% per month on the shortfall from April (or from the first month after the payment shortfall) until
the date of assessment or the tax being paid. This runs _on top of_ 234C, and it is the interest people notice
first, because it appears on the intimation under Section 143(1) after filing.

| Scenario                              | Advance tax paid | Interest under 234C           | Interest under 234B                     | Total interest |
| ------------------------------------- | ---------------- | ----------------------------- | --------------------------------------- | -------------- |
| Paid all four instalments on schedule | ₹1,00,000        | Nil                           | Nil                                     | Nil            |
| Paid only in March (₹1,00,000)        | ₹1,00,000        | ₹1,000+₹3,000+₹2,500 ≈ ₹6,500 | Nil (90% met)                           | ₹6,500         |
| Paid ₹60,000 total, tax ₹1,00,000     | ₹60,000          | ≈ ₹6,500                      | ₹4,000 (4 months on ₹40,000 shortfall)  | ₹10,500        |
| Nothing paid, tax ₹1,00,000           | ₹0               | ₹6,500                        | ₹8,000-12,000 depending on payment date | ₹14,500-18,500 |

The illustrative table shows the punchline: skipping the first three instalments to pay everything in March
costs about 6.5% of the tax — an annualised rate of roughly 13% on the money for the months it was withheld.
That is more expensive than most liquid-fund yields, which makes paying instalments on time one of the few
guaranteed-return financial actions available.

## The routine that makes it painless

1. **Estimate in April.** Project the year's total income including the non-salary streams; compute tax after
   expected TDS; divide into the four instalments. Twenty minutes, once a year.
2. **Pay through the portal.** Advance tax is paid via challan ITNS-280 with the correct assessment year and
   "Advance Tax (100)" as the type. Payment is by net banking, UPI or debit card; the e-filing portal's
   e-pay tax service generates the challan.
3. **Recalculate at each instalment date.** If a capital gain landed, add it to the next instalment. If income
   dropped, reduce future instalments — the instalments are percentages of _estimated_ liability, and honest
   estimates are protected: Section 234BB and the law do not penalise a genuine estimate that later changes,
   only shortfalls against final assessed tax.
4. **Keep the challans.** The challan CIN (challan identification number) is what the return's schedule for
   taxes paid references; mismatches between challans claimed and 26AS are a standard cause of processing delay.

<figure class="callout">
  <div class="callout-title">The one sentence that saves the penalty</div>
  <p>
    If you sell any asset during the year, put the tax on that gain into the *next* 15th-of-the-month instalment
    — not into the March instalment, not into the return you file in July. Interest under 234C on a missed
    tranche is automatic and non-waivable except for genuine hardship cases the law lists.
  </p>
</figure>

## The legality note

Advance tax is a payment obligation, not an election; there is nothing grey about it. The consequences of
default are specific and mechanical: simple interest at 1% per month under Section 234B for aggregate default,
1% per month under 234C for instalment shortfalls, both non-waivable by the assessing officer in ordinary
circumstances. Failure to pay at all, where the return is also late or never filed, escalates into Section 271K
and the general penalty regime, and persistent non-filing can attract prosecution under Section 276CC only where
the unpaid tax exceeds the prescribed threshold and there is no reasonable cause. The one legitimate planning
move is honest estimation: the law taxes shortfall, not estimate error, so long as the estimate is made in
good faith and the instalments follow it. The sections and the e-pay facility are at
[incometax.gov.in](https://incometax.gov.in/iec/foportal/).

## Who genuinely does not need to think about this

Salaried employees whose only non-salary income is interest below the TDS thresholds, dividends below ₹5,000 per
company, and no capital gains: their TDS covers the liability and Section 208's ₹10,000 threshold is not
crossed. Senior citizens without business income are exempt under Section 207. Everyone else with a second
income stream — and by FY 2025-26 that includes most salaried people with any mutual fund corpus at all —
should have a recurring reminder for the four 15ths. The instalment calendar is not tax planning; it is the
price of admission for having income the employer does not withhold on.
