//Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invCont = require("../controllers/invController")
const invValidate = require('../utilities/inventory-validation')
//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route for specific vehicle detail
router.get("/detail/:invId", utilities.handleErrors(invCont.buildByItemId))

// Route to inventory management
router.get("/", utilities.handleErrors(invCont.buildManagement))

// Route to deliver add classification view
router.get("/add-classification", utilities.handleErrors(invCont.buildAddClassification))

// Route to process add classification
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkRules,
  utilities.handleErrors(invCont.addClassification)
)

router.get("/add-inventory", utilities.handleErrors(invCont.buildAddInventory))
// Route to process add inventory
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invCont.addInventory)
)


module.exports = router;