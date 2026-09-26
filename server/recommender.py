"""
Prep OS - Recommender Engine Module
Provides weakness scoring (2-Factor & 5-Factor) and recommendation algorithms.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, date


def calculate_2factor_topic_score(
    avg_confidence: Optional[float],
    mistake_count: int,
    total_problems: int
) -> float:
    """Calculates baseline 2-Factor Weakness Score (0 - 100) for a topic."""
    if total_problems == 0:
        return 0.0

    if avg_confidence is not None:
        conf_factor = max(0.0, min(1.0, (5.0 - float(avg_confidence)) / 4.0))
    else:
        conf_factor = 0.8

    mistake_factor = min(1.0, mistake_count / total_problems)
    score = (0.6 * conf_factor + 0.4 * mistake_factor) * 100.0
    return round(score, 2)


def calculate_2factor_problem_score(problem: Dict[str, Any]) -> float:
    """Calculates 2-Factor Weakness Score (0 - 100) for an individual problem."""
    conf = problem.get("confidence")
    if conf is not None:
        conf_factor = max(0.0, min(1.0, (5.0 - float(conf)) / 4.0))
    else:
        conf_factor = 0.8

    mistake_type = problem.get("mistake_type")
    status = problem.get("status", "")
    has_mistake = 1.0 if (mistake_type and str(mistake_type).lower() not in ("none", "")) or str(status).lower() != "solved" else 0.0

    score = (0.6 * conf_factor + 0.4 * has_mistake) * 100.0
    return round(score, 2)


def calculate_5factor_topic_score(
    avg_confidence: Optional[float],
    mistake_count: int,
    total_problems: int,
    avg_time_min: float = 0.0,
    avg_attempts: float = 1.0,
    avg_hints: float = 0.0,
    days_since_practice: int = 0
) -> float:
    """
    Calculates comprehensive 5-Factor Weakness Score (0 - 100) for a topic.
    Factor 1: Low Confidence (25%)
    Factor 2: Mistake Frequency (25%)
    Factor 3: Time Inefficiency (20%)
    Factor 4: Attempt & Hint Friction (15%)
    Factor 5: Recency / Memory Decay (15%)
    """
    if total_problems == 0:
        return 0.0

    if avg_confidence is not None:
        f1_conf = max(0.0, min(1.0, (5.0 - float(avg_confidence)) / 4.0))
    else:
        f1_conf = 0.8

    f2_mistakes = min(1.0, mistake_count / total_problems)
    f3_time = max(0.0, min(1.0, (avg_time_min - 15.0) / 45.0))
    f4_friction = max(0.0, min(1.0, (avg_attempts - 1.0) / 3.0 + (avg_hints * 0.15)))
    f5_recency = max(0.0, min(1.0, days_since_practice / 30.0))

    composite = (0.25 * f1_conf + 0.25 * f2_mistakes + 0.20 * f3_time + 0.15 * f4_friction + 0.15 * f5_recency) * 100.0
    return round(composite, 2)



def calculate_5factor_problem_score(problem: Dict[str, Any]) -> float:
    """Calculates 5-Factor Weakness Score (0 - 100) for an individual problem."""
    conf = problem.get("confidence")
    f1_conf = max(0.0, min(1.0, (5.0 - float(conf)) / 4.0)) if conf is not None else 0.8

    mistake_type = problem.get("mistake_type")
    status = problem.get("status", "")
    has_mistake = 1.0 if (mistake_type and str(mistake_type).lower() not in ("none", "")) or str(status).lower() != "solved" else 0.0
    f2_mistakes = has_mistake

    diff = str(problem.get("difficulty", "Medium")).lower()
    benchmark = 15.0 if diff == "easy" else (45.0 if diff == "hard" else 30.0)
    time_taken = float(problem.get("time_taken_min", benchmark))
    f3_time = max(0.0, min(1.0, (time_taken - benchmark) / benchmark))

    attempts = float(problem.get("attempts", 1) or 1)
    hints = float(problem.get("hints_used", 0) or 0)
    f4_friction = max(0.0, min(1.0, (attempts - 1.0) / 3.0 + (hints * 0.2)))

    date_logged_str = problem.get("date_logged")
    days_since = 0
    if date_logged_str:
        try:
            logged_date = datetime.strptime(str(date_logged_str).split('T')[0].split(' ')[0], '%Y-%m-%d').date()
            days_since = (datetime.now().date() - logged_date).days
        except Exception:
            days_since = 0
    f5_recency = max(0.0, min(1.0, days_since / 30.0))

    composite = (0.25 * f1_conf + 0.25 * f2_mistakes + 0.20 * f3_time + 0.15 * f4_friction + 0.15 * f5_recency) * 100.0
    return round(composite, 2)
