# 🚀 Инструкции по запуску - Module Masters Content Generator

Полная пошаговая инструкция для запуска приложения.

## ✅ Статус установки

Всё уже настроено и готово к запуску! Осталось только:
1. ✅ Backend зависимости установлены
2. ✅ Frontend зависимости установлены
3. ✅ База данных инициализирована с тестовыми данными (8 постов)
4. ⚠️ **Нужно добавить API ключ Anthropic**

## 📋 Перед запуском

### Получите API ключ Anthropic

**Это обязательно для генерации контента!**

1. Перейдите: https://console.anthropic.com/
2. Зарегистрируйтесь или войдите
3. Создайте API ключ в разделе **API Keys**
4. Скопируйте ключ (он начинается с `sk-ant-api03-...`)

📖 **Подробная инструкция:** [GET_API_KEY.md](GET_API_KEY.md)

### Добавьте ключ в .env файл

```bash
# Откройте файл
nano backend/.env

# Или любым текстовым редактором
# Замените YOUR_API_KEY_HERE на ваш настоящий ключ:
ANTHROPIC_API_KEY=sk-ant-api03-ВАШТКЛЮЧ
```

## 🚀 Способ 1: Быстрый запуск (Рекомендуется)

Используйте готовые скрипты запуска.

### Откройте 2 терминала

**Терминал 1 - Backend:**
```bash
cd /home/user/mm-content-generator
./start-backend.sh
```

Вы должны увидеть:
```
🚀 Starting Module Masters Content Generator Backend...
🟢 Starting Flask server on http://localhost:5000
 * Running on http://0.0.0.0:5000
```

**Терминал 2 - Frontend:**
```bash
cd /home/user/mm-content-generator
./start-frontend.sh
```

Вы должны увидеть:
```
🚀 Starting Module Masters Content Generator Frontend...
🟢 Starting React development server on http://localhost:3000
Compiled successfully!
```

### Откройте браузер

Приложение автоматически откроется на: **http://localhost:3000**

## 🔧 Способ 2: Ручной запуск

Если скрипты не работают, запустите вручную.

### Backend (Terminal 1):
```bash
cd /home/user/mm-content-generator/backend

# Активировать виртуальное окружение
source venv/bin/activate

# Запустить Flask
python app.py
```

### Frontend (Terminal 2):
```bash
cd /home/user/mm-content-generator/frontend

# Запустить React
npm start
```

## 📱 Первое использование

### 1. Откройте Dashboard

После запуска вы увидите главную страницу с:
- Quick Stats (статистика)
- Quick Actions (быстрые действия)
- Recent Posts (недавние посты из seed данных)

### 2. Просмотрите тестовые данные

**Перейдите в Library** → Увидите 8 примеров постов:
- 7 оцененных постов с рейтингами
- 1 запланированный пост
- Разные типы: educational, promotional, seasonal, customer_story

**Перейдите в Analytics** → Увидите:
- Графики эффективности
- Top performing posts
- Популярные хештеги
- Insights (какой тип постов работает лучше)

### 3. Создайте первый пост

**Перейдите в Generate:**

1. **Step 1:** Выберите тип поста (например, Educational)
2. **Step 2:** Выберите платформу (например, Both)
3. **Step 3:** Заполните параметры:
   - Topic: "Why ECU repair is better than replacement"
   - Оставьте остальное по умолчанию
4. **Нажмите Generate** → Подождите 5-10 секунд
5. **Получите результат:**
   - Контент для Facebook
   - Контент для Instagram
   - Хештеги для каждой платформы
   - Рекомендации по визуалу
   - Call-to-action

6. **Сохраните:** Нажмите "Save" под любой платформой

### 4. Оцените пост

Чтобы система училась:

1. **Library** → Найдите свой пост
2. **Нажмите Edit**
3. **Поставьте рейтинг:** 5 звезд ⭐⭐⭐⭐⭐
4. **Inquiries Count:** 5 (сколько обращений сгенерировал пост)
5. **Notes:** "Отличный отклик!"
6. **Save**

Теперь система использует эти данные для улучшения будущих генераций!

### 5. Используйте Learning Insights

При следующей генерации система покажет:
- "Educational posts average 4.5/5 rating"
- Похожие успешные примеры
- Рекомендации параметров

## 🔍 Проверка работы

### Backend работает?

