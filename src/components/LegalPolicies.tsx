import React from 'react';
import { ArrowLeft, ShieldCheck, FileText, RefreshCw, Mail } from 'lucide-react';

interface LegalPoliciesProps {
  policy: 'terms' | 'privacy' | 'refund' | 'contact';
  onNavigateHome: () => void;
}

const LegalPolicies: React.FC<LegalPoliciesProps> = ({ policy, onNavigateHome }) => {
  return (
    <div className="panel glass" style={{ maxWidth: '840px', margin: '40px auto', padding: '32px' }}>
      <button 
        onClick={onNavigateHome}
        className="writings-nav-link"
        style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </button>

      {policy === 'terms' && (
        <article className="legal-document">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <FileText size={28} color="var(--accent)" />
            <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Terms & Conditions</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>Last Updated: January 2026</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
            <section>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>1. Overview</h2>
              <p>Welcome to sagarthalavar.in ("Website"). These Terms & Conditions govern your use of the mentorship, advisory, resume/portfolio review, and software consulting services provided by Sagar Thalavar ("Service Provider").</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>2. Services Offered</h2>
              <p>Services offered on this platform include 1-on-1 mentorship (Chess teaching and LLM/AI coaching), resume and portfolio reviews, and custom software advisory services. Services are provided virtually via video call, document review, or digital communication.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>3. User Obligations</h2>
              <p>When booking a service, you agree to provide true, accurate, and complete contact details (Name and Email). You are responsible for ensuring your availability at the scheduled session time.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>4. Payments & Pricing</h2>
              <p>All prices are listed in Indian Rupees (INR). Payments are processed securely via Razorpay. Booking requests are confirmed upon successful payment verification.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>5. Governing Law</h2>
              <p>These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka, India.</p>
            </section>
          </div>
        </article>
      )}

      {policy === 'privacy' && (
        <article className="legal-document">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <ShieldCheck size={28} color="var(--accent)" />
            <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Privacy Policy</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>Last Updated: January 2026</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
            <section>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>1. Information We Collect</h2>
              <p>We collect personal information that you voluntarily provide when booking a mentorship session or service, including your Name, Email Address, and optional message/topic details.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>2. Use of Information</h2>
              <p>Your personal details are used solely to facilitate scheduling, deliver the purchased service, send booking confirmations, and communicate session updates.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>3. Payment Security & Card Data</h2>
              <p>All payments are securely processed through Razorpay (RBI-authorized Payment Aggregator). <strong>We do not collect, store, or process full debit/credit card credentials, PINs, CVVs, or banking passwords on our servers.</strong> All payment data handling complies strictly with PCI-DSS and RBI guidelines.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>4. Data Protection & Third Parties</h2>
              <p>We do not sell, rent, or trade your personal information to third parties. Data is shared strictly with infrastructure providers (Vercel, Supabase, Razorpay) necessary to operate the service.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>5. Contact for Privacy Inquiries</h2>
              <p>If you have any questions regarding your privacy or wish to request data deletion, please contact us at <a href="mailto:sagarthalavar509@gmail.com" style={{ color: 'var(--accent)' }}>sagarthalavar509@gmail.com</a>.</p>
            </section>
          </div>
        </article>
      )}

      {policy === 'refund' && (
        <article className="legal-document">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <RefreshCw size={28} color="var(--accent)" />
            <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Refund & Cancellation Policy</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>Last Updated: January 2026</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
            <section>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>1. Session Cancellations & Rescheduling</h2>
              <p>Clients can cancel or reschedule a mentorship or consulting session up to <strong>24 hours prior</strong> to the scheduled start time by emailing sagarthalavar509@gmail.com.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>2. Refund Eligibility</h2>
              <p>A full 100% refund will be issued if:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                <li>A booking is cancelled at least 24 hours in advance.</li>
                <li>The Service Provider is unable to deliver the scheduled session or review due to unforeseen circumstances.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>3. Non-Refundable Circumstances</h2>
              <p>Refunds will not be granted if:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                <li>The service (mentorship session or resume/portfolio review) has already been fully delivered.</li>
                <li>A client fails to attend the scheduled session without providing 24 hours prior written notice.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>4. Refund Processing Timeline</h2>
              <p>Approved refunds will be credited back to the original payment instrument (Bank account, Credit/Debit Card, UPI) within <strong>5 to 7 business days</strong> as per Razorpay payment gateway processing standards.</p>
            </section>
          </div>
        </article>
      )}

      {policy === 'contact' && (
        <article className="legal-document">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Mail size={28} color="var(--accent)" />
            <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Contact Us</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>Get in touch for booking inquiries, mentorship support, or payment assistance.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
            <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--card-bg)' }}>
              <p><strong>Name:</strong> Sagar Thalavar</p>
              <p><strong>Role:</strong> Software Engineer & Tech Mentor</p>
              <p><strong>Email:</strong> <a href="mailto:sagarthalavar509@gmail.com" style={{ color: 'var(--accent)' }}>sagarthalavar509@gmail.com</a></p>
              <p><strong>Location:</strong> Bengaluru, Karnataka, India</p>
              <p><strong>Response Timeline:</strong> Within 24-48 hours</p>
            </div>
          </div>
        </article>
      )}
    </div>
  );
};

export default LegalPolicies;
