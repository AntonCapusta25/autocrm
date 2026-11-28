import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GoogleScope } from '../../types';
import { 
  X, Check, RefreshCw, Mail, Calendar as CalendarIcon, 
  Users, Trash2, Shield, Plus, ExternalLink, CheckCircle2, AlertCircle
} from 'lucide-react';

interface GoogleAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleLogoSvg: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

export const GoogleAccountsModal: React.FC<GoogleAccountsModalProps> = ({ isOpen, onClose }) => {
  const { 
    googleAccounts, 
    connectGoogleAccount, 
    disconnectGoogleAccount, 
    toggleGoogleAccountSync, 
    syncGoogleAccount, 
    syncAllGoogleAccounts,
    currentWorkspace 
  } = useApp();

  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncingAccountId, setSyncingAccountId] = useState<string | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New Account Form
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<GoogleScope[]>(['gmail', 'calendar', 'contacts']);
  const [isSubmittingConnect, setIsSubmittingConnect] = useState(false);

  if (!isOpen) return null;

  const handleSyncAll = async () => {
    setIsSyncingAll(true);
    setStatusFeedback(null);
    try {
      const res = await syncAllGoogleAccounts();
      setStatusFeedback(res.message);
    } finally {
      setIsSyncingAll(false);
      setTimeout(() => setStatusFeedback(null), 5000);
    }
  };

  const handleSyncSingle = async (accountId: string) => {
    setSyncingAccountId(accountId);
    setStatusFeedback(null);
    try {
      const res = await syncGoogleAccount(accountId);
      setStatusFeedback(res.message);
    } finally {
      setSyncingAccountId(null);
      setTimeout(() => setStatusFeedback(null), 5000);
    }
  };

  const handleToggleScope = (scope: GoogleScope) => {
    setSelectedScopes(prev => 
      prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]
    );
  };

  const handleConnectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || selectedScopes.length === 0) return;

    setIsSubmittingConnect(true);
    try {
      await connectGoogleAccount({
        email: newEmail.trim().toLowerCase(),
        name: newName.trim() || newEmail.split('@')[0],
        scopes: selectedScopes,
      });
      setNewEmail('');
      setNewName('');
      setIsAddingNew(false);
      setStatusFeedback(`Google account ${newEmail.trim().toLowerCase()} connected successfully.`);
    } finally {
      setIsSubmittingConnect(false);
      setTimeout(() => setStatusFeedback(null), 5000);
    }
  };

  const handleQuickConnectPreset = (emailPreset: string, namePreset: string) => {
    setNewEmail(emailPreset);
    setNewName(namePreset);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1200 }}>
      <div 
        className="modal-card" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          maxWidth: '680px', 
          width: '100%', 
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--notion-surface-card)',
          border: '1px solid var(--notion-border)',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Modal Header */}
        <div 
          style={{ 
            padding: '20px 24px', 
            borderBottom: '1px solid var(--notion-border)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            background: 'var(--notion-sidebar)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div 
              style={{ 
                width: '42px', 
                height: '42px', 
                borderRadius: '10px', 
                background: 'rgba(255, 255, 255, 0.04)', 
                border: '1px solid var(--notion-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <GoogleLogoSvg size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  Google Workspace & Accounts
                </h3>
                <span className="notion-badge lilac">Multi-Account Sync</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                Connect team and executive Google accounts for Gmail, Google Calendar, and Contacts synchronization in <strong style={{ color: 'var(--text-main)' }}>{currentWorkspace.name}</strong>.
              </p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px', minWidth: 'auto', borderRadius: '8px' }}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Status Feedback Toast Banner */}
          {statusFeedback && (
            <div 
              style={{ 
                padding: '10px 14px', 
                borderRadius: '8px', 
                background: 'rgba(52, 211, 153, 0.1)', 
                border: '1px solid rgba(52, 211, 153, 0.3)',
                color: '#34d399',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                animation: 'fadeIn 0.2s ease'
              }}
            >
              <CheckCircle2 size={16} />
              <span>{statusFeedback}</span>
            </div>
          )}

          {/* Sync Header Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Connected Accounts: <strong style={{ color: 'var(--text-main)' }}>{googleAccounts.length}</strong>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleSyncAll}
                disabled={isSyncingAll || googleAccounts.length === 0}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}
              >
                <RefreshCw size={13} className={isSyncingAll ? 'spin' : ''} />
                <span>{isSyncingAll ? 'Syncing Workspace...' : 'Sync All Accounts'}</span>
              </button>

              {!isAddingNew && (
                <button
                  type="button"
                  className="btn btn-lilac btn-sm"
                  onClick={() => setIsAddingNew(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}
                >
                  <Plus size={14} />
                  <span>Connect Google Account</span>
                </button>
              )}
            </div>
          </div>

          {/* Connect New Google Account Panel */}
          {isAddingNew && (
            <div 
              style={{ 
                padding: '16px 18px', 
                borderRadius: '12px', 
                background: 'var(--notion-surface-active)', 
                border: '1px solid var(--lilac-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GoogleLogoSvg size={18} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    Add Connected Google Workspace Account
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Preset 1-Click Suggestions */}
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Quick presets:
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleQuickConnectPreset('sales@autoflow.studio', 'AutoFlow Sales')}
                    className="notion-tag lilac"
                    style={{ cursor: 'pointer', fontSize: '0.74rem' }}
                  >
                    + sales@autoflow.studio
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickConnectPreset('ceo@autoflow.studio', 'Executive Desk')}
                    className="notion-tag slate"
                    style={{ cursor: 'pointer', fontSize: '0.74rem' }}
                  >
                    + ceo@autoflow.studio
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickConnectPreset('support@autoflow.studio', 'Client Support')}
                    className="notion-tag emerald"
                    style={{ cursor: 'pointer', fontSize: '0.74rem' }}
                  >
                    + support@autoflow.studio
                  </button>
                </div>
              </div>

              <form onSubmit={handleConnectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Google Account Email *
                    </label>
                    <input
                      type="email"
                      className="input"
                      placeholder="e.g. team@yourdomain.com"
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      required
                      style={{ height: '34px', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Account Owner / Display Name
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Sarah Jenkins"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      style={{ height: '34px', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>

                {/* Scopes Toggles */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Permissions & Sync Scopes
                  </label>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedScopes.includes('gmail')} 
                        onChange={() => handleToggleScope('gmail')} 
                      />
                      <Mail size={14} style={{ color: '#60a5fa' }} />
                      <span>Gmail (Inbox 2-Way)</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedScopes.includes('calendar')} 
                        onChange={() => handleToggleScope('calendar')} 
                      />
                      <CalendarIcon size={14} style={{ color: '#34d399' }} />
                      <span>Calendar & Meet</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedScopes.includes('contacts')} 
                        onChange={() => handleToggleScope('contacts')} 
                      />
                      <Users size={14} style={{ color: '#a78bfa' }} />
                      <span>Google Contacts</span>
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setIsAddingNew(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-lilac btn-sm"
                    disabled={isSubmittingConnect || !newEmail.trim()}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <GoogleLogoSvg size={14} />
                    <span>{isSubmittingConnect ? 'Authorizing OAuth...' : 'Authorize & Connect'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Accounts List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {googleAccounts.map(account => {
              const isSyncingThis = syncingAccountId === account.id || account.status === 'syncing' || isSyncingAll;

              return (
                <div
                  key={account.id}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'var(--notion-surface-card)',
                    border: '1px solid var(--notion-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    transition: 'border-color 0.15s ease'
                  }}
                >
                  {/* Account Header Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ position: 'relative' }}>
                        <img 
                          src={account.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                          alt={account.name}
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--notion-border)' }} 
                        />
                        <div 
                          style={{ 
                            position: 'absolute', 
                            bottom: -2, 
                            right: -2, 
                            width: '16px', 
                            height: '16px', 
                            borderRadius: '50%', 
                            background: '#11141C', 
                            border: '1px solid var(--notion-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <GoogleLogoSvg size={11} />
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {account.name}
                          </span>
                          {account.is_primary && (
                            <span className="notion-badge lilac" style={{ fontSize: '0.64rem', padding: '1px 6px' }}>
                              Primary
                            </span>
                          )}
                          <span 
                            className={`notion-tag ${isSyncingThis ? 'amber' : 'emerald'}`}
                            style={{ fontSize: '0.66rem', textTransform: 'capitalize' }}
                          >
                            {isSyncingThis ? 'Syncing...' : 'Connected'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {account.email}
                          {account.last_synced_at && (
                            <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>
                              • Last synced {new Date(account.last_synced_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick Card Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleSyncSingle(account.id)}
                        disabled={isSyncingThis}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', padding: '4px 8px' }}
                        title="Sync this account now"
                      >
                        <RefreshCw size={12} className={isSyncingThis ? 'spin' : ''} />
                        <span>Sync</span>
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          if (confirm(`Are you sure you want to disconnect ${account.email}? Synced records will remain in the CRM.`)) {
                            disconnectGoogleAccount(account.id);
                          }
                        }}
                        style={{ padding: '5px 8px', color: '#f87171' }}
                        title="Disconnect Google Account"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Sync Switches Bar */}
                  <div 
                    style={{ 
                      padding: '8px 12px', 
                      borderRadius: '8px', 
                      background: 'var(--notion-sidebar)', 
                      border: '1px solid var(--notion-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Active Sync Channels:
                    </span>

                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      {/* Gmail Toggle */}
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.76rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                        <input 
                          type="checkbox"
                          checked={account.sync_gmail}
                          onChange={() => toggleGoogleAccountSync(account.id, 'sync_gmail')}
                        />
                        <Mail size={13} style={{ color: account.sync_gmail ? '#60a5fa' : 'var(--text-muted)' }} />
                        <span style={{ color: account.sync_gmail ? 'var(--text-main)' : 'var(--text-muted)' }}>Gmail</span>
                      </label>

                      {/* Calendar Toggle */}
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.76rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                        <input 
                          type="checkbox"
                          checked={account.sync_calendar}
                          onChange={() => toggleGoogleAccountSync(account.id, 'sync_calendar')}
                        />
                        <CalendarIcon size={13} style={{ color: account.sync_calendar ? '#34d399' : 'var(--text-muted)' }} />
                        <span style={{ color: account.sync_calendar ? 'var(--text-main)' : 'var(--text-muted)' }}>Calendar</span>
                      </label>

                      {/* Contacts Toggle */}
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.76rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                        <input 
                          type="checkbox"
                          checked={account.sync_contacts}
                          onChange={() => toggleGoogleAccountSync(account.id, 'sync_contacts')}
                        />
                        <Users size={13} style={{ color: account.sync_contacts ? '#a78bfa' : 'var(--text-muted)' }} />
                        <span style={{ color: account.sync_contacts ? 'var(--text-main)' : 'var(--text-muted)' }}>Contacts</span>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Privacy & Enterprise Security Callout */}
          <div 
            style={{ 
              padding: '12px 14px', 
              borderRadius: '8px', 
              background: 'rgba(255, 255, 255, 0.02)', 
              border: '1px solid var(--notion-border)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}
          >
            <Shield size={16} style={{ color: 'var(--lilac-300)', marginTop: '2px', flexShrink: 0 }} />
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--text-secondary)' }}>Enterprise OAuth 2.0 Security:</strong> Connected Google accounts only synchronize authorized scopes. All email threads, appointment slots, and contacts are isolated to your workspace tenant and never cross account boundaries.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div 
          style={{ 
            padding: '14px 24px', 
            borderTop: '1px solid var(--notion-border)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: 'var(--notion-sidebar)'
          }}
        >
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Need help configuring custom domain OAuth? Reach out to <a href="mailto:support@autoflow.studio" style={{ color: 'var(--lilac-300)' }}>support@autoflow.studio</a>
          </span>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm" 
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
