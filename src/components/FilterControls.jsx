import React from 'react';

const FilterControls = ({ filters, setFilters, viewMode, setViewMode }) => {
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="toolbar">
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search by title or description..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <select
          className="filter-select"
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          aria-label="Filter by Status"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          className="filter-select"
          value={filters.priority || ''}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          aria-label="Filter by Priority"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          className="filter-select"
          value={filters.sortBy || 'createdAt'}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          aria-label="Sort by Field"
        >
          <option value="createdAt">Created Date</option>
          <option value="dueDate">Due Date</option>
          <option value="title">Title Alphabetical</option>
        </select>

        <select
          className="filter-select"
          value={filters.order || 'desc'}
          onChange={(e) => handleFilterChange('order', e.target.value)}
          aria-label="Sort Order"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>

        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'board' ? 'active' : ''}`}
            onClick={() => setViewMode('board')}
            title="Board (Kanban) View"
          >
            📋 Board
          </button>
          <button
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            📝 List
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
