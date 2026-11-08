---
title: "Demergers and bonus issues: the corporate-action mechanics most retail investors get wrong"
description: How demergers, bonus issues and split-adjusted prices actually work in India — record dates, cost-base splitting, listing timelines, and the retail mistakes that cost real money.
pubDate: 2026-07-27
author: Chirag Singhal
type: article
tags:
  - corporate-actions
  - demerger
  - bonus-issue
  - stock-split
  - taxation
difficulty: advanced
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

Corporate actions are where long-term holders lose money without ever making a bad investment decision. Not
because the business deteriorated, but because the _mechanics_ were mishandled: a demerger whose new shares sat
unclaimed, a bonus issue sold before the record date, a cost base split incorrectly so that the tax bill arrives
years later, larger than the profit. The rules are public and stable. This is how each action works, what
actually arrives in your demat account, and the arithmetic of the mistakes.

## Demergers: what actually happens

Under Sections 2(19AA) and 2(19AAA) of the Income-tax Act, 1961, a **demerger** is the transfer of one or more
undertakings to a resulting company in a way that satisfies statutory conditions: the demerger must be pursuant
to a scheme approved by the NCLT (or, historically, the High Court), all property and liabilities of the
undertaking transfer at book value, shareholding of shareholders holding at least 75% of the value of shares
must become shareholders of the resulting company in the same proportion, and the scheme must be approved by
public financial institutions where applicable. Meeting these conditions matters because it decides the tax
treatment.

The sequence for a shareholder:

1. Board approves the scheme; both companies file it; NCLT approves over months to years.
2. **Record date** is announced: shareholders on that date receive shares of the resulting company in a stated
   ratio — for example, 1 share of the resulting company for every 4 held.
3. On the record date, the parent's price adjusts downward (the exchange adjusts the price by the value of the
   spun-off business), and the new company's shares are credited — often _days or weeks later_, after the
   resulting company's listing formalities.
4. The resulting company lists, frequently at a price that varies wildly from the parent's implied value.

Two structural facts surprise retail investors. First, you cannot sell the resulting company's shares before
they are credited and listed; between the record date and listing you hold an asset you can see in your demat
statement but cannot trade. Second, fractional entitlements are settled in cash by the company, and that cash is
taxable in a way discussed below.

| Milestone               | Typical gap                  | What you can do                       |
| ----------------------- | ---------------------------- | ------------------------------------- |
| Board approves scheme   | Day 0                        | Assess; price usually moves here      |
| NCLT approval           | 6-18 months                  | Nothing; wait                         |
| Record date announced   | 2-6 weeks before             | Decide to hold or sell                |
| Record date             | Day R                        | Entitlement fixed; parent ex-demerger |
| New shares credited     | R + 2 to R + 6 weeks         | Visible in demat, not tradable        |
| Resulting company lists | After credit + ROE/ROF steps | Sell, hold, or evaluate fresh         |

## The tax arithmetic of a demerger

If the scheme satisfies Section 2(19AA), the demerger is **not a transfer** for the shareholder: no capital
gains arise when the resulting company's shares are credited. The _cost of acquisition_ of the original shares
is apportioned between the parent and the resulting company in the ratio of their net worth on the appointment
date specified in the scheme. Say you bought 100 shares at ₹800 (cost ₹80,000). The scheme's net-worth ratio
comes out 70:30. Your parent-shares now have a cost base of ₹56,000 and the resulting company's shares a base of
₹24,000. When you eventually sell each, gains are computed on those bases, with holding period _including_ the
years you held the original shares — which matters for classifying long-term versus short-term and, for listed
equity, for the Section 112A exemption threshold.

Fractional shares cannot be issued; the company pays cash for the fraction. Under Section 2(19AA) mechanics and
settled departmental practice, this cash is treated as consideration and is taxable as capital gains in the year
received — it is small (usually a few hundred rupees) but it is assessable.

The holding-period treatment deserves a specific note: for the _resulting_ company's shares, the holding period
of the original shares counts, so a shareholder who has held the parent for 3 years holds the new shares as a
long-term asset from day one. This is one of the quiet advantages of holding through a demerger rather than
selling the parent and buying the new listing on day one.

## Bonus issues: free shares, real consequences

A bonus issue is capitalisation of reserves: the company converts accumulated profits into share capital and
issues new shares to existing shareholders free of cost. A 1:1 bonus doubles your share count and halves the
price. Nothing economic changes — the market capitalisation is the same, your ownership percentage is the same.

The tax points are few but strict:

- **No tax at issue.** Bonus shares are not income; no tax is payable when they are credited.
- **Cost of acquisition of bonus shares is nil** (Section 55(2)(aa)(i) — for bonus shares allotted on or after
  1 April 2001, the cost is zero). When you sell, the entire sale value is capital gain.
- **Holding period starts from the date of allotment** of the bonus shares, not from when you bought the
  original shares. Selling original shares bought 14 months ago is long-term; selling the 1:1 bonus shares
  allotted 3 months ago is short-term. In a falling market, people sell "the same shares" and discover that half
  the sale is taxed at short-term rates.
- For listed equity held over 12 months, long-term gains above the ₹1.25 lakh annual exemption are taxed at
  **12.5% under Section 112A**; short-term listed equity is taxed at **20% under Section 111A** (rates as
  revised by the Finance (No. 2) Act, 2024, effective 23 July 2024).

| Transaction                 | Cost base                   | Holding period starts  | STCG/LTCG treatment         |
| --------------------------- | --------------------------- | ---------------------- | --------------------------- |
| Original 100 shares @ ₹800  | ₹80,000                     | Purchase date          | Per normal rules            |
| 1:1 bonus shares (100)      | Nil                         | Bonus allotment date   | Entire sale proceeds = gain |
| Split (e.g. ₹10 face to ₹5) | Original cost ÷ 2 per share | Original purchase date | Cost base adjusts, no reset |

## The mistakes, priced

**Selling on the record date.** The record date fixes entitlement based on holdings as of that date; a sale on
or after the record date still leaves the entitlement with you only if the shares were held as of the record
date cut-off — but if you sell _before_ the record date, the buyer takes the entitlement and the price usually
drops by roughly the entitlement value. The classic error is buying the day before the record date to "get the
bonus" and selling immediately: the price adjusts, you have gained nothing, and you have booked a short-term
gain on the bonus leg if you sell within the year.

**Ignoring the unclaimed shares.** Demergers credit shares after the record date; if your demat account is
inactive or your KYC is stale, credit can fail and shares go to suspense. Unclaimed amounts and shares now sit
with the IEPF Authority after seven years, recoverable only through the IEPF-5 process with proof — the IEPF
process is real but slow, measured in months.

**Splitting the cost base wrong.** In a demerger, shareholders who keep the original purchase price as the cost
of the _parent_ shares and assign nil to the new company understate the new company's base and overstate the
parent's later gain — the error surfaces years later as an unexpected tax bill with interest under Section 234B
if advance tax was not paid.

<figure class="callout">
  <div class="callout-title">The demat hygiene that prevents all of this</div>
  <p>
    Every corporate-action failure above traces to one of three things: outdated KYC, an unlinked email or
    mobile with the depository, or shares bought across multiple demat accounts with the cost base scattered in
    old contract notes. Fix those three and the mechanics stop being a risk.
  </p>
</figure>

## The legality note

Demergers, bonus issues and splits are legal, regulated corporate actions; nothing about _holding_ through them
is grey. The grey zone sits in trading around them. Arranging the purchase of shares before a record date to
capture an entitlement that you know is economically neutral, and selling immediately, is not tax evasion — but
structuring transactions purely to convert taxable gains into the Section 112A exemption band or to manufacture
long-term status has drawn departmental scrutiny, and tax avoidance arrangements can be disregarded under the
general anti-avoidance rules of Chapter X-A, with interest and penalties up to 200% of tax sought to be evaded
in concealment cases under Section 270A and prosecution under Section 276C for wilful evasion. Keep the records:
contract notes, corporate-action notices, the scheme order. The NCLT-approved scheme itself is the document that
settles every later dispute; the compliance framework is at [sebi.gov.in](https://www.sebi.gov.in).

## A working checklist

Before a corporate action hits your portfolio, write down four numbers: the record date, the ratio, your cost
base for the original shares, and the expected adjustment to your cost base. After it completes, reconcile the
demat credit and update the cost base in your records the same week. Then, and only then, decide what to
sell — with the holding period of each lot visible. The whole discipline takes an hour a year and protects more
money than any stock-picking insight in this track.
