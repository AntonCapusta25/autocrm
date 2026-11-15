import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Contact } from '../../types';
import { X, Plus, Trash2 } from 'lucide-react';

interface ContactModalProps {
  contactToEdit?: Contact | null;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ contactToEdit, onClose }) => {
  const { addContact, updateContact, companies } = useApp();

  const [firstName, setFirstName] = useState(contactToEdit?.first_name || '');
  const [lastName, setLastName] = useState(contactToEdit?.last_name || '');
  const [email, setEmail] = useState(contactToEdit?.email || '');
  const [phone, setPhone] = useState(contactToEdit?.phone || '');
  const [companyId, setCompanyId] = useState(contactToEdit?.company_id || '');
  const [jobTitle, setJobTitle] = useState(contactToEdit?.job_title || '');
  const [notes, setNotes] = useState(contactToEdit?.notes || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(contactToEdit?.tags || []);
  
  // Custom fields
  const [customFields, setCustomFields] = useState<{ key: string; value: string }[]>(() => {
    if (contactToEdit?.custom_fields) {
      return Object.entries(contactToEdit.custom_fields).map(([key, value]) => ({ key, value }));
    }
    return [];
  });

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddCustomField = () => {
    setCustomFields([...customFields, { key: '', value: '' }]);
  };

  const handleCustomFieldChange = (index: number, key: string, value: string) => {
    const updated = [...customFields];
    updated[index] = { key, value };
    setCustomFields(updated);
  };

  const handleRemoveCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) return;

    const matchedComp = companies.find(c => c.id === companyId);
    const customFieldsObj: Record<string, string> = {};
    customFields.forEach(f => {
      if (f.key.trim()) {
        customFieldsObj[f.key.trim()] = f.value.trim();
      }
    });

    if (contactToEdit) {
      updateContact(contactToEdit.id, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company_id: companyId || undefined,
        company_name: matchedComp ? matchedComp.name : undefined,
        job_title: jobTitle.trim(),
        notes: notes.trim(),
        tags,
        custom_fields: customFieldsObj,
      });
    } else {
      addContact({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company_id: companyId || undefined,
        company_name: matchedComp ? matchedComp.name : undefined,
        job_title: jobTitle.trim(),
        notes: notes.trim(),
        tags,
        custom_fields: customFieldsObj,
      });
    }

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            {contactToEdit ? 'Edit Contact' : 'Create New Contact'}
          </h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {/* First & Last Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  First Name *
                </label>
                <input 
                  type="text" 
                  className="input" 
                  required 
                  value={firstName} 
                  onChange={e => setFirstName(e.target.value)} 
                  placeholder="e.g. Elena"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Last Name
                </label>
                <input 
                  type="text" 
                  className="input" 
                  value={lastName} 
                  onChange={e => setLastName(e.target.value)} 
                  placeholder="e.g. Rostova"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Email Address *
                </label>
                <input 
                  type="email" 
                  className="input" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="elena@company.com"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  className="input" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Company & Job Title */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Associated Company
                </label>
                <select 
                  className="select" 
                  value={companyId} 
                  onChange={e => setCompanyId(e.target.value)}
                >
                  <option value="">No Company Linked</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Job Title
                </label>
                <input 
                  type="text" 
                  className="input" 
                  value={jobTitle} 
                  onChange={e => setJobTitle(e.target.value)} 
                  placeholder="e.g. Head of Engineering"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                Tags
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Type tag & click add (e.g. VIP, Decision Maker)"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                />
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddTag}>
                  Add
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {tags.map(t => (
                  <span key={t} className="badge badge-lilac" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    {t}
                    <X size={12} style={{ cursor: 'pointer' }} onClick={() => handleRemoveTag(t)} />
                  </span>
                ))}
              </div>
            </div>

            {/* Custom Fields */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Custom Fields
                </label>
                <button 
                  type="button" 
                  className="btn btn-ghost btn-sm" 
                  onClick={handleAddCustomField}
                  style={{ fontSize: '0.75rem', color: 'var(--lilac-300)' }}
                >
                  <Plus size={13} /> Add Field
                </button>
              </div>

              {customFields.map((field, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="Field name (e.g. Budget Tier)" 
                    value={field.key} 
                    onChange={e => handleCustomFieldChange(idx, e.target.value, field.value)}
                    style={{ flex: 1 }}
                  />
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="Value (e.g. $50k)" 
                    value={field.value} 
                    onChange={e => handleCustomFieldChange(idx, field.key, e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button 
                    type="button" 
                    className="btn btn-ghost btn-icon" 
                    onClick={() => handleRemoveCustomField(idx)}
                    style={{ color: '#f87171' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                General Notes
              </label>
              <textarea 
                className="textarea" 
                rows={3} 
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
                placeholder="Important context, conversation history or requirements..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-lilac">
              {contactToEdit ? 'Save Changes' : 'Create Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
