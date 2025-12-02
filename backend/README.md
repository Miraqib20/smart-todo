# 📌 Todo Backend (FastAPI + SQL Server)

This is the backend service for the Todo App built using **FastAPI** and **Microsoft SQL Server (SSMS)**.
It provides **user authentication (Login / Signup)** and **Todo management APIs**.

---

## 🚀 Tech Stack

| Technology | Purpose |
|-----------|---------|
| FastAPI | Backend Framework |
| JWT Authentication | Secure Login & Signup |
| Microsoft SQL Server (SSMS) | Database |
| Uvicorn | Development Server |
| ODBC Driver 17 for SQL Server | SQL Connection Driver |

---

## ✅ Requirements

- Python 3.10+
- SQL Server (SSMS)
- pip installed
- ODBC Driver 17 for SQL Server

---

## 📦 Install Dependencies

Create and activate virtual environment:
python -m venv venv
venv\Scripts\activate  # Windows
Install required packages:
pip install -r requirements.txt

🔑 Environment Variables

Create a .env file in the backend folder:

DB_SERVER=YOUR_SERVER_NAME
DB_NAME=TodoDB
DB_USERNAME=your_username
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key
TOKEN_EXPIRE_MINUTES=30

🗄 Database Setup

Run this SQL script in SSMS:

CREATE DATABASE TodoDB;
GO

USE TodoDB;
GO

CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL
);

CREATE TABLE Todos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(200) NULL,
    due_date DATE NOT NULL,
    priority VARCHAR(20) NOT NULL,
    completed BIT DEFAULT 0,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

▶️ Run the Server

Start FastAPI using Uvicorn:

uvicorn app.main:app --reload


Server will run on:

API Base URL → http://127.0.0.1:8000

API Docs → http://127.0.0.1:8000/docs

🔐 Authentication

Login & Signup use JWT authentication

Protected routes require header:

✔
🧪 API Testing

You can test using:

Swagger UI at /docs

Postman / Thunder Client


📎 Backend Setup Completed Successfully!

 Author
 Mir Aqib Mushtaq
