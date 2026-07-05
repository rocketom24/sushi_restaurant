# 7. Payment

## Purpose

Stores payment information for customer orders.

---

## Fields

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | ✅ | Primary Key |
| orderId | UUID | ✅ | Foreign Key → Order |
| amount | Decimal | ✅ | Payment amount |
| paymentMethod | Enum | ✅ | Stripe, Cash, Card |
| paymentStatus | Enum | ✅ | Payment status |
| transactionId | String | ❌ | Stripe transaction ID |
| paidAt | DateTime | ❌ | Payment completion time |
| createdAt | DateTime | ✅ | Created timestamp |
| updatedAt | DateTime | ✅ | Updated timestamp |

---

## Relationships

Order (1)

↓

Payment (1)

---

## Notes

- Every order has one payment record.
- Stripe transaction IDs should be stored.
- Refunds update the payment status.