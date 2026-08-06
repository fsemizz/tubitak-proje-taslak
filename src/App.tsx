import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { PageContainer } from './components/layout/PageContainer';
import { LandingPage } from './features/auth/LandingPage';
import { GameCatalog } from './features/catalog/GameCatalog';
import { GameDetailView } from './features/games/GameDetailView';
import { AlgorithmSortingGame } from './features/games/algorithm-sorting/AlgorithmSortingGame';
import { PatternCompletionGame } from './features/games/pattern-completion/PatternCompletionGame';
import { DebugDetectiveGame } from './features/games/debug-detective/DebugDetectiveGame';
import { LoopBuilderGame } from './features/games/loop-builder/LoopBuilderGame';
import { ConditionQuestGame } from './features/games/condition-quest/ConditionQuestGame';
import { TeacherDashboard } from './features/teacher/TeacherDashboard';

export const App: React.FC = () => {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL || '/'}>
      <PageContainer>
        <Routes>
          {/* Auth & Mode selection */}
          <Route path="/" element={<LandingPage />} />

          {/* Student Game Catalog */}
          <Route path="/catalog" element={<GameCatalog />} />
          <Route path="/game/:gameId" element={<GameDetailView />} />

          {/* 5 Algorithmic Games */}
          <Route path="/play/algorithm-sorting" element={<AlgorithmSortingGame />} />
          <Route path="/play/pattern-completion" element={<PatternCompletionGame />} />
          <Route path="/play/debug-detective" element={<DebugDetectiveGame />} />
          <Route path="/play/loop-builder" element={<LoopBuilderGame />} />
          <Route path="/play/condition-quest" element={<ConditionQuestGame />} />

          {/* Teacher Dashboard */}
          <Route path="/teacher" element={<TeacherDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageContainer>
    </BrowserRouter>
  );
};

export default App;
