# 🍣 Sushi Restaurant OS - System Workflow

## Project Vision

This system is designed to automate the daily operations of the restaurant as much as possible. The owner should be able to manage the restaurant with minimal manual work through one centralized platform.

---

# User Types

## Customer

Customers can:

- Browse the menu
- Customize food
- Place Delivery orders
- Place Takeaway orders
- Order from a restaurant table
- Reserve a table
- Track order status

---

## Owner (Admin)

The owner can:

- Manage menu items
- Manage categories
- Manage food customization options
- Manage orders
- View kitchen queue
- Manage reservations
- Manage restaurant settings
- View dashboard
- Mark items as unavailable
- View payments

---

## Kitchen

Kitchen staff (currently the owner) can:

- View incoming orders
- Start preparing
- Mark orders ready
- Complete orders

---

# Order Types

The system supports three order types.

## 1. Dine-In

Customer sits at a restaurant table.

Customer scans a QR code or uses the restaurant tablet.

Workflow:

Choose Table

↓

Browse Menu

↓

Customize Food

↓

Add to Cart

↓

Place Order

↓

Kitchen Receives Order

↓

Food Served

↓

Payment Completed

---

## 2. Takeaway

Customer orders online for pickup.

Workflow:

Browse Menu

↓

Customize Food

↓

Choose Pickup Time

↓

Checkout

↓

Kitchen Receives Order

↓

Food Ready

↓

Customer Picks Up

↓

Payment Completed

---

## 3. Delivery

Customer orders from home.

Workflow:

Browse Menu

↓

Customize Food

↓

Delivery Address

↓

Checkout

↓

Kitchen Receives Order

↓

Preparing

↓

Out For Delivery

↓

Delivered

---

# Universal Order Flow

Every order follows the same lifecycle.

NEW

↓

CONFIRMED

↓

PREPARING

↓

READY

↓

COMPLETED

Cancelled orders can exit the workflow at any stage before completion.

---

# Kitchen Display Workflow

Kitchen dashboard displays:

New Orders

Preparing Orders

Ready Orders

Completed Orders

Each order shows:

- Order Token
- Order Type
- Table Number OR Delivery Information
- Ordered Items
- Food Customizations
- Order Time
- Estimated Completion Time

---

# Reservation Workflow

Customer submits reservation.

Reservation starts as:

Pending

Owner can:

Confirm

or

Reject

Confirmed reservations appear on the dashboard.

---

# Payment Workflow

Supported payment methods:

- Online Payment (Stripe)
- Cash (Restaurant)
- Card (Restaurant POS)

Payment Status:

Pending

↓

Paid

or

Failed

↓

Refunded (optional future feature)

---

# Food Customization

Menu items can support customizable options.

Examples:

- Spice Level
- Extra Sauce
- No Wasabi
- Extra Ginger
- Extra Cheese
- Add Avocado
- Remove Ingredients

Customization options are configurable from the Admin Panel.

---

# Restaurant Settings

Owner can manage:

- Restaurant Name
- Logo
- Address
- Phone Number
- Opening Hours
- Delivery Availability
- Takeaway Availability
- Reservation Availability
- Tax Rate
- Service Charge
- Currency
- Social Links

---

# Future Features

- Customer Accounts
- Loyalty Program
- Reviews & Ratings
- Driver Tracking
- Push Notifications
- Multi-language
- Analytics Dashboard
- AI Sales Reports