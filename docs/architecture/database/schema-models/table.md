# Table Model Documentation

---

## Purpose

The **Table** model represents every physical dining table inside the restaurant.

It serves as the foundation for all dine-in operations and enables the Restaurant Operating System to manage seating, QR ordering, reservations, and table status efficiently.

This model is designed to support the restaurant's current workflow while remaining flexible enough for future expansion.

---

# Business Objectives

The Table model allows the system to:

- Manage all physical restaurant tables.
- Track table availability in real time.
- Enable QR code ordering.
- Support waiter and tablet ordering.
- Link dine-in orders to a specific table.
- Support future reservation management.
- Monitor restaurant occupancy.

---

# Business Rules

## BR-01

Every physical table must have exactly one record in the database.

Example:

```
Table 1
↓

One database record
```

---

## BR-02

Every table must have a unique table number.

Examples:

```
1
2
3
...
15
```

Customers and staff identify tables using this number.

---

## BR-03

Every table supports QR Ordering.

Each QR code opens the ordering page for that specific table.

Example:

```
Customer scans QR

↓

restaurant.com/order/TBL_A93KD7
```

Instead of storing the full URL, the database stores only a unique QR token.

Benefits:

- Domain can change without updating records.
- QR codes can be regenerated.
- Cleaner database.
- More secure implementation.

---

## BR-04

Each table has a seating capacity.

Examples:

- 2 Seats
- 4 Seats
- 6 Seats
- 8 Seats

This information will later be used for reservations and seating suggestions.

---

## BR-05

Each table always has a current operational status.

Possible statuses:

- AVAILABLE
- OCCUPIED
- RESERVED
- CLEANING

Future versions may include:

- OUT_OF_SERVICE
- MAINTENANCE

---

## BR-06

Tables should never be permanently deleted.

Instead, Soft Delete will be used.

Reason:

Historical orders and reports should continue referencing the original table.

---

## BR-07

Inactive tables remain stored in the database.

Example:

Restaurant renovation

↓

```
isActive = false
```

This prevents accidental data loss.

---

# Relationships

Current Version

```
Table
```

Future Versions

```
Table
│
├── Order
│
├── Reservation
│
└── QR Ordering
```

A single table can have many orders over time.

A single table can have many reservations over time.

---

# Database Fields

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | Yes | Primary Key |
| tableNumber | Integer | Yes | Visible table number |
| capacity | Integer | Yes | Maximum seating capacity |
| qrToken | String | Yes | Unique QR identifier |
| status | Enum | Yes | Current table status |
| notes | String | No | Internal notes |
| isActive | Boolean | Yes | Active / Inactive |
| createdAt | DateTime | Yes | Creation timestamp |
| updatedAt | DateTime | Yes | Last updated timestamp |
| deletedAt | DateTime | No | Soft delete timestamp |

---

# Index Strategy

Indexes should be created for:

## tableNumber

Reason:

Frequently searched by restaurant staff.

---

## status

Reason:

Restaurant dashboard constantly filters by table status.

Examples:

- Available tables
- Occupied tables
- Reserved tables

---

## isActive

Reason:

Inactive tables should normally be hidden from daily operations.

---

# Future Expansion

The model is intentionally designed for future growth.

Possible additions include:

- Restaurant branches
- Indoor / Outdoor zones
- Floor plans
- VIP tables
- Accessibility information
- NFC ordering
- Smart occupancy sensors
- Automatic table assignment

These features can be added without redesigning the current database.

---

# Design Philosophy

This model follows the overall architecture of the Restaurant Operating System.

It is:

- Simple for today's business requirements.
- Flexible for future improvements.
- Easy to maintain.
- Optimized for real restaurant workflows.

The design prioritizes long-term scalability while avoiding unnecessary complexity in the first release.
