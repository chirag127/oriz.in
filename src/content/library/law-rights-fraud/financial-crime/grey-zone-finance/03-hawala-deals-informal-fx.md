---
title: "Hawala: how the informal dollar market actually works, and what it costs you"
description: The hundi and hawala transfer mechanism step by step — rates, spreads, the real exchange maths versus LRS, the legal line and the FEMA penalties for crossing it.
pubDate: 2026-07-14
author: Chirag Singhal
type: article
tags:
  - hawala
  - fema
  - forex
  - remittance
  - lrs
difficulty: intermediate
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

Hawala — the word covers hundi, informal value transfer, the "dollar wala" in every Gujarati and Kashmiri
trading street — is one of the oldest financial networks alive, and in India it sits in an awkward legal spot:
the _mechanism_ is centuries old and works, the _unlicensed version_ is what FEMA and PMLA have a problem
with. Most people meet it as a rate quote: "I'll give you 92.5 for dollars, better than the bank's 88." This
article explains the machine behind that quote, its real economics, and exactly where it stops being a
neighbourhood convenience and becomes a contravention.

## The mechanics, step by step

The classic transfer: Ramesh in Ahmedabad wants to send ₹5 lakh to his brother Karim in Dubai. He walks to a
hawala dealer (the "hawaladar"), hands over ₹5 lakh, and receives a code. The dealer calls or messages his
counterpart in Dubai: "Release equivalent dirhams to Karim, code X." Karim collects within hours. No money
crossed the border; two liabilities were netted. Settlement between the two dealers happens later and in
bulk — through trade invoices, informal netting, or couriered value — which is why the system survives where
banking is slow.

The reverse trade is where the Indian rate quote comes from: someone in Dubai has dirhams and wants rupees in
Ahmedabad; the dealer takes the dirhams there and pays rupees here. The two flows roughly balance, so the
dealer's spread is his margin. Compare the cost stacks for sending ₹5 lakh:

| Cost element           | Licensed bank / LRS route      | Informal hawala quote        |
| ---------------------- | ------------------------------ | ---------------------------- |
| FX rate offered        | ~₹88.00 per USD (with margin)  | ~₹92.50 per USD-equivalent   |
| Effective USD received | ~5,682 USD                     | ~5,405 USD* at dealer's rate |
| Explicit fee           | ₹1,000-2,500 + GST             | ₹0 quoted, spread embedded   |
| Correspondent charges  | ₹500-2,000, deducted en route  | None                         |
| Time                   | 1-4 working days               | Same day to 48 hours         |
| Documentation          | Form A2/CMS, PAN, purpose code | A phone number and a code    |

*\*The apparent rate advantage reverses once you see that the dealer's 92.5 "buy" rate is his sell rate to
you; the arithmetic of who ends up ahead depends entirely on which side of the spread you sit. The honest
comparison: licensed channels quote an interbank-plus-50-paise-to-1-rupee rate; hawala quotes a rate 2-4
rupees away from it, and _keeps the difference as its fee_. Senders who calculate "rate × amount" instead of
"rate × amount minus all charges" systematically misjudge which channel is cheaper.

## Why people still use it

Speed (settlement in hours against days), reach (villages with no bank branch for the beneficiary), documentation
avoidance (no purpose codes, no PAN trails for money people would rather not explain), and trust networks that
outperform institutions on small amounts. The World Bank and FATF studies on informal value transfer systems
have repeatedly noted the paradox: hawala is often _cheaper_ and _faster_ than formal channels for small
corridors, which is why prohibition alone has never eliminated it.

## Where the legal line sits

FEMA's Current Account Transactions Rules allow residents ₹2,50,000 per financial year under the Liberalised
Remittance Scheme for most purposes (higher for education and medical), through **authorised dealers** —
banks and FFMCs licensed by RBI. The RBI's LRS page at
[rbi.org.in](https://www.rbi.org.in/Scripts/FAQView.aspx?Id=65) lists the scheme's terms. A resident sending
₹5 lakh to family abroad through an unlicensed hawaladar is making a remittance outside an authorised channel
— a FEMA contravention even if the money is clean and the purpose allowed.

The second line is tax. Cash receipts above ₹2 lakh for a single transaction attract Section 269ST penalty
(100% of the receipt) on the _receiver_ — which lands on the hawaladar, but large cash handlers solve it by
slicing transactions. The third is the PMLA: hawaladars moving third-party funds without registration are
operating an unlicensed financial service, and post-2015 the PMLA explicitly covers such activity.

## What a user should actually do

1. **Use LRS for what LRS was built for.** Family maintenance, education, travel, gifts — the ₹25 lakh
   education limit and ₹7 lakh medical limit (Liberalised Remittance Scheme, FY 2025-26) cover almost every
   personal need. The portal of any authorised dealer does the Form A2 online.
2. **Compare the all-in rate, not the headline.** Ask the bank for the "NET to beneficiary" figure — the
   amount that lands after all charges — and compare that with the hawala's landing figure.
3. **If speed is the driver, use the fintech remitters.** Licensed online channels have compressed the
   informal channel's speed advantage; the rate gap for small amounts is often under a rupee.
4. **If you are the receiver of money from abroad** through informal channels, understand that you are the
   documentary dead end: when the money's origin is questioned — and questions arrive years later — the
   person who can prove the source is you.

## The legality note

Operating an unlicensed money transfer business in India violates FEMA Section 10 (unauthorised foreign
exchange dealing) and PMLA registration requirements; consequences for the operator include penalties up to
three times the amount involved under FEMA Section 13, attachment of assets, and prosecution under PMLA where
proceeds of crime are traced. For the ordinary user, one contravention outside authorised channels attracts
penalty up to three times the sum contravened — FEMA's standard tariff — with compounding available from the
Reserve Bank on application and payment of a compounding fee. Using hawala for the proceeds of crime converts
it into a money-laundering charge with prosecution under the PMLA. Enforcement against hawala networks peaks
with every major fraud investigation, and the users whose paperwork exists — the ones who used LRS where they
could and have records for everything else — are the ones who come through the enquiry unscathed. There is
nothing illegal about _knowing_ the informal rate; the contravention is in moving the money outside the
authorised channel.

## The bottom line

Hawala is a settlement system, not a scam — most users get exactly what they were promised. Its real costs are
invisible ones: the spread you never see itemised, the FEMA contravention you did not know you committed, and
the audit trail you do not own. For a family maintenance transfer of ₹2 lakh, the licensed channel costs
perhaps ₹2,000-3,000 more all-in and takes two days longer; that is the price of owning the paperwork. In an
enquiry, paperwork is the only asset that appreciates.
