# 6. Reservation

## Purpose

Stores online table reservations.

---

## Fields

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | ✅ | Primary Key |
| customerName | String | ✅ | Customer name |
| customerPhone | String | ✅ | Phone number |
| reservationDate | Date | ✅ | Reservation date |
| reservationTime | Time | ✅ | Reservation time |
| numberOfGuests | Int | ✅ | Total guests |
| notes | String | ❌ | Customer notes |
| status | Enum | ✅ | Reservation status |
| tableId | UUID | ❌ | Assigned table |
| createdAt | DateTime | ✅ | Created timestamp |
| updatedAt | DateTime | ✅ | Updated timestamp |

---

## Relationships

Reservation (Many)

↓

Table (1)

---

## Notes

- Reservations start as PENDING.
- Staff confirms reservations.
- Table assignment is optional until confirmed.
- Reservations are independent from food orders.