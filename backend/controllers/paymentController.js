// src/controllers/paymentController.js
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Order from '../models/Order.js';
import OrderStatus from '../models/OrderStatus.js';
import { signPayloadForPG } from '../utils/signForPG.js';

// ✅ Create Payment
export async function createPayment(req, res) {
  try {
    const { amount, callback_url, trustee_id, student_info } = req.body;
    if (!amount || !callback_url) {
      return res.status(400).json({ message: 'amount and callback_url are required' });
    }

    const school_id = process.env.SCHOOL_ID;

    // Create internal order
    const custom_order_id = `ORD-${uuidv4()}`;
    const order = await Order.create({
      school_id,
      trustee_id: trustee_id || null,
      student_info: student_info || {},
      gateway_name: 'EDVIRON',
      custom_order_id
    });

    // Generate sign
    const payload = { 
      school_id: String(school_id), 
      amount: String(amount), 
      callback_url: String(callback_url) 
    };
    const sign = signPayloadForPG(payload);

    // Call PG API
    const pgResponse = await axios.post(
      process.env.PG_CREATE_COLLECT_URL,
      {
        school_id,
        amount: String(amount),
        callback_url,
        sign
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PG_API_KEY}`
        }
      }
    );

    const data = pgResponse.data || {};
    const collectRequestId = data.collect_request_id || data.collectRequestId || null;
    const collectRequestUrl = data.collect_request_url || data.collectRequestUrl || data.Collect_request_url || null;

    // Save order status
    await OrderStatus.create({
      collect_id: order._id,
      collect_request_id: collectRequestId,
      order_amount: Number(amount),
      status: 'PENDING',
      gateway: 'EDVIRON'
    });

    return res.json({
      message: 'Payment created',
      custom_order_id,
      collect_request_id: collectRequestId,
      payment_url: collectRequestUrl
    });
  } catch (err) {
    console.error('createPayment error:', err?.response?.data || err.message || err);
    return res.status(500).json({ 
      message: 'Failed to create payment', 
      error: err?.message || err 
    });
  }
}

// ✅ Check Payment Status
export async function checkPaymentStatus(req, res) {
  try {
    const { collect_request_id } = req.params;
    if (!collect_request_id) {
      return res.status(400).json({ message: 'collect_request_id required' });
    }

    const payload = {
      school_id: process.env.SCHOOL_ID,
      collect_request_id
    };
    const sign = signPayloadForPG(payload);

    const pgResponse = await axios.get(
      `${process.env.PG_BASE_URL}/collect-request/${collect_request_id}?school_id=${payload.school_id}&sign=${sign}`,
      {
        headers: { 'Authorization': `Bearer ${process.env.PG_API_KEY}` }
      }
    );

    return res.json(pgResponse.data);
  } catch (err) {
    console.error('checkPaymentStatus error:', err?.response?.data || err.message || err);
    return res.status(500).json({ 
      message: 'Failed to check payment status', 
      error: err?.message || err 
    });
  }
}
