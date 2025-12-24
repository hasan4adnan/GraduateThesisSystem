import { Request, Response } from 'express';
import { thesisService } from '../services/thesis.service';
import { asyncHandler } from '../middleware/errorHandler';

export const thesisController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const theses = await thesisService.getAll();
    res.json({ success: true, data: theses });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const thesis = await thesisService.getById(id);
    if (!thesis) {
      return res.status(404).json({ success: false, error: 'Thesis not found' });
    }

    // Get related data
    const [supervisors, subjectTopics, keywords] = await Promise.all([
      thesisService.getSupervisors(id),
      thesisService.getSubjectTopics(id),
      thesisService.getKeywords(id),
    ]);

    const keywordsArray = Array.isArray(keywords) ? keywords : [];
    res.json({
      success: true,
      data: {
        ...thesis,
        supervisors,
        subjectTopics,
        keywords: keywordsArray.map((k: any) => k.word),
      },
    });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const thesis = await thesisService.create(req.body);
    res.status(201).json({ success: true, data: thesis });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const thesis = await thesisService.update(id, req.body);
    if (!thesis) {
      return res.status(404).json({ success: false, error: 'Thesis not found' });
    }
    res.json({ success: true, data: thesis });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await thesisService.delete(id);
    res.json({ success: true, message: 'Thesis deleted successfully' });
  }),

  search: asyncHandler(async (req: Request, res: Response) => {
    const filters: any = {};
    
    if (req.query.query) filters.query = req.query.query as string;
    if (req.query.author_id) filters.author_id = parseInt(req.query.author_id as string);
    if (req.query.university_id) filters.university_id = parseInt(req.query.university_id as string);
    if (req.query.institute_id) filters.institute_id = parseInt(req.query.institute_id as string);
    if (req.query.type) filters.type = req.query.type as string;
    if (req.query.language) filters.language = req.query.language as string;
    if (req.query.year_from) filters.year_from = parseInt(req.query.year_from as string);
    if (req.query.year_to) filters.year_to = parseInt(req.query.year_to as string);

    const results = await thesisService.search(filters);
    res.json({ success: true, data: results });
  }),
};

