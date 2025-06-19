// routes/pipelines.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Simple Pipeline Schema (flexible to work with any data structure)
const pipelineSchema = new mongoose.Schema({}, { strict: false, collection: 'pipelines' });
const Pipeline = mongoose.model('Pipeline', pipelineSchema);

// GET /api/pipelines - Get all pipelines
router.get('/', async (req, res) => {
  try {
    const pipelines = await Pipeline.find({});
    res.status(200).json(pipelines);
  } catch (error) {
    console.error('Error fetching pipelines:', error);
    res.status(500).json({ 
      message: 'Faile