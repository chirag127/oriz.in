---
title: "DICGC: the ₹5 lakh deposit insurance, what it actually covers and when it pays"
description: How DICGC insurance works — the ₹5 lakh limit per bank per depositor, what counts as the same depositor, premium history, past failures and payouts, and how to structure deposits around it.
pubDate: 2026-07-28
author: Chirag Singhal
type: article
tags:
  - dicgc
  - deposit-insurance
  - bank-failure
  - risk
  - fd
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

Every bank deposit in India carries government-backed insurance of ₹5 lakh per bank per depositor — principal and
interest combined — through the Deposit Insurance and Credit Guarantee Corporation ([dicgc.org.in](https://dicgc.org.in/),
a wholly-owned RBI subsidiary). Almost nobody has read how it works, and the gaps between the popular belief and
the actual rule are where real money gets stuck: families with ₹40 lakh in one cooperative bank assumed "bank
savings are safe", and learned otherwise during a 90-day claims process. This article is the mechanics.

## The limit, precisely

₹5 lakh per depositor per bank, per _insured category_. The limit aggregates all your balances at one bank —
savings, FDs, RDs, current account, recurring deposits — principal plus accrued interest. Two deposits of ₹3 lakh
each at the same bank are ₹6 lakh of exposure with ₹5 lakh covered. But deposits held in different _capacity_
categories are insured separately:

| Category                                                       | Insured separately?                      | Example                                                              |
| -------------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------- |
| Single account vs joint account                                | Yes                                      | ₹5 lakh in your name + ₹5 lakh your share of a joint account         |
| Joint accounts, each joint holder                              | Yes — each holder's share up to ₹5 lakh  | Two holders → up to ₹10 lakh covered on one joint account            |
| Same person, different capacities (trustee, guardian, partner) | Yes                                      | Guardian for a minor's account is a separate capacity                |
| Branches of the same bank                                      | No — one bank                            | ₹3 lakh at Branch A + ₹3 lakh at Branch B = ₹6 lakh, ₹5 lakh covered |
| Different banks                                                | Yes                                      | ₹5 lakh covered at each of Bank X, Y, Z                              |
| Two banks that later merge                                     | Generally one limit from the merger date | Watch merger announcements                                           |

The joint-account row is the most useful one families ignore: a couple with ₹18 lakh can hold ₹6 lakh per bank
account configuration and remain fully covered — single + joint + joint-with-different-order does much of the
work.

## What is covered and what is not

| Covered                                                                    | Not covered                                                                           |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Savings, current, FD, RD balances (incl. accrued interest) to ₹5 lakh      | Money in mutual funds, stocks, NPS, PPF (government-guaranteed separately, not DICGC) |
| Deposits at commercial banks, RRBs, cooperative banks, SFBs                | Inter-bank and corporate deposits of institutions                                     |
| Primary credit-society deposits for members                                | Foreign government deposits, staff deposits in some cases                             |
| Fixed and savings deposits of companies/firms (same ₹5 lakh per depositor) | Deposits outside India                                                                |

Note the second not-covered row's most important implication: money in liquid funds and debt mutual funds is _not_
bank deposit — it carries market risk regulated by SEBI, not DICGC insurance. The ₹5 lakh limit is frequently
mis-remembered as "per account" (wrong — per bank) or as covering investments (wrong — deposits only).

## The premiums and the process

DICGC charges banks a premium of 12 paise per ₹100 of assessable deposit per year (0.12%). Banks absorb it; the
depositor pays nothing. The process when a bank fails:

| Stage                                 | Timeline                                | What happens                                                       |
| ------------------------------------- | --------------------------------------- | ------------------------------------------------------------------ |
| Bank's licence cancelled / moratorium | Day 0                                   | RBI acts; DICGC is appointed liquidator or agent in most cases     |
| DICGC advances up to ₹5 lakh          | Within 90 days of receiving claim lists | Paid per depositor per bank, per category                          |
| Balance above ₹5 lakh                 | On liquidation realisation              | Pro-rata from remaining asset sales; historically low recovery     |
| Cooperative-bank restructuring        | Variable                                | Some failures resolved via mergers with full repayment; others not |

The record: between 1997 and the 2020 amendment, DICGC paid out claims for roughly 1,700 cooperative-bank
failures. The ₹5 lakh limit was raised from ₹1 lakh in February 2020 — after the PMC Bank failure, where depositors
with crores stuck in moratorium became a national story. The amendment also allowed _advance_ payment within 90
days rather than waiting for full liquidation, which was the substantive improvement for small depositors.

## The 2021 rule that fixed the worst injustice

Before 2021, depositors whose banks were under _moratorium_ (not yet liquidation) waited for the moratorium to end
before any claim. The DICGC (Amendment) Act, 2021 made interim payment of up to ₹5 lakh mandatory within 90 days
even during moratorium. For the ₹5 lakh-and-under depositor — the overwhelming majority of Indian accounts — the
change effectively means: bank fails → full money within ~90 days, regardless of what happens to the bank
afterwards.

<figure class="callout">
  <div class="callout-title">The interest accrual detail that changes the limit</div>
  <p>
    The ₹5 lakh is principal *plus* accrued interest. A ₹4,85,000 FD booked at 7% for three years accrues to over
    ₹5.5 lakh at maturity — putting the final year's interest outside the cover. Structure the deposit so that
    principal plus *booked* interest stays inside ₹5 lakh per bank, or accept the excess as un-insured exposure.
    Most depositors sizing to "₹5 lakh" forget that the number includes the coupon.
  </p>
</figure>

## How to structure deposits around the limit

The rule is arithmetic: per bank, keep principal + interest ≤ ₹5 lakh.

| Family corpus               | Structure                                                            | Coverage                             |
| --------------------------- | -------------------------------------------------------------------- | ------------------------------------ |
| ₹4 lakh                     | One bank, any configuration                                          | Fully covered                        |
| ₹10 lakh                    | Two banks, ₹5 lakh each (or ₹4.6L + interest)                        | Fully covered                        |
| ₹20 lakh, couple            | Per spouse: 2 banks × ₹5 lakh; plus joint account ₹5 lakh each-share | Fully covered                        |
| ₹50 lakh                    | 8–10 bank relationships, or shift the excess to other instruments    | Fully covered, more admin            |
| ₹50 lakh in one SFB at 8.5% | Extra yield ~1% = ₹5,000/year                                        | ₹45 lakh uncovered — priced decision |

The last row is the honest framing: chasing an extra 1% at a small-finance or cooperative bank while holding
₹20 lakh there is choosing ₹2,000 of extra annual yield against ₹15 lakh of uncovered exposure. For amounts well
inside the limit, the extra yield is free money. Above it, the risk-reward deserves a spreadsheet, not a
savings-app screenshot.

## The legality note

Nothing grey here — deposit insurance is statutory, governed by the DICGC Act, 1961 as amended, with RBI
regulation of the insured institutions ([rbi.org.in](https://www.rbi.org.in/) publishes the list of insured banks
and the framework). Two consequences worth knowing, though: first, _unclaimed_ deposits — accounts inactive beyond
10 years — transfer to the DEA Fund of the RBI, and while the depositor's right to claim survives, the money stops
earning and the claim process runs through the bank's records; a nominee on every account prevents the far worse
outcome where the family does not know the deposit exists. Second, a depositor's claim against a failed bank above
the insured limit ranks in liquidation waterfall order — behind depositors' priority claims in some structures but
often at low recovery percentages; the _penalty_ for concentration is not hypothetical, it is a haircut with a
historical record.

## The one-line takeaway

₹5 lakh per bank per depositor is robust protection for the way most Indian households actually bank — and a
fiction for the way a surprising number actually _ladder_ FDs into a single favourite bank. Count your balances
against your banks tonight; the exercise takes ten minutes and the answer is either reassuring or a to-do list.
