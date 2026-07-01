import React, { useState, useEffect } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from './utils/api';
import ThemeToggle from './components/ThemeToggle';
import CustomToast from './components/CustomToast';
import FilterControls from './components/FilterControls';
import TaskForm from './components/TaskForm';
import TaskBoard from './components/TaskBoard';
import TaskList from './components/TaskList';

function App() {
  // Task data states
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]); // For overall dashboard stats
  
  // Toolbar states
  const [viewMode, setViewMode] = useState('board');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
    sortBy: 'createdAt',
    order: 'desc'
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove toast after 4 seconds (aligns with index.css fade-out delay)
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Debounce search term changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm }));
    }, 350);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Load tasks on filter changes
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch filtered tasks for display
      const displayData = await fetchTasks(filters);
      setTasks(displayData);

      // Fetch all tasks for stats
      const statsData = await fetchTasks({});
      setAllTasks(statsData);
    } catch (err) {
      addToast(err.message || 'Failed to fetch tasks.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  // CRUD handlers
  const handleOpenCreateForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (taskData) => {
    try {
      if (editingTask) {
        // Update operation
        const updated = await updateTask(editingTask._id, taskData);
        addToast(`Task "${updated.title}" updated successfully!`, 'success');
      } else {
        // Create operation
        const created = await createTask(taskData);
        addToast(`Task "${created.title}" created successfully!`, 'success');
      }
      setIsFormOpen(false);
      setEditingTask(null);
      loadData();
    } catch (err) {
      addToast(err.message || 'Operation failed.', 'error');
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        addToast('Task deleted successfully.', 'info');
        loadData();
      } catch (err) {
        addToast(err.message || 'Failed to delete task.', 'error');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await updateTask(id, { status: newStatus });
      addToast(`Status updated to "${newStatus}".`, 'success');
      loadData();
    } catch (err) {
      addToast(err.message || 'Failed to update status.', 'error');
    }
  };

  // Dashboard calculations
  const pendingCount = allTasks.filter((t) => t.status === 'pending').length;
  const inProgressCount = allTasks.filter((t) => t.status === 'in-progress').length;
  const completedCount = allTasks.filter((t) => t.status === 'completed').length;
  const totalCount = allTasks.length;

  return (
    <div className="app-container">
      {/* Header section */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-icon">✓</div>
          <h1 className="brand-title" id="app-title">TaskFlow</h1>
        </div>
        <div className="header-actions">
          <ThemeToggle />
          <button 
            className="btn btn-primary" 
            onClick={handleOpenCreateForm}
            id="create-task-modal-btn"
          >
            ➕ New Task
          </button>
        </div>
      </header>

      {/* Stats Dashboard */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-bg-light)', color: 'var(--primary-color)' }}>
            📊
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalCount}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-pending-bg)', color: 'var(--color-pending)' }}>
            📥
          </div>
          <div className="stat-info">
            <span className="stat-value">{pendingCount}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-progress-bg)', color: 'var(--color-progress)' }}>
            ⚡
          </div>
          <div className="stat-info">
            <span className="stat-value">{inProgressCount}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-completed-bg)', color: 'var(--color-completed)' }}>
            ✅
          </div>
          <div className="stat-info">
            <span className="stat-value">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </section>

      {/* Toolbar / Filters */}
      <FilterControls 
        filters={{ ...filters, search: searchTerm }}
        setFilters={(newFilters) => {
          if (typeof newFilters === 'function') {
            setFilters(newFilters);
          } else {
            if (newFilters.search !== undefined) {
              setSearchTerm(newFilters.search);
            }
            setFilters(newFilters);
          }
        }}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Main Task List/Board Area */}
      <main className="content-area">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid var(--border-color)',
              borderTopColor: 'var(--primary-color)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading tasks...</p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : viewMode === 'board' ? (
          <TaskBoard
            tasks={tasks}
            onEdit={handleOpenEditForm}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={handleOpenEditForm}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>

      {/* Task Creation/Editing Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        task={editingTask}
      />

      {/* Toast Notification Container */}
      <CustomToast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
