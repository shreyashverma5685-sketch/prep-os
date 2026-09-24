"""
Prep OS - Spaced Repetition Revision Scheduler Module
"""

import sqlite3
from datetime import datetime, date, timedelta
from typing import Dict, Any, List, Optional
from db import get_connection

STAGE_INTERVALS = {
    0: 1,   # Stage 0: 1 day
    1: 3,   # Stage 1: 3 days
    2: 7,   # Stage 2: 7 days
    3: 14,  # Stage 3: 14 days
    4: 30   # Stage 4: 30 days
}


def calculate_next_due_date(current_stage: int, base_date: Optional[date] = None) -> str:
    if base_date is None:
        base_date = datetime.now().date()
    interval = STAGE_INTERVALS.get(current_stage, 30)
    next_date = base_date + timedelta(days=interval)
    return next_date.strftime('%Y-%m-%d')


def auto_schedule_problem_if_needed(problem_id: int, problem_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Auto-schedules a revision if confidence <= 3, mistake logged, or not solved.
    """
    conf = problem_data.get("confidence")
    mistake = problem_data.get("mistake_type")
    status = str(problem_data.get("status", "")).lower()

    should_schedule = False
    if conf is not None and int(conf) <= 3:
        should_schedule = True
    elif mistake and str(mistake).lower() not in ("none", ""):
        should_schedule = True
    elif status != "solved":
        should_schedule = True

    if not should_schedule:
        return None

    return schedule_revision(problem_id=problem_id, interval_stage=0)


def schedule_revision(problem_id: int, interval_stage: int = 0) -> Dict[str, Any]:
    due_date = calculate_next_due_date(interval_stage)
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO revisions (problem_id, due_date, interval_stage, completed)
        VALUES (?, ?, ?, 0)
    """, (problem_id, due_date, interval_stage))
    conn.commit()

    rev_id = cursor.lastrowid
    cursor.execute("SELECT * FROM revisions WHERE id = ?", (rev_id,))
    row = cursor.fetchone()
    conn.close()

    return dict(row)


def get_due_revisions() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    today_str = datetime.now().strftime('%Y-%m-%d')

    cursor.execute("""
        SELECT r.id as revision_id, r.problem_id, r.due_date, r.interval_stage, r.completed,
               p.title, p.topic, p.subtopic, p.difficulty, p.confidence, p.mistake_type, p.status
        FROM revisions r
        JOIN problems p ON r.problem_id = p.id
        WHERE r.completed = 0 AND r.due_date <= ?
        ORDER BY r.due_date ASC
    """, (today_str,))

    rows = cursor.fetchall()
    conn.close()

    result = []
    today = datetime.now().date()
    for row in rows:
        item = dict(row)
        try:
            due_d = datetime.strptime(item["due_date"], '%Y-%m-%d').date()
            overdue_days = max(0, (today - due_d).days)
        except Exception:
            overdue_days = 0
        item["overdue_days"] = overdue_days
        result.append(item)

    return result


def complete_revision(revision_id: int) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM revisions WHERE id = ?", (revision_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return {"error": "Revision not found"}

    rev = dict(row)
    cursor.execute("UPDATE revisions SET completed = 1 WHERE id = ?", (revision_id,))

    next_stage = rev["interval_stage"] + 1
    next_rev = None
    if next_stage in STAGE_INTERVALS:
        next_due = calculate_next_due_date(next_stage)
        cursor.execute("""
            INSERT INTO revisions (problem_id, due_date, interval_stage, completed)
            VALUES (?, ?, ?, 0)
        """, (rev["problem_id"], next_due, next_stage))
        new_id = cursor.lastrowid
        cursor.execute("SELECT * FROM revisions WHERE id = ?", (new_id,))
        next_rev = dict(cursor.fetchone())

    conn.commit()
    conn.close()

    return {
        "completed_revision_id": revision_id,
        "status": "completed",
        "next_revision_scheduled": next_rev
    }
