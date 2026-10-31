import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { generateId } from '../utils/storage';

interface StudentFormProps {
  student?: Student | null;
  onSave: (student: Student) => void;
  onCancel: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>({
    firstName: '',
    lastName: '',
    patronymic: '',
    birthDate: '',
    gender: 'male',
    group: '',
    course: 1,
    specialty: '',
    faculty: '',
    email: '',
    phone: '',
    address: '',
    enrollmentDate: '',
    status: 'active',
    gpa: 0,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        patronymic: student.patronymic,
        birthDate: student.birthDate,
        gender: student.gender,
        group: student.group,
        course: student.course,
        specialty: student.specialty,
        faculty: student.faculty,
        email: student.email,
        phone: student.phone,
        address: student.address,
        enrollmentDate: student.enrollmentDate,
        status: student.status,
        gpa: student.gpa,
        notes: student.notes,
      });
    }
  }, [student]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.lastName.trim()) newErrors.lastName = 'Введите фамилию';
    if (!formData.firstName.trim()) newErrors.firstName = 'Введите имя';
    if (!formData.birthDate) newErrors.birthDate = 'Укажите дату рождения';
    if (!formData.group.trim()) newErrors.group = 'Укажите группу';
    if (!formData.specialty.trim()) newErrors.specialty = 'Укажите специальность';
    if (!formData.faculty.trim()) newErrors.faculty = 'Укажите факультет';
    if (!formData.enrollmentDate) newErrors.enrollmentDate = 'Укажите дату зачисления';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }
    if (formData.gpa < 0 || formData.gpa > 5) newErrors.gpa = 'GPA от 0 до 5';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const now = new Date().toISOString();
    const savedStudent: Student = {
      id: student?.id || generateId(),
      ...formData,
      createdAt: student?.createdAt || now,
      updatedAt: now,
    };
    onSave(savedStudent);
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">
            <i className="fas fa-user-edit text-indigo-500 mr-2"></i>
            {student ? 'Редактирование студента' : 'Добавление студента'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i className="fas fa-user text-indigo-400"></i>
              Личные данные
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Фамилия *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.lastName ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="Иванов"
                />
                {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Имя *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.firstName ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="Иван"
                />
                {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Отчество</label>
                <input
                  type="text"
                  value={formData.patronymic}
                  onChange={(e) => handleChange('patronymic', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Иванович"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Дата рождения *</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.birthDate ? 'border-red-300' : 'border-gray-200'}`}
                />
                {errors.birthDate && <p className="text-xs text-red-500 mt-1">{errors.birthDate}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Пол</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="male">Мужской</option>
                  <option value="female">Женский</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Телефон</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="+7 (900) 123-45-67"
                />
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i className="fas fa-graduation-cap text-indigo-400"></i>
              Учебная информация
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Факультет *</label>
                <input
                  type="text"
                  value={formData.faculty}
                  onChange={(e) => handleChange('faculty', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.faculty ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="Информационных технологий"
                />
                {errors.faculty && <p className="text-xs text-red-500 mt-1">{errors.faculty}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Специальность *</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => handleChange('specialty', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.specialty ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="Информационные системы"
                />
                {errors.specialty && <p className="text-xs text-red-500 mt-1">{errors.specialty}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Группа *</label>
                <input
                  type="text"
                  value={formData.group}
                  onChange={(e) => handleChange('group', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.group ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="ИС-21"
                />
                {errors.group && <p className="text-xs text-red-500 mt-1">{errors.group}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Курс</label>
                <select
                  value={formData.course}
                  onChange={(e) => handleChange('course', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {[1, 2, 3, 4, 5].map(c => <option key={c} value={c}>{c} курс</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Дата зачисления *</label>
                <input
                  type="date"
                  value={formData.enrollmentDate}
                  onChange={(e) => handleChange('enrollmentDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.enrollmentDate ? 'border-red-300' : 'border-gray-200'}`}
                />
                {errors.enrollmentDate && <p className="text-xs text-red-500 mt-1">{errors.enrollmentDate}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Статус</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="active">Активен</option>
                  <option value="expelled">Отчислен</option>
                  <option value="graduated">Выпуск</option>
                  <option value="academic_leave">Акад. отпуск</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">GPA</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.gpa}
                  onChange={(e) => handleChange('gpa', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.gpa ? 'border-red-300' : 'border-gray-200'}`}
                />
                {errors.gpa && <p className="text-xs text-red-500 mt-1">{errors.gpa}</p>}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i className="fas fa-address-book text-indigo-400"></i>
              Контактная информация
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="student@university.ru"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Адрес</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="г. Москва, ул. Ленина, д. 10"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Примечания</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Дополнительная информация о студенте..."
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <i className="fas fa-save mr-2"></i>
              {student ? 'Сохранить изменения' : 'Добавить студента'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
