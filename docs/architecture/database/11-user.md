# AdminUser

## Purpose

Stores administrator accounts that can access the Admin Dashboard.

---

## Fields

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | ✅ | Primary Key |
| firstName | String | ✅ | First name |
| lastName | String | ✅ | Last name |
| email | String | ✅ | Login email |
| password | String | ✅ | Hashed password |
| role | Enum | ✅ | ADMIN, MANAGER |
| isActive | Boolean | ✅ | Account status |
| lastLogin | DateTime | ❌ | Last login time |
| createdAt | DateTime | ✅ | Auto generated |
| updatedAt | DateTime | ✅ | Auto generated |

---

## Business Rules

- Passwords must always be hashed.
- Emails must be unique.
- Inactive users cannot log in.
- Roles determine access permissions.