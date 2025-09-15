
import express from 'express';
import WebhookLog from '../models/WebhookLog.js';
import OrderStatus from '../models/OrderStatus.js';
import Order from '../models/Order.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // Log the raw payload for debugging/audit
    await WebhookLog.create({ rawBody: req.body, headers: req.headers });

    const payload = req.body;
    // The sample payload in assessment had shape { status: 200, order_info: { ... } }
    const orderInfo = payload.order_info || payload.data || {};

    // order_id in sample could be collect_id/transaction_id. We'll try to use collect_request_id or order_id
    const externalOrderId = orderInfo.order_id || orderInfo.collect_request_id || orderInfo.collect_id;

    // find status entry by external id
    let statusDoc = null;
    if (externalOrderId) {
      statusDoc = await OrderStatus.findOne({ collect_request_id: externalOrderId });
    }

    // If not found, try matching by collect_id -> maybe the gateway returns custom id
    if (!statusDoc && orderInfo.order_id) {
      // sometimes order_id = custom_order_id
      const order = await Order.findOne({ custom_order_id: orderInfo.order_id });
      if (order) statusDoc = await OrderStatus.findOne({ collect_id: order._id });
    }

    // If still not found, create a new status record (defensive)
    if (!statusDoc) {
      // create a new order and/or status if you want; here we create a status record with minimal linkage
      const order = await Order.create({
        school_id: orderInfo.school_id || 'unknown',
        gateway_name: orderInfo.payment_mode || 'unknown',
        custom_order_id: orderInfo.order_id || `unlinked-${Date.now()}`
      });

      statusDoc = await OrderStatus.create({
        collect_id: order._id,
        collect_request_id: externalOrderId || null,
        order_amount: orderInfo.order_amount || null,
        transaction_amount: orderInfo.transaction_amount || null,
        status: (orderInfo.status || 'UNKNOWN').toUpperCase(),
        payment_mode: orderInfo.payment_mode || null,
        payment_details: orderInfo.payemnt_details || orderInfo.payment_details || null,
        bank_reference: orderInfo.bank_reference || null,
        payment_message: orderInfo.Payment_message || orderInfo.payment_message || null,
        error_message: orderInfo.error_message || null,
        payment_time: orderInfo.payment_time ? new Date(orderInfo.payment_time) : null,
        gateway: orderInfo.gateway || null
      });
    } else {
      // Update the existing status document
      statusDoc.order_amount = orderInfo.order_amount ?? statusDoc.order_amount;
      statusDoc.transaction_amount = orderInfo.transaction_amount ?? statusDoc.transaction_amount;
      statusDoc.payment_mode = orderInfo.payment_mode || statusDoc.payment_mode;
      statusDoc.payment_details = orderInfo.payemnt_details || orderInfo.payment_details || statusDoc.payment_details;
      statusDoc.bank_reference = orderInfo.bank_reference || statusDoc.bank_reference;
      statusDoc.payment_message = orderInfo.Payment_message || orderInfo.payment_message || statusDoc.payment_message;
      statusDoc.status = (orderInfo.status || statusDoc.status || 'PENDING').toUpperCase();
      statusDoc.error_message = orderInfo.error_message || statusDoc.error_message;
      statusDoc.payment_time = orderInfo.payment_time ? new Date(orderInfo.payment_time) : statusDoc.payment_time;
      await statusDoc.save();
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('webhook error', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
