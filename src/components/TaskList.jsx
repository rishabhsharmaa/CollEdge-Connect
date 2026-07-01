import React from 'react';
import TaskCard from './TaskCard';

const TaskList = ({ tasks, onEdit, onDelete, onStatusChange }) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📂</span>
        <h3 className="empty-text">No tasks found</h3>
        <p className="empty-sub">Try creating a new task or adjusting your search filters.</p>
      </div>
    );
  }

  return (
    <div className="list-container">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          isRow={true}
        />
      ))}
    </div>
  );
};

export default TaskList;
