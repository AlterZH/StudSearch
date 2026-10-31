import React from 'react';
import { Student } from '../types';

interface ReportsPageProps {
  students: Student[];
}

const ReportsPage: React.FC<ReportsPageProps> = ({ students }) => {
  const activeStudents = students.filter(s => s.status === 'active');
  
  const faculties = [...new Set(students.map(s => s.faculty))];
  const groups = [...new Set(students.map(s => s.group))];
  const specialties = [...new Set(students.map(s => s.specialty))];

  const facultyReport = faculties.map(f => {
    const fStudents = students.filter(s => s.faculty === f);
    const active = fStudents.filter(s => s.status === 'active');
    const avgGpa = active.length > 0 ? active.reduce((acc, s) => acc + s.gpa, 0) / active.length : 0;
    return {
      faculty: f,
      total: fStudents.length,
      active: active.length,
      expelled: fStudents.filter(s => s.status === 'expelled').length,
      graduated: fStudents.filter(s => s.status === 'graduated').length,
      avgGpa: avgGpa.toFixed(2),
    };
  });

  const groupReport = groups.map(g => {
    const gStudents = students.filter(s => s.group === g);
    const active = gStudents.filter(s => s.status === 'active');
    const avgGpa = active.length > 0 ? active.reduce((acc, s) => acc + s.gpa, 0) / active.length : 0;
    return {
      group: g,
      total: gStudents.length,
      active: active.length,
      avgGpa: avgGpa.toFixed(2),
      faculty: gStudents[0]?.faculty || '',
    };
  });

  const genderReport = {
    male: students.filter(s => s.gender === 'male').length,
    female: students.filter(s => s.gender === 'female').length,
  };

  const gpaDistribution = {
    excellent: activeStudents.filter(s => s.gpa >= 4.5).length,
    good: activeStudents.filter(s => s.gpa >= 3.5 && s.gpa < 4.5).length,
    satisfactory: activeStudents.filter(s => s.gpa >= 2.5 && s.gpa < 3.5).length,
    poor: activeStudents.filter(s => s.gpa < 2.5).length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          <i className="fas fa-chart-bar text-indigo-500 mr-2"></i>
          Общая сводка
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <p className="text-2xl font-bold text-indigo-600">{students.length}</p>
            <p className="text-xs text-indigo-500 mt-1">Всего студентов</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{activeStudents.length}</p>
            <p className="text-xs text-green-500 mt-1">Обучаются</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{faculties.length}</p>
            <p className="text-xs text-purple-500 mt-1">Факультетов</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{groups.length}</p>
            <p className="text-xs text-blue-500 mt-1">Групп</p>
          </div>
        </div>
      </div>

      {/* Gender & GPA Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="fas fa-venus-mars text-indigo-500 mr-2"></i>
            Гендерный состав
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-male text-blue-600 text-xl"></i>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Мужчины</span>
                  <span className="font-medium text-gray-800">{genderReport.male}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${(genderReport.male / students.length) * 100}%` }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <i className="fas fa-female text-pink-600 text-xl"></i>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Женщины</span>
                  <span className="font-medium text-gray-800">{genderReport.female}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-pink-500 h-3 rounded-full" style={{ width: `${(genderReport.female / students.length) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="fas fa-trophy text-indigo-500 mr-2"></i>
            Распределение GPA (активные)
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-28">Отличники (4.5+)</span>
              <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div className="bg-green-500 h-full rounded-full flex items-center justify-end pr-2" style={{ width: `${Math.max((gpaDistribution.excellent / activeStudents.length) * 100, 10)}%` }}>
                  <span className="text-xs text-white font-medium">{gpaDistribution.excellent}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-28">Хорошисты (3.5+)</span>
              <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full flex items-center justify-end pr-2" style={{ width: `${Math.max((gpaDistribution.good / activeStudents.length) * 100, 10)}%` }}>
                  <span className="text-xs text-white font-medium">{gpaDistribution.good}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-28">Средние (2.5+)</span>
              <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div className="bg-yellow-500 h-full rounded-full flex items-center justify-end pr-2" style={{ width: `${Math.max((gpaDistribution.satisfactory / activeStudents.length) * 100, 10)}%` }}>
                  <span className="text-xs text-white font-medium">{gpaDistribution.satisfactory}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-28">Низкий (&lt;2.5)</span>
              <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div className="bg-red-500 h-full rounded-full flex items-center justify-end pr-2" style={{ width: `${Math.max((gpaDistribution.poor / activeStudents.length) * 100, 10)}%` }}>
                  <span className="text-xs text-white font-medium">{gpaDistribution.poor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Faculty Report Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">
            <i className="fas fa-building text-indigo-500 mr-2"></i>
            Отчёт по факультетам
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Факультет</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Всего</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Активных</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Отчислено</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Выпуск</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ср. GPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {facultyReport.map((row) => (
                <tr key={row.faculty} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{row.faculty}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-center">{row.total}</td>
                  <td className="px-4 py-3 text-sm text-green-600 text-center font-medium">{row.active}</td>
                  <td className="px-4 py-3 text-sm text-red-600 text-center">{row.expelled}</td>
                  <td className="px-4 py-3 text-sm text-blue-600 text-center">{row.graduated}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className={`font-medium ${parseFloat(row.avgGpa) >= 4 ? 'text-green-600' : parseFloat(row.avgGpa) >= 3 ? 'text-blue-600' : 'text-orange-600'}`}>
                      {row.avgGpa}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Group Report Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">
            <i className="fas fa-users text-indigo-500 mr-2"></i>
            Отчёт по группам
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Группа</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Факультет</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Всего</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Активных</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ср. GPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {groupReport.map((row) => (
                <tr key={row.group} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">{row.group}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{row.faculty}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-center">{row.total}</td>
                  <td className="px-4 py-3 text-sm text-green-600 text-center font-medium">{row.active}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className={`font-medium ${parseFloat(row.avgGpa) >= 4 ? 'text-green-600' : parseFloat(row.avgGpa) >= 3 ? 'text-blue-600' : 'text-orange-600'}`}>
                      {row.avgGpa}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
