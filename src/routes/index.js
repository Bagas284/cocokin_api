import { Router } from 'express';
import documents from '../services/documents/routes/index.js';
import users from '../services/users/routes/index.js';
import authentications from '../services/authentications/routes/index.js';
import profileUser from '../services/profiles/routes/index.js';
import resetPassword from '../services/password/routes/index.js';
import analysis from '../services/analysis/routes/index.js';
import payments from '../services/payments/routes/index.js';
import exportPdf from '../services/exportPdf/routes/index.js';

const router = Router();

router.use('/', documents);
router.use('/', users);
router.use('/', authentications);
router.use('/', profileUser);
router.use('/', resetPassword);
router.use('/', analysis);
router.use('/', payments);
router.use('/', exportPdf);

export default router