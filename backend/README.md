# Todo Backend (FastAPI + SQL Server)

## 1. Requirements

- Python 3.10+
- SQL Server (SSMS)
- ODBC Driver 17 for SQL Server
- pip

## 2. Create Database and Tables

Run this in SSMS:

```sql
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
