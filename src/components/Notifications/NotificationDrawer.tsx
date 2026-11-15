import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, Bell, CheckCircle2, Clock, AlertTriangle, 
  Settings, Check, Sliders 
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
    updateNotificationPreferences 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'notifications' | 'preferences'>('notifications');

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        {/* Drawer Header */}
        <div style={{ 
          padding: '18px 22px', 
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'var(--bg-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} style={{ color: 'var(--lilac-400)' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Notifications & Alerts</h3>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 20px',
          background: 'var(--bg-surface)'
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
            Notifications ({notifications.filter(n => !n.read).length})
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
            <Settings size={13} /> Preferences
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
          {activeTab === 'notifications' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  RECENT ALERTS
                </span>
                {notifications.some(n => !n.read) && (
                  <button 
                    className="btn btn-ghost btn-sm" 
                    onClick={markAllNotificationsRead}
                    style={{ fontSize: '0.72rem', color: 'var(--lilac-300)', padding: '2px 6px' }}
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No notifications yet. You're all caught up!
                </div>
              ) : (
                notifications.map(notif => (
                  <div 
                    key={notif.id}
                    onClick={() => {
                      markNotificationRead(notif.id);
                      if (notif.task_id) onOpenTask(notif.task_id);
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: notif.read ? 'var(--bg-surface)' : 'var(--bg-surface-elevated)',
                      border: notif.read ? '1px solid var(--border-subtle)' : '1px solid var(--lilac-border)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                  >
                    {!notif.read && (
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: 'var(--lilac-400)'
                      }} />
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {notif.type === 'overdue' && <AlertTriangle size={14} style={{ color: '#f87171' }} />}
                      {notif.type === 'due_soon' && <Clock size={14} style={{ color: '#fbbf24' }} />}
                      {notif.type === 'task_assigned' && <CheckCircle2 size={14} style={{ color: 'var(--lilac-300)' }} />}
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {notif.title}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Configure trigger conditions for in-app alert notifications:
              </div>

              {/* Setting 1: Task Assignment */}
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Task Assignment</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Notify immediately when a new task is assigned to you
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={notificationPreferences.notify_on_assignment}
                  onChange={e => updateNotificationPreferences({ notify_on_assignment: e.target.checked })}
                  style={{ accentColor: 'var(--lilac-500)', width: '16px', height: '16px' }}
                />
              </label>

              {/* Setting 2: Due Soon */}
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Approaching Due Date</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Alert when a task deadline is within 24 hours
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={notificationPreferences.notify_due_soon}
                  onChange={e => updateNotificationPreferences({ notify_due_soon: e.target.checked })}
                  style={{ accentColor: 'var(--lilac-500)', width: '16px', height: '16px' }}
                />
              </label>

              {/* Setting 3: Overdue */}
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Overdue Tasks</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Send high-priority warning when tasks pass deadline
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={notificationPreferences.notify_overdue}
                  onChange={e => updateNotificationPreferences({ notify_overdue: e.target.checked })}
                  style={{ accentColor: 'var(--lilac-500)', width: '16px', height: '16px' }}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
