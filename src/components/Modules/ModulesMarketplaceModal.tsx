import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CRM_MODULES_CATALOG, PAID_MODULES_CATALOG } from '../../lib/initialData';
import { PaidModuleDefinition, CRMModuleId } from '../../types';
import { 
  X, Sparkles, CheckCircle2, Clock, ShieldCheck, 
  Bot, MessageCircle, Database, Target, PhoneCall, 
  ExternalLink, Layers, ArrowRight, Zap, Check, FileText
} from 'lucide-react';

interface ModulesMarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSetup: (moduleId: string) => void;
}

const PAID_ICONS: Record<string, React.ReactNode> = {
  ai_voice: <PhoneCall size={20} style={{ color: '#a78bfa' }} />,
  whatsapp_cloud: <MessageCircle size={20} style={{ color: '#34d399' }} />,
  custom_erp: <Database size={20} style={{ color: '#60a5fa' }} />,
  custom_agents: <Bot size={20} style={{ color: '#c084fc' }} />,
  lead_scraping: <Target size={20} style={{ color: '#f472b6' }} />,
};

export const ModulesMarketplaceModal: React.FC<ModulesMarketplaceModalProps> = ({
  isOpen,
  onClose,
  onRequestSetup,
}) => {
  const { isModuleEnabled, toggleModule, moduleSetupRequests } = useApp();
  const [activeTab, setActiveTab] = useState<'paid' | 'core' | 'requests'>('paid');

  if (!isOpen) return null;

  return (
    <div className="notion-modal-overlay" style={{ zIndex: 1100 }}>
      <div 
        className="notion-modal-box animate-scale-in"
        style={{
          maxWidth: '860px',
          width: '94%',
          maxHeight: '88vh',
          background: 'var(--notion-panel)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(167, 139, 250, 0.1)',
          borderRadius: '14px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Top Header */}
        <div 
          style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--notion-panel)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'rgba(167, 139, 250, 0.12)',
                border: '1px solid rgba(167, 139, 250, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--lilac-300)',
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  Modules & Enterprise Ecosystem
                </h1>
                <span className="notion-badge lilac" style={{ fontSize: '0.68rem' }}>
                  AutoFlow Architecture
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Activate built-in core modules or request enterprise setup for heavy telecom, Meta Cloud & custom ERP integrations.
              </p>
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
            gap: '8px',
            padding: '10px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('paid')}
            className={`notion-tab-pill ${activeTab === 'paid' ? 'active' : ''}`}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeTab === 'paid' ? 'var(--lilac-subtle)' : 'transparent',
              border: activeTab === 'paid' ? '1px solid var(--lilac-border)' : '1px solid transparent',
              color: activeTab === 'paid' ? 'var(--lilac-300)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={14} /> Managed Enterprise Add-Ons ({PAID_MODULES_CATALOG.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('core')}
            className={`notion-tab-pill ${activeTab === 'core' ? 'active' : ''}`}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeTab === 'core' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              border: activeTab === 'core' ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid transparent',
              color: activeTab === 'core' ? 'var(--text-main)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <Layers size={14} /> Core Included Modules ({CRM_MODULES_CATALOG.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`notion-tab-pill ${activeTab === 'requests' ? 'active' : ''}`}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeTab === 'requests' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              border: activeTab === 'requests' ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid transparent',
              color: activeTab === 'requests' ? 'var(--text-main)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <Clock size={14} /> Active Requests ({moduleSetupRequests.length})
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {/* TAB 1: PAID / MANAGED SETUP MODULES */}
          {activeTab === 'paid' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div 
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'rgba(167, 139, 250, 0.08)',
                  border: '1px solid rgba(167, 139, 250, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--lilac-300)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    Heavy integrations require carrier registration (10DLC / SIP), Meta Green Tick verification, or custom schema mapping. Our dedicated engineering team configures, deploys, and monitors them for you.
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
                {PAID_MODULES_CATALOG.map((mod: PaidModuleDefinition) => {
                  const pendingReq = moduleSetupRequests.find(r => r.module_id === mod.id);

                  return (
                    <div 
                      key={mod.id}
                      className="notion-card"
                      style={{
                        padding: '18px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '14px',
                        borderRadius: '10px',
                        background: 'var(--notion-card)',
                        border: '1px solid var(--border-subtle)',
                        transition: 'transform 0.15s ease, border-color 0.15s ease',
                      }}
                    >
                      <div>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div 
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '8px',
                                background: 'rgba(255, 255, 255, 0.04)',
                                border: '1px solid var(--border-subtle)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {PAID_ICONS[mod.id] || <Sparkles size={18} style={{ color: 'var(--lilac-300)' }} />}
                            </div>
                            <div>
                              <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                                {mod.name}
                              </h3>
                              <span style={{ fontSize: '0.72rem', color: 'var(--lilac-300)', fontWeight: 600 }}>
                                {mod.priceNote} · {mod.setupTime}
                              </span>
                            </div>
                          </div>

                          {pendingReq ? (
                            <span className="notion-badge lilac" style={{ fontSize: '0.68rem', whiteSpace: 'nowrap' }}>
                              In Review
                            </span>
                          ) : (
                            <span className="notion-badge" style={{ fontSize: '0.68rem', whiteSpace: 'nowrap' }}>
                              Paid Add-On
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                          {mod.description}
                        </p>

                        {/* Deliverables */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          {mod.deliverables.slice(0, 3).map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              <Check size={13} style={{ color: '#34d399', flexShrink: 0 }} />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer CTA */}
                      <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          SLA: {mod.setupTime}
                        </span>

                        {pendingReq ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--lilac-300)', fontWeight: 600 }}>
                            <Clock size={13} /> Request Submitted
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-lilac"
                            onClick={() => {
                              onClose();
                              onRequestSetup(mod.id);
                            }}
                            style={{
                              padding: '6px 14px',
                              fontSize: '0.78rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            Request Setup <ArrowRight size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CORE INCLUDED MODULES */}
          {activeTab === 'core' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
              {CRM_MODULES_CATALOG.map(mod => {
                const isEnabled = isModuleEnabled(mod.id);
                return (
                  <div
                    key={mod.id}
                    className="notion-card"
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      background: 'var(--notion-card)',
                      border: isEnabled ? '1px solid var(--border-subtle)' : '1px dashed var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          {mod.name}
                        </span>
                        <span 
                          className={`notion-badge ${isEnabled ? 'green' : ''}`}
                          style={{ fontSize: '0.68rem' }}
                        >
                          {isEnabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {mod.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      className={`btn ${isEnabled ? 'btn-secondary' : 'btn-lilac'}`}
                      onClick={() => toggleModule(mod.id as CRMModuleId)}
                      style={{ fontSize: '0.74rem', padding: '5px 10px', width: '100%' }}
                    >
                      {isEnabled ? 'Disable Module' : 'Enable in Workspace'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: ACTIVE REQUESTS */}
          {activeTab === 'requests' && (
            <div>
              {moduleSetupRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
                  <Clock size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                    No Active Setup Requests
                  </h3>
                  <p style={{ fontSize: '0.82rem', maxWidth: '360px', margin: '0 auto 16px' }}>
                    When you request an enterprise telecom, WhatsApp Cloud, or ERP setup, track its engineering progress here.
                  </p>
                  <button 
                    type="button" 
                    className="btn btn-lilac"
                    onClick={() => setActiveTab('paid')}
                    style={{ fontSize: '0.82rem', padding: '7px 16px' }}
                  >
                    Explore Enterprise Modules
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {moduleSetupRequests.map(req => (
                    <div 
                      key={req.id}
                      className="notion-card"
                      style={{
                        padding: '16px 20px',
                        borderRadius: '10px',
                        background: 'var(--notion-card)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {req.module_name}
                          </span>
                          <span className="notion-badge lilac" style={{ fontSize: '0.68rem' }}>
                            {req.status === 'pending_review' ? 'Pending Engineer Review' : req.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          Scope: "{req.message}"
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Requested on {new Date(req.created_at).toLocaleDateString()} · Contact: {req.contact_name} ({req.phone})
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 600 }}>
                          24h SLA Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
