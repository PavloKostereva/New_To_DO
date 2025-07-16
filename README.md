# To-Do Lists Додаток

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Додаток для керування списками завдань з можливістю спільної роботи.

## Особливості

- 📝 Створення та керування списками завдань
- 👥 Спільний доступ до списків з іншими користувачами
- 🔒 Різні ролі доступу (власник, адмін, переглядач)
- 🔎 Пошук по списках та завданнях
- 🌙 Темна та світла теми

## Технології

- ⚛️ React.js (Next.js)
- 🔥 Firebase (Authentication, Firestore)
- 🎨 Tailwind CSS
- 🌐 TypeScript

## Встановлення

1. Клонуйте репозиторій:
   ```bash
   git clone https://github.com/your-username/todo-lists-app.git
   cd todo-lists-app
Встановіть залежності:

bash
npm install
# або
yarn install
Налаштуйте Firebase:

Створіть проект у Firebase Console

Додайте конфігурацію Firebase у файл lib/firebase.ts

Увімкніть Email/Password Authentication у Firebase Console

Запустіть додаток:

bash
npm run dev
# або
yarn dev


## Використання

Для користувачів
Реєстрація/Вхід:
Зареєструйтеся з email та паролем
Або увійдіть, якщо вже маєте акаунт
Створення списку:
Натисніть "+" у панелі зліва
Введіть назву списку
Додавання завдань:
Виберіть список
Введіть назву та опис завдання
Натисніть "Додати завдання"
Спільний доступ:
Відкрийте список
У розділі "Співучасники" додайте email користувача
Оберіть роль (адмін або переглядач)
