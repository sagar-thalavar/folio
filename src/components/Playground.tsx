import React, { useState } from 'react';
import { Gamepad2, CheckCircle2, Circle, Plus, AlertTriangle, Check, Loader2 } from 'lucide-react';

interface PlaygroundItem {
  id: string;
  title: string;
  subtitle: string;
  progress: number;
  color: string;
  description: string;
  tasks: { text: string; completed: boolean }[];
}

const initialItems: PlaygroundItem[] = [
  {
    id: "support-work",
    title: "Mentorship & Services",
    subtitle: "Teaching & Consulting",
    progress: 100,
    color: "#7EE3B3",
    description: "Book 1-on-1 mentorship (Chess teaching & LLM coaching), request a portfolio/resume audit, or coordinate custom software advisory.",
    tasks: [
      { text: "Razorpay Sandbox accounts setup", completed: true },
      { text: "Vercel serverless order creation API", completed: true },
      { text: "Dynamic checkout overlay loading", completed: true },
      { text: "Secure cryptographic hash verification", completed: true },
      { text: "Supabase transaction persistence", completed: true },
      { text: "Failsafe webhook event capturing", completed: true }
    ]
  },
  {
    id: "mobile-detox",
    title: "Mobile Detox application",
    subtitle: "Screen time tracker & app blocker",
    progress: 0,
    color: "#F4C39D",
    description: "An experimental web application designed to help users limit screen time, block distracting apps, and cultivate better focus through gamified digital wellness tools.",
    tasks: [
      { text: "UI wireframes & layout design", completed: false },
      { text: "Core screen-time tracking API integration", completed: false },
      { text: "App locking and session scheduler logic", completed: false },
      { text: "Gamification & rewards system implementation", completed: false },
      { text: "Local storage state sync & dashboard metrics", completed: false }
    ]
  }
];

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

