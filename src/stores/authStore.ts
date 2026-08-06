import { create } from 'zustand';
import type { StudentProfile, UserRole } from '../types/user';
import { storageService } from '../services/storage';

interface AuthState {
  role: UserRole | null;
  student: StudentProfile | null;
  isTeacherAuthenticated: boolean;
  
  // Actions
  loginAsStudent: (name: string, surname: string, grade?: string) => void;
  loginAsTeacher: (passcode: string) => boolean;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  student: null,
  isTeacherAuthenticated: false,

  initAuth: () => {
    const student = storageService.getCurrentStudent();
    const isTeacher = storageService.isTeacherAuthenticated();
    
    if (student) {
      set({ role: 'student', student, isTeacherAuthenticated: false });
    } else if (isTeacher) {
      set({ role: 'teacher', student: null, isTeacherAuthenticated: true });
    }
  },

  loginAsStudent: (name: string, surname: string, grade: string = '1. Sınıf') => {
    const student: StudentProfile = {
      id: 'std-' + Date.now(),
      name: name.trim(),
      surname: surname.trim(),
      grade,
      createdAt: new Date().toISOString(),
    };
    storageService.setCurrentStudent(student);
    set({ role: 'student', student, isTeacherAuthenticated: false });
  },

  loginAsTeacher: (passcode: string) => {
    // Sabit öğretmen şifresi: "1234" veya "ogretmen"
    if (passcode === '1234' || passcode === 'ogretmen') {
      storageService.setTeacherAuthenticated(true);
      set({ role: 'teacher', student: null, isTeacherAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => {
    storageService.setCurrentStudent(null);
    storageService.setTeacherAuthenticated(false);
    set({ role: null, student: null, isTeacherAuthenticated: false });
  },
}));
