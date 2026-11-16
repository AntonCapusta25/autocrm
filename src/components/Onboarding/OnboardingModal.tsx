import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CRM_MODULES_CATALOG, PAID_MODULES_CATALOG, INDUSTRY_TEMPLATES } from '../../lib/initialData';
import { CRMModuleId, OnboardingConfig } from '../../types';
import { 
  Check, ArrowRight, ArrowLeft, Sparkles, Building2, Users, 
  Briefcase, Layers, CheckCircle2, ChevronRight, Zap, 
  MessageSquare, Calendar, FileText, CheckSquare, ShieldCheck,
  KanbanSquare, Terminal
} from 'lucide-react';

interface OnboardingModalProps {
  onClose?: () => void;
}

const ROLES = [
  { id: 'Founder & CEO', label: 'Founder & CEO', desc: 'Holistic revenue, high-level reporting & vision', icon: '🚀' },
  { id: 'Head of Sales', label: 'Head of Sales / VP Revenue', desc: 'Pipelines, closing velocity & deal quotas', icon: '📈' },
  { id: 'Marketing Lead', label: 'Marketing & Growth Director', desc: 'Lead generation, campaigns & inbox intake', icon: '🎯' },
  { id: 'Operations Lead', label: 'Operations & RevOps', desc: 'Process automation, webhooks & team SOPs', icon: '⚙️' },
  { id: 'Agency Owner', label: 'Agency Owner / Partner', desc: 'Client onboarding, retainers & deliverables', icon: '🎨' },
  { id: 'Consultant', label: 'Independent Consultant / Practice', desc: 'Client advisory, bookings & project wiki', icon: '💡' },
];

const ORG_SIZES = [
  { id: '1 - 5 employees', label: '1 - 5', desc: 'Boutique startup or studio' },
  { id: '6 - 20 employees', label: '6 - 20', desc: 'Fast-moving growing business' },
  { id: '21 - 50 employees', label: '21 - 50', desc: 'Established scaling organization' },
  { id: '51 - 200 employees', label: '51 - 200', desc: 'Mid-market commercial team' },
  { id: '200+ employees', label: '200+', desc: 'Multi-department enterprise' },
];

const TEAM_SIZES = [
  { id: 'Just me (1)', label: 'Solo Operator', desc: 'Single user workspace' },
  { id: '2 - 5 members', label: '2 - 5 Reps', desc: 'Close-knit core squad' },
  { id: '6 - 15 members', label: '6 - 15 Reps', desc: 'Multi-tiered sales & account team' },
  { id: '16+ members', label: '16+ Members', desc: 'Full commercial department' },
];

const INDUSTRIES = [
  { id: 'B2B SaaS & Tech', label: 'B2B SaaS & Tech', desc: 'Recurring subscriptions, demos, API workflows', icon: '💻' },
  { id: 'Marketing & Creative Agency', label: 'Marketing & Creative Agency', desc: 'Client retainers, pitches, deliverables & campaigns', icon: '🎨' },
  { id: 'Real Estate & Property Management', label: 'Real Estate & Property', desc: 'Dealflow, acquisitions, buyer listings & closings', icon: '🏢' },
  { id: 'E-Commerce & DTC Brands', label: 'E-Commerce & DTC Brands', desc: 'Inbound customers, influencer partners, support chat', icon: '🛍️' },
  { id: 'Healthcare & Clinics', label: 'Healthcare & Wellness', desc: 'Patient appointments, clinic intake, HIPAA protocols', icon: '🏥' },
  { id: 'Legal & Financial Services', label: 'Legal & Financial Advisory', desc: 'Wealth management, retainers, compliance docs', icon: '⚖️' },
  { id: 'Home Services & Contracting', label: 'Home Services & Contracting', desc: 'Dispatch jobs, quotes, field appointments & SMS', icon: '🛠️' },
  { id: 'Consulting & Professional Services', label: 'Management Consulting', desc: 'Strategic proposals, client wikis & deliverables', icon: '📊' },
];

