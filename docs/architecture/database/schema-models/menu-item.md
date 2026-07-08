# Menu Customization Module

## Purpose

The Menu Customization module allows customers to personalize menu items before placing an order.

It supports required and optional choices while keeping the menu catalog as the single source of truth.

---

## Restaurant Menu

### Categories

- Signature Sushi
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
- Combo Box
- Contorni
- Antipasto
- Salsa
- Bevande
- Dessert

---

## Example Customizations

### Signature Sushi

Required

- Portion
    - 6 Pieces
    - 8 Pieces

Optional

- Spice Level
    - Mild
    - Medium
    - Hot

Optional

- Sauce
    - Spicy Mayo
    - Teriyaki
    - Eel Sauce

---

### Poke

Required

- Rice
    - White
    - Brown

Optional

- Sauce

Optional

- Extra Avocado

---

### Combo Box

Optional

- Extra Nigiri

- Extra Gyoza

- Extra Mochi Ice Cream

---

## Business Rules

- A MenuItem may have zero or more customization groups.
- A customization group belongs to one MenuItem.
- A customization option belongs to one customization group.
- A customization option may reference another MenuItem.
- Groups may be required or optional.
- Groups may allow single or multiple selections.
- Customer selections are copied into the order to preserve history.
- Menu changes never modify historical orders.

