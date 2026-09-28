import sqlite3
from datetime import date

conn = sqlite3.connect("server/prep_os.db")
cursor = conn.cursor()
cursor.execute(
    "INSERT INTO revisions (problem_id, due_date, interval_stage, completed) VALUES (?, ?, ?, 0)",
    (7, date.today().strftime("%Y-%m-%d"), 2),
)
conn.commit()
print(f"Inserted revision id {cursor.lastrowid}")
conn.close()
