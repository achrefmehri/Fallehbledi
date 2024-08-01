const express = require("express")
const router = express.Router()
const SignIn = require('../controllers/Auth/FarmerSignIn')
const {Register} = require("../controllers/Auth/FarmerSignUp")
const {updateProfile} = require("../controllers/Farmer.js");
 router.put("/:id" , updateProfile)


router.post("/signup" , Register)
// router.get("/getall",getAllfarmer)
// router.get("/getone/:id",getOnefarmer)
router.post("/signin", SignIn)

module.exports = router