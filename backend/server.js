// src/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payments.js';
import webhookRoutes from './routes/webhook.js';
import transactionRoutes from './routes/transactions.js';

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// connect to MongoDB
connectDB();

//welcome
app.get("/", (req, res) => {
  res.send("✅ Edviron Backend API is running");
});
app.get("/api", (req, res) => {
  res.send("✅ Edviron Backend API is running");
});
// routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);

// webhook is usually called by payment gateway, so keep it at root or /webhook
app.use('/webhook', webhookRoutes);

app.use('/api/transactions', transactionRoutes);

// health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
