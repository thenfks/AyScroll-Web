# 🦅 Developer Instructions for NFKS Payment Gateway

## 1. Session ID & Redirect Logic (CRITICAL)
AyScroll relies on the **Gateway** to generate the `session_id` and pass it back.

- **Who creates `order_id`?** -> **AyScroll** (Client sends this in the init request).
- **Who creates `session_id`?** -> **NFKS Gateway** (You must generate this unique token).

### Required Redirect Behavior
When a payment is successful, you **MUST** redirect the user back to AyScroll with **BOTH** the status and the session ID in the URL query parameters.

**❌ Invalid Redirect:**
`https://ayscroll.com/profile?status=success`

**✅ Correct Redirect:**
`https://ayscroll.com/profile?status=success&session_id=cs_test_12345678`

> **Why?** AyScroll uses the `session_id` to verify the transaction and upgrade the user's account immediately. If it is missing, the upgrade will fail handling.

---

## 2. CORS Whitelist
The Client receives CORS errors when trying to create a session. You **MUST** update your `middleware.ts` or `next.config.js` to whitelist these origins:

```typescript
const allowedOrigins = [
  'https://ayscroll.com',        // Production
  'http://localhost:8081',       // Client Dev
  'http://localhost:5173'        // Vite default
];
```

---

## 3. Amount Formatting
AyScroll is currently sending the amount in **Major Units** (e.g., Rupees directly), not minor units (paise).

- **AyScroll Sends:** `499` (for ₹499.00)
- **Gateway Should Interpret:** INR 499.00

*If you prefer Paisa (49900), please update the API docs, and we will revert the client change.*

---

## 4. API Response Contract
When AyScroll calls `POST /checkout/create`, your response **MUST** include the `checkout_url`.

**Response Format:**
```json
{
  "success": true,
  "data": {
    "checkout_id": "cs_test_12345...",
    "checkout_url": "https://payments.nfks.co.in/checkout/cs_test_12345...",
    "order_id": "ORD-172..." 
  }
}
```

## 5. Webhook Requirements
AyScroll listens for `payment.success`. ensure your payload includes:
1. `payment.order_id` (To match our DB)
2. `payment.invoice.invoice_url` (So we can show the download link)
