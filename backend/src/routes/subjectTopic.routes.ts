import { Router } from 'express';
import { subjectTopicController } from '../controllers/subjectTopic.controller';
import { validate } from '../middleware/validator';
import { createSubjectTopicSchema, updateSubjectTopicSchema } from '../validators/subjectTopic.validator';

const router = Router();

router.get('/', subjectTopicController.getAll);
router.get('/:id', subjectTopicController.getById);
router.post('/', validate(createSubjectTopicSchema), subjectTopicController.create);
router.put('/:id', validate(updateSubjectTopicSchema), subjectTopicController.update);
router.delete('/:id', subjectTopicController.delete);

export default router;





