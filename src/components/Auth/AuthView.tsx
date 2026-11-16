import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, Mail, Lock, User, ArrowRight, AlertCircle, 
  Layers, ChevronLeft, ChevronRight, Zap, TrendingUp, 
  MessageSquare, FileText, CheckCircle2, ShieldCheck, 
  Sparkles, Clock, Check
} from 'lucide-react';

interface SlideItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  renderVisual: () => React.ReactNode;
}

const SLIDES: SlideItem[] = [
  {
    id: 'pipeline',
    tag: 'PIPELINE VELOCITY',
    title: 'Intelligent Deal Tracking & Revenue Forecasting',
    description: 'Track deal movements from initial inquiry to closed-won with automated stage velocity and real-time revenue analytics.',
    renderVisual: () => (
      <div style={{ position: 'relative', width: '100%', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Background glow orb */}
        <div 
          style={{
            position: 'absolute',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167, 139, 250, 0.22) 0%, rgba(167, 139, 250, 0) 70%)',
            filter: 'blur(20px)',
          }}
        />

        {/* Center Big 3D Avatar Card */}
        <div 
          className="frozen-glass-panel animate-float"
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '16px 20px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(167, 139, 250, 0.15)',
          }}
        >
          <div style={{ position: 'relative' }}>
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
              alt="Executive"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--lilac-400)',
                boxShadow: '0 0 16px rgba(167, 139, 250, 0.4)',
              }}
            />
            <span 
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#34d399',
                border: '2px solid #0d0f14',
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              Elena Rostova
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              VP of Commercial Growth
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <span className="notion-tag emerald" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                Deal Won • $148,000
              </span>
            </div>
          </div>
        </div>

        {/* Floating Stat Badge 1 (Top Right) */}
        <div 
          className="frozen-glass-badge animate-float-delayed"
          style={{
            position: 'absolute',
            top: '12px',
            right: '20px',
            zIndex: 3,
            padding: '8px 12px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div 
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              background: 'rgba(52, 211, 153, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399',
            }}
          >
            <TrendingUp size={14} />
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Win Rate</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399' }} className="tabular-nums">+34.8%</div>
          </div>
        </div>

        {/* Floating Stat Badge 2 (Bottom Left) */}
        <div 
          className="frozen-glass-badge animate-float"
          style={{
            position: 'absolute',
            bottom: '14px',
            left: '20px',
            zIndex: 3,
            padding: '8px 12px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div 
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              background: 'var(--lilac-bg-subtle)',
              border: '1px solid var(--lilac-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--lilac-300)',
            }}
          >
            <Sparkles size={13} />
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Weighted Pipeline</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }} className="tabular-nums">$482,000</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'inbox',
    tag: 'OMNICHANNEL MESSAGING',
    title: 'Unified Customer Stream & Speed-to-Lead',
    description: 'Consolidate every lead touchpoint across SMS, WhatsApp, and email into one synchronized stream with instant contact timeline records.',
    renderVisual: () => (
      <div style={{ position: 'relative', width: '100%', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Glow */}
        <div 
          style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(96, 165, 250, 0.18) 0%, rgba(96, 165, 250, 0) 70%)',
            filter: 'blur(24px)',
          }}
        />

        {/* Main Floating Message Card */}
        <div 
          className="frozen-glass-panel animate-float"
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '16px 18px',
            borderRadius: '16px',
            width: '290px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" 
                  alt="Contact" 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span 
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    right: '-1px',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    background: '#60a5fa',
                    border: '1.5px solid #0d0f14',
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>Marcus Vance</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>CTO • Horizon Global</div>
              </div>
            </div>
            <span className="notion-tag sky" style={{ fontSize: '0.65rem' }}>WHATSAPP</span>
          </div>

          <div 
            style={{ 
              padding: '9px 12px', 
              borderRadius: '8px', 
              background: 'rgba(0, 0, 0, 0.4)', 
              fontSize: '0.76rem', 
              color: 'var(--text-main)',
              lineHeight: 1.45,
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            "Proposal looks fantastic. Let's execute the contract and schedule kickoff."
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span>Speed-to-lead: 28s</span>
            <span style={{ color: 'var(--lilac-300)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Check size={12} /> Delivered
            </span>
          </div>
        </div>

        {/* Orbit Avatar Stack (Top Left) */}
        <div 
          className="frozen-glass-badge animate-float-delayed"
          style={{
            position: 'absolute',
            top: '12px',
            left: '24px',
            zIndex: 3,
            padding: '6px 12px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', marginLeft: '6px' }}>
            {['1494790108377-be9c29b29330', '1500648767791-00dcc994a43e'].map((id, idx) => (
              <img
                key={id}
                src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=100&q=80`}
                alt=""
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginLeft: idx > 0 ? '-6px' : 0,
                  border: '1.5px solid var(--notion-surface-card)',
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Channels</span>
        </div>
      </div>
    ),
  },
  {
    id: 'workflows',
    tag: 'AUTONOMOUS WORKFLOWS',
    title: 'Self-Executing Triggers & Automation Chains',
    description: 'Deploy multi-step triggers, drip campaigns, automated lead allocations, and outbound webhooks without manual intervention.',
    renderVisual: () => (
      <div style={{ position: 'relative', width: '100%', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Glow */}
        <div 
          style={{
            position: 'absolute',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167, 139, 250, 0.25) 0%, rgba(167, 139, 250, 0) 70%)',
            filter: 'blur(20px)',
          }}
        />

        {/* 3D Flow Nodes Cascade */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 2, width: '280px' }}>
          {/* Node 1 */}
          <div 
            className="frozen-glass-panel animate-float"
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderLeft: '3px solid var(--lilac-400)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: 'var(--lilac-bg-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--lilac-300)',
                }}
              >
                <Zap size={13} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)' }}>Trigger: Deal Qualified</span>
            </div>
            <span className="notion-tag lilac" style={{ fontSize: '0.62rem' }}>EVENT</span>
          </div>

          {/* Node 2 */}
          <div 
            className="frozen-glass-badge animate-float-delayed"
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderLeft: '3px solid #34d399',
              marginLeft: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: 'rgba(52, 211, 153, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34d399',
                }}
              >
                <CheckCircle2 size={13} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)' }}>Action: Send SMS + Booking Link</span>
            </div>
            <span className="notion-tag emerald" style={{ fontSize: '0.62rem' }}>SENT</span>
          </div>
        </div>

        {/* Floating Metrics Badge */}
        <div 
          className="frozen-glass-badge animate-float"
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '24px',
            zIndex: 3,
            padding: '6px 10px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Clock size={12} style={{ color: 'var(--lilac-300)' }} />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Execution: <strong>42ms</strong></span>
        </div>
      </div>
    ),
  },
  {
    id: 'docs',
    tag: 'WORKSPACE & PLAYBOOKS',
    title: 'Multi-View Databases & Executive Playbooks',
    description: 'Switch between Table, Kanban Board, Calendar, and interactive document SOPs with complete workspace data isolation.',
    renderVisual: () => (
      <div style={{ position: 'relative', width: '100%', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Glow */}
        <div 
          style={{
            position: 'absolute',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167, 139, 250, 0.2) 0%, rgba(167, 139, 250, 0) 70%)',
            filter: 'blur(20px)',
          }}
        />

        {/* 3D Glass Document Layer */}
        <div 
          className="frozen-glass-panel animate-float"
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '16px 20px',
            borderRadius: '16px',
            width: '280px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>📝</span>
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>Client Onboarding SOP</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Updated by Workspace Owner</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { label: 'Security Verification & Tenant RLS', done: true },
              { label: 'Pipeline Stage Customization', done: true },
              { label: 'Team Member Invite & Roles', done: false },
            ].map((todo, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.74rem',
                  color: todo.done ? 'var(--text-muted)' : 'var(--text-main)',
                  textDecoration: todo.done ? 'line-through' : 'none',
                }}
              >
                <div 
                  className={`notion-checkbox ${todo.done ? 'checked' : ''}`}
                  style={{ width: '13px', height: '13px' }}
                >
                  {todo.done && <Check size={9} strokeWidth={3} />}
                </div>
                <span>{todo.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Security Badge */}
        <div 
          className="frozen-glass-badge animate-float-delayed"
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '20px',
            zIndex: 3,
            padding: '6px 12px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <ShieldCheck size={13} style={{ color: '#34d399' }} />
          <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>Multi-Tenant Isolated</span>
        </div>
      </div>
    ),
  },
];

export const AuthView: React.FC = () => {
  const { signInCompanyAccount, registerCompanyAccount } = useApp();
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');

  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carousel & Autoscroll State
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance timer (every 4.5 seconds)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveSlideIndex(prev => (prev + 1) % SLIDES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrevSlide = () => {
    setActiveSlideIndex(prev => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNextSlide = () => {
    setActiveSlideIndex(prev => (prev + 1) % SLIDES.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!companyName.trim() || !fullName.trim() || !email.trim() || password.length < 6) {
          setError('Please complete all fields (password must be at least 6 characters).');
          setLoading(false);
          return;
        }
        const res = await registerCompanyAccount({
          companyName: companyName.trim(),
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
        });
        if (!res.success) {
          setError(res.message || 'Could not create company account.');
        }
      } else {
        const res = await signInCompanyAccount(email.trim().toLowerCase(), password);
        if (!res.success) {
          setError(res.message || 'Invalid email or password.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const currentSlide = SLIDES[activeSlideIndex];

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'var(--notion-deep-black)',
        color: 'var(--text-main)',
        display: 'grid',
        gridTemplateColumns: '1.15fr 0.85fr',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background light spheres */}
      <div 
        style={{
          position: 'absolute',
          top: '-10%',
          left: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.08) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '30%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(96, 165, 250, 0.05) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* Left Column: Interactive Flow Showcase with Frosted Glass Panel */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          background: 'transparent',
          borderRight: '1px solid var(--notion-border)',
          padding: '44px 52px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--lilac-bg-subtle)',
                border: '1px solid var(--lilac-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--lilac-300)',
                fontWeight: 800,
                fontSize: '0.9rem',
                boxShadow: '0 0 15px rgba(167, 139, 250, 0.2)',
              }}
            >
              A
            </div>
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.98rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                AutoFlow Studio
              </span>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Multi-Tenant CRM & Operations
              </div>
            </div>
          </div>

          <div 
            style={{
              fontSize: '0.72rem',
              color: 'var(--lilac-300)',
              background: 'var(--lilac-bg-subtle)',
              border: '1px solid var(--lilac-border)',
              padding: '4px 10px',
              borderRadius: '20px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
            Active Architecture
          </div>
        </div>

        {/* Center: Frosted Glass Showcase Container */}
        <div 
          className="frozen-glass-panel"
          style={{
            maxWidth: '540px',
            width: '100%',
            margin: '28px 0',
            borderRadius: '20px',
            padding: '36px 36px 32px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Slide Category Tag */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span 
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: 'var(--lilac-400)',
                background: 'var(--lilac-bg-subtle)',
                border: '1px solid var(--lilac-border)',
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              {currentSlide.tag}
            </span>

            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              0{activeSlideIndex + 1} / 0{SLIDES.length}
            </span>
          </div>

          {/* Big 3D Avatar / Visual Area with Subtle Animation */}
          <div key={`visual-${currentSlide.id}`} className="animate-slide-in">
            {currentSlide.renderVisual()}
          </div>

          {/* Text Point (One at a time) */}
          <div 
            key={`text-${currentSlide.id}`} 
            className="animate-slide-in"
            style={{ marginTop: '24px', minHeight: '110px' }}
          >
            <h2
              style={{
                fontSize: '1.38rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
                color: 'var(--text-main)',
                marginBottom: '8px',
              }}
            >
              {currentSlide.title}
            </h2>
            <p
              style={{
                fontSize: '0.86rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
              }}
            >
              {currentSlide.description}
            </p>
          </div>

          {/* Dots Navigation & Arrow Controls */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '20px',
              paddingTop: '18px',
              borderTop: '1px solid var(--notion-border)',
            }}
          >
            {/* Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {SLIDES.map((slide, idx) => {
                const isActive = idx === activeSlideIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveSlideIndex(idx)}
                    title={slide.title}
                    style={{
                      height: '7px',
                      width: isActive ? '28px' : '7px',
                      borderRadius: '4px',
                      background: isActive ? 'var(--lilac-400)' : 'rgba(255, 255, 255, 0.18)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      padding: 0,
                      boxShadow: isActive ? '0 0 10px rgba(167, 139, 250, 0.5)' : 'none',
                    }}
                  />
                );
              })}
            </div>

            {/* Prev / Next controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={handlePrevSlide}
                className="btn btn-ghost btn-icon btn-sm"
                title="Previous feature"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--notion-border)',
                  color: 'var(--text-secondary)',
                }}
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                className="btn btn-ghost btn-icon btn-sm"
                title="Next feature"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--notion-border)',
                  color: 'var(--text-secondary)',
                }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.74rem',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--notion-border)',
            paddingTop: '18px',
          }}
        >
          <span>Multi-Tenant Architecture</span>
          <span>PostgreSQL Row-Level Security</span>
        </div>
      </div>

      {/* Right Column: Sign Up / Sign In Form */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '410px',
          }}
        >
          {/* Mode Switcher */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              padding: '3px',
              background: 'var(--notion-surface)',
              border: '1px solid var(--notion-border)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '28px',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: mode === 'signup' ? 'var(--notion-surface-hover)' : 'transparent',
                color: mode === 'signup' ? 'var(--text-main)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Create Company Account
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: mode === 'signin' ? 'var(--notion-surface-hover)' : 'transparent',
                color: mode === 'signin' ? 'var(--text-main)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Sign In to Workspace
            </button>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px', color: 'var(--text-main)' }}>
              {mode === 'signup' ? 'Register your company workspace' : 'Sign in to your workspace'}
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {mode === 'signup'
                ? 'Create your organization account to launch the interactive CRM builder.'
                : 'Enter your work credentials to access your company CRM.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mode === 'signup' && (
              <>
                <div>
                  <label className="form-label">Company / Organization Name</label>
                  <div style={{ position: 'relative' }}>
                    <Building2
                      size={15}
                      style={{
                        position: 'absolute',
                        left: '11px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                      }}
                    />
                    <input
                      type="text"
                      className="input"
                      style={{ paddingLeft: '34px' }}
                      placeholder="e.g. Apex Growth Agency"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Your Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User
                      size={15}
                      style={{
                        position: 'absolute',
                        left: '11px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                      }}
                    />
                    <input
                      type="text"
                      className="input"
                      style={{ paddingLeft: '34px' }}
                      placeholder="e.g. Walid Mansour"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="form-label">Work Email</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '11px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="email"
                  className="input"
                  style={{ paddingLeft: '34px' }}
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '11px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="password"
                  className="input"
                  style={{ paddingLeft: '34px' }}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--coral-bg)',
                  border: '1px solid rgba(248, 113, 113, 0.25)',
                  color: 'var(--coral)',
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-lilac"
              disabled={loading}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '10px 16px',
                fontSize: '0.84rem',
                marginTop: '4px',
              }}
            >
              <span>
                {loading
                  ? mode === 'signup'
                    ? 'Provisioning Workspace...'
                    : 'Signing In...'
                  : mode === 'signup'
                  ? 'Create Workspace & Start Onboarding'
                  : 'Sign In to Workspace'}
              </span>
              <ArrowRight size={15} />
            </button>
          </form>

          <div
            style={{
              marginTop: '24px',
              paddingTop: '18px',
              borderTop: '1px solid var(--notion-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
            }}
          >
            <Layers size={13} style={{ color: 'var(--lilac-400)' }} />
            <span>
              {mode === 'signup' ? 'Already registered your company?' : 'New organization?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signup' ? 'signin' : 'signup');
                  setError(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--lilac-300)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {mode === 'signup' ? 'Sign in here' : 'Create a company workspace'}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
