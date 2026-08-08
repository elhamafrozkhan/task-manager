# Task Manager Frontend

Vue 3 single page application built with Vite. Provides the interface for authentication, task management, task sharing, and profile settings.

## Tech Stack

| Package | Purpose |
|---------|---------|
| vue | UI framework, written with the Options API |
| vite | Dev server and production build tool |
| vue-router | Client side routing and auth guards |
| pinia | Shared state for auth and notifications |
| tailwindcss | Utility class styling, v4 via the Vite plugin |
| axios | HTTP client with an auth token interceptor |

## Environment Variables

Create a `.env` file in this folder.

| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3000` | Base URL of the backend API |

Vite bakes environment variables in at build time, so when deploying, set `VITE_API_URL` to your deployed backend address in the hosting provider's environment settings before the build runs.

## Setup

| Step | Action |
|------|--------|
| 1 | `npm install` |
| 2 | Create `.env` with `VITE_API_URL` |
| 3 | Start the backend and confirm it is reachable at that URL |
| 4 | `npm run dev` |
| 5 | Open the address Vite prints, typically `http://localhost:5173` |

## Scripts

| Command | Behavior |
|---------|----------|
| `npm run dev` | Start the dev server with hot module reloading |
| `npm run build` | Produce an optimized build in `dist/` |
| `npm run preview` | Serve the production build locally |

## Folder Structure

| Path | Responsibility |
|------|----------------|
| `src/main.js` | Creates the app, installs Pinia and Router, mounts to the DOM |
| `src/App.vue` | Root layout. Renders Navbar, active route, and global Toast |
| `src/router/index.js` | Route table plus the guard protecting private pages |
| `src/stores/auth.js` | Logged in user, JWT, and avatar state, persisted to local storage |
| `src/stores/notification.js` | Toast message state with auto dismiss |
| `src/services/api.js` | Axios instance with base URL and bearer token interceptor |
| `src/components/` | All pages and reusable UI pieces |
| `src/style.css` | Tailwind entry point |

## Routes

| Path | Component | Access |
|------|-----------|--------|
| `/` | Dashboard | Protected |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/profile` | Profile | Protected |
| `/shared` | SharedTasks | Protected |
| `/:pathMatch(.*)*` | NotFound | Public |

Protected routes redirect to `/login` when no token is present in the auth store.

## Components

| Component | Role |
|-----------|------|
| `Navbar.vue` | Top bar with logo, navigation links, and the avatar user menu |
| `Login.vue` | Email and password sign in |
| `Register.vue` | New account creation |
| `Dashboard.vue` | Task statistics, filters, search, sorting, and the task list |
| `AddTaskForm.vue` | Create a task with priority, due date, category, and tags |
| `TaskItem.vue` | Single task card with inline editing and sharing controls |
| `TaskBadges.vue` | Priority, category, due date, and tag pills |
| `SharedTasks.vue` | Tasks other users have shared with you |
| `Profile.vue` | Account details, avatar upload, account deletion |
| `Toast.vue` | Fixed position success and error notifications |
| `NotFound.vue` | Fallback page for unmatched routes |

## Authentication Flow

| Stage | What Happens |
|-------|--------------|
| Login or register | Backend returns a user object and a JWT |
| Store | Both are saved to the Pinia auth store and mirrored to local storage |
| Reload | State rehydrates from local storage, so the session survives a refresh |
| Requests | The Axios interceptor attaches `Authorization: Bearer <token>` automatically |
| Navigation | The router guard redirects to `/login` if a protected route is opened without a token |
| Logout | Store and local storage are cleared, then the user is routed to `/login` |
