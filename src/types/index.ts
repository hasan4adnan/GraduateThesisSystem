export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
}

export interface Institute {
  id: string;
  name: string;
  universityId: string;
}

export type PersonRole = 'Author' | 'Supervisor' | 'Co-supervisor';

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: PersonRole[];
  affiliation?: string | null;
}

export interface SubjectTopic {
  id: string;
  topicName: string;
}

export type ThesisType = 'Master' | 'Doctorate' | 'Specialization in Medicine' | 'Proficiency in Art';

export interface Thesis {
  id: string;
  thesisNo: number;
  title: string;
  abstract: string;
  type: ThesisType;
  universityId: string;
  instituteId: string;
  authorId: string;
  supervisorIds: string[];
  coSupervisorId?: string;
  year: number;
  language: string;
  submissionDate: string;
  numPages: number;
  subjectTopicIds: string[];
  keywords: string[];
}

export interface DashboardStats {
  totalTheses: number;
  totalUniversities: number;
  totalPeople: number;
  totalInstitutes: number;
}



