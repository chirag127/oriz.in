---
title: "Python Data Workflows That Survive Messy Real Files"
description: "Ingest CSV and Excel exports without corrupting Indian numbers, dates, or identifiers. A practical guide to encodings, dtypes, validation, chunking, and reconciliation."
pubDate: 2026-10-26
author: "Chirag Singhal"
type: guide
tags: ["python", "data-engineering", "programming"]
difficulty: "intermediate"
toc: true
related: ["typescript-type-system", "reading-sql-queries", "json-formatting-and-validation"]
keyPoints:
  - "A CSV file is bytes plus an unenforced convention; read it with an explicit encoding and preserve the raw source."
  - "Read identifiers and money as text first, then convert with rules you can test."
  - "Indian digit grouping, lakh/crore notation, DD/MM/YYYY dates, and leading-zero pincodes break naive parsers."
  - "Use Decimal or integer paise for money, and never let binary floating point decide a financial total."
  - "A pipeline is not finished until row counts, totals, and rejected records reconcile and the run is repeatable."
image: "/images/articles/python-data-workflows.jpg"
imageAlt: "Abstract editorial illustration of stacked cream data sheets with orange and charcoal bars, one sheet sliding out of alignment under a small magnifier."
imageWidth: 1200
imageHeight: 630
references:
  - title: "Python documentation: csv module"
    url: "https://docs.python.org/3/library/csv.html"
  - title: "pandas documentation: IO tools"
    url: "https://pandas.pydata.org/docs/user_guide/io.html"
  - title: "Polars user guide: lazy API"
    url: "https://docs.pola.rs/user-guide/lazy/"
  - title: "Apache Arrow documentation"
    url: "https://arrow.apache.org/docs/"
disclaimer: "This guide covers data-engineering practice, not legal or accounting advice. Privacy, retention, and cross-border processing obligations depend on your organisation and jurisdiction; consult qualified counsel for your actual data flows."
---

A file export from a business system is rarely as clean as its filename suggests. The columns may be separated by something other than commas, the encoding may be Windows-1252 rather than UTF-8, the amount column may contain `₹1,23,456.78` or `1.2 lakh`, the date may be `03/04/2026` with no hint whether that is 3 April or 4 March, and the customer ID may have lost its leading zero somewhere between the database and the spreadsheet.

Python has good tools for every one of these problems. The danger is reaching for a one-line `read_csv` and letting defaults make quiet decisions about all of them. A reliable data workflow makes those decisions explicit, records them, and tests the cases that matter.

## Treat the file as bytes and a claim

A CSV is not a typed format. It is a convention for arranging text, with no standard for encoding, quoting rules, decimal separators, date formats, or null values. Before parsing, capture:

- the exact bytes or a cryptographic hash of the source;
- where it came from and when;
- the declared delimiter and encoding, if the provider documented either;
- the row count and file size;
- who is allowed to see the contents.

A manifest written next to the raw file turns a mysterious artefact into an auditable input:

```python
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path

def fingerprint(path: Path) -> dict:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)

    return {
        "path": path.name,
        "bytes": path.stat().st_size,
        "sha256": digest.hexdigest(),
        "observed_at": datetime.now(timezone.utc).isoformat(),
    }

print(json.dumps(fingerprint(Path("orders_2026_09.csv")), indent=2))
```

The hash tells you whether the file changed between runs. That matters when a downstream number is disputed and the only copy of the source has been overwritten.

Do not “clean” the source file in place. Write derived outputs to a different directory, and keep the raw input immutable. When a transformation is wrong, you can rerun it; when the source has been edited by hand, you cannot recover the original.

## Encoding: decide, do not guess

UTF-8 is the sensible default, but Indian business exports often arrive from older systems that emit Windows-1252 or UTF-16. Excel may add a UTF-8 byte-order mark (BOM) that appears as `\ufeff` at the start of the first column name. The standard-library CSV reader can handle all of this once you name the encoding:

