import { Student, Grade } from '../types';

const STUDENTS_KEY = 'ais_students';
const GRADES_KEY = 'ais_grades';

export const getStudents = (): Student[] => {
  const data = localStorage.getItem(STUDENTS_KEY);
  if (data) return JSON.parse(data);
  return getDefaultStudents();
};

export const saveStudents = (students: Student[]): void => {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
};

export const getGrades = (): Grade[] => {
  const data = localStorage.getItem(GRADES_KEY);
  if (data) return JSON.parse(data);
  return getDefaultGrades();
};

export const saveGrades = (grades: Grade[]): void => {
  localStorage.setItem(GRADES_KEY, JSON.stringify(grades));
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

function getDefaultStudents(): Student[] {
  const students: Student[] = [
    {
      id: '1',
      firstName: 'Иван',
      lastName: 'Иванов',
      patronymic: 'Иванович',
      birthDate: '2002-03-15',
      gender: 'male',
      group: 'ИС-21',
      course: 3,
      specialty: 'Информационные системы',
      faculty: 'Информационных технологий',
      email: 'ivanov@university.ru',
      phone: '+7 (900) 123-45-67',
      address: 'г. Москва, ул. Ленина, д. 10, кв. 5',
      enrollmentDate: '2021-09-01',
      status: 'active',
      gpa: 4.5,
      notes: 'Староста группы',
      createdAt: '2021-09-01T00:00:00',
      updatedAt: '2024-01-15T00:00:00',
    },
    {
      id: '2',
      firstName: 'Мария',
      lastName: 'Петрова',
      patronymic: 'Сергеевна',
      birthDate: '2003-07-22',
      gender: 'female',
      group: 'ПИ-22',
      course: 2,
      specialty: 'Программная инженерия',
      faculty: 'Информационных технологий',
      email: 'petrova@university.ru',
      phone: '+7 (901) 234-56-78',
      address: 'г. Москва, ул. Пушкина, д. 25, кв. 12',
      enrollmentDate: '2022-09-01',
      status: 'active',
      gpa: 4.8,
      notes: 'Отличница, стипендиат',
      createdAt: '2022-09-01T00:00:00',
      updatedAt: '2024-01-10T00:00:00',
    },
    {
      id: '3',
      firstName: 'Алексей',
      lastName: 'Сидоров',
      patronymic: 'Николаевич',
      birthDate: '2001-11-08',
      gender: 'male',
      group: 'ЭФ-20',
      course: 4,
      specialty: 'Экономика',
      faculty: 'Экономики и управления',
      email: 'sidorov@university.ru',
      phone: '+7 (902) 345-67-89',
      address: 'г. Москва, ул. Гагарина, д. 7, кв. 3',
      enrollmentDate: '2020-09-01',
      status: 'active',
      gpa: 3.7,
      notes: '',
      createdAt: '2020-09-01T00:00:00',
      updatedAt: '2024-01-20T00:00:00',
    },
    {
      id: '4',
      firstName: 'Елена',
      lastName: 'Козлова',
      patronymic: 'Андреевна',
      birthDate: '2002-05-30',
      gender: 'female',
      group: 'ЮР-21',
      course: 3,
      specialty: 'Юриспруденция',
      faculty: 'Правовой',
      email: 'kozlova@university.ru',
      phone: '+7 (903) 456-78-90',
      address: 'г. Москва, ул. Мира, д. 15, кв. 8',
      enrollmentDate: '2021-09-01',
      status: 'active',
      gpa: 4.2,
      notes: 'Участница научных конференций',
      createdAt: '2021-09-01T00:00:00',
      updatedAt: '2024-02-01T00:00:00',
    },
    {
      id: '5',
      firstName: 'Дмитрий',
      lastName: 'Волков',
      patronymic: 'Петрович',
      birthDate: '2000-01-14',
      gender: 'male',
      group: 'ИС-19',
      course: 5,
      specialty: 'Информационные системы',
      faculty: 'Информационных технологий',
      email: 'volkov@university.ru',
      phone: '+7 (904) 567-89-01',
      address: 'г. Москва, ул. Советская, д. 30, кв. 20',
      enrollmentDate: '2019-09-01',
      status: 'graduated',
      gpa: 4.0,
      notes: 'Выпуск 2024',
      createdAt: '2019-09-01T00:00:00',
      updatedAt: '2024-06-30T00:00:00',
    },
    {
      id: '6',
      firstName: 'Анна',
      lastName: 'Новикова',
      patronymic: 'Дмитриевна',
      birthDate: '2003-09-18',
      gender: 'female',
      group: 'ПИ-22',
      course: 2,
      specialty: 'Программная инженерия',
      faculty: 'Информационных технологий',
      email: 'novikova@university.ru',
      phone: '+7 (905) 678-90-12',
      address: 'г. Москва, ул. Центральная, д. 5, кв. 1',
      enrollmentDate: '2022-09-01',
      status: 'active',
      gpa: 3.9,
      notes: '',
      createdAt: '2022-09-01T00:00:00',
      updatedAt: '2024-01-25T00:00:00',
    },
    {
      id: '7',
      firstName: 'Сергей',
      lastName: 'Морозов',
      patronymic: 'Владимирович',
      birthDate: '2002-12-03',
      gender: 'male',
      group: 'ЭФ-22',
      course: 2,
      specialty: 'Экономика',
      faculty: 'Экономики и управления',
      email: 'morozov@university.ru',
      phone: '+7 (906) 789-01-23',
      address: 'г. Москва, ул. Садовая, д. 12, кв. 7',
      enrollmentDate: '2022-09-01',
      status: 'academic_leave',
      gpa: 3.2,
      notes: 'Академический отпуск с 01.2024',
      createdAt: '2022-09-01T00:00:00',
      updatedAt: '2024-01-15T00:00:00',
    },
    {
      id: '8',
      firstName: 'Ольга',
      lastName: 'Соколова',
      patronymic: 'Игоревна',
      birthDate: '2001-06-25',
      gender: 'female',
      group: 'ЮР-20',
      course: 4,
      specialty: 'Юриспруденция',
      faculty: 'Правовой',
      email: 'sokolova@university.ru',
      phone: '+7 (907) 890-12-34',
      address: 'г. Москва, ул. Лесная, д. 8, кв. 15',
      enrollmentDate: '2020-09-01',
      status: 'expelled',
      gpa: 2.8,
      notes: 'Отчислена за неуспеваемость',
      createdAt: '2020-09-01T00:00:00',
      updatedAt: '2023-12-20T00:00:00',
    },
  ];
  saveStudents(students);
  return students;
}

function getDefaultGrades(): Grade[] {
  const grades: Grade[] = [
    { id: 'g1', studentId: '1', subject: 'Математика', grade: 5, semester: 1, date: '2024-01-15' },
    { id: 'g2', studentId: '1', subject: 'Программирование', grade: 4, semester: 1, date: '2024-01-15' },
    { id: 'g3', studentId: '1', subject: 'Физика', grade: 5, semester: 1, date: '2024-01-15' },
    { id: 'g4', studentId: '2', subject: 'Математика', grade: 5, semester: 1, date: '2024-01-15' },
    { id: 'g5', studentId: '2', subject: 'Программирование', grade: 5, semester: 1, date: '2024-01-15' },
    { id: 'g6', studentId: '2', subject: 'Английский язык', grade: 5, semester: 1, date: '2024-01-15' },
    { id: 'g7', studentId: '3', subject: 'Экономическая теория', grade: 4, semester: 1, date: '2024-01-15' },
    { id: 'g8', studentId: '3', subject: 'Менеджмент', grade: 3, semester: 1, date: '2024-01-15' },
    { id: 'g9', studentId: '4', subject: 'Гражданское право', grade: 5, semester: 1, date: '2024-01-15' },
    { id: 'g10', studentId: '4', subject: 'Уголовное право', grade: 4, semester: 1, date: '2024-01-15' },
  ];
  saveGrades(grades);
  return grades;
}
