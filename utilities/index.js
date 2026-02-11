const invModel = require("../models/inventory-model")
const Util = {}

/* *****************************
 * Constructs the nav HTML unordered list 
 *******************************/
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page"> Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list += 
        '<a href="/inv/type/' + 
        row.classification_id + 
        '" title="See our inventory of ' + 
        row.classification_name + 
        'vehicles">' + 
        row.classification_name + 
        "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **********************************
 * Build the classification view HTML
 ************************************/
Util.buildClassificationGrid = async function(data) {
    let grid
    if(data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
            + '" title="View' + vehicle.inv_make + ' ' + vehicle.inv_model
            + 'details"><img src="' + vehicle.inv_thumbnail
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
            +' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv +'" title="View '
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' </a>'
            grid += '<h2>'
            grid += '<span>$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>' 
    }   else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found. </p>'
    }   
    return grid
}

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildDetailGrid = async function(data) {
  let display = '<div id="detail-wrapper">'
  // Use the full-size image (inv_image), not thumbnail
  display += `<img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model} on CSE Motors">`
  display += '<section id="detail-info">'
  display += `<h2>${data.inv_make} ${data.inv_model} Details</h2>`
  
  // Format Price: $25,000 (Criterion 3)
  const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.inv_price)
  display += `<p class="price"><strong>Price:</strong> ${price}</p>`
  
  display += `<p><strong>Description:</strong> ${data.inv_description}</p>`
  display += `<p><strong>Color:</strong> ${data.inv_color}</p>`
  
  // Format Mileage: 40,000 (Criterion 9)
  const mileage = new Intl.NumberFormat('en-US').format(data.inv_miles)
  display += `<p><strong>Mileage:</strong> ${mileage} miles</p>`
  
  display += '</section></div>'
  return display
}

/**********************
 * Middleware For Handling Errors
 * Wrap other functions in thiss for
 * General Error Handling
************************************ */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util