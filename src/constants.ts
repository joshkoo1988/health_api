import dotenv from 'dotenv';
dotenv.config();

export const HEALTH_API_KEY = process.env.HEALTH_API_KEY || '';
export const WEB_API_URL = 'https://assessment.ksensetech.com/api';

if (!HEALTH_API_KEY) {
  throw new Error('Missing HEALTH_API_KEY IN .env file');
} 