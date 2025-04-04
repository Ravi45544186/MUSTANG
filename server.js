const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const Todo = require('./todoModel'); // Import the Todo model


require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection URI from environment variable
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log(err));


// Middleware
app.use(cors());
app.use(express.json());  // To parse JSON bodies

// In-memory storage for to-do items (to simulate a database)
let todos = [
  { id: 1, text: 'Learn React', isComplete: false },
  { id: 2, text: 'Build a to-do app', isComplete: false }
];

app.get('/', (req, res) => {
  res.send('Backend is running');
});


// Get all to-do items
app.get('/todos', (req, res) => {
  res.json(todos);
});

app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).send('Todo not found');
  res.json(todo);
});


app.post('/todos', async (req, res) => {
  const { text, completed } = req.body;

  // Create a new Todo document
  const newTodo = new Todo({
    text,
    completed,
  });

  try {
    // Save the new todo to MongoDB
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).json({ message: 'Error adding todo', error: err });
  }
});

// Update a to-do item (toggle completion status)
app.put('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const todo = todos.find((todo) => todo.id === todoId);
  if (!todo) return res.status(404).json({ message: 'Todo not found' });

  todo.task=req.body.task;
  todo.isComplete = !todo.isComplete;
  res.json(todo);
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the todo by its ID
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting todo', error: err });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
