import { Router } from "express";
import authenticateToken from '../../../middlewares/auth.js';
import { createPdf } from '../controller/exportpdf-controller.js';

const router = Router();

router.get('/export/:id', authenticateToken, createPdf);

export default router;