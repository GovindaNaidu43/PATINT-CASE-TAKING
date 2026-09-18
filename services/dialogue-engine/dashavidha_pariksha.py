DASHAVIDHA_QUESTIONS = [
    ("prakriti", "How would you describe your usual body constitution and tendencies?"),
    ("vikriti", "What changes from your usual state have you noticed?"),
    ("sara", "How would you describe your general strength and tissue quality?"),
    ("satva", "How are stress, sleep, and emotional wellbeing currently?"),
]
def next_question(answered: set[str]):
    return next(({"domain": d, "question": q} for d, q in DASHAVIDHA_QUESTIONS if d not in answered), None)
