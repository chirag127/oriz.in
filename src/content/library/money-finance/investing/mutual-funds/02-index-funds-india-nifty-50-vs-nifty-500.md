---
title: "Index funds in India: Nifty 50, Nifty 500, and the choice that matters less than you think"
description: How Indian index funds work — tracking error, TRI benchmarks, expense ratios — and an honest comparison of Nifty 50 vs Nifty Next 50 vs Nifty 500 for a core portfolio.
pubDate: 2026-08-09
author: Chirag Singhal
type: article
tags:
  - index-funds
  - nifty-50
  - nifty-500
  - passive-investing
  - mutual-funds
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

An index fund owns the index — nothing more, nothing cleverer. Its returns will be the index's total return minus
the expense ratio and tracking error, by construction, in every year, forever. That guarantee is the entire
product. Everything else in this article is the decision of _which_ index, and the honest arithmetic of how much
that choice actually matters compared to the choices most people agonise over instead.

## The mechanics: TRI, tracking difference, tracking error

SEBI requires funds to benchmark against the **Total Return Index** (TRI) — the index _with_ dividends
reinvested, which adds roughly 1.2–1.5% a year over the price index. The two numbers that judge a fund:

| Metric                 | Definition                                    | Good value                                  |
| ---------------------- | --------------------------------------------- | ------------------------------------------- |
| Tracking difference    | Fund return − index TRI return, over a period | As close to 0 as possible (−0.1 to −0.5%)   |
| Tracking error         | Standard deviation of that difference         | Under 0.5% annualised for large-cap indices |
| Expense ratio (direct) | Annual fee                                    | 0.10–0.20% Nifty 50; 0.10–0.30% Nifty 500   |

Tracking _difference_ is what you eat; tracking _error_ is how noisy the eating is. A fund can have a low error
and a steady −0.4% difference — consistent, expensive tracking. Choose on difference. The information is on every
fund factsheet, and reading one is covered later in this track.

## The candidates

| Index              | What it holds                                    | Direct expense ratio | Long-run TRI history                          |
| ------------------ | ------------------------------------------------ | -------------------- | --------------------------------------------- |
| Nifty 50           | India's 50 largest companies, ~39% of market cap | 0.10–0.20%           | ~12% since 1999                               |
| Nifty Next 50      | Ranks 51–100                                     | 0.30–0.50%           | ~13–14% since 2005, far more volatile         |
| Nifty 100          | Top 100                                          | 0.15–0.25%           | Between the two                               |
| Nifty Midcap 150   | Ranks 101–250                                    | 0.30–0.60%           | Higher long-run, brutal drawdowns             |
| Nifty 500          | Top 500, ~96% of market cap                      | 0.10–0.30%           | ~12.5% since 1999, slightly above Nifty 50    |
| Nifty Smallcap 250 | Ranks 251–500                                    | 0.40–0.80%           | Highest long-run, worst decade-long stretches |

Two honest observations from that table. First, the differences in long-run TRI are smaller than the differences
in volatility — the choice of large-cap index is low-stakes, while the choice to include small/mid-cap is
high-stakes in both directions. Second, the Nifty 500's edge over the Nifty 50 comes almost entirely from its
mid- and small-cap slices — it is not a "better 50", it is a broader 500.

## The comparison that matters: concentration vs breadth

|                                   | Nifty 50                        | Nifty 500                                           |
| --------------------------------- | ------------------------------- | --------------------------------------------------- |
| Top 10 stocks' weight             | ~55–60%                         | ~35–40%                                             |
| What you miss                     | The next 450 companies entirely | Nothing within top 500                              |
| Sector tilt                       | Heavy financials + energy       | Closer to market                                    |
| Behavioural risk                  | Feels "safe", is concentrated   | Diversified, but tracks the full market's drawdowns |
| History since 1999 (TRI, approx.) | ~12%                            | ~12.5%                                              |
| Worst calendar drawdowns          | Deep but shorter recoveries     | Deeper, longer recoveries in small-cap tails        |

The Nifty 50's concentration in its top ten is the part nobody feels until a decade like 2015–2024, when a
handful of stocks drove most of the index's return. Missing that decade in the "safer" 50-stock fund was the
expensive kind of safe. The Nifty 500's counter-risk is subtler: it _always_ owns what the market owns, including
the bubbles — at their weight, at their price, at the top.

## The 0.5% that decides nothing (and the 3% that does)

Run the honest arithmetic. ₹10,000/month for 25 years:

| Assumption                                                 | Corpus       |
| ---------------------------------------------------------- | ------------ |
| Nifty 500 TRI at 12.5%, 0.25% expense                      | ~₹1.66 crore |
| Nifty 50 TRI at 12.0%, 0.15% expense                       | ~₹1.56 crore |
| Either index, but SIP stopped after 3 years of market fall | ~₹70 lakh    |

The difference between the index choices — roughly ₹10 lakh over 25 years — is smaller than the behavioural cost
of one abandoned SIP. This is the quiet finding of every index-fund discussion: **which broad index you pick
matters far less than whether you keep feeding it.** Choose one, automate it, and direct your anxiety elsewhere.

<figure class="callout">
  <div class="callout-title">The Next 50 trap</div>
  <p>
    Nifty Next 50 has beaten Nifty 50 over several long windows, and the annual article recommending it writes
    itself. The trap is sequence: NN50's edge came in bursts separated by decade-scale underperformance and
    drawdowns exceeding 60% (2000–2013 was one long such stretch). Holding it requires tolerating years where
    your "large-cap fund" is the worst performer in the portfolio. Most investors who buy it after a good run
    exit after a bad one — converting the long-run edge into a personal loss. Index choice is a temperament
    question before it is a return question.
  </p>
</figure>

## The portfolio that the numbers support

For most Indian investors, one of two structures captures the available breadth without becoming a museum of
folios:

| Structure        | Allocation                          | Who it suits                                           |
| ---------------- | ----------------------------------- | ------------------------------------------------------ |
| Single-fund core | 100% Nifty 500 (or Nifty 100)       | The simple core; everything else is satellite          |
| Split core       | 70% Nifty 50 + 30% Nifty Midcap 150 | Deliberate tilt, accepts more drawdown                 |
| Traditional core | 70% Nifty 50 + 30% active flexi-cap | The bridge portfolio for those keeping one active fund |

The satellite layer — small-cap funds, sector bets, stock picking — is a separate decision with separate rules,
and belongs in a minority allocation precisely because its long-run edge comes with decade-long penalties. The
index-fund core's job is to be boring, complete, and cheap.

## The regulation underneath

Index funds in India are SEBI-regulated mutual funds with mandated benchmark disclosure and daily TER
transparency ([sebi.gov.in](https://www.sebi.gov.in/)); the indices themselves are maintained by NSE Indices
Limited with published methodology and rebalancing rules. The consequence of a scheme winding up, an index
methodology change, or a fund-house merger is defined by regulation and trustee oversight — the failure modes
are operational, not existential. What is _not_ regulated is your behaviour, which remains the largest
uncontrolled variable in the entire system.

## The one-paragraph answer

Buy a broad-market index fund — Nifty 500 or Nifty 100 if you want one fund, Nifty 50 plus a midcap 150 fund if
you want a deliberate tilt — in its direct plan, via SIP, on salary day, and add nothing clever to it until your
savings rate and emergency fund are done. The annual cost of getting the index choice "wrong" within this family
is a fraction of a percent. The annual cost of not automating it, or of selling it in the drawdowns that the
table above promises will come, is measured in multiples of your corpus. Index investing is not a philosophy
about markets. It is a decision about which variable you want to control.
