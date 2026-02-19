const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const wishlistModel = require("../models/wishlist-model")
require("dotenv").config()

/* ****************************************
* Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors:null,
  })
}


/* ****************************************
* Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
* Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { 
    account_firstname, 
    account_lastname, 
    account_email, 
    account_password 
  } = req.body
  
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
    return // Ensure the function stops here on error
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 * Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }

  try {
    // Compare provided password with hashed password in DB
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password // Security: Remove password before signing JWT
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 * Deliver Account Management View
 * ************************************ */
async function buildManagement(req, res) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
 * Deliver Account Update View
 * *************************************** */
async function editAccountView(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  const loggedInId = res.locals.accountData.account_id
  if (account_id !== loggedInId) {
    req.flash("notice", "Access denied. You may only edit your own account.")
    return res.redirect("/account/")
  }
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)
  res.render("account/update-account", {
    title: "Edit Account",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id,
  })
}

/* ****************************************
* Process Account Update
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  
  // 1. Extract the data from the form body
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id
  } = req.body

  // 2. SECURITY PATCH: Compare the ID from the form to the ID in the JWT
  // We use res.locals.accountData which was set by our checkLogin/JWT middleware
  const loggedInId = res.locals.accountData.account_id

  if (parseInt(account_id) !== parseInt(loggedInId)) {
    req.flash("notice", "Security Violation: You cannot update an account that does not belong to you.")
    return res.redirect("/account/")
  }

  // 3. Proceed with the update if security check passes
  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updateResult) {
    // Re-fetch the full account data to ensure we have everything for the token
    const accountData = await accountModel.getAccountById(account_id)
    
    // Delete the password before storing in token
    delete accountData.account_password
    
    // Generate new token with updated data
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

    req.flash("notice", `Congratulations, ${account_firstname}, your information has been updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update-account", {
      title: "Edit Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    })
  }
}
/* ****************************************
* Process Password Update
* *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body
  const loggedInId = res.locals.accountData.account_id

  if (parseInt(account_id) !== parseInt(loggedInId)) {
    req.flash("notice", "Security Violation: You cannot change someone else's password.")
    return res.redirect("/account/")
  }

  // Hash the new password before sending to model
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password update.')
    res.status(500).render("account/update-account", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
    })
  }

  const updateResult = await accountModel.updatePassword(hashedPassword, account_id)

  if (updateResult) {
    req.flash("notice", "Password updated successfully.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/update-account", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
    })
  }
}

/* ****************************************
* Process Add to Wishlist
* *************************************** */
async function addToWishlist(req, res) {
  const { inv_id, account_id } = req.body
  const result = await wishlistModel.addWishlistItem(account_id, inv_id)

  if (result) {
    req.flash("notice", "Vehicle added to your wishlist!")
    res.redirect("/account/wishlist")
  } else {
    req.flash("notice", "Sorry, there was an error adding that item.")
    res.redirect("/inv/detail/" + inv_id)
  }
}

/* ****************************************
* Deliver Wishlist View
* *************************************** */
async function buildWishlist(req, res) {
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const wishlistData = await wishlistModel.getWishlistByAccountId(account_id)
  
  res.render("account/wishlist", {
    title: "My Wishlist",
    nav,
    errors: null,
    wishlistData,
  })
}

/* ****************************************
* Process Remove from Wishlist
* *************************************** */
async function removeFromWishlist(req, res) {
  const wishlist_id = parseInt(req.body.wishlist_id)
  const result = await wishlistModel.removeWishlistItem(wishlist_id)

  if (result) {
    req.flash("notice", "Vehicle removed from your wishlist.")
    res.redirect("/account/wishlist")
  } else {
    req.flash("notice", "Sorry, the item could not be removed.")
    res.redirect("/account/wishlist")
  }
}


/* ****************************************
* Process logout
* *************************************** */
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  res.redirect("/")
}
//  export function
module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, editAccountView, updateAccount, updatePassword, buildWishlist, addToWishlist, removeFromWishlist, accountLogout}


