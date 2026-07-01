import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

// @desc    Get all tasks with filtering, sorting, and search
// @route   GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const { status, priority, search, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Build filter query
    const query = {};

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort options
    const sort = {};
    if (sortBy) {
      sort[sortBy] = order === 'asc' ? 1 : -1;
    }

    const tasks = await Task.find(query).sort(sort);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving tasks.', error: error.message });
  }
});

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    res.json(task);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found.' });
    }
    res.status(500).json({ message: 'Server error retrieving task.', error: error.message });
  }
});

// @desc    Create a new task
// @route   POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    // Server-side validation
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ message: 'Title is required and must be at least 3 characters long.' });
    }

    const newTask = new Task({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error creating task.', error: error.message });
  }
});

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    // Check if task exists
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Apply updates
    if (title !== undefined) {
      if (title.trim().length < 3) {
        return res.status(400).json({ message: 'Title must be at least 3 characters long.' });
      }
      task.title = title;
    }
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : undefined;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found.' });
    }
    res.status(500).json({ message: 'Server error updating task.', error: error.message });
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    res.json({ message: 'Task deleted successfully.', id: req.params.id });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found.' });
    }
    res.status(500).json({ message: 'Server error deleting task.', error: error.message });
  }
});

export default router;
