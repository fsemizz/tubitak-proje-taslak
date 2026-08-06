const NAMESPACE = 'codekids.v1';

export const STORAGE_KEYS = {
  results: `${NAMESPACE}.results`,
  students: `${NAMESPACE}.students`,
  session: `${NAMESPACE}.session`,
  teacher: `${NAMESPACE}.teacher`,
  ui: `${NAMESPACE}.ui`,
  seeded: `${NAMESPACE}.seeded`,
} as const;
