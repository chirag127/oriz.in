---
title: "KYC expiry call fraud: the script that drains accounts, and what your bank actually does about KYC"
description: How KYC-expiry call fraud works against bank, insurance and demat customers, what real KYC re-verification looks like, and the RBI rules on updating KYC safely.
pubDate: 2026-08-26
author: Chirag Singhal
type: article
tags:
  - kyc-fraud
  - re-kyc
  - phishing
  - cyber-fraud
  - banking
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

The KYC-expiry call is the most credible fraud in Indian banking because it sits on top of a real
requirement: KYC documents _do_ need periodic re-verification, and accounts _can_ be restricted for
non-compliance. The fraudster's entire product is that true sentence, attached to a fake process. This
article separates the real KYC workflow from the scripted one, because the difference is exactly the money.

## Why the script works: the real rule underneath

Under the RBI's KYC Master Direction, banks must conduct periodic KYC updates — re-KYC — at intervals
depending on the customer's risk categorisation: typically every 10 years for low-risk, 8 for medium-risk
and 2 for high-risk customers, with updates possible through email, the bank's app, or branch visits. Demat
accounts face their own annual KYC checks; insurance policies lapse into claim friction when KYC is stale.
Because the requirement is real, the victim's internal alarm does not ring — and because the _process_ is
conducted by the bank through its own channels, the fraud's fake process is where the loss happens.

| Real KYC re-verification                                         | The fraud's version                             |
| ---------------------------------------------------------------- | ----------------------------------------------- |
| Bank's own app, website, email from the bank's domain, or branch | Call from an unknown mobile number              |
| Documents uploaded through the bank's portal or app              | Link sent over WhatsApp/SMS to a lookalike site |
| No OTP sharing for completing re-KYC                             | OTP asked "to update the KYC"                   |
| No payment involved — re-KYC is free                             | "Pay ₹299 to update" or "send ₹1 to verify"     |
| Account restrictions come with written notice by email/post      | "Your account freezes at 5 pm today"            |

The free-ness is the cleanest tell: re-KYC never costs money. The moment a KYC call mentions any payment,
the call is a fraud — the sentence holds for every bank, demat participant, mutual fund RTA and insurer in
India.

## The script, stage by stage

The call opener varies with the institution; the skeleton does not:

1. **The credible opener.** "This is the KYC department from [bank]. Your KYC for account ending 4471
   expires today." The caller often knows the bank's name because the victim's data is leaked, purchased or
   guessed — knowing the bank is not proof of legitimacy.
2. **The manufactured deadline.** "If not updated by 5 pm, the account will be deactivated." Real re-KYC
   restrictions arrive in writing, with dates, and are rarely same-day.
3. **The handoff.** The victim is moved to WhatsApp ("our executive will complete it"), or given a link.
4. **The credential harvest.** The link is a phishing page that collects net-banking credentials, card
   details, or UPI credentials — or the "executive" requests the OTP "to complete the update".
5. **The drain.** Within minutes: card-on-file charges, UPI collect approvals, or a full net-banking
   session through harvested credentials.

| Stage   | Channel                      | What is captured                             |
| ------- | ---------------------------- | -------------------------------------------- |
| Opener  | Voice call                   | Trust, urgency                               |
| Handoff | WhatsApp                     | Continuity, isolation from official channels |
| Harvest | Phishing page or "executive" | Credentials or OTP                           |
| Drain   | Card/UPI/net-banking         | The money                                    |

The demat and insurance variants are the same skeleton with different urgency: "SEBI has made KYC mandatory,
your demat will be frozen", "the claim cannot be processed without updated KYC". The 2023–2024 wave of
"demat KYC freeze" calls was effective precisely because SEBI had genuinely tightened KYC norms that year —
the true headline, the fake process.

## What your bank actually does, channel by channel

The genuine re-KYC paths are few and consistent:

- **The bank's own mobile app or net-banking portal**, under the KYC or profile section, with document
  upload through the app itself.
- **Email from the bank's own domain** with a link to the bank's own site — and even then, the safe habit
  is to open the app directly rather than click.
- **The branch**, with physical documents, for those who prefer it.
- **Video KYC**, initiated _by you_ from the bank's app or website.

| Institution        | Real re-KYC channel                                   | Never required                       |
| ------------------ | ----------------------------------------------------- | ------------------------------------ |
| Bank account       | App, portal, branch, video-KYC you initiate           | Payment, OTP read-out, remote access |
| Demat / broker     | Broker's app or website after _you_ log in            | Any APK install                      |
| Mutual funds / RTA | The RTA's or AMC's site, or your distributor's portal | Screen share                         |
| Insurance          | Insurer's portal or branch                            | Payment for "KYC update"             |
| UPI / wallets      | The app's own KYC section                             | OTP over a call                      |

The universal meta-rule: **you initiate, never respond.** Every legitimate KYC process begins with you
opening the institution's app or typing its URL. Any process that begins with a call is, by construction,
not the institution's process.

## If you have already shared the details

Speed is the whole game, and the sequence is fixed:

1. **Call the bank's real number** (from the card or the app) and report; ask for the card to be blocked,
   UPI to be frozen, and net-banking credentials reset.
2. **Report on [cybercrime.gov.in](https://cybercrime.gov.in) or dial 1930 within the hour** of any
   unauthorised debit — the inter-bank freeze mechanism works on the first layers of the money trail.
3. **File the written complaint with the bank** the same day; the RBI's zero-liability window for
   unauthorised transactions runs to three working days where the customer is not at fault.
4. **Change every credential that was shared** — net-banking password, UPI PIN, and any app PIN that shares
   the same pattern. Credential reuse is how one phishing page drains two institutions.

Recovery odds fall hourly, but the first-hour window — the same one that governs every transfer-based fraud
— is where recoveries actually happen. The bank's fraud desk and the cyber complaint work together; one does
not substitute for the other.

## The legality note

The fraud is straightforwardly illegal: cheating and impersonation under the Bharatiya Nyaya Sanhita, and
identity theft and cheating-by-personation under the IT Act's Sections 66C and 66D. The phishing pages that
harvest credentials add Section 66 (computer-related offences) and the credentials' misuse brings the
unauthorised-access provisions into play. Consequences for operators, in the cases cyber-cells have
prosecuted, run to conviction for cheating and identity theft; the mule-account holders who receive and
layer the drained funds face account freezing and money-laundering exposure under the PMLA when the rental
of the account was knowing. On the victim's side, the RBI's customer-protection framework determines the
loss allocation: prompt reporting (three working days) with no customer negligence tends towards zero
liability, while sharing the OTP under a caller's instruction is treated as contributory conduct in many
disputes — which is the legal reason the OTP rule is absolute, not situational.

## The bottom line

The KYC-expiry fraud is a true requirement welded to a fake process. The bank's real re-KYC is free, happens
in the app you open yourself, and never needs an OTP spoken aloud. Every other version of the process —
calls, WhatsApp handoffs, ₹299 fees, five-o'clock deadlines — is the fraud, and the response is always the
same three moves: hang up, open the app yourself, and if any money has moved, report to 1930 and
cybercrime.gov.in within the hour. The requirement is real. The process that respects it is the one you
start, not the one that calls you.
