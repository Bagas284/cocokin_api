import { Router } from "express";
import { validate } from '../../../middlewares/validate.js';
import { getProfileByUserId, updateProfileByUserId, updatePhotoByUserId, getPhotoByUserId } from '../controller/profile-controller.js';
import authenticateToken from '../../../middlewares/auth.js';
import { profilePayloadSchema } from '../validator/schema.js';
import uploadPhoto from "../../../middlewares/upload-photo.js";

const router = Router();

router.get('/profile/me', authenticateToken, getProfileByUserId);
router.put('/profile/me', authenticateToken, validate(profilePayloadSchema), updateProfileByUserId);
router.put('/profile/photo/me', authenticateToken, uploadPhoto.single('photo'), updatePhotoByUserId);
router.get('/profile/photo/me', authenticateToken, getPhotoByUserId);

export default router;