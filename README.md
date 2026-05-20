# Smart Leads Dashboard (MERN)

A production-ready Lead Management Dashboard built using the MERN stack for a Software Engineering Internship Assignment.

## Features

### Authentication System
- JWT-based authentication (Access & HttpOnly Refresh Tokens)
- Secure Password Hashing (Bcrypt)
- Role-Based Access Control (Admin vs. Sales User)
- Automatic silent token refresh via Axios interceptors

### Leads Management (CRUD)
- Create, Read, Update, and Delete operations for leads
- Data structure enforces Enums (Status: New, Contacted, Qualified, Lost | Source: Website, Instagram, Referral)
- Complete UI with Modals (Zod + React Hook Form validation)

### Advanced Filtering & Search
- Backend pagination (`skip` and `limit`) with metadata payloads
- Debounced global search across Name and Email
- Concurrent filtering by Status AND Source
- Dynamic Sorting (Latest, Oldest, Name A-Z, Name Z-A)

### DevOps & Export
- **CSV Export:** Memory-efficient stream-based CSV export adhering to applied UI filters.
- **Dockerized:** Full multi-container setup via `docker-compose`.
- **Nginx Reverse Proxy:** Unified routing for frontend (`/`) and backend API (`/api`).

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite, TailwindCSS v4, React Router, TanStack Query, Zustand, Axios.
- **Backend:** Node.js, Express 5, TypeScript, MongoDB, Mongoose, Zod.

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (for local non-docker dev)

### Docker Deployment (Recommended)
The easiest way to run the application is using the provided Docker Compose configuration.

1. Ensure Docker is running.
2. Run the stack:
   ```bash
   docker-compose up --build
   ```
3. Open your browser:
   - Dashboard: [http://localhost](http://localhost)
   - API Base URL: `http://localhost/api/v1`

### Environment Variables
For local execution, the `.env` in the `backend/` directory should look like this (this is handled automatically by `docker-compose.yml` for the docker setup):

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/servicehive
JWT_ACCESS_SECRET=your_super_secret_jwt_access_key_here_32_chars
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key_here_32_chars
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CLIENT_URL=http://localhost:5173
```

## Architecture Notes
- **Frontend:** Employs a feature-based folder structure (`src/components/leads`, `src/hooks`, etc.). Global state is minimal (Zustand for Auth), delegating server state management entirely to TanStack Query for optimal caching and deduplication.
- **Backend:** Employs an N-Tier architecture (`Controller -> Service -> Repository`) separating business logic from data access and HTTP concerns. Includes comprehensive IDOR protection and ID-based resource ownership validation.

## API Documentation

### Authentication (`/api/v1/auth`)
- `POST /register`: Register a new Sales User. Returns JWT and sets HttpOnly refresh cookie.
- `POST /login`: Authenticate existing user. Returns JWT and sets HttpOnly refresh cookie.
- `GET /me`: Retrieve current authenticated user profile. (Requires Bearer Token)
- `POST /refresh`: Silently refresh JWT using the HttpOnly refresh cookie.
- `POST /logout`: Clears the HttpOnly refresh cookie.

### Leads (`/api/v1/leads`)
All Lead endpoints require a valid JWT Bearer token. Sales Users can only access leads assigned to them.
- `POST /`: Create a new lead.
- `GET /`: Retrieve paginated leads. Accepts queries: `page`, `limit`, `search`, `status`, `source`, `sort`.
- `GET /export/csv`: Stream leads to a CSV file. Respects all query filters.
- `GET /:id`: Retrieve a specific lead.
- `PATCH /:id`: Update a lead. (Sales users cannot update `assignedTo`).
- `DELETE /:id`: Delete a lead.

## Security Considerations
- **Authentication**: Uses short-lived Access Tokens in memory/React state, and long-lived Refresh Tokens in strict HttpOnly/Secure cookies.
- **Timing Attacks**: The login endpoint hashes a dummy password if a user is not found to ensure login request times are uniform, preventing email enumeration.
- **IDOR (Insecure Direct Object Reference)**: The Service layer strictly enforces ownership checks. A Sales User attempting to modify another user's Lead ID will receive a 403 Forbidden.
- **Mass Assignment**: Zod `.strict()` is used on all DTOs to strip injected or unauthorized fields before they reach the controller.
- **Data Injection**: Express Mongo Sanitize and XSS Clean middlewares are applied globally.

## Author
Developed for the ServiceHive Internship Assignment.
