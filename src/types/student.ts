export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  grade?: number;
  createdAt: string;
}

export interface StudentSession {
  student: StudentProfile;
  startedAt: string;
}
