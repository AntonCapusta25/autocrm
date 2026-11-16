import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PAID_MODULES_CATALOG } from '../../lib/initialData';
import { 
  X, Phone, MessageSquare, Building2, Layers, 
  CheckCircle2, ArrowRight, ArrowLeft, Sparkles, 
  Bot, Database, Target, ShieldCheck, Clock, Check
} from 'lucide-react';

interface PaidModuleRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialModuleId?: string | null;
}

interface StepConfig {
  id: 'phone' | 'message' | 'size' | 'service' | 'contact';
  title: string;
  subtitle: string;
}

const STEPS: StepConfig[] = [
  {
    id: 'phone',
    title: 'What is your direct phone number?',
    subtitle: 'Our automation engineers use this to coordinate carrier provisioning, SMS compliance, and webhook routing.',
  },
  {
    id: 'message',
    title: 'What custom setup or automation do you need?',
    subtitle: 'Describe the specific workflows, APIs, databases, or voice capabilities you want configured.',
  },
  {
    id: 'size',
    title: 'What is your business size?',
    subtitle: 'Helps us calibrate throughput quotas, concurrency limits, and server infrastructure.',
  },
  {
    id: 'service',
    title: 'Which enterprise module interests you most?',
    subtitle: 'Select the primary paid add-on module to initiate deployment.',
  },
  {
    id: 'contact',
    title: 'Lastly, how can we reach you?',
    subtitle: 'We will send your implementation scope, SLA timeline, and setup credentials here.',
  },
];

const SIZE_OPTIONS = [
  { id: 'solo', label: 'Solo-Preneur', desc: '1 operator, targeted workflows' },
  { id: 'startup', label: 'Startup (1–10)', desc: 'Fast-moving core team' },
  { id: 'team', label: 'Team (10–50)', desc: 'Multi-rep commercial department' },
  { id: 'enterprise', label: 'Enterprise (50+)', desc: 'High-throughput custom infrastructure' },
];

const SERVICE_OPTIONS = [
  { 
    id: 'ai-agents', 
    name: 'Autonomous AI Voice & Booking Agents', 
    desc: 'Sub-400ms neural voice dialer, Retell/Twilio SIP trunk, calendar booking over live phone calls',
    icon: <Bot size={18} style={{ color: '#a78bfa' }} />,
    moduleId: 'ai_voice',
  },
  { 
    id: 'process-auto', 
    name: 'WhatsApp Business Cloud API & 10DLC Messaging', 
    desc: 'Meta Green Tick brand verification, WhatsApp Cloud API access & A2P 10DLC compliance',
    icon: <MessageSquare size={18} style={{ color: '#34d399' }} />,
    moduleId: 'whatsapp_cloud',
  },
  { 
    id: 'custom', 
    name: 'Custom ERP & Legacy Database Pipelines', 
    desc: 'Two-way real-time webhook sync with PostgreSQL, SAP, Salesforce, HubSpot or legacy SQL',
    icon: <Database size={18} style={{ color: '#60a5fa' }} />,
    moduleId: 'custom_erp',
  },
  { 
    id: 'data-intel', 
    name: 'Bespoke AI Knowledge Agent on Company SOPs', 
    desc: 'Vector indexing on unlimited company PDFs, docs & playbooks with safe action execution',
    icon: <Sparkles size={18} style={{ color: '#c084fc' }} />,
    moduleId: 'custom_agents',
  },
  { 
    id: 'lead-gen', 
    name: 'Automated Lead Scraping & Multi-Inbox Warmup', 
    desc: 'Secondary domains, SPF/DKIM/DMARC warmup pools & verified decision-maker emails',
    icon: <Target size={18} style={{ color: '#f472b6' }} />,
    moduleId: 'lead_scraping',
  },
];

const PROMPT_CHIPS = [
  'Setup AI Voice Agent for after-hours booking',
  'Connect WhatsApp Business Cloud API & Green Tick',
  'Two-way sync with custom PostgreSQL database',
  'Warmed outbound email domains & lead scraper',
  'Bespoke AI agent trained on internal SOPs',
];

