# User Model

## Purpose

Represents authenticated users of the Restaurant Operating System.

Initially the restaurant has:

- One Owner
- Optional Kitchen Staff

Customer accounts are planned for a future release.

---

## Responsibilities

Users can:

- Log in
- Access dashboards
- Manage restaurant operations
- Perform actions based on their role

---

## Fields

### id

Unique UUID.

Primary Key.

---

### name

Full name.

Example:

Mario Rossi

---

### email

Unique login email.

Used for authentication.

---

### password

Stores hashed password only.

Never plain text.

---

### role

Uses UserRole enum.

Possible values:

OWNER

KITCHEN

CUSTOMER

---

### createdAt

Account creation timestamp.

---

### updatedAt

Automatically updated whenever the user changes.

---

## Future Fields

These may be added later:

Phone Number

Profile Picture

Language Preference

Last Login

Two Factor Authentication

Notification Preferences

---

## Relationships

Currently none.

Relationships will be added in later layers if required.