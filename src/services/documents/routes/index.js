import express from 'express';
import {
    addDocument, getAllDocument,
} from '../controller/document-controller.js';
import upload from '../../../middlewares/upload.js';

const router = express.Router();

router.post('/documents', upload.single('file'), addDocument);
router.get('/documents', getAllDocument);

export default router;