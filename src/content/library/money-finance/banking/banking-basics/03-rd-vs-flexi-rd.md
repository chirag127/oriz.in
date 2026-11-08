---
title: "RD vs flexi-RD vs sweep-in: the recurring-deposit decision, quantified"
description: Recurring deposits versus flexi-RDs, sweep-in FDs and SIPs — rates, liquidity, tax, the commitment value of forced saving, and which tool fits which goal.
pubDate: 2026-07-25
author: Chirag Singhal
type: article
tags:
  - recurring-deposit
  - flexi-rd
  - sweep-in-fd
  - savings
  - sip
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

The recurring deposit is India's default disciplined-savings product: a fixed amount debited monthly into a
deposit earning near-FD rates, with a fixed tenure. The flexi-RD is its smarter cousin — deposit when you have
surplus, skip when you do not, minimum tenure rules applying. The sweep-in FD is the third sibling. All three
compete for the same job: parking monthly surplus at fixed-income rates without equity risk. They differ in
commitment, liquidity, and the honest mathematics of what each costs and pays.

## The three instruments, side by side

| Feature                    | Regular RD                                                              | Flexi-RD                                             | Sweep-in FD                     |
| -------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------- |
| Deposit pattern            | Fixed monthly amount, fixed date                                        | Variable amounts, your timing                        | Automatic, above a threshold    |
| Rate                       | ~6.5–7.5% (1–3 yr, major banks)                                         | ~6.0–7.0%, often 0.25–0.5% below plain RD            | Full FD rate on swept slices    |
| Missed installment         | Penalty ₹1–2 per ₹100/month; may count as default                       | No penalty — just skip                               | N/A — automatic                 |
| Liquidity                  | Usually locked to maturity; premature closure closes _all_ installments | Withdrawals allowed per bank's rules (often partial) | Breaks smallest slice, FIFO     |
| Interest calculation       | Each installment earns for its own residual tenure                      | Same, per deposit                                    | Same, per slice                 |
| Minimum tenure per deposit | The RD's tenure                                                         | Often 1–3 years per deposit                          | Per-slice tenure (1 yr typical) |

The rate table matters less than the row above it. The regular RD's defining feature is the _penalty for missing_
— which is either its greatest strength (commitment device) or its greatest flaw (fragility), depending on whether
your cash flows are stable.

## The math: what a monthly ₹5,000 actually earns

Each installment compounds for its own shorter life — an RD is a series of mini-FDs, not an FD. ₹5,000 monthly for
24 months at 7.0% (quarterly compounding, as banks apply):

| Instrument                       | Deposited | Value at 24 months | Effective return                  |
| -------------------------------- | --------- | ------------------ | --------------------------------- |
| RD at 7.0%                       | ₹1,20,000 | ~₹1,29,000         | ~7.0% on the staggered cash flows |
| SIP into liquid fund at 6.2% avg | ₹1,20,000 | ~₹1,25,700         | ~6.2%                             |
| Sweep-in FDs (same cash flows)   | ₹1,20,000 | ~₹1,28,700         | ~7.0%                             |

The RD's ~₹3,300 edge over the liquid-fund route over two years is real but small — about ₹137 a month. Read the
comparison for what it is: a modest yield premium in exchange for _lock-in and penalty risk_. Where the RD clearly
wins is against the savings account (2.75% → ₹1,22,700 at 24 months): the ₹6,300 difference is the price of the
money's previous idleness.

## When the RD is the right answer

**The goal has a date and a fixed amount.** A ₹1,50,000 fee instalment due in 18 months, a wedding contribution,
the two-wheeler down payment. The RD's maturity date matching the expense date is the product's whole point —
forced accumulation with a hard finish line. **The money needs protection from you.** The regular RD's penalty
structure is a feature if you are the kind of person who raids savings; the flexi-RD's flexibility is a bug for
exactly that person. **You are building the savings habit at the start.** The first ₹5,000/month anyone saves is
worth more as _habit_ than as yield; the RD is the training wheels that guarantee the habit forms.

