// Vercel Serverless Function: /api/admin-auth
// Server-side verification using environment variables

const crypto = require('crypto');

const SALT = 'eb_wealth_secure_salt_v1';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Ebwealth';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Bettertimenow2026';

// In-memory rate limiting map per IP address
const attemptsMap = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

export default async function handler(req, res) {
  // Enforce HTTPS and POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const record = attemptsMap.get(clientIp) || { count: 0, lockoutUntil: 0 };
  if (record.lockoutUntil > now) {
    const waitSec = Math.ceil((record.lockoutUntil - now) / 1000);
    return res.status(429).json({ error: `Too many failed attempts. Account locked. Try again in ${waitSec}s.` });
  }

  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required.' });
  }

  const isValidUser = username.trim().toLowerCase() === ADMIN_USERNAME.trim().toLowerCase();
  const isValidPass = password === ADMIN_PASSWORD;

  if (isValidUser && isValidPass) {
    attemptsMap.delete(clientIp);
    const token = crypto.randomBytes(32).toString('hex');
    res.setHeader('Set-Cookie', `eb_admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=7200`);
    return res.status(200).json({
      success: true,
      token: token,
      message: 'Admin authentication successful'
    });
  } else {
    record.count += 1;
    if (record.count >= MAX_ATTEMPTS) {
      record.lockoutUntil = now + LOCKOUT_MS;
    }
    attemptsMap.set(clientIp, record);
    return res.status(401).json({ error: 'Invalid administrator credentials. Access denied.' });
  }
}
