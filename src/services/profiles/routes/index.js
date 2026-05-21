import { Router } from "express";
import { validate } from '../../../middlewares/validate.js';
import { getProfileByUserId, updateProfileByUserId, updatePhotoByUserId, getPhotoByUserId } from '../controller/profile-controller.js';
import authenticateToken from '../../../middlewares/auth.js';
import { profilePayloadSchema } from '../validator/schema.js';
import uploadPhoto from "../../../middlewares/upload-photo.js";

const router = Router();

router.get('/profile/:id', authenticateToken, getProfileByUserId);
router.put('/profile/:id', authenticateToken, validate(profilePayloadSchema), updateProfileByUserId);
router.put('/profile/photo/:id', authenticateToken, uploadPhoto.single('photo'), updatePhotoByUserId);
router.get('/profile/photo/:id', authenticateToken, getPhotoByUserId);

export default router;