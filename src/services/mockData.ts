import { type University, type Institute, type Person, type SubjectTopic, type Thesis, type DashboardStats } from '../types';

// Mock data storage
let universities: University[] = [
  { id: '1', name: 'Istanbul University', country: 'Turkey', city: 'Istanbul' },
  { id: '2', name: 'Ankara University', country: 'Turkey', city: 'Ankara' },
];

let institutes: Institute[] = [
  { id: '1', name: 'Computer Science Institute', universityId: '1' },
  { id: '2', name: 'Engineering Institute', universityId: '1' },
  { id: '3', name: 'Social Sciences Institute', universityId: '2' },
];

let people: Person[] = [
  { id: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', roles: ['Author', 'Supervisor'] },
  { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', roles: ['Supervisor'] },
  { id: '3', firstName: 'Ahmet', lastName: 'Yılmaz', email: 'ahmet.yilmaz@example.com', roles: ['Author'] },
];

let subjectTopics: SubjectTopic[] = [
  { id: '1', topicName: 'Machine Learning' },
  { id: '2', topicName: 'Database Systems' },
  { id: '3', topicName: 'Software Engineering' },
];

let theses: Thesis[] = [
  {
    id: '1',
    thesisNo: 1234567,
    title: 'Advanced Machine Learning Techniques',
    abstract: 'This thesis explores advanced machine learning techniques...',
    type: 'Doctorate',
    universityId: '1',
    instituteId: '1',
    authorId: '1',
    supervisorIds: ['2'],
    year: 2023,
    language: 'English',
    submissionDate: '2023-06-15',
    numPages: 150,
    subjectTopicIds: ['1'],
    keywords: ['machine learning', 'neural networks', 'deep learning'],
  },
];

// Simulate async operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const universityService = {
  getAll: async (): Promise<University[]> => {
    await delay(300);
    return [...universities];
  },
  getById: async (id: string): Promise<University | null> => {
    await delay(200);
    return universities.find(u => u.id === id) || null;
  },
  create: async (data: Omit<University, 'id'>): Promise<University> => {
    await delay(300);
    const newUniversity = { ...data, id: Date.now().toString() };
    universities.push(newUniversity);
    return newUniversity;
  },
  update: async (id: string, data: Partial<University>): Promise<University> => {
    await delay(300);
    const index = universities.findIndex(u => u.id === id);
    if (index === -1) throw new Error('University not found');
    universities[index] = { ...universities[index], ...data };
    return universities[index];
  },
  delete: async (id: string): Promise<void> => {
    await delay(300);
    universities = universities.filter(u => u.id !== id);
  },
};

export const instituteService = {
  getAll: async (): Promise<Institute[]> => {
    await delay(300);
    return [...institutes];
  },
  getById: async (id: string): Promise<Institute | null> => {
    await delay(200);
    return institutes.find(i => i.id === id) || null;
  },
  getByUniversityId: async (universityId: string): Promise<Institute[]> => {
    await delay(200);
    return institutes.filter(i => i.universityId === universityId);
  },
  create: async (data: Omit<Institute, 'id'>): Promise<Institute> => {
    await delay(300);
    const newInstitute = { ...data, id: Date.now().toString() };
    institutes.push(newInstitute);
    return newInstitute;
  },
  update: async (id: string, data: Partial<Institute>): Promise<Institute> => {
    await delay(300);
    const index = institutes.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Institute not found');
    institutes[index] = { ...institutes[index], ...data };
    return institutes[index];
  },
  delete: async (id: string): Promise<void> => {
    await delay(300);
    institutes = institutes.filter(i => i.id !== id);
  },
};

export const personService = {
  getAll: async (): Promise<Person[]> => {
    await delay(300);
    return [...people];
  },
  getById: async (id: string): Promise<Person | null> => {
    await delay(200);
    return people.find(p => p.id === id) || null;
  },
  create: async (data: Omit<Person, 'id'>): Promise<Person> => {
    await delay(300);
    const newPerson = { ...data, id: Date.now().toString() };
    people.push(newPerson);
    return newPerson;
  },
  update: async (id: string, data: Partial<Person>): Promise<Person> => {
    await delay(300);
    const index = people.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Person not found');
    people[index] = { ...people[index], ...data };
    return people[index];
  },
  delete: async (id: string): Promise<void> => {
    await delay(300);
    people = people.filter(p => p.id !== id);
  },
};

export const subjectTopicService = {
  getAll: async (): Promise<SubjectTopic[]> => {
    await delay(300);
    return [...subjectTopics];
  },
  getById: async (id: string): Promise<SubjectTopic | null> => {
    await delay(200);
    return subjectTopics.find(st => st.id === id) || null;
  },
  create: async (data: Omit<SubjectTopic, 'id'>): Promise<SubjectTopic> => {
    await delay(300);
    const newTopic = { ...data, id: Date.now().toString() };
    subjectTopics.push(newTopic);
    return newTopic;
  },
  update: async (id: string, data: Partial<SubjectTopic>): Promise<SubjectTopic> => {
    await delay(300);
    const index = subjectTopics.findIndex(st => st.id === id);
    if (index === -1) throw new Error('Subject Topic not found');
    subjectTopics[index] = { ...subjectTopics[index], ...data };
    return subjectTopics[index];
  },
  delete: async (id: string): Promise<void> => {
    await delay(300);
    subjectTopics = subjectTopics.filter(st => st.id !== id);
  },
};

export const thesisService = {
  getAll: async (): Promise<Thesis[]> => {
    await delay(300);
    return [...theses];
  },
  getById: async (id: string): Promise<Thesis | null> => {
    await delay(200);
    return theses.find(t => t.id === id) || null;
  },
  create: async (data: Omit<Thesis, 'id'>): Promise<Thesis> => {
    await delay(300);
    const newThesis = { ...data, id: Date.now().toString() };
    theses.push(newThesis);
    return newThesis;
  },
  update: async (id: string, data: Partial<Thesis>): Promise<Thesis> => {
    await delay(300);
    const index = theses.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Thesis not found');
    theses[index] = { ...theses[index], ...data };
    return theses[index];
  },
  delete: async (id: string): Promise<void> => {
    await delay(300);
    theses = theses.filter(t => t.id !== id);
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
    await delay(400);
    let results = [...theses];
    
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(t => 
        t.title.toLowerCase().includes(query) || 
        t.thesisNo.toString().includes(query)
      );
    }
    
    if (filters.authorId) {
      results = results.filter(t => t.authorId === filters.authorId);
    }
    
    if (filters.universityId) {
      results = results.filter(t => t.universityId === filters.universityId);
    }
    
    if (filters.instituteId) {
      results = results.filter(t => t.instituteId === filters.instituteId);
    }
    
    if (filters.type) {
      results = results.filter(t => t.type === filters.type);
    }
    
    if (filters.language) {
      results = results.filter(t => t.language === filters.language);
    }
    
    if (filters.yearFrom) {
      results = results.filter(t => t.year >= filters.yearFrom!);
    }
    
    if (filters.yearTo) {
      results = results.filter(t => t.year <= filters.yearTo!);
    }
    
    return results.sort((a, b) => b.year - a.year);
  },
};

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    await delay(300);
    return {
      totalTheses: theses.length,
      totalUniversities: universities.length,
      totalPeople: people.length,
      totalInstitutes: institutes.length,
    };
  },
};

