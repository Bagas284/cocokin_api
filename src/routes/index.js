import { Router } from 'express';
import documents from '../services/documents/routes/index.js';

const router = Router();

router.use('/', documents);

export default router