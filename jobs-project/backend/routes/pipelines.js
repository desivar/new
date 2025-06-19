const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Simple Pipeline Schema (flexible to work with any data structure)
const pipelineSchema = new mongoose.Schema({}, { 
  strict: false, 
  collection: 'pipelines',
  timestamps: true // Adds createdAt and updatedAt automatically
});

const Pipeline = mongoose.model('Pipeline', pipelineSchema);

// GET /api/pipelines - Get all pipelines
router.get('/', async (req, res) => {
  try {
    const pipelines = await Pipeline.find({});
    res.status(200).json(pipelines);
  } catch (error) {
    console.error('Error fetching pipelines:', error);
    res.status(500).json({ 
      message: 'Failed to fetch pipelines',
      error: error.message 
    });
  }
});

// GET /api/pipelines/:id - Get a specific pipeline by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid pipeline ID' });
    }

    const pipeline = await Pipeline.findById(id);
    
    if (!pipeline) {
      return res.status(404).json({ message: 'Pipeline not found' });
    }

    res.status(200).json(pipeline);
  } catch (error) {
    console.error('Error fetching pipeline:', error);
    res.status(500).json({ 
      message: 'Failed to fetch pipeline',
      error: error.message 
    });
  }
});

// POST /api/pipelines - Create a new pipeline
router.post('/', async (req, res) => {
  try {
    const pipelineData = req.body;
    
    if (!pipelineData || Object.keys(pipelineData).length === 0) {
      return res.status(400).json({ message: 'Pipeline data is required' });
    }

    const pipeline = new Pipeline(pipelineData);
    const savedPipeline = await pipeline.save();
    
    res.status(201).json(savedPipeline);
  } catch (error) {
    console.error('Error creating pipeline:', error);
    res.status(500).json({ 
      message: 'Failed to create pipeline',
      error: error.message 
    });
  }
});

// PUT /api/pipelines/:id - Update a pipeline
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid pipeline ID' });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'Update data is required' });
    }

    const updatedPipeline = await Pipeline.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!updatedPipeline) {
      return res.status(404).json({ message: 'Pipeline not found' });
    }

    res.status(200).json(updatedPipeline);
  } catch (error) {
    console.error('Error updating pipeline:', error);
    res.status(500).json({ 
      message: 'Failed to update pipeline',
      error: error.message 
    });
  }
});

// PATCH /api/pipelines/:id - Partially update a pipeline
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid pipeline ID' });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'Update data is required' });
    }

    const updatedPipeline = await Pipeline.findByIdAndUpdate(
      id, 
      { $set: updateData }, 
      { new: true, runValidators: true }
    );
    
    if (!updatedPipeline) {
      return res.status(404).json({ message: 'Pipeline not found' });
    }

    res.status(200).json(updatedPipeline);
  } catch (error) {
    console.error('Error updating pipeline:', error);
    res.status(500).json({ 
      message: 'Failed to update pipeline',
      error: error.message 
    });
  }
});

// DELETE /api/pipelines/:id - Delete a pipeline
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid pipeline ID' });
    }

    const deletedPipeline = await Pipeline.findByIdAndDelete(id);
    
    if (!deletedPipeline) {
      return res.status(404).json({ message: 'Pipeline not found' });
    }

    res.status(200).json({ 
      message: 'Pipeline deleted successfully',
      deletedPipeline 
    });
  } catch (error) {
    console.error('Error deleting pipeline:', error);
    res.status(500).json({ 
      message: 'Failed to delete pipeline',
      error: error.message 
    });
  }
});

// GET /api/pipelines/search - Search pipelines with query parameters
router.get('/search', async (req, res) => {
  try {
    const { query, limit = 10, skip = 0 } = req.query;
    
    let searchQuery = {};
    
    if (query) {
      // Basic text search - you can customize this based on your schema
      searchQuery = {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { type: { $regex: query, $options: 'i' } }
        ]
      };
    }

    const pipelines = await Pipeline.find(searchQuery)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });

    const total = await Pipeline.countDocuments(searchQuery);

    res.status(200).json({
      pipelines,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: (parseInt(skip) + parseInt(limit)) < total
      }
    });
  } catch (error) {
    console.error('Error searching pipelines:', error);
    res.status(500).json({ 
      message: 'Failed to search pipelines',
      error: error.message 
    });
  }
});

module.exports = router;