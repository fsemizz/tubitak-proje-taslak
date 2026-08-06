import type { GameResult } from '../types/result';
import type { StudentProfile } from '../types/user';

const STORAGE_KEYS = {
  CURRENT_USER: 'codekids_current_user',
  TEACHER_AUTH: 'codekids_teacher_auth',
  GAME_RESULTS: 'codekids_game_results',
  STUDENT_LIST: 'codekids_students',
};

// Varsayılan mock veriler
const MOCK_RESULTS: GameResult[] = [
  {
    id: 'res-1',
    studentId: 'std-1',
    studentName: 'Ali Yılmaz',
    gameId: 'algorithm-sorting',
    gameTitle: 'Algoritma Sıralama',
    levelNumber: 1,
    score: 100,
    stars: 3,
    completionTimeSeconds: 45,
    attemptsCount: 1,
    completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'res-2',
    studentId: 'std-1',
    studentName: 'Ali Yılmaz',
    gameId: 'pattern-completion',
    gameTitle: 'Örüntü Tamamlama',
    levelNumber: 2,
    score: 80,
    stars: 2,
    completionTimeSeconds: 60,
    attemptsCount: 2,
    completedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'res-3',
    studentId: 'std-2',
    studentName: 'Zeynep Kaya',
    gameId: 'debug-detective',
    gameTitle: 'Hata Dedektifi',
    levelNumber: 1,
    score: 100,
    stars: 3,
    completionTimeSeconds: 30,
    attemptsCount: 1,
    completedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'res-4',
    studentId: 'std-3',
    studentName: 'Ayşe Demir',
    gameId: 'loop-builder',
    gameTitle: 'Döngü Ustası',
    levelNumber: 1,
    score: 90,
    stars: 3,
    completionTimeSeconds: 50,
    attemptsCount: 1,
    completedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

export const storageService = {
  getCurrentStudent(): StudentProfile | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentStudent(student: StudentProfile | null): void {
    if (student) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(student));
      this.saveStudentToList(student);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  isTeacherAuthenticated(): boolean {
    return localStorage.getItem(STORAGE_KEYS.TEACHER_AUTH) === 'true';
  },

  setTeacherAuthenticated(status: boolean): void {
    localStorage.setItem(STORAGE_KEYS.TEACHER_AUTH, status ? 'true' : 'false');
  },

  saveStudentToList(student: StudentProfile): void {
    const students = this.getAllStudents();
    if (!students.some((s) => s.id === student.id)) {
      students.push(student);
      localStorage.setItem(STORAGE_KEYS.STUDENT_LIST, JSON.stringify(students));
    }
  },

  getAllStudents(): StudentProfile[] {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENT_LIST);
    if (!data) {
      const defaultStudents: StudentProfile[] = [
        { id: 'std-1', name: 'Ali', surname: 'Yılmaz', grade: '1. Sınıf', createdAt: new Date().toISOString() },
        { id: 'std-2', name: 'Zeynep', surname: 'Kaya', grade: '2. Sınıf', createdAt: new Date().toISOString() },
        { id: 'std-3', name: 'Ayşe', surname: 'Demir', grade: 'Anasınıfı', createdAt: new Date().toISOString() },
      ];
      localStorage.setItem(STORAGE_KEYS.STUDENT_LIST, JSON.stringify(defaultStudents));
      return defaultStudents;
    }
    return JSON.parse(data);
  },

  getResults(): GameResult[] {
    const data = localStorage.getItem(STORAGE_KEYS.GAME_RESULTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.GAME_RESULTS, JSON.stringify(MOCK_RESULTS));
      return MOCK_RESULTS;
    }
    return JSON.parse(data);
  },

  saveResult(result: Omit<GameResult, 'id' | 'completedAt'>): GameResult {
    const results = this.getResults();
    const newResult: GameResult = {
      ...result,
      id: 'res-' + Date.now(),
      completedAt: new Date().toISOString(),
    };
    results.unshift(newResult);
    localStorage.setItem(STORAGE_KEYS.GAME_RESULTS, JSON.stringify(results));
    return newResult;
  },
};
