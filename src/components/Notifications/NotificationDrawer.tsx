import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, Bell, CheckCircle2, Clock, AlertTriangle, 
  Settings, Check, Sliders, Smartphone, Mail, 
  Send, ShieldCheck, Zap, Sparkles, Key
} from 'lucide-react';

interface NotificationDrawerProps {
  onClose: () => void;
  onOpenTask: (taskId?: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ onClose, onOpenTask }) => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    notificationPreferences, 
    updateNotificationPreferences,
    requestPushPermission,
    sendTestNotification,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'notifications' | 'preferences'>('notifications');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTestingPush, setIsTestingPush] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  const handleTestPush = async () => {
    setIsTestingPush(true);
    const res = await sendTestNotification('push');
    setIsTestingPush(false);
    setTestResult(`[Push] ${res.message}`);
    setTimeout(() => setTestResult(null), 4500);
  };

  const handleTestEmail = async () => {
    setIsTestingEmail(true);
    const res = await sendTestNotification('email');
    setIsTestingEmail(false);
    setTestResult(`[Email] ${res.message}`);
    setTimeout(() => setTestResult(null), 4500);
  };

  const handleTogglePush = async (checked: boolean) => {
    if (checked) {
      const perm = await requestPushPermission();
      if (perm === 'granted') {
        updateNotificationPreferences({ push_enabled: true });
      } else {
        updateNotificationPreferences({ push_enabled: false });
        alert('Push notification permission was denied in your browser settings.');
      }
    } else {
      updateNotificationPreferences({ push_enabled: false });
    }
  };

  return (
    <div className="drawer-backdrop" onClick={onClose} style={{ zIndex: 1150 }}>
      <div 
        className="drawer-content animate-slide-in" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          maxWidth: '460px',
          background: 'var(--notion-panel)',
          borderLeft: '1px solid var(--border-subtle)',
        }}
      >
        {/* Drawer Header */}
        <div style={{ 
          padding: '18px 22px', 
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'var(--notion-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
              src="/assets/clay/chat.png" 
              alt="Notifications" 
              style={{ width: '22px', height: '22px', objectFit: 'contain' }} 
            />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
              Notifications & Alerts
            </h3>
          </div>
          <button className="notion-action-btn" onClick={onClose} style={{ width: '28px', height: '28px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 20px',
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          <button
            onClick={() => setActiveTab('notifications')}
            style={{
              padding: '10px 14px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'notifications' ? '2px solid var(--lilac-400)' : '2px solid transparent',
              color: activeTab === 'notifications' ? 'var(--lilac-300)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            Alerts Feed ({notifications.filter(n => !n.read).length})
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            style={{
              padding: '10px 14px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'preferences' ? '2px solid var(--lilac-400)' : '2px solid transparent',
              color: activeTab === 'preferences' ? 'var(--lilac-300)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Settings size={13} /> Channels & Config
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
          {activeTab === 'notifications' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  RECENT WORKSPACE ALERTS
                </span>
                {notifications.some(n => !n.read) && (
                  <button 
                    className="btn btn-ghost btn-sm" 
                    onClick={markAllNotificationsRead}
                    style={{ fontSize: '0.72rem', color: 'var(--lilac-300)', padding: '2px 6px' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
                  <Bell size={32} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                  <p style={{ fontSize: '0.84rem' }}>No new notifications.</p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className="notion-card"
                    onClick={() => {
                      if (!notif.read) markNotificationRead(notif.id);
                      if (notif.task_id) onOpenTask(notif.task_id);
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: notif.read ? 'var(--notion-card)' : 'rgba(167, 139, 250, 0.05)',
                      border: notif.read ? '1px solid var(--border-subtle)' : '1px solid rgba(167, 139, 250, 0.3)',
                      cursor: notif.task_id ? 'pointer' : 'default',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {notif.title}
                      </span>
                      {!notif.read && (
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--lilac-400)', marginTop: '4px' }} />
                      )}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                      {notif.message}
                    </p>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                      {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* CONFIG & CHANNELS TAB */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {testResult && (
                <div style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(167, 139, 250, 0.12)', border: '1px solid var(--lilac-border)', color: 'var(--lilac-300)', fontSize: '0.78rem' }}>
                  {testResult}
                </div>
              )}

              {/* SECTION 1: DELIVERY CHANNELS */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--lilac-300)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  DELIVERY CHANNELS
                </div>

                {/* Channel 1: Web Push Notifications */}
                <div 
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'var(--notion-card)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Smartphone size={16} style={{ color: '#60a5fa' }} />
                      <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        Browser & Mobile Push Notifications
                      </span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={notificationPreferences.push_enabled}
                      onChange={e => handleTogglePush(e.target.checked)}
                      style={{ accentColor: 'var(--lilac-500)', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Sends native desktop/phone notifications via Service Worker
                  </div>
                  {notificationPreferences.push_enabled && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleTestPush}
                      disabled={isTestingPush}
                      style={{ fontSize: '0.72rem', padding: '3px 10px' }}
                    >
                      {isTestingPush ? 'Sending...' : 'Send Test Push Alert'}
                    </button>
                  )}
                </div>

                {/* Channel 2: Email Notifications & Resend Integration */}
                <div 
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'var(--notion-card)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={16} style={{ color: '#34d399' }} />
                      <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        Email Notifications (Resend / Edge API)
                      </span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={notificationPreferences.email_enabled}
                      onChange={e => updateNotificationPreferences({ email_enabled: e.target.checked })}
                      style={{ accentColor: 'var(--lilac-500)', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </div>

                  {notificationPreferences.email_enabled && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                      <div>
                        <label className="notion-label">Recipient Work Email</label>
                        <input 
                          type="email"
                          placeholder={currentUser.email || 'operator@company.com'}
                          value={notificationPreferences.email_recipient || ''}
                          onChange={e => updateNotificationPreferences({ email_recipient: e.target.value })}
                          className="notion-input"
                          style={{ height: '32px', fontSize: '0.78rem' }}
                        />
                      </div>

                      <div>
                        <label className="notion-label">Custom Resend API Key (Optional)</label>
                        <div style={{ position: 'relative' }}>
                          <input 
                            type="password"
                            placeholder="re_123456789... (defaults to AutoFlow Edge API)"
                            value={notificationPreferences.resend_api_key || ''}
                            onChange={e => updateNotificationPreferences({ resend_api_key: e.target.value })}
                            className="notion-input"
                            style={{ height: '32px', fontSize: '0.78rem' }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={handleTestEmail}
                        disabled={isTestingEmail}
                        style={{ fontSize: '0.72rem', padding: '4px 10px', alignSelf: 'flex-start' }}
                      >
                        {isTestingEmail ? 'Sending...' : 'Send Test Email'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 2: EVENT TRIGGER PREFERENCES */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--lilac-300)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  EVENT TRIGGER PREFERENCES
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {/* Deal Won */}
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--notion-card)', borderRadius: '6px', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>Deal Closed-Won</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Notify when an opportunity reaches Won stage</div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={notificationPreferences.notify_deal_won}
                      onChange={e => updateNotificationPreferences({ notify_deal_won: e.target.checked })}
                      style={{ accentColor: 'var(--lilac-500)', width: '15px', height: '15px' }}
                    />
                  </label>

                  {/* Inbound Messages */}
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--notion-card)', borderRadius: '6px', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>Inbound SMS / WhatsApp Messages</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Real-time alert on customer replies</div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={notificationPreferences.notify_inbound_messages}
                      onChange={e => updateNotificationPreferences({ notify_inbound_messages: e.target.checked })}
                      style={{ accentColor: 'var(--lilac-500)', width: '15px', height: '15px' }}
                    />
                  </label>

                  {/* New Leads */}
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--notion-card)', borderRadius: '6px', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>New Inbound Leads</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Alert on web form intakes & CSV imports</div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={notificationPreferences.notify_new_leads}
                      onChange={e => updateNotificationPreferences({ notify_new_leads: e.target.checked })}
                      style={{ accentColor: 'var(--lilac-500)', width: '15px', height: '15px' }}
                    />
                  </label>

                  {/* Tasks Due Soon */}
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--notion-card)', borderRadius: '6px', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>Tasks Due Soon</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Warning 24 hours prior to deadline</div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={notificationPreferences.notify_due_soon}
                      onChange={e => updateNotificationPreferences({ notify_due_soon: e.target.checked })}
                      style={{ accentColor: 'var(--lilac-500)', width: '15px', height: '15px' }}
                    />
                  </label>

                  {/* Overdue Tasks */}
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--notion-card)', borderRadius: '6px', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>Overdue Tasks Alert</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>High-priority alarm when task is past deadline</div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={notificationPreferences.notify_overdue}
                      onChange={e => updateNotificationPreferences({ notify_overdue: e.target.checked })}
                      style={{ accentColor: 'var(--lilac-500)', width: '15px', height: '15px' }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