const MODULE_ICONS: Record<string, React.ReactNode> = {
  contacts: <Users size={16} />,
  companies: <Building2 size={16} />,
  pipeline: <KanbanSquare size={16} />,
  workflows: <Zap size={16} />,
  conversations: <MessageSquare size={16} />,
  calendar: <Calendar size={16} />,
  docs: <FileText size={16} />,
  tasks: <CheckSquare size={16} />,
  team: <ShieldCheck size={16} />,
};

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const { onboardingConfig, saveOnboarding, currentWorkspace, openModuleSetupModal } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedRole, setSelectedRole] = useState<string>(onboardingConfig.role || ROLES[0].id);
  const [selectedOrgSize, setSelectedOrgSize] = useState<string>(onboardingConfig.companySize || ORG_SIZES[2].id);
  const [selectedTeamSize, setSelectedTeamSize] = useState<string>(onboardingConfig.teamSize || TEAM_SIZES[1].id);
  const [selectedIndustry, setSelectedIndustry] = useState<string>(onboardingConfig.industry || INDUSTRIES[0].id);
  const [enabledModules, setEnabledModules] = useState<CRMModuleId[]>(
    (onboardingConfig.enabledModules as CRMModuleId[]) || CRM_MODULES_CATALOG.map(m => m.id)
  );

  // Construction Synthesis State
  const [synthesizing, setSynthesizing] = useState(false);
  const [synthesisProgress, setSynthesisProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // Auto-tune recommended modules when industry changes
  useEffect(() => {
    const template = INDUSTRY_TEMPLATES[selectedIndustry];
    if (template && template.recommendedModules) {
      setEnabledModules(template.recommendedModules as CRMModuleId[]);
    }
  }, [selectedIndustry]);

  const handleToggleModule = (modId: CRMModuleId) => {
    setEnabledModules(prev => 
      prev.includes(modId) 
        ? prev.filter(m => m !== modId)
        : [...prev, modId]
    );
  };

  const handleStartSynthesis = () => {
    setSynthesizing(true);
    setSynthesisProgress(10);
    setTerminalLogs([`[INIT] Initializing workspace engine for "${currentWorkspace.name}"...`]);

    const logs = [
      `[STEP 1/5] Synthesizing role configuration for "${selectedRole}" (${selectedTeamSize})...`,
      `[STEP 2/5] Calibrating ${selectedIndustry} domain vocabulary & deal pipeline stages...`,
      `[STEP 3/5] Configuring automation engine (SMS speed-to-lead & stage triggers)...`,
      `[STEP 4/5] Provisioning multi-view databases (Table, Board, Calendar & Documents)...`,
      `[STEP 5/5] Enabling ${enabledModules.length} selected CRM modules & RBAC permissions...`,
      `[COMPLETE] ${currentWorkspace.name} workspace successfully constructed!`
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, log]);
        setSynthesisProgress(Math.min(100, Math.round(((index + 1) / logs.length) * 100)));

        if (index === logs.length - 1) {
          setTimeout(() => {
            const finalConfig: OnboardingConfig = {
              role: selectedRole,
              companySize: selectedOrgSize,
              teamSize: selectedTeamSize,
              industry: selectedIndustry,
              enabledModules,
              completed: true,
              configuredAt: new Date().toISOString(),
            };
            saveOnboarding(finalConfig);
            if (onClose) onClose();
          }, 800);
        }
      }, (index + 1) * 600);
    });
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 120 }}>
      <div 
        className="modal-card" 
        style={{ 
          maxWidth: '780px', 
          width: '92%', 
          maxHeight: '92vh',
          background: 'var(--notion-deep-black)',
          border: '1px solid var(--notion-border-light)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.95)'
        }}
      >
        {/* Onboarding Header */}
        <div 
          style={{ 
            padding: '20px 28px', 
            borderBottom: '1px solid var(--notion-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--notion-sidebar)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                color: 'var(--lilac-300)'
              }}
            >
              <Sparkles size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                Construct Your Custom CRM
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Workspace Architecture & Module Configuration
              </div>
            </div>
          </div>

          {!synthesizing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {[1, 2, 3, 4].map(s => (
                <div 
                  key={s}
                  style={{
                    width: '26px',
                    height: '5px',
                    borderRadius: '3px',
                    background: s === step 
                      ? 'var(--lilac-400)' 
                      : s < step 
                        ? 'rgba(167, 139, 250, 0.4)' 
                        : 'rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '24px 28px', minHeight: '440px' }}>
          {synthesizing ? (
            /* Synthesis Terminal */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0' }}>
              <div style={{ textAlign: 'center' }}>
                <div 
                  style={{ 
                    display: 'inline-flex', 
                    padding: '8px 16px', 
                    borderRadius: '20px', 
                    background: 'var(--lilac-bg-subtle)',
                    border: '1px solid var(--lilac-border)',
                    color: 'var(--lilac-300)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '10px'
                  }}
                >
                  <Terminal size={14} />
                  Constructing CRM Workspace Architecture
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Assembling {selectedIndustry} Workspace
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Provisioning {enabledModules.length} selected modules tailored for {selectedRole}...
                </p>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${synthesisProgress}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #A78BFA 0%, #C4B5FD 100%)',
                    transition: 'width 0.4s ease'
                  }} 
                />
              </div>

              {/* Terminal Output */}
              <div 
                style={{ 
                  background: '#040507', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: '10px', 
                  padding: '16px 18px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  lineHeight: '1.6',
                  color: '#94a3b8',
                  minHeight: '220px',
                  maxHeight: '260px',
                  overflowY: 'auto'
                }}
              >
                {terminalLogs.map((log, i) => (
                  <div key={i} style={{ color: log.includes('COMPLETE') ? '#34d399' : log.includes('STEP') ? '#c4b5fd' : '#94a3b8' }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          ) : step === 1 ? (
            /* Step 1: Your Role */
            <div>
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  What is your primary role?
                </div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  We tailor your workspace views, dashboard KPI widgets, and default automations to how you work.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                {ROLES.map(role => {
                  const isSelected = selectedRole === role.id;
                  return (
                    <div 
                      key={role.id}
                      className={`onboarding-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedRole(role.id)}
                    >
                      <span style={{ fontSize: '1.4rem' }}>{role.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: isSelected ? 'var(--lilac-300)' : 'var(--text-main)' }}>
                          {role.label}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {role.desc}
                        </div>
                      </div>
                      {isSelected && (
                        <div style={{ color: 'var(--lilac-400)', marginTop: '2px' }}>
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : step === 2 ? (
            /* Step 2: Org & Team Size */
            <div>
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  How large is your organization and team?
                </div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Ensures correct task routing, round-robin lead allocation, and team collaboration defaults.
                </div>
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Total Organization Headcount
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                  {ORG_SIZES.map(org => {
                    const isSelected = selectedOrgSize === org.id;
                    return (
                      <button
                        key={org.id}
                        type="button"
                        onClick={() => setSelectedOrgSize(org.id)}
                        style={{
                          background: isSelected ? 'var(--lilac-bg-subtle)' : 'var(--notion-surface-card)',
                          border: `1px solid ${isSelected ? 'var(--lilac-400)' : 'var(--notion-border)'}`,
                          borderRadius: '8px',
                          padding: '12px 10px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isSelected ? 'var(--lilac-300)' : 'var(--text-main)' }}>
                          {org.label}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {org.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Commercial / Sales Team Size
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                  {TEAM_SIZES.map(team => {
                    const isSelected = selectedTeamSize === team.id;
                    return (
                      <button
                        key={team.id}
                        type="button"
                        onClick={() => setSelectedTeamSize(team.id)}
                        style={{
                          background: isSelected ? 'var(--lilac-bg-subtle)' : 'var(--notion-surface-card)',
                          border: `1px solid ${isSelected ? 'var(--lilac-400)' : 'var(--notion-border)'}`,
                          borderRadius: '8px',
                          padding: '12px 14px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isSelected ? 'var(--lilac-300)' : 'var(--text-main)' }}>
                            {team.label}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                            {team.desc}
                          </div>
                        </div>
                        {isSelected && <Check size={14} style={{ color: 'var(--lilac-300)' }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : step === 3 ? (
            /* Step 3: Industry Field */
            <div>
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Select your primary industry
                </div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  We configure your pipeline stages, custom attributes, and recommended workspace modules.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                {INDUSTRIES.map(ind => {
                  const isSelected = selectedIndustry === ind.id;
                  return (
                    <div 
                      key={ind.id}
                      className={`onboarding-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedIndustry(ind.id)}
                    >
                      <span style={{ fontSize: '1.3rem' }}>{ind.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.86rem', fontWeight: 600, color: isSelected ? 'var(--lilac-300)' : 'var(--text-main)' }}>
                          {ind.label}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {ind.desc}
                        </div>
                      </div>
                      {isSelected && (
                        <div style={{ color: 'var(--lilac-400)', marginTop: '2px' }}>
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Step 4: CRM Modules Customizer */
            <div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Construct Your CRM Modules
                </div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Based on <strong style={{ color: 'var(--lilac-300)' }}>{selectedIndustry}</strong>, we pre-selected the recommended functional modules for your workspace. Toggle any module to customize your setup:
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                {CRM_MODULES_CATALOG.map(mod => {
                  const isEnabled = enabledModules.includes(mod.id);
                  return (
                    <div
                      key={mod.id}
                      onClick={() => handleToggleModule(mod.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '8px',
                        background: isEnabled ? 'var(--notion-surface-card)' : 'rgba(255, 255, 255, 0.02)',
                        border: `1px solid ${isEnabled ? 'var(--notion-border-light)' : 'rgba(255, 255, 255, 0.05)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        transition: 'all 0.15s ease',
                        opacity: isEnabled ? 1 : 0.6
                      }}
                    >
                      <div 
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: isEnabled ? 'var(--lilac-bg-subtle)' : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${isEnabled ? 'var(--lilac-border)' : 'transparent'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isEnabled ? 'var(--lilac-300)' : 'var(--text-muted)',
                          marginTop: '2px'
                        }}
                      >
                        {MODULE_ICONS[mod.id]}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isEnabled ? 'var(--text-main)' : 'var(--text-secondary)' }}>
                            {mod.name}
                          </span>
                          <span 
                            style={{ 
                              fontSize: '0.66rem', 
                              padding: '1px 5px', 
                              borderRadius: '4px',
                              background: mod.category === 'automation' 
                                ? 'rgba(167, 139, 250, 0.15)' 
                                : mod.category === 'workspace' 
                                  ? 'rgba(96, 165, 250, 0.15)' 
                                  : 'rgba(255, 255, 255, 0.07)',
                              color: mod.category === 'automation' ? '#c4b5fd' : mod.category === 'workspace' ? '#93c5fd' : '#94a3b8'
                            }}
                          >
                            {mod.category === 'automation' ? 'Automation' : mod.category === 'workspace' ? 'Workspace' : 'Core'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.3 }}>
                          {mod.description}
                        </div>
                      </div>

                      {/* Custom Checkbox */}
                      <div 
                        className={`notion-checkbox ${isEnabled ? 'checked' : ''}`}
                        style={{ marginTop: '4px' }}
                      >
                        {isEnabled && <Check size={11} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Enterprise Add-on Modules (Managed Setup Required) */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--lilac-300)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      ✨ ENTERPRISE ADD-ON MODULES (MANAGED SETUP)
                    </span>
                    <span className="notion-badge lilac" style={{ fontSize: '0.64rem' }}>Custom Setup</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Configured by AutoFlow Engineers
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px' }}>
                  {PAID_MODULES_CATALOG.map(mod => (
                    <div
                      key={mod.id}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: 'rgba(167, 139, 250, 0.03)',
                        border: '1px dashed rgba(167, 139, 250, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {mod.name}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '1px' }}>
                          {mod.priceNote} · {mod.setupTime}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => openModuleSetupModal(mod.id)}
                        style={{ fontSize: '0.7rem', padding: '3px 8px', flexShrink: 0, borderColor: 'var(--lilac-border)', color: 'var(--lilac-300)' }}
                      >
                        Request →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!synthesizing && (
          <div className="modal-footer">
            {step > 1 && (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setStep(s => s - 1)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft size={14} /> Back
              </button>
            )}

            {step < 4 ? (
              <button 
                type="button" 
                className="btn btn-lilac" 
                onClick={() => setStep(s => s + 1)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Next Step <ArrowRight size={14} />
              </button>
            ) : (
              <button 
                type="button" 
                className="btn btn-lilac" 
                onClick={handleStartSynthesis}
                disabled={enabledModules.length === 0}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px' }}
              >
                <Sparkles size={15} /> Construct My CRM Workspace
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

