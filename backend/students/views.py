from django.db.models import Avg
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Faculty, Specialty, Group, Student, Subject, Grade
from .serializers import (
    FacultySerializer, SpecialtySerializer, GroupSerializer,
    StudentSerializer, StudentListSerializer, SubjectSerializer,
    GradeSerializer,
)


class FacultyViewSet(viewsets.ModelViewSet):
    """API для работы с факультетами"""
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer
    search_fields = ['name', 'short_name']
    ordering_fields = ['name', 'created_at']


class SpecialtyViewSet(viewsets.ModelViewSet):
    """API для работы со специальностями"""
    queryset = Specialty.objects.select_related('faculty').all()
    serializer_class = SpecialtySerializer
    filterset_fields = ['faculty']
    search_fields = ['name', 'code']


class GroupViewSet(viewsets.ModelViewSet):
    """API для работы с группами"""
    queryset = Group.objects.select_related('specialty', 'specialty__faculty').all()
    serializer_class = GroupSerializer
    filterset_fields = ['course', 'enrollment_year', 'specialty']
    search_fields = ['name']
    ordering_fields = ['name', 'course']


class SubjectViewSet(viewsets.ModelViewSet):
    """API для работы с предметами"""
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    search_fields = ['name', 'code']


class StudentViewSet(viewsets.ModelViewSet):
    """API для работы со студентами"""
    queryset = Student.objects.all()
    filterset_fields = ['status', 'course', 'gender', 'faculty_name', 'group_name']
    search_fields = ['last_name', 'first_name', 'patronymic', 'email', 'group_name']
    ordering_fields = ['last_name', 'first_name', 'gpa', 'course', 'status', 'created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return StudentListSerializer
        return StudentSerializer

    @staticmethod
    def _safe_avg(qs):
        """Безопасное вычисление среднего значения GPA"""
        result = qs.aggregate(avg=Avg('gpa'))['avg']
        if result is None:
            return 0.0
        return round(float(result), 2)

    @staticmethod
    def _distinct_values(qs, field):
        """Получить уникальные значения поля, исключая пустые"""
        return [
            v[field] for v in qs.values(field).distinct()
            if v.get(field)
        ]

    def statistics(self, request):
        """Статистика для дашборда (GET /api/students/statistics/)"""
        qs = Student.objects.all()
        active_qs = qs.filter(status='active')

        # Факультеты
        faculties_data = []
        for name in self._distinct_values(qs, 'faculty_name'):
            f_qs = qs.filter(faculty_name=name)
            faculties_data.append({
                'name': name,
                'total': f_qs.count(),
                'active': f_qs.filter(status='active').count(),
            })

        # Курсы
        courses_data = []
        for c in range(1, 6):
            count = active_qs.filter(course=c).count()
            courses_data.append({'course': c, 'count': count})

        data = {
            'total_students': qs.count(),
            'active_students': active_qs.count(),
            'expelled_students': qs.filter(status='expelled').count(),
            'graduated_students': qs.filter(status='graduated').count(),
            'academic_leave': qs.filter(status='academic_leave').count(),
            'average_gpa': self._safe_avg(active_qs),
            'faculties': faculties_data,
            'courses': courses_data,
        }
        return Response(data)

    def reports(self, request):
        """Отчёты по факультетам и группам (GET /api/students/reports/)"""
        qs = Student.objects.all()

        # По факультетам
        faculty_report = []
        for name in self._distinct_values(qs, 'faculty_name'):
            f_qs = qs.filter(faculty_name=name)
            active_qs = f_qs.filter(status='active')
            faculty_report.append({
                'faculty': name,
                'total': f_qs.count(),
                'active': active_qs.count(),
                'expelled': f_qs.filter(status='expelled').count(),
                'graduated': f_qs.filter(status='graduated').count(),
                'avg_gpa': self._safe_avg(active_qs),
            })

        # По группам
        group_report = []
        for name in self._distinct_values(qs, 'group_name'):
            g_qs = qs.filter(group_name=name)
            active_qs = g_qs.filter(status='active')
            first = g_qs.first()
            group_report.append({
                'group': name,
                'faculty': first.faculty_name if first else '',
                'total': g_qs.count(),
                'active': active_qs.count(),
                'avg_gpa': self._safe_avg(active_qs),
            })

        # Гендерный состав
        gender = {
            'male': qs.filter(gender='male').count(),
            'female': qs.filter(gender='female').count(),
        }

        # Распределение GPA
        active_qs = qs.filter(status='active')
        gpa_dist = {
            'excellent': active_qs.filter(gpa__gte=4.5).count(),
            'good': active_qs.filter(gpa__gte=3.5, gpa__lt=4.5).count(),
            'satisfactory': active_qs.filter(gpa__gte=2.5, gpa__lt=3.5).count(),
            'poor': active_qs.filter(gpa__lt=2.5).count(),
        }

        return Response({
            'faculty_report': faculty_report,
            'group_report': group_report,
            'gender': gender,
            'gpa_distribution': gpa_dist,
        })


class GradeViewSet(viewsets.ModelViewSet):
    """API для работы с оценками"""
    queryset = Grade.objects.select_related('student', 'subject').all()
    serializer_class = GradeSerializer
    filterset_fields = ['student', 'subject', 'semester']
    ordering_fields = ['date', 'grade', 'semester']

    def get_queryset(self):
        qs = super().get_queryset()
        student_id = self.request.query_params.get('student_id')
        if student_id:
            qs = qs.filter(student_id=student_id)
        return qs


@api_view(['GET'])
def health_check(request):
    """Проверка работоспособности API"""
    return Response({
        'status': 'ok',
        'service': 'АИС Учёт студентов API',
        'version': '1.0.0',
    })
