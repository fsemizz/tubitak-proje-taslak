export type UserRole = 'student' | 'teacher';

export interface StudentProfile {
  id: string;
  name: string;
  surname: string;
  grade?: string;
  createdAt: string;
}

export interface UserState {
  role: UserRole | null;
  student: StudentProfile | null;
  isTeacherAuthenticated: boolean;
}
