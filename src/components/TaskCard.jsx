import React from 'react';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, isRow = false }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleToggleCompleted = () => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    onStatusChange(task._id, nextStatus);
  };

  const getPriorityEmoji = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  if (isRow) {
    return (
      <div className={`task-card list-row status-${task.status}`}>
        <div className="card-left">
          <button
            className={`status-checkbox ${task.status === 'completed' ? 'checked' : ''}`}
            onClick={handleToggleCompleted}
            title={task.status === 'completed' ? 'Mark Pending' : 'Mark Completed'}
          >
            ✓
          </button>
          
          <div className="task-meta">
            <div className={`task-title-text ${task.status === 'completed' ? 'completed' : ''}`}>
              {task.title}
            </div>
            {task.description && (
              <p className="task-desc" style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
                {task.description.length > 80 ? `${task.description.substring(0, 80)}...` : task.description}
              </p>
            )}
          </div>
        </div>

        <div className="card-right">
          <div className="badge-group">
            <span className={`badge badge-${task.status}`}>{task.status.replace('-', ' ')}</span>
            <span className={`badge badge-${task.priority}`}>
              {getPriorityEmoji(task.priority)} {task.priority}
            </span>
          </div>

          <div className="task-date">
            📅 {formatDate(task.dueDate)}
          </div>

          <div className="task-actions">
            <button className="btn-icon" onClick={() => onEdit(task)} title="Edit Task">
              ✏️
            </button>
            <button className="btn-icon btn-danger" onClick={() => onDelete(task._id)} title="Delete Task">
              🗑️
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-card status-${task.status}`}>
      <div className="card-top">
        <div className={`task-title-text ${task.status === 'completed' ? 'completed' : ''}`}>
          {task.title}
        </div>
        <button
          className={`status-checkbox ${task.status === 'completed' ? 'checked' : ''}`}
          onClick={handleToggleCompleted}
          title={task.status === 'completed' ? 'Mark Pending' : 'Mark Completed'}
        >
          ✓
        </button>
      </div>

      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      <div className="badge-group">
        <span className={`badge badge-${task.status}`}>{task.status.replace('-', ' ')}</span>
        <span className={`badge badge-${task.priority}`}>
          {getPriorityEmoji(task.priority)} {task.priority}
        </span>
      </div>

      <div className="card-footer">
        <div className="task-date">
          📅 {formatDate(task.dueDate)}
        </div>
        <div className="task-actions">
          <button className="btn-icon" onClick={() => onEdit(task)} title="Edit Task">
            ✏️
          </button>
          <button className="btn-icon btn-danger" onClick={() => onDelete(task._id)} title="Delete Task">
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
