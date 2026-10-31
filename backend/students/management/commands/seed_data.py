"""
Management-команда для заполнения БД демо-данными.
Запуск: python manage.py seed_data
"""
from datetime import date
from django.core.management.base import BaseCommand
from students.models import Faculty, Specialty, Group, Student, Subject, Grade


class Command(BaseCommand):
    help = 'Заполняет базу данных демо-данными'

    def handle(self, *args, **options):
        self.stdout.write('Заполнение демо-данными...')

        # Факультеты
        faculties_data = [
            ('Информационных технологий', 'ФИТ', 'Иванов А.А.'),
            ('Экономики и управления', 'ФЭУ', 'Петров Б.Б.'),
            ('Правовой', 'ФП', 'Сидорова В.Г.'),
        ]
        faculties = {}
        for name, short, dean in faculties_data:
            f, _ = Faculty.objects.get_or_create(
                name=name,
                defaults={'short_name': short, 'dean': dean}
            )
            faculties[name] = f
            self.stdout.write(f'  Факультет: {f.name}')

        # Специальности
        specialties_data = [
            ('Информационные системы', '09.03.02', 'Информационных технологий'),
            ('Программная инженерия', '09.03.04', 'Информационных технологий'),
            ('Экономика', '38.03.01', 'Экономики и управления'),
            ('Юриспруденция', '40.03.01', 'Правовой'),
        ]
        specialties = {}
        for name, code, fac_name in specialties_data:
            s, _ = Specialty.objects.get_or_create(
                name=name,
                defaults={'code': code, 'faculty': faculties[fac_name]}
            )
            specialties[name] = s
            self.stdout.write(f'  Специальность: {s}')

        # Группы
        groups_data = [
            ('ИС-21', 'Информационные системы', 3, 2021),
            ('ИС-19', 'Информационные системы', 5, 2019),
            ('ПИ-22', 'Программная инженерия', 2, 2022),
            ('ЭФ-20', 'Экономика', 4, 2020),
            ('ЭФ-22', 'Экономика', 2, 2022),
            ('ЮР-21', 'Юриспруденция', 3, 2021),
            ('ЮР-20', 'Юриспруденция', 4, 2020),
        ]
        groups = {}
        for name, spec_name, course, year in groups_data:
            g, _ = Group.objects.get_or_create(
                name=name,
                defaults={
                    'specialty': specialties[spec_name],
                    'course': course,
                    'enrollment_year': year,
                }
            )
            groups[name] = g
            self.stdout.write(f'  Группа: {g.name}')

        # Предметы
        subjects_data = [
            ('Математика', 'МАТ-01'),
            ('Программирование', 'ПР-01'),
            ('Физика', 'ФИЗ-01'),
            ('Английский язык', 'ЯЗ-01'),
            ('Экономическая теория', 'ЭК-01'),
            ('Менеджмент', 'МЕН-01'),
            ('Гражданское право', 'ГП-01'),
            ('Уголовное право', 'УП-01'),
            ('Базы данных', 'БД-01'),
            ('Веб-разработка', 'ВР-01'),
        ]
        subjects = {}
        for name, code in subjects_data:
            s, _ = Subject.objects.get_or_create(name=name, defaults={'code': code})
            subjects[name] = s
            self.stdout.write(f'  Предмет: {s.name}')

        # Студенты
        students_data = [
            {
                'last_name': 'Иванов', 'first_name': 'Иван', 'patronymic': 'Иванович',
                'birth_date': date(2002, 3, 15), 'gender': 'male',
                'group': groups['ИС-21'], 'group_name': 'ИС-21', 'course': 3,
                'specialty_name': 'Информационные системы',
                'faculty_name': 'Информационных технологий',
                'email': 'ivanov@university.ru', 'phone': '+7 (900) 123-45-67',
                'address': 'г. Москва, ул. Ленина, д. 10, кв. 5',
                'enrollment_date': date(2021, 9, 1), 'status': 'active', 'gpa': 4.5,
                'notes': 'Староста группы',
            },
            {
                'last_name': 'Петрова', 'first_name': 'Мария', 'patronymic': 'Сергеевна',
                'birth_date': date(2003, 7, 22), 'gender': 'female',
                'group': groups['ПИ-22'], 'group_name': 'ПИ-22', 'course': 2,
                'specialty_name': 'Программная инженерия',
                'faculty_name': 'Информационных технологий',
                'email': 'petrova@university.ru', 'phone': '+7 (901) 234-56-78',
                'address': 'г. Москва, ул. Пушкина, д. 25, кв. 12',
                'enrollment_date': date(2022, 9, 1), 'status': 'active', 'gpa': 4.8,
                'notes': 'Отличница, стипендиат',
            },
            {
                'last_name': 'Сидоров', 'first_name': 'Алексей', 'patronymic': 'Николаевич',
                'birth_date': date(2001, 11, 8), 'gender': 'male',
                'group': groups['ЭФ-20'], 'group_name': 'ЭФ-20', 'course': 4,
                'specialty_name': 'Экономика',
                'faculty_name': 'Экономики и управления',
                'email': 'sidorov@university.ru', 'phone': '+7 (902) 345-67-89',
                'address': 'г. Москва, ул. Гагарина, д. 7, кв. 3',
                'enrollment_date': date(2020, 9, 1), 'status': 'active', 'gpa': 3.7,
                'notes': '',
            },
            {
                'last_name': 'Козлова', 'first_name': 'Елена', 'patronymic': 'Андреевна',
                'birth_date': date(2002, 5, 30), 'gender': 'female',
                'group': groups['ЮР-21'], 'group_name': 'ЮР-21', 'course': 3,
                'specialty_name': 'Юриспруденция',
                'faculty_name': 'Правовой',
                'email': 'kozlova@university.ru', 'phone': '+7 (903) 456-78-90',
                'address': 'г. Москва, ул. Мира, д. 15, кв. 8',
                'enrollment_date': date(2021, 9, 1), 'status': 'active', 'gpa': 4.2,
                'notes': 'Участница научных конференций',
            },
            {
                'last_name': 'Волков', 'first_name': 'Дмитрий', 'patronymic': 'Петрович',
                'birth_date': date(2000, 1, 14), 'gender': 'male',
                'group': groups['ИС-19'], 'group_name': 'ИС-19', 'course': 5,
                'specialty_name': 'Информационные системы',
                'faculty_name': 'Информационных технологий',
                'email': 'volkov@university.ru', 'phone': '+7 (904) 567-89-01',
                'address': 'г. Москва, ул. Советская, д. 30, кв. 20',
                'enrollment_date': date(2019, 9, 1), 'status': 'graduated', 'gpa': 4.0,
                'notes': 'Выпуск 2024',
            },
            {
                'last_name': 'Новикова', 'first_name': 'Анна', 'patronymic': 'Дмитриевна',
                'birth_date': date(2003, 9, 18), 'gender': 'female',
                'group': groups['ПИ-22'], 'group_name': 'ПИ-22', 'course': 2,
                'specialty_name': 'Программная инженерия',
                'faculty_name': 'Информационных технологий',
                'email': 'novikova@university.ru', 'phone': '+7 (905) 678-90-12',
                'address': 'г. Москва, ул. Центральная, д. 5, кв. 1',
                'enrollment_date': date(2022, 9, 1), 'status': 'active', 'gpa': 3.9,
                'notes': '',
            },
            {
                'last_name': 'Морозов', 'first_name': 'Сергей', 'patronymic': 'Владимирович',
                'birth_date': date(2002, 12, 3), 'gender': 'male',
                'group': groups['ЭФ-22'], 'group_name': 'ЭФ-22', 'course': 2,
                'specialty_name': 'Экономика',
                'faculty_name': 'Экономики и управления',
                'email': 'morozov@university.ru', 'phone': '+7 (906) 789-01-23',
                'address': 'г. Москва, ул. Садовая, д. 12, кв. 7',
                'enrollment_date': date(2022, 9, 1), 'status': 'academic_leave', 'gpa': 3.2,
                'notes': 'Академический отпуск с 01.2024',
            },
            {
                'last_name': 'Соколова', 'first_name': 'Ольга', 'patronymic': 'Игоревна',
                'birth_date': date(2001, 6, 25), 'gender': 'female',
                'group': groups['ЮР-20'], 'group_name': 'ЮР-20', 'course': 4,
                'specialty_name': 'Юриспруденция',
                'faculty_name': 'Правовой',
                'email': 'sokolova@university.ru', 'phone': '+7 (907) 890-12-34',
                'address': 'г. Москва, ул. Лесная, д. 8, кв. 15',
                'enrollment_date': date(2020, 9, 1), 'status': 'expelled', 'gpa': 2.8,
                'notes': 'Отчислена за неуспеваемость',
            },
        ]
        students = []
        for data in students_data:
            s, created = Student.objects.get_or_create(
                last_name=data['last_name'],
                first_name=data['first_name'],
                defaults=data
            )
            students.append(s)
            status_str = 'создан' if created else 'существует'
            self.stdout.write(f'  Студент: {s.get_full_name()} ({status_str})')

        # Оценки
        grades_data = [
            (students[0], subjects['Математика'], 5, 1, date(2024, 1, 15)),
            (students[0], subjects['Программирование'], 4, 1, date(2024, 1, 15)),
            (students[0], subjects['Физика'], 5, 1, date(2024, 1, 15)),
            (students[1], subjects['Математика'], 5, 1, date(2024, 1, 15)),
            (students[1], subjects['Программирование'], 5, 1, date(2024, 1, 15)),
            (students[1], subjects['Английский язык'], 5, 1, date(2024, 1, 15)),
            (students[2], subjects['Экономическая теория'], 4, 1, date(2024, 1, 15)),
            (students[2], subjects['Менеджмент'], 3, 1, date(2024, 1, 15)),
            (students[3], subjects['Гражданское право'], 5, 1, date(2024, 1, 15)),
            (students[3], subjects['Уголовное право'], 4, 1, date(2024, 1, 15)),
        ]
        for student, subject, grade, semester, d in grades_data:
            g, created = Grade.objects.get_or_create(
                student=student,
                subject=subject,
                semester=semester,
                date=d,
                defaults={'grade': grade}
            )
            if created:
                self.stdout.write(f'  Оценка: {student.last_name} - {subject.name}: {grade}')

        self.stdout.write(self.style.SUCCESS('✓ Демо-данные успешно загружены!'))
