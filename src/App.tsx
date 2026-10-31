import React, { useState, useEffect } from 'react';
import { Student, Grade } from './types';
import { getStudents, saveStudents, getGrades, saveGrades, generateId } from './utils/storage';
import { studentApi, gradeApi, checkApiAvailability } from './services/api';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import StudentDetail from './components/StudentDetail';
import GradesPage from './components/GradesPage';
import ReportsPage from './components/ReportsPage';

type Page = 'dashboard' | 'students' | 'add-student' | 'edit-student' | 'view-student' | 'grades' | 'reports';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [apiMode, setApiMode] = useState<'api' | 'local' | 'loading'>('loading');
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных при старте
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const isAvailable = await checkApiAvailability();
      setApiMode(isAvailable ? 'api' : 'local');

      try {
        const [studentsData, gradesData] = await Promise.all([
          studentApi.getAll(),
          gradeApi.getAll(),
        ]);
        setStudents(studentsData);
        setGrades(gradesData);
      } catch (error) {
        console.error('Failed to load data:', error);
        setStudents(getStudents());
        setGrades(getGrades());
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    if (page !== 'edit-student' && page !== 'view-student') {
      setSelectedStudent(null);
    }
  };

  const handleSaveStudent = async (student: Student) => {
    try {
      const existingIndex = students.findIndex(s => s.id === student.id);

      if (existingIndex >= 0) {
        const updated = await studentApi.update(student.id, student);
        const updatedStudents = students.map(s => s.id === student.id ? updated : s);
        setStudents(updatedStudents);
        // Синхронизация с localStorage
        saveStudents(updatedStudents);
        showNotification('Данные студента обновлены');
      } else {
        const created = await studentApi.create(student);
        const updatedStudents = [...students, created];
        setStudents(updatedStudents);
        saveStudents(updatedStudents);
        showNotification('Студент успешно добавлен');
      }

      setCurrentPage('students');
      setSelectedStudent(null);
    } catch (error) {
      console.error('Save error:', error);
      showNotification('Ошибка при сохранении', 'error');
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await studentApi.delete(id);
      const updatedStudents = students.filter(s => s.id !== id);
      setStudents(updatedStudents);
      saveStudents(updatedStudents);
      showNotification('Студент удалён');
    } catch (error) {
      console.error('Delete error:', error);
      showNotification('Ошибка при удалении', 'error');
    }
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setCurrentPage('edit-student');
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setCurrentPage('view-student');
  };

  const handleSaveGrade = async (grade: Grade) => {
    try {
      const created = await gradeApi.create({
        studentId: grade.studentId,
        subject: grade.subject,
        grade: grade.grade,
        semester: grade.semester,
        date: grade.date,
      });
      const updatedGrades = [...grades, created];
      setGrades(updatedGrades);
      saveGrades(updatedGrades);
      showNotification('Оценка добавлена');
    } catch (error) {
      console.error('Save grade error:', error);
      showNotification('Ошибка при сохранении оценки', 'error');
    }
  };

  const handleDeleteGrade = async (id: string) => {
    try {
      await gradeApi.delete(id);
      const updatedGrades = grades.filter(g => g.id !== id);
      setGrades(updatedGrades);
      saveGrades(updatedGrades);
      showNotification('Оценка удалена');
    } catch (error) {
      console.error('Delete grade error:', error);
      showNotification('Ошибка при удалении', 'error');
    }
  };

  const getPageTitle = (): string => {
    switch (currentPage) {
      case 'dashboard': return 'Панель управления';
      case 'students': return 'Список студентов';
      case 'add-student': return 'Добавление студента';
      case 'edit-student': return 'Редактирование студента';
      case 'view-student': return selectedStudent ? `${selectedStudent.lastName} ${selectedStudent.firstName}` : 'Карточка студента';
      case 'grades': return 'Успеваемость';
      case 'reports': return 'Отчёты';
      default: return 'АИС Учёт студентов';
    }
  };

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка данных...</p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard students={students} onNavigate={handleNavigate} />;
      case 'students':
        return (
          <StudentList
            students={students}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
            onView={handleViewStudent}
            onAdd={() => setCurrentPage('add-student')}
          />
        );
      case 'add-student':
        return <StudentForm onSave={handleSaveStudent} onCancel={() => setCurrentPage('students')} />;
      case 'edit-student':
        return <StudentForm student={selectedStudent} onSave={handleSaveStudent} onCancel={() => setCurrentPage('students')} />;
      case 'view-student':
        return selectedStudent ? (
          <StudentDetail
            student={selectedStudent}
            grades={grades}
            onEdit={() => setCurrentPage('edit-student')}
            onBack={() => setCurrentPage('students')}
          />
        ) : null;
      case 'grades':
        return (
          <GradesPage
            students={students}
            grades={grades}
            onSaveGrade={handleSaveGrade}
            onDeleteGrade={handleDeleteGrade}
          />
        );
      case 'reports':
        return <ReportsPage students={students} />;
      default:
        return <Dashboard students={students} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header
          title={getPageTitle()}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto">
          {/* Индикатор режима работы */}
          {apiMode !== 'loading' && (
            <div className={`px-4 py-1.5 text-xs text-center ${
              apiMode === 'api' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
            }`}>
              <i className={`fas ${apiMode === 'api' ? 'fa-server' : 'fa-database'} mr-1`}></i>
              {apiMode === 'api'
                ? 'Подключено к Django REST API'
                : 'Режим localStorage (API недоступен)'}
            </div>
          )}
          {renderPage()}
        </main>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all duration-300 animate-slide-up ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default App;
