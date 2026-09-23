from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import get_connection, init_db
from models import ProblemCreate, Problem

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()



@app.post("/problems", response_model=Problem)
def create_problem(problem: ProblemCreate):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO problems
            (title, platform, topic, subtopic, difficulty,
             time_taken_min, status, attempts, confidence,
             hints_used, mistake_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        problem.title, problem.platform, problem.topic, problem.subtopic,
        problem.difficulty, problem.time_taken_min, problem.status,
        problem.attempts, problem.confidence, problem.hints_used,
        problem.mistake_type
    ))
    conn.commit()

    new_id = cursor.lastrowid
    cursor.execute("SELECT * FROM problems WHERE id = ?", (new_id,))
    row = cursor.fetchone()
    conn.close()

    return dict(row)


@app.get("/problems", response_model=list[Problem])
def list_problems():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM problems ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]