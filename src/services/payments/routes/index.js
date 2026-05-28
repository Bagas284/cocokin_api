import { Router } from "express";
import authenticateToken from '../../../middlewares/auth.js';
import { createPayment, paymentSuccess } from '../controller/payment-controller.js';

const router = Router();

router.post('/payments', authenticateToken, createPayment);
router.put('/payments/success', authenticateToken, paymentSuccess);

export default router;