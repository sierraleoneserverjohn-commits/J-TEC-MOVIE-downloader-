import { Request, Response } from 'express';
import { movieService } from '../services/movieService.js';

export const getProviders = (req: Request, res: Response) => {
  const providers = movieService.getProvidersStatus();
  res.status(200).json({
    success: true,
    data: providers,
  });
};
