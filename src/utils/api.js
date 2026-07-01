const BASE_URL = '/api/tasks';

export const fetchTasks = async (filters = {}) => {
  const query = new URLSearchParams();
  if (filters.status) query.append('status', filters.status);
  if (filters.priority) query.append('priority', filters.priority);
  if (filters.search) query.append('search', filters.search);
  if (filters.sortBy) query.append('sortBy', filters.sortBy);
  if (filters.order) query.append('order', filters.order);

  const response = await fetch(`${BASE_URL}?${query.toString()}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch tasks.');
  }
  return response.json();
};

export const createTask = async (taskData) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create task.');
  }
  return response.json();
};

export const updateTask = async (id, taskData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update task.');
  }
  return response.json();
};

export const deleteTask = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete task.');
  }
  return response.json();
};
