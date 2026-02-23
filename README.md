# VeriTrade

**VeriTrade** is an AI-powered invoice verification and fraud detection platform that helps SMEs identify high-risk invoices and suppliers before payment is made.

## How It Works

1. Users upload invoices (PDF or image) via web or mobile  
2. The system extracts invoice data and validates supplier details  
3. AI models analyze invoices for fraud patterns  
4. The platform generates a supplier trust score and risk recommendations  

## Core Features

- Invoice scanning and data extraction  
- Supplier verification using public business registration data (CAC)  
- Fraud detection for duplicate invoices, unregistered suppliers, and price outliers  
- Supplier trust score and actionable alerts (e.g., verify before paying)  

## Impact

By reducing fraudulent payments, VeriTrade directly supports **SDG 16** by strengthening transparency, reducing corruption, and limiting illicit financial flows.
# veritrade
VeriTrade Project - WTF Capstone group 16
# BACKEND DOCUMENTATION

**Base URL:** `http://localhost:5000`  
**Version:** 1.0.0 (MVP)

---

## Quick Start

1. Register/Login to get JWT token
2. Buyers submit verification requests
3. Admins review and approve/reject/flag requests

---

## Authentication

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Buyer",
  "email": "buyer@veritrade.com",
  "password": "TestPassword123",
  "role": "buyer"  // or "admin"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "buyer@veritrade.com",
  "password": "TestPassword123"
}
```

**Response includes JWT token** — save it for future requests (will need auth middleware later).

---

## Buyer Endpoints

### Submit Verification Request
```http
POST /api/verifications/submit
Content-Type: application/json

{
  "business_name": "EcoTech Solutions Ltd",
  "registration_number": "RC999988"
}
```

### Get My Requests
```http
GET /api/verifications/my-requests
```

### Get Single Request
```http
GET /api/verifications/1
```

### Cancel Request
```http
PATCH /api/verifications/1/cancel
```
*Only works for pending/draft requests*

---

## Admin Endpoints

### Get Pending Requests
```http
GET /api/admin/verifications/pending
```

### Get All Requests (with optional filter)
```http
GET /api/admin/verifications
GET /api/admin/verifications?status=verified
GET /api/admin/verifications?status=rejected
```

### Approve Request
```http
PATCH /api/admin/verifications/1/verify
Content-Type: application/json

{
  "admin_notes": "Business verified successfully"
}
```

### Reject Request
```http
PATCH /api/admin/verifications/2/reject
Content-Type: application/json

{
  "admin_notes": "Invalid registration number"
}
```

### Flag Request
```http
PATCH /api/admin/verifications/3/flag
Content-Type: application/json

{
  "admin_notes": "Requires further investigation"
}
```

---

## Status Lifecycle
```
pending → verified
        → rejected
        → flagged
        → cancelled
```

**Rules:**
- Only `pending` requests can be reviewed by admin
- Only `pending` or `draft` requests can be cancelled by buyer
- Once reviewed (verified/rejected/flagged), status cannot change

---

## Testing

Use the `api-tests.http` file with REST Client extension:

1. Register buyer & admin
2. Login as buyer
3. Submit 2-3 verification requests
4. Login as admin (if needed)
5. Review requests (verify/reject/flag)
6. Test cancel feature

---

## Error Responses

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Server Error |

---

## Database

**3,500 Nigerian businesses** available in suppliers table for verification matching.

**3 Main Tables:**
- `users` — Buyers and Admins
- `verification_requests` — All verification submissions
- `suppliers` — Business registry data

---

