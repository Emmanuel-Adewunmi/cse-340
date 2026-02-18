//Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate =  require('../utilities/account-validation')

//Route to GET the Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegister))


// Route to process the registration data
router.post(
  "/register", utilities.handleErrors(accountController.registerAccount))

// Process registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Route for account management, protected by checkLogin
router.get(
  "/", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildManagement)
)

// Route Deliver Account Update View
router.get("/update/:account_id", utilities.handleErrors(accountController.editAccountView))

// Route Process Account Update
router.post(
  "/update",
  regValidate.updateAccountRules(), 
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Route Process Password Update
router.post(
  "/password",
  regValidate.passwordRules(), 
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

router.get("/logout", utilities.handleErrors(accountController.accountLogout))
module.exports = router;