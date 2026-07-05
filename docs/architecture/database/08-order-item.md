# OrderItem

## Purpose

The `OrderItem` table stores every individual menu item included in a customer's order.

One Order can contain many Order Items.

Example:

Order #102

- California Roll ×2
- Salmon Nigiri ×4
- Coca-Cola ×2

This creates three OrderItem records.

---

## Fields

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | ✅ | Primary Key |
| orderId | UUID | ✅ | Foreign Key → Order |
| menuItemId | UUID | ✅ | Foreign Key → MenuItem |
| quantity | Int | ✅ | Quantity ordered |
| unitPrice | Decimal | ✅ | Price of one item at purchase time |
| totalPrice | Decimal | ✅ | quantity × unitPrice |
| notes | String | ❌ | Customer notes for this item |
| kitchenStatus | Enum | ✅ | NEW, PREPARING, READY, SERVED |
| createdAt | DateTime | ✅ | Auto generated |
| updatedAt | DateTime | ✅ | Auto generated |

---

## Relationships

Order (1)

↓

OrderItem (Many)

MenuItem (1)

↓

OrderItem (Many)

---

## Business Rules

- Every OrderItem belongs to one Order.
- Every OrderItem references one MenuItem.
- Unit price is copied from the MenuItem when the order is placed.
- Future price changes must not affect existing orders.
- Total price is calculated as:

quantity × unitPrice

- Item notes are optional.
- Kitchen status is tracked separately for each item.

---

## Example

Order #105

California Roll

Quantity: 2

Unit Price: €8.50

Total: €17.00

----------------------

Salmon Nigiri

Quantity: 4

Unit Price: €6.00

Total: €24.00