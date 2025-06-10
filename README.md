# Excel Analytics Platform

A full-stack web application for analyzing Excel files with user management and admin features.

## Features

- User authentication and authorization
- Excel file upload and analysis
- Basic and advanced data analysis
- Admin dashboard with user management
- File management system
- Data visualization with charts

## Tech Stack

### Frontend
- React.js
- Redux for state management
- Tailwind CSS for styling
- Chart.js for data visualization

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Multer for file uploads

## Project Structure

```
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/     # Page components
│   │   ├── redux/     # State management
│   │   └── services/  # API services
│   └── public/        # Static files
│
└── backend/           # Node.js backend application
    ├── admin/         # Admin-specific routes and controllers
    ├── config/        # Configuration files
    ├── controllers/   # Route controllers
    ├── middleware/    # Custom middleware
    ├── models/        # Database models
    ├── routes/        # API routes
    └── uploads/       # Uploaded files storage
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd frontend
   npm run dev
   ```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/logout - Logout user

### File Upload
- POST /api/upload - Upload Excel file
- GET /api/uploads - Get user's uploads
- GET /api/uploads/:id - Get specific upload
- DELETE /api/uploads/:id - Delete upload

### Admin
- GET /api/admin/users - Get all users
- PUT /api/admin/users/:id - Update user
- DELETE /api/admin/users/:id - Delete user
- GET /api/admin/uploads - Get all uploads
- GET /api/admin/stats - Get system statistics

## License

MIT
