import { useEffect, useState } from 'react';
import { type Institute, type University } from '../../types';
import { instituteService, universityService } from '../../services/apiServices';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/ui/Button';
import Modal, { ConfirmModal } from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search } from 'lucide-react';

const instituteSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  universityId: z.string().min(1, 'University is required'),
});

type InstituteFormData = z.infer<typeof instituteSchema>;

export default function Institutes() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);
  const [searchValue, setSearchValue] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InstituteFormData>({
    resolver: zodResolver(instituteSchema),
  });

  const loadData = async () => {
    try {
      const [institutesData, universitiesData] = await Promise.all([
        instituteService.getAll(),
        universityService.getAll(),
      ]);
      setInstitutes(institutesData);
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

  const onSubmit = async (data: InstituteFormData) => {
    try {
      if (selectedInstitute) {
        await instituteService.update(selectedInstitute.id, data);
      } else {
        await instituteService.create(data);
      }
      await loadData();
      setIsModalOpen(false);
      reset();
      setSelectedInstitute(null);
    } catch (error) {
      console.error('Failed to save institute:', error);
      alert('Failed to save institute');
    }
  };

  const handleEdit = (institute: Institute) => {
    setSelectedInstitute(institute);
    reset({
      name: institute.name,
      universityId: institute.universityId,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (institute: Institute) => {
    setSelectedInstitute(institute);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedInstitute) return;
    try {
      await instituteService.delete(selectedInstitute.id);
      await loadData();
      setIsDeleteModalOpen(false);
      setSelectedInstitute(null);
    } catch (error) {
      console.error('Failed to delete institute:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete institute';
      alert(errorMessage);
    }
  };

  const handleNew = () => {
    setSelectedInstitute(null);
    reset();
    setIsModalOpen(true);
  };

  const getUniversityName = (universityId: string) => {
    return universities.find(u => u.id === universityId)?.name || 'Unknown';
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Institutes</h1>
        <Button onClick={handleNew}>Add New</Button>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search institutes..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10"
        />
      </div>

      <DataTable
        data={institutes}
        columns={[
          { key: 'name', header: 'Name' },
          {
            key: 'universityId',
            header: 'University',
            render: (item) => getUniversityName(item.universityId),
          },
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchValue={searchValue}
        searchFields={['name']}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedInstitute(null);
          reset();
        }}
        title={selectedInstitute ? 'Edit Institute' : 'Add New Institute'}
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
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedInstitute(null);
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
          setSelectedInstitute(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Institute"
        message={`Are you sure you want to delete "${selectedInstitute?.name}"?`}
      />
    </div>
  );
}

