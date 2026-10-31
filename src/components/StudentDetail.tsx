import React from 'react';
import { Student, Grade } from '../types';

interface StudentDetailProps {
  student: Student;
  grades: Grade[];
  onEdit: () => void;
  onBack: () => void;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student, grades, onEdit, onBack }) => {
  const studentGrades = grades.filter(g => g.studentId === student.id);
  
  const statusLabels: Record<string, string> = {
    active: 'Активен',
    expelled: 'Отчислен',
    graduated: 'Выпуск',
    academic_leave: 'Акад. отпуск',
  };

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800 border-green-200',
    expelled: 'bg-red-100 text-red-800 border-red-200',
    graduated: 'bg-blue-100 text-blue-800 border-blue-200',
    academic_leave: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  const formatDate = (date: string) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getGradeColor = (grade: number) => {
    if (grade === 5) return 'text-green-600 bg-green-50';
    if (grade === 4) return 'text-blue-600 bg-blue-50';
    if (grade === 3) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <i className="fas fa-arrow-left"></i>
          Назад к списку
        </button>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <i className="fas fa-edit mr-2"></i>
          Редактировать
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {student.lastName[0]}{student.firstName[0]}
              </span>
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">
                {student.lastName} {student.firstName} {student.patronymic}
              </h2>
              <p className="text-indigo-200 mt-1">
                {student.specialty} • Группа {student.group} • {student.course} курс
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className={`text-xs px-3 py-1 rounded-full font-medium border ${statusColors[student.status]}`}>
                  {statusLabels[student.status]}
                </span>
                <span className="text-sm text-indigo-200">
                  <i className="fas fa-star mr-1"></i>
                  GPA: {student.gpa.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 pb-2 border-b border-gray-100">
                <i className="fas fa-user text-indigo-400"></i>
                Личные данные
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400">Дата рождения</p>
                  <p className="text-sm text-gray-700">{formatDate(student.birthDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Пол</p>
                  <p className="text-sm text-gray-700">{student.gender === 'male' ? 'Мужской' : 'Женский'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Дата зачисления</p>
                  <p className="text-sm text-gray-700">{formatDate(student.enrollmentDate)}</p>
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 pb-2 border-b border-gray-100">
                <i className="fas fa-graduation-cap text-indigo-400"></i>
                Учебная информация
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400">Факультет</p>
                  <p className="text-sm text-gray-700">{student.faculty}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Специальность</p>
                  <p className="text-sm text-gray-700">{student.specialty}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Группа / Курс</p>
                  <p className="text-sm text-gray-700">{student.group} / {student.course} курс</p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 pb-2 border-b border-gray-100">
                <i className="fas fa-address-book text-indigo-400"></i>
                Контакты
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm text-gray-700">{student.email || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Телефон</p>
                  <p className="text-sm text-gray-700">{student.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Адрес</p>
                  <p className="text-sm text-gray-700">{student.address || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {student.notes && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Примечания</h4>
              <p className="text-sm text-gray-700">{student.notes}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
            <span>Создано: {formatDate(student.createdAt)}</span>
            <span>Обновлено: {formatDate(student.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Grades */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">
            <i className="fas fa-book text-indigo-500 mr-2"></i>
            Успеваемость
          </h3>
        </div>
        <div className="p-6">
          {studentGrades.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {studentGrades.map((grade) => (
                <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{grade.subject}</p>
                    <p className="text-xs text-gray-400">Семестр {grade.semester} • {formatDate(grade.date)}</p>
                  </div>
                  <span className={`text-lg font-bold px-3 py-1 rounded-lg ${getGradeColor(grade.grade)}`}>
                    {grade.grade}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <i className="fas fa-book-open text-3xl mb-2"></i>
              <p className="text-sm">Нет данных об успеваемости</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
