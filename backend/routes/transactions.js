import express from 'express';
import auth from '../middlewares/auth.js';
import { getTransactions, getTransactionsBySchool, getTransactionStatus } from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', auth, getTransactions);
router.get('/school/:schoolId', auth, getTransactionsBySchool);
router.get('/status/:custom_order_id', auth, getTransactionStatus);

export default router;
