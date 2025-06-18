const express = require("express");
const router = express.Router();
const jobsController = require("../controllers/jobs"); // Corrected variable name and matches the import

// Apply protection middleware to all job routes if needed
// router.use(protect); // Uncomment this line if all jobs routes require authentication

// GET all jobs
router.get("/", jobsController.getAllJobs);

// GET a single job by ID
router.get("/:id", jobsController.getJobById);

// POST new job
router.post("/", jobsController.createJob);

// PUT (update) existing job by ID
router.put("/:id", jobsController.updateJob);

// DELETE job by ID
router.delete("/:id", jobsController.deleteJob);

module.exports = router;