export const PaidModuleRequestModal: React.FC<PaidModuleRequestModalProps> = ({
  isOpen,
  onClose,
  initialModuleId,
}) => {
  const { currentWorkspace, currentUser, submitModuleRequest } = useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [form, setForm] = useState({
    phone: '',
    message: '',
    size: 'team',
    service: 'ai-agents',
    name: currentUser.name || '',
    email: currentUser.email || '',
    companyName: currentWorkspace.name || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-select service if initialModuleId passed
  useEffect(() => {
    if (initialModuleId) {
      const match = SERVICE_OPTIONS.find(s => s.moduleId === initialModuleId);
      if (match) {
        setForm(f => ({ ...f, service: match.id }));
      }
    }
  }, [initialModuleId]);

  if (!isOpen) return null;

  const currentStep = STEPS[currentStepIndex];

  const handleNext = () => {
    setErrorMsg('');

    // Step 0 validation: Phone
    if (currentStep.id === 'phone') {
      if (!form.phone.trim() || form.phone.trim().length < 6) {
        setErrorMsg('Please enter a valid phone number with area/country code.');
        return;
      }
    }

    // Step 4 validation: Contact
    if (currentStep.id === 'contact') {
      if (!form.name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!form.email.trim() || !form.email.includes('@')) {
        setErrorMsg('Please enter a valid work email address.');
        return;
      }
      handleSubmit();
      return;
    }

    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setErrorMsg('');
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    const activeService = SERVICE_OPTIONS.find(s => s.id === form.service) || SERVICE_OPTIONS[0];

    const res = await submitModuleRequest({
      moduleId: activeService.moduleId,
      moduleName: activeService.name,
      phone: form.phone.trim(),
      message: form.message.trim() || `Requested setup for ${activeService.name}`,
      businessSize: form.size,
      service: form.service,
      contactName: form.name.trim(),
      contactEmail: form.email.trim().toLowerCase(),
      companyName: form.companyName.trim() || currentWorkspace.name,
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
    } else {
      setErrorMsg(res.message || 'Something went wrong. Please try again.');
    }
  };

  const selectedServiceObj = SERVICE_OPTIONS.find(s => s.id === form.service) || SERVICE_OPTIONS[0];

  return (
    <div className="notion-modal-overlay" style={{ zIndex: 1200 }}>
      <div 
        className="notion-modal-box animate-scale-in"
        style={{
          maxWidth: '620px',
          width: '92%',
          background: 'var(--notion-panel)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(167, 139, 250, 0.1)',
          borderRadius: '14px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Top Gradient Backlight */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--lilac-400), transparent)',
            opacity: 0.8,
          }}
        />

        {/* Header Bar */}
        <div 
          style={{ 
            padding: '20px 24px 16px', 
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(167, 139, 250, 0.12)',
                border: '1px solid rgba(167, 139, 250, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--lilac-300)',
              }}
            >
              <Sparkles size={16} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Enterprise Module Setup
                </span>
                <span className="notion-badge lilac" style={{ fontSize: '0.66rem' }}>
                  Managed Engineering
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                AutoFlow Studio Custom Implementation Flow
              </div>
            </div>
          </div>

          <button 
            type="button"
            className="notion-action-btn"
            onClick={onClose}
            style={{ width: '28px', height: '28px' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Progress Bar (5 Steps) */}
        {!isSuccess && (
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', height: '4px', width: '100%', position: 'relative' }}>
            <div 
              style={{
                height: '100%',
                width: `${((currentStepIndex + 1) / STEPS.length) * 100}%`,
                background: 'linear-gradient(90deg, var(--lilac-400), var(--lilac-300))',
                transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 0 8px rgba(167, 139, 250, 0.5)',
              }}
            />
          </div>
        )}

        {/* Modal Body */}
        <div style={{ padding: '24px 28px 28px' }}>
          {isSuccess ? (
            /* Success Confirmation Screen */
            <div style={{ textAlign: 'center', padding: '16px 8px 12px' }}>
              <div 
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(52, 211, 153, 0.12)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                  color: '#34d399',
                  boxShadow: '0 0 24px rgba(52, 211, 153, 0.25)',
                }}
              >
                <Check size={32} />
              </div>

              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                Setup Request Received!
              </h2>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 24px', lineHeight: 1.5 }}>
                Our automation engineering team has received your deployment ticket for{' '}
                <strong style={{ color: 'var(--lilac-300)' }}>{selectedServiceObj.name}</strong>. We will review your configuration and contact you within 24 hours.
              </p>

              {/* Ticket Summary Card */}
              <div 
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  textAlign: 'left',
                  maxWidth: '460px',
                  margin: '0 auto 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '0.82rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Module Requested</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{selectedServiceObj.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Target SLA</span>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>24–48 Hours</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Contact Phone</span>
                  <span style={{ color: 'var(--text-main)' }}>{form.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Contact Email</span>
                  <span style={{ color: 'var(--text-main)' }}>{form.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Status</span>
                  <span className="notion-badge lilac" style={{ fontSize: '0.7rem' }}>Pending Engineer Review</span>
                </div>
              </div>

              <button 
                type="button"
                className="btn btn-lilac"
                onClick={onClose}
                style={{ padding: '10px 28px', fontSize: '0.88rem' }}
              >
                Return to Workspace
              </button>
            </div>
          ) : (
            /* Multi-Step Interactive Form */
            <div>
              {/* Step indicator header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--lilac-300)', textTransform: 'uppercase' }}>
                  STEP {currentStepIndex + 1} OF {STEPS.length}
                </span>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  No upfront charge · Free architecture audit
                </span>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                {currentStep.title}
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '22px', lineHeight: 1.5 }}>
                {currentStep.subtitle}
              </p>

              {/* Step 1: Phone */}
              {currentStep.id === 'phone' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ position: 'relative' }}>
                    <div 
                      style={{ 
                        position: 'absolute', 
                        left: '14px', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Phone size={17} />
                    </div>
                    <input 
                      type="tel"
                      autoFocus
                      placeholder="+1 (555) 000-0000 or +31 6 12345678"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleNext(); } }}
                      className="notion-input"
                      style={{
                        paddingLeft: '44px',
                        fontSize: '1rem',
                        height: '46px',
                        background: 'var(--notion-card)',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={14} style={{ color: '#34d399' }} />
                    Zero spam. Used exclusively by our engineering team to calibrate SMS & telecom credentials.
                  </div>
                </div>
              )}

              {/* Step 2: Message / Problem */}
              {currentStep.id === 'message' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <textarea 
                    autoFocus
                    rows={4}
                    placeholder="E.g., We need an inbound AI Voice agent to answer after-hours calls and schedule appointments directly into our calendar, plus WhatsApp automated booking links..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="notion-input"
                    style={{
                      fontSize: '0.88rem',
                      lineHeight: 1.5,
                      padding: '12px 14px',
                      background: 'var(--notion-card)',
                      resize: 'none',
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                      QUICK TEMPLATES (CLICK TO INSERT):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {PROMPT_CHIPS.map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, message: chip }))}
                          style={{
                            fontSize: '0.74rem',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: form.message === chip ? 'var(--lilac-subtle)' : 'rgba(255, 255, 255, 0.04)',
                            border: form.message === chip ? '1px solid var(--lilac-border)' : '1px solid var(--border-subtle)',
                            color: form.message === chip ? 'var(--lilac-300)' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Business Size */}
              {currentStep.id === 'size' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {SIZE_OPTIONS.map(opt => {
                    const isSelected = form.size === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, size: opt.id }))}
                        style={{
                          padding: '16px',
                          borderRadius: '10px',
                          background: isSelected ? 'var(--lilac-subtle)' : 'var(--notion-card)',
                          border: isSelected ? '1px solid var(--lilac-400)' : '1px solid var(--border-subtle)',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          transition: 'all 0.15s ease',
                          boxShadow: isSelected ? '0 0 16px rgba(167, 139, 250, 0.15)' : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.92rem', fontWeight: 600, color: isSelected ? 'var(--lilac-300)' : 'var(--text-main)' }}>
                            {opt.label}
                          </span>
                          {isSelected && <Check size={16} style={{ color: 'var(--lilac-400)' }} />}
                        </div>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {opt.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Step 4: Service / Module Selection */}
              {currentStep.id === 'service' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {SERVICE_OPTIONS.map(svc => {
                    const isSelected = form.service === svc.id;
                    return (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, service: svc.id }))}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '10px',
                          background: isSelected ? 'var(--lilac-subtle)' : 'var(--notion-card)',
                          border: isSelected ? '1px solid var(--lilac-400)' : '1px solid var(--border-subtle)',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'all 0.15s ease',
                          boxShadow: isSelected ? '0 0 16px rgba(167, 139, 250, 0.15)' : 'none',
                        }}
                      >
                        <div 
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {svc.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: isSelected ? 'var(--lilac-300)' : 'var(--text-main)' }}>
                              {svc.name}
                            </span>
                            {isSelected && <Check size={15} style={{ color: 'var(--lilac-400)', flexShrink: 0 }} />}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {svc.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Step 5: Contact Details */}
              {currentStep.id === 'contact' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label className="notion-label">Your Full Name *</label>
                    <input 
                      type="text"
                      autoFocus
                      placeholder="Alex Vance"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="notion-input"
                      style={{ background: 'var(--notion-card)' }}
                    />
                  </div>

                  <div>
                    <label className="notion-label">Work Email Address *</label>
                    <input 
                      type="email"
                      placeholder="alex@company.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="notion-input"
                      style={{ background: 'var(--notion-card)' }}
                    />
                  </div>

                  <div>
                    <label className="notion-label">Company / Workspace Name</label>
                    <input 
                      type="text"
                      placeholder={currentWorkspace.name}
                      value={form.companyName}
                      onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
                      className="notion-input"
                      style={{ background: 'var(--notion-card)' }}
                    />
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {errorMsg && (
                <div 
                  style={{
                    marginTop: '16px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    fontSize: '0.8rem',
                  }}
                >
                  {errorMsg}
                </div>
              )}

              {/* Action Buttons */}
              <div 
                style={{
                  marginTop: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                {currentStepIndex > 0 ? (
                  <button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={handlePrev}
                    disabled={isSubmitting}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}
                  >
                    <ArrowLeft size={15} /> Back
                  </button>
                ) : (
                  <div />
                )}

                <button 
                  type="button"
                  className="btn btn-lilac"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', padding: '9px 20px' }}
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : currentStepIndex === STEPS.length - 1 ? (
                    <>Submit Setup Request <Sparkles size={15} /></>
                  ) : (
                    <>Next Step <ArrowRight size={15} /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

