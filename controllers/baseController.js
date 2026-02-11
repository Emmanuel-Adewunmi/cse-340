const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav() 
    res.render("index", {title: "Home" , nav})
}

/* ****************************************
 * Intentional Error Function
 * *************************************** */
baseController.triggerError = function (req, res, next) {
  throw new Error("Oh no! The site has encountered a critical engine failure!")
}
module.exports = baseController