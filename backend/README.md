# Task Manager Backend

REST API server built with Node.js, Express, and MongoDB. Handles user accounts, JWT authentication, task storage, task sharing, avatar uploads, and interactive API documentation.

## Tech Stack

| Package | Purpose |
|---------|---------|
| express | HTTP server and routing |
| mongoose | MongoDB object modeling and schema validation |
| jsonwebtoken | Issue and verify authentication tokens |
| bcryptjs | Hash passwords before storage |
| multer | Accept avatar file uploads |
| sharp | Resize and normalize avatar images |
| @sendgrid/mail | Welcome and cancellation emails |
| swagger-jsdoc | Build the OpenAPI spec from route comments |
| swagger-ui-express | Serve the interactive docs page |
| jest, supertest | Automated testing |
| env-cmd, nodemon | Load env files and restart on change |

## Folder Structure

| Path | Responsibility |
|------|----------------|
| `src/index.js` | Entry point. Creates the app, registers routers, starts the server |
| `src/app.js` | Configured Express instance for testing without binding a port |
| `src/db/mongoose.js` | Opens the MongoDB connection on startup |
| `src/models/user.js` | User schema, password hashing, JWT generation, tasks virtual |
| `src/models/task.js` | Task schema including sharing and ownership fields |
| `src/middleware/auth.js` | Verifies the bearer token and attaches `req.user` |
| `src/routers/user.js` | Account, session, profile, and avatar routes |
| `src/routers/task.js` | Task CRUD, filtering, and sharing routes |
| `src/emails/account.js` | SendGrid transactional email helpers |
| `src/swagger.js` | OpenAPI definition, reusable schemas, security scheme |
| `config/*.env` | Environment variables. Excluded from version control |

## Environment Variables

Create `config/dev.env` for development and `config/test.env` for the test suite.

| Variable | Description |
|----------|-------------|
| `PORT` | Port the server listens on |
| `MONGODB_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign and verify auth tokens |
| `SENDGRID_API_KEY` | API key for outbound account emails |

Both env files are already covered by `.gitignore`, so real secrets stay out of the repository.

## Setup

| Step | Action |
|------|--------|
| 1 | `npm install` |
| 2 | Create `config/dev.env` with the variables above |
| 3 | Start MongoDB locally, or point `MONGODB_URL` at a hosted database such as Atlas |
| 4 | `npm run dev` |
| 5 | Visit `http://localhost:3000/docs` for the interactive API reference |

If you do not have a SendGrid account, a placeholder key is fine. Email sending fails quietly and does not block any other feature.

## Scripts

| Command | Behavior |
|---------|----------|
| `npm start` | Run the server with plain Node |
| `npm run dev` | Run with Nodemon and `config/dev.env` |
| `npm test` | Run Jest against `config/test.env` |

## Authentication

Registration and login both return a signed JWT alongside the user profile. The client stores that token and sends it on every subsequent request:

```
Authorization: Bearer <token>
```

The `auth` middleware verifies the token on protected routes and responds with `401` when it is missing, expired, or no longer present in the user's active token list. Logging out removes the current token, and logging out of all sessions clears every token on the account.

## Data Models

### User

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Required, trimmed |
| `email` | String | Required, unique, validated, lowercased |
| `password` | String | Required, min length 7, hashed before save |
| `age` | Number | Optional, must be non negative |
| `tokens` | Array | Active session tokens |
| `avatar` | Buffer | Optional profile image |

Password, tokens, and avatar are stripped from every JSON response. Deleting a user cascades to delete all of their tasks.

### Task

| Field | Type | Notes |
|-------|------|-------|
| `description` | String | Required, trimmed |
| `completed` | Boolean | Defaults to `false` |
| `priority` | String | `low`, `medium`, or `high` |
| `dueDate` | Date | Optional |
| `category` | String | Defaults to `personal` |
| `tags` | [String] | Defaults to empty |
| `owner` | ObjectId | Reference to the owning user |
| `sharedWith` | [ObjectId] | Users granted view and complete access |

## API Reference

Full request and response details are available at `/docs`. Summary below.

### User Routes

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| POST | `/users` | No | Register a new account |
| POST | `/users/login` | No | Log in with email and password |
| POST | `/users/logout` | Yes | Invalidate the current session token |
| POST | `/users/logoutAll` | Yes | Invalidate every active session |
| GET | `/users/me` | Yes | Return the logged in profile |
| PATCH | `/users/me` | Yes | Update name, email, password, or age |
| DELETE | `/users/me` | Yes | Delete the account and all its tasks |
| POST | `/users/me/avatar` | Yes | Upload or replace the avatar image |
| DELETE | `/users/me/avatar` | Yes | Remove the avatar image |
| GET | `/users/:id/avatar` | No | Fetch a user's avatar as a PNG |
| GET | `/health` | No | Health check |

### Task Routes

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| POST | `/tasks` | Yes | Create a task owned by the current user |
| GET | `/tasks` | Yes | List the user's tasks with filtering, sorting, pagination |
| GET | `/tasks/shared` | Yes | List tasks other users have shared with you |
| GET | `/tasks/:id` | Yes | Fetch a single task |
| PATCH | `/tasks/:id` | Yes | Update a task |
| DELETE | `/tasks/:id` | Yes | Delete an owned task |
| POST | `/tasks/:id/share` | Yes | Share a task with a user by email |
| DELETE | `/tasks/:id/unshare` | Yes | Revoke a user's access to a task |

Owners may update any allowed field. Users a task has been shared with may only toggle `completed`, and any broader change returns `403`.

### Query Parameters

Both `GET /tasks` and `GET /tasks/shared` accept:

| Parameter | Example | Effect |
|-----------|---------|--------|
| `completed` | `true` | Filter by completion state |
| `priority` | `high` | Filter by priority |
| `category` | `work` | Filter by category |
| `dueDate` | `2026-08-10` | Filter by due date |
| `sortBy` | `dueDate:desc` | Sort by any field, ascending or descending |
| `limit` | `10` | Page size |
| `skip` | `20` | Records to skip |

## API Documentation

The OpenAPI spec is generated from JSDoc comments above each route by `swagger-jsdoc`, then served by `swagger-ui-express` at `/docs`. From that page you can browse every endpoint, inspect example request and response bodies, authenticate with a real JWT using the Authorize button, and send live requests against your running server. Reusable schemas and the bearer security scheme live in `src/swagger.js`.

## Testing

Jest and Supertest run against the separate database configured in `config/test.env`, so tests never touch development data.

```
npm test
```
