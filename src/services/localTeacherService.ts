import type { ITeacherService } from './types';
import type { TeacherCredentials, TeacherSession } from '@/types/teacher';
import type { StudentProfile } from '@/types/student';
import type { GameCompletionSummary } from '@/types/result';
import { readJson, writeJson, removeKey } from './storage/localStorageClient';
import { STORAGE_KEYS } from './storage/keys';
import { createId } from '@/lib/id';
import { TEACHER_DEMO_PASSCODE } from '@/lib/constants';
import { seedStudents } from '@/data/seed/seedStudents';
import { seedResults } from '@/data/seed/seedResults';

export class LocalTeacherService implements ITeacherService {
  async login(credentials: TeacherCredentials): Promise<TeacherSession> {
    if (credentials.passcode !== TEACHER_DEMO_PASSCODE) {
      throw new Error('Geçersiz şifre. Demo şifre: ' + TEACHER_DEMO_PASSCODE);
    }
    const session: TeacherSession = {
      id: createId(),
      displayName: credentials.displayName || 'Öğretmen',
      loggedInAt: new Date().toISOString(),
    };
    writeJson(STORAGE_KEYS.teacher, session);
    return session;
  }

  async logout(): Promise<void> {
    removeKey(STORAGE_KEYS.teacher);
  }

  getCurrentSession(): TeacherSession | null {
    return readJson<TeacherSession | null>(STORAGE_KEYS.teacher, null);
  }

  async listStudents(): Promise<StudentProfile[]> {
    const results = readJson<GameCompletionSummary[]>(STORAGE_KEYS.results, seedResults);
    const byId = new Map<string, StudentProfile>();
    for (const s of seedStudents) byId.set(s.id, s);
    for (const r of results) {
      if (!byId.has(r.studentId)) {
        const [firstName, ...rest] = r.studentName.split(' ');
        byId.set(r.studentId, {
          id: r.studentId,
          firstName: firstName ?? r.studentName,
          lastName: rest.join(' '),
          createdAt: r.completedAt,
        });
      }
    }
    return Array.from(byId.values()).sort((a, b) => a.firstName.localeCompare(b.firstName, 'tr'));
  }
}
