import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, Users, Building2, KanbanSquare, 
  CheckSquare, ShieldCheck, Zap, MessageSquare, 
  Calendar, FileText, Sparkles, Sliders, Smartphone,
  Upload, HelpCircle, X
} from 'lucide-react';

export type NavTab = 
  | 'dashboard' 
  | 'contacts' 
  | 'companies' 
  | 'pipeline' 
  | 'workflows' 
  | 'conversations' 
  | 'calendar' 
  | 'docs' 
  | 'tasks' 
  | 'team';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenOnboarding: () => void;
  onOpenMarketplace?: () => void;
  onOpenMobile?: () => void;
  onOpenDataTransfer?: () => void;
  onOpenTour?: () => void;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  onOpenOnboarding,
  onOpenMarketplace,
  onOpenMobile,
  onOpenDataTransfer,
  onOpenTour,
  isOpenOnMobile = false,
  onCloseMobile,
}) => {
  const { 
    currentWorkspace, contacts, companies, opportunities, 
    tasks, teamMembers, workflows, conversations, 
    appointments, notionDocs, isModuleEnabled, onboardingConfig 
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const overdueCount = tasks.filter(t => t.status !== 'Completed' && t.due_date < todayStr).length;
  const activeOppsCount = opportunities.filter(o => o.stage !== 'Won' && o.stage !== 'Lost').length;
  const unreadConversations = conversations.filter(c => c.unread).length;
  const activeWorkflowsCount = workflows.filter(w => w.active).length;

  const handleNavClick = (tab: NavTab) => {
    onTabChange(tab);
    onCloseMobile?.();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenOnMobile && (
        <div 
          className="mobile-sidebar-backdrop animate-fade-in" 
          onClick={onCloseMobile} 
        />
      )}

      <aside className={`notion-sidebar ${isOpenOnMobile ? 'mobile-open' : ''}`}>
      {/* Workspace Bar */}
      <div className="notion-sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          <div 
            style={{ 
              width: '24px', 
              height: '24px', 
              borderRadius: '5px', 
              background: 'var(--lilac-subtle)',
              border: '1px solid var(--lilac-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              color: 'var(--lilac-300)',
              fontWeight: 700
            }}
          >
            {currentWorkspace.name[0]?.toUpperCase() || 'W'}
          </div>
          <span 
            style={{ 
              fontSize: '0.86rem', 
              fontWeight: 700, 
              color: 'var(--text-primary)', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }}
          >
            {currentWorkspace.name}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            onClick={() => {
              onOpenOnboarding();
              onCloseMobile?.();
            }}
            title="Configure Workspace Modules"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--lilac-300)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px'
            }}
          >
            <Sliders size={14} />
          </button>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="mobile-sidebar-close-btn"
              title="Close navigation"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '4px'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="notion-sidebar-scroll">
        {/* Dashboard is always available */}
        <button 
          className={`notion-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleNavClick('dashboard')}
        >
          <div className="notion-nav-left">
            <img 
              src="/assets/clay/dashboard.png" 
              alt="" 
              style={{ width: '18px', height: '18px', objectFit: 'contain', flexShrink: 0 }} 
            />
            <span>Overview & Metrics</span>
          </div>
        </button>

        {/* CORE CRM MODULES */}
        {(isModuleEnabled('contacts') || isModuleEnabled('companies') || isModuleEnabled('pipeline')) && (
          <div className="notion-nav-section-label">Core CRM</div>
        )}

        {isModuleEnabled('contacts') && (
          <button 
            className={`notion-nav-item ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => handleNavClick('contacts')}
          >
            <div className="notion-nav-left">
              <img 
                src="/assets/clay/contacts.png" 
                alt="" 
                style={{ width: '18px', height: '18px', objectFit: 'contain', flexShrink: 0 }} 
              />
              <span>Contacts</span>
            </div>
            <span className="notion-badge">{contacts.length}</span>
          </button>
        )}

        {isModuleEnabled('companies') && (
          <button 
            className={`notion-nav-item ${activeTab === 'companies' ? 'active' : ''}`}
            onClick={() => handleNavClick('companies')}
          >
            <div className="notion-nav-left">
              <img 
                src="/assets/clay/companies.png" 
                alt="" 
                style={{ width: '18px', height: '18px', objectFit: 'contain', flexShrink: 0 }} 
              />
              <span>Companies</span>
            </div>
            <span className="notion-badge">{companies.length}</span>
          </button>
        )}

        {isModuleEnabled('pipeline') && (
          <button 
            className={`notion-nav-item ${activeTab === 'pipeline' ? 'active' : ''}`}
            onClick={() => handleNavClick('pipeline')}
          >
            <div className="notion-nav-left">
              <img 
                src="/assets/clay/chart.png" 
                alt="" 
                style={{ width: '18px', height: '18px', objectFit: 'contain', flexShrink: 0 }} 
              />
              <span>Sales Pipeline</span>
            </div>
            <span className="notion-badge">{activeOppsCount}</span>
          </button>
        )}

        {/* GOHIGHLEVEL AUTOMATIONS & INBOX */}
        {(isModuleEnabled('workflows') || isModuleEnabled('conversations') || isModuleEnabled('calendar')) && (
          <div className="notion-nav-section-label">Automations & Inbox</div>
        )}

        {isModuleEnabled('workflows') && (
          <button 
            className={`notion-nav-item ${activeTab === 'workflows' ? 'active' : ''}`}
            onClick={() => handleNavClick('workflows')}
          >
            <div className="notion-nav-left">
              <img 
                src="/assets/clay/lightning.png" 
                alt="" 
                style={{ width: '18px', height: '18px', objectFit: 'contain', flexShrink: 0 }} 
              />
              <span>Workflows</span>
            </div>
            <span className="notion-badge lilac">{activeWorkflowsCount}</span>
          </button>
        )}

        {isModuleEnabled('conversations') && (
          <button 
            className={`notion-nav-item ${activeTab === 'conversations' ? 'active' : ''}`}
            onClick={() => handleNavClick('conversations')}
          >
            <div className="notion-nav-left">
              <img 
                src="/assets/clay/chat.png" 
                alt="" 
                style={{ width: '18px', height: '18px', objectFit: 'contain', flexShrink: 0 }} 
              />
              <span>Unified Inbox</span>
            </div>
            {unreadConversations > 0 ? (
              <span className="notion-badge alert">{unreadConversations} unread</span>
            ) : (
              <span className="notion-badge">{conversations.length}</span>
            )}
          </button>
        )}

        {isModuleEnabled('calendar') && (
          <button 
            className={`notion-nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => handleNavClick('calendar')}
          >
            <div className="notion-nav-left">
              <img 
                src="/assets/clay/calendar.png" 
                alt="" 
                style={{ width: '18px', height: '18px', objectFit: 'contain', flexShrink: 0 }} 
              />
              <span>Appointments</span>
            </div>
            <span className="notion-badge">{appointments.length}</span>
          </button>
        )}

        {/* NOTION WIKI & EXECUTION */}
        {(isModuleEnabled('docs') || isModuleEnabled('tasks')) && (
          <div className="notion-nav-section-label">Workspace & Execution</div>
        )}

        {isModuleEnabled('docs') && (
          <button 
            className={`notion-nav-item ${activeTab === 'docs' ? 'active' : ''}`}
            onClick={() => handleNavClick('docs')}
          >
            <div className="notion-nav-left">
              <img 
                src="/assets/clay/docs.png" 
                alt="" 
                style={{ width: '18px', height: '18px', objectFit: 'contain', flexShrink: 0 }} 
              />
              <span>Docs & SOPs</span>
            </div>
            <span className="notion-badge">{notionDocs.length}</span>
          </button>
        )}

        {isModuleEnabled('tasks') && (
          <button 
            className={`notion-nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => handleNavClick('tasks')}
          >
            <div className="notion-nav-left">
              <img 
                src="/assets/clay/tasks.png" 
                alt="" 
                style={{ width: '18px', height: '18px', objectFit: 'contain', flexShrink: 0 }} 
              />
              <span>Tasks & To-Dos</span>
            </div>
            {overdueCount > 0 ? (
              <span className="notion-badge alert">{overdueCount} overdue</span>
            ) : (
              <span className="notion-badge">{tasks.length}</span>
            )}
          </button>
        )}

        {/* ADMINISTRATION */}
        <div className="notion-nav-section-label">Organization</div>

        <button 
          className={`notion-nav-item ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => handleNavClick('team')}
        >
          <div className="notion-nav-left">
            <img 
              src="/assets/clay/shield.png" 
              alt="" 
              style={{ width: '18px', height: '18px', objectFit: 'contain', flexShrink: 0 }} 
            />
            <span>Team & Access</span>
          </div>
          <span className="notion-badge">{teamMembers.length}</span>
        </button>

        <button 
          className="notion-nav-item"
          onClick={() => { onOpenMarketplace?.(); onCloseMobile?.(); }}
          style={{ color: 'var(--lilac-300)' }}
        >
          <div className="notion-nav-left">
            <img 
              src="/assets/clay/voice.png" 
              alt="" 
              style={{ width: '18px', height: '18px', objectFit: 'contain', flexShrink: 0 }} 
            />
            <span>Modules & Add-ons</span>
          </div>
          <span className="notion-badge lilac" style={{ fontSize: '0.66rem' }}>✨ Enterprise</span>
        </button>

        <button 
          className="notion-nav-item"
          onClick={() => { onOpenDataTransfer?.(); onCloseMobile?.(); }}
        >
          <div className="notion-nav-left">
            <Upload size={15} />
            <span>Import & Export</span>
          </div>
          <span className="notion-badge" style={{ fontSize: '0.66rem' }}>CSV</span>
        </button>

        <button 
          className="notion-nav-item"
          onClick={() => { onOpenMobile?.(); onCloseMobile?.(); }}
          style={{ color: '#60a5fa' }}
        >
          <div className="notion-nav-left">
            <Smartphone size={15} style={{ color: '#60a5fa' }} />
            <span>Try on Mobile (PWA)</span>
          </div>
          <span className="notion-badge" style={{ fontSize: '0.66rem', color: '#60a5fa', borderColor: 'rgba(96, 165, 250, 0.3)' }}>📱 Mobile</span>
        </button>
      </div>

      {/* Bottom Reconfigure CRM Trigger */}
      <div 
        style={{ 
          padding: '12px 14px', 
          borderTop: '1px solid var(--border-subtle)', 
          background: 'var(--bg-sidebar)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <button
          type="button"
          onClick={onOpenOnboarding}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', justifyContent: 'center', gap: '6px', fontSize: '0.74rem' }}
        >
          <Sparkles size={13} style={{ color: 'var(--lilac-400)' }} />
          <span>Customize CRM ({onboardingConfig.industry.split(' ')[0]})</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', padding: '2px 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <img 
              src="/logo.webp" 
              alt="AutoFlow" 
              style={{ width: '14px', height: '14px', objectFit: 'contain' }} 
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/logo.png'; }} 
            />
            <span>AutoFlow Studio</span>
          </div>
          <span style={{ opacity: 0.6 }}>v2.0</span>
        </div>
      </div>
    </aside>
    </>
  );
};
