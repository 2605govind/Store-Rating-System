# 🛒 Store Rating System

This project is a **full-stack Store Rating System**, built with:

* **Backend:** Node.js, Express, PostgreSQL (Supabase), JWT authentication
* **Frontend:** React.js, using `@tanstack/react-query` for API requests and state management

It supports multiple roles (`admin`, `store_owner`, `user`) and allows users to rate stores.

**Frontend Features:**

* Fetches data from the backend API (`/auth`, `/stores`, `/ratings`)
* Uses React Query for caching, background refetching, and mutations

---

## 👤 Default Accounts

You can view the live project using the following accounts:
🔗 **Live Project Link:** \[live project link----------]

**Admin**
📧 `admin@gmail.com`
🔑 `Admin@123`

**User**
📧 `rohitverma@gmail.com`
🔑 `Rohit@123`

**Store Owner**
📧 `govindsuthar2626@gmail.com`
🔑 `Govind@126`

---

## 🚀 1. Project Setup

### Clone the repository

```bash
git clone https://github.com/your-repo/store-rating-system.git
cd store-rating-system
```

---

## ⚙️ 2. Environment Variables

Create a `.env` file in the **backend folder**:

### Supabase Project Setup

1. Go to the Supabase Dashboard.
2. Create a new project.
3. Click **Connect** and copy the connection string (`postgresql://...`).
   → This will be your `DATABASE_URL`.

```env
PORT=3001
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres
JWT_SECRET=yourSuperSecretKey
```

* **DATABASE\_URL** → Copy from Supabase (Project → Connect → Direct connection).
* **JWT\_SECRET** → Any random secure string (used for signing JWTs).

---

## 🗄️ 3. Database Schema

Go to Supabase Dashboard → [SQL Editor](https://supabase.com/dashboard/project/projectid/editor/) and run:

```sql
-- users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(400),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin','user','store_owner')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- stores table
CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address VARCHAR(400) NOT NULL,
    rating NUMERIC(2,1) DEFAULT 0,
    owner_id INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    store_id INT REFERENCES stores(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## ▶️ 4. Run the Server

### Scripts (`package.json`)

```json
"scripts": {
  "build": "npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend",
  "start": "npm run start --prefix backend"
}
```

### 🔹 `npm run build`

1. Installs backend dependencies
2. Installs frontend dependencies
3. Builds the frontend → generates the `build/` folder (React production build)

👉 This ensures backend dependencies are installed and frontend build is ready.

### 🔹 `npm run start`

Runs `npm start` in the backend folder → starts your backend server (`server.js`).
If configured, the backend serves the React frontend build folder.

---

## 🚀 How to Use

From the **root folder**:

```bash
npm run build
```

(Installs dependencies + builds frontend)

Then start the backend:

```bash
npm run start
```

✅ Backend runs at:
👉 `http://localhost:3001`

Frontend is served via backend (React build folder).

---

## ✅ 5. What You Have

* Full-stack app with **PostgreSQL database (Supabase)** ✅
* Backend API: Node.js + Express + JWT ✅
* Frontend: React.js + `@tanstack/react-query` ✅
* Tables: `users`, `stores`, `ratings` ✅
* Role-based authentication (`admin`, `store_owner`, `user`) ✅
* Default users for quick testing ✅

---