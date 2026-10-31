from django.db.models import Avg, Count, Q
from rest_framework import viewsets, status, filters
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Faculty, Specialty, Group, Student, Subject, Grade
from .serializers import (
    FacultySerializer, SpecialtySerializer, GroupSerializer,
    StudentSerializer, StudentListSerializer, SubjectSerializer,
    GradeSerializer, DashboardStatsSerializer, ReportSerializer,
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

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Статистика для дашборда"""
        qs = Student.objects.all()
        active_qs = qs.filter(status='active')

        # Факультеты
        faculties_data = []
        for f in qs.values('faculty_name').distinct():
            name = f['faculty_name']
            if not name:
                continue
            total = qs.filter(faculty_name=name).count()
            active = qs.filter(faculty_name=name, status='active').count()
            faculties_data.append({
                'name': name,
                'total': total,
                'active': active,
            })

        # Курсы
        courses_data = []
        for c in range(1, 6):
            count = active_qs.filter(course=c).count()
            courses_data.append({'course': c, 'count': count})

        avg_gpa = active_qs.aggregate(avg=Avg('gpa'))['avg'] or 0

        data = {
            'total_students': qs.count(),
            'active_students': active_qs.count(),
            'expelled_students': qs.filter(status='expelled').count(),
            'graduated_students': qs.filter(status='graduated').count(),
            'academic_leave': qs.filter(status='academic_leave').count(),
            'average_gpa': round(float(avg_gpa), 2),
            'faculties': faculties_data,
            'courses': courses_data,
        }
        return Response(data)

    @action(detail=False, methods=['get'])
    def reports(self, request):
        """Отчёты по факультетам и группам"""
        qs = Student.objects.all()

        # По факультетам
        faculty_report = []
        for f in qs.values('faculty_name').distinct():
            name = f['faculty_name']
            if not name:
                continue
            f_qs = qs.filter(faculty_name=name)
            active_qs = f_qs.filter(status='active')
            avg_gpa = active_qs.aggregate(avg=Avg('gpa'))['avg'] or 0
            faculty_report.append({
                'faculty': name,
                'total': f_qs.count(),
                'active': active_qs.count(),
                'expelled': f_qs.filter(status='expelled').count(),
                'graduated': f_qs.filter(status='graduated').count(),
                'avg_gpa': round(float(avg_gpa), 2),
            })

        # По группам
        group_report = []
        for g in qs.values('group_name').distinct():
            name = g['group_name']
            if not name:
                continue
            g_qs = qs.filter(group_name=name)
            active_qs = g_qs.filter(status='active')
            avg_gpa = active_qs.aggregate(avg=Avg('gpa'))['avg'] or 0
            group_report.append({
                'group': name,
                'faculty': g_qs.first().faculty_name if g_qs.exists() else '',
                'total': g_qs.count(),
                'active': active_qs.count(),
                'avg_gpa': round(float(avg_gpa), 2),
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
