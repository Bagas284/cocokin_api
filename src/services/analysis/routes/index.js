import express from 'express';
import {
    getAllAnalysis, getAnalysisById
} from '../controller/analysis-controller.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = express.Router();

router.get('/analysis', authenticateToken, getAllAnalysis);
router.get('/analysis/:id', authenticateToken, getAnalysisById);

export default router;