export const ROUTE_PATHS = {
  home: '/',
  studentNameEntry: '/ogrenci/isim',
  gamePlay: '/oyna/:gameSlug',
  gameResults: '/oyna/:gameSlug/sonuc',
  teacherLogin: '/ogretmen/giris',
  teacherDashboard: '/ogretmen',
  teacherHistory: '/ogretmen/gecmis',
  teacherStudentDetail: '/ogretmen/ogrenci/:studentId',
} as const;

export function buildStudentNameEntryPath(nextGameSlug?: string): string {
  return nextGameSlug
    ? `${ROUTE_PATHS.studentNameEntry}?next=${encodeURIComponent(nextGameSlug)}`
    : ROUTE_PATHS.studentNameEntry;
}

export function buildGamePlayPath(gameSlug: string): string {
  return ROUTE_PATHS.gamePlay.replace(':gameSlug', gameSlug);
}

export function buildGameResultsPath(gameSlug: string): string {
  return ROUTE_PATHS.gameResults.replace(':gameSlug', gameSlug);
}

export function buildTeacherStudentDetailPath(studentId: string): string {
  return ROUTE_PATHS.teacherStudentDetail.replace(':studentId', studentId);
}
