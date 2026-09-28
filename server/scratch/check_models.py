from models import ProblemCreate

p = ProblemCreate(topic="graphs", difficulty="medium", time_taken_min=10, status="SOLVED")
print(p.topic, p.difficulty, p.status)

p2 = ProblemCreate(topic="Arrays", difficulty="Medium", time_taken_min=10, status="Solved", title="  Two Sum  ")
print(repr(p2.title))

try:
    ProblemCreate(topic="graphs", difficulty="banana", time_taken_min=10, status="Solved")
except Exception as e:
    print("Rejected:", e.errors()[0]["msg"])