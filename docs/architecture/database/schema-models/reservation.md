# Reservation Module

## Overview

The Reservation module allows customers to reserve tables independently of the ordering system.

A reservation does not automatically create an order. When customers arrive, staff may create a new dine-in order if needed.

This separation keeps both modules independent and scalable.

---

# Goals

Support:

- Online reservation
- Phone reservation
- Walk-in reservation
- Future automatic table assignment
- Future reminder notifications
- Future multi-location support

---

# Reservation Workflow

Customer

↓

Choose Date

↓

Choose Time

↓

Choose Number of Guests

↓

Enter Contact Information

↓

Submit Reservation

↓

Reservation Status = PENDING

↓

Restaurant Reviews

↓

CONFIRMED

↓

(Optional Table Assignment)

↓

Customer Arrives

↓

Reservation Completed

---

# Walk-in Flow

Walk-in customer

↓

No reservation required

↓

Create Dine-In Order

---

# Database Fields

| Field | Description |
|---------|-------------|
| id | Primary Key |
| customerName | Customer Name |
| phone | Contact Number |
| email | Optional |
| guestCount | Number of Guests |
| reservationAt | Reservation Date & Time |
| status | Reservation Status |
| source | Reservation Source |
| tableId | Assigned Table (Optional) |
| specialRequest | Customer Notes |
| internalNote | Staff Notes |
| arrivedAt | Arrival Timestamp |
| createdAt | Created Date |
| updatedAt | Updated Date |
| deletedAt | Soft Delete |

---

# Relationships

Reservation

↓

Table (Optional)

Many Reservations

↓

One Table

---

# Business Rules

- Reservation does not create an Order.
- Reservation does not require a User account.
- Table assignment is optional.
- Guest count should not exceed table capacity (application validation).
- Soft delete is used.
- Reservation remains independent from Ordering.

---

# Future Features

- Waitlist
- Auto Table Assignment
- Reminder SMS
- Reminder Email
- Calendar View
- Floor Plan View
- Reservation Deposit
- No-show Analytics
- Multi-location Support