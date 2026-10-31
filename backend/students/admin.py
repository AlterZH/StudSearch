from django.contrib import admin
from .models import Faculty, Specialty, Group, Student, Subject, Grade


@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ['name', 'short_name', 'dean', 'created_at']
    search_fields = ['name', 'short_name']


@admin.register(Specialty)
class SpecialtyAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'faculty']
    list_filter = ['faculty']
    search_fields = ['name', 'code']


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'specialty', 'course', 'enrollment_year']
    list_filter = ['course', 'enrollment_year', 'specialty__faculty']
    search_fields = ['name']


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = [
        'last_name', 'first_name', 'patronymic', 'group_name',
        'course', 'status', 'gpa', 'enrollment_date'
    ]
    list_filter = ['status', 'course', 'gender', 'faculty_name', 'group_name']
    search_fields = ['last_name', 'first_name', 'patronymic', 'email']
    date_hierarchy = 'enrollment_date'
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Личные данные', {
            'fields': ('last_name', 'first_name', 'patronymic', 'birth_date', 'gender')
        }),
        ('Учебные данные', {
            'fields': (
                'group', 'group_name', 'course', 'specialty_name',
                'faculty_name', 'enrollment_date', 'status', 'gpa'
            )
        }),
        ('Контакты', {
            'fields': ('email', 'phone', 'address')
        }),
        ('Примечания', {
            'fields': ('notes',)
        }),
        ('Системные', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'code']
    search_fields = ['name', 'code']


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ['student', 'subject', 'grade', 'semester', 'date']
    list_filter = ['semester', 'subject', 'date']
    search_fields = ['student__last_name', 'student__first_name', 'subject__name']
    date_hierarchy = 'date'
