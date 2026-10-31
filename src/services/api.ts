/**
 * API-сервис для работы с Django REST Framework бекендом.
 * Если API недоступен — автоматически переключается на localStorage.
 */

import { Student, Grade } from '../types';
import {
  getStudents as getLocalStudents,
  saveStudents as saveLocalStudents,
  getGrades as getLocalGrades,
  saveGrades as saveLocalGrades,
} from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

let apiAvailable: boolean | null = null;

/**
 * Проверка доступности API
 */
export const checkApiAvailability = async (): Promise<boolean> => {
  if (apiAvailable !== null) return apiAvailable;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`${API_BASE_URL}/`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    
    apiAvailable = response.ok;
  } catch {
    apiAvailable = false;
  }
  
  console.log(`[API] Backend ${apiAvailable ? 'available' : 'unavailable'} — using ${apiAvailable ? 'Django REST API' : 'localStorage'}`);
  return apiAvailable;
};

/**
 * Универсальная функция для запросов к API
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response.json();
}

// ===================== STUDENTS =====================

interface StudentApiResponse {
  id: number;
  last_name: string;
  first_name: string;
  patronymic: string;
  full_name: string;
  birth_date: string;
  gender: string;
  group_name: string;
  group_display: string;
  course: number;
  specialty_name: string;
  faculty_name: string;
  email: string;
  phone: string;
  address: string;
  enrollment_date: string;
  status: string;
  gpa: string;
  notes: string;
  created_at: string;
  updated_at: string;
  grades?: GradeApiResponse[];
}

interface GradeApiResponse {
  id: number;
  student: number;
  student_name: string;
  subject: number;
  subject_name: string;
  subject_name_display: string;
  grade: number;
  semester: number;
  date: string;
}

/**
 * Преобразование данных студента из API в формат фронтенда
 */
function mapStudentFromApi(apiStudent: StudentApiResponse): Student {
  return {
    id: String(apiStudent.id),
    firstName: apiStudent.first_name,
    lastName: apiStudent.last_name,
    patronymic: apiStudent.patronymic || '',
    birthDate: apiStudent.birth_date,
    gender: apiStudent.gender as 'male' | 'female',
    group: apiStudent.group_display || apiStudent.group_name,
    course: apiStudent.course,
    specialty: apiStudent.specialty_name,
    faculty: apiStudent.faculty_name,
    email: apiStudent.email || '',
    phone: apiStudent.phone || '',
    address: apiStudent.address || '',
    enrollmentDate: apiStudent.enrollment_date,
    status: apiStudent.status as Student['status'],
    gpa: parseFloat(apiStudent.gpa as unknown as string) || 0,
    notes: apiStudent.notes || '',
    createdAt: apiStudent.created_at,
    updatedAt: apiStudent.updated_at,
  };
}

/**
 * Преобразование данных студента из формата фронтенда в API
 */
function mapStudentToApi(student: Student): Record<string, unknown> {
  return {
    last_name: student.lastName,
    first_name: student.firstName,
    patronymic: student.patronymic,
    birth_date: student.birthDate,
    gender: student.gender,
    group_name: student.group,
    course: student.course,
    specialty_name: student.specialty,
    faculty_name: student.faculty,
    email: student.email,
    phone: student.phone,
    address: student.address,
    enrollment_date: student.enrollmentDate,
    status: student.status,
    gpa: student.gpa,
    notes: student.notes,
  };
}

function mapGradeFromApi(apiGrade: GradeApiResponse): Grade {
  return {
    id: String(apiGrade.id),
    studentId: String(apiGrade.student),
    subject: apiGrade.subject_name_display || apiGrade.subject_name,
    grade: apiGrade.grade,
    semester: apiGrade.semester,
    date: apiGrade.date,
  };
}

// ===================== PUBLIC API =====================

