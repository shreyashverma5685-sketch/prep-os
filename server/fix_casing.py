import sqlite3

conn = sqlite3.connect("server/prep_os.db")
cursor = conn.cursor()

cursor.execute("""
    UPDATE problems
    SET topic = 'Graphs', difficulty = 'Medium', status = 'Solved'
    WHERE id IN (1, 2)
""")
conn.commit()

print(f"Updated {cursor.rowcount} row(s).")
conn.close()