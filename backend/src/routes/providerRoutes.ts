import { Router } from 'express';
import { getProviders } from '../controllers/providersController.js';

export const providerRoutes = Router();

providerRoutes.get('/providers', getProviders);
