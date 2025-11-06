# 🏫 Hostel Leave Backend

A **Node.js (Express + MongoDB)** backend for a university **hostel leave management system**.
It manages **student leave requests** and an **approval workflow** involving multiple roles:

> **Student → Parent → Assistant Warden → Senior Warden → Security Guard → Admin**

---

## 🚀 Core Workflow

1. **Student** creates a leave/out request.
2. **Assistant Warden/Warden** reviews, refers, or cancels it.
3. **Parent** accepts or denies the request.
4. **Senior Warden** gives final approval or rejection.
5. **Security Guard** records student exit and re-entry.

---

## ✨ Features

* Multi-role access: **Student, Parent, Assistant Warden, Senior Warden, Security Guard, Admin**
* **JWT authentication** with role-based route protection
* **Email notifications** (Nodemailer + EJS templates)
* **File uploads** for profile pictures (Multer)
* **MongoDB (Mongoose)** models for users, requests, hostels, branches, etc.
* Well-structured **REST API** organized by role

---

## 🧩 Tech Stack

| Category         | Technology                 |
| ---------------- | -------------------------- |
| Runtime          | Node.js                    |
| Framework        | Express                    |
| Database         | MongoDB + Mongoose         |
| Auth             | JWT (`jsonwebtoken`)       |
| Emails           | Nodemailer + EJS templates |
| File Uploads     | Multer                     |
| Password Hashing | bcryptjs                   |

---

## 📁 Project Structure

```
app.js             → Express app & route registration
server.js          → Server launcher
config/db.js       → MongoDB connection
routes/            → Route definitions (by role)
controller/        → Business logic
models/            → Mongoose schemas
services/          → Reusable service logic
middleware/        → Auth & file upload middlewares
utils/             → JWT, email, and helper utilities
```

---

## ⚙️ Getting Started

### 1. Prerequisites

* Node.js (v16+)
* npm (bundled with Node.js)
* MongoDB instance (local or cloud)

### 2. Environment Variables

Create a `.env` file in the project root:

```bash
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/hostel-leave
JWT_SECRET=change-this-secret

EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=you@example.com
EMAIL_PASS=yourpassword
EMAIL_FROM="Hostel Leave <noreply@example.com>"
```

| Variable     | Description                                |
| ------------ | ------------------------------------------ |
| `PORT`       | Server port (default: 5000)                |
| `MONGO_URI`  | MongoDB connection string                  |
| `JWT_SECRET` | JWT signing secret                         |
| `EMAIL_*`    | SMTP configuration for email notifications |

---

### 3. Install & Run

```bash
npm install
npm start
```

Server runs at **[http://0.0.0.0:5000](http://0.0.0.0:5000)** (default).
Static uploads served at `/uploads`.

---

## 🔗 API Overview

> **Base path:** `/api`
> All routes are JWT-protected (`Authorization: Bearer <token>`) unless marked **public**.

### 🧑‍💼 Admin (`/api/admin`)

* **POST** `/login/admin` — Admin login (**public**)
* **POST** `/create-warden` / **PUT** `/update-warden/:emp_id` — Manage wardens
* **GET** `/all-wardens` — List all wardens
* **POST** `/create-admin` / **PUT** `/update-admin/:emp_id`
* **GET** `/all-admins`
* **POST** `/create-hostel` / **PUT** `/update-hostel/:hostel_id` / **PUT** `/inactive-hostel/:hostel_id`
* **GET** `/hostel/:hostel_id`
* **POST** `/create-student` / **PUT** `/update-student/:student_enrollment_no`
* **GET** `/student/:student_enrollment_no` / `/all-students` / `/total-students` / `/outstudents`
* **POST** `/create-branch` / **POST** `/update-branch/:branch_id`
* **PUT** `/reset-password` / `/reset-password-by-admin`
* **POST** `/create-security-guard` / **PUT** `/update-security-guard/:emp_id`
* **GET** `/all-security-guards` / `/all-active-requests`

---

### 🏢 Warden (`/api/warden`)

* **POST** `/login/warden` — Warden login (**public**)
* **GET** `/allRequest/:hostelId` — Active requests for hostel
* **GET** `/profile`, `/statistics/:hostelId`, `/requests/:hostelId/:month`, `/allActiveRequests/:hostelId`

---

### 🎓 Student (`/api/student`)

* **POST** `/login` — Student login (**public**)
* **PUT** `/profile` — Update profile (`multipart/form-data: profile_pic`)
* **GET** `/hostel-info`, `/all-hostel-info`, `/all-branches`, `/student-profile`
* **POST** `/create-request` — Create leave request
* **GET** `/requests` — Get all requests by student

---

### 📄 Request (`/api/request`)

* **PUT** `/update-status` — Update request status
* **GET** `/ByStatus/:status`, `/inactive-requests`, `/requests/:status`, `/request/:id`, `/hostel-requests/:hostelId`

---

### 👨‍👩‍👦 Parent (`/api/parent`)

* **POST** `/login` — Parent login (**public**)
* **GET** `/profile`, `/allRequests`, `/student`

---

### 🛡 Security (`/api/security`)

* **POST** `/login` — Security guard login (**public**)
* **GET** `/allRequests/:security_status` — Requests by security status

---

## 🧠 Developer Notes

* Core business logic resides in `/controller` and `/services`.
  Extend these for new workflows or roles.
* Keep credentials (`JWT_SECRET`, SMTP) secure.
* Use **PM2** or **systemd** for production process management.
* Enable **HTTPS** and configure **CORS** for frontend security.
