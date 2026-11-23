import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkflowAutomation, WorkflowActionType } from '../../types';
import { 
  Zap, Play, Plus, CheckCircle2, Clock, Mail, MessageSquare, 
  UserPlus, Tag, CheckSquare, Webhook, MoreVertical, ToggleLeft, 
  ToggleRight, ArrowDown, Sparkles, AlertCircle, Lock, ShieldCheck, ArrowRight
} from 'lucide-react';

const ACTION_ICONS: Record<WorkflowActionType, React.ReactNode> = {
  send_email: <Mail size={15} style={{ color: '#60a5fa' }} />,
  send_sms: <MessageSquare size={15} style={{ color: '#34d399' }} />,
  wait_delay: <Clock size={15} style={{ color: '#fbbf24' }} />,
  assign_user: <UserPlus size={15} style={{ color: '#c084fc' }} />,
  add_tag: <Tag size={15} style={{ color: '#f472b6' }} />,
  create_task: <CheckSquare size={15} style={{ color: '#38bdf8' }} />,
  webhook: <Webhook size={15} style={{ color: '#a78bfa' }} />,
};

export const WorkflowsView: React.FC = () => {
  const { 
    workflows, toggleWorkflowActive, runWorkflowTest, 
    addWorkflow, deleteWorkflow, openModuleSetupModal 
  } = useApp();

  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(workflows[0]?.id || '');
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [executionMessage, setExecutionMessage] = useState<{ id: string; text: string } | null>(null);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [showSandboxDemo, setShowSandboxDemo] = useState(false);

  // New Workflow Form State
  const [newWfName, setNewWfName] = useState('');
  const [newWfDesc, setNewWfDesc] = useState('');
  const [newWfTrigger, setNewWfTrigger] = useState<any>('contact_created');

  const selectedWorkflow = workflows.find(w => w.id === selectedWorkflowId) || workflows[0];

  const handleTestRun = async (id: string) => {
    setExecutingId(id);
    const result = await runWorkflowTest(id);
    setExecutingId(null);
    setExecutionMessage({ id, text: result.message });
    setTimeout(() => {
      setExecutionMessage(null);
    }, 4500);
  };

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWfName.trim()) return;

    addWorkflow({
      name: newWfName.trim(),
      description: newWfDesc.trim() || 'Custom automated customer event journey.',
      trigger_type: newWfTrigger,
      trigger_condition: 'Triggered when event fires in CRM',
      active: true,
      actions: [
        {
          id: `act-${Date.now()}-1`,
          type: 'send_sms',
          title: 'Send Instant SMS to Contact',
          config: { template: 'Hello from AutoFlow!' }
        },
        {
          id: `act-${Date.now()}-2`,
          type: 'create_task',
          title: 'Generate Team Follow-up Task',
          config: { priority: 'High', due: 'today' }
        }
      ]
    });

    setNewWfName('');
    setNewWfDesc('');
    setNewModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="/assets/clay/lightning.png" 
              alt="Automation Workflows" 
              style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
            />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Automation Workflows
            </h1>
            <span 
              className="notion-badge" 
              style={{ 
                background: 'rgba(245, 158, 11, 0.12)', 
                color: '#f59e0b', 
                border: '1px solid rgba(245, 158, 11, 0.25)', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '3px' 
              }}
            >
              <Lock size={11} /> Enterprise Locked
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Event-driven triggers, multi-step SMS/Email drip campaigns, ERP synchronizations, and webhook dispatches.
          </p>
        </div>

        {showSandboxDemo ? (
          <button 
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowSandboxDemo(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Lock size={13} style={{ color: '#f59e0b' }} /> Return to Locked View
          </button>
        ) : (
          <button 
            type="button"
            className="btn btn-lilac" 
            onClick={() => openModuleSetupModal('custom_agents')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles size={14} /> Request Automation
          </button>
        )}
      </div>

      {/* When Locked: Show Enterprise Locked Landing Screen */}
      {!showSandboxDemo ? (
        <div 
          className="notion-card animate-fade-in"
          style={{
            padding: '48px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: '16px',
            background: 'linear-gradient(180deg, rgba(23, 27, 38, 0.9) 0%, rgba(10, 12, 16, 0.98) 100%)',
            border: '1px solid rgba(167, 139, 250, 0.25)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 50px rgba(167, 139, 250, 0.08)',
            position: 'relative',
            overflow: 'hidden',
            maxWidth: '860px',
            margin: '10px auto 0 auto',
            width: '100%',
          }}
        >
          {/* Clay 3D Graphic with Lock Overlay */}
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <img 
              src="/assets/clay/lightning.png" 
              alt="Workflows" 
              style={{ width: '84px', height: '84px', objectFit: 'contain', filter: 'drop-shadow(0 12px 24px rgba(167, 139, 250, 0.35))' }} 
            />
            <div 
              style={{
                position: 'absolute',
                bottom: '-6px',
                right: '-6px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#0a0c10',
                border: '2px solid rgba(245, 158, 11, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b',
                boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)',
              }}
            >
              <Lock size={18} />
            </div>
          </div>

          <span 
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '4px 12px',
              borderRadius: '999px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#f59e0b',
              marginBottom: '14px',
            }}
          >
            🔒 Enterprise Module Under Lock
          </span>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', margin: 0, maxWidth: '640px' }}>
            Autonomous Workflow Engine & AI Integrations
          </h2>

          <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.6, marginTop: '12px', marginBottom: '32px' }}>
            Automations and custom workflows require custom backend setup from our engineering studio. We build and maintain custom webhooks, ERP synchronizations (Exact Online, AFAS, KvK API), and autonomous AI agent triggers tailored to your specific operations.
          </p>

          {/* Feature Cards Grid */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
              gap: '14px', 
              width: '100%', 
              textAlign: 'left',
              marginBottom: '36px' 
            }}
          >
            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--lilac-300)', fontWeight: 600, fontSize: '0.85rem' }}>
                <Zap size={15} /> Real-Time Event Triggers
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '6px 0 0', lineHeight: 1.45 }}>
                Instant lead ingest from Web forms, Stripe events, and Typeform questionnaires with sub-100ms pipeline execution.
              </p>
            </div>

            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontWeight: 600, fontSize: '0.85rem' }}>
                <Sparkles size={15} /> AI Agent Lead Triage
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '6px 0 0', lineHeight: 1.45 }}>
                Autonomous qualification, meeting agenda preparation, and automatic company enrichment via KvK registry.
              </p>
            </div>

            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 600, fontSize: '0.85rem' }}>
                <Mail size={15} /> Automated Drip Campaigns
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '6px 0 0', lineHeight: 1.45 }}>
                Transactional Resend and Twilio SMS sequences triggered by stage movement and prospect touchpoints.
              </p>
            </div>

            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: 600, fontSize: '0.85rem' }}>
                <ShieldCheck size={15} /> 99.9% Uptime & SLA Support
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '6px 0 0', lineHeight: 1.45 }}>
                Zero maintenance overhead. Handled end-to-end on isolated European serverless clusters by AutoFlow.
              </p>
            </div>
          </div>

          {/* Action Button: Request (Triggers Typeform Flow) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <button
              type="button"
              className="btn btn-lilac"
              onClick={() => openModuleSetupModal('custom_agents')}
              style={{
                padding: '14px 38px',
                fontSize: '0.96rem',
                fontWeight: 700,
                gap: '10px',
                borderRadius: '10px',
                boxShadow: '0 10px 30px rgba(167, 139, 250, 0.4)',
                cursor: 'pointer',
              }}
            >
              <Sparkles size={17} />
              <span>Request Automation Setup</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSandboxDemo(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: '4px',
              }}
            >
              Preview interactive visual workflow sandbox (demo) →
            </button>
          </div>
        </div>
      ) : (
        /* Visual Workflow Sandbox Demo (If User Clicks Preview) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <button 
              className="btn btn-lilac btn-sm" 
              onClick={() => setNewModalOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={14} /> Create Workflow
            </button>
          </div>

      {/* Main 2-column layout: Workflow Selector on Left, Flowchart on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Left Column: Workflows List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 4px' }}>
            ACTIVE RECIPES ({workflows.length})
          </div>

          {workflows.length === 0 && (
            <div className="notion-card" style={{ padding: '20px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              No workflows created yet.
            </div>
          )}

          {workflows.map(wf => {
            const isSelected = wf.id === selectedWorkflowId;
            return (
              <div
                key={wf.id}
                onClick={() => setSelectedWorkflowId(wf.id)}
                className={`notion-card ${isSelected ? 'lilac-highlight' : ''}`}
                style={{
                  padding: '14px 16px',
                  cursor: 'pointer',
                  background: isSelected ? 'var(--notion-surface-card)' : 'rgba(255, 255, 255, 0.02)',
                  borderColor: isSelected ? 'var(--lilac-border)' : 'var(--notion-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: isSelected ? 'var(--lilac-300)' : 'var(--text-main)' }}>
                    {wf.name}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWorkflowActive(wf.id);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    title={wf.active ? 'Click to pause' : 'Click to activate'}
                  >
                    {wf.active ? (
                      <span className="notion-tag emerald" style={{ fontSize: '0.68rem' }}>Active</span>
                    ) : (
                      <span className="notion-tag slate" style={{ fontSize: '0.68rem' }}>Draft</span>
                    )}
                  </button>
                </div>

                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.35 }}>
                  {wf.description}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>{wf.actions.length} action steps</span>
                  <span className="tabular-nums">{wf.runs_count} runs completed</span>
                </div>
              </div>
            );
          })}

          {/* Enterprise Managed Recipes (Paid Setup) */}
          <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--lilac-300)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={12} /> ENTERPRISE ADD-ON FLOWS
            </div>

            <div 
              className="notion-card"
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'rgba(167, 139, 250, 0.04)',
                border: '1px dashed rgba(167, 139, 250, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  🎙️ AI Voice Call Agent
                </span>
                <span className="notion-badge lilac" style={{ fontSize: '0.64rem' }}>Setup Req.</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>
                Sub-400ms neural phone dialer for automated calendar booking.
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => openModuleSetupModal('ai_voice')}
                style={{ fontSize: '0.72rem', padding: '4px 8px', width: '100%', justifyContent: 'center' }}
              >
                Request Voice Setup →
              </button>
            </div>

            <div 
              className="notion-card"
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'rgba(52, 211, 153, 0.04)',
                border: '1px dashed rgba(52, 211, 153, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  💬 WhatsApp Cloud Green Tick
                </span>
                <span className="notion-badge lilac" style={{ fontSize: '0.64rem' }}>Meta Sync</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>
                Official Meta verified API broadcast & 10DLC carrier routes.
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => openModuleSetupModal('whatsapp_cloud')}
                style={{ fontSize: '0.72rem', padding: '4px 8px', width: '100%', justifyContent: 'center' }}
              >
                Request WhatsApp Setup →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Flowchart Canvas */}
        {selectedWorkflow ? (
          <div className="notion-card" style={{ background: 'var(--notion-deep-black)', border: '1px solid var(--notion-border-light)', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
            {/* Flowchart Top Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--notion-border)', paddingBottom: '16px', marginBottom: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {selectedWorkflow.name}
                  </h2>
                  <span className={`notion-tag ${selectedWorkflow.active ? 'emerald' : 'slate'}`}>
                    {selectedWorkflow.active ? 'Status: Active' : 'Status: Paused'}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {selectedWorkflow.description}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleTestRun(selectedWorkflow.id)}
                  disabled={executingId === selectedWorkflow.id}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Play size={13} style={{ fill: 'var(--lilac-400)', color: 'var(--lilac-400)' }} />
                  {executingId === selectedWorkflow.id ? 'Running Step Actions...' : 'Test Run Workflow'}
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => deleteWorkflow(selectedWorkflow.id)}
                  style={{ color: '#f87171' }}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Test Run feedback alert */}
            {executionMessage && executionMessage.id === selectedWorkflow.id && (
              <div 
                style={{ 
                  background: 'rgba(52, 211, 153, 0.1)', 
                  border: '1px solid rgba(52, 211, 153, 0.3)', 
                  borderRadius: '8px', 
                  padding: '10px 14px', 
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.82rem',
                  color: '#34d399'
                }}
              >
                <CheckCircle2 size={16} />
                <span><strong>Execution Successful:</strong> {executionMessage.text}</span>
              </div>
            )}

            {/* Visual Node Chain */}
            <div style={{ maxWidth: '560px', margin: '0 auto', width: '100%', padding: '10px 0 40px' }}>
              {/* TRIGGER NODE */}
              <div 
                style={{
                  background: 'var(--notion-surface-card)',
                  border: '1px solid var(--lilac-border)',
                  borderRadius: '10px',
                  padding: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div 
                      style={{ 
                        width: '26px', 
                        height: '26px', 
                        borderRadius: '6px', 
                        background: 'var(--lilac-bg-subtle)', 
                        border: '1px solid var(--lilac-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--lilac-300)'
                      }}
                    >
                      <Zap size={14} />
                    </div>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--lilac-300)' }}>
                      WORKFLOW TRIGGER
                    </span>
                  </div>
                  <span className="notion-tag sky">{selectedWorkflow.trigger_type}</span>
                </div>

                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '10px' }}>
                  {selectedWorkflow.trigger_condition}
                </div>
              </div>

              {/* ACTION NODES IN SEQUENCE */}
              {selectedWorkflow.actions.map((act, index) => (
                <React.Fragment key={act.id}>
                  {/* Flow Connector Arrow */}
                  <div className="workflow-connector-line">
                    <ArrowDown size={18} style={{ color: 'var(--lilac-400)', opacity: 0.6 }} />
                  </div>

                  <div 
                    className="workflow-node-card"
                    style={{
                      borderLeft: '3px solid var(--lilac-400)',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div 
                          style={{ 
                            width: '24px', 
                            height: '24px', 
                            borderRadius: '5px', 
                            background: 'rgba(255, 255, 255, 0.05)', 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {ACTION_ICONS[act.type]}
                        </div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                          STEP {index + 1}: {act.type.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="notion-badge">Action #{index + 1}</span>
                    </div>

                    <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '8px' }}>
                      {act.title}
                    </div>

                    {Object.keys(act.config).length > 0 && (
                      <div 
                        style={{ 
                          marginTop: '8px', 
                          padding: '6px 10px', 
                          background: 'rgba(0, 0, 0, 0.3)', 
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {JSON.stringify(act.config).replace(/[{}]/g, '').replace(/"/g, '')}
                      </div>
                    )}
                  </div>
                </React.Fragment>
              ))}

              {/* End of Workflow Marker */}
              <div className="workflow-connector-line">
                <ArrowDown size={16} style={{ color: 'var(--text-muted)' }} />
              </div>

              <div 
                style={{ 
                  textAlign: 'center', 
                  padding: '8px 16px', 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  borderRadius: '20px', 
                  fontSize: '0.74rem',
                  color: 'var(--text-muted)',
                  border: '1px dashed var(--notion-border)',
                  width: 'fit-content',
                  margin: '0 auto'
                }}
              >
                Workflow Completed • State Recorded in Timeline
              </div>
            </div>
          </div>
        ) : (
          <div className="notion-card" style={{ minHeight: '360px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', textAlign: 'center' }}>
            <Zap size={28} style={{ color: 'var(--lilac-400)', opacity: 0.7 }} />
            <div style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-main)' }}>No automation workflows yet</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '360px' }}>
              Create your first event-driven workflow to trigger automated emails, SMS messages, or tasks when contacts or deals update.
            </div>
            <button className="btn btn-lilac btn-sm" onClick={() => setNewModalOpen(true)}>
              <Plus size={14} /> Create First Workflow
            </button>
          </div>
        )}
      </div>
      </div>
      )}

      {/* New Workflow Modal */}
      {newModalOpen && (
        <div className="modal-backdrop" onClick={() => setNewModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>New Automation Workflow</h3>
            </div>
            <form onSubmit={handleCreateWorkflow}>
              <div className="modal-body">
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Workflow Name
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. VIP Demo Booking Auto-Followup"
                    value={newWfName}
                    onChange={e => setNewWfName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Trigger Event
                  </label>
                  <select
                    className="select"
                    value={newWfTrigger}
                    onChange={e => setNewWfTrigger(e.target.value)}
                  >
                    <option value="contact_created">New Contact Created (Inbound Form / CSV)</option>
                    <option value="deal_stage_changed">Opportunity Stage Advanced</option>
                    <option value="task_overdue">Task Overdue Alert</option>
                    <option value="appointment_booked">Appointment Booked via Calendar</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Description
                  </label>
                  <textarea
                    className="textarea"
                    rows={3}
                    placeholder="Describe the workflow objective..."
                    value={newWfDesc}
                    onChange={e => setNewWfDesc(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setNewModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-lilac">
                  Create Workflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

