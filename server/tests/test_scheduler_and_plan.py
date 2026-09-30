import pytest
from datetime import datetime
import db

def test_revision_auto_scheduling(client):
    # Solved with high confidence -> no revision scheduled
    client.post("/problems", json={
        "title": "Easy Problem",
        "topic": "Arrays",
        "difficulty": "Easy",
        "time_taken_min": 10,
        "status": "Solved",
        "confidence": 5,
        "mistake_type": "None"
    })

    conn = db.get_connection()
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM revisions")
    count_before = c.fetchone()[0]
    conn.close()
    assert count_before == 0

    # Low confidence -> auto revision scheduled in database
    client.post("/problems", json={
        "title": "Hard Problem",
        "topic": "DP",
        "difficulty": "Hard",
        "time_taken_min": 40,
        "status": "Attempted",
        "confidence": 2,
        "mistake_type": "Logic error"
    })

    conn = db.get_connection()
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM revisions")
    count_after = c.fetchone()[0]
    conn.close()
    assert count_after == 1

def test_complete_revision_outcomes(client):
    # Create problem that triggers auto-revision
    res_prob = client.post("/problems", json={
        "title": "LRU Cache",
        "topic": "Design",
        "difficulty": "Hard",
        "time_taken_min": 60,
        "status": "Attempted",
        "confidence": 1
    })

    # Set due_date = today for testing due revisions
    today_str = datetime.now().strftime('%Y-%m-%d')
    conn = db.get_connection()
    c = conn.cursor()
    c.execute("UPDATE revisions SET due_date = ?", (today_str,))
    conn.commit()
    conn.close()

    res_due = client.get("/revisions/due")
    due_list = res_due.json()["revisions_due"]
    assert len(due_list) == 1
    rev = due_list[0]
    rev_id = rev["revision_id"]

    # Test completing revision with outcome="success"
    res_comp_success = client.post(f"/revisions/{rev_id}/complete?outcome=success")
    assert res_comp_success.status_code == 200
    data = res_comp_success.json()
    assert data["outcome"] == "success"
    assert data["next_revision_scheduled"]["interval_stage"] == 1  # stage 1 (3 days)

    # Update next revision's due_date to today for testing outcome="struggled"
    new_rev_id = data["next_revision_scheduled"]["id"]
    conn = db.get_connection()
    c = conn.cursor()
    c.execute("UPDATE revisions SET due_date = ? WHERE id = ?", (today_str, new_rev_id))
    conn.commit()
    conn.close()

    res_comp_struggled = client.post(f"/revisions/{new_rev_id}/complete?outcome=struggled")
    assert res_comp_struggled.status_code == 200
    data2 = res_comp_struggled.json()
    assert data2["outcome"] == "struggled"
    assert data2["next_revision_scheduled"]["interval_stage"] == 0  # reset to stage 0 (1 day)

def test_generate_daily_plan(client):
    # Log problem
    client.post("/problems", json={
        "title": "Kth Largest Element",
        "topic": "Heaps",
        "difficulty": "Medium",
        "time_taken_min": 25,
        "status": "Attempted",
        "confidence": 2
    })

    res_plan = client.get("/plan")
    assert res_plan.status_code == 200
    plan = res_plan.json()
    assert "date" in plan
    assert plan["todays_focus"]["primary_weak_topic"] == "Heaps"
    assert len(plan["recommended_action_plan"]) > 0
