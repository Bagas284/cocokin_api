import { Router } from "express";
import { validate } from '../../../middlewares/validate.js';
import { emailPayloadSchema, otpPayloadSchema, passwordPayloadSchema } from "../validator/schema.js";
import { forgotPassword, verifyOTP, resetPassword } from '../controller/password-controller.js';

const router = Router();

router.post('/password/forgot', validate(emailPayloadSchema), forgotPassword);
router.post('/password/verify', validate(otpPayloadSchema), verifyOTP);
router.post('/password/reset', validate(passwordPayloadSchema), resetPassword);

export default router;