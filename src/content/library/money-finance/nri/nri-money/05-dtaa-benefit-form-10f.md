---
title: "DTAA for NRIs: Form 10F, tax residency certificates and claiming treaty relief without losing the refund"
description: "How Double Taxation Avoidance Agreements actually reduce Indian tax for NRIs: Article mechanics, Form 10F and TRC requirements, TRPS and the Form 67 credit workflow."
pubDate: 2026-08-05
author: Chirag Singhal
type: article
tags:
  - dtaa
  - form-10f
  - trc
  - nri-tax
  - treaty-benefit
difficulty: advanced
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

A Double Taxation Avoidance Agreement is a treaty between two countries that decides which country taxes which
income, and at what rate. For an NRI, the treaty is the difference between paying 31.2% on NRO interest and
10–15%; between a rent remittance that stalls at the bank and one that clears with the right forms. The
treaty's benefit is _mechanical_ — it arrives only through documents filed before the income is paid, not
through arguments afterwards.

## The architecture: which article governs which income

Every Indian treaty has roughly the same skeleton. Business profits, employment income, pensions, interest,
dividends, capital gains and royalties each have their own article, and the article decides the taxing rights.

| Income type                    | Typical article | Which country taxes first                       | Typical reduced rate in India      |
| ------------------------------ | --------------- | ----------------------------------------------- | ---------------------------------- |
| Interest on NRO deposits       | Article 11      | India (source), with rate cap                   | 10–15%                             |
| Dividends from Indian shares   | Article 10      | India (source), with rate cap                   | 10–15% (post-DDT context)          |
| Rent / property income         | Article 6       | India (source)                                  | Full, but relief abroad via credit |
| Employment salary              | Article 15/16   | Residence country, if conditions met            | Often exempt in India              |
| Capital gains on Indian shares | Article 13      | India for unlisted/immovable; varies for listed | Per domestic rules or treaty       |
| Pensions / retirement income   | Article 18/19   | Varies widely by treaty                         | Country-specific                   |

The rate cap is the treaty's main gift on _passive_ income: Article 11 says interest may be taxed in the
source country, but not above the rate the treaty specifies. When the bank has your treaty documents, it
deducts at the capped rate. When it does not, it deducts at the domestic 31.2% and the difference becomes a
refund claim.

## The three documents, in order

**1. Tax Residency Certificate (TRC).** Issued by the foreign country's tax authority for a specific financial
year — the US issues Form 6166, the UK a Certificate of Residence, the UAE a TRC through its portal. The TRC
is valid for the year it names; a certificate for FY 2024-25 does not support a claim for FY 2025-26.

**2. Form 10F.** The self-declaration that supplements the TRC: status, the treaty article claimed, and the
no-PE assertion where relevant. Since 2022 it is generated electronically on the Indian income-tax portal, and
where the person has no PAN, the e-filing route works with the mandatory fields — the
[income-tax portal](https://www.incometax.gov.in/iec/foportal/) hosts the current workflow.

**3. No-PE declaration / beneficial-ownership form.** Many banks add their own annexure — a declaration that
you have no permanent establishment in India through which the income is attributable, and that you are the
beneficial owner of the income. The MLI's Principal Purpose Test has made this declaration more than a
formality: a structure whose _principal purpose_ of a arrangement is treaty shopping can be denied benefits
under the PPT in India's amended treaties.

| Document               | Who issues it           | Validity                  | Failure if missing        |
| ---------------------- | ----------------------- | ------------------------- | ------------------------- |
| TRC                    | Foreign tax authority   | One financial year        | Domestic TDS rate applies |
| Form 10F               | Self, on Indian portal  | Per year, per income type | Bank declines treaty rate |
| No-PE / BO declaration | Self, per bank's format | Per account/facility      | Bank declines treaty rate |

## Taxation abroad and the credit: Form 67

Where the treaty lets both countries tax — rent is the classic case, since Article 6 gives the property's
country the primary right — the resident country provides _relief_, and the Indian side provides a _credit_
for tax paid abroad. The Indian credit is claimed through Form 67, filed **before** the ITR for the year.
Miss the sequencing and the foreign tax credit is denied for that year even when the treaty entitlement is
unambiguous — a rule that has been enforced strictly since Form 67's filing became mandatory.

The credit computation is per-country and per-income-source: the Indian tax on that income is the ceiling,
and the credit is the lower of foreign tax paid or that ceiling. On rental income from a UK flat taxable in
both countries, the UK's higher-rate tax exceeds the Indian liability, so the Indian credit is capped at the
Indian tax — the excess UK tax is a sunk cost the treaty does not recover.

| Income                                   | Indian tax                     | Foreign tax          | Credit claimed in India |
| ---------------------------------------- | ------------------------------ | -------------------- | ----------------------- |
| UK rental income ₹10 lakh equivalent     | ₹1,56,000 (new regime approx.) | ₹4,00,000 equivalent | Capped at ₹1,56,000     |
| US dividend ₹2 lakh, 25% withheld        | ₹31,200 slab                   | ₹50,000 withheld     | Capped at ₹31,200       |
| Singapore interest ₹5 lakh at 15% treaty | ₹1,56,000 if ROR               | Nil in Singapore     | N/A — India taxed first |

## The Tax Residency and Passive-income specifics

Two treaty areas generate the most disputes. **Capital gains on Indian shares held by treaty residents:**
the India-Mauritius and India-Singapore treaties' grandfathering provisions ended in 2017–2019; today,
gains on Indian securities are taxed largely under domestic law, with the treaty limiting only certain
categories. **Salaries under Article 15:** the 183-day rule and the employer-not-in-India condition decide
whether the salary is India-taxed; remote workers who spend 200 days in India while employed abroad often
fail the second condition if the foreign employer has an Indian office or charges costs to India — the
permanent-establishment analysis is where the treaty argument is won or lost.

## Practical sequence for a first-time claim

1. **Get the TRC for the correct financial year** from the foreign authority — this is the long-lead item;
   the US Form 6166 takes weeks.
2. **Generate Form 10F** on the Indian portal, with PAN active and Aadhaar-linked where applicable.
3. **Submit the bank's no-PE form** with the TRC, before the first interest or dividend credit.
4. **Verify the TDS rate applied** on the first payment; if the bank still deducts 31.2%, escalate in
   writing — the paper trail is what supports the refund claim if the year ends wrong.
5. **File Form 67 before the ITR** for any foreign tax credit, and reconcile Form 26AS against the bank's
   TDS filings.

## The legality note

Treaty claims are legal when the facts are true and the documents are current. The grey zone is _residency
shopping_: claiming TRC residence of a country you are not genuinely resident in, or holding a TRC while the
real management of your affairs sits elsewhere — the MLI's Principal Purpose Test lets India deny the benefit
when obtaining it was a main purpose of the arrangement. Consequences of a denied treaty claim are the
standard assessment machinery: the differential tax is raised as demand with interest under Sections 234B and
234C, penalty under Section 270A for under-reporting is possible, and in cases of deliberate false
certification, prosecution under Section 277 of the Income-tax Act has been applied. The clean path is
unglamorous: one TRC per year per country of actual residence, honest no-PE declarations, and the credit
paperwork filed in the right order.

## The bottom line

The treaty does not need a lawyer; it needs three documents filed in the right sequence before the income is
paid. TRC for the current year, Form 10F from the portal, no-PE declaration to the bank — and Form 67 before
the return, when foreign tax was actually suffered. Miss any of the four and the treaty's benefit converts
into a refund claim you may or may not recover on time. Get them right and the difference is often 15
percentage points of yield on every passive rupee you hold in India.
