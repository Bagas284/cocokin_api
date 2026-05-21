import express from 'express';
import {
    addDocument, getAllDocument,
} from '../controller/document-controller.js';
import uploadDocument from '../../../middlewares/upload-document.js';
import authenticateToken from '../../../middlewares/auth.js';
import { validate } from '../../../middlewares/validate.js';
import { documentPayloadSchema } from '../validator/schema.js';

const router = express.Router();

router.post('/documents', authenticateToken, uploadDocument.single('file'), validate(documentPayloadSchema), addDocument);
router.get('/documents', authenticateToken, getAllDocument);

export default router;