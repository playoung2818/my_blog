# MRP System: The Inventory Ledger

My daily material planning decisions depend on reports that answer different parts of the same question: when can we fulfill an order?

QuickBooks is our reliable accounting system. In our workflow, its separate reports do not provide the combined view that I need. I review current inventory alongside purchase orders and sales orders. Then I compare those records with the supply schedule.

I built Ledger to put those records into one timeline for each item. The timeline shows the projected stock after each receipt or shipment. It makes a future shortage visible before the customer needs the material.

## Why the date matters

We operate a make-to-order business. Customers need short lead times, and we need a credible delivery date when an order arrives. Safety stock for core components can reduce the delay before production starts. However, excess stock ties up cash and exposes us to component price changes.

The immediate problem is visibility. A current stock total cannot show whether a purchase order arrives before the sales order that needs it. Ledger connects quantities to dates so that I can assess that gap.

The Quotation Lookup manual gives this example for `DDR5-16GB-56-SM`:

| Item | On Hand | On Sales Order | Available | On PO |
| --- | ---: | ---: | ---: | ---: |
| DDR5-16GB-56-SM | 20 | 103 | -83 | 108 |

The available quantity is negative, while the purchase quantity exceeds the sales demand. Neither total tells me when material becomes available. The answer depends on the sequence of receipts and shipments.

Without the timeline, that decision requires separate views:

- The inventory report shows current stock and aggregate commitments.
- The supply schedule shows expected receipts.
- The sales order report shows demand and requested shipment dates.

Ledger combines those views around an item and its inventory movements.

## One event model for supply and demand

Each ledger row represents an inventory event. The opening row establishes the stock baseline. Inbound events add supply, and outbound events subtract demand.

| Field | Meaning |
| --- | --- |
| `Date` | The planned date of the inventory movement |
| `Kind` | `OPEN` for the snapshot, `IN` for supply, or `OUT` for demand |
| `Source` | `Snapshot`, `HQ`, `USA`, or `SO` |
| `Reference` | The record behind the event |
| `Delta` | The signed quantity for the event |
| `CumDelta` | The cumulative change for the item |
| `Projected_OnHand` | The stock balance after the event |

### The opening stock

The process normalizes item names and sums the inventory snapshot’s `On Hand` quantity by item. Each item receives an `OPEN` row dated today, with `Source = Snapshot` and `Delta = 0`.

The opening quantity enters the balance separately. The zero delta prevents the ledger from counting that stock twice.

### Inbound supply

HQ supply uses `Kind = IN` and `Source = HQ`. Its event date equals the shipping schedule sheet’s `ship date` plus five days.

Local supply uses `Kind = IN` and `Source = USA`. Its event date comes from the POD ship date. Both sources use a positive `Delta = Qty(+)`.

These date rules represent the supplied workflow. The five-day offset is a planning assumption for HQ supply, not a universal transit time.

### Outbound demand

Each positive required quantity in the structured sales order data becomes an outbound event. The row uses `Kind = OUT`, `Source = SO`, and the sales order’s `Ship Date`. Its delta is negative: `Delta = -Qty(-)`.

### The projected balance

The ledger calculates a cumulative sum separately for each item, in timeline order:

```text
CumDelta = cumulative sum of Delta
Projected_NAV = Opening + CumDelta
Projected_OnHand = Projected_NAV
```

`Projected_NAV` is the calculation name in the supplied logic. Quotation Lookup displays that balance as `Projected_OnHand`.

## A shortage inside the timeline

This illustrative snapshot uses November 4, 2026, as its opening date:

| Date | Kind | Source | Reference | Delta | CumDelta | Projected_OnHand |
| --- | --- | --- | --- | ---: | ---: | ---: |
| 2026-11-04 | OPEN | Snapshot | Opening stock | 0 | 0 | 10 |
| 2026-11-05 | IN | USA | PO-001 | +5 | +5 | 15 |
| 2026-11-05 | OUT | SO | SO-001 | -8 | -3 | 7 |
| 2026-11-06 | OUT | SO | SO-002 | -9 | -12 | **-2** |
| 2099-12-31 | IN | HQ | Unconfirmed supply | +20 | +8 | 18 |

