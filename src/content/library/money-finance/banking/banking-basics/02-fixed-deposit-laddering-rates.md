---
title: "FD laddering: how to build the ladder and when it beats the fund"
description: Building an FD ladder with real Indian rates — maturity spacing, coupon vs cumulative, premature-withdrawal penalties, tax drag, and the honest cases for and against the ladder.
pubDate: 2026-07-22
author: Chirag Singhal
type: article
tags:
  - fixed-deposit
  - fd-ladder
  - interest-rates
  - debt
  - banking
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

An FD ladder is a portfolio of fixed deposits with staggered maturities, built so that a slice matures at regular
intervals — giving you periodic access to principal without ever breaking a deposit mid-term, and letting each
maturing slice reprice to the current rate environment. It is the oldest liquidity trick in fixed income, it
requires no product you have not already used, and it solves a precise problem: money that must not be at risk
but also must not be locked away in one lump.

## What the ladder solves

A single ₹10 lakh FD for three years has two failure modes. If rates rise, you are stuck at the old coupon. If an
emergency needs ₹2 lakh in month fourteen, you break the deposit and pay the premature-withdrawal penalty. The
ladder fixes both by construction: five FDs of ₹2 lakh maturing at 6, 12, 18, 24 and 36 months. Every six months,
a slice matures naturally; you spend it or roll it at whatever the current rate is. Rate risk and liquidity risk
are both halved or better, at the cost of a little bookkeeping.

| Structure                    | Rate captured                    | Liquidity              | Penalty exposure               |
| ---------------------------- | -------------------------------- | ---------------------- | ------------------------------ |
| One 3-year FD                | One rate, 3 years                | None until maturity    | Highest (full break = penalty) |
| Five-FD ladder (6–36 months) | Blended, repriced every 6 months | A slice every 6 months | Near zero                      |
| All in savings               | Current low rate                 | Instant                | None, but yields 2.5–3%        |

## Current rates and a worked ladder

Indicative rates for regular citizens at major banks as of FY 2025-26 (senior citizens typically get +0.50%):

| Tenure              | Major bank rate (indicative) | Small finance bank rate       |
| ------------------- | ---------------------------- | ----------------------------- |
| 7–45 days           | 3.5–4.5%                     | 4.0–5.0%                      |
| 6 months            | 6.5–7.0%                     | 7.0–8.0%                      |
| 9 months            | 6.75–7.25%                   | 7.25–8.25%                    |
| 12 months           | 6.6–7.3%                     | 7.5–8.5%                      |
| 18 months           | 6.75–7.25%                   | 7.25–8.25%                    |
| 2–3 years           | 6.8–7.3%                     | 7.0–8.0%                      |
| 5 years (tax-saver) | 6.5–7.5%                     | — (80C eligible, 5-year lock) |

A ₹10 lakh ladder at the blended rates above, coupons paid out quarterly:

| Slice     | Amount         | Tenure    | Rate              | Annual interest |
| --------- | -------------- | --------- | ----------------- | --------------- |
| 1         | ₹2,00,000      | 6 months  | 6.75%             | ₹13,500         |
| 2         | ₹2,00,000      | 12 months | 7.0%              | ₹14,000         |
| 3         | ₹2,00,000      | 18 months | 7.0%              | ₹14,000         |
| 4         | ₹2,00,000      | 24 months | 7.1%              | ₹14,200         |
| 5         | ₹2,00,000      | 36 months | 7.2%              | ₹14,400         |
| **Total** | **₹10,00,000** | —         | **~7.0% blended** | **₹70,100**     |

The blended 7.0% is within a fraction of the single 3-year FD's rate — laddering costs almost nothing in yield and
buys a maturity every six months. As each slice matures, it is either spent (if that was the plan) or re-laddered
at the longest rung, keeping the ladder rolling.

## Coupon vs cumulative: the reinvestment detail

