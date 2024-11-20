const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/seizure_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB: ', err));

// Define a schema for the patient data
const patientSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  seizureHistory: String,
  medications: String,
  symptoms: String
});

// Create a model for the patients collection
const Patient = mongoose.model('Patient', patientSchema);

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (like your .html files)
app.use(express.static(path.join(__dirname, 'public')));

// Handle form submission
app.post('/submit', (req, res) => {
  const { name, email, age, seizureHistory, medications, symptoms } = req.body;

  // Create a new patient document
  const newPatient = new Patient({
    name,
    email,
    age,
    seizureHistory,
    medications,
    symptoms
  });

  // Save to database
  newPatient.save()
    .then(() => {
      console.log('Patient data saved successfully!');
      res.redirect('/page2.html'); // Redirect to page2.html
    })
    .catch((err) => {
      console.log('Error saving patient data: ', err);
      res.status(500).send('Server error');
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
