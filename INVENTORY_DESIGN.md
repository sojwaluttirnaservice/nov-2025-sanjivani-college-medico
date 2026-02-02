# MedoPlus Inventory Availability System - Design Document

## STEP 1: TASK DEFINITION - The Real Problem

**What "medicine availability" actually means:**

Medicine availability is NOT a simple yes/no question. It's a **time-sensitive, batch-aware, quantity-specific calculation**.

### Why availability is NOT a boolean:

```
❌ Wrong: "Aspirin: In Stock (true)"
✅ Correct: "Aspirin: 150 tablets available across 3 batches (80 expire Mar 2026, 50 expire Jun 2026, 20 expire Sep 2026)"
```

**Critical factors:**

- **Quantity**: Do we have ENOUGH for the requested amount?
- **Batch tracking**: Same medicine, different manufacturing batches
- **Expiry**: A medicine with 1000 units but all expired = OUT OF STOCK
- **FEFO compliance**: First Expiry First Out - legal requirement

**Why naive systems fail:**

1. Store `stock_quantity` as single number → Can't track batches
2. No expiry tracking → Sell expired medicines (illegal)
3. Boolean flags → Can't distinguish "low stock" vs "out of stock"
4. Deduct on order placement → Race conditions, overselling

---

## STEP 2: DOMAIN CONSTRAINT ANALYSIS

### Real-world pharmacy constraints:

#### Constraint 1: Multiple Batches

- Same medicine (e.g., Paracetamol 500mg) arrives in different shipments
- Each batch has different: manufacturing date, expiry date, supplier, cost
- **Design impact**: Need batch-level inventory table, not medicine-level

#### Constraint 2: Expiry Date Management

- Medicines are perishable with strict expiry dates
- Selling expired medicine is **illegal** and dangerous
- **Design impact**: Every availability query MUST filter `WHERE expiry_date > CURRENT_DATE`

#### Constraint 3: FEFO (First Expiry First Out)

- Legal requirement: sell nearest-to-expiry stock first
- **Design impact**: Order fulfillment logic must sort batches by expiry_date ASC

#### Constraint 4: Partial Fulfillment

- Customer orders 100 tablets, we have 80 in stock
- Business decision: Allow partial orders? Reject? Wait for restock?
- **Design impact**: Need business rules engine, not hardcoded logic

#### Constraint 5: Reserved vs Available Stock

- Stock is "physically present" but might be "reserved" for pending orders
- **Design impact**: `physical_quantity` vs `available_quantity = physical - reserved`

#### Constraint 6: Multi-store (Future)

- Same pharmacy chain, different locations
- **Design impact**: Add `store_id` to inventory table, queries scoped by store

---

## STEP 3: INVENTORY LOGIC FLOW

### Flow 1: Searching a Medicine

```sql
-- Step 1: Find medicine by name/generic/brand
SELECT id, name, generic_name, dosage_form
FROM medicines
WHERE name LIKE '%Paracetamol%' OR generic_name LIKE '%Paracetamol%'

-- Step 2: Get all valid batches for this medicine at this pharmacy
SELECT
    batch_no,
    expiry_date,
    physical_quantity,
    reserved_quantity,
    (physical_quantity - reserved_quantity) AS available_quantity
FROM pharmacy_inventory
WHERE medicine_id = ?
  AND pharmacy_id = ?
  AND expiry_date > CURRENT_DATE
  AND physical_quantity > reserved_quantity
ORDER BY expiry_date ASC  -- FEFO
```

### Flow 2: Check Availability for Requested Quantity

