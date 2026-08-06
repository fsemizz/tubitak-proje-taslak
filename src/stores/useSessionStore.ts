import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StudentProfile } from '@/types/student';
import { createId } from '@/lib/id';

interface SessionState {
  currentStudent: StudentProfile | null;
  sessionStartedAt: string | null;
  startSession: (firstName: string, lastName: string, grade?: number) => StudentProfile;
  endSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      currentStudent: null,
      sessionStartedAt: null,
      startSession: (firstName, lastName, grade) => {
        const student: StudentProfile = {
          id: createId(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          grade,
          createdAt: new Date().toISOString(),
        };
        set({ currentStudent: student, sessionStartedAt: new Date().toISOString() });
        return student;
      },
      endSession: () => set({ currentStudent: null, sessionStartedAt: null }),
    }),
    {
      name: 'codekids.v1.session',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
