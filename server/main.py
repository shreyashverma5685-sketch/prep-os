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


@app.get("/stats/consistency")
def get_consistency_metrics():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT DISTINCT date_logged FROM problems WHERE date_logged IS NOT NULL ORDER BY date_logged ASC")
    dates = [r[0] for r in cursor.fetchall()]

    total_active_days = len(dates)
    current_streak = 0
    longest_streak = 0

    if dates:
        from datetime import datetime, timedelta

        parsed_dates = []
        for d_str in dates:
            try:
                parsed_dates.append(datetime.strptime(str(d_str).split('T')[0].split(' ')[0], '%Y-%m-%d').date())
            except Exception:
                pass

        parsed_dates = sorted(list(set(parsed_dates)))

        if parsed_dates:
            temp_streak = 1
            max_s = 1
            for i in range(1, len(parsed_dates)):
                if parsed_dates[i] == parsed_dates[i-1] + timedelta(days=1):
                    temp_streak += 1
                elif parsed_dates[i] > parsed_dates[i-1] + timedelta(days=1):
                    temp_streak = 1
                max_s = max(max_s, temp_streak)
            longest_streak = max_s

            today = datetime.now().date()
            yesterday = today - timedelta(days=1)

            if parsed_dates[-1] in (today, yesterday):
                curr = 1
                idx = len(parsed_dates) - 1
                while idx > 0 and parsed_dates[idx] == parsed_dates[idx-1] + timedelta(days=1):
                    curr += 1
                    idx -= 1
                current_streak = curr
            else:
                current_streak = 0

    from datetime import datetime, timedelta
    now_date = datetime.now().date()
    seven_days_ago = (now_date - timedelta(days=7)).strftime('%Y-%m-%d')
    fourteen_days_ago = (now_date - timedelta(days=14)).strftime('%Y-%m-%d')

    cursor.execute("SELECT COUNT(*) FROM problems WHERE date_logged >= ?", (seven_days_ago,))
    last_7_days_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM problems WHERE date_logged >= ? AND date_logged < ?", (fourteen_days_ago, seven_days_ago))
    prev_7_days_count = cursor.fetchone()[0]

    conn.close()

    return {
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "total_active_days": total_active_days,
        "last_7_days_count": last_7_days_count,
        "prev_7_days_count": prev_7_days_count,
        "velocity_trend": "up" if last_7_days_count >= prev_7_days_count else "down"
    }


@app.get("/stats/mistakes")
def get_mistake_stats():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT mistake_type, COUNT(*) as count 
        FROM problems 
        WHERE mistake_type IS NOT NULL AND mistake_type != '' AND mistake_type != 'None'
        GROUP BY mistake_type 
        ORDER BY count DESC
    """)
    mistake_rows = cursor.fetchall()
    mistake_distribution = {row[0]: row[1] for row in mistake_rows}

    total_mistakes_logged = sum(mistake_distribution.values())
    top_mistake_reason = mistake_rows[0][0] if mistake_rows else "None"

    cursor.execute("""
        SELECT topic, COUNT(*) as total, AVG(confidence) as avg_conf,
               SUM(CASE WHEN mistake_type IS NOT NULL AND mistake_type != '' AND mistake_type != 'None' THEN 1 ELSE 0 END) as mistake_count
        FROM problems
        GROUP BY topic
        ORDER BY (avg_conf IS NULL) ASC, avg_conf ASC, mistake_count DESC
    """)
    topic_rows = cursor.fetchall()

    weak_topics = []
    for r in topic_rows:
        weak_topics.append({
            "topic": r[0],
            "total_problems": r[1],
            "avg_confidence": round(r[2], 2) if r[2] is not None else 0.0,
            "mistake_count": r[3]
        })

    conn.close()

    return {
        "mistake_distribution": mistake_distribution,
        "total_mistakes_logged": total_mistakes_logged,
        "top_mistake_reason": top_mistake_reason,
        "weak_topics": weak_topics
    }