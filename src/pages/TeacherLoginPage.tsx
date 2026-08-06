import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { TeacherLoginForm } from '@/features/teacher/components/TeacherLoginForm';
import { Card, CardContent } from '@/components/ui/card';
import { useTeacherStore } from '@/stores/useTeacherStore';
import { ROUTE_PATHS } from '@/app/routePaths';

export default function TeacherLoginPage() {
  const navigate = useNavigate();
  const login = useTeacherStore((s) => s.login);
  const isLoading = useTeacherStore((s) => s.isLoading);
  const error = useTeacherStore((s) => s.error);

  async function handleSubmit(displayName: string, passcode: string) {
    const success = await login({ displayName, passcode });
    if (success) navigate(ROUTE_PATHS.teacherDashboard);
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 py-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg">
          <ShieldCheck className="size-8" />
        </span>
        <h1 className="font-display text-2xl font-extrabold text-foreground">Öğretmen Girişi</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Öğrenci sonuçlarını ve oyun geçmişini görüntülemek için giriş yap.
        </p>
      </div>
      <Card>
        <CardContent className="py-6">
          <TeacherLoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
        </CardContent>
      </Card>
    </div>
  );
}
