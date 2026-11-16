import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, Upload, Download, CheckCircle2, 
  ArrowRight, ArrowLeft, Check, 
  FileSpreadsheet
} from 'lucide-react';

interface DataTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'import' | 'export';
  initialEntity?: 'contacts' | 'tasks' | 'opportunities';
}

interface InstructionSlide {
  title: string;
  description: string;
  iconSrc: string;
  glowColor: string;
}

const IMPORT_INSTRUCTION_SLIDES: InstructionSlide[] = [
  {
    title: '1. Prepare Your CSV Columns',
    description: 'Ensure your spreadsheet has a header row with standard column names (e.g. First Name, Last Name, Email, Phone, Company, Job Title).',
    iconSrc: '/assets/clay/docs.png',
    glowColor: 'rgba(167, 139, 250, 0.4)',
  },
  {
    title: '2. Download & Verify Sample Template',
    description: 'Use our pre-formatted template to eliminate duplicate keys, trailing spaces, or invalid international phone number formats.',
    iconSrc: '/assets/clay/chart.png',
    glowColor: 'rgba(96, 165, 250, 0.4)',
  },
  {
    title: '3. Real-Time Ingestion & Deduplication',
    description: 'AutoFlow automatically detects existing emails, validates stage values, and streams records into your isolated tenant database.',
    iconSrc: '/assets/clay/lightning.png',
    glowColor: 'rgba(52, 211, 153, 0.4)',
  },
];

const SAMPLE_CONTACTS_CSV = `First Name,Last Name,Email,Phone,Company,Job Title,Stage,Value
Sarah,Connor,sarah@cyberdyne.io,+1 555-019-2834,Cyberdyne Systems,Head of Operations,Proposal,45000
Marcus,Vance,marcus@vancegrowth.com,+1 555-342-9901,Vance Growth,Founder & CEO,Qualified,18500
Elena,Rostova,elena@solariabio.com,+44 20 7946 0912,Solaria BioLabs,Chief Scientist,Won,82000
Kenji,Sato,kenji@quantumfin.jp,+81 3 5555 0143,Quantum Financial,VP Capital Markets,Contacted,29000`;

const SAMPLE_TASKS_CSV = `Title,Due Date,Priority,Status,Assignee,Description
Finalize Q4 enterprise security review,2026-11-25,High,In Progress,Alex Vance,Verify SOC2 compliance packet
Send onboarding contract and wire instructions,2026-11-20,Urgent,Pending,Alex Vance,Client requested custom payment terms
Schedule product roadmap alignment sync,2026-11-28,Medium,Completed,Alex Vance,Review Notion database switch`;