```javascript
function checkAvailability(medicineId, pharmacyId, requestedQty) {
    // Get all valid batches sorted by expiry
    const batches = await getBatchesByExpiry(medicineId, pharmacyId);

    let totalAvailable = 0;
    let batchAllocation = [];

    // Greedy allocation: fill from earliest expiry first
    for (const batch of batches) {
        const availableInBatch = batch.physical_quantity - batch.reserved_quantity;

        if (totalAvailable >= requestedQty) break; // Got enough

        const toTake = Math.min(availableInBatch, requestedQty - totalAvailable);
        batchAllocation.push({ batch_no: batch.batch_no, quantity: toTake });
        totalAvailable += toTake;
    }

    return {
        status: getStockStatus(totalAvailable, requestedQty),
        totalAvailable,
        batchAllocation,
        canFulfill: totalAvailable >= requestedQty
    };
}

function getStockStatus(available, requested) {
    if (available === 0) return 'OUT_OF_STOCK';
    if (available < requested) return 'INSUFFICIENT_STOCK';
    if (available < 10) return 'LOW_STOCK';  // Threshold configurable
    return 'IN_STOCK';
}
```

### Flow 3: Prevent Expired Medicine Sales

**Rule**: NEVER query inventory without expiry filter.

```sql
-- ❌ WRONG: Can return expired stock
SELECT SUM(physical_quantity) FROM pharmacy_inventory WHERE medicine_id = ?

-- ✅ CORRECT: Only valid stock
SELECT SUM(physical_quantity - reserved_quantity)
FROM pharmacy_inventory
WHERE medicine_id = ?
  AND pharmacy_id = ?
  AND expiry_date > CURRENT_DATE
  AND physical_quantity > reserved_quantity
```

**Automated cleanup**: Background job to mark expired inventory as `EXPIRED` status.

---

## STEP 4: ORDER → STOCK INTERACTION

### Critical timestamps in order lifecycle:

```
Order Created → Stock RESERVED (not deducted)
Payment Confirmed → Stock still RESERVED
Order Packed → Stock DEDUCTED (physical -= reserved)
Delivery Complete → Transaction complete
Order Cancelled → Stock UNRESERVED (reserved -= qty)
```

### Detailed Flow:

#### 1. Order Creation (Status: PENDING)

