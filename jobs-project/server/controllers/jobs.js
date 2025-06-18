
const mongodb = require("../db/database");
const ObjectId = require("mongodb").ObjectId;

const collection_name = "jobs";

const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .find()
      .toArray();
    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};

const getJobById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const job = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .findOne({ _id: new ObjectId(id) });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    const job = {
      customer_id: new ObjectId(req.body.customer_id),
      pipeline_id: new ObjectId(req.body.pipeline_id),
      pipeline_step: req.body.pipeline_step,
      job_name: req.body.job_name,
      comments: req.body.comments,
      address: req.body.address
    };
    const result = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .insertOne(job);
    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  const id = req.params.id;
  try {
    const job = {
      customer_id: new ObjectId(req.body.customer_id),
      pipeline_id: new ObjectId(req.body.pipeline_id),
      pipeline_step: req.body.pipeline_step,
      job_name: req.body.job_name,
      comments: req.body.comments,
      address: req.body.address
    };
    const result = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .updateOne({ _id: new ObjectId(id) }, { $set: job });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job updated" });
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getAllJobs, 
  getJobById, 
  createJob, 
  updateJob, 
  deleteJob 
};