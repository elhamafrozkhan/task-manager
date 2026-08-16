# Task Manager

A full stack task management application. Node.js and Express REST API backed by MongoDB, paired with a Vue 3 single page application styled using Tailwind CSS.

## Live Demo

| | Link |
|---|---|
| Application | https://task-manager-ioapp.vercel.app |
| API Documentation | https://site--task-manager--5zdfgqx7ghtc.code.run/docs |

**No signup needed.** Log in with the demo account below, it comes preloaded with tasks covering every feature.

| Field | Value |
|-------|-------|
| Email | `demo@taskmanager.app` |
| Password | `DemoAccess2026` |

### What to look at

| Feature | Where |
|---------|-------|
| Task statistics | Dashboard header, 19 tasks with completed, pending, and overdue counts |
| Filtering and sorting | Filter bar, tasks span all 4 categories and all 3 priority levels |
| Search | Search box on the dashboard and on the shared tasks page |
| Editing | Expand any task to change its description, priority, due date, category, or tags |
| Sharing outward | 4 dashboard tasks are shared with teammates, listed on each task card |
| Sharing with several people | "Prepare slides for client demo" is shared with two people at once |
| Shared with you | The Shared Tasks page holds 10 tasks from two different colleagues |
| Profile | Update account details and upload an avatar |
| API reference | Swagger UI at `/docs`, with live request testing |

### Other demo accounts

Two more accounts exist so the sharing feature can be seen from every angle. Log in as either one to view the same shared tasks from the other side.

| Name | Email | Password |
|------|-------|----------|
| Alex Carter | `alex@taskmanager.app` | `AlexDemo2026` |
| Elham Khan | `elham@taskmanager.app` | `ElhamDemo2026` |

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
