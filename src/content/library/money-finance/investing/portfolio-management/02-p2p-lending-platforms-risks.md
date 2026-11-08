---
title: "P2P lending in India: the 10–12% headline, the default math underneath, and the platform risk"
description: How P2P lending platforms actually work in India — borrower yields vs lender returns, default and recovery mechanics, the NBFC-P2P regulatory framework, and the risks the pitch skips.
pubDate: 2026-08-18
author: Chirag Singhal
type: article
tags:
  - p2p-lending
  - alt-investments
  - risk
  - nbfc
  - fixed-income
difficulty: advanced
toc: true
legal: grey
source:
  title: Rupee Realism
  url: https://github.com/chirag127/arac
  license: MIT
disclaimer: This article is educational and does not constitute financial, tax, investment, or legal advice. Rules, rates, and product terms change; verify current details with the relevant authority or a qualified professional before acting.
reviewStatus: editorial
license: CC BY 4.0
---

Peer-to-peer lending promises the yield FDs stopped paying: platforms advertise 10–12% returns to lenders,
borrowers pay 18–30%, and the difference is spread, platform fees, and losses. The model is real, regulated since
2017 by the RBI's NBFC-P2P framework — and the gap between the advertised return and the ledger return is where
most lender disappointment lives. This article explains the machinery, the math of defaults, and the specific
ways this asset class bites.

## The machinery

The lender does not lend to a borrower. The lender's money goes into the platform's escrow account, from which it
is matched to a pool of borrowers across tenures (typically 3–36 months); the platform services the loans,
collects EMIs, deducts its fee, and passes the flows back. Four actors, three fees:

| Actor            | Gets                          | Fee                                                 |
| ---------------- | ----------------------------- | --------------------------------------------------- |
| Lender           | The interest on matched loans | 0–2% servicing/management fee                       |
| Platform         | Match and servicing           | Origination + servicing + any "risk assessment" fee |
| Borrower         | The loan                      | 2–6% processing fee, often netted from disbursal    |
| Collection agent | Recoveries                    | Collection charges on delayed loans                 |

Note the structural detail that matters most: the platform's income comes from _volume_, not from your returns.
The fee table is aligned with matching more loans, not with selecting better ones. Regulation caps and shapes
some of this — the RBI's Master Direction on NBFC-P2P (2017) governs escrow handling, exposure limits, and
disclosure — but incentive alignment is not one of the regulated items.

## The default math

The advertised 10–12% sits on a borrower base paying 18–30%, which exists precisely because the base defaults at
meaningful rates. The gross yield minus expected loss is the only number that matters:

| Borrower segment                    | Interest paid | Typical default rate (industry, indicative) | Net to lender after fees/losses |
| ----------------------------------- | ------------- | ------------------------------------------- | ------------------------------- |
| Prime (CIBIL 750+, salaried stable) | 18–24%        | 3–5%                                        | 8–11%                           |
| Near-prime                          | 24–30%        | 6–10%                                       | 7–10%                           |
| Sub-prime / new-to-credit           | 30%+          | 12–20%                                      | 5–9%, high variance             |
| "Recovery-dependent" small-ticket   | 36%+          | 20%+                                        | Often below FD post-costs       |

Run the platform's own disclosed numbers, not the marketing page: SEBI-style per-platform disclosure is required
by the RBI direction — platforms publish monthly portfolio default rates, write-off rates, and recovery
percentages. The honest pattern across the industry: gross portfolio yields of 18–24%, net lender returns
reported in the 8–12% range in good years, and lower in stress years, with negative skew — the bad years are
_worse_ than the good years are better, because defaults arrive in clusters (a macro downturn raises default
across the entire pool simultaneously, exactly when lenders need the money).

## The four risks, ranked by damage

**1. Platform risk — the big one.** The platform itself can fail, and your loans do not disappear but your
_servicing_ does: collection calls, recovery processes, and record-keeping all run through the platform. A failed
or wound-down platform means waiting for an assignee or a court process to untangle thousands of small loans.
The RBI framework requires escrow accounts with trustee oversight, which mitigates fund diversion — not
operational continuity. **2. Default correlation.** The pool is diversified across _borrowers_ but not across
_economies_; a downturn raises defaults across the pool at once, and the platform's recovery machinery slows at
the same moment. **3. Liquidity.** There is no exit button. Secondary-sale windows on most platforms are thin or
absent; your 36-month exposure is a 36-month exposure even when month 8 is ugly. **4. Tax drag.** Interest income
is fully taxable at slab, with TDS at 10% once platform-reported interest crosses ₹5,000 a year (Section 194A read
with platform rules) — at the 30% slab, a 10% gross return nets 7%, at which point the risk-adjusted comparison
with other instruments gets uncomfortable.

## The legality: regulated, with edges

P2P lending as an NBFC-P2P is fully legal and RBI-regulated
([rbi.org.in](https://www.rbi.org.in/) — the Master Direction DBR.NBFC.No.63/2017 and subsequent amendments). The
regulation sets: lender exposure caps per borrower (₹50,000 across platforms), borrower caps, and mandatory
escrow. The _grey_ lives around the regulated core:

| Practice                                                      | Status           | The problem                                                                                      |
| ------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------ |
| RBI-registered NBFC-P2P platforms                             | Legal, regulated | The only version this article endorses                                                           |
| Unregistered "lending marketplaces" matching lenders directly | Grey to illegal  | Operate outside the framework; no escrow, no disclosure, no recourse framework                   |
| Group/instalment structures promising "guaranteed" returns    | Grey             | "Guaranteed" is not a promise the framework permits; the guarantor is usually a shell            |
| Recovery through harassment, intimidation calls               | Illegal          | RBI fair-practice guidelines and the Consumer Protection Act apply; borrowers have real remedies |

## The consequences, stated plainly

For the lender: a platform outside the RBI framework that fails has **no statutory claims process** for your
money — the escrow protection, exposure caps and disclosure duties exist only for registered NBFC-P2Ps, and the
_penalty_ for using an unregistered one is that you become an unsecured claimant in whatever insolvency follows.
For the borrower in default: consequences include credit-report damage (P2P loans are reported to CIBIL and
co-bureaus), collection escalation, and — where the platform litigates — civil recovery; harassment-based recovery
is actionable and has produced real penalties against platforms, but the primary consequence is the credit record,
which outlives the loan by years.

<figure class="callout">
  <div class="callout-title">The allocation rule</div>
  <p>
    P2P lending is not a fixed-deposit replacement; it is a small satellite in the fixed-income sleeve. A defensible
    ceiling is 5–10% of the fixed-income allocation, spread across two RBI-registered platforms at most, in
    short-tenure (3–12 month) tranches so the first defaults arrive while most of the capital is still re-deployable.
    The investors hurt worst by every platform failure in this sector held one position: 100% of their "high-yield
    savings" in one platform's 36-month notes.
  </p>
</figure>

## The diligence checklist

Before funding any platform: **registration** — verify the NBFC-P2P certificate on the RBI's database; **vintage
disclosure** — read the monthly default-rate and recovery disclosures, not the annual report's marketing pages;
**escrow trustee** — who holds the money and who audits the flows; **stress-era numbers** — what did the portfolio
yield in FY 2020-21 or FY 2023-24's tightening cycle, not just the good years; **tenure options** — whether
short tranches exist; **exit** — what the secondary window looks like in practice, with recent transaction
volumes. And run the comparison honestly: at the 30% slab, the realistic 7–9% net return against a 7.1% FD or
6.9% sovereign bond is a thin premium for four layers of risk the FD does not carry. The asset class is legitimate;
the marketing is not the asset class.
