# 🍣 Restaurant OS - Database Standards

## Purpose

This document defines the database standards used throughout the project.

Every Prisma model must follow these conventions.

---

# 1. Primary Keys

All models use UUIDs.

Example:

id String @id @default(uuid())

Reason:

- Production standard
- Globally unique
- Better security
- Prevent predictable IDs

---

# 2. Naming Convention

Models:

PascalCase

Examples:

User

MenuItem

RestaurantTable

Reservation

Fields:

camelCase

Examples:

firstName

lastName

imageUrl

createdAt

updatedAt

Enums:

UPPER_SNAKE_CASE

Examples:

ORDER_STATUS

PAYMENT_METHOD

DELIVERY

---

# 3. Timestamps

Every important model includes:

createdAt

updatedAt

Reason:

- Analytics
- Reporting
- Debugging
- Audit history

---

# 4. Soft Delete

Never permanently delete important business data.

Use:

deletedAt DateTime?

Instead of removing data.

---

# 5. Images

Images are stored in Supabase Storage.

Database stores only:

imageUrl

---

# 6. Money

All prices are stored using Decimal.

Never use Float.

Reason:

Financial calculations require precision.

---

# 7. Availability

Products are hidden using:

isAvailable

Never delete products because they are temporarily unavailable.

---

# 8. Relationships

Every relationship should be explicitly defined.

Never rely on implicit behavior.

---

# 9. Nullable Fields

Only make fields optional when the business truly allows missing values.

Avoid unnecessary nullable columns.

---

# 10. Future Scalability

Design every model so future features can be added without breaking existing data.

Examples:

Coupons

Loyalty

Gift Cards

Multiple Restaurants

Multiple Languages

---

# 11. Security

Passwords are never stored directly.

Authentication is handled securely.

---

# 12. Documentation

Every new model must be documented before implementation.

No undocumented database changes.