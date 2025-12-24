import fetchAPI from './api';
import { type University, type Institute, type Person, type SubjectTopic, type Thesis, type DashboardStats } from '../types';

// Transform database field names to frontend format
const transformUniversity = (db: any): University => ({
  id: db.university_id.toString(),
  name: db.name,
  country: db.country,
  city: db.city,
});

const transformInstitute = (db: any): Institute => ({
  id: db.institute_id.toString(),
  name: db.name,
  universityId: db.university_id.toString(),
});

const transformPerson = (db: any): Person => {
  // Determine roles from SupervisorAssignment - for now, we'll need to fetch this separately
  // For simplicity, we'll assume all people can be authors/supervisors
  return {
    id: db.person_id.toString(),
    firstName: db.first_name,
    lastName: db.last_name,
    email: db.email,
    roles: [], // Will be populated from SupervisorAssignment if needed
    affiliation: db.affiliation || null,
  };
};

const transformSubjectTopic = (db: any): SubjectTopic => ({
  id: db.topic_id.toString(),
  topicName: db.topic_name,
});

const transformThesis = (db: any): Thesis => ({
  id: db.thesis_id.toString(),
  thesisNo: db.thesis_id, // Using thesis_id as thesisNo
  title: db.title,
  abstract: db.abstract,
  type: db.type as Thesis['type'],
  universityId: db.university_id.toString(),
  instituteId: db.institute_id.toString(),
  authorId: db.author_id.toString(),
  supervisorIds: [], // Will be populated from related data
  coSupervisorId: undefined,
  year: db.year,
  language: db.language,
  submissionDate: db.submission_date,
  numPages: db.num_pages,
  subjectTopicIds: [], // Will be populated from related data
  keywords: [], // Will be populated from related data
});

export const universityService = {
  getAll: async (): Promise<University[]> => {
    const data = await fetchAPI<any[]>('/universities');
    return data.map(transformUniversity);
  },
  getById: async (id: string): Promise<University | null> => {
    try {
      const data = await fetchAPI<any>(`/universities/${id}`);
      return transformUniversity(data);
    } catch {
      return null;
    }
  },
  create: async (data: Omit<University, 'id'>): Promise<University> => {
    const created = await fetchAPI<any>('/universities', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        country: data.country,
        city: data.city,
      }),
    });
    return transformUniversity(created);
  },
  update: async (id: string, data: Partial<University>): Promise<University> => {
    const updated = await fetchAPI<any>(`/universities/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: data.name,
        country: data.country,
        city: data.city,
      }),
    });
    return transformUniversity(updated);
  },
  delete: async (id: string): Promise<void> => {
    await fetchAPI(`/universities/${id}`, { method: 'DELETE' });
  },
};

export const instituteService = {
  getAll: async (): Promise<Institute[]> => {
    const data = await fetchAPI<any[]>('/institutes');
    return data.map(transformInstitute);
  },
  getById: async (id: string): Promise<Institute | null> => {
    try {
      const data = await fetchAPI<any>(`/institutes/${id}`);
      return transformInstitute(data);
    } catch {
      return null;
    }
  },
  getByUniversityId: async (universityId: string): Promise<Institute[]> => {
    const data = await fetchAPI<any[]>(`/institutes/university/${universityId}`);
    return data.map(transformInstitute);
  },
  create: async (data: Omit<Institute, 'id'>): Promise<Institute> => {
    const created = await fetchAPI<any>('/institutes', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        university_id: parseInt(data.universityId),
      }),
    });
    return transformInstitute(created);
  },
  update: async (id: string, data: Partial<Institute>): Promise<Institute> => {
    const updated = await fetchAPI<any>(`/institutes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: data.name,
        university_id: data.universityId ? parseInt(data.universityId) : undefined,
      }),
    });
    return transformInstitute(updated);
  },
  delete: async (id: string): Promise<void> => {
    await fetchAPI(`/institutes/${id}`, { method: 'DELETE' });
  },
};

export const personService = {
  getAll: async (): Promise<Person[]> => {
    const data = await fetchAPI<any[]>('/people');
    return data.map(transformPerson);
  },
  getById: async (id: string): Promise<Person | null> => {
    try {
      const data = await fetchAPI<any>(`/people/${id}`);
      return transformPerson(data);
    } catch {
      return null;
    }
  },
  create: async (data: Omit<Person, 'id'>): Promise<Person> => {
    const created = await fetchAPI<any>('/people', {
      method: 'POST',
      body: JSON.stringify({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        affiliation: data.affiliation || null,
      }),
    });
    return transformPerson(created);
  },
  update: async (id: string, data: Partial<Person>): Promise<Person> => {
    const updated = await fetchAPI<any>(`/people/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        affiliation: data.affiliation !== undefined ? data.affiliation : null,
      }),
    });
    return transformPerson(updated);
  },
  delete: async (id: string): Promise<void> => {
    await fetchAPI(`/people/${id}`, { method: 'DELETE' });
  },
};

export const subjectTopicService = {
  getAll: async (): Promise<SubjectTopic[]> => {
    const data = await fetchAPI<any[]>('/subject-topics');
    return data.map(transformSubjectTopic);
  },
  getById: async (id: string): Promise<SubjectTopic | null> => {
    try {
      const data = await fetchAPI<any>(`/subject-topics/${id}`);
      return transformSubjectTopic(data);
    } catch {
      return null;
    }
  },
  create: async (data: Omit<SubjectTopic, 'id'>): Promise<SubjectTopic> => {
    const created = await fetchAPI<any>('/subject-topics', {
      method: 'POST',
      body: JSON.stringify({
        topic_name: data.topicName,
      }),
    });
    return transformSubjectTopic(created);
  },
  update: async (id: string, data: Partial<SubjectTopic>): Promise<SubjectTopic> => {
    const updated = await fetchAPI<any>(`/subject-topics/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        topic_name: data.topicName,
      }),
    });
    return transformSubjectTopic(updated);
  },
  delete: async (id: string): Promise<void> => {
    await fetchAPI(`/subject-topics/${id}`, { method: 'DELETE' });
  },
};

