import React, { useState } from 'react';
import { Gamepad2, Check, Loader2, HelpCircle, UserCheck, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if ('Razorpay' in window) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface ServiceTier {
  id: string;
  title: string;
  duration: string;
  price: number;
  description: string;
  deliverables: string[];
}

const services: ServiceTier[] = [
  {
    id: 'debugging',
    title: 'Project Debugging',
    duration: '45 Minutes',
    price: 499,
    description: 'Debug your software or AI project together in a live one-on-one session. Understand the root cause of issues instead of just fixing symptoms.',
    deliverables: [
      'Live debugging session',
      'Root cause analysis',
      'Best practices guidance',
      'Unlimited questions during session'
    ]
  },
  {
    id: 'review',
    title: 'Portfolio & Career Review',
    duration: '30 Minutes',
    price: 299,
    description: 'Receive practical feedback on your GitHub, portfolio, LinkedIn profile, and resume with actionable improvements.',
    deliverables: [
      'Honest feedback on GitHub & Resume',
      'Actionable improvement roadmap',
      'Project ideas & suggestions',
      'Career guidance'
    ]
  },
  {
    id: 'consultation',
    title: 'Technical Consultation',
    duration: '60 Minutes',
    price: 699,
    description: 'Discuss software architecture, APIs, backend planning, startup MVPs, databases, or technical decisions.',
    deliverables: [
      'Technical architecture guidance',
      'API & DB planning review',
      'Practical recommendations'
    ]
  }
];

const Playground: React.FC = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('debugging');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Accordion toggle states
  const [openWhy, setOpenWhy] = useState<boolean>(false);
  const [openFit, setOpenFit] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<boolean>(false);

  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];

  const handleCardClick = (id: string) => {
    setSelectedServiceId(id);
    const formEl = document.getElementById('booking-form-section');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (!email) {
      setPaymentError('Email address is required.');
      return;
    }

    const finalAmount = selectedService.price;

    try {
      setLoading(true);
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay checkout script. Check connection.');
      }

      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          name: name || 'Client',
          email,
          message,
          service_type: selectedService.title,
          contact_info: email,
          anonymous: false
        })
      });

      if (!response.ok) {
        let errText = 'Failed to initiate order.';
        try {
          const errData = await response.json();
          errText = errData.error || errText;
        } catch {
          errText = `Server error (${response.status}). Please verify environment variables are configured on Vercel.`;
        }
        throw new Error(errText);
      }

      const orderData = await response.json();

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Sagar Thalavar',
        description: selectedService.title,
        order_id: orderData.order_id,
        config_id: 'config_TIwloXPRqknnLZ',
        config: {
          display: {
            blocks: {
              methods: {
                name: 'Payment Options',
                instruments: [
                  { method: 'upi' },
                  { method: 'card' },
                  { method: 'netbanking' }
                ]
              }
            },
            sequence: ['block.methods'],
            preferences: {
              show_default_blocks: false
            }
          }
        },
        handler: async function (paymentRes: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          try {
            setLoading(true);
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: paymentRes.razorpay_order_id,
                razorpay_payment_id: paymentRes.razorpay_payment_id,
                razorpay_signature: paymentRes.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setTransactionId(paymentRes.razorpay_payment_id);
              setPaymentSuccess(true);
            } else {
              setPaymentError(verifyData.error || 'Signature verification failed.');
            }
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setPaymentError(msg);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: name,
          email: email
        },
        theme: {
          color: '#FFE066'
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const RzpConstructor = (window as unknown as { Razorpay: new (opts: unknown) => { open: () => void } }).Razorpay;
      const rzp = new RzpConstructor(options);
      rzp.open();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setPaymentError(msg);
      setLoading(false);
    }
  };

  return (
    <section className="panel playground-panel glass" style={{ maxWidth: '920px', margin: '32px auto', padding: '32px' }}>
      <style>{`
        .services-grid-v3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 20px 0 32px 0;
        }
        .service-card-v3 {
          padding: 24px;
          border-radius: 20px;
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          min-height: 320px;
          position: relative;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: left;
        }
        .service-card-v3:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
        .service-card-v3.selected {
          border: 2px solid var(--accent);
          background: var(--accent-light);
        }
        [data-theme='light'] .service-card-v3.selected { border-color: #111; box-shadow: 0 0 16px rgba(17, 17, 17, 0.1); }
        [data-theme='dark'] .service-card-v3.selected { border-color: #f9fafb; box-shadow: 0 0 16px rgba(249, 250, 251, 0.15); }
        [data-theme='colorful'] .service-card-v3.selected { border-color: #2B2420; box-shadow: 0 0 16px rgba(43, 36, 32, 0.15); }

        .service-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 4px;
        }

        .service-card-v3 h3 {
          font-family: var(--font-heading);
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .duration-pill {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          padding: 3px 8px;
          border-radius: 6px;
          background: var(--card-border);
          white-space: nowrap;
        }

        .price-text-large {
          font-weight: 800;
          font-size: 1.8rem;
          color: var(--text-primary);
          margin: 8px 0 12px 0;
          line-height: 1;
        }

        .deliverables-list {
          list-style: none;
          padding: 0;
          margin: 16px 0 0 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .deliverable-item {
          font-size: 0.84rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .deliverable-item svg {
          color: #10B981;
          flex-shrink: 0;
        }

        .accordion-section {
          border-radius: 16px;
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          margin-top: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .accordion-header {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          user-select: none;
        }

        .accordion-header h3 {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .accordion-body {
          padding: 0 24px 24px 24px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .info-item {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .fit-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .faq-item {
          padding: 14px 18px;
          border-radius: 12px;
          border: 1px solid var(--card-border);
          background: var(--card-bg);
        }

        .faq-question {
          font-weight: 700;
          font-size: 0.92rem;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .faq-answer {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        .booking-section-card {
          padding: 28px;
          border-radius: 20px;
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          margin-bottom: 24px;
        }

        .scannable-selected-box {
          padding: 14px 20px;
          border-radius: 12px;
          background: var(--accent-light);
          border: 1.5px solid var(--accent-border);
          display: flex;
          flex-direction: column;
          gap: 2px;
          width: fit-content;
        }

        .scannable-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .scannable-meta {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .booking-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 20px;
        }

        .booking-form .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .booking-form label {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .booking-form input,
        .booking-form textarea {
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          color: var(--text-primary);
          font-family: var(--font-body);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .booking-form input:focus,
        .booking-form textarea:focus {
          border-color: var(--text-primary);
          box-shadow: 0 0 0 3px var(--card-border);
        }

        .booking-submit-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 99px;
          border: 1px solid var(--accent-border);
          background: var(--accent);
          color: var(--bg);
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          width: fit-content;
          margin-top: 8px;
        }
        [data-theme='colorful'] .booking-submit-btn {
          background: #2B2420;
          color: #F6C88A;
          border-color: #2B2420;
        }

        .booking-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          opacity: 0.93;
        }

        .booking-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .booking-success-view {
          text-align: center;
          padding: 48px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .success-check-circle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.1);
          color: #10B981;
          margin-bottom: 8px;
        }

        .form-error {
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          color: #ef4444;
          font-size: 0.88rem;
          text-align: left;
        }
      `}</style>

      {/* Header Section */}
      <div className="section-header">
        <div className="section-title-group">
          <Gamepad2 className="section-icon" size={24} />
          <h2>Book a 1-on-1 Session with Sagar</h2>
        </div>
        <p className="section-subtitle" style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          AI • Software Development • Career Guidance
        </p>
        <p className="section-subtitle">
          Build better software, get unstuck on your projects, improve your portfolio, or receive personalized technical guidance through practical one-on-one sessions.
        </p>
      </div>

      {/* 1. Service Cards Selector */}
      <div className="services-grid-v3">
        {services.map((service) => {
          const isSelected = service.id === selectedServiceId;
          return (
            <div
              key={service.id}
              className={`service-card-v3 ${isSelected ? 'selected' : ''}`}
              onClick={() => handleCardClick(service.id)}
            >
              <div>
                <div className="service-card-header">
                  <h3>{service.title}</h3>
                  <span className="duration-pill">{service.duration}</span>
                </div>
                <div className="price-text-large">₹{service.price}</div>
                <p className="card-desc" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  {service.description}
                </p>
              </div>

              <ul className="deliverables-list">
                {service.deliverables.map((item, idx) => (
                  <li key={idx} className="deliverable-item">
                    <Check size={14} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* 2. Book Your Session Form */}
      <div id="booking-form-section" className="booking-section-card">
        <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Book Your Session
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
          Fill in your details below to schedule your live one-on-one session.
        </p>

        {!paymentSuccess ? (
          <form onSubmit={handlePayment} className="booking-form">
            {paymentError && (
              <div className="form-error">
                {paymentError}
              </div>
            )}

            <div className="form-group">
              <label>Selected Service</label>
              <div className="scannable-selected-box">
                <div className="scannable-title">{selectedService.title}</div>
                <div className="scannable-meta">{selectedService.duration} • ₹{selectedService.price}</div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="booking-name">Your Name</label>
              <input 
                id="booking-name"
                type="text" 
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="booking-email">Email Address</label>
              <input 
                id="booking-email"
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <small style={{ textAlign: 'left', color: 'var(--text-muted)' }}>Google Meet invite and session confirmation will be sent here.</small>
            </div>

            <div className="form-group">
              <label htmlFor="booking-message">Brief Description of your Request</label>
              <textarea 
                id="booking-message"
                rows={4}
                placeholder="Describe what project, bugs, portfolio, or technical topic you would like to cover..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="booking-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Initiating Checkout...</span>
                </>
              ) : (
                <span>Book Session →</span>
              )}
            </button>
          </form>
        ) : (
          /* Success View */
          <div className="booking-success-view">
            <div className="success-check-circle">
              <Check size={36} />
            </div>
            <h3>Session Confirmed!</h3>
            <p style={{ maxWidth: '440px', margin: '0 auto', lineHeight: 1.5 }}>
              Thank you for booking **{selectedService.title}**. 
              A Google Meet scheduling query has been sent to **{email}**.
            </p>
            <small style={{ color: 'var(--text-muted)' }}>Transaction Reference: {transactionId}</small>
            <button 
              type="button"
              className="booking-submit-btn" 
              onClick={() => {
                setPaymentSuccess(false);
                setName('');
                setEmail('');
                setMessage('');
              }}
              style={{ marginTop: '16px' }}
            >
              Book Another Session
            </button>
          </div>
        )}
      </div>

      {/* 3. Why Work With Me (Collapsible Accordion) */}
      <div className="accordion-section">
        <div className="accordion-header" onClick={() => setOpenWhy(!openWhy)}>
          <h3>
            <Sparkles size={18} />
            <span>Why Work With Me</span>
          </h3>
          {openWhy ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        {openWhy && (
          <div className="accordion-body">
            <div className="info-grid">
              <div className="info-item">• Practical hands-on guidance</div>
              <div className="info-item">• Personalized one-on-one sessions</div>
              <div className="info-item">• Learn by solving real problems</div>
              <div className="info-item">• Student-friendly pricing</div>
              <div className="info-item">• Experience building multiple software & AI projects</div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Audience Fit (Collapsible Accordion) */}
      <div className="accordion-section">
        <div className="accordion-header" onClick={() => setOpenFit(!openFit)}>
          <h3>
            <UserCheck size={18} />
            <span>Audience Fit (Who Is This For / Not For)</span>
          </h3>
          {openFit ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        {openFit && (
          <div className="accordion-body">
            <div className="fit-grid">
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '10px' }}>Suitable For</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="info-item">✓ College students</div>
                  <div className="info-item">✓ Beginner developers</div>
                  <div className="info-item">✓ Developers learning AI</div>
                  <div className="info-item">✓ Hackathon participants</div>
                  <div className="info-item">✓ Developers stuck on projects</div>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '10px' }}>Not Suitable If</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="info-item">✕ You want someone to complete your assignment</div>
                  <div className="info-item">✕ You expect guaranteed job placement</div>
                  <div className="info-item">✕ You want complete projects built for you</div>
                  <div className="info-item">✕ You are looking for free consulting</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. FAQ Accordion */}
      <div className="accordion-section">
        <div className="accordion-header" onClick={() => setOpenFaq(!openFaq)}>
          <h3>
            <HelpCircle size={18} />
            <span>Frequently Asked Questions</span>
          </h3>
          {openFaq ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        {openFaq && (
          <div className="accordion-body">
            <div className="faq-grid">
              <div className="faq-item">
                <div className="faq-question">Do I need coding experience?</div>
                <p className="faq-answer">No. Beginners are welcome.</p>
              </div>
              <div className="faq-item">
                <div className="faq-question">How are sessions conducted?</div>
                <p className="faq-answer">Sessions are conducted live via Google Meet.</p>
              </div>
              <div className="faq-item">
                <div className="faq-question">Can I record the session?</div>
                <p className="faq-answer">Yes, you are welcome to record for your personal reference.</p>
              </div>
              <div className="faq-item">
                <div className="faq-question">Will I receive notes?</div>
                <p className="faq-answer">Yes, session notes and relevant code references will be shared afterwards.</p>
              </div>
              <div className="faq-item">
                <div className="faq-question">What if my issue is not fully solved?</div>
                <p className="faq-answer">I will provide clear guidance, diagnostic steps, and next steps even if the entire problem requires further steps beyond the session duration.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Playground;
