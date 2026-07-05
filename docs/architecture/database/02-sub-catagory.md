# SubCategory

## Purpose

The `SubCategory` table organizes menu items within a parent category.

Examples:

Category: Sushi

Subcategories:
- Signature
- Uramaki
- Mixed
- Nigiri
- Hosomaki
- Roll
- Temaki
- Chirashi
- Poke
- Sashimi
- Gunkan
- Contorni

Not every category requires subcategories. For example:

- Bevande
- Salsa
- Combo Box

can directly contain menu items.

---

## Fields

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | ✅ | Primary Key |
| categoryId | UUID | ✅ | Foreign Key → Category |
| name | String | ✅ | Subcategory name |
| slug | String | ✅ | URL-friendly unique name |
| description | String | ❌ | Optional description |
| displayOrder | Int | ✅ | Display order |
| isActive | Boolean | ✅ | Active / Hidden |
| createdAt | DateTime | ✅ | Auto generated |
| updatedAt | DateTime | ✅ | Auto generated |

---

## Relationships

Category (1)
↓

SubCategory (Many)

SubCategory (1)
↓

MenuItem (Many)

---

## Business Rules

- Every subcategory belongs to one category.
- Display order controls the UI.
- Soft delete using `isActive`.
- Never permanently delete records.
- Slug must be unique.

---

## Example

Category

Sushi

↓

SubCategory

Uramaki

↓

Menu Item

California Roll