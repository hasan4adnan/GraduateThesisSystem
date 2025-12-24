import { useEffect, useState } from 'react';
import { type Person, type PersonRole, type University } from '../../types';
import { personService, universityService } from '../../services/apiServices';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/ui/Button';
import Modal, { ConfirmModal } from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search } from 'lucide-react';

const personSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  roles: z.array(z.enum(['Author', 'Supervisor', 'Co-supervisor'])).min(1, 'At least one role is required'),
  affiliation: z.string().optional().nullable(),
});

type PersonFormData = z.infer<typeof personSchema>;

export default function People() {
  const [people, setPeople] = useState<Person[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [searchValue, setSearchValue] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PersonFormData>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      roles: [],
    },
  });

  const selectedRoles = watch('roles') || [];

  const toggleRole = (role: PersonRole) => {
    const currentRoles = selectedRoles;
    if (currentRoles.includes(role)) {
      setValue('roles', currentRoles.filter(r => r !== role));
    } else {
      setValue('roles', [...currentRoles, role]);
    }
  };

  const loadData = async () => {
    try {
      const [peopleData, universitiesData] = await Promise.all([
        personService.getAll(),
        universityService.getAll(),
      ]);
      setPeople(peopleData);
      setUniversities(universitiesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSubmit = async (data: PersonFormData) => {
    try {
      // Convert empty string to null for affiliation
      const personData = {
        ...data,
        affiliation: data.affiliation && data.affiliation.trim() !== '' ? data.affiliation : null,
      };

      if (selectedPerson) {
        await personService.update(selectedPerson.id, personData);
      } else {
        // Check for duplicate email
        const existing = people.find(p => p.email.toLowerCase() === data.email.toLowerCase());
        if (existing) {
          alert('A person with this email already exists');
          return;
        }
        await personService.create(personData);
      }
      await loadData();
      setIsModalOpen(false);
      reset();
      setSelectedPerson(null);
    } catch (error) {
      console.error('Failed to save person:', error);
      alert('Failed to save person');
    }
  };

  const handleEdit = (person: Person) => {
    setSelectedPerson(person);
    reset({
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email,
      roles: person.roles,
      affiliation: person.affiliation || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (person: Person) => {
    setSelectedPerson(person);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPerson) return;
    try {
      await personService.delete(selectedPerson.id);
      await loadData();
      setIsDeleteModalOpen(false);
      setSelectedPerson(null);
    } catch (error) {
      console.error('Failed to delete person:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete person';
      alert(errorMessage);
    }
  };

  const handleNew = () => {
    setSelectedPerson(null);
    reset({ roles: [], affiliation: '' });
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">People</h1>
        <Button onClick={handleNew}>Add New</Button>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search people..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10"
        />
      </div>

      <DataTable
        data={people}
        columns={[
          { key: 'firstName', header: 'First Name' },
          { key: 'lastName', header: 'Last Name' },
          { key: 'email', header: 'Email' },
          {
            key: 'affiliation',
            header: 'Affiliation',
            render: (item) => item.affiliation || 'N/A',
          },
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchValue={searchValue}
        searchFields={['firstName', 'lastName', 'email']}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPerson(null);
          reset();
        }}
        title={selectedPerson ? 'Edit Person' : 'Add New Person'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <Input {...register('firstName')} />
            {errors.firstName && (
              <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <Input {...register('lastName')} />
            {errors.lastName && (
              <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <Input type="email" {...register('email')} />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Affiliation
            </label>
            <Select {...register('affiliation')}>
              <option value="">Select a university (optional)</option>
              {universities.map((university) => (
                <option key={university.id} value={university.name}>
                  {university.name}
                </option>
              ))}
            </Select>
            {errors.affiliation && (
              <p className="text-red-600 text-sm mt-1">{errors.affiliation.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Roles *
            </label>
            <div className="space-y-2">
              {(['Author', 'Supervisor', 'Co-supervisor'] as PersonRole[]).map((role) => (
                <label key={role} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role)}
                    onChange={() => toggleRole(role)}
                    className="rounded border-gray-300"
                  />
                  <span>{role}</span>
                </label>
              ))}
            </div>
            {errors.roles && (
              <p className="text-red-600 text-sm mt-1">{errors.roles.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedPerson(null);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPerson(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Person"
        message={`Are you sure you want to delete "${selectedPerson?.firstName} ${selectedPerson?.lastName}"?`}
      />
    </div>
  );
}

