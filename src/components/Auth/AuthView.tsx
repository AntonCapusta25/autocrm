import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, Mail, Lock, User, ArrowRight, AlertCircle, 
  Layers
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
    imageSrc: '/assets/clay/chart.png',
    glowColor: 'rgba(167, 139, 250, 0.35)',
  },
  {
    id: 'workflows',
    tag: 'AUTONOMOUS WORKFLOWS',
    title: 'Self-Executing Triggers & Automation Chains',
    description: 'Deploy multi-step event triggers, automated lead routing, follow-up sequences, and instant webhook dispatches.',
    imageSrc: '/assets/clay/lightning.png',
    glowColor: 'rgba(196, 181, 253, 0.4)',
  },
  {
    id: 'inbox',
    tag: 'OMNICHANNEL MESSAGING',
    title: 'Unified Customer Stream & Speed-to-Lead',
    description: 'Consolidate every lead touchpoint across SMS, WhatsApp, and email into one synchronized stream with instant contact timeline records.',
    imageSrc: '/assets/clay/chat.png',
    glowColor: 'rgba(96, 165, 250, 0.35)',
  },
  {
    id: 'docs',
    tag: 'WORKSPACE & PLAYBOOKS',
    title: 'Multi-View Databases & Executive Playbooks',
    description: 'Switch between Table, Kanban Board, Calendar, and interactive document SOPs with complete workspace data isolation.',
    imageSrc: '/assets/clay/docs.png',
    glowColor: 'rgba(52, 211, 153, 0.3)',
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
      {/* Background Ambient Glows for Frozen Glass Sheen */}
      <div 
        style={{
          position: 'absolute',
          top: '-20%',
          left: '5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.18) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '20%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(96, 165, 250, 0.14) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Left Column: Heavy Frozen Glass Panel with Centered 3D Clay Icon, Text, and Animated Dots */}
      <div
        className="frozen-glass-pane"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          padding: '44px 56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Brand Header with Official AutoFlow Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 2 }}>
          <img 
            src="/logo.webp" 
            alt="AutoFlow Studio" 
            style={{
              width: '32px',
              height: '32px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 12px rgba(167, 139, 250, 0.4))',
            }}
            onError={(e) => {
              // Fallback to png if webp not supported
              (e.currentTarget as HTMLImageElement).src = '/logo.png';
            }}
          />
          <div>
            <span style={{ fontWeight: 700, fontSize: '0.98rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              AutoFlow Studio
            </span>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Multi-Tenant CRM & Operations
            </div>
          </div>
        </div>

        {/* Center: NO BOXES! Just Big 3D Clay Icon, Text, and Animated Steps/Dots */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '480px',
            margin: '0 auto',
            width: '100%',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Tag */}
          <div style={{ marginBottom: '14px' }}>
            <span 
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'var(--lilac-300)',
                textTransform: 'uppercase',
                opacity: 0.9,
              }}
            >
              {currentSlide.tag}
            </span>
          </div>

          {/* Big 3D Clay Icon (No Box Around It) */}
          <div 
            key={`clay-icon-${currentSlide.id}`}
            className="animate-slide-in"
            style={{ 
              position: 'relative', 
              width: '240px',
              height: '240px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 0 20px',
            }}
          >
            {/* Ambient Radial Colored Glow beneath the 3D clay icon */}
            <div 
              style={{
                position: 'absolute',
                width: '210px',
                height: '210px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${currentSlide.glowColor} 0%, rgba(0, 0, 0, 0) 70%)`,
                filter: 'blur(36px)',
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
                  width: '220px',
                  height: '220px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.6))',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* Text Below */}
          <div 
            key={`clay-text-${currentSlide.id}`}
            className="animate-slide-in"
            style={{ marginBottom: '28px' }}
          >
            <h2
              style={{
                fontSize: '1.45rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
                color: 'var(--text-main)',
                marginBottom: '10px',
              }}
            >
              {currentSlide.title}
            </h2>
            <p
              style={{
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '430px',
                margin: '0 auto',
              }}
            >
              {currentSlide.description}
            </p>
          </div>

          {/* Animated Steps / Dots Below */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            {SLIDES.map((slide, idx) => {
              const isActive = idx === activeSlideIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlideIndex(idx)}
                  title={slide.title}
                  style={{
                    height: '6px',
                    width: isActive ? '36px' : '6px',
                    borderRadius: '4px',
                    background: isActive ? 'var(--lilac-400)' : 'rgba(255, 255, 255, 0.22)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    padding: 0,
                    boxShadow: isActive ? '0 0 12px rgba(167, 139, 250, 0.65)' : 'none',
                  }}
                />
              );
            })}
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
            position: 'relative',
            zIndex: 2,
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
