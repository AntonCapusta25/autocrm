import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, CheckCircle2, ChevronDown, 
  Plus, Sparkles, ChevronRight, LogOut,
  Smartphone, Upload, HelpCircle, Menu, Search, Sliders
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { GoogleLogoSvg } from './Integrations/GoogleAccountsModal';

interface NavbarProps {
  activeTab: NavTab;
  onOpenNotifications: () => void;
  onOpenOnboarding: () => void;
  onOpenGlobalSearch: () => void;
  onOpenMobile?: () => void;
  onOpenDataTransfer?: () => void;
  onOpenTour?: () => void;
  onToggleMobileMenu?: () => void;
}

const TAB_TITLES: Record<NavTab, { title: string; category: string }> = {
  dashboard: { title: 'Overview & Metrics', category: 'Executive' },
  contacts: { title: 'Contacts & Accounts', category: 'Core CRM' },
  companies: { title: 'Company Directory', category: 'Core CRM' },
  pipeline: { title: 'Sales Pipeline (Kanban)', category: 'Core CRM' },
  workflows: { title: 'Automation Workflows', category: 'Automations' },
  conversations: { title: 'Omnichannel Inbox', category: 'Messaging' },
  calendar: { title: 'Smart Appointments', category: 'Scheduling' },
  docs: { title: 'Documents & SOPs', category: 'Workspace' },
  tasks: { title: 'Tasks & Team SOPs', category: 'Execution' },
  team: { title: 'Team & RBAC Access', category: 'Organization' },
};

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  onOpenNotifications,
  onOpenOnboarding,
  onOpenGlobalSearch,
  onOpenMobile,
  onOpenDataTransfer,
  onOpenTour,
  onToggleMobileMenu,
}) => {
  const { 
    currentWorkspace, workspaces, createWorkspace, switchWorkspace,
    currentUser, teamMembers, switchCurrentUser,
    unreadNotificationCount, onboardingConfig, signOutAccount,
    openGoogleModal, googleAccounts
  } = useApp();

  const [wsDropdownOpen, setWsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [newWsModalOpen, setNewWsModalOpen] = useState(false);
  const [newWsName, setNewWsName] = useState('');

  const currentTabMeta = TAB_TITLES[activeTab] || { title: 'Dashboard', category: 'CRM' };

  const handleCreateWs = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    createWorkspace(newWsName.trim());
    setNewWsName('');
    setNewWsModalOpen(false);
    setWsDropdownOpen(false);
  };

  return (
    <>
      <header className="notion-top-bar">
        {/* Left: Hamburger (Mobile) & Notion Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="mobile-menu-trigger-btn"
              title="Open Navigation"
              aria-label="Toggle navigation menu"
            >
              <Menu size={18} />
            </button>
          )}

          {/* Workspace Switcher */}
          <div style={{ position: 'relative' }}>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setWsDropdownOpen(!wsDropdownOpen);
                setUserDropdownOpen(false);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', padding: '4px 8px' }}
            >
              <span>{currentWorkspace.name}</span>
              <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
            </button>

            {wsDropdownOpen && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '6px',
                  width: '240px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-modal)',
                  padding: '6px',
                  zIndex: 50,
                }}
              >
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', padding: '6px 8px', fontWeight: 600 }}>
                  COMPANY WORKSPACES
                </div>
                {workspaces.map(ws => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      switchWorkspace(ws.id);
                      setWsDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '7px 8px',
                      background: ws.id === currentWorkspace.id ? 'var(--lilac-subtle)' : 'transparent',
                      color: ws.id === currentWorkspace.id ? 'var(--lilac-300)' : 'var(--text-primary)',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      textAlign: 'left',
                    }}
                  >
                    <span>{ws.name}</span>
                    {ws.id === currentWorkspace.id && <CheckCircle2 size={13} />}
                  </button>
                ))}

                <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '6px 0', paddingTop: '6px' }}>
                  <button
                    onClick={() => {
                      setNewWsModalOpen(true);
                      setWsDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 8px',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      textAlign: 'left',
                    }}
                  >
                    <Plus size={14} />
                    <span>New Company Workspace</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <span style={{ color: 'var(--border-strong)' }}>/</span>

          <div className="notion-breadcrumbs">
            <span>{currentTabMeta.category}</span>
            <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} />
            <span className="active">{currentTabMeta.title}</span>
          </div>
        </div>

        {/* Right: Global Search, Tour, Notifications, User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Global Search Bar (Cmd+K) */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenGlobalSearch}
            style={{ 
              fontSize: '0.76rem', 
              gap: '7px', 
              padding: '5px 10px', 
              background: 'var(--bg-card)', 
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
            title="Global Search across contacts, companies, deals, tasks, docs (⌘K)"
          >
            <Search size={13} style={{ color: 'var(--lilac-300)' }} />
            <span>Search...</span>
            <kbd style={{
              fontSize: '0.64rem',
              padding: '1px 5px',
              borderRadius: '4px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--lilac-300)',
              fontWeight: 600,
              marginLeft: '4px'
            }}>⌘K</kbd>
          </button>

          {/* Workspace Product Tour Button */}
          {onOpenTour && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onOpenTour}
              style={{ padding: '6px', color: 'var(--text-secondary)' }}
              title="Workspace Guided Tour"
            >
              <HelpCircle size={14} />
            </button>
          )}

          {/* Notifications Bell */}
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onOpenNotifications}
            style={{ position: 'relative', padding: '6px' }}
            title="Notifications"
          >
            <Bell size={15} style={{ color: 'var(--text-secondary)' }} />
            {unreadNotificationCount > 0 && (
              <span 
                style={{ 
                  position: 'absolute', 
                  top: '2px', 
                  right: '2px', 
                  width: '7px', 
                  height: '7px', 
                  borderRadius: '50%', 
                  background: 'var(--lilac-400)' 
                }} 
              />
            )}
          </button>

          {/* User Profile & Sign Out Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setUserDropdownOpen(!userDropdownOpen);
                setWsDropdownOpen(false);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '4px 6px' }}
            >
              <img 
                src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`} 
                alt={currentUser.name}
                style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} />
            </button>

            {userDropdownOpen && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '6px',
                  width: '230px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-modal)',
                  padding: '6px',
                  zIndex: 50,
                }}
              >
                <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-primary)' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
                  <span className="badge badge-lilac" style={{ marginTop: '6px' }}>{currentUser.role}</span>
                </div>

                {teamMembers.length > 1 && (
                  <>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', padding: '6px 8px', fontWeight: 600 }}>
                      TEAM MEMBERS
                    </div>
                    {teamMembers.map(member => (
                      <button
                        key={member.id}
                        onClick={() => {
                          switchCurrentUser(member.id);
                          setUserDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 8px',
                          background: member.id === currentUser.id ? 'var(--lilac-subtle)' : 'transparent',
                          color: member.id === currentUser.id ? 'var(--lilac-300)' : 'var(--text-primary)',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          textAlign: 'left',
                        }}
                      >
                        <img 
                          src={member.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}`} 
                          style={{ width: '18px', height: '18px', borderRadius: '50%' }} 
                          alt="" 
                        />
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {member.name}
                        </span>
                        {member.id === currentUser.id && <CheckCircle2 size={12} />}
                      </button>
                    ))}
                  </>
                )}

                <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '6px', paddingTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenOnboarding();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 8px',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      textAlign: 'left',
                    }}
                  >
                    <Sliders size={14} style={{ color: 'var(--lilac-300)' }} />
                    <span>Workspace Settings & Modules</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      openGoogleModal();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 8px',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      textAlign: 'left',
                    }}
                  >
                    <GoogleLogoSvg size={14} />
                    <span>Google Workspace & Accounts ({googleAccounts.length})</span>
                  </button>

                  {onOpenDataTransfer && (
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenDataTransfer();
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '7px 8px',
                        background: 'transparent',
                        color: 'var(--text-secondary)',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        textAlign: 'left',
                      }}
                    >
                      <Upload size={14} />
                      <span>Smart Import & Export CSV</span>
                    </button>
                  )}

                  {onOpenMobile && (
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenMobile();
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '7px 8px',
                        background: 'transparent',
                        color: '#60a5fa',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        textAlign: 'left',
                      }}
                    >
                      <Smartphone size={14} />
                      <span>Mobile PWA & Notifications</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      signOutAccount();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 8px',
                      background: 'transparent',
                      color: 'var(--coral)',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      textAlign: 'left',
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out of Workspace</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Create Workspace Modal */}
      {newWsModalOpen && (
        <div className="modal-backdrop" onClick={() => setNewWsModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Create New Company Workspace</h3>
            </div>
            <form onSubmit={handleCreateWs}>
              <div className="modal-body">
                <div>
                  <label className="form-label">
                    Company / Organization Name
                  </label>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="e.g. Apex Growth Agency"
                    value={newWsName} 
                    onChange={e => setNewWsName(e.target.value)} 
                    required 
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setNewWsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-lilac">
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
