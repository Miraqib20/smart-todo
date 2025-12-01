import pyodbc
from dotenv import load_dotenv
from pathlib import Path
import os

# Load .env from backend root folder
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

# Read Environment Variables
DB_SERVER = os.getenv("DB_SERVER")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

# Validate the loaded variables
print(f"📌 Loaded DB config: {DB_SERVER=} {DB_NAME=} {DB_USER=}")

# Correct & Safe Connection String
CONNECTION_STRING = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    f"SERVER={{{DB_SERVER}}};"  # Double braces allow backslash in server name
    f"DATABASE={DB_NAME};"
    f"UID={DB_USER};"
    f"PWD={DB_PASSWORD};"
    "TrustServerCertificate=yes;"
)


def get_db():
    """
    Returns a database connection for each request.
    Safe cleanup on completion.
    """
    conn = pyodbc.connect(CONNECTION_STRING)
    try:
        yield conn
    finally:
        conn.close()
    return conn