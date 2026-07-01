import React from 'react';
import TaskCard from './TaskCard';

const TaskBoard = ({ tasks, onEdit, onDelete, onStatusChange }) => {
  const pendingTasks = tasks.filter((task) => task.status === 'pending');
  const inProgressTasks = tasks.filter((task) => task.status === 'in-progress');
  const completedTasks = tasks.filter((task) => task.status === 'completed');

  const columns = [
    { id: 'pending', title: 'Pending', count: pendingTasks.length, tasks: pendingTasks },
    { id: 'in-progress', title: 'In Progress', count: inProgressTasks.length, tasks: inProgressTasks },
    { id: 'completed', title: 'Completed', count: completedTasks.length, tasks: completedTasks }
  ];

  return (
    <div className="board-container">
      {columns.map((column) => (
        <div key={column.id} className="board-column">
          <div className="column-header">
            <h3 className="column-title">
              {column.id === 'pending' && '📥'}
              {column.id === 'in-progress' && '⚡'}
              {column.id === 'completed' && '✅'}
              {' '}{column.title}
            </h3>
            <span className="column-count">{column.count}</span>
          </div>
          
          <div className="column-cards">
            {column.tasks.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem 1rem', borderStyle: 'dotted' }}>
                <p className="empty-sub" style={{ fontSize: '0.8rem' }}>No tasks here</p>
              </div>
            ) : (
              column.tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                  isRow={false}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
