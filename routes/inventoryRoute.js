//Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invCont = require("../controllers/invController")
const invValidate = require('../utilities/inventory-validation')
const regValidate = require("../utilities/inventory-validation")
//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route for specific vehicle detail
router.get("/detail/:invId", utilities.handleErrors(invCont.buildByItemId))

// Route to inventory management
router.get("/", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invCont.buildManagement))

// Route to deliver add classification view
router.get("/add-classification", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invCont.buildAddClassification))

// Route to process add classification
router.post(
  "/add-classification",
  utilities.checkLogin, utilities.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkRules,
  utilities.handleErrors(invCont.addClassification)
)

router.get("/add-inventory", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invCont.buildAddInventory))
// Route to process add inventory
router.post(
  "/add-inventory",
  utilities.checkLogin, 
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invCont.addInventory)
)

//  Route  for AJAX requests
router.get("/getInventory/:classification_id", 
  utilities.checkLogin, 
  utilities.checkAccountType,
  utilities.handleErrors(invCont.getInventoryJSON)
)

// Route to build the edit inventory view
router.get(
  "/edit/:inv_id", 
  utilities.checkLogin, 
  utilities.checkAccountType,
  utilities.handleErrors(invCont.editInventoryView)
)

// Route to handle the update request
router.post(
  "/update/", 
  utilities.checkLogin, 
  utilities.checkAccountType,
  regValidate.inventoryRules(), 
  regValidate.checkUpdateData,    
  utilities.handleErrors(invCont.updateInventory)
)

// Route to build the delete confirmation view
router.get(
  "/delete/:inv_id",
  utilities.checkLogin, 
  utilities.checkAccountType,
  utilities.handleErrors(invCont.deleteView)
)

// Route to handle the delete process
router.post(
  "/delete", 
  utilities.checkLogin, 
  utilities.checkAccountType,
  utilities.handleErrors(invCont.deleteItem)
)


module.exports = router;