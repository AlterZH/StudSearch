# 🎓 АИС Учёт студентов

Автоматизированная информационная система учёта студентов с **React + TypeScript** фронтендом и **Django REST Framework** бекендом.

![Stack](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-blue)
![Stack](https://img.shields.io/badge/Backend-Django%20REST%20Framework-green)
![Stack](https://img.shields.io/badge/Database-SQLite%20%2F%20PostgreSQL-blue)

## 📋 Возможности

### Фронтенд (React)
- 📊 **Панель управления** — статистика, графики, последние изменения
- 👥 **Управление студентами** — CRUD, поиск, фильтрация, сортировка
- 📝 **Карточка студента** — полная информация + успеваемость
- 📚 **Успеваемость** — добавление/удаление оценок
- 📈 **Отчёты** — по факультетам, группам, GPA, гендерному составу

### Бекенд (Django)
- 🌐 **REST API** — полный CRUD для всех сущностей
- 🔍 **Фильтрация и поиск** — Django Filter + DRF SearchFilter
- 📖 **Swagger/OpenAPI** — автоматическая документация API
- 🗄️ **Модели данных** — Факультет, Специальность, Группа, Студент, Предмет, Оценка
- 🎛️ **Django Admin** — удобная админ-панель
- 🔄 **Fallback** — если API недоступен, фронтенд работает через localStorage

## 🏗️ Архитектура

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │Dashboard │ │Students  │ │ Grades   │ │ Reports  │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
│       └────────────┼────────────┼────────────┘          │
│              ┌─────┴─────┐                              │
│              │ API Service│ ← fallback на localStorage  │
│              └─────┬─────┘                              │
└────────────────────┼────────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────┼────────────────────────────────────┐
│                    BACKEND (Django)                       │
│              ┌─────┴─────┐                              │
│              │  DRF Views │                              │
│              └─────┬─────┘                              │
│       ┌────────────┼────────────┐                       │
│  ┌────┴────┐ ┌─────┴─────┐ ┌───┴──────┐              │
│  │Models   │ │Serializers│ │ Filters  │              │
│  └────┬────┘ └───────────┘ └──────────┘              │
│       │                                                │
│  ┌────┴──────────────────┐                            │
│  │  SQLite / PostgreSQL   │                            │
│  └───────────────────────┘                            │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Быстрый старт

### Вариант 1: Только фронтенд (с localStorage)

```bash
npm install
npm run dev
```

Фронтенд будет работать автономно, используя localStorage для хранения данных.

### Вариант 2: Фронтенд + Django бекенд

#### 1. Запуск бекенда

```bash
cd backend

# Создать виртуальное окружение
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Установить зависимости
pip install -r requirements.txt

# Создать миграции и применить
python manage.py makemigrations students
python manage.py migrate

# Загрузить демо-данные
python manage.py seed_data

# (Опционально) Создать суперпользователя для админки
python manage.py createsuperuser

# Запустить сервер
python manage.py runserver 8000
```

#### 2. Запуск фронтенда

```bash
# В корне проекта
npm install
npm run dev
```

Фронтенд автоматически определит, что API доступен, и переключится на работу с Django.

### Вариант 3: Docker

```bash
cd backend
docker-compose up --build
```

Это запустит:
- Django API на `http://localhost:8000`
- PostgreSQL на `localhost:5432`

## 📚 API Endpoints

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/` | Health check |
| GET/POST | `/api/students/` | Список / создание |
| GET/PUT/DELETE | `/api/students/{id}/` | Детали / обновление / удаление |
| GET | `/api/students/statistics/` | Статистика |
| GET | `/api/students/reports/` | Отчёты |
| GET/POST | `/api/grades/` | Оценки |
| GET/POST | `/api/faculties/` | Факультеты |
| GET/POST | `/api/specialties/` | Специальности |
| GET/POST | `/api/groups/` | Группы |
| GET/POST | `/api/subjects/` | Предметы |

### Документация API
- **Swagger UI**: http://localhost:8000/api/docs/
- **OpenAPI JSON**: http://localhost:8000/api/schema/

### Примеры запросов

```bash
# Получить всех активных студентов
curl http://localhost:8000/api/students/?status=active

# Поиск по фамилии
curl http://localhost:8000/api/students/?search=Иванов

# Сортировка по GPA
curl http://localhost:8000/api/students/?ordering=-gpa

# Создать студента
curl -X POST http://localhost:8000/api/students/ \
  -H "Content-Type: application/json" \
  -d '{
    "last_name": "Тестов",
    "first_name": "Тест",
    "birth_date": "2002-01-01",
    "gender": "male",
    "group_name": "ИС-23",
    "course": 1,
    "specialty_name": "ИС",
    "faculty_name": "ФИТ",
    "enrollment_date": "2023-09-01",
    "status": "active",
    "gpa": 4.5
  }'
```

## 📁 Структура проекта

```
.
├── src/                          # Фронтенд (React + TypeScript)
│   ├── App.tsx                   # Главный компонент
│   ├── main.tsx                  # Точка входа
│   ├── index.css                 # Стили (Tailwind CSS)
│   ├── types/
│   │   └── index.ts              # TypeScript типы
│   ├── utils/
│   │   └── storage.ts            # localStorage + демо-данные
│   ├── services/
│   │   └── api.ts                # API-сервис (Django + fallback)
│   └── components/
│       ├── Sidebar.tsx           # Боковая навигация
│       ├── Header.tsx            # Шапка
│       ├── Dashboard.tsx         # Панель управления
│       ├── StudentList.tsx       # Список студентов
│       ├── StudentForm.tsx       # Форма добавления/редактирования
│       ├── StudentDetail.tsx     # Карточка студента
│       ├── GradesPage.tsx        # Успеваемость
│       └── ReportsPage.tsx       # Отчёты
│
├── backend/                      # Бекенд (Django REST Framework)
│   ├── manage.py                 # Django CLI
│   ├── requirements.txt          # Python зависимости
│   ├── Dockerfile                # Docker образ
│   ├── docker-compose.yml        # Docker Compose (API + PostgreSQL)
│   ├── config/                   # Настройки проекта
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── students/                 # Django приложение
│       ├── models.py             # Модели БД
│       ├── serializers.py        # DRF сериализаторы
│       ├── views.py              # API views
│       ├── urls.py               # Маршруты
│       ├── admin.py              # Админ-панель
│       ├── filters.py            # Фильтры
│       ├── apps.py
│       ├── migrations/
│       └── management/commands/
│           └── seed_data.py      # Загрузка демо-данных
│
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Конфигурация

### Переменные окружения фронтенда

Создайте файл `.env` в корне:

```env
VITE_API_URL=http://localhost:8000/api
```

### Переменные окружения бекенда

```env
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=*
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
DB_NAME=ais_students
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

## 📊 Модели данных

### Студент
- Личные данные (ФИО, дата рождения, пол)
- Учебные данные (факультет, специальность, группа, курс)
- Контакты (email, телефон, адрес)
- Статус (активен / отчислен / выпуск / акад. отпуск)
- GPA, примечания

### Оценка
- Связь со студентом и предметом
- Оценка (2-5), семестр, дата

### Справочники
- Факультеты
- Специальности
- Группы
- Предметы

## 📝 Лицензия

MIT
