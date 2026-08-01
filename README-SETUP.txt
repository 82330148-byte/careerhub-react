CAREERHUB - WEEK 4 STYLE VERSION
================================

This version follows the same programming logic used in week_4:
- React frontend
- Axios requests
- Node.js + Express backend
- MySQL database through the mysql package
- GET, POST, PUT, and DELETE APIs
- Multer and FormData for CV upload

1) DATABASE
-----------
Open phpMyAdmin and execute backend/schema.sql.
Database name: careerhub_db

After registering your account, make it admin:
UPDATE users SET role='admin' WHERE email='your@email.com';
Then logout and login again.

2) BACKEND
----------
Open a terminal in:
careerhub/backend

Run:
npm install
npm run dev

The backend runs on:
http://localhost:5000

3) FRONTEND
-----------
Open another terminal in:
careerhub/frontend

Run:
npm install
npm run dev

Open the Vite URL, usually:
http://localhost:5173

IMPORTANT
---------
Apache is not needed for this Node.js backend.
MySQL must be running from XAMPP.
The React application communicates with Express at localhost:5000.
