import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Contact, NotionDatabaseView } from '../../types';
import { 
  Users, Search, Plus, Download, Upload, Filter, 
  Trash2, Edit, ChevronRight, Eye, Phone, Mail, Building2, Calendar
} from 'lucide-react';
import { ContactModal } from './ContactModal';
import { ContactDetailDrawer } from './ContactDetailDrawer';
import { DataTransferModal } from '../ImportExport/DataTransferModal';
import { NotionViewSwitcher } from '../Common/NotionViewSwitcher';

interface ContactsViewProps {
  onOpenNewTaskForContact: (contact: Contact) => void;
  selectedContactId?: string | null;
  onClearSelectedContact?: () => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  onOpenNewTaskForContact,
  selectedContactId,
  onClearSelectedContact,
}) => {
  const { contacts, deleteContact, exportContactsCSV, companies } = useApp();

  const [activeView, setActiveView] = useState<NotionDatabaseView>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  
  const [drawerContact, setDrawerContact] = useState<Contact | null>(() => {
    if (selectedContactId) {
      return contacts.find(c => c.id === selectedContactId) || null;
    }
    return null;
  });

  // Sync if selectedContactId changes from props
  React.useEffect(() => {
    if (selectedContactId) {
      const match = contacts.find(c => c.id === selectedContactId);
      if (match) setDrawerContact(match);
    }
  }, [selectedContactId, contacts]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    contacts.forEach(c => c.tags?.forEach(t => set.add(t)));
    return Array.from(set);
  }, [contacts]);

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      const q = searchQuery.toLowerCase();
      const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
      const matchesSearch = 
        !searchQuery || 
        fullName.includes(q) || 
        c.email.toLowerCase().includes(q) || 
        (c.phone && c.phone.includes(q)) ||
        (c.company_name && c.company_name.toLowerCase().includes(q)) ||
        (c.job_title && c.job_title.toLowerCase().includes(q));

      const matchesCompany = !selectedCompanyFilter || c.company_name === selectedCompanyFilter;
      const matchesTag = !selectedTagFilter || c.tags?.includes(selectedTagFilter);

      return matchesSearch && matchesCompany && matchesTag;
    });
  }, [contacts, searchQuery, selectedCompanyFilter, selectedTagFilter]);

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setModalOpen(true);
  };

  const handleDelete = (contact: Contact, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${contact.first_name} ${contact.last_name}?`)) {
      deleteContact(contact.id);
      if (drawerContact?.id === contact.id) setDrawerContact(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="/assets/clay/contacts.png" 
              alt="Contacts" 
              style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
            />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Contacts & Accounts
            </h1>
            <span className="notion-badge">{contacts.length} total</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage individual client stakeholders, custom attributes, tags, and complete historical activity timelines.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setCsvModalOpen(true)}
            title="Import Contacts from CSV"
          >
            <Upload size={13} /> Import CSV
          </button>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={exportContactsCSV}
            title="Export Contacts as CSV"
          >
            <Download size={13} /> Export CSV
          </button>
          <button 
            className="btn btn-lilac"
            onClick={() => {
              setEditingContact(null);
              setModalOpen(true);
            }}
          >
            <Plus size={14} /> New Contact
          </button>
        </div>
      </div>

      {/* Notion Database View Switcher Bar */}
      <NotionViewSwitcher
        activeView={activeView}
        onViewChange={setActiveView}
        availableViews={['table', 'board', 'list']}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={filteredContacts.length}
        rightAction={
          <div style={{ display: 'flex', gap: '6px' }}>
            <select 
              className="select"
              value={selectedCompanyFilter}
              onChange={e => setSelectedCompanyFilter(e.target.value)}
              style={{ height: '30px', fontSize: '0.76rem', width: '130px', padding: '2px 8px' }}
            >
              <option value="">All Companies</option>
              {companies.map(comp => (
                <option key={comp.id} value={comp.name}>{comp.name}</option>
              ))}
            </select>

            <select 
              className="select"
              value={selectedTagFilter}
              onChange={e => setSelectedTagFilter(e.target.value)}
              style={{ height: '30px', fontSize: '0.76rem', width: '110px', padding: '2px 8px' }}
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        }
      />

      {/* View Content based on activeView */}
      {activeView === 'table' && (
        <div className="notion-table-container">
          <table className="notion-table">
            <thead>
              <tr>
                <th>Name & Title</th>
                <th>Company</th>
                <th>Contact Methods</th>
                <th>Tags & Custom Fields</th>
                <th>Last Updated</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No contacts found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredContacts.map(contact => (
                  <tr 
                    key={contact.id}
                    onClick={() => setDrawerContact(contact)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Name */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div 
                          style={{ 
                            width: '28px', 
                            height: '28px', 
                            borderRadius: '50%', 
                            background: 'var(--lilac-bg-subtle)',
                            border: '1px solid var(--lilac-border)',
                            color: 'var(--lilac-300)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            flexShrink: 0
                          }}
                        >
                          {contact.first_name[0]}{contact.last_name[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                            {contact.first_name} {contact.last_name}
                          </div>
                          {contact.job_title && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                              {contact.job_title}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td>
                      {contact.company_name ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                          <Building2 size={13} style={{ color: 'var(--text-muted)' }} />
                          <span>{contact.company_name}</span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>—</span>
                      )}
                    </td>

                    {/* Contact Methods */}
                    <td>
                      <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ color: 'var(--text-main)' }}>{contact.email}</span>
                        {contact.phone && (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{contact.phone}</span>
                        )}
                      </div>
                    </td>

                    {/* Tags */}
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {contact.tags.map(t => (
                          <span key={t} className="notion-tag lilac">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Last Updated */}
                    <td>
                      <span className="tabular-nums" style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        {new Date(contact.updated_at).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <button 
                          className="btn btn-ghost btn-sm"
                          onClick={() => setDrawerContact(contact)}
                          title="View Full Profile"
                        >
                          <Eye size={13} />
                        </button>
                        <button 
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleEdit(contact)}
                          title="Edit Contact"
                        >
                          <Edit size={13} />
                        </button>
                        <button 
                          className="btn btn-ghost btn-sm"
                          onClick={e => handleDelete(contact, e)}
                          style={{ color: '#f87171' }}
                          title="Delete Contact"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Board View: Contacts grouped by Tags */}
      {activeView === 'board' && (
        <div className="notion-kanban-grid">
          {['VIP Client', 'Decision Maker', 'Enterprise', 'Inbound', 'General'].map(tagGroup => {
            const matches = filteredContacts.filter(c => 
              tagGroup === 'General' ? (!c.tags || c.tags.length === 0) : c.tags?.includes(tagGroup)
            );
            return (
              <div key={tagGroup} className="notion-kanban-col">
                <div className="notion-kanban-header">
                  <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>{tagGroup}</span>
                  <span className="notion-badge">{matches.length}</span>
                </div>
                <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
                  {matches.map(c => (
                    <div 
                      key={c.id} 
                      className="notion-kanban-card"
                      onClick={() => setDrawerContact(c)}
                    >
                      <div style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                        {c.first_name} {c.last_name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {c.job_title || c.company_name || c.email}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View: Clean Minimal Notion List */}
      {activeView === 'list' && (
        <div className="notion-card" style={{ padding: '8px 12px' }}>
          {filteredContacts.map(c => (
            <div
              key={c.id}
              onClick={() => setDrawerContact(c)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderBottom: '1px solid var(--notion-border)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  {c.first_name} {c.last_name}
                </span>
                {c.company_name && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    • {c.company_name}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {c.tags.slice(0, 2).map(t => (
                  <span key={t} className="notion-tag slate" style={{ fontSize: '0.68rem' }}>{t}</span>
                ))}
                <span className="tabular-nums" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {new Date(c.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals & Drawers */}
      {modalOpen && (
        <ContactModal 
          contactToEdit={editingContact}
          onClose={() => {
            setModalOpen(false);
            setEditingContact(null);
          }}
        />
      )}

      {csvModalOpen && (
        <DataTransferModal 
          isOpen={csvModalOpen}
          onClose={() => setCsvModalOpen(false)}
          initialMode="import"
          initialEntity="contacts"
        />
      )}

      {drawerContact && (
        <ContactDetailDrawer 
          contact={drawerContact}
          onClose={() => {
            setDrawerContact(null);
            if (onClearSelectedContact) onClearSelectedContact();
          }}
          onEdit={c => {
            setDrawerContact(null);
            handleEdit(c);
          }}
          onOpenNewTaskForContact={c => {
            onOpenNewTaskForContact(c);
          }}
        />
      )}
    </div>
  );
};
