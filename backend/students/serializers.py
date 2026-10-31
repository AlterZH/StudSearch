from rest_framework import serializers
from .models import Faculty, Specialty, Group, Student, Subject, Grade


class FacultySerializer(serializers.ModelSerializer):
    students_count = serializers.SerializerMethodField()

    class Meta:
        model = Faculty
        fields = ['id', 'name', 'short_name', 'dean', 'students_count', 'created_at']

    def get_students_count(self, obj):
        return Student.objects.filter(faculty_name=obj.name, status='active').count()


class SpecialtySerializer(serializers.ModelSerializer):
    faculty_name = serializers.CharField(source='faculty.name', read_only=True)

    class Meta:
        model = Specialty
        fields = ['id', 'name', 'code', 'faculty', 'faculty_name', 'created_at']


class GroupSerializer(serializers.ModelSerializer):
    specialty_name = serializers.CharField(source='specialty.name', read_only=True)
    faculty_name = serializers.CharField(source='specialty.faculty.name', read_only=True)
    students_count = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = [
            'id', 'name', 'specialty', 'specialty_name', 'faculty_name',
            'course', 'enrollment_year', 'students_count', 'created_at'
        ]

    def get_students_count(self, obj):
        return obj.students.filter(status='active').count()


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'code', 'created_at']


class GradeSerializer(serializers.ModelSerializer):
    subject_name_display = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = Grade
        fields = [
            'id', 'student', 'student_name', 'subject', 'subject_name',
            'subject_name_display', 'grade', 'semester', 'date', 'created_at'
        ]

    def get_subject_name_display(self, obj):
        return obj.subject_name or obj.subject.name

    def get_student_name(self, obj):
        return obj.student.full_name


class StudentSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    grades = GradeSerializer(many=True, read_only=True)
    group_display = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            'id', 'last_name', 'first_name', 'patronymic', 'full_name',
            'birth_date', 'gender', 'group', 'group_display',
            'group_name', 'course', 'specialty_name', 'faculty_name',
            'email', 'phone', 'address',
            'enrollment_date', 'status', 'gpa', 'notes',
            'grades', 'created_at', 'updated_at'
        ]

    def get_group_display(self, obj):
        if obj.group:
            return obj.group.name
        return obj.group_name


class StudentListSerializer(serializers.ModelSerializer):
    """Упрощённый сериализатор для списка студентов"""
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Student
        fields = [
            'id', 'last_name', 'first_name', 'patronymic', 'full_name',
            'group_name', 'course', 'faculty_name', 'gpa', 'status',
            'email', 'created_at', 'updated_at'
        ]


class DashboardStatsSerializer(serializers.Serializer):
    total_students = serializers.IntegerField()
    active_students = serializers.IntegerField()
    expelled_students = serializers.IntegerField()
    graduated_students = serializers.IntegerField()
    academic_leave = serializers.IntegerField()
    average_gpa = serializers.FloatField()
    faculties = serializers.ListField()
    courses = serializers.ListField()


class ReportSerializer(serializers.Serializer):
    """Сериализатор для отчётов"""
    faculty = serializers.CharField()
    total = serializers.IntegerField()
    active = serializers.IntegerField()
    expelled = serializers.IntegerField()
    graduated = serializers.IntegerField()
    avg_gpa = serializers.FloatField()
