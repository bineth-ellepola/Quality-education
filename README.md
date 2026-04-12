# Quality-education: Adult Learner LMS

A comprehensive web application designed to support adult learners in completing secondary education online. The platform connects educators, administrators, and students through an intuitive and modern Learning Management System (LMS).

##  Project Overview

**Quality-education** is built using the MERN stack (MongoDB, Express.js, React, Node.js). It features a robust backend API for managing courses, users, enrollments, and assessments, paired with a dynamic, responsive frontend built with React and Tailwind CSS. 

---

##  System Architecture

The application is structured into two main parts:
1. **Frontend (Client)**: A Single Page Application (SPA) built with React and Vite. It handles the user interface, routing, and interacts with the backend APIs via Axios.
2. **Backend (Server)**: A RESTful API built with Node.js and Express.js. It manages business logic, database interactions (MongoDB), user authentication (JWT), and file uploads (Multer, Cloudinary, AWS S3).

---

##  Technologies Used

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

##  Setup Instructions

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

 API Endpoints

The backend exposes several RESTful endpoints to manage the application entities.
Base URL: http://localhost:5001

🩺 Health Check
GET / → Check if API is running

 Courses (/api)

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


 Subjects (/api/subjects)

Read
GET /api/subjects → Get all subjects
GET /api/subjects/:id → Get single subject
Create
POST /api/subjects → Create subject (Protected)
Update
PUT /api/subjects/:id → Update subject (Protected)
Delete
DELETE /api/subjects/:id → Delete subject (Protected)


 Users (/api/users)

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


 Notices (/api/notice)
Create
POST /api/notice → Create notice (Protected, multiple attachments)
Read
GET /api/notice/all → Get all notices
GET /api/notice/course/:courseId → Get notices by course
GET /api/notice/:id → Get single notice


 Admin Notices (/api/admin/notice)
POST /api/admin/notice → Create admin notice
GET /api/admin/notice/all → Get all admin notices
DELETE /api/admin/notice/:id → Delete admin notice


 Assessments (/api/assestment)
Create
POST /api/assestment/courses/:courseId/assessments → Add assessment (file upload)
Read
GET /api/assestment/courses/:courseId/assessments → Get assessments by course
GET /api/assestment/assessments/:id → Get single assessment
Update
PUT /api/assestment/assessments/:id → Update assessment (file upload)
Delete
DELETE /api/assestment/assessments/:id → Delete assessment


 Content (/api/content)

Create
POST /api/content/courses/:courseId/contents → Add content (file upload)
Read
GET /api/content/courses/:courseId/contents → Get contents by course
GET /api/content/contents/:id → Get single content
Update
PUT /api/content/contents/:id → Update content (file upload)
Delete
DELETE /api/content/contents/:id → Delete content


 Support Tickets (/api/tickets)
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


 Enrollments (/api/enrollments)
POST /api/enrollments/enroll → Enroll in a course
GET /api/enrollments/my-courses/:userId → Get user's enrolled courses
GET /api/enrollments/course-students/:courseId → Get students in a course


 Progress (/api/progress)

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




---

##  Testing

We use comprehensive testing strategies to ensure code quality and reliability across the backend and frontend.

### 6.1 Environment Configuration for Tests

- **In-memory database**: `mongodb-memory-server` for isolated test runs
- **API mocking**: External service requests mocked with `jest.mock('axios')`
- **Test mode**: `NODE_ENV=test` prevents production database connections and side effects
- **Stability flags**: Jest uses `--runInBand --testTimeout=60000 --detectOpenHandles` for reliable test execution

### 6.2 How to Run Unit Tests

Jest is the test runner for unit tests. To run unit-specific tests:

```bash
cd backend

# Run unit tests only
npm test -- --testPathPatterns=unit
```

**Note**: If unit tests are not organized separately, integrate them into the main test suite.

### 6.3 How to Run Integration Tests

Run integration tests with the main command:

```bash
cd backend

# Run all integration tests
npm test
```

Optional watch mode for development:

```bash
npm run test:watch
```

**Implemented test suites:**
- `tests/routes.test.js` - User routes API testing
- `tests/enrollmentRoutes.test.js` - Enrollment endpoints
- `tests/assessmentRoutes.test.js` - Assessment endpoints
- `tests/contentRoutes.test.js` - Content management endpoints
- `tests/progressRoutes.test.js` - Progress tracking endpoints

**What is tested:**
- Route handlers and HTTP response codes
- Request/response payload validation
- Authentication and authorization
- Database operations and data persistence
- Error handling and edge cases

### 6.4 Performance Testing (Artillery)

Load testing is performed using Artillery to simulate concurrent user traffic and identify performance bottlenecks.

**Load profile configuration**: `load-test.yml`

#### Run Performance Test

1. **Start the API server:**
```bash
cd backend
npm start
```

2. **In another terminal, run the load test:**
```bash
cd backend
npm run load:test
```

#### Performance Metrics Interpretation

- **Total requests**: Total number of requests sent during the test
- **HTTP 200 responses**: Successful requests
- **Timeout errors (ETIMEDOUT)**: Requests that exceeded the response time limit
- **Mean response time (ms)**: Average response time across all requests
- **p95 response time (ms)**: 95th percentile response time (90% of requests are faster)
- **p99 response time (ms)**: 99th percentile response time (99% of requests are faster)

#### Example Performance Test Results

