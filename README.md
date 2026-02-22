# 📚 EMEAHub - Academic Resource Management System

[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql)](https://mysql.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

EMEAHub is a comprehensive role-based academic resource management system designed for FYUGP students. It provides a centralized platform for organizing, verifying, and accessing study materials including notes, previous year questions, syllabi, and timetables.

![EMEAHub Dashboard](banner.png)

## ✨ Features

### 🎯 Core Features
- **Role-Based Access** - Separate panels for Public, Students, Teachers, and Admins
- **Resource Management** - Upload, verify, and organize study materials
- **Smart Search** - Advanced filtering by department, semester, subject, and type
- **Quality Control** - Verify resources and hide low-quality content
- **Version Control** - Multiple versions of the same resource with latest marking
- **Download Tracking** - Track downloads and views for analytics

### 🏆 Gamification
- **Leaderboard** - Compete with peers based on contributions
- **Achievement System** - Earn badges for uploading, verifying, and rating
- **Reputation Points** - Gain points for community participation
- **Top Contributors** - Recognize most active users

### 🤖 AI Assistant (Gemini)
- **Smart Search** - Natural language understanding for better results
- **Study Recommendations** - Personalized resource suggestions
- **Chat Assistant** - Get help with academic queries
- **Study Plan Generator** - Create personalized study schedules

### 👥 User Roles

#### 👤 Public Users
- Browse and download verified resources
- View leaderboard and achievements
- No login required

#### 🎓 Students
- All public features
- Upload study materials
- Rate and review resources
- Track download history
- Earn reputation points

#### 👨‍🏫 Teachers
- All student features
- Verify pending resources
- Upload timetables
- View verification statistics
- Moderate content quality

#### 👑 Admins
- Full platform control
- Verify teacher accounts
- Manage users and roles
- Hide/show resources
- Department management
- View system analytics

## 🛠️ Tech Stack

### Backend
- **Laravel 12** - PHP framework
- **MySQL 8** - Database
- **Laravel Sanctum** - API authentication
- **Cloudinary** - File storage (optional)

### Frontend
- **React 18** - UI library
- **Tailwind CSS 4** - Styling
- **React Router 6** - Navigation
- **React Query** - Data fetching
- **React Hook Form** - Form management
- **Headless UI** - Accessible components
- **Heroicons** - Icons

### AI Integration
- **Google Gemini API** - AI assistant features

## 📋 Prerequisites

- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL >= 8.0
- npm or yarn

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/muhammedshamil8/emeahub.git
cd emeahub
```
### 2.Backend Setup(Laravel)

#### Navigate to backend directory
```
cd emeahub-api
```
#### Install PHP dependencies
```
composer install
```
#### Copy environment file
```
cp .env.example .env
```
#### Generate application key
```
php artisan key:generate
```
#### Configure database in .env
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=emeahub
DB_USERNAME=root
DB_PASSWORD=
```
#### Run migrations and seeders
```
php artisan migrate
php artisan db:seed
```
#### Create storage link
```
php artisan storage:link
```

#### Start Laravel server
```
php artisan serve
```
### 3. Frontend Setup (React)

#### Open new terminal
```
cd emeahub-frontend
```
#### Install Node dependencies
```
npm install
```
#### Copy environment file
```
cp .env.example .env
```
#### Update API URL in .env
```
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

#### Start development server
```
npm run dev
```
### 4. Access the Application
#### Frontend: `http://localhost:3000`

#### Backend API: `http://127.0.0.1:8000/api/v1`

### 🔑 Default Login Credentials
After running seeders, you can login with:


## 🔐 Demo Accounts

| Role    | Email                  | Password      |
|---------|------------------------|---------------|
| Admin   | admin@emeahub.com      | password      |
| Teacher | teacher@test.com       | password123   |
| Student | student@test.com       | password123   |

---

## 📁 Project Structure


```
emeahub/
│
├── emeahub-api/                  # Laravel Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/      # API Controllers
│   │   │   └── Middleware/       # Custom Middleware
│   │   ├── Models/               # Eloquent Models
│   │   └── Providers/            # Service Providers
│   │
│   ├── database/
│   │   ├── migrations/           # Database Migrations
│   │   └── seeders/              # Database Seeders
│   │
│   ├── routes/
│   │   └── api.php               # API Routes
│   │
│   └── .env                      # Environment Config
│
└── emeahub-frontend/             # React Frontend
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   ├── auth/
    │   │   ├── resources/
    │   │   ├── teacher/
    │   │   ├── admin/
    │   │   └── gamification/
    │   │
    │   ├── pages/
    │   ├── services/
    │   ├── context/
    │   ├── hooks/
    │   ├── utils/
    │   └── styles/
    │
    ├── .env
    └── package.json
```

  
---

## 📡 API Documentation

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/resources | List all resources |
| GET | /api/v1/resources/{id} | Get resource details |
| GET | /api/v1/resources/{id}/download | Download resource |
| GET | /api/v1/departments | List departments |
| GET | /api/v1/subjects/by-department | Filter subjects |
| GET | /api/v1/timetable | View timetable |
| GET | /api/v1/leaderboard | View leaderboard |
| GET | /api/v1/achievements | List achievements |

---

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/register | Register student |
| POST | /api/v1/register/teacher | Register teacher |
| POST | /api/v1/login | Login |
| POST | /api/v1/logout | Logout |
| GET | /api/v1/me | Get current user |

---

### Protected Endpoints (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/resources/upload | Upload resource |
| GET | /api/v1/resources/my-uploads | View own uploads |
| POST | /api/v1/resources/{id}/rate | Rate resource |
| GET | /api/v1/user/stats | User gamification stats |

---

### Teacher Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/teacher/pending | Pending verifications |
| POST | /api/v1/teacher/verify/{id} | Verify or reject resource |
| POST | /api/v1/teacher/timetable | Upload timetable |

---

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/admin/teachers | List teachers |
| POST | /api/v1/admin/verify-teacher/{id} | Verify teacher |
| GET | /api/v1/admin/resources | Manage resources |
| POST | /api/v1/admin/resource/{id}/visibility | Hide or show resource |

---

### AI Assistant Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/ai/search | Smart search |
| POST | /api/v1/ai/chat | AI chat assistant |
| POST | /api/v1/ai/study-plan | Generate study plan |

---

## 🎨 UI Components

### Common Components

- Navbar – Responsive navigation with user menu
- Footer – Footer with links
- Sidebar – Role-based navigation
- LoadingSpinner – Loading states
- ErrorBoundary – Error handling

### Resource Components

- ResourceCard – Resource preview
- ResourceGrid – Grid layout
- ResourceFilters – Filtering options
- ResourceDetails – Detailed view
- UploadResource – Upload form

### Gamification Components

- Leaderboard – Contributor ranking
- Achievements – Badge display
- UserStats – Personal statistics

---


---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch  
   `git checkout -b feature/YourFeature`
3. Commit changes  
   `git commit -m "Add feature"`
4. Push branch  
   `git push origin feature/YourFeature`
5. Open Pull Request

---

## 📜 License

This project is developed for academic and institutional use.
This project is licensed under the MIT License - see the LICENSE file for details.
---

## 🙏 Acknowledgments

- Laravel Community – For the powerful backend framework  
- React Team – For the UI library  
- Tailwind CSS – For utility-first styling  
- All contributors and testers  

---

## 📧 Contact

**Project Lead:** Basil  
**Email:** muhammedshamil008@gmail.com  

**Project Repository:**  
https://github.com/muhammedshamil8/emeahub  

---

## 🚀 Deployment Guide

### 🔹 Backend (Laravel)

```bash
# Set production environment
cp .env.production .env

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations safely
php artisan migrate --force
```

---

### 🔹 Frontend (React)

```bash
# Build for production
npm run build

# Deploy the dist/ folder to your server
```

---

## 🌍 Environment Variables

### Backend (.env)

```
APP_NAME=EMEAHub
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.emeahub.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=emeahub
DB_USERNAME=your_username
DB_PASSWORD=your_password

SANCTUM_STATEFUL_DOMAINS=emeahub.com
SESSION_DOMAIN=.emeahub.com

GEMINI_API_KEY=your_gemini_api_key
```

---

### Frontend (.env)

```
VITE_API_URL=https://api.emeahub.com/api/v1
```

---

## ⚡ Performance Optimization

- Caching – Redis or Memcached for sessions and cache  
- CDN – Cloudinary or similar for file delivery  
- Database Indexing – Index frequently queried columns  
- Lazy Loading – Load images and components on demand  
- Pagination – All list endpoints are paginated  

---

## 🔒 Security Features

- API Authentication – Laravel Sanctum tokens  
- Role-Based Access – Middleware authorization  
- Input Validation – Request validation rules  
- SQL Injection Protection – Eloquent ORM binding  
- XSS Protection – Laravel built-in protection  
- CORS Policy – Proper API CORS configuration  

---

## 🧪 Testing

### Backend

```bash
cd emeahub-api
php artisan test
```

### Frontend

```bash
cd emeahub-frontend
npm run test
```

---

## 📊 Database Schema

![Database Schema](https://via.placeholder.com/800x600?text=Database+Schema)

---

## 🎯 Future Enhancements

- Mobile application (React Native)
- Real-time notifications
- Video lecture support
- Discussion forums
- LMS integrations
- Advanced analytics dashboard
- Peer-to-peer chat
- Resource recommendation engine

---

## ❤️ Built For

Developed for FYUGP Students.

---