```python
import csv
from pathlib import Path

with Path("customers.csv").open(
    "r", encoding="utf-8-sig", newline=""
) as handle:
    reader = csv.DictReader(handle)
    for row in reader:
        print(row["customer_id"], row["name"])
```

`utf-8-sig` reads both plain UTF-8 and UTF-8 with a BOM. `newline=""` lets the `csv` module handle quoted fields that contain line breaks; without it, a multi-line address can split a record in the wrong place.

If the file is not UTF-8, do not silently fall back from one codec to another until something parses. A permissive fallback can turn a Hindi name into mojibake while the job reports success. Detect, log the chosen encoding, and fail loudly if the assumption is wrong:

```python
def read_text_strict(path: Path, encoding: str) -> str:
    try:
        return path.read_text(encoding=encoding)
    except UnicodeDecodeError as exc:
        raise ValueError(
            f"{path.name} is not valid {encoding}; "
            f"failure at byte {exc.start}. Confirm the source encoding."
        ) from exc
```

If you genuinely do not know the encoding, do not hand the decision to a heuristic library without a human review step. The result will be plausible-looking text that is wrong in a way arithmetic cannot detect.

## Parse Indian numbers and money explicitly

Indian digit grouping is not a cosmetic detail. `12,34,567.89` is a valid representation of 1,234,567.89, but `float("12,34,567.89")` raises an error, and a naive `replace(",", "")` followed by `float()` will work for this value while quietly losing precision for very large ones. For money, floating point is the wrong representation in the first place.

A robust ingestion path parses to `Decimal`, validates the scale, and stores integer paise for downstream arithmetic:

```python
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
import re

_AMOUNT = re.compile(r"^\s*(?:₹|Rs\.?|INR)?\s*([0-9][0-9,]*)(?:\.([0-9]{1,2}))?\s*$")

def parse_inr_to_paise(raw: str) -> int:
    text = raw.strip()
    if text in {"", "-", "NA", "N/A"}:
        raise ValueError("missing amount")

    match = _AMOUNT.fullmatch(text)
    if not match:
        raise ValueError(f"unrecognised INR amount: {raw!r}")

    whole = match.group(1).replace(",", "")
    fraction = (match.group(2) or "0").ljust(2, "0")
    amount = Decimal(f"{whole}.{fraction}")
    if amount < 0:
        raise ValueError("negative amount not allowed here")

    paise = (amount * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP)
    return int(paise)
```

This parser handles rupees, `Rs.`, `INR`, Indian grouping, and zero to two decimal places. It rejects ambiguous strings instead of guessing. It also rejects negatives, because a refund should arrive through a different column or a signed convention that the pipeline states explicitly.

Human-readable abbreviations need their own parser, and they should not be mixed into the same column without a flag:

```python
_SCALE = {"thousand": 1_000, "lakh": 100_000, "crore": 10_000_000}

def parse_indian_scale(raw: str) -> Decimal:
    text = raw.strip().lower().replace(",", "")
    parts = text.split()
    if len(parts) != 2 or parts[1] not in _SCALE:
        raise ValueError(f"not a scaled Indian amount: {raw!r}")
    return Decimal(parts[0]) * _SCALE[parts[1]]
```

“1.2 lakh” is 120,000, not 1.2 million. A parser that assumes Western suffixes will be wrong by a factor of ten. Log every scaled amount and sample the results before trusting an aggregate.

## Dates: separate a business date from an instant

`03/04/2026` is ambiguous. In India, DD/MM/YYYY is common; in a US-origin export, MM/DD/YYYY may appear. If the source includes ISO 8601 values, prefer them. If not, require the provider's format to be declared, or infer it from a sample with an explicit check and fail when both day and month are ≤ 12.

```python
from datetime import date, datetime
from zoneinfo import ZoneInfo

IST = ZoneInfo("Asia/Kolkata")

def parse_business_date(raw: str, fmt: str) -> date:
    return datetime.strptime(raw.strip(), fmt).date()

def parse_instant(raw: str) -> datetime:
    parsed = datetime.fromisoformat(raw)
    if parsed.tzinfo is None:
        raise ValueError("instant lacks a timezone offset")
    return parsed.astimezone(IST)
```

