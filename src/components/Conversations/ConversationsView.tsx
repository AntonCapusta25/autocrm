import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConversationThread, MessageChannel } from '../../types';
import { 
  MessageSquare, Mail, Phone, Send, Search, CheckCheck, 
  Sparkles, Tag, Building2, User, Clock, ArrowUpRight
} from 'lucide-react';

const CHANNEL_ICONS: Record<MessageChannel, React.ReactNode> = {
  sms: <span style={{ color: '#34d399' }}>SMS</span>,
  email: <span style={{ color: '#60a5fa' }}>Email</span>,
  whatsapp: <span style={{ color: '#22c55e' }}>WhatsApp</span>,
  webchat: <span style={{ color: '#a78bfa' }}>Webchat</span>,
};

export const ConversationsView: React.FC = () => {
  const { conversations, sendMessage, markConversationRead, contacts, opportunities, openModuleSetupModal } = useApp();

  const [activeThreadId, setActiveThreadId] = useState<string>(conversations[0]?.id || '');
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<'all' | MessageChannel>('all');
  const [replyText, setReplyText] = useState('');
  const [replyChannel, setReplyChannel] = useState<MessageChannel>('email');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredThreads = conversations.filter(t => {
    if (selectedChannelFilter !== 'all' && t.active_channel !== selectedChannelFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return t.contact_name.toLowerCase().includes(q) || t.last_message.toLowerCase().includes(q);
    }
    return true;
  });

  const activeThread = conversations.find(t => t.id === activeThreadId) || conversations[0];
  const activeContact = contacts.find(c => c.id === activeThread?.contact_id);
  const activeOpp = opportunities.find(o => o.contact_id === activeThread?.contact_id);

  const handleSelectThread = (thread: ConversationThread) => {
    setActiveThreadId(thread.id);
    setReplyChannel(thread.active_channel);
    if (thread.unread) {
      markConversationRead(thread.id);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;
    sendMessage(activeThread.id, replyText.trim(), replyChannel);
    setReplyText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>💬</span>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Unified Omnichannel Inbox
            </h1>
            <span className="notion-badge lilac">Omnichannel Inbox</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Centralized 2-way messaging across SMS, Email, WhatsApp, and Webchat with instantaneous contact sync.
          </p>
        </div>

        <button 
          type="button"
          className="btn btn-secondary"
          onClick={() => openModuleSetupModal('whatsapp_cloud')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', borderColor: 'var(--lilac-border)' }}
        >
          <span>✨</span>
          <span>Connect WhatsApp Cloud API</span>
        </button>
      </div>

      {/* Main 3-Column Omnichannel Dashboard */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '320px 1fr 280px', 
          height: 'calc(100vh - 190px)', 
          minHeight: '620px',
          background: 'var(--notion-surface-card)',
          border: '1px solid var(--notion-border)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        {/* Left Column: Threads List */}
        <div style={{ borderRight: '1px solid var(--notion-border)', display: 'flex', flexDirection: 'column', background: 'var(--notion-sidebar)' }}>
          {/* Search & Channel Filters */}
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--notion-border)' }}>
            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input"
                style={{ paddingLeft: '30px', height: '32px', fontSize: '0.8rem' }}
              />
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--text-muted)' }} />
            </div>

            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
              {(['all', 'sms', 'email', 'whatsapp', 'webchat'] as const).map(ch => (
                <button
                  key={ch}
                  className={`notion-view-tab-btn ${selectedChannelFilter === ch ? 'active' : ''}`}
                  onClick={() => setSelectedChannelFilter(ch)}
                  style={{ fontSize: '0.72rem', padding: '3px 8px', textTransform: 'capitalize' }}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Threads Scroll */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
            {filteredThreads.map(thread => {
              const isSelected = thread.id === activeThread?.id;
              return (
                <div
                  key={thread.id}
                  onClick={() => handleSelectThread(thread)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: isSelected ? 'var(--notion-surface-active)' : 'transparent',
                    border: isSelected ? '1px solid var(--lilac-border)' : '1px solid transparent',
                    cursor: 'pointer',
                    marginBottom: '4px',
                    transition: 'all 0.12s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.86rem', fontWeight: thread.unread ? 700 : 600, color: isSelected ? 'var(--lilac-300)' : 'var(--text-main)' }}>
                      {thread.contact_name}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {new Date(thread.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <span className="notion-tag" style={{ fontSize: '0.64rem', padding: '1px 5px', textTransform: 'uppercase' }}>
                      {thread.active_channel}
                    </span>
                    <p 
                      style={{ 
                        fontSize: '0.76rem', 
                        color: thread.unread ? 'var(--text-main)' : 'var(--text-secondary)',
                        fontWeight: thread.unread ? 600 : 400,
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap',
                        flex: 1
                      }}
                    >
                      {thread.last_message}
                    </p>
                    {thread.unread && (
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--lilac-400)' }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Column: Live Chat Message Stream */}
        {activeThread ? (
          <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--notion-black)' }}>
            {/* Thread Header */}
            <div 
              style={{ 
                padding: '14px 20px', 
                borderBottom: '1px solid var(--notion-border)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                background: 'var(--notion-deep-black)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {activeThread.contact_name}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {activeThread.contact_email} {activeThread.contact_phone ? `• ${activeThread.contact_phone}` : ''}
                </div>
              </div>

              {/* Active Channel Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Send via:</span>
                {(['email', 'sms', 'whatsapp', 'webchat'] as const).map(ch => (
                  <button
                    key={ch}
                    onClick={() => setReplyChannel(ch)}
                    className={`notion-tag ${replyChannel === ch ? 'lilac' : 'slate'}`}
                    style={{ cursor: 'pointer', border: replyChannel === ch ? '1px solid var(--lilac-400)' : 'none', textTransform: 'capitalize' }}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Stream */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {activeThread.messages.map(msg => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '78%',
                      alignSelf: isUser ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                        background: isUser ? 'var(--notion-surface-active)' : 'var(--notion-surface-card)',
                        border: `1px solid ${isUser ? 'var(--lilac-border)' : 'var(--notion-border)'}`,
                        color: 'var(--text-main)',
                        fontSize: '0.84rem',
                        lineHeight: 1.45,
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      {msg.text}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span style={{ textTransform: 'uppercase' }}>{msg.channel}</span>
                      {isUser && <CheckCheck size={12} style={{ color: 'var(--lilac-400)' }} />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Composer Form */}
            <form onSubmit={handleSendReply} style={{ padding: '14px 20px', borderTop: '1px solid var(--notion-border)', background: 'var(--notion-surface)' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  className="input"
                  placeholder={`Reply via ${replyChannel.toUpperCase()} to ${activeThread.contact_name}...`}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  style={{ flex: 1, height: '40px' }}
                />
                <button 
                  type="submit" 
                  className="btn btn-lilac" 
                  disabled={!replyText.trim()}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Send size={14} /> Send
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Select a conversation thread to view messages
          </div>
        )}

        {/* Right Column: Contact Quick Context Card */}
        {activeContact && (
          <div style={{ borderLeft: '1px solid var(--notion-border)', padding: '18px 16px', background: 'var(--notion-sidebar)', overflowY: 'auto' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              CONTACT PROFILE
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div 
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  background: 'var(--lilac-bg-subtle)', 
                  border: '1px solid var(--lilac-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--lilac-300)',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                {activeContact.first_name[0]}{activeContact.last_name[0]}
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {activeContact.first_name} {activeContact.last_name}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {activeContact.job_title || 'Client Contact'}
                </div>
              </div>
            </div>

            {activeContact.company_name && (
              <div style={{ padding: '8px 10px', background: 'var(--notion-surface)', borderRadius: '6px', border: '1px solid var(--notion-border)', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Company</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                  {activeContact.company_name}
                </div>
              </div>
            )}

            {activeOpp && (
              <div style={{ padding: '10px', background: 'var(--lilac-bg-subtle)', borderRadius: '6px', border: '1px solid var(--lilac-border)', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--lilac-300)', fontWeight: 600 }}>Active Opportunity</div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                  {activeOpp.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.74rem' }}>
                  <span className="notion-tag sky">{activeOpp.stage}</span>
                  <span style={{ fontWeight: 700, color: 'var(--lilac-300)' }}>${activeOpp.deal_value.toLocaleString()}</span>
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Tags</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {activeContact.tags.map(t => (
                  <span key={t} className="notion-tag lilac" style={{ fontSize: '0.7rem' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

