# CivicVoice — Online Complaint Management System

A full-stack platform for citizens to submit and track complaints to police, with an admin panel for officers to manage and resolve them.

## Tech Stack

| Layer | Technology | Hosting |
|-------|-----------|---------|
| Frontend | React 18 + Vite | Netlify |
| Backend | Python FastAPI | Vercel |
| Database & Auth | Supabase | Supabase Cloud |

## Features

- 🔐 **User Authentication** — Register, login, and session management via Supabase Auth
- 📝 **Submit Complaints** — Citizens can file complaints with category, description, and location
- 🔍 **Track Complaints** — Search by unique tracking ID (no login required)
- 📊 **User Dashboard** — View all your complaints and their status
- 🛡️ **Admin Panel** — Officers can manage, update status, set priority, and add remarks
- 🌓 **Theme Toggle** — Light / Dark / System mode with persistence
- 📱 **Fully Responsive** — Works on all screen sizes (phone, tablet, desktop)

---

## Quick Start

### 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste and run `database/schema.sql`
3. Copy your **Project URL** and **anon key** from Settings → API

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env with your Supabase URL and anon key
npm install
npm run dev
```

### 3. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your Supabase URL and service role key
pip install -r requirements.txt
uvicorn main:app --reload
```

### 4. Create Admin User

1. Register a new user through the app
2. Open Supabase SQL Editor and run:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = 'YOUR_USER_UUID_HERE';
```

---

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/    (Navbar, Sidebar, ProtectedRoute, StatusBadge)
│   │   ├── contexts/      (AuthContext, ThemeContext)
│   │   ├── lib/           (supabaseClient, api)
│   │   ├── pages/         (10 pages)
│   │   └── styles/        (Complete design system)
│   ├── netlify.toml
│   └── vite.config.js
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── routes/
│   │   ├── auth.py
│   │   ├── complaints.py
│   │   └── admin.py
│   ├── requirements.txt
│   └── vercel.json
└── database/
    └── schema.sql
```

## Deployment

**Frontend (Netlify):** Connect your GitHub repo → Netlify auto-deploys from `frontend/` directory.

**Backend (Vercel):** Connect your GitHub repo → Vercel auto-deploys from `backend/` directory. Add environment variables in Vercel dashboard.
