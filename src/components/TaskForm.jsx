import React, { useState, useEffect } from 'react';

const TaskForm = ({ isOpen, onClose, onSubmit, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'pending');
      setPriority(task.priority || 'medium');
      if (task.dueDate) {
        const d = new Date(task.dueDate);
        const formattedDate = d.toISOString().substring(0, 10);
        setDueDate(formattedDate);
      } else {
        setDueDate('');
      }
    } else {
      setTitle('');
      setDescription('');
      setStatus('pending');
      setPriority('medium');
      setDueDate('');
    }
    setErrors({});
  }, [task, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters.';
    } else if (title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters.';
    }

    if (description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate || undefined
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{task ? 'Edit Task' : 'Create Task'}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="task-title">Title *</label>
            <input
              type="text"
              id="task-title"
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="e.g. Complete project milestone"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
              }}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              className={`form-input ${errors.description ? 'error' : ''}`}
              placeholder="Provide more context..."
              rows="3"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
              }}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="task-status">Status</label>
              <select
                id="task-status"
                className="form-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                className="form-input"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-duedate">Due Date</label>
            <input
              type="date"
              id="task-duedate"
              className="form-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" id="save-task-btn">
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
