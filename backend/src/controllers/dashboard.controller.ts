import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { asyncHandler } from '../middleware/errorHandler';

export const dashboardController = {
  getStats: asyncHandler(async (req: Request, res: Response) => {
    const stats = await dashboardService.getStats();
    res.json({ success: true, data: stats });
  }),
};



