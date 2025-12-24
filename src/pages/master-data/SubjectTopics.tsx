import { useEffect, useState } from 'react';
import { type SubjectTopic } from '../../types';
import { subjectTopicService } from '../../services/apiServices';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/ui/Button';
import Modal, { ConfirmModal } from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search } from 'lucide-react';

const subjectTopicSchema = z.object({
  topicName: z.string().min(1, 'Topic name is required'),
});

type SubjectTopicFormData = z.infer<typeof subjectTopicSchema>;

export default function SubjectTopics() {
  const [subjectTopics, setSubjectTopics] = useState<SubjectTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<SubjectTopic | null>(null);
  const [searchValue, setSearchValue] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubjectTopicFormData>({
    resolver: zodResolver(subjectTopicSchema),
  });

  const loadSubjectTopics = async () => {
    try {
      const data = await subjectTopicService.getAll();
      setSubjectTopics(data);
    } catch (error) {
      console.error('Failed to load subject topics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjectTopics();
  }, []);

  const onSubmit = async (data: SubjectTopicFormData) => {
    try {
      if (selectedTopic) {
        await subjectTopicService.update(selectedTopic.id, data);
      } else {
        // Check for duplicate topic name
        const existing = subjectTopics.find(
          st => st.topicName.toLowerCase() === data.topicName.toLowerCase()
        );
        if (existing) {
          alert('A subject topic with this name already exists');
          return;
        }
        await subjectTopicService.create(data);
      }
      await loadSubjectTopics();
      setIsModalOpen(false);
      reset();
      setSelectedTopic(null);
    } catch (error) {
      console.error('Failed to save subject topic:', error);
      alert('Failed to save subject topic');
    }
  };

  const handleEdit = (topic: SubjectTopic) => {
    setSelectedTopic(topic);
    reset({
      topicName: topic.topicName,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (topic: SubjectTopic) => {
    setSelectedTopic(topic);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedTopic) return;
    try {
      await subjectTopicService.delete(selectedTopic.id);
      await loadSubjectTopics();
      setIsDeleteModalOpen(false);
      setSelectedTopic(null);
    } catch (error) {
      console.error('Failed to delete subject topic:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete subject topic';
      alert(errorMessage);
    }
  };

  const handleNew = () => {
    setSelectedTopic(null);
    reset();
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Subject Topics</h1>
        <Button onClick={handleNew}>Add New</Button>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search subject topics..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10"
        />
      </div>

      <DataTable
        data={subjectTopics}
        columns={[{ key: 'topicName', header: 'Topic Name' }]}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchValue={searchValue}
        searchFields={['topicName']}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTopic(null);
          reset();
        }}
        title={selectedTopic ? 'Edit Subject Topic' : 'Add New Subject Topic'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic Name *
            </label>
            <Input {...register('topicName')} />
            {errors.topicName && (
              <p className="text-red-600 text-sm mt-1">{errors.topicName.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedTopic(null);
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
          setSelectedTopic(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Subject Topic"
        message={`Are you sure you want to delete "${selectedTopic?.topicName}"?`}
      />
    </div>
  );
}

