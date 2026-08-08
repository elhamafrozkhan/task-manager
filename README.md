# Task Manager

A full stack task management application built as a portfolio and learning project. It pairs a Node.js and Express REST API backed by MongoDB with a Vue 3 single page application styled using Tailwind CSS.

## What This Project Does

Task Manager lets a registered user create, organize, and track personal tasks. Every task can carry a priority level, a due date, a category, and free form tags. A task can also be shared with another registered user by email, so that person can view it and mark it complete without being able to edit or delete it. Each user also has a profile page where they can update their account details and upload a personal avatar image.

## Project Structure

This repository is organized as a monorepo containing two independent applications plus a shared root configuration.

* `backend/` holds the Express and MongoDB API server. See `backend/README.md` for full details.
* `frontend/` holds the Vue 3 and Vite client application. See `frontend/README.md` for full details.
* `package.json` at the root defines npm workspaces so both applications can be installed and run from one place.

## Tech Stack Overview

**Backend:** Node.js, Express, MongoDB with Mongoose, JSON Web Token authentication, bcrypt password hashing, Multer and Sharp for avatar image processing, SendGrid for transactional email, Swagger (OpenAPI) for interactive API documentation, and Jest with Supertest for automated testing.

**Frontend:** Vue 3 (Options API), Vite as the build tool, Vue Router for client side routing, Pinia for state management, Tailwind CSS for styling, and Axios for HTTP requests.

## Getting Started

1. Install dependencies for both workspaces from the project root:
   `npm install`
2. Set up the backend environment file as described in `backend/README.md` (MongoDB connection string, JWT secret, SendGrid key, and port).
3. Set up the frontend environment file as described in `frontend/README.md` (the backend API base URL).
4. Start the backend:
   `npm run dev:backend`
5. In a separate terminal, start the frontend:
   `npm run dev:frontend`
6. Open the frontend at the address Vite prints in the terminal (typically `http://localhost:5173`).
7. Once the backend is running, visit the interactive API documentation at `http://localhost:3000/docs`.

## Core Features

* User registration, login, logout, and logout of all active sessions, all secured with JWT authentication.
* Full task lifecycle: create, read, update, and delete.
* Task filtering by completion status, priority, category, and due date, along with keyword search and sorting.
* Sharing a task with another user by email, with the ability to revoke that access later.
* A dedicated view for tasks that other people have shared with you.
* Profile management, including avatar upload, avatar removal, and account deletion.
* A friendly 404 page for any unmatched route.
* Interactive, fully testable API documentation generated with Swagger.

## Documentation

See `backend/README.md` for API details, environment variables, data models, and authentication. See `frontend/README.md` for the page and component structure, routing, state management, and styling approach.
