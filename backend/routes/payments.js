import express from 'express';
import auth from '../middlewares/auth.js';
import { createPayment } from '../controllers/paymentController.js';
import { checkPaymentStatus } from '../controllers/paymentController.js';

const router = express.Router();

// create payment (protected)
router.post('/create-payment', auth, createPayment);

// check payment status (protected)
router.get('/status/:collect_request_id', auth, checkPaymentStatus);

export default router;
