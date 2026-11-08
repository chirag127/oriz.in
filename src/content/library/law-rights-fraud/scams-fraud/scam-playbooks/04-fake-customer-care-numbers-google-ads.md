---
title: "Fake customer care numbers: how Google Ads harvests banking fraud victims, and the safe-number habit"
description: How fraudsters buy search ads with fake customer-care numbers, the remote-access and OTP playbook they run, bank liability rules and the verification habit that stops it.
pubDate: 2026-08-23
author: Chirag Singhal
type: article
tags:
  - fake-customer-care
  - google-ads
  - cyber-fraud
  - bank-liability
  - otp-fraud
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

The fake customer care number is the quietest large-scale fraud in India: no fake website, no APK, no
uniformed officer. Just a phone number at the top of a Google search result, bought with an ad budget, staffed
by a fraudster who answers as the bank, the airline, the insurance company or the wallet app. The RBI's own
public advisories and every bank's fraud page now warn about it — because the victim's first "official" act
is the one that loses the money.

## How the fraud is set up

Fraudsters run paid search ads against high-intent queries — "SBI credit card customer care", "IRCTC
refund helpline", "Paytm KYC number", "IndiGo cancellation". The ad's display name borrows the brand; the
landing page is often a clone of the company's contact page. A user with a real problem — a failed refund, a
blocked card, a suspicious debit — is the ideal victim, because they are already anxious and already expecting
to hand over account details.

| Search intent                 | Ad served as                 | What the "agent" does                                    |
| ----------------------------- | ---------------------------- | -------------------------------------------------------- |
| Card blocked / refund pending | Bank's name, "24×7 helpline" | Asks for card number, CVV, OTP "to verify"               |
| Flight cancellation           | Airline's name               | Asks for full card details "for processing the refund"   |
| UPI/KYC expiry                | Wallet app's name            | Asks for screen share or app install                     |
| Insurance claim               | Insurer's name               | Asks for policy + bank credentials "to credit the claim" |
| Fastag recharge issue         | NHAI-style branding          | Collects UPI PIN "to fix the wallet"                     |

The ad-buying economics are straightforward: a click on "customer care number" costs a few rupees, and a
successful fraud yields thousands. The fraudsters' bids outbid legitimate brands on their own service
queries because the legitimate company rarely runs search ads for its own helpline — the number is already
on the card, the app and the website footer.

## The playbook once you dial

The call follows a consistent script, tuned to the query that brought you there:

1. **Verification theatre.** "Sir, to confirm your identity, please tell me the card number and the OTP I am
   sending." No legitimate process requires the OTP to be _read out_ — the OTP's entire security model is
   that only you should ever see it.
2. **The urgency frame.** "Your account will be debited if the refund request is not completed in 10
   minutes." The deadline prevents the callback you would otherwise make.
3. **The screen-share pivot.** For victims with a live problem, the "agent" offers to "fix it while you
   watch" — AnyDesk or a screen-sharing app, and now the operator reads every OTP as it lands.
4. **The small-test transfer.** ₹1 or ₹5 "to verify the account" — which is actually the first real
   debit, confirming the channel works.
5. **The drain.** Card-on-file transactions, UPI collect requests approved by the victim, or direct
   transfers once the session is under control.

| Step               | What the victim believes        | What is actually happening            |
| ------------------ | ------------------------------- | ------------------------------------- |
| OTP read-out       | "Verification step"             | Transaction authorisation in progress |
| Screen share       | "The agent is fixing the issue" | Live view of every credential and OTP |
| ₹1 test            | "Account check"                 | Channel confirmation                  |
| "Refund processed" | Success                         | The drain begins                      |

## The safe-number habit

The defence is a retrieval discipline, not a technology. The rule: **never take a customer-care number from
a search result, an SMS, an email or a forwarded message.** The number comes from the institution's own
artefacts — the back of the card, the official app's help section, the website you typed yourself, the
official statement's letterhead.

| Channel                                          | Trust level | Use                                 |
| ------------------------------------------------ | ----------- | ----------------------------------- |
| Number printed on the card                       | High        | Primary for card and banking issues |
| The official app's help section                  | High        | Wallets, UPI, investment platforms  |
| Website typed by you (not linked from a message) | High        | Everything else                     |
| Search-ad numbers                                | Low         | Never — verify before dialling      |
| Numbers in SMS/email from unknown senders        | Low         | Never                               |
| Numbers given by the caller themselves           | Zero        | The callback trap                   |

The same habit governs the callback: if you have any doubt mid-call, hang up and dial the number from the
card yourself. A genuine agent's process survives a callback; the fraudster's does not, because the fraud
lives in the specific call.

## What the bank owes you: the liability framework

The RBI's customer-protection framework on unauthorised electronic transactions — the Master Direction on
Consolidated Banking (and its circular lineage on limited liability) — sets out what the customer bears when
fraud strikes. The core allocation:

| Reporting time        | Customer liability for unauthorised transactions           |
| --------------------- | ---------------------------------------------------------- |
| Within 3 working days | Zero liability where the fraud is not the customer's fault |
| 4–7 working days      | Bounded by the RBI's slab per transaction type             |
| Beyond 7 working days | As per the bank's board-approved policy                    |

Zero liability applies where the deficiency lies with the bank — a data breach, a card cloned without
customer negligence — and where the customer reported promptly. But the framework also cuts the other way:
sharing the OTP, PIN or credentials with a caller, or installing remote-access software at a caller's
request, is treated as _contributory negligence_ in many outcomes, which is exactly why the fraudsters
engineer those steps. The dispute is filed with the bank first; if the resolution fails, the [RBI
Ombudsman](https://cms.rbi.org.in) route is the escalation — it is free, online, and binding on regulated
entities up to its award limits.

The reporting clock also runs through [cybercrime.gov.in](https://cybercrime.gov.in) and 1930: the same
hour that determines fund recovery determines whether the bank's zero-liability window is preserved. A
fraud reported within three working days on both channels preserves the customer's best position.

## The legality note

Running a fake customer-care desk is cheating under the Bharatiya Nyaya Sanhita's provisions on cheating and
impersonation, with the IT Act's 66C and 66D covering identity theft and cheating by personation online. The
ad side adds a consumer dimension: impersonating a brand in paid advertising is actionable by the brand
itself, and platforms act on verified trademark complaints — but the takedown cycle lags the fraud's
lifecycle, which is measured in days. Consequences for operators, in the cyber-cell cases that have broken
these rings, include prosecution of the call-desk staff and the number-lessees; the mule accounts and
SIM-lessees face the same accomplice exposure as in APK frauds. The victim's exposure is financial, not
legal — but the _bank liability rules_ mean the victim's own conduct (sharing the OTP, screen sharing)
directly determines how much of the loss is recoverable. That is the legal reason the safe-number habit is
not optional.

## The bottom line

The fake customer-care number is a search-engine arbitrage on your anxiety. One habit defeats it: the number
comes from the card, the app, or a URL you typed — never from a search ad, a message, or the caller's own
lips. Add the OTP rule (never read it out, never type it on a shared screen) and the reporting rule (1930
and cybercrime.gov.in within the hour, then the bank within three working days), and the entire fraud class
collapses — because its economics depend on the victim who dials first and verifies never.
