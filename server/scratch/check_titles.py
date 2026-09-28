import sqlite3

conn = sqlite3.connect("server/prep_os.db")
cursor = conn.cursor()
cursor.execute("SELECT id, title, length(title) FROM problems WHERE title IS NOT NULL")

for row in cursor.fetchall():
    print(row)

conn.close()