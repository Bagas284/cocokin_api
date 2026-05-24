import { Router } from "express";
import { validate } from '../../../middlewares/validate.js';
import { emailPayloadSchema, otpPayloadSchema, passwordPayloadSchema } from "../validator/schema.js";
import { forgotPassword, verifyOTP, resetPassword } from '../controller/password-controller.js';

const router = Router();

router.post('/forgot-password', validate(emailPayloadSchema), forgotPassword);
router.post('/verify-otp', validate(otpPayloadSchema), verifyOTP);
router.post('/reset-password', validate(passwordPayloadSchema), resetPassword);

export default router;