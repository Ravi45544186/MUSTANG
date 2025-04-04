require('dotenv').config();  // Make sure dotenv is at the top

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Todo = require('./todoModel');  // Import the Todo model

const app = express();
const port = process.env.PORT || 5000;  // Use environment variable for PORT

// MongoDB connection URI from environment variable
const mongoURI = process.env.MONGODB_URI;

// Check if the URI is correctly loaded
console.log('Mongo URI:', mongoURI);  // This should log the actual MongoDB URI
console.log('Test Variable:', process.env.TEST_VARIABLE);  // Ensure TEST_VARIABLE is set in .env for testing

// Exit if Mongo URI is not found
if (!mongoURI) {
  console.error('Mongo URI is missing in the .env file');
  process.exit(1);  // Stop the server if the URI is missing
}

// MongoDB Connection
mongoose.connect(mongoURI) 

.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('MongoDB connection error:', err));
  

// Middleware
app.use(cors());
app.use(express.json());  // To parse JSON bodies

// Routes

// Home route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Get all to-do items from MongoDB
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();  // Fetch all todos from MongoDB
    res.json(todos);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ message: 'Error fetching todos', error: err });
  }
});

// Get a specific to-do item by ID
app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).send('Todo not found');
    }
    res.json(todo);
  } catch (err) {
    console.error('Error fetching todo by ID:', err);
    res.status(500).json({ message: 'Error fetching todo', error: err });
  }
});

// Create a new to-do item
app.post('/todos', async (req, res) => {
  const { text, completed } = req.body;

  const newTodo = new Todo({
    text,
    completed,
  });

  try {
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    console.error('Error adding todo:', err);
    res.status(500).json({ message: 'Error adding todo', error: err });
  }
});

// Update a to-do item (toggle completion status)
app.put('/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          text: req.body.text,
          completed: req.body.completed,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.json(updatedTodo);
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(500).json({ message: 'Error updating todo', error: err });
  }
});

// Delete a to-do item
app.delete('/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json({ message: 'Todo deleted' });
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ message: 'Error deleting todo', error: err });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
