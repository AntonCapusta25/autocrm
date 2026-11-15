import React from 'react';
import { NotionDatabaseView } from '../../types';
import { Table, Kanban, List, Calendar, LayoutGrid, Plus, Filter, ArrowUpDown } from 'lucide-react';

interface NotionViewSwitcherProps {
  activeView: NotionDatabaseView;
  onViewChange: (view: NotionDatabaseView) => void;
  availableViews?: NotionDatabaseView[];
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  totalCount?: number;
  rightAction?: React.ReactNode;
}

export const NotionViewSwitcher: React.FC<NotionViewSwitcherProps> = ({
  activeView,
  onViewChange,
  availableViews = ['table', 'board', 'list', 'calendar'],
  searchQuery,
  onSearchChange,
  totalCount,
  rightAction,
}) => {
  return (
    <div className="notion-view-bar">
      <div className="notion-view-tabs">
        {availableViews.includes('table') && (
          <button
            className={`notion-view-tab-btn ${activeView === 'table' ? 'active' : ''}`}
            onClick={() => onViewChange('table')}
          >
            <Table size={14} />
            <span>Table</span>
          </button>
        )}

        {availableViews.includes('board') && (
          <button
            className={`notion-view-tab-btn ${activeView === 'board' ? 'active' : ''}`}
            onClick={() => onViewChange('board')}
          >
            <Kanban size={14} />
            <span>Board</span>
          </button>
        )}

        {availableViews.includes('list') && (
          <button
            className={`notion-view-tab-btn ${activeView === 'list' ? 'active' : ''}`}
            onClick={() => onViewChange('list')}
          >
            <List size={14} />
            <span>List</span>
          </button>
        )}

        {availableViews.includes('calendar') && (
          <button
            className={`notion-view-tab-btn ${activeView === 'calendar' ? 'active' : ''}`}
            onClick={() => onViewChange('calendar')}
          >
            <Calendar size={14} />
            <span>Calendar</span>
          </button>
        )}

        {availableViews.includes('gallery') && (
          <button
            className={`notion-view-tab-btn ${activeView === 'gallery' ? 'active' : ''}`}
            onClick={() => onViewChange('gallery')}
          >
            <LayoutGrid size={14} />
            <span>Gallery</span>
          </button>
        )}

        {totalCount !== undefined && (
          <span 
            style={{ 
              fontSize: '0.74rem', 
              color: 'var(--text-muted)', 
              marginLeft: '8px',
              fontVariantNumeric: 'tabular-nums' 
            }}
          >
            {totalCount} total
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {onSearchChange !== undefined && (
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Filter or search..."
              value={searchQuery || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="input"
              style={{
                height: '30px',
                width: '180px',
                fontSize: '0.78rem',
                padding: '4px 8px',
                background: 'var(--notion-surface)',
                borderRadius: '6px'
              }}
            />
          </div>
        )}

        {rightAction}
      </div>
    </div>
  );
};

