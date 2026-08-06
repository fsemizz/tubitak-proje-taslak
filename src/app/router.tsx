import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { TeacherLayout } from '@/components/layout/TeacherLayout';
import { ROUTE_PATHS } from './routePaths';

import HomeCatalogPage, { homeCatalogLoader } from '@/pages/HomeCatalogPage';
import StudentNameEntryPage from '@/pages/StudentNameEntryPage';
import GamePlayPage, { gamePlayLoader } from '@/pages/GamePlayPage';
import ResultsPage, { gameResultsLoader } from '@/pages/ResultsPage';
import TeacherLoginPage from '@/pages/TeacherLoginPage';
import TeacherDashboardPage, { teacherDashboardLoader } from '@/pages/TeacherDashboardPage';
import TeacherHistoryPage, { teacherHistoryLoader } from '@/pages/TeacherHistoryPage';
import TeacherStudentDetailPage, { teacherStudentDetailLoader } from '@/pages/TeacherStudentDetailPage';
import NotFoundPage from '@/pages/NotFoundPage';

export const router = createBrowserRouter(
  [
    {
      element: <PublicLayout />,
      errorElement: <NotFoundPage />,
      children: [
        { path: ROUTE_PATHS.home, Component: HomeCatalogPage, loader: homeCatalogLoader },
        { path: ROUTE_PATHS.studentNameEntry, Component: StudentNameEntryPage },
        { path: ROUTE_PATHS.gamePlay, Component: GamePlayPage, loader: gamePlayLoader },
        { path: ROUTE_PATHS.gameResults, Component: ResultsPage, loader: gameResultsLoader },
        { path: ROUTE_PATHS.teacherLogin, Component: TeacherLoginPage },
      ],
    },
    {
      element: <TeacherLayout />,
      errorElement: <NotFoundPage />,
      children: [
        { path: ROUTE_PATHS.teacherDashboard, Component: TeacherDashboardPage, loader: teacherDashboardLoader },
        { path: ROUTE_PATHS.teacherHistory, Component: TeacherHistoryPage, loader: teacherHistoryLoader },
        {
          path: ROUTE_PATHS.teacherStudentDetail,
          Component: TeacherStudentDetailPage,
          loader: teacherStudentDetailLoader,
        },
      ],
    },
    { path: '*', Component: NotFoundPage },
  ],
  { basename: import.meta.env.BASE_URL },
);
