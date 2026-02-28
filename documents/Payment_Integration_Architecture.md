# Payment Integration Architecture

## Section 1: Technical Integration Plan

1. **Architecture Overview**:
   The primary goal is to transition the KalaKrut platform from mock transactions and seeded data to a production-ready, live PayPal/Stripe integration for the "Hybrid Ledger" (Phases 3 & 4).

2. **Frontend Implementation (The Client-Side Gateway)**:
   - **Role**: The "Digital Cashier."
   - **Location**: `src/components/PaymentGateway.tsx`
   - **Functionality**: Handles SDK initialization, renders secure payment buttons/iframes, and manages user authorization flows.
   - **Limitation**: Frontend actions are susceptible to client-side manipulation. They are used for UX but never for final financial "Truth."

3. **Backend Logic (The Server-Side Auditor)**:
   - **Role**: The "Bank Statement Auditor."
   - **Location**: `server/src/routes/transactions.js`
   - **Capture Functionality**: Performs secure "Server-to-Server" validation directly with PayPal/Stripe APIs to claim funds and verify transaction integrity.
   - **Webhook Functionality**: Listens for asynchronous events sent from providers, such as recurring subscriptions, payouts, or customer disputes.
   - **Source of Truth**: This is the only authorized layer allowed to update the `Prisma FiatTransaction` model.

4. **Integration Map**:

| Component | Responsibility | Technology |
| :--- | :--- | :--- |
| **Frontend UI** | `src/components/PaymentGateway.tsx` | React, SDKs (`@paypal/react-paypal-js`) |
| **API Endpoints** | `server/src/routes/transactions.js` | Express, Node.js |
| **Data Persistence** | `Prisma FiatTransaction Model` | PostgreSQL, Prisma |
| **Web3 Bridge** | `Treasury.sol` | Solidity, Ethers.js |

5. **Support & Troubleshooting**:
   The `SupportWidget.tsx` is configured to handle "Payment Gateway Failure" and "Transaction / Escrow Issue" categories for resolving user-reported discrepancies.

6. **Security Note**:
   Mandatory Server-to-Server validation is required for all financial record-keeping. Client-side confirmation is strictly prohibited for updating ledger balances in Phases 3 and 4.

7. **Prerequisites Checklist**:
   - PayPal/Stripe Developer Credentials (Client ID & Secret).
   - `VITE_PAYPAL_CLIENT_ID` configured in `.env`.
   - Prisma Client mapped to the local `generated/client` directory with CJS/ESM interop.

## Section 2: Discussion Record (Verbatim)

**User Question**: For setting up paypal what do you need?

**AI Answer**:
To integrate PayPal into the **KalaKrut** portal (specifically for the Phase 3 goal of handling memberships and artist payouts), we need to set up a bridge between the PayPal SDK and your newly fixed Prisma "Hybrid Ledger."

Here is exactly what is needed to move forward:

### 1. PayPal Developer Credentials
You will need to create a [PayPal Developer account](https://developer.paypal.com/) and obtain:
*   **Client ID:** (Public) To identify your app to PayPal.
*   **Client Secret:** (Secret) To authorize transactions on the backend.
*   **Sandbox Accounts:** At least one "Business" account (to receive money) and one "Personal" account (to simulate a user paying).

### 2. Backend API Updates (`server/src/routes/transactions.js`)
We need to create a "Capture" endpoint. When a user pays via PayPal, PayPal returns a `transactionId`. We must:
*   Verify the payment status with PayPal's servers using the **Client Secret**.
*   Map the PayPal response to your `FiatTransaction` model.
*   **Fields to save:** `referenceId` (PayPal's `capture_id`), `amount`, `currency`, and `userId`.

### 3. Frontend Integration (`src/components/PaymentGateway.tsx`)
We need to install the `@paypal/react-paypal-js` SDK and configure the button:
*   **Environment variable:** Add `VITE_PAYPAL_CLIENT_ID` to your `.env` file.
*   **Logic:** When the `onApprove` callback fires, call your backend to save the record to the Prisma database.

### 4. Schema Alignment (Already mostly done!)
We previously added the `FiatTransaction` model, which is perfect for this. However, to support **Phase 3 (Artist Payouts)**, we should ensure the `status` enum or string can handle PayPal-specific states like `COMPLETED`, `VOIDED`, or `REFUNDED`.

---

**User Question**: Please explain the difference between backed logic for webhook and implementation for payment gateway?

**AI Answer**:
### 1. The Implementation (Frontend Gateway)
**Analogy:** This is the **Digital Cashier**.
*   **Where it lives:** In the user's browser (`src/components/PaymentGateway.tsx`).
*   **What it does:** It displays the PayPal/Stripe buttons, collects credit card info securely (usually inside an iframe so your server never sees the card), and sends the data to the payment provider.
*   **The User Experience:** The user clicks "Pay," sees a popup, logs in to PayPal, and clicks "Authorize."
*   **The Limitation:** You **cannot trust** the frontend. A malicious user could manually trigger the "Success" screen without actually paying. This is why we need the backend.

### 2. The Backend Logic (Webhook & Capture)
**Analogy:** This is the **Bank Statement Auditor**.
*   **Where it lives:** On your server (`server/src/routes/transactions.js`).
*   **What it does (Capture):** Once the user clicks "Authorize" on the frontend, the frontend sends a `transactionID` to your backend. Your backend then calls PayPal's API directly (Server-to-Server) to "Capture" the funds and verify the amount is correct.
*   **What it does (Webhook):** Webhooks are for events that happen *later* or *outside* the app. If a user's subscription renews next month, or if they file a dispute/chargeback, PayPal sends a "Webhook" (an HTTP POST request) to your server to say "Hey, this event happened."
*   **The Security:** This is where you write the data to the **Prisma Hybrid Ledger**. Because this happens on your server, it is the only "Source of Truth" you can trust.