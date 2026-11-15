import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2, Layers } from 'lucide-react';

export const AuthView: React.FC = () => {
  const { signInCompanyAccount, registerCompanyAccount } = useApp();
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');

  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'var(--bg-canvas)',
        color: 'var(--text-primary)',
        display: 'grid',
        gridTemplateColumns: '1.05fr 0.95fr',
      }}
    >
      {/* Left Column: Product Architecture & Value Proposition */}
      <div
        style={{
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-subtle)',
          padding: '48px 56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'var(--lilac-subtle)',
              border: '1px solid var(--lilac-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--lilac-300)',
              fontWeight: 700,
              fontSize: '0.84rem',
            }}
          >
            A
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.94rem', letterSpacing: '-0.01em' }}>
            AutoFlow Studio
          </span>
          <span className="badge badge-lilac" style={{ marginLeft: '4px' }}>
            Multi-Tenant CRM
          </span>
        </div>

        {/* Center Editorial Pitch */}
        <div style={{ maxWidth: '480px' }}>
          <h1
            style={{
              fontSize: '2.1rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.18,
              color: 'var(--text-primary)',
              marginBottom: '16px',
            }}
          >
            Your company’s operating system for revenue, workflows, and docs.
          </h1>
          <p
            style={{
              fontSize: '0.94rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '32px',
            }}
          >
            Every organization gets a dedicated, isolated workspace engineered around its industry, team structure, and selected functional modules.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              {
                title: 'Tailored CRM Synthesis',
                desc: 'Interactive onboarding builds your pipeline, custom fields, and modules around your industry.',
              },
              {
                title: 'Automated Workflows & Unified Inbox',
                desc: 'Trigger multi-step SMS, WhatsApp, and email workflows directly from pipeline stage movements.',
              },
              {
                title: 'Multi-View Databases & Team SOPs',
                desc: 'Switch seamlessly between Table, Kanban Board, List, Calendar, and Gallery views.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <CheckCircle2
                  size={16}
                  style={{ color: 'var(--lilac-400)', marginTop: '2px', flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Meta */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '20px',
          }}
        >
          <span>Tenant-Isolated Workspace Architecture</span>
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
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
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
                background: mode === 'signup' ? 'var(--bg-elevated)' : 'transparent',
                color: mode === 'signup' ? 'var(--text-primary)' : 'var(--text-secondary)',
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
                background: mode === 'signin' ? 'var(--bg-elevated)' : 'transparent',
                color: mode === 'signin' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Sign In to Workspace
            </button>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px' }}>
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
              borderTop: '1px solid var(--border-subtle)',
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

