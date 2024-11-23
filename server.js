const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect('mongodb://localhost:27017/ngo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Schemas and Models

// Survey Schema
const surveySchema = new mongoose.Schema({
  section: { type: String, required: true },
  query: { type: String, required: true },
  answer: { type: String, required: true },
});
const Survey = mongoose.model('Survey', surveySchema, 'surveyinformations');

// Projects Schema
const projectsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});
const Project = mongoose.model('Projects', projectsSchema, 'projects');

// ContactUs Schema
const contactUsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Contact = mongoose.model('Contact', contactUsSchema, 'contactus');

// API Routes

// Fetch Surveys
app.get('/api/surveys', async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.status(200).json(surveys);
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({ message: 'Failed to fetch surveys', error: error.message });
  }
});

// Add New Survey
app.post('/api/surveys', async (req, res) => {
  const { section, query, answer } = req.body;

  if (!section || !query || !answer) {
    return res.status(400).json({ message: 'Section, query, and answer are required' });
  }

  try {
    const newSurvey = new Survey({ section, query, answer });
    await newSurvey.save();
    res.status(201).json({ message: 'Survey added successfully', survey: newSurvey });
  } catch (error) {
    console.error('Error adding survey:', error);
    res.status(500).json({ message: 'Failed to add survey', error: error.message });
  }
});

// Delete Survey
app.delete('/api/surveys/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSurvey = await Survey.findByIdAndDelete(id);
    if (!deletedSurvey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    res.status(200).json({ message: 'Survey deleted successfully' });
  } catch (error) {
    console.error('Error deleting survey:', error);
    res.status(500).json({ message: 'Failed to delete survey', error: error.message });
  }
});

// Fetch Projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
});

// Add New Project
app.post('/api/projects', async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    const newProject = new Project({ title, description });
    await newProject.save();
    res.status(201).json({ message: 'Project added successfully', project: newProject });
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ message: 'Failed to add project', error: error.message });
  }
});

// Delete Project
app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
});

// Fetch ContactUs Entries
app.get('/api/contactus', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching contact entries:', error);
    res.status(500).json({ message: 'Failed to fetch contact entries', error: error.message });
  }
});

// Create a New ContactUs Entry
app.post('/api/contactus', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: 'Contact message saved successfully', contact: newContact });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ message: 'Failed to save contact message', error: error.message });
  }
});

// Delete ContactUs Entry
app.delete('/api/contactus/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact entry not found' });
    }
    res.status(200).json({ message: 'Contact entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact entry:', error);
    res.status(500).json({ message: 'Failed to delete contact entry', error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});