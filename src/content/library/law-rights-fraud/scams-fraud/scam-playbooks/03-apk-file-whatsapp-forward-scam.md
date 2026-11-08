---
title: "APK file scams on WhatsApp: how a fake APK drains a bank account and what happens to the money"
description: "The APK-file WhatsApp fraud end to end: how the malware is sent, what permissions it uses, the screen-share and OTP mechanics, and the mule-account money trail."
pubDate: 2026-08-20
author: Chirag Singhal
type: article
tags:
  - apk-malware
  - whatsapp-scam
  - cyber-fraud
  - digital-fraud
  - mobile-security
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

The cheapest way to rob an Indian bank account in 2026 is a 14-megabyte file on WhatsApp. The APK scam — a
fraudulent Android app sent directly to the victim, bypassing the Play Store entirely — has become the default
delivery mechanism for remote-access fraud, and its losses are reported in I4C's data as a rising share of
cyber-fraud complaints. The mechanics are simple, the permissions are the payload, and the trail shows why
recovery is a race.

## How the file arrives

The lure is situational, not generic. The most productive contexts are ones where a file is expected:

| Lure                              | Typical message                                                  | Target                                   |
| --------------------------------- | ---------------------------------------------------------------- | ---------------------------------------- |
| Wedding/event invite              | "Shaadi card — open the app for venue details" (.apk attachment) | Family groups, ages 30–60                |
| Mutual-fund/insurance PDF         | "Your policy statement is in this app"                           | Policyholders                            |
| Job offer / interview call letter | "HR sending the offer letter app"                                | Job seekers                              |
| Rental agreement / tenancy        | "Landlord sending the agreement app"                             | Tenants                                  |
| Investment advisory group         | "Download our trading app for the PMS"                           | Investors already warmed by a tips group |
| Courier / delivery problem        | "Delivery app needed for address verification"                   | Anyone                                   |

The file name is engineered for familiarity — `Wedding_Invite.apk`, `Policy_Statement.apk`,
`Offer_Letter.apk`. WhatsApp does deliver APKs as documents, which is the scam's transport advantage: the
file arrives in the app the victim already trusts, sidestepping the Play Store's review entirely.

## What the APK does once installed

The malicious APK is either a dropper (it downloads the real payload after install) or a full remote-access
trojan. The permissions requested at install are the tell that almost everyone skips:

| Permission                      | What it enables                   | The fraud use                                  |
| ------------------------------- | --------------------------------- | ---------------------------------------------- |
| Accessibility service           | Read screen content, perform taps | Reads OTPs, navigates banking apps             |
| SMS read                        | Intercept one-time passwords      | Bypasses OTP-based authentication              |
| Notification access             | Read OTPs from notification shade | Silent OTP capture                             |
| Contacts                        | Harvest the next victims          | Forwards itself to your groups                 |
| Overlay                         | Draw over the banking app         | Fake screens that phish credentials            |
| Screen recording / screen share | Watch everything live             | The operator sees your balance before you move |

With accessibility service and SMS read, the operator can do everything except physically hold the phone:
see the balance, capture the OTP, initiate the transfer through the _genuine_ banking app, and confirm it.
The victim's role is reduced to having the phone in hand at the wrong moment — which is why many APK-fraud
cases report transactions the victim "approved without noticing".

## The complement: screen-share apps and remote access

The APK variant pairs with a social-engineering variant that needs no file: the "customer care" or
"KYC-expiry" call that asks the victim to install a legitimate remote-screen app — AnyDesk, TeamViewer, or
a video-calling app with screen sharing. Once the victim shares the screen, the operator reads the OTPs as
they arrive and navigates the banking app verbally. The two variants converge on the same outcome; the APK
is simply the more durable version, because accessibility permissions persist after the call ends.

The defence for both is identical and unglamorous: **no bank, KYC process, insurance company or government
scheme requires a screen-share session or an APK installation.** The sentence holds for every legitimate
institution in India, and repeating it to family is worth more than any antivirus.

## The money trail: why recovery is a race

Stolen funds move through a deliberate chain. The first beneficiary account is a mule account — often rented
from a student, gig worker or small trader for ₹2,000–5,000 — which receives the transfer and immediately
forwards it, less its cut, to the next layer. The layering continues through prepaid wallets, small
merchants' QR codes, and sometimes crypto off-ramps.

| Hour after transfer | Where the money is                        | Recovery prospect                     |
| ------------------- | ----------------------------------------- | ------------------------------------- |
| 0–1                 | First mule account                        | High, if reported to 1930 immediately |
| 1–6                 | Second/third layer, wallets               | Moderate                              |
| 6–24                | Layered through merchants and withdrawals | Low                                   |
| > 48 hours          | Converted, withdrawn, or off-ramped       | Very low                              |

The inter-bank freeze mechanism — the Fraud Risk Management system that a 1930 complaint triggers — can halt
funds in the first layers, which is why the reporting hour matters more than any subsequent effort. Filing
on [cybercrime.gov.in](https://cybercrime.gov.in) with the transaction UTRs, the APK file itself, and the
phone model starts the process; the cyber-cell's forensic extraction of the APK identifies the command-and-
control infrastructure, which is how multi-victim cases get consolidated into one chargesheet.

## Prevention: the checklist that actually works

1. **Install apps only from the Play Store or the institution's own website** — and type the URL yourself;
   "the website link sent on WhatsApp" is not the institution's own channel.
2. **Refuse every APK sent by any message channel**, including from known contacts — compromised WhatsApp
   accounts forward the same file to their whole contact list.
3. **Review accessibility permissions quarterly**: Settings → Accessibility shows every service with screen
   and tap control. Anything unfamiliar gets revoked.
4. **Never share the screen during a banking session** with anyone, for any reason.
5. **Keep a separate low-limit account** for UPI-heavy daily use, so a compromised session drains a buffer,
   not the savings account.
6. **Turn on transaction alerts for every channel** — SMS, email, app push — so an unauthorised debit is
   known within a minute, which is what makes the 1930 window usable.

## The legality note

Sending a malicious APK is an offence under the IT Act — Sections 43 (unauthorised access), 66 (computer
related offences), 66C (identity theft) and 66D (cheating by personation) — and the cheating provisions of
the Bharatiya Nyaya Sanhita apply to the social-engineering layer. The mule-account holders are not
bystanders in law: knowingly renting out a KYC'd account for fraudulent flows exposes the account holder to
account freezing, bank exit listings, and prosecution as an accomplice in money laundering under the PMLA —
and the banks' own liability frameworks (the RBI's customer-protection circulars on unauthorised
transactions) govern how much of the loss the _bank_ bears versus the customer, with zero-liability in cases
where the fraud is not the customer's fault and reporting was prompt. Consequences for the operators, when
cyber-cells catch the chain, are prosecution and asset recovery; for the victims, the operative consequence
is financial and time-bound — the reporting hour decides the money. There is no grey zone here to weigh: the
only decision is how fast you report.

## The bottom line

The APK scam is a permissions scam wearing a wedding invitation. The Play Store's review process, the
accessibility-permission audit, the screen-share refusal and the one-hour 1930 window are the four controls
that actually decide outcomes — and three of them cost nothing but attention. Brief the family group chat
with the one-line rule that covers every variant: no bank or institution sends APKs, asks for screen shares,
or needs your OTP. Everything else is the fraud.
