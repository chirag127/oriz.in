---
title: "SIP timing: the myth, the math, and the only date that matters"
description: What the data says about SIP entry dates, bull-top and crash-start SIPs, the sequence-risk arithmetic, and why pausing SIPs is the only timing decision with real cost.
pubDate: 2026-08-12
author: Chirag Singhal
type: article
tags:
  - sip
  - mutual-funds
  - timing
  - rupee-cost-averaging
  - behaviour
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

Every Indian investor has met the SIP-timing question: which date of the month is best, is it better to start when
markets are high, should I wait for a correction? The honest answers are: the date is irrelevant, starting at a
peak is historically fine, waiting for a correction has a measurable cost — and the only timing decision with real
rupee consequences is _stopping_. This article does the math the question deserves.

## The date myth, settled

Nifty 50 daily data across the last two decades produces the same finding every study does: SIPs started on the
1st, 5th, 10th, 15th, 25th or any other date produce terminal-wealth differences of a few basis points annualised
— noise, inside the range of a single month's tracking difference. The date determines which day's NAV your
instalments buy, and NAV paths within a month are essentially random relative to a 15-year horizon.

| SIP date     | 20-year corpus on ₹10,000/month (Nifty 50 TRI-era approx.) | Difference vs best |
| ------------ | ---------------------------------------------------------- | ------------------ |
| 1st of month | ~₹99 lakh                                                  | ~0.2%              |
| 5th          | ~₹98.9 lakh                                                | ~0.3%              |
| 15th         | ~₹99.1 lakh                                                | best               |
| 25th         | ~₹98.7 lakh                                                | ~0.4%              |

A 0.4% spread over twenty years is not a decision. It is an argument for choosing any date — the one two days
after salary — and never thinking about it again.

## The entry-point myth, settled

"Starting a SIP at market highs is dangerous" — test it against the data. The SIP is a _series_ of purchases, so
its outcome is an average of the whole path, not the first point. Three illustrative histories:

| SIP started                    | Market context                     | 10-year outcome (Nifty TRI approx.)             |
| ------------------------------ | ---------------------------------- | ----------------------------------------------- |
| January 2008 (pre-crash peak)  | Sensex at all-time high, then −60% | ~+15% XIRR — the crash's cheap units carried it |
| Late 2010 (post-recovery high) | Market 2× off the 2008 low         | ~+11% XIRR                                      |
| March 2020 (crash bottom)      | The famous bargain entry           | ~+16% XIRR                                      |

The January 2008 start — the entry everyone says to avoid — still compounded well, because the SIP's later
instalments bought the entire crash at half price. The crash that terrifies the lump-sum buyer is a _discount
window_ for the SIP buyer. The corollary is the uncomfortable one: waiting for the correction, historically, has
cost more than starting badly ever did.

## The cost of waiting, quantified

₹10,000/month at 12% annualised:

| Start delay | Years invested | Corpus at year 25 (from age-25 start) | Cost of delay |
| ----------- | -------------- | ------------------------------------- | ------------- |
| Start at 25 | 25             | ₹1.9 crore                            | —             |
| Start at 30 | 20             | ₹1.06 crore                           | ₹84 lakh      |
| Start at 35 | 15             | ₹57 lakh                              | ₹1.33 crore   |

Each five-year delay costs more than the last, and the cost is not "five years of contributions" (₹6 lakh) — it is
the compounding those years would have seeded. Meanwhile the "wait for correction" strategy has a second
documented cost: the correction arrives while the money sits in a savings account at 3%, and the investor who
waited for a 10% fall typically does not deploy at the bottom but at the recovery's midpoint, having watched the
entry point rise and fall without acting. The behaviour is so reliable it has a name: anchoring on the price you
first saw.

## What rupee-cost averaging actually does

The SIP's averaging is real but is routinely mis-described. It does not guarantee a better price than lump-sum
— in a rising market, lump-sum wins (the money is invested longer). It does two different things:

| Property                                | Effect                                             | Worth                       |
| --------------------------------------- | -------------------------------------------------- | --------------------------- |
| Time-averages the entry price           | Reduces the variance of outcomes vs a single entry | Real, modest                |
| Converts saving into an automated habit | Removes the monthly decision                       | The actual product          |
| Deploys through drawdowns mechanically  | Buys more units when prices fall                   | The behavioural crown jewel |

The third property is why SIPs _through_ crashes outperform intuition: the same ₹10,000 buys 15% more units at
a 40% drawdown. The units bought in the worst months of 2008 and 2020 were the highest-returning purchases of the
following decade — purchased automatically, without courage, by a standing instruction.

<figure class="callout">
  <div class="callout-title">The only timing decision with real money on it</div>
  <p>
    Pausing a SIP during a drawdown converts a temporary loss into a permanent one. The units you stop buying at
    the bottom are the cheap ones; the corpus you panic-redeem crystallises the fall. Run the 2008–2013 window:
    the investor who paused in October 2008 and resumed in 2010 missed the two cheapest years of the decade and
    lagged the never-paused investor by lakhs — despite identical contributions from 2010 onward. Timing your
    *entries* costs basis points. Timing your *exits* costs decades.
  </p>
</figure>

## The step-up SIP: the one refinement that does matter

If timing the date is noise, timing the _amount_ is signal. A SIP that starts at ₹10,000 and steps up 10% a year
with income:

| SIP                          | Corpus after 25 years at 12% |
| ---------------------------- | ---------------------------- |
| Flat ₹10,000                 | ₹1.9 crore                   |
| ₹10,000 stepping up 10%/year | ₹3.4 crore                   |
| ₹10,000 stepping up 15%/year | ₹4.6 crore                   |

The step-up costs nothing but an annual app edit — and it is the mechanism by which lifestyle inflation's
opposite gets automated. The salary-arrivals article's rule (50% of every increment to investments) is the
step-up SIP's funding source; the two articles are one system.

## The legality note and the practical close

Nothing about SIP timing is legally grey — it is a SEBI-regulated product with mandated disclosure of
performance against TRI benchmarks ([sebi.gov.in](https://www.sebi.gov.in/)). One compliance note matters: SIP
_cancellation_ and pause requests have cut-off dates (typically T-1 before the debit date) and failed debits
carry bank bounce fees (₹300–600) — so a planned pause for a low-cash month must be initiated before the debit
cycle, not after the bounce. The practical close, compressed: pick the date after salary, start now at whatever
the market level is because the level is unknowable and the delay is not, automate a 10% annual step-up, and
never pause except by plan. The SIP's genius is not that it times the market. It is that it removes you from the
timing question entirely — which is the only version of the question with a good answer.
