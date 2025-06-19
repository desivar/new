//Imports
const express = require("express");
const router = express.Router();
const pipecont = require("../controllers/jobs");

//GET all jobs (this is what the dashboard needs)
router.get("/", pipecont.getAllJobs);

//GET a single job by ID
router.get("/:id", pipecont.getJobById);

router.post("/", pipecont.createJob);
router.put("/:id", pipecont.updateJob);
router.delete("/:id", pipecont.deleteJob);

module.exports = router;