# LearnHub — Online Learning Management System

A full-stack Learning Management System built with the MERN stack. LearnHub supports three user roles — Student, Instructor, and Admin — each with their own dedicated dashboard and feature set.

---

## Features

### Student
- Browse and search courses by category, level, price, and keyword
- Enroll in free courses or purchase paid courses via Stripe
- Track learning progress (lesson completion percentage)
- Take quizzes and earn certificates on passing
- Leave ratings and reviews (enrolled users only)
- Manage a wishlist of saved courses
- View all enrolled courses and certificates from a personal dashboard

### Instructor
- Create, edit, and delete courses
- Add and manage lessons (video URL, content, duration, preview flag)
- Create quizzes for courses with custom questions and passing score
- View a dashboard summarizing their published courses

### Admin
- View platform-wide analytics (users, courses, enrollments, reviews)
- Manage all users (view, update role, delete)
- Manage all courses across all instructors
- Register via a protected secret key

### General
- JWT-based authentication with role-based access control
- Dark mode / light mode toggle
- Responsive UI with Tailwind CSS
- Toast notifications and skeleton loaders
- Stripe payment integration (with demo/fallback mode)

---

## Technologies Used

**Frontend**
- React 19, React Router v7
- Redux Toolkit + React Redux
- Axios
- Tailwind CSS v4
- Framer Motion
- Stripe.js (`@stripe/react-stripe-js`)
- React Hot Toast, React Icons

**Backend**
- Node.js, Express.js
- MongoDB, Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Stripe Node SDK
- Multer
- dotenv, cors

---

## Project Structure

```
lms/
├── client/                   # React frontend (Vite)
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/       # CourseCard, ProtectedRoute, Skeleton, StarRating
│       │   ├── course/
│       │   └── layout/       # DashboardLayout
│       ├── pages/
│       │   ├── admin/        # AdminDashboard, AdminUsers, AdminCourses
│       │   ├── instructor/   # InstructorDashboard, CreateCourse, EditCourse
│       │   ├── student/      # StudentDashboard, MyCourses, Wishlist, Profile
│       │   ├── Home.jsx
│       │   ├── Courses.jsx
│       │   ├── CourseDetail.jsx
│       │   ├── LearnPage.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── AdminRegister.jsx
│       ├── redux/
│       │   ├── slices/       # authSlice, courseSlice, enrollSlice, uiSlice, wishlistSlice
│       │   └── store.js
│       ├── services/
│       │   └── api.js        # Axios instance + all API calls
│       ├── App.jsx
│       └── main.jsx
│
├── server/                   # Express backend
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/          # authController, courseController, enrollmentController,
│   │                         # lessonController, quizController, reviewController,
│   │                         # wishlistController, adminController
│   ├── middleware/
│   │   ├── auth.js           # JWT protect + role authorize
│   │   └── error.js          # Global error handler
│   ├── models/               # User, Course, Lesson, Enrollment, Quiz,
│   │                         # QuizAttempt, Certificate, Review
│   ├── routes/               # auth, courses, lessons, enrollment, reviews,
│   │                         # wishlist, quiz, admin
│   ├── utils/
│   │   └── seed.js           # Database seeder
│   ├── .env                  # ⚠️ Not committed — see .env.example
│   ├── .env.example          # Template for environment variables
│   └── index.js              # Entry point
│
└── package.json              # Root scripts for running both apps
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) running locally, or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string
- A [Stripe](https://stripe.com/) account (optional — app works in demo mode without it)
- npm v9 or higher

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/learnhub-lms.git
cd learnhub-lms
```

### 2. Install all dependencies

From the `lms/` folder:

```bash
cd lms
npm run install:all
```

Or install manually:

```bash
cd lms/server && npm install
cd ../client && npm install
```

---

## Environment Variables

Create a `.env` file inside `lms/server/` based on the provided example:

```bash
cp lms/server/.env.example lms/server/.env
```

Then fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/lms_db
JWT_SECRET=your_strong_random_secret
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_key   # optional
ADMIN_SECRET=your_admin_registration_secret
CLIENT_URL=http://localhost:5173
```

> Never commit your `.env` file. It is already listed in `.gitignore`.

---

## Running the Project

### Run backend only

```bash
cd lms/server
npm run dev
```

Server starts at `http://localhost:5000`

### Run frontend only

```bash
cd lms/client
npm run dev
```

Frontend starts at `http://localhost:5173`

### Run both together (from `lms/`)

```bash
cd lms
npm run server   # starts backend
npm run client   # starts frontend (run in a separate terminal)
```

---

## Seed the Database (Optional)

To populate the database with sample users, courses, and lessons:

```bash
cd lms
npm run seed
```

Default demo accounts after seeding:

| Role       | Email              | Password   |
|------------|--------------------|------------|
| Admin      | admin@lms.com      | admin123   |
| Instructor | john@lms.com       | instr123   |
| Student    | jane@lms.com       | student123 |

---

## API Overview

| Method | Endpoint                    | Description                          |
|--------|-----------------------------|--------------------------------------|
| POST   | /api/auth/register          | Register as student or instructor    |
| POST   | /api/auth/login             | Login and receive JWT                |
| GET    | /api/courses                | Get all published courses (filterable)|
| GET    | /api/courses/featured       | Get featured courses (home page)     |
| POST   | /api/enroll                 | Enroll in a course (free or Stripe)  |
| PUT    | /api/enroll/progress        | Update lesson completion progress    |
| GET    | /api/quiz/:courseId         | Get quiz for a course                |
| POST   | /api/quiz/submit            | Submit quiz answers                  |
| GET    | /api/quiz/certificate/:id   | Get certificate for a course         |
| GET    | /api/admin/analytics        | Admin analytics dashboard            |

---

## Future Improvements

- File uploads for course thumbnails and lesson videos (Cloudinary / AWS S3)
- Email notifications for enrollment and certificates (Nodemailer)
- Live search with debounce on the course catalog
- Course ratings filter and sorting improvements
- Student discussion/Q&A section per course
- Instructor earnings and payout dashboard
- Mobile app (React Native)

---

## Author

Built by **[Your Name]**

- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)
- Portfolio: [your-portfolio.com](https://your-portfolio.com)