Откройте: http://localhost:5000/api/health

Должны увидеть:
```json
{
  "status": "healthy",
  "message": "Module Masters Content Generator API"
}
```

### Посмотрите посты в базе:

http://localhost:5000/api/posts

Должны увидеть JSON со всеми постами.

### Проверьте API ключ:

Попробуйте сгенерировать пост. Если видите ошибку "API key invalid":
- Проверьте backend/.env
- Убедитесь что ключ правильный
- Проверьте баланс в консоли Anthropic

## 🐛 Устранение проблем

### Backend не запускается

**Ошибка: "ModuleNotFoundError"**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**Ошибка: "Address already in use"**
```bash
# Найти процесс на порту 5000
lsof -ti:5000 | xargs kill -9

# Или измените порт в backend/.env:
FLASK_PORT=5001
```

### Frontend не запускается

**Ошибка: "npm ERR!"**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 занят:**
```bash
# React предложит использовать другой порт
# Нажмите Y для подтверждения
```

### Генерация не работает

**"Error generating content"**
- ✅ Проверьте API ключ в backend/.env
- ✅ Проверьте баланс на https://console.anthropic.com/
- ✅ Посмотрите логи backend для деталей

**Медленная генерация:**
- Это нормально! Claude AI занимает 5-15 секунд
- Подождите, не перезагружайте страницу

### База данных проблемы

**"Database is locked"**
```bash
cd backend
rm database.db
python -c "from models import init_db; init_db()"
python seed.py
```

## 📊 Использование приложения

### Content Generator (Generate)
- Многошаговый визард
- Выбор типа, платформы, параметров
- AI генерация с learning insights
- Сохранение в библиотеку

### Post Library (Library)
- Просмотр всех постов
- Фильтры: тип, платформа, рейтинг, сезон
- Сортировка: дата, рейтинг, эффективность
- Редактирование и оценка постов
- Копирование в буфер обмена

### Analytics Dashboard
- Общая статистика
- Графики по типам постов
- Распределение по платформам
- Сезонные тренды
- Top performing posts
- Эффективные хештеги
- Key insights

### Content Calendar
- Визуальный календарь
- Планирование постов
- Запланированные посты
- Цветовая кодировка по типам

### Dashboard
- Быстрый обзор
- Recent posts
- Quick actions
- Основные метрики

## 🎯 Workflow для реального использования

1. **Планирование** (Calendar)
   - Определите даты публикаций
   - Учтите сезонность Calgary

2. **Генерация** (Generate)
   - Создайте контент для запланированных дат
   - Используйте learning insights
   - Сохраните в библиотеку

3. **Редактирование** (Library)
   - Отредактируйте при необходимости
   - Скопируйте для публикации

4. **Публикация** (Вручную в Facebook/Instagram)
   - Опубликуйте на платформах
   - Отметьте как опубликованный

5. **Оценка** (Library → Edit)
   - После 1-2 дней оцените:
     - Рейтинг (насколько хорош пост)
     - Количество обращений
     - Заметки о результатах

6. **Анализ** (Analytics)
   - Смотрите что работает
   - Корректируйте стратегию
   - Используйте insights для новых постов

## 📚 Дополнительные ресурсы

- [README.md](README.md) - Полная документация
- [QUICK_START.md](QUICK_START.md) - Быстрый старт
- [API_DOCS.md](API_DOCS.md) - API документация
- [GET_API_KEY.md](GET_API_KEY.md) - Получение API ключа

## 🔐 Безопасность

- ⚠️ **Никогда не публикуйте .env файл**
- ⚠️ **Не коммитьте API ключи в Git**
- ⚠️ **Добавьте .env в .gitignore** (уже сделано)
- ✅ Установите лимит расходов в Anthropic Console

## 💡 Советы

1. **Начните с seed данных** - изучите примеры
2. **Оцените 5-10 постов** - чтобы система начала учиться
3. **Экспериментируйте с параметрами** - тон, аудитория, длина
4. **Используйте сезонность** - Calgary winter/summer контент
5. **Следите за Analytics** - что работает лучше

## 🆘 Нужна помощь?

- Проверьте логи в терминалах
- Посмотрите раздел "Устранение проблем" выше
- Перечитайте README.md
- Откройте issue на GitHub

---

**Готовы начать?** Запустите приложение и создайте свой первый пост! 🚀
