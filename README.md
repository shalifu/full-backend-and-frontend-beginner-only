# Student Dashboard

A small full-stack student records app. The React interface lets you add students, search by name, update a student's age, and delete records. An Express API handles requests and stores records in MySQL.

## Requirements

- Node.js and npm
- MySQL Server

## Database setup

The backend connects to a local MySQL database named `ornella` as user `root` with no password. Create the database and table before starting the API:

```sql
CREATE DATABASE ornella;
USE ornella;

CREATE TABLE brave (
  name VARCHAR(255) NOT NULL PRIMARY KEY,
  age INT NOT NULL
);
```

If your MySQL credentials differ, update the connection settings in `backend/server.js`.

## Run locally

Open two terminals from the project root.

In the first terminal, install backend dependencies and start the API:

```bash
cd backend
npm install
npm run dev
```

The API listens at [http://localhost:3000](http://localhost:3000).

In the second terminal, install frontend dependencies and start the React development server:

```bash
cd frontend/frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your browser. The frontend sends requests to `http://localhost:3000/students`.

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/students?name=<name>` | Find students by exact name |
| `POST` | `/students` | Add a student with a JSON `name` and `age` |
| `PUT` | `/students/:name` | Update the student's age using JSON `age` |
| `DELETE` | `/students/:name` | Delete a student by name |

Example request body for adding a student:

```json
{ "name": "Alex", "age": 20 }
```

## Project layout

- `backend/` — Express API and MySQL connection
- `frontend/frontend/` — React app built with Vite
