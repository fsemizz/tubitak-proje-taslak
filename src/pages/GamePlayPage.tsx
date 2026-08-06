import { useLoaderData, type LoaderFunctionArgs } from 'react-router-dom';
import { GameShell } from '@/features/game-player/components/GameShell';
import { gameContentService } from '@/services/serviceProvider';
import { requireStudentLoader } from '@/app/routeGuards';
import type { GameDefinition, GameLevel } from '@/types/game';

export async function gamePlayLoader(args: LoaderFunctionArgs) {
  requireStudentLoader(args);
  const gameSlug = args.params.gameSlug as string;
  const game = await gameContentService.getGame(gameSlug);
  if (!game) {
    throw new Response('Oyun bulunamadı', { status: 404 });
  }
  const levels = await gameContentService.listLevels(gameSlug);
  return { game, levels };
}

export default function GamePlayPage() {
  const { game, levels } = useLoaderData() as { game: GameDefinition; levels: GameLevel[] };
  return <GameShell game={game} levels={levels} />;
}
