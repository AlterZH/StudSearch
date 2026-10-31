from django.db import models


class Faculty(models.Model):
    """Факультет"""
    name = models.CharField('Название', max_length=200, unique=True)
    short_name = models.CharField('Краткое название', max_length=50, blank=True)
    dean = models.CharField('Декан', max_length=200, blank=True)
    created_at = models.DateTimeField('Создано', auto_now_add=True)

    class Meta:
        verbose_name = 'Факультет'
        verbose_name_plural = 'Факультеты'
        ordering = ['name']

    def __str__(self):
        return self.name


class Specialty(models.Model):
    """Специальность"""
    name = models.CharField('Название', max_length=200)
    code = models.CharField('Код специальности', max_length=20, blank=True)
    faculty = models.ForeignKey(
        Faculty,
        on_delete=models.CASCADE,
        related_name='specialties',
        verbose_name='Факультет'
    )
    created_at = models.DateTimeField('Создано', auto_now_add=True)

    class Meta:
        verbose_name = 'Специальность'
        verbose_name_plural = 'Специальности'
        ordering = ['name']

    def __str__(self):
        return f'{self.code} {self.name}' if self.code else self.name


class Group(models.Model):
    """Учебная группа"""
    name = models.CharField('Название группы', max_length=20, unique=True)
    specialty = models.ForeignKey(
        Specialty,
        on_delete=models.CASCADE,
        related_name='groups',
        verbose_name='Специальность'
    )
    course = models.PositiveSmallIntegerField('Курс', default=1)
    enrollment_year = models.PositiveSmallIntegerField('Год набора', default=2020)
    created_at = models.DateTimeField('Создано', auto_now_add=True)

    class Meta:
        verbose_name = 'Группа'
        verbose_name_plural = 'Группы'
        ordering = ['name']

    def __str__(self):
        return self.name


class Student(models.Model):
    """Студент"""

    class GenderChoices(models.TextChoices):
        MALE = 'male', 'Мужской'
        FEMALE = 'female', 'Женский'

    class StatusChoices(models.TextChoices):
        ACTIVE = 'active', 'Активен'
        EXPELLED = 'expelled', 'Отчислен'
        GRADUATED = 'graduated', 'Выпуск'
        ACADEMIC_LEAVE = 'academic_leave', 'Академический отпуск'

    # Личные данные
    last_name = models.CharField('Фамилия', max_length=100)
    first_name = models.CharField('Имя', max_length=100)
    patronymic = models.CharField('Отчество', max_length=100, blank=True)
    birth_date = models.DateField('Дата рождения')
    gender = models.CharField(
        'Пол',
        max_length=10,
        choices=GenderChoices.choices,
        default=GenderChoices.MALE
    )

    # Учебные данные
    group = models.ForeignKey(
        Group,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='students',
        verbose_name='Группа'
    )
    # Дублирующие поля для обратной совместимости с фронтендом
    group_name = models.CharField('Название группы (текст)', max_length=20, blank=True)
    course = models.PositiveSmallIntegerField('Курс', default=1)
    specialty_name = models.CharField('Специальность (текст)', max_length=200, blank=True)
    faculty_name = models.CharField('Факультет (текст)', max_length=200, blank=True)

    # Контакты
    email = models.EmailField('Email', blank=True)
    phone = models.CharField('Телефон', max_length=20, blank=True)
    address = models.TextField('Адрес', blank=True)

    # Статус
    enrollment_date = models.DateField('Дата зачисления')
    status = models.CharField(
        'Статус',
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.ACTIVE
    )
    gpa = models.DecimalField('Средний балл (GPA)', max_digits=3, decimal_places=2, default=0)
    notes = models.TextField('Примечания', blank=True)

    # Метаданные
    created_at = models.DateTimeField('Создано', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлено', auto_now=True)

    class Meta:
        verbose_name = 'Студент'
        verbose_name_plural = 'Студенты'
        ordering = ['last_name', 'first_name']
        indexes = [
            models.Index(fields=['last_name', 'first_name']),
            models.Index(fields=['status']),
            models.Index(fields=['group']),
        ]

    def __str__(self):
        return f'{self.last_name} {self.first_name} {self.patronymic}'

    @property
    def full_name(self):
        parts = [self.last_name, self.first_name, self.patronymic]
        return ' '.join(p for p in parts if p)


class Subject(models.Model):
    """Учебный предмет"""
    name = models.CharField('Название', max_length=200, unique=True)
    code = models.CharField('Код', max_length=20, blank=True)
    created_at = models.DateTimeField('Создано', auto_now_add=True)

    class Meta:
        verbose_name = 'Предмет'
        verbose_name_plural = 'Предметы'
        ordering = ['name']

    def __str__(self):
        return self.name


class Grade(models.Model):
    """Оценка студента"""
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='grades',
        verbose_name='Студент'
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='grades',
        verbose_name='Предмет'
    )
    # Дублирующее поле для совместимости с фронтендом
    subject_name = models.CharField('Название предмета (текст)', max_length=200, blank=True)
    grade = models.PositiveSmallIntegerField('Оценка')
    semester = models.PositiveSmallIntegerField('Семестр', default=1)
    date = models.DateField('Дата')
    created_at = models.DateTimeField('Создано', auto_now_add=True)

    class Meta:
        verbose_name = 'Оценка'
        verbose_name_plural = 'Оценки'
        ordering = ['-date']

    def __str__(self):
        return f'{self.student} - {self.subject}: {self.grade}'
