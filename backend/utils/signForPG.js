import jwt from 'jsonwebtoken';

export function signPayloadForPG(payload) {
  const secret = process.env.PG_SECRET_KEY;
  if (!secret) throw new Error('PG_SECRET_KEY not set in environment');
  return jwt.sign(payload, secret);
}
