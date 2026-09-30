import pytest
from recommender import (
    calculate_2factor_topic_score,
    calculate_2factor_problem_score,
    calculate_5factor_topic_score,
    calculate_5factor_problem_score,
    _confidence_factor
)

def test_neutral_confidence_factor():
    # Null or None confidence should yield 0.5 neutral factor
    assert _confidence_factor(None) == 0.5
    assert _confidence_factor(5) == 0.0  # High confidence -> 0 weakness factor
    assert _confidence_factor(1) == 1.0  # Low confidence -> max weakness factor

def test_2factor_scoring():
    # 0 total problems yields 0.0 score
    assert calculate_2factor_topic_score(None, 0, 0) == 0.0

    # Topic with confidence 1 and all mistakes
    score_weak = calculate_2factor_topic_score(avg_confidence=1.0, mistake_count=5, total_problems=5)
    assert score_weak == 100.0

    # Topic with confidence 5 and no mistakes
    score_strong = calculate_2factor_topic_score(avg_confidence=5.0, mistake_count=0, total_problems=5)
    assert score_strong == 0.0

def test_5factor_scoring():
    score = calculate_5factor_topic_score(
        avg_confidence=2.0,
        mistake_count=3,
        total_problems=5,
        avg_time_min=45.0,
        avg_attempts=2.0,
        avg_hints=1.0,
        days_since_practice=15
    )
    assert 0.0 <= score <= 100.0

def test_weakness_endpoints(client):
    client.post("/problems", json={
        "topic": "Trees",
        "difficulty": "Medium",
        "time_taken_min": 50,
        "status": "Attempted",
        "confidence": 1,
        "mistake_type": "Syntax Error"
    })

    res2 = client.get("/stats/weakness-2factor")
    assert res2.status_code == 200
    assert len(res2.json()["topics"]) == 1
    assert res2.json()["topics"][0]["topic"] == "Trees"

    res5 = client.get("/stats/weakness-5factor")
    assert res5.status_code == 200
    assert len(res5.json()["topics"]) == 1
    assert res5.json()["topics"][0]["weakness_score_5factor"] > 0
