const pool = require("../database/")

/* *****************************
* Add item to wishlist
* ***************************** */
async function addWishlistItem(account_id, inv_id) {
  try {
    const sql = "INSERT INTO wishlist (account_id, inv_id) VALUES ($1, $2) RETURNING *"
    return await pool.query(sql, [account_id, inv_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Get wishlist items by account_id
* ***************************** */
async function getWishlistByAccountId(account_id) {
  try {
    const sql = `SELECT * FROM public.wishlist AS w 
                 JOIN public.inventory AS i ON w.inv_id = i.inv_id 
                 WHERE w.account_id = $1`
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Remove item from wishlist
* ***************************** */
async function removeWishlistItem(wishlist_id) {
  try {
    const sql = "DELETE FROM wishlist WHERE wishlist_id = $1 RETURNING *"
    const result = await pool.query(sql, [wishlist_id])
    return result.rowCount // Returns 1 if something was deleted
  } catch (error) {
    return error.message
  }
}

//  module exports
module.exports = { addWishlistItem, getWishlistByAccountId, removeWishlistItem }