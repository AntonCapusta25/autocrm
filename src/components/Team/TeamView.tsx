import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  ShieldCheck, UserPlus, Users, Trash2, Mail, 
  Crown, CheckCircle2, AlertCircle, Building, CheckSquare 
} from 'lucide-react';

export const TeamView: React.FC = () => {
  const { 
    currentWorkspace, 
    teamMembers, 
    currentUser, 
    inviteTeamMember, 
    removeTeamMember,
    tasks 
  } = useApp();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Member');

  const isOwner = currentUser.role === 'Owner';

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    inviteTeamMember(inviteName.trim(), inviteEmail.trim(), inviteRole);
    setInviteName('');
    setInviteEmail('');
    setInviteRole('Member');
    setInviteModalOpen(false);
  };

  const handleRemove = (memberId: string, memberName: string) => {
    if (!isOwner) {
      alert('Only workspace owners can remove members.');
      return;
    }
    if (memberId === currentUser.id) {
      alert('You cannot remove yourself from your active workspace.');
      return;
    }
    if (window.confirm(`Remove ${memberName} from this workspace?`)) {
      removeTeamMember(memberId);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="/assets/clay/shield.png" 
              alt="Team & Access" 
              style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
            />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Team & Role-Based Access (RBAC)
            </h1>
            <span className="notion-badge">{teamMembers.length} members</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Workspace: <strong style={{ color: 'var(--text-main)' }}>{currentWorkspace.name}</strong> • Governed by least-privilege team boundaries.
          </p>
        </div>

        <button 
          className="btn btn-lilac"
          onClick={() => setInviteModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <UserPlus size={14} /> Invite Member
        </button>
      </div>

      {/* Role explanation block */}
      <div className="notion-block-callout">
        <span className="callout-icon">🔒</span>
        <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-main)' }}>Workspace Data Separation:</strong> All contacts, opportunities, and tasks belong strictly to <em>{currentWorkspace.name}</em>. <strong>Owners</strong> can invite/remove members and manage integrations; <strong>Members</strong> collaborate on assigned pipelines and tasks.
        </div>
      </div>

      {/* Team Table */}
      <div className="notion-table-container">
        <table className="notion-table">
          <thead>
            <tr>
              <th>Team Member</th>
              <th>Role Privilege</th>
              <th>Assigned Tasks</th>
              <th>Date Joined</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map(member => {
              const memberTasks = tasks.filter(t => t.assigned_to === member.user_id && t.status !== 'Completed');
              const isCurrent = member.id === currentUser.id;

              return (
                <tr key={member.id}>
                  {/* Name & Avatar */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img 
                        src={member.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}`} 
                        alt={member.name}
                        style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          {member.name} {isCurrent && <span style={{ color: 'var(--lilac-300)', fontSize: '0.74rem' }}>(You)</span>}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td>
                    <span className={`notion-tag ${member.role === 'Owner' ? 'lilac' : 'slate'}`}>
                      {member.role === 'Owner' ? '👑 Owner' : 'Member'}
                    </span>
                  </td>

                  {/* Tasks */}
                  <td>
                    <span className="notion-tag slate">
                      {memberTasks.length} active
                    </span>
                  </td>

                  {/* Date Joined */}
                  <td>
                    <span className="tabular-nums" style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      {new Date(member.joined_at).toLocaleDateString()}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    {isOwner && member.id !== currentUser.id ? (
                      <button 
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleRemove(member.id, member.name)}
                        style={{ color: '#f87171' }}
                        title="Remove member"
                      >
                        <Trash2 size={13} />
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <div className="modal-backdrop" onClick={() => setInviteModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Invite Team Member</h3>
            </div>
            <form onSubmit={handleInvite}>
              <div className="modal-body">
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                    Full Name *
                  </label>
                  <input 
                    type="text" 
                    className="input" 
                    required 
                    value={inviteName} 
                    onChange={e => setInviteName(e.target.value)} 
                    placeholder="e.g. David Zhao"
                    autoFocus
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                    Work Email *
                  </label>
                  <input 
                    type="email" 
                    className="input" 
                    required 
                    value={inviteEmail} 
                    onChange={e => setInviteEmail(e.target.value)} 
                    placeholder="david@company.com"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                    Workspace Role
                  </label>
                  <select 
                    className="select" 
                    value={inviteRole} 
                    onChange={e => setInviteRole(e.target.value as UserRole)}
                  >
                    <option value="Member">Member (Standard CRM & Tasks access)</option>
                    <option value="Owner">Owner (Can manage workspace & remove team)</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setInviteModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-lilac">
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
