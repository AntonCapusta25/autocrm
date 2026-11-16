import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Opportunity, PipelineStage, NotionDatabaseView } from '../../types';
import { 
  KanbanSquare, Plus, Search, Filter, DollarSign, Calendar, 
  User, Building2, Trash2, Edit, ChevronRight, Check
} from 'lucide-react';
import { OpportunityModal } from './OpportunityModal';
import { NotionViewSwitcher } from '../Common/NotionViewSwitcher';

const PIPELINE_STAGES: { stage: PipelineStage; color: string; label: string }[] = [
  { stage: 'New Lead', color: '#8b8f9a', label: 'New Lead' },
  { stage: 'Contacted', color: '#60a5fa', label: 'Contacted' },
  { stage: 'Qualified', color: '#fbbf24', label: 'Qualified' },
  { stage: 'Proposal', color: '#c084fc', label: 'Proposal' },
  { stage: 'Won', color: '#34d399', label: 'Won' },
  { stage: 'Lost', color: '#f87171', label: 'Lost' },
];

export const PipelineView: React.FC = () => {
  const { opportunities, moveOpportunityStage, deleteOpportunity, teamMembers } = useApp();

  const [activeView, setActiveView] = useState<NotionDatabaseView>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOwnerFilter, setSelectedOwnerFilter] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [modalStage, setModalStage] = useState<PipelineStage>('New Lead');
  const [draggedOppId, setDraggedOppId] = useState<string | null>(null);

  // Filtered opportunities
  const filteredOpps = useMemo(() => {
    return opportunities.filter(opp => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !q ||
        opp.name.toLowerCase().includes(q) ||
        (opp.contact_name && opp.contact_name.toLowerCase().includes(q)) ||
        (opp.company_name && opp.company_name.toLowerCase().includes(q));

      const matchesOwner = !selectedOwnerFilter || opp.owner_id === selectedOwnerFilter;
      const matchesStage = !selectedStageFilter || opp.stage === selectedStageFilter;

      return matchesSearch && matchesOwner && matchesStage;
    });
  }, [opportunities, searchQuery, selectedOwnerFilter, selectedStageFilter]);

  // Total Pipeline Value
  const totalValue = useMemo(() => {
    return filteredOpps
      .filter(o => o.stage !== 'Lost')
      .reduce((sum, o) => sum + (o.deal_value || 0), 0);
  }, [filteredOpps]);

  const wonValue = useMemo(() => {
    return filteredOpps
      .filter(o => o.stage === 'Won')
      .reduce((sum, o) => sum + (o.deal_value || 0), 0);
  }, [filteredOpps]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedOppId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedOppId;
    if (id) {
      moveOpportunityStage(id, targetStage);
    }
    setDraggedOppId(null);
  };

  const handleEditOpp = (opp: Opportunity, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingOpp(opp);
    setModalStage(opp.stage);
    setModalOpen(true);
  };

  const handleDeleteOpp = (opp: Opportunity, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete opportunity "${opp.name}"?`)) {
      deleteOpportunity(opp.id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Header with Value Metrics */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="/assets/clay/chart.png" 
              alt="Sales Pipeline" 
              style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
            />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Sales Pipeline & Deal Flow
            </h1>
            <span className="notion-badge">{opportunities.length} deals</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>Active Pipeline: <strong style={{ color: 'var(--lilac-300)', fontWeight: 700 }} className="tabular-nums">${totalValue.toLocaleString()}</strong></span>
            <span>•</span>
            <span>Total Closed Won: <strong style={{ color: '#34d399', fontWeight: 700 }} className="tabular-nums">${wonValue.toLocaleString()}</strong></span>
          </div>
        </div>

        <button 
          className="btn btn-lilac"
          onClick={() => {
            setEditingOpp(null);
            setModalStage('New Lead');
            setModalOpen(true);
          }}
        >
          <Plus size={14} /> New Opportunity
        </button>
      </div>

      {/* Notion View Switcher Bar */}
      <NotionViewSwitcher
        activeView={activeView}
        onViewChange={setActiveView}
        availableViews={['board', 'table', 'list']}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={filteredOpps.length}
        rightAction={
          <div style={{ display: 'flex', gap: '6px' }}>
            <select
              className="select"
              value={selectedOwnerFilter}
              onChange={e => setSelectedOwnerFilter(e.target.value)}
              style={{ height: '30px', fontSize: '0.76rem', width: '130px', padding: '2px 8px' }}
            >
              <option value="">All Owners</option>
              {teamMembers.map(m => (
                <option key={m.id} value={m.user_id}>{m.name}</option>
              ))}
            </select>

            <select
              className="select"
              value={selectedStageFilter}
              onChange={e => setSelectedStageFilter(e.target.value)}
              style={{ height: '30px', fontSize: '0.76rem', width: '120px', padding: '2px 8px' }}
            >
              <option value="">All Stages</option>
              {PIPELINE_STAGES.map(s => (
                <option key={s.stage} value={s.stage}>{s.label}</option>
              ))}
            </select>
          </div>
        }
      />

      {/* BOARD VIEW (KANBAN) */}
      {activeView === 'board' && (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(260px, 1fr))',
            gap: '14px',
            overflowX: 'auto',
            paddingBottom: '20px'
          }}
        >
          {PIPELINE_STAGES.map(({ stage, color, label }) => {
            const stageOpps = filteredOpps.filter(o => o.stage === stage);
            const stageTotal = stageOpps.reduce((sum, o) => sum + (o.deal_value || 0), 0);

            return (
              <div
                key={stage}
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, stage)}
                className="notion-kanban-col"
              >
                {/* Column Header */}
                <div className="notion-kanban-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                    <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>{label}</span>
                    <span className="notion-badge">{stageOpps.length}</span>
                  </div>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setEditingOpp(null);
                      setModalStage(stage);
                      setModalOpen(true);
                    }}
                    style={{ padding: '2px 4px' }}
                    title={`Add deal to ${stage}`}
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Sub-header with stage deal volume */}
                <div style={{ padding: '4px 14px 10px', fontSize: '0.74rem', color: 'var(--text-muted)' }} className="tabular-nums">
                  Vol: ${stageTotal.toLocaleString()}
                </div>

                {/* Cards List */}
                <div style={{ padding: '4px 8px 12px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
                  {stageOpps.map(opp => (
                    <div
                      key={opp.id}
                      draggable
                      onDragStart={e => handleDragStart(e, opp.id)}
                      onClick={e => handleEditOpp(opp, e)}
                      className="notion-kanban-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.35 }}>
                          {opp.name}
                        </div>
                        <button
                          onClick={e => handleDeleteOpp(opp, e)}
                          style={{ background: 'none', border: 'none', color: '#f87171', opacity: 0.6, cursor: 'pointer', padding: 0 }}
                          title="Delete deal"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--lilac-300)', marginTop: '8px' }} className="tabular-nums">
                        ${opp.deal_value.toLocaleString()}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '8px', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                        {opp.company_name && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Building2 size={12} style={{ color: 'var(--text-muted)' }} />
                            <span>{opp.company_name}</span>
                          </div>
                        )}
                        {opp.contact_name && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <User size={12} style={{ color: 'var(--text-muted)' }} />
                            <span>{opp.contact_name}</span>
                          </div>
                        )}
                      </div>

                      <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--notion-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        <span className="tabular-nums">Close: {opp.expected_closing_date}</span>
                        {opp.owner_name && (
                          <span style={{ color: 'var(--text-secondary)' }}>{opp.owner_name.split(' ')[0]}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW (SPREADSHEET) */}
      {activeView === 'table' && (
        <div className="notion-table-container">
          <table className="notion-table">
            <thead>
              <tr>
                <th>Deal Name</th>
                <th>Stage</th>
                <th>Deal Value</th>
                <th>Associated Company</th>
                <th>Primary Contact</th>
                <th>Expected Close</th>
                <th>Owner</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOpps.map(opp => (
                <tr key={opp.id} onClick={e => handleEditOpp(opp, e)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{opp.name}</td>
                  <td>
                    <span className="notion-tag sky">{opp.stage}</span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--lilac-300)' }} className="tabular-nums">
                    ${opp.deal_value.toLocaleString()}
                  </td>
                  <td>{opp.company_name || '—'}</td>
                  <td>{opp.contact_name || '—'}</td>
                  <td className="tabular-nums" style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{opp.expected_closing_date}</td>
                  <td>{opp.owner_name || '—'}</td>
                  <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                    <button className="btn btn-ghost btn-sm" onClick={e => handleDeleteOpp(opp, e)} style={{ color: '#f87171' }}>
                      <Trash2 size={13} />
                    </button>
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
          {filteredOpps.map(opp => (
            <div
              key={opp.id}
              onClick={e => handleEditOpp(opp, e)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px',
                borderBottom: '1px solid var(--notion-border)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="notion-tag sky" style={{ width: '90px', justifyContent: 'center' }}>{opp.stage}</span>
                <span style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--text-main)' }}>{opp.name}</span>
                {opp.company_name && <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>• {opp.company_name}</span>}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontWeight: 700, color: 'var(--lilac-300)' }} className="tabular-nums">${opp.deal_value.toLocaleString()}</span>
                <span className="tabular-nums" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Close: {opp.expected_closing_date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Opportunity Modal */}
      {modalOpen && (
        <OpportunityModal 
          oppToEdit={editingOpp}
          initialStage={modalStage}
          onClose={() => {
            setModalOpen(false);
            setEditingOpp(null);
          }}
        />
      )}
    </div>
  );
};