Use `date` for things like invoice dates, settlement days, and birth dates. Use an aware `datetime` for events that happened at a moment, such as a payment authorisation. Converting a purely business date into a UTC timestamp can shift it to the previous day and break daily reconciliation.

When storing instants, choose a convention and state it. UTC in the database with an explicit display timezone is a common choice. For reporting, convert to `Asia/Kolkata` at the presentation boundary, not somewhere in the middle of the pipeline.

## Read with `dtype=str`, then convert

Pandas infers types by scanning data. Inference is convenient and occasionally destructive. A pincode column with values `110001` and `400001` becomes an integer; a `None` makes it a float, which can render as `110001.0`. A customer ID with a leading zero loses it. A mixed amount column becomes `object` while a clean-looking column silently becomes `float64`.

For ingestion, read everything as text and convert deliberately:

```python
import pandas as pd

raw = pd.read_csv(
    "orders.csv",
    encoding="utf-8-sig",
    dtype=str,
    keep_default_na=False,
    na_values=[""],
    usecols=[
        "order_id", "customer_id", "order_date",
        "amount_inr", "state", "pincode", "status",
    ],
)
```

Then build a typed frame with explicit nullable types:

```python
clean = pd.DataFrame({
    "order_id": raw["order_id"].str.strip(),
    "customer_id": raw["customer_id"].str.strip(),
    "order_date": pd.to_datetime(raw["order_date"], format="%d/%m/%Y", errors="raise"),
    "amount_paise": raw["amount_inr"].map(parse_inr_to_paise).astype("Int64"),
    "state": raw["state"].str.strip().astype("string"),
    "pincode": raw["pincode"].str.strip().astype("string"),
    "status": raw["status"].str.strip().astype("string"),
})
```

Two details matter here. `keep_default_na=False` preserves strings such as `NA` that may be legitimate state abbreviations rather than missing values. `Int64` with a capital I is pandas' nullable integer type; it can hold missing values without converting the whole column to floating point. For booleans use `boolean`, and for text use `string`.

Validate the result before using it:

```python
assert clean["order_id"].is_unique, "duplicate order ids"
assert clean["amount_paise"].ge(0).all(), "negative amount"
assert clean["order_date"].notna().all(), "unparseable order date"
assert clean["pincode"].str.fullmatch(r"\d{6}").all(), "invalid pincode"
```

Production code should collect violations rather than fail on the first assertion, so the report can list every bad row. The principle is the same: a rejected row is data, not an exception to hide.

## A validation layer with a useful report

A small validation function that returns accepted and rejected rows is often more useful than a strict parser that stops at the first problem:

```python
from dataclasses import dataclass

@dataclass
class Rejection:
    row_number: int
    column: str
    value: str
    reason: str

def validate_orders(raw: pd.DataFrame) -> tuple[pd.DataFrame, list[Rejection]]:
    accepted_rows = []
    rejections: list[Rejection] = []

    for index, row in raw.iterrows():
        try:
            amount_paise = parse_inr_to_paise(row["amount_inr"])
        except (ValueError, InvalidOperation) as exc:
            rejections.append(Rejection(
                row_number=index + 2,  # header occupies row 1
                column="amount_inr",
                value=row["amount_inr"],
                reason=str(exc),
            ))
            continue

        accepted_rows.append({**row.to_dict(), "amount_paise": amount_paise})

    return pd.DataFrame(accepted_rows), rejections
```

Write the rejections to a separate file with the same hash and run identifier. Operations teams can fix the source, and you can prove which rows were excluded from a total. A pipeline that silently drops bad rows is indistinguishable from one that loses good ones.

## Reconcile the totals

Row counts alone are a weak check. Reconcile at least three quantities:

1. **Raw count** — records read before validation.
2. **Accepted count** — records written to the clean layer.
3. **Financial total** — sum of accepted amounts, compared with the source's declared control total.

