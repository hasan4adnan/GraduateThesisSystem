import { Router } from 'express';
import { universityController } from '../controllers/university.controller';
import { validate } from '../middleware/validator';
import { createUniversitySchema, updateUniversitySchema } from '../validators/university.validator';

const router = Router();

router.get('/', universityController.getAll);
router.get('/:id', universityController.getById);
router.post('/', validate(createUniversitySchema), universityController.create);
router.put('/:id', validate(updateUniversitySchema), universityController.update);
router.delete('/:id', universityController.delete);

export default router;





