import { useLoaderData, type LoaderFunctionArgs } from 'react-router-dom';
import { Trophy, Star, Clock3, Gamepad2 } from 'lucide-react';
import { StatTile } from '@/components/primitives/StatTile';
import { StudentScoreChart } from '@/features/teacher/components/StudentScoreChart';
import { ResultsTable } from '@/features/teacher/components/ResultsTable';
import { SectionHeading } from '@/components/primitives/SectionHeading';
import { requireTeacherLoader } from '@/app/routeGuards';
import { resultsService, teacherService } from '@/services/serviceProvider';
import type { GameCompletionSummary, StudentStats } from '@/types/result';
import type { StudentProfile } from '@/types/student';

export async function teacherStudentDetailLoader({ params }: LoaderFunctionArgs) {
  requireTeacherLoader();
  const studentId = params.studentId as string;
  const students = await teacherService.listStudents();
  const student = students.find((s) => s.id === studentId);
  if (!student) {
    throw new Response('Öğrenci bulunamadı', { status: 404 });
  }
  const [results, stats] = await Promise.all([
    resultsService.listResultsByStudent(studentId),
    resultsService.getStudentStats(studentId),
  ]);
  return { student, results, stats };
}

export default function TeacherStudentDetailPage() {
  const { student, results, stats } = useLoaderData() as {
    student: StudentProfile;
    results: GameCompletionSummary[];
    stats: StudentStats;
  };

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        title={`${student.firstName} ${student.lastName}`}
        description={student.grade !== undefined ? `${student.grade}. sınıf` : undefined}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile icon={Gamepad2} label="Oynanan Oyun" value={stats.gamesPlayed} />
        <StatTile icon={Trophy} label="Toplam Puan" value={stats.totalPoints} />
        <StatTile icon={Star} label="Ortalama Yıldız" value={stats.averageStars} />
        <StatTile
          icon={Clock3}
          label="Son Oyun"
          value={stats.lastPlayedAt ? new Date(stats.lastPlayedAt).toLocaleDateString('tr-TR') : '—'}
        />
      </div>

      <div className="flex flex-col gap-4">
        <SectionHeading title="Puan Grafiği" />
        <StudentScoreChart results={results} />
      </div>

      <div className="flex flex-col gap-4">
        <SectionHeading title="Oyun Geçmişi" />
        <ResultsTable results={results} />
      </div>
    </div>
  );
}
