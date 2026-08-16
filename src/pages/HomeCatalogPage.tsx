import { useEffect, useMemo, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';
import { GameCatalogGrid } from '@/features/catalog/components/GameCatalogGrid';
import { CategoryFilterBar } from '@/features/catalog/components/CategoryFilterBar';
import { SectionHeading } from '@/components/primitives/SectionHeading';
import { ConfettiBurst } from '@/components/primitives/ConfettiBurst';
import { OnboardingModal } from '@/features/onboarding/components/OnboardingModal';
import { Button } from '@/components/ui/button';
import { gameContentService } from '@/services/serviceProvider';
import { useSessionStore } from '@/stores/useSessionStore';
import { useBackgroundMusic, MENU_TRACK_ID } from '@/hooks/useBackgroundMusic';
import { useGameSounds } from '@/hooks/useGameSounds';
import { readJson, writeJson } from '@/services/storage/localStorageClient';
import { STORAGE_KEYS } from '@/services/storage/keys';
import type { GameDefinition } from '@/types/game';
import type { GameCategory } from '@/types/common';

export async function homeCatalogLoader() {
  const games = await gameContentService.listGames();
  return { games };
}

export default function HomeCatalogPage() {
  const { games } = useLoaderData() as { games: GameDefinition[] };
  const currentStudent = useSessionStore((s) => s.currentStudent);
  const endSession = useSessionStore((s) => s.endSession);
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | null>(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const music = useBackgroundMusic();
  const sounds = useGameSounds();

  useEffect(() => {
    music.start(MENU_TRACK_ID);
    return () => music.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!readJson(STORAGE_KEYS.onboardingSeen, false)) {
      setOnboardingOpen(true);
    }
  }, []);

  function handleOnboardingDismiss() {
    writeJson(STORAGE_KEYS.onboardingSeen, true);
    setOnboardingOpen(false);
    // A discrete click event, well after the menu music already settled in — the chime layers
    // cleanly instead of colliding with it.
    sounds.playWelcome();
    setConfettiTrigger((t) => t + 1);
  }

  const categories = useMemo(
    () => Array.from(new Set(games.map((g) => g.category))),
    [games],
  );
  const filteredGames = useMemo(
    () => (selectedCategory ? games.filter((g) => g.category === selectedCategory) : games),
    [games, selectedCategory],
  );

  return (
    <div className="flex flex-col gap-10">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-10 text-white sm:px-10 sm:py-14">
        <ConfettiBurst trigger={confettiTrigger} />
        <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
          <Sparkles className="size-4" /> Bilgisayarsız Kodlama Platformu
        </div>
        <h1 className="mt-3 max-w-xl font-display text-3xl font-extrabold sm:text-4xl">
          Oynayarak algoritmik düşünmeyi keşfet!
        </h1>
        <p className="mt-3 max-w-lg text-white/85">
          Sıralama, örüntü, hata bulma, döngü ve daha fazlası — bilgisayar olmadan kodlamanın temellerini
          öğrenen eğlenceli oyunlar.
        </p>

        {currentStudent && (
          <div className="mt-6 inline-flex items-center gap-3 rounded-xl bg-white/15 px-4 py-2.5 backdrop-blur">
            <span className="text-sm font-medium">
              Merhaba, <strong>{currentStudent.firstName}</strong>! Oynamaya devam edebilirsin.
            </span>
            <Button size="sm" variant="ghost" className="h-7 text-white hover:bg-white/20 hover:text-white" onClick={endSession}>
              <X className="size-3.5" /> Oturumu Bitir
            </Button>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-5">
        <SectionHeading
          title="Oyun Kataloğu"
          description="Kategoriye göre filtrele ve bir oyun seç."
        />
        <CategoryFilterBar categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
        <GameCatalogGrid games={filteredGames} hasActiveStudent={Boolean(currentStudent)} />
      </section>

      <OnboardingModal
        open={onboardingOpen}
        onOpenChange={setOnboardingOpen}
        onDismiss={handleOnboardingDismiss}
      />
    </div>
  );
}
