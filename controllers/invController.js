const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/*******************************************
 * Build inventory by classification view
 *******************************************/
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    console.log("Classification ID being sent to model:", classification_id)
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + "vehicles",
        nav,
        grid,
    })
}

/* ***************************
 * Deliver vehicle detail view
 * ************************** */
invCont.buildByItemId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryById(inv_id)
  
  if (!data) {
    const err = new Error("Vehicle not found")
    err.status = 404
    return next(err)
  }

  const grid = await utilities.buildDetailGrid(data)
  let nav = await utilities.getNav()
  res.render("inventory/detail", {
    title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
    nav,
    grid,
  })
}

module.exports = invCont