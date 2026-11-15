import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Opportunity, PipelineStage } from '../../types';
import { X } from 'lucide-react';

const STAGES: PipelineStage[] = ['New Lead', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

interface OpportunityModalProps {
  oppToEdit?: Opportunity | null;
  initialStage?: PipelineStage;
  onClose: () => void;
}

export const OpportunityModal: React.FC<OpportunityModalProps> = ({ 
  oppToEdit, 
  initialStage = 'New Lead', 
  onClose 
}) => {
  const { addOpportunity, updateOpportunity, contacts, companies, teamMembers } = useApp();

  const [name, setName] = useState(oppToEdit?.name || '');
  const [dealValue, setDealValue] = useState(oppToEdit?.deal_value?.toString() || '15000');
  const [stage, setStage] = useState<PipelineStage>(oppToEdit?.stage || initialStage);
  const [contactId, setContactId] = useState(oppToEdit?.contact_id || '');
  const [companyId, setCompanyId] = useState(oppToEdit?.company_id || '');
  const [ownerId, setOwnerId] = useState(oppToEdit?.owner_id || teamMembers[0]?.user_id || '');
  const [closingDate, setClosingDate] = useState(
    oppToEdit?.expected_closing_date || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState(oppToEdit?.notes || '');

  // Auto-fill company when contact is selected
  const handleContactChange = (newContactId: string) => {
    setContactId(newContactId);
    if (newContactId) {
      const match = contacts.find(c => c.id === newContactId);
      if (match && match.company_id && !companyId) {
        setCompanyId(match.company_id);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const matchedContact = contacts.find(c => c.id === contactId);
    const matchedCompany = companies.find(c => c.id === companyId);
    const matchedOwner = teamMembers.find(m => m.user_id === ownerId);

    const val = parseFloat(dealValue) || 0;

    if (oppToEdit) {
      updateOpportunity(oppToEdit.id, {
        name: name.trim(),
        deal_value: val,
        stage,
        contact_id: contactId || undefined,
        contact_name: matchedContact ? `${matchedContact.first_name} ${matchedContact.last_name}` : undefined,
        company_id: companyId || undefined,
        company_name: matchedCompany ? matchedCompany.name : undefined,
        owner_id: ownerId || undefined,
        owner_name: matchedOwner ? matchedOwner.name : undefined,
        expected_closing_date: closingDate,
        notes: notes.trim(),
      });
    } else {
      addOpportunity({
        name: name.trim(),
        deal_value: val,
        stage,
        contact_id: contactId || undefined,
        contact_name: matchedContact ? `${matchedContact.first_name} ${matchedContact.last_name}` : undefined,
        company_id: companyId || undefined,
        company_name: matchedCompany ? matchedCompany.name : undefined,
        owner_id: ownerId || undefined,
        owner_name: matchedOwner ? matchedOwner.name : undefined,
        expected_closing_date: closingDate,
        notes: notes.trim(),
      });
    }

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            {oppToEdit ? 'Edit Opportunity' : 'New Sales Opportunity'}
          </h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Opportunity Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                Opportunity Name *
              </label>
              <input 
                type="text" 
                className="input" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="e.g. Enterprise Automation Pilot"
              />
            </div>

            {/* Deal Value & Pipeline Stage */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Deal Value ($ USD) *
                </label>
                <input 
                  type="number" 
                  className="input" 
                  min="0"
                  step="100"
                  required 
                  value={dealValue} 
                  onChange={e => setDealValue(e.target.value)} 
                  placeholder="25000"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Pipeline Stage
                </label>
                <select 
                  className="select" 
                  value={stage} 
                  onChange={e => setStage(e.target.value as PipelineStage)}
                >
                  {STAGES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Associated Contact & Company */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Associated Contact
                </label>
                <select 
                  className="select" 
                  value={contactId} 
                  onChange={e => handleContactChange(e.target.value)}
                >
                  <option value="">None selected</option>
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.first_name} {c.last_name} {c.company_name ? `(${c.company_name})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Associated Company
                </label>
                <select 
                  className="select" 
                  value={companyId} 
                  onChange={e => setCompanyId(e.target.value)}
                >
                  <option value="">None selected</option>
                  {companies.map(comp => (
                    <option key={comp.id} value={comp.id}>{comp.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Deal Owner & Expected Closing Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Deal Owner (Assignee)
                </label>
                <select 
                  className="select" 
                  value={ownerId} 
                  onChange={e => setOwnerId(e.target.value)}
                >
                  {teamMembers.map(m => (
                    <option key={m.user_id} value={m.user_id}>{m.name} ({m.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Expected Closing Date
                </label>
                <input 
                  type="date" 
                  className="input" 
                  value={closingDate} 
                  onChange={e => setClosingDate(e.target.value)} 
                />
              </div>
            </div>

            {/* Opportunity Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                Opportunity Notes & Strategy
              </label>
              <textarea 
                className="textarea" 
                rows={3} 
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
                placeholder="Deal requirements, decision criteria, competitors..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-lilac">
              {oppToEdit ? 'Save Opportunity' : 'Create Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
