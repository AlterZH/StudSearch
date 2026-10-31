import React from 'react';
import { Student } from '../types';

interface DashboardProps {
  students: Student[];
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ students, onNavigate }) => {
  const activeStudents = students.filter(s => s.status === 'active').length;
  const expelledStudents = students.filter(s => s.status === 'expelled').length;
  const graduatedStudents = students.filter(s => s.status === 'graduated').length;
  const academicLeave = students.filter(s => s.status === 'academic_leave').length;
  const avgGpa = students.filter(s => s.status === 'active').reduce((acc, s) => acc + s.gpa, 0) / (activeStudents || 1);
  
  const faculties = [...new Set(students.map(s => s.faculty))];
  const facultyStats = faculties.map(f => ({
    name: f,
    count: students.filter(s => s.faculty === f && s.status === 'active').length,
  }));

  const courseStats = [1, 2, 3, 4, 5].map(c => ({
    course: c,
    count: students.filter(s => s.course === c && s.status === 'active').length,
  }));

  const recentStudents = [...students]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const statusLabels: Record<string, string> = {
    active: 'Активен',
    expelled: 'Отчислен',
    graduated: 'Выпуск',
    academic_leave: 'Акад. отпуск',
  };

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    expelled: 'bg-red-100 text-red-800',
    graduated: 'bg-blue-100 text-blue-800',
    academic_leave: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Всего студентов</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{students.length}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-users text-indigo-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Активных</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{activeStudents}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-user-check text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Средний GPA</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{avgGpa.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-star text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Отчислено</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{expelledStudents}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-user-times text-red-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="fas fa-building text-indigo-500 mr-2"></i>
            По факультетам
          </h3>
          <div className="space-y-3">
            {facultyStats.map((f) => (
              <div key={f.name} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-48 truncate">{f.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                    style={{ width: `${Math.max((f.count / students.length) * 100, 15)}%` }}
                  >
                    <span className="text-xs font-medium text-white">{f.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="fas fa-layer-group text-indigo-500 mr-2"></i>
            По курсам
          </h3>
          <div className="flex items-end justify-around h-40 gap-4">
            {courseStats.map((c) => (
              <div key={c.course} className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-gray-700">{c.count}</span>
                <div
                  className="w-12 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-500"
                  style={{ height: `${Math.max(c.count * 30, 10)}px` }}
                ></div>
                <span className="text-xs text-gray-500">{c.course} курс</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Summary & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="fas fa-chart-pie text-indigo-500 mr-2"></i>
            Статусы
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-green-700">Активные</span>
              <span className="font-bold text-green-700">{activeStudents}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-red-700">Отчисленные</span>
              <span className="font-bold text-red-700">{expelledStudents}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-700">Выпускники</span>
              <span className="font-bold text-blue-700">{graduatedStudents}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm text-yellow-700">Акад. отпуск</span>
              <span className="font-bold text-yellow-700">{academicLeave}</span>
            </div>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              <i className="fas fa-clock text-indigo-500 mr-2"></i>
              Последние изменения
            </h3>
            <button
              onClick={() => onNavigate('students')}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Все студенты →
            </button>
          </div>
          <div className="space-y-2">
            {recentStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-indigo-600">
                      {student.lastName[0]}{student.firstName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {student.lastName} {student.firstName} {student.patronymic}
                    </p>
                    <p className="text-xs text-gray-500">Группа {student.group} • {student.faculty}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[student.status]}`}>
                  {statusLabels[student.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
