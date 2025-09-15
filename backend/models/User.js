
import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  name: { type: String },
  role: { type: String, default: 'user' }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
