//Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invCont = require("../controllers/invController")

//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route for specific vehicle detail
router.get("/detail/:invId", utilities.handleErrors(invCont.buildByItemId))

module.exports = router;