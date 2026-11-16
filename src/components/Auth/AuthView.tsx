import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, Mail, Lock, User, ArrowRight, AlertCircle, 
  Layers, ChevronLeft, ChevronRight
} from 'lucide-react';

interface SlideItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  imageSrc: string;
  glowColor: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 'pipeline',
    tag: 'PIPELINE VELOCITY',
    title: 'Intelligent Deal Tracking & Revenue Forecasting',
    description: 'Track deal movements from initial inquiry to closed-won with automated stage velocity and real-time revenue analytics.',
    imageSrc: '/assets/clay/chart.jpg',
    glowColor: 'rgba(167, 139, 250, 0.28)',
  },
  {
    id: 'workflows',
    tag: 'AUTONOMOUS WORKFLOWS',
    title: 'Self-Executing Triggers & Automation Chains',
    description: 'Deploy multi-step event triggers, automated lead routing, follow-up sequences, and instant webhook dispatches.',
    imageSrc: '/assets/clay/lightning.jpg',
    glowColor: 'rgba(196, 181, 253, 0.3)',
  },
  {
    id: 'inbox',
    tag: 'OMNICHANNEL MESSAGING',
    title: 'Unified Customer Stream & Speed-to-Lead',
    description: 'Consolidate every lead touchpoint across SMS, WhatsApp, and email into one synchronized stream with instant contact timeline records.',
    imageSrc: '/assets/clay/chat.jpg',
    glowColor: 'rgba(96, 165, 250, 0.25)',
  },
  {
    id: 'docs',
    tag: 'WORKSPACE & PLAYBOOKS',
    title: 'Multi-View Databases & Executive Playbooks',
    description: 'Switch between Table, Kanban Board, Calendar, and interactive document SOPs with complete workspace data isolation.',
    imageSrc: '/assets/clay/docs.jpg',
    glowColor: 'rgba(52, 211, 153, 0.22)',
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
        gridTemplateColumns: '1.12fr 0.88fr',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background light orbs for frosted glass depth */}
      <div 
        style={{
          position: 'absolute',
          top: '-15%',
          left: '8%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.12) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '25%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(96, 165, 250, 0.08) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      {/* Left Column: Flow with Big 3D Clay Icons & Frozen Glass Background */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          background: 'transparent',
          borderRight: '1px solid var(--notion-border)',
          padding: '40px 48px',
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

        {/* Center: Frosted Glass Showcase Panel with Big 3D Clay Icon */}
        <div 
          className="frozen-glass-panel"
          style={{
            maxWidth: '520px',
            width: '100%',
            margin: '24px 0',
            borderRadius: '24px',
            padding: '32px 36px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top Tag & Counter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <span 
              style={{
                fontSize: '0.68rem',
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

          {/* Big Stylized 3D Clay Icon Centerpiece */}
          <div 
            key={`clay-visual-${currentSlide.id}`} 
            className="animate-slide-in"
            style={{ 
              position: 'relative', 
              height: '210px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '8px 0 16px'
            }}
          >
            {/* Ambient Radial Colored Glow beneath the 3D clay icon */}
            <div 
              style={{
                position: 'absolute',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${currentSlide.glowColor} 0%, rgba(0, 0, 0, 0) 70%)`,
                filter: 'blur(28px)',
                pointerEvents: 'none',
              }}
            />

            {/* The Big 3D Clay Icon Image */}
            <div 
              className="animate-float"
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img 
                src={currentSlide.imageSrc} 
                alt={currentSlide.title}
                style={{
                  width: '185px',
                  height: '185px',
                  objectFit: 'contain',
                  mixBlendMode: 'screen',
                  filter: 'drop-shadow(0 20px 35px rgba(0, 0, 0, 0.7))',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* Clean Headline & Copy (One Point at a Time) */}
          <div 
            key={`clay-text-${currentSlide.id}`} 
            className="animate-slide-in"
            style={{ minHeight: '96px', textAlign: 'left' }}
          >
            <h2
              style={{
                fontSize: '1.34rem',
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

          {/* Dots Navigation on the Bottom & Controls */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '16px',
              paddingTop: '16px',
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
            paddingTop: '16px',
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
