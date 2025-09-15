
import mongoose from 'mongoose';

const { Schema } = mongoose;

const OrderSchema = new Schema({
  school_id: { type: String, required: true },
  trustee_id: { type: String },
  student_info: {
    name: String,
    id: String,
    email: String
  },
  gateway_name: { type: String },
  custom_order_id: { type: String, unique: true, index: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', OrderSchema);
