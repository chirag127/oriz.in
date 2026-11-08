---
title: "Related-party transactions: the detection method that works on Indian annual reports"
description: A practical system for finding related-party flows in Indian filings — where the disclosures live, the four flow patterns, ratio tests and the numbers that expose tunnelling.
pubDate: 2026-07-21
author: Chirag Singhal
type: article
tags:
  - related-party-transactions
  - corporate-governance
  - red-flags
  - annual-report
  - sebi
difficulty: advanced
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

Related-party transactions are the leading cause of shareholder value destruction in Indian markets that is
_visible before it happens_. The Satyam fraud, the collapse of several 2010s infrastructure and
conglomerate groups — almost every one had a related-party note that, read carefully, described the
mechanism years in advance. The disclosures are mandatory, standardised and public. What is missing is a method.
This is the method: where the disclosures live, what flow patterns to look for, and the numeric tests that turn
a dense note into a verdict.

## Where the disclosures actually are

Four places, in ascending order of detail:

1. **The Ind AS 24 note** in the financial statements — every related party, every transaction type, every
   balance outstanding, for the year and the previous year. This is the core document.
2. **Form MGT-9 extract** in the board's report — shareholding of related entities (less relevant now that
   MGT-9 was dropped for newer years, but the older reports remain useful).
3. **Regulation 23 of SEBI (LODR), 2015** disclosures — related-party party contracts approved and the policy
   on materiality, available in the governance report.
4. **The stock exchange filing of the related-party transaction policy** itself, which tells you the
   materiality threshold the company set — a company can legally set a high threshold and thereby route many
   transactions without audit-committee approval.

The Ind AS 24 note is where you do the work. It lists: entities controlled by promoters (holding companies,
fellow subsidiaries, private companies owned by the family), key managerial personnel, and their relatives.
Every rupee crossing between the listed company and these parties is tabulated by type: sale of goods, purchase
of goods, services received, services rendered, loans given, loans taken, guarantees, lease payments, royalty,
brand fees, management fees.

## The four flow patterns and what each means

**Pattern 1 — sales to related parties.** Revenue booked to entities the promoters control. The risk is
inflated or round-tripped revenue: the related party buys because no one else would, or buys and the money
returns through another route. Test it: what percentage of total sales goes to related parties, and is it
rising? Above 10% demands explanation; above 25% makes the revenue quality a related-party question.

**Pattern 2 — purchases from related parties.** Costs padded through promoter-owned suppliers. The test is
market comparison: if the listed company buys a service at ₹2 crore a year that comparable companies buy at
₹60 lakh, ₹1.4 crore a year is being transferred out. This is the classic _tunnelling_ mechanism — value moving
from the listed company to the family's private entities.

**Pattern 3 — loans, advances and investments into related entities.** Money leaving the listed company as
"loans and advances" to group concerns, or as equity investments in unlisted group companies. Test: total
outstanding loans to related parties ÷ net worth, and whether interest is being received at market rates and
whether principal is returning.

**Pattern 4 — guarantees and contingent support.** The listed company guaranteeing group debt. No cash leaves
today; the risk is contingent. Total guarantees given ÷ net worth is the ratio; above 25% is a real exposure,
above 50% means the listed company is the credit engine for the group.

| Flow pattern                | Ratio to compute                | Comfort zone | Investigate                          |
| --------------------------- | ------------------------------- | ------------ | ------------------------------------ |
| Sales to RPTs               | RPT sales ÷ total sales         | Under 5%     | Over 15%, or rising 3 years          |
| Purchases from RPTs         | RPT purchases ÷ total purchases | Under 10%    | Over 20% without a pricing rationale |
| Loans to group entities     | Loans outstanding ÷ net worth   | Under 5%     | Over 10%, or zero interest rate      |
| Guarantees given            | Guarantees ÷ net worth          | Under 10%    | Over 25%                             |
| Royalty / brand / mgmt fees | Fees ÷ operating profit         | Under 5%     | Over 10%, or fees while profits fall |

## The numeric tests that catch tunnelling

