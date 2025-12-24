import { Request, Response } from 'express';
import { universityService } from '../services/university.service';
import { asyncHandler } from '../middleware/errorHandler';

export const universityController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const universities = await universityService.getAll();
    res.json({ success: true, data: universities });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const university = await universityService.getById(id);
    if (!university) {
      return res.status(404).json({ success: false, error: 'University not found' });
    }
    res.json({ success: true, data: university });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const university = await universityService.create(req.body);
    res.status(201).json({ success: true, data: university });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const university = await universityService.update(id, req.body);
    if (!university) {
      return res.status(404).json({ success: false, error: 'University not found' });
    }
    res.json({ success: true, data: university });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await universityService.delete(id);
    res.json({ success: true, message: 'University deleted successfully' });
  }),
};





