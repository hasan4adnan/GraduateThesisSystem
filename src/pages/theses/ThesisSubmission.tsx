import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { thesisService, universityService, instituteService, personService, subjectTopicService } from '../../services/apiServices';
import { type University, type Institute, type Person, type SubjectTopic, type ThesisType } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { X } from 'lucide-react';

const currentYear = new Date().getFullYear();

const thesisSchema = z.object({
  title: z.string().max(500, 'Title must be at most 500 characters').min(1, 'Title is required'),
  abstract: z.string().max(5000, 'Abstract must be at most 5000 characters').min(1, 'Abstract is required'),
  type: z.enum(['Master', 'Doctorate', 'Specialization in Medicine', 'Proficiency in Art']),
  universityId: z.string().min(1, 'University is required'),
  instituteId: z.string().min(1, 'Institute is required'),
  authorId: z.string().min(1, 'Author is required'),
  supervisorIds: z.array(z.string()).min(1, 'At least one supervisor is required'),
  coSupervisorId: z.string().optional(),
  year: z.number().min(1900).max(currentYear),
  language: z.string().min(1, 'Language is required'),
  submissionDate: z.string().min(1, 'Submission date is required'),
  numPages: z.number().positive('Number of pages must be positive'),
  subjectTopicIds: z.array(z.string()),
  keywords: z.array(z.string()),
});

type ThesisFormData = z.infer<typeof thesisSchema>;

