import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Preflight handling
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing required payment verification details.' });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET || '';

  try {
    // Generate signature locally using Key Secret
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(sign.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Signature is valid! Update Supabase record to 'success'
      const { error: dbError } = await supabase
        .from('donations')
        .update({
          status: 'success',
          payment_id: razorpay_payment_id,
          signature: razorpay_signature
        })
        .eq('order_id', razorpay_order_id);

      if (dbError) {
        console.error('Database update error in verify-payment:', dbError);
        return res.status(500).json({ error: 'Failed to update donation status.' });
      }

      return res.status(200).json({ success: true, message: 'Payment verified successfully.' });
    } else {
      // Signature mismatch
      await supabase
        .from('donations')
        .update({ status: 'failed' })
        .eq('order_id', razorpay_order_id);

      return res.status(400).json({ success: false, error: 'Signature verification failed.' });
    }
  } catch (error: any) {
    console.error('Error verifying signature:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
