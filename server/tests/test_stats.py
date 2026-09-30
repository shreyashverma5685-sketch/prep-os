import pytest

def test_stats_summary_and_streaks(client):
    # Empty DB
    res_empty = client.get("/stats/summary")
    assert res_empty.status_code == 200
    assert res_empty.json()["total_problems"] == 0

    # Add 2 solved problems
    client.post("/problems", json={
        "title": "Problem 1",
        "topic": "Arrays",
        "difficulty": "Easy",
        "time_taken_min": 10,
        "status": "Solved"
    })
    client.post("/problems", json={
        "title": "Problem 2",
        "topic": "Arrays",
        "difficulty": "Medium",
        "time_taken_min": 20,
        "status": "Attempted"
    })

    res = client.get("/stats/summary")
    assert res.status_code == 200
    data = res.json()
    assert data["total_problems"] == 2
    assert data["status_breakdown"]["Solved"] == 1
    assert data["status_breakdown"]["Attempted"] == 1

    res_streaks = client.get("/stats/consistency")
    assert res_streaks.status_code == 200
    assert "current_streak" in res_streaks.json()

def test_mistake_breakdown(client):
    client.post("/problems", json={
        "title": "Problem A",
        "topic": "Graphs",
        "difficulty": "Hard",
        "time_taken_min": 45,
        "status": "Attempted",
        "mistake_type": "Off-by-one"
    })
    client.post("/problems", json={
        "title": "Problem B",
        "topic": "Graphs",
        "difficulty": "Hard",
        "time_taken_min": 50,
        "status": "Attempted",
        "mistake_type": "Off-by-one"
    })

    res = client.get("/stats/mistakes")
    assert res.status_code == 200
    data = res.json()
    assert "mistake_distribution" in data
    assert data["mistake_distribution"]["Off-by-one"] == 2
    assert data["top_mistake_reason"] == "Off-by-one"

def test_topic_performance(client):
    client.post("/problems", json={
        "topic": "Dynamic Programming",
        "difficulty": "Hard",
        "time_taken_min": 30,
        "status": "Solved"
    })
    client.post("/problems", json={
        "topic": "Dynamic Programming",
        "difficulty": "Hard",
        "time_taken_min": 40,
        "status": "Attempted"
    })

    res = client.get("/stats/topic-performance")
    assert res.status_code == 200
    topics = res.json()["topics"]
    dp_topic = next((t for t in topics if t["topic"] == "Dynamic Programming"), None)
    assert dp_topic is not None
    assert dp_topic["total_problems"] == 2
    assert dp_topic["solved_count"] == 1
    assert dp_topic["accuracy_pct"] == 50.0
