---
title: "Excel versus the apps: tracking net worth on your own terms"
description: A practical comparison of spreadsheet and app-based net-worth tracking — what each records, the reconciliation routine, and the ₹2.1 crore worked example in both.
pubDate: 2026-08-24
author: Chirag Singhal
type: article
tags:
  - net-worth
  - tracking
  - excel
  - spreadsheet
  - portfolio-review
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

Net-worth tracking has two viable toolchains and one wrong way to choose between them. The apps (Kuvera,
INDmoney, ET Money, the broker portfolio pages) aggregate automatically and are free; the spreadsheet is
manual and belongs to you. People who argue for one side usually argue past the actual trade-off, which is
not features — it is who does the reconciliation, and what your numbers mean when a dispute, a loan
application or a death arrives. This article runs the same ₹2.1 crore household through both and shows where
each one breaks.

## What each tool actually records

| Dimension               | App / aggregator                        | Spreadsheet                           |
| ----------------------- | --------------------------------------- | ------------------------------------- |
| Mutual fund portfolio   | Automatic via CAS/PAN fetch             | You paste CAS values monthly          |
| Equity (demat)          | Automatic via broker/off-market feed    | You paste quarterly                   |
| Bank, FDs, RDs          | Partial (account-aggregator consent)    | You type balances                     |
| EPF/NPS balances        | EPFO passbook fetch; NPS via PRAN       | You type quarterly                    |
| Real estate, gold       | Not valued — or self-declared estimates | You type, with your own method        |
| Liabilities             | Loan balances often stale by months     | You type, always current              |
| History and projections | Built-in charts, fixed templates        | You own every column, incl. inflation |
| Password/data risk      | Third party holds your PAN-linked data  | Local file, your backups              |

The pattern is consistent: apps are excellent at _regulatory-reported_ assets (MFs, demat, EPF) and poor at
_everything you must value yourself_ — the flat, the ancestral plot, the sovereign gold bonds sitting in
demat but valued at issue price by the app's feed, the loan whose outstanding the app last refreshed when you
linked it. The spreadsheet is uniform: everything is a row you own and can audit.

## The ₹2.1 crore household, both ways

A couple, both 41, with these holdings: ₹85 lakh in mutual funds, ₹22 lakh in demat equity, ₹31 lakh EPF
combined, ₹14 lakh NPS, ₹9 lakh in FDs and savings, ₹2.5 lakh in SGBs, a flat bought at ₹62 lakh now
self-valued at ₹85 lakh, and a home loan with ₹21 lakh outstanding. The honest net worth:

| Item           | App shows                 | Spreadsheet shows                                  | Why they differ       |
| -------------- | ------------------------- | -------------------------------------------------- | --------------------- |
| Mutual funds   | ₹85,00,000                | ₹85,00,000                                         | Same CAS feed         |
| Equity + SGBs  | ₹24,50,000                | ₹24,50,000                                         | Same demat feed       |
| EPF + NPS      | ₹45,00,000                | ₹45,00,000                                         | Same passbook values  |
| Flat           | ₹85,00,000 (self-entered) | ₹71,00,000 (entered at registrar's guidance value) | Valuation method      |
| Home loan      | −₹21,00,000               | −₹21,00,000                                        | Same                  |
| Gold jewellery | ₹0 (never added)          | ₹6,50,000 (22g × ₹74,000/10g equivalent)           | Item existence        |
| **Net worth**  | **₹2,18,50,000**          | **₹2,11,00,000**                                   | ₹7.5 lakh of optimism |

The app's number is not wrong; it is _your_ inputs rendered through their template. The ₹14 lakh gap comes
from the app's flat valuation defaulting to what you typed three years ago and its jewellery template being
empty. The point is not that apps flatter — it is that the flattery is invisible inside a polished dashboard.

## Where each approach actually fails

**The app failure mode** is silent staleness: linked accounts that stop syncing after a password change,
loans that never update, a portfolio that looks flat in the dashboard because the feed died in March. The
user discovers the breakage a year later, at the loan application, and the reconciliation is then painful.

**The spreadsheet failure mode** is entropy: the file that lives on one laptop, the version with the August
update that is not the version with the September update, the formula someone overwrote, the death-of-file
problem where the surviving spouse cannot find or open it. Every one of these is fixable with two habits —
the file lives in cloud storage with version history, and one named cell holds "last updated" so staleness
announces itself.

## The hybrid that actually works

The rational division of labour: let the apps do the _fetching_ and the spreadsheet do the _judging_.

1. **Monthly, ten minutes:** open the app for the regulated assets' current values, paste them into the
   spreadsheet's monthly row. This keeps the sheet current without manual NAV lookups.
2. **Quarterly, thirty minutes:** revalue the self-valued items (flat, gold) using a stated method — registrar
   guidance value for property, IBJA silver/gold rates for metal — and note the method in a cell comment so
   future-you knows what the number meant.
3. **Annually, one hour:** reconcile the spreadsheet's totals to the CAS (NSDL's CAS shows all MFs and demat
   holdings under one PAN) and to the EPFO passbook. Any unexplained difference is an investigation, not a
   rounding.
4. **Once, ever:** write the file-location, the valuation methods and the account list into the family's
   one-page "where everything is" document, and update it annually. The CAMS/NSDL CAS request facility at
   [nsdl.co.in](https://nsdl.co.in) is the backbone of this — one email a year regenerates the master list.

## The reconciliation habit that matters more than the tool

Whichever tool, the discipline that catches real problems is the same: **every balance change should have a
reason you can name.** ₹85 lakh became ₹88.2 lakh — of which ₹40,000 was SIP, ₹3.1 lakh was market movement,
and ₹20,000 was the dividend that hit the bank but not the sheet. When a number moves without a name, the
causes in descending probability are: your bookkeeping lags, a feed broke, someone transacted without telling
you, or fraud. The tools differ in how they surface this; the habit is portable across both.

## The bottom line

Apps win on fetches, spreadsheets win on truth-ownership, and the household that runs both gets each tool's
strength while neither tool's failure mode reaches the other's records. The annual CAS reconciliation is the
load-bearing ritual — one document, every regulated asset under one PAN, matched against one sheet. What the
comparison really measures is not software but custody of judgment: the number that decides your financial
life should be one you can reconstruct from source documents, not one you can only refresh.
