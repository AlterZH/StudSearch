export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  birthDate: string;
  gender: 'male' | 'female';
  group: string;
  course: number;
  specialty: string;
  faculty: string;
  email: string;
  phone: string;
  address: string;
  enrollmentDate: string;
  status: 'active' | 'expelled' | 'graduated' | 'academic_leave';
  gpa: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subject: string;
  grade: number;
  semester: number;
  date: string;
}

export type SortField = 'lastName' | 'firstName' | 'group' | 'course' | 'gpa' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  search: string;
  faculty: string;
  group: string;
  course: string;
  status: string;
  sortField: SortField;
  sortDirection: SortDirection;
}