**Test A — the group profit share.** Consolidated profit versus standalone profit. If the consolidated statement
shows the group earning ₹200 crore while the listed entity standalone earns ₹320 crore, ₹120 crore of profit is
being generated (or absorbed) in unlisted subsidiaries whose ownership you cannot see clearly. Check the
subsidiary-level details: who owns 26%, who owns the rest, and whether minority shareholders of the listed
company benefit from those subsidiaries at all.

**Test B — the interest rate audit.** The Ind AS 24 note shows loan balances; the interest income note shows
what was earned. A ₹100 crore loan to a promoter entity earning ₹2 crore (2%) while the company borrows at 9%
is a wealth transfer of roughly ₹7 crore a year — about 23% of a ₹30 crore profit if the company is small. This
single arithmetic line has justified more sell decisions than any chart.

**Test C — the receivables drift.** Compare "amounts due from related parties" year over year against sales to
related parties. Balances rising faster than sales means the related parties are not paying — the listed company
is financing the group's working capital and booking revenue it has not collected.

**Test D — the fee stack.** Sum royalty, brand fees, management fees, common-services fees and travelling and
"corporate" allocations charged to the listed company. Then divide by operating profit. A fee stack that grows
every year regardless of profit direction is a dividend stream for the family paid before the shareholder's.

| Test               | Formula                                         | Red flag threshold       |
| ------------------ | ----------------------------------------------- | ------------------------ |
| Group profit share | (standalone − consolidated) ÷ standalone        | Over 20% unexplained     |
| Interest rate gap  | Borrowing rate − rate earned on loans given     | Over 3 percentage points |
| Receivables drift  | Growth of RPT receivables − growth of RPT sales | Positive for 2+ years    |
| Fee stack          | All fees to promoters ÷ operating profit        | Over 10% and rising      |
| Guarantee exposure | Guarantees given ÷ net worth                    | Over 25%                 |

## Reading the approval chain

Related-party transactions above materiality require **audit committee approval**, and material ones require
shareholder approval where interested parties abstain (Regulation 23, and Sections 188 and 177 of the Companies
Act, 2013). Read the audit committee charter and the minutes' summaries in the governance report for:
transactions approved in a hurry at year-end (a seasonal flush of sales to related parties in March), repeated
re-approvals of the same contract at higher limits, and arm's-length certifications that reference "management
certified" rather than independent benchmarking. A company that keeps raising its own materiality threshold is
telling you where it wants to transact unobserved.

<figure class="callout">
  <div class="callout-title">The one question that organises everything</div>
  <p>
    For each related-party flow ask: would this transaction exist if the counterparty were not family? A
    distributor who is a promoter's in-law, buying at list price on 30-day credit, is commerce. A distributor
    who is a promoter's in-law, buying at a discount on 180-day credit, is the listed company extending its own
    balance sheet to the family's business — at the minority shareholder's expense.
  </p>
</figure>

## The legality note

Related-party transactions are legal, routine and often genuinely beneficial — group synergies, shared
infrastructure and promoter-backed rescues of distressed subsidiaries are all real. The regulatory design
assumes they will happen and disciplines them instead: arm's-length pricing under Section 188, audit-committee
and shareholder oversight, Ind AS 24 disclosure, and SEBI's 2021 tightening of the LODR framework which widened
the definition of related parties and lowered thresholds. What is illegal is the abuse: undisclosed transactions,
fictitious sales, diverted loans and loans written off rather than repaid attract SEBI enforcement, disgorgement
with interest, market bans and, through the fraud provisions of the Companies Act, prosecution
of officers under Section 447. Minority shareholders' remedy is detection, proxy voting and exit — the
disclosure framework is at [sebi.gov.in](https://www.sebi.gov.in).

## Turning the method into a habit

Run the five tests on any company where promoters control more than 40% of the votes, before you buy and once a
year after. The whole exercise takes 30 minutes with the Ind AS 24 note and two annual reports. What you are
pricing is not fraud — outright fraud is rare — but the _leakage_: the steady, legal, unaudited drift of value
from the listed company toward the controlling family that shows up as slightly lower margins, slightly worse
receivables and slightly less cash than the business should produce. Companies with a clean RPT profile and a
fee stack under 5% of operating profit deserve a place in the portfolio for that reason alone; it is the single
cheapest quality signal available to an individual investor.
