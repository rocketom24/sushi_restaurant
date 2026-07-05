# 4. Order

## Purpose

The `Order` table stores every restaurant order regardless of how it was placed.

Supported order methods:

- Website Delivery Order
- Dine-in Table Order
- Phone Order (created by admin)
- Scheduled Order

---

## Fields

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | ✅ | Primary Key |
| orderNumber | String | ✅ | Human-readable order number (e.g. ORD-20260001) |
| orderType | Enum | ✅ | DINE_IN, DELIVERY, PHONE |
| orderStatus | Enum | ✅ | NEW, ACCEPTED, PREPARING, READY, COMPLETED, CANCELLED |
| paymentStatus | Enum | ✅ | PENDING, PAID, FAILED, REFUNDED |
| paymentMethod | Enum | ❌ | STRIPE, CASH, CARD |
| totalAmount | Decimal | ✅ | Final order amount |
| subtotal | Decimal | ✅ | Total before tax/fees |
| deliveryFee | Decimal | ❌ | Delivery charge |
| notes | String | ❌ | Customer notes |
| scheduledFor | DateTime | ❌ | Scheduled delivery or pickup time |
| createdAt | DateTime | ✅ | Order creation timestamp |
| updatedAt | DateTime | ✅ | Last update timestamp |

---

## Customer Information

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| customerName | String | ✅ | Customer name |
| customerPhone | String | ✅ | Phone number |
| customerAddress | String | ❌ | Delivery address |
| customerEmail | String | ❌ | Email address |

---

## Dine-in Information

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| tableId | UUID | ❌ | Foreign Key → Table |

---

## Relationships

Order (1)
↓
OrderItem (Many)

Order (1)
↓
Payment (1)

Table (1)
↓
Order (Many)

---

## Notes

- One Order contains multiple Order Items.
- Delivery orders require an address.
- Dine-in orders require a table.
- Phone orders are created by the admin.
- Scheduled orders use the `scheduledFor` field.
- Every order has a unique order number.