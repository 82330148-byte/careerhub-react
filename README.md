# CareerHub – Advanced Web Programming Project (Phase 2)

CareerHub is a full-stack job-search and recruitment platform. Users can register, log in, browse job listings, save jobs, submit applications with a CV, edit their profile, and send contact messages. An administrator can add, update, and delete jobs, view application information, and update application status.

## Technologies Used

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express.js
- Database: MySQL using XAMPP/phpMyAdmin
- Authentication: bcryptjs password hashing
- File Upload: Multer
- Version Control: Git and GitHub
- Frontend Deployment: Vercel

## Main Features

- User registration and login
- Password hashing with bcryptjs
- View all jobs and job details
- Save and remove jobs
- Apply for jobs and upload a CV
- View submitted applications
- Read and update user profile
- Contact form stored in MySQL
- Admin dashboard
- Add, edit, and delete jobs (CRUD)
- Update application status
- Data validation and error handling

## Database Tables

The MySQL database is named `careerhub_db` and contains related tables:

- `users`
- `jobs`
- `saved_jobs`
- `applications`
- `contact_messages`

Relationships are implemented using foreign keys between users, jobs, saved jobs, and applications.

## Local Setup Instructions

### 1. Start MySQL

Open XAMPP and start:

- Apache
- MySQL

### 2. Import the database

1. Open `http://localhost/phpmyadmin`
2. Choose **Import**
3. Select `backend/careerhub_db.sql`
4. Click **Go**

### 3. Run the backend

```bash
cd backend
npm install
npm run dev
```

The API will run at:

```text
https://careerhub-react-production.up.railway.app
```

### 4. Run the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The React application will run at:

```text
http://localhost:5173
```

## Admin Access

First register a normal account. Then run this SQL query in phpMyAdmin:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

Log out and log in again to access the Admin page.

## API Examples

```text
GET    /jobs
GET    /jobs/:id
POST   /register
POST   /login
POST   /saved-jobs
DELETE /saved-jobs/:userId/:jobId
POST   /applications
GET    /applications/:userId
POST   /admin/jobs
PUT    /admin/jobs/:id
DELETE /admin/jobs/:id
```

## Project Links

- GitHub: https://github.com/82330148-byte/careerhub-react
- Frontend (Vercel): https://careerhub-react-o7sv-r21nhmt68-power-gym-react.vercel.app/

> The complete database functionality runs locally with XAMPP and the Node.js backend. The Vercel link demonstrates the deployed React frontend.

## Screenshots

Project screenshots are available in the `screenshots` folder.

## Group Contribution Statement

This project was completed individually by **Yehya Naser Dine**. I was responsible for frontend development, backend development, database design and integration, testing, documentation, Git/GitHub version control, and frontend deployment.
