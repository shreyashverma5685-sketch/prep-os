import sqlite3

conn = sqlite3.connect("server/prep_os.db")
cursor = conn.cursor()
cursor.execute("UPDATE problems SET title = TRIM(title) WHERE title IS NOT NULL")
conn.commit()
print(f"Updated {cursor.rowcount} row(s).")
conn.close()