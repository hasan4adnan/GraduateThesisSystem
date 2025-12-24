import { Request, Response } from 'express';
import { subjectTopicService } from '../services/subjectTopic.service';
import { asyncHandler } from '../middleware/errorHandler';

export const subjectTopicController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const topics = await subjectTopicService.getAll();
    res.json({ success: true, data: topics });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const topic = await subjectTopicService.getById(id);
    if (!topic) {
      return res.status(404).json({ success: false, error: 'Subject topic not found' });
    }
    res.json({ success: true, data: topic });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const topic = await subjectTopicService.create(req.body);
    res.status(201).json({ success: true, data: topic });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const topic = await subjectTopicService.update(id, req.body);
    if (!topic) {
      return res.status(404).json({ success: false, error: 'Subject topic not found' });
    }
    res.json({ success: true, data: topic });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await subjectTopicService.delete(id);
    res.json({ success: true, message: 'Subject topic deleted successfully' });
  }),
};



