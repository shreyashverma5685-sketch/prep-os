import sqlite3
from datetime import date

conn = sqlite3.connect("server/prep_os.db")
cursor = conn.cursor()
cursor.execute("""
    INSERT INTO problems (title, platform, topic, difficulty, time_taken_min, status, attempts, confidence, date_logged)
    VALUES ('Two Sum', 'LeetCode', 'Arrays', 'Medium', 18, 'Solved', 2, 5, ?)
""", (date.today().strftime("%Y-%m-%d"),))
conn.commit()
print(f"Inserted problem id {cursor.lastrowid}")
conn.close()