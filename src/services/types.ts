import type { GameDefinition, GameLevel } from '@/types/game';
import type {
  GameCompletionSummary,
  GameCompletionSummaryInput,
  ResultsFilter,
  StudentStats,
} from '@/types/result';
import type { StudentProfile } from '@/types/student';
import type { TeacherCredentials, TeacherSession } from '@/types/teacher';

export interface IGameContentService {
  listGames(): Promise<GameDefinition[]>;
  getGame(gameId: string): Promise<GameDefinition | null>;
  listLevels(gameId: string): Promise<GameLevel[]>;
  getLevel(gameId: string, levelId: string): Promise<GameLevel | null>;
}

export interface IResultsService {
  submitGameCompletion(summary: GameCompletionSummaryInput): Promise<GameCompletionSummary>;
  listResultsByStudent(studentId: string): Promise<GameCompletionSummary[]>;
  listAllResults(filter?: ResultsFilter): Promise<GameCompletionSummary[]>;
  getStudentStats(studentId: string): Promise<StudentStats>;
}

export interface ITeacherService {
  login(credentials: TeacherCredentials): Promise<TeacherSession>;
  logout(): Promise<void>;
  getCurrentSession(): TeacherSession | null;
  listStudents(): Promise<StudentProfile[]>;
}
