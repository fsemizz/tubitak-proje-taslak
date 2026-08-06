import { redirect, type LoaderFunctionArgs } from 'react-router-dom';
import { useSessionStore } from '@/stores/useSessionStore';
import { useTeacherStore } from '@/stores/useTeacherStore';
import { ROUTE_PATHS, buildStudentNameEntryPath } from './routePaths';

export function requireStudentLoader({ params }: LoaderFunctionArgs) {
  const currentStudent = useSessionStore.getState().currentStudent;
  if (!currentStudent) {
    const gameSlug = params.gameSlug;
    throw redirect(buildStudentNameEntryPath(gameSlug));
  }
  return null;
}

export function requireTeacherLoader() {
  const session = useTeacherStore.getState().session;
  if (!session) {
    throw redirect(ROUTE_PATHS.teacherLogin);
  }
  return null;
}