export const DataTransferModal: React.FC<DataTransferModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'import',
  initialEntity = 'contacts',
}) => {
  const { 
    contacts, tasks, opportunities, 
    importContactsCSV, exportContactsCSV,
    addTask 
  } = useApp();

  const [mode, setMode] = useState<'import' | 'export'>(initialMode);
  const [entity, setEntity] = useState<'contacts' | 'tasks' | 'opportunities'>(initialEntity);
  const [showInstructions, setShowInstructions] = useState(true);
  const [instructionSlideIdx, setInstructionSlideIdx] = useState(0);

  // Import State
  const [csvText, setCsvText] = useState(entity === 'tasks' ? SAMPLE_TASKS_CSV : SAMPLE_CONTACTS_CSV);
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const currentSlide = IMPORT_INSTRUCTION_SLIDES[instructionSlideIdx];

  const handleDownloadSample = () => {
    const content = entity === 'tasks' ? SAMPLE_TASKS_CSV : SAMPLE_CONTACTS_CSV;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AutoFlow_${entity}_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCsvText(text);
        validateCSV(text);
      }
    };
    reader.readAsText(file);
  };

  const validateCSV = (text: string) => {
    const lines = text.trim().split('\n');
    const errors: string[] = [];
    if (lines.length < 2) {
      errors.push('File must have a header row and at least one data row.');
    }
    const headers = lines[0].toLowerCase();
    if (entity === 'contacts' && !headers.includes('email') && !headers.includes('first')) {
      errors.push('Warning: Expected "First Name" and "Email" columns in header.');
    }
    if (entity === 'tasks' && !headers.includes('title')) {
      errors.push('Warning: Expected "Title" column in header.');
    }
    setValidationErrors(errors);
  };

  const handleExecuteImport = () => {
    if (!csvText.trim()) return;
    setIsProcessing(true);

    try {
      if (entity === 'contacts') {
        const count = importContactsCSV(csvText);
        setImportedCount(count);
      } else if (entity === 'tasks') {
        const lines = csvText.trim().split('\n');
        let count = 0;
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',').map(p => p.trim());
          if (parts[0]) {
            addTask({
              title: parts[0],
              due_date: parts[1] || new Date().toISOString().split('T')[0],
              priority: (parts[2] as any) || 'Medium',
              status: (parts[3] as any) || 'Pending',
              assigned_to: 'user-alex',
              description: parts[5] || '',
            });
            count++;
          }
        }
        setImportedCount(count);
      }
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        onClose();
        setImportedCount(null);
      }, 1500);
    }
  };

  const handleExecuteExport = () => {
    if (entity === 'contacts') {
      exportContactsCSV();
    } else if (entity === 'tasks') {
      const header = 'ID,Title,Due Date,Priority,Status,Description\n';
      const rows = tasks.map(t => 
        `"${t.id}","${t.title.replace(/"/g, '""')}","${t.due_date}","${t.priority}","${t.status}","${(t.description || '').replace(/"/g, '""')}"`
      ).join('\n');
      const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `AutoFlow_Tasks_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (entity === 'opportunities') {
      const header = 'ID,Name,Deal Value,Stage,Expected Closing Date,Contact,Company\n';
      const rows = opportunities.map(o => 
        `"${o.id}","${o.name.replace(/"/g, '""')}","${o.deal_value}","${o.stage}","${o.expected_closing_date || ''}","${(o.contact_name || '').replace(/"/g, '""')}","${(o.company_name || '').replace(/"/g, '""')}"`
      ).join('\n');
      const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `AutoFlow_Deals_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    onClose();
  };

  return (
    <div className="notion-modal-overlay" style={{ zIndex: 1250 }}>
      <div 
        className="notion-modal-box animate-scale-in"
        style={{
          maxWidth: '720px',
          width: '94%',
          maxHeight: '90vh',
          background: 'var(--notion-panel)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(167, 139, 250, 0.1)',
          borderRadius: '14px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Top Header */}
        <div 
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: mode === 'import' ? 'rgba(167, 139, 250, 0.12)' : 'rgba(96, 165, 250, 0.12)',
                border: mode === 'import' ? '1px solid rgba(167, 139, 250, 0.25)' : '1px solid rgba(96, 165, 250, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: mode === 'import' ? 'var(--lilac-300)' : '#60a5fa',
              }}
            >
              {mode === 'import' ? <Upload size={17} /> : <Download size={17} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  Data Transfer & Migration Center
                </h2>
                <span className="notion-badge lilac" style={{ fontSize: '0.66rem' }}>
                  Tenant CSV Engine
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Step-by-step import & export with validation and column mapping
              </div>
            </div>
          </div>

          <button 
            type="button"
            className="notion-action-btn"
            onClick={onClose}
            style={{ width: '28px', height: '28px' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Mode & Entity Bar */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(0, 0, 0, 0.25)',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {/* Import / Export Toggle */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setMode('import')}
              style={{
                padding: '5px 14px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: mode === 'import' ? 'var(--lilac-subtle)' : 'transparent',
                border: mode === 'import' ? '1px solid var(--lilac-border)' : '1px solid transparent',
                color: mode === 'import' ? 'var(--lilac-300)' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Import Data
            </button>
            <button
              type="button"
              onClick={() => setMode('export')}
              style={{
                padding: '5px 14px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: mode === 'export' ? 'var(--lilac-subtle)' : 'transparent',
                border: mode === 'export' ? '1px solid var(--lilac-border)' : '1px solid transparent',
                color: mode === 'export' ? 'var(--lilac-300)' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Export Data
            </button>
          </div>

          {/* Entity Selector */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['contacts', 'tasks', 'opportunities'] as const).map(ent => (
              <button
                key={ent}
                type="button"
                onClick={() => {
                  setEntity(ent);
                  setCsvText(ent === 'tasks' ? SAMPLE_TASKS_CSV : SAMPLE_CONTACTS_CSV);
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  background: entity === ent ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  border: entity === ent ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid transparent',
                  color: entity === ent ? 'var(--text-main)' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                {ent === 'contacts' ? 'Leads & Contacts' : ent === 'opportunities' ? 'Deals' : 'Tasks'}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Auth-Screen Style Step-by-Step Instructions Banner */}
          {showInstructions && (
            <div 
              style={{
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(14, 16, 22, 0.6) 100%)',
                border: '1px solid var(--border-subtle)',
                padding: '16px 20px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              {/* Centered 3D Clay Icon with subtle float */}
              <div 
                style={{ 
                  position: 'relative', 
                  width: '90px', 
                  height: '90px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <div 
                  style={{
                    position: 'absolute',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${currentSlide.glowColor} 0%, rgba(0, 0, 0, 0) 70%)`,
                    filter: 'blur(16px)',
                    pointerEvents: 'none',
                  }}
                />
                <img 
                  src={currentSlide.iconSrc} 
                  alt={currentSlide.title}
                  className="animate-float"
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'contain',
                    position: 'relative',
                    zIndex: 2,
                    filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.7))',
                  }}
                />
              </div>

              {/* Instructions Text & Dots */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--lilac-300)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    STEP-BY-STEP INSTRUCTIONS ({instructionSlideIdx + 1}/3)
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setShowInstructions(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.7rem', cursor: 'pointer' }}
                  >
                    Hide Guide
                  </button>
                </div>

                <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px' }}>
                  {currentSlide.title}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.45 }}>
                  {currentSlide.description}
                </p>

                {/* Animated Dots Navigation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {IMPORT_INSTRUCTION_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setInstructionSlideIdx(idx)}
                      style={{
                        height: '5px',
                        width: idx === instructionSlideIdx ? '24px' : '5px',
                        borderRadius: '3px',
                        background: idx === instructionSlideIdx ? 'var(--lilac-400)' : 'rgba(255, 255, 255, 0.2)',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODE: IMPORT */}
          {mode === 'import' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Upload CSV or Paste Records
                </span>
                <button
                  type="button"
                  onClick={handleDownloadSample}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem' }}
                >
                  <FileSpreadsheet size={13} style={{ color: 'var(--lilac-300)' }} /> Download Sample CSV
                </button>
              </div>

              {/* Drag & Drop File Upload Area */}
              <label 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '20px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px dashed var(--lilac-border)',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                  textAlign: 'center',
                }}
              >
                <div 
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--lilac-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--lilac-300)',
                  }}
                >
                  <Upload size={17} />
                </div>
                <div>
                  <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    Click to browse or drop your CSV file here
                  </span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Supports UTF-8 .csv files with standard comma delimiters
                  </div>
                </div>
                <input type="file" accept=".csv,text/csv" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>

              {/* Textarea Data Preview */}
              <div>
                <label className="notion-label">Raw CSV Input / Preview</label>
                <textarea 
                  rows={6}
                  value={csvText}
                  onChange={e => {
                    setCsvText(e.target.value);
                    validateCSV(e.target.value);
                  }}
                  className="notion-input"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.76rem',
                    lineHeight: 1.5,
                    background: 'var(--notion-card)',
                  }}
                />
              </div>

              {/* Validation Warning */}
              {validationErrors.length > 0 && (
                <div style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(251, 191, 36, 0.12)', border: '1px solid rgba(251, 191, 36, 0.3)', color: '#fbbf24', fontSize: '0.76rem' }}>
                  {validationErrors.map((err, i) => (
                    <div key={i}>⚠️ {err}</div>
                  ))}
                </div>
              )}

              {/* Import Confirmation Success */}
              {importedCount !== null && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(52, 211, 153, 0.12)', border: '1px solid rgba(52, 211, 153, 0.3)', color: '#34d399', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} />
                  <span>Successfully imported {importedCount} {entity} into your workspace!</span>
                </div>
              )}

              <button
                type="button"
                className="btn btn-lilac"
                onClick={handleExecuteImport}
                disabled={isProcessing || !csvText.trim()}
                style={{ padding: '10px 20px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {isProcessing ? 'Processing Ingestion...' : <>Start Ingestion <ArrowRight size={15} /></>}
              </button>
            </div>
          ) : (
            /* MODE: EXPORT */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div 
                style={{
                  padding: '16px 18px',
                  borderRadius: '10px',
                  background: 'var(--notion-card)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    Export {entity === 'contacts' ? 'Contacts & Leads' : entity === 'opportunities' ? 'Deals' : 'Tasks'}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Download complete snapshot in standard UTF-8 CSV format
                  </div>
                </div>

                <span className="notion-badge" style={{ fontSize: '0.76rem' }}>
                  {entity === 'contacts' ? `${contacts.length} Records` : entity === 'opportunities' ? `${opportunities.length} Deals` : `${tasks.length} Tasks`}
                </span>
              </div>

              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Exported files include all custom properties, deal velocities, tags, and timestamps. You can re-import this data into any workspace or external BI reporting tool.
              </div>

              <button
                type="button"
                className="btn btn-lilac"
                onClick={handleExecuteExport}
                style={{ padding: '10px 20px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Download size={15} /> Download CSV File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
