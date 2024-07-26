
const express = require('express')
const router = express.Router();

const { CreateFarmtool  } = require('../controllers/FarmerTools.js')
const { GetAllFarmtools } = require('../controllers/FarmerTools.js')
const { DeleteFarmtool } = require('../controllers/FarmerTools.js')

router.post("/add" ,  CreateFarmtool)
router.get("/all", GetAllFarmtools)
router.delete("/:id", DeleteFarmtool)
module.exports = router