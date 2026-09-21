const fs = require('fs');
const readline = require('readline');

// 1. Читаем и парсим faq.txt
const faqContent = fs.readFileSync('faq.txt', 'utf-8').trim().split('\n\n');
const knowledgeBase = faqContent.map(block => {
    const lines = block.split('\n');
    const question = lines[0].replace('В: ', '').trim().toLowerCase();
    const answer = lines[1].replace('О: ', '').trim();
    // Извлекаем ключевые слова (слова длиннее 3 букв)
    const keywords = question.replace(/[?,.-]/g, '').split(' ').filter(w => w.length > 3);

    return { answer, keywords };
});

// 2. Настройка терминала
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🤖 FAQ-бот запущен! Задайте вопрос (или напишите "выход"):');

// 3. Логика чата
rl.on('line', (input) => {
    const text = input.trim().toLowerCase();

    if (text === 'выход' || text === 'exit') {
        console.log('Завершение работы...');
        process.exit(0);
    }

    // Разбиваем ввод пользователя на слова
    const userWords = text.replace(/[?,.-]/g, '').split(' ');

    let bestMatch = null;
    let maxScore = 0;

    // Ищем наибольшее пересечение по ключевым словам
    for (const item of knowledgeBase) {
        let score = 0;
        for (const word of userWords) {
            if (word.length > 3 && item.keywords.includes(word)) {
                score++;
            }
        }
        if (score > maxScore) {
            maxScore = score;
            bestMatch = item;
        }
    }

    // Выводим ответ или "не знаю"
    if (bestMatch && maxScore > 0) {
        console.log(`\nОтвет: ${bestMatch.answer}\n`);
    } else {
        console.log(`\nОтвет: не знаю\n`);
    }
});