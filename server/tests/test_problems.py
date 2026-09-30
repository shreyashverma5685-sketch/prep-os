import pytest

def test_create_problem_valid(client):
    payload = {
        "title": " Two Sum ",
        "platform": " LeetCode ",
        "topic": "arrays",
        "subtopic": " HashMap ",
        "difficulty": "easy",
        "time_taken_min": 15,
        "status": "solved",
        "attempts": 1,
        "confidence": 4,
        "hints_used": 0,
        "mistake_type": "None"
    }
    response = client.post("/problems", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Two Sum"
    assert data["platform"] == "LeetCode"
    assert data["topic"] == "Arrays"
    assert data["subtopic"] == "HashMap"
    assert data["difficulty"] == "Easy"
    assert data["status"] == "Solved"
    assert data["id"] is not None

def test_create_problem_validation_invalid_difficulty(client):
    payload = {
        "topic": "Arrays",
        "difficulty": "SuperHard",
        "time_taken_min": 10,
        "status": "Solved"
    }
    response = client.post("/problems", json=payload)
    assert response.status_code == 422

def test_get_problems_list(client):
    client.post("/problems", json={
        "title": "Reverse LinkedList",
        "topic": "Linked Lists",
        "difficulty": "Easy",
        "time_taken_min": 12,
        "status": "Solved"
    })
    response = client.get("/problems")
    assert response.status_code == 200
    problems = response.json()
    assert isinstance(problems, list)
    assert len(problems) == 1
    assert problems[0]["title"] == "Reverse LinkedList"

def test_problem_history_groups(client):
    # Log attempt 1
    client.post("/problems", json={
        "title": "Valid Anagram",
        "topic": "Strings",
        "difficulty": "Easy",
        "time_taken_min": 25,
        "status": "Attempted",
        "date_logged": "2026-09-01"
    })
    # Log attempt 2
    client.post("/problems", json={
        "title": "Valid Anagram",
        "topic": "Strings",
        "difficulty": "Easy",
        "time_taken_min": 10,
        "status": "Solved",
        "date_logged": "2026-09-02"
    })

    res = client.get("/problems/history-groups")
    assert res.status_code == 200
    groups = res.json()["groups"]
    assert len(groups) == 1
    group = groups[0]
    assert group["title"] == "Valid Anagram"
    assert group["attempt_count"] == 2
    assert group["first_attempt_time"] == 25
    assert group["latest_attempt_time"] == 10
    assert group["improvement_min"] == 15
