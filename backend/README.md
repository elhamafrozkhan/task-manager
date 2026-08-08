# Task Manager Backend

The API server for the Task Manager application, built with Node.js, Express, and MongoDB. It handles user accounts, authentication, task storage, task sharing between users, avatar image uploads, and interactive API documentation.

## Tech Stack

* **Node.js and Express** for the HTTP server and routing.
* **MongoDB with Mongoose** for data storage and schema validation.
* **jsonwebtoken** for issuing and verifying JSON Web Tokens used to authenticate requests.
* **bcryptjs** for hashing user passwords before they are stored.
* **Multer and Sharp** for accepting avatar image uploads and resizing them to a consistent format.
* **SendGrid** for sending welcome and account cancellation emails.
* **swagger jsdoc and swagger ui express** for generating and serving interactive API documentation.
* **Jest and Supertest** for automated testing.
* **env cmd** for loading environment specific configuration files.

## Folder Structure

* `src/index.js` is the application entry point. It creates the Express app, registers middleware and routers, and starts listening on the configured port.
* `src/app.js` defines a configured Express app instance, primarily useful for automated testing without starting a real server.
* `src/db/mongoose.js` connects to MongoDB using Mongoose when the app starts.
* `src/models/user.js` defines the User schema, including password hashing, JWT generation, and the virtual relationship to a user's tasks.
* `src/models/task.js` defines the Task schema, including description, completion state, priority, due date, category, tags, owner, and the list of users a task is shared with.
* `src/middleware/auth.js` reads the `Authorization` header from incoming requests, verifies the JWT, and attaches the authenticated user to `req.user`.
* `src/routers/user.js` contains all user related routes: registration, login, logout, profile management, and avatar handling.
* `src/routers/task.js` contains all task related routes: creating, listing, retrieving, updating, deleting, and sharing tasks.
* `src/emails/account.js` sends transactional emails through SendGrid.
* `src/swagger.js` builds the OpenAPI specification used by the documentation page.
* `config/dev.env` and `config/test.env` hold environment variables for local development and for the test suite. These files are excluded from version control.

## Environment Variables

Create a `config/dev.env` file (and a matching `config/test.env` for running tests) with the following variables:

* `PORT` — the port the server listens on.
* `MONGODB_URL` — the connection string for your MongoDB database.
* `JWT_SECRET` — a secret string used to sign and verify authentication tokens.
* `SENDGRID_API_KEY` — an API key for sending account emails through SendGrid.

These files are already listed in `.gitignore` so real secrets are never committed.

## Getting Started

1. Install dependencies:
   `npm install`
2. Create `config/dev.env` with the variables listed above. If you don't have a SendGrid account, you can use a placeholder key; email sending will simply fail silently in that case.
3. Make sure MongoDB is running locally, or point `MONGODB_URL` at a hosted database such as MongoDB Atlas.
4. Start the server in development mode:
   `npm run dev`
5. The API will be available at `http://localhost:3000` (or whichever port you configured), and the interactive documentation will be available at `http://localhost:3000/docs`.

## Available Scripts

* `npm start` runs the server using the plain Node runtime.
* `npm run dev` runs the server with Nodemon for automatic restarts, loading variables from `config/dev.env`.
* `npm test` runs the Jest test suite, loading variables from `config/test.env`.

## Authentication

Authentication uses JSON Web Tokens. When a user registers or logs in, the server generates a token and returns it alongside the user's profile. The client is expected to store this token and send it on every subsequent request as an `Authorization: Bearer <token>` header. The `auth` middleware in `src/middleware/auth.js` verifies this token on every protected route and rejects the request with a 401 status if it is missing or invalid.

## Data Models

**User** includes name, email, a hashed password, an optional age, an array of active session tokens, and an optional avatar image stored as binary data. Passwords are hashed automatically before saving, and sensitive fields such as the password, tokens, and avatar are stripped out of any JSON response.

**Task** includes a description, a completed flag, a priority level (low, medium, or high), an optional due date, a category, an array of free form tags, the owning user, and an array of user ids the task has been shared with.

## API Overview

All routes below are documented in full detail, including request bodies and response shapes, at `/docs` once the server is running. A summary:

**User routes**

* `POST /users` registers a new account.
* `POST /users/login` logs in with an email and password.
* `POST /users/logout` invalidates the current session's token.
* `POST /users/logoutAll` invalidates every active session for the user.
* `GET /users/me` returns the logged in user's profile.
* `PATCH /users/me` updates the logged in user's profile.
* `DELETE /users/me` deletes the logged in user's account.
* `POST /users/me/avatar` uploads or replaces the logged in user's avatar image.
* `DELETE /users/me/avatar` removes the logged in user's avatar image.
* `GET /users/:id/avatar` returns a user's avatar image.
* `GET /health` is a simple health check endpoint.

**Task routes**

* `POST /tasks` creates a new task owned by the logged in user.
* `GET /tasks` returns the logged in user's tasks, supporting filtering by completion, priority, category, and due date, plus sorting, limiting, and pagination through query parameters.
* `GET /tasks/shared` returns tasks that other users have shared with the logged in user.
* `GET /tasks/:id` returns a single task by id.
* `PATCH /tasks/:id` updates a task. Owners can change any allowed field; users a task has been shared with may only toggle its completed state.
* `DELETE /tasks/:id` deletes a task owned by the logged in user.
* `POST /tasks/:id/share` shares a task with another registered user by email.
* `DELETE /tasks/:id/unshare` removes another user's access to a shared task.

## API Documentation

The full API specification is generated automatically from JSDoc style comments above each route, using swagger jsdoc, and served as an interactive page using swagger ui express at `/docs`. From that page you can browse every endpoint, see example request and response bodies, authenticate using the built in Authorize button with a real JWT, and send live requests directly against your running server. The specification's reusable schemas and security scheme are defined in `src/swagger.js`.

## Testing

Automated tests run with Jest and Supertest against a dedicated test database configured in `config/test.env`, so they never touch your development data. Run them with `npm test`.
