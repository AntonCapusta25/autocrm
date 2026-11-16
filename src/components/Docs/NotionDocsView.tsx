import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NotionDoc, NotionBlockType } from '../../types';
import { 
  FileText, Plus, Check, CheckSquare, Sparkles, Folder, 
  Trash2, Edit3, ArrowRight, CornerDownRight, AlignLeft
} from 'lucide-react';

export const NotionDocsView: React.FC = () => {
  const { notionDocs, addNotionDoc, updateNotionDoc, deleteNotionDoc, toggleDocBlockTodo, addDocBlock, currentUser } = useApp();

  const [activeDocId, setActiveDocId] = useState<string>(notionDocs[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newBlockType, setNewBlockType] = useState<NotionBlockType>('p');
  const [newBlockContent, setNewBlockContent] = useState('');
  const [newDocModalOpen, setNewDocModalOpen] = useState(false);

  // New Doc Form
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<any>('sop');
  const [newDocIcon, setNewDocIcon] = useState('📝');

  const filteredDocs = notionDocs.filter(d => {
    if (selectedCategory === 'all') return true;
    return d.category === selectedCategory;
  });

  const activeDoc = notionDocs.find(d => d.id === activeDocId) || notionDocs[0];

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockContent.trim() || !activeDoc) return;

    addDocBlock(activeDoc.id, {
      type: newBlockType,
      content: newBlockContent.trim(),
      checked: newBlockType === 'todo' ? false : undefined,
      calloutIcon: newBlockType === 'callout' ? '💡' : undefined,
    });

    setNewBlockContent('');
  };

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    const created = addNotionDoc({
      title: newDocTitle.trim(),
      icon: newDocIcon,
      cover_gradient: 'linear-gradient(135deg, #18191d 0%, #202128 50%, #2d263a 100%)',
      category: newDocCategory,
      properties: {
        status: 'Draft',
        owner: currentUser.name,
        department: 'Operations',
        last_edited: new Date().toISOString().split('T')[0],
      },
      blocks: [
        {
          id: `b-${Date.now()}-1`,
          type: 'callout',
          content: 'Start writing or click below to add blocks to this document.',
          calloutIcon: '💡'
        },
        {
          id: `b-${Date.now()}-2`,
          type: 'h1',
          content: 'Document Overview'
        }
      ]
    });

    setActiveDocId(created.id);
    setNewDocTitle('');
    setNewDocModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="/assets/clay/docs.png" 
              alt="Docs & Playbooks" 
              style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
            />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Documents & Client SOPs
            </h1>
            <span className="notion-badge lilac">Knowledge Base</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Living playbooks, client onboarding SOPs, proposal drafts, and interactive team checklists.
          </p>
        </div>

        <button 
          className="btn btn-lilac"
          onClick={() => setNewDocModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={15} /> New Document
        </button>
      </div>

      {/* Main 2-Column Split: Page Index on Left, Notion Page Block Document on Right */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '280px 1fr', 
          gap: '20px', 
          minHeight: '680px',
          alignItems: 'start'
        }}
      >
        {/* Left: Page Tree & Categories */}
        <div 
          className="notion-card" 
          style={{ 
            padding: '14px', 
            background: 'var(--notion-sidebar)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', borderBottom: '1px solid var(--notion-border)', paddingBottom: '10px' }}>
            {[
              { id: 'all', label: 'All Docs' },
              { id: 'playbook', label: 'Playbooks' },
              { id: 'sop', label: 'SOPs' },
              { id: 'meeting_notes', label: 'Notes' },
            ].map(cat => (
              <button
                key={cat.id}
                className={`notion-view-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
                style={{ fontSize: '0.74rem', padding: '3px 8px' }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Document Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {filteredDocs.length === 0 && (
              <div style={{ padding: '18px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                No documents yet.
              </div>
            )}
            {filteredDocs.map(doc => {
              const isSelected = doc.id === activeDoc?.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => setActiveDocId(doc.id)}
                  className={`notion-nav-item ${isSelected ? 'active' : ''}`}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: isSelected ? '1px solid var(--lilac-border)' : '1px solid transparent',
                  }}
                >
                  <div className="notion-nav-left">
                    <span style={{ fontSize: '1.1rem' }}>{doc.icon}</span>
                    <span style={{ fontSize: '0.84rem', fontWeight: isSelected ? 600 : 500 }}>
                      {doc.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Document Canvas */}
        {activeDoc ? (
          <div 
            className="notion-card" 
            style={{ 
              background: 'var(--notion-deep-black)', 
              border: '1px solid var(--notion-border-light)', 
              padding: '0', 
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)'
            }}
          >
            {/* Top Cover Gradient Banner */}
            <div 
              style={{ 
                height: '110px', 
                background: activeDoc.cover_gradient, 
                width: '100%',
                position: 'relative'
              }}
            />

            {/* Document Content Wrapper */}
            <div style={{ padding: '0 36px 36px', position: 'relative' }}>
              {/* Floating Page Icon */}
              <div 
                style={{ 
                  fontSize: '2.5rem', 
                  marginTop: '-32px', 
                  marginBottom: '10px',
                  width: '56px',
                  height: '56px',
                  background: 'var(--notion-deep-black)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--notion-border)'
                }}
              >
                {activeDoc.icon}
              </div>

              {/* Page Title */}
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '14px' }}>
                {activeDoc.title}
              </h1>

              {/* Notion Page Properties Bar */}
              <div 
                style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '16px', 
                  padding: '10px 0', 
                  borderTop: '1px solid var(--notion-border)', 
                  borderBottom: '1px solid var(--notion-border)',
                  marginBottom: '24px',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Status:</span>
                  <span className="notion-tag lilac">{activeDoc.properties.status}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Owner:</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{activeDoc.properties.owner}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Category:</span>
                  <span className="notion-tag slate" style={{ textTransform: 'uppercase' }}>{activeDoc.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Last Edited:</span>
                  <span className="tabular-nums" style={{ color: 'var(--text-secondary)' }}>{activeDoc.properties.last_edited}</span>
                </div>
              </div>

              {/* Notion Blocks Stream */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '260px' }}>
                {activeDoc.blocks.map(block => {
                  if (block.type === 'callout') {
                    return (
                      <div key={block.id} className="notion-block-callout">
                        <span className="callout-icon">{block.calloutIcon || '💡'}</span>
                        <div style={{ color: 'var(--text-main)' }}>{block.content}</div>
                      </div>
                    );
                  }

                  if (block.type === 'h1') {
                    return (
                      <h2 key={block.id} style={{ fontSize: '1.28rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '16px', letterSpacing: '-0.01em' }}>
                        {block.content}
                      </h2>
                    );
                  }

                  if (block.type === 'h2') {
                    return (
                      <h3 key={block.id} style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '12px' }}>
                        {block.content}
                      </h3>
                    );
                  }

                  if (block.type === 'todo') {
                    return (
                      <div 
                        key={block.id} 
                        className={`notion-todo-item ${block.checked ? 'checked' : ''}`}
                        onClick={() => toggleDocBlockTodo(activeDoc.id, block.id)}
                      >
                        <div className={`notion-checkbox ${block.checked ? 'checked' : ''}`}>
                          {block.checked && <Check size={11} strokeWidth={3} />}
                        </div>
                        <span style={{ fontSize: '0.86rem' }}>{block.content}</span>
                      </div>
                    );
                  }

                  if (block.type === 'bullet') {
                    return (
                      <div key={block.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '6px', fontSize: '0.86rem', color: 'var(--text-main)' }}>
                        <span style={{ color: 'var(--lilac-400)', fontSize: '1.1rem' }}>•</span>
                        <span>{block.content}</span>
                      </div>
                    );
                  }

                  // Default paragraph
                  return (
                    <p key={block.id} style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {block.content}
                    </p>
                  );
                })}
              </div>

              {/* Inline Block Creator */}
              <form 
                onSubmit={handleAddBlock}
                style={{ 
                  marginTop: '28px', 
                  padding: '12px 14px', 
                  background: 'var(--notion-surface)', 
                  border: '1px solid var(--notion-border)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <select
                  value={newBlockType}
                  onChange={e => setNewBlockType(e.target.value as any)}
                  className="select"
                  style={{ width: '130px', height: '32px', fontSize: '0.78rem' }}
                >
                  <option value="p">Paragraph</option>
                  <option value="todo">To-Do Item</option>
                  <option value="callout">Callout Box</option>
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
                  <option value="bullet">Bullet Item</option>
                </select>

                <input
                  type="text"
                  placeholder="Type block content and press Enter to add to document..."
                  value={newBlockContent}
                  onChange={e => setNewBlockContent(e.target.value)}
                  className="input"
                  style={{ flex: 1, height: '32px', fontSize: '0.82rem' }}
                />

                <button 
                  type="submit" 
                  className="btn btn-secondary btn-sm"
                  disabled={!newBlockContent.trim()}
                >
                  <Plus size={13} /> Add Block
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="notion-card" style={{ minHeight: '360px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem' }}>📝</div>
            <div style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-main)' }}>No documents created yet</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '360px' }}>
              Create your first SOP, playbook, proposal, or meeting notes document for your team.
            </div>
            <button className="btn btn-lilac btn-sm" onClick={() => setNewDocModalOpen(true)}>
              <Plus size={14} /> Create First Document
            </button>
          </div>
        )}
      </div>

      {/* New Doc Modal */}
      {newDocModalOpen && (
        <div className="modal-backdrop" onClick={() => setNewDocModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>New Document Page</h3>
            </div>
            <form onSubmit={handleCreateDoc}>
              <div className="modal-body">
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Page Title
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Client Onboarding Handshake Playbook"
                    value={newDocTitle}
                    onChange={e => setNewDocTitle(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Emoji Icon
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={newDocIcon}
                      onChange={e => setNewDocIcon(e.target.value)}
                      style={{ textAlign: 'center', fontSize: '1.2rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Category
                    </label>
                    <select
                      className="select"
                      value={newDocCategory}
                      onChange={e => setNewDocCategory(e.target.value)}
                    >
                      <option value="sop">Standard Operating Procedure (SOP)</option>
                      <option value="playbook">Sales & Account Playbook</option>
                      <option value="meeting_notes">Meeting Notes & Executive Logs</option>
                      <option value="proposal">Contract / Proposal Template</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setNewDocModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-lilac">
                  Create Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

