---
title: "The fear-greed gauge: reading India's sentiment index without becoming its customer"
description: What the India VIX-based fear-greed readings on Tickertape and Moneycontrol actually measure, the maths of VIX, a spreadsheet method to build your own gauge from free API data.
pubDate: 2026-08-03
author: Chirag Singhal
type: article
tags:
  - fear-greed-index
  - india-vix
  - tickertape
  - sentiment
  - nse
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

Every market app now carries a "fear and greed" dial. Tickertape's version, Moneycontrol's version, the
global CNN variant — colourful gauges that compress everything happening in the market into one number
between 0 and 100. They are genuinely useful and genuinely misleading in equal parts, and the useful part is
yours for free if you understand what is under the dial. This article takes the gauge apart, rebuilds it in a
spreadsheet from public data, and marks the exact points where it lies.

## What the dial actually measures

Most Indian versions are dominated by one input: **India VIX** — the NSE's volatility index, computed from
the order book of NIFTY 50 options. VIX is an annualised expected volatility figure: VIX at 14 means the
options market prices NIFTY's expected movement over the next month at roughly ±4% (14 ÷ √12 ≈ 4.04); VIX at
28 prices it at roughly ±8%. Fear and greed scales invert this: high VIX = fear, low VIX = greed, with the
mapping usually banded like this:

| Reading band | Label         | What VIX/other inputs are doing         | Historical frequency  |
| ------------ | ------------- | --------------------------------------- | --------------------- |
| 0-24         | Extreme fear  | VIX spikes above ~20, breadth collapses | The best buying zones |
| 25-44        | Fear          | VIX 15-20, some sectors bleeding        | Common in corrections |
| 45-55        | Neutral       | VIX 12-15, mixed breadth                | Most of the time      |
| 56-75        | Greed         | VIX 11-13, breadth strong, FII inflows  | Late bull phases      |
| 76-100       | Extreme greed | VIX below 11, smallcaps running hot     | Near bull-market tops |

The other inputs the apps mix in: market breadth (advances versus declines), momentum (NIFTY versus its 125
or 250-day average), junk-bond demand proxies, and sometimes FII/DII flow numbers. The exact weights are
proprietary, which is the first reason to build your own.

## What the dial gets right

VIX is a real signal. The pattern that has repeated across the NSE's data since 2007: VIX above 20 has
coincided with drawdowns worth buying (March 2020 VIX touched 80+; the 2022 and 2025 corrections pushed it
into the high teens and twenties), and VIX sustained below 11 has coincided with the late-bull phases where
SIP-driven flows chase smallcaps. Neither is a timing tool; both are condition reports. The gauge's honest
use is as a **positioning reminder** — when it screams fear, your rebalancing band probably has a trigger in
it; when it screams greed, your risk review is overdue.

## Where the inputs come from, free

Every component of the gauge is published by someone whose business is making it public. India VIX history:
the NSE's own index pages, downloadable as CSV. NIFTY 50 closes: the same index pages, or any of the AMC
fact-sheets that publish the index monthly. Advances and declines: NSE's daily market report. FII/DII flows:
the daily FII-DII trading activity page, where the depository data lands every evening. The apps that show
you the dial pay nothing for these inputs either — their cost is the presentation layer, not the data. If you
want the numbers machine-readable rather than copy-pasted, the NSE publishes the same series through its
public report endpoints, and broker platforms expose them through their own market-data pages; the terms of
each vary, so read them before scripting anything against a paid API. A quarterly refresh is enough — the
gauge is a regime indicator, not a day-trading input.

## What the dial gets wrong

1. **It is not forward-looking about direction.** VIX measures expected _movement_, not direction. A VIX of
   25 before a budget can resolve upward or downward; the dial reads "fear" either way and users hear
   "dip coming", which is not what the number says.
2. **Fear can persist.** 2013's taper-tantrum summer and 2022's rate-hike year kept readings in fear territory
   for months while the market ground sideways to slightly up. Treating "fear" as "buy immediately" turns
   a condition report into a falling-knife catcher.
3. **The smoothing lies.** Apps smooth the inputs over days to stop the dial whipping; a smoothed dial is a
   trailing indicator dressed as a live one.
4. **Greed readings arrive earliest in the smallest caps.** The gauge is computed on large-cap inputs while
   the risk actually accumulating is in the mid and small segments.

## Build your own gauge in a spreadsheet

Free inputs, all from public pages or APIs: India VIX and NIFTY 50 levels (NSE's public quotes pages),
advances/declines (NSE's market data), FII/DII flows (NSE's daily FII-DII page). The NSE's data pages at
[nseindia.com](https://www.nseindia.com/reports-indices-historical-vix) publish historical VIX values. The
spreadsheet:

| Column | Formula                                                                           | Meaning              |
| ------ | --------------------------------------------------------------------------------- | -------------------- |
| A      | Date                                                                              | —                    |
| B      | India VIX close (paste or API)                                                    | Raw volatility       |
| C      | NIFTY close                                                                       | —                    |
| D      | `=AVERAGE(C2:C126)/AVERAGE(C2:C126)*0` placeholder — use `=C2/AVERAGE(C2:C126)-1` | 125-day momentum     |
| E      | Advances minus declines (paste daily)                                             | Breadth              |
| F      | `=IF(B2>20,0,IF(B2>15,25,IF(B2>12,50,IF(B2>=11,75,100))))`                        | VIX score 0-100      |
| G      | `=MIN(100,MAX(0,50+D2*250))`                                                      | Momentum score 0-100 |
| H      | `=IF(E2>300,100,IF(E2>0,60,IF(E2>-300,40,0)))`                                    | Breadth score 0-100  |
| I      | `=0.5*F2+0.25*G2+0.25*H2`                                                         | Your composite 0-100 |

Backtest it against the last three corrections: your composite crosses below 25 within a few days of the
actual capitulation lows and above 75 in the final quarters of both 2024 and 2025's smallcap melt-ups. The
agreement with the paid gauges is close enough to conclude the proprietary sauce is mostly VIX.

## Operating rules that make the gauge pay

1. **Use it as a rebalancing prompt, not a signal.** When the composite is below 30 and your equity band has
   drifted below target, that is when rebalancing feels terrible and works best.
2. **Log every reading with your action.** A two-year log of "gauge said X, I did Y, outcome Z" is worth more
   than the gauge itself — it exposes whether you actually follow it.
3. **Ignore it inside 10% of the extremes.** The zone between 40 and 60 is noise; no action belongs there.
4. **Never let it override the plan.** The gauge reports conditions; your asset allocation decides actions.
5. **Watch the divergence, not the level.** Composite at 70 while FII flows have turned negative for a
   fortnight is a more honest warning than either number alone — the inputs disagreeing is itself information.

## The bottom line

The fear-greed dial is a repackaged volatility index with a UX budget. Once you rebuild it — an hour of
spreadsheet work on free data — three things change: you stop paying attention to the daily flicker, you
start using the extremes as scheduling prompts for reviews you already planned, and you develop a healthy
suspicion of any "proprietary indicator" an app uses to keep you opening the app. The market's sentiment is
measurable; the discipline to act on the measurement is the part no API supplies.