const Playground: React.FC = () => {
  const [items] = useState<PlaygroundItem[]>(initialItems);
  const [activeTab, setActiveTab] = useState<string>("support-work");

  // Booking states
  const [selectedTier, setSelectedTier] = useState<'consulting' | 'review' | 'collaboration'>('consulting');
  const [subService, setSubService] = useState<string>('30-Min Chat or Q&A');
  const [customPrice, setCustomPrice] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const currentItem = items.find(item => item.id === activeTab) || items[0];

  // Helper to determine if custom pricing is selected
  const isCustomService = subService.toLowerCase().includes('custom');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (!email) {
      setPaymentError('Email address is required.');
      return;
    }

    const finalAmount = isCustomService 
      ? Number(customPrice) 
      : (selectedTier === 'consulting' ? 499 : selectedTier === 'review' ? 299 : 999);

    if (isNaN(finalAmount) || finalAmount < 10 || finalAmount > 5000) {
      setPaymentError('Please enter a valid amount between ₹10 and ₹5,000.');
      return;
    }

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
          name: name || 'Anonymous',
          email,
          message,
          service_type: subService,
          contact_info: contactInfo,
          anonymous
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
        description: subService,
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

  const getSubServiceOptions = () => {
    switch (selectedTier) {
      case 'consulting':
        return [
          '30-Min Chess Game Mentorship',
          '30-Min LLM & AI Coaching',
          '30-Min Tech Consulting & Q&A',
          'Custom Mentorship Session'
        ];
      case 'review':
        return [
          'Resume Review & Feedback',
          'Portfolio & Website Audit',
          'Video & Media Editing Audit',
          'Document & Content Review',
          'Custom Review Request'
        ];
      case 'collaboration':
        return [
          'Software Project Advisory',
          'Active Project Collaboration',
          'Custom Tech Advisory'
        ];
      default:
        return [];
    }
  };

  return (
    <section className="panel playground-panel glass">
      {/* Dynamic Style Injection for isolated page layout */}
      <style>{`
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin: 20px 0 28px;
        }
        .service-card {
          padding: 20px;
          border-radius: 16px;
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: left;
        }
        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
        .service-card.active {
          border-width: 2px;
        }
        [data-theme='light'] .service-card.active { border-color: #111; box-shadow: 0 0 12px rgba(17, 17, 17, 0.1); }
        [data-theme='dark'] .service-card.active { border-color: #f9fafb; box-shadow: 0 0 12px rgba(249, 250, 251, 0.2); }
        [data-theme='colorful'] .service-card.active { border-color: #2B2420; box-shadow: 0 0 12px rgba(43, 36, 32, 0.2); }
        
        [data-theme='colorful'] .service-card.tier-consulting { background: #FFE066 !important; color: #2B2420 !important; }
        [data-theme='colorful'] .service-card.tier-review { background: #A29BF2 !important; color: #2B2420 !important; }
        [data-theme='colorful'] .service-card.tier-collaboration { background: #8FD8CC !important; color: #2B2420 !important; }

        .service-card h4 {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }
        [data-theme='dark'] .service-card h4 {
          color: #f9fafb !important;
        }
        [data-theme='colorful'] .service-card h4 { 
          color: #2B2420 !important; 
        }

        .price-tag {
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--text-primary);
          margin-top: 4px;
        }
        [data-theme='dark'] .price-tag { color: #f9fafb !important; }
        [data-theme='colorful'] .price-tag { color: #2B2420 !important; }
        
        .card-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
        [data-theme='dark'] .card-desc { color: #9ca3af !important; }
        [data-theme='colorful'] .card-desc { color: #5A4A3A !important; }

        .booking-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 24px;
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
        .booking-form select,
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
        .booking-form select:focus,
        .booking-form textarea:focus {
          border-color: var(--text-primary);
          box-shadow: 0 0 0 3px var(--card-border);
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
          font-size: 0.88rem;
          margin: 4px 0;
        }
        .checkbox-container input {
          width: auto;
          margin: 0;
          cursor: pointer;
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
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: fit-content;
        }
        [data-theme='colorful'] .booking-submit-btn {
          background: #FFE066;
          color: #2B2420;
          border-color: #FFE066;
        }
        .booking-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          opacity: 0.9;
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
          animation: scaleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes scaleUp {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .feed-container {
          margin-top: 48px;
          border-top: 1px solid var(--card-border);
          padding-top: 32px;
        }
        .feed-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          margin-bottom: 20px;
        }
        .feed-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .feed-item {
          padding: 16px;
          border-radius: 16px;
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          text-align: left;
        }
        .feed-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 6px;
        }
        .feed-service {
          display: inline-block;
          font-size: 0.75rem;
          background: var(--accent-light);
          border: 1px solid var(--accent-border);
          padding: 2px 8px;
          border-radius: 99px;
          color: var(--text-primary);
          margin-bottom: 8px;
          font-weight: 550;
        }
        .feed-message {
          font-size: 0.9rem;
          line-height: 1.4;
          color: var(--text-secondary);
        }

        .form-error {
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          color: #EF4444;
          font-size: 0.88rem;
          text-align: left;
        }
      `}</style>

      <div className="section-header">
        <div className="section-title-group">
          <Gamepad2 className="section-icon" size={24} />
          <h2>Sagar's Playground</h2>
        </div>
        <p className="section-subtitle">
          A development sandbox for exploring random features, experimental tech, and workflow spikes.
        </p>
      </div>

      <div className="playground-layout">
        {/* Left Sidebar Pane */}
        <aside className="playground-sidebar">
          <div className="sidebar-header">
            <h3>Active Spikes</h3>
            <span className="spike-count">{items.length}</span>
          </div>
          
          <div className="tab-list">
            {items.map((item) => {
              const isActive = item.id === activeTab;
              return (
                <button
                  key={item.id}
                  className={`tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                  style={
                    isActive 
                      ? { 
                          borderLeftColor: item.color,
                          backgroundColor: `${item.color}0c`
                        } 
                      : undefined
                  }
                >
                  <div className="tab-btn-title">
                    <span 
                      className="indicator-dot" 
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <h4>{item.title}</h4>
                  </div>
                  <div className="tab-btn-meta">
                    <span className="badge-text">{item.subtitle}</span>
                    <span className="progress-value">{item.progress}%</span>
                  </div>
                </button>
              );
            })}

            <button className="add-spike-btn" disabled>
              <Plus size={16} />
              <span>Create New Spike</span>
            </button>
          </div>
        </aside>

        {/* Right Workspace Pane */}
        <main className="playground-workspace glass-hover">
          <header className="workspace-header">
            <div className="title-group">
              <span 
                className="category-pill"
                style={{ 
                  backgroundColor: `${currentItem.color}1a`, 
                  color: currentItem.color,
                  borderColor: `${currentItem.color}33`
                }}
              >
                {currentItem.id === 'support-work' ? 'Live System' : 'In Planning'}
              </span>
              <h2>{currentItem.title}</h2>
              <p className="subtitle">{currentItem.subtitle}</p>
            </div>
            
            <div className="progress-card">
              <div className="progress-info">
                <span>Overall Progress</span>
                <span className="progress-num" style={{ color: currentItem.color }}>
                  {currentItem.progress}%
                </span>
              </div>
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: `${currentItem.progress}%`,
                    backgroundColor: currentItem.color
                  }}
                ></div>
              </div>
            </div>
          </header>

          <div className="workspace-body">
            {currentItem.id === 'support-work' ? (
              // Mentorship & Advisory View
              <div className="support-work-container">
                <p style={{ textAlign: 'left', lineHeight: 1.5 }}>
                  Book 1-on-1 mentorship (Chess teaching & LLM coaching), request a resume or portfolio audit, or request custom software advisory.
                </p>

                {/* Service Cards Selector */}
                <div className="services-grid">
                  <button 
                    type="button"
                    className={`service-card tier-consulting ${selectedTier === 'consulting' ? 'active' : ''}`}
                    onClick={() => { setSelectedTier('consulting'); setSubService('30-Min Chess Game Mentorship'); }}
                  >
                    <h4>1-on-1 Mentorship</h4>
                    <span className="price-tag">₹499</span>
                    <p className="card-desc">30-minute Chess teaching, LLM/AI coaching, or tech Q&A session.</p>
                  </button>

                  <button 
                    type="button"
                    className={`service-card tier-review ${selectedTier === 'review' ? 'active' : ''}`}
                    onClick={() => { setSelectedTier('review'); setSubService('Resume Review & Feedback'); }}
                  >
                    <h4>Resume & Reviews</h4>
                    <span className="price-tag">₹299</span>
                    <p className="card-desc">Audit of your resume, portfolio, video editing, or content writing.</p>
                  </button>

                  <button 
                    type="button"
                    className={`service-card tier-collaboration ${selectedTier === 'collaboration' ? 'active' : ''}`}
                    onClick={() => { setSelectedTier('collaboration'); setSubService('Software Project Advisory'); }}
                  >
                    <h4>Software Advisory</h4>
                    <span className="price-tag">₹999</span>
                    <p className="card-desc">Join active development projects, software advisory, or tech guidance.</p>
                  </button>
                </div>

                {/* Booking / Checkout Form */}
                {!paymentSuccess ? (
                  <form onSubmit={handlePayment} className="booking-form">
                    {paymentError && (
                      <div className="form-error">
                        {paymentError}
                      </div>
                    )}

                    <div className="form-group">
                      <label htmlFor="sub-service-select">Select Service Desired</label>
                      <select 
                        id="sub-service-select"
                        value={subService}
                        onChange={(e) => setSubService(e.target.value)}
                      >
                        {getSubServiceOptions().map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {isCustomService && (
                      <div className="form-group">
                        <label htmlFor="custom-price-input">Custom Amount (₹)</label>
                        <input
                          id="custom-price-input"
                          type="number"
                          min="10"
                          max="5000"
                          placeholder="Enter agreed amount (e.g. 500)"
                          value={customPrice}
                          onChange={(e) => setCustomPrice(e.target.value)}
                          required
                        />
                        <small style={{ textAlign: 'left', color: 'var(--text-muted)' }}>Enter amount between ₹10 and ₹5,000.</small>
                      </div>
                    )}

                    <div className="form-group">
                      <label htmlFor="booking-name">Your Name</label>
                      <input 
                        id="booking-name"
                        type="text" 
                        placeholder={anonymous ? "Will be hidden in feed" : "Your Name"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={anonymous}
                        required={!anonymous}
                      />
                    </div>

                    <label className="checkbox-container">
                      <input 
                        type="checkbox"
                        checked={anonymous}
                        onChange={(e) => setAnonymous(e.target.checked)}
                      />
                      <span>Make this booking anonymous on the public feed</span>
                    </label>

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
                      <small style={{ textAlign: 'left', color: 'var(--text-muted)' }}>For transaction confirmation and scheduling details.</small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="booking-contact">Contact Info (WhatsApp link, Calendly, or handle)</label>
                      <input 
                        id="booking-contact"
                        type="text" 
                        placeholder="e.g. calendly.com/username or @handle"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="booking-message">Details of your request</label>
                      <textarea 
                        id="booking-message"
                        rows={4}
                        placeholder={
                          selectedTier === 'review'
                            ? "Provide links to your resume, portfolio draft, or video clips..."
                            : selectedTier === 'consulting'
                            ? "Describe what you would like to discuss or learn (chess, AI prompts, Excel sheets)..."
                            : "Share details about the project collaboration or networking connection request..."
                        }
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
                        <span>Book Service (₹{isCustomService ? (customPrice || '0') : (selectedTier === 'consulting' ? '499' : selectedTier === 'review' ? '299' : '999')})</span>
                      )}
                    </button>
                  </form>
                ) : (
                  // Success View
                  <div className="booking-success-view">
                    <div className="success-check-circle">
                      <Check size={36} />
                    </div>
                    <h3>Booking Confirmed!</h3>
                    <p style={{ maxWidth: '400px', margin: '0 auto', lineHeight: 1.5 }}>
                      Thank you for booking **{subService}**. 
                      A scheduling query will be sent to your email (**{email}**) shortly.
                    </p>
                    <small style={{ color: 'var(--text-muted)' }}>Transaction Reference: {transactionId}</small>
                    <button 
                      type="button"
                      className="booking-submit-btn" 
                      onClick={() => {
                        setPaymentSuccess(false);
                        setName('');
                        setEmail('');
                        setContactInfo('');
                        setMessage('');
                        setCustomPrice('');
                      }}
                      style={{ marginTop: '16px' }}
                    >
                      Book Another Service
                    </button>
                  </div>
                )}

              </div>
            ) : (
              // Original Spike Workspace Views
              <>
                <div className="desc-section">
                  <h3>Description</h3>
                  <p>{currentItem.description}</p>
                </div>

                <div className="checklist-section">
                  <div className="checklist-header">
                    <h3>Feature Checklist</h3>
                    <span>{currentItem.tasks.filter(t => t.completed).length} / {currentItem.tasks.length} done</span>
                  </div>
                  
                  <ul className="task-list">
                    {currentItem.tasks.map((task, idx) => (
                      <li key={idx} className={`task-item ${task.completed ? 'completed' : ''}`}>
                        {task.completed ? (
                          <CheckCircle2 size={18} className="icon-done" />
                        ) : (
                          <Circle size={18} className="icon-todo" />
                        )}
                        <span>{task.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="sandbox-info-banner">
                  <AlertTriangle size={18} />
                  <p>This is a sandboxed display. You can edit this workspace file to start building the actual application UI here in React!</p>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </section>
  );
};

export default Playground;
