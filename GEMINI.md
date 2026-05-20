# Smart Leads Dashboard - Project Instructions

## Project Context
This is a full-stack MERN Lead Management Dashboard for a Software Engineering Internship Assignment.

## Strict Technical Constraints (MANDATORY)
1. **TypeScript Only**: Plain JavaScript submissions are grounds for automatic rejection. Proper TypeScript usage is mandatory across the stack.
2. **Strict Typing**: Interfaces/types MUST be properly defined. Usage of `any` must be minimized and strictly justified in comments where necessary. No missing interfaces/types.
3. **Architecture**: Must follow clean architecture and scalable code practices.
4. **Code Quality**: No hardcoded values or URLs. Code must be highly reusable. Avoid extremely large components. No copied/template-style code.
5. **UI/UX Standard**: Must handle Loading States, Empty States, and Error Handling UI gracefully. Form validation is mandatory.

## Tech Stack
* **Frontend**: React.js, TypeScript, TailwindCSS
* **Backend**: Node.js, Express.js, TypeScript, MongoDB, Mongoose

## Core Features to Implement
### 1. Authentication System
* JWT-based auth (User Registration, Login, Protected Routes).
* Password hashing using `bcrypt`.
* **RBAC**: Admin and Sales User roles.

### 2. Leads Management (CRUD)
* **Fields**: Name, Email, Status (New, Contacted, Qualified, Lost), Source (Website, Instagram, Referral), Created At.
* **Functionalities**: Create, Update, Delete, List, View Single Lead.

### 3. Advanced Filtering & Search (Critical)
* Filter by Status AND Source.
* Search by Name or Email.
* Sort by Latest/Oldest.
* *Note: Multiple filters must work concurrently.*
* **Mandatory**: Debounced Search.

### 4. Pagination
* Backend pagination mandatory using `skip` and `limit`.
* 10 records per page.
* API response must include pagination metadata (total pages, current page, etc.).

### 5. Frontend UI
* Responsive design with reusable components.
* Proper folder structure.

### 6. Additional Mandatory Features
* **CSV Export**: Export filtered/paginated data to CSV.
* **Docker Setup**: Containerized environment for easy setup.
* **Bonus**: Dark Mode Support.

## API Standards
* RESTful API structure with proper status codes.
* Centralized error handling.
* Request validation (e.g., using Zod).
* Clean, consistent response formats.
