import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react';

interface CSVImportModalProps {
  onClose: () => void;
}

export const CSVImportModal: React.FC<CSVImportModalProps> = ({ onClose }) => {
  const { importContactsCSV } = useApp();

  const [csvText, setCsvText] = useState(`First Name,Last Name,Email,Phone,Company,Job Title
Rachel,Adams,rachel.adams@zenith.ai,+1 555-891-2299,Zenith AI,VP Partnerships
Lucas,Moreau,lucas@novatech.co,+33 1 42 68 55 00,Nova Technologies,Lead Engineer
Amara,Kanu,amara@apexventures.io,+1 555-901-3311,Apex Ventures,Investment Director`);

  const [resultCount, setResultCount] = useState<number | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) setCsvText(text);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!csvText.trim()) return;
    const count = importContactsCSV(csvText);
    setResultCount(count);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Upload size={18} style={{ color: 'var(--lilac-400)' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Import Contacts from CSV</h3>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Upload a CSV file or paste comma-separated values below. Expected columns: <code>First Name, Last Name, Email, Phone, Company, Job Title</code>.
          </p>

          <div>
            <label 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px',
                border: '1px dashed var(--lilac-border)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--lilac-bg-subtle)',
                cursor: 'pointer',
                fontSize: '0.84rem',
                color: 'var(--lilac-300)',
                marginBottom: '12px'
              }}
            >
              <Upload size={16} />
              <span>Choose a CSV file from your computer</span>
              <input type="file" accept=".csv,text/csv" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
              CSV Data Preview / Manual Input
            </label>
            <textarea
              className="textarea"
              rows={8}
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}
            />
          </div>

          {resultCount !== null && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '10px 14px', 
              borderRadius: 'var(--radius-md)', 
              background: 'rgba(52, 211, 153, 0.15)',
              color: '#34d399',
              fontSize: '0.84rem',
              fontWeight: 600 
            }}>
              <CheckCircle2 size={16} />
              <span>Successfully imported {resultCount} contacts!</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-lilac" 
            onClick={handleImport}
            disabled={!csvText.trim() || resultCount !== null}
          >
            Import Contacts
          </button>
        </div>
      </div>
    </div>
  );
};
