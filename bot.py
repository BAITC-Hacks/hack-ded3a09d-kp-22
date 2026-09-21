import re

FAQ_PATH = "faq.txt"
STOPWORDS = {
    "как", "что", "это", "и", "в", "на", "за", "по", "к", "с", "у", "о",
    "а", "но", "или", "до", "из", "для", "не", "ли", "же", "бы", "то",
}


def load_faq(path):
    faq = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or "|" not in line:
                continue
            question, answer = line.split("|", 1)
            faq.append((question.strip(), answer.strip()))
    return faq


def keywords(text):
    words = re.findall(r"[а-яёa-z0-9]+", text.lower())
    # обрезаем до "псевдо-корня", чтобы разные окончания слова совпадали
    # (призов/призы, команде/команда) без полноценной морфологии
    return {w[:4] for w in words if w not in STOPWORDS and len(w) > 2}


def find_answer(user_question, faq):
    user_kw = keywords(user_question)
    if not user_kw:
        return None
    best_score, best_answer = 0, None
    for question, answer in faq:
        score = len(user_kw & keywords(question))
        if score > best_score:
            best_score, best_answer = score, answer
    return best_answer


def main():
    faq = load_faq(FAQ_PATH)
    print("FAQ-бот готов. Задайте вопрос (или 'выход' для завершения).")
    while True:
        try:
            user_input = input("> ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break
        if not user_input:
            continue
        if user_input.lower() in {"выход", "exit", "quit"}:
            break
        print(find_answer(user_input, faq) or "не знаю")


if __name__ == "__main__":
    main()
