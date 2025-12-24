import { Request, Response } from 'express';
import { personService } from '../services/person.service';
import { asyncHandler } from '../middleware/errorHandler';

export const personController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const people = await personService.getAll();
    res.json({ success: true, data: people });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const person = await personService.getById(id);
    if (!person) {
      return res.status(404).json({ success: false, error: 'Person not found' });
    }
    res.json({ success: true, data: person });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const person = await personService.create(req.body);
    res.status(201).json({ success: true, data: person });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const person = await personService.update(id, req.body);
    if (!person) {
      return res.status(404).json({ success: false, error: 'Person not found' });
    }
    res.json({ success: true, data: person });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await personService.delete(id);
    res.json({ success: true, message: 'Person deleted successfully' });
  }),
};



