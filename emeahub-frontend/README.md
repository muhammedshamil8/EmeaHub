# EMEA Hub – Frontend

EMEA Hub is a digital resource management platform built for academic institutions.  
This frontend application provides role-based access for Students, Teachers, and Admins to manage and access educational resources efficiently.

---

## 🚀 Overview

The platform allows:

- Students to browse and download study materials
- Teachers to upload and verify resources
- Admins to manage system-level controls
- Department-wise and subject-wise resource organization
- Timetable viewing and management
- Role-based dashboards

This frontend communicates with the EMEA Hub REST API built using Laravel + Sanctum authentication.

---

## 🏗️ Tech Stack

- React.js
- React Router
- Axios
- Tailwind CSS / Ant Design (based on usage)
- Context API / Redux (if used)
- Supabase / Local storage (if used for caching)

---

## 🔐 Authentication

Authentication is handled using token-based authentication.

Flow:
1. User logs in
2. Backend returns access token
3. Token is stored securely (localStorage / cookies)
4. Token is attached in Authorization header for protected routes

Example header:
```
Authorization: Bearer YOUR_TOKEN
```


---

## 👥 User Roles

### Student
- View dashboard
- Browse resources
- Download materials
- View timetable

### Teacher
- Upload resources
- View own uploads
- Verify pending resources
- Manage timetable
- Access teacher dashboard

### Admin
- Access admin dashboard
- System-level monitoring

---

## 📁 Project Structure
```
src/
│
├── components/
├── pages/
├── routes/
├── services/ (API calls)
├── context/ or store/
└── utils/
```

---

## 🌐 API Base URL
```
http://127.0.0.1:8000/api/v1
```
Make sure backend server is running before starting frontend.

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```
git clone <repo-url>
```
### 2️⃣ Install Dependencies
```
npm install
```

### 3️⃣ Start Development Server

```
npm run dev
```


---

## 📌 Key Features

- Role-based route protection
- Token-based authentication
- Protected dashboards
- Department and subject filtering
- Resource upload & verification workflow
- Timetable management
- API error handling

---

## 📦 Future Improvements

- Real-time notifications
- Resource rating analytics
- File preview support
- Offline caching
- Better UI/UX refinements

---

## 🧠 Architecture Concept

Frontend handles:
- UI rendering
- Route protection
- Token management
- API communication
- Role-based UI control

Backend handles:
- Authentication
- Authorization
- Resource validation
- Business logic
- Database management

---

## 📜 License

This project is developed for academic and institutional use.
