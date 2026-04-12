# Quality-education: Adult Learner LMS

A comprehensive web application designed to support adult learners in completing secondary education online. The platform connects educators, administrators, and students through an intuitive and modern Learning Management System (LMS).

## 🚀 Project Overview

**Quality-education** is built using the MERN stack (MongoDB, Express.js, React, Node.js). It features a robust backend API for managing courses, users, enrollments, and assessments, paired with a dynamic, responsive frontend built with React and Tailwind CSS. 

---

## 🏗️ System Architecture

The application is structured into two main parts:
1. **Frontend (Client)**: A Single Page Application (SPA) built with React and Vite. It handles the user interface, routing, and interacts with the backend APIs via Axios.
2. **Backend (Server)**: A RESTful API built with Node.js and Express.js. It manages business logic, database interactions (MongoDB), user authentication (JWT), and file uploads (Multer, Cloudinary, AWS S3).

---

## 💻 Technologies Used

### Frontend
- **Framework**: React 19, Vite
- **Styling**: Tailwind CSS v4, Framer Motion (for animations)
- **Routing**: React Router DOM v7
- **State Management & Data Fetching**: Axios
- **Form & Editors**: React Quill (Rich Text Editor)
- **Icons**: Lucide React, Heroicons, React Icons
- **Date Formatting**: Day.js

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database**: MongoDB (Mongoose Object Data Modeling)
- **Authentication & Security**: JSON Web Tokens (JWT), bcrypt/bcryptjs, Helmet, Express Rate Limit, CORS
- **Storage/File Uploads**: Multer, Cloudinary, AWS SDK (S3)
- **Email Service**: Nodemailer
- **Logging**: Morgan

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local instance or MongoDB Atlas)
- Cloudinary / AWS S3 account (for media storage)

### 1. Clone the Repository
```bash
git clone <https://github.com/3chathurajayashan/studly.git>
cd Quality-education
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create a .env file and add essential variables
# Example .env setup:
# PORT=5050
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# CLOUDINARY_URL=your_cloudinary_url

# Start the development server
npm start
```
The backend server will run on `http://localhost:5001` .

### 3. Frontend Setup
Open a new terminal window/tab:
```bash
cd frontend

# Install dependencies
npm install

# Create a .env file (if required by your axios config)
# VITE_API_URL=http://localhost:5001/api

# Start the Vite development server
npm run dev
```
The frontend application will typically be accessible at `http://localhost:5173`.

---

🔌 API Endpoints

The backend exposes several RESTful endpoints to manage the application entities.
Base URL: http://localhost:5001

🩺 Health Check
GET / → Check if API is running

📚 Courses (/api)

Create
POST /api/courses → Create a new course (with cover image upload)
Read
GET /api/courses → Get all courses
GET /api/courses/:id → Get single course
Update
PUT /api/courses/:id → Update course (with cover image)
Publish
PATCH /api/courses/:id/toggle-publish → Publish / Unpublish course
Delete
DELETE /api/courses/:id → Soft delete course
Admin
GET /api/admin/deleted-courses → Get all deleted courses
DELETE /api/admin/courses/:id/permanent → Permanently delete course


🧠 Subjects (/api/subjects)

Read
GET /api/subjects → Get all subjects
GET /api/subjects/:id → Get single subject
Create
POST /api/subjects → Create subject (Protected)
Update
PUT /api/subjects/:id → Update subject (Protected)
Delete
DELETE /api/subjects/:id → Delete subject (Protected)


👤 Users (/api/users)

Auth
POST /api/users/register → Register user (with profile picture)
POST /api/users/login → Login user
POST /api/users/verify-email → Verify OTP
POST /api/users/resend-otp → Resend OTP

Profile
GET /api/users/:id → Get user by ID
PUT /api/users/:id → Update user (with profile picture)
PUT /api/users/update-profile-picture/:id → Update profile picture

Roles
GET /api/users/instructors/all → Get all instructors
GET /api/users/students/all → Get all students
Delete
DELETE /api/users/:id → Delete user

Instructor Actions
GET /api/users/submissions → Get all submissions
PUT /api/users/:id/review → Mark submission under review
PUT /api/users/:id/grade → Grade submission


📢 Notices (/api/notice)
Create
POST /api/notice → Create notice (Protected, multiple attachments)
Read
GET /api/notice/all → Get all notices
GET /api/notice/course/:courseId → Get notices by course
GET /api/notice/:id → Get single notice


🛑 Admin Notices (/api/admin/notice)
POST /api/admin/notice → Create admin notice
GET /api/admin/notice/all → Get all admin notices
DELETE /api/admin/notice/:id → Delete admin notice


📝 Assessments (/api/assestment)
Create
POST /api/assestment/courses/:courseId/assessments → Add assessment (file upload)
Read
GET /api/assestment/courses/:courseId/assessments → Get assessments by course
GET /api/assestment/assessments/:id → Get single assessment
Update
PUT /api/assestment/assessments/:id → Update assessment (file upload)
Delete
DELETE /api/assestment/assessments/:id → Delete assessment


📂 Content (/api/content)

Create
POST /api/content/courses/:courseId/contents → Add content (file upload)
Read
GET /api/content/courses/:courseId/contents → Get contents by course
GET /api/content/contents/:id → Get single content
Update
PUT /api/content/contents/:id → Update content (file upload)
Delete
DELETE /api/content/contents/:id → Delete content


🎟️ Support Tickets (/api/tickets)
Create
POST /api/tickets → Create ticket (with attachments)
Read
GET /api/tickets → Get all tickets
GET /api/tickets/:id → Get single ticket
Update
PUT /api/tickets/:id → Edit ticket (with attachments)
Delete
DELETE /api/tickets/:id → Delete ticket


Messages
POST /api/tickets/:id/message → Add message to ticket (with attachments)


🎓 Enrollments (/api/enrollments)
POST /api/enrollments/enroll → Enroll in a course
GET /api/enrollments/my-courses/:userId → Get user's enrolled courses
GET /api/enrollments/course-students/:courseId → Get students in a course


📊 Progress (/api/progress)

Student
POST /api/progress/start → Start progress
POST /api/progress/submit/:id → Submit assignment (file upload)
PUT /api/progress/update/:id → Update progress
GET /api/progress/student/:studentId → Get student progress

Instructor
GET /api/progress/submissions → Get all submissions
PUT /api/progress/:id/review → Mark under review
PUT /api/progress/:id/grade → Grade submission
Admin
DELETE /api/progress/:id → Delete progress


Authorization: Bearer <your_token>

Members

IT23773530 - ELLEPOLA P W B Y
IT23579422 - K T P WELIWATHTHA
IT23404946 - JAYASHAN K C C
IT23688254 - R R A L M BANDARA

