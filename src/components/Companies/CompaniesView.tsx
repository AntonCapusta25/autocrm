import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Company, Contact, NotionDatabaseView } from '../../types';
import { 
  Building2, Search, Plus, ExternalLink, Mail, Phone, 
  MapPin, Users, Edit, Trash2, CheckSquare, TrendingUp 
} from 'lucide-react';
import { CompanyModal } from './CompanyModal';
import { NotionViewSwitcher } from '../Common/NotionViewSwitcher';

interface CompaniesViewProps {
  onOpenNewTaskForCompany: (company: Company) => void;
  onOpenContactProfile: (contactId: string) => void;
}

export const CompaniesView: React.FC<CompaniesViewProps> = ({
  onOpenNewTaskForCompany,
  onOpenContactProfile,
}) => {
  const { companies, contacts, opportunities, deleteCompany } = useApp();

  const [activeView, setActiveView] = useState<NotionDatabaseView>('gallery');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const filteredCompanies = companies.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      (c.industry && c.industry.toLowerCase().includes(q)) ||
      (c.address && c.address.toLowerCase().includes(q)) ||
      (c.notes && c.notes.toLowerCase().includes(q))
    );
  });

  const handleEdit = (comp: Company) => {
    setEditingCompany(comp);
    setModalOpen(true);
  };

  const handleDelete = (comp: Company) => {
    if (window.confirm(`Delete company ${comp.name}? All linked contacts will remain in contacts directory.`)) {
      deleteCompany(comp.id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="/assets/clay/companies.png" 
              alt="Companies" 
              style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
            />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Company Directory
            </h1>
            <span className="notion-badge">{companies.length} companies</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage client corporate entities, websites, linked stakeholder contacts, and opportunity volume.
          </p>
        </div>

        <button 
          className="btn btn-lilac"
          onClick={() => {
            setEditingCompany(null);
            setModalOpen(true);
          }}
        >
          <Plus size={14} /> New Company
        </button>
      </div>

      {/* Notion View Switcher Bar */}
      <NotionViewSwitcher
        activeView={activeView}
        onViewChange={setActiveView}
        availableViews={['gallery', 'table', 'list']}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={filteredCompanies.length}
      />

      {/* GALLERY VIEW (CARDS) */}
      {activeView === 'gallery' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
          {filteredCompanies.map(comp => {
            const linkedContacts = contacts.filter(c => c.company_name === comp.name || c.company_id === comp.id);
            const linkedDeals = opportunities.filter(o => o.company_name === comp.name || o.company_id === comp.id);

            return (
              <div 
                key={comp.id} 
                className="notion-card"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div 
                        style={{ 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '8px', 
                          background: 'var(--lilac-bg-subtle)',
                          border: '1px solid var(--lilac-border)',
                          color: 'var(--lilac-300)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.9rem',
                          fontWeight: 700
                        }}
                      >
                        {comp.name[0]}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{comp.name}</h3>
                        {comp.industry && (
                          <span className="notion-tag slate" style={{ marginTop: '2px' }}>
                            {comp.industry}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(comp)} title="Edit">
                        <Edit size={13} />
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(comp)} style={{ color: '#f87171' }} title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {comp.notes && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: 1.45 }}>
                      {comp.notes}
                    </p>
                  )}

                  {/* Linked Contacts */}
                  <div style={{ marginTop: '14px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Key Contacts ({linkedContacts.length})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {linkedContacts.map(c => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => onOpenContactProfile(c.id)}
                          className="notion-tag lilac"
                          style={{ cursor: 'pointer', border: '1px solid var(--lilac-border)' }}
                        >
                          {c.first_name} {c.last_name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '18px', paddingTop: '10px', borderTop: '1px solid var(--notion-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  <span>{linkedDeals.length} active deals</span>
                  <button className="btn btn-secondary btn-sm" onClick={() => onOpenNewTaskForCompany(comp)}>
                    <CheckSquare size={12} /> Add Task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {activeView === 'table' && (
        <div className="notion-table-container">
          <table className="notion-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Industry</th>
                <th>Website</th>
                <th>Phone</th>
                <th>Address</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map(comp => (
                <tr key={comp.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{comp.name}</td>
                  <td><span className="notion-tag slate">{comp.industry || '—'}</span></td>
                  <td>{comp.website || '—'}</td>
                  <td>{comp.phone || '—'}</td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comp.address || '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(comp)}><Edit size={13} /></button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(comp)} style={{ color: '#f87171' }}><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* LIST VIEW */}
      {activeView === 'list' && (
        <div className="notion-card" style={{ padding: '8px 12px' }}>
          {filteredCompanies.map(comp => (
            <div
              key={comp.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px',
                borderBottom: '1px solid var(--notion-border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--text-main)' }}>{comp.name}</span>
                {comp.industry && <span className="notion-tag slate">{comp.industry}</span>}
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => onOpenNewTaskForCompany(comp)}>
                <CheckSquare size={12} /> Add Task
              </button>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <CompanyModal 
          companyToEdit={editingCompany}
          onClose={() => {
            setModalOpen(false);
            setEditingCompany(null);
          }}
        />
      )}
    </div>
  );
};
