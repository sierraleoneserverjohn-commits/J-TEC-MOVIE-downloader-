import { Request, Response, NextFunction } from 'express';
import { movieService } from '../services/movieService.js';

export const getMovies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = req.query.category as string | undefined;
    const provider = req.query.provider as string | undefined;
    const movies = await movieService.getMovies(category, provider);

    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (err) {
    next(err);
  }
};

export const getMovieById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const movie = await movieService.getMovieById(id);

    if (!movie) {
      res.status(404).json({
        success: false,
        error: {
          code: 'MOVIE_NOT_FOUND',
          message: `No public archive movie found with id: ${id}`,
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (err) {
    next(err);
  }
};

export const searchMovies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = (req.query.q as string) || '';
    const results = await movieService.searchMovies(q);

    res.status(200).json({
      success: true,
      query: q,
      count: results.length,
      data: results,
    });
  } catch (err) {
    next(err);
  }
};
