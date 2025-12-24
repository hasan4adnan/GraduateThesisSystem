import { Request, Response } from 'express';
import { instituteService } from '../services/institute.service';
import { asyncHandler } from '../middleware/errorHandler';

export const instituteController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const institutes = await instituteService.getAll();
    res.json({ success: true, data: institutes });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const institute = await instituteService.getById(id);
    if (!institute) {
      return res.status(404).json({ success: false, error: 'Institute not found' });
    }
    res.json({ success: true, data: institute });
  }),

  getByUniversityId: asyncHandler(async (req: Request, res: Response) => {
    const universityId = parseInt(req.params.universityId);
    const institutes = await instituteService.getByUniversityId(universityId);
    res.json({ success: true, data: institutes });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const institute = await instituteService.create(req.body);
    res.status(201).json({ success: true, data: institute });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const institute = await instituteService.update(id, req.body);
    if (!institute) {
      return res.status(404).json({ success: false, error: 'Institute not found' });
    }
    res.json({ success: true, data: institute });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await instituteService.delete(id);
    res.json({ success: true, message: 'Institute deleted successfully' });
  }),
};





