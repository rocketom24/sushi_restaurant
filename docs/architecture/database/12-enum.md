# Database Enums

Enums define fixed values shared across the entire application.

Using enums prevents spelling mistakes, improves consistency, and makes the database easier to maintain.

---

# UserRole

Defines user permissions within the system.

```ts
enum UserRole {
  ADMIN
  CUSTOMER
  KITCHEN
}
```

## Description

### ADMIN

- Full access to the system
- Manage menu
- Manage orders
- Manage reservations
- Manage restaurant settings
- Manage payments
- Access reports and dashboard

### CUSTOMER

- Reserved for future customer accounts
- View order history
- Save addresses
- Save favorite items
- Loyalty program (future)

> **MVP:** Customers can place orders as guests without logging in.

### KITCHEN

- View incoming orders
- Update kitchen status
- Mark items as preparing or ready
- Cannot access admin settings or restaurant configuration

---

# FulfillmentType

Defines how the customer receives the order.

```ts
enum FulfillmentType {
  DINE_IN
  DELIVERY
  PICKUP
}
```

---

# OrderSource

Defines where the order originated.

```ts
enum OrderSource {
  WEBSITE
  TABLE_QR
  PHONE
  ADMIN
}
```

## Examples

### Delivery Order

Source:
WEBSITE

Fulfillment:
DELIVERY

---

### Pickup Order

Source:
WEBSITE

Fulfillment:
PICKUP

---

### Table Order

Source:
TABLE_QR

Fulfillment:
DINE_IN

---

### Phone Order

Source:
PHONE

Fulfillment:
DELIVERY

---

### Admin Order

Source:
ADMIN

Fulfillment:
DINE_IN / DELIVERY / PICKUP

---

# OrderStatus

Tracks the overall order progress.

```ts
enum OrderStatus {
  NEW
  ACCEPTED
  PREPARING
  READY
  COMPLETED
  CANCELLED
}
```

## Workflow

NEW

↓

ACCEPTED

↓

PREPARING

↓

READY

↓

COMPLETED

---

# KitchenItemStatus

Tracks the preparation status of each individual menu item.

```ts
enum KitchenItemStatus {
  NEW
  PREPARING
  READY
  SERVED
}
```

---

# ReservationStatus

Tracks the reservation lifecycle.

```ts
enum ReservationStatus {
  PENDING
  CONFIRMED
  SEATED
  COMPLETED
  CANCELLED
  NO_SHOW
}
```

---

# PaymentMethod

```ts
enum PaymentMethod {
  STRIPE
  CASH
  CARD
}
```

---

# PaymentStatus

```ts
enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}
```

---

# TableStatus

Tracks the current availability of a restaurant table.

```ts
enum TableStatus {
  AVAILABLE
  OCCUPIED
  RESERVED
  OUT_OF_SERVICE
}
```

---

# RestaurantStatus

Tracks whether the restaurant is currently accepting orders.

```ts
enum RestaurantStatus {
  OPEN
  CLOSED
}
```

---

# DayOfWeek

Used for restaurant opening hours.

```ts
enum DayOfWeek {
  MONDAY
  TUESDAY
  WEDNESDAY
  THURSDAY
  FRIDAY
  SATURDAY
  SUNDAY
}
```