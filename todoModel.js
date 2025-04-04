const mongoose = require('mongoose');

// Define the schema for Todo
const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// Create a model from the schema
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
