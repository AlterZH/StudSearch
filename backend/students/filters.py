import django_filters
from .models import Student, Grade


class StudentFilter(django_filters.FilterSet):
    min_gpa = django_filters.NumberFilter(field_name='gpa', lookup_expr='gte')
    max_gpa = django_filters.NumberFilter(field_name='gpa', lookup_expr='lte')
    enrollment_after = django_filters.DateFilter(field_name='enrollment_date', lookup_expr='gte')
    enrollment_before = django_filters.DateFilter(field_name='enrollment_date', lookup_expr='lte')
    birth_after = django_filters.DateFilter(field_name='birth_date', lookup_expr='gte')
    birth_before = django_filters.DateFilter(field_name='birth_date', lookup_expr='lte')

    class Meta:
        model = Student
        fields = ['status', 'course', 'gender', 'faculty_name', 'group_name']


class GradeFilter(django_filters.FilterSet):
    min_grade = django_filters.NumberFilter(field_name='grade', lookup_expr='gte')
    max_grade = django_filters.NumberFilter(field_name='grade', lookup_expr='lte')

    class Meta:
        model = Grade
        fields = ['student', 'subject', 'semester']
