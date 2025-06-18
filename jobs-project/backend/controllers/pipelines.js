
const mongodb = require("../db/database");
const ObjectId = require("mongodb").ObjectId;

const collection_name = "pipelines";

const getAllPipelines = async (req, res, next) => {
  try {
    const users = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .find()
      .toArray();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};


const getPipelineById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const pipeline = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .findOne({ _id: new ObjectId(id) });
    if (!pipeline) {
      return res.status(404).json({ message: "Pipeline not found" });
    }
    res.status(200).json(pipeline);
  } catch (error) {
    next(error);
  }
};
const createPipeline = async (req, res, next) => {
  try {
    const pipeline = {
      name: req.body.name,
      steps: req.body.steps
    };
    const result = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .insertOne(pipeline);
    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    next(error);
  }
};

const updatePipeline = async (req, res, next) => {
  const id = req.params.id;
  try {
    const pipeline = {
      name: req.body.name,
      steps: req.body.steps
    };
    const result = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .updateOne({ _id: new ObjectId(id) }, { $set: pipeline });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Pipeline not found" });
    }
    res.status(200).json({ message: "Pipeline updated" });
  } catch (error) {
    next(error);
  }
};

const deletePipeline = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Pipeline not found" });
    }
    res.status(200).json({ message: "Pipeline deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getAllPipelines, 
  getPipelineById, 
  createPipeline, 
  updatePipeline, 
  deletePipeline 
};