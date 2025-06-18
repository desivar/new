//Imports
const express = require("express");
const router = express.Router();
const customersController = require("../controllers/customers"); // Corrected variable name and matches the import

//GET all customers
router.get("/", customersController.getAllCustomers);

//GET a single customer by ID
router.get("/:id", customersController.getCustomerById);

//POST new customer
router.post("/", customersController.createCustomer);

//PUT (update) existing customer by ID
router.put("/:id", customersController.updateCustomer);

//DELETE customer by ID
router.delete("/:id", customersController.deleteCustomer);

module.exports = router;