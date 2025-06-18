//Imports
const express = require("express");
const router = express.Router();
const pipecont = require("../controllers/pipelines");

//GET all pipelines
router.get("/", pipecont.getAllPipelines);

//GET a single pipeline by ID
router.get("/:id", pipecont.getPipelineById);
router.post("/", pipecont.createPipeline);
router.put("/:id", pipecont.updatePipeline);    
router.delete("/:id", pipecont.deletePipeline);
module.exports = router;