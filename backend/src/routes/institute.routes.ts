import { Router } from 'express';
import { instituteController } from '../controllers/institute.controller';
import { validate } from '../middleware/validator';
import { createInstituteSchema, updateInstituteSchema } from '../validators/institute.validator';

const router = Router();

router.get('/', instituteController.getAll);
router.get('/university/:universityId', instituteController.getByUniversityId);
router.get('/:id', instituteController.getById);
router.post('/', validate(createInstituteSchema), instituteController.create);
router.put('/:id', validate(updateInstituteSchema), instituteController.update);
router.delete('/:id', instituteController.delete);

export default router;





