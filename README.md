# Hostel Leave Backend

A Node.js (Express + MongoDB) backend for a university hostel leave management system. This API handles student leave requests and the approval workflow across multiple roles: Student, Parent, Assistant Warden, Senior Warden, Security Guard, and Admin.

The core workflow:

- Student creates a leave/out request.
- Assistant Warden (or Warden) may refer/cancel the request.
- Parent receives request and can accept/deny it.
- Senior Warden approves or rejects the final request.
- Security Gate signs the student out/in when they leave or return.

This repository implements role-based endpoints, JWT authentication, email notifications, file uploads (profile pictures), and MongoDB persistence using Mongoose.

## Features

- Multi-role workflow: Student, Parent, Assistant Warden, Senior Warden, Security Guard, Admin
- JWT-based authentication and middleware-protected routes
- Email notifications (Nodemailer + EJS templates)
- File uploads for profile pictures (Multer)
- MongoDB (Mongoose) models for users, requests, hostels, branches, etc.
- Simple, opinionated REST API organized by role

## Tech stack

- Node.js
- Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Nodemailer + EJS (email templates)
- Multer (file upload)
- bcryptjs (password hashing)

## Project structure (selected)

- `app.js` — Express app and route registration
- `server.js` — server launcher
- `config/db.js` — MongoDB connection
- `routes/` — route definitions per role
- `controller/` — route handlers (business logic)
- `models/` — Mongoose schemas
- `services/` — reusable service logic
- `middleware/` — auth, upload middlewares
- `utils/` — jwt, email and helper utilities

## Getting started

### Prerequisites

- Node.js (v16+ recommended)
- npm (bundled with Node.js)
- MongoDB instance (URI)

### Environment variables

Create a `.env` file in the project root with at least the following variables:

- `PORT` — (optional) server port, default 5000
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret used to sign JWTs
- `EMAIL_HOST` — SMTP host (for sending emails)
- `EMAIL_PORT` — SMTP port
- `EMAIL_SECURE` — `true` when using TLS/SSL (465), otherwise `false`
- `EMAIL_USER` — SMTP username
- `EMAIL_PASS` — SMTP password
- `EMAIL_FROM` — Sender address shown in outgoing mail

Example `.env` snippet:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/hostel-leave
JWT_SECRET=change-this-secret
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=you@example.com
EMAIL_PASS=yourpassword
EMAIL_FROM=Hostel Leave <noreply@example.com>
```

### Install & run

1. Install dependencies

```
npm install
```

2. Start the server

```
npm start
```

3. The app listens on `http://0.0.0.0:PORT` (default `5000`).

Static uploaded files are served from the `/uploads` directory at `/uploads`.

## API overview

Base path: `/api`

All endpoints listed below are protected by JWT (`Authorization: Bearer <token>`) unless noted otherwise.

- Admin (`/api/admin`)
	- POST `/create-warden` (auth) — Create a warden
	- PUT `/update-warden/:emp_id` (auth) — Update warden by employee ID
	- GET `/all-wardens` (auth) — List wardens
	- POST `/create-admin` (auth)
	- PUT `/update-admin/:emp_id` (auth)
	- GET `/all-admins` (auth)
	- POST `/create-hostel` (auth)
	- PUT `/update-hostel/:hostel_id` (auth)
	- PUT `/inactive-hostel/:hostel_id` (auth)
	- GET `/hostel/:hostel_id` (auth)
	- POST `/create-student` (auth)
	- PUT `/update-student/:student_enrollment_no` (auth)
	- GET `/student/:student_enrollment_no` (auth)
	- GET `/total-students` (auth)
	- GET `/outstudents` (auth)
	- GET `/all-students` (auth) — includes parent data
	- POST `/login/admin` — Admin login (public)
	- POST `/create-branch` (auth)
	- POST `/update-branch/:branch_id` (auth)
	- PUT `/reset-password` (auth)
	- POST `/create-security-guard` (auth)
	- PUT `/update-security-guard/:emp_id` (auth)
	- GET `/all-security-guards` (auth)
	- GET `/all-active-requests` (auth)
	- PUT `/reset-password-by-admin` (auth)

- Warden (`/api/warden`)
	- POST `/login/warden` — Warden login (public)
	- GET `/allRequest/:hostelId` (auth) — get active requests for a hostel
	- GET `/profile` (auth)
	- GET `/requests/:hostelId/:month` (auth)
	- GET `/statistics/:hostelId` (auth)
	- GET `/allActiveRequests/:hostelId` (auth)

- Student (`/api/student`)
	- POST `/login` — Student login (public)
	- PUT `/profile` (auth) — Update profile (multipart: `profile_pic`)
	- GET `/hostel-info` (auth)
	- GET `/all-hostel-info` (auth)
	- GET `/all-branches` (auth)
	- GET `/student-profile` (auth)
	- POST `/create-request` (auth) — Create a leave request
	- GET `/requests` (auth) — Get all requests by student

- Request (`/api/request`)
	- PUT `/update-status` (auth) — Update status of a request
	- GET `/ByStatus/:status` (auth)
	- GET `/inactive-requests` (auth)
	- GET `/requests/:status` (auth) — by student enrollment no & status
	- GET `/request/:id` (auth)
	- GET `/hostel-requests/:hostelId` (auth)

- Parent (`/api/parent`)
	- POST `/login` — Parent login (public)
	- GET `/profile` (auth)
	- GET `/allRequests` (auth) — requests for the parent's student
	- GET `/student` (auth) — student info by enrollment

- Security (`/api/security`)
	- POST `/login` — Security guard login (public)
	- GET `/allRequests/:security_status` (auth)

Notes:
- The code organizes business logic in `controller/*` and `services/*`. Use those modules when extending the API.

## Environment & deployment notes

- Keep `JWT_SECRET` and SMTP credentials secret.
- In production, use a proper process manager (PM2, systemd) and secure environment variables through your hosting provider.
- Consider enabling HTTPS and CORS policies for the frontend domain.
