"""
Prep OS - Recommender Engine Module
Provides weakness scoring and recommendation algorithms.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, date, timedelta


def calculate_2factor_topic_score(
    avg_confidence: Optional[float],
    mistake_count: int,
    total_problems: int
) -> float:
    """
    Calculates a baseline 2-Factor Weakness Score (0 - 100) for a topic.
    Factor 1: Low Confidence (60% weight)
    Factor 2: Mistake Rate (40% weight)
    """
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
    """
    Calculates 2-Factor Weakness Score (0 - 100) for an individual problem.
    """
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
