import { create } from 'zustand';
import type { TeacherCredentials, TeacherSession } from '@/types/teacher';
import { teacherService } from '@/services/serviceProvider';

interface TeacherState {
  session: TeacherSession | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: TeacherCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useTeacherStore = create<TeacherState>()((set) => ({
  session: teacherService.getCurrentSession(),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const session = await teacherService.login(credentials);
      set({ session, isLoading: false });
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Giriş başarısız.', isLoading: false });
      return false;
    }
  },

  logout: async () => {
    await teacherService.logout();
    set({ session: null });
  },
}));
