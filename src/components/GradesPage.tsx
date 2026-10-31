import React, { useState } from 'react';
import { Student, Grade } from '../types';
import { generateId } from '../utils/storage';

interface GradesPageProps {
  students: Student[];
  grades: Grade[];
  onSaveGrade: (grade: Grade) => void;
  onDeleteGrade: (id: string) => void;
}

const GradesPage: React.FC<GradesPageProps> = ({ students, grades, onSaveGrade, onDeleteGrade }) => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [subject, setSubject] = useState('');
  const [gradeValue, setGradeValue] = useState(5);
  const [semester, setSemester] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const activeStudents = students.filter(s => s.status === 'active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !subject.trim()) return;

    const newGrade: Grade = {
      id: generateId(),
      studentId: selectedStudent,
      subject: subject.trim(),
      grade: gradeValue,
      semester,
      date: new Date().toISOString().split('T')[0],
    };
    onSaveGrade(newGrade);
    setSubject('');
    setGradeValue(5);
    setShowForm(false);
  };

  const getStudentName = (id: string) => {
    const s = students.find(st => st.id === id);
    return s ? `${s.lastName} ${s.firstName}` : 'Неизвестный';
  };

  const getGradeColor = (grade: number) => {
    if (grade === 5) return 'text-green-600 bg-green-50 border-green-200';
    if (grade === 4) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (grade === 3) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Всего оценок: {grades.length}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <i className="fas fa-plus mr-2"></i>
          Добавить оценку
        </button>
      </div>

      {/* Add Grade Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Добавить оценку</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Студент</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Выберите студента</option>
                {activeStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.lastName} {s.firstName} ({s.group})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Предмет</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Математика"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Оценка</label>
              <select
                value={gradeValue}
                onChange={(e) => setGradeValue(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={5}>5 (Отлично)</option>
                <option value={4}>4 (Хорошо)</option>
                <option value={3}>3 (Удовл.)</option>
                <option value={2}>2 (Неуд.)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Семестр</label>
              <div className="flex gap-2">
                <select
                  value={semester}
                  onChange={(e) => setSemester(parseInt(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
                  <i className="fas fa-check"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Grades Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Студент</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Предмет</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Семестр</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Оценка</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {grades.map((grade) => (
                <tr key={grade.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-700">{getStudentName(grade.studentId)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{grade.subject}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{grade.semester}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(grade.date).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-sm font-bold px-3 py-1 rounded-lg border ${getGradeColor(grade.grade)}`}>
                      {grade.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onDeleteGrade(grade.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <i className="fas fa-trash text-sm"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {grades.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    <i className="fas fa-book-open text-3xl mb-2"></i>
                    <p className="text-sm">Нет данных об успеваемости</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GradesPage;
