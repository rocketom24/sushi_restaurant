# Restaurant Business Rules

## 1. Order Types

The restaurant supports three order types:

- Dine-in
- Delivery
- Pickup

---

## 2. Dine-in Orders

- Customers must be physically present in the restaurant.
- Every table has its own QR code.
- Scanning the QR code opens the table ordering page.
- The table number is automatically detected.
- Customers browse the menu, add items to the cart, and place the order.
- Orders are sent directly to the kitchen.

---

## 3. Delivery Orders

Customers can:

- Browse the menu online
- Add items to the cart
- Enter delivery information
- Pay online
- Schedule delivery for a future date and time

Delivery orders require:

- Customer Name
- Phone Number
- Delivery Address

---

## 4. Pickup Orders

Customers can:

- Order online
- Choose a pickup date and time
- Pay online
- Collect the order at the restaurant

Pickup orders require:

- Customer Name
- Phone Number

No delivery address is required.

---

## 5. Phone Orders

Customers can call the restaurant directly.

The website provides a "Call Now" button.

Phone orders are created manually by the restaurant staff in the Admin Panel.

---

## 6. Reservation System

Customers can reserve a table online.

Reservation information includes:

- Name
- Phone Number
- Date
- Time
- Number of Guests
- Optional Notes

Reservations are reviewed by restaurant staff.

Reservation statuses:

- Pending
- Confirmed
- Cancelled
- Completed

---

## 7. Payments

Online orders use Stripe.

Payment methods may include:

- Card
- Apple Pay
- Google Pay

Phone orders and dine-in orders may also support cash or card payment at the restaurant.

---

## 8. Kitchen Workflow

Every new order appears in the Kitchen Dashboard.

Kitchen statuses:

NEW
↓

ACCEPTED
↓

PREPARING
↓

READY
↓

COMPLETED

Cancelled orders are handled separately.

---

## 9. Future Expansion

The system should support future features without requiring major database changes.

Possible future features:

- Customer accounts
- Menu item customization
- Loyalty program
- Coupons
- Reviews
- Multi-language support