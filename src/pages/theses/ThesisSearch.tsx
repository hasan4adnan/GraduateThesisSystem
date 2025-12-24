import { useEffect, useState } from 'react';
import { type Thesis, type University, type Institute, type Person, type ThesisType } from '../../types';
import { thesisService, universityService, instituteService, personService } from '../../services/apiServices';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ConfirmModal } from '../../components/ui/Modal';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown, Trash2 } from 'lucide-react';

export default function ThesisSearch() {
  const navigate = useNavigate();
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);

  const [filters, setFilters] = useState({
    query: '',
    authorId: '',
    universityId: '',
    instituteId: '',
    type: '',
    language: '',
    yearFrom: '',
    yearTo: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [unis, insts, pers] = await Promise.all([
          universityService.getAll(),
          instituteService.getAll(),
          personService.getAll(),
        ]);
        setUniversities(unis);
        setInstitutes(insts);
        setPeople(pers);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const searchTheses = async () => {
      try {
        setLoading(true);
        const results = await thesisService.search({
          query: filters.query || undefined,
          authorId: filters.authorId || undefined,
          universityId: filters.universityId || undefined,
          instituteId: filters.instituteId || undefined,
          type: filters.type || undefined,
          language: filters.language || undefined,
          yearFrom: filters.yearFrom ? parseInt(filters.yearFrom) : undefined,
          yearTo: filters.yearTo ? parseInt(filters.yearTo) : undefined,
        });
        setTheses(results);
      } catch (error) {
        console.error('Failed to search theses:', error);
      } finally {
        setLoading(false);
      }
    };
    searchTheses();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      authorId: '',
      universityId: '',
      instituteId: '',
      type: '',
      language: '',
      yearFrom: '',
      yearTo: '',
    });
  };

  const toggleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setTheses([...theses].sort((a, b) => (newOrder === 'desc' ? b.year - a.year : a.year - b.year)));
  };

  const getAuthorName = (authorId: string) => {
    const author = people.find(p => p.id === authorId);
    return author ? `${author.firstName} ${author.lastName}` : 'Unknown';
  };

  const getUniversityName = (universityId: string) => {
    return universities.find(u => u.id === universityId)?.name || 'Unknown';
  };

  const filteredInstitutes = filters.universityId
    ? institutes.filter(i => i.universityId === filters.universityId)
    : institutes;

  const authors = people.filter(p => p.roles.includes('Author'));

  const handleDelete = (thesis: Thesis, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click navigation
    setSelectedThesis(thesis);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedThesis) return;
    try {
      await thesisService.delete(selectedThesis.id);
      // Refresh the search results
      const results = await thesisService.search({
        query: filters.query || undefined,
        authorId: filters.authorId || undefined,
        universityId: filters.universityId || undefined,
        instituteId: filters.instituteId || undefined,
        type: filters.type || undefined,
        language: filters.language || undefined,
        yearFrom: filters.yearFrom ? parseInt(filters.yearFrom) : undefined,
        yearTo: filters.yearTo ? parseInt(filters.yearTo) : undefined,
      });
      setTheses(results);
      setIsDeleteModalOpen(false);
      setSelectedThesis(null);
    } catch (error) {
      console.error('Failed to delete thesis:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete thesis';
      alert(errorMessage);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Thesis Search</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search (Title/No)
                </label>
                <Input
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  placeholder="Search..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <Select
                  value={filters.authorId}
                  onChange={(e) => handleFilterChange('authorId', e.target.value)}
                >
                  <option value="">All Authors</option>
                  {authors.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.firstName} {person.lastName}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  University
                </label>
                <Select
                  value={filters.universityId}
                  onChange={(e) => {
                    handleFilterChange('universityId', e.target.value);
                    handleFilterChange('instituteId', '');
                  }}
                >
                  <option value="">All Universities</option>
                  {universities.map((university) => (
                    <option key={university.id} value={university.id}>
                      {university.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institute
                </label>
                <Select
                  value={filters.instituteId}
                  onChange={(e) => handleFilterChange('instituteId', e.target.value)}
                  disabled={!filters.universityId}
                >
                  <option value="">All Institutes</option>
                  {filteredInstitutes.map((institute) => (
                    <option key={institute.id} value={institute.id}>
                      {institute.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <Select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <option value="">All Types</option>
                  {(['Master', 'Doctorate', 'Specialization in Medicine', 'Proficiency in Art'] as ThesisType[]).map(
                    (type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    )
                  )}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <Select
                  value={filters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                >
                  <option value="">All Languages</option>
                  <option value="English">English</option>
                  <option value="Turkish">Turkish</option>
                  <option value="German">German</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year From
                </label>
                <Input
                  type="number"
                  value={filters.yearFrom}
                  onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
                  placeholder="1900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year To
                </label>
                <Input
                  type="number"
                  value={filters.yearTo}
                  onChange={(e) => handleFilterChange('yearTo', e.target.value)}
                  placeholder={new Date().getFullYear().toString()}
                />
              </div>
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Results ({theses.length})</CardTitle>
                <Button variant="outline" size="sm" onClick={toggleSort}>
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort by Year ({sortOrder === 'desc' ? 'Desc' : 'Asc'})
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">Loading...</div>
              ) : theses.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No theses found</div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>University</TableHead>
                        <TableHead className="w-20">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {theses.map((thesis) => (
                        <TableRow
                          key={thesis.id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => navigate(`/theses/${thesis.id}`)}
                        >
                          <TableCell>{thesis.id}</TableCell>
                          <TableCell className="font-medium">{thesis.title}</TableCell>
                          <TableCell>{getAuthorName(thesis.authorId)}</TableCell>
                          <TableCell>{thesis.year}</TableCell>
                          <TableCell>{thesis.type}</TableCell>
                          <TableCell>{getUniversityName(thesis.universityId)}</TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => handleDelete(thesis, e)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedThesis(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Thesis"
        message={`Are you sure you want to delete thesis "${selectedThesis?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}

