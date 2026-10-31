# АИС Учёт студентов — Django Backend

REST API для автоматизированной информационной системы учёта студентов.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или venv\Scripts\activate  # Windows

pip install -r requirements.txt
```

### 2. Настройка базы данных

По умолчанию используется SQLite (файл `db.sqlite3` создастся автоматически).
Для PostgreSQL отредактируйте `config/settings.py` и установите переменные окружения:

```bash
export DB_NAME=ais_students
export DB_USER=postgres
export DB_PASSWORD=postgres
export DB_HOST=localhost
export DB_PORT=5432
```

### 3. Инициализация БД

```bash
# Создать миграции
python manage.py makemigrations students

# Применить миграции
python manage.py migrate

# Загрузить демо-данные
python manage.py seed_data

# Создать суперпользователя (для админки)
python manage.py createsuperuser
```

### 4. Запуск сервера

```bash
python manage.py runserver 8000
```

API будет доступно по адресу: http://localhost:8000/api/

## 📚 API Endpoints

### Основные ресурсы

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/` | Проверка работоспособности |
| GET/POST | `/api/students/` | Список / создание студентов |
| GET/PUT/DELETE | `/api/students/{id}/` | Детали / обновление / удаление |
| GET | `/api/students/statistics/` | Статистика для дашборда |
| GET | `/api/students/reports/` | Отчёты |
| GET/POST | `/api/grades/` | Список / создание оценок |
| GET/PUT/DELETE | `/api/grades/{id}/` | Детали / обновление / удаление |
| GET/POST | `/api/faculties/` | Факультеты |
| GET/POST | `/api/specialties/` | Специальности |
| GET/POST | `/api/groups/` | Группы |
| GET/POST | `/api/subjects/` | Предметы |

### Документация API

- **Swagger UI**: http://localhost:8000/api/docs/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

### Фильтрация и поиск

Все списковые endpoints поддерживают:
- `?search=` — поиск по текстовым полям
- `?ordering=` — сортировка (например, `?ordering=-gpa`)
- `?status=active` — фильтрация по статусу
- `?course=2` — фильтрация по курсу
- `?faculty_name=...` — фильтрация по факультету

Примеры:
```
GET /api/students/?search=Иванов&status=active&ordering=-gpa
GET /api/grades/?student_id=1&semester=1
```

## 🐳 Docker

```bash
# Сборка и запуск
docker-compose up --build

# Сервисы:
# - API: http://localhost:8000
# - PostgreSQL: localhost:5432
```

## 🔧 Переменные окружения

| Переменная | По умолчанию | Описание |
|------------|--------------|----------|
| `DJANGO_SECRET_KEY` | (встроенный) | Секретный ключ Django |
| `DJANGO_DEBUG` | `True` | Режим отладки |
| `DJANGO_ALLOWED_HOSTS` | `*` | Разрешённые хосты |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,...` | Разрешённые CORS-источники |
| `DB_NAME` | — | Имя БД PostgreSQL |
| `DB_USER` | — | Пользователь БД |
| `DB_PASSWORD` | — | Пароль БД |
| `DB_HOST` | — | Хост БД |
| `DB_PORT` | — | Порт БД |

## 📁 Структура проекта

```
backend/
├── manage.py              # Точка входа Django
├── requirements.txt       # Зависимости Python
├── db.sqlite3            # SQLite БД (создаётся автоматически)
├── config/               # Настройки проекта
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
└── students/             # Приложение учёта студентов
    ├── models.py         # Модели данных
    ├── serializers.py    # DRF сериализаторы
    ├── views.py          # API-представления
    ├── urls.py           # Маршруты
    ├── admin.py          # Админ-панель
    ├── filters.py        # Фильтры
    ├── apps.py
    ├── migrations/
    └── management/
        └── commands/
            └── seed_data.py  # Загрузка демо-данных
```

## 🔗 Интеграция с фронтендом

Фронтенд (React) обращается к API через модуль `src/services/api.ts`.
URL API настраивается через переменную `VITE_API_URL` (по умолчанию `http://localhost:8000/api`).

Если API недоступен, фронтенд автоматически переключается на работу с `localStorage`.
