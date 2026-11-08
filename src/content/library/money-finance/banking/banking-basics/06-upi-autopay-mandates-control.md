---
title: "UPI Autopay and NACH mandates: subscriptions on autopilot, with the brakes on"
description: How UPI Autopay and NACH/e-mandates actually work — caps, cycles, block-and-pause mechanics, the bounce cascade, and the audit that keeps recurring debits under your control.
pubDate: 2026-08-03
author: Chirag Singhal
type: article
tags:
  - upi-autopay
  - nach-mandate
  - subscriptions
  - banking
  - automation
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

UPI Autopay turned recurring payments into a two-tap decision: subscribe once, and the debit happens monthly
without you. NACH mandates did the same for EMIs, SIPs and insurance long before. The convenience is real — and so
is the drift: the average phone now carries more active recurring debits than its owner can list, and the average
bank statement shows subscriptions for services used twice. The control problem is not the technology; it is that
nobody audits the mandate list. This article is the mechanics and the audit.

## The two rails, distinguished

| Feature                           | UPI Autopay                                                                                   | NACH/e-mandate (bank account)                                       |
| --------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| What it is                        | Recurring debit on UPI rails, set via your UPI app                                            | Bank-level mandate (SIP, EMI, insurance, utility)                   |
| Typical use                       | OTT, gym, insurance, apps, rentals                                                            | EMIs, mutual-fund SIPs, utility bills                               |
| Per-transaction cap (UPI Autopay) | Up to ₹15,000 without additional factor of authentication (RBI framework; category-dependent) | Mandate amount set at creation                                      |
| Cycles                            | Daily, weekly, fortnightly, monthly, quarterly, annual, 'on-demand'                           | Mostly monthly                                                      |
| Where managed                     | Your UPI app (GPay/PhonePe/Paytm) → Autopay section                                           | Bank's mandate page, MF platform, or loan account                   |
| Cancellation                      | In the UPI app, instant                                                                       | Through the bank or the biller; 30-day notice historically for some |

The RBI's recurring-transaction framework (the 2022 framework for processing recurring transactions, with the
e-mandate infrastructure) requires pre-debit notification — the customer must be informed before each debit, with
a defined window for block or pause. The mechanics exist in law and in the apps; almost nobody uses them.

## The pre-debit notification, actually used

Three days before a UPI Autopay debit, the app shows the upcoming mandate; you can block that specific debit or
pause the mandate. For NACH, the bank sends an SMS/email pre-debit alert (timing varies; some billers send
notifications as late as T-1). The control loop nobody runs: **the notification is only useful if you read it and
act before the debit window closes.** A practical system:

| Habit                                        | Cadence        | What it prevents                      |
| -------------------------------------------- | -------------- | ------------------------------------- |
| Mandate audit — list every active mandate    | Quarterly      | The forgotten ₹299 × 12               |
| Pre-debit notifications ON, not muted        | One-time setup | Surprise debits in low-balance months |
| Balance floor alert at ₹15,000               | One-time setup | The bounce cascade                    |
| Pause (not cancel) before any low-cash month | Monthly check  | Failed SIP + fees + lapsed policy     |

The audit takes twenty minutes: open the UPI app's Autopay list, the bank's mandate page, and the card's
"manage subscriptions" section, and write every entry with its amount and date. Families typically find 8–15
active mandates, of which 2–4 are dead weight — apps cancelled on the platform but still billing, a gym from a
city two moves ago, an insurance top-up that was supposed to be one-time.

## The bounce cascade, quantified

The failed mandate is the expensive part, and it is a chain:

| Failure stage                 | Cost                                                   | Who charges  |
| ----------------------------- | ------------------------------------------------------ | ------------ |
| UPI Autopay debit fails       | Usually no fee to you; the biller may charge late fees | Biller       |
| NACH/SIP debit fails          | ₹300–600 per bounce                                    | Bank         |
| MF SIP marked for termination | After repeated failures (typically 3)                  | AMC/platform |
| EMI miss                      | Late payment fee + interest + credit-report entry      | Lender       |
| Insurance premium miss        | Grace period (30 days typical), then lapse             | Insurer      |

