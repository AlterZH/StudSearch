import React, { useState } from 'react';
import { Student, FilterState } from '../types';

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  onView: (student: Student) => void;
  onAdd: () => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onEdit, onDelete, onView, onAdd }) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    faculty: '',
    group: '',
    course: '',
    status: '',
    sortField: 'lastName',
    sortDirection: 'asc',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const faculties = [...new Set(students.map(s => s.faculty))];
  const groups = [...new Set(students.map(s => s.group))];

  const filteredStudents = students
    .filter(s => {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = !filters.search || 
        `${s.lastName} ${s.firstName} ${s.patronymic} ${s.group} ${s.email}`.toLowerCase().includes(searchLower);
      const matchesFaculty = !filters.faculty || s.faculty === filters.faculty;
      const matchesGroup = !filters.group || s.group === filters.group;
      const matchesCourse = !filters.course || s.course === parseInt(filters.course);
      const matchesStatus = !filters.status || s.status === filters.status;
      return matchesSearch && matchesFaculty && matchesGroup && matchesCourse && matchesStatus;
    })
    .sort((a, b) => {
      const aVal = a[filters.sortField];
      const bVal = b[filters.sortField];
      const modifier = filters.sortDirection === 'asc' ? 1 : -1;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * modifier;
      }
      return ((aVal as number) - (bVal as number)) * modifier;
    });

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

  const handleSort = (field: FilterState['sortField']) => {
    setFilters(prev => ({
      ...prev,
      sortField: field,
      sortDirection: prev.sortField === field && prev.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      faculty: '',
      group: '',
      course: '',
      status: '',
      sortField: 'lastName',
      sortDirection: 'asc',
    });
  };

  const getSortIcon = (field: string) => {
    if (filters.sortField !== field) return 'fas fa-sort text-gray-300';
    return filters.sortDirection === 'asc' ? 'fas fa-sort-up text-indigo-600' : 'fas fa-sort-down text-indigo-600';
  };

  return (
    <div className="p-6 space-y-4">
      {/* Top Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <i className="fas fa-search text-sm"></i>
            </span>
            <input
              type="text"
              placeholder="Поиск по ФИО, группе, email..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-80"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              showFilters ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-filter mr-2"></i>
            Фильтры
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <i className="fas fa-redo mr-2"></i>
            Сбросить
          </button>
        </div>
        <button
          onClick={onAdd}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <i className="fas fa-plus mr-2"></i>
          Добавить студента
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Факультет</label>
            <select
              value={filters.faculty}
              onChange={(e) => setFilters(prev => ({ ...prev, faculty: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Все факультеты</option>
              {faculties.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Группа</label>
            <select
              value={filters.group}
              onChange={(e) => setFilters(prev => ({ ...prev, group: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Все группы</option>
              {groups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Курс</label>
            <select
              value={filters.course}
              onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Все курсы</option>
              {[1, 2, 3, 4, 5].map(c => <option key={c} value={c}>{c} курс</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Статус</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Все статусы</option>
              <option value="active">Активные</option>
              <option value="expelled">Отчисленные</option>
              <option value="graduated">Выпускники</option>
              <option value="academic_leave">Акад. отпуск</option>
            </select>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-gray-500">
        Найдено: <span className="font-medium text-gray-700">{filteredStudents.length}</span> студентов
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => handleSort('lastName')} className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    ФИО <i className={getSortIcon('lastName')}></i>
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => handleSort('group')} className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    Группа <i className={getSortIcon('group')}></i>
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => handleSort('course')} className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    Курс <i className={getSortIcon('course')}></i>
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Факультет</th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => handleSort('gpa')} className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    GPA <i className={getSortIcon('gpa')}></i>
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => handleSort('status')} className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    Статус <i className={getSortIcon('status')}></i>
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-indigo-600">
                          {student.lastName[0]}{student.firstName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {student.lastName} {student.firstName} {student.patronymic}
                        </p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{student.group}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{student.course}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 max-w-[150px] truncate">{student.faculty}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${student.gpa >= 4.5 ? 'text-green-600' : student.gpa >= 3.5 ? 'text-blue-600' : 'text-orange-600'}`}>
                      {student.gpa.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[student.status]}`}>
                      {statusLabels[student.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView(student)}
                        className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors"
                        title="Просмотр"
                      >
                        <i className="fas fa-eye text-sm"></i>
                      </button>
                      <button
                        onClick={() => onEdit(student)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Редактировать"
                      >
                        <i className="fas fa-edit text-sm"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          confirmDelete === student.id
                            ? 'bg-red-100 text-red-600'
                            : 'hover:bg-red-50 text-gray-400 hover:text-red-600'
                        }`}
                        title={confirmDelete === student.id ? 'Нажмите ещё раз для подтверждения' : 'Удалить'}
                      >
                        <i className="fas fa-trash text-sm"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="text-gray-400">
                      <i className="fas fa-search text-4xl mb-3"></i>
                      <p className="text-lg font-medium">Студенты не найдены</p>
                      <p className="text-sm">Попробуйте изменить параметры поиска</p>
                    </div>
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

export default StudentList;
