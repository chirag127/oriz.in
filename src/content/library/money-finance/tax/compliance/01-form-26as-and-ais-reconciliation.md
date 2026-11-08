---
title: "Form 26AS and AIS: reconciling what the taxman already knows about you"
description: What Form 26AS, AIS and TIS each show, how they differ, the five mismatches that trigger notices, and the reconciliation routine that keeps your ITR clean before you file.
pubDate: 2026-08-12
author: Chirag Singhal
type: article
tags:
  - form-26as
  - ais
  - tis
  - itr
  - tax-compliance
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

Every salary credit, every TDS deduction, every mutual fund redemption, every high-value property purchase, every
large credit-card bill is reported to the income-tax department by someone else — your employer, your bank, your
broker, your RTA, your card company. The department assembles this into two documents and shows them to you.
Most taxpayers never look. Then their ITR does not match what the department already knows, and a compliance
notice follows — usually automated, always avoidable. This article is the reconciliation routine.

## The three documents and what each actually is

**Form 26AS** is the TDS/TCS statement view: consolidated tax credit against your PAN. It shows tax deducted at
source by every deductor (employer under 192, banks under 194A, tenants under 194-I, buyers of property under
194-IA), tax collected at source under 206C, advance tax and self-assessment tax payments, and high-value
transactions reported in SFT (Statement of Financial Transactions). It is _about tax paid_, not about income
earned — a bank can deduct no TDS because you submitted Form 15G, and 26AS will show nothing, even though the
interest was earned and taxable.

**AIS (Annual Information Statement)** is the department's comprehensive income view: salary, interest from every
bank account, dividends, mutual fund transactions, securities transactions with sale values, property purchases
and sales, foreign remittances under LRS, rent paid against your PAN, credit-card payments above ₹10 lakh,
business turnover reported under GST. AIS aggregates from SFT filings, TDS returns and reporting entities. It
shows two columns for most items: _reported value_ and _derived value_ (e.g., gross dividend vs the amount after
TDS).

**TIS (Taxpayer Information Summary)** is the simplified summary of AIS — the department's own aggregated values
by category, which is what its processing system uses when it compares your ITR. A discrepancy with TIS is what
generates the automated compliance notice, not a discrepancy with AIS.

| Feature                       | Form 26AS                            | AIS                                         | TIS                       |
| ----------------------------- | ------------------------------------ | ------------------------------------------- | ------------------------- |
| Primary content               | TDS, TCS, taxes paid, SFT references | Nearly all reported income and transactions | Aggregated summary of AIS |
| Shows income even with no TDS | No                                   | Yes                                         | Yes                       |
| Sold shares' full sale value  | Reference only                       | Yes, both legs                              | Aggregated                |
| The notice comparator         | No                                   | Indirectly                                  | Yes                       |
| Where                         | TRACES portal                        | compliance portal on incometax.gov.in       | Same, inside AIS          |