The item starts with 10 units. The receipt adds five units, and the first sales order consumes eight units. The second sales order leaves a shortage of two units on November 6.

The final balance reaches 18 only after the unconfirmed supply event. That quantity does not resolve the dated shortage because the receipt lacks a confirmed arrival date.

The example places the receipt before the shipment on November 5. The supplied logic does not specify a general rule for events on the same date. Their order affects intermediate balances, even when the final daily balance stays the same.

## Unconfirmed dates remain visible

Rows dated `2099-12-31` or later remain in the calculation. Quotation Lookup displays them in a gray **Unconfirmed dates** zone. These dates act as placeholders and do not represent delivery commitments.

The manual describes two specific placeholders:

| Date | Meaning in the manual |
| --- | --- |
| `2099-12-31` | A sales order without an assigned ship date |
| `2100-01-05` | A POD without an assigned ship date |

The illustrative ledger above uses `2099-12-31` for generic unconfirmed supply, as in the supplied example. Both conventions place that event in the same unconfirmed zone.

Quotation Lookup highlights the lowest `Projected_OnHand` across the entire ledger in green, including placeholder rows. Green identifies the minimum value. It does not guarantee that the balance is positive or that a delivery date is feasible.

A negative minimum exposes a shortage at some point in the event sequence. Unscheduled PODs can cause this result because their supply appears after dated demand. The timeline distinguishes that timing gap from the final stock total.

## A quotation must preserve later commitments

The opening balance alone does not determine how much stock a new order can use. Later sales orders already need part of that stock.

The manual gives a second example:

| Date | Kind | Delta | Projected_OnHand |
| --- | --- | ---: | ---: |
| Nov 2 | OPEN | — | 30 |
| Nov 5 | OUT | -20 | 10 |
| Nov 10 | IN | +40 | 50 |
| Nov 12 | OUT | -25 | 25 |

For a new shipment on November 2, the lowest subsequent dated balance is 10. For a shipment after the November 10 receipt, that minimum is 25.

The manual’s quotation rule requires every dated balance to remain nonnegative after the new order enters the timeline. Placeholder supply does not establish a dated commitment.

| New requirement | Earliest date in this example | Reason |
| --- | --- | --- |
| 10 units | Nov 2 | The later minimum falls from 10 to 0 |
| 25 units | Nov 10 | The later minimum falls from 25 to 0 |
| 26 units | Not covered by this timeline | The Nov 12 balance falls below zero |

For a candidate date, the available quantity for a new order is bounded by the lowest balance from that point through the dated horizon. This interpretation explains why 30 units on hand do not permit an immediate shipment of 25 units.

The minimum across the entire ledger serves a different purpose. It includes undated commitments, while the quotation example evaluates a candidate date against later dated balances. An actual promise also depends on the unresolved orders and the reliability of the source dates.

## Context for the planner

The timeline connects each movement to its source record. `Waiting_Item` adds the latest saved blocking items from Planning for the row’s `QB Num`. That context helps explain why an order waits, even when one component has enough stock.

Quotation Lookup is useful when QuickBooks shows a negative available quantity or when a customer requests more than the available quantity. The ledger shows where the shortage occurs and which receipt can cover it.

## The boundary of the model

Ledger provides a dated projection based on the records available to it. It does not calculate an optimal safety-stock quantity. That decision also requires demand variability and lead-time variability, plus a target service level and inventory cost assumptions.

For my workflow, the first gain is a traceable basis for decisions. I can see the projected balance for an item and the orders behind each change. That evidence supports a discussion about delivery dates before we commit material to a new order.

> Source: the supplied ledger-generation notes and Quotation Lookup manual, slides 2–9. The examples illustrate the documented workflow, not live inventory.
