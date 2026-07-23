import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

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

  const { amount, currency = 'INR', name, email, message, service_type, contact_info, anonymous } = req.body;

  // Amount validation (INR limit 10 to 5000)
  if (!amount || isNaN(amount) || amount < 10 || amount > 5000) {
    return res.status(400).json({ error: 'Invalid amount. Minimum is ₹10 and maximum is ₹5,000.' });
  }

  try {
    // Create order in Razorpay (amount in paise)
    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save initial record in Supabase
    const { error: dbError } = await supabase
      .from('donations')
      .insert([
        {
          order_id: order.id,
          amount: Number(amount),
          currency,
          status: 'created',
          name: name || null,
          email: email || null,
          message: message || null,
          service_type: service_type || 'donation',
          contact_info: contact_info || null,
          anonymous: !!anonymous
        }
      ]);

    if (dbError) {
      console.error('Database error in create-order:', dbError);
      return res.status(500).json({ error: 'Database record creation failed.' });
    }

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('Error creating Razorpay order:', error);
    return res.status(500).json({ error: errMsg });
  }
}
