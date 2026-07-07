# Order Model Documentation

---

# Purpose

The **Order** model represents a customer's order placed through the Restaurant Operating System.

An order is the central entity that connects customers, tables, menu items, kitchen operations, and payments.

Every purchase made through the system creates exactly one Order.

---

# Supported Order Types

The Restaurant Operating System supports three ordering methods.

## 1. Dine-In

Customer scans the QR code located on the table or uses the restaurant tablet.

```
Customer
    ↓
Table
    ↓
Menu
    ↓
Order
```

---

## 2. Takeaway

Customer orders food for pickup.

The customer may:

- Order before arriving.
- Order while sitting inside the restaurant.
- Order directly from the counter using the website.

```
Customer
    ↓
Website
    ↓
Order
    ↓
Pickup
```

---

## 3. Delivery

Customer places an order from home.

```
Customer
    ↓
Website
    ↓
Delivery Address
    ↓
Order
```

---

# Business Objectives

The Order model allows the system to:

- Accept customer orders.
- Support dine-in, takeaway, and delivery.
- Track the complete order lifecycle.
- Send orders to the kitchen display.
- Connect payments.
- Calculate totals.
- Store order history.
- Generate reports and analytics.

---

# Business Rules

## BR-01

Every purchase creates exactly one Order.

Example

```
Customer orders food

↓

One Order
```

---

## BR-02

An Order must belong to one Order Type.

Possible values

- DINE_IN
- TAKEAWAY
- DELIVERY

---

## BR-03

Each Order has one current status.

Possible statuses

- NEW
- CONFIRMED
- PREPARING
- READY
- COMPLETED
- CANCELLED

Only one status can exist at a time.

---

## BR-04

An Order does not directly store food items.

Food belongs to the OrderItem model.

Relationship

```
Order

↓

Order Items

↓

Menu Items
```

This keeps the database normalized.

---

## BR-05

Orders may optionally belong to a registered customer.

Guest ordering is supported.

```
Registered User

or

Guest Customer
```

---

## BR-06

Only Dine-In orders are linked to restaurant tables.

Examples

```
DINE_IN

↓

Table 8
```

Takeaway and Delivery orders do not require a table.

---

## BR-07

Delivery orders require a delivery address.

Dine-In and Takeaway orders do not.

---

## BR-08

Each Order may later receive one or more payments.

Example

```
Order

↓

Payment
```

Future versions may support split payments.

---

## BR-09

Kitchen Display always receives orders from this model.

Kitchen staff never read Menu Items directly.

Flow

```
Order

↓

Kitchen Queue

↓

Preparation
```

---

# Relationships

Current

```
Order
```

Future

```
Order
│
├── User (optional)
├── Table (optional)
├── OrderItem
├── Payment
├── CustomerAddress
├── Discount
└── Review
```

---

# Expected Database Fields

| Field | Description |
|--------|-------------|
| id | Primary Key |
| orderNumber | Human-readable order number |
| userId | Optional registered customer |
| tableId | Optional for dine-in |
| orderType | Dine-In / Takeaway / Delivery |
| status | Current order status |
| subtotal | Food total before discounts |
| discountAmount | Applied discount |
| taxAmount | Tax amount |
| serviceCharge | Optional service fee |
| totalAmount | Final payable amount |
| notes | Customer instructions |
| createdAt | Creation timestamp |
| updatedAt | Last update timestamp |
| deletedAt | Soft delete timestamp |

---

# Index Strategy

Indexes should be created for:

## status

Kitchen Dashboard

```
NEW

PREPARING

READY
```

---

## orderType

Restaurant reports

```
Delivery

Takeaway

Dine-In
```

---

## tableId

Quick lookup of active table orders.

---

## createdAt

Daily sales

Weekly reports

Monthly reports

---

# Future Expansion

The Order model is intentionally designed for future growth.

Possible additions include:

- Coupon support
- Loyalty rewards
- Gift cards
- Scheduled orders
- Delivery tracking
- Multiple payments
- Split bills
- Kitchen timing analytics
- AI sales prediction

---

# Design Philosophy

The Order model represents the business transaction itself.

It intentionally does **not** store menu items directly.

Instead, it acts as the parent entity for:

- Order Items
- Payments
- Discounts
- Reviews

This design follows standard relational database principles, improves scalability, and keeps the Restaurant Operating System flexible for future enhancements.