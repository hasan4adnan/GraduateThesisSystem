import { Router } from 'express';
import { thesisController } from '../controllers/thesis.controller';
import { validate } from '../middleware/validator';
import { createThesisSchema, updateThesisSchema } from '../validators/thesis.validator';

const router = Router();

router.get('/', thesisController.getAll);
router.get('/search', thesisController.search);
router.get('/:id', thesisController.getById);
router.post('/', validate(createThesisSchema), thesisController.create);
router.put('/:id', validate(updateThesisSchema), thesisController.update);
router.delete('/:id', thesisController.delete);

export default router;





