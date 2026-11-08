---
title: "How to read a mutual fund factsheet: the eight numbers that actually decide things"
description: A line-by-line guide to the monthly AMC factsheet — TRI benchmark, tracking difference, expense ratio, portfolio turnover, risk ratios, and the marketing numbers to ignore.
pubDate: 2026-08-21
author: Chirag Singhal
type: article
tags:
  - factsheet
  - mutual-funds
  - expense-ratio
  - due-diligence
  - analysis
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

Every AMC publishes a monthly factsheet for every scheme, and almost every investor reads only the returns table
— the one part designed to flatter. The factsheet is a disclosure document, and its useful numbers sit in the
sections nobody browses: benchmark performance in TRI terms, the expense ratio, portfolio turnover, the risk
metrics, and the manager's own commentary. This article walks the document top to bottom and says which numbers
decide and which decorate.

## The returns table, read properly

Factsheet returns are point-to-point and absolute — they tell you what happened, not whether the _fund_ caused
it. Three corrections before trusting any number:

| Correction                                                | Why                                                                                                       |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Compare against the scheme's TRI benchmark, not the Nifty | The benchmark row is mandated; a flexi-cap fund benchmarked to Nifty 500 must be judged against Nifty 500 |
| Compare the _direct plan's_ numbers                       | Some older marketing material still shows regular-plan returns; the gap is the commission                 |
| Look at rolling returns, not calendar-year                | Rolling 3-year/5-year returns over 10+ years show the distribution of outcomes, not one path              |

A fund that beat its benchmark in three of ten calendar years while its rolling 5-year returns beat the benchmark
70% of the time is a different animal from the reverse — calendar tables hide this completely.

## The benchmark row and tracking difference

For index funds, the benchmark comparison is the whole evaluation. The factsheet shows both the fund's return and
the index's — and the gap is tracking difference, the number the fund's marketing never prints prominently:

| Fund type                                  | Benchmark shown        | Acceptable annual tracking difference    |
| ------------------------------------------ | ---------------------- | ---------------------------------------- |
| Nifty 50 index fund                        | Nifty 50 TRI           | −0.10 to −0.30%                          |
| Nifty 500 index fund                       | Nifty 500 TRI          | −0.15 to −0.40%                          |
| Active large-cap (benchmark Nifty 100 TRI) | —                      | Alpha, not tracking, is the metric       |
| Debt/indexation-sensitive                  | Category benchmark TRI | Duration and credit fit, not just return |

For active funds, the benchmark still matters — it defines the universe the manager was hired to beat, and
"beats the Nifty 50" claims from a fund free to hold 35% cash are benchmark-shopping, not performance.

## The expense ratio and the turnover

The TER (total expense ratio) appears in the factsheet and, mandated, on the AMC's website daily. Read it against
the category and against the direct-plan version:

| TER range                        | Verdict                                                     |
| -------------------------------- | ----------------------------------------------------------- |
| Index funds, direct, 0.10–0.20%  | The competitive norm; higher means choose another fund      |
| Active equity, direct, 0.6–1.2%  | Normal; above 1.5% needs a genuine edge to justify          |
| Active equity, regular, 1.4–2.2% | The distributor trail; compare against direct before buying |
| Debt funds, direct, 0.15–0.40%   | Above this, the yield's edge is mostly the fee's cost       |

Portfolio turnover is the second efficiency number: a fund churning 200% a year trades away its own edge in costs
and embedded capital-gains tax. Turnover matters most in the tax context — high-turnover funds distribute gains
that hit your tax bill at the fund's discretion, not yours.

## The risk metrics, decoded

The factsheet's risk section carries standardised ratios — mandated since SEBI's classification circular, but
rarely explained:

| Metric                           | What it says                          | How to use it                                                 |
| -------------------------------- | ------------------------------------- | ------------------------------------------------------------- |
| Standard deviation               | Volatility of returns                 | Compare _within category only_                                |
| Beta                             | Sensitivity to the benchmark          | >1 amplifies both directions; check against your intent       |
| Sharpe                           | Excess return per unit of total risk  | Higher is better, same category, same period                  |
| Treynor                          | Excess return per unit of market risk | Useful for diversified equity                                 |
| Alpha                            | Return above what beta explains       | Persistent positive alpha over 5+ years is the manager's case |
| Max drawdown (in monthly tables) | Worst peak-to-trough                  | The number that predicts whether _you_ can hold the fund      |

The max-drawdown row is the one with behavioural value: a midcap fund showing −55% historical drawdown is telling
you exactly what a 2022-grade year feels like. Investors who read that row _before_ buying sell less during the
actual event — which is the only risk management that works at the retail level.

## The portfolio pages

The holdings reveal what the marketing cannot:

| What to check                            | Red flag                                                                            |
| ---------------------------------------- | ----------------------------------------------------------------------------------- |
| Number of holdings                       | 40 stocks in a "diversified" fund is a concentrated portfolio wearing a label       |
| Top 10 weight                            | >50% concentration in an "Diversified" mandate                                      |
| Overlap with your other funds            | Two funds with 70% shared holdings are one fund with two fees                       |
| Cash level                               | Persistently high cash in an equity mandate = manager is timing, not selecting      |
| Sector weights vs benchmark              | A "large-cap" fund with 40% mid-cap is a mandate breach in spirit                   |
| Credit quality and duration (debt funds) | AAA-on-paper with YTM far above the AAA curve means something else is in the sleeve |

The last row catches the debt-fund pattern that burned investors in 2020: yield far above the category's AAA
curve means lower-rated paper, AT1 bonds, or structured instruments are inside the portfolio, whatever the label
says.

<figure class="callout">
  <div class="callout-title">The manager commentary is the most under-read page</div>
  <p>
    Most factsheets end with the fund manager's notes on what moved the portfolio and why. Read it for two
    things: whether the stated strategy matches the holdings (a "quality" fund adding turnaround stories is
    changing strategy), and whether attribution admits mistakes. A manager who explains losses with the same
    precision as wins is running a process; a manager whose commentary is marketing prose in both directions is
    running a story. Over a decade of reading these, the second type eventually costs more.
  </p>
</figure>

## The numbers to ignore

**AUM** — size is neither edge nor virtue; a ₹40,000 crore fund and a ₹400 crore fund can both be excellent, and
"AUM growth" is a sales metric. **Star ratings** — backward-looking composites that flip in drawdowns. **"Best in
class last year"** — the category's best year rarely repeats; look at the _distribution_ of annual ranks instead.
**Dividend/IDCW history** — payout frequency is a cash-flow feature, not performance. **The "Top Performer" badge
in any ad** — SEBI's advertising code requires standardised disclosures precisely because these badges are
selection effects, not skill signals. The regulator's own pages
([sebi.gov.in](https://www.sebi.gov.in/)) on mutual fund advertisement codes are worth one read — they explain
exactly how the industry is permitted to present its numbers to you.

## The 10-minute audit, as a checklist

Run this on any fund before money moves: **(1)** benchmark TRI match — is the fund above it over 5 and 10 years?
**(2)** direct-plan TER against category norm. **(3)** rolling returns' distribution — how often did 5-year
rolling returns disappoint? **(4)** max drawdown — can you hold through that number? **(5)** turnover and tax
behaviour. **(6)** top holdings' overlap with what you already own. **(7)** the manager's commentary — process or
prose. **(8)** the mandate-fit question: does the portfolio hold what the label promises? A fund failing two of
eight is a fund to _watch_; failing four is a fund to avoid; and any fund whose returns you cannot explain by its
holdings is a fund you do not understand — which is the real disqualification, whatever the numbers say.
