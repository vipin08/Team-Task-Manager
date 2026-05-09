# Team Task Manager

Team Task Manager is a full-stack web application designed to simplify project and team collaboration. The platform allows teams to create projects, assign tasks, track progress, and manage workflows efficiently with secure role-based access control.

Built using the MERN stack (MongoDB, Express.js, React, and Node.js), the application provides a modern and responsive interface for administrators and team members to manage daily tasks and project activities effectively.

# Problem Statement

Managing projects and tasks manually through spreadsheets or scattered communication tools often leads to confusion, missed deadlines, and reduced productivity. Teams require a centralized platform where they can collaborate, assign responsibilities, and monitor progress in real-time.

Team Task Manager solves this problem by providing an organized task management system with authentication, role-based access, dashboards, and project tracking features.

# Key Features

Authentication & Authorization
User Signup & Login
Secure JWT Authentication
Role-Based Access Control (Admin / Member)

# Admin Features

1. Project Management
Create and manage projects
Add project descriptions and deadlines
Monitor project progress
2. Team Management
Add and manage team members
Assign members to projects
Control user roles and permissions
3. Task Management
Create tasks within projects
Assign tasks to team members
Update task details and deadlines
Track task progress
4. Task Status Tracking
Mark tasks as:
Todo
In Progress
Completed
Set task priority:
High
Medium
Low
5. Dashboard
View project summaries
Track pending and completed tasks
Monitor overdue tasks
Analyze team productivity

# Member Features

1. Task Handling
View assigned tasks
Update task status
Track project progress
2. Collaboration
View project details
Participate in task workflow

# Dashboard Features

Total Projects Overview
Pending Tasks Count
Completed Tasks Summary
Overdue Task Monitoring
Task Status Filtering

# Technologies Used
Frontend
React.js (Vite)
Redux Toolkit
Tailwind CSS
React Router DOM
Backend
Node.js
Express.js
Database
MongoDB
Authentication
JWT (JSON Web Token)

# REST API Features

User Authentication APIs
Project CRUD APIs
Task CRUD APIs
Team Management APIs
Role-Based Protected Routes

# Deployment

The application is deployed and accessible online using:

Vercel

# Installation & Setup

Clone Repository
git clone <your-github-repo-link>
Install Dependencies
Frontend
cd client
npm install
npm run dev
Backend
cd server
npm install
npm start

# Environment Variables

Create a .env file in the server directory and add:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
