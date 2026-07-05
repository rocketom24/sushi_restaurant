# Database Design

## 1. Category

### Purpose
The `Category` table represents the main sections of the restaurant menu.

### Examples
- Sushi
- Antipasto
- Bevande
- Salsa
- Dessert
- Combo Box

### Fields

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | ✅ | Primary Key |
| name | String | ✅ | Category name (e.g., Sushi) |
| slug | String | ✅ | URL-friendly name (e.g., sushi) |
| imageUrl | String | ❌ | Optional category image |
| displayOrder | Int | ✅ | Controls display order in the menu |
| isActive | Boolean | ✅ | Hide/show category without deleting |
| createdAt | DateTime | ✅ | Record creation timestamp |
| updatedAt | DateTime | ✅ | Record update timestamp |

### Relationships

Category (1)
↓
SubCategory (Many)

Category (1)
↓
MenuItem (Many)

### Notes

- Categories should never be permanently deleted.
- Use `isActive = false` to hide a category.
- Categories are displayed based on `displayOrder`.
- `slug` should be unique.
- Images are optional and stored as URLs (not uploaded directly into the database).

---

## 2. SubCategory

### Purpose

The `SubCategory` table organizes menu items inside a parent category.

Example:

Sushi
- Uramaki
- Nigiri
- Hosomaki
- Roll
- Temaki
- Poke
- Chirashi
- Sashimi
- Gunkan
- Signature
- Mixed
- Contorni

### Fields

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | ✅ | Primary Key |
| categoryId | UUID | ✅ | Foreign Key → Category |
| name | String | ✅ | Subcategory name |
| slug | String | ✅ | URL-friendly name |
| displayOrder | Int | ✅ | Display order within category |
| isActive | Boolean | ✅ | Hide/show subcategory |
| createdAt | DateTime | ✅ | Record creation timestamp |
| updatedAt | DateTime | ✅ | Record update timestamp |

### Relationships

Category (1)
↓
SubCategory (Many)

SubCategory (1)
↓
MenuItem (Many)

### Notes

- A subcategory always belongs to one category.
- Not every category requires subcategories.
- `slug` should be unique.
- Use `displayOrder` instead of alphabetical sorting.

---

## 3. MenuItem

### Purpose

The `MenuItem` table stores every food and beverage item offered by the restaurant.

### Examples

- Salmon Nigiri
- California Roll
- Coca-Cola
- Mochi Ice Cream
- Soy Sauce

### Fields

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | ✅ | Primary Key |
| name | String | ✅ | Menu item name |
| slug | String | ✅ | URL-friendly name |
| description | String | ✅ | Item description |
| imageUrl | String | ❌ | Image URL |
| price | Decimal | ✅ | Item price (€) |
| categoryId | UUID | ✅ | Foreign Key → Category |
| subCategoryId | UUID | ❌ | Foreign Key → SubCategory |
| displayOrder | Int | ✅ | Controls display order |
| isFeatured | Boolean | ✅ | Featured item on homepage |
| isAvailable | Boolean | ✅ | Available for ordering |
| preparationTime | Int | ❌ | Estimated preparation time (minutes) |
| createdAt | DateTime | ✅ | Record creation timestamp |
| updatedAt | DateTime | ✅ | Record update timestamp |

### Relationships

Category (1)
↓
MenuItem (Many)

SubCategory (1)
↓
MenuItem (Many)

MenuItem (1)
↓
OrderItem (Many)

### Notes

- Store image URLs instead of image files.
- Use Decimal for prices.
- Menu items should never be permanently deleted.
- Use `isAvailable = false` for temporarily unavailable items.
- Use `isFeatured = true` to highlight items on the homepage.
- `subCategoryId` is optional because some categories (e.g., Dessert, Salsa) may not need subcategories.
- `slug` should be unique.

---

## Current Category Structure

### Sushi
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

### Antipasto
- Gyoza

### Bevande

### Salsa

### Dessert
- Mochi Ice Cream

### Combo Box

---

## Design Decisions

- UUID will be used as the primary key for all tables.
- Prices will use the Decimal type.
- Images will be stored externally (Cloudinary or Vercel Blob) and only image URLs will be stored in the database.
- Categories and menu items will use soft deletion (`isActive` / `isAvailable`) instead of permanent deletion.
- `displayOrder` will control the menu order instead of alphabetical sorting.
- The database should be designed for future expansion, including menu item variants, allergens, tags, and customization options without requiring major structural changes.