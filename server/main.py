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


@app.get("/stats/summary")
def get_stats_summary():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM problems")
    total_problems = cursor.fetchone()[0]

    cursor.execute("SELECT difficulty, COUNT(*) FROM problems GROUP BY difficulty")
    diff_rows = cursor.fetchall()
    difficulty_breakdown = {"Easy": 0, "Medium": 0, "Hard": 0}
    for row in diff_rows:
        if row[0] in difficulty_breakdown:
            difficulty_breakdown[row[0]] = row[1]

    cursor.execute("SELECT topic, COUNT(*) FROM problems GROUP BY topic ORDER BY COUNT(*) DESC")
    topic_rows = cursor.fetchall()
    topic_breakdown = {row[0]: row[1] for row in topic_rows}

    cursor.execute("SELECT AVG(confidence) FROM problems WHERE confidence IS NOT NULL")
    avg_conf_row = cursor.fetchone()[0]
    avg_confidence = round(avg_conf_row, 2) if avg_conf_row is not None else 0.0

    cursor.execute("SELECT AVG(time_taken_min) FROM problems")
    avg_time_row = cursor.fetchone()[0]
    avg_time_min = round(avg_time_row, 1) if avg_time_row is not None else 0.0

    cursor.execute("SELECT status, COUNT(*) FROM problems GROUP BY status")
    status_rows = cursor.fetchall()
    status_breakdown = {row[0]: row[1] for row in status_rows}

    conn.close()

    return {
        "total_problems": total_problems,
        "difficulty_breakdown": difficulty_breakdown,
        "topic_breakdown": topic_breakdown,
        "avg_confidence": avg_confidence,
        "avg_time_min": avg_time_min,
        "status_breakdown": status_breakdown
    }
