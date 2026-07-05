# MenuItem

## Purpose

The `MenuItem` table stores every food and beverage item available in the restaurant.

Examples

- California Roll
- Salmon Nigiri
- Dragon Roll
- Coca-Cola
- Soy Sauce
- Mochi Ice Cream

---

## Fields

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | ✅ | Primary Key |
| categoryId | UUID | ✅ | Foreign Key → Category |
| subCategoryId | UUID | ❌ | Foreign Key → SubCategory |
| name | String | ✅ | Menu item name |
| slug | String | ✅ | URL-friendly unique name |
| description | String | ❌ | Item description |
| imageUrl | String | ❌ | Food image URL |
| price | Decimal | ✅ | Item price |
| preparationTime | Int | ❌ | Estimated preparation time (minutes) |
| isFeatured | Boolean | ✅ | Show on homepage |
| isAvailable | Boolean | ✅ | Available for ordering |
| displayOrder | Int | ✅ | Controls UI order |
| createdAt | DateTime | ✅ | Auto generated |
| updatedAt | DateTime | ✅ | Auto generated |

---

## Relationships

Category (1)
↓

MenuItem (Many)

SubCategory (1)
↓

MenuItem (Many)

MenuItem (1)
↓

OrderItem (Many)

---

## Business Rules

- Every menu item belongs to one category.
- A subcategory is optional.
- Images are stored in cloud storage.
- Only image URLs are stored in the database.
- Prices use Decimal.
- Items should never be deleted.
- Hide unavailable items using `isAvailable`.
- Featured items appear on the homepage.
- Display order controls menu layout.

---

## Example

Category

Sushi

↓

SubCategory

Nigiri

↓

Menu Item

Salmon Nigiri

Price

€6.50

Preparation Time

10 Minutes