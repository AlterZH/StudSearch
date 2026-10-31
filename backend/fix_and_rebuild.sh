#!/bin/bash
# Скрипт для переустановки зависимостей и пересоздания БД
# Используйте при возникновении ошибки 'super' object has no attribute 'dicts'

set -e

echo "🔄 Переустановка зависимостей Django..."

# Активация venv если существует
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Переустановка Django с правильными версиями
pip install --force-reinstall "Django>=4.2,<5.1"
pip install -r requirements.txt

echo ""
echo "🗑️  Удаление старой базы данных..."
rm -f db.sqlite3

echo ""
echo "📦 Применение миграций..."
python manage.py makemigrations students
python manage.py migrate

echo ""
echo "🌱 Загрузка демо-данных..."
python manage.py seed_data

echo ""
echo "✅ Готово! Запустите сервер:"
echo "   python manage.py runserver 8000"
