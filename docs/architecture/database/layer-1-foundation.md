# 🍣 Layer 1 - Foundation Database Design

## Purpose

Layer 1 establishes the core foundation of the Restaurant Operating System.

Without these models, the rest of the application cannot function.

This layer is intentionally small and focuses only on the essential entities required to begin development.

---

# Objectives

This layer introduces:

- User Management
- Menu Categories
- Menu Items

These models will later support:

- Ordering
- Reservations
- Kitchen Display
- Admin Dashboard
- Restaurant Settings

---

# Models Included

## User

Represents authenticated users of the system.

Current Roles:

- OWNER
- KITCHEN

Future:

- CUSTOMER

The restaurant currently has one owner who performs multiple responsibilities, but the system supports future expansion.

Users can:

- Manage menu
- Manage orders
- Manage reservations
- Update restaurant settings

---

## Category

Represents logical menu groupings.

Examples:

- Signature Uramaki
- Nigiri
- Hosomaki
- Rolls
- Temaki
- Chirashi
- Poke
- Sashimi
- Gunkan
- Antipasti
- Bevande
- Salsa
- Dessert
- Combo Box

A category may optionally belong to another category.

Example:

Menu

↓

Sushi

↓

Nigiri

This allows unlimited nesting if the restaurant grows.

---

## MenuItem

Represents every sellable product.

Examples:

- Dragon Roll
- Salmon Nigiri
- Coca Cola
- Mochi Ice Cream

Each Menu Item belongs to exactly one Category.

Menu Items contain only information directly related to the product.

Examples:

- Name
- Description
- Price
- Image
- Preparation Time
- Availability

Food customizations are intentionally excluded from Layer 1 and will be introduced later.

---

# Design Decisions

## UUID Primary Keys

All entities use UUID identifiers.

Reason:

- Production standard
- Better security
- Easier data synchronization
- Avoid predictable IDs

---

## Timestamps

Every model includes:

createdAt

updatedAt

Purpose:

- Audit trail
- Reporting
- Analytics

---

## Soft Delete

Important business entities should never be permanently removed.

Instead of deleting records:

deletedAt

will indicate when an entity was archived.

Benefits:

- Prevent accidental data loss
- Restore deleted items
- Preserve reporting history

---

## Images

Images are never stored inside PostgreSQL.

Only the image URL is stored.

Actual files will live inside Supabase Storage.

---

## Availability

Products are never removed simply because ingredients run out.

Instead:

isAvailable

determines whether customers can currently order the item.

This allows:

- Temporary stock shortages
- Seasonal menus
- Hidden products

---

# Relationships

User

Independent

Category

↓

MenuItem

---

# Layer Completion Criteria

Layer 1 is complete when:

✓ Prisma schema compiles

✓ Database migration succeeds

✓ Prisma Studio opens

✓ Categories can be created

✓ Menu Items can be created

✓ Relationships function correctly

---

# Future Layers

Layer 2

Orders

Order Items

Restaurant Tables

Layer 3

Reservations

Payments

Restaurant Settings

Layer 4

Customization Groups

Customization Options

Coupons

Discounts

Promotions

Loyalty System