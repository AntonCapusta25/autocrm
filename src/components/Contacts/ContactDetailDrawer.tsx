import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Contact, Task } from '../../types';
import { 
  X, Mail, Phone, Building2, Briefcase, Calendar, 
  Clock, Plus, CheckSquare, MessageSquare, History, Tag, Edit, TrendingUp, Send
} from 'lucide-react';

interface ContactDetailDrawerProps {
  contact: Contact;
  onClose: () => void;
  onEdit: (contact: Contact) => void;
  onOpenNewTaskForContact: (contact: Contact) => void;
}

export const ContactDetailDrawer: React.FC<ContactDetailDrawerProps> = ({
  contact,
  onClose,
  onEdit,
  onOpenNewTaskForContact,
}) => {
  const { 
    getActivitiesForContact, 
    addContactNote, 
    tasks, 
    toggleTaskStatus,
    companies 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'timeline' | 'tasks' | 'details'>('timeline');
  const [newNote, setNewNote] = useState('');

  const activities = getActivitiesForContact(contact.id);
  const contactTasks = tasks.filter(t => t.related_contact_id === contact.id);
  const matchedCompany = companies.find(c => c.id === contact.company_id);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addContactNote(contact.id, newNote.trim());
    setNewNote('');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contact_created': return <Calendar size={13} style={{ color: 'var(--lilac-400)' }} />;
      case 'note_added': return <MessageSquare size={13} style={{ color: '#60a5fa' }} />;
      case 'task_created': return <Plus size={13} style={{ color: '#fbbf24' }} />;
      case 'task_completed': return <CheckSquare size={13} style={{ color: '#34d399' }} />;
      case 'stage_changed': return <TrendingUp size={13} style={{ color: 'var(--lilac-300)' }} />;
      default: return <History size={13} style={{ color: 'var(--text-muted)' }} />;
    }
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'var(--bg-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'var(--lilac-bg-subtle)',
              border: '1px solid var(--lilac-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--lilac-300)'
            }}>
              {contact.first_name[0]}{contact.last_name[0]}
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                {contact.first_name} {contact.last_name}
              </h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {contact.job_title || 'Contact Profile'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className="btn btn-secondary btn-icon" 
              onClick={() => onEdit(contact)}
              title="Edit Contact"
            >
              <Edit size={16} />
            </button>
            <button 
              className="btn btn-ghost btn-icon" 
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick Contact Info Strip */}
        <div style={{ 
          padding: '14px 24px', 
          background: 'var(--bg-surface-elevated)', 
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '0.82rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <Mail size={14} style={{ color: 'var(--lilac-400)' }} />
            <a href={`mailto:${contact.email}`} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>
              {contact.email}
            </a>
          </div>

          {contact.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <Phone size={14} style={{ color: 'var(--lilac-400)' }} />
              <span>{contact.phone}</span>
            </div>
          )}

          {matchedCompany && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <Building2 size={14} style={{ color: 'var(--lilac-400)' }} />
              <span>Company: <strong style={{ color: 'var(--lilac-200)' }}>{matchedCompany.name}</strong></span>
            </div>
          )}
        </div>

        {/* Tabs Bar */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 24px',
          background: 'var(--bg-surface)'
        }}>
          <button
            onClick={() => setActiveTab('timeline')}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'timeline' ? '2px solid var(--lilac-400)' : '2px solid transparent',
              color: activeTab === 'timeline' ? 'var(--lilac-300)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <History size={14} /> Activity Timeline ({activities.length})
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'tasks' ? '2px solid var(--lilac-400)' : '2px solid transparent',
              color: activeTab === 'tasks' ? 'var(--lilac-300)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <CheckSquare size={14} /> Tasks ({contactTasks.length})
          </button>

          <button
            onClick={() => setActiveTab('details')}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'details' ? '2px solid var(--lilac-400)' : '2px solid transparent',
              color: activeTab === 'details' ? 'var(--lilac-300)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Briefcase size={14} /> Full Details
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {/* TAB 1: Activity Timeline */}
          {activeTab === 'timeline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  ADD NOTE TO TIMELINE
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="Log a call, meeting note, or follow-up note..."
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                  />
                  <button type="submit" className="btn btn-lilac btn-sm" disabled={!newNote.trim()}>
                    <Send size={14} /> Post
                  </button>
                </div>
              </form>

              {/* Timeline Items */}
              <div style={{ marginTop: '10px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '14px', letterSpacing: '0.05em' }}>
                  CHRONOLOGICAL ACTIVITY HISTORY
                </div>

                {activities.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No recorded activities for this contact yet.
                  </div>
                ) : (
                  <div>
                    {activities.map(item => (
                      <div key={item.id} className="timeline-item">
                        <div className="timeline-bullet">
                          {getActivityIcon(item.type)}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                              {item.title}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {new Date(item.created_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          {item.description && (
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                              {item.description}
                            </p>
                          )}

                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            Logged by {item.created_by}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Tasks */}
          {activeTab === 'tasks' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  LINKED TASKS ({contactTasks.length})
                </span>
                <button 
                  className="btn btn-lilac btn-sm" 
                  onClick={() => onOpenNewTaskForContact(contact)}
                >
                  <Plus size={14} /> Add Task
                </button>
              </div>

              {contactTasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No tasks assigned to this contact. Click "Add Task" to create one.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {contactTasks.map(task => (
                    <div 
                      key={task.id} 
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                      }}
                    >
                      <input 
                        type="checkbox"
                        checked={task.status === 'Completed'}
                        onChange={() => toggleTaskStatus(task.id)}
                        style={{ cursor: 'pointer', marginTop: '3px', accentColor: 'var(--lilac-500)' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '0.88rem', 
                          fontWeight: 500,
                          textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                          color: task.status === 'Completed' ? 'var(--text-muted)' : 'var(--text-main)'
                        }}>
                          {task.title}
                        </div>
                        {task.description && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            {task.description}
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                          <span className={`badge ${task.status === 'Completed' ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '0.68rem' }}>
                            {task.status}
                          </span>
                          <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                            Due: {task.due_date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Full Details */}
          {activeTab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Tags */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  TAGS
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {contact.tags.length > 0 ? (
                    contact.tags.map(t => (
                      <span key={t} className="badge badge-lilac">{t}</span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No tags applied.</span>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  NOTES
                </label>
                <div style={{ 
                  background: 'var(--bg-surface-elevated)', 
                  padding: '12px', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.84rem',
                  color: 'var(--text-main)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {contact.notes || 'No general notes stored for this contact.'}
                </div>
              </div>

              {/* Custom Fields */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  CUSTOM FIELDS
                </label>
                {contact.custom_fields && Object.keys(contact.custom_fields).length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                    {Object.entries(contact.custom_fields).map(([k, v]) => (
                      <div 
                        key={k} 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          background: 'var(--bg-surface-elevated)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.82rem'
                        }}
                      >
                        <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No custom fields added.</div>
                )}
              </div>

              {/* System Metadata */}
              <div style={{ 
                marginTop: '12px',
                paddingTop: '16px', 
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                fontSize: '0.72rem',
                color: 'var(--text-muted)'
              }}>
                <div>Created: {new Date(contact.created_at).toLocaleString()}</div>
                <div>Last Updated: {new Date(contact.updated_at).toLocaleString()}</div>
                <div>Contact ID: <code>{contact.id}</code></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
