const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

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


// Add a new to-do item
app.post('/todos', (req, res) => {
  const newTodo = {
    id: todos.length + 1,
    text: req.body.text,
    Complete: req.body.completed || false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
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

// Delete a to-do item
app.delete('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  todos = todos.filter((todo) => todo.id !== todoId);
  res.status(204).send();
});

// Start the server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
