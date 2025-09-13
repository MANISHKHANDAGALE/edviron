// src/models/WebhookLog.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const WebhookLogSchema = new Schema({
  rawBody: { type: Schema.Types.Mixed },
  headers: { type: Schema.Types.Mixed },
  receivedAt: { type: Date, default: Date.now }
});

export default mongoose.model('WebhookLog', WebhookLogSchema);
