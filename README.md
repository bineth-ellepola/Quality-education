# Quality-education
A web application that support adult learners to complete secondary education online.

# 🎓 Studly LMS — Quality Education Learning Management System

## 📚 Project Description

**Studly** is a web-based Learning Management System (LMS) developed to support accessible, structured, and high-quality digital education. The platform enables instructors to deliver learning materials, evaluate student performance, and monitor learning progress, while students can access courses, complete assessments, and track their achievements in an engaging environment.

The system combines **course management, assessments, gamification, and progress tracking** to create a complete digital learning ecosystem that promotes continuous learning and skill development.

⏳ **Project Status:** 80% Completed
📅 **Assignment:** Evaluation – Assignment 01

---

## 📌 Key Features

### 👨‍🎓 Student Features

* Course enrollment and lesson access
* Interactive learning materials
* Online quizzes and assessments
* Progress tracking dashboard
* Achievement badges and rewards
* Daily learning streak tracking
* Activity and performance monitoring

### 👩‍🏫 Instructor Features

* Course and lesson creation
* Student progress monitoring
* Assessment management
* Result evaluation and grading

### 🛠️ Admin Features

* User management
* Role-based access control
* System monitoring

---

## 🛠️ Technology Stack

### 🔙 Backend

* Node.js – Runtime Environment
* Express.js – Backend Framework
* MongoDB – NoSQL Database
* Mongoose – ODM for MongoDB
* JWT – Authentication & Authorization
* bcryptjs – Password Encryption

### 🎨 Frontend

* React – User Interface Library
* Vite – Frontend Build Tool
* React Router – Routing
* Axios – API Communication
* Tailwind CSS – Styling Framework
* Lottie – Animation Support

---

## 👥 Team Members & Responsibilities

 Member    Component                 Description                                                     
 
 Bineth    User Management    Management using  
 Chathura   Course Management    Badges, leaderboard, points system, levels                      
 Ayodya  Learning content management       Lesson management and progress monitoring                       
 Thilakshi  Assessments             Quiz system, grading, result tracking                           


## 📂 Project Structure

```
Quality-education/
│
├── server/
│   ├── config/        # Database configuration
│   ├── controllers/   # Business logic controllers
│   ├── middleware/    # Authentication & role verification
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API routes
│   ├── app.js       # Server entry point
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Application pages
│   │   ├── services/   # API calls
│   │   └── main.jsx    # React entry point
│   └── package.json
│
└── README.md
```

---

## ✅ Prerequisites

Make sure the following are installed:

* Node.js (v18 or higher)
* npm
* MongoDB (local or Atlas)
* Git



## ⚙️ Backend Setup

### 1️⃣ Navigate to Server Folder

bash
cd server

### 2️⃣ Install Dependencies

bash
npm install


### 3️⃣ Create Environment File

Create a `.env` file inside `/server`.

### 4️⃣ Start Backend Server

bash
npm run dev




## 🎨 Frontend Setup

### 1️⃣ Navigate to Client Folder

```bash
cd client
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variable (Optional)

```
VITE_API_URL=http://localhost:4000
```

### 4️⃣ Run Frontend

```bash
npm run dev
```

---

## 🗄️ Database Setup

### Option 1 — Local MongoDB

Install MongoDB locally and ensure the service is running.

### Option 2 — MongoDB Atlas

Use a cloud database and place the connection string inside the `.env` file.

---

## 🔐 Environment Variables

Create `.env` inside `/server`:

```
PORT=4000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

---

## ▶️ Running the Application

### Development Mode

Run both backend and frontend servers simultaneously.

### Production Mode

Build frontend and deploy backend API to a hosting platform.

---

## 🔑 Authentication

Protected API routes require JWT authentication:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🌐 API Base URL

```
http://localhost:4000
```

---

## ❗ Error Handling

| Status Code | Description           |
| ----------- | --------------------- |
| 400         | Bad Request           |
| 401         | Unauthorized          |
| 403         | Forbidden             |
| 404         | Not Found             |
| 500         | Internal Server Error |

Example response:

```json
{
  "message": "Error description here"
}
```

---

## 🎯 Project Goal

EduQuality LMS aims to improve digital education accessibility by providing an interactive platform that supports structured learning, continuous assessment, and learner engagement aligned with modern e-learning standards.

---

## 📄 License

This project is developed for academic purposes as part of a university software development project.

---