A cumulative FD compounds the interest and pays principal plus interest at maturity; a non-cumulative (coupon)
FD pays interest out periodically. The coupon option is underrated: the payouts can be _swept_ to a liquid fund
or to a monthly-expense account, which turns the ladder into a crude pension — useful for retirees. But note the
trap: coupon payouts that sit idle in the savings account erode the ladder's arithmetic. Every rupee paid out must
be routed somewhere with a job.

## The penalty and the tax: the ladder's real costs

**Premature withdrawal:** banks typically charge 0.5–1.0% below the rate for the _actual_ tenure held (not the
booked tenure), plus some banks apply the rate applicable at booking for that shorter tenure — rules differ, and
the effective cost of breaking a 3-year FD at 14 months is often 1–1.5% of interest. The ladder's whole point is
that you almost never need to break a slice. **TDS:** interest above ₹40,000 a year (₹1,00,000 for senior
citizens) triggers 10% TDS (20% without PAN) as of FY 2025-26; the ladder's ₹70,100 of interest crosses it, so
either plan for the tax or file Form 15G/15H legitimately if total tax is nil. **Slab taxation:** FD interest is
fully taxable at your marginal rate — at the 30% slab, the 7.0% ladder nets ~4.9%.

| Investor slab | Blended 7.0% ladder → post-tax | Effective real return at 6% inflation |
| ------------- | ------------------------------ | ------------------------------------- |
| 5%            | 6.65%                          | +0.65%                                |
| 20%           | 5.6%                           | −0.4%                                 |
| 30%           | 4.9%                           | −1.1%                                 |

Read that last column honestly: for a high-slab earner in a 6% inflation year, a fully-taxed FD ladder loses
purchasing power. It is still the right instrument for _earmarked, dated_ money — the fee quarter, the emergency
reserve's layer three — because the alternative is not a hero return, it is a savings account.

<figure class="callout">
  <div class="callout-title">Ladder against dates, not against rates</div>
  <p>
    The amateur ladder chases the highest coupon on the longest tenure the bank offers this week. The professional
    ladder is built backwards from dates money is needed: the fee quarter gets a rung maturing the month before
    it, the insurance renewal gets a rung the month before *that*. Rate optimisation is the second-order benefit;
    date-matching is the first-order product. An FD that matures when the bill arrives needs no penalty
    negotiation, no emergency-fund raid, and no market view.
  </p>
</figure>

## When the ladder is the wrong tool

**Long-horizon money.** Fifteen-year goals need equity; a 7% ladder guaranteeing a −1% real return for fifteen
years is a slow loss dressed as safety. **The 30% slab with a big corpus.** Post-tax yields below inflation across
a large fixed-income sleeve should push you towards tax-efficient alternatives — or at least a deliberate
asset-allocation decision rather than a default. **Rate-rise conviction.** If you believe rates will rise
materially, a shorter ladder (3, 6, 9, 12 months) that reprices faster is better than a long one — and the
ladder's flexibility is exactly what makes this a two-way bet you can act on.

**Small-finance bank concentration.** The 1–2% extra yield is real, and so is the ₹5 lakh DICGC cover per bank
per depositor (the deposit-insurance article covers this). Spreading ₹40 lakh across eight banks to collect an
extra 1% is legitimate; putting ₹40 lakh in one small-finance bank for the coupon is a decision to earn 1% extra
for bearing a concentration the insurance does not fully cover.

## The mechanics of running one

Keep all rungs at banks with automated FD renewal instructions — "auto-renew principal and interest" for slices
you are rolling, "pay to account" for slices maturing before a known expense. Maintain a one-page sheet: rung
number, bank, amount, booking date, maturity date, rate, renewal instruction. Review the ladder at every RBI
policy inflection (when the repo cycle turns, new bookings change tenure preference —
[rbi.org.in](https://www.rbi.org.in/) publishes the policy statements and the rate environment). Senior citizens
should compare the +0.50% senior rates across banks before booking; on ₹10 lakh, 0.5% is ₹5,000 a year for a
comparison that takes twenty minutes.

The ladder will never be the most interesting page of your portfolio. That is the point: it is the part that has
to work _when_ it is needed, not the part that could have been brilliant in hindsight.
