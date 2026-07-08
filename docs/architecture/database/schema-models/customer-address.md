# Customer Address Module

## Purpose

Allows registered customers to save delivery addresses.

---

## Business Rules

- Customers may save multiple addresses.
- One address may be marked as default.
- Guest checkout does not require an address.
- Orders copy address data at checkout.
- Soft delete is used.

---

## Example

Customer

↓

Addresses

- Home
- Office
- Parents

↓

Checkout

↓

Select Address

↓

Order stores snapshot

---

## Future

- GPS Coordinates
- Delivery Zones
- Distance Calculation
- Google Maps Integration
- Saved Location Names
- Apartment Access Codes