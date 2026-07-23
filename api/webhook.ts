import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to get raw body for signature verification
  },
};

async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks: any[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const signature = req.headers['x-razorpay-signature'] as string;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

  if (!signature) {
    return res.status(400).json({ error: 'Missing webhook signature' });
  }

  try {
    const rawBody = await getRawBody(req);
    const bodyStr = rawBody.toString('utf8');

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(bodyStr)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.warn('Webhook signature mismatch.');
      return res.status(400).json({ error: 'Signature verification failed' });
    }

    const payload = JSON.parse(bodyStr);
    const event = payload.event;

    console.log(`Received Webhook event: ${event}`);

    // Handle successful payment events
    if (event === 'order.paid' || event === 'payment.captured') {
      const orderId = payload.payload.payment?.entity?.order_id || payload.payload.order?.entity?.id;
      const paymentId = payload.payload.payment?.entity?.id;

      if (orderId && paymentId) {
        const { error: dbError } = await supabase
          .from('donations')
          .update({
            status: 'success',
            payment_id: paymentId
          })
          .eq('order_id', orderId);

        if (dbError) {
          console.error('Database update error in webhook:', dbError);
          return res.status(500).json({ error: 'Failed to update record in database' });
        }

        console.log(`Successfully processed webhook for order: ${orderId}`);
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
