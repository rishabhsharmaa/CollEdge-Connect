import React from 'react';

const CustomToast = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container" id="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
          role="alert"
        >
          <span className="toast-icon">
            {toast.type === 'success' && '✓'}
            {toast.type === 'error' && '✗'}
            {toast.type === 'info' && 'ℹ'}
          </span>
          <div className="toast-message">{toast.message}</div>
          <button
            className="toast-close"
            onClick={() => removeToast(toast.id)}
            aria-label="Close notification"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default CustomToast;
