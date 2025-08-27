# Job Portal System

A full-stack job portal application that allows job seekers to browse and apply for jobs, and employers to post and manage job listings. The platform includes features for user authentication, company management, job posting, job applications, and saved jobs.

## Project Structure

```
├── backend/           # Backend Node.js application
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Authentication & error handling
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   └── utils/         # Utility functions
├── frontend/          # React frontend application
│   ├── public/        # Static files
│   └── src/         
│       ├── components/  # Reusable UI components
│       ├── pages/       # Page components
│       ├── hooks/       # Custom hooks
│       ├── services/    # API services
│       └── store/       # State management
```

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

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary(for file upload)
- Multer
- .env

### Frontend
- React 18
- Redux Toolkit
- React Router
- Axios
- TailwinCss/MaterialUI

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository
```bash
git clone https://github.com/omhirvania123/JobPortal2.git
cd JobPortal2
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Running the Application

1. Start the Backend Server
```bash
cd backend
npm start
```
The server will start on http://localhost:5001

2. Start the Frontend Development Server
```bash
cd frontend
npm start
```
The frontend will start on http://localhost:3000

### Docker Setup (Optional)
```bash
cd backend
docker-compose up
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

## API Endpoints

### Auth Routes
- POST /api/auth/register - Register a new user
- POST /api/auth/login - User login

### Company Routes
- POST /api/company - Create new company profile
- GET /api/company/:id - Get company by ID

### Job Routes
- GET /api/jobs - Get all jobs
- POST /api/jobs - Create new job
- GET /api/jobs/:id - Get job by ID
- PUT /api/jobs/:id - Update job


### Application Routes
- POST /api/applications - Apply for a job
- GET /api/applications/user/:id - Get applications by user
- GET /api/applications/job/:id - Get applications for a job

### Saved Jobs
- POST /api/saved-jobs - Save a job
- GET /api/saved-jobs/:userId - Get saved jobs for user

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



