import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { type Thesis, type University, type Institute, type Person, type SubjectTopic } from '../../types';
import { thesisService, universityService, instituteService, personService, subjectTopicService } from '../../services/apiServices';
import Tabs from '../../components/ui/Tabs';
import Button from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Edit } from 'lucide-react';

export default function ThesisDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [thesis, setThesis] = useState<Thesis | null>(null);
  const [university, setUniversity] = useState<University | null>(null);
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [author, setAuthor] = useState<Person | null>(null);
  const [supervisors, setSupervisors] = useState<Person[]>([]);
  const [coSupervisor, setCoSupervisor] = useState<Person | null>(null);
  const [subjectTopics, setSubjectTopics] = useState<SubjectTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const thesisData = await thesisService.getById(id);
        if (!thesisData) {
          navigate('/theses/search');
          return;
        }
        setThesis(thesisData);

        const [uni, inst, auth, subs, topics] = await Promise.all([
          universityService.getById(thesisData.universityId),
          instituteService.getById(thesisData.instituteId),
          personService.getById(thesisData.authorId),
          Promise.all(thesisData.supervisorIds.map(id => personService.getById(id))),
          Promise.all(thesisData.subjectTopicIds.map(id => subjectTopicService.getById(id))),
        ]);

        setUniversity(uni);
        setInstitute(inst);
        setAuthor(auth);
        setSupervisors(subs.filter(p => p !== null) as Person[]);
        if (thesisData.coSupervisorId) {
          const coSup = await personService.getById(thesisData.coSupervisorId);
          setCoSupervisor(coSup);
        }
        setSubjectTopics(topics.filter(t => t !== null) as SubjectTopic[]);
      } catch (error) {
        console.error('Failed to load thesis:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!thesis) {
    return <div className="text-center py-12">Thesis not found</div>;
  }

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Thesis No</h3>
            <p className="text-lg">{thesis.thesisNo}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Title</h3>
            <p className="text-lg font-semibold">{thesis.title}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Abstract</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{thesis.abstract}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Type</h3>
              <p>{thesis.type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Year</h3>
              <p>{thesis.year}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Language</h3>
              <p>{thesis.language}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Number of Pages</h3>
              <p>{thesis.numPages}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Submission Date</h3>
              <p>{new Date(thesis.submissionDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'people',
      label: 'People',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Author</h3>
            {author ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="font-medium">{author.firstName} {author.lastName}</p>
                  <p className="text-sm text-gray-600">{author.email}</p>
                </CardContent>
              </Card>
            ) : (
              <p className="text-gray-500">Author not found</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Supervisors</h3>
            {supervisors.length > 0 ? (
              <div className="space-y-2">
                {supervisors.map((supervisor) => (
                  <Card key={supervisor.id}>
                    <CardContent className="pt-6">
                      <p className="font-medium">{supervisor.firstName} {supervisor.lastName}</p>
                      <p className="text-sm text-gray-600">{supervisor.email}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No supervisors found</p>
            )}
          </div>
          {coSupervisor && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Co-supervisor</h3>
              <Card>
                <CardContent className="pt-6">
                  <p className="font-medium">{coSupervisor.firstName} {coSupervisor.lastName}</p>
                  <p className="text-sm text-gray-600">{coSupervisor.email}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'topics',
      label: 'Topics & Keywords',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Subject Topics</h3>
            {subjectTopics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {subjectTopics.map((topic) => (
                  <span
                    key={topic.id}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {topic.topicName}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No subject topics assigned</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Keywords</h3>
            {thesis.keywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {thesis.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No keywords assigned</p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: 'institution',
      label: 'Institution',
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">University</h3>
            {university ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="font-medium text-lg">{university.name}</p>
                  <p className="text-sm text-gray-600">{university.city}, {university.country}</p>
                </CardContent>
              </Card>
            ) : (
              <p className="text-gray-500">University not found</p>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Institute</h3>
            {institute ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="font-medium text-lg">{institute.name}</p>
                </CardContent>
              </Card>
            ) : (
              <p className="text-gray-500">Institute not found</p>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Thesis Details</h1>
        <Button onClick={() => navigate(`/theses/${id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>
      <Tabs tabs={tabs} />
    </div>
  );
}