The cascade's real cost is the last two rows: a credit-report entry and a lapsed health policy. A ₹499 subscription
bouncing is noise; a ₹18,000 EMI bouncing because a phone subscription cleared first is a ₹500 bank fee, a late
fee, and a credit-report line. **Sequence the debits** — the salary-day article in this track gives the order —
and keep a balance floor above the month's total committed debits.

<figure class="callout">
  <div class="callout-title">The 'on-demand' mandate is the scariest one</div>
  <p>
    UPI Autopay supports 'on-demand' mandates — the biller can debit a variable amount when it chooses, within a
    ceiling you approved at signup. That ceiling is the number to read: a ₹5,000 on-demand mandate is a standing
    permission for a ₹5,000 debit on any day the merchant's logic fires. Read the ceiling, set it to the true
    per-cycle maximum you intend to pay, and treat every on-demand mandate as a pre-authorised withdrawal, which
    is what it is.
  </p>
</figure>

## What the caps and rules actually are

The operative RBI framework for recurring transactions via cards and UPI requires **AFA (additional factor of
authentication) at mandate creation, pre-debit notification, and a block/pause window**; the ₹15,000 per-transaction
figure above is the current no-AFA ceiling for UPI Autopay execution (it has been revised before — it was ₹5,000
at launch in 2021–22 — so verify the current number in the RBI's notifications at
[rbi.org.in](https://www.rbi.org.in/)). For card-based e-mandates, the same framework applies with card-network
rules layered on. Two practical consequences: first, mandates above the cap require authentication at creation —
friction that filters impulse signups; second, pre-debit notifications are a _right_, and muting them is a choice,
not a requirement.

## The subscription arithmetic

The average Indian smartphone user underestimates their recurring load by half. Run your own numbers:

| Subscription type              | Typical monthly | Annual cost | Corpus needed to fund it perpetually (4% SWR) |
| ------------------------------ | --------------- | ----------- | --------------------------------------------- |
| OTT stack (3 platforms)        | ₹600            | ₹7,200      | ₹1.8 lakh                                     |
| Gym/fitness                    | ₹1,500          | ₹18,000     | ₹4.5 lakh                                     |
| Cloud storage + productivity   | ₹300            | ₹3,600      | ₹90,000                                       |
| Food-delivery premium programs | ₹300            | ₹3,600      | ₹90,000                                       |
| News + apps misc               | ₹400            | ₹4,800      | ₹1.2 lakh                                     |

The last column reframes every subscription as an asset decision: a ₹1,500/month gym habit you actually use is
worth ₹4.5 lakh of corpus; the same ₹1,500 for a gym you stopped attending in February is the same corpus spent
on nothing. The audit's purpose is not to zero the list — it is to make every line _chosen_.

## The legality note

Mandate mechanics are fully regulated and legal; the RBI's framework governs them precisely
([rbi.org.in](https://www.rbi.org.in/)). The grey and the consequences live at the edges. First, **unauthorised
debits**: a mandate executing beyond its approved amount or cycle is a dispute — UPI has a defined complaint and
chargeback mechanism through the app, escalating to the bank's nodal officer and the Ombudsman; the RBI's
customer-protection framework places the liability for unauthorised transactions on the bank in defined
circumstances, with zero or limited liability for the customer when reported within three working days. Report
fast; the liability windows are short. Second, **cancellation notice periods**: some billers and older NACH
mandates carry 30-day notice clauses — a 'cancel today' that still debits next month is not a scam, it is the
mandate's terms; initiate cancellations a cycle ahead of when you want them to stop. The penalty for ignoring
both points is the same: money debited that a faster, better-documented complaint would have recovered.
