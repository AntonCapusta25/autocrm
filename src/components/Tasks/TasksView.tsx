import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskPriority, TaskStatus, NotionDatabaseView } from '../../types';
import { 
  CheckSquare, Search, Plus, Filter, Calendar, AlertTriangle, 
  Clock, CheckCircle, User, Building2, Trash2, Edit, Check, Upload
} from 'lucide-react';
import { TaskModal } from './TaskModal';
import { NotionViewSwitcher } from '../Common/NotionViewSwitcher';
import { DataTransferModal } from '../ImportExport/DataTransferModal';

type TaskFilterTab = 'all' | 'my_tasks' | 'today' | 'upcoming' | 'overdue' | 'completed';

interface TasksViewProps {
  initialTaskModalOpen?: boolean;
  onClearInitialModal?: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ 
  initialTaskModalOpen = false,
  onClearInitialModal 
}) => {
  const { tasks, toggleTaskStatus, deleteTask, currentUser, teamMembers } = useApp();

  const [activeView, setActiveView] = useState<NotionDatabaseView>('list');
  const [filterTab, setFilterTab] = useState<TaskFilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('');
  const [selectedAssigneeFilter, setSelectedAssigneeFilter] = useState<string>('');

  const [modalOpen, setModalOpen] = useState(initialTaskModalOpen);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [transferOpen, setTransferOpen] = useState(false);

  React.useEffect(() => {
    if (initialTaskModalOpen) {
      setModalOpen(true);
      if (onClearInitialModal) onClearInitialModal();
    }
  }, [initialTaskModalOpen, onClearInitialModal]);

  const todayStr = new Date().toISOString().split('T')[0];

  // Tab Counts
  const myTasksCount = tasks.filter(t => t.assigned_to === currentUser.user_id && t.status !== 'Completed').length;
  const todayTasksCount = tasks.filter(t => t.due_date === todayStr && t.status !== 'Completed').length;
  const overdueTasksCount = tasks.filter(t => t.due_date < todayStr && t.status !== 'Completed').length;
  const upcomingTasksCount = tasks.filter(t => t.due_date > todayStr && t.status !== 'Completed').length;
  const completedTasksCount = tasks.filter(t => t.status === 'Completed').length;

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Tab filter
      if (filterTab === 'my_tasks' && (task.assigned_to !== currentUser.user_id || task.status === 'Completed')) return false;
      if (filterTab === 'today' && (task.due_date !== todayStr || task.status === 'Completed')) return false;
      if (filterTab === 'upcoming' && (task.due_date <= todayStr || task.status === 'Completed')) return false;
      if (filterTab === 'overdue' && (task.due_date >= todayStr || task.status === 'Completed')) return false;
      if (filterTab === 'completed' && task.status !== 'Completed') return false;

      // Status dropdown
      if (selectedStatusFilter && task.status !== selectedStatusFilter) return false;

      // Priority dropdown
      if (selectedPriorityFilter && task.priority !== selectedPriorityFilter) return false;

      // Assignee dropdown
      if (selectedAssigneeFilter && task.assigned_to !== selectedAssigneeFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          task.title.toLowerCase().includes(q) ||
          (task.description && task.description.toLowerCase().includes(q)) ||
          (task.related_contact_name && task.related_contact_name.toLowerCase().includes(q)) ||
          (task.related_company_name && task.related_company_name.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
  }, [tasks, filterTab, selectedStatusFilter, selectedPriorityFilter, selectedAssigneeFilter, searchQuery, currentUser, todayStr]);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDelete = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete task "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="/assets/clay/tasks.png" 
              alt="Tasks" 
              style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
            />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Tasks & SOP Execution
            </h1>
            <span className="notion-badge">{tasks.length} total</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Notion checklist execution, due date reminders, priority flags, and contact/deal linkages.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setTransferOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Upload size={13} /> Import / Export Tasks
          </button>

          <button 
            className="btn btn-lilac"
            onClick={() => {
              setEditingTask(null);
              setModalOpen(true);
            }}
          >
            <Plus size={14} /> New Task
          </button>
        </div>
      </div>

      {/* Filter Tabs Pills (My Tasks, Today, Overdue, Upcoming, Completed) */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'all', label: 'All Tasks', count: tasks.length },
          { id: 'my_tasks', label: 'My Tasks', count: myTasksCount },
          { id: 'today', label: 'Today', count: todayTasksCount },
          { id: 'upcoming', label: 'Upcoming', count: upcomingTasksCount },
          { id: 'overdue', label: 'Overdue', count: overdueTasksCount, alert: overdueTasksCount > 0 },
          { id: 'completed', label: 'Completed', count: completedTasksCount },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id as any)}
            className={`notion-view-tab-btn ${filterTab === tab.id ? 'active' : ''}`}
            style={{ fontSize: '0.78rem', padding: '5px 12px' }}
          >
            <span>{tab.label}</span>
            <span className={`notion-badge ${tab.alert ? 'alert' : ''}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notion View Switcher Bar */}
      <NotionViewSwitcher
        activeView={activeView}
        onViewChange={setActiveView}
        availableViews={['list', 'table', 'board']}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={filteredTasks.length}
        rightAction={
          <div style={{ display: 'flex', gap: '6px' }}>
            <select
              className="select"
              value={selectedPriorityFilter}
              onChange={e => setSelectedPriorityFilter(e.target.value)}
              style={{ height: '30px', fontSize: '0.76rem', width: '110px', padding: '2px 8px' }}
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              className="select"
              value={selectedAssigneeFilter}
              onChange={e => setSelectedAssigneeFilter(e.target.value)}
              style={{ height: '30px', fontSize: '0.76rem', width: '120px', padding: '2px 8px' }}
            >
              <option value="">All Assignees</option>
              {teamMembers.map(m => (
                <option key={m.id} value={m.user_id}>{m.name}</option>
              ))}
            </select>
          </div>
        }
      />

      {/* LIST VIEW (NOTION CHECKLIST) */}
      {activeView === 'list' && (
        <div className="notion-card" style={{ padding: '8px 14px' }}>
          {filteredTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
              No tasks found in this view.
            </div>
          ) : (
            filteredTasks.map(task => {
              const isCompleted = task.status === 'Completed';
              const isOverdue = !isCompleted && task.due_date < todayStr;
              const isToday = !isCompleted && task.due_date === todayStr;

              return (
                <div
                  key={task.id}
                  onClick={() => handleEdit(task)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 8px',
                    borderBottom: '1px solid var(--notion-border)',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  {/* Left: Notion Checkbox & Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <div 
                      className={`notion-checkbox ${isCompleted ? 'checked' : ''}`}
                      onClick={e => {
                        e.stopPropagation();
                        toggleTaskStatus(task.id);
                      }}
                    >
                      {isCompleted && <Check size={11} strokeWidth={3} />}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div 
                        style={{ 
                          fontSize: '0.86rem', 
                          fontWeight: isCompleted ? 400 : 600,
                          color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)',
                          textDecoration: isCompleted ? 'line-through' : 'none'
                        }}
                      >
                        {task.title}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {task.related_company_name && <span>• {task.related_company_name}</span>}
                        {task.related_contact_name && <span>• {task.related_contact_name}</span>}
                        {task.assigned_to_name && <span>• Assigned: {task.assigned_to_name}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Right: Badges & Due Date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={e => e.stopPropagation()}>
                    <span 
                      className={`notion-tag ${
                        task.priority === 'High' ? 'coral' : task.priority === 'Medium' ? 'amber' : 'slate'
                      }`}
                    >
                      {task.priority}
                    </span>

                    <span 
                      className={`notion-tag ${
                        isOverdue ? 'coral' : isToday ? 'amber' : isCompleted ? 'emerald' : 'slate'
                      }`}
                    >
                      <Calendar size={11} style={{ marginRight: '3px' }} />
                      {isOverdue ? `Overdue (${task.due_date})` : isToday ? 'Due Today' : task.due_date}
                    </span>

                    <button 
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleEdit(task)}
                      title="Edit Task"
                    >
                      <Edit size={13} />
                    </button>

                    <button 
                      className="btn btn-ghost btn-sm"
                      onClick={e => handleDelete(task, e)}
                      style={{ color: '#f87171' }}
                      title="Delete Task"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TABLE VIEW */}
      {activeView === 'table' && (
        <div className="notion-table-container">
          <table className="notion-table">
            <thead>
              <tr>
                <th style={{ width: '38px' }}></th>
                <th>Task Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Assignee</th>
                <th>Linked Entity</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => {
                const isCompleted = task.status === 'Completed';
                return (
                  <tr key={task.id} onClick={() => handleEdit(task)} style={{ cursor: 'pointer' }}>
                    <td onClick={e => { e.stopPropagation(); toggleTaskStatus(task.id); }}>
                      <div className={`notion-checkbox ${isCompleted ? 'checked' : ''}`}>
                        {isCompleted && <Check size={11} strokeWidth={3} />}
                      </div>
                    </td>
                    <td style={{ fontWeight: isCompleted ? 400 : 600, textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)' }}>
                      {task.title}
                    </td>
                    <td>
                      <span className={`notion-tag ${isCompleted ? 'emerald' : task.status === 'In Progress' ? 'amber' : 'slate'}`}>
                        {task.status}
                      </span>
                    </td>
                    <td>
                      <span className={`notion-tag ${task.priority === 'High' ? 'coral' : task.priority === 'Medium' ? 'amber' : 'slate'}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="tabular-nums" style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      {task.due_date}
                    </td>
                    <td>{task.assigned_to_name || '—'}</td>
                    <td>{task.related_company_name || task.related_contact_name || '—'}</td>
                    <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                      <button className="btn btn-ghost btn-sm" onClick={e => handleDelete(task, e)} style={{ color: '#f87171' }}>
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* BOARD VIEW (STATUS KANBAN) */}
      {activeView === 'board' && (
        <div className="notion-kanban-grid">
          {(['To Do', 'In Progress', 'Completed'] as TaskStatus[]).map(st => {
            const stTasks = filteredTasks.filter(t => t.status === st);
            return (
              <div key={st} className="notion-kanban-col">
                <div className="notion-kanban-header">
                  <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>{st}</span>
                  <span className="notion-badge">{stTasks.length}</span>
                </div>
                <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
                  {stTasks.map(t => (
                    <div key={t.id} className="notion-kanban-card" onClick={() => handleEdit(t)}>
                      <div style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                        {t.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.72rem' }}>
                        <span className="notion-tag coral">{t.priority}</span>
                        <span className="tabular-nums" style={{ color: 'var(--text-muted)' }}>{t.due_date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <TaskModal 
          taskToEdit={editingTask}
          onClose={() => {
            setModalOpen(false);
            setEditingTask(null);
          }}
        />
      )}

      {transferOpen && (
        <DataTransferModal 
          isOpen={transferOpen}
          onClose={() => setTransferOpen(false)}
          initialMode="import"
          initialEntity="tasks"
        />
      )}
    </div>
  );
};
