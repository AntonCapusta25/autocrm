import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, ArrowRight, ArrowLeft, Check, Smartphone
} from 'lucide-react';

interface WorkspaceIntroTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMobileGuide?: () => void;
}

interface TourSlide {
  tag: string;
  title: string;
  description: string;
  imageSrc: string;
  glowColor: string;
  ctaText?: string;
}

const TOUR_SLIDES: TourSlide[] = [
  {
    tag: 'WORKSPACE ARCHITECTURE',
    title: 'Your Executive Notion-Style CRM is Live',
    description: 'A dark obsidian, distraction-free command center for your entire revenue operation. Switch instantly between Table, Kanban Board, Calendar, and SOP Documents.',
    imageSrc: '/assets/clay/docs.png',
    glowColor: 'rgba(167, 139, 250, 0.4)',
  },
  {
    tag: 'PIPELINE VELOCITY',
    title: 'Visual Deal Stages & Revenue Velocity',
    description: 'Track deals from initial touch to closed-won. Drag and drop opportunities, forecast quarterly cashflow, and receive warnings on stalled prospects.',
    imageSrc: '/assets/clay/chart.png',
    glowColor: 'rgba(96, 165, 250, 0.4)',
  },
  {
    tag: 'OMNICHANNEL MESSAGING',
    title: 'Unified Inbox & Speed-to-Lead',
    description: 'Consolidate 2-way SMS, WhatsApp, and Email conversations in one timeline. Auto-respond to incoming leads in under 60 seconds with self-executing triggers.',
    imageSrc: '/assets/clay/chat.png',
    glowColor: 'rgba(52, 211, 153, 0.4)',
  },
  {
    tag: 'PROGRESSIVE WEB APP',
    title: 'Optimized for Mobile & Instant Push Alerts',
    description: 'Install AutoFlow Studio directly to your iPhone or Android home screen without an app store. Receive real-time push notifications on deals and overdue tasks.',
    imageSrc: '/assets/clay/lightning.png',
    glowColor: 'rgba(244, 114, 182, 0.4)',
    ctaText: 'Install PWA on Mobile',
  },
];

export const WorkspaceIntroTourModal: React.FC<WorkspaceIntroTourModalProps> = ({
  isOpen,
  onClose,
  onOpenMobileGuide,
}) => {
  const { currentWorkspace } = useApp();
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  if (!isOpen) return null;

  const currentSlide = TOUR_SLIDES[activeSlideIdx];
  const isLast = activeSlideIdx === TOUR_SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setActiveSlideIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeSlideIdx > 0) {
      setActiveSlideIdx(prev => prev - 1);
    }
  };

  return (
    <div className="notion-modal-overlay" style={{ zIndex: 1300 }}>
      <div 
        className="notion-modal-box animate-scale-in"
        style={{
          maxWidth: '540px',
          width: '92%',
          background: 'var(--notion-panel)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 50px rgba(167, 139, 250, 0.12)',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Top ambient highlight */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: '20%',
            right: '20%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--lilac-400), transparent)',
          }}
        />

        {/* Top Skip & Close */}
        <div 
          style={{
            padding: '16px 20px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--lilac-300)', textTransform: 'uppercase' }}>
            WELCOME TO {currentWorkspace.name.toUpperCase()}
          </span>

          <button 
            type="button"
            className="notion-action-btn"
            onClick={onClose}
            title="Skip Tour"
            style={{ width: '28px', height: '28px' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Centered Presentation (Exact Auth-Screen Style) */}
        <div 
          style={{
            padding: '24px 32px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Tag */}
          <div style={{ marginBottom: '14px' }}>
            <span className="notion-badge lilac" style={{ fontSize: '0.68rem', letterSpacing: '0.06em' }}>
              {currentSlide.tag}
            </span>
          </div>

          {/* Centered 3D Clay Icon with Floating Animation & Glow */}
          <div 
            key={`tour-icon-${activeSlideIdx}`}
            className="animate-slide-in"
            style={{ 
              position: 'relative', 
              width: '180px', 
              height: '180px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 0 16px',
            }}
          >
            {/* Ambient Radial Colored Glow beneath the 3D clay icon */}
            <div 
              style={{
                position: 'absolute',
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${currentSlide.glowColor} 0%, rgba(0, 0, 0, 0) 70%)`,
                filter: 'blur(30px)',
                pointerEvents: 'none',
              }}
            />

            <div className="animate-float" style={{ position: 'relative', zIndex: 2 }}>
              <img 
                src={currentSlide.imageSrc} 
                alt={currentSlide.title}
                style={{
                  width: '160px',
                  height: '160px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.75))',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* Slide Text */}
          <div 
            key={`tour-text-${activeSlideIdx}`}
            className="animate-slide-in"
            style={{ marginBottom: '22px' }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '8px', lineHeight: 1.3 }}>
              {currentSlide.title}
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55, maxWidth: '380px', margin: '0 auto' }}>
              {currentSlide.description}
            </p>
          </div>

          {/* Animated Step Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            {TOUR_SLIDES.map((_, idx) => {
              const isActive = idx === activeSlideIdx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlideIdx(idx)}
                  style={{
                    height: '5px',
                    width: isActive ? '30px' : '5px',
                    borderRadius: '3px',
                    background: isActive ? 'var(--lilac-400)' : 'rgba(255, 255, 255, 0.22)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isActive ? '0 0 10px rgba(167, 139, 250, 0.6)' : 'none',
                  }}
                />
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '12px' }}>
            {activeSlideIdx > 0 ? (
              <button 
                type="button"
                className="btn btn-secondary"
                onClick={handlePrev}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
              >
                <ArrowLeft size={14} /> Back
              </button>
            ) : (
              <button 
                type="button"
                className="btn btn-ghost"
                onClick={onClose}
                style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
              >
                Skip Tour
              </button>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              {isLast && onOpenMobileGuide && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    onClose();
                    onOpenMobileGuide();
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', borderColor: 'var(--lilac-border)', color: 'var(--lilac-300)' }}
                >
                  <Smartphone size={14} /> Try on Mobile
                </button>
              )}

              <button 
                type="button"
                className="btn btn-lilac"
                onClick={handleNext}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', padding: '8px 20px' }}
              >
                {isLast ? <>Get Started <Check size={14} /></> : <>Next <ArrowRight size={14} /></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
