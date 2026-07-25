# TruthGuard 🛡️ — AI Fake News Detection Platform

## Project Structure

```
TruthGuard/
├── backend/                   # Express + MongoDB backend
│   ├── models/
│   │   ├── User.js            # User schema (Mongoose)
│   │   └── Check.js           # Verification result schema
│   ├── routes/
│   │   ├── auth.js            # /api/auth — Register, Login, Profile
│   │   └── checks.js          # /api/checks — Save & retrieve checks
│   ├── db.js                  # MongoDB connection (Mongoose)
│   └── server.js              # Express app entry point
│
├── frontend/                  # Static HTML/CSS/JS frontend
│   ├── index.html             # Landing page
│   ├── login.html             # Login page
│   ├── register.html          # Register page
│   ├── verify.html            # News Verification Engine
│   ├── dashboard.html         # User dashboard
│   ├── history.html           # Check history
│   ├── trending.html          # Trending stories
│   ├── profile.html           # Profile settings
│   ├── settings.html          # App settings
│   ├── about.html             # About page
│   ├── languages.html         # Language preferences
│   ├── forgot-password.html   # Password reset
│   ├── style.css              # Global stylesheet (Manrope font system)
│   ├── app.js                 # Core frontend logic (verify engine, UI)
│   ├── auth.js                # Firebase authentication + navbar renderer
│   ├── firebase.js            # Firebase config
│   ├── login.js               # Login form logic
│   └── register.js            # Register form logic
│
├── .env                       # Environment variables (MONGODB_URI, PORT)
├── package.json               # NPM scripts & dependencies
└── README.md                  # This file
```

## Environment Variables

Create a `.env` file in the root:

```
MONGODB_URI=mongodb+srv://narasimhareddy90102_db_user:<password>@cluster2.n47xnhk.mongodb.net/truthcheck_db?retryWrites=true&w=majority&appName=Cluster2
PORT=5000
```

## Running the Project

### Backend API Server
```bash
npm run dev:backend
# or
npm start
```
API runs at: `http://localhost:5000`

### Frontend (Vite dev server)
```bash
npm run dev:frontend
```
Frontend runs at: `http://localhost:5173`

### API Endpoints

| Method | Endpoint                  | Description                    |
|--------|---------------------------|--------------------------------|
| POST   | /api/auth/register        | Register a new user            |
| POST   | /api/auth/login           | Login user                     |
| GET    | /api/auth/user/:id        | Get user profile               |
| PUT    | /api/auth/user/:id        | Update user profile            |
| POST   | /api/checks               | Save a verification result     |
| GET    | /api/checks/user/:userId  | Get all checks for a user      |
| GET    | /api/checks/trending      | Get 20 most recent checks      |
| DELETE | /api/checks/:id           | Delete a check                 |
| GET    | /api/health               | Server health check            |
