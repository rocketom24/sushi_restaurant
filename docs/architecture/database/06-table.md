# 5. Table

## Purpose

The `Table` table represents all physical tables inside the restaurant.

Each table has a unique QR code that allows customers to access the table ordering system.

---

## Fields

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | ✅ | Primary Key |
| tableNumber | Int | ✅ | Visible table number |
| qrCode | String | ✅ | QR code URL or identifier |
| seats | Int | ✅ | Maximum seating capacity |
| location | String | ❌ | Example: Window, Terrace, Indoor |
| isActive | Boolean | ✅ | Table available for use |
| createdAt | DateTime | ✅ | Created timestamp |
| updatedAt | DateTime | ✅ | Updated timestamp |

---

## Relationships

Table (1)
↓

Order (Many)

Table (1)
↓

Reservation (Many)

---

## Notes

- QR code should always point to /table/{tableNumber}
- Tables should never be permanently deleted.
- Disable tables using isActive.