export const studentApi = {
  /**
   * Получить всех студентов
   */
  async getAll(): Promise<Student[]> {
    const isAvailable = await checkApiAvailability();
    
    if (!isAvailable) {
      return getLocalStudents();
    }

    try {
      const data = await apiRequest<{ results: StudentApiResponse[] }>('/students/?page_size=1000');
      return data.results.map(mapStudentFromApi);
    } catch (error) {
      console.warn('[API] Failed to fetch students, using localStorage', error);
      return getLocalStudents();
    }
  },

  /**
   * Получить студента по ID
   */
  async getById(id: string): Promise<Student | null> {
    const isAvailable = await checkApiAvailability();
    
    if (!isAvailable) {
      return getLocalStudents().find((s: Student) => s.id === id) || null;
    }

    try {
      const data = await apiRequest<StudentApiResponse>(`/students/${id}/`);
      return mapStudentFromApi(data);
    } catch (error) {
      console.warn('[API] Failed to fetch student', error);
      return getLocalStudents().find((s: Student) => s.id === id) || null;
    }
  },

  /**
   * Создать студента
   */
  async create(student: Student): Promise<Student> {
    const isAvailable = await checkApiAvailability();
    
    if (!isAvailable) {
      const students = getLocalStudents();
      students.push(student);
      saveLocalStudents(students);
      return student;
    }

    try {
      const payload = mapStudentToApi(student);
      const data = await apiRequest<StudentApiResponse>('/students/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return mapStudentFromApi(data);
    } catch (error) {
      console.warn('[API] Failed to create student, saving locally', error);
      const students = getLocalStudents();
      students.push(student);
      saveLocalStudents(students);
      return student;
    }
  },

  /**
   * Обновить студента
   */
  async update(id: string, student: Student): Promise<Student> {
    const isAvailable = await checkApiAvailability();
    
    if (!isAvailable) {
      const students = getLocalStudents();
      const index = students.findIndex((s: Student) => s.id === id);
      if (index >= 0) {
        students[index] = student;
        saveLocalStudents(students);
      }
      return student;
    }

    try {
      const payload = mapStudentToApi(student);
      const data = await apiRequest<StudentApiResponse>(`/students/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      return mapStudentFromApi(data);
    } catch (error) {
      console.warn('[API] Failed to update student, saving locally', error);
      const students = getLocalStudents();
      const index = students.findIndex((s: Student) => s.id === id);
      if (index >= 0) {
        students[index] = student;
        saveLocalStudents(students);
      }
      return student;
    }
  },

  /**
   * Удалить студента
   */
  async delete(id: string): Promise<void> {
    const isAvailable = await checkApiAvailability();
    
    if (!isAvailable) {
      const students = getLocalStudents().filter((s: Student) => s.id !== id);
      saveLocalStudents(students);
      return;
    }

    try {
      await apiRequest(`/students/${id}/`, { method: 'DELETE' });
    } catch (error) {
      console.warn('[API] Failed to delete student, removing locally', error);
      const students = getLocalStudents().filter((s: Student) => s.id !== id);
      saveLocalStudents(students);
    }
  },

  /**
   * Получить статистику
   */
  async getStatistics(): Promise<Record<string, unknown> | null> {
    const isAvailable = await checkApiAvailability();
    if (!isAvailable) return null;

    try {
      return await apiRequest<Record<string, unknown>>('/students/statistics/');
    } catch {
      return null;
    }
  },

  /**
   * Получить отчёты
   */
  async getReports(): Promise<Record<string, unknown> | null> {
    const isAvailable = await checkApiAvailability();
    if (!isAvailable) return null;

    try {
      return await apiRequest<Record<string, unknown>>('/students/reports/');
    } catch {
      return null;
    }
  },
};

// ===================== GRADES API =====================

export const gradeApi = {
  async getAll(studentId?: string): Promise<Grade[]> {
    const isAvailable = await checkApiAvailability();
    
    if (!isAvailable) {
      return getLocalGrades();
    }

    try {
      const endpoint = studentId
        ? `/grades/?student_id=${studentId}&page_size=1000`
        : '/grades/?page_size=1000';
      const data = await apiRequest<{ results: GradeApiResponse[] }>(endpoint);
      return data.results.map(mapGradeFromApi);
    } catch (error) {
      console.warn('[API] Failed to fetch grades, using localStorage', error);
      return getLocalGrades();
    }
  },

  async create(grade: Omit<Grade, 'id'>): Promise<Grade> {
    const isAvailable = await checkApiAvailability();
    const newGrade: Grade = { ...grade, id: Date.now().toString(36) };
    
    if (!isAvailable) {
      const grades = getLocalGrades();
      grades.push(newGrade);
      saveLocalGrades(grades);
      return newGrade;
    }

    try {
      const data = await apiRequest<GradeApiResponse>('/grades/', {
        method: 'POST',
        body: JSON.stringify({
          student: parseInt(grade.studentId),
          subject_name: grade.subject,
          grade: grade.grade,
          semester: grade.semester,
          date: grade.date,
        }),
      });
      return mapGradeFromApi(data);
    } catch (error) {
      console.warn('[API] Failed to create grade, saving locally', error);
      const grades = getLocalGrades();
      grades.push(newGrade);
      saveLocalGrades(grades);
      return newGrade;
    }
  },

  async delete(id: string): Promise<void> {
    const isAvailable = await checkApiAvailability();
    
    if (!isAvailable) {
      const grades = getLocalGrades().filter((g: Grade) => g.id !== id);
      saveLocalGrades(grades);
      return;
    }

    try {
      await apiRequest(`/grades/${id}/`, { method: 'DELETE' });
    } catch (error) {
      console.warn('[API] Failed to delete grade, removing locally', error);
      const grades = getLocalGrades().filter((g: Grade) => g.id !== id);
      saveLocalGrades(grades);
    }
  },
};
