from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'faculties', views.FacultyViewSet)
router.register(r'specialties', views.SpecialtyViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'subjects', views.SubjectViewSet)
router.register(r'students', views.StudentViewSet)
router.register(r'grades', views.GradeViewSet)

urlpatterns = [
    path('', views.health_check, name='health-check'),
    path('', include(router.urls)),
]
