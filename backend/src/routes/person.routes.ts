import { Router } from 'express';
import { personController } from '../controllers/person.controller';
import { validate } from '../middleware/validator';
import { createPersonSchema, updatePersonSchema } from '../validators/person.validator';

const router = Router();

router.get('/', personController.getAll);
router.get('/:id', personController.getById);
router.post('/', validate(createPersonSchema), personController.create);
router.put('/:id', validate(updatePersonSchema), personController.update);
router.delete('/:id', personController.delete);

export default router;



