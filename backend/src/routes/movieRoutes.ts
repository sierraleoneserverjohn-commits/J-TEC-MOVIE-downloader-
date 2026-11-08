import { Router } from 'express';
import { getMovies, getMovieById, searchMovies } from '../controllers/movieController.js';

export const movieRoutes = Router();

movieRoutes.get('/movies', getMovies);
movieRoutes.get('/movies/search', searchMovies);
movieRoutes.get('/movies/:id', getMovieById);