export const thesisService = {
  getAll: async (): Promise<Thesis[]> => {
    const data = await fetchAPI<any[]>('/theses');
    return data.map(transformThesis);
  },
  getById: async (id: string): Promise<Thesis | null> => {
    try {
      const data = await fetchAPI<any>(`/theses/${id}`);
      const thesis = transformThesis(data);
      
      // Populate related data
      if (data.supervisors) {
        const supervisors = data.supervisors.filter((s: any) => s.role === 'Supervisor');
        const coSupervisor = data.supervisors.find((s: any) => s.role === 'Co-Supervisor');
        thesis.supervisorIds = supervisors.map((s: any) => s.person_id.toString());
        thesis.coSupervisorId = coSupervisor ? coSupervisor.person_id.toString() : undefined;
      }
      if (data.subjectTopics) {
        thesis.subjectTopicIds = data.subjectTopics.map((st: any) => st.topic_id.toString());
      }
      if (data.keywords) {
        thesis.keywords = data.keywords;
      }
      
      return thesis;
    } catch {
      return null;
    }
  },
  create: async (data: Omit<Thesis, 'id' | 'thesisNo'>): Promise<Thesis> => {
    const created = await fetchAPI<any>('/theses', {
      method: 'POST',
      body: JSON.stringify({
        title: data.title,
        abstract: data.abstract,
        author_id: parseInt(data.authorId),
        year: data.year,
        type: data.type,
        university_id: parseInt(data.universityId),
        institute_id: parseInt(data.instituteId),
        num_pages: data.numPages,
        language: data.language,
        submission_date: data.submissionDate,
        supervisor_ids: data.supervisorIds.map(id => parseInt(id)),
        co_supervisor_id: data.coSupervisorId ? parseInt(data.coSupervisorId) : null,
        subject_topic_ids: data.subjectTopicIds.map(id => parseInt(id)),
        keywords: data.keywords,
      }),
    });
    return transformThesis(created);
  },
  update: async (id: string, data: Partial<Thesis>): Promise<Thesis> => {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.abstract !== undefined) updateData.abstract = data.abstract;
    if (data.authorId !== undefined) updateData.author_id = parseInt(data.authorId);
    if (data.year !== undefined) updateData.year = data.year;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.universityId !== undefined) updateData.university_id = parseInt(data.universityId);
    if (data.instituteId !== undefined) updateData.institute_id = parseInt(data.instituteId);
    if (data.numPages !== undefined) updateData.num_pages = data.numPages;
    if (data.language !== undefined) updateData.language = data.language;
    if (data.submissionDate !== undefined) updateData.submission_date = data.submissionDate;
    if (data.supervisorIds !== undefined) updateData.supervisor_ids = data.supervisorIds.map(id => parseInt(id));
    if (data.coSupervisorId !== undefined) updateData.co_supervisor_id = data.coSupervisorId ? parseInt(data.coSupervisorId) : null;
    if (data.subjectTopicIds !== undefined) updateData.subject_topic_ids = data.subjectTopicIds.map(id => parseInt(id));
    if (data.keywords !== undefined) updateData.keywords = data.keywords;

    const updated = await fetchAPI<any>(`/theses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    return transformThesis(updated);
  },
  delete: async (id: string): Promise<void> => {
    await fetchAPI(`/theses/${id}`, { method: 'DELETE' });
  },
  search: async (filters: {
    query?: string;
    authorId?: string;
    universityId?: string;
    instituteId?: string;
    type?: string;
    language?: string;
    yearFrom?: number;
    yearTo?: number;
  }): Promise<Thesis[]> => {
    const params = new URLSearchParams();
    if (filters.query) params.append('query', filters.query);
    if (filters.authorId) params.append('author_id', filters.authorId);
    if (filters.universityId) params.append('university_id', filters.universityId);
    if (filters.instituteId) params.append('institute_id', filters.instituteId);
    if (filters.type) params.append('type', filters.type);
    if (filters.language) params.append('language', filters.language);
    if (filters.yearFrom) params.append('year_from', filters.yearFrom.toString());
    if (filters.yearTo) params.append('year_to', filters.yearTo.toString());

    const data = await fetchAPI<any[]>(`/theses/search?${params.toString()}`);
    return data.map(transformThesis);
  },
};

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    return await fetchAPI<DashboardStats>('/dashboard/stats');
  },
};

