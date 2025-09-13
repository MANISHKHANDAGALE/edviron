// src/controllers/transactionController.js
import Order from '../models/Order.js';
import OrderStatus from '../models/OrderStatus.js';

/**
 * GET /transactions
 * Query params: page, limit, sort, order, status, school_id
 */
export async function getTransactions(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const sortField = req.query.sort || 'payment_time';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;

    // optional filters
    const match = {};
    if (req.query.status) match['orderStatus.status'] = req.query.status.toUpperCase();
    if (req.query.school_id) match['order.school_id'] = String(req.query.school_id);

    const pipeline = [
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'orderStatus'
        }
      },
      { $unwind: { path: '$orderStatus', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          collect_id: '$_id',
          school_id: '$school_id',
          gateway: '$orderStatus.gateway',
          order_amount: '$orderStatus.order_amount',
          transaction_amount: '$orderStatus.transaction_amount',
          status: '$orderStatus.status',
          custom_order_id: '$custom_order_id',
          payment_time: '$orderStatus.payment_time'
        }
      },
      { $match: match },
      { $sort: { [sortField]: sortOrder } },
      { $skip: skip },
      { $limit: limit }
    ];

    const results = await Order.aggregate(pipeline);
    return res.json({ page, limit, results });
  } catch (err) {
    console.error('getTransactions error', err);
    return res.status(500).json({ message: 'Failed to fetch transactions' });
  }
}

// ✅ Transactions by school
export async function getTransactionsBySchool(req, res) {
  try {
    const schoolId = req.params.schoolId;
    const results = await Order.aggregate([
      { $match: { school_id: schoolId } },
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'orderStatus'
        }
      },
      { $unwind: { path: '$orderStatus', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          collect_id: '$_id',
          school_id: '$school_id',
          gateway: '$orderStatus.gateway',
          order_amount: '$orderStatus.order_amount',
          transaction_amount: '$orderStatus.transaction_amount',
          status: '$orderStatus.status',
          custom_order_id: '$custom_order_id',
          payment_time: '$orderStatus.payment_time'
        }
      }
    ]);
    return res.json({ results });
  } catch (err) {
    console.error('getTransactionsBySchool error', err);
    return res.status(500).json({ message: 'Failed to fetch transactions by school' });
  }
}

// ✅ Single transaction status
export async function getTransactionStatus(req, res) {
  try {
    const customOrderId = req.params.custom_order_id;
    if (!customOrderId) {
      return res.status(400).json({ message: 'custom_order_id required' });
    }

    const order = await Order.findOne({ custom_order_id: customOrderId });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const status = await OrderStatus.findOne({ collect_id: order._id });
    return res.json({ custom_order_id: customOrderId, status });
  } catch (err) {
    console.error('getTransactionStatus error', err);
    return res.status(500).json({ message: 'Failed to fetch transaction status' });
  }
}
