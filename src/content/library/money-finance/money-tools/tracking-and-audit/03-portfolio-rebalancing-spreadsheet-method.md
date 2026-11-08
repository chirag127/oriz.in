---
title: "Rebalancing by spreadsheet: the band method that beats both neglect and tinkering"
description: The 5-percentage-point band rebalancing method, a spreadsheet that computes drift and trade lists from NAV files, and the tax arithmetic of when rebalancing actually pays.
pubDate: 2026-08-16
author: Chirag Singhal
type: article
tags:
  - rebalancing
  - portfolio
  - spreadsheet
  - asset-allocation
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

Rebalancing has a marketing problem: it is sold as an event (the annual review) when it is actually a rule.
The rule version — drift bands, checked on a schedule, executed with a trade list — takes twenty minutes a
quarter in a spreadsheet and outperforms both its rivals: the person who never rebalances and the person who
rebalances on every headline. This article gives the rule, the spreadsheet that enforces it, and the tax
arithmetic that decides whether each specific trade is worth making.

## The band method, stated exactly

Pick target allocations — say 60% equity, 30% debt, 10% gold. Around each target, set a band of ±5
percentage points of the _total portfolio_. The rule: when an asset's actual share crosses its band edge,
move it back to target. Between edges, do nothing — the drift is doing useful work (letting winners run).
This is the method Vanguard's research on rebalancing has long supported as the best effort-to-benefit
trade-off, and its virtue is that it generates few trades: a 60/30/10 portfolio typically crosses a band
once or twice a year.

| Asset  | Target | Band   | Action band            |
| ------ | ------ | ------ | ---------------------- |
| Equity | 60%    | ±5 pts | Below 55% or above 65% |
| Debt   | 30%    | ±5 pts | Below 25% or above 35% |
| Gold   | 10%    | ±5 pts | Below 5% or above 15%  |

Why 5 points and not 2 or 10: at ±2 you trade constantly and pay costs to shave basis points; at ±10 your
risk level drifts materially — a 60% target that balloons to 70% equity has changed your worst-case year by
more than most people's risk appetite justifies. Five points is the crossover where the risk correction is
bigger than the friction, for portfolios above roughly ₹10 lakh.

## The spreadsheet that does the checking

One practical note before the formulas: rebalance at the _level of asset classes_, not at the level of every
fund. The band applies to equity, debt and gold as aggregates; inside equity, your flexi-cap and index funds
are interchangeable in the plan's eyes, and micro-managing their individual weights is tinkering wearing a
spreadsheet's clothes. The formulas below therefore roll holdings up to classes first.

Columns and formulas, using NAV files from the AMCs' websites or your CAS (Consolidated Account Statement
from NSDL/CAMS, which arrives on request at any point in the year):

| Column | Content       | Formula example                        |
| ------ | ------------- | -------------------------------------- |
| A      | Holding name  | text                                   |
| B      | Units         | from CAS                               |
| C      | Current NAV   | pasted quarterly                       |
| D      | Current value | `=B2*C2`                               |
| E      | Asset class   | equity/debt/gold                       |
| F      | Class total   | `=SUMIF($E$2:$E$40,E2,$D$2:$D$40)`     |
| G      | Actual weight | `=F2/SUM($D$2:$D$40)`                  |
| H      | Target weight | from the table above                   |
| I      | Drift         | `=G2-H2`                               |
| J      | Action needed | `=IF(ABS(I2)>0.05,"REBALANCE","hold")` |
| K      | Trade amount  | `=(H2-G2)*SUM($D$2:$D$40)`             |

Column K is the trade list: positive means buy, negative means sell. Two refinements: use the K column as
_targets_, not orders — inside an asset class, direct the cash to the funds furthest below their own
share of that class (equalisation by underweight); and run the check on a fixed quarterly date (the
first Sunday of January, April, July, October) so the band decides the trade but the calendar decides the
look.

## The tax arithmetic that gates every trade

Rebalancing inside equity funds sells units, and units above the exemption are taxed: FY 2025-26 rates for
equity funds are 12.5% LTCG above the ₹1.25 lakh annual exemption, and slab-rate STCG. So the sheet needs two
more columns:

| Column | Content                              | Formula                            |
| ------ | ------------------------------------ | ---------------------------------- |
| L      | Holding period (days since purchase) | from CAS purchase dates            |
| M      | Estimated gain on the proposed sale  | units × (NAV − avg cost)           |
| N      | Tax on the trade                     | LTCG portion × 12.5% + STCG × slab |

The decision rule: execute the rebalance if the risk correction is material (the band was crossed, not
nudged) _and_ the tax cost is under a threshold you set — commonly 0.3-0.5% of the portfolio. A ₹40 lakh
portfolio drifting to 66/28/6 needs about ₹2.4 lakh of equity sales; if ₹80,000 of that is long-term gain
after the ₹1.25 lakh exemption, the tax is roughly ₹6,900 — inside the gate. If the same correction falls
entirely on units bought last month (STCG at 20%+ slab), the tax can be ₹30,000-50,000, and the better move
is rebalancing with _new_ money: direct the next three months' SIP entirely into debt and gold until the
weights restore. The income-tax department's capital-gains pages at
[incometax.gov.in](https://incometax.gov.in/iec/foportal/) carry the current rates and the exemptions.

## Failure modes the spreadsheet cannot prevent

Three ways the band method breaks in practice, all behavioural. **The drifting target:** people quietly revise
the 60/30/10 to 70/30/0 after two good equity years, which is not rebalancing but rationalisation — write the
target down, date it, and allow a change only at life events (home purchase, child, job loss), not at market
peaks. **The survivorship fix:** the sheet computes weights on holdings that exist today; a fund that closed
or an account you forgot to add silently overstates your debt weight. Feed it from the CAS, not from memory,
and reconcile the CAS total to your net-worth sheet once a year. **The calendar skip:** the method's entire
edge is that the January check happens even in a boring market; skip two quarters and you are back to
rebalancing by mood, with extra steps. Put the four dates in the phone as recurring events with the
spreadsheet's file link in the reminder, and treat a skipped quarter the way you treat a missed EMI — as an
incident to fix, not a preference.

## What rebalancing is worth, honestly

The honest evidence: disciplined rebalancing adds roughly 0.1-0.4% annualised over a buy-and-hold in most
regimes — its real value is risk control, not return enhancement. The 60/30/10 investor who never rebalanced
from 2020 through 2024 held a portfolio that was 75% equity by 2024's top and gave back a far uglier drawdown
in the 2025 smallcap correction than the rebalanced neighbour's. The band method's returns come from
forcing the one trade everyone postpones: selling the winner and buying the loser, quarterly, without an
opinion.

## The bottom line

Rebalancing fails as a mood and works as a rule. The band method is the minimal rule that captures it:
targets, ±5-point bands, a quarterly calendar date, a spreadsheet that turns two pasted columns into a trade
list, and a tax gate that vetoes trades the exchequer would profit from more than you. Twenty minutes a
quarter, no app subscription, no advisor retainer — the discipline that most robo-advisors charge 0.2-0.5%
a year to supply is a `SUMIF` you can write once and own forever.
