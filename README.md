# 📖 Edviron Payments System – Full Documentation

## 📌 Overview
This project is a **full-stack payments system** for schools, built with:  

- **Backend:** Express.js + MongoDB  
- **Frontend:** React (Vite) + TailwindCSS  
- **Integration:** Edviron `create-collect` API + Webhooks  

It allows:  
✅ Generating payment links for students (Create Collect)  
✅ Processing real-time payment updates via Webhooks  
✅ Storing transactions in MongoDB  
✅ Viewing transaction history in a paginated dashboard  

---

## ⚙️ Setup & Installation

### 1. Clone Repository
```bash
git clone https://github.com/your-repo/edviron-payments.git
cd edviron-payments
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

#### Environment Variables (`backend/.env`)
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/edviron
EDVIRON_API_KEY=your_edviron_api_key
EDVIRON_SECRET=your_webhook_secret
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit 👉 [http://localhost:5173](http://localhost:5173)

---

## 🔑 Environment Variables (Backend)

| Variable            | Description |
|---------------------|-------------|
| `PORT`              | Port for Express backend (default `4000`) |
| `MONGO_URI`         | MongoDB connection string |
| `EDVIRON_API_KEY`   | API key from Edviron (for create-collect requests) |
| `EDVIRON_SECRET`    | Secret key from Edviron (used for verifying webhook signatures) |

---

## 📡 API Documentation

### 1. Create Collect (Generate Payment Link)
**Endpoint:**  
```
POST /api/payments/create
```

**Request Body:**
```json
{
  "school_id": "65b0e6293e9f76a9694d84b4",
  "amount": "2000",
  "order_id": "ORDER123",
  "student_name": "John Doe",
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "collect_id": "68c2a4cafe1ebb315a0bf662",
  "payment_url": "https://dev-vanilla.edviron.com/pay/..."
}
```

---

### 2. Transactions (Paginated List)
**Endpoint:**  
```
GET /api/transactions?page=1&limit=10
```

**Response:**
```json
{
  "page": 1,
  "limit": 10,
  "totalPages": 3,
  "results": [
    {
      "collect_id": "68c2a4cafe1ebb315a0bf662",
      "order_amount": 2000,
      "transaction_amount": 2000,
      "status": "success",
      "payment_mode": "UPI",
      "student_name": "John Doe",
      "phone": "9876543210",
      "payment_time": "2025-09-11T12:34:56.000Z"
    }
  ]
}
```

---

### 3. Webhook (Payment Update)
**Endpoint (Edviron calls this):**  
```
POST /api/webhook/payment
```

**Payload:**
```json
{
  "payload": {
    "order_id": "ORDER123",
    "collect_id": "68c2a4cafe1ebb315a0bf662",
    "transaction_amount": 2000,
    "status": "success"
  },
  "sign": "sha256=..."
}
```

**Processing:**
- Backend verifies the **HMAC signature** in `sign`.  
- If valid → update DB record with new status.  
- If invalid → reject (possible fraud).  

---

## 🧪 Postman / ThunderClient Collection

You can import the included `EdvironPayments.postman_collection.json` (or ThunderClient export) to test all APIs.  

Collection includes:
- **Create Collect** (with sample payload)  
- **Webhook Simulation** (send test webhook events)  
- **Transactions List** (with pagination params)  

👉 To simulate webhooks, send a `POST` request to `/api/webhook/payment` with a test payload.  

---

## 🔗 Data Flow Diagram

```mermaid
flowchart LR
    A[Frontend (React)] -->|POST /payments/create| B[Backend (Express.js)]
    B -->|POST create-collect-request| C[Edviron API]
    C -->|Response (collect_id + link)| B
    B -->|Save pending transaction| D[(MongoDB)]
    A -->|GET /transactions| B
    B -->|Return history| A
    C -->|Webhook (payload+sign)| E[Backend Webhook]
    E -->|Verify + update status| D
    D -->|Updated data| A
```

---

## 🎨 Frontend Features
- Transaction History Page with:
  - Search bar  
  - Filters (Date, Status, Institute)  
  - Paginated table  
  - Row hover effects  
  - Status highlighting (🟢 success, 🟡 pending, 🔴 failed)  

---

## ✅ Summary
- **Backend:** Handles Edviron API integration, signature verification, transaction persistence.  
- **Frontend:** Displays payment history in a modern UI.  
- **Data flow:** Frontend → Backend → Edviron → Webhook → DB → Frontend.  
