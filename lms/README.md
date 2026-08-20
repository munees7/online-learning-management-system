# LearnHub - Full Stack LMS (MERN)

## Quick Start

### 1. Install dependencies
```bash
# Server
cd server && npm install

# Client
cd client && npm install
```

### 2. Configure environment
Edit `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/lms_db
JWT_SECRET=lms_super_secret_jwt_key_2024
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_your_key_here
CLIENT_URL=http://localhost:5173
```

### 3. Seed the database
```bash
cd server && npm run seed
```
Demo accounts:
- Admin:      admin@lms.com / admin123
- Instructor: john@lms.com / instr123
- Student:    jane@lms.com / student123

### 4. Run the app
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

Open: http://localhost:5173

## Features
- Free & Paid courses with badges
- JWT authentication + role-based access
- Student: enroll, learn, track progress, wishlist, reviews
- Instructor: create/edit courses, manage lessons
- Admin: analytics dashboard, manage users & courses
- Dark/Light mode
- Stripe payment (demo mode if key not set)
