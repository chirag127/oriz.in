---
title: "Invoice discounting platforms: the 9-12% pitch, the TReDS vs retail split and the default math"
description: What retail invoice discounting platforms actually underwrite, how returns survive fee and default, and where TReDS fits for MSME sellers.
pubDate: 2026-07-09
author: Chirag Singhal
type: article
tags:
  - invoice-discounting
  - fixed-income
  - msme
  - credit-risk
  - p2p
difficulty: intermediate
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

Invoice discounting pitches land in every investor's feed: "fund verified invoices of large corporates, earn
10–12% p.a., tenure 30–90 days." The pitch is not false. Corporate invoices _are_ short-term receivables with
known due dates, and the returns do land near that band. What the pitch leaves out is that you are lending
unsecured against a promise of payment — the invoice is not collateral, it is the _borrowing itself_ — and the
underwriting quality decides whether your 11% becomes 8% or 0%.

## What you are actually buying

When a business sells goods or services to a large buyer, it invoices on, say, 60-day payment terms. Waiting 60
days costs the seller money; discounting the invoice converts it to cash today. On a platform, the seller posts
the invoice, investors fund a fraction of it, and when the buyer pays on the due date, investors receive their
principal plus the discount yield.

The credit is to the **buyer** — the entity that must actually pay the invoice. That is why platforms
advertise invoices of large corporates: the buyer's credit quality is the whole game. Two structures exist and
they differ more than their marketing suggests:

| Structure                                    | Who bears buyer default                   | Typical net yield | Typical tenure |
| -------------------------------------------- | ----------------------------------------- | ----------------- | -------------- |
| Retail invoice discounting (platform-run)    | Investors, with platform recourse clauses | 9–12%             | 30–90 days     |
| TReDS (Trade Receivables Discounting System) | Financiers, RBI-regulated exchange        | 9–11%             | 30–120 days    |
| Distressed / late-stage invoices             | Investors, priced accordingly             | 14–18%            | unpredictable  |

TReDS deserves its own line: it is an RBI-mandated electronic exchange for MSME receivable financing — the two
live exchanges are [RXIL](https://www.rxil.in) and M1xchange, with A TReDS as the third entrant — where
financiers bid on receivables from registered buyers. Onboarding of buyers is mandatory above the turnover
thresholds RBI has set — ₹250 crore by 31 March 2025, widened from the earlier ₹500 crore ring — so that
registered MSME sellers can discount receivables against large buyers regardless of the buyer's own liquidity.
TReDS is
institutional credit infrastructure, not a retail investment product; retail investors reach it through funds
that invest in TReDS paper, not directly.

## The fee and default math

An advertised 11% annualized yield is before three subtractions. First, platform fees — some platforms charge
the seller, some charge investors a transaction fee of 0.25–0.5%. Second, the yield is annualized on tenure, so
a 90-day deal at 11% earns you 2.75% for the period — and if you have to wait 120 days for payment, your
realized annual return drops towards 8%. Third, defaults: the platform's "first-loss cushion" absorbs losses
only up to a percentage of the pool, and beyond that your individual invoice takes the hit.

| Scenario                                                     | Advertised yield | Fees | Realized yield | Notes                                  |
| ------------------------------------------------------------ | ---------------- | ---- | -------------- | -------------------------------------- |
| Everything pays on time                                      | 11%              | 0.3% | 10.7%          | the base case everyone models          |
| One ₹50,000 invoice of ₹5 lakh book defaults at 50% recovery | 11%              | 0.3% | ~7.5%          | one bad buyer in ten                   |
| Buyer delay of 60 days across the board                      | 11%              | 0.3% | ~8.5%          | annualized yield compresses with delay |
| Platform insolvency                                          | 11%              | 0.3% | unpredictable  | recovery through legal process         |

One default in ten invoices at 50% recovery consumes most of a year's interest across a diversified book. The
lesson is not to avoid the asset class; it is to understand that the _underwriting_ is the product, and the
platform's loss history — not its advertised yield — is the number to underwrite.

## The platform-level risks

The platform itself is a single point of failure in three ways. **Custody:** your money moves from your bank
into the platform's escrow account; if the escrow arrangement with the partner bank is loose, or the platform
commingles funds, recovery in a failure is by claim, not by instruction. **Recourse clarity:** many platforms
advertise "buyer risk" but their terms contain recourse clauses against the _seller_ — meaning the platform
chases the seller, and you wait. **Operational risk:** the platform's diligence on invoice authenticity is
what prevents duplicate financing of the same invoice; this is a real failure mode, not a theoretical one.

Ask three questions before funding: is the escrow account with a scheduled bank and is it disclosed; what is
the platform's realized default rate over the last two years, gross of recovery; and who exactly bears the loss
in the 30 days after a buyer misses payment.

## The regulatory status

Retail invoice discounting platforms are not individually licensed the way P2P NBFCs are; the activity sits
between RBI's P2P lending master directions and general corporate law. TReDS, by contrast, is explicitly
licensed under the Payment and Settlement Systems Act — the RBI's [TReDS framework](https://www.rbi.org.in)
is the authoritative reference for how MSME receivables must be financed. The distinction matters when a
platform fails: a TReDS exchange has an RBI-supervised settlement process, while an unlicensed retail platform
leaves you with a claim in insolvency. RBI's 2025 clarification tightened the onboarding mandate — companies
above ₹250 crore turnover had to complete buyer registration by March 2025 — so the institutional side of this
market is being formalized faster than the retail side, and the exchanges' combined discounting volumes now run
into tens of thousands of crore annually.

## The legality note

Buying genuine invoices at a discount is legal commercial paper; the income is interest or discount income
taxed at slab. What is grey — and occasionally outright illegal — is the packaging: platforms that pool money
into collective schemes without registration, promise fixed returns without recording it as deposit-taking,
or finance invoices they know to be circular (buyer and seller are related entities rotating the same invoice).
Consequences of unregistered collective investment schemes include SEBI refund orders with interest up to 10%,
deregistration, and prosecution of the platform's officers under Sections 11AA and 44 of the SEBI Act; deposit
-taking beyond NBFC norms attracts RBI action under the Reserve Bank of India Act. As an investor, your exposure
is recovery risk rather than prosecution, but a platform that cannot state its escrow bank and its realized
default rate is asking you to underwrite its structure, not its book.

## The bottom line

Invoice discounting is a legitimate fixed-income substitute when three things hold: the platform shows a two-year
realized default rate under 1% gross, the escrow is genuinely segregated, and you diversify across at least 15–20
invoices from different buyers rather than concentrating in one large corporate's paper. Under those conditions,
a 10–11% net yield on 60–90 day paper is real and better than most liquid alternatives. Under any other
condition, the 1–2% extra yield over a liquid fund is compensation for credit and platform risk you cannot see —
and the right response to unseeable risk is to demand the disclosure, not to close your eyes to it.