```python
raw_count = len(raw)
clean_count = len(clean)
rejected_count = raw_count - clean_count
accepted_total = clean["amount_paise"].sum()

print({
    "raw": raw_count,
    "accepted": clean_count,
    "rejected": rejected_count,
    "accepted_paise": int(accepted_total),
})
```

If the source provides a control total, compare it exactly. If it does not, compare a sample of individual rows against the source system. A mismatch should stop publication of the clean table; a report that says “97% of rows loaded” is not the same as “the total matches”.

For invoicing and settlement, totals must be computed in integer paise or `Decimal`, not `float64`. pandas' `sum()` on an integer column is exact until it exceeds the integer range; floats are not. If you must use floats for analytics, keep the authoritative financial total in an exact type and label the float as an estimate.

## Large files: stream, select, and use columnar formats

A 2 GB CSV with forty columns may not fit comfortably in memory once pandas converts strings to Python objects. Read only what you need, and process in chunks:

```python
from collections import Counter

status_counts: Counter[str] = Counter()

for chunk in pd.read_csv(
    "events.csv",
    encoding="utf-8",
    dtype=str,
    usecols=["event_type", "status"],
    chunksize=200_000,
):
    status_counts.update(chunk["status"].value_counts().to_dict())

print(status_counts.most_common(10))
```

For repeated analytical work, convert the raw file once to Parquet and query it with a columnar engine:

```python
import polars as pl

(
    pl.scan_csv("orders.csv", try_parse_dates=False)
    .select(["order_id", "state", "status", "amount_inr"])
    .filter(pl.col("status") == "captured")
    .group_by("state")
    .agg(pl.len().alias("orders"))
    .sort("orders", descending=True)
    .sink_parquet("captured_by_state.parquet")
)
```

Polars' lazy API builds a plan and executes it with projection and predicate pushdown, so it can avoid materialising columns it does not need. The result is not automatically correct; the same encoding, date, and money rules still apply. The engine changes the memory profile, not the semantics.

Choose tools by the shape of the work:

| Situation | Reasonable choice | Why |
| --- | --- | --- |
| A few thousand rows, ad-hoc analysis | pandas or Polars in a notebook | Fast iteration, familiar output |
| Repeated production transform | Explicit script with tests | Reproducible and reviewable |
| Files larger than memory | Chunked pandas, Polars lazy, or DuckDB | Bounded memory |
| Existing warehouse | SQL with a tested load step | Pushes computation to the data |
| Columnar archive | Parquet with Arrow-compatible reader | Smaller, typed, column-selective |

Do not introduce Spark for a 50 MB file. The operational cost of a cluster is real, and a single well-tested script is easier to reason about.

## Idempotency and reruns

A data job will run twice. It may be retried after a timeout, run manually during an incident, or scheduled twice by mistake. The pipeline should produce the same result when given the same input and not duplicate rows when the destination already contains the previous run.

Techniques that work:

- write to a run-specific staging path, validate, then atomically replace the published partition;
- use a deterministic primary key and upsert rather than append;
- record the source hash and skip a run when the input and transformation version are unchanged;
- make the transformation version explicit in the output metadata.

An append-only table with no key is the simplest way to turn a retry into double-counted revenue. If the destination cannot enforce uniqueness, reconciliation must at least detect duplicate keys before publication.

## Testing transformations with small, hostile fixtures

Unit tests for data code should use small files that encode the failures you have actually seen:

```
fixtures/
  orders_clean.csv
  orders_bom.csv
  orders_indian_grouping.csv
  orders_ambiguous_dates.csv
  orders_duplicate_ids.csv
  orders_missing_pincode.csv
```

Each fixture should assert both the accepted output and the rejection reasons. A test that only checks “the function does not crash” misses the whole point.

Two properties are worth testing directly:

- **Conservation:** accepted count + rejected count = input count.
- **Money reconciliation:** sum of accepted paise equals the expected control total.

These catch a large class of accidental row drops and rounding changes without encoding every field.

