import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../Sidebar';
import { Menu } from 'lucide-react';

interface MobileBottomBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenMoreMenu: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  activeTab,
  onTabChange,
  onOpenMoreMenu,
}) => {
  const { conversations, tasks } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const overdueCount = tasks.filter(t => t.status !== 'Completed' && t.due_date < todayStr).length;
  const unreadConversations = conversations.filter(c => c.unread).length;

  return (
    <nav className="mobile-bottom-nav">
      {/* 1. Dashboard */}
      <button
        type="button"
        className={`mobile-bottom-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => onTabChange('dashboard')}
      >
        <img 
          src="/assets/clay/dashboard.png" 
          alt="" 
          style={{ width: '22px', height: '22px', objectFit: 'contain' }} 
        />
        <span>Metrics</span>
      </button>

      {/* 2. Pipeline */}
      <button
        type="button"
        className={`mobile-bottom-tab ${activeTab === 'pipeline' ? 'active' : ''}`}
        onClick={() => onTabChange('pipeline')}
      >
        <img 
          src="/assets/clay/chart.png" 
          alt="" 
          style={{ width: '22px', height: '22px', objectFit: 'contain' }} 
        />
        <span>Pipeline</span>
      </button>

      {/* 3. Inbox */}
      <button
        type="button"
        className={`mobile-bottom-tab ${activeTab === 'conversations' ? 'active' : ''}`}
        onClick={() => onTabChange('conversations')}
        style={{ position: 'relative' }}
      >
        <img 
          src="/assets/clay/chat.png" 
          alt="" 
          style={{ width: '22px', height: '22px', objectFit: 'contain' }} 
        />
        <span>Inbox</span>
        {unreadConversations > 0 && (
          <span className="mobile-tab-badge alert">
            {unreadConversations}
          </span>
        )}
      </button>

      {/* 4. Tasks */}
      <button
        type="button"
        className={`mobile-bottom-tab ${activeTab === 'tasks' ? 'active' : ''}`}
        onClick={() => onTabChange('tasks')}
        style={{ position: 'relative' }}
      >
        <img 
          src="/assets/clay/tasks.png" 
          alt="" 
          style={{ width: '22px', height: '22px', objectFit: 'contain' }} 
        />
        <span>Tasks</span>
        {overdueCount > 0 && (
          <span className="mobile-tab-badge alert">
            {overdueCount}
          </span>
        )}
      </button>

      {/* 5. More (All Modules) */}
      <button
        type="button"
        className="mobile-bottom-tab"
        onClick={onOpenMoreMenu}
      >
        <div 
          style={{
            width: '22px',
            height: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
          }}
        >
          <Menu size={20} />
        </div>
        <span>More</span>
      </button>
    </nav>
  );
};