```javascript
// DO NOT deduct stock yet - only reserve it
async function createOrder(items) {
  const transaction = await db.transaction();
  try {
    // For each item, check availability and reserve
    for (const item of items) {
      const allocation = await checkAvailability(
        item.medicine_id,
        pharmacy_id,
        item.quantity,
      );

      if (!allocation.canFulfill) {
        throw new Error(`Insufficient stock for ${item.medicine_name}`);
      }

      // Reserve stock in each batch (FEFO order)
      for (const batch of allocation.batchAllocation) {
        await db.query(
          `
                    UPDATE pharmacy_inventory 
                    SET reserved_quantity = reserved_quantity + ?
                    WHERE batch_no = ? AND medicine_id = ? AND pharmacy_id = ?
                `,
          [batch.quantity, batch.batch_no, item.medicine_id, pharmacy_id],
        );
      }

      // Store allocation in order_items with batch info
      await db.query(
        `
                INSERT INTO order_items (order_id, medicine_id, quantity, batch_no)
                VALUES (?, ?, ?, ?)
            `,
        [orderId, item.medicine_id, batch.quantity, batch.batch_no],
      );
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

#### 2. Stock Deduction (Status: CONFIRMED → PACKED)

```javascript
// Only deduct when order is being packed for shipment
async function deductStockOnPacking(orderId) {
  const orderItems = await getOrderItemsWithBatches(orderId);

  for (const item of orderItems) {
    await db.query(
      `
            UPDATE pharmacy_inventory
            SET physical_quantity = physical_quantity - ?,
                reserved_quantity = reserved_quantity - ?
            WHERE batch_no = ? AND medicine_id = ? AND pharmacy_id = ?
        `,
      [
        item.quantity,
        item.quantity,
        item.batch_no,
        item.medicine_id,
        pharmacy_id,
      ],
    );
  }
}
```

#### 3. Order Cancellation

```javascript
// Release reserved stock back to available pool
async function cancelOrder(orderId) {
  const orderItems = await getOrderItemsWithBatches(orderId);

  for (const item of orderItems) {
    await db.query(
      `
            UPDATE pharmacy_inventory
            SET reserved_quantity = reserved_quantity - ?
            WHERE batch_no = ? AND medicine_id = ? AND pharmacy_id = ?
        `,
      [item.quantity, item.batch_no, item.medicine_id, pharmacy_id],
    );
  }
}
```

### Why this matters:

- **Prevents overselling**: Two customers can't buy the last 10 tablets
- **Race condition safe**: Reserved stock can't be allocated twice
- **Reversible**: Cancellations don't corrupt stock count
- **Audit trail**: Know exactly which batch went to which order

---

## STEP 5: SCHEMA DESIGN

### Table 1: `medicines` (Master Data)

**Purpose**: Catalog of all medicines, independent of inventory

```sql
CREATE TABLE medicines (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,           -- Brand name
    generic_name VARCHAR(255),            -- Generic/chemical name
    manufacturer VARCHAR(255),
    dosage_form ENUM('tablet', 'syrup', 'injection', 'cream'),
    strength VARCHAR(50),                 -- "500mg", "10ml"
    requires_prescription BOOLEAN,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Why separate?**

- Medicine exists even if no pharmacy stocks it
- Multiple pharmacies stock same medicine
- Medicine metadata (name, manufacturer) doesn't change with inventory

### Table 2: `pharmacy_inventory` (Batch-Level Stock)

**Purpose**: Track actual physical stock, batch by batch

```sql
CREATE TABLE pharmacy_inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pharmacy_id INT NOT NULL,
    medicine_id INT NOT NULL,
    batch_no VARCHAR(100) NOT NULL,       -- Manufacturer batch number

    -- Quantities
    physical_quantity INT NOT NULL DEFAULT 0,     -- Actually in warehouse
    reserved_quantity INT NOT NULL DEFAULT 0,     -- Reserved for pending orders
    -- available_quantity is DERIVED: physical - reserved (don't store!)

    -- Batch metadata
    manufacturing_date DATE,
    expiry_date DATE NOT NULL,
    cost_price DECIMAL(10,2),
    selling_price DECIMAL(10,2),
    supplier_id INT,

    -- Status tracking
    status ENUM('ACTIVE', 'EXPIRED', 'RECALLED', 'DAMAGED') DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id),
    FOREIGN KEY (medicine_id) REFERENCES medicines(id),
    UNIQUE KEY (pharmacy_id, medicine_id, batch_no)
);

-- Critical index for availability queries
CREATE INDEX idx_expiry_lookup ON pharmacy_inventory(medicine_id, pharmacy_id, expiry_date, status);
```

**Why batch-level?**

- Same medicine comes in multiple batches with different expiries
- FEFO requires per-batch tracking
- Cost price varies by batch (supplier, date)

**Why NOT store `available_quantity`?**

- It's `physical_quantity - reserved_quantity` → always up-to-date
- Storing it creates sync issues (what if reserved changes?)
- Compute it in query or application layer

### Table 3: `order_items` (Extended)

**Purpose**: Link orders to specific inventory batches

```sql
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    medicine_id INT NOT NULL,
    batch_no VARCHAR(100) NOT NULL,       -- Critical: which batch was used
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2),

    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (medicine_id) REFERENCES medicines(id)
);
```

**Why store `batch_no` in order_items?**

- Track which batch was dispensed (for recalls, expiry audits)
- Enable accurate stock deduction (know exactly which batch to deduct from)
- Legal compliance: traceability

---

## STEP 6: MODULE BOUNDARY CLARITY

### Inventory Module Responsibilities:

✅ Check medicine availability (read-only)
✅ List all inventory for a pharmacy
✅ Add new stock (restock from agency)
✅ Update batch details (price changes)
✅ Mark expired stock
✅ Generate low-stock alerts

❌ Does NOT: Create orders, deduct stock directly

### Orders Module Responsibilities:

✅ Reserve stock when order created
✅ Deduct stock when order packed
✅ Unreserve stock on cancellation
✅ Call inventory module for availability checks

❌ Does NOT: Manage inventory restock, set prices

### Agency Restock Module Responsibilities:

✅ Create purchase orders to suppliers
✅ Add received stock to pharmacy_inventory (new batches)
✅ Update inventory costs

❌ Does NOT: Handle customer orders

### Critical Rule: Stock Calculation Lives in Inventory Module

```javascript
// ✅ CORRECT: Centralized business logic
class InventoryService {
  async getAvailableQuantity(medicineId, pharmacyId) {
    // Single source of truth for availability logic
    // Handles expiry filtering, batch aggregation, reserved stock
  }
}

// Orders module uses it:
const available = await inventoryService.getAvailableQuantity(
  medicineId,
  pharmacyId,
);

// ❌ WRONG: Don't duplicate this logic in OrdersController
```

---

## STEP 7: COMMON FAILURE MODES

### Mistake 1: Boolean Stock Flags

```javascript
// ❌ BAD
medicine.in_stock = true;  // Useless: how much? which batch? expiry?

// ✅ GOOD
inventory.batches = [{ qty: 50, expiry: '2026-06-01' }, ...];
```

### Mistake 2: Ignoring Expiry

```sql
-- ❌ BAD: Returns expired stock
SELECT SUM(quantity) FROM inventory WHERE medicine_id = 123;

-- ✅ GOOD
SELECT SUM(physical_quantity - reserved_quantity)
FROM inventory
WHERE medicine_id = 123 AND expiry_date > CURRENT_DATE;
```

### Mistake 3: Direct Quantity Overwrites

```javascript
// ❌ BAD: Overwrites create race conditions
inventory.quantity = requestedQty;  // What if another order just reserved stock?

// ✅ GOOD: Atomic increments/decrements
UPDATE inventory SET reserved_quantity = reserved_quantity + ? WHERE ...;
```

### Mistake 4: No Batch Separation

```sql
-- ❌ BAD: Single row per medicine
pharmacy_inventory(pharmacy_id, medicine_id, total_quantity)

-- ✅ GOOD: Row per batch
pharmacy_inventory(pharmacy_id, medicine_id, batch_no, quantity, expiry_date)
```

### Mistake 5: Deducting Stock on Order Creation

```javascript
// ❌ BAD: Payment might fail, order might cancel
createOrder() → deductStock() → processPayment()

// ✅ GOOD: Reserve first, deduct later
createOrder() → reserveStock() → processPayment() → packOrder() → deductStock()
```

---

## STEP 8: FINAL MENTAL MODEL

### Simple Explanation for Junior Developers:

**Think of pharmacy inventory like a warehouse with multiple boxes:**

1. **Medicine** = Type of item (e.g., "Paracetamol 500mg")
2. **Batch** = Individual box that arrived on a specific date (each has expiry date)
3. **Physical Quantity** = Items actually in the box
4. **Reserved Quantity** = Items someone has "claimed" (in their cart, order pending)
5. **Available** = Physical - Reserved (what you can actually sell now)

**Key rules:**

- Never sell from an expired box (filter by expiry_date > today)
- Always sell from the box expiring soonest (FEFO - sort by expiry ASC)
- When customer orders, RESERVE first (don't deduct immediately)
- When order ships, DEDUCT from physical and release from reserved
- If order cancels, UNRESERVE (put back in available pool)

**Why batch-level tracking?**

- Same medicine, different expiry dates
- Legal requirement for traceability (recall batches if manufacturer issues alert)
- Accurate cost tracking (different suppliers, different prices)

**The Golden Rule:**

> Available stock = Physical stock - Reserved stock, filtered by non-expired batches only

---

## Implementation Checklist for MedoPlus

- [ ] Create `medicines` table (master catalog)
- [ ] Create `pharmacy_inventory` table with batch tracking
- [ ] Add `batch_no` column to `order_items`
- [ ] Implement `checkAvailability()` with FEFO logic
- [ ] Implement stock reservation on order creation (UPDATE reserved_quantity)
- [ ] Implement stock deduction on order packing
- [ ] Implement unreserve on order cancellation
- [ ] Add background job to mark expired inventory
- [ ] Add low-stock alerts (configurable threshold per medicine)
- [ ] Create inventory dashboard showing total/available/reserved breakdown

---

**Architecture Principle**: Inventory is a **read model** for orders, a **write model** for restocking. Orders reserve temporarily, restock adds permanently.
