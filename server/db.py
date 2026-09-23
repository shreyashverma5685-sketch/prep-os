import sqlite3
import os

# The .db file lives next to this script, inside server/
DB_PATH = os.path.join(os.path.dirname(__file__), "prep_os.db")


def get_connection():
    """
    Opens a connection to the SQLite database file.
    Every part of the app that reads or writes data goes through this.
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # lets us access columns by name: row["topic"]
    return conn


def init_db():
    """
    Creates the problems and revisions tables if they don't already exist.
    Safe to run more than once - it will never wipe existing data.
    """
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS problems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            platform TEXT,
            topic TEXT NOT NULL,
            subtopic TEXT,
            difficulty TEXT NOT NULL,
            time_taken_min INTEGER NOT NULL,
            status TEXT NOT NULL,
            attempts INTEGER DEFAULT 1,
            confidence INTEGER,
            hints_used INTEGER DEFAULT 0,
            mistake_type TEXT,
            date_logged TEXT DEFAULT CURRENT_DATE
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS revisions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            problem_id INTEGER NOT NULL,
            due_date TEXT NOT NULL,
            interval_stage INTEGER DEFAULT 0,
            completed INTEGER DEFAULT 0,
            FOREIGN KEY (problem_id) REFERENCES problems (id)
        )
    """)

    conn.commit()
    conn.close()
    print("Database initialized: problems and revisions tables ready.")


if __name__ == "__main__":
    init_db()