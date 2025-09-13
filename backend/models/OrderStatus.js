// src/models/OrderStatus.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const OrderStatusSchema = new Schema({
  collect_id: { type: Schema.Types.ObjectId, ref: 'Order', index: true },
  collect_request_id: { type: String, index: true }, // external PG collect id
  order_amount: { type: Number },
  transaction_amount: { type: Number },
  payment_mode: { type: String },
  payment_details: { type: String },
  bank_reference: { type: String },
  payment_message: { type: String },
  status: { type: String, default: 'PENDING' },
  error_message: { type: String },
  payment_time: { type: Date },
  gateway: { type: String }
}, { timestamps: true });

export default mongoose.model('OrderStatus', OrderStatusSchema);
