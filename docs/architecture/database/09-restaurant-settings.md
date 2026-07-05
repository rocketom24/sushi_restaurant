# RestaurantSettings

## Purpose

Stores all restaurant-wide configuration and business information.

The application should always read restaurant information from this table instead of hardcoding values.

Only one record should exist.

---

## Fields

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | ✅ | Primary Key |
| restaurantName | String | ✅ | Restaurant name |
| logoUrl | String | ❌ | Restaurant logo |
| phone | String | ✅ | Contact number |
| email | String | ❌ | Contact email |
| address | String | ✅ | Restaurant address |
| city | String | ✅ | City |
| country | String | ✅ | Country |
| postalCode | String | ❌ | ZIP / Postal Code |
| currency | String | ✅ | EUR |
| timezone | String | ✅ | Europe/Rome |
| taxRate | Decimal | ❌ | VAT percentage |
| deliveryFee | Decimal | ❌ | Standard delivery fee |
| minimumDeliveryAmount | Decimal | ❌ | Minimum order for delivery |
| reservationEnabled | Boolean | ✅ | Enable/Disable reservations |
| deliveryEnabled | Boolean | ✅ | Enable/Disable delivery |
| pickupEnabled | Boolean | ✅ | Enable/Disable pickup |
| dineInEnabled | Boolean | ✅ | Enable/Disable dine-in |
| isRestaurantOpen | Boolean | ✅ | Open/Closed status |
| createdAt | DateTime | ✅ | Auto generated |
| updatedAt | DateTime | ✅ | Auto generated |

---

## Business Rules

- Only one RestaurantSettings record should exist.
- Admin users can update these settings.
- The website should always read values from this table.
- Never hardcode restaurant information.

---

## Future Expansion

- Instagram URL
- Facebook URL
- WhatsApp Number
- TikTok URL
- Opening Hours
- Holiday Schedule
- Restaurant Banner
- Theme Color
- SEO Settings