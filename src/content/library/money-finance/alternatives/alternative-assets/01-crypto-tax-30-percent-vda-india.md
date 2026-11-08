---
title: "Crypto tax India: the flat 30% VDA rule, 1% TDS and why losses never set off"
description: "Section 115BBH and Section 194S explained: 30% plus cess, no loss set-off, no expense deduction, the 1% TDS mechanics and the 2026 ITR filing reality."
pubDate: 2026-07-02
author: Chirag Singhal
type: article
tags:
  - crypto-tax
  - vda
  - tds
  - capital-gains
  - income-tax
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

India's crypto tax is not a tax on crypto. It is a tax regime bolted onto a class of assets — Virtual Digital
Assets — that Parliament defined in 2022 and the Income-tax Act now treats worse than almost anything else you
own: a flat 30% on gains, 1% TDS on transfers, no set-off of losses, and a cost base that dies on gift or
inheritance. This article is the arithmetic of that regime as it stands for FY 2025-26 and AY 2026-27.

## What counts as a VDA, and what does not

Section 2(47A) of the Income-tax Act defines a Virtual Digital Asset as any information or code recorded on a
distributed ledger that carries value — cryptocurrency, Bitcoin, Ethereum, NFTs and similar tokens. The budget
documents confirmed that non-fungible tokens are VDAs too.

Three things fall **outside** the definition and keep their normal tax treatment: digital gold and silver
backed by physical metal held in vaults (ordinary capital-asset rules apply), gold-linked sovereign schemes,
and fiat currency — including INR-backed stablecoins that are not on a distributed ledger. The practical consequence of the boundary matters more than the boundary: if the receipt in your
hand is a token, assume VDA rules; if it is a claim on gold sitting in a vault, you are in ordinary property
territory — and the tax difference between the two regimes can exceed 20 percentage points on the same profit.

## The 30% rate, precisely

Section 115BBH taxes income from transfer of a VDA at a flat 30% of such gains, plus 4% health and education
cess, which lands the effective rate at 31.2%. No slab applies: a student earning ₹30,000 of gains and a CEO
earning ₹30 lakh pay the same proportion — a student in the 0% slab actually pays _more_ than their slab rate,
and someone in the 30% slab pays the same.

| Item                         | Treatment under Section 115BBH                                             |
| ---------------------------- | -------------------------------------------------------------------------- |
| Rate of tax on VDA gains     | 30% flat + 4% cess (effective 31.2%)                                       |
| Deduction of costs           | Only the cost of acquisition; no expenses, no infrastructure fees          |
| Set-off against other income | Prohibited — crypto losses cannot reduce salary, business or capital gains |
| Carry-forward of losses      | Prohibited — Section 115BBH(2) kills Section 74                            |
| Gift of a VDA                | Cost base passes to the recipient unchanged                                |
| Inheritance                  | Cost base passes to the heir unchanged                                     |

Two consequences of that table deserve emphasis. First, a trader who pays platform fees, gas charges, and
exchange commissions can deduct none of them; a business paying electricity bills deducts everything. Second,
because loss carry-forward is barred, a trader who loses ₹5 lakh across FY 2025-26 and makes ₹5 lakh in FY
2026-27 pays 30% on the second-year profit, full stop. Ordinary capital-gains rules would have allowed the loss
to offset it; the VDA regime does not.

## The 1% TDS under Section 194S

Every transfer of a VDA attracts 1% tax deducted at source. The _person responsible for paying_ deducts it —
for exchange-settled trades that is the exchange; the deduction lands on the seller's side of the settlement.
For specified persons — individuals and HUFs with turnover up to ₹1 crore in business or ₹50 lakh in
profession — the 1% TDS applies only after aggregate VDA consideration in the year crosses ₹50,000. For most
readers the working rule is: **1% of the sale value leaves your hands at every sale, and you claim it back
only at ITR filing.**

Three distortions follow. The deduction is on _gross value_, not profit, so a ₹1,00,000 sale with ₹200 of gain
still sees ₹1,000 withheld. The deduction happens on every single trade in the year. And until the refund is
processed, the government holds your money interest-free — on a ₹5 lakh annual trading turnover, that is ₹5,000
per sale cycle of float taken from you.

| Sale value in a year | TDS withheld (1%) | Refund turnaround if no tax is due |
| -------------------- | ----------------- | ---------------------------------- |
| ₹1,00,000            | ₹1,000            | months, until the ITR is processed |
| ₹5,00,000            | ₹5,000            | same                               |
| ₹25,00,000           | ₹25,000           | same                               |

## P2P transfers and the gas-in-wallet trap

Transfers made without an exchange — sending tokens from one self-custody wallet to another person's wallet —
still count as transfers. Section 194S makes the _payer_ responsible for deducting 1% when the transfer is
person-to-person. In practice the deductor obligation in a person-to-person trade lands on the buyer — who is personally liable
for the TDS if they fail to deduct — but the tax itself never disappears.

The gas-in-wallet trap is the most common way retail investors lose cost basis. If you buy tokens worth ₹2
lakh and the exchange later converts part of your holding to pay network fees, every conversion is a transfer
at fair market value. A ₹3,000 gas fee paid in kind on tokens that cost you ₹1,000 realizes ₹2,000 of gain,
taxable at 30% — a 60% tax rate on the fee itself. Keep a small fiat or stablecoin buffer out of the tokens
themselves so that fees are paid in currency, not in kind.

## Airdrops, salary in crypto, and staking rewards

A token received without payment (airdrop) has no cost of acquisition that is provable, yet it is still income
in the year of receipt — taxed at slab under "other sources" at fair market value. From then on, that FMV
becomes the cost base for the 30% regime at sale. Salary paid in crypto is perquisite value at FMV, taxed at
slab in the year of receipt, and again becomes cost base. Staking rewards are income on receipt, not
capital gain; the 30% rate applies only when the reward tokens are later sold, on gain over the FMV at receipt.

That triple identity — receipt taxed at slab, holding taxed at zero, sale taxed at 30% with no cost
indexation — is the core of the Indian crypto tax position. It is why every serious tax practitioner now asks
for the complete trade log rather than the exchange's summary profit figure.

## The ITR filing reality

VDAs are reported in Schedule VDA of ITR-2 (ITR-1 has no VDA schedule, so salary-and-crypto filers must move
to ITR-2). Every transaction must be declared with the acquisition date, sale date, proceeds, cost, and gain.
The exchange's annual statement is a _starting point_, not a filing document — two exchanges classify the same
event differently, and the department matches what you file, not what the platform shows.

| Filing step     | What you must produce                                            |
| --------------- | ---------------------------------------------------------------- |
| Trade log       | Every buy and sell with dates and INR values on transaction date |
| Cost basis      | Actual INR cost per token; no indexation, no averaging shortcuts |
| Schedule VDA    | Quarter-wise summary of gains and the TDS already deducted       |
| Form 26AS / AIS | Match the 1% TDS against your challan mapping before filing      |

The due date is the usual one — July 31 for non-audit cases, per the [Income Tax Department's portal](https://www.incometax.gov.in/iec/foportal/).
Advance tax applies to VDA gains in the instalment
in which they arise, and missing it attracts interest under Sections 234B and 234C at 1% per month.

## The legality note

Holding and trading crypto is legal in India; the tax machinery treats it as a high-priority audit target. The
30% rate and the 1% TDS were designed together so that every transaction leaves a trail — an exchange's TDS
return names you, so the department knows your sales even if your ITR is silent. Consequences of non-reporting
are concrete: unreported VDA income is treated as escaped assessment, the tax is recoverable with interest
under Sections 234A/B/C, and under-reporting attracts penalty up to 200% under Section 270A. The penal
provisions here are not theoretical; TDS filings give the department the ledger. Non-filing of ITR when TDS has
been deducted is also separately prosecutable for wilful evasion. The clean path is boring: report every trade,
reconcile TDS, pay the 30%, keep the logs for at least eight years.

## What this buys you

The VDA regime does not make crypto a bad asset; it makes crypto an expensive one to churn. Holding through
multiple years with no taxable events between buys and one eventual sale is the only structure the tax code
rewards — each sale crystallizes a fresh 31.2% event with no set-off, so turnover itself is a tax cost. Model
your exit as one event, not twenty. And keep your ordinary investments outside the VDA classification entirely,
because a classification mistake — gold app purchases recorded as tokens, stablecoins assumed exempt — is a
costly and entirely avoidable way to learn the definition of Section 2(47A).
