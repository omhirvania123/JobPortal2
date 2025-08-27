# JobPortal2
Internship II

# Job Portal System

A full-stack job portal application that allows job seekers to browse and apply for jobs, and employers to post and manage job listings. The platform includes features for user authentication, company management, job posting, job applications, and saved jobs.

---

## Project Structure

├── backend/ # Backend Node.js application
│ ├── controllers/ # Route controllers
│ ├── models/ # MongoDB models
│ ├── routes/ # API routes
│ ├── middleware/ # Authentication & error handling
│ └── utils/ # Utility functions
├── frontend/ # React frontend application
│ ├── public/ # Static assets
│ └── src/
│ ├── components/ # Reusable UI components
│ ├── pages/ # Page components
│ ├── hooks/ # Custom hooks
│ ├── services/ # API calls
│ └── store/ # State management

yaml
Copy code

---

## Features

- User Authentication & Authorization (Job Seekers & Employers)
- Company Profile Management
- Job Posting & Editing
- Job Search & Filtering
- Apply to Jobs
- Save Jobs for Later
- Application Tracking
- Responsive UI for all devices
- Secure API with JWT Authentication
- Cloudinary support for media uploads

---

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (for file uploads)
- Multer
- dotenv

### Frontend
- React 18
- Redux Toolkit
- React Router
- Axios
- TailwindCSS / Material UI (depending on your project setup)

---

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

Clone the repository:
```bash
git clone https://github.com/your-username/jobportal-yt.git
cd jobportal-yt
Install Backend Dependencies:

bash
Copy code
cd backend
npm install
Install Frontend Dependencies:

bash
Copy code
cd frontend
npm install
Running the Application
Start the Backend Server:

bash
Copy code
cd backend
npm start
Backend will run on: http://localhost:5000

Start the Frontend Development Server:

bash
Copy code
cd frontend
npm start
Frontend will run on: http://localhost:3000

Environment Variables
Create a .env file inside backend/:

ini
Copy code
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
API Endpoints
Auth Routes
POST /api/auth/register - Register a new user

POST /api/auth/login - User login

Company Routes
POST /api/company - Create new company profile

GET /api/company/:id - Get company by ID

Job Routes
GET /api/jobs - Get all jobs

POST /api/jobs - Create new job

GET /api/jobs/:id - Get job by ID

PUT /api/jobs/:id - Update job

Application Routes
POST /api/applications - Apply for a job

GET /api/applications/user/:id - Get applications by user

GET /api/applications/job/:id - Get applications for a job

Saved Jobs
POST /api/saved-jobs - Save a job

GET /api/saved-jobs/:userId - Get saved jobs for user

Contributing
Fork the repository

Create your feature branch (git checkout -b feature/YourFeature)

Commit your changes (git commit -m 'Add some feature')

Push to the branch (git push origin feature/YourFeature)

Open a Pull Request

License
This project is licensed under the MIT License.