## Privacy is part of the schema

Indian datasets often contain personal data: names, phone numbers, addresses, PAN, Aadhaar numbers, and financial account details. A data pipeline is a place where that data can leak into logs, test fixtures, notebooks, and screenshots.

Practical rules:

- Do not log full rows. Log column names, counts, hashes, and rejection reasons.
- Do not use production personal data in local tests; synthesise fixtures.
- Keep Aadhaar, PAN, full account numbers, and authentication secrets out of analytical tables unless there is a documented need and a lawful basis.
- Hash identifiers used for joins when the join does not require the original value.
- Set retention explicitly. “Keep everything forever” is a liability, not a strategy.
- Remember that a CSV downloaded to a laptop is a copy outside your access controls.

India's Digital Personal Data Protection Act, 2023, and the rules that follow it, create obligations around purpose limitation, minimisation, retention, and security. The exact requirements depend on your organisation and the data. This article cannot certify compliance; it can only help you avoid making the engineering problem worse.

## Logging and observability

A useful run log answers: which file, which hash, which transformation version, how many rows in each stage, how many rejected, which totals reconciled, and how long it took. It should not contain the rows themselves.

```python
import logging

logger = logging.getLogger("orders.ingest")

logger.info(
    "ingest_complete source=%s sha256=%s raw=%d accepted=%d rejected=%d total_paise=%d",
    manifest["path"],
    manifest["sha256"][:12],
    raw_count,
    clean_count,
    rejected_count,
    int(accepted_total),
)
```

If the job runs on a schedule, alert on missing runs and control-total mismatches, not only on exceptions. A pipeline that completes successfully with zero accepted rows is often more dangerous than one that crashes.

## A worked Indian example: reconciling a month of orders

Suppose a D2C brand exports September orders with these columns: order ID, order date, state, gross amount, discount, and status. The following sequence is deliberately boring:

1. Hash and archive the raw export.
2. Read with `utf-8-sig`, `dtype=str`, and an explicit column list.
3. Parse dates with `%d/%m/%Y`; reject impossible dates with row numbers.
4. Parse gross and discount to paise; reject malformed amounts.
5. Normalise status values against a known set; reject unknown statuses rather than mapping them to “other”.
6. Drop duplicate order IDs after confirming which duplicate is authoritative; report the count.
7. Compute net revenue as gross minus discount in integer paise.
8. Reconcile accepted net revenue against the finance team's control total.
9. Publish a Parquet partition keyed by month and transformation version.
10. Write a rejection report and a run manifest.

The steps are not clever. Their value is that each one can be inspected, tested, and rerun. A month-end close is a poor time to discover that a parser guessed the wrong date format.

## What to avoid

| Anti-pattern | Consequence |
| --- | --- |
| `pd.read_csv(path)` with all defaults | Silent dtype changes and ambiguous dates |
| `float` for money | Rounding drift in totals |
| Dropping rows with `errors="coerce"` and moving on | Invisible data loss |
| Editing the raw export in Excel | Unrecoverable source corruption |
| Logging full records for “debugging” | Personal data in log systems |
| Appending on every rerun | Duplicate revenue |
| One giant notebook as the production job | Untestable, order-dependent runs |
| Assuming an Indian export is UTF-8 or DD/MM/YYYY | Mojibake and shifted dates |

None of these mistakes is exotic. Most data incidents are ordinary decisions made under deadline pressure and never revisited.

## The standard to aim for

A good pipeline is not the one with the most libraries. It is the one where a new engineer can answer, without asking anyone:

- What was the input, exactly?
- What rules were applied?
- Which rows were rejected, and why?
- Do the totals reconcile?
- Can the run be repeated safely?
- What personal data is present, and where does it go?

Python gives you the pieces: the `csv` module for correct reading, `Decimal` for money, `zoneinfo` for time zones, pandas or Polars for tabular work, and pytest for the cases that broke last time. The discipline is in deciding the rules before the numbers become someone's monthly report.
