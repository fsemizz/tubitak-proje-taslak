import { storageService } from './storage';
import type { GameResult, StudentStats } from '../types/result';
import type { StudentProfile } from '../types/user';

/**
 * Backend Bağımsız API Katmanı
 * 
 * İleride Spring Boot REST API yazıldığında buradaki methodlar
 * `fetch()` veya `axios` ile Spring Boot endpoint'lerine (örn: /api/v1/results) istek atacak.
 * Şimdilik localStorage mock servisini kullanır.
 */
export const apiService = {
  async getStudents(): Promise<StudentProfile[]> {
    return storageService.getAllStudents();
  },

  async getResults(): Promise<GameResult[]> {
    return storageService.getResults();
  },

  async saveGameResult(result: Omit<GameResult, 'id' | 'completedAt'>): Promise<GameResult> {
    return storageService.saveResult(result);
  },

  async getStudentStats(): Promise<StudentStats[]> {
    const students = await this.getStudents();
    const results = await this.getResults();

    return students.map((std) => {
      const studentResults = results.filter((r) => r.studentId === std.id || r.studentName.toLowerCase().trim() === `${std.name} ${std.surname}`.toLowerCase().trim());
      const totalPlayed = studentResults.length;
      const totalScore = studentResults.reduce((acc, curr) => acc + curr.score, 0);
      const totalStars = studentResults.reduce((acc, curr) => acc + curr.stars, 0);
      const avgScore = totalPlayed > 0 ? Math.round(totalScore / totalPlayed) : 0;
      const lastActive = studentResults.length > 0 ? studentResults[0].completedAt : std.createdAt;

      return {
        studentId: std.id,
        studentName: `${std.name} ${std.surname}`,
        totalGamesPlayed: totalPlayed,
        totalScore,
        averageScore: avgScore,
        totalStars,
        lastActive,
      };
    });
  },
};
