# Simple Inventory Logic for Diploma Project (Viva Guide)

Here is the **simplest** correct way to explain and build your inventory system.

## 1. How to Store Medicine Names

Keep it separate from stock. Think of this as your "Menu Card".

- **Table Name:** `medicines`
- **Columns:**
  - `id` (Auto Number)
  - `name` (e.g., "Crocin 500mg")
  - `company` (e.g., "GSK")
  - `type` (e.g., "Tablet", "Syrup")
- **Why?** You don't want to type "Crocin" again and again for every batch. You just use the `id`.

## 2. How to Store Quantity (The Inventory)

This is where the actual boxes are. You **MUST** track Batches because of Expiry Dates.

- **Table Name:** `inventory`
- **Columns:**
  - `id` (Auto Number)
  - `medicine_id` (Link to `medicines` table)
  - `batch_no` (e.g., "B123")
  - `expiry_date` (e.g., "2026-12-31")
  - `quantity` (Number of strips/bottles)
  - `mrp` (Price)

> **Viva Tip:** If the examiner asks "Why batches?", say: _"Because one strip might expire next month, and another next year. We can't mix them."_

## 3. How to Check "Is it In Stock?"

Don't just check if `quantity > 0`. You must check if it's **valid** stock.

**The Logic (in simple English):**
"Sum of all quantity for this medicine, BUT only for batches that have NOT expired."

**The Query:**

```sql
SELECT SUM(quantity)
FROM inventory
WHERE medicine_id = [ID]
AND expiry_date > CURDATE();
```

- If result is 0 or null -> **Out of Stock**
- If result > 0 -> **In Stock**

## 4. How to Ignore Expired Medicines

You don't need to delete them immediately. Just **filter them out** when selling.

- Always add `AND expiry_date > CURDATE()` to your `SELECT` queries.
- **Viva Explanation:** _"Sir, the expired medicines are still in the database (so we can audit them), but the billing screen hides them automatically."_

## 5. How to Reduce Stock (Selling)

This is the only "tricky" part. You follow **FEFO** (First Expiry, First Out).

**Step-by-Step Logic:**

1.  Customer wants 5 strips.
2.  Find the batch passing expiry that expires **soonest**.
3.  Subtract 5 from that batch.
4.  (Optional for Diploma): If that batch only has 2, take 2 from there, and 3 from the _next_ batch.

**Simpler Approach for Diploma:**
Just show the list of batches to the pharmacist on the billing screen.

- Batch A (Exp: Jan) - Qty 10
- Batch B (Exp: Dec) - Qty 50
- The pharmacist manually clicks Batch A to sell.
- **Code:** `UPDATE inventory SET quantity = quantity - 1 WHERE id = [Batch_ID]`

## 6. What is "Enough" for a Project?

- **Master Table**: `medicines` (add/edit names)
- **Inventory Table**: `inventory` (add stock with batch & expiry)
- **Stock Check**: Show "Available: 50" (sum of valid batches)
- **Billing**: Select a batch -> Decrease quantity.

**Do NOT do:**

- Automatic reordering.
- Complex "Reservation" (holding stock while user types).
- AI predictions.
