# Task Manager Frontend

The client application for the Task Manager project, built with Vue 3 and Vite. It provides the user interface for registering, logging in, managing tasks, sharing tasks with other users, and maintaining a profile.

## Tech Stack

* **Vue 3**, written using the Options API throughout.
* **Vite** as the development server and build tool.
* **Vue Router** for client side page navigation, including a route guard that redirects unauthenticated users to the login page.
* **Pinia** for shared application state, used for authentication data and toast notifications.
* **Tailwind CSS (version 4)** for all styling, applied through utility classes.
* **Axios** for communicating with the backend API, configured with an interceptor that automatically attaches the logged in user's JWT to every request.

## Environment Variables

Create a `.env` file in the `frontend` folder with the following variable:

* `VITE_API_URL` — the base URL of the backend API, for example `http://localhost:3000` during local development.

When deploying the frontend, this value should be set to the address of your deployed backend through your hosting provider's environment configuration, since Vite bakes environment variables into the build at build time.

## Getting Started

1. Install dependencies:
   `npm install`
2. Create the `.env` file described above.
3. Make sure the backend is running and reachable at the URL you configured.
4. Start the development server:
   `npm run dev`
5. Open the address Vite prints in the terminal, typically `http://localhost:5173`.

## Available Scripts

* `npm run dev` starts the Vite development server with hot module reloading.
* `npm run build` produces an optimized production build in the `dist` folder.
* `npm run preview` serves the production build locally so it can be checked before deployment.

## Folder Structure

* `src/main.js` creates the Vue application, installs Pinia and Vue Router, and mounts the app.
* `src/App.vue` is the root component. It renders the Navbar on every page, the current route's component through `router-view`, and the global Toast notification.
* `src/router/index.js` defines every page route and a navigation guard that protects the dashboard, profile, and shared tasks pages from users who are not logged in.
* `src/stores/auth.js` is a Pinia store holding the logged in user, their JWT, and avatar display state, persisted to local storage across page reloads.
* `src/stores/notification.js` is a Pinia store that powers the Toast component, letting any part of the app trigger a temporary success or error message.
* `src/services/api.js` is a configured Axios instance used for every API call, with the backend base URL and authentication header applied automatically.
* `src/components/` contains every page and reusable UI piece, described below.
* `src/style.css` imports Tailwind CSS into the project.

## Pages and Components

* `Navbar.vue` is the top navigation bar, showing the app logo, main links, and a user menu with the account avatar, name, and a logout option once logged in.
* `Login.vue` and `Register.vue` are the authentication pages.
* `Dashboard.vue` is the main task list page, including summary statistics, the add task form, filtering and sorting controls, keyword search, and the list of tasks.
* `AddTaskForm.vue` is the form used to create a new task from the dashboard.
* `TaskItem.vue` renders a single task as a card, including its badges, editing controls, and sharing controls.
* `TaskBadges.vue` renders the small pills used to display a task's priority, category, due date, and tags.
* `SharedTasks.vue` lists tasks that other users have shared with the logged in user.
* `Profile.vue` lets the logged in user update their account details, change their avatar, and delete their account.
* `Toast.vue` displays temporary success and error notifications in a fixed position above the page content.
* `NotFound.vue` is shown for any route that does not match a known page.

## Authentication Flow

When a user logs in or registers, the backend returns a user object and a JWT. Both are saved in the `auth` Pinia store and mirrored to local storage so the session survives a page reload. Every Axios request automatically includes this token through the interceptor in `src/services/api.js`, and the router guard in `src/router/index.js` redirects to the login page whenever a protected route is visited without a valid session.
