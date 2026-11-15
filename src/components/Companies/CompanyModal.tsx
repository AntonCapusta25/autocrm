import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Company } from '../../types';
import { X } from 'lucide-react';

interface CompanyModalProps {
  companyToEdit?: Company | null;
  onClose: () => void;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({ companyToEdit, onClose }) => {
  const { addCompany, updateCompany } = useApp();

  const [name, setName] = useState(companyToEdit?.name || '');
  const [website, setWebsite] = useState(companyToEdit?.website || '');
  const [industry, setIndustry] = useState(companyToEdit?.industry || '');
  const [phone, setPhone] = useState(companyToEdit?.phone || '');
  const [email, setEmail] = useState(companyToEdit?.email || '');
  const [address, setAddress] = useState(companyToEdit?.address || '');
  const [notes, setNotes] = useState(companyToEdit?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (companyToEdit) {
      updateCompany(companyToEdit.id, {
        name: name.trim(),
        website: website.trim(),
        industry: industry.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        notes: notes.trim(),
      });
    } else {
      addCompany({
        name: name.trim(),
        website: website.trim(),
        industry: industry.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        notes: notes.trim(),
      });
    }

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            {companyToEdit ? 'Edit Company' : 'Add New Company'}
          </h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Company Name & Website */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Company Name *
                </label>
                <input 
                  type="text" 
                  className="input" 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="e.g. Apex Global Logistics"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Website URL
                </label>
                <input 
                  type="url" 
                  className="input" 
                  value={website} 
                  onChange={e => setWebsite(e.target.value)} 
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Industry */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                Industry / Vertical
              </label>
              <input 
                type="text" 
                className="input" 
                value={industry} 
                onChange={e => setIndustry(e.target.value)} 
                placeholder="e.g. Supply Chain, FinTech, SaaS"
              />
            </div>

            {/* Email & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  General Inquiries Email
                </label>
                <input 
                  type="email" 
                  className="input" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="contact@company.com"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Headquarters Phone
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

            {/* Address */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                Office Address / Headquarters
              </label>
              <input 
                type="text" 
                className="input" 
                value={address} 
                onChange={e => setAddress(e.target.value)} 
                placeholder="100 Enterprise Way, City, Country"
              />
            </div>

            {/* Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                Company Notes & Account Background
              </label>
              <textarea 
                className="textarea" 
                rows={3} 
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
                placeholder="Key goals, company size, tech stack, notes..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-lilac">
              {companyToEdit ? 'Save Changes' : 'Create Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
