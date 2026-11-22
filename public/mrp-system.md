# MRP System: The Inventory Ledger

QuickBooks is a reliable accounting system, but I often have to review several separate reports to make a single material planning decision. I built this MRP system to bring those reports together and see how incoming supply and customer demand affect inventory over time.

At the core is a [**time-phased inventory ledger**](https://docs.oracle.com/en/applications/jd-edwards/localizations/9.2/eoape/understanding-the-inventory-ledger.html) that shows how much stock we expect to have on any given date. The ledger answers these questions:

- How much stock will remain on a specific date?
- What is the projected balance before unconfirmed sales orders?
- What is the projected balance before unconfirmed purchase orders? 

## How the inventory ledger works

Each ledger row represents an inventory event. The ledger calculates a cumulative sum separately for each item, in timeline order:

| Field | Meaning |
| --- | --- |
| `Date` | The planned date of the inventory movement |
| `Kind` | `OPEN` for the snapshot, `IN` for supply, or `OUT` for demand |
| `Source` | `Snapshot`, `HQ`, `USA`, or `SO` |
| `Reference` | The record behind the event |
| `Delta` | The signed quantity for the event |
| `CumDelta` | The cumulative change for the item |
| `Projected_OnHand` | The stock balance after the event |

```text
CumDelta = cumulative sum of Delta
Projected_OnHand = Opening + CumDelta
```

## Use case 1: Quotation Lookup

We operate a [**make-to-order**](https://www.investopedia.com/terms/m/make-to-order.asp) business. Customers need short lead times, and we need a credible delivery date when an order arrives. 

Quotation Lookup answers two questions: how many units can I promise, and on what date? A current stock count shows what is on hand today. The ledger shows whether future receipts can support a new order without disruption to existing commitments.

### Why the current totals are not enough

For example, we want to know the inventory status of `DDR5-16GB-56-SM`:

| Item | On Hand | On Sales Order | Available | On PO |
| --- | ---: | ---: | ---: | ---: |
| DDR5-16GB-56-SM | 20 | 103 | <span style="color: #dc2626;">-83</span> | 108 |

The available quantity is negative, while the purchase quantity exceeds the sales demand. Neither total tells me when material becomes available. The answer depends on the sequence of receipts and shipments.

Without the timeline, that decision requires separate views:

- The inventory report shows current stock and aggregate commitments.
- The supply schedule shows expected receipts.
- The sales order report shows demand and requested shipment dates.

Ledger combines those views around an item and its inventory movements.

### How much can we promise on a new quote?

A new shipment reduces the projected balance on its ship date and on every date that follows. I use the **lowest projected balance from the proposed shipment onward**, within the dated events. That balance sets the maximum additional quantity that leaves all later dated balances at zero or above.

| Date | Kind | Delta | Projected_OnHand |
| --- | --- | ---: | ---: |
| Nov 2 | OPEN | — | 30 |
| Nov 5 | OUT | -20 | 10 |
| Nov 10 | IN | +40 | 50 |
| Nov 12 | OUT | -25 | 25 |

On November 2, there are 30 units on hand, but the November 5 shipment brings the projected balance down to 10. I can promise up to 10 units for November 2. After the November 10 receipt, the next commitment reduces the balance to 25. I can promise up to 25 units for November 10.

| New requirement | Earliest ship date | What happens to the later balance |
| --- | --- | --- |
| 10 units | Nov 2 | The Nov 5 balance falls to 0. |
| 25 units | Nov 10 | The Nov 12 balance falls to 0. |
| 26 units | No feasible date in the example | Even after the Nov 10 receipt, the Nov 12 balance falls to -1. |

### Verification before a promise

The full ledger can display undated events. For a specific ship date, I use the dated balances from that date forward. I verify any receipt that the promise depends on. Placeholder supply does not establish a delivery date.

## Use case 2: Material requirements planning (MRP)

MRP uses the ledger to determine whether supply covers existing demand on time. It identifies the date and quantity of a shortage.

### When does the shortage occur?

The ledger starts with 10 units on November 4. The next day, a receipt adds five units and a shipment uses eight units. The projected balance falls to seven units. On November 6, a second sales order needs nine units. That order creates a **projected shortage of two units**.

| Date | Kind | Source | Reference | Delta | CumDelta | Projected_OnHand |
| --- | --- | --- | --- | ---: | ---: | ---: |
| 2026-11-04 | OPEN | Snapshot | Opening stock | 0 | 0 | 10 |
| 2026-11-05 | IN | USA | PO-001 | +5 | +5 | 15 |
| 2026-11-05 | OUT | SO | SO-001 | -8 | -3 | 7 |
| 2026-11-06 | OUT | SO | SO-002 | -9 | -12 | **-2** |
| 2099-12-31 | IN | HQ | Unconfirmed supply | +20 | +8 | 18 |

For events on the same date, the ledger processes receipts before shipments. On November 5, the ledger adds five incoming units before it subtracts eight units for the shipment.

### Why unconfirmed supply does not resolve the shortage

The final balance reaches 18 once the ledger includes the 20 units of unconfirmed supply. The `2099-12-31` date is a placeholder. Those units have no confirmed arrival date that establishes coverage for the November 6 shortage.

### Which components block the order?

Each movement links back to its source record, so I can verify the quantity and date. The ledger shows which incoming receipt can cover the shortage if it arrives in time.

`Waiting_Item` shows the latest blocking items saved in Planning for the order’s `QB Num`. One component can have enough stock while another component blocks the order. This context connects the item balance to the complete order.

## Results and limits

Ledger provides a dated projection based on the records available to it. It does not calculate an optimal safety-stock quantity. That decision also requires these inputs:

- Demand variability
- Lead-time variability
- A target service level
- Inventory cost assumptions

For my workflow, the first gain is a traceable basis for decisions. I can see the projected balance for an item and the orders behind each change. That evidence supports a discussion about delivery dates before we commit material to a new order.
