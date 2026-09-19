"""Dashavidha Pariksha questions for traditional Ayush clinical evaluation."""

DASHAVIDHA_QUESTIONS = [
    ("prakriti", "How would you describe your usual body constitution and tendencies?"),
    ("vikriti", "What changes from your usual state have you noticed?"),
    ("sara", "How would you describe your general strength and tissue quality?"),
    ("satva", "How are stress, sleep, and emotional wellbeing currently?"),
    ("samhanana", "How would you describe your body build and structural proportion?"),
    ("pramana", "How would you describe your height, weight, and overall measurements?"),
    ("satmya", "Which foods, routines, or environments suit you best?"),
    ("ahara_shakti", "How is your appetite and capacity to digest meals?"),
    ("vyayama_shakti", "How is your stamina during physical activity?"),
    ("vaya", "Which age stage best describes your current life phase?"),
]


def next_question(answered: set[str]) -> dict | None:
    return next(
        ({"domain": d, "question": q} for d, q in DASHAVIDHA_QUESTIONS if d not in answered),
        None,
    )
