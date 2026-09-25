# Password Manager Web App

A full-stack password manager built to learn how frontend, backend, and databases connect. 
REST API built with FastAPI, SQLite for storage, bcrypt for password hashing, vanilla JS/HTML frontend.

## Features
- Add, view, update, and delete password entries
- Passwords hashed with bcrypt before storage
- Partial updates (change just one field without resending everything)

## Tech Stack
- Backend: Python, FastAPI
- Database: SQLite
- Frontend: HTML, JavaScript (fetch API)
- Hashing: bcrypt

## Setup
1. Clone the repo
2. `cd backend && pip install -r requirements.txt`
3. `uvicorn app:app --reload`
4. Open `frontend/index.html` in your browser

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /passwords | List all entries |
| POST | /passwords | Add a new entry |
| PUT | /passwords/{id} | Update an entry (partial) |
| DELETE | /passwords/{id} | Delete an entry |

## What I'd improve
- Currently uses bcrypt hashing, which is one-way and can't retrieve original passwords. 
  A real password manager needs reversible encryption (e.g. Fernet) to display saved passwords — 
  this is a deliberate simplification for this version, not an oversight.
- No authentication/user accounts yet — currently single-user
- CORS is wide open (`allow_origins=["*"]`) for local dev; would restrict in production