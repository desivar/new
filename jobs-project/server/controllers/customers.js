
const mongodb = require("../db/database");
const ObjectId = require("mongodb").ObjectId;

const collection_name = "customers";

const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .find()
      .toArray();
    res.status(200).json(customers);
  } catch (error) {
    next(error);
  }
};

const getCustomerById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const customer = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .findOne({ _id: new ObjectId(id) });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

const createCustomer = async (req, res, next) => {
  try {
    const customer = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      notes: req.body.notes
    };
    const result = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .insertOne(customer);
    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  const id = req.params.id;
  try {
    const customer = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      notes: req.body.notes
    };
    const result = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .updateOne({ _id: new ObjectId(id) }, { $set: customer });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer updated" });
  } catch (error) {
    next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await mongodb
      .getDatabase()
      .db()
      .collection(collection_name)
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getAllCustomers, 
  getCustomerById, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer 
};