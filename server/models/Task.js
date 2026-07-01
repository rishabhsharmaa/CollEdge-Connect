import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required.'],
      trim: true,
      minlength: [3, 'Task title must be at least 3 characters long.'],
      maxlength: [100, 'Task title cannot exceed 100 characters.']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters.']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'completed'],
        message: '{VALUE} is not a valid task status.'
      },
      default: 'pending'
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid task priority.'
      },
      default: 'medium'
    },
    dueDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
