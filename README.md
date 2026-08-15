# Task Manager

A full stack task management application. Node.js and Express REST API backed by MongoDB, paired with a Vue 3 single page application styled using Tailwind CSS.

## Overview

Registered users can create, organize, and track personal tasks. Each task carries a priority level, due date, category, and free form tags. Tasks can be shared with another registered user by email, letting that person view the task and mark it complete without being able to edit or delete it. Every user has a profile page for updating account details and uploading an avatar image.

## Repository Layout

| Path | Contents |
|------|----------|
| `backend/` | Express and MongoDB API server. See [backend/README.md](backend/README.md) |
| `frontend/` | Vue 3 and Vite client application. See [frontend/README.md](frontend/README.md) |
| `package.json` | npm workspaces config so both apps install and run from the root |

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | JSON Web Tokens, bcrypt |
| Media | Multer, Sharp |
| Email | Nodemailer |
| API Docs | Swagger (OpenAPI) |
| Testing | Jest, Supertest |
| Frontend | Vue 3 (Options API), Vite, Vue Router, Pinia |
| Styling | Tailwind CSS v4 |
| HTTP Client | Axios |

## Quick Start

| Step | Command or Action |
|------|-------------------|
| 1. Install dependencies | `npm install` (from project root) |
| 2. Configure backend | Create `backend/config/dev.env`. See [backend/README.md](backend/README.md) |
| 3. Configure frontend | Create `frontend/.env`. See [frontend/README.md](frontend/README.md) |
| 4. Start API server | `npm run dev:backend` |
| 5. Start client | `npm run dev:frontend` (separate terminal) |

| Service | Default URL |
|---------|-------------|
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:3000` |
| API Documentation | `http://localhost:3000/docs` |

## Features

| Area | Capability |
|------|------------|
| Accounts | Register, login, logout, logout of all active sessions |
| Tasks | Create, read, update, delete |
| Organization | Priority, due date, category, tags |
| Discovery | Filter by status, priority, category, and due date, plus keyword search and sorting |
| Collaboration | Share a task by email, revoke access, dedicated view for tasks shared with you |
| Profile | Update account details, upload or remove avatar, delete account |
| Reliability | Route guards on protected pages, toast notifications, custom 404 page |
| Documentation | Interactive Swagger UI with live request testing |
