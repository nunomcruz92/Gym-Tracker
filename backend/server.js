// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Conexão MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gym-tracker/api');

// Modelo de Exercício
const exerciseSchema = new mongoose.Schema({
  userId: String,
  machineName: String,
  weight: Number,
  reps: Number,
  sets: Number,
  date: { type: Date, default: Date.now },
  machineImage: String,
  machineNotes: String
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

// Modelo de Máquina
const machineSchema = new mongoose.Schema({
  name: String,
  image: String,
  notes: String
});

const Machine = mongoose.model('Machine', machineSchema);

// Rotas de Exercícios
app.get('/api/exercises', async (req, res) => {
  try {
    const exercises = await Exercise.find({ userId: req.query.userId });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/exercises', async (req, res) => {
  try {
    const exercise = new Exercise(req.body);
    await exercise.save();
    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/exercises/:id', async (req, res) => {
  try {
    await Exercise.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas de Máquinas
app.get('/api/machines', async (req, res) => {
  try {
    const machines = await Machine.find();
    res.json(machines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/machines', async (req, res) => {
  try {
    const machine = new Machine(req.body);
    await machine.save();
    res.status(201).json(machine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));