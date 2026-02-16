const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isAlpha()
      .withMessage("Please provide a valid classification name.")
  ]
}

/* ******************************
 * Check data and return errors or continue to insertion
 * ***************************** */
validate.checkRules = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
    })
    return
  }
  next()
}

validate.inventoryRules = () => {
  return [
    body("classification_id").notEmpty().withMessage("Please select a classification."),
    body("inv_make").trim().isLength({ min: 3 }).withMessage("Make must be at least 3 characters."),
    body("inv_model").trim().isLength({ min: 3 }).withMessage("Model must be at least 3 characters."),
    body("inv_year").isInt({ min: 1900, max: 2099 }).withMessage("Enter a valid year."),
    body("inv_description").notEmpty().withMessage("Description is required."),
    body("inv_price").isDecimal().withMessage("Price must be a valid number."),
    body("inv_miles").isInt().withMessage("Miles must be a whole number."),
    body("inv_color").trim().notEmpty().withMessage("Color is required.")
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Vehicle",
      nav,
      classificationSelect,
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    })
    return
  }
  next()
}
module.exports = validate