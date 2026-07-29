# Frontend Implementation Plan: Task Manager Portfolio Project

## TL;DR

Build a professional Vue.js task management frontend with Tailwind CSS that showcases intermediate-to-advanced skills. The app will include task categorization, priorities, due dates, and basic collaboration features. This requires minimal backend additions (new fields on Task model, one new endpoint for sharing tasks). The frontend will be structured as a modern SPA with component-based architecture, authentication state management (Vue's Pinia store), real-time UI updates, and professional polish.

---

## Discovery Summary

**Current Backend Capabilities:**
- ✅ User authentication (JWT tokens)
- ✅ Task CRUD with filtering, pagination, sorting
- ✅ User profiles with avatars
- ✅ Email notifications
- ✅ CORS enabled

**Gaps to Address:**
- ❌ No task categories/priorities support
- ❌ No due dates
- ❌ No task sharing/collaboration
- ❌ No user avatars in task listings (minor optimization)

---

## Phase 1: Backend Enhancements (Prerequisite for Frontend)

### 1.1 Update Task Model
**File:** `src/models/task.js`

**Changes needed:**
- Add `priority` field: String enum (low, medium, high) with default 'medium'
- Add `dueDate` field: Date (optional)
- Add `category` field: String (e.g., "Work", "Personal", "Shopping") with default 'Personal'
- Add `tags` field: Array of Strings (optional, for flexibility)
- Add `sharedWith` field: Array of ObjectIds referencing Users (for collaboration)

**Validation:**
- Priority must be from allowed enum
- Due date should validate that it's not in the past (optional)
- Category can be user-defined (consider storing as string)

### 1.2 Create Collaboration/Sharing Endpoint
**File:** `src/routers/task.js` (add new routes)

**New endpoints:**
- `POST /tasks/:id/share` - Share a task with another user (requires email)
- `DELETE /tasks/:id/unshare/:userId` - Remove user from shared task
- `GET /tasks/shared` - Get tasks shared with current user

**Permissions:**
- Only task owner can share
- Shared users can view and mark complete, but only owner can edit/delete
- Shared users can see the owner info

### 1.3 Enhance Get Tasks Response
**File:** `src/routers/task.js` (modify GET /tasks)

**Changes:**
- Populate owner user details (name, avatar) so frontend can display them
- Add support for filtering by category, priority, dueDate
- Example query: `GET /tasks?completed=false&priority=high&sortBy=dueDate:asc`

### 1.4 Add Timestamps Endpoint
**File:** `src/routers/user.js` (add new route)

**New endpoint:**
- `GET /users/me/stats` - Return user statistics (task count, categories, etc.)

---

## Phase 2: Frontend Project Setup

### 2.1 Initialize Vue 3 + Vite Project

**Command:**
```bash
npm create vite@latest task-manager-frontend -- --template vue
cd task-manager-frontend
npm install
```

**Install dependencies:**
```bash
npm install axios pinia vue-router tailwindcss postcss autoprefixer
npm install -D @tailwindcss/forms @tailwindcss/typography
```

**Project structure after setup:**
```
task-manager-frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── tasks/
│   │   ├── auth/
│   │   └── profile/
│   ├── stores/
│   ├── views/
│   ├── router/
│   ├── services/
│   ├── App.vue
│   └── main.js
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

### 2.2 Configure Tailwind CSS

**Setup Tailwind:**
- `npx tailwindcss init -p` to generate config files
- Configure template paths to include all .vue, .js files
- Import Tailwind directives in main CSS file
- Use plugin: @tailwindcss/forms for better form styling

---

## Phase 3: Core Architecture & Infrastructure

### 3.1 API Service Layer
**File:** `src/services/api.js`

**Purpose:** Centralized HTTP client for all backend communication
- Create axios instance with base URL (http://localhost:3000)
- Add request interceptor to attach JWT token to Authorization header
- Add response interceptor to handle auth errors (redirect to login)
- Export methods: `get()`, `post()`, `patch()`, `delete()`

### 3.2 State Management (Pinia Store)
**Files:** `src/stores/` (create 3 store modules)

**Store 1: auth.js**
- State: currentUser, token, loading, error
- Actions: login(), register(), logout(), fetchCurrentUser(), updateProfile()
- Getters: isAuthenticated, hasProfile

**Store 2: tasks.js**
- State: tasks[], filters{}, loading, error
- Actions: fetchTasks(), createTask(), updateTask(), deleteTask(), shareTask()
- Getters: filteredTasks, completedCount, pendingCount

**Store 3: ui.js**
- State: currentView, filters{}, sortBy, searchQuery, notification
- Actions: setFilters(), setSort(), showNotification()
- Getters: for UI state

### 3.3 Router Configuration
**File:** `src/router/index.js`

**Routes:**
- `/` → Dashboard (redirect to /tasks if authenticated)
- `/auth/register` → Registration page
- `/auth/login` → Login page
- `/tasks` → Task dashboard (protected)
- `/tasks/:id` → Task detail view (protected)
- `/profile` → User profile (protected)
- `/settings` → Account settings (protected)
- `*` → 404 page

**Route guard:** Check auth token before accessing protected routes

---

## Phase 4: Component Architecture

### 4.1 Layout Components
**Files:** `src/components/common/`

- `Navbar.vue` - Top navigation with user menu, logout
- `Sidebar.vue` - Left sidebar with filters and categories (collapsible on mobile)
- `MainLayout.vue` - Wrapper combining Navbar + Sidebar + main content
- `AuthLayout.vue` - Simple layout for login/register pages

### 4.2 Authentication Components
**Files:** `src/components/auth/`

- `LoginForm.vue` - Email + password form
- `RegisterForm.vue` - Name, email, password form with validation
- `AuthGuard.vue` - Redirect if not authenticated

### 4.3 Task Components
**Files:** `src/components/tasks/`

- `TaskList.vue` - Main list view with filters applied
- `TaskCard.vue` - Individual task card (shows title, priority, dueDate, category, owner)
- `TaskForm.vue` - Create/edit task modal form
- `TaskDetail.vue` - Full task view with sharing options
- `TaskFilters.vue` - Filter sidebar (completed, priority, category, due date)
- `TaskShare.vue` - Modal for sharing task with other users
- `CategoryBadge.vue` - Small badge component for category display
- `PriorityBadge.vue` - Color-coded priority indicator

### 4.4 Profile Components
**Files:** `src/components/profile/`

- `ProfileCard.vue` - Display user info, avatar, stats
- `ProfileEditor.vue` - Edit name, age, email
- `AvatarUploader.vue` - Upload avatar image
- `UsersList.vue` - List of users (for sharing feature)

### 4.5 Common Reusable Components
**Files:** `src/components/common/`

- `Modal.vue` - Reusable modal wrapper
- `Button.vue` - Styled button component (primary, secondary, danger)
- `Input.vue` - Styled input with validation messages
- `Dropdown.vue` - Reusable dropdown menu
- `Notification.vue` - Toast notification component
- `Loading.vue` - Loading spinner
- `EmptyState.vue` - Empty list state with illustration/message

---

## Phase 5: Page/View Components

**Files:** `src/views/`

### 5.1 Dashboard View
- Header: "My Tasks" + create button
- Quick stats: Total tasks, Completed, Pending, Overdue
- Task filters sidebar (category, priority, completion, due date)
- Search bar
- Bulk actions toolbar (select multiple, mark complete, delete)
- Main task list with sorting options (due date, priority, created date)
- Add task floating action button (FAB) at bottom-right

### 5.2 Task Detail View
- Full task details in a page
- Edit button, delete button, share button
- Task history (timestamps of creation/updates)
- Shared users list
- Comments section (optional for intermediate level)

### 5.3 Profile View
- User avatar and info card
- Edit profile section
- Avatar uploader
- Statistics: tasks created, tasks completed, categories used
- Logout button at bottom

### 5.4 Settings View
- Change password
- Logout from all devices
- Delete account (with confirmation modal)
- Privacy settings

---

## Phase 6: Features & UI/UX Design

### 6.1 Design System with Tailwind

**Color Palette:**
- Primary: Indigo (600-900)
- Secondary: Slate (200-600)
- Accent: Emerald (for success/complete)
- Danger: Red
- Warning: Amber

**Typography:**
- Headings: Inter font family, bold
- Body: Inter, regular
- Use semantic sizes: text-xs, text-sm, text-base, text-lg

**Component Spacing:**
- Use Tailwind's padding/margin scale (p-2 to p-8, m-2 to m-8)
- Gap for flexbox: gap-2 to gap-6
- Shadows for depth: shadow-sm, shadow-md, shadow-lg on cards

### 6.2 Feature Implementation Order

**MVP (Minimum Viable Product):**
1. ✅ Authentication (login, register, logout)
2. ✅ Task CRUD (create, read, update, delete)
3. ✅ Task list with basic filtering (completed/pending)
4. ✅ User profile view

**Intermediate Features (add after MVP):**
1. ✅ Task categories + priorities
2. ✅ Due dates with visual indicators (color coding for overdue)
3. ✅ Search tasks
4. ✅ Sorting (by due date, priority)
5. ✅ Task sharing with other users
6. ✅ User avatars in cards
7. ✅ Dashboard stats/summary
8. ✅ Notification toasts on actions

**Polish & Advanced (if time permits):**
1. Dark mode toggle
2. Keyboard shortcuts for common actions
3. Drag-and-drop task reordering
4. Task duplication
5. Recurring tasks
6. Comments/notes on tasks
7. Activity log
8. Collaboration features (real-time updates with WebSocket)

### 6.3 Complete UI Design Visualization

#### **Color Palette Reference**
```
┌────────────────────────────────────────────────────────┐
│ PRIMARY COLORS                                         │
├────────────────────────────────────────────────────────┤
│ 🔵 Indigo-600:  #4F46E5  (Buttons, Links, Accents)   │
│ 🔵 Indigo-700:  #4338CA  (Hover States)              │
│ 🔵 Indigo-900:  #312E81  (Headings, Dark Text)       │
├────────────────────────────────────────────────────────┤
│ SEMANTIC COLORS                                        │
├────────────────────────────────────────────────────────┤
│ 🟢 Emerald-500: #10B981  (Success, Completed)         │
│ 🟡 Amber-500:   #F59E0B  (Warning, Overdue Soon)      │
│ 🔴 Red-500:     #EF4444  (Danger, Overdue)            │
│ ⚪ Slate-50:    #F8FAFC  (Background)                 │
│ ⚫ Slate-900:   #0F172A  (Text)                       │
└────────────────────────────────────────────────────────┘
```

#### **1. Dashboard Main Page (Desktop View)**
```
╔════════════════════════════════════════════════════════════════════╗
║                    📋 TASK MANAGER DASHBOARD                       ║
╠═══════════════╦═══════════════════════════════════════════════════╣
║               ║                                                   ║
║  📂 FILTERS   ║              MAIN CONTENT AREA                   ║
║  ─────────────╬───────────────────────────────────────────────────║
║               ║                                                   ║
║ 📊 Stats:     ║  My Tasks (24)           🔍 [Search...]  [➕ New] ║
║ • Total: 24   ║                                                   ║
║ • Done: 12    ║  ┌─────────────────────────────────────────────┐ ║
║ • Pending: 12 ║  │ [HIGH] 🔴 Buy Groceries        [Today] [✓]  │ ║
║ • Overdue: 2  ║  │ Personal • Created 2 hours ago              │ ║
║               ║  └─────────────────────────────────────────────┘ ║
║ Filter:       ║  ┌─────────────────────────────────────────────┐ ║
║ ☑ Pending     ║  │ [MED] 🟡 Finish Report          [Tomorrow]  │ ║
║ ☑ Completed   ║  │ Work • Created 1 day ago • Shared with John │ ║
║ ☐ All         ║  └─────────────────────────────────────────────┘ ║
║               ║  ┌─────────────────────────────────────────────┐ ║
║ Category:     ║  │ [LOW] ⚪ Read article           [Next Week]  │ ║
║ ☑ Personal    ║  │ Learning • Created 3 days ago              │ ║
║ ☑ Work        ║  └─────────────────────────────────────────────┘ ║
║ ☑ Shopping    ║  ┌─────────────────────────────────────────────┐ ║
║               ║  │ [HIGH] 🔴 Fix bug              [OVERDUE] ⚠️  │ ║
║ Priority:     ║  │ Work • Created 5 days ago                   │ ║
║ ☑ High        ║  └─────────────────────────────────────────────┘ ║
║ ☑ Medium      ║                                                   ║
║ ☑ Low         ║                         [+] Add Task (FAB)        ║
║               ║                                                   ║
║ 👤 John       ║                                                   ║
║ 🚪 Logout     ║                                                   ║
║               ║                                                   ║
╚═══════════════╩═══════════════════════════════════════════════════╝
```

#### **2. Login Page**
```
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║                                                                    ║
║                    📋 TaskManager Login                            ║
║                                                                    ║
║            ┌──────────────────────────────────────┐               ║
║            │                                      │               ║
║            │  📧 Email                            │               ║
║            │  [___________________________]        │               ║
║            │                                      │               ║
║            │  🔐 Password                         │               ║
║            │  [___________________________]        │               ║
║            │                                      │               ║
║            │     [🔵 Sign In]                     │               ║
║            │                                      │               ║
║            │  Don't have an account? [Sign Up]    │               ║
║            │                                      │               ║
║            └──────────────────────────────────────┘               ║
║                                                                    ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

#### **3. Task Detail View**
```
╔════════════════════════════════════════════════════════════════════╗
║ ← Back  │  Buy Groceries                      [✎ Edit] [🗑 Delete]║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║ [HIGH - RED BADGE] Personal                                       ║
║                                                                    ║
║ Description:                                                       ║
║ Buy groceries for the week - milk, bread, vegetables              ║
║                                                                    ║
║ ───────────────────────────────────────────────────────────────   ║
║                                                                    ║
║ 📅 Due Date:     Today (Apr 27, 2026) ⚠️ Due Soon                ║
║ ✓ Completed:     No                                               ║
║ 👤 Owner:        You                                              ║
║ 📝 Created:      Apr 25, 2026 at 10:30 AM                         ║
║ ⏱️  Updated:     Apr 27, 2026 at 02:15 PM                         ║
║                                                                    ║
║ ───────────────────────────────────────────────────────────────   ║
║                                                                    ║
║ 🔗 Shared With:                        [🔐 Add People]            ║
║ • John Smith (john@example.com)        [Remove]                   ║
║ • Sarah Jones (sarah@example.com)      [Remove]                   ║
║                                                                    ║
║ ───────────────────────────────────────────────────────────────   ║
║                                                                    ║
║ Actions:                                                           ║
║ [✓ Mark Complete]  [🔄 Duplicate]  [📤 Share]                     ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

#### **4. Create/Edit Task Modal**
```
╔════════════════════════════════════════════════════════════════════╗
║                     Create New Task                           [✕]  ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  📝 Task Description *                                            ║
║  [____________________________________________________]            ║
║                                                                    ║
║  📅 Due Date                                                       ║
║  [2026-04-28]  ▼                                                   ║
║                                                                    ║
║  Priority                    Category                              ║
║  [Low ▼]                    [Personal ▼]                           ║
║                                                                    ║
║  🏷️  Tags (optional)                                              ║
║  [urgent] [shopping]  [Add Tag +]                                 ║
║                                                                    ║
║  ───────────────────────────────────────────────────────────────  ║
║                                                                    ║
║                    [Cancel]  [🔵 Create Task]                      ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

#### **5. Profile Page**
```
╔════════════════════════════════════════════════════════════════════╗
║ My Profile                                                    [⚙️]  ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  ┌──────────────────────────┐      👤 John Doe                    ║
║  │                          │      📧 john@example.com            ║
║  │     [👤 Avatar]          │      🎂 Age: 28                     ║
║  │                          │                                     ║
║  │  [📷 Change Avatar]      │      [✏️  Edit Profile]             ║
║  │  [🗑️  Remove Avatar]     │                                     ║
║  └──────────────────────────┘                                     ║
║                                                                    ║
║  ───────────────────────────────────────────────────────────────  ║
║                                                                    ║
║  📊 Statistics                                                     ║
║  ┌──────────────────────┐  ┌──────────────────────┐               ║
║  │ Total Tasks    24    │  │ Completed Tasks 12   │               ║
║  └──────────────────────┘  └──────────────────────┘               ║
║  ┌──────────────────────┐  ┌──────────────────────┐               ║
║  │ Active Tasks   12    │  │ Completion Rate 50%  │               ║
║  └──────────────────────┘  └──────────────────────┘               ║
║                                                                    ║
║  ───────────────────────────────────────────────────────────────  ║
║                                                                    ║
║  🔧 Settings                                                       ║
║  [🔐 Change Password]                                              ║
║  [🌐 Logout All Devices]                                           ║
║  [🗑️  Delete Account]                                              ║
║                                                                    ║
║  [🚪 Logout]                                                       ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

#### **6. Mobile Responsive View (320px)**
```
┌──────────────────────┐
│ 📋 ☰ │ [🔍 Search] │ 👤 │
├──────────────────────┤
│                      │
│ My Tasks (24)        │
│                      │
│ [Filter ▼] [Sort ▼]  │
│                      │
│ ┌──────────────────┐ │
│ │[HIGH] Buy milk   │ │
│ │Personal | Today  │ │
│ └──────────────────┘ │
│                      │
│ ┌──────────────────┐ │
│ │[MED] Finish code │ │
│ │Work | Tomorrow   │ │
│ └──────────────────┘ │
│                      │
│ ┌──────────────────┐ │
│ │[LOW] Read doc    │ │
│ │Edu | Next week   │ │
│ └──────────────────┘ │
│                      │
│           [➕]        │
└──────────────────────┘
```

#### **7. Component Hierarchy Tree**
```
App.vue
├── Router
│   ├── AuthLayout
│   │   ├── LoginView
│   │   │   └── LoginForm
│   │   └── RegisterView
│   │       └── RegisterForm
│   │
│   └── MainLayout
│       ├── Navbar
│       │   ├── SearchBar
│       │   └── UserMenu
│       │
│       ├── Sidebar
│       │   ├── Stats
│       │   ├── TaskFilters
│       │   └── CategoryList
│       │
│       └── Main Content
│           ├── DashboardView
│           │   ├── TaskList
│           │   │   └── TaskCard (x multiple)
│           │   │       ├── CategoryBadge
│           │   │       ├── PriorityBadge
│           │   │       └── Actions
│           │   ├── TaskForm (modal)
│           │   └── EmptyState
│           │
│           ├── TaskDetailView
│           │   ├── TaskDetail
│           │   ├── TaskShare (modal)
│           │   └── UsersList
│           │
│           ├── ProfileView
│           │   ├── ProfileCard
│           │   ├── ProfileEditor (modal)
│           │   ├── AvatarUploader (modal)
│           │   └── Stats
│           │
│           └── SettingsView
│               ├── PasswordForm
│               └── DangerZone
│
├── Stores (Pinia)
│   ├── auth (user, token, loading)
│   ├── tasks (list, filters, sorting)
│   └── ui (notifications, modals)
│
└── Services
    └── api (HTTP client with interceptors)
```

#### **8. User Flow Diagram**
```
START
  │
  ├─→ [Not Authenticated]
  │      │
  │      ├─→ Login Page ──→ [✓ Success] ──→ Store Token
  │      │                      │
  │      │                   [✗ Failed] ──→ Show Error
  │      │
  │      └─→ Register Page ──→ [✓ Success] ──→ Auto Login
  │                               │
  │                            [✗ Failed] ──→ Show Errors
  │
  └─→ [Authenticated] ──→ Dashboard
       │
       ├─→ View Tasks
       │      ├─→ Filter by (Category/Priority/Status)
       │      ├─→ Sort by (Date/Priority)
       │      └─→ Search
       │
       ├─→ Create Task
       │      ├─→ Fill Form (description, due date, priority, category)
       │      ├─→ [✓ Save] ──→ Add to list + Notification
       │      └─→ [✗ Error] ──→ Show error message
       │
       ├─→ Edit Task
       │      ├─→ Update fields
       │      ├─→ [✓ Save] ──→ Update list + Notification
       │      └─→ [✗ Error] ──→ Show error message
       │
       ├─→ Share Task
       │      ├─→ Open Share Modal
       │      ├─→ Search & Select User
       │      ├─→ [✓ Share] ──→ Update + Notification
       │      └─→ [✗ Error] ──→ Show error message
       │
       ├─→ View Profile
       │      ├─→ See Stats & Info
       │      ├─→ Edit Profile
       │      ├─→ Upload Avatar
       │      └─→ Access Settings
       │
       ├─→ Settings
       │      ├─→ Change Password
       │      ├─→ Logout All Devices
       │      └─→ Delete Account
       │
       └─→ Logout ──→ Clear Token ──→ Redirect to Login
```

#### **9. Dashboard Main Page (Enhanced)**
```
╔════════════════════════════════════════════════════════════════════╗
║                    📋 TASK MANAGER DASHBOARD                       ║
╠═══════════════╦═══════════════════════════════════════════════════╣
║               ║                                                   ║
║  📂 FILTERS   ║              🔍 [Search tasks...]      [➕ New]   ║
║  ─────────────╬───────────────────────────────────────────────────║
║               ║                                                   ║
║ 📊 STATS:     ║  My Tasks (24)                                    ║
║ ╔───────────╗ ║  ┌─────────────────┬──────────┬──────────┐        ║
║ │ Total: 24 │ ║  │ Total: 24       │Done: 12  │Pending:12│       ║
║ │ Done: 12  │ ║  └─────────────────┴──────────┴──────────┘        ║
║ │ Pending:12│ ║                                                   ║
║ │ Overdue: 2│ ║  Sort By: [Due Date ▼]  View: [List ▼]           ║
║ ╚───────────╝ ║  ────────────────────────────────────────────────  ║
║               ║                                                   ║
║ FILTER:       ║  ┌──────────────────────────────────────────────┐ ║
║ ☑ Pending     ║  │ 🔴[HIGH] Buy Groceries          [Today] [✓]  │ ║
║ ☑ Completed   ║  │ Personal · 2h ago · Shared: John, Sarah     │ ║
║ ☑ All         ║  │ [Share] [Edit] [Delete]                    │ ║
║               ║  └──────────────────────────────────────────────┘ ║
║ CATEGORY:     ║  ┌──────────────────────────────────────────────┐ ║
║ ☑ Personal    ║  │ 🟡[MED] Finish Report           [Tomorrow]   │ ║
║ ☑ Work (8)    ║  │ Work · 1d ago · Shared: John               │ ║
║ ☑ Shopping    ║  │ [Share] [Edit] [Delete]                    │ ║
║ ☑ Learning    ║  └──────────────────────────────────────────────┘ ║
║               ║  ┌──────────────────────────────────────────────┐ ║
║ PRIORITY:     ║  │ ⚪[LOW] Read Article            [Next Week]  │ ║
║ ☑ High (5)    ║  │ Learning · 3d ago                          │ ║
║ ☑ Medium (9)  ║  │ [Share] [Edit] [Delete]                    │ ║
║ ☑ Low (10)    ║  └──────────────────────────────────────────────┘ ║
║               ║  ┌──────────────────────────────────────────────┐ ║
║ DUE DATE:     ║  │ 🔴[HIGH] Fix Critical Bug        [OVERDUE] ⚠️ │ ║
║ ☑ Today (3)   ║  │ Work · 5d ago                              │ ║
║ ☑ Tomorrow    ║  │ [Share] [Edit] [Delete]                    │ ║
║ ☑ This Week   ║  └──────────────────────────────────────────────┘ ║
║ ☑ Later       ║                                                   ║
║               ║                          [+] Add New Task (FAB)   ║
║ 👤 John Doe   ║                                                   ║
║ 🚪 Logout     ║                                                   ║
║               ║                                                   ║
╚═══════════════╩═══════════════════════════════════════════════════╝
```

---

## Phase 7: Implementation Steps (Detailed Execution Order)

### Step 1: Backend Setup (⏱️ ~30 minutes)
1. Update Task model with category, priority, dueDate, tags, sharedWith fields
2. Add validation for enums and dates
3. Update PATCH /tasks/:id to allow updating new fields
4. Update GET /tasks to support filtering by new fields
5. Add sharing endpoints (POST /tasks/:id/share, DELETE unshare, GET shared)
6. Test all new endpoints

**Deliverable:** All backend changes merged and tested

### Step 2: Frontend Project Init (⏱️ ~15 minutes)
1. Create Vue 3 + Vite project
2. Install dependencies (axios, pinia, vue-router, tailwind)
3. Configure Tailwind CSS
4. Setup project folder structure
5. Create main.js with store and router integration

**Deliverable:** Project runs with `npm run dev`

### Step 3: Infrastructure Layer (⏱️ ~1 hour)
1. Create API service with axios interceptors
2. Create Pinia stores (auth, tasks, ui)
3. Setup router with route guards
4. Create auth guard middleware
5. Test API calls from store actions

**Deliverable:** API service fully functional, stores ready, routing working

### Step 4: Layout & Navigation (⏱️ ~45 minutes)
1. Create MainLayout.vue, AuthLayout.vue
2. Build Navbar component with user menu
3. Build Sidebar component with category filters
4. Create Navigation context (switching between views)
5. Setup responsive design for mobile

**Deliverable:** Navigation skeleton complete, looks good on desktop & mobile

### Step 5: Authentication Pages (⏱️ ~1 hour)
1. Create LoginForm.vue
2. Create RegisterForm.vue
3. Add form validation (email format, password strength)
4. Connect forms to auth store actions
5. Add error/success notifications
6. Setup redirect after login

**Deliverable:** Login and registration fully functional

### Step 6: Task Components (⏱️ ~2 hours)
1. Create TaskCard.vue component
2. Create TaskList.vue to render task cards
3. Create CategoryBadge.vue and PriorityBadge.vue
4. Create TaskFilters.vue with checkboxes/dropdowns
5. Create TaskForm.vue for create/edit
6. Connect to tasks store
7. Add sorting functionality

**Deliverable:** Tasks display, can be filtered, created, edited, deleted

### Step 7: Dashboard View (⏱️ ~1.5 hours)
1. Create dashboard layout with sidebar filters
2. Add task statistics section (total, completed, pending)
3. Implement search functionality
4. Add due date indicators and color coding
5. Create empty state for no tasks
6. Add floating action button for creating tasks
7. Add bulk actions (select multiple, mark complete)

**Deliverable:** Dashboard fully functional with all filtering/sorting

### Step 8: Profile & Settings (⏱️ ~1.5 hours)
1. Create ProfileCard.vue
2. Create ProfileEditor.vue for editing user info
3. Create AvatarUploader.vue
4. Create SettingsView for password change, logout all, delete account
5. Add confirmation modals for destructive actions
6. Display user statistics

**Deliverable:** Profile fully editable, settings accessible

### Step 9: Task Sharing Feature (⏱️ ~1 hour)
1. Create TaskShare.vue modal
2. Add user search functionality (get list of users)
3. Add share button to task card/detail
4. Display shared users list
5. Add unshare functionality
6. Show task owner info on shared tasks

**Deliverable:** Users can share tasks and see shared tasks

### Step 10: Notifications & Polish (⏱️ ~1 hour)
1. Create Notification.vue toast component
2. Add notification state to UI store
3. Show notifications on: task created, task updated, task deleted, shared
4. Add error notifications
5. Add loading states where appropriate
6. Test responsiveness on mobile

**Deliverable:** Full feedback system in place

### Step 11: Testing & Deployment Prep (⏱️ ~1 hour)
1. Test all CRUD operations
2. Test authentication flow
3. Test error handling
4. Test on multiple browsers (Chrome, Firefox, Safari)
5. Test responsiveness (desktop, tablet, mobile)
6. Prepare for deployment: build process, environment variables

**Deliverable:** Application ready for deployment

---

## Phase 8: Folder Structure (Complete)

```
task-manager-frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.vue
│   │   │   ├── Sidebar.vue
│   │   │   ├── MainLayout.vue
│   │   │   ├── AuthLayout.vue
│   │   │   ├── Modal.vue
│   │   │   ├── Button.vue
│   │   │   ├── Input.vue
│   │   │   ├── Notification.vue
│   │   │   ├── Loading.vue
│   │   │   └── EmptyState.vue
│   │   ├── auth/
│   │   │   ├── LoginForm.vue
│   │   │   ├── RegisterForm.vue
│   │   │   └── AuthGuard.vue
│   │   ├── tasks/
│   │   │   ├── TaskList.vue
│   │   │   ├── TaskCard.vue
│   │   │   ├── TaskForm.vue
│   │   │   ├── TaskDetail.vue
│   │   │   ├── TaskFilters.vue
│   │   │   ├── TaskShare.vue
│   │   │   ├── CategoryBadge.vue
│   │   │   └── PriorityBadge.vue
│   │   └── profile/
│   │       ├── ProfileCard.vue
│   │       ├── ProfileEditor.vue
│   │       ├── AvatarUploader.vue
│   │       └── UsersList.vue
│   ├── views/
│   │   ├── DashboardView.vue
│   │   ├── TaskDetailView.vue
│   │   ├── ProfileView.vue
│   │   ├── SettingsView.vue
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   └── NotFoundView.vue
│   ├── stores/
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   └── ui.js
│   ├── services/
│   │   └── api.js
│   ├── router/
│   │   └── index.js
│   ├── styles/
│   │   └── main.css
│   ├── App.vue
│   └── main.js
├── public/
│   └── favicon.ico
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── package.json
```

---

## Verification & Testing Checklist

### Backend Verification:
- [ ] Task model has all new fields (priority, dueDate, category, tags, sharedWith)
- [ ] POST /tasks/:id/share endpoint works
- [ ] DELETE /tasks/:id/unshare/:userId works
- [ ] GET /tasks/shared returns shared tasks
- [ ] Filtering by category/priority/due date works
- [ ] Owner info populated in task response
- [ ] All endpoints return 401 if no token

### Frontend Verification:
- [ ] Login/register form works end-to-end
- [ ] Can create, read, update, delete tasks
- [ ] Can filter by category, priority, completion, due date
- [ ] Can search tasks
- [ ] Can sort tasks by due date, priority, created date
- [ ] Can share tasks and see shared tasks
- [ ] User profile editable
- [ ] Avatar upload works
- [ ] Responsive on mobile (320px), tablet (768px), desktop
- [ ] Error notifications show on failures
- [ ] Loading states appear while fetching
- [ ] Token persists in localStorage across page reloads
- [ ] Logout clears token and redirects to login

---

## Technical Decisions & Rationale

1. **Vue 3 + Vite**: Modern, fast build, excellent DX. Great for portfolio
2. **Pinia**: Simpler than Vuex, perfect for this app's state complexity
3. **Tailwind CSS**: Professional look without writing CSS, good portfolio signal
4. **Axios + Interceptors**: Handles auth token injection automatically
5. **localStorage for token**: Persistence across reloads (could use sessionStorage for more security)
6. **Component-based architecture**: Reusable, maintainable, scalable
7. **No comments/messaging**: Scope-controlled for intermediate level
8. **Basic sharing model**: Enough for portfolio, not too complex

---

## Deployment Considerations

### Frontend Deployment:
- **Build**: `npm run build` → creates `dist/` folder
- **Platforms**: Vercel, Netlify, GitHub Pages (recommended: Vercel for Vue)
- **Environment**: Create `.env.production` with VITE_API_URL pointing to backend
- **Favicon & metadata**: Update HTML meta tags

### Backend Deployment:
- Already deployed (if following course), or deploy to Heroku/Railway/Render

### Environment Variables:
**Frontend (.env.production):**
```
VITE_API_URL=https://your-backend-url.com
```

---

## Summary of Changes Required

### Backend (High Priority):
- ✅ Task model: Add priority, category, dueDate, tags, sharedWith
- ✅ Task router: Add share/unshare endpoints
- ✅ Task router: Enhance GET /tasks with new filters
- ✅ Populate owner info in task responses

### Frontend (New Project):
- ✅ Full Vue 3 SPA with 30+ components
- ✅ Authentication flow with login/register
- ✅ Task management with advanced filtering
- ✅ User profiles and settings
- ✅ Task sharing collaboration
- ✅ Responsive design
- ✅ Professional UI with Tailwind CSS

---

## Timeline Estimate

| Phase | Duration | Notes |
|-------|----------|-------|
| Backend enhancement | 30-45 min | Quick additions to existing code |
| Frontend setup | 15 min | Vite scaffolding |
| Infrastructure | 1 hour | API service, stores, router |
| Layout & navigation | 45 min | Responsive layouts |
| Authentication | 1 hour | Login/register with validation |
| Task components | 2 hours | Cards, lists, forms |
| Dashboard | 1.5 hours | Filters, stats, sorting |
| Profile & settings | 1.5 hours | Editable profile, settings page |
| Task sharing | 1 hour | Collaboration feature |
| Polish & notifications | 1 hour | Toast notifications, feedback |
| Testing & deploy prep | 1 hour | End-to-end testing |
| **TOTAL** | **~11 hours** | Realistic, non-rushed timeline |

---

## Portfolio Highlights to Emphasize

✨ **What makes this a strong portfolio project:**

1. **Full-stack capabilities**: Backend API + professional frontend
2. **Modern tech stack**: Vue 3, Vite, Tailwind, Pinia
3. **Authentication & security**: JWT, token management
4. **Responsive design**: Mobile-first approach
5. **Advanced features**: Collaboration/sharing, filtering, sorting
6. **Component architecture**: Reusable, well-organized code
7. **State management**: Proper Pinia store structure
8. **Error handling**: Comprehensive error and loading states
9. **UX/UI polish**: Professional design with Tailwind
10. **Real-world patterns**: API interceptors, route guards, form validation
