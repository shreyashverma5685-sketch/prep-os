import sqlite3

conn = sqlite3.connect("server/prep_os.db")
cursor = conn.cursor()
cursor.execute("SELECT name, sql FROM sqlite_master WHERE type='table'")

for name, sql in cursor.fetchall():
    print(name)
    print(sql)
    print()

conn.close()