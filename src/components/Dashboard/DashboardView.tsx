import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, Building2, TrendingUp, CheckCircle, Clock, 
  AlertTriangle, DollarSign, ArrowRight, Plus, Calendar, CheckSquare,
  Zap, MessageSquare, FileText, Sparkles, Video, Check
} from 'lucide-react';
import { NavTab } from '../Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenNewContact: () => void;
  onOpenNewTask: () => void;
  onOpenNewDeal: () => void;
  onSelectContact: (contactId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenNewContact,
  onOpenNewTask,
  onOpenNewDeal,
  onSelectContact
}) => {
  const { 
    contacts, companies, opportunities, tasks, toggleTaskStatus,
    workflows, conversations, appointments, notionDocs, onboardingConfig
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // CRM Metrics
  const totalContacts = contacts.length;
  const totalCompanies = companies.length;
  const activeOpportunities = opportunities.filter(o => o.stage !== 'Won' && o.stage !== 'Lost');
  const wonOpportunities = opportunities.filter(o => o.stage === 'Won');
  const totalDealValue = opportunities
    .filter(o => o.stage !== 'Lost')
    .reduce((sum, o) => sum + (Number(o.deal_value) || 0), 0);
  const totalWonValue = wonOpportunities
    .reduce((sum, o) => sum + (Number(o.deal_value) || 0), 0);

  // Task Metrics
  const tasksDueToday = tasks.filter(t => t.due_date === todayStr && t.status !== 'Completed');
  const overdueTasks = tasks.filter(t => t.due_date < todayStr && t.status !== 'Completed');
  const upcomingTasks = tasks.filter(t => t.due_date > todayStr && t.status !== 'Completed');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  const unreadMessagesCount = conversations.filter(c => c.unread).length;
  const activeWorkflowsCount = workflows.filter(w => w.active).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Notion Top Overview Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Executive Operating Console
            </h1>
            <span className="notion-badge lilac">{onboardingConfig.industry}</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Real-time metrics across your sales pipeline, contacts, tasks, and workspace operations.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenNewContact}
          >
            <Plus size={13} /> Add Contact
          </button>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenNewTask}
          >
            <CheckSquare size={13} /> Add Task
          </button>
          <button 
            className="btn btn-lilac btn-sm"
            onClick={onOpenNewDeal}
          >
            <Plus size={13} /> Add Opportunity
          </button>
        </div>
      </div>

      {/* Notion Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        {/* Active Pipeline Value */}
        <div 
          className="notion-card lilac-highlight"
          onClick={() => onNavigate('pipeline')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ACTIVE PIPELINE
            </span>
            <span className="notion-tag lilac">${totalDealValue.toLocaleString()}</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '8px' }} className="tabular-nums">
            ${totalDealValue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {activeOpportunities.length} opportunities in flight
          </div>
        </div>

        {/* Total Won Revenue */}
        <div 
          className="notion-card"
          onClick={() => onNavigate('pipeline')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              CLOSED WON
            </span>
            <span className="notion-tag emerald">Won</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399', marginTop: '8px' }} className="tabular-nums">
            ${totalWonValue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {wonOpportunities.length} deals successfully closed
          </div>
        </div>

        {/* Contacts & Accounts */}
        <div 
          className="notion-card"
          onClick={() => onNavigate('contacts')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              STAKEHOLDERS
            </span>
            <Users size={14} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '8px' }} className="tabular-nums">
            {totalContacts}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Across {totalCompanies} corporate accounts
          </div>
        </div>

        {/* Tasks Due Today & Overdue */}
        <div 
          className="notion-card"
          onClick={() => onNavigate('tasks')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              TASK EXECUTION
            </span>
            {overdueTasks.length > 0 ? (
              <span className="notion-tag coral">{overdueTasks.length} Overdue</span>
            ) : (
              <span className="notion-tag emerald">On Track</span>
            )}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '8px' }} className="tabular-nums">
            {tasksDueToday.length}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {tasksDueToday.length} due today • {completedTasks.length} finished
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Operations & GHL/Notion Modules */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px' }}>
        {/* Left Column: Tasks Today & Active Pipeline Deals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Actionable To-Dos for Today */}
          <div className="notion-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckSquare size={16} style={{ color: 'var(--lilac-400)' }} />
                <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Tasks Scheduled for Today
                </h3>
              </div>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => onNavigate('tasks')}
                style={{ fontSize: '0.74rem' }}
              >
                View all ({tasks.length}) <ArrowRight size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {tasksDueToday.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  No tasks due today. All caught up!
                </div>
              ) : (
                tasksDueToday.map(task => (
                  <div
                    key={task.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      background: 'var(--notion-surface)',
                      borderRadius: '6px',
                      border: '1px solid var(--notion-border)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div 
                        className={`notion-checkbox ${task.status === 'Completed' ? 'checked' : ''}`}
                        onClick={() => toggleTaskStatus(task.id)}
                      >
                        {task.status === 'Completed' && <Check size={11} strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: '0.84rem', color: 'var(--text-main)', fontWeight: 500 }}>
                        {task.title}
                      </span>
                    </div>

                    <span className="notion-tag coral">{task.priority}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Opportunities Stream */}
          <div className="notion-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} style={{ color: 'var(--lilac-400)' }} />
                <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Active Deals in Pipeline
                </h3>
              </div>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => onNavigate('pipeline')}
                style={{ fontSize: '0.74rem' }}
              >
                Kanban View <ArrowRight size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {activeOpportunities.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  No active opportunities yet. Click "Add Opportunity" above to create your first deal.
                </div>
              ) : (
                activeOpportunities.slice(0, 4).map(opp => (
                  <div
                    key={opp.id}
                    onClick={() => onNavigate('pipeline')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '9px 12px',
                      borderRadius: '6px',
                      background: 'var(--notion-surface)',
                      border: '1px solid var(--notion-border)',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-main)' }}>
                        {opp.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {opp.company_name || opp.contact_name} • Close: {opp.expected_closing_date}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="notion-tag sky">{opp.stage}</span>
                      <span style={{ fontWeight: 700, color: 'var(--lilac-300)' }} className="tabular-nums">
                        ${opp.deal_value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Workspace Modules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Active Automations Box */}
          <div className="notion-card" style={{ background: 'var(--notion-deep-black)', border: '1px solid var(--lilac-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={15} style={{ color: 'var(--lilac-400)' }} />
                <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Automation Workflows
                </h4>
              </div>
              <button 
                className="btn btn-ghost btn-sm" 
                onClick={() => onNavigate('workflows')}
                style={{ fontSize: '0.7rem', padding: '2px 6px', color: 'var(--lilac-300)' }}
              >
                Workflows <ArrowRight size={11} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'var(--notion-surface)', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Active Automated Recipes</span>
                <span style={{ fontWeight: 600, color: 'var(--lilac-300)' }}>{activeWorkflowsCount} of {workflows.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'var(--notion-surface)', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Unread Messages in Inbox</span>
                <span style={{ fontWeight: 600, color: unreadMessagesCount > 0 ? '#f87171' : 'var(--text-main)' }}>
                  {unreadMessagesCount} unread
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming Calendar Bookings */}
          <div className="notion-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={15} style={{ color: 'var(--lilac-400)' }} />
                <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Upcoming Appointments
                </h4>
              </div>
              <button 
                className="btn btn-ghost btn-sm" 
                onClick={() => onNavigate('calendar')}
                style={{ fontSize: '0.7rem', padding: '2px 6px' }}
              >
                Calendar <ArrowRight size={11} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {appointments.length === 0 ? (
                <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  No upcoming appointments scheduled.
                </div>
              ) : (
                appointments.slice(0, 3).map(appt => (
                  <div 
                    key={appt.id} 
                    style={{ 
                      padding: '8px 10px', 
                      borderRadius: '6px', 
                      background: 'var(--notion-surface)', 
                      border: '1px solid var(--notion-border)' 
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-main)' }}>
                      {appt.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                      <span>{appt.date} • {appt.start_time}</span>
                      <span className="notion-tag lilac" style={{ fontSize: '0.62rem' }}>{appt.location_type}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SOP Docs Quick Index */}
          <div className="notion-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={15} style={{ color: 'var(--lilac-400)' }} />
                <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Documents & SOPs
                </h4>
              </div>
              <button 
                className="btn btn-ghost btn-sm" 
                onClick={() => onNavigate('docs')}
                style={{ fontSize: '0.7rem', padding: '2px 6px' }}
              >
                Docs <ArrowRight size={11} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {notionDocs.length === 0 ? (
                <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  No documents created yet.
                </div>
              ) : (
                notionDocs.slice(0, 3).map(doc => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => onNavigate('docs')}
                    className="notion-nav-item"
                    style={{ padding: '6px 8px', fontSize: '0.78rem' }}
                  >
                    <div className="notion-nav-left">
                      <span>{doc.icon}</span>
                      <span>{doc.title}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
