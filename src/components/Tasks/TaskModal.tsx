import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus, TaskPriority, Contact, Company } from '../../types';
import { X } from 'lucide-react';

interface TaskModalProps {
  taskToEdit?: Task | null;
  initialContact?: Contact | null;
  initialCompany?: Company | null;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ 
  taskToEdit, 
  initialContact, 
  initialCompany, 
  onClose 
}) => {
  const { addTask, updateTask, contacts, companies, teamMembers, currentUser } = useApp();

  const [title, setTitle] = useState(taskToEdit?.title || '');
  const [description, setDescription] = useState(taskToEdit?.description || '');
  const [status, setStatus] = useState<TaskStatus>(taskToEdit?.status || 'To Do');
  const [priority, setPriority] = useState<TaskPriority>(taskToEdit?.priority || 'Medium');
  const [dueDate, setDueDate] = useState(
    taskToEdit?.due_date || new Date().toISOString().split('T')[0]
  );
  const [assignedTo, setAssignedTo] = useState(
    taskToEdit?.assigned_to || currentUser.user_id
  );
  const [contactId, setContactId] = useState(
    taskToEdit?.related_contact_id || initialContact?.id || ''
  );
  const [companyId, setCompanyId] = useState(
    taskToEdit?.related_company_id || initialCompany?.id || (initialContact?.company_id || '')
  );
  const [projectId, setProjectId] = useState(taskToEdit?.related_project_id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedAssignee = teamMembers.find(m => m.user_id === assignedTo);
    const matchedContact = contacts.find(c => c.id === contactId);
    const matchedCompany = companies.find(c => c.id === companyId);

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        due_date: dueDate,
        assigned_to: assignedTo,
        assigned_to_name: matchedAssignee?.name,
        related_contact_id: contactId || undefined,
        related_contact_name: matchedContact ? `${matchedContact.first_name} ${matchedContact.last_name}` : undefined,
        related_company_id: companyId || undefined,
        related_company_name: matchedCompany?.name,
        related_project_id: projectId.trim() || undefined,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        due_date: dueDate,
        assigned_to: assignedTo,
        assigned_to_name: matchedAssignee?.name,
        related_contact_id: contactId || undefined,
        related_contact_name: matchedContact ? `${matchedContact.first_name} ${matchedContact.last_name}` : undefined,
        related_company_id: companyId || undefined,
        related_company_name: matchedCompany?.name,
        related_project_id: projectId.trim() || undefined,
      });
    }

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            {taskToEdit ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                Task Title *
              </label>
              <input 
                type="text" 
                className="input" 
                required 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="e.g. Follow up on proposal contract"
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                Description
              </label>
              <textarea 
                className="textarea" 
                rows={3} 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Actionable steps, goals, context..."
              />
            </div>

            {/* Status & Priority */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Status
                </label>
                <select 
                  className="select" 
                  value={status} 
                  onChange={e => setStatus(e.target.value as TaskStatus)}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Priority
                </label>
                <select 
                  className="select" 
                  value={priority} 
                  onChange={e => setPriority(e.target.value as TaskPriority)}
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>
            </div>

            {/* Due Date & Assignee */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Due Date *
                </label>
                <input 
                  type="date" 
                  className="input" 
                  required 
                  value={dueDate} 
                  onChange={e => setDueDate(e.target.value)} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Assign To Team Member
                </label>
                <select 
                  className="select" 
                  value={assignedTo} 
                  onChange={e => setAssignedTo(e.target.value)}
                >
                  {teamMembers.map(m => (
                    <option key={m.user_id} value={m.user_id}>{m.name} ({m.role})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Related Contact & Company */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Related Contact (Optional)
                </label>
                <select 
                  className="select" 
                  value={contactId} 
                  onChange={e => setContactId(e.target.value)}
                >
                  <option value="">No Contact Linked</option>
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.first_name} {c.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  Related Company (Optional)
                </label>
                <select 
                  className="select" 
                  value={companyId} 
                  onChange={e => setCompanyId(e.target.value)}
                >
                  <option value="">No Company Linked</option>
                  {companies.map(comp => (
                    <option key={comp.id} value={comp.id}>{comp.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Related Project */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                Related Project (Optional)
              </label>
              <input 
                type="text" 
                className="input" 
                value={projectId} 
                onChange={e => setProjectId(e.target.value)} 
                placeholder="e.g. Q4 Website Relaunch, CRM Migration"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-lilac">
              {taskToEdit ? 'Save Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
