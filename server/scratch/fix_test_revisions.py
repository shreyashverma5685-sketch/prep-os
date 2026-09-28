import sqlite3

conn = sqlite3.connect("server/prep_os.db")
cursor = conn.cursor()

cursor.execute("DELETE FROM revisions WHERE problem_id = 7")
conn.commit()

print(f"Deleted {cursor.rowcount} row(s).")
conn.close()