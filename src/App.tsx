import React, { useState, useEffect } from 'react';
import { Student, Grade } from './types';
import { getStudents, saveStudents, getGrades, saveGrades } from './utils/storage';
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

  useEffect(() => {
    setStudents(getStudents());
    setGrades(getGrades());
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

  const handleSaveStudent = (student: Student) => {
    const existingIndex = students.findIndex(s => s.id === student.id);
    let updatedStudents: Student[];
    
    if (existingIndex >= 0) {
      updatedStudents = [...students];
      updatedStudents[existingIndex] = student;
      showNotification('Данные студента обновлены');
    } else {
      updatedStudents = [...students, student];
      showNotification('Студент успешно добавлен');
    }
    
    setStudents(updatedStudents);
    saveStudents(updatedStudents);
    setCurrentPage('students');
    setSelectedStudent(null);
  };

  const handleDeleteStudent = (id: string) => {
    const updatedStudents = students.filter(s => s.id !== id);
    setStudents(updatedStudents);
    saveStudents(updatedStudents);
    showNotification('Студент удалён');
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setCurrentPage('edit-student');
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setCurrentPage('view-student');
  };

  const handleSaveGrade = (grade: Grade) => {
    const updatedGrades = [...grades, grade];
    setGrades(updatedGrades);
    saveGrades(updatedGrades);
    showNotification('Оценка добавлена');
  };

  const handleDeleteGrade = (id: string) => {
    const updatedGrades = grades.filter(g => g.id !== id);
    setGrades(updatedGrades);
    saveGrades(updatedGrades);
    showNotification('Оценка удалена');
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
