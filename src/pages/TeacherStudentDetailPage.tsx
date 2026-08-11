import { useLoaderData, useNavigation, useRevalidator, type LoaderFunctionArgs } from 'react-router-dom';
import { Trophy, Star, Clock3, Gamepad2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatTile } from '@/components/primitives/StatTile';
import { StudentScoreChart } from '@/features/teacher/components/StudentScoreChart';
import { ResultsTable } from '@/features/teacher/components/ResultsTable';
import { GameBreakdownTable } from '@/features/teacher/components/GameBreakdownTable';
import { StudentSkillProfileCard } from '@/features/teacher/components/StudentSkillProfileCard';
import { HouseNavReportCard } from '@/features/teacher/components/HouseNavReportCard';
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
  const revalidator = useRevalidator();
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading' || revalidator.state === 'loading';

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        title={`${student.firstName} ${student.lastName}`}
        description={student.grade !== undefined ? `${student.grade}. sınıf` : undefined}
        action={
          <Button variant="outline" onClick={() => revalidator.revalidate()}>
            <RefreshCw className={isLoading ? 'size-4 animate-spin' : 'size-4'} /> Verileri Yenile
          </Button>
        }
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

      {(() => {
        const houseNavResult = results.find((r) => r.houseNavMetrics);
        return (
          <div className="flex flex-col gap-4">
            <SectionHeading title="Beceri Profili" description="5 eksende algoritmik düşünme becerisi." />
            <StudentSkillProfileCard
              studentFirstName={student.firstName}
              results={results}
              kbsScore={houseNavResult?.houseNavMetrics?.kbsScore}
            />
            {houseNavResult?.houseNavMetrics && <HouseNavReportCard metrics={houseNavResult.houseNavMetrics} />}
          </div>
        );
      })()}

      <div className="flex flex-col gap-4">
        <SectionHeading title="Oyun Bazlı Döküm" description="Hangi oyunu kaç kez oynadı, hangisinden kaç aldı." />
        <GameBreakdownTable results={results} />
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
