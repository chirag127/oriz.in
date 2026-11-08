---
title: "Startup equity and ESOPs: what your grant is actually worth, and the valuation truth behind it"
description: How Indian startup ESOPs are valued, what 409A-style fair value means, the tax events that hit before any cash arrives, and the exit realities of private shares.
pubDate: 2026-07-20
author: Chirag Singhal
type: article
tags:
  - esop
  - startup-equity
  - valuation
  - taxation
  - private-markets
difficulty: advanced
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

Every offer letter in an Indian startup carries a line that changes the math of the job: "ESOPs worth ₹X." The
X is almost never money. It is an option on shares of a private company, valued by a report, exercisable only
on conditions, liquid only at an event that may be years away or may never come. This article is the honest
arithmetic of what that line is worth and when the taxman arrives.

## What an ESOP grant actually is

A grant of 5,000 ESOPs is an _option_, not a share. You acquire the right to buy shares at an exercise price
after a vesting schedule — the standard is four years with a one-year cliff. The value of the grant is
(share fair value minus exercise price) times the number of options, but only at the moment you can both
exercise _and_ sell. Before that moment, the value is a function of the company's own valuation report, not a
market price.

| Term                 | What it means                         | Where the traps are                           |
| -------------------- | ------------------------------------- | --------------------------------------------- |
| Grant                | Offer of options at exercise price    | Value depends on the valuation, not the count |
| Vesting              | 4 years, 1-year cliff standard        | Leaving early forfeits unvested options       |
| Exercise             | Paying the strike price to own shares | Triggers perquisite tax in India              |
| Fair value per share | From an accountant's valuation report | The company controls this number              |
| Liquidity event      | Acquisition, IPO, buyback             | The only day the value becomes cash           |

## How private startup shares are valued

Indian private companies commission a valuation report — typically a discounted cash flow or comparable-company
analysis, reviewed by a merchant banker for share issuance compliance under the Companies Act, and refreshed
each funding round. Three facts about these reports matter to you.

First, the report's fair value per share is almost always _lower_ than the last venture round's price per
share, because venture prices include control premiums, option-pool mathematics and round-specific terms the
report strips out. A common experience: the Series B prices shares at ₹400, the valuation report says fair
value is ₹220. Second, the fair value is the number your ESOP exercise price and your perquisite tax are
computed from. Third, the report is prepared by an accountant hired by the company; you are not the client,
and you do not get to negotiate it.

The gap between round price and fair value is where most ESOP disappointment lives. An employee with 5,000
options at a ₹100 strike, hearing "Series B at ₹400," imagines ₹20 lakh. If fair value is ₹220, the exercise
value is ₹6 lakh — and even that number is only realizable if a buyer for those shares exists.

## The tax events, in order

India taxes ESOPs at exercise, not at sale. When you exercise vested options, the difference between fair
market value on the exercise date and your exercise price is a _perquisite_, taxed at your slab rate as salary
income. The company withholds TDS on it. Later, when you sell the shares, the gain over the exercise-date FMV
is capital gains — long-term after 24 months for unlisted shares, at 12.5% without indexation under the
post-July 2024 rules.

| Event                  | Tax                                          | Cash needed                      |
| ---------------------- | -------------------------------------------- | -------------------------------- |
| Grant of options       | None                                         | None                             |
| Vesting                | None                                         | None                             |
| Exercise               | Perquisite at slab: (FMV − strike) × options | Tax money, plus the strike price |
| Sale after 24 months   | LTCG 12.5% without indexation                | On the gain                      |
| Sale within 24 months  | Slab rate on the gain                        | On the gain                      |
| Buyback by the company | Taxed as per the company's structure         | Varies                           |

The trap is the exercise row: tax is due on a paper gain, in cash, in the year of exercise, while the shares
themselves are illiquid. Employees who exercised during a high-valuation year and then watched the company's
next round price lower have paid slab-rate tax on gains that later evaporated. The 2023 amendment allowing
startups (DPIIT-recognized, meeting the conditions in Section 80-IG's successor rules) to defer the perquisite
tax for up to five years from exercise, or until sale, softened this — but the deferral must be claimed and
documented, not assumed.

## The liquidity truth

The exit is a distribution problem, not a valuation problem. Four routes exist, and each has a queue.

**IPO.** The rarest outcome. Lock-ups after listing run six months for pre-IPO shareholders. **Acquisition.**
Your shares convert per the deal's terms; preference shareholders (the investors) are paid before common
holders, and liquidation preferences can consume the entire consideration in a down-round sale. **Buyback.**
The company repurchases at a board-approved price, usually fair value, from a pool that is oversubscribed.
**Secondary sale.** Selling to an incoming investor at a round price, permitted only when the company's
ESOP/shares transfer policy allows it — and startup policies commonly restrict transfers.

| Exit scenario                           | What you actually receive                   |
| --------------------------------------- | ------------------------------------------- |
| IPO, lock-up expires, you sell          | Market price minus brokerage, minus LTCG    |
| Acquisition with 1x preference overhang | Common shares may receive little or nothing |
| Buyback at fair value ₹220, strike ₹100 | ₹120 per share, taxed appropriately         |
| Secondary at last round price           | Rarely permitted; buyer pool is small       |

The liquidation preference point is the one almost no employee models: if investors put in ₹300 crore at a
1x preference and the company sells for ₹350 crore, the equity split for common shareholders (including your
ESOP shares) happens only after the preference is returned. In a down-side sale, the "₹400 per share" from the
round announcement can legally settle at a fraction of it.

## The legality note

ESOPs themselves are fully legal and governed by the Companies Act, 2013 and the company's ESOP scheme; private
companies issue ESOPs under Section 62(1)(b) and the relevant rules, with filings visible at
[mca.gov.in](https://www.mca.gov.in). The grey zones are around _promises_, not structure: an employer verbally
guaranteeing a valuation, a founder granting "advisory shares" outside the formal scheme, or a company issuing
shares at a valuation that later fails merchant-banker scrutiny. Consequences of non-compliant allotments
include the company's shares becoming open to rectification under Section 59 of the Companies Act, penalties on
the company and its officers under Section 62's penalty provisions, and in valuations where the report was
misrepresented, exposure under Section 447 for fraud — which carries imprisonment where the amount involved is
material. As an employee, your protection is documentary: the grant letter, the ESOP scheme, the exercise
notice and the share certificate or demat statement. Insist on them; verbal assurances about future value are
not enforceable instruments.

## The bottom line

Value an ESOP grant with three numbers, not one: the fair value per share from the latest report (not the round
headline), the exercise price, and the vesting clock you are actually willing to serve. Then discount for
liquidity — a private share you cannot sell is worth less than the same share post-IPO, and the discount is
not a rounding error. Exercise early only if you can pay both the strike and the tax without distress; exercise
late only if you accept the tax being computed on a FMV you did not choose. The best position in an Indian
startup ESOP is the boring one: a grant you can explain to a CA in ten minutes, backed by documents you have
actually read.
