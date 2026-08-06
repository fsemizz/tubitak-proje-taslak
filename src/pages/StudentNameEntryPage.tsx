import { useNavigate, useSearchParams } from 'react-router-dom';
import { WelcomeHero } from '@/features/student-session/components/WelcomeHero';
import { StudentNameForm } from '@/features/student-session/components/StudentNameForm';
import { Card, CardContent } from '@/components/ui/card';
import { useSessionStore } from '@/stores/useSessionStore';
import { buildGamePlayPath, ROUTE_PATHS } from '@/app/routePaths';

export default function StudentNameEntryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const startSession = useSessionStore((s) => s.startSession);
  const nextGameSlug = searchParams.get('next');

  function handleSubmit(firstName: string, lastName: string) {
    startSession(firstName, lastName);
    navigate(nextGameSlug ? buildGamePlayPath(nextGameSlug) : ROUTE_PATHS.home);
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 py-8">
      <WelcomeHero />
      <Card>
        <CardContent className="py-6">
          <StudentNameForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
