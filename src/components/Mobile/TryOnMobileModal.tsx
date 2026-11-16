import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, Smartphone, Bell, CheckCircle2, ArrowRight, 
  Share, PlusSquare, QrCode, Sparkles, Check, 
  ExternalLink, ShieldCheck, Download
} from 'lucide-react';

interface TryOnMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TryOnMobileModal: React.FC<TryOnMobileModalProps> = ({ isOpen, onClose }) => {
  const { 
    notificationPreferences, 
    updateNotificationPreferences, 
    requestPushPermission, 
    sendTestNotification 
  } = useApp();

  const [platform, setPlatform] = useState<'ios' | 'android' | 'qr'>('ios');
  const [pushStatus, setPushStatus] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as installed standalone PWA
    if (typeof window !== 'undefined') {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
      setIsStandalone(!!isStandaloneMode);
      if ('Notification' in window) {
        setPushStatus(Notification.permission);
      }
    }
  }, []);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://autoflow.studio';

  const handleEnablePush = async () => {
    const perm = await requestPushPermission();
    setPushStatus(perm);
    if (perm === 'granted') {
      const res = await sendTestNotification('push');
      setTestResult(res.message);
    } else {
      setTestResult('Permission denied. Please enable notifications in your browser settings.');
    }
  };

  const handleTestPush = async () => {
    const res = await sendTestNotification('push');
    setTestResult(res.message);
    setTimeout(() => setTestResult(null), 4000);
  };

  return (
    <div className="notion-modal-overlay" style={{ zIndex: 1280 }}>
      <div 
        className="notion-modal-box animate-scale-in"
        style={{
          maxWidth: '560px',
          width: '92%',
          background: 'var(--notion-panel)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 50px rgba(167, 139, 250, 0.12)',
          borderRadius: '14px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Top Header */}
        <div 
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(167, 139, 250, 0.12)',
                border: '1px solid rgba(167, 139, 250, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img 
                src="/assets/clay/lightning.png" 
                alt="PWA Mobile" 
                style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  Try on Mobile (PWA)
                </h2>
                <span className="notion-badge lilac" style={{ fontSize: '0.66rem' }}>
                  Native Feel
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Install to your phone's Home Screen & enable real-time push alerts
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

        {/* Tab Switcher */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 22px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(0, 0, 0, 0.25)',
          }}
        >
          <button
            type="button"
            onClick={() => setPlatform('ios')}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: platform === 'ios' ? 'var(--lilac-subtle)' : 'transparent',
              border: platform === 'ios' ? '1px solid var(--lilac-border)' : '1px solid transparent',
              color: platform === 'ios' ? 'var(--lilac-300)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            🍎 iPhone / Safari
          </button>
          <button
            type="button"
            onClick={() => setPlatform('android')}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: platform === 'android' ? 'var(--lilac-subtle)' : 'transparent',
              border: platform === 'android' ? '1px solid var(--lilac-border)' : '1px solid transparent',
              color: platform === 'android' ? 'var(--lilac-300)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            🤖 Android / Chrome
          </button>
          <button
            type="button"
            onClick={() => setPlatform('qr')}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: platform === 'qr' ? 'var(--lilac-subtle)' : 'transparent',
              border: platform === 'qr' ? '1px solid var(--lilac-border)' : '1px solid transparent',
              color: platform === 'qr' ? 'var(--lilac-300)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            📱 Scan QR Code
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isStandalone && (
            <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(52, 211, 153, 0.12)', border: '1px solid rgba(52, 211, 153, 0.3)', color: '#34d399', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={15} />
              <span>You are currently running in installed PWA standalone mode!</span>
            </div>
          )}

          {/* PLATFORM: iOS Safari */}
          {platform === 'ios' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Follow these 2 steps in Safari on your iPhone or iPad:
              </div>

              <div 
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: 'var(--notion-card)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', flexShrink: 0 }}>
                  <Share size={15} />
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    1. Tap the Share button in Safari
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Located at the bottom navigation toolbar in Mobile Safari
                  </div>
                </div>
              </div>

              <div 
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: 'var(--notion-card)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(167, 139, 250, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lilac-300)', flexShrink: 0 }}>
                  <PlusSquare size={15} />
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    2. Select "Add to Home Screen"
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    AutoFlow Studio will install with our high-resolution app icon and full-screen display
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PLATFORM: Android Chrome */}
          {platform === 'android' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Follow these steps in Google Chrome on your Android device:
              </div>

              <div 
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: 'var(--notion-card)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', flexShrink: 0 }}>
                  <Download size={15} />
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    1. Tap the three dots (⋮) menu in Chrome
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Look for "Install app" or "Add to Home Screen"
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PLATFORM: QR Code Scanner */}
          {platform === 'qr' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px', padding: '10px 0' }}>
              <div 
                style={{
                  padding: '16px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
                }}
              >
                {/* SVG Stylized QR Code */}
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <rect width="150" height="150" fill="#ffffff" />
                  {/* Outer corner squares */}
                  <rect x="10" y="10" width="40" height="40" fill="#070809" rx="4" />
                  <rect x="18" y="18" width="24" height="24" fill="#ffffff" rx="2" />
                  <rect x="24" y="24" width="12" height="12" fill="#070809" rx="2" />

                  <rect x="100" y="10" width="40" height="40" fill="#070809" rx="4" />
                  <rect x="108" y="18" width="24" height="24" fill="#ffffff" rx="2" />
                  <rect x="114" y="24" width="12" height="12" fill="#070809" rx="2" />

                  <rect x="10" y="100" width="40" height="40" fill="#070809" rx="4" />
                  <rect x="18" y="108" width="24" height="24" fill="#ffffff" rx="2" />
                  <rect x="24" y="114" width="12" height="12" fill="#070809" rx="2" />

                  {/* Interior data matrix pattern */}
                  <rect x="60" y="15" width="8" height="16" fill="#8b5cf6" />
                  <rect x="75" y="15" width="12" height="8" fill="#070809" />
                  <rect x="60" y="40" width="25" height="8" fill="#070809" />
                  <rect x="65" y="55" width="18" height="18" fill="#8b5cf6" rx="2" />
                  <rect x="10" y="60" width="15" height="8" fill="#070809" />
                  <rect x="35" y="60" width="12" height="15" fill="#8b5cf6" />
                  <rect x="100" y="60" width="20" height="8" fill="#070809" />
                  <rect x="125" y="60" width="12" height="18" fill="#8b5cf6" />
                  <rect x="60" y="85" width="14" height="25" fill="#070809" />
                  <rect x="85" y="85" width="25" height="10" fill="#070809" />
                  <rect x="115" y="90" width="18" height="16" fill="#8b5cf6" />
                  <rect x="65" y="120" width="20" height="14" fill="#8b5cf6" />
                  <rect x="95" y="115" width="30" height="15" fill="#070809" />
                </svg>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600, marginTop: '4px' }}>
                Scan with your iPhone or Android Camera
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Opens: <code style={{ color: 'var(--lilac-300)' }}>{currentUrl}</code>
              </div>
            </div>
          )}

          {/* Web Push Notification Activation Card */}
          <div 
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              background: 'rgba(167, 139, 250, 0.05)',
              border: '1px solid rgba(167, 139, 250, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={16} style={{ color: 'var(--lilac-400)' }} />
                <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Web Push Notifications
                </span>
              </div>

              <span 
                className={`notion-badge ${pushStatus === 'granted' ? 'green' : 'lilac'}`}
                style={{ fontSize: '0.68rem' }}
              >
                {pushStatus === 'granted' ? 'Enabled' : pushStatus === 'denied' ? 'Blocked' : 'Not Granted'}
              </span>
            </div>

            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              Receive instant alerts on deal stage progressions, inbound SMS/WhatsApp messages, and overdue tasks.
            </p>

            <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
              {pushStatus !== 'granted' ? (
                <button
                  type="button"
                  className="btn btn-lilac btn-sm"
                  onClick={handleEnablePush}
                  style={{ fontSize: '0.76rem', padding: '6px 14px' }}
                >
                  Enable Push Notifications
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleTestPush}
                  style={{ fontSize: '0.76rem', padding: '6px 14px' }}
                >
                  Send Test Push Notification
                </button>
              )}
            </div>

            {testResult && (
              <div style={{ fontSize: '0.74rem', color: 'var(--lilac-300)', marginTop: '2px' }}>
                ℹ️ {testResult}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