export default function ThesisSubmission() {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState<University[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [subjectTopics, setSubjectTopics] = useState<SubjectTopic[]>([]);
  const [filteredInstitutes, setFilteredInstitutes] = useState<Institute[]>([]);
  const [keywordInput, setKeywordInput] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ThesisFormData>({
    resolver: zodResolver(thesisSchema),
    defaultValues: {
      supervisorIds: [],
      subjectTopicIds: [],
      keywords: [],
      year: currentYear,
    },
  });

  const selectedUniversityId = watch('universityId');
  const selectedSupervisorIds = watch('supervisorIds') || [];
  const selectedSubjectTopicIds = watch('subjectTopicIds') || [];
  const keywords = watch('keywords') || [];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [unis, insts, pers, topics] = await Promise.all([
          universityService.getAll(),
          instituteService.getAll(),
          personService.getAll(),
          subjectTopicService.getAll(),
        ]);
        setUniversities(unis);
        setInstitutes(insts);
        setPeople(pers);
        setSubjectTopics(topics);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedUniversityId) {
      const filtered = institutes.filter(inst => inst.universityId === selectedUniversityId);
      setFilteredInstitutes(filtered);
      if (filtered.length > 0 && !filtered.find(i => i.id === watch('instituteId'))) {
        setValue('instituteId', '');
      }
    } else {
      setFilteredInstitutes([]);
    }
  }, [selectedUniversityId, institutes]);

  const toggleSupervisor = (personId: string) => {
    const current = selectedSupervisorIds;
    if (current.includes(personId)) {
      setValue('supervisorIds', current.filter(id => id !== personId));
    } else {
      setValue('supervisorIds', [...current, personId]);
    }
  };

  const toggleSubjectTopic = (topicId: string) => {
    const current = selectedSubjectTopicIds;
    if (current.includes(topicId)) {
      setValue('subjectTopicIds', current.filter(id => id !== topicId));
    } else {
      setValue('subjectTopicIds', [...current, topicId]);
    }
  };

  const addKeyword = () => {
    const keyword = keywordInput.trim();
    if (keyword && !keywords.includes(keyword)) {
      setValue('keywords', [...keywords, keyword]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setValue('keywords', keywords.filter(k => k !== keyword));
  };

  // All people can be supervisors/authors since roles are determined by assignments
  const supervisors = people;
  const authors = people;

  const onSubmit = async (data: ThesisFormData) => {
    try {
      await thesisService.create(data);
      alert('Thesis submitted successfully!');
      navigate('/theses/search');
    } catch (error) {
      console.error('Failed to submit thesis:', error);
      alert('Failed to submit thesis');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Thesis Submission</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <Input {...register('title')} placeholder="Enter thesis title" />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Abstract *
              </label>
              <textarea
                {...register('abstract')}
                rows={6}
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                placeholder="Enter abstract"
              />
              {errors.abstract && (
                <p className="text-red-600 text-sm mt-1">{errors.abstract.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <Select {...register('type')}>
                <option value="">Select type</option>
                {(['Master', 'Doctorate', 'Specialization in Medicine', 'Proficiency in Art'] as ThesisType[]).map(
                  (type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  )
                )}
              </Select>
              {errors.type && (
                <p className="text-red-600 text-sm mt-1">{errors.type.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Institution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                University *
              </label>
              <Select {...register('universityId')}>
                <option value="">Select a university</option>
                {universities.map((university) => (
                  <option key={university.id} value={university.id}>
                    {university.name}
                  </option>
                ))}
              </Select>
              {errors.universityId && (
                <p className="text-red-600 text-sm mt-1">{errors.universityId.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institute *
              </label>
              <Select {...register('instituteId')} disabled={!selectedUniversityId}>
                <option value="">Select an institute</option>
                {filteredInstitutes.map((institute) => (
                  <option key={institute.id} value={institute.id}>
                    {institute.name}
                  </option>
                ))}
              </Select>
              {errors.instituteId && (
                <p className="text-red-600 text-sm mt-1">{errors.instituteId.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>People</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author * (Exactly 1)
              </label>
              <Select {...register('authorId')}>
                <option value="">Select an author</option>
                {authors.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.firstName} {person.lastName} ({person.email})
                  </option>
                ))}
              </Select>
              {errors.authorId && (
                <p className="text-red-600 text-sm mt-1">{errors.authorId.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supervisors * (At least 1)
              </label>
              <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                {supervisors.length === 0 ? (
                  <p className="text-gray-500 text-sm">No supervisors available</p>
                ) : (
                  supervisors.map((person) => (
                    <label key={person.id} className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        checked={selectedSupervisorIds.includes(person.id)}
                        onChange={() => toggleSupervisor(person.id)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">
                        {person.firstName} {person.lastName} ({person.email})
                      </span>
                    </label>
                  ))
                )}
              </div>
              {errors.supervisorIds && (
                <p className="text-red-600 text-sm mt-1">{errors.supervisorIds.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Co-supervisor (0 or 1)
              </label>
              <Select {...register('coSupervisorId')}>
                <option value="">None</option>
                {supervisors.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.firstName} {person.lastName} ({person.email})
                  </option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year * (1900 - {currentYear})
              </label>
              <Input
                type="number"
                {...register('year', { valueAsNumber: true })}
                min={1900}
                max={currentYear}
              />
              {errors.year && (
                <p className="text-red-600 text-sm mt-1">{errors.year.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language *
              </label>
              <Select {...register('language')}>
                <option value="">Select language</option>
                <option value="English">English</option>
                <option value="Turkish">Turkish</option>
                <option value="German">German</option>
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
              </Select>
              {errors.language && (
                <p className="text-red-600 text-sm mt-1">{errors.language.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Submission Date *
              </label>
              <Input type="date" {...register('submissionDate')} />
              {errors.submissionDate && (
                <p className="text-red-600 text-sm mt-1">{errors.submissionDate.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Pages *
              </label>
              <Input
                type="number"
                {...register('numPages', { valueAsNumber: true })}
                min={1}
              />
              {errors.numPages && (
                <p className="text-red-600 text-sm mt-1">{errors.numPages.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Topics & Keywords</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Topics
              </label>
              <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                {subjectTopics.length === 0 ? (
                  <p className="text-gray-500 text-sm">No subject topics available</p>
                ) : (
                  subjectTopics.map((topic) => (
                    <label key={topic.id} className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        checked={selectedSubjectTopicIds.includes(topic.id)}
                        onChange={() => toggleSubjectTopic(topic.id)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{topic.topicName}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addKeyword();
                    }
                  }}
                  placeholder="Enter keyword and press Enter"
                />
                <Button type="button" onClick={addKeyword}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="hover:text-blue-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate('/theses/search')}>
            Cancel
          </Button>
          <Button type="submit">Submit Thesis</Button>
        </div>
      </form>
    </div>
  );
}

