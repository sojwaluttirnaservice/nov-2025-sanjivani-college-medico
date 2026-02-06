# Prescription to Fulfillment Workflow: Detailed Proposal

## 1. Executive Summary

This document outlines the end-to-end workflow for managing prescriptions within the Sanjivani Medoplus ecosystem. It details the interaction between the Customer (Mobile App), the Backend Intelligence (AI Analysis), and the Pharmacy (Web Dashboard), ensuring a seamless transition from a raw image upload to a confirmed, paid order.

## 2. The Workflow Stages

### Stage 1: Customer Upload (Mobile App)

**User Action:**

1.  User selects a Pharmacy from the Search/Home screen.
2.  Navigates to "Upload Prescription".
3.  Uploads an image (Camera/Gallery) and adds optional notes (e.g., "Full course" or "Only 5 tablets").

**System Action:**

- **API:** `POST /prescriptions/upload`
- **Storage:** Image saved to secure storage (local/S3).
- **Database:** Record created in `prescriptions` table with `status = 'PENDING'`.
- **Async Job:** Triggers `analyzePrescription` service (AI).

**UX Enhancement:**

- User sees an immediate "Request Sent" confirmation.
- The "Orders" tab shows a new section: **"Pending Requests"**, allowing the user to track status separately from active orders.

---

### Stage 2: AI Analysis & Intelligence

**Process:**

- The uploaded image is passed to a Vision LLM (e.g., Gemini Flash / OpenAI GPT-4o).
- **Extraction Goal:**
  - Patient Name / Doctor Name (for verification).
  - **Medicine List**: Name, Strength (mg), Dosage (Frequency), Duration.
- **Output:** Structured JSON stored in `prescription_analysis`.

**Benefit:**

- Crucial for the Pharmacist to speed up data entry. Instead of typing manually, the system pre-fills the bill.

---

### Stage 3: Pharmacy Review & Digitization (Web Dashboard)

This is the core operational step.

**UI Implementation (New Page: `/pharmacy/requests`):**

- **Dashboard Alert:** "You have 3 New Prescription Requests" (Real-time polling/Socket).
- **List View:** Shows Customer Name, Time, and "View" button.

**The "Process Request" Interface (Split Screen):**

- **Left Panel (Source):**
  - High-resolution, Zoomable View of the Prescription Image.
  - Contrast/Rotate tools to help readability.
- **Right Panel (Digitization):**
  - **Smart Form:** Pre-filled with data from Stage 2 (AI Analysis).
  - **Inventory Match:** As medicines are recognized, the system auto-checks stock levels in the Pharmacy Inventory.
  - **Edit Capability:** Pharmacist can correct AI errors, change quantity (e.g., strip vs tablet), or substitute brands (with customer consent).
  - **Pricing:** Unit Price fetched from Inventory. Manual override allowed.

**Action:**

- **"Reject"**: If illegible or stock unavailable. (Triggers notification to user).
- **"Create Order"**: Generates the final Bill Amount.

**System Action:**

- **API:** `POST /orders`
- **Payload:** Links `prescription_id`, creates `order_items` (medicine_id, qty, price).
- **Status Update:** Prescription status becomes `PROCESSED`.

---

### Stage 4: Customer Confirmation & Payment

**User Action:**

- Mobile Phone Notification: _"Sanjivani Medicos has generated your bill: ₹450"_.
- User opens App -> "Orders" tab -> Taps the Request.
- **Bill View:** clearly lists items, quantities, and prices.
- **Decision:** "Accept & Pay" or "Decline".

**Fulfillment:**

- Upon Payment, Order Status -> `CONFIRMED`.
- Pharmacy Dashboard moves Order to "Ready for Dispatch/Pickup".

## 3. Technical Requirements & Gaps

### Backend (API)

1.  **Order Creation:** Need `ordersModel.create()` and `ordersController.createOrder()` to handle the transition from Prescription to Order.
2.  **Order Items:** Ensure `order_items` table exists to store line items (medicine, qty, price).
3.  **Linkage:** Add `prescription_id` column to `orders` table (Foreign Key) to prevent duplicate processing.

### Frontend (Mobile)

1.  **Requests List:** Separate view for `PENDING` prescriptions vs `CONFIRMED` orders.
2.  **Bill Review UI:** Screen to show the generated bill before payment.

### Frontend (Pharmacy Web)

1.  **Requests Page:** New dedicated route.
2.  **Split-View Component:** Complex UI for simultaneous image viewing and data entry.

## 4. Why This Works

- **Efficiency:** AI reduces typing effort for pharmacists by ~70%.
- **Trust:** Customers see the exact bill _before_ paying.
- **Accuracy:** Pharmacist verification ensures AI hallucinations don't lead to wrong meds.
