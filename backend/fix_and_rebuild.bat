@echo off
REM Скрипт для переустановки зависимостей и пересоздания БД (Windows)
REM Используйте при возникновении ошибки 'super' object has no attribute 'dicts'

echo Переустановка зависимостей Django...

REM Активация venv если существует
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)

REM Переустановка Django с правильными версиями
pip install --force-reinstall "Django>=4.2,<5.1"
pip install -r requirements.txt

echo.
echo Удаление старой базы данных...
if exist db.sqlite3 del db.sqlite3

echo.
echo Применение миграций...
python manage.py makemigrations students
python manage.py migrate

echo.
echo Загрузка демо-данных...
python manage.py seed_data

echo.
echo Готово! Запустите сервер:
echo    python manage.py runserver 8000
pause