**When it is the wrong answer:** for money whose date is fuzzy (an emergency fund — RDs' premature closure
closes _all_ installments at most banks, killing the liquidity the fund exists to provide); for horizons beyond
five years (equity's expected premium dwarfs the RD's edge); and for the 30% tax slab where FD/RD interest is
fully taxed at slab and the post-tax yield approaches the liquid fund's — with far less liquidity.

## Flexi-RD: the honest review

The flexi-RD promises variable deposits at near-RD rates. Read the fine print before loving it:

| Flexi-RD fine print                | Typical term                   | Consequence                              |
| ---------------------------------- | ------------------------------ | ---------------------------------------- |
| Minimum deposit per instance       | ₹500–1,000                     | Small surpluses work; dust amounts don't |
| Minimum balance/tenure per deposit | 1–3 years                      | Withdrawals before it pay less or fail   |
| Rate discount vs plain RD          | 0.25–0.5% lower                | The flexibility's price                  |
| Withdrawal rules                   | Varies wildly by bank          | Some allow only full-deposit closure     |
| Maximum number of deposits         | Some banks cap (e.g., 20/year) | Heavy users hit the cap                  |

The right user for a flexi-RD is someone with genuinely lumpy cash flow — freelancers, commission earners — who
wants FD-grade rates on surplus without committing to a monthly debit. The wrong user is anyone who would be
better served by the automatic sweep-in: if your surplus arrives predictably into a savings account, the sweep
captures FD rates with zero decisions and better per-slice liquidity.

<figure class="callout">
  <div class="callout-title">The RD's real competitor is not the fund — it is the debit you never set up</div>
  <p>
    Every comparison in this article assumes the monthly ₹5,000 actually gets invested. In practice the
    alternatives are not "RD vs liquid fund SIP" but "RD vs the money staying in the salary account". Against that
    baseline, the RD wins decisively, because it moves money by default. A slightly suboptimal instrument that
    actually executes beats an optimal instrument that requires monthly enthusiasm — which is why banks still sell
    more RDs than every well-argued alternative combined.
  </p>
</figure>

## The tax arithmetic, again

RD interest is taxed at slab as income from other sources, with TDS applying at the aggregate FD+RD interest level
— above ₹40,000 a year (₹1,00,000 for senior citizens) as of FY 2025-26, banks deduct 10% (20% without PAN).
There is no indexation, no special treatment, and in the new regime no 80TTA deduction on the interest. At the
30% slab, the 7.0% RD nets 4.9% post-tax; at the 5% slab it nets 6.65%. The senior-citizen comparison shifts
everything: with 80TTB's ₹50,000 deduction covering RD+FD interest, a retiree can run a meaningful RD ladder
effectively tax-free up to that limit.

## The decision table

| Your situation                             | Best tool                 | Why                                                |
| ------------------------------------------ | ------------------------- | -------------------------------------------------- |
| Fixed goal, fixed date, need enforcement   | Regular RD                | The penalty is the commitment device               |
| Lumpy freelance income, FD-grade appetite  | Flexi-RD or staggered FDs | Deposit when the cash arrives                      |
| Surplus sits idle in savings automatically | Sweep-in FD               | Zero decisions, full FD rate, FIFO breaks          |
| Emergency fund                             | Liquid fund, not any RD   | Premature RD closure kills liquidity               |
| Horizon beyond 5 years, any risk appetite  | Equity SIP                | The RD's post-tax edge vanishes over long horizons |
| Retiree, within 80TTB limits               | Coupon-payout FD ladder   | Tax-efficient, monthly income, date-matched        |

## The legality note and the practical close

Nothing in the RD universe is legally grey — it is a plain bank product regulated by the RBI
([rbi.org.in](https://www.rbi.org.in/) publishes the deposit-rate and consumer-protection frameworks banks must
follow). Two practical notes: first, Nomination — an RD without a nominee goes through succession paperwork;
adding one takes a minute at booking. Second, when the RD matures, the default is almost always "credit to
savings account", where the money resumes earning 2.75% and quietly re-idles. Set the maturity instruction
deliberately — renew at the current rate, sweep to the next goal, or move to the investment account — because an
RD that matures into idleness has merely postponed the leak it was created to fix.
