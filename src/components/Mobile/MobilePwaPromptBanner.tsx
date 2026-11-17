import React, { useState, useEffect } from 'react';
import { Smartphone, X, ArrowRight, Bell } from 'lucide-react';

interface MobilePwaPromptBannerProps {
  onOpenMobileModal: () => void;
}

export const MobilePwaPromptBanner: React.FC<MobilePwaPromptBannerProps> = ({ onOpenMobileModal }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if running as standalone PWA
    if (typeof window !== 'undefined') {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
      setIsStandalone(!!standalone);

      // Check if user previously dismissed banner in this session
      const dismissed = sessionStorage.getItem('autoflow_pwa_banner_dismissed');
      if (!standalone && !dismissed) {
        // Small delay so it smoothly slides in after initial load
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    }

    // Listen for Chrome beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    sessionStorage.setItem('autoflow_pwa_banner_dismissed', 'true');
  };

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          setIsVisible(false);
        }
        setDeferredPrompt(null);
      });
    } else {
      onOpenMobileModal();
    }
  };

  if (isStandalone || !isVisible) {
    return null;
  }

  return (
    <div 
      className="animate-slide-in"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 990,
        maxWidth: '380px',
        width: 'calc(100vw - 32px)',
        background: 'rgba(17, 20, 28, 0.92)',
        border: '1px solid rgba(167, 139, 250, 0.35)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: '14px',
        padding: '14px 16px',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8), 0 0 24px rgba(167, 139, 250, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <div 
        onClick={onOpenMobileModal}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(167, 139, 250, 0.12)',
            border: '1px solid rgba(167, 139, 250, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <img 
            src="/assets/clay/lightning.png" 
            alt="PWA" 
            style={{ width: '26px', height: '26px', objectFit: 'contain' }} 
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Try on Mobile (PWA)
            </span>
            <span 
              style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                padding: '1px 5px',
                borderRadius: '4px',
                background: 'rgba(96, 165, 250, 0.15)',
                color: '#60a5fa',
                border: '1px solid rgba(96, 165, 250, 0.3)',
              }}
            >
              APP
            </span>
          </div>
          <div 
            style={{
              fontSize: '0.74rem',
              color: 'var(--text-secondary)',
              marginTop: '2px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            Install to home screen & push alerts
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <button
          type="button"
          onClick={handleInstallClick}
          className="btn btn-lilac btn-sm"
          style={{
            padding: '6px 12px',
            fontSize: '0.76rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>Setup</span>
          <ArrowRight size={12} />
        </button>

        <button
          type="button"
          onClick={handleDismiss}
          title="Dismiss notification"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-main)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};

