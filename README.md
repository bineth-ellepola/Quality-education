# Quality Education

A web application that helps adult learners complete their secondary education online. Teachers can create, manage, and share assessments with file attachments. Students can view assessments and download attached files.

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React, Vite, React Router, Axios   |
| Backend  | Node.js, Express                    |
| Database | MongoDB (via Mongoose)              |
| Storage  | Supabase S3-compatible storage      |

## Project Structure

```
Quality-education/
├── backend/
│   ├── Config/         # Database and S3 configuration
│   ├── Controller/     # Route handler logic
│   ├── Model/          # Mongoose schemas (Assessment, User)
│   ├── Route/          # API route definitions
│   ├── middleware/      # Custom middleware
│   └── server.js       # App entry point
├── frontend/
│   ├── src/
│   │   ├── Component/
│   │   │   ├── AssessmentManagement/  # Create, View, Update assessments
│   │   │   ├── CourseManagement/
│   │   │   ├── LearningContent/
│   │   │   └── UserManagement/
│   │   ├── App.jsx     # Routes and navigation
│   │   └── main.jsx    # React entry point
│   └── index.html
├── package.json        # Root-level scripts
└── README.md
```

## Features

- **Create Assessments** – Add a title, description, total marks, due date, and file attachment
- **View Assessments** – See all assessments in a list
- **Update Assessments** – Edit any assessment details
- **Delete Assessments** – Remove assessments
- **File Attachments** – Upload and view files using Supabase S3 storage with presigned URLs

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud like MongoDB Atlas)
- [Supabase](https://supabase.com/) account (for file storage)

### 1. Clone the Repository

```bash
git clone https://github.com/bineth-ellepola/Quality-education.git
cd Quality-education
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

SUPABASE_S3_ENDPOINT=your_supabase_s3_endpoint
SUPABASE_S3_REGION=your_supabase_region
SUPABASE_S3_ACCESS_KEY=your_access_key
SUPABASE_S3_SECRET_KEY=your_secret_key
SUPABASE_S3_BUCKET=your_bucket_name
```

### 3. Set Up the Frontend

```bash
cd frontend
npm install
```

### 4. Run the Application

**Option 1 – Run both at once (from root folder):**

```bash
npm run dev:all
```

**Option 2 – Run separately:**

Start the backend:

```bash
cd backend
npm start
```

Start the frontend (in a new terminal):

```bash
cd frontend
npm run dev
```

The backend runs on `http://localhost:5000` and the frontend runs on `http://localhost:5173` by default.

## API Endpoints

All assessment routes are under `/api/assessment`.

| Method | Endpoint                       | Description               |
| ------ | ------------------------------ | ------------------------- |
| GET    | `/api/assessment/api/`         | Get all assessments       |
| GET    | `/api/assessment/api/:id`      | Get assessment by ID      |
| POST   | `/api/assessment/api/`         | Create a new assessment   |
| PUT    | `/api/assessment/api/:id`      | Update an assessment      |
| DELETE | `/api/assessment/api/:id`      | Delete an assessment      |
| GET    | `/api/assessment/api/view/:id` | View file attachment      |
| GET    | `/api/assessment/api/presigned-url` | Get presigned URL for upload |

## License

ISC
