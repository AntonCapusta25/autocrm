import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../Sidebar';
import { 
  Search, X, Users, Building2, KanbanSquare, 
  CheckSquare, FileText, ArrowRight, CornerDownLeft
} from 'lucide-react';
import { Contact, Company, Opportunity, Task, NotionDoc } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab) => void;
  onSelectContact?: (contactId: string) => void;
  onSelectDoc?: (docId: string) => void;
}

type SearchCategory = 'all' | 'contacts' | 'companies' | 'opportunities' | 'tasks' | 'docs';

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectContact,
  onSelectDoc,
}) => {
  const { contacts, companies, opportunities, tasks, notionDocs } = useApp();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matchedContacts = (activeCategory === 'all' || activeCategory === 'contacts')
      ? contacts.filter(c => 
          `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.company_name?.toLowerCase().includes(q) ||
          c.job_title?.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q)
        ).map(c => ({
          type: 'contact' as const,
          id: c.id,
          title: `${c.first_name} ${c.last_name}`,
          subtitle: `${c.job_title ? c.job_title + ' · ' : ''}${c.company_name || c.email}`,
          tab: 'contacts' as NavTab,
          iconSrc: '/assets/clay/contacts.png',
          raw: c,
        }))
      : [];

    const matchedCompanies = (activeCategory === 'all' || activeCategory === 'companies')
      ? companies.filter(c =>
          c.name.toLowerCase().includes(q) ||
          c.industry?.toLowerCase().includes(q) ||
          c.website?.toLowerCase().includes(q)
        ).map(c => ({
          type: 'company' as const,
          id: c.id,
          title: c.name,
          subtitle: `${c.industry ? c.industry + ' · ' : ''}${c.website || 'Corporate Stakeholder'}`,
          tab: 'companies' as NavTab,
          iconSrc: '/assets/clay/companies.png',
          raw: c,
        }))
      : [];

    const matchedDeals = (activeCategory === 'all' || activeCategory === 'opportunities')
      ? opportunities.filter(o =>
          o.name.toLowerCase().includes(q) ||
          o.stage.toLowerCase().includes(q) ||
          String(o.deal_value).includes(q)
        ).map(o => ({
          type: 'deal' as const,
          id: o.id,
          title: o.name,
          subtitle: `${o.stage} · $${Number(o.deal_value || 0).toLocaleString()}`,
          tab: 'pipeline' as NavTab,
          iconSrc: '/assets/clay/chart.png',
          raw: o,
        }))
      : [];

    const matchedTasks = (activeCategory === 'all' || activeCategory === 'tasks')
      ? tasks.filter(t =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.status.toLowerCase().includes(q) ||
          t.priority.toLowerCase().includes(q)
        ).map(t => ({
          type: 'task' as const,
          id: t.id,
          title: t.title,
          subtitle: `Due: ${t.due_date} · ${t.priority} Priority · ${t.status}`,
          tab: 'tasks' as NavTab,
          iconSrc: '/assets/clay/tasks.png',
          raw: t,
        }))
      : [];

    const matchedDocs = (activeCategory === 'all' || activeCategory === 'docs')
      ? notionDocs.filter(d =>
          d.title.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
        ).map(d => ({
          type: 'doc' as const,
          id: d.id,
          title: d.title,
          subtitle: `Category: ${d.category} · Knowledge Base`,
          tab: 'docs' as NavTab,
          iconSrc: '/assets/clay/docs.png',
          raw: d,
        }))
      : [];

    return [...matchedContacts, ...matchedCompanies, ...matchedDeals, ...matchedTasks, ...matchedDocs];
  }, [contacts, companies, opportunities, tasks, notionDocs, query, activeCategory]);

  const handleSelect = (item: typeof results[0]) => {
    if (!item) return;
    onNavigate(item.tab);
    if (item.type === 'contact' && onSelectContact) {
      onSelectContact(item.id);
    }
    if (item.type === 'doc' && onSelectDoc) {
      onSelectDoc(item.id);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="notion-modal-overlay animate-fade-in" onClick={onClose} style={{ zIndex: 1200, alignItems: 'flex-start', paddingTop: '10vh' }}>
      <div 
        className="notion-modal-box animate-scale-in"
        onClick={e => e.stopPropagation()}
        style={{
          width: '94%',
          maxWidth: '640px',
          background: 'var(--notion-panel)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(167, 139, 250, 0.15)',
          borderRadius: '14px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Search Input Bar */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--notion-card)',
          }}
        >
          <Search size={18} style={{ color: 'var(--lilac-400)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Global search across contacts, companies, deals, tasks, SOPs..."
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '0.95rem',
            }}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2 }}
            >
              <X size={15} />
            </button>
          ) : (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', padding: '2px 6px', borderRadius: '4px' }}>
              ESC to close
            </span>
          )}
        </div>

        {/* Category Pills */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            background: 'rgba(0, 0, 0, 0.25)',
            borderBottom: '1px solid var(--border-subtle)',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'all', label: 'All Results' },
            { id: 'contacts', label: 'Contacts', count: contacts.length },
            { id: 'companies', label: 'Companies', count: companies.length },
            { id: 'opportunities', label: 'Deals', count: opportunities.length },
            { id: 'tasks', label: 'Tasks', count: tasks.length },
            { id: 'docs', label: 'Docs', count: notionDocs.length },
          ].map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setActiveCategory(c.id as SearchCategory);
                setSelectedIndex(0);
              }}
              style={{
                background: activeCategory === c.id ? 'var(--lilac-subtle)' : 'transparent',
                border: activeCategory === c.id ? '1px solid var(--lilac-border)' : '1px solid transparent',
                color: activeCategory === c.id ? 'var(--lilac-300)' : 'var(--text-muted)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: activeCategory === c.id ? 600 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {c.label} {c.count !== undefined && <span style={{ opacity: 0.65 }}>({c.count})</span>}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '8px' }}>
          {!query.trim() ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Type to instantly search all records
              </div>
              <div style={{ fontSize: '0.76rem', marginTop: '6px' }}>
                Search by client name, email, phone, company, deal value, or task title.
              </div>
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                No records matching <strong style={{ color: 'var(--text-main)' }}>"{query}"</strong>
              </div>
              <div style={{ fontSize: '0.76rem', marginTop: '4px' }}>
                Try searching with a different keyword or select another category filter.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {results.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: isSelected ? 'var(--notion-surface-hover)' : 'transparent',
                      border: isSelected ? '1px solid rgba(167, 139, 250, 0.3)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <img 
                        src={item.iconSrc} 
                        alt="" 
                        style={{ width: '22px', height: '22px', objectFit: 'contain', flexShrink: 0 }} 
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: isSelected ? 'var(--lilac-300)' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <span className="notion-badge" style={{ fontSize: '0.64rem', textTransform: 'capitalize' }}>
                        {item.type}
                      </span>
                      {isSelected && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--lilac-400)' }}>
                          <span>Jump to</span>
                          <CornerDownLeft size={11} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div 
          style={{
            padding: '8px 16px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--notion-sidebar)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>AutoFlow Studio Global Index</span>
        </div>
      </div>
    </div>
  );
};