All three are free, behind OTP login, at
[incometax.gov.in](https://incometax.gov.in/iec/foportal/).

## The five mismatches that generate notices

**1. Interest income understated.** The single most common gap. Banks report _all_ interest — savings, FD,
recurring deposit — per PAN. A saver with four bank FDs reporting only the TDS-bearing ones omits the rest. The
department's TIS shows ₹1,40,000 of interest; the ITR claims ₹60,000. Automated comparison flags it.

**2. Dividend and securities transactions.** Brokers report the _sale value_ of every share and mutual fund
transaction. Selling ₹8 lakh of shares at a ₹50,000 profit is a ₹8,00,000 entry in AIS; taxpayers who report
only the ₹50,000 gain in the ITR look like they underreported ₹7.5 lakh. The fix is not to match the number —
it is to report the sale value in the capital-gains schedule correctly (schedule CG asks for sale value and
cost; TIS compares sale value) and to file the AIS feedback correction where the reported value is wrong.

**3. TDS credit claimed but not appearing.** If a deductor filed its TDS return late or with a wrong PAN digit,
your 26AS lacks the credit. Claiming a credit not in 26AS is permitted in law — Section 199 says credit follows
the deductor's payment, not the form — but it triggers verification. The fix is to chase the deductor for a
correction _before_ filing.

**4. Property transactions.** Both legs are reported: the buyer's TDS under 194-IA and the sub-registrar's SFT
report of the sale consideration. A sale price in the ITR lower than the registered value flagged in AIS is a
standard trigger — especially where Section 50C applies (deemed consideration = stamp-duty value when lower).

**5. LRS remittances and foreign assets.** Bank-reported LRS remittances above the reporting thresholds appear in
AIS. Foreign brokerage accounts, ESOPs and foreign shares must be disclosed in Schedule FA if you are a resident
and ordinarily resident; Schedule FA non-disclosure is one of the few provisions with a specific penalty
(₹10 lakh per year per undisclosed asset under Section 165 of the Black Money Act for foreign assets).

## The reconciliation routine, in order

1. **February, mid-year check.** Download AIS and 26AS mid-year, not at filing time. A TDS mismatch discovered
   in February gives the deductor two months to file a correction; discovered in July, it becomes your problem.
2. **Match every TDS entry against your own records** — Form 16, bank TDS certificates, broker statements. A
   TDS entry you cannot source is usually a duplicate PAN record or a transaction you forgot; a missing entry is
   usually a deductor's late filing.
3. **For each AIS item, decide: correct, needs feedback, or needs explanation in the ITR.** AIS has a feedback
   mechanism: you can mark an entry as "information is correct", "information is duplicate", "information
   relates to a different PAN/year", or "information is denied". Feedback is visible to the department and
   pre-empts the automated notice.
4. **Report the gross numbers where schedules require them.** Schedule CG wants sale value and cost. Schedule OS
   wants interest gross, not net of TDS. The ITR reconciles with TIS when the _gross_ figures match; the tax
   then computes on net.
5. **Recheck after filing.** The department processes returns against TIS. If a notice arrives under Section 143(1)
   (intimation) or 143(2) (scrutiny selection), the first defence is the AIS feedback trail you already filed.

| Mismatch                   | Who reported it | Usual cause                        | Fix                                         |
| -------------------------- | --------------- | ---------------------------------- | ------------------------------------------- |
| Interest lower than TIS    | Banks           | Forgot one FD or savings interest  | Report gross; claim 80TTA/80TTB if eligible |
| Share sale value mismatch  | Broker/RTA      | Reported gain only, not sale value | Fill sale value in schedule CG              |
| TDS missing from 26AS      | Deductor        | Late/wrong TDS return              | Ask deductor to correct before filing       |
| Property price discrepancy | Sub-registrar   | Sale reported below stamp value    | Check Section 50C computation               |
| Foreign remittance flagged | Bank            | LRS without Schedule FA            | File Schedule FA if resident and RoR        |

## What 26AS and AIS cannot do

They do not compute your tax. They do not catch income that no third party reports — freelance income from a
foreign client paid via a foreign gateway often never appears in AIS; neither does rent received in cash, or
sale of personal effects. The absence of an item from AIS is not evidence that it is not taxable. The reverse
also holds: an item _in_ AIS that you have correctly excluded (a duplicate entry, a transaction in another
person's hands, a sale value of shares you actually bought and sold at a loss) needs feedback, not silence.
Silence is what the compliance portal's nudge campaigns — the "e-campaign" SMS and emails the department sends
when its data does not match a filed return — are designed to elicit responses to.

<figure class="callout">
  <div class="callout-title">The two-week rule</div>
  <p>
    Any mismatch you cannot resolve within two weeks of discovering it should be handled in the ITR by reporting
    the department's numbers and explaining the difference in the return's disclosure fields. An ITR that matches
    TIS with a note is processed; an ITR that mismatches silently is queued for a compliance check.
  </p>
</figure>

## The legality note

Reconciling AIS and 26AS is ordinary compliance; nothing here is grey. What carries consequences is the
opposite: deliberate omission of income that the department can see is the cheapest income to catch, and
penalties for concealment run up to 200% of tax under Section 270A, with interest under 234B/234C and
prosecution under Section 276C in eligible cases. There is also a deadline hidden here: a revised return under
Section 139(5) can be filed until 31 December of the assessment year, and an updated return under Section 139(8A)
(ITR-U) can be filed within 24 months _after_ the assessment year ends, with additional tax of 25% to 70% of the
tax and interest depending on how late it is filed — the ITR-U route is the expensive way to fix what a February
reconciliation would have caught for free. Forms, AIS and the compliance portal are at
[incometax.gov.in](https://incometax.gov.in/iec/foportal/).

## The habit that ends tax anxiety

The tax department's data about you is better than your data about yourself. That is not a threat; it is a
tool. Once a year — February and July — download AIS, TIS and 26AS, reconcile against your own records, file
feedback where the data is wrong, and report gross figures in the ITR. Do that and the automated compliance
system, which generates most individual notices, has nothing to find. The taxpayer who reconciles never meets
the notice; the taxpayer who does not has a scheduled appointment with one.