Latest mixed-load test execution summary:
- **Total requests**: 1126
- **HTTP 200 responses**: 847 (75.2% success rate)
- **Timeout errors (ETIMEDOUT)**: 279 (24.8% failure rate)
- **Mean response time**: 2634.6 ms
- **p95 response time**: 9230.4 ms
- **p99 response time**: 9801.2 ms

#### Performance Optimization Guidelines

If timeout or slow response times are observed:
1. Check database query optimization (add indexes, reduce query complexity)
2. Implement caching mechanisms (Redis for frequently accessed data)
3. Optimize middleware execution order
4. Review controller and service layer efficiency
5. Consider horizontal scaling or load balancing for production

### Frontend Testing

For frontend components, use Vitest and React Testing Library:

```bash
cd frontend

# Run component tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode for development
npm test -- --watch
```

---

##  Deployment

Quality-education is deployed on Vercel, utilizing serverless architecture for both frontend and backend with MongoDB Atlas for the database and ImageKit for media storage.

### 7.1 Architecture Overview

- **Frontend**: React (Vite) on Vercel static hosting
- **Backend**: Node.js/Express on Vercel serverless runtime
- **Database**: MongoDB Atlas
- **Media Storage**: Cloudinary & AWS S3

### 7.2 Deployment Configuration Evidence

- **Serverless routing config**: `vercel.json` (defines API routes and rewrites)
- **Express entrypoint for deployment**: `src/server.js` or `app.js` (main server file)
- **Environment variables**: Configured in Vercel project settings
  - `MONGO_URI`: MongoDB Atlas connection string
  - `JWT_SECRET`: JWT signing secret
  - `CLOUDINARY_URL`: Cloudinary configuration
  - `AWS_S3_*`: AWS S3 credentials (if using S3 for uploads)

### 7.3 Live Deployment URLs

- **Frontend live URL**: [https://qualityfrontend.vercel.app](https://qualityfrontend.vercel.app)
- **Backend live URL**: [[https://quality-education-backend.vercel.app](https://vercel.com/bineths-projects/quality_back/6xTJoqw8nNdmxQDmJYeiMFyvekTz)](https://studlybackend.vercel.app)
- **Vercel Backend Dashboard**: [https://vercel.com/bineths-projects/quality_back/6xTJoqw8nNdmxQDmJYeiMFyvekTz](https://vercel.com/bineths-projects/quality_back/6xTJoqw8nNdmxQDmJYeiMFyvekTz)

### 7.4 Deployment Process

#### Frontend Deployment

1. **Push code to GitHub** (main branch)
2. **Vercel automatically detects changes** and triggers build
3. **Build process**:
   ```bash
   npm install
   npm run build  # Creates optimized production build in dist/
   ```
4. **Deployment**: Built artifacts deployed to CDN
5. **Live URL**: Available at https://qualityfrontend.vercel.app

#### Backend Deployment

1. **Push code to GitHub** (main branch)
2. **Vercel builds and deploys** through serverless functions
3. **Build process**:
   ```bash
   npm install
   npm start  # Server runs on specified PORT
   ```
4. **API Routes**: Automatically converted to serverless functions
5. **Live URL**: Available at backend Vercel URL with `/api/*` endpoints

### 7.5 Quick Runtime Verification (Cloud)

**Health Checks:**

- **Backend Health Endpoint**: Test if backend API is running
  ```
  GET /api/health
  ```
  
- **Health Response** (Expected):
  ```json
  {
    "status": "ok",
    "message": "API is running",
    "timestamp": "2026-04-12T10:30:00Z"
  }
  ```

**API Documentation:**
- All API endpoints are accessible from the live backend URL
- Base URL: `https://quality-education-backend.vercel.app/api`

### 7.6 Environment Variables for Deployment

Create the following environment variables in Vercel project settings:

```env
# Database
MONGO_URI=your_mongodb_atlas_connection_string

# Security
JWT_SECRET=your_jwt_secret_key

# Storage - Cloudinary
CLOUDINARY_URL=your_cloudinary_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Storage - AWS S3 (if using)
AWS_S3_BUCKET_NAME=your_bucket_name
AWS_S3_REGION=your_region
AWS_S3_ACCESS_KEY=your_access_key
AWS_S3_SECRET_KEY=your_secret_key

# Email Service (Nodemailer)
EMAIL_SERVICE_HOST=your_email_host
EMAIL_SERVICE_PORT=your_email_port
EMAIL_USER=your_email_user
EMAIL_PASSWORD=your_email_password

# Application
NODE_ENV=production
PORT=3000
```

### 7.7 Monitoring & Logs

- **Vercel Dashboard**: Monitor builds, deployments, and logs at https://vercel.com/dashboard
- **View Logs**: Click on recent deployments to see build and runtime logs
- **Error Tracking**: Review deployment logs for any failed requests or errors
- **Performance Analytics**: Vercel provides performance metrics and function execution times

### 7.8 Rollback & Re-deployment

**To rollback to a previous version:**
1. Go to Vercel Dashboard → Project → Deployments
2. Select the previous deployment
3. Click "Redeploy" button

**To manually trigger a new deployment:**
1. Push changes to GitHub main branch, OR
2. Go to Vercel Dashboard → Project → click "Redeploy" on latest deployment

---

Members

IT23773530 - ELLEPOLA P W B Y
IT23579422 - K T P WELIWATHTHA
IT23404946 - JAYASHAN K C C
IT23688254 - R R A L M BANDARA

