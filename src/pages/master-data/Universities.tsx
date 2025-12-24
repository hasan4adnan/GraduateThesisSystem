import { useEffect, useState } from 'react';
import { type University } from '../../types';
import { universityService } from '../../services/apiServices';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/ui/Button';
import Modal, { ConfirmModal } from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search } from 'lucide-react';

const universitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
});

type UniversityFormData = z.infer<typeof universitySchema>;

export default function Universities() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [searchValue, setSearchValue] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UniversityFormData>({
    resolver: zodResolver(universitySchema),
  });

  const loadUniversities = async () => {
    try {
      const data = await universityService.getAll();
      setUniversities(data);
    } catch (error) {
      console.error('Failed to load universities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUniversities();
  }, []);

  const onSubmit = async (data: UniversityFormData) => {
    try {
      if (selectedUniversity) {
        await universityService.update(selectedUniversity.id, data);
      } else {
        // Check for duplicate name
        const existing = universities.find(u => u.name.toLowerCase() === data.name.toLowerCase());
        if (existing) {
          alert('A university with this name already exists');
          return;
        }
        await universityService.create(data);
      }
      await loadUniversities();
      setIsModalOpen(false);
      reset();
      setSelectedUniversity(null);
    } catch (error) {
      console.error('Failed to save university:', error);
      alert('Failed to save university');
    }
  };

  const handleEdit = (university: University) => {
    setSelectedUniversity(university);
    reset({
      name: university.name,
      country: university.country,
      city: university.city,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (university: University) => {
    setSelectedUniversity(university);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUniversity) return;
    try {
      await universityService.delete(selectedUniversity.id);
      await loadUniversities();
      setIsDeleteModalOpen(false);
      setSelectedUniversity(null);
    } catch (error) {
      console.error('Failed to delete university:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete university';
      alert(errorMessage);
    }
  };

  const handleNew = () => {
    setSelectedUniversity(null);
    reset();
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Universities</h1>
        <Button onClick={handleNew}>Add New</Button>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search universities..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10"
        />
      </div>

      <DataTable
        data={universities}
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'country', header: 'Country' },
          { key: 'city', header: 'City' },
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchValue={searchValue}
        searchFields={['name', 'country', 'city']}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUniversity(null);
          reset();
        }}
        title={selectedUniversity ? 'Edit University' : 'Add New University'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <Input {...register('name')} />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <Input {...register('country')} />
            {errors.country && (
              <p className="text-red-600 text-sm mt-1">{errors.country.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <Input {...register('city')} />
            {errors.city && (
              <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedUniversity(null);
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
          setSelectedUniversity(null);
        }}
        onConfirm={confirmDelete}
        title="Delete University"
        message={`Are you sure you want to delete "${selectedUniversity?.name}"?`}
      />
    </div>
  );
}

