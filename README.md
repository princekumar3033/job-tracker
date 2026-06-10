# CareerPulse - Job Application Tracker

CareerPulse is a premium, full-stack Job Application Tracker web application designed to help job seekers organize their career search. It features a modern, responsive React frontend (Vite) styled with pure Vanilla CSS glassmorphism, a Node.js/Express REST API, and MongoDB integration.

---

## 🎨 Features

- **Responsive Kanban Board**: Visual status tracking columns (Applied, Interview, Offer, Rejected) supporting HTML5 Drag & Drop as well as mobile drop-down status selector fallbacks.
- **Condensed List View**: Toggle seamlessly to a clean, filterable data table list sorted by dates.
- **Advanced Statistics**: Real-time counter widgets showing total applications, active interview rates, offers secured, and rejections.
- **Job Forms Modal**: Intuitive form to log or edit Company Name, Job Role, Job URL, Date Applied, Status, and Detailed Notes.
- **Secure Authentication**: Register and Login screens with hashed passwords (via `bcryptjs`) and secure JWT (JSON Web Token) authorization stored in `localStorage`.
- **Zero-Config Developer Fallback**: The backend automatically spins up an in-memory MongoDB database (`mongodb-memory-server`) if no cloud/local connection string is supplied in `.env`.
- **Automatic Account Seeding**: Automatically seeds 3 sample applications (Google, Meta, Netflix) for any newly registered or empty profile to populate the board instantly.

---

## 📂 Project Structure

```
D:\job-tracker\
├── README.md               # Project documentation
├── backend\                # Express API Backend
│   ├── .env                # App configuration & ports
│   ├── package.json        # Server-side scripts & dependencies
│   ├── server.js           # Server startup and DB connection
│   ├── middleware\
│   │   └── auth.js         # JWT validation middleware
│   ├── models\
│   │   ├── User.js         # User model & password verification
│   │   └── Job.js          # Job application schema
│   └── routes\
│       ├── auth.js         # Register, Login & seeding routes
│       └── jobs.js         # Job CRUD endpoints
└── frontend\               # Vite + React Frontend
    ├── index.html          # HTML Entrypoint (SEO Title configured)
    ├── package.json        # Client-side scripts & dependencies
    └── src\
        ├── main.jsx        # React DOM render entrypoint
        ├── App.jsx         # App router (conditional rendering)
        ├── index.css       # Core styling & glassmorphism system
        ├── context\
        │   └── AuthContext.jsx # Auth Context & Fetch helper
        ├── components\
        │   ├── AddJobModal.jsx # Add/Edit form popup
        │   ├── KanbanBoard.jsx # Drag-and-drop Kanban view
        │   ├── JobTable.jsx    # Table view
        │   └── StatCards.jsx   # Metrics grid
        └── pages\
            ├── LoginRegister.jsx # Registration & login view
            └── Dashboard.jsx   # Primary user cockpit
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [NPM](https://www.npmjs.com/) (installed automatically with Node)

---

### Step-by-Step Installation

#### 1. Setup the Backend
Navigate to the `backend` directory, create a `.env` file, and install dependencies.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
JWT_SECRET=supersecurejobtrackersecretkey9977!

# Optional: Add your local MongoDB URI or MongoDB Atlas URI below.
# If omitted or left empty, the server automatically boots an in-memory database!
# MONGO_URI=mongodb://localhost:27017/job-tracker
```

Start the backend server in development mode:
```bash
npm run dev
```
You should see:
`Mongoose connected successfully to MongoDB.`
`Express Server running on port 5000`

---

#### 2. Setup the Frontend
Open a new terminal window, navigate to the `frontend` directory, and start the development server.

```bash
cd ../frontend
npm install
npm run dev
```

The Vite dev server will spin up the web app locally, usually at:
**[http://localhost:5173](http://localhost:5173)**

Open this URL in your web browser to sign up, log in, and track your applications!

---

## 🔒 API Endpoints

All `/api/jobs` endpoints require a `Authorization: Bearer <JWT_TOKEN>` header.

### Authentication (`/api/auth`)
* `POST /register`: Registers a new user and generates a token (seeds 3 mock jobs).
* `POST /login`: Verifies user credentials, returns a token, and returns user details.

### Job Applications (`/api/jobs`)
* `GET /`: Retrieve all job applications for the logged-in user.
* `POST /`: Add a new job application.
* `PUT /:id`: Modify fields or status of an existing job application.
* `DELETE /:id`: Remove a job application.
