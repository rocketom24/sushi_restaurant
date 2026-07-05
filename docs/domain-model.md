# 🍣 Sushi Restaurant OS - Domain Model

## Core Entities

The Restaurant OS is built around the following core entities.

---

# 1. User

Represents authenticated users of the system.

Roles:

- OWNER
- KITCHEN
- CUSTOMER (Future)

Relationships:

- Can manage menu
- Can manage reservations
- Can manage orders

---

# 2. Category

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

Relationships:

- Has many Menu Items

---

# 3. Menu Item

Represents a food or drink.

Properties:

- Name
- Description
- Price
- Image
- Availability
- Preparation Time

Relationships:

- Belongs to one Category
- Has many Customization Options
- Can appear in many Orders

---

# 4. Customization Option

Examples:

- Spice Level
- Extra Sauce
- Extra Ginger
- No Wasabi
- Extra Cheese
- Add Avocado

Relationships:

- Belongs to Menu Item

---

# 5. Order

Represents one customer order.

Types:

- DINE_IN
- TAKEAWAY
- DELIVERY

Relationships:

- Has many Order Items
- Has one Payment
- May belong to one Table
- May belong to one Reservation

---

# 6. Order Item

Represents one item inside an order.

Relationships:

- Belongs to Order
- References Menu Item
- Stores selected Customizations

---

# 7. Table

Represents restaurant tables.

Properties:

- Table Number
- QR Code
- Status

Relationships:

- Has many Orders
- Has many Reservations

---

# 8. Reservation

Represents table reservations.

Relationships:

- May belong to one Table
- Can create one Dine-In Order later

---

# 9. Payment

Represents payment information.

Relationships:

- Belongs to one Order

---

# 10. Restaurant Settings

Stores restaurant configuration.

Examples:

- Opening Hours
- Delivery Enabled
- Takeaway Enabled
- Reservation Enabled
- Tax Rate
- Currency

---

## Entity Relationships

Category

↓

Menu Item

↓

Customization Option

↓

Order Item

↓

Order

↓

Payment

---

Table

↓

Reservation

↓

